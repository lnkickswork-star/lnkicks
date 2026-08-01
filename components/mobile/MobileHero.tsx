'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { dropShadows } from '@/lib/mobile/theme/shadows';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileHero — premium editorial hero banner.
 *
 * Full-width black card with floating sneaker PNG, large headline,
 * sub-text, and a black "Shop Now" pill CTA. Premium drop-shadow.
 *
 * LN KICKS theme: black hero card on white page, white text, accent gold dot.
 *
 * Phase 3 polish:
 *  - Design tokens
 *  - Haptic light tick on Shop Now tap
 *  - Pressed state (scale 0.97)
 *  - Focus-visible ring
 *  - aria-label on CTA
 *  - Memoized
 *
 * NOTE: Uses external CDN image URL because local /public/*.png are LFS pointers.
 */
function MobileHeroImpl() {
  return (
    <section
      style={{
        position: 'relative',
        borderRadius: theme.radius.hero,
        overflow: 'hidden',
        background: theme.colors.black,
        padding: `${theme.spacing.xxxl}px ${theme.spacing.xxl}px ${theme.spacing.xxxl}px`,
        color: theme.colors.white,
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: theme.shadows.xl,
      }}
    >
      {/* Background watermark wordmark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          fontFamily: theme.fontFamily.display,
          fontSize: 140,
          fontWeight: theme.fontWeight.black,
          color: 'rgba(255,255,255,0.04)',
          letterSpacing: theme.letterSpacing.tight,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: theme.zIndex.bg,
        }}
      >
        LK
      </div>

      {/* Top: eyebrow + headline */}
      <div style={{ position: 'relative', zIndex: theme.zIndex.base + 1, maxWidth: 220 }}>
        <p
          style={{
            fontSize: theme.fontSize.xs,
            fontWeight: theme.fontWeight.bold,
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            letterSpacing: theme.letterSpacing.extreme,
            margin: `0 0 ${theme.spacing.md + 2}px 0`,
          }}
        >
          Stocked &amp; Loaded
        </p>
        <h2
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.hero,
            fontWeight: theme.fontWeight.extrabold,
            lineHeight: 1,
            letterSpacing: theme.letterSpacing.tight,
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Premium<br />Sneakers
        </h2>
      </div>

      {/* Middle: floating sneaker */}
      <div
        style={{
          position: 'relative',
          zIndex: theme.zIndex.base + 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: `${theme.spacing.sm}px 0`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw"
          alt="Air Jordan 1 Low Powder Blue"
          width={240}
          height={240}
          loading="eager"
          // fetchPriority="high" — boost LCP for hero image
          // (next/image not used; plain img tag with manual priority)
          style={{
            width: 240,
            height: 'auto',
            maxWidth: '80%',
            filter: dropShadows.xl,
            transform: 'rotate(-18deg)',
          }}
        />
      </div>

      {/* Bottom: CTA row */}
      <div
        style={{
          position: 'relative',
          zIndex: theme.zIndex.base + 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
        }}
      >
        <div>
          <div
            style={{
              fontSize: theme.fontSize.sm,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: theme.fontWeight.medium,
              margin: `0 0 ${theme.spacing.xs}px 0`,
            }}
          >
            From
          </div>
          <div
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.title,
              fontWeight: theme.fontWeight.extrabold,
              letterSpacing: '-0.01em',
            }}
          >
            Rs. 6,199
          </div>
        </div>
        <Link
          href="/products"
          aria-label="Shop now — browse all sneakers"
          onPointerDown={() => haptic.light()}
          className="pressable mh-hero-cta"
          style={{
            background: theme.colors.white,
            color: theme.colors.textPrimary,
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.body,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: theme.letterSpacing.wider,
            textTransform: 'uppercase',
            padding: `${theme.spacing.md + 2}px ${theme.spacing.xxl}px`,
            borderRadius: theme.radius.pill,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          Shop Now
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <style jsx>{pressableStyle}</style>
    </section>
  );
}

export const MobileHero = memo(MobileHeroImpl);
export default MobileHero;
