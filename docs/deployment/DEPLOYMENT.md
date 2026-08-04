# 🚀 LN KICKS — Production Deployment Guide

> **One-line summary:** Push to `main` → GitHub Actions builds → uploads to cPanel → restarts Node.js app → verifies health → auto-rolls back if broken.

---

## 📋 Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [First-Time Setup](#3-first-time-setup)
4. [Daily Deployment Workflow](#4-daily-deployment-workflow)
5. [Pipeline Stages Explained](#5-pipeline-stages-explained)
6. [Monitoring & Logs](#6-monitoring--logs)
7. [Troubleshooting](#7-troubleshooting)
8. [Related Documents](#8-related-documents)

---

## 1. Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                         DEVELOPER MACHINE                              │
│                                                                        │
│   git push origin main                                                 │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              GITHUB                                    │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐  │
│   │  .github/workflows/ci.yml        (existing — quality gate)      │  │
│   │  • npm ci                                                         │  │
│   │  • tsc --noEmit                                                   │  │
│   │  • next lint                                                      │  │
│   │  • next build (matrix: Node 20, 22)                              │  │
│   │  • TruffleHog secret scan                                         │  │
│   └────────────────────────────────┬───────────────────────────────┘  │
│                                    │                                   │
│   ┌────────────────────────────────▼───────────────────────────────┐  │
│   │  .github/workflows/deploy.yml    (NEW — deployment pipeline)   │  │
│   │  • Triggered on push to main (after CI passes)                  │  │
│   │  • Triggered manually (Run workflow button)                     │  │
│   │                                                                  │  │
│   │  Job: quality-gate                                               │  │
│   │    1. npm ci                                                     │  │
│   │    2. npm run type-check                                         │  │
│   │    3. npm run lint                                               │  │
│   │    4. npm run build (with NEXT_PUBLIC_* secrets)                │  │
│   │    5. Upload build artifact                                      │  │
│   │                                                                  │  │
│   │  Job: deploy                                                     │  │
│   │    1. Download build artifact                                   │  │
│   │    2. Configure SSH key from secret                              │  │
│   │    3. Upload deployment scripts → $APP_ROOT/scripts/deploy/      │  │
│   │    4. Backup current/ → releases/<timestamp>/                   │  │
│   │    5. rsync .next/ public/ cpanel/app.js etc. → current/         │  │
│   │    6. SSH: npm ci --omit=dev  (install prod deps)                │  │
│   │    7. SSH: touch tmp/restart.txt  (Passenger restart)            │  │
│   │    8. Health check (curl homepage, product page, etc.)          │  │
│   │    9. If unhealthy → auto-rollback → re-check                   │  │
│   └────────────────────────────────┬───────────────────────────────┘  │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                                 │ SSH (port 22) + rsync
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  cPanel SHARED HOSTING (Node.js)                       │
│                                                                        │
│   /home/aqualit1/                                                      │
│   ├── lnkicks/                          ← APP_ROOT                     │
│   │   ├── current/                      ← live production code         │
│   │   │   ├── .next/                    ← Next.js build output         │
│   │   │   ├── public/                   ← static assets                │
│   │   │   ├── cpanel/app.js             ← Passenger entry point        │
│   │   │   ├── package.json                                             │
│   │   │   ├── package-lock.json                                        │
│   │   │   ├── next.config.js                                           │
│   │   │   ├── node_modules/             ← prod deps only               │
│   │   │   └── tmp/restart.txt           ← Passenger restart trigger    │
│   │   │                                                                │
│   │   ├── releases/                     ← timestamped backups          │
│   │   │   ├── 20250101-120000-abc1234/                                 │
│   │   │   ├── 20250101-110000-def5678/                                 │
│   │   │   └── latest → (symlink to most recent)                       │
│   │   │                                                                │
│   │   ├── shared/                       ← (reserved for uploads)       │
│   │   └── scripts/deploy/               ← server-side deploy scripts   │
│   │                                                                    │
│   ├── logs/                             ← Apache/Passenger logs        │
│   │   ├── lnkicks.com.log                                              │
│   │   └── lnkicks.com.error.log                                        │
│   └── .ssh/id_rsa                       ← SSH key (already generated)  │
│                                                                        │
│   cPanel → Setup Node.js App                                           │
│   - App root:    /home/aqualit1/lnkicks/current                       │
│   - Startup:     cpanel/app.js                                         │
│   - Node.js:     v20                                                   │
│   - Mode:        Production                                            │
│   - URL:         https://your-domain.com                              │
│                                                                        │
│   Phusion Passenger                                                    │
│   - Watches current/tmp/restart.txt                                    │
│   - On change: gracefully restarts Node.js process                    │
│   - Inbound requests → cpanel/app.js → next.js handler                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Prerequisites

### 2.1 On the cPanel server

| Requirement | How to verify | Notes |
|---|---|---|
| cPanel account with Node.js support | cPanel → Software → "Setup Node.js App" visible | Most cPanel shared hosts include this |
| SSH access enabled | `ssh -p 22 aqualit1@your-host` works | Some hosts disable SSH by default — request enablement |
| Node.js 20 LTS available | `node --version` shows `v20.x.x` | cPanel may have a different Node version on CLI vs Passenger — set 20 in the app config |
| npm available | `npm --version` | Bundled with Node.js |
| rsync available | `rsync --version` | Used for fast incremental uploads |
| SSH key pair generated | `ls ~/.ssh/id_rsa` | ✅ Already done — key at `/home/aqualit1/.ssh/id_rsa` |
| `~/.ssh/authorized_keys` contains the public key | `cat ~/.ssh/authorized_keys \| grep "$(cat ~/.ssh/id_rsa.pub)"` | Required so the SSH key can be used to log in |

### 2.2 On GitHub

| Requirement | How to verify |
|---|---|
| Repository admin access | Repo → Settings → Secrets visible |
| GitHub Actions enabled | Repo → Settings → Actions → General → "Allow all actions" |
| `main` branch protected (recommended) | Repo → Settings → Branches → Branch protection rules |

### 2.3 Local machine

- `git` (any version ≥ 2.30)
- An SSH client (for emergency server access)
- A text editor (for editing GitHub Secrets)

---

## 3. First-Time Setup

Follow these steps **once** to wire up the pipeline. After this, deploys are automatic.

### Step 3.1 — Verify deployment files are committed

The following files must exist in your repo (they were created by this setup):

```
.github/workflows/deploy.yml         ← CI/CD pipeline
cpanel/app.js                        ← Passenger startup wrapper
cpanel/.cpanel.yml                   ← cPanel config reference
scripts/deploy/
  ├── backup-current.sh              ← Snapshot current/ before deploy
  ├── install-deps.sh                ← npm ci --omit=dev on server
  ├── restart.sh                     ← Touch tmp/restart.txt
  ├── health-check.sh                ← Verify deployment health
  ├── rollback.sh                    ← Restore previous version
  ├── deploy.sh                      ← Manual one-shot orchestrator
  └── initial-setup.sh               ← One-time server bootstrap
.env.production.example              ← Env var template
docs/deployment/
  ├── DEPLOYMENT.md                  ← (this file)
  ├── CPANEL-SETUP.md                ← cPanel UI walkthrough
  ├── ENVIRONMENT-VARIABLES.md       ← Env var setup guide
  ├── ROLLBACK.md                    ← Rollback procedure
  └── VERIFICATION-CHECKLIST.md      ← Post-deploy checklist
```

Verify:
```bash
git status
# Should show all the above as new/modified files

git add -A
git commit -m "ci: add cPanel deployment pipeline"
git push origin main
```

### Step 3.2 — Run initial server setup (one-time)

SSH into the cPanel server and run the bootstrap script. This creates the directory layout the deploy workflow expects.

**Option A — clone the repo on the server first, then run the script:**
```bash
ssh -p 22 aqualit1@your-host.com
# Once logged in:
cd ~
git clone https://github.com/lnkickswork-star/lnkicks.git lnkicks-src
cd lnkicks-src
bash scripts/deploy/initial-setup.sh /home/aqualit1/lnkicks
```

**Option B — run the script directly from your local machine via SSH:**
```bash
ssh -p 22 aqualit1@your-host.com 'bash -s' < scripts/deploy/initial-setup.sh /home/aqualit1/lnkicks
```

The script will:
- Verify Node.js, npm, git, rsync are installed
- Create `/home/aqualit1/lnkicks/{current,releases,shared,scripts/deploy}/`
- Copy the deployment scripts into place
- Print a checklist of next steps

### Step 3.3 — Configure the cPanel Node.js App

See **[docs/deployment/CPANEL-SETUP.md](./CPANEL-SETUP.md)** for the full walkthrough with screenshots descriptions. Summary:

1. cPanel → Software → **Setup Node.js App** → **Create Application**
2. Fill in:
   - **Node.js version:** `20`
   - **Application mode:** `Production`
   - **Application root:** `/home/aqualit1/lnkicks/current`
   - **Application URL:** your production domain (e.g. `lnkicks.com`)
   - **Startup file:** `cpanel/app.js`
3. Add environment variables (see **[docs/deployment/ENVIRONMENT-VARIABLES.md](./ENVIRONMENT-VARIABLES.md)**)
4. Click **Save** → **Restart App**

### Step 3.4 — Add GitHub Secrets

Go to: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

Add these required secrets (see **[docs/deployment/ENVIRONMENT-VARIABLES.md](./ENVIRONMENT-VARIABLES.md)** for the full list with descriptions):

| Secret name | Value | How to find |
|---|---|---|
| `SSH_HOST` | `sharedXX.hosting.com` | cPanel → General Information → "Shared IP Address" or hostname |
| `SSH_PORT` | `22` (usually) | cPanel → Terminal → prompt shows it, or ask host |
| `SSH_USER` | `aqualit1` | Your cPanel username |
| `SSH_PRIVATE_KEY` | (entire contents of `~/.ssh/id_rsa` on server) | On server: `cat ~/.ssh/id_rsa` |
| `APP_ROOT` | `/home/aqualit1/lnkicks` | Where you want the app to live |
| `PRODUCTION_DOMAIN` | `https://lnkicks.com` | Your live URL with https:// |
| `NEXT_PUBLIC_SITE_URL` | `https://lnkicks.com` | Same as PRODUCTION_DOMAIN (no trailing slash) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `918881286267` | Your WhatsApp business number |

> **⚠️ CRITICAL:** The `SSH_PRIVATE_KEY` secret must contain the **entire** private key file, including the `-----BEGIN ... PRIVATE KEY-----` and `-----END ... PRIVATE KEY-----` lines. Copy it exactly as `cat ~/.ssh/id_rsa` outputs it.

### Step 3.5 — Trigger the first deploy

Either push a commit to `main`:
```bash
git commit --allow-empty -m "deploy: trigger first production deploy"
git push origin main
```

Or manually trigger the workflow:
- GitHub repo → **Actions** tab → **"Deploy to Production (cPanel)"** → **Run workflow** → select `main` branch → **Run workflow**

### Step 3.6 — Verify the first deploy

After the workflow completes (typically 5–8 minutes):
- GitHub Actions shows a green ✅ on the deploy job
- Visit `https://your-domain.com` → homepage loads
- Visit `https://your-domain.com/product/air-jordan-1-low-black-powder-blue` → product page loads
- Check **Actions** tab → latest run → **Summary** → shows deployment details

If anything failed, see [Troubleshooting](#7-troubleshooting) below.

---

## 4. Daily Deployment Workflow

After first-time setup, the daily flow is dead simple:

### 4.1 Normal deploy

```bash
# On your local machine:
git add .
git commit -m "feat: <description>"
git push origin main
# That's it. GitHub Actions does the rest.
```

Monitor progress:
1. Go to: GitHub repo → **Actions** tab
2. Watch the **"Deploy to Production (cPanel)"** workflow
3. Stages: `quality-gate` → `deploy` → (auto-rollback if needed)
4. Total time: ~5–8 minutes (build is the longest part)

### 4.2 Emergency rollback

If production is broken and you need to revert immediately:

**Option A — via GitHub UI (preferred):**
1. GitHub repo → **Actions** → **"Deploy to Production (cPanel)"**
2. Click **Run workflow** → check the **"force_rollback"** checkbox → **Run workflow**
3. The rollback job runs (skips the build), restores the last good version
4. Total time: ~1–2 minutes

**Option B — via SSH (if GitHub Actions is down):**
```bash
ssh -p 22 aqualit1@your-host.com
bash /home/aqualit1/lnkicks/scripts/deploy/rollback.sh /home/aqualit1/lnkicks
```

See **[docs/deployment/ROLLBACK.md](./ROLLBACK.md)** for full details.

### 4.3 Hotfix deploy

For urgent fixes that can't wait for a PR:

```bash
git checkout main
git pull origin main
# Make your fix
git add . && git commit -m "hotfix: <description>"
git push origin main
# Monitor Actions tab — deploy starts automatically
```

> **Recommendation:** For non-urgent changes, use a PR → CI runs on the PR → merge to main → deploy runs. This catches bugs before they hit production.

---

## 5. Pipeline Stages Explained

### Stage 1: `quality-gate` (runs on GitHub-hosted Ubuntu runner)

| Step | What it does | Failure behavior |
|---|---|---|
| Checkout | Pulls the latest code | Workflow aborts |
| Setup Node.js 20 | Installs Node.js + caches npm | Workflow aborts |
| `npm ci` | Installs all deps (including dev) from lockfile | Workflow aborts — fix lockfile |
| `npm run type-check` | `tsc --noEmit` — catches TypeScript errors | Workflow aborts — fix type errors |
| `npm run lint` | `next lint` — catches lint errors | Workflow aborts — fix lint errors |
| `npm run build` | `next build` — produces `.next/` | Workflow aborts — fix build errors |
| Upload artifact | Saves `.next/`, `public/`, configs to GitHub artifact store | Workflow aborts |

**Total time:** 3–5 minutes (depending on cache hit)

### Stage 2: `deploy` (runs on GitHub-hosted Ubuntu runner, environment: `production`)

| Step | What it does | Failure behavior |
|---|---|---|
| Checkout | Pulls code (for deployment scripts) | Workflow aborts |
| Download artifact | Gets the build from stage 1 | Workflow aborts |
| Verify artifact | Sanity-checks that `.next/`, `cpanel/app.js`, `package.json` exist | Workflow aborts |
| Load SSH key | Writes the private key from secret to `~/.ssh/deploy_key` | Workflow aborts — check `SSH_PRIVATE_KEY` secret |
| Verify SSH | Runs `echo SSH_OK` over SSH | Workflow aborts — check `SSH_HOST`, `SSH_PORT`, `SSH_USER`, key permissions |
| Create remote dirs | `mkdir -p` the directory layout | Workflow aborts |
| Upload scripts | rsyncs `scripts/deploy/` to server | Workflow aborts |
| Backup current | Runs `backup-current.sh` on server | Workflow aborts — check disk space |
| rsync build | Uploads `.next/`, `public/`, `cpanel/`, configs to `current/` | Workflow aborts — check disk space |
| Install deps | Runs `install-deps.sh` (npm ci --omit=dev) on server | Workflow aborts — check `package-lock.json` |
| Restart | Runs `restart.sh` (touch `tmp/restart.txt`) on server | Workflow aborts — check Passenger logs |
| Health check | Curls homepage, product page, static assets | → triggers auto-rollback |
| Auto-rollback (if unhealthy) | Runs `rollback.sh`, waits, re-checks | If rollback also fails → workflow exits 1, manual intervention needed |
| Summary | Writes deployment details to GitHub Actions summary | (always runs) |

**Total time:** 2–4 minutes

### Concurrency control

```yaml
concurrency:
  group: deploy-production
  cancel-in-progress: false
```

- Only one deploy runs at a time
- A new push does NOT cancel an in-flight deploy (would leave production broken)
- New pushes queue up — the latest one wins (older queued runs are skipped)

---

## 6. Monitoring & Logs

### 6.1 GitHub Actions logs

- **Repo → Actions tab** → click any workflow run
- Each step has expandable logs
- Failed steps show a red ❌
- The **Summary** page shows deployment metadata (commit, URL, timestamp)

### 6.2 cPanel server logs

SSH in and tail the logs:

```bash
ssh -p 22 aqualit1@your-host.com

# Apache access log (requests hitting your domain)
tail -f ~/logs/lnkicks.com.log

# Apache error log (Passenger + Node.js errors)
tail -f ~/logs/lnkicks.com.error.log

# Filter for Next.js errors
grep -i "next" ~/logs/lnkicks.com.error.log | tail -50

# Filter for cpanel/app.js messages
grep "cpanel/app.js" ~/logs/lnkicks.com.error.log | tail -50
```

### 6.3 cPanel UI logs

- cPanel → **Logs** → **Errors** — shows recent Apache errors
- cPanel → **Logs** → **Raw Access** — raw Apache access logs
- cPanel → **Software** → **Setup Node.js App** → your app → **"Run"** button — manually restart from UI

### 6.4 Deployment history on server

```bash
ssh -p 22 aqualit1@your-host.com

# List all deployments (newest first)
ls -1dt /home/aqualit1/lnkicks/releases/*/ | head -10

# Show the manifest of the latest backup
cat /home/aqualit1/lnkicks/releases/latest/.deploy-manifest.json

# Show what's currently live
cat /home/aqualit1/lnkicks/current/.next/BUILD_ID
```

---

## 7. Troubleshooting

### 7.1 `SSH connection failed`

**Symptom:** `Load SSH key` step fails with `Permission denied (publickey)`.

**Causes & fixes:**

| Cause | Fix |
|---|---|
| `SSH_PRIVATE_KEY` secret has trailing whitespace | Re-paste the key, ensure no leading/trailing newlines |
| `SSH_PRIVATE_KEY` is the public key, not private | Re-copy from `cat ~/.ssh/id_rsa` (NOT `id_rsa.pub`) |
| `SSH_HOST` is wrong | Check cPanel → General Information → "Shared IP Address" |
| `SSH_PORT` is wrong | Some hosts use 2222, 2200, etc. Ask your host |
| Server's `authorized_keys` doesn't have your public key | Run on server: `cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys` |
| Server firewall blocking GitHub IPs | Ask host to allowlist GitHub Actions IP ranges |

**Debug command:**
```bash
ssh -v -p 22 -i ~/.ssh/deploy_key aqualit1@your-host.com
# -v shows verbose SSH handshake
```

### 7.2 `Build failed` in quality-gate

**Symptom:** `npm run build` step fails on GitHub Actions.

**Fix:** This is a code issue, not a deployment issue. Fix locally:
```bash
npm ci
npm run type-check
npm run lint
npm run build
# Fix any errors, commit, push
```

### 7.3 `npm ci failed` on server

**Symptom:** `install-deps.sh` step fails with `npm ERR!`

**Common causes:**
- `package-lock.json` is out of sync with `package.json`
  → Run `npm install` locally, commit the updated lockfile
- cPanel's Node.js version differs from CI's
  → Ensure both use Node 20 (check cPanel → Setup Node.js App → Node.js version)
- npm cache corruption on server
  → SSH in: `cd ~/lnkicks/current && rm -rf node_modules package-lock.json && npm install`

### 7.4 `Health check failed` after deploy

**Symptom:** Deploy succeeds but health check fails → auto-rollback triggers.

**Diagnosis steps:**

1. **Check server logs immediately** (before rollback overwrites them):
   ```bash
   ssh -p 22 aqualit1@your-host.com
   tail -100 ~/logs/lnkicks.com.error.log
   ```

2. **Check if the app process is running:**
   ```bash
   ps aux | grep -E "(node|next|app.js)" | grep -v grep
   ```

3. **Try starting the app manually to see errors:**
   ```bash
   cd ~/lnkicks/current
   node cpanel/app.js
   # Any startup errors will print to console
   ```

4. **Check env vars are set:**
   ```bash
   # In cPanel → Setup Node.js App → your app → Environment variables
   # Ensure NODE_ENV=production and all required vars are present
   ```

5. **Check the failed deployment is preserved:**
   ```bash
   ls -la ~/lnkicks/releases/failed-*
   ```

### 7.5 Auto-rollback also failed

**Symptom:** Both deploy AND rollback failed — production is broken.

**Emergency recovery:**

1. **SSH in and identify the last known good backup:**
   ```bash
   ls -1dt ~/lnkicks/releases/*/ | head -10
   # Skip the 'failed-*' and 'latest' entries — pick the most recent valid backup
   ```

2. **Manually restore it:**
   ```bash
   BACKUP=~/lnkicks/releases/20250101-120000-abc1234  # use your actual path
   rm -rf ~/lnkicks/current
   cp -a "$BACKUP" ~/lnkicks/current
   cd ~/lnkicks/current
   npm ci --omit=dev --no-audit --no-fund
   mkdir -p tmp
   touch tmp/restart.txt
   ```

3. **Verify:**
   ```bash
   curl -I https://your-domain.com
   ```

4. **Investigate the root cause** before attempting another deploy:
   - Check `~/lnkicks/releases/failed-*` for the broken code
   - Test locally with `npm run build && npm start`
   - Fix the issue on a feature branch, verify CI passes, THEN merge to main

### 7.6 rsync `permission denied`

**Symptom:** `rsync: mkdir "/home/aqualit1/lnkicks/current" failed: Permission denied`

**Cause:** The `current/` directory is owned by root or another user.

**Fix:**
```bash
ssh -p 22 aqualit1@your-host.com
chown -R aqualit1:aqualit1 ~/lnkicks/
chmod -R u+rwX ~/lnkicks/
```

If `chown` fails with `Operation not permitted`, contact your host — you may not have permission to chown on shared hosting.

### 7.7 App serves old content after deploy

**Symptom:** Deploy succeeded, health check passed, but the site shows old content.

**Cause:** Passenger didn't pick up the `tmp/restart.txt` touch.

**Fix:**
```bash
ssh -p 22 aqualit1@your-host.com
# Force a restart via cPanel UAPI
uapi Nodejs set_nodejs_attributes path=/home/aqualit1/lnkicks/current app_name=lnkicks

# Or restart via cPanel UI:
# cPanel → Software → Setup Node.js App → your app → "Restart" button
```

---

## 8. Related Documents

| Document | Purpose |
|---|---|
| [CPANEL-SETUP.md](./CPANEL-SETUP.md) | Step-by-step cPanel UI walkthrough for initial app setup |
| [ENVIRONMENT-VARIABLES.md](./ENVIRONMENT-VARIABLES.md) | Complete env var reference (build-time vs runtime) |
| [ROLLBACK.md](./ROLLBACK.md) | Rollback procedures (automatic and manual) |
| [VERIFICATION-CHECKLIST.md](./VERIFICATION-CHECKLIST.md) | Post-deploy verification checklist |

---

**Last updated:** 2026-08-05
**Pipeline version:** 1.0
**Maintainer:** LN KICKS DevOps
