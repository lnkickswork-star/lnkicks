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
#   2. npm ci (full deps, needed for build)
#   3. npm run type-check
#   4. npm run lint
#   5. npm run build
#   6. Backup current/ → releases/<timestamp>/
#   7. Copy build artifacts → current/
#   8. npm ci --omit=dev in current/ (production deps only)
#   9. touch tmp/restart.txt
#  10. Health check
#  11. Auto-rollback on failure
#
# Usage:
#   bash deploy.sh <APP_ROOT> <GIT_REPO_URL> <PRODUCTION_DOMAIN>
#
# Args:
#   APP_ROOT          — absolute path (e.g. /home/aqualit1/lnkicks)
#   GIT_REPO_URL      — HTTPS or SSH URL of the GitHub repo
#   PRODUCTION_DOMAIN — full URL with https:// for health check
#
# Example:
#   bash /home/aqualit1/lnkicks/scripts/deploy/deploy.sh \
#     /home/aqualit1/lnkicks \
#     git@github.com:lnkickswork-star/lnkicks.git \
#     https://lnkicks.com
# =============================================================================
set -euo pipefail

APP_ROOT="${1:?APP_ROOT argument required}"
GIT_REPO_URL="${2:?GIT_REPO_URL argument required}"
PRODUCTION_DOMAIN="${3:?PRODUCTION_DOMAIN argument required}"

STAGING_DIR="$APP_ROOT/staging"
CURRENT_DIR="$APP_ROOT/current"
RELEASES_DIR="$APP_ROOT/releases"
SCRIPTS_DIR="$APP_ROOT/scripts/deploy"

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

echo "============================================================"
echo "  LN KICKS — Manual Deploy Orchestrator"
echo "============================================================"
echo "  App root:     $APP_ROOT"
echo "  Git repo:     $GIT_REPO_URL"
echo "  Domain:       $PRODUCTION_DOMAIN"
echo "  Started at:   $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "============================================================"
echo ""

mkdir -p "$RELEASES_DIR" "$STAGING_DIR"

# ---------------------------------------------------------------------------
# Step 1: Get the latest code into staging/
# ---------------------------------------------------------------------------
echo "[1/10] Fetching latest code..."
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
# Step 2: Install full deps (needed for build)
# ---------------------------------------------------------------------------
echo "[2/10] Installing full dependencies (npm ci)..."
npm ci --no-audit --no-fund
echo ""

# ---------------------------------------------------------------------------
# Step 3: Type-check
# ---------------------------------------------------------------------------
echo "[3/10] Running type-check (tsc --noEmit)..."
npm run type-check
echo ""

# ---------------------------------------------------------------------------
# Step 4: Lint
# ---------------------------------------------------------------------------
echo "[4/10] Running lint (next lint)..."
npm run lint
echo ""

# ---------------------------------------------------------------------------
# Step 5: Build
# ---------------------------------------------------------------------------
echo "[5/10] Running production build (next build)..."
npm run build
echo ""

# ---------------------------------------------------------------------------
# Step 6: Backup current/
# ---------------------------------------------------------------------------
echo "[6/10] Backing up current production..."
GIT_SHA=$(git rev-parse HEAD)
bash "$SCRIPTS_DIR/backup-current.sh" "$APP_ROOT" "$GIT_SHA"
echo ""

# ---------------------------------------------------------------------------
# Step 7: Copy build artifacts to current/
# ---------------------------------------------------------------------------
echo "[7/10] Deploying build artifacts to current/..."

# Move the old current/ aside (preserved by backup-current.sh already)
if [[ -d "$CURRENT_DIR" ]]; then
  # backup-current.sh already made a copy, safe to remove
  rm -rf "$CURRENT_DIR"
fi
mkdir -p "$CURRENT_DIR"

# Copy ONLY production files — same exclusion list as the GH Actions workflow
rsync -a \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.github' \
  --exclude='prototypes' \
  --exclude='docs' \
  --exclude='agent-ctx' \
  --exclude='scripts' \
  --exclude='*.md' \
  --exclude='.env*' \
  --exclude='.vscode' \
  --exclude='.idea' \
  --exclude='tsconfig.json' \
  --exclude='next-env.d.ts' \
  --exclude='.eslintrc*' \
  --exclude='.gitignore' \
  --exclude='.gitattributes' \
  "$STAGING_DIR/" "$CURRENT_DIR/"

echo "  → Artifacts copied to $CURRENT_DIR"
echo ""

# ---------------------------------------------------------------------------
# Step 8: Install production deps
# ---------------------------------------------------------------------------
echo "[8/10] Installing production dependencies (npm ci --omit=dev)..."
bash "$SCRIPTS_DIR/install-deps.sh" "$CURRENT_DIR"
echo ""

# ---------------------------------------------------------------------------
# Step 9: Restart Passenger
# ---------------------------------------------------------------------------
echo "[9/10] Restarting Node.js app..."
bash "$SCRIPTS_DIR/restart.sh" "$CURRENT_DIR"
echo ""

# ---------------------------------------------------------------------------
# Step 10: Health check
# ---------------------------------------------------------------------------
echo "[10/10] Running health check..."
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
  bash "$SCRIPTS_DIR/rollback.sh" "$APP_ROOT" "$GIT_SHA"
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
