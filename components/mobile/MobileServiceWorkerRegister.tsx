'use client';

import { useEffect } from 'react';

/**
 * MobileServiceWorkerRegister — registers /sw.js on the client.
 *
 * Production-only — skipped in dev to avoid disrupting hot-reload.
 *
 * The SW provides:
 *  - App-shell pre-caching (manifest, icons, /offline.html)
 *  - Network-first navigation (fresh HTML when online, cached when offline)
 *  - Cache-first for same-origin static assets
 *  - Stale-while-revalidate for cross-origin CDN images / fonts
 *
 * Mounted once at the top of /mobile page. No UI — silent registration.
 *
 * Error handling: any SW failure is swallowed — the app still works
 * perfectly without offline support; the SW is a progressive enhancement.
 */
export default function MobileServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return;
    }

    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch(() => {
          // Silent failure — SW is non-critical
        });
    };

    // Defer registration until after window load so it doesn't compete
    // with first-paint resources.
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
      return () => window.removeEventListener('load', register);
    }
  }, []);

  return null;
}
