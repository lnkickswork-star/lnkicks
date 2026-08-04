# ⏪ Rollback Procedure

> How to restore the previous production deployment when a new deploy breaks something.

---

## Rollback Overview

The pipeline has **two** rollback mechanisms:

| Mechanism | Trigger | Speed | When to use |
|---|---|---|---|
| **Automatic rollback** | Health check fails after deploy | ~30s | Default — happens without human intervention |
| **Manual rollback** | Operator triggers via GitHub UI or SSH | ~1–2 min | When production breaks AFTER a successful deploy, or when you need to revert a working deploy |

Both restore the most recent backup from `~/lnkicks/releases/latest/`.

---

## How Backups Work

Every deploy (before uploading new code) creates a timestamped backup:

```
/home/aqualit1/lnkicks/releases/
├── 20250805-143022-abc1234/      ← backup from Aug 5, 14:30, commit abc1234
│   ├── .next/
│   ├── public/
│   ├── cpanel/app.js
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.js
│   ├── node_modules/             ← (only if backup was made AFTER install)
│   └── .deploy-manifest.json     ← metadata (git SHA, timestamp, host)
├── 20250805-133000-def5678/      ← backup from earlier deploy
├── 20250805-120000-ghi9012/
└── latest → 20250805-143022-abc1234/   ← symlink to most recent backup
```

The `latest` symlink always points to the most recent backup. `rollback.sh` follows this symlink to find the version to restore.

**Retention:** Only the 10 most recent backups are kept. Older ones are pruned automatically by `backup-current.sh`.

---

## Automatic Rollback (Default)

This happens without any human action. The flow:

1. Deploy job uploads new code to `current/`
2. Deploy job runs `health-check.sh`
3. If health check fails (after retries up to 90s):
   - Deploy job SSHes into server
   - Runs `rollback.sh`
   - `rollback.sh`:
     - Locates `releases/latest/`
     - Moves broken `current/` aside to `releases/failed-<timestamp>/`
     - Copies backup → `current/`
     - Re-runs `npm ci --omit=dev` (in case deps changed)
     - Touches `tmp/restart.txt`
   - Deploy job waits 20s
   - Re-runs `health-check.sh` to verify rollback worked
