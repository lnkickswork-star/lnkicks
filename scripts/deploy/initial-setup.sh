#!/usr/bin/env bash
# =============================================================================
# initial-setup.sh — One-time server bootstrap (run on the cPanel server)
# =============================================================================
#
# Run this ONCE on a fresh cPanel account before the first GitHub Actions
# deploy. It creates the directory layout the deploy workflow expects.
#
# NOTE: This script assumes you have ALREADY created the Node.js app in
# cPanel → Setup Node.js App. The cPanel app setup creates the nodevenv
# directory automatically. This script creates the app root + releases dir.
#
# Usage (run from your local machine via SSH, OR on the server directly):
#   ssh -p <PORT> <USER>@<HOST> 'bash -s' < scripts/deploy/initial-setup.sh \
#     <APP_ROOT> <NODEVENV_ACTIVATE> <RELEASES_DIR>
#
# Or, if you've already cloned the repo on the server:
#   cd ~/lnkicks && bash scripts/deploy/initial-setup.sh \
#     /home/aqualit1/lnkicks \
#     /home/aqualit1/nodevenv/lnkicks/22/bin/activate \
#     /home/aqualit1/lnkicks-releases
#
# Args:
#   APP_ROOT          — where the app will live (default: $HOME/lnkicks)
#   NODEVENV_ACTIVATE — path to activate script (auto-detected if omitted)
#   RELEASES_DIR      — where backups will live (default: $HOME/lnkicks-releases)
# =============================================================================
set -euo pipefail

APP_ROOT="${1:-$HOME/lnkicks}"
NODEVENV_ACTIVATE="${2:-}"
RELEASES_DIR="${3:-$HOME/lnkicks-releases}"

# Auto-detect nodevenv if not provided.
if [[ -z "$NODEVENV_ACTIVATE" ]]; then
  # Try common cPanel nodevenv locations.
  for candidate in \
    "$HOME/nodevenv/lnkicks/22/bin/activate" \
    "$HOME/nodevenv/lnkicks/20/bin/activate" \
    "$HOME/nodevenv/lnkicks/18/bin/activate"; do
    if [[ -f "$candidate" ]]; then
      NODEVENV_ACTIVATE="$candidate"
      break
    fi
  done
fi

echo "============================================================"
echo "  LN KICKS — Initial Server Setup"
echo "============================================================"
echo "  App root:        $APP_ROOT"
echo "  nodevenv:        ${NODEVENV_ACTIVATE:-(not found — will be auto-detected later)}"
echo "  Releases dir:    $RELEASES_DIR"
echo "  User:            $(whoami)"
echo "  Host:            $(hostname -f 2>/dev/null || hostname)"
echo "  Date:            $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "============================================================"
echo ""

# ---------------------------------------------------------------------------
# Step 1: Verify required tools are installed
# ---------------------------------------------------------------------------
echo "[1/5] Verifying required tools..."

MISSING=()
for cmd in git ssh rsync curl; do
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "  ✅ $cmd → $(command -v "$cmd")"
  else
    echo "  ❌ $cmd — NOT FOUND"
    MISSING+=("$cmd")
  fi
done

# Node.js check — try nodevenv first, then system node.
if [[ -n "$NODEVENV_ACTIVATE" && -f "$NODEVENV_ACTIVATE" ]]; then
  echo "  ✅ nodevenv activate found at: $NODEVENV_ACTIVATE"
  # Source it to check the Node version.
  # shellcheck disable=SC1090
  source "$NODEVENV_ACTIVATE"
  echo "  ✅ Node.js (from nodevenv): $(node --version)"
  echo "  ✅ npm (from nodevenv):     $(npm --version)"
else
  echo "  ⚠️  nodevenv activate not found at common locations."
  echo "     This is expected BEFORE you create the Node.js app in cPanel."
  echo "     Create the app first in cPanel → Setup Node.js App, then re-run this script."
  echo ""
  echo "     Falling back to system Node.js (if available):"
  if command -v node >/dev/null 2>&1; then
    echo "  ✅ node → $(command -v node) ($(node --version))"
    echo "  ✅ npm  → $(command -v npm) ($(npm --version))"
  else
    echo "  ❌ node — NOT FOUND (system)"
    MISSING+=("node")
  fi
fi

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo ""
  echo "[setup] ERROR: Missing required tools: ${MISSING[*]}" >&2
  echo "[setup] On cPanel shared hosting, these are usually available by default." >&2
  echo "[setup] If 'node' is missing, create the Node.js app in cPanel first." >&2
  exit 1
fi
echo ""

# Node.js version check — warn if not 22.x
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR=$(node -e 'console.log(process.versions.node.split(".")[0])' 2>/dev/null || echo "0")
  if [[ "$NODE_MAJOR" != "22" ]]; then
    echo "  ⚠️  WARNING: Node.js $NODE_MAJOR detected, but the project is built with Node 22 in CI."
    echo "     This is OK if cPanel's Node.js app is configured to use Node 22 (check cPanel UI)."
    echo "     The GitHub Actions workflow uses Node 22 to match cPanel's nodevenv path."
  fi
