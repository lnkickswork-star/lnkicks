#!/usr/bin/env python3
"""
Drive `gh auth refresh --scopes repo` via pexpect.
This uses OAuth incremental authorization to add scopes to the existing token.
Should force GitHub to prompt the user to grant the new scope.
"""
import os
import re
import sys
import time
import pexpect

GH = os.path.expanduser("~/bin/gh")
CMD = f"{GH} auth refresh --hostname github.com --scopes repo"

os.environ["BROWSER"] = "/bin/true"
os.environ["DISPLAY"] = ""
os.environ.setdefault("LINES", "50")
os.environ.setdefault("COLUMNS", "120")
os.environ.setdefault("TERM", "xterm-256color")

def main():
    print(f"[DRIVER] Spawning: {CMD}", flush=True)
    child = pexpect.spawn(CMD, encoding="utf-8", timeout=600,
                          dimensions=(50, 120), codec_errors="replace")
    child.logfile_read = sys.stdout

    PATTERNS = [
        r"Authenticate Git with your GitHub credentials\?.*?\(Y/n\)",  # 0
        r"one-time code",                                               # 1
        r"login/device",                                                # 2
        r"Press Enter to open",                                         # 3
        r"Logged in as",                                                # 4
        r"Authentication complete",                                     # 5
        r"error",                                                       # 6
        r"Error",                                                       # 7
        r"already logged in",                                           # 8
        r"device code expired",                                         # 9
        pexpect.TIMEOUT,                                                # 10
        pexpect.EOF,                                                    # 11
    ]

    start = time.time()
    answered = 0
    saw_code = False
    code_pattern = re.compile(r"one-time code:\s*([A-Z0-9]{4}-[A-Z0-9]{4})")

    while True:
        try:
            idx = child.expect(PATTERNS, timeout=5)
        except pexpect.exceptions.ExceptionPexpect as e:
            print(f"\n[DRIVER] pexpect error: {e}", flush=True)
            break

        before = child.before or ""
        # Respond to terminal queries
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
                stripped = re.sub(r"\x1b\[[0-9;?]*[a-zA-Z]", "", before + (child.after or ""))
                m = code_pattern.search(stripped)
                if m:
                    user_code = m.group(1)
                    saw_code = True
                    print(f"\n[DRIVER] Device code: {user_code}", flush=True)
                    print(f"DEVICE_CODE={user_code}", flush=True)
        elif idx == 3:
            child.sendline("")
            print("\n[DRIVER] Sent Enter past browser-open prompt", flush=True)
        elif idx in (4, 5):
            print("\n[DRIVER] Auth success detected!", flush=True)
            try:
                child.expect(pexpect.EOF, timeout=20)
            except pexpect.exceptions.ExceptionPexpect:
                pass
            print("AUTH_SUCCESS=true", flush=True)
            break
        elif idx in (6, 7):
            print(f"\n[DRIVER] Error: {child.before}{child.after}", flush=True)
            try:
                child.expect(pexpect.EOF, timeout=10)
            except pexpect.exceptions.ExceptionPexpect:
                pass
            break
        elif idx == 8:
            print("\n[DRIVER] gh says already logged in", flush=True)
            break
        elif idx == 9:
            print("\n[DRIVER] device code expired", flush=True)
            break
        elif idx == 10:  # TIMEOUT
            if not child.isalive():
                print(f"\n[DRIVER] gh exited (timeout branch)", flush=True)
                break
            if time.time() - start > 600:
                print("\n[DRIVER] Giving up after 600s", flush=True)
                child.terminate(force=True)
                break
        elif idx == 11:  # EOF
            print(f"\n[DRIVER] gh exited (EOF). exitstatus={child.exitstatus}", flush=True)
            break

    try:
        child.close()
    except Exception:
        pass

if __name__ == "__main__":
    main()
