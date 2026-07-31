#!/usr/bin/env python3
"""
Drive `gh auth login --web` through OAuth Device Flow using pexpect.
Properly handles terminal capability queries and Y/n prompts.
Streams output to stdout. Never prints the OAuth token.
"""
import os
import sys
import time
import re
import pexpect

GH = os.path.expanduser("~/bin/gh")
CMD = f"{GH} auth login --hostname github.com --git-protocol https --web"

os.environ.setdefault("LINES", "50")
os.environ.setdefault("COLUMNS", "120")
os.environ.setdefault("TERM", "xterm-256color")
# Prevent gh from trying to spawn a browser (which fails in headless env and
# can cause its TUI to bail out). gh will print the URL for the user to open.
os.environ["BROWSER"] = "/bin/true"
os.environ["DISPLAY"] = ""  # no X display

def strip_ansi(s):
    s = re.sub(r"\x1b\[[0-9;?]*[a-zA-Z]", "", s)
    s = re.sub(r"\x1b[()][AB012]", "", s)
    s = re.sub(r"\x1b[=>78]", "", s)
    s = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", s)
    return s

def main():
    child = pexpect.spawn(
        CMD,
        encoding="utf-8",
        timeout=600,
        dimensions=(50, 120),
        codec_errors="replace",
    )
    child.logfile_read = sys.stdout

    start = time.time()
    answered = 0
    saw_code = False

    # We expect any of these patterns; the rest goes into child.before
    PATTERNS = [
        "Authenticate Git with your GitHub credentials?",       # 0
        "one-time code",                                          # 1
        "login/device",                                           # 2
        "Logged in as",                                           # 3
        "Authentication complete",                                # 4
        "error",                                                  # 5
        "Error",                                                  # 6
        pexpect.TIMEOUT,                                          # 7
        pexpect.EOF,                                              # 8
    ]

    while True:
        try:
            idx = child.expect(PATTERNS, timeout=5)
        except pexpect.exceptions.ExceptionPexpect as e:
            print(f"\n[DRIVER] pexpect error: {e}", flush=True)
            break

        # Check child.before for terminal queries we need to respond to
        before = child.before or ""
        if "\x1b[6n" in before or "\x1b[?6n" in before:
            child.send("\x1b[1;1R")
        if "\x1b[18t" in before or "\x1b[?18t" in before:
            child.send("\x1b[8;50;120t")
        if "\x1b[c" in before or "\x1b[0c" in before:
            child.send("\x1b[?6c")

        if idx == 0:
            # Y/n prompt
            print(f"\n[DRIVER] Y/n prompt detected — sending Y (count={answered+1})", flush=True)
            child.sendline("Y")
            answered += 1
            time.sleep(0.5)
        elif idx in (1, 2):
            if not saw_code:
                saw_code = True
                print("\n[DRIVER] Device code displayed. Waiting for browser auth...", flush=True)
                # gh prints "Press Enter to open <url> in your browser..." — send Enter
                # so gh proceeds to polling mode. BROWSER=/bin/true means open is a no-op.
                time.sleep(0.5)
                child.sendline("")  # press Enter
                print("[DRIVER] Sent Enter to advance past 'Press Enter to open browser' prompt.", flush=True)
        elif idx in (3, 4):
            print("\n[DRIVER] Auth success detected.", flush=True)
            try:
                child.expect(pexpect.EOF, timeout=20)
            except pexpect.exceptions.ExceptionPexpect:
                pass
            break
        elif idx in (5, 6):
            print(f"\n[DRIVER] Error detected: {child.before}", flush=True)
            # might still be a non-fatal error; keep going briefly
            try:
                child.expect(pexpect.EOF, timeout=10)
            except pexpect.exceptions.ExceptionPexpect:
                pass
            break
        elif idx == 7:  # TIMEOUT
            if not child.isalive():
                print(f"\n[DRIVER] gh exited. exitstatus={child.exitstatus}", flush=True)
                break
            elapsed = int(time.time() - start)
            # Periodically print status (only if we haven't seen code yet or it's been a while)
            if elapsed % 30 == 0:
                print(f"\n[DRIVER] Still waiting... ({elapsed}s elapsed, answered={answered}, saw_code={saw_code})", flush=True)
            if elapsed > 600:
                print("\n[DRIVER] Giving up after 600s.", flush=True)
                child.terminate(force=True)
                break
        elif idx == 8:  # EOF
            print(f"\n[DRIVER] gh exited (EOF). exitstatus={child.exitstatus}", flush=True)
            break

    try:
        child.close()
    except Exception:
        pass

if __name__ == "__main__":
    main()
