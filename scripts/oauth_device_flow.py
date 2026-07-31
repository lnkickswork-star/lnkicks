#!/usr/bin/env python3
"""
Two-phase GitHub OAuth Device Flow.

Phase 1 (oauth_phase1.py): Request device code, save state to ~/.config/gh-device-flow-state.json,
print user code & URL. Exit immediately.

Phase 2 (oauth_phase2.py): Read state, poll token endpoint. If authorized, store token
for git + gh CLI, print authenticated login. If not, poll up to --max-wait seconds.

This design lets each phase run in a separate short-lived shell call.
"""
import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path

CLIENT_ID = "Iv1.b507a08c87ecfe98"
SCOPES = ["repo", "read:org", "gist", "workflow"]
HOST = "github.com"
API_BASE = "https://api.github.com"
DEVICE_CODE_URL = "https://github.com/login/device/code"
TOKEN_URL = "https://github.com/login/oauth/access_token"
STATE_FILE = Path("~/.config/gh-device-flow-state.json").expanduser()

def http_post(url, data):
    headers = {
        "Accept": "application/json",
        "User-Agent": "gh-device-flow/1.0",
    }
    body = urllib.parse.urlencode(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            payload = json.loads(e.read().decode("utf-8"))
        except Exception:
            payload = {"error": f"http_{e.code}", "error_description": str(e)}
        return e.code, payload

def phase1():
    print("=== Phase 1: Request device code ===", flush=True)
    status, body = http_post(DEVICE_CODE_URL, {
        "client_id": CLIENT_ID,
        "scope": " ".join(SCOPES),
    })
    if status != 200 or "device_code" not in body:
        print(f"ERROR: device code request failed: {status} {body}", flush=True)
        sys.exit(1)

    state = {
        "device_code": body["device_code"],
        "user_code": body["user_code"],
        "verification_uri": body.get("verification_uri", "https://github.com/login/device"),
        "expires_in": int(body.get("expires_in", 900)),
        "interval": int(body.get("interval", 5)),
        "requested_at": int(time.time()),
        "scopes": SCOPES,
    }
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))
    STATE_FILE.chmod(0o600)

    print("")
    print("****************************************************************")
    print("*  GITHUB OAUTH DEVICE FLOW — Phase 1 complete")
    print("****************************************************************")
    print(f"*  One-time code : {state['user_code']}")
    print(f"*  Verification  : {state['verification_uri']}")
    print(f"*  Expires in    : {state['expires_in']}s")
    print(f"*  State saved   : {STATE_FILE}")
    print("****************************************************************")
    print("")
    print(">>> Open the URL in your browser, enter the code, click Authorize.")
    print(">>> Then run Phase 2 to retrieve the token.")
    print("")
    print(f"USER_CODE={state['user_code']}")
    print(f"VERIFICATION_URI={state['verification_uri']}")

def phase2(max_wait):
    if not STATE_FILE.exists():
        print("ERROR: No Phase 1 state found. Run phase1 first.", flush=True)
        sys.exit(1)
    state = json.loads(STATE_FILE.read_text())
    device_code = state["device_code"]
    interval = max(int(state.get("interval", 5)), 5)
    requested_at = int(state["requested_at"])
    expires_in = int(state["expires_in"])
    deadline = requested_at + expires_in
    now = int(time.time())
    if now >= deadline:
        print(f"ERROR: Device code expired at {time.ctime(deadline)}", flush=True)
        sys.exit(2)

    print(f"=== Phase 2: Poll for token (max wait {max_wait}s) ===", flush=True)
    print(f"Device code expires at {time.ctime(deadline)}", flush=True)
    print(f"Polling every {interval}s...", flush=True)

    poll_count = 0
    soft_deadline = min(deadline, time.time() + max_wait)
    while time.time() < soft_deadline:
        poll_count += 1
        try:
            status, body = http_post(TOKEN_URL, {
                "client_id": CLIENT_ID,
                "device_code": device_code,
                "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
            })
        except Exception as e:
            print(f"[POLL] Network error attempt {poll_count}: {e}", flush=True)
            time.sleep(interval)
            continue

        if "access_token" in body:
            token = body["access_token"]
            granted_scope = body.get("scope", "")
            print(f"[POLL] Token received on attempt {poll_count}! scope={granted_scope}", flush=True)
            store_token(token)
            return

        err = body.get("error", "")
        if err == "authorization_pending":
            if poll_count == 1 or poll_count % 6 == 0:
                print(f"[POLL] Still waiting for browser authorization... (attempt {poll_count})", flush=True)
            time.sleep(interval)
            continue
        elif err == "slow_down":
            interval += 5
            print(f"[POLL] Slow down — new interval {interval}s", flush=True)
            time.sleep(interval)
            continue
        elif err == "expired_token":
            print("ERROR: Device code expired.", flush=True)
            sys.exit(3)
        elif err == "access_denied":
            print("ERROR: User denied authorization.", flush=True)
            sys.exit(4)
        else:
            print(f"ERROR: Unknown OAuth error: {err} ({body.get('error_description','')})", flush=True)
            sys.exit(5)

    remaining = int(deadline - time.time())
    print(f"[POLL] Max wait ({max_wait}s) reached. Device code still valid for {remaining}s.", flush=True)
    print("Re-run phase2 to continue polling.", flush=True)
    sys.exit(10)  # special: not yet authorized

def store_token(token):
    """Store token for git + gh CLI. Never print the token."""
    import subprocess
    # 1. Query /user to get login
    req = urllib.request.Request(f"{API_BASE}/user", headers={
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "gh-device-flow/1.0",
    })
    with urllib.request.urlopen(req, timeout=30) as resp:
        user = json.loads(resp.read().decode("utf-8"))
    login = user["login"]
    print(f"[STORE] Authenticated as: {login}", flush=True)

    # 2. Store in git credential helper
    cred_file = Path("~/.config/git/credentials").expanduser()
    cred_file.parent.mkdir(parents=True, exist_ok=True)
    line = f"https://x-access-token:{token}@{HOST}\n"
    cred_file.write_text(line)
    cred_file.chmod(0o600)
    os.system(f'git config --global credential.helper "store --file={cred_file}"')
    print(f"[STORE] Git credential stored at: {cred_file}", flush=True)

    # 3. Store in gh CLI hosts.yml
    hosts_path = Path("~/.config/gh/hosts.yml").expanduser()
    hosts_path.parent.mkdir(parents=True, exist_ok=True)
    yaml_content = (
        f"{HOST}:\n"
        f"    users:\n"
        f"        {login}:\n"
        f"            oauth_token: {token}\n"
        f"    user: {login}\n"
        f"    oauth_token: {token}\n"
        f"    git_protocol: https\n"
    )
    hosts_path.write_text(yaml_content)
    hosts_path.chmod(0o600)
    print(f"[STORE] gh CLI config written: {hosts_path}", flush=True)

    # 4. Cleanup state file
    try:
        STATE_FILE.unlink()
    except Exception:
        pass

    print(f"AUTHENTICATED_LOGIN={login}", flush=True)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("phase", choices=["phase1", "phase2"])
    parser.add_argument("--max-wait", type=int, default=120,
                        help="Max seconds to poll in phase2 (default 120)")
    args = parser.parse_args()
    if args.phase == "phase1":
        phase1()
    else:
        phase2(args.max_wait)

if __name__ == "__main__":
    main()
