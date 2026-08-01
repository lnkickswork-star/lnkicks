'use client';

import React, { useState, useEffect } from 'react';
import MobileSplash from '@/components/mobile/MobileSplash';
import MobileLuxuryBar from '@/components/mobile/MobileLuxuryBar';
import MobileHeader from '@/components/mobile/MobileHeader';
import MobileMenuDrawer from '@/components/mobile/MobileMenuDrawer';
import MobileSearch from '@/components/mobile/MobileSearch';
import MobileBrandShortcuts from '@/components/mobile/MobileBrandShortcuts';
import MobileHero from '@/components/mobile/MobileHero';
import MobileProductSlider from '@/components/mobile/MobileProductSlider';
import MobileLatestDrops from '@/components/mobile/MobileLatestDrops';
import MobileFeaturedCollection from '@/components/mobile/MobileFeaturedCollection';
import MobileRecommended from '@/components/mobile/MobileRecommended';
import MobileBrands from '@/components/mobile/MobileBrands';
import MobileCategories from '@/components/mobile/MobileCategories';
import MobileNewsletter from '@/components/mobile/MobileNewsletter';
import MobileFooter from '@/components/mobile/MobileFooter';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';
import {
  MOBILE_TRENDING,
  MOBILE_LUXURY,
  MOBILE_DESIGNER,
} from '@/components/mobile/mobileProducts';

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
 *
 * Mobile-only: optimized for 360px–440px viewports (iPhone / Galaxy / Pixel).
 */
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

  return (
    <div
      style={{
        background: '#ffffff',
        minHeight: '100vh',
        fontFamily: 'var(--font-inter), sans-serif',
        color: '#0A0A0A',
      }}
    >
      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          minHeight: '100vh',
          background: '#ffffff',
          position: 'relative',
          overflowX: 'hidden',
          boxShadow: '0 0 0 1px #f3f3f3',
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
          style={{
            paddingTop: 14,
            paddingBottom: 100, // clear bottom nav
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {/* 4. Search */}
          <div style={{ padding: '0 18px' }}>
            <MobileSearch />
          </div>

          {/* 5. Quick Brand Shortcuts */}
          <MobileBrandShortcuts />

          {/* 6. Hero */}
          <div style={{ padding: '20px 18px 0' }}>
            <MobileHero />
          </div>

          {/* 7. Trending */}
          <MobileProductSlider
            title="Trending"
            eyebrow="This Week"
            products={MOBILE_TRENDING}
            seeAllHref="/products?filter=trending"
            cardWidth={180}
          />

          {/* 8. Latest Drops */}
          <MobileLatestDrops />

          {/* 9. Featured Collection */}
          <MobileFeaturedCollection />

          {/* 10. Luxury Shoes */}
          <MobileProductSlider
            title="Luxury"
            eyebrow="Maison Edit"
            products={MOBILE_LUXURY}
            seeAllHref="/category/luxury"
            cardWidth={200}
          />

          {/* 11. Designer Sneakers */}
          <MobileProductSlider
            title="Designer"
            eyebrow="Curated"
            products={MOBILE_DESIGNER}
            seeAllHref="/category/designer"
            cardWidth={190}
          />

          {/* 12. Recommended For You */}
          <MobileRecommended />

          {/* 13. Categories */}
          <MobileCategories />

          {/* 14. Brands */}
          <MobileBrands />

          {/* 15. Newsletter */}
          <MobileNewsletter />

          {/* 16. Footer */}
          <MobileFooter />
        </main>

        {/* 17. Floating bottom nav */}
        <MobileBottomNav />

        {/* 18. Menu drawer — rendered at page level so its z-index (1100)
              is not trapped inside the MobileHeader's stacking context. */}
        <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </div>
  );
}
