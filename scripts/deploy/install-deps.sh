#!/usr/bin/env bash
# =============================================================================
# install-deps.sh — Install production Node.js dependencies on the server
# =============================================================================
#
# Called by the GitHub Actions deploy workflow AFTER rsync uploads the new
# build but BEFORE restarting the app.
#
# Runs `npm ci --omit=dev` inside the app root. Sources the cPanel nodevenv
# activate script FIRST so that the correct Node.js version (22) and npm
# are on PATH — without this, cPanel's default Node (often v14 or v16)
# would be used and the install would fail.
#
# Why npm ci (not npm install)?
#   - npm ci removes existing node_modules and installs fresh from
#     package-lock.json — guarantees a reproducible install.
#   - Faster than npm install.
#   - Fails if package-lock.json is out of sync with package.json
#     (catches a common deploy bug early).
#
# Usage (invoked over SSH from GitHub Actions):
#   bash install-deps.sh <APP_ROOT> <NODEVENV_ACTIVATE>
#
# Args:
#   APP_ROOT          — absolute path to the app root (e.g. /home/aqualit1/lnkicks)
#                       Code lives DIRECTLY here (no /current subdir).
#   NODEVENV_ACTIVATE — absolute path to the cPanel nodevenv activate script
#                       (e.g. /home/aqualit1/nodevenv/lnkicks/22/bin/activate)
# =============================================================================
set -euo pipefail

APP_ROOT="${1:?APP_ROOT argument required}"
NODEVENV_ACTIVATE="${2:?NODEVENV_ACTIVATE argument required}"

if [[ ! -d "$APP_ROOT" ]]; then
  echo "[install-deps] ERROR: Directory does not exist: $APP_ROOT" >&2
  exit 1
fi

if [[ ! -f "$APP_ROOT/package.json" ]]; then
  echo "[install-deps] ERROR: package.json not found in $APP_ROOT" >&2
  exit 1
fi

if [[ ! -f "$APP_ROOT/package-lock.json" ]]; then
  echo "[install-deps] ERROR: package-lock.json not found in $APP_ROOT" >&2
  echo "[install-deps] Cannot run 'npm ci' without a lockfile." >&2
  exit 1
fi

# Source the cPanel nodevenv activate script.
# This puts the correct Node.js + npm versions on PATH.
if [[ ! -f "$NODEVENV_ACTIVATE" ]]; then
  echo "[install-deps] ERROR: nodevenv activate script not found:" >&2
  echo "[install-deps]   $NODEVENV_ACTIVATE" >&2
  echo "[install-deps] Did you set the NODEVENV_PATH GitHub Secret correctly?" >&2
  echo "[install-deps] Expected path format: /home/<user>/nodevenv/<app>/<version>/bin/activate" >&2
  exit 1
fi

echo "[install-deps] Sourcing nodevenv: $NODEVENV_ACTIVATE"
# shellcheck disable=SC1090
source "$NODEVENV_ACTIVATE"

echo "[install-deps] Node.js version: $(node --version)"
echo "[install-deps] npm version:     $(npm --version)"
echo "[install-deps] node path:       $(which node)"
echo "[install-deps] npm path:        $(which npm)"

cd "$APP_ROOT"
echo "[install-deps] Working directory: $(pwd)"

# Remove existing node_modules to ensure a clean install.
# npm ci does this automatically, but we do it explicitly to handle
# edge cases where node_modules has permission issues.
if [[ -d "node_modules" ]]; then
  echo "[install-deps] Removing existing node_modules..."
  rm -rf node_modules
fi

echo "[install-deps] Installing production dependencies (npm ci --omit=dev)..."

# --omit=dev          → skip devDependencies (eslint, typescript, etc.)
# --no-audit          → skip security audit (slows down install, run separately)
# --no-fund           → skip funding messages
# --prefer-offline    → use npm cache when possible (faster on shared hosting)
npm ci --omit=dev --no-audit --no-fund --prefer-offline

echo "[install-deps] Verifying 'next' is installed..."
if [[ ! -d "node_modules/next" ]]; then
  echo "[install-deps] ERROR: 'next' package not found in node_modules after install." >&2
  exit 1
fi

echo "[install-deps] Verifying '@prisma/client' is installed..."
if [[ ! -d "node_modules/@prisma/client" ]]; then
  echo "[install-deps] ERROR: '@prisma/client' package not found in node_modules after install." >&2
  echo "[install-deps] Ensure @prisma/client is in package.json dependencies (NOT devDependencies)." >&2
  exit 1
fi

echo "[install-deps] Verifying 'prisma' CLI is installed..."
if [[ ! -d "node_modules/prisma" ]]; then
  echo "[install-deps] ERROR: 'prisma' package not found in node_modules after install." >&2
  echo "[install-deps] Ensure prisma is in package.json dependencies (NOT devDependencies)." >&2
  exit 1
fi

echo "[install-deps] Verifying 'dotenv' is installed..."
if [[ ! -d "node_modules/dotenv" ]]; then
  echo "[install-deps] ERROR: 'dotenv' package not found in node_modules after install." >&2
  echo "[install-deps] Ensure dotenv is in package.json dependencies." >&2
  exit 1
fi

echo "[install-deps] node_modules size: $(du -sh node_modules | cut -f1)"
echo "[install-deps] ✅ Done."