fi
echo ""

# ---------------------------------------------------------------------------
# Step 2: Create the directory layout
# ---------------------------------------------------------------------------
echo "[2/5] Creating directory layout..."
mkdir -p "$APP_ROOT"
mkdir -p "$APP_ROOT/tmp"
mkdir -p "$APP_ROOT/scripts/deploy"
mkdir -p "$RELEASES_DIR"
echo "  ✅ $APP_ROOT/              (live production code — code deploys directly here)"
echo "  ✅ $APP_ROOT/tmp/          (Passenger restart.txt lives here)"
echo "  ✅ $APP_ROOT/scripts/deploy/  (deployment scripts)"
echo "  ✅ $RELEASES_DIR/          (timestamped backups — OUTSIDE app root)"
echo ""

# ---------------------------------------------------------------------------
# Step 3: Verify SSH key exists (for git over SSH if needed)
# ---------------------------------------------------------------------------
echo "[3/5] Checking SSH keys..."
SSH_DIR="$HOME/.ssh"
if [[ ! -d "$SSH_DIR" ]]; then
  mkdir -p "$SSH_DIR"
  chmod 700 "$SSH_DIR"
  echo "  ✅ Created $SSH_DIR"
fi

if [[ -f "$SSH_DIR/id_rsa" ]]; then
  echo "  ✅ SSH private key found: $SSH_DIR/id_rsa"
elif [[ -f "$SSH_DIR/id_ed25519" ]]; then
  echo "  ✅ SSH private key found: $SSH_DIR/id_ed25519"
else
  echo "  ⚠️  No SSH private key found in $SSH_DIR"
  echo "     (You already generated one — /home/aqualit1/.ssh/id_rsa — so this is fine.)"
  echo "     GitHub Actions will use the key you've added to its Secrets."
fi
echo ""

# ---------------------------------------------------------------------------
# Step 4: Copy deployment scripts into place
# ---------------------------------------------------------------------------
echo "[4/5] Copying deployment scripts..."
SCRIPT_SOURCE="${BASH_SOURCE[0]}"
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_SOURCE")" && pwd)"

if [[ -f "$SCRIPT_DIR/backup-current.sh" ]]; then
  cp -v "$SCRIPT_DIR"/*.sh "$APP_ROOT/scripts/deploy/"
  chmod +x "$APP_ROOT/scripts/deploy/"*.sh
  echo "  ✅ Scripts copied to $APP_ROOT/scripts/deploy/"
else
  echo "  ⚠️  Could not find sibling scripts next to initial-setup.sh"
  echo "     This is expected if you're running initial-setup.sh from a cloned"
  echo "     repo BEFORE the first deploy. The deploy workflow will copy them."
fi
echo ""

# ---------------------------------------------------------------------------
# Step 5: Print next-step instructions
# ---------------------------------------------------------------------------
echo "[5/5] Next steps:"
echo ""
echo "  1. In cPanel → Software → Setup Node.js App (if not already created):"
echo "     - Node.js version:    22  (MUST match the nodevenv path /22/)"
echo "     - Application mode:   Production"
echo "     - Application root:   $APP_ROOT"
echo "     - Application URL:    <your production domain>"
echo "     - Startup file:       cpanel/app.js"
echo "     - Add environment variables (see docs/ENVIRONMENT-VARIABLES.md)"
echo ""
echo "  2. Set up env vars by running (ON THE SERVER):"
echo "       bash $APP_ROOT/scripts/deploy/setup-env-vars.sh"
echo "     This will write env vars to the cPanel nodevenv etc/envvars file."
echo ""
echo "  3. In GitHub repo → Settings → Secrets and variables → Actions:"
echo "     Add these secrets (see docs/DEPLOYMENT.md for the full list):"
echo "       SSH_HOST              — your cPanel server hostname"
echo "       SSH_PORT              — 22 (or your host's port)"
echo "       SSH_USER              — $(whoami)"
echo "       SSH_PRIVATE_KEY       — (contents of your ~/.ssh/id_rsa on this server)"
echo "       APP_ROOT              — $APP_ROOT"
echo "       NODEVENV_PATH         — $NODEVENV_ACTIVATE"
echo "       PRODUCTION_DOMAIN     — https://your-domain.com"
echo "       NEXT_PUBLIC_SITE_URL  — https://your-domain.com"
echo "       NEXT_PUBLIC_WHATSAPP_NUMBER — 918881286267"
echo ""
echo "  4. To get the SSH_PRIVATE_KEY contents to paste into GitHub Secrets:"
echo "       cat ~/.ssh/id_rsa"
echo "     Copy the ENTIRE output including '-----BEGIN ... PRIVATE KEY-----'"
echo "     and '-----END ... PRIVATE KEY-----' lines."
echo ""
echo "  5. Push a commit to main branch — GitHub Actions will deploy automatically."
echo ""
echo "  6. After first deploy, verify with:"
echo "       curl -I https://your-domain.com"
echo ""
echo "============================================================"
echo "  ✅ Initial setup complete."
echo "============================================================"
