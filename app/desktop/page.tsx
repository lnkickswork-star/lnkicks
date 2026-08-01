'use client';

import React from 'react';
import AnnouncementBar from '@/components/desktop/AnnouncementBar';
import MainHeader from '@/components/desktop/MainHeader';
import HeroBanner from '@/components/desktop/HeroBanner';
import TrendingSection from '@/components/desktop/TrendingSection';
import TrustBadges from '@/components/desktop/TrustBadges';
import InstantShipGrid from '@/components/desktop/InstantShipGrid';
import NikeRunningSection from '@/components/desktop/NikeRunningSection';
import JordanCollectionSection from '@/components/desktop/JordanCollectionSection';
import AdidasOriginalsSection from '@/components/desktop/AdidasOriginalsSection';
import YeezyCollectionSection from '@/components/desktop/YeezyCollectionSection';
import NewBalanceSection from '@/components/desktop/NewBalanceSection';
import LuxuryShoes from '@/components/desktop/LuxuryShoes';
import BrandsSection from '@/components/desktop/BrandsSection';
import Newsletter from '@/components/desktop/Newsletter';
import MainFooter from '@/components/desktop/MainFooter';

/**
 * DesktopHome — production desktop homepage for LN KICKS.
 *
 * Section order (Phase 1.5 refined):
 *   1. AnnouncementBar         — black shipping banner
 *   2. MainHeader              — sticky premium header, LN KICKS logo, 9-item nav
 *   3. HeroBanner              — luxury editorial hero "STOCKED & LOADED"
 *   4. TrendingSection         — premium floating-product slider (Trending This Week)
 *   5. TrustBadges             — infinite horizontal marquee of brand stats
 *   6. InstantShipGrid         — 4-col premium sneaker grid
 *   7. NikeRunningSection      — premium floating-product slider (Nike Running)
 *   8. JordanCollectionSection — premium floating-product slider (Jordan Collection)
 *   9. AdidasOriginalsSection  — premium floating-product slider (Adidas Originals)
 *  10. YeezyCollectionSection  — premium floating-product slider (Yeezy Collection)
 *  11. NewBalanceSection       — premium floating-product slider (New Balance)
 *  12. LuxuryShoes             — LV / Gucci / Prada / Balenciaga / Dior carousel
 *  13. BrandsSection           — infinite marquee of 11 brand wordmarks
 *  14. Newsletter              — "Sign up and save" email capture
 *  15. MainFooter              — premium dark footer w/ newsletter block
 *
 * Architecture:
 *  - Inline styles to match existing project conventions (no Tailwind)
 *  - Inter font via next/font/google in app/layout.tsx (weights 300-800)
 *  - External Google-hosted image URLs (LFS pointers in /public/ are broken)
 *  - 'use client' because MainHeader uses useApp() for cart badge
 *  - styled-jsx for hover/animations (scoped CSS, no global stylesheet)
 *
 * Desktop-only: optimized for 1280px–1920px viewports.
 */
export default function DesktopHome() {
  return (
    <div
      style={{
        background: '#ffffff',
        color: '#000000',
        fontFamily: 'var(--font-inter), sans-serif',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <AnnouncementBar />
      <MainHeader />
      <main>
        <HeroBanner />
        <TrendingSection />
        <TrustBadges />
        <InstantShipGrid />
        <NikeRunningSection />
        <JordanCollectionSection />
        <AdidasOriginalsSection />
        <YeezyCollectionSection />
        <NewBalanceSection />
        <LuxuryShoes />
        <BrandsSection />
        <Newsletter />
      </main>
      <MainFooter />
    </div>
  );
}
