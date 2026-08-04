#!/usr/bin/env bash
# =============================================================================
# setup-env-vars.sh — Configure cPanel Node.js environment variables
# =============================================================================
#
# This script sets up ALL environment variables for the LN KICKS production
# app on cPanel shared hosting. It writes to the cPanel nodevenv etc/envvars
# file, which is automatically sourced by bin/activate — so the env vars
# become available to the Node.js process when Passenger starts it.
#
# Two modes:
#
#   INTERACTIVE (default):
#     Prompts for each env var value. Skips vars you leave blank.
#     Recommended for first-time setup.
#
#   FILE MODE (use a .env file):
#     Reads vars from a .env.production file you've uploaded to the server.
#     Useful for non-interactive setup or for re-applying env vars after
#     cPanel re-creates the nodevenv.
#
# Usage:
#   bash setup-env-vars.sh                    # interactive mode
#   bash setup-env-vars.sh /path/to/.env      # file mode
#
# What it does:
#   1. Locates the cPanel nodevenv etc/envvars file
#   2. Backs up the existing envvars file (if any)
#   3. Writes all env vars (as `export VAR="value"` lines) to etc/envvars
#   4. Also writes a .env file in the app root (for Next.js to read directly)
#   5. Sources the activate script to verify vars are loaded
#   6. Touches tmp/restart.txt to restart the app with new env vars
#
# Args:
#   $1 (optional) — path to a .env file with VAR=value lines (file mode)
# =============================================================================
set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration — adjust these paths if your cPanel setup differs.
# ---------------------------------------------------------------------------
APP_ROOT="${APP_ROOT:-/home/aqualit1/lnkicks}"
NODEVENV_ACTIVATE="${NODEVENV_ACTIVATE:-/home/aqualit1/nodevenv/lnkicks/22/bin/activate}"

# Derive the nodevenv base directory from the activate script path.
# e.g. /home/aqualit1/nodevenv/lnkicks/22/bin/activate → /home/aqualit1/nodevenv/lnkicks/22
NODEVENV_DIR="$(dirname "$(dirname "$NODEVENV_ACTIVATE")")"
ENVVARS_FILE="$NODEVENV_DIR/etc/envvars"
APP_ENV_FILE="$APP_ROOT/.env"

ENV_FILE_ARG="${1:-}"

echo "============================================================"
echo "  LN KICKS — Environment Variables Setup"
echo "============================================================"
echo "  App root:        $APP_ROOT"
echo "  nodevenv:        $NODEVENV_DIR"
echo "  envvars target:  $ENVVARS_FILE"
echo "  app .env target: $APP_ENV_FILE"
echo "  Mode:            ${ENV_FILE_ARG:+file ($ENV_FILE_ARG)}${ENV_FILE_ARG:-interactive}"
echo "  Date:            $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "============================================================"
echo ""

# ---------------------------------------------------------------------------
# Step 1: Verify nodevenv exists.
# ---------------------------------------------------------------------------
if [[ ! -f "$NODEVENV_ACTIVATE" ]]; then
  echo "[setup-env] ERROR: nodevenv activate script not found:" >&2
  echo "[setup-env]   $NODEVENV_ACTIVATE" >&2
  echo "[setup-env]" >&2
  echo "[setup-env] Did you create the Node.js app in cPanel?" >&2
  echo "[setup-env] cPanel → Software → Setup Node.js App → Create Application" >&2
  echo "[setup-env]" >&2
  echo "[setup-env] If your nodevenv is at a different path, set the" >&2
  echo "[setup-env] NODEVENV_ACTIVATE environment variable and re-run:" >&2
  echo "[setup-env]   NODEVENV_ACTIVATE=/path/to/activate bash setup-env-vars.sh" >&2
  exit 1
fi

# Create the etc/ directory if it doesn't exist (cPanel usually creates it).
mkdir -p "$(dirname "$ENVVARS_FILE")"
mkdir -p "$APP_ROOT"

