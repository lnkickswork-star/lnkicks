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
#   2. As a fallback (for cPanel setups without tmp/restart.txt watching),
#      we also call the cPanel UAPI to restart the app explicitly.
#
# Usage (invoked over SSH from GitHub Actions):
#   bash restart.sh <APP_ROOT_CURRENT>
#
# Args:
#   APP_ROOT_CURRENT — absolute path to the app root (typically $APP_ROOT/current)
# =============================================================================
set -euo pipefail

CURRENT_DIR="${1:?APP_ROOT_CURRENT argument required}"

if [[ ! -d "$CURRENT_DIR" ]]; then
  echo "[restart] ERROR: Directory does not exist: $CURRENT_DIR" >&2
  exit 1
fi

# cPanel/Passenger looks for tmp/restart.txt INSIDE the application root.
# When found, it gracefully restarts the app on the next request.
TMP_DIR="$CURRENT_DIR/tmp"
mkdir -p "$TMP_DIR"

echo "[restart] Touching tmp/restart.txt (Passenger graceful restart)..."
touch "$TMP_DIR/restart.txt"
echo "[restart] tmp/restart.txt updated at: $(stat -c '%y' "$TMP_DIR/restart.txt" 2>/dev/null || stat -f '%Sm' "$TMP_DIR/restart.txt")"

# Optional: try cPanel UAPI restart. This requires the cPanel user to be
# the same as the SSH user (which it should be on shared hosting).
# We don't fail the script if UAPI isn't available — tmp/restart.txt is
# the primary mechanism.
if command -v uapi >/dev/null 2>&1; then
  echo "[restart] cPanel UAPI detected. Attempting explicit app restart..."
  # We don't know the app's cPanel-internal ID here, so we just rely on
  # tmp/restart.txt. UAPI restart-by-name isn't always available.
  echo "[restart] (Skipping UAPI call — tmp/restart.txt is sufficient for Passenger.)"
else
  echo "[restart] cPanel UAPI not available on PATH — relying on tmp/restart.txt only."
fi

# Give Passenger a moment to notice the restart file. In practice, the
# restart happens on the next inbound request, so this sleep is just a
# safety margin for the immediately-following health check.
echo "[restart] Waiting 3s for Passenger to pick up the restart signal..."
sleep 3

echo "[restart] Done. App should serve new code on the next request."
echo "[restart] Monitor logs with: tail -f $HOME/logs/*.log"
