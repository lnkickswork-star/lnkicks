#!/usr/bin/env bash
# =============================================================================
# backup-current.sh — Snapshot the current production deployment for rollback
# =============================================================================
#
# Called by the GitHub Actions deploy workflow BEFORE uploading new code.
# Creates a timestamped copy of the `current/` directory under `releases/`.
# Also prunes old backups to keep the disk from filling up (keeps last 10).
#
# Usage (invoked over SSH from GitHub Actions):
#   bash backup-current.sh <APP_ROOT> <GIT_SHA>
#
# Args:
#   APP_ROOT  — absolute path to the app root (e.g. /home/aqualit1/lnkicks)
#   GIT_SHA   — full git commit SHA being deployed (used for traceability)
#
# Layout produced on the server:
#   $APP_ROOT/
#   ├── current/          ← live production code (rsync target)
#   ├── releases/
#   │   ├── 20250101-120000-abc1234/   ← timestamped backup
#   │   ├── 20250101-110000-def5678/
#   │   └── ...
#   ├── shared/           ← (reserved for future shared state, e.g. uploads)
#   └── scripts/deploy/   ← these scripts
# =============================================================================
set -euo pipefail

APP_ROOT="${1:?APP_ROOT argument required}"
GIT_SHA="${2:?GIT_SHA argument required}"

CURRENT_DIR="$APP_ROOT/current"
RELEASES_DIR="$APP_ROOT/releases"

# If no current deployment exists yet (first-ever deploy), nothing to back up.
if [[ ! -d "$CURRENT_DIR" ]]; then
  echo "[backup-current] No existing 'current/' directory — first deployment, skipping backup."
  exit 0
fi

# Timestamp + short SHA for the backup directory name.
TIMESTAMP=$(date -u '+%Y%m%d-%H%M%S')
SHORT_SHA=$(echo "$GIT_SHA" | cut -c1-7)
BACKUP_DIR="$RELEASES_DIR/$TIMESTAMP-$SHORT_SHA"

echo "[backup-current] Backing up $CURRENT_DIR → $BACKUP_DIR"
mkdir -p "$RELEASES_DIR"

# Use `cp -a` to preserve permissions, ownership, and symlinks.
# This is fast on the same filesystem (uses CoW on btrfs/Xfs, hardlinks on ext4
# when --reflink=auto is supported — but cp -a is universally safe).
cp -a "$CURRENT_DIR" "$BACKUP_DIR"

# Write a manifest with deploy metadata for debugging / auditing.
cat > "$BACKUP_DIR/.deploy-manifest.json" <<EOF
{
  "backed_up_at": "$(date -u '+%Y-%m-%dT%H:%M:%SZ')",
  "git_sha": "$GIT_SHA",
  "backed_up_by": "${USER:-unknown}",
  "host": "$(hostname -f 2>/dev/null || hostname)"
}
EOF

# Update the "latest backup" pointer symlink — used by rollback.sh to find
# the most recent good version without parsing directory names.
ln -sfn "$BACKUP_DIR" "$RELEASES_DIR/latest"

echo "[backup-current] Backup created: $BACKUP_DIR"
echo "[backup-current] 'latest' pointer updated → $RELEASES_DIR/latest"

# Prune: keep the 10 most recent backups, delete older ones.
# This prevents the disk from slowly filling up over months of deploys.
echo "[backup-current] Pruning old backups (keeping last 10)..."
cd "$RELEASES_DIR"
# List directories (not symlinks), newest first, skip the first 10, delete rest.
ls -1dt */ 2>/dev/null | tail -n +11 | while read -r old_dir; do
  echo "[backup-current] Removing old backup: $old_dir"
  # ${RELEASES_DIR:?} ensures this never expands to / (defensive against
  # a bug where RELEASES_DIR is somehow empty — would be catastrophic).
  rm -rf -- "${RELEASES_DIR:?}/${old_dir%/}"
done

echo "[backup-current] Done. Current backups:"
ls -1dt "$RELEASES_DIR"/*/ 2>/dev/null | head -n 10 || true