# ---------------------------------------------------------------------------
# Step 2: Back up the existing envvars file (if any).
# ---------------------------------------------------------------------------
if [[ -f "$ENVVARS_FILE" ]]; then
  BACKUP_TS=$(date -u '+%Y%m%d-%H%M%S')
  BACKUP_FILE="${ENVVARS_FILE}.backup-${BACKUP_TS}"
  cp -a "$ENVVARS_FILE" "$BACKUP_FILE"
  echo "[setup-env] ✅ Backed up existing envvars → $BACKUP_FILE"
fi
if [[ -f "$APP_ENV_FILE" ]]; then
  BACKUP_TS2=$(date -u '+%Y%m%d-%H%M%S')
  cp -a "$APP_ENV_FILE" "${APP_ENV_FILE}.backup-${BACKUP_TS2}"
  echo "[setup-env] ✅ Backed up existing .env → ${APP_ENV_FILE}.backup-${BACKUP_TS2}"
fi
echo ""

# ---------------------------------------------------------------------------
# Step 3: Collect env var values.
# ---------------------------------------------------------------------------
# We'll store all vars in an array, then write them all at once at the end.
declare -a ENV_LINES=()
declare -a ENVLINES_APP=()  # for .env file (no `export` prefix)

# Helper: add a var to both arrays.
add_var() {
  local key="$1"
  local value="$2"
  if [[ -n "$value" ]]; then
    # For envvars (sourced by activate): use export syntax.
    ENV_LINES+=("export $key=\"$value\"")
    # For .env file (read by Next.js): use plain KEY=value syntax.
    ENVLINES_APP+=("$key=$value")
  fi
}

# Helper: prompt for a var with a default value.
prompt_var() {
  local key="$1"
  local description="$2"
  local default="${3:-}"
  local value

  if [[ -n "$ENV_FILE_ARG" && -f "$ENV_FILE_ARG" ]]; then
    # File mode: read from .env file.
    value=$(grep -E "^${key}=" "$ENV_FILE_ARG" 2>/dev/null | head -1 | sed "s/^${key}=//" | tr -d '"' || true)
    if [[ -n "$value" ]]; then
      echo "  ✅ $key = (from file) $value"
    else
      echo "  ⏭️  $key — not in file, skipping"
    fi
  else
    # Interactive mode.
    if [[ -n "$default" ]]; then
      read -r -p "  $description [$key] (default: $default): " value
      value="${value:-$default}"
    else
      read -r -p "  $description [$key]: " value
    fi
    if [[ -n "$value" ]]; then
      echo "  ✅ $key = $value"
    else
      echo "  ⏭️  $key — skipped (empty)"
    fi
  fi

  add_var "$key" "$value"
}

echo "Collecting environment variables..."
echo "(Press Enter to accept default, or type value. Empty = skip.)"
echo ""

# ─────────────────────────────────────────────────────────────────────
# REQUIRED — app will not work without these.
# ─────────────────────────────────────────────────────────────────────
echo "─── Required variables ───"
prompt_var "NODE_ENV" "Production environment flag" "production"
prompt_var "PORT" "Port to listen on (Passenger usually overrides)" "3000"
prompt_var "HOSTNAME" "Bind address" "0.0.0.0"
prompt_var "NEXT_PUBLIC_SITE_URL" "Public site URL (https://...)" "https://lnkicks.com"
prompt_var "NEXT_PUBLIC_WHATSAPP_NUMBER" "WhatsApp number (country code + number, no +)" "918881286267"
echo ""