4. If rollback ALSO fails:
   - Deploy job exits with code 1
   - GitHub Actions shows the deploy as failed
   - Slack/email notification fires (if configured)
   - **Manual intervention required** — see [Emergency Recovery](#emergency-recovery-when-both-deploy-and-rollback-fail) below

### What you see in GitHub Actions

- **Deploy job:** ❌ Failed
- **Step "Auto-rollback if health check failed":** Shows the rollback commands and output
- **Step "Re-checking health after rollback...":** Shows whether rollback succeeded

---

## Manual Rollback via GitHub UI (Recommended)

Use this when:
- Production breaks AFTER a deploy that initially looked healthy
- You need to revert a deploy that turned out to have a bug
- You want to roll back WITHOUT deploying new code

### Steps

1. Go to: **GitHub repo → Actions tab**
2. Select **"Deploy to Production (cPanel)"** workflow (left sidebar)
3. Click the **Run workflow** button (right side, blue dropdown)
4. In the dropdown:
   - **Branch:** `main`
   - **force_rollback:** ✅ Check this box
5. Click the green **Run workflow** button
6. A new workflow run starts, but it skips the build/quality-gate stages
7. The **"Rollback to previous deployment"** job runs:
   - SSHes into server
   - Runs `rollback.sh`
   - Waits for health check
8. Total time: ~1–2 minutes

### What happens

- The `rollback` job runs (NOT the `deploy` job)
- It skips the `quality-gate` job entirely (no build needed)
- It uploads no new code — just restores the backup
- The previous (working) version goes live

---

## Manual Rollback via SSH (Fallback)

Use this when:
- GitHub Actions is down
- GitHub Secrets are broken
- You need to roll back faster than GitHub UI allows

### Steps

```bash
# 1. SSH into the server
ssh -p 22 aqualit1@your-host.com

# 2. Run the rollback script
bash /home/aqualit1/lnkicks/scripts/deploy/rollback.sh /home/aqualit1/lnkicks

# 3. Wait for it to complete (it prints progress to console)

# 4. Verify production is healthy
curl -I https://your-domain.com
# Expect: HTTP/2 200
```

### What the script does

`rollback.sh` performs these steps in order:

1. **Locates backup:** Follows `releases/latest` symlink
2. **Validates backup:** Checks that `package.json` and `.next/` exist in the backup
3. **Moves broken code aside:** `mv current/ releases/failed-<timestamp>/`
4. **Copies backup to current:** `cp -a releases/latest/ current/`
5. **Reinstalls deps:** `cd current/ && npm ci --omit=dev`
6. **Restarts Passenger:** `touch current/tmp/restart.txt`
7. **Prints summary:** What was rolled back, where the failed code is preserved

### Safety guarantees

- If the backup is missing or incomplete → script aborts, leaves `current/` untouched
- If the copy fails → script restores the broken `current/` (better broken-than-known than missing)
- The broken deployment is preserved at `releases/failed-<timestamp>/` for debugging

---

## Rolling Back to a Specific Version

Sometimes you don't want the "latest" backup — you want a specific older deploy.

### Step 1: List all available backups

```bash
ssh -p 22 aqualit1@your-host.com
ls -1dt /home/aqualit1/lnkicks/releases/*/ | head -10
```

Output:
```
/home/aqualit1/lnkicks/releases/20250805-143022-abc1234/
/home/aqualit1/lnkicks/releases/20250805-133000-def5678/
/home/aqualit1/lnkicks/releases/20250805-120000-ghi9012/
/home/aqualit1/lnkicks/releases/20250804-180000-jkl3456/
/home/aqualit1/lnkicks/releases/20250804-150000-mno7890/
/home/aqualit1/lnkicks/releases/failed-20250805-144000/
/home/aqualit1/lnkicks/releases/failed-20250804-181000/
```

### Step 2: Pick the version to restore

Look at the timestamp (format: `YYYYMMDD-HHMMSS`) and the git short SHA (last 7 chars). Pick the one you want.

### Step 3: Inspect the backup before restoring

```bash
BACKUP=/home/aqualit1/lnkicks/releases/20250804-180000-jkl3456

# Check the manifest
cat "$BACKUP/.deploy-manifest.json"

# Verify the build is intact
ls "$BACKUP/.next/BUILD_ID"
cat "$BACKUP/.next/BUILD_ID"

# Check the git commit it was built from
cd "$BACKUP"
git log -1 --oneline jkl3456 2>/dev/null || echo "Not a git repo (expected)"
```

### Step 4: Restore it manually

```bash
# Move current (broken) aside
mv /home/aqualit1/lnkicks/current /home/aqualit1/lnkicks/releases/manual-rollback-$(date -u '+%Y%m%d-%H%M%S')

# Copy the chosen backup to current
cp -a "$BACKUP" /home/aqualit1/lnkicks/current

# Reinstall deps (in case the chosen version has different deps)
cd /home/aqualit1/lnkicks/current
npm ci --omit=dev --no-audit --no-fund

# Restart Passenger
mkdir -p tmp
touch tmp/restart.txt

# Wait for restart
sleep 5

# Verify
curl -I https://your-domain.com
```

### Step 5: Update the `latest` symlink (optional)

If you want future rollbacks to restore THIS version (not the broken deploy you just rolled back from):

```bash
ln -sfn "$BACKUP" /home/aqualit1/lnkicks/releases/latest
```

> **Warning:** Only do this if you're sure the version you restored is good. Otherwise leave `latest` pointing to the actual latest backup.

---

## Emergency Recovery (When Both Deploy AND Rollback Fail)

This is the worst case: the new deploy broke production, and rolling back ALSO failed (e.g., the backup was corrupt, or `npm ci` failed during rollback).

### Step 1: Diagnose

```bash
ssh -p 22 aqualit1@your-host.com

# Check what's in current/
ls -la /home/aqualit1/lnkicks/current/
# Is .next/ there? Is node_modules/ there? Is cpanel/app.js there?

# Check error log
tail -100 /home/aqualit1/lnkicks/logs/*.log
# Or:
tail -100 ~/logs/lnkicks.com.error.log

# Try to start the app manually to see errors
cd /home/aqualit1/lnkicks/current
node cpanel/app.js
# Errors will print to console — read them carefully
```

### Step 2: Identify a known-good backup

```bash
ls -1dt /home/aqualit1/lnkicks/releases/*/ | head -20

# Try each one (newest first), skipping any with "failed-" or "manual-rollback-" prefix
# For each candidate:
BACKUP=/home/aqualit1/lnkicks/releases/20250804-150000-mno7890
test -f "$BACKUP/.next/BUILD_ID" && echo "OK: build intact" || echo "BAD: no BUILD_ID"
test -f "$BACKUP/cpanel/app.js" && echo "OK: app.js present" || echo "BAD: no app.js"
test -f "$BACKUP/package.json" && echo "OK: package.json present" || echo "BAD: no package.json"
```

### Step 3: Manually restore

Follow the steps in [Rolling Back to a Specific Version](#rolling-back-to-a-specific-version) above.

### Step 4: If NO backups are usable

This means either:
- The releases/ directory was deleted (disk full, accidental cleanup)
- All backups are corrupt (very unlikely — backups are made BEFORE any code change)

**Last resort:** Rebuild from scratch.

```bash
# 1. Find the last known-good git commit (check git log)
cd /home/aqualit1/lnkicks-src  # or wherever you cloned the repo
git log --oneline -20

# 2. Check out a known-good commit
git checkout <commit-sha>

# 3. Run the manual deploy script
bash scripts/deploy/deploy.sh /home/aqualit1/lnkicks \
  git@github.com:lnkickswork-star/lnkicks.git \
  https://your-domain.com
```

### Step 5: Prevent recurrence

After recovery, investigate why the rollback failed:

- **Disk full?** → Set up monitoring/alerting on disk usage
- **Backup was incomplete?** → Check `backup-current.sh` logs for errors
- **npm ci failed during rollback?** → Check if `package-lock.json` was modified mid-deploy
- **Passenger didn't restart?** → Verify `tmp/restart.txt` touch works (sometimes cPanel disables it)

Add monitoring to catch the issue earlier next time.

---

## Rollback Limitations

### What rollback CANNOT do

- **Undo database migrations:** If the deploy ran a DB migration that changed schema, rollback restores the CODE but not the DATABASE. You'll need to manually write a down-migration.
- **Undo external API calls:** If the deploy sent emails, processed payments, or called third-party APIs, those side effects are NOT reverted.
- **Restore user sessions:** If `JWT_SECRET` changed, all existing JWTs are invalid. Users will need to log in again.

### What rollback DOES preserve

- **Code state:** Exactly the previous version (from backup)
- **Static assets:** Images, fonts, etc. from the previous version
- **Dependencies:** node_modules/ from the previous version (reinstalled via `npm ci --omit=dev`)
- **Configuration:** next.config.js from the previous version

---

## Testing Rollbacks

**Best practice:** Test the rollback procedure in a staging environment before relying on it in production.

### Test scenario

1. Deploy version A (working)
2. Deploy version B (intentionally broken — e.g., add `throw new Error('test')` to a page)
3. Verify automatic rollback fires
4. Verify version A is restored
5. Try manual rollback via GitHub UI
6. Try manual rollback via SSH
7. Document any issues found

### What to look for

- Did `backup-current.sh` create the backup correctly?
- Did `health-check.sh` detect the broken deploy?
- Did `rollback.sh` restore correctly?
- Did Passenger pick up the restart?
- How long did the entire rollback take?

---

## Rollback Decision Tree

```
Production is broken
│
├── Did the deploy JUST happen (< 5 min ago)?
│   │
│   ├── YES → Did automatic rollback fire?
│   │   │
│   │   ├── YES → Did rollback work?
│   │   │   │
│   │   │   ├── YES → Investigate root cause, fix on feature branch, redeploy
│   │   │   │
│   │   │   └── NO → See Emergency Recovery above
│   │   │
│   │   └── NO (health check passed initially) → Use Manual Rollback via GitHub UI
│   │
│   └── NO (broke after working for a while) → Use Manual Rollback via GitHub UI
│
└── Is GitHub Actions available?
    │
    ├── YES → Use Manual Rollback via GitHub UI
    │
    └── NO → Use Manual Rollback via SSH
```
