'use client';

import React, { useState, useEffect } from 'react';
import MobileSplash from '@/components/mobile/MobileSplash';
import MobileHeader from '@/components/mobile/MobileHeader';
import MobileSearch from '@/components/mobile/MobileSearch';
import MobileHero from '@/components/mobile/MobileHero';
import MobileFeaturedCollection from '@/components/mobile/MobileFeaturedCollection';
import MobileProductSlider from '@/components/mobile/MobileProductSlider';
import MobileLatestDrops from '@/components/mobile/MobileLatestDrops';
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
 * Section order:
 *   1. MobileSplash       — fullscreen luxury splash (auto-dismiss 4s)
 *   2. MobileHeader       — sticky minimal header w/ cart + wishlist badges
 *   3. MobileSearch       — premium search pill
 *   4. MobileHero         — black editorial hero with floating sneaker
 *   5. MobileFeaturedCollection — 3-card horizontal curated edit
 *   6. MobileProductSlider (Trending)  — floating-product slider
 *   7. MobileProductSlider (Luxury)    — floating-product slider
 *   8. MobileProductSlider (Designer)  — floating-product slider
 *   9. MobileLatestDrops  — 2-column new arrivals grid
 *  10. MobileBrands       — infinite marquee of 11 brand wordmarks
 *  11. MobileCategories   — circular category rail
 *  12. MobileNewsletter   — black email-capture card
 *  13. MobileFooter       — minimal link footer
 *  14. MobileBottomNav    — floating 5-item bottom nav
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

        {/* 2. Sticky header */}
        <MobileHeader />

        {/* 3. Main scrollable content */}
        <main
          style={{
            paddingTop: 14,
            paddingBottom: 100, // clear bottom nav
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {/* 3. Search */}
          <div style={{ padding: '0 18px' }}>
            <MobileSearch />
          </div>

          {/* 4. Hero */}
          <div style={{ padding: '20px 18px 0' }}>
            <MobileHero />
          </div>

          {/* 5. Featured Collection */}
          <MobileFeaturedCollection />

          {/* 6. Trending */}
          <MobileProductSlider
            title="Trending"
            eyebrow="This Week"
            products={MOBILE_TRENDING}
            seeAllHref="/products?filter=trending"
            cardWidth={180}
          />

          {/* 7. Luxury Shoes */}
          <MobileProductSlider
            title="Luxury"
            eyebrow="Maison Edit"
            products={MOBILE_LUXURY}
            seeAllHref="/category/luxury"
            cardWidth={200}
          />

          {/* 8. Designer Sneakers */}
          <MobileProductSlider
            title="Designer"
            eyebrow="Curated"
            products={MOBILE_DESIGNER}
            seeAllHref="/category/designer"
            cardWidth={190}
          />

          {/* 9. Latest Drops */}
          <MobileLatestDrops />

          {/* 10. Brands */}
          <MobileBrands />

          {/* 11. Categories */}
          <MobileCategories />

          {/* 12. Newsletter */}
          <MobileNewsletter />

          {/* 13. Footer */}
          <MobileFooter />
        </main>

        {/* 14. Floating bottom nav */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