# ─────────────────────────────────────────────────────────────────────
# AUTHENTICATION — generate strong random secrets by default.
# ─────────────────────────────────────────────────────────────────────
echo "─── Authentication secrets (press Enter to auto-generate) ───"
JWT_DEFAULT=$(openssl rand -base64 48 2>/dev/null || echo "")
ADMIN_JWT_DEFAULT=$(openssl rand -base64 48 2>/dev/null || echo "")
SESSION_DEFAULT=$(openssl rand -base64 48 2>/dev/null || echo "")
prompt_var "JWT_SECRET" "JWT signing secret (users)" "$JWT_DEFAULT"
prompt_var "ADMIN_JWT_SECRET" "JWT signing secret (admins, MUST be different)" "$ADMIN_JWT_DEFAULT"
prompt_var "SESSION_SECRET" "Session cookie encryption secret" "$SESSION_DEFAULT"
echo ""

# ─────────────────────────────────────────────────────────────────────
# DATABASE — PostgreSQL is the chosen DB for LN KICKS production.
# Recommended hosted providers: Supabase, Neon, Railway, Render.
# Connection strings MUST include ?sslmode=require for managed Postgres.
# ─────────────────────────────────────────────────────────────────────
echo "─── Database (PostgreSQL) ───"
echo "  Using PostgreSQL (Supabase / Neon / Railway / Render / self-hosted)."
echo "  Get the connection string from your provider's dashboard."
echo "  Format: postgresql://user:password@host:5432/dbname?sslmode=require"
echo ""
prompt_var "DATABASE_URL" "PostgreSQL connection URL (pooled — for app runtime)"
prompt_var "DIRECT_URL" "PostgreSQL direct URL (for migrations — bypasses pooler)"
echo ""

# ─────────────────────────────────────────────────────────────────────
# LEGACY MySQL — only used if you explicitly switch to cPanel's MySQL.
# Skip both prompts by pressing Enter — they will be omitted from .env.
# ─────────────────────────────────────────────────────────────────────
echo "─── MySQL (legacy — skip if using PostgreSQL, press Enter on each) ───"
prompt_var "MYSQL_HOST" "MySQL host (legacy)" "localhost"
prompt_var "MYSQL_DATABASE" "MySQL database name (legacy)"
prompt_var "MYSQL_USER" "MySQL username (legacy)"
prompt_var "MYSQL_PASSWORD" "MySQL password (legacy)"
echo ""

# ─────────────────────────────────────────────────────────────────────
# PAYMENT GATEWAY — Stripe, Razorpay, or both.
# ─────────────────────────────────────────────────────────────────────
echo "─── Payment gateway (leave blank if not using) ───"
prompt_var "STRIPE_SECRET_KEY" "Stripe secret key (sk_live_...)"
prompt_var "STRIPE_WEBHOOK_SECRET" "Stripe webhook secret (whsec_...)"
prompt_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "Stripe publishable key (pk_live_...)"
prompt_var "RAZORPAY_KEY_ID" "Razorpay key ID (rzp_live_...)"
prompt_var "RAZORPAY_KEY_SECRET" "Razorpay key secret"
prompt_var "RAZORPAY_WEBHOOK_SECRET" "Razorpay webhook secret"
prompt_var "NEXT_PUBLIC_RAZORPAY_KEY_ID" "Razorpay public key ID"
echo ""

# ─────────────────────────────────────────────────────────────────────
# EMAIL / SMTP
# ─────────────────────────────────────────────────────────────────────
echo "─── Email / SMTP (leave blank to use cPanel local mail) ───"
prompt_var "SMTP_HOST" "SMTP host" "localhost"
prompt_var "SMTP_PORT" "SMTP port" "25"
prompt_var "SMTP_USER" "SMTP username (leave blank for local mail)"
prompt_var "SMTP_PASSWORD" "SMTP password"
prompt_var "SMTP_FROM" "From: header" "LN KICKS <noreply@lnkicks.com>"
echo ""

# ─────────────────────────────────────────────────────────────────────
# SECURITY / RATE LIMITING
# ─────────────────────────────────────────────────────────────────────
echo "─── Security / rate limiting ───"
prompt_var "CORS_ORIGIN" "Allowed CORS origin (your production URL)" "https://lnkicks.com"
prompt_var "RATE_LIMIT_MAX" "Max requests per window" "100"
prompt_var "RATE_LIMIT_WINDOW_MS" "Rate limit window (ms)" "900000"
echo ""

