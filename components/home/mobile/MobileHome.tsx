'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import MobileHeader from '@/components/mobile/MobileHeader';
import MobileMenuDrawer from '@/components/mobile/MobileMenuDrawer';
import MobileSearch from '@/components/mobile/MobileSearch';
import MobileBrandShortcuts from '@/components/mobile/MobileBrandShortcuts';
import MobileAdidasBanner from '@/components/mobile/MobileAdidasBanner';
import MobileHeroBanner from '@/components/mobile/MobileHeroBanner';
import MobilePopularShoes from '@/components/mobile/MobilePopularShoes';
import MobileNewArrivals from '@/components/mobile/MobileNewArrivals';
import {
  MOBILE_TRENDING,
  MOBILE_RECOMMENDED,
} from '@/components/mobile/mobileProducts';
import { theme } from '@/lib/mobile/theme/theme';
import { safeArea } from '@/lib/mobile/utils/safeArea';

// ── Lazy-loaded below-fold sections ─────────────────────────────────
// Initial viewport (Header + Search + BrandShortcuts + HeroBanner +
// PopularShoes + NewArrivals) renders eagerly. Below-the-fold sections
// lazy-load on demand, reducing initial JS bundle and improving LCP.
//
// Per UX spec:
//   - MobileFooter (informational) has been REMOVED from MobileHome.
//     The floating MobileBottomNav is the sole navigation chrome.
//   - MobileCategories ("Browse by Category") has been REMOVED.
//     Categories are still reachable via /categories route + bottom nav.
const MobileRecommended = lazy(() => import('@/components/mobile/MobileRecommended'));
const MobileNewsletter = lazy(() => import('@/components/mobile/MobileNewsletter'));
const MobileTrustBanner = lazy(() => import('@/components/mobile/MobileTrustBanner'));
const MobileBottomNav = lazy(() => import('@/components/mobile/MobileBottomNav'));
const MobileServiceWorkerRegister = lazy(
  () => import('@/components/mobile/MobileServiceWorkerRegister'),
);

/**
 * MobileHome — production mobile homepage for LN KICKS.
 *
 * Premium white + matte-black + soft grey theme. NO blue, NO colorful
 * gradients. Apple / Nike / GOAT / END Clothing inspired minimal luxury
 * aesthetic — pushed to editorial scale in the Phase 4 refresh.
 *
 * Section order (Phase 19 refresh):
 *   1. MobileHeader          — Menu / LNKICKS / Cart / Profile (sticky glass)
 *   2. MobileSearch          — premium off-white pill search
 *   3. MobileBrandShortcuts  — horizontal capsule brand pills (10 brands)
 *   4. MobileHeroBanner      — dramatic editorial carousel (280px tall,
 *                              massive 56px Oswald display, off-white/black
 *                              alternating, editorial numeric indicator)
 *   5. MobilePopularShoes    — premium 24px-radius cards, soft shadow,
 *                              horizontal swipe carousel with peek preview
 *   6. MobileNewArrivals     — premium 280px SNKRS-style banner, bigger type
 *   7. MobileRecommended     — 2-col premium grid with grey tiles (lazy)
 *   8. MobileNewsletter      — 'Sign up and save 10%' CTA banner (lazy, bottom)
 *   9. MobileTrustBanner     — 'About LN KICKS' brand-story / trust card (lazy)
 *  10. MobileBottomNav       — floating nav with center FAB (lazy, sole nav)
 *
 * REMOVED sections (per UX spec):
 *   - MobileFooter (informational footer) — BottomNav is the only navigation
 *   - MobileCategories ("Browse by Category") — categories reachable via
 *     /categories route + bottom nav
 *   - MobileBrands ("Authenticated · Stocked · Trusted / Brands at LN KICKS"
 *     + brand wordmark marquee) — removed per user request, Phase 18.
 *       Component file retained at components/mobile/MobileBrands.tsx in case
 *       it's needed again; just not mounted on the homepage.
 *
 * Phase 19 note: MobileNewsletter was removed in Phase 18, then RE-ADDED in
 * Phase 19 with a redesigned button-based CTA ("Sign Up Now →" + "+" icon)
 * per user reference image. The old email-input form version is gone.
 *
 * Architecture:
 *  - Pure white background, matte black primary buttons, off-white surfaces
 *  - Inline styles + styled-jsx (no Tailwind) — matches desktop convention
 *  - Inter + Oswald via next/font/google (already wired in app/layout.tsx)
 *  - External CDN image URLs (LFS pointers in /public/ are broken)
 *  - 'use client' because header + bottom nav use useApp() + usePathname()
 *  - All shared pages (Product, Category, Cart, Checkout, etc.) are NOT
 *    duplicated — mobile and desktop navigate to the SAME routes.
 *  - Design tokens from @/lib/mobile/theme — no hardcoded values
 *  - Safe-area support via env(safe-area-inset-*) — see lib/mobile/utils/safeArea.ts
 *  - Below-fold sections lazy-loaded via React.lazy + Suspense
 *
 * Mobile-only: optimized for 360px–440px viewports (iPhone / Galaxy / Pixel).
 *
 * Mounted by `app/page.tsx` (server component) when the User-Agent
 * indicates a mobile browser. The URL is always `/` — there is no
 * public `/mobile` route.
 *
 * Desktop Homepage is LOCKED — not modified by this file.
 */

