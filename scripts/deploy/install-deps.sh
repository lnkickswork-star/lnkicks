#!/usr/bin/env bash
# =============================================================================
# install-deps.sh — Install production Node.js dependencies on the server
# =============================================================================
#
# Called by the GitHub Actions deploy workflow AFTER rsync uploads the new
# build but BEFORE restarting the app.
#
# Runs `npm ci --omit=dev` inside the freshly-uploaded `current/` directory.
# This installs ONLY production dependencies (no devDependencies like
# eslint, typescript, @types/*) — keeps node_modules small and deploy fast.
#
# Why npm ci (not npm install)?
#   - npm ci removes existing node_modules and installs fresh from
#     package-lock.json — guarantees a reproducible install.
#   - Faster than npm install.
#   - Fails if package-lock.json is out of sync with package.json
#     (catches a common deploy bug early).
#
# Usage (invoked over SSH from GitHub Actions):
#   bash install-deps.sh <APP_ROOT_CURRENT>
#
# Args:
#   APP_ROOT_CURRENT — absolute path to the freshly-uploaded code
#                      (typically $APP_ROOT/current)
# =============================================================================
set -euo pipefail

CURRENT_DIR="${1:?APP_ROOT_CURRENT argument required}"

if [[ ! -d "$CURRENT_DIR" ]]; then
  echo "[install-deps] ERROR: Directory does not exist: $CURRENT_DIR" >&2
  exit 1
fi

if [[ ! -f "$CURRENT_DIR/package.json" ]]; then
  echo "[install-deps] ERROR: package.json not found in $CURRENT_DIR" >&2
  exit 1
fi

if [[ ! -f "$CURRENT_DIR/package-lock.json" ]]; then
  echo "[install-deps] ERROR: package-lock.json not found in $CURRENT_DIR" >&2
  echo "[install-deps] Cannot run 'npm ci' without a lockfile." >&2
  exit 1
fi

# Try to detect the Node.js version the cPanel app is configured to use.
# This is informational only — cPanel's Passenger already loads the correct
# Node.js binary when running the app.
NODE_BIN="${NODE_BIN:-node}"
if command -v "$NODE_BIN" >/dev/null 2>&1; then
  echo "[install-deps] Node.js version: $($NODE_BIN --version)"
else
  echo "[install-deps] WARNING: 'node' not found on PATH."
  echo "[install-deps] If cPanel uses a custom Node binary (e.g. /opt/alt/...),"
  echo "[install-deps] set NODE_BIN env var to its path before running this script."
fi

# Use the npm that ships with the detected Node.js, if possible.
NPM_BIN="${NPM_BIN:-npm}"
if command -v "$NPM_BIN" >/dev/null 2>&1; then
  echo "[install-deps] npm version: $($NPM_BIN --version)"
else
  echo "[install-deps] ERROR: 'npm' not found on PATH." >&2
  exit 1
fi

cd "$CURRENT_DIR"

echo "[install-deps] Working directory: $(pwd)"
echo "[install-deps] Installing production dependencies (npm ci --omit=dev)..."

# --omit=dev          → skip devDependencies (eslint, typescript, etc.)
# --no-audit          → skip security audit (slows down install, run separately)
# --no-fund           → skip funding messages
# --prefer-offline    → use npm cache when possible (faster on shared hosting)
$NPM_BIN ci --omit=dev --no-audit --no-fund --prefer-offline

echo "[install-deps] Verifying 'next' is installed..."
if [[ ! -d "node_modules/next" ]]; then
  echo "[install-deps] ERROR: 'next' package not found in node_modules after install." >&2
  exit 1
fi

echo "[install-deps] node_modules size: $(du -sh node_modules | cut -f1)"
echo "[install-deps] Done."
