/**
 * LN KICKS Mobile — Service Worker (Offline Shell)
 *
 * Strategy:
 *  - install:   pre-cache the app shell (manifest, icons, offline fallback)
 *  - activate:  purge old caches when VERSION changes
 *  - fetch:     network-first for navigations (so users get fresh HTML when
 *               online, cached shell when offline)
 *               cache-first for static assets (icons, fonts, images)
 *               stale-while-revalidate for everything else
 *
 * This is intentionally minimal — it provides:
 *   ✓ App shell available offline (so the PWA opens instantly even with no network)
 *   ✓ Cached assets load instantly on repeat visits
 *   ✓ Transparent fallback — no broken white screen when offline
 *
 * It does NOT:
 *   - Cache product images from external CDNs (those are SSR'd fresh)
 *   - Intercept POST / API mutation routes (they pass straight through)
 *   - Cache the desktop homepage (this SW is scoped to the whole site, but
 *     the desktop route still works fine because it's network-first)
 *
 * Registration is gated by `process.env.NODE_ENV === 'production'` in the
 * register component (MobileServiceWorkerRegister.tsx), so dev hot-reload
 * is never disrupted.
 */

const VERSION = 'lnkicks-mobile-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

// App shell — minimal set of files required for the PWA to boot offline.
// Note: only `/` is cached as the entry route; the server decides whether
// to render the mobile or desktop shell based on User-Agent. Both shells
// are cached implicitly via the runtime navigation cache after first visit.
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon.ico',
  '/offline.html',
];

// ─────────────────────────────────────────────────────────────────────
// INSTALL — pre-cache the app shell.
// `skipWaiting` so the new SW takes over as soon as it installs, instead
// of waiting for all tabs to close.
// ─────────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // `addAll` is atomic — if any URL fails, none are cached. We use
      // individual `add` calls so a single 404 doesn't break the whole shell.
      await Promise.all(
        APP_SHELL.map(async (url) => {
          try {
            await cache.add(url);
          } catch {
            // Ignore individual failures (e.g. offline.html may not exist yet)
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

// ─────────────────────────────────────────────────────────────────────
// ACTIVATE — purge old caches, take control of all clients.
// `clients.claim` ensures the SW controls the page immediately on first
// registration (rather than only after reload).
// ─────────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !key.startsWith(VERSION))
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

// ─────────────────────────────────────────────────────────────────────
// FETCH — routing strategy.
//  - navigation requests (HTML pages):   network-first → cache → offline.html
//  - same-origin static assets:          cache-first → network
//  - cross-origin (CDN images, fonts):   stale-while-revalidate
//  - POST/PUT/DELETE:                    bypass SW entirely
// ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Never intercept non-GET requests — they need to hit the server fresh.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip chrome-extension and devtools requests
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // 1. Navigation requests — network-first with offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          // Cache the latest navigation response for next time.
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          // Network failed — try cache, then offline page.
          const cached = await caches.match(request);
          if (cached) return cached;
          // Fall back to the cached root shell (mobile or desktop variant
          // depending on which was previously cached for this UA).
          const shell = await caches.match('/');
          if (shell) return shell;
          const offline = await caches.match('/offline.html');
          return (
            offline ||
            new Response(
              '<h1>Offline</h1><p>LN KICKS is offline. Please check your connection.</p>',
              { status: 503, headers: { 'Content-Type': 'text/html' } },
            )
          );
        }
      })(),
    );
    return;
  }

  // 2. Same-origin static assets — cache-first.
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const fresh = await fetch(request);
          // Only cache successful, same-type responses.
          if (fresh.ok && fresh.type === 'basic') {
            const cache = await caches.open(ASSET_CACHE);
            cache.put(request, fresh.clone());
          }
          return fresh;
        } catch {
          // For images, return a transparent 1x1 PNG so the page doesn't
          // show broken-image icons. The Uint8Array decodes the base64
          // PNG header for a 1x1 transparent pixel.
          if (request.destination === 'image') {
            const bytes = Uint8Array.from(
              atob(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
              ),
              (c) => c.charCodeAt(0),
            );
            return new Response(bytes, {
              status: 200,
              headers: { 'Content-Type': 'image/png' },
            });
          }
          return new Response('', { status: 504 });
        }
      })(),
    );
    return;
  }

  // 3. Cross-origin (CDN images, Google Fonts) — stale-while-revalidate.
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      const networkFetch = fetch(request)
        .then((fresh) => {
          if (fresh.ok) cache.put(request, fresh.clone());
          return fresh;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })(),
  );
});

// ─────────────────────────────────────────────────────────────────────
// MESSAGE — allow pages to trigger immediate activation.
// Useful when a new SW is waiting; the page can call
// `navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })`
// ─────────────────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
