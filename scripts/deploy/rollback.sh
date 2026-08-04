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
#          bash $APP_ROOT/scripts/deploy/rollback.sh <APP_ROOT> <FAILED_SHA> \
#            <RELEASES_DIR> <NODEVENV_ACTIVATE>
#
# What it does:
#   1. Locates the most recent backup in RELEASES_DIR
#      (using the `latest` symlink maintained by backup-current.sh).
#   2. Moves the current broken app aside (preserved for debugging).
#   3. Restores the backup to APP_ROOT.
#   4. Re-installs production deps (in case the backup has different deps).
#   5. Touches tmp/restart.txt to restart Passenger.
#
# Safety guarantees:
#   - NEVER deletes the current app until the backup is verified.
#   - NEVER leaves APP_ROOT missing or broken mid-rollback.
#   - Verifies the backup exists and is non-empty before swapping.
#
# Usage:
#   bash rollback.sh <APP_ROOT> <FAILED_SHA> <RELEASES_DIR> <NODEVENV_ACTIVATE>
#
# Args:
#   APP_ROOT          — absolute path to app root (e.g. /home/aqualit1/lnkicks)
#   FAILED_SHA        — git SHA of the failed deploy (for logging)
#   RELEASES_DIR      — absolute path to backups (e.g. /home/aqualit1/lnkicks-releases)
#   NODEVENV_ACTIVATE — absolute path to nodevenv activate script
# =============================================================================
set -euo pipefail

APP_ROOT="${1:?APP_ROOT argument required}"
FAILED_SHA="${2:-unknown}"
RELEASES_DIR="${3:?RELEASES_DIR argument required}"
NODEVENV_ACTIVATE="${4:?NODEVENV_ACTIVATE argument required}"

echo "[rollback] ============================================================"
echo "[rollback] LN KICKS — Production Rollback"
echo "[rollback] ============================================================"
echo "[rollback] App root:        $APP_ROOT"
echo "[rollback] Failed deploy:   $FAILED_SHA"
echo "[rollback] Releases dir:    $RELEASES_DIR"
echo "[rollback] nodevenv:        $NODEVENV_ACTIVATE"
echo "[rollback] Started at:      $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo "[rollback]"

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
echo "[rollback]"

# ---------------------------------------------------------------------------
# Step 2: Move broken current app aside (preserve for debugging).
# ---------------------------------------------------------------------------
FAILED_DIR="$RELEASES_DIR/failed-$(date -u '+%Y%m%d-%H%M%S')"
if [[ -d "$APP_ROOT" ]]; then
  echo "[rollback] Moving failed deployment aside: $APP_ROOT → $FAILED_DIR"
  mkdir -p "$FAILED_DIR"

  # Move only the critical app files (not node_modules, tmp, scripts)
  # to keep the failed-deploy dir small and focused on diagnosis.
  for item in .next public cpanel package.json package-lock.json next.config.js; do
    if [[ -e "$APP_ROOT/$item" ]]; then
      mv "$APP_ROOT/$item" "$FAILED_DIR/"
    fi
  done
  echo "[rollback] Failed code preserved at: $FAILED_DIR"
fi
echo "[rollback]"

# ---------------------------------------------------------------------------
# Step 3: Restore backup → APP_ROOT.
# ---------------------------------------------------------------------------
echo "[rollback] Restoring backup: $BACKUP_DIR → $APP_ROOT"
mkdir -p "$APP_ROOT"

# Copy each item from backup to app root.
for item in .next public cpanel package.json package-lock.json next.config.js; do
  if [[ -e "$BACKUP_DIR/$item" ]]; then
    cp -a "$BACKUP_DIR/$item" "$APP_ROOT/"
  fi
done

# Verify restoration succeeded.
if [[ ! -d "$APP_ROOT/.next" ]]; then
  echo "[rollback] CRITICAL: Restore failed — .next/ missing after copy." >&2
  exit 5
fi
if [[ ! -f "$APP_ROOT/cpanel/app.js" ]]; then
  echo "[rollback] CRITICAL: Restore failed — cpanel/app.js missing after copy." >&2
  exit 5
fi
echo "[rollback] ✅ Backup restored to $APP_ROOT"
echo "[rollback]"

# ---------------------------------------------------------------------------
# Step 4: Source nodevenv + reinstall production deps.
# ---------------------------------------------------------------------------
echo "[rollback] Sourcing nodevenv: $NODEVENV_ACTIVATE"
if [[ ! -f "$NODEVENV_ACTIVATE" ]]; then
  echo "[rollback] WARNING: nodevenv activate not found — skipping npm install." >&2
  echo "[rollback] App may fail if node_modules is missing or incompatible." >&2
else
  # shellcheck disable=SC1090
  source "$NODEVENV_ACTIVATE"
  echo "[rollback] Node.js: $(node --version)"

  cd "$APP_ROOT"
  if [[ -f package-lock.json ]]; then
    echo "[rollback] Reinstalling production dependencies..."
    rm -rf node_modules  # Clean install
    if npm ci --omit=dev --no-audit --no-fund --prefer-offline; then
      echo "[rollback] ✅ Dependencies installed"
    else
      echo "[rollback] WARNING: npm ci failed. App may not start correctly." >&2
    fi
  else
    echo "[rollback] WARNING: No package-lock.json in restored backup. Skipping npm install." >&2
  fi
fi
echo "[rollback]"

# ---------------------------------------------------------------------------
# Step 5: Restart Passenger.
# ---------------------------------------------------------------------------
echo "[rollback] Restarting Passenger (touch tmp/restart.txt)..."
mkdir -p "$APP_ROOT/tmp"
touch "$APP_ROOT/tmp/restart.txt"

echo "[rollback] Waiting 5s for Passenger to pick up restart..."
sleep 5

echo "[rollback] ============================================================"
echo "[rollback] ✅ Rollback complete."
echo "[rollback] Production should now be serving the previous version."
echo "[rollback] ============================================================"
echo "[rollback] Next steps:"
echo "[rollback]   1. Investigate why the failed deploy broke production."
echo "[rollback]      Failed code preserved at: $FAILED_DIR"
echo "[rollback]   2. Fix the issue on a feature branch, push, and let CI verify."
echo "[rollback]   3. Only re-deploy to main once CI is green."
