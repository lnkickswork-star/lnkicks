'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import MobileHeader from '@/components/mobile/MobileHeader';
import MobileMenuDrawer from '@/components/mobile/MobileMenuDrawer';
import MobileSearch from '@/components/mobile/MobileSearch';
import MobileBrandShortcuts from '@/components/mobile/MobileBrandShortcuts';
import MobilePopularShoes from '@/components/mobile/MobilePopularShoes';
import MobileNewArrivals from '@/components/mobile/MobileNewArrivals';
import {
  MOBILE_TRENDING,
  MOBILE_RECOMMENDED,
} from '@/components/mobile/mobileProducts';
import { theme } from '@/lib/mobile/theme/theme';
import { safeArea } from '@/lib/mobile/utils/safeArea';

// ── Lazy-loaded below-fold sections ─────────────────────────────────
// Initial viewport (Header + Search + BrandShortcuts + PopularShoes +
// NewArrivals) renders eagerly. Below-the-fold sections lazy-load on
// demand, reducing initial JS bundle and improving LCP on 3G mobile.
const MobileCategories = lazy(() => import('@/components/mobile/MobileCategories'));
const MobileBrands = lazy(() => import('@/components/mobile/MobileBrands'));
const MobileNewsletter = lazy(() => import('@/components/mobile/MobileNewsletter'));
const MobileFooter = lazy(() => import('@/components/mobile/MobileFooter'));
const MobileBottomNav = lazy(() => import('@/components/mobile/MobileBottomNav'));
const MobileServiceWorkerRegister = lazy(
  () => import('@/components/mobile/MobileServiceWorkerRegister'),
);

/**
 * MobileHome — production mobile homepage for LN KICKS.
 *
 * Premium white + matte-black + soft grey theme. NO blue, NO colorful
 * gradients. Apple / Nike / GOAT / END Clothing inspired minimal luxury
 * aesthetic — adapted from a reference mobile shopping app screenshot.
 *
 * Section order (per reference-inspired rebuild):
 *   1. MobileHeader          — Menu / LNKICKS / Wishlist / Cart / Profile
 *   2. MobileSearch          — premium pill search bar
 *   3. MobileBrandShortcuts  — horizontal capsule brand pills (10 brands)
 *   4. MobilePopularShoes    — 2-col product grid with + add-to-cart
 *   5. MobileNewArrivals     — large featured product card
 *   6. MobileRecommended     — 2-col recommended grid (kept)
 *   7. MobileCategories      — circular category rail (kept, lazy)
 *   8. MobileBrands          — brand wordmark marquee (kept, lazy)
 *   9. MobileNewsletter      — black email-capture card (kept, lazy)
 *  10. MobileFooter          — minimal link footer (kept, lazy)
 *  11. MobileBottomNav       — floating nav with center FAB (lazy)
 *
 * Architecture:
 *  - Pure white background, matte black primary buttons, soft grey surfaces
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

/** Lazy-loaded Recommended grid (kept from previous architecture). */
const MobileRecommended = lazy(() => import('@/components/mobile/MobileRecommended'));

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

  // Popular Shoes — 4 products in a 2x2 grid. Mix of TRENDING + RECOMMENDED
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
        {/* 1. Sticky header (Menu / LNKICKS / Wishlist / Cart / Profile) */}
        <MobileHeader onMenuClick={() => setMenuOpen(true)} />

        {/* 2. Main scrollable content */}
        <main
          id="main-content"
          style={{
            paddingTop: theme.spacing.lg,
            // Bottom nav clearance includes safe-area-inset-bottom
            paddingBottom: safeArea.bottomNavClearance,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {/* 2a. Search */}
          <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
            <MobileSearch />
          </div>

          {/* 2b. Quick Brand Shortcuts */}
          <MobileBrandShortcuts />

          {/* 2c. Popular Shoes — 2-col grid with + add-to-cart */}
          <MobilePopularShoes products={popularShoes} />

          {/* 2d. New Arrivals — large featured product */}
          <MobileNewArrivals product={featuredArrival} />

          {/* 2e. Recommended For You — lazy (kept from previous architecture) */}
          <Suspense fallback={<SectionSkeleton height={520} />}>
            <MobileRecommended />
          </Suspense>

          {/* 2f. Categories — lazy */}
          <Suspense fallback={<SectionSkeleton height={180} />}>
            <MobileCategories />
          </Suspense>

          {/* 2g. Brands — lazy */}
          <Suspense fallback={<SectionSkeleton height={120} />}>
            <MobileBrands />
          </Suspense>

          {/* 2h. Newsletter — lazy */}
          <Suspense fallback={<SectionSkeleton height={280} />}>
            <MobileNewsletter />
          </Suspense>

          {/* 2i. Footer — lazy */}
          <Suspense fallback={<SectionSkeleton height={320} />}>
            <MobileFooter />
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
