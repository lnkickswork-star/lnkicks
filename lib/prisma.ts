// =============================================================================
// LN KICKS — Prisma Client Singleton
// =============================================================================
//
// WHY THIS FILE EXISTS:
//   Next.js dev mode hot-reloads modules, which can create multiple PrismaClient
//   instances and exhaust the Neon connection pool (P1001 / "too many clients").
//   This file ensures only ONE PrismaClient exists per Node.js process, even
//   across hot reloads.
//
// USAGE:
//   import { prisma } from '@/lib/prisma';
//   const users = await prisma.user.findMany();
//
//   // Or, if you need a fresh client (rare — e.g. tests):
//   import { PrismaClient } from '@prisma/client';
//   const prisma = new PrismaClient();
//
// PRODUCTION NOTES:
//   - In production (cPanel/Passenger), `module` is cached normally — no hot
//     reload — so this singleton pattern is still safe but not strictly needed.
//   - Passenger restarts (touch tmp/restart.txt) spawn a NEW process, which
//     gets a fresh PrismaClient. Old connections are closed by Node's exit
//     handlers. No leak.
// =============================================================================

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Reuse the global PrismaClient in dev to survive hot reloads.
// In production, `globalThis.__prisma` is undefined on first import, so a
// new client is created — exactly what we want.
export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
