#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Manual one-shot deploy orchestrator (server-side)
# =============================================================================
#
# This script is the SERVER-SIDE equivalent of the GitHub Actions deploy
# workflow. It exists for two reasons:
#
#   1. Initial setup — to verify all the moving parts work before relying
#      on GitHub Actions.
#   2. Emergency deploy — if GitHub Actions is down or secrets are broken,
#      you can SSH in and run this script to deploy the latest code from
#      a git pull.
#
# NORMAL OPERATION: Do NOT use this script. Use git push to main and let
# GitHub Actions handle the deploy. This script is a fallback only.
#
# What it does:
#   1. git pull (or git clone on first run)
#   2. source nodevenv activate (Node 22)
#   3. npm ci (full deps, needed for build)
#   4. npm run type-check
#   5. npm run lint
#   6. npm run build
#   7. Backup current/ → releases/<timestamp>/
#   8. Copy build artifacts → APP_ROOT/
#   9. npm ci --omit=dev in APP_ROOT (production deps only)
#  10. touch tmp/restart.txt
#  11. Health check
#  12. Auto-rollback on failure
#
# Usage:
#   bash deploy.sh <APP_ROOT> <GIT_REPO_URL> <PRODUCTION_DOMAIN> <NODEVENV_ACTIVATE> <RELEASES_DIR>
#
# Args:
#   APP_ROOT          — absolute path (e.g. /home/aqualit1/lnkicks)
#   GIT_REPO_URL      — HTTPS or SSH URL of the GitHub repo
#   PRODUCTION_DOMAIN — full URL with https:// for health check
#   NODEVENV_ACTIVATE — absolute path to nodevenv activate script
#                       (e.g. /home/aqualit1/nodevenv/lnkicks/22/bin/activate)
#   RELEASES_DIR      — absolute path to backups (e.g. /home/aqualit1/lnkicks-releases)
# =============================================================================
set -euo pipefail

APP_ROOT="${1:?APP_ROOT argument required}"
GIT_REPO_URL="${2:?GIT_REPO_URL argument required}"
PRODUCTION_DOMAIN="${3:?PRODUCTION_DOMAIN argument required}"
NODEVENV_ACTIVATE="${4:?NODEVENV_ACTIVATE argument required}"
RELEASES_DIR="${5:?RELEASES_DIR argument required}"

STAGING_DIR="$HOME/lnkicks-staging"
SCRIPTS_DIR="$APP_ROOT/scripts/deploy"

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

echo "============================================================"
echo "  LN KICKS — Manual Deploy Orchestrator"
echo "============================================================"
echo "  App root:        $APP_ROOT"
echo "  Git repo:        $GIT_REPO_URL"
echo "  Domain:          $PRODUCTION_DOMAIN"
echo "  nodevenv:        $NODEVENV_ACTIVATE"
echo "  Releases dir:    $RELEASES_DIR"
echo "  Started at:      $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "============================================================"
echo ""

mkdir -p "$RELEASES_DIR" "$STAGING_DIR"

# ---------------------------------------------------------------------------
# Step 1: Get the latest code into staging/
# ---------------------------------------------------------------------------
echo "[1/11] Fetching latest code..."
if [[ -d "$STAGING_DIR/.git" ]]; then
  cd "$STAGING_DIR"
  git fetch --all --prune
  git reset --hard origin/main
  git clean -fdx   # remove any untracked files from previous run
else
  rm -rf "$STAGING_DIR"
  git clone --depth=1 --branch=main "$GIT_REPO_URL" "$STAGING_DIR"
  cd "$STAGING_DIR"
fi
echo "  → Checked out: $(git rev-parse --short HEAD)"
echo ""

# ---------------------------------------------------------------------------
# Step 2: Activate nodevenv
# ---------------------------------------------------------------------------
echo "[2/11] Activating nodevenv..."
# shellcheck disable=SC1090
source "$NODEVENV_ACTIVATE"
echo "  → Node.js: $(node --version)"
echo "  → npm:     $(npm --version)"
echo ""

