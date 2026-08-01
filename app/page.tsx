import { headers } from 'next/headers';
import DesktopHome from '@/components/home/desktop/DesktopHome';
import MobileHome from '@/components/home/mobile/MobileHome';

/**
 * RootPage — server-side homepage selector.
 *
 * The URL is always `/`. There is no public `/mobile` or `/desktop` route.
 *
 * Detection strategy
 * ------------------
 * Reads the `User-Agent` header from `next/headers` (server-side, runs on
 * every request) and matches the canonical mobile-UA regex used by Next.js,
 * Vercel, and most CDNs. Mobile browsers get `MobileHome`; everyone else
 * gets `DesktopHome`.
 *
 * Why server-side (not client-side `useEffect`)
 * ---------------------------------------------
 *   1. No flash of wrong layout — the correct home shell is rendered on
 *      the server and streamed down on first paint.
 *   2. SEO-friendly — crawlers receive the desktop shell immediately.
 *   3. Works without JS — the page is usable even if JS fails to load.
 *   4. PWA-friendly — the service worker caches the actual rendered HTML,
 *      not a blank "loading" state.
 *
 * Why not Next.js Middleware
 * --------------------------
 * Middleware can rewrite the request to a different route, but we don't
 * have two routes — we have one route (`/`) with two React components.
 * Server-side conditional rendering inside `app/page.tsx` is simpler,
 * has no extra cold-start cost, and keeps the URL stable.
 *
 * Hydration
 * ---------
 * `DesktopHome` and `MobileHome` are both `'use client'` components
 * (they use `useApp`, `usePathname`, `useState`). That's fine — Next.js
 * handles hydration seamlessly. The server renders the correct component's
 * initial HTML; the client picks up hydration on the same component.
 * No hydration mismatch because the UA is the same on both sides.
 *
 * Internal pages (Cart, Checkout, Product, etc.) remain shared — they
 * are NOT duplicated. Only the homepage differs by device class.
 */

/** Canonical mobile-UA regex (matches Next.js / Vercel convention). */
const MOBILE_UA_PATTERN =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk/i;

/** Threshold below which we treat a viewport as mobile (used as a hint). */
const MOBILE_VIEWPORT_WIDTH = 768;

/**
 * Inspect request headers to decide whether to render the mobile shell.
 *
 * Primary signal: `User-Agent` (canonical mobile-UA regex).
 * Secondary signal: `Sec-CH-UA-Mobile` (Client Hints, where supported).
 * Tertiary signal: `Viewport-Width` (legacy Chromium header).
 */
async function isMobileRequest(): Promise<boolean> {
  const headerList = await headers();
  const ua = headerList.get('user-agent') || '';
  if (MOBILE_UA_PATTERN.test(ua)) return true;

  // Client Hints: Sec-CH-UA-Mobile = "?1" means mobile
  const chMobile = headerList.get('sec-ch-ua-mobile');
  if (chMobile === '?1') return true;

  // Legacy Viewport-Width hint (Chromium)
  const vw = headerList.get('viewport-width');
  if (vw) {
    const n = parseInt(vw, 10);
    if (!Number.isNaN(n) && n <= MOBILE_VIEWPORT_WIDTH) return true;
  }

  return false;
}

export default async function RootPage() {
  const isMobile = await isMobileRequest();
  return isMobile ? <MobileHome /> : <DesktopHome />;
}
