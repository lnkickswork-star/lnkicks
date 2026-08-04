# 🔐 Environment Variables Guide

> Complete reference for all environment variables used by LN KICKS. Explains **where** to set each one (GitHub Secrets vs cPanel) and **why**.

---

## The Two Places Variables Live

Next.js has a quirk: environment variables are read at **two different times**, depending on whether they're prefixed with `NEXT_PUBLIC_` or not. This affects where you must set them.

### Build-time variables (`NEXT_PUBLIC_*` prefix)

- **Read by:** `next build` during the production build
- **Baked into:** the client-side JavaScript bundle (visible to anyone)
- **Set in:** **GitHub Secrets** (so the build in GitHub Actions can read them)
- **Example:** `NEXT_PUBLIC_SITE_URL` — needed in the browser to construct absolute URLs

### Runtime variables (no `NEXT_PUBLIC_` prefix)

- **Read by:** the Node.js server when handling requests
- **Baked into:** nothing — they're read from `process.env` at runtime
- **Set in:** **cPanel → Setup Node.js App → Environment variables**
- **Example:** `STRIPE_SECRET_KEY` — server-side only, must never leak to the browser

### Variables that are BOTH

Some variables are read by both build-time code (e.g. a server component's render) AND runtime code (e.g. an API route). For these, set them in **both** places with the same value.

- `NEXT_PUBLIC_SITE_URL` — typically needed at build (for metadata) and runtime (for absolute redirects)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — needed at build (for click-to-chat links in static pages)

---

## Required Variables

These MUST be set or the app will not function correctly.

### GitHub Secrets

Set these in: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Example value | Purpose |
|---|---|---|
| `SSH_HOST` | `sharedXX.hosting.com` | cPanel server hostname for SSH/rsync |
| `SSH_PORT` | `22` | SSH port (some hosts use 2222, 2200, etc.) |
| `SSH_USER` | `aqualit1` | cPanel username |
| `SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` | Full contents of `~/.ssh/id_rsa` from the server |
| `APP_ROOT` | `/home/aqualit1/lnkicks` | Absolute path on server where app lives |
| `PRODUCTION_DOMAIN` | `https://lnkicks.com` | Full URL with `https://` (no trailing slash) |
| `NEXT_PUBLIC_SITE_URL` | `https://lnkicks.com` | Same as `PRODUCTION_DOMAIN` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `918881286267` | WhatsApp business number (country code + number, no +) |

### cPanel Environment Variables

Set these in: **cPanel → Software → Setup Node.js App → your app → "Environment variables" section**

| Variable | Example value | Purpose |
|---|---|---|
| `NODE_ENV` | `production` | Enables Next.js production mode |
| `PORT` | `3000` | HTTP port (Passenger usually overrides, set for safety) |
| `HOSTNAME` | `0.0.0.0` | Bind to all interfaces |
| `NEXT_PUBLIC_SITE_URL` | `https://lnkicks.com` | (Same as GitHub Secret — needed at runtime too) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `918881286267` | (Same as GitHub Secret) |

---

## Optional Variables

Add these only if your app uses the corresponding features.

### Analytics

#### Google Analytics 4

Set in **GitHub Secrets** (build-time only — GA is client-side):

| Variable | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics 4 measurement ID |

#### Facebook Pixel

Set in **GitHub Secrets**:

| Variable | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_FB_PIXEL_ID` | `123456789012345` | Facebook Pixel ID for conversion tracking |

---

### Authentication

Set in **cPanel** (runtime only — secrets must never be in GitHub):

| Variable | How to generate | Purpose |
|---|---|---|
| `JWT_SECRET` | `openssl rand -base64 48` | Signs user JWTs |
| `ADMIN_JWT_SECRET` | `openssl rand -base64 48` | Signs admin JWTs (use a DIFFERENT secret) |
| `SESSION_SECRET` | `openssl rand -base64 48` | Encrypts session cookies |
| `AUTH_SALT` | `openssl rand -base64 32` | Additional salt for password hashing |

> **Generate secrets on the server** (not locally) so they never transit your machine:
> ```bash
> ssh -p 22 aqualit1@your-host.com
> openssl rand -base64 48
> # Copy the output, paste into cPanel env var field
> ```

---

### Database

Set in **cPanel** (runtime only):

#### PostgreSQL (Supabase, Neon, etc.)

| Variable | Example | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db?sslmode=require` | Primary connection string (with connection pooling) |
| `DIRECT_URL` | `postgresql://user:pass@host:5432/db?sslmode=require` | Direct connection (for migrations) |

#### MySQL (cPanel's default DB)

| Variable | Example | Purpose |
|---|---|---|
| `MYSQL_HOST` | `localhost` | Usually localhost on cPanel shared hosting |
| `MYSQL_DATABASE` | `aqualit1_lnkicks` | DB name (prefixed with cPanel username) |
| `MYSQL_USER` | `aqualit1_lnkicks` | DB user (prefixed with cPanel username) |
| `MYSQL_PASSWORD` | (strong password) | DB user password |

> Create the MySQL DB in cPanel → **MySQL Databases**. The user must have ALL PRIVILEGES on the database.

---

### Payment Gateways

Set in **cPanel** (runtime only — secret keys must never be in git):

#### Stripe

| Variable | Example | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_xxx` | Server-side Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | Verifies Stripe webhook signatures |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` | Client-side Stripe.js key (set in BOTH GitHub Secrets AND cPanel) |

#### Razorpay (India)

| Variable | Example | Purpose |
|---|---|---|
| `RAZORPAY_KEY_ID` | `rzp_live_xxx` | Server-side Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | `xxx` | Server-side Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | `xxx` | Verifies Razorpay webhook signatures |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_xxx` | Client-side Razorpay Checkout key (set in BOTH) |

---

### Email / SMTP

Set in **cPanel** (runtime only):

| Variable | Example | Purpose |
|---|---|---|
| `SMTP_HOST` | `smtp.your-provider.com` | SMTP server hostname |
| `SMTP_PORT` | `587` | SMTP port (587 = TLS, 465 = SSL, 25 = unencrypted) |
| `SMTP_USER` | `postmaster@your-domain.com` | SMTP username |
| `SMTP_PASSWORD` | (strong password) | SMTP password |
| `SMTP_FROM` | `"LN KICKS <noreply@your-domain.com>"` | From: header for outgoing emails |

> On cPanel shared hosting, you can usually use the built-in mail server:
> - `SMTP_HOST=localhost`
> - `SMTP_PORT=25`
> - `SMTP_USER=` (empty — no auth needed for local mail)
> - Create the mailbox in cPanel → **Email Accounts**

---

### WhatsApp Business API

Set in **cPanel** (runtime only — used for order confirmations, shipping updates):

| Variable | Example | Purpose |
|---|---|---|
| `WHATSAPP_BUSINESS_TOKEN` | `EAABxxx` | Permanent access token from Meta Business |
| `WHATSAPP_PHONE_NUMBER_ID` | `1234567890` | Phone number ID from WhatsApp Business API |
| `WHATSAPP_BUSINESS_ID` | `1234567890` | Business ID from Meta Business |

> The `NEXT_PUBLIC_WHATSAPP_NUMBER` (for click-to-chat links) is different — it's the regular WhatsApp number, not the Business API token.

---

### File Uploads / CDN

Set in **cPanel** (runtime) + **GitHub Secrets** (build-time, for `NEXT_PUBLIC_*`):

#### Cloudinary

| Variable | Where to set | Purpose |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | cPanel | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | cPanel | API key |
| `CLOUDINARY_API_SECRET` | cPanel | API secret (NEVER in git) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | GitHub Secrets + cPanel | Cloud name (public, needed in client bundle) |

#### AWS S3

| Variable | Where to set | Purpose |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | cPanel | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | cPanel | IAM user secret key |
| `AWS_REGION` | cPanel | e.g. `ap-south-1` |
| `AWS_S3_BUCKET` | cPanel | S3 bucket name |
| `NEXT_PUBLIC_AWS_S3_BUCKET` | GitHub Secrets + cPanel | Public bucket name (for client-side URL construction) |

---

### Rate Limiting / Security

Set in **cPanel** (runtime only):

| Variable | Default | Purpose |
|---|---|---|
| `RATE_LIMIT_MAX` | `100` | Max requests per window per IP |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Window duration in ms (15 min default) |
| `CORS_ORIGIN` | `https://your-domain.com` | Allowed origin for CORS (use production domain) |
| `BCRYPT_ROUNDS` | `12` | Bcrypt cost factor (higher = slower but safer) |

---

### Application Metadata

Set in **cPanel** (runtime):

| Variable | Example | Purpose |
|---|---|---|
| `APP_NAME` | `LN KICKS` | Display name in logs and emails |
| `APP_VERSION` | `2.0.0` | (auto-set by build, but useful as fallback) |
| `LOG_LEVEL` | `info` | `debug` / `info` / `warn` / `error` |
| `TZ` | `Asia/Kolkata` | Timezone for date operations (matches user timezone setting) |

---

## How to Verify Variables Are Set

### On the server (runtime vars)

```bash
ssh -p 22 aqualit1@your-host.com

# Method 1: cat the .env file cPanel creates
cat /home/aqualit1/lnkicks/current/.env

# Method 2: print all env vars seen by the Node.js process
# (run from the app directory)
cd /home/aqualit1/lnkicks/current
node -e "console.log(Object.keys(process.env).filter(k => !k.startsWith('_')).sort().join('\n'))"

# Method 3: check a specific var
node -e "console.log('STRIPE_SECRET_KEY is set:', !!process.env.STRIPE_SECRET_KEY)"
```

### In GitHub Actions (build-time vars)

Add a temporary debug step in the workflow:
```yaml
- name: Debug env vars (REMOVE after debugging)
  run: |
    echo "NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}"
    echo "NEXT_PUBLIC_WHATSAPP_NUMBER: ${{ secrets.NEXT_PUBLIC_WHATSAPP_NUMBER }}"
```

> **⚠️ REMOVE this debug step before merging** — never leave secrets printing in logs.

---

## Secret Rotation

Rotate these secrets periodically (every 6–12 months) or immediately if compromised:

| Secret | How to rotate |
|---|---|
| `JWT_SECRET` | Generate new value, update in cPanel, restart app (all existing sessions invalidated) |
| `ADMIN_JWT_SECRET` | Same as above (all admin sessions invalidated) |
| `STRIPE_SECRET_KEY` | Roll the key in Stripe Dashboard, update in cPanel |
| `RAZORPAY_KEY_SECRET` | Reset in Razorpay Dashboard, update in cPanel |
| `MYSQL_PASSWORD` | Change in cPanel → MySQL Databases, update DB user password, update env var |
| `SSH_PRIVATE_KEY` | Generate new keypair on server (`ssh-keygen`), update `~/.ssh/authorized_keys`, update GitHub Secret |

---

## Common Mistakes

### ❌ Mistake 1: Putting server secrets in GitHub Secrets

**Wrong:** Putting `STRIPE_SECRET_KEY` in GitHub Secrets.

**Why it's wrong:** GitHub Secrets are visible to the build process. While GitHub encrypts them at rest, they could leak via build logs or a compromised workflow. Server-only secrets belong ONLY on the server (cPanel env vars).

**Fix:** Remove from GitHub Secrets. Set in cPanel only.

### ❌ Mistake 2: Putting `NEXT_PUBLIC_*` vars only in cPanel

**Wrong:** Setting `NEXT_PUBLIC_SITE_URL` only in cPanel, not in GitHub Secrets.

**Why it's wrong:** `next build` runs in GitHub Actions. It reads `NEXT_PUBLIC_*` vars from `process.env` at build time and inlines them into the client bundle. If the var isn't in GitHub Secrets, the build won't see it, and the client bundle will have `undefined` for that var.

**Fix:** Set all `NEXT_PUBLIC_*` vars in BOTH GitHub Secrets (for build) AND cPanel (for runtime).

### ❌ Mistake 3: Committing `.env.production` to git

**Wrong:** Creating a real `.env.production` file with secrets and committing it.

**Why it's wrong:** Even if you delete it later, it's in git history forever. Anyone with repo access can `git log -p` and find it.

**Fix:** Use the `.env.production.example` template (already in repo) as a reference. Set real values only in cPanel UI. The `.gitignore` already excludes `.env*` files (except the example).

### ❌ Mistake 4: Using different values in GitHub Secrets vs cPanel

**Wrong:** `NEXT_PUBLIC_SITE_URL=https://staging.lnkicks.com` in GitHub Secrets, but `https://lnkicks.com` in cPanel.

**Why it's wrong:** The build bakes in the staging URL. Even though cPanel has the production URL, the client bundle already has staging URLs hardcoded.

**Fix:** Keep `NEXT_PUBLIC_*` vars IDENTICAL in GitHub Secrets and cPanel. Use a separate GitHub Environment (e.g. `staging`) for non-production deploys.

---

## Reference: `.env.production.example`

The repo contains a template at `.env.production.example` with every possible variable commented out. Use it as a checklist when setting up a new environment.

```bash
cat .env.production.example
# Copy any vars you need, paste into cPanel env var field with real values
```