# ---------------------------------------------------------------------------
# Step 3: Install full deps (needed for build)
# ---------------------------------------------------------------------------
echo "[3/11] Installing full dependencies (npm ci)..."
npm ci --no-audit --no-fund
echo ""

# ---------------------------------------------------------------------------
# Step 4: Type-check
# ---------------------------------------------------------------------------
echo "[4/11] Running type-check (tsc --noEmit)..."
npm run type-check
echo ""

# ---------------------------------------------------------------------------
# Step 5: Lint
# ---------------------------------------------------------------------------
echo "[5/11] Running lint (next lint)..."
npm run lint
echo ""

# ---------------------------------------------------------------------------
# Step 6: Build
# ---------------------------------------------------------------------------
echo "[6/11] Running production build (next build)..."
npm run build
echo ""

# ---------------------------------------------------------------------------
# Step 7: Backup current app
# ---------------------------------------------------------------------------
echo "[7/11] Backing up current production..."
GIT_SHA=$(git rev-parse HEAD)
bash "$SCRIPTS_DIR/backup-current.sh" "$APP_ROOT" "$GIT_SHA" "$RELEASES_DIR"
echo ""

# ---------------------------------------------------------------------------
# Step 8: Copy build artifacts to APP_ROOT
# ---------------------------------------------------------------------------
echo "[8/11] Deploying build artifacts to APP_ROOT..."

# Copy ONLY production files — same exclusion list as the GH Actions workflow
# We use rsync for atomic-ish copy with exclusions.
rsync -a --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.github' \
  --exclude='prototypes' \
  --exclude='docs' \
  --exclude='agent-ctx' \
  --exclude='scripts' \
  --exclude='releases' \
  --exclude='tmp' \
  --exclude='*.md' \
  --exclude='.env*' \
  --exclude='.vscode' \
  --exclude='.idea' \
  --exclude='tsconfig.json' \
  --exclude='next-env.d.ts' \
  --exclude='.eslintrc*' \
  --exclude='.gitignore' \
  --exclude='.gitattributes' \
  "$STAGING_DIR/" "$APP_ROOT/"

echo "  → Artifacts copied to $APP_ROOT"
echo ""

# ---------------------------------------------------------------------------
# Step 9: Install production deps
# ---------------------------------------------------------------------------
echo "[9/11] Installing production dependencies (npm ci --omit=dev)..."
bash "$SCRIPTS_DIR/install-deps.sh" "$APP_ROOT" "$NODEVENV_ACTIVATE"
echo ""

# ---------------------------------------------------------------------------
# Step 10: Restart Passenger
# ---------------------------------------------------------------------------
echo "[10/11] Restarting Node.js app..."
bash "$SCRIPTS_DIR/restart.sh" "$APP_ROOT" "$NODEVENV_ACTIVATE"
echo ""

# ---------------------------------------------------------------------------
# Step 11: Health check
# ---------------------------------------------------------------------------
echo "[11/11] Running health check..."
if bash "$SCRIPTS_DIR/health-check.sh" "$PRODUCTION_DOMAIN" 120; then
  echo ""
  echo "============================================================"
  echo "  ✅ DEPLOYMENT SUCCESSFUL"
  echo "  Commit: $(git rev-parse --short HEAD)"
  echo "  URL:    $PRODUCTION_DOMAIN"
  echo "============================================================"
  exit 0
else
  echo ""
  echo "============================================================"
  echo "  ❌ DEPLOYMENT FAILED — Health check did not pass."
  echo "  Initiating automatic rollback..."
  echo "============================================================"
  bash "$SCRIPTS_DIR/rollback.sh" "$APP_ROOT" "$GIT_SHA" "$RELEASES_DIR" "$NODEVENV_ACTIVATE"
  echo ""
  echo "  Waiting 20s for rollback to take effect..."
  sleep 20
  if bash "$SCRIPTS_DIR/health-check.sh" "$PRODUCTION_DOMAIN" 60; then
    echo "  ✅ Rollback successful — production serving previous version."
  else
    echo "  🚨 CRITICAL: Rollback ALSO failed. Manual intervention required."
  fi
  exit 1
fi