# ─────────────────────────────────────────────────────────────────────
# APP METADATA
# ─────────────────────────────────────────────────────────────────────
echo "─── App metadata ───"
prompt_var "APP_NAME" "App display name" "LN KICKS"
prompt_var "LOG_LEVEL" "Log level (debug/info/warn/error)" "info"
prompt_var "TZ" "Timezone" "Asia/Kolkata"
echo ""

# ---------------------------------------------------------------------------
# Step 4: Write env vars to the cPanel nodevenv etc/envvars file.
# ---------------------------------------------------------------------------
echo "[setup-env] Writing ${#ENV_LINES[@]} env vars to: $ENVVARS_FILE"

{
  echo "# ============================================================="
  echo "# LN KICKS — Environment Variables"
  echo "# Auto-generated by setup-env-vars.sh on $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# This file is sourced by $NODEVENV_ACTIVATE"
  echo "# ============================================================="
  echo ""
  for line in "${ENV_LINES[@]}"; do
    echo "$line"
  done
} > "$ENVVARS_FILE"

echo "[setup-env] ✅ Wrote ${#ENV_LINES[@]} vars to $ENVVARS_FILE"
echo ""

# ---------------------------------------------------------------------------
# Step 5: Also write to .env in app root (for Next.js / dotenv to read).
# ---------------------------------------------------------------------------
echo "[setup-env] Writing ${#ENVLINES_APP[@]} env vars to: $APP_ENV_FILE"

{
  echo "# ============================================================="
  echo "# LN KICKS — Environment Variables (.env)"
  echo "# Auto-generated by setup-env-vars.sh on $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# DO NOT EDIT THIS FILE DIRECTLY — re-run setup-env-vars.sh instead."
  echo "# ============================================================="
  echo ""
  for line in "${ENVLINES_APP[@]}"; do
    echo "$line"
  done
} > "$APP_ENV_FILE"

# Set restrictive permissions on .env (it contains secrets).
chmod 600 "$APP_ENV_FILE"

echo "[setup-env] ✅ Wrote .env to $APP_ENV_FILE (permissions: 600)"
echo ""

# ---------------------------------------------------------------------------
# Step 6: Verify by sourcing activate and checking a few vars.
# ---------------------------------------------------------------------------
echo "[setup-env] Verifying env vars are loaded by nodevenv..."
# shellcheck disable=SC1090
source "$NODEVENV_ACTIVATE"
echo "  NODE_ENV=$NODE_ENV"
echo "  NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL"
echo "  NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER"
if [[ -n "${JWT_SECRET:-}" ]]; then
  echo "  JWT_SECRET=(set, ${#JWT_SECRET} chars)"
fi
echo ""

# ---------------------------------------------------------------------------
# Step 7: Restart the app so it picks up the new env vars.
# ---------------------------------------------------------------------------
echo "[setup-env] Restarting Node.js app to pick up new env vars..."
mkdir -p "$APP_ROOT/tmp"
touch "$APP_ROOT/tmp/restart.txt"
echo "[setup-env] ✅ tmp/restart.txt touched — Passenger will restart on next request"
echo ""

echo "============================================================"
echo "  ✅ Environment variables configured successfully!"
echo "============================================================"
echo ""
echo "  Variables written to:"
echo "    $ENVVARS_FILE    (sourced by nodevenv activate)"
echo "    $APP_ENV_FILE    (Next.js .env file)"
echo ""
echo "  Backups of previous files (if any):"
ls -1 "${ENVVARS_FILE}".backup-* 2>/dev/null || echo "    (no backups — this was the first run)"
echo ""
echo "  Next steps:"
echo "    1. Verify the app is running: curl -I https://your-domain.com"
echo "    2. Check error logs if issues: tail -f ~/logs/*.log"
echo "    3. To update a single var later, re-run this script."
echo ""