/** Lightweight skeleton placeholder shown while lazy chunks load. */
function SectionSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading section"
      style={{
        height,
        margin: `${theme.spacing.section}px 0`,
        padding: `0 ${theme.spacing.pad}px`,
      }}
    >
      <div
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${theme.colors.grey50} 0%, ${theme.colors.grey100} 50%, ${theme.colors.grey50} 100%)`,
          backgroundSize: '200% 100%',
          borderRadius: theme.radius.lg,
          animation: 'ln-shimmer 1.4s ease-in-out infinite',
        }}
      />
      <style jsx>{`
        @keyframes ln-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default function MobileHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close drawer on Escape key (keyboard accessibility)
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Featured new arrival — pick the first TRENDING product (already a
  // verified CDN image + valid href). Could be parameterized later.
  const featuredArrival = MOBILE_TRENDING[0];

  // Popular Shoes — 4 products. Mix of TRENDING + RECOMMENDED
  // gives brand variety (Air Jordan, Nike, Adidas, New Balance).
  const popularShoes = [
    MOBILE_TRENDING[0],
    MOBILE_TRENDING[1],
    MOBILE_TRENDING[2],
    MOBILE_RECOMMENDED[3],
  ].map((p) => ({
    ...p,
    // Ensure every popular card has a rating (mix-in from RECOMMENDED)
    rating: p.rating ?? 4.7,
  }));

  return (
    <div
      style={{
        background: theme.colors.white,
        minHeight: '100vh',
        fontFamily: theme.fontFamily.body,
        color: theme.colors.textPrimary,
        // Safe-area-aware padding for landscape notches
        paddingLeft: safeArea.paddingLeft,
        paddingRight: safeArea.paddingRight,
      }}
    >
      {/* Skip link — keyboard users can jump straight to main content */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: -9999,
          top: 0,
          background: theme.colors.black,
          color: theme.colors.white,
          padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
          borderRadius: theme.radius.sm,
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.bold,
          zIndex: theme.zIndex.splash,
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.left = '8px';
          (e.currentTarget as HTMLAnchorElement).style.top = '8px';
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.left = '-9999px';
        }}
      >
        Skip to content
      </a>

      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          minHeight: '100vh',
          background: theme.colors.white,
          position: 'relative',
          overflowX: 'hidden',
          boxShadow: theme.shadows.hairline,
        }}
      >
        {/* 1. Sticky header (Menu / LNKICKS / Cart / Profile) */}
        <MobileHeader onMenuClick={() => setMenuOpen(true)} />

        {/* 2. Main scrollable content */}
        <main
          id="main-content"
          style={{
            // Phase 7: 24px top padding (was 16px) — breathing room below header
            paddingTop: theme.spacing.sectionPadding,
            // Bottom nav clearance includes safe-area-inset-bottom
            paddingBottom: safeArea.bottomNavClearance,
            display: 'flex',
            flexDirection: 'column',
            // Phase 11: uniform 32px section gap (Apple/Nike/Samsung rhythm).
            // Each child section no longer carries its own paddingTop/paddingBottom —
            // the parent flex gap is the sole source of vertical spacing so all
            // sections share the same breathing room. MobilePopularShoes adds a
            // +8px marginTop to land a 40px gap from the promotional slider above.
            gap: theme.spacing.vast,
          }}
        >
          {/* 2a. Search — 24px horizontal padding per Phase 6 spec */}
          <div style={{ padding: `0 ${theme.spacing.sectionPadding}px` }}>
            <MobileSearch />
          </div>

          {/* 2b. Quick Brand Shortcuts */}
          <MobileBrandShortcuts />

          {/* 2b.1 Adidas promotional banner — below brand chips, rounded corners */}
          <MobileAdidasBanner />

          {/* 2c. Hero Banner Slider — dramatic editorial carousel */}
          <MobileHeroBanner />

          {/* 2d. Popular Shoes — premium 24px-radius cards */}
          <MobilePopularShoes products={popularShoes} />

          {/* 2e. New Arrivals — premium SNKRS-style promotional banner */}
          <MobileNewArrivals product={featuredArrival} />

          {/* 2f. Recommended For You — lazy (kept from previous architecture) */}
          <Suspense fallback={<SectionSkeleton height={520} />}>
            <MobileRecommended />
          </Suspense>

          {/* Phase 19: MobileNewsletter — 'Sign up and save 10%' CTA banner
              (redesigned with button-based CTA per user reference image).
              Mounted at the BOTTOM of the homepage, after Recommended.
              MobileBrands ("Authenticated · Stocked · Trusted / Brands at
              LN KICKS" + marquee) remains REMOVED per Phase 18 user request.
              The floating MobileBottomNav below is the sole navigation chrome. */}
          <Suspense fallback={<SectionSkeleton height={280} />}>
            <MobileNewsletter />
          </Suspense>

          {/* Phase 20: MobileTrustBanner — 'About LN KICKS' editorial
              brand-story card with the exact user-provided copy:
              "LNKICKS is India's premium destination for authentic sneakers,
               luxury fashion, and modern streetwear..."
              Mounted as the LAST content section, after MobileNewsletter
              and before the floating MobileBottomNav. Off-white card with
              a 1px border — intentionally light to contrast with the black
              MobileNewsletter card directly above it. Mobile-only — desktop
              homepage is untouched. */}
          <Suspense fallback={<SectionSkeleton height={260} />}>
            <MobileTrustBanner />
          </Suspense>
        </main>

        {/* 3. Floating bottom nav with center FAB — lazy */}
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>

        {/* 4. Menu drawer — rendered at page level so its z-index (1100)
              is not trapped inside the MobileHeader's stacking context. */}
        <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* 5. Service worker registration (production-only, lazy) — provides
            offline app shell + cache-first static assets for PWA installs. */}
      <Suspense fallback={null}>
        <MobileServiceWorkerRegister />
      </Suspense>
    </div>
  );
}
