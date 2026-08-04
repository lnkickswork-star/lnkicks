# 🛠️ cPanel Node.js App Setup Guide

> Step-by-step walkthrough for configuring the LN KICKS Next.js app in cPanel's "Setup Node.js App" interface. **Run this once** during initial setup (see [DEPLOYMENT.md §3.3](./DEPLOYMENT.md#33-configure-the-cpanel-nodejs-app)).

---

## Prerequisites

- cPanel access (URL, username, password)
- SSH access already enabled (the deploy workflow needs it)
- SSH key already generated on the server at `~/.ssh/id_rsa` (✅ done)
- The repo already pushed to GitHub (the deploy files must be present)

---

## Step 1 — Open "Setup Node.js App"

1. Log in to **cPanel** (URL is typically `https://your-domain.com:2083` or `https://cpanel.your-domain.com`)
2. Scroll to the **Software** section
3. Click **Setup Node.js App**

You should see a list of existing Node.js applications (likely empty on first run).

---

## Step 2 — Create New Application

Click the **CREATE APPLICATION** button at the top-right.

You'll be taken to a form with these fields:

---

## Step 3 — Fill In Application Details

| Field | Value to enter | Notes |
|---|---|---|
| **Node.js version** | `20` | Must match what CI builds with (Node 20 LTS) |
| **Application mode** | `Production` | Enables production optimizations |
| **Application root** | `/home/aqualit1/lnkicks/current` | Absolute path; cPanel creates it if missing |
| **Application URL** | Choose your domain from the dropdown | e.g. `lnkicks.com` or `www.lnkicks.com` |
| **Application startup file** | `cpanel/app.js` | Relative to Application root |
| **Passenger log file** | (leave default) | Usually `~/logs/lnkicks.com.error.log` |

### Important: Application root

The **Application root** must be `/home/aqualit1/lnkicks/current` (NOT just `/home/aqualit1/lnkicks`). The deploy workflow uses this layout:

```
/home/aqualit1/lnkicks/        ← APP_ROOT (parent, holds backups + scripts)
└── current/                    ← Application root (live code lives here)
    ├── .next/
    ├── cpanel/app.js           ← Startup file (relative to app root)
    └── ...
```

If you set Application root to `/home/aqualit1/lnkicks` (without `/current`), Passenger will look for `cpanel/app.js` in the wrong place after the first deploy.

---

## Step 4 — Configure Environment Variables

Scroll down to the **"Environment variables"** section. Click **Add Variable** for each of the following:

### Required variables

| Variable name | Variable value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Enables Next.js production mode |
| `PORT` | `3000` | Passenger usually overrides this; set anyway for safety |
| `HOSTNAME` | `0.0.0.0` | Bind to all interfaces (Passenger proxies) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | Same as GitHub Secret value |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `918881286267` | Your WhatsApp business number |

### App-specific variables (add as needed)

Add any variables your app reads at runtime. See **[ENVIRONMENT-VARIABLES.md](./ENVIRONMENT-VARIABLES.md)** for the complete list with examples for:

- Database connection strings
- Payment gateway keys (Stripe, Razorpay)
- JWT secrets
- SMTP credentials
- WhatsApp Business API tokens
- CDN credentials

> **⚠️ SECURITY:** Never put real secrets in the GitHub repo or in any file that gets committed. cPanel env vars are stored server-side and are never exposed in git.

### How to add a variable

1. Click **Add Variable**
2. Enter the variable name (e.g. `STRIPE_SECRET_KEY`)
3. Enter the variable value (e.g. `sk_live_xxx`)
4. The variable is added to the list
5. Repeat for each variable
6. Click **Save** at the bottom when done

---

## Step 5 — Save and Start

1. Click the **SAVE** button at the bottom of the form
2. cPanel creates the application and starts it
3. You should see a green "Application created successfully" message
4. The application is now running (but pointing to a placeholder until the first deploy)

---

## Step 6 — Verify the App Started

### Method 1: cPanel UI

1. In the **Setup Node.js App** list, find your app
2. The status column should show **"Running"** (green dot)
3. Click **Run** to manually start if it's not running

### Method 2: SSH

```bash
ssh -p 22 aqualit1@your-host.com

# Check if Node.js process is running
ps aux | grep -E "(node|next)" | grep -v grep

# Check the app root exists
ls -la /home/aqualit1/lnkicks/current/

# Check the error log for startup messages
tail -20 ~/logs/lnkicks.com.error.log
```

You should see something like:
```
[cpanel/app.js] Next.js production server ready on http://0.0.0.0:3000 (pid=12345)
```

### Method 3: HTTP request

