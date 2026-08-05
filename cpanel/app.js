/**
 * cPanel / Phusion Passenger — Next.js startup wrapper (BULLETPROOF)
 * ====================================================================
 *
 * FIXES (vs the broken spawn-based version):
 *
 *   1. `next: command not found`  → FIXED by `require('next')` (no shell,
 *      no PATH dependency, no `next` binary needed — Node resolves it
 *      directly from node_modules/next).
 *
 *   2. `EADDRINUSE :::3000`       → FIXED by binding to `process.env.PORT`
 *      (the port Passenger assigns) via `http.createServer`. No child
 *      process, no port conflict, no double-bind.
 *
 *   3. `Prisma P1001`             → FIXED by loading `.env` from the app
 *      root via `dotenv` BEFORE requiring next/@prisma/client. Passenger
 *      does NOT source nodevenv `etc/envvars`, so DATABASE_URL must be
 *      loaded explicitly. The deploy workflow writes `.env` from GitHub
 *      Secrets on every deploy.
 *
 * Passenger requires the startup file to either:
 *   (a) export an http.Server via module.exports, OR
 *   (b) start listening on the port Passenger assigns via PORT env var.
 *
 * This file does (b) — the officially recommended pattern for Next.js
 * on cPanel shared hosting.
 *
 * Logs:
 *   console.log/error → /home/<user>/logs/<domain>.{log,error.log}
 *   (visible in cPanel → "Errors" or Terminal → `tail -f ~/logs/*.log`)
 * ====================================================================
 */

'use strict';

// ─────────────────────────────────────────────────────────────────────
// Step 1: Load .env from app root BEFORE anything else.
// ─────────────────────────────────────────────────────────────────────
// Passenger does NOT source the nodevenv `etc/envvars` file, so env vars
// set there (DATABASE_URL, DIRECT_URL, etc.) are NOT in process.env when
// the app starts. We load .env explicitly as a fallback.
//
// `override: false` means: if Passenger DID inject an env var (via cPanel
// UI → Setup Node.js App → Environment variables), that value wins.
// .env only fills in vars that are otherwise missing.
try {
  const path = require('path');
  const fs = require('fs');
  const dotenv = require('dotenv');
  const envPath = path.resolve(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
    console.log('[cpanel/app.js] .env loaded from:', envPath);
  } else {
    console.warn('[cpanel/app.js] WARNING: .env not found at:', envPath);
    console.warn('[cpanel/app.js] DATABASE_URL must be set via cPanel env vars or .env');
  }
} catch (err) {
  console.error('[cpanel/app.js] FATAL: Failed to load .env:', err.message);
  console.error('[cpanel/app.js] Is `dotenv` in package.json dependencies? Was npm ci run?');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────
// Step 2: Startup diagnostics (log env var PRESENCE, never values).
// ─────────────────────────────────────────────────────────────────────
// This makes P1001 and similar errors instantly diagnosable from the logs
// instead of guessing what env vars the app actually sees.
const __diag = () => {
  const vars = [
    'PORT',
    'NODE_ENV',
    'DATABASE_URL',
    'DIRECT_URL',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_WHATSAPP_NUMBER',
    'JWT_SECRET',
    'ADMIN_JWT_SECRET',
  ];
  console.log('[cpanel/app.js] ─── Startup diagnostics ───');
  console.log('[cpanel/app.js] Node.js version:', process.version);
  console.log('[cpanel/app.js] Process pid:', process.pid);
  console.log('[cpanel/app.js] Working directory:', process.cwd());
  console.log('[cpanel/app.js] App root:', require('path').resolve(__dirname, '..'));
  for (const v of vars) {
    const val = process.env[v];
    if (val) {
      // Log length only — NEVER log secret values.
      console.log(`[cpanel/app.js]   ✅ ${v} = (set, ${val.length} chars)`);
    } else {
      console.log(`[cpanel/app.js]   ❌ ${v} = (NOT SET)`);
    }
  }
  console.log('[cpanel/app.js] ──────────────────────────');
};
__diag();

// ─────────────────────────────────────────────────────────────────────
// Step 3: Verify DATABASE_URL is present — fail fast with clear message.
// ─────────────────────────────────────────────────────────────────────
// Without DATABASE_URL, Prisma will throw P1001 ("Can't reach database
// server") at the first query. Failing here gives a clear, actionable
// error instead of a confusing runtime 500.
if (!process.env.DATABASE_URL) {
  console.error('[cpanel/app.js] ──────────────────────────────────────────');
  console.error('[cpanel/app.js] FATAL: DATABASE_URL is NOT set.');
  console.error('[cpanel/app.js]');
  console.error('[cpanel/app.js] Prisma cannot connect to Neon without it.');
  console.error('[cpanel/app.js] Fix this by ONE of:');
  console.error('[cpanel/app.js]   1. cPanel → Setup Node.js App →');
  console.error('[cpanel/app.js]      Environment variables → Add DATABASE_URL');
  console.error('[cpanel/app.js]   2. Create /home/aqualit1/lnkicks/.env with:');
  console.error('[cpanel/app.js]      DATABASE_URL=postgresql://user:pass@host/db?sslmode=require');
  console.error('[cpanel/app.js]      DIRECT_URL=postgresql://user:pass@host/db?sslmode=require');
  console.error('[cpanel/app.js]   3. Add DATABASE_URL to GitHub Secrets (deploy writes .env)');
  console.error('[cpanel/app.js] ──────────────────────────────────────────');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────
// Step 4: Boot Next.js directly (NO spawn, NO shell, NO child process).
// ─────────────────────────────────────────────────────────────────────
const { createServer } = require('http');
const next = require('next');

// Passenger sets PORT; fall back to 3000 ONLY for local testing.
// In production, PORT is always set by Passenger.
const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

console.log('[cpanel/app.js] Starting Next.js production server...');
console.log(`[cpanel/app.js] Binding to ${HOSTNAME}:${PORT}`);

// Next.js app — always production mode on the server.
const app = next({ dev: false, hostname: HOSTNAME, port: PORT });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      // Next.js handles all routing (app router, pages, static, API).
      handle(req, res);
    });

    server.on('error', (err) => {
      console.error('[cpanel/app.js] Server error:', err);
      process.exit(1);
    });

    server.listen(PORT, HOSTNAME, () => {
      console.log(
        `[cpanel/app.js] ✅ Next.js production server ready on ` +
          `http://${HOSTNAME}:${PORT} (pid=${process.pid})`
      );
    });

    // Graceful shutdown — Passenger sends SIGTERM on restart/stop.
    const shutdown = (signal) => {
      console.log(`[cpanel/app.js] ${signal} received, shutting down gracefully...`);
      server.close(() => {
        app.close().then(() => {
          console.log('[cpanel/app.js] Shutdown complete.');
          process.exit(0);
        });
      });
      // Force-exit after 10s if graceful shutdown stalls.
      setTimeout(() => {
        console.error('[cpanel/app.js] Forced exit after 10s timeout.');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })
  .catch((err) => {
    console.error('[cpanel/app.js] ──────────────────────────────────────────');
    console.error('[cpanel/app.js] FATAL: Failed to start Next.js:', err);
    console.error('[cpanel/app.js] ──────────────────────────────────────────');
    process.exit(1);
  });
