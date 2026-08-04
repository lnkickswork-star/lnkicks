/**
 * cPanel / Phusion Passenger — Next.js startup wrapper
 * ====================================================
 *
 * cPanel's "Setup Node.js App" feature runs Node.js applications through
 * Phusion Passenger. Passenger requires a single entry file (the
 * "Application startup file") that either:
 *
 *   (a) exports an http.Server instance via module.exports, OR
 *   (b) starts listening on the port Passenger assigns via PORT env var.
 *
 * This file does (b) — it prepares Next.js and binds the request handler
 * to an http.Server that listens on the PORT Passenger injects. This is
 * the officially recommended pattern for running Next.js on cPanel shared
 * hosting without modifying the application itself.
 *
 * Configuration:
 *   - The cPanel Application Root must contain:
 *       .next/            (production build output)
 *       public/           (static assets)
 *       next.config.js    (Next.js config)
 *       package.json      (with `next` in dependencies)
 *       node_modules/     (production deps, installed via `npm ci --omit=dev`)
 *       cpanel/app.js     (this file)
 *   - The "Application startup file" field in cPanel must point to:
 *       cpanel/app.js
 *   - The "Application URL" must match your production domain.
 *
 * Environment variables:
 *   All env vars set in cPanel → "Setup Node.js App" →
 *   "Environment variables" are available via process.env at runtime.
 *   Add the same vars you would put in .env.local — see
 *   docs/ENVIRONMENT-VARIABLES.md for the full list.
 *
 * Logs:
 *   console.log / console.error output goes to:
 *     /home/<user>/logs/<domain>.{log,error.log}
 *   (visible in cPanel → "Errors" / "Terminal" → tail the logs)
 *
 * NOTE: This file is part of the DEPLOYMENT INFRASTRUCTURE, not the
 *       application. It does not import or modify any application code;
 *       it only boots the Next.js server that already exists in .next/.
 */

'use strict';

const { createServer } = require('http');
const next = require('next');

// Passenger sets PORT; fall back to 3000 for local testing.
const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

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
        `[cpanel/app.js] Next.js production server ready on ` +
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
    console.error('[cpanel/app.js] Failed to start Next.js:', err);
    process.exit(1);
  });
