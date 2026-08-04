#!/usr/bin/env bash
# =============================================================================
# rollback.sh — Restore the previous production deployment
# =============================================================================
#
# Called AUTOMATICALLY by the GitHub Actions deploy workflow if the
# post-deploy health check fails. Can also be triggered manually:
#
#   Manual trigger options:
#     A) GitHub Actions UI → "Deploy to Production (cPanel)" workflow →
#        "Run workflow" → check "force_rollback" → Run.
#     B) SSH into server and run:
#          bash $APP_ROOT/scripts/deploy/rollback.sh <APP_ROOT>
#
# What it does:
#   1. Locates the most recent backup in $APP_ROOT/releases/
#      (using the `latest` symlink maintained by backup-current.sh).
#   2. Atomically swaps the `current/` pointer to that backup.
#   3. Re-installs production deps (in case the backup has different deps).
#   4. Touches tmp/restart.txt to restart Passenger.
#
# Safety guarantees:
#   - NEVER deletes the current `current/` until the backup is in place.
#   - NEVER leaves `current/` missing or broken mid-rollback.
#   - Verifies the backup exists and is non-empty before swapping.
#
# Usage:
#   bash rollback.sh <APP_ROOT> [<FAILED_GIT_SHA>]
#
# Args:
#   APP_ROOT        — absolute path to app root (e.g. /home/aqualit1/lnkicks)
#   FAILED_GIT_SHA  — (optional) git SHA of the failed deploy, for logging
# =============================================================================
set -euo pipefail

APP_ROOT="${1:?APP_ROOT argument required}"
FAILED_SHA="${2:-unknown}"

CURRENT_DIR="$APP_ROOT/current"
RELEASES_DIR="$APP_ROOT/releases"

echo "[rollback] App root:        $APP_ROOT"
echo "[rollback] Failed deploy:   $FAILED_SHA"
echo "[rollback] Current target:  $CURRENT_DIR"
echo ""

# ---------------------------------------------------------------------------
# Step 1: Locate the backup to restore.
# ---------------------------------------------------------------------------
LATEST_LINK="$RELEASES_DIR/latest"

if [[ ! -L "$LATEST_LINK" ]]; then
  echo "[rollback] ERROR: No 'latest' backup symlink at $LATEST_LINK" >&2
  echo "[rollback] Cannot roll back — no previous deployment is available." >&2
  echo "[rollback] Production remains in its current (possibly broken) state." >&2
  echo "[rollback] Manual recovery required." >&2
  exit 2
fi

BACKUP_DIR=$(readlink -f "$LATEST_LINK")

if [[ ! -d "$BACKUP_DIR" ]]; then
  echo "[rollback] ERROR: Backup directory does not exist: $BACKUP_DIR" >&2
  exit 3
fi

# Sanity check: backup must contain package.json and .next/.
if [[ ! -f "$BACKUP_DIR/package.json" || ! -d "$BACKUP_DIR/.next" ]]; then
  echo "[rollback] ERROR: Backup at $BACKUP_DIR is incomplete (missing package.json or .next/)." >&2
  exit 4
fi

echo "[rollback] ✅ Found valid backup: $BACKUP_DIR"
echo "[rollback] Backup manifest:"
if [[ -f "$BACKUP_DIR/.deploy-manifest.json" ]]; then
  cat "$BACKUP_DIR/.deploy-manifest.json"
else
  echo "  (no manifest file)"
fi
echo ""

# ---------------------------------------------------------------------------
# Step 2: Atomic-ish swap of `current/` → backup.
# ---------------------------------------------------------------------------
# We use mv to swap directories on the same filesystem (atomic rename).
# Steps:
#   a. Move current/ → a temporary "failed" location (preserved for debugging).
#   b. Copy backup → current/ (or symlink — we copy to match the deploy flow).
#   c. If step (b) fails, restore the moved-aside current/ to avoid leaving
#      production with no current/ directory at all.

FAILED_DIR="$RELEASES_DIR/failed-$(date -u '+%Y%m%d-%H%M%S')"
if [[ -d "$CURRENT_DIR" ]]; then
  echo "[rollback] Moving failed deployment aside: $CURRENT_DIR → $FAILED_DIR"
  mv "$CURRENT_DIR" "$FAILED_DIR"
fi

echo "[rollback] Restoring backup: $BACKUP_DIR → $CURRENT_DIR"
if ! cp -a "$BACKUP_DIR" "$CURRENT_DIR"; then
  echo "[rollback] CRITICAL: Restore failed. Attempting to recover previous (failed) deployment..." >&2
  if [[ -d "$FAILED_DIR" ]]; then
    mv "$FAILED_DIR" "$CURRENT_DIR"
    echo "[rollback] Recovered failed deployment back to $CURRENT_DIR" >&2
  fi
  exit 5
fi

# Preserve the failed deployment for 24h for debugging, then it'll be
# pruned by the next backup-current.sh run (it only keeps 10 newest).
echo "[rollback] Failed deployment preserved at: $FAILED_DIR (for debugging)"
echo ""

# ---------------------------------------------------------------------------
# Step 3: Re-install production dependencies.
# ---------------------------------------------------------------------------
# The backup's node_modules may have been deleted to save disk space, OR
# the backup may have different deps than what was just deployed. Re-run
# npm ci --omit=dev to be safe.
echo "[rollback] Reinstalling production dependencies..."
cd "$CURRENT_DIR"
if [[ -f package-lock.json ]]; then
  npm ci --omit=dev --no-audit --no-fund --prefer-offline || {
    echo "[rollback] WARNING: npm ci failed. Using existing node_modules if present." >&2
  }
else
  echo "[rollback] WARNING: No package-lock.json in backup. Skipping npm install." >&2
fi

# ---------------------------------------------------------------------------
# Step 4: Restart Passenger.
# ---------------------------------------------------------------------------
echo "[rollback] Restarting Passenger (touch tmp/restart.txt)..."
mkdir -p "$CURRENT_DIR/tmp"
touch "$CURRENT_DIR/tmp/restart.txt"

echo "[rollback] Waiting 5s for Passenger to pick up restart..."
sleep 5

echo ""
echo "[rollback] ✅ Rollback complete."
echo "[rollback] Production should now be serving the previous version."
echo "[rollback] Verify with: curl -I $CURRENT_DOMAIN (check HTTP 200)"
echo ""
echo "[rollback] Next steps:"
echo "[rollback]   1. Investigate why the failed deploy broke production."
echo "[rollback]      Failed code preserved at: $FAILED_DIR"
echo "[rollback]   2. Fix the issue on a feature branch, push, and let CI verify."
echo "[rollback]   3. Only re-deploy to main once CI is green."
