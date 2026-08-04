#!/usr/bin/env bash
# =============================================================================
# initial-setup.sh — One-time server bootstrap (run on the cPanel server)
# =============================================================================
#
# Run this ONCE on a fresh cPanel account before the first GitHub Actions
# deploy. It creates the directory layout the deploy workflow expects.
#
# Usage (run from your local machine via SSH):
#   ssh -p <PORT> <USER>@<HOST> 'bash -s' < scripts/deploy/initial-setup.sh <APP_ROOT>
#
# Or, if you've already cloned the repo on the server:
#   cd ~/lnkicks && bash scripts/deploy/initial-setup.sh ~/lnkicks
#
# Args:
#   APP_ROOT — absolute path where the app will live (e.g. /home/aqualit1/lnkicks)
# =============================================================================
set -euo pipefail

APP_ROOT="${1:-$HOME/lnkicks}"

echo "============================================================"
echo "  LN KICKS — Initial Server Setup"
echo "============================================================"
echo "  App root: $APP_ROOT"
echo "  User:     $(whoami)"
echo "  Host:     $(hostname -f 2>/dev/null || hostname)"
echo "  Date:     $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "============================================================"
echo ""

# ---------------------------------------------------------------------------
# Step 1: Verify required tools are installed
# ---------------------------------------------------------------------------
echo "[1/6] Verifying required tools..."

MISSING=()
for cmd in node npm git ssh rsync curl; do
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "  ✅ $cmd → $(command -v "$cmd")"
  else
    echo "  ❌ $cmd — NOT FOUND"
    MISSING+=("$cmd")
  fi
done

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo ""
  echo "[setup] ERROR: Missing required tools: ${MISSING[*]}" >&2
  echo "[setup] On cPanel shared hosting, these are usually available by default." >&2
  echo "[setup] If 'node' is missing, contact your host or use cPanel →" >&2
  echo "[setup]   Software → Setup Node.js App to install a Node.js version." >&2
  exit 1
fi

echo ""
echo "  Node.js version: $(node --version)"
echo "  npm version:     $(npm --version)"
echo "  rsync version:   $(rsync --version | head -1)"
echo ""

# Node.js version check — warn if not 20.x
NODE_MAJOR=$(node -e 'console.log(process.versions.node.split(".")[0])' 2>/dev/null || echo "0")
if [[ "$NODE_MAJOR" != "20" ]]; then
  echo "  ⚠️  WARNING: Node.js $NODE_MAJOR detected, but this project targets Node 20 LTS."
  echo "     If cPanel's 'Setup Node.js App' uses a different version, builds may differ."
  echo "     Recommended: set Node.js version to 20 in cPanel → Setup Node.js App."
fi
echo ""

# ---------------------------------------------------------------------------
# Step 2: Create the directory layout
# ---------------------------------------------------------------------------
echo "[2/6] Creating directory layout..."
mkdir -p "$APP_ROOT"
mkdir -p "$APP_ROOT/current"
mkdir -p "$APP_ROOT/releases"
mkdir -p "$APP_ROOT/shared"
mkdir -p "$APP_ROOT/scripts/deploy"
echo "  ✅ $APP_ROOT/"
echo "  ✅ $APP_ROOT/current/   (live production code)"
echo "  ✅ $APP_ROOT/releases/  (timestamped backups)"
echo "  ✅ $APP_ROOT/shared/    (reserved for future use)"
echo "  ✅ $APP_ROOT/scripts/deploy/  (deployment scripts)"
echo ""

# ---------------------------------------------------------------------------
# Step 3: Verify SSH key exists (for git over SSH if needed)
# ---------------------------------------------------------------------------
echo "[3/6] Checking SSH keys..."
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
echo "[4/6] Copying deployment scripts..."
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
# Step 5: Create a placeholder .gitignore-safe empty state for current/
# ---------------------------------------------------------------------------
echo "[5/6] Creating placeholder files (will be overwritten by first deploy)..."

# Create a placeholder so current/ isn't empty (helps with rsync --delete
# on the very first deploy — rsync refuses to delete a non-empty target
# unless it has at least one file to anchor the operation).
if [[ ! -f "$APP_ROOT/current/.placeholder" ]]; then
  cat > "$APP_ROOT/current/.placeholder" <<EOF
This file is a placeholder. It will be removed on the first real deploy.
Do not edit. Do not delete manually.
EOF
fi
echo "  ✅ Placeholder created"
echo ""

# ---------------------------------------------------------------------------
# Step 6: Print next-step instructions
# ---------------------------------------------------------------------------
echo "[6/6] Next steps:"
echo ""
echo "  1. In cPanel → Software → Setup Node.js App → Create Application:"
echo "     - Node.js version:    20"
echo "     - Application mode:   Production"
echo "     - Application root:   $APP_ROOT/current"
echo "     - Application URL:    <your production domain>"
echo "     - Startup file:       cpanel/app.js"
echo "     - Add environment variables (see docs/ENVIRONMENT-VARIABLES.md)"
echo ""
echo "  2. In GitHub repo → Settings → Secrets and variables → Actions:"
echo "     Add these secrets (see docs/DEPLOYMENT.md for the full list):"
echo "       SSH_HOST              — $SSH_HOST_VALUE"
echo "       SSH_PORT              — 22 (or your host's port)"
echo "       SSH_USER              — $(whoami)"
echo "       SSH_PRIVATE_KEY       — (contents of your ~/.ssh/id_rsa on this server)"
echo "       APP_ROOT              — $APP_ROOT"
echo "       PRODUCTION_DOMAIN     — https://your-domain.com"
echo "       NEXT_PUBLIC_SITE_URL  — https://your-domain.com"
echo ""
echo "  3. To get the SSH_PRIVATE_KEY contents to paste into GitHub Secrets:"
echo "       cat ~/.ssh/id_rsa"
echo "     Copy the ENTIRE output including '-----BEGIN ... PRIVATE KEY-----'"
echo "     and '-----END ... PRIVATE KEY-----' lines."
echo ""
echo "  4. Push a commit to main branch — GitHub Actions will deploy automatically."
echo ""
echo "  5. After first deploy, verify with:"
echo "       curl -I https://your-domain.com"
echo ""
echo "============================================================"
echo "  ✅ Initial setup complete."
echo "============================================================"
