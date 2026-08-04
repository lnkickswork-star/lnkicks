#!/usr/bin/env bash
# =============================================================================
# restart.sh — Restart the cPanel Node.js application safely
# =============================================================================
#
# Called by the GitHub Actions deploy workflow AFTER dependencies are installed.
#
# cPanel/Passenger restart strategy:
#   1. Touch the `tmp/restart.txt` file inside the app root. Passenger watches
#      this file and gracefully restarts the app process on the next request.
#      This is the OFFICIAL cPanel-recommended way to restart Node.js apps —
#      it does NOT kill running requests mid-flight, so users in the middle of
#      checkout won't get 500 errors.
#   2. As a fallback, we also try the cPanel UAPI restart (if available).
#
# Usage (invoked over SSH from GitHub Actions):
#   bash restart.sh <APP_ROOT> <NODEVENV_ACTIVATE>
#
# Args:
#   APP_ROOT          — absolute path to the app root (e.g. /home/aqualit1/lnkicks)
#   NODEVENV_ACTIVATE — absolute path to the cPanel nodevenv activate script
#                       (e.g. /home/aqualit1/nodevenv/lnkicks/22/bin/activate)
# =============================================================================
set -euo pipefail

APP_ROOT="${1:?APP_ROOT argument required}"
NODEVENV_ACTIVATE="${2:?NODEVENV_ACTIVATE argument required}"

if [[ ! -d "$APP_ROOT" ]]; then
  echo "[restart] ERROR: Directory does not exist: $APP_ROOT" >&2
  exit 1
fi

# Source the nodevenv (for consistency — restart itself doesn't need node
# directly, but future enhancements might, and it gives us logging).
if [[ -f "$NODEVENV_ACTIVATE" ]]; then
  # shellcheck disable=SC1090
  source "$NODEVENV_ACTIVATE"
  echo "[restart] nodevenv sourced: Node $(node --version 2>/dev/null || echo '?')"
else
  echo "[restart] WARNING: nodevenv activate not found at $NODEVENV_ACTIVATE" >&2
  echo "[restart] Continuing anyway — restart only needs touch(1)." >&2
fi

# cPanel/Passenger looks for tmp/restart.txt INSIDE the application root.
# When found, it gracefully restarts the app on the next request.
TMP_DIR="$APP_ROOT/tmp"
mkdir -p "$TMP_DIR"

echo "[restart] Touching tmp/restart.txt (Passenger graceful restart)..."
touch "$TMP_DIR/restart.txt"

# Print the modification time (works on both GNU and BSD date).
MTIME=$(stat -c '%y' "$TMP_DIR/restart.txt" 2>/dev/null || stat -f '%Sm' "$TMP_DIR/restart.txt" 2>/dev/null || echo "unknown")
echo "[restart] tmp/restart.txt updated at: $MTIME"

# Try cPanel UAPI restart if available (belt-and-suspenders).
# cPanel's UAPI has a Nodejs::restart endpoint, but it requires knowing the
# app's internal ID. The tmp/restart.txt approach is more reliable and
# doesn't require the ID, so we just log UAPI availability here.
if command -v uapi >/dev/null 2>&1; then
  echo "[restart] cPanel UAPI detected (tmp/restart.txt is sufficient — skipping UAPI call)."
else
  echo "[restart] cPanel UAPI not on PATH — relying on tmp/restart.txt only."
fi

# Give Passenger a moment to notice the restart file. In practice, the
# restart happens on the next inbound request, so this sleep is just a
# safety margin for the immediately-following health check.
echo "[restart] Waiting 3s for Passenger to pick up the restart signal..."
sleep 3

echo "[restart] ✅ Done. App should serve new code on the next request."
echo "[restart] Monitor logs with: tail -f $HOME/logs/*.log"
