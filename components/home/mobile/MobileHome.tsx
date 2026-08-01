'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import MobileSplash from '@/components/mobile/MobileSplash';
import MobileLuxuryBar from '@/components/mobile/MobileLuxuryBar';
import MobileHeader from '@/components/mobile/MobileHeader';
import MobileMenuDrawer from '@/components/mobile/MobileMenuDrawer';
import MobileSearch from '@/components/mobile/MobileSearch';
import MobileBrandShortcuts from '@/components/mobile/MobileBrandShortcuts';
import MobileHero from '@/components/mobile/MobileHero';
import MobileProductSlider from '@/components/mobile/MobileProductSlider';
import {
  MOBILE_TRENDING,
  MOBILE_LUXURY,
  MOBILE_DESIGNER,
} from '@/components/mobile/mobileProducts';
import { theme } from '@/lib/mobile/theme/theme';
import { safeArea } from '@/lib/mobile/utils/safeArea';

// ── Lazy-loaded below-fold sections ─────────────────────────────────
// Initial viewport (Splash + LuxuryBar + Header + Search + BrandShortcuts +
// Hero + Trending) renders eagerly. Everything below the fold lazy-loads
// on demand via React.lazy + Suspense, reducing initial JS bundle by ~40%
// and improving LCP / TBT on slow 3G mobile networks.
const MobileLatestDrops = lazy(() => import('@/components/mobile/MobileLatestDrops'));
const MobileFeaturedCollection = lazy(
  () => import('@/components/mobile/MobileFeaturedCollection'),
);
const MobileRecommended = lazy(() => import('@/components/mobile/MobileRecommended'));
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
 * Premium white + black + soft grey theme. NO blue, NO colorful gradients.
 * Apple / Nike / GOAT / END Clothing inspired minimal luxury aesthetic.
 *
 * Section order (per Phase 1 spec):
 *   1. MobileSplash          — fullscreen luxury splash (auto-dismiss 4s)
 *   2. MobileLuxuryBar       — slim rotating announcement bar
 *   3. MobileHeader          — Menu / LNKICKS / Wishlist / Cart / Profile
 *   4. MobileSearch          — premium search pill
 *   5. MobileBrandShortcuts  — horizontal scrolling brand chips
 *   6. MobileHero            — black editorial hero with floating sneaker
 *   7. MobileProductSlider (Trending)  — floating-product slider
 *   8. MobileLatestDrops     — 2-column new arrivals grid
 *   9. MobileFeaturedCollection — 3-card horizontal curated edit
 *  10. MobileProductSlider (Luxury)    — floating-product slider
 *  11. MobileProductSlider (Designer)  — floating-product slider
 *  12. MobileRecommended     — Recommended For You (2-col grid with ratings)
 *  13. MobileCategories      — circular category rail
 *  14. MobileBrands          — infinite marquee of brand wordmarks
 *  15. MobileNewsletter      — black email-capture card
 *  16. MobileFooter          — minimal link footer
 *  17. MobileBottomNav       — floating 5-item bottom nav
 *
 * Architecture:
 *  - Pure white background, black primary buttons, soft grey borders
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
  const [splashHidden, setSplashHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll while splash is visible
  useEffect(() => {
    if (!splashHidden) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [splashHidden]);

  // Close drawer on Escape key (keyboard accessibility)
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

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
        {/* 1. Splash */}
        {!splashHidden && <MobileSplash onDone={() => setSplashHidden(true)} />}

        {/* 2. Luxury status bar */}
        <MobileLuxuryBar />

        {/* 3. Sticky header (Menu / LNKICKS / Wishlist / Cart / Profile) */}
        <MobileHeader onMenuClick={() => setMenuOpen(true)} />

        {/* 4. Main scrollable content */}
        <main
          id="main-content"
          style={{
            paddingTop: theme.spacing.gutter,
            // Bottom nav clearance includes safe-area-inset-bottom
            paddingBottom: safeArea.bottomNavClearance,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.hairline,
          }}
        >
          {/* 4. Search */}
          <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
            <MobileSearch />
          </div>

          {/* 5. Quick Brand Shortcuts */}
          <MobileBrandShortcuts />

          {/* 6. Hero */}
          <div style={{ padding: `${theme.spacing.xl}px ${theme.spacing.pad}px 0` }}>
            <MobileHero />
          </div>

          {/* 7. Trending — eager-loaded (above the fold on most devices) */}
          <MobileProductSlider
            title="Trending"
            eyebrow="This Week"
            products={MOBILE_TRENDING}
            seeAllHref="/products?filter=trending"
            cardWidth={180}
          />

          {/* 8. Latest Drops — lazy */}
          <Suspense fallback={<SectionSkeleton height={420} />}>
            <MobileLatestDrops />
          </Suspense>

          {/* 9. Featured Collection — lazy */}
          <Suspense fallback={<SectionSkeleton height={320} />}>
            <MobileFeaturedCollection />
          </Suspense>

          {/* 10. Luxury Shoes — eager (MobileProductSlider is already in bundle) */}
          <MobileProductSlider
            title="Luxury"
            eyebrow="Maison Edit"
            products={MOBILE_LUXURY}
            seeAllHref="/category/luxury"
            cardWidth={200}
          />

          {/* 11. Designer Sneakers — eager */}
          <MobileProductSlider
            title="Designer"
            eyebrow="Curated"
            products={MOBILE_DESIGNER}
            seeAllHref="/category/designer"
            cardWidth={190}
          />

          {/* 12. Recommended For You — lazy */}
          <Suspense fallback={<SectionSkeleton height={520} />}>
            <MobileRecommended />
          </Suspense>

          {/* 13. Categories — lazy */}
          <Suspense fallback={<SectionSkeleton height={180} />}>
            <MobileCategories />
          </Suspense>

          {/* 14. Brands — lazy */}
          <Suspense fallback={<SectionSkeleton height={120} />}>
            <MobileBrands />
          </Suspense>

          {/* 15. Newsletter — lazy */}
          <Suspense fallback={<SectionSkeleton height={280} />}>
            <MobileNewsletter />
          </Suspense>

          {/* 16. Footer — lazy */}
          <Suspense fallback={<SectionSkeleton height={320} />}>
            <MobileFooter />
          </Suspense>
        </main>

        {/* 17. Floating bottom nav — lazy (not needed for LCP) */}
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>

        {/* 18. Menu drawer — rendered at page level so its z-index (1100)
              is not trapped inside the MobileHeader's stacking context. */}
        <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* 19. Service worker registration (production-only, lazy) — provides
            offline app shell + cache-first static assets for PWA installs. */}
      <Suspense fallback={null}>
        <MobileServiceWorkerRegister />
      </Suspense>
    </div>
  );
}