```bash
# From your local machine:
curl -I https://your-domain.com
# Expect: HTTP/2 200
```

---

## Step 7 — Run the First Deploy

Now that cPanel is configured, trigger the first GitHub Actions deploy:

1. Go to: GitHub repo → **Actions** tab
2. Select **"Deploy to Production (cPanel)"** workflow
3. Click **Run workflow** → select `main` branch → **Run workflow**
4. Wait 5–8 minutes for completion
5. Verify with `curl -I https://your-domain.com`

The deploy will:
- Build the app on GitHub's runner
- rsync the build to `/home/aqualit1/lnkicks/current/`
- Install production deps with `npm ci --omit=dev`
- Touch `tmp/restart.txt` (Passenger picks up the new code)
- Health-check the live URL

---

## Common cPanel Issues

### Issue: "Application startup file not found"

**Cause:** The `cpanel/app.js` file doesn't exist in the Application root yet (before the first deploy).

**Fix:** This is expected on first setup. Run the first deploy — it will upload `cpanel/app.js`. If the error persists after deploy, verify:
```bash
ls -la /home/aqualit1/lnkicks/current/cpanel/app.js
```

If missing, the rsync exclude list may be wrong. Check `.github/workflows/deploy.yml` — `cpanel/` should NOT be in any `--exclude` flag.

### Issue: App shows "Passenger error" page in browser

**Cause:** The Node.js process crashed on startup.

**Diagnosis:**
```bash
ssh -p 22 aqualit1@your-host.com
tail -50 ~/logs/lnkicks.com.error.log
```

Common errors:
- `Cannot find module 'next'` → run `npm ci --omit=dev` in `~/lnkicks/current/`
- `Cannot find module './.next/...'` → `.next/` directory missing or incomplete; trigger a redeploy
- `EADDRINUSE` → another process is using port 3000; restart cPanel app via UI

### Issue: Changes don't appear after deploy

**Cause:** Passenger didn't restart.

**Fix:**
1. Verify `tmp/restart.txt` was touched:
   ```bash
   ls -la /home/aqualit1/lnkicks/current/tmp/restart.txt
   ```
   The modification time should be recent.

2. Force-restart via cPanel UI:
   - cPanel → Software → Setup Node.js App → your app → **Restart** button

3. Or via SSH:
   ```bash
   touch /home/aqualit1/lnkicks/current/tmp/restart.txt
   # Wait 5 seconds, then check
   curl -I https://your-domain.com
   ```

### Issue: "Out of memory" errors

**Cause:** Shared hosting typically limits Node.js to 256MB–512MB RAM. Next.js production builds can exceed this.

**Fix:**
- This is a **build-time** issue — the build runs on GitHub Actions (4GB RAM), not on the server
- The server only runs the prebuilt `.next/` output, which is much lighter
- If runtime OOMs still occur, add a memory limit to `cpanel/app.js`:
  ```bash
  # In cPanel env vars, add:
  NODE_OPTIONS=--max-old-space-size=384
  ```
  This caps the V8 heap at 384MB.

### Issue: cPanel shows Node.js version mismatch

cPanel's CLI Node.js may differ from the version Passenger uses. To check:

```bash
# CLI version
node --version

# Passenger version (set in cPanel UI)
# cPanel → Setup Node.js App → your app → "Node.js version" dropdown
```

Both should be `20.x.x`. If cPanel's dropdown doesn't show Node 20:
- Contact your host to install Node 20 via cPanel's MultiPHP Manager → Node.js
- Or use the closest available version (18.x works for most Next.js 14 apps, but is not LTS)

---

## cPanel App Settings Reference

The full configuration should match `cpanel/.cpanel.yml` in the repo:

```yaml
application:
  node_version: "20"
  app_root: "/home/aqualit1/lnkicks/current"  # Note: includes /current
  startup_file: "cpanel/app.js"
  application_url: "your-domain.com"
  application_mode: "production"

environment_variables:
  NODE_ENV: "production"
  NEXT_PUBLIC_SITE_URL: "https://your-domain.com"
  NEXT_PUBLIC_WHATSAPP_NUMBER: "918881286267"
  # ... (see ENVIRONMENT-VARIABLES.md for full list)

passenger:
  startup_file: "cpanel/app.js"
  friendly_error_pages: false
```

---

## Next Steps

After setup is complete:
- ✅ Verify the first deploy succeeds
- ✅ Bookmark the **Actions** tab in GitHub for easy monitoring
- ✅ Share this documentation with anyone who will deploy
- ✅ Set up deploy notifications (GitHub → Settings → Webhooks → Slack/Discord)

For the complete deployment flow, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.
