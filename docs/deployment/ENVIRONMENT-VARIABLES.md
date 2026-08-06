# LN KICKS — Environment Variable Deployment Report

> **Auto-generated** from a complete static audit of every `process.env.*` and
> Prisma `env("...")` reference in the codebase.
>
> **Audit command:**
> ```bash
> grep -rEoh "process\.env\.[A-Za-z_][A-Za-z0-9_]*" \
>   --include="*.ts" --include="*.tsx" --include="*.js" \
>   --exclude-dir=node_modules --exclude-dir=.next \
>   --exclude-dir=scripts --exclude-dir=docs --exclude-dir=prototypes
> ```
> Combined with a manual read of `prisma/schema.prisma` for `env("...")` refs.

---

## Executive Summary

The LN KICKS codebase reads **9 distinct environment variables**. Of those,
**4 are user-configurable** (set in cPanel) and **5 are auto-set** by the
runtime (Next.js / LiteSpeed / OS) and require no manual configuration.

Previous versions of `.env.production.example` listed **20+ additional
variables** (JWT_SECRET, SMTP_*, STRIPE_*, RAZORPAY_*, CLOUDINARY_*,
MYSQL_*, CORS_ORIGIN, etc.) that the code **does not actually read**.
They have been removed to eliminate confusion. When the corresponding
features are implemented in code, the matching env vars should be added
back here at that time.

---

## Complete Environment Variable Inventory

### User-Configurable Variables (set in cPanel)

| # | Variable Name | Required | Example Value | Description | Where it is used |
|---|---------------|----------|---------------|-------------|------------------|
| 1 | `DATABASE_URL` | **YES** | `postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/lnkicks?sslmode=require&pgbouncer=true` | PostgreSQL pooled connection string. Used by the app at runtime for DB queries. Must include `?sslmode=require`. If using Neon's pooler endpoint, also append `&pgbouncer=true`. | `app.js` (line 167 — boot check, exits with code 1 if missing)<br>`cpanel/app.js` (line 104 — boot check)<br>`prisma/schema.prisma` (line 42 — `url = env("DATABASE_URL")`)<br>`lib/prisma.ts` (loaded by `@prisma/client` at import time) |
| 2 | `DIRECT_URL` | **YES** | `postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/lnkicks?sslmode=require` | PostgreSQL direct connection string (bypasses pooler). Used by Prisma CLI for migrations and `prisma db pull`. Must include `?sslmode=require`. On Neon: this is the non-pooler hostname (no `-pooler` suffix). | `prisma/schema.prisma` (line 43 — `directUrl = env("DIRECT_URL")`)<br>Used by `npx prisma migrate deploy` and `npx prisma db pull` |
| 3 | `NEXT_PUBLIC_SITE_URL` | RECOMMENDED | `https://lnkicks.in` | Public site URL (no trailing slash). Currently used only for startup diagnostics logging in `app.js`. Not consumed for app behavior (metadata uses hardcoded values). Set it so startup logs are clean (`✅` instead of `❌`) and future code can read it. | `app.js` (line 142 — diagnostic presence check)<br>`cpanel/app.js` (line 75 — diagnostic presence check)<br>`.cpanel.yml` (line 88 — appends default `https://lnkicks.in` to .env if missing) |
| 4 | `NEXT_PUBLIC_WHATSAPP_NUMBER` | RECOMMENDED | `918881286267` | WhatsApp business number (country code + number, no `+`, no spaces). Currently used only for startup diagnostics logging in `app.js`. **NOTE:** The actual click-to-chat link in `app/help-support/page.tsx` (line 185) uses a hardcoded number — setting this env var does NOT change that link. | `app.js` (line 143 — diagnostic presence check)<br>`cpanel/app.js` (line 76 — diagnostic presence check) |

### Auto-Set Variables (DO NOT configure manually)

These are set automatically by the runtime environment. They are documented
here for completeness and debugging — **do NOT add them to cPanel Environment
Variables** unless you have a specific reason to override the defaults.

| # | Variable Name | Required | Default / Source | Description | Where it is used |
|---|---------------|----------|------------------|-------------|------------------|
| 5 | `NODE_ENV` | YES (auto) | `production` (set by `next build` / `next start`) | Controls Next.js build mode, React dev warnings, Prisma logging level. Next.js automatically sets this to `production` when running `next start`. | `lib/prisma.ts` (line 41 — sets Prisma log level)<br>`lib/prisma.ts` (line 46 — gates globalThis singleton cache)<br>`components/mobile/MobileServiceWorkerRegister.tsx` (line 26 — gates SW registration)<br>`public/sw.js` (comment only)<br>`app.js` (implicit via Next.js) |
| 6 | `PORT` | NO (auto) | `3000` (fallback in app.js) | TCP port for the Node.js server. Set by cPanel/Passenger when using TCP mode. Ignored when `LSNODE_SOCKET` is set (LiteSpeed LSAPI mode). | `app.js` (line 188 — `parseInt(process.env.PORT, 10) || 3000`)<br>`cpanel/app.js` (line 128 — same) |
| 7 | `HOSTNAME` | NO (auto) | `0.0.0.0` (fallback in app.js) | TCP bind hostname. Defaults to `0.0.0.0` (all interfaces) — correct for cPanel shared hosting behind LiteSpeed. | `app.js` (line 189 — `process.env.HOSTNAME || '0.0.0.0'`)<br>`cpanel/app.js` (line 129 — same) |
| 8 | `LSNODE_SOCKET` | NO (auto) | Set by LiteSpeed LSAPI to a UNIX socket path (e.g. `/tmp/lsnode_XXXX`) | LiteSpeed LSAPI UNIX socket. When set, `app.js` listens on this socket instead of a TCP port. This is how LiteSpeed/lsnode communicates with the Node.js app on cPanel shared hosting. | `app.js` (line 187 — `process.env.LSNODE_SOCKET`)<br>`app.js` (line 212 — `if (socketPath)` branch listens on socket) |
| 9 | `HOME` | NO (auto) | Set by the OS to the user's home directory (e.g. `/home/aqualit1`) | User home directory. Used by `app.js` to locate the cPanel nodevenv `etc/envvars` file at `$HOME/nodevenv/<app>/<ver>/etc/envvars`. | `app.js` (line 72 — `process.env.HOME || path.resolve(APP_ROOT, '..')`) |

