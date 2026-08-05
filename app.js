/**
 * LN KICKS — Production startup file for cPanel + LiteSpeed LSAPI + lsnode
 * ====================================================================
 *
 * ARCHITECTURE NOTE — READ THIS BEFORE TOUCHING THIS FILE:
 *
 *   This server uses LiteSpeed LSAPI with `lsnode` (NOT Phusion Passenger).
 *   LiteSpeed does NOT set the `PORT` env var. Instead, it sets
 *   `LSNODE_SOCKET` to a UNIX socket path and expects the Node app to
 *   `listen()` on that socket. lsnode proxies requests through it.
 *
 *   cPanel's "Setup Node.js App" UI defaults to Passenger-style behavior
 *   (TCP port). On LiteSpeed, that produces:
 *     • EADDRINUSE :::3000 (PORT is undefined → falls back to 3000 → busy)
 *     • 503 Service Unavailable (LiteSpeed can't reach the TCP port)
 *     • "Request Timeout" (lsnode waited, no response on the socket)
 *
 *   The fix is to listen on `LSNODE_SOCKET` when present (production),
 *   and fall back to `PORT` (or 3000) only for local CLI testing.
 *
 * STARTUP FILE:
 *   cPanel → Setup Node.js App → "Application startup file" MUST be set to
 *   `app.js` (this file, in the project root), NOT `cpanel/app.js`.
 *
 * LOGS:
 *   stderr/stdout → ~/logs/lnkicks.in.error.log  (and .log)
 *   Visible via: cPanel → "Errors"  OR  Terminal → `tail -f ~/logs/*.log`
 *
 * BULLETPROOFING:
 *   1. Loads .env from app root BEFORE requiring next/@prisma/client
 *      (LiteSpeed does NOT source nodevenv `etc/envvars`).
 *   2. Logs env var PRESENCE (never values) for instant P1001 diagnosis.
 *   3. Verifies DATABASE_URL — fails fast with actionable message.
 *   4. Listens on LSNODE_SOCKET (UNIX socket) when set by LiteSpeed.
 *   5. Falls back to TCP PORT for local dev / non-LiteSpeed hosts.
 *   6. Removes stale socket file before binding (prevents EADDRINUSE).
 *   7. Chmods socket to 0666 so LiteSpeed can connect across CageFS.
 * ====================================================================
 */

'use strict';

const path = require('path');
const fs = require('fs');

// ─────────────────────────────────────────────────────────────────────
// Step 1: Resolve app root.
// ─────────────────────────────────────────────────────────────────────
// When cPanel launches `app.js`, `__dirname` IS the app root.
// When launched from a subdir (rare), resolve upwards to find package.json.
let APP_ROOT = __dirname;
for (let i = 0; i < 5; i++) {
  if (fs.existsSync(path.join(APP_ROOT, 'package.json'))) break;
  APP_ROOT = path.dirname(APP_ROOT);
}

