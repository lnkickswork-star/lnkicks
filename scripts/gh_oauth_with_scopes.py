#!/usr/bin/env python3
"""
Drive `gh auth login --web --scopes repo,read:org,gist,workflow` via pexpect.
The explicit --scopes flag forces GitHub to re-prompt for scope grants,
even if the OAuth App was previously authorized with different scopes.

Two-phase design:
  phase1: spawn gh, answer prompts, capture device code, save state, exit
  phase2: gh keeps running in foreground — it polls until token is stored
"""
import argparse
import json
import os
import re
import sys
import time
import pexpect
from pathlib import Path

GH = os.path.expanduser("~/bin/gh")
STATE_FILE = Path("~/.config/gh-device-flow-state.json").expanduser()

# Explicit scopes — these force a fresh scope grant prompt
SCOPES = "repo,read:org,gist,workflow"
CMD = f"{GH} auth login --hostname github.com --git-protocol https --scopes {SCOPES} --web"

os.environ["BROWSER"] = "/bin/true"
os.environ["DISPLAY"] = ""
os.environ.setdefault("LINES", "50")
os.environ.setdefault("COLUMNS", "120")
os.environ.setdefault("TERM", "xterm-256color")


def strip_ansi(s):
    s = re.sub(r"\x1b\[[0-9;?]*[a-zA-Z]", "", s)
    s = re.sub(r"\x1b[()][AB012]", "", s)
    s = re.sub(r"\x1b[=>78]", "", s)
    s = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", s)
    return s


def phase1():
    """Spawn gh, answer prompts, capture device code, save state, then leave
    gh running in background to poll. Exit immediately after saving state.
    """
    print(f"[DRIVER] Spawning: {CMD}", flush=True)
    child = pexpect.spawn(CMD, encoding="utf-8", timeout=600,
                          dimensions=(50, 120), codec_errors="replace")
    child.logfile_read = sys.stdout

    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    state = {"gh_pid": child.pid, "scopes": SCOPES, "started_at": int(time.time())}

    saw_code = False
    answered = 0
    start = time.time()

    PATTERNS = [
        "Authenticate Git with your GitHub credentials?",  # 0
        "one-time code",                                    # 1
        "login/device",                                     # 2
        "Press Enter to open",                              # 3
        "Logged in as",                                     # 4
        "Authentication complete",                          # 5
        "error",                                            # 6
        pexpect.TIMEOUT,                                    # 7
        pexpect.EOF,                                        # 8
    ]

    while time.time() - start < 60:  # phase1: 60s to get device code
        try:
            idx = child.expect(PATTERNS, timeout=5)
        except pexpect.exceptions.ExceptionPexpect:
            break

        # Respond to terminal queries in child.before
        before = child.before or ""
        if "\x1b[6n" in before or "\x1b[?6n" in before:
            child.send("\x1b[1;1R")
        if "\x1b[18t" in before or "\x1b[?18t" in before:
            child.send("\x1b[8;50;120t")
        if "\x1b[c" in before:
            child.send("\x1b[?6c")

        if idx == 0:
            answered += 1
            print(f"\n[DRIVER] Y/n prompt #{answered} — sending Y", flush=True)
            child.sendline("Y")
            time.sleep(0.5)
        elif idx in (1, 2):
            if not saw_code:
                # Extract the actual code from the output
                stripped = strip_ansi(before + (child.after or ""))
                m = re.search(r"one-time code:\s*([A-Z0-9]{4}-[A-Z0-9]{4})", stripped)
                user_code = m.group(1) if m else "UNKNOWN"
                state["user_code"] = user_code
                state["verification_uri"] = "https://github.com/login/device"
                STATE_FILE.write_text(json.dumps(state, indent=2))
                STATE_FILE.chmod(0o600)
                saw_code = True
                print(f"\n[DRIVER] Device code captured: {user_code}", flush=True)
                print("[DRIVER] State saved. Leaving gh running to poll for token...", flush=True)
                print(f"[DRIVER] gh PID: {child.pid}", flush=True)
                # Detach: don't wait for gh to finish; let it poll
                child.close(force=False)
                print(f"AUTH_CODE={user_code}", flush=True)
                print(f"GH_PID={child.pid}", flush=True)
                return
        elif idx == 3:
            # "Press Enter to open <url> in your browser..."
            child.sendline("")
            print("\n[DRIVER] Sent Enter to advance past browser-open prompt", flush=True)
        elif idx in (4, 5):
            print("\n[DRIVER] Auth success — but we expected to capture code first?", flush=True)
            break
        elif idx == 6:
            print(f"\n[DRIVER] Error: {child.before}", flush=True)
            break
        elif idx == 7:  # TIMEOUT
            if not child.isalive():
                print(f"\n[DRIVER] gh exited before code was captured", flush=True)
                break
        elif idx == 8:  # EOF
            print(f"\n[DRIVER] gh exited (EOF)", flush=True)
            break

    # If we got here, we didn't capture a code
    print("\n[DRIVER] Phase 1 failed to capture device code in 60s", flush=True)
    try:
        child.close(force=True)
    except Exception:
        pass
    sys.exit(1)


def phase2(max_wait):
    """Poll gh auth status until authenticated or timeout."""
    print(f"[DRIVER] Phase 2: poll gh auth status (max {max_wait}s)", flush=True)
    deadline = time.time() + max_wait
    attempts = 0
    while time.time() < deadline:
        attempts += 1
        # Check if gh is logged in
        rc = os.system(f"{GH} auth status > /dev/null 2>&1")
        if rc == 0:
            print(f"[DRIVER] gh reports logged in! (attempt {attempts})", flush=True)
            # Get login
            login = os.popen(f"{GH} api user --jq .login 2>/dev/null").read().strip()
            print(f"[DRIVER] Authenticated as: {login}", flush=True)
            # Get scopes
            scopes = os.popen(f"{GH} api user -i 2>/dev/null | grep -i 'x-oauth-scopes:'").read().strip()
            print(f"[DRIVER] {scopes}", flush=True)
            print(f"AUTHENTICATED_LOGIN={login}", flush=True)
            return
        # Kill any leftover gh processes that might be polling
        if attempts == 1:
            print(f"[DRIVER] Not yet logged in. Waiting for browser authorization...", flush=True)
        time.sleep(5)

    print(f"[DRIVER] Phase 2 timeout after {max_wait}s", flush=True)
    sys.exit(10)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("phase", choices=["phase1", "phase2"])
    parser.add_argument("--max-wait", type=int, default=120)
    args = parser.parse_args()
    if args.phase == "phase1":
        phase1()
    else:
        phase2(args.max_wait)


if __name__ == "__main__":
    main()