---

## Variables That Are NOT Used (and why they were removed)

The following variables were listed in the **previous** version of
`.env.production.example` but are **NOT read anywhere in the codebase**.
They have been removed to avoid confusion. Each one is annotated with the
reason it is not needed today.

| Removed Variable | Reason |
|------------------|--------|
| `JWT_SECRET` | Auth is currently localStorage-backed (`lib/auth/authService.ts`). No JWT signing/verification code exists. |
| `ADMIN_JWT_SECRET` | Same as above. No admin JWT code exists. |
| `SESSION_SECRET` | Same as above. Sessions are stored in localStorage. |
| `MYSQL_HOST`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` | Project uses PostgreSQL (Prisma schema `provider = "postgresql"`). No MySQL code. |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No Stripe SDK import or payment code in the codebase. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` | No Razorpay SDK import or payment code. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | No SMTP/nodemailer import or email-sending code. |
| `WHATSAPP_BUSINESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | No WhatsApp Business API client code. The admin/whatsapp page is UI-only mock. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No Cloudinary SDK. Images use Google CDN + ZAI OSS URLs (see `lib/images.ts`). |
| `BLOB_READ_WRITE_TOKEN` | No Vercel Blob usage. |
| `CORS_ORIGIN` | No CORS configuration code (Next.js App Router handles CORS at the route level). |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS` | No rate-limiting middleware in the codebase. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_FB_PIXEL_ID` | No Google Analytics or Facebook Pixel SDK in the codebase. |
| `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL` | Listed in `README.md` only — not read by any code. Removed from README too. |
| `APP_NAME`, `LOG_LEVEL`, `TZ` | Not read by any code. |

> **When you implement any of these features**, add the matching env vars
> back to `.env.production.example` AND to this report. Until then, do not
> set them in cPanel — they will have no effect.

---

## Where to Set Environment Variables in cPanel

### Path

```
cPanel → Software → Setup Node.js App → Edit LNKICKS → Environment variables
```

### What cPanel does with them

cPanel writes the vars to:
```
~/nodevenv/LNKICKS/22/etc/envvars
```
(in shell `export VAR=value` format)

### How the app reads them

LiteSpeed/lsnode **does NOT source** the `bin/activate` script, so the
`etc/envvars` file is NOT automatically loaded into `process.env`. The
`app.js` startup file handles this in two ways:

1. **Direct parse** — `app.js` reads `~/nodevenv/LNKICKS/22/etc/envvars`
   itself, parses shell `export` syntax, and sets `process.env` (lines
   65–114 of `app.js`).
2. **`.env` fallback** — `.cpanel.yml` Step 4 converts `etc/envvars` to
   `.env` format and writes it to the app root. `app.js` then loads it
   via `dotenv` (lines 116–130 of `app.js`).

Both paths use `override: false`, so if a var is set in both places, the
`etc/envvars` value wins.

### Required minimum to start the app

```
DATABASE_URL=postgresql://...?sslmode=require
DIRECT_URL=postgresql://...?sslmode=require
```

Without `DATABASE_URL`, `app.js` exits with code 1 at boot (line 167–179)
and prints an actionable error message.

---

## Verification

To verify env vars are loaded correctly after deployment, check the
startup log:

```bash
tail -f ~/logs/lnkicks.in.log
```

You should see:

```
[app.js] ─── Startup diagnostics ───
[app.js] Node.js version: v22.x.x
[app.js] Process pid: 12345
[app.js] Working directory: /home/aqualit1/LNKICKS
[app.js] App root: /home/aqualit1/LNKICKS
[app.js]   ✅ PORT = (set, X chars)
[app.js]   ❌ LSNODE_SOCKET = (NOT SET)         ← OK if using TCP mode
[app.js]   ✅ NODE_ENV = (set, 10 chars)
[app.js]   ✅ DATABASE_URL = (set, 95 chars)
[app.js]   ✅ DIRECT_URL = (set, 87 chars)
[app.js]   ✅ NEXT_PUBLIC_SITE_URL = (set, 23 chars)
[app.js]   ✅ NEXT_PUBLIC_WHATSAPP_NUMBER = (set, 12 chars)
[app.js]   ❌ JWT_SECRET = (NOT SET)            ← OK (auth uses localStorage)
[app.js]   ❌ ADMIN_JWT_SECRET = (NOT SET)      ← OK (same)
[app.js] ──────────────────────────────────────
[app.js] Starting Next.js production server...
[app.js] ✅ Next.js ready on UNIX socket: /tmp/lsnode_XXXX
```

**Note:** `JWT_SECRET` and `ADMIN_JWT_SECRET` will show `❌` — that's
expected, because the code doesn't use them yet. They are listed in the
diagnostic check for future use.

---

## Quick Reference

```bash
# Minimum required to boot:
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Recommended (for clean logs + future code):
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=918881286267
```

**That's all.** Four variables. No more, no less.