// ─────────────────────────────────────────────────────────────────────
// Step 2: Load .env from app root BEFORE requiring next/@prisma/client.
// ─────────────────────────────────────────────────────────────────────
// LiteSpeed/lsnode does NOT source the nodevenv `etc/envvars` file, so
// env vars set there are NOT in process.env when the app starts. We load
// .env explicitly as a fallback. cPanel UI env vars still win
// (override: false).
try {
  const dotenv = require('dotenv');
  const envPath = path.join(APP_ROOT, '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
    console.log('[app.js] .env loaded from:', envPath);
  } else {
    console.warn('[app.js] WARNING: .env not found at:', envPath);
    console.warn('[app.js] DATABASE_URL must be set via cPanel env vars or .env');
  }
} catch (err) {
  console.error('[app.js] FATAL: Failed to load .env:', err.message);
  console.error('[app.js] Is `dotenv` in package.json dependencies? Was npm install run?');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────
// Step 3: Startup diagnostics (log env var PRESENCE, never values).
// ─────────────────────────────────────────────────────────────────────
const __diag = () => {
  const vars = [
    'PORT',
    'LSNODE_SOCKET',
    'NODE_ENV',
    'DATABASE_URL',
    'DIRECT_URL',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_WHATSAPP_NUMBER',
    'JWT_SECRET',
    'ADMIN_JWT_SECRET',
  ];
  console.log('[app.js] ─── Startup diagnostics ───');
  console.log('[app.js] Node.js version:', process.version);
  console.log('[app.js] Process pid:', process.pid);
  console.log('[app.js] Working directory:', process.cwd());
  console.log('[app.js] App root:', APP_ROOT);
  for (const v of vars) {
    const val = process.env[v];
    if (val) {
      console.log(`[app.js]   ✅ ${v} = (set, ${val.length} chars)`);
    } else {
      console.log(`[app.js]   ❌ ${v} = (NOT SET)`);
    }
  }
  console.log('[app.js] ──────────────────────────');
};
__diag();

// ─────────────────────────────────────────────────────────────────────
// Step 4: Verify DATABASE_URL is present — fail fast with clear message.
// ─────────────────────────────────────────────────────────────────────
if (!process.env.DATABASE_URL) {
  console.error('[app.js] ──────────────────────────────────────────');
  console.error('[app.js] FATAL: DATABASE_URL is NOT set.');
  console.error('[app.js] Prisma cannot connect to Neon without it.');
  console.error('[app.js] Fix this by ONE of:');
  console.error('[app.js]   1. cPanel → Setup Node.js App →');
  console.error('[app.js]      Environment variables → Add DATABASE_URL');
  console.error('[app.js]   2. Create ' + path.join(APP_ROOT, '.env') + ' with:');
  console.error('[app.js]      DATABASE_URL=postgresql://user:pass@host/db?sslmode=require');
  console.error('[app.js]      DIRECT_URL=postgresql://user:pass@host/db?sslmode=require');
  console.error('[app.js] ──────────────────────────────────────────');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────
// Step 5: Boot Next.js directly (NO spawn, NO shell, NO child process).
// ─────────────────────────────────────────────────────────────────────
const { createServer } = require('http');
const next = require('next');

const socketPath = process.env.LSNODE_SOCKET; // LiteSpeed LSAPI
const port = parseInt(process.env.PORT, 10) || 3000; // Fallback for non-LiteSpeed
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log('[app.js] Starting Next.js production server...');

// Next.js app — always production mode on the server.
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      handle(req, res);
    });

    server.on('error', (err) => {
      console.error('[app.js] Server error:', err);
      process.exit(1);
    });

    // ───────────────────────────────────────────────────────────────
    // Step 6: Bind — prefer LSNODE_SOCKET (LiteSpeed), fall back to PORT.
    // ───────────────────────────────────────────────────────────────
    if (socketPath) {
      // LiteSpeed LSAPI mode — listen on UNIX socket.
      // Remove stale socket file first (prevents EADDRINUSE on restart).
      try { fs.unlinkSync(socketPath); } catch (e) {
        // Socket file doesn't exist — that's fine.
      }
      server.listen(socketPath, () => {
        console.log('[app.js] ✅ Next.js ready on UNIX socket:', socketPath);
        // LiteSpeed/lsnode needs to connect to this socket. chmod 0666
        // ensures the web server user can read/write it even under
        // CageFS user isolation.
        try { fs.chmodSync(socketPath, 0o666); } catch (e) {
          console.warn('[app.js] WARNING: Could not chmod socket:', e.message);
        }
      });
    } else {
      // TCP mode — for local dev or non-LiteSpeed hosts.
      server.listen(port, hostname, () => {
        console.log(
          `[app.js] ✅ Next.js ready on http://${hostname}:${port} (pid=${process.pid})`
        );
      });
    }

    // Graceful shutdown — LiteSpeed sends SIGTERM on restart/stop.
    const shutdown = (signal) => {
      console.log(`[app.js] ${signal} received, shutting down gracefully...`);
      server.close(() => {
        app.close().then(() => {
          console.log('[app.js] Shutdown complete.');
          process.exit(0);
        });
      });
      // Force-exit after 10s if graceful shutdown stalls.
      setTimeout(() => {
        console.error('[app.js] Forced exit after 10s timeout.');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })
  .catch((err) => {
    console.error('[app.js] ──────────────────────────────────────────');
    console.error('[app.js] FATAL: Failed to start Next.js:', err);
    console.error('[app.js] ──────────────────────────────────────────');
    process.exit(1);
  });
