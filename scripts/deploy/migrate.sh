#!/usr/bin/env bash
# =============================================================================
# migrate.sh — Run Prisma migrations on the cPanel server
# =============================================================================
#
# Called by the GitHub Actions deploy workflow AFTER install-deps.sh installs
# production dependencies (so node_modules/prisma + node_modules/@prisma/client
# are present) and BEFORE restart.sh restarts Passenger.
#
# What it does:
#   1. Sources the cPanel nodevenv activate script (Node 22 + npm on PATH,
#      and crucially loads etc/envvars which contains DATABASE_URL +
#      DIRECT_URL needed by Prisma).
#   2. cd into the app root.
#   3. npx prisma generate          → regenerate @prisma/client query engine
#                                     (must run after every npm ci because
#                                     npm ci wipes node_modules).
#   4. npx prisma migrate deploy    → apply pending migrations in order.
#                                     Does NOT create migrations — only
#                                     applies what's already committed in
#                                     prisma/migrations/.
#                                     Skipped silently if no migrations
#                                     directory exists (first deploy).
#
# Why `prisma generate` is needed even though package.json has
# `postinstall: prisma generate`:
#   - npm ci runs postinstall, but it can fail silently if the schema file
#     isn't found or if @prisma/client isn't fully extracted yet.
#   - Running it explicitly here guarantees the query engine binary matches
#     the deployed schema.
#
# Usage (invoked over SSH from GitHub Actions):
#   bash migrate.sh <APP_ROOT> <NODEVENV_ACTIVATE>
#
# Args:
#   APP_ROOT          — absolute path to the app root (e.g. /home/aqualit1/lnkicks)
#   NODEVENV_ACTIVATE — absolute path to the cPanel nodevenv activate script
#                       (e.g. /home/aqualit1/nodevenv/lnkicks/22/bin/activate)
# =============================================================================
set -euo pipefail

APP_ROOT="${1:?APP_ROOT argument required}"
NODEVENV_ACTIVATE="${2:?NODEVENV_ACTIVATE argument required}"

echo "[migrate] ─────────────────────────────────────────────────────────"
echo "[migrate] Prisma migration step"
echo "[migrate] App root: $APP_ROOT"
echo "[migrate] nodevenv: $NODEVENV_ACTIVATE"
echo "[migrate] ─────────────────────────────────────────────────────────"

# ---------------------------------------------------------------------------
# Step 0: Sanity checks
# ---------------------------------------------------------------------------
if [[ ! -d "$APP_ROOT" ]]; then
  echo "[migrate] ERROR: Directory does not exist: $APP_ROOT" >&2
  exit 1
fi

if [[ ! -f "$APP_ROOT/package.json" ]]; then
  echo "[migrate] ERROR: package.json not found in $APP_ROOT" >&2
  exit 1
fi

if [[ ! -f "$APP_ROOT/prisma/schema.prisma" ]]; then
  echo "[migrate] ERROR: prisma/schema.prisma not found in $APP_ROOT" >&2
  echo "[migrate] The rsync upload must include the prisma/ directory." >&2
  exit 1
fi

if [[ ! -f "$NODEVENV_ACTIVATE" ]]; then
  echo "[migrate] ERROR: nodevenv activate script not found:" >&2
  echo "[migrate]   $NODEVENV_ACTIVATE" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# Step 1: Source nodevenv — this also sources etc/envvars which contains
# DATABASE_URL, DIRECT_URL, NODE_ENV, etc.
# ---------------------------------------------------------------------------
echo "[migrate] Sourcing nodevenv: $NODEVENV_ACTIVATE"
# shellcheck disable=SC1090
source "$NODEVENV_ACTIVATE"

echo "[migrate] Node.js version: $(node --version)"
echo "[migrate] npm version:     $(npm --version)"

# Verify env vars are loaded — fail fast with a clear message if not.
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "[migrate] ERROR: DATABASE_URL is not set." >&2
  echo "[migrate] The nodevenv etc/envvars file must contain DATABASE_URL." >&2
  echo "[migrate] Run: bash $APP_ROOT/scripts/deploy/setup-env-vars.sh" >&2
  exit 1
fi
if [[ -z "${DIRECT_URL:-}" ]]; then
  echo "[migrate] ERROR: DIRECT_URL is not set." >&2
  echo "[migrate] The nodevenv etc/envvars file must contain DIRECT_URL." >&2
  echo "[migrate] Run: bash $APP_ROOT/scripts/deploy/setup-env-vars.sh" >&2
  exit 1
fi

echo "[migrate] DATABASE_URL is set (length: ${#DATABASE_URL})"
echo "[migrate] DIRECT_URL is set (length: ${#DIRECT_URL})"

# ---------------------------------------------------------------------------
# Step 2: cd into app root
# ---------------------------------------------------------------------------
cd "$APP_ROOT"
echo "[migrate] Working directory: $(pwd)"

# ---------------------------------------------------------------------------
# Step 3: prisma generate — regenerate the query engine binary
# ---------------------------------------------------------------------------
echo "[migrate] Running: npx prisma generate"
if ! npx --no-install prisma generate; then
  echo "[migrate] ERROR: prisma generate failed." >&2
  echo "[migrate] Check that schema.prisma is valid and @prisma/client is installed." >&2
  exit 1
fi

# Verify the client was generated
if [[ ! -d "node_modules/.prisma/client" ]]; then
  echo "[migrate] ERROR: node_modules/.prisma/client not found after generate." >&2
  exit 1
fi
echo "[migrate] prisma generate OK — client at node_modules/.prisma/client"

# ---------------------------------------------------------------------------
# Step 4: prisma migrate deploy — apply pending migrations
# ---------------------------------------------------------------------------
# Skip silently if no migrations directory exists. This is normal for the
# first deploy before any `prisma migrate dev` has been run.
if [[ ! -d "prisma/migrations" ]]; then
  echo "[migrate] No prisma/migrations/ directory — skipping migrate deploy."
  echo "[migrate] (This is normal for the first deploy. To create migrations,"
  echo "[migrate]  run `npx prisma migrate dev --name init` locally and commit them.)"
  echo "[migrate] ✅ Done (no migrations to apply)."
  exit 0
fi

echo "[migrate] Running: npx prisma migrate deploy"
if ! npx --no-install prisma migrate deploy; then
  echo "[migrate] ERROR: prisma migrate deploy failed." >&2
  echo "[migrate] This usually means:" >&2
  echo "[migrate]   1. DATABASE_URL/DIRECT_URL are wrong (check etc/envvars)" >&2
  echo "[migrate]   2. Neon is unreachable (P1001 — check firewall/DNS)" >&2
  echo "[migrate]   3. SSL is required but not in URL (add ?sslmode=require)" >&2
  echo "[migrate]   4. Migrations are out of order (check prisma/migrations/)" >&2
  exit 1
fi

echo "[migrate] prisma migrate deploy OK"
echo "[migrate] ✅ Done."
