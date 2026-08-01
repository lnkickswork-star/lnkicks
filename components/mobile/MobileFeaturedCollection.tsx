'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme as designTokens } from '@/lib/mobile/theme/theme';
import { dropShadows } from '@/lib/mobile/theme/shadows';
import { haptic } from '@/lib/mobile/utils/haptics';
import { MOBILE_FEATURED } from './mobileProducts';

/**
 * MobileFeaturedCollection — editorial 3-card horizontal collection.
 *
 * Each card is a tall premium tile with a floating sneaker on a soft
 * black or off-white background. Big editorial typography.
 *
 * LN KICKS theme: alternating black / white cards, gold accent dot.
 *
 * Phase 3 polish: design tokens, haptics, focus-visible ring, memoized.
 * Renamed local `theme` to `cardTheme` to avoid clashing with imported
 * design token `theme`.
 */
type CardTheme = {
  bg: string;
  fg: string;
  sub: string;
  accent: string;
  isDark: boolean;
};

const CARD_THEMES: CardTheme[] = [
  {
    bg: designTokens.colors.black,
    fg: designTokens.colors.white,
    sub: 'rgba(255,255,255,0.65)',
    accent: designTokens.colors.white,
    isDark: true,
  },
  {
    bg: designTokens.colors.white,
    fg: designTokens.colors.textPrimary,
    sub: designTokens.colors.textSecondary,
    accent: designTokens.colors.black,
    isDark: false,
  },
  {
    bg: designTokens.colors.grey50,
    fg: designTokens.colors.textPrimary,
    sub: designTokens.colors.textSecondary,
    accent: designTokens.colors.black,
    isDark: false,
  },
];

function MobileFeaturedCollectionImpl() {
  return (
    <section style={{ paddingTop: designTokens.spacing.section }}>
      <div
        style={{
          padding: `0 ${designTokens.spacing.pad}px`,
          marginBottom: designTokens.spacing.xxl,
        }}
      >
        <p
          style={{
            fontSize: designTokens.fontSize.xs,
            fontWeight: designTokens.fontWeight.bold,
            color: designTokens.colors.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: designTokens.letterSpacing.extreme,
            margin: `0 0 ${designTokens.spacing.sm}px 0`,
          }}
        >
          Curated Edit
        </p>
        <h2
          style={{
            fontFamily: designTokens.fontFamily.display,
            fontSize: designTokens.fontSize.h2,
            fontWeight: designTokens.fontWeight.extrabold,
            color: designTokens.colors.textPrimary,
            letterSpacing: designTokens.letterSpacing.tight,
            lineHeight: 1,
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Featured Collection
        </h2>
      </div>

      <div
        style={{
          display: 'flex',
          gap: designTokens.spacing.md - 2,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: `${designTokens.spacing.xs}px ${designTokens.spacing.pad}px ${designTokens.spacing.md}px`,
        }}
        className="mfc-scroller"
      >
        {MOBILE_FEATURED.map((p, i) => {
          const cardTheme = CARD_THEMES[i % CARD_THEMES.length];
          return (
            <Link
              key={p.id}
              href={p.href}
              aria-label={`${p.brand} ${p.name} — ${p.price}`}
              onPointerDown={() => haptic.selection()}
              className="mfc-card"
              style={{
                flex: '0 0 240px',
                maxWidth: 240,
                scrollSnapAlign: 'start',
                background: cardTheme.bg,
                color: cardTheme.fg,
                borderRadius: 24,
                padding: `${designTokens.spacing.xl}px ${designTokens.spacing.pad}px`,
                position: 'relative',
                overflow: 'hidden',
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textDecoration: 'none',
                border: !cardTheme.isDark && cardTheme.bg === designTokens.colors.white
                  ? `1px solid ${designTokens.colors.grey150}`
                  : 'none',
                transition: `transform ${designTokens.motion.duration.instant} ${designTokens.motion.easing.out}`,
              }}
            >
              {/* Index number watermark */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: designTokens.spacing.md,
                  right: designTokens.spacing.lg,
                  fontFamily: designTokens.fontFamily.display,
                  fontSize: 56,
                  fontWeight: designTokens.fontWeight.black,
                  color: cardTheme.isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.05)',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                0{i + 1}
              </div>

              {/* Brand label */}
              <p
                style={{
                  fontSize: designTokens.fontSize.xs,
                  fontWeight: designTokens.fontWeight.bold,
                  color: cardTheme.sub,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  margin: 0,
                  position: 'relative',
                  zIndex: designTokens.zIndex.base + 2,
                }}
              >
                {p.brand}
              </p>

              {/* Floating sneaker */}
              <div
                style={{
                  position: 'relative',
                  zIndex: designTokens.zIndex.base + 2,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: `${designTokens.spacing.sm}px 0`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  draggable={false}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 130,
                    objectFit: 'contain',
                    filter: cardTheme.isDark
                      ? 'drop-shadow(0 18px 24px rgba(0,0,0,0.5))'
                      : dropShadows.md,
                    transform: 'rotate(-12deg)',
                  }}
                />
              </div>

              {/* Price + CTA arrow */}
              <div
                style={{
                  position: 'relative',
                  zIndex: designTokens.zIndex.base + 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: designTokens.spacing.sm,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: designTokens.fontSize.xs,
                      color: cardTheme.sub,
                      fontWeight: designTokens.fontWeight.medium,
                      marginBottom: 2,
                    }}
                  >
                    From
                  </div>
                  <div
                    style={{
                      fontFamily: designTokens.fontFamily.display,
                      fontSize: designTokens.fontSize.lg,
                      fontWeight: designTokens.fontWeight.extrabold,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {p.price}
                  </div>
                </div>
                <div
                  aria-hidden
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: cardTheme.accent,
                    color: cardTheme.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
        <div aria-hidden style={{ flex: `0 0 ${designTokens.spacing.pad}px`, height: 1 }} />
      </div>

      <style jsx>{`
        .mfc-scroller::-webkit-scrollbar {
          display: none;
        }
        .mfc-card {
          -webkit-tap-highlight-color: transparent;
        }
        .mfc-card:active {
          transform: scale(0.97);
        }
        .mfc-card:focus-visible {
          outline: 2px solid ${designTokens.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </section>
  );
}

export const MobileFeaturedCollection = memo(MobileFeaturedCollectionImpl);
export default MobileFeaturedCollection;
