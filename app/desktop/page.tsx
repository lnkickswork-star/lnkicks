'use client';

import React from 'react';
import AnnouncementBar from '@/components/desktop/AnnouncementBar';
import MainHeader from '@/components/desktop/MainHeader';
import HeroBanner from '@/components/desktop/HeroBanner';
import TrendingSection from '@/components/desktop/TrendingSection';
import TrustBadges from '@/components/desktop/TrustBadges';
import InstantShipGrid from '@/components/desktop/InstantShipGrid';
import LuxuryHandbags from '@/components/desktop/LuxuryHandbags';
import BrandsSection from '@/components/desktop/BrandsSection';
import StreetwearIndia from '@/components/desktop/StreetwearIndia';
import Newsletter from '@/components/desktop/Newsletter';
import MainFooter from '@/components/desktop/MainFooter';

/**
 * DesktopHome — production desktop homepage for LNKICKS.
 *
 * Implements the Stitch design (PRIMARY source of truth) with the following
 * 11 sections in order:
 *   1. AnnouncementBar  — black shipping banner
 *   2. MainHeader       — sticky white header w/ KM logo, nav, cart
 *   3. HeroBanner       — rounded dark hero "STOCKED & LOADED"
 *   4. TrendingSection  — carousel w/ featured product + side cards
 *   5. TrustBadges      — 4-col stats row
 *   6. InstantShipGrid  — 4-col product grid
 *   7. LuxuryHandbags   — filterable bag carousel
 *   8. BrandsSection    — grayscale brand wordmarks
 *   9. StreetwearIndia  — homegrown brand pills
 *  10. Newsletter       — "Sign up and save" email capture
 *  11. MainFooter       — dark 4-col footer w/ about paragraph
 *
 * Architecture:
 *  - Uses inline styles to match existing project conventions (no Tailwind)
 *  - Inter font loaded via next/font/google in app/layout.tsx (weights 300-800)
 *  - External Google-hosted image URLs from Stitch design (LFS pointers in
 *    /public/ are broken, so we use the design's canonical URLs)
 *  - 'use client' because MainHeader uses useApp() for cart badge
 *  - No next/image (avoids next.config.js remotePatterns changes)
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
        <LuxuryHandbags />
        <BrandsSection />
        <StreetwearIndia />
        <Newsletter />
      </main>
      <MainFooter />
    </div>
  );
}
