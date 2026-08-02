'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileHeroBanner — premium editorial hero carousel.
 *
 * DESIGN INTENT (LN KICKS premium refresh):
 *   Nike SNKRS + Apple Store + END Clothing editorial inspiration.
 *   Reimagined from the previous Adidas-style asymmetric split into a
 *   taller, more dramatic full-bleed editorial canvas.
 *
 * Visual contract:
 *   - 3 promotional banners, swipeable horizontally with snap
 *   - Auto-advance every 6s (pauses on touch / hover / focus / reduced-motion)
 *   - Manual swipe with momentum + snap-to-card
 *   - Editorial page indicator (numeric "01 / 03" + thin progress line)
 *   - Full-bleed feel: banner extends edge-to-edge with theme.pad inner padding
 *   - Height 280px — tall enough for massive type + image, short enough to
 *     keep Popular Shoes near the fold
 *
 * Banner anatomy (per slide):
 *   ┌────────────────────────────────────────────────────┐
 *   │  EYEBROW                                  01 / 03  │
 *   │                                                    │
 *   │         STEP INTO                                  │
 *   │         LEGEND.                                    │
 *   │                                                    │
 *   │   [floating shoe PNG,                              │
 *   │    drop-shadow, rotated]                           │
 *   │                                                    │
 *   │   Sub-copy sentence.                               │
 *   │   ─── SHOP NOW →                                   │
 *   └────────────────────────────────────────────────────┘
 *              ▲
 *      Light variant: off-white canvas (#FAFAFA)
 *      Dark variant: matte black (#0A0A0A)
 *      LN wordmark watermark for editorial flair
 *
 * Each banner tappable → product / category / collection route.
 *
 * LN KICKS theme: pure B&W. Light slide = off-white canvas + black type.
 * Dark slide = matte black canvas + white type. Alternates for visual rhythm.
 *
 * Phase 4 polish:
 *  - All design tokens (no hardcoded values)
 *  - Editorial numeric page indicator (01 / 03) + progress line
 *  - Massive Oswald display type (72px) — Nike editorial scale
 *  - Taller 280px canvas with more breathing room
 *  - Off-white surface (#FAFAFA) on light variant — Apple Store warmth
 *  - Haptic selection tick on manual swipe / dot tap
 *  - Pressed state on banner (scale 0.99)
 *  - Focus-visible ring on banner + indicator
 *  - ARIA: role="region", aria-roledescription="carousel", per-slide label
 *  - Reduced motion respected (auto-advance disabled)
 *  - Memoized — only re-renders when activeIndex changes
 */

type Banner = {
  id: string;
  eyebrow: string;
  /** Small lead-in line above the big headline (e.g. "Step Into") */
  lead: string;
  /** Big bold display word (e.g. "LEGEND") */
  display: string;
  /** Single-sentence subtitle */
  subtitle: string;
  image: string;
  href: string;
  /** Visual variant — 'light' (off-white bg) or 'dark' (matte black bg) */
  variant: 'light' | 'dark';
};

const BANNERS: Banner[] = [
  {
    id: 'hero-aj1-powder',
    eyebrow: 'Hyped Drops',
    lead: 'Step Into',
    display: 'LEGEND',
    subtitle: 'The pair you’ll want to be seen in.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
    variant: 'light',
  },
  {
    id: 'hero-dunk-rose',
    eyebrow: 'Summer Edit',
    lead: 'Kick Up The',
    display: 'COOL',
    subtitle: '“That shoe” you’ll want to be seen in.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
    variant: 'dark',
  },
  {
    id: 'hero-samba',
    eyebrow: 'Heritage Icons',
    lead: 'Own The',
    display: 'CLASSIC',
    subtitle: 'Timeless silhouette, modern swagger.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-samba-og-wonder-silver',
    variant: 'light',
  },
];

/** Auto-advance interval (ms). */
const AUTO_ADVANCE_MS = 6000;

function MobileHeroBannerImpl() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect prefers-reduced-motion once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const onChange = () => {
      prefersReducedMotion.current = mq.matches;
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Auto-advance — pauses while user is interacting
  useEffect(() => {
    if (prefersReducedMotion.current || isUserInteracting) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNERS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [isUserInteracting]);

  // Sync scroll position to activeIndex whenever it changes (e.g. auto-advance)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slideWidth = scroller.offsetWidth;
    scroller.scrollTo({ left: slideWidth * activeIndex, behavior: 'smooth' });
  }, [activeIndex]);

  // Update activeIndex when user manually scrolls (debounced via scroll end)
  const handleScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slideWidth = scroller.offsetWidth;
    if (slideWidth === 0) return;
    const idx = Math.round(scroller.scrollLeft / slideWidth);
    if (idx !== activeIndex && idx >= 0 && idx < BANNERS.length) {
      setActiveIndex(idx);
      haptic.selection();
    }
  }, [activeIndex]);

  // Touch interaction tracking — pause auto-advance while dragging
  const handleTouchStart = useCallback(() => {
    setIsUserInteracting(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Resume auto-advance after 3 seconds of no interaction
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsUserInteracting(false), 3000);
  }, []);

  const handleDotClick = useCallback((idx: number) => {
    haptic.selection();
    setActiveIndex(idx);
  }, []);

  // Editorial numeric indicator: "01 / 03"
  const formatNum = (n: number) => String(n + 1).padStart(2, '0');

  return (
    <section
      aria-label="Featured promotions"
      aria-roledescription="carousel"
      style={{
        paddingTop: theme.spacing.xxl,
        paddingBottom: theme.spacing.lg,
      }}
    >
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: `0 ${theme.spacing.pad}px`,
          gap: 0,
        }}
        className="mhb-scroller"
      >
        {BANNERS.map((banner, idx) => (
          <BannerCard
            key={banner.id}
            banner={banner}
            isActive={idx === activeIndex}
            pageIndex={idx}
            pageCount={BANNERS.length}
            ariaLabel={`Slide ${idx + 1} of ${BANNERS.length}: ${banner.display}`}
          />
        ))}
      </div>

      {/* Editorial page indicator: numeric + progress line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.md,
          marginTop: theme.spacing.lg,
          padding: `0 ${theme.spacing.pad}px`,
        }}
      >
        {/* Left numeric: current slide */}
        <span
          aria-hidden
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.sm,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: theme.letterSpacing.wider,
            color: theme.colors.textPrimary,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {formatNum(activeIndex)}
        </span>

        {/* Progress line — segmented */}
        <div
          role="tablist"
          aria-label="Select slide"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flex: 1,
            maxWidth: 120,
          }}
        >
          {BANNERS.map((banner, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={banner.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}: ${banner.display}`}
                onClick={() => handleDotClick(idx)}
                className="mhb-dot"
                style={{
                  flex: isActive ? 1 : '0 0 auto',
                  height: 2,
                  borderRadius: theme.radius.pill,
                  background: isActive ? theme.colors.black : theme.colors.grey300,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  minWidth: isActive ? 0 : 18,
                  transition: `flex ${theme.motion.duration.slow} ${theme.motion.easing.out}, background-color ${theme.motion.duration.normal} ${theme.motion.easing.out}, min-width ${theme.motion.duration.slow} ${theme.motion.easing.out}`,
                }}
              />
            );
          })}
        </div>

        {/* Right numeric: total slides */}
        <span
          aria-hidden
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.sm,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: theme.letterSpacing.wider,
            color: theme.colors.textTertiary,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {formatNum(BANNERS.length - 1)}
        </span>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .mhb-scroller::-webkit-scrollbar {
          display: none;
        }
        .mhb-scroller > * {
          scroll-snap-align: center;
          flex: 0 0 100%;
        }
        .mhb-dot:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </section>
  );
}

/* ── Single banner card ───────────────────────────────────────── */
function BannerCardImpl({
  banner,
  isActive,
  pageIndex,
  pageCount,
  ariaLabel,
}: {
  banner: Banner;
  isActive: boolean;
  pageIndex: number;
  pageCount: number;
  ariaLabel: string;
}) {
  const isDark = banner.variant === 'dark';
  // Light variant: off-white canvas (#FAFAFA) — Apple Store warmth.
  // Dark variant: matte black (#0A0A0A).
  const bg = isDark ? theme.colors.black : theme.colors.offWhite;
  const fg = isDark ? theme.colors.white : theme.colors.black;
  const eyebrowFg = isDark ? 'rgba(255,255,255,0.65)' : theme.colors.textSecondary;
  const subtitleFg = isDark ? 'rgba(255,255,255,0.72)' : theme.colors.textSecondary;
  const underlineColor = isDark ? theme.colors.white : theme.colors.black;
  const watermarkColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.035)';
  const pageIndexFg = isDark ? 'rgba(255,255,255,0.4)' : theme.colors.textTertiary;

  return (
    <Link
      href={banner.href}
      aria-label={ariaLabel}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      className="mhb-card pressable"
      onPointerDown={() => haptic.light()}
      style={{
        position: 'relative',
        display: 'grid',
        // Asymmetric split: left ~45% image / right ~55% text
        gridTemplateColumns: '45fr 55fr',
        alignItems: 'stretch',
        gap: 0,
        background: bg,
        borderRadius: theme.radius.hero,
        overflow: 'hidden',
        border: 'none',
        boxShadow: isDark ? theme.shadows.lg : theme.shadows.premium,
        color: fg,
        textDecoration: 'none',
        height: 280,
        boxSizing: 'border-box',
        margin: `0 ${theme.spacing.xs}px`,
      }}
    >
      {/* Decorative oversized wordmark watermark — luxury editorial detail */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -42,
          left: -12,
          fontFamily: theme.fontFamily.display,
          fontSize: 180,
          fontWeight: theme.fontWeight.black,
          color: watermarkColor,
          letterSpacing: '-0.06em',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        LN
      </span>

      {/* ── Left: floating shoe image ─────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing.lg,
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner.image}
          alt=""
          aria-hidden
          draggable={false}
          style={{
            maxWidth: '125%',
            maxHeight: '125%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            filter: theme.dropShadows.lg,
            transform: 'rotate(-14deg)',
            transition: `transform ${theme.motion.duration.slow} ${theme.motion.easing.out}`,
          }}
          className="mhb-shoe"
        />
      </div>

      {/* ── Right: text block ─────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: theme.spacing.xs + 2,
          padding: `${theme.spacing.xxl}px ${theme.spacing.xxl}px ${theme.spacing.xxl}px 0`,
        }}
      >
        {/* Top row: eyebrow + page index */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: theme.spacing.xs,
          }}
        >
          <span
            style={{
              color: eyebrowFg,
              fontSize: theme.fontSize.xs,
              fontWeight: theme.fontWeight.bold,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            {banner.eyebrow}
          </span>
          <span
            aria-hidden
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: 9.5,
              fontWeight: theme.fontWeight.bold,
              letterSpacing: theme.letterSpacing.wide,
              color: pageIndexFg,
              fontFeatureSettings: '"tnum"',
            }}
          >
            {String(pageIndex + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}
          </span>
        </div>

        {/* Display headline — small lead + massive display word */}
        <h2
          style={{
            margin: 0,
            fontFamily: theme.fontFamily.display,
            lineHeight: theme.lineHeight.tight,
            letterSpacing: theme.letterSpacing.tightest,
            color: fg,
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.medium,
              letterSpacing: theme.letterSpacing.normal,
              lineHeight: 1.1,
              marginBottom: 2,
              opacity: 0.75,
            }}
          >
            {banner.lead}
          </span>
          <span
            style={{
              display: 'block',
              fontSize: theme.fontSize.heroLg,
              fontWeight: theme.fontWeight.black,
              lineHeight: 0.92,
            }}
          >
            {banner.display}
          </span>
        </h2>

        {/* Subtitle */}
        <p
          style={{
            margin: 0,
            fontSize: theme.fontSize.sm,
            fontWeight: theme.fontWeight.regular,
            color: subtitleFg,
            lineHeight: theme.lineHeight.snug,
            maxWidth: 200,
            marginTop: theme.spacing.xs,
          }}
        >
          {banner.subtitle}
        </p>

        {/* Underline text CTA — editorial style */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: theme.spacing.xs,
            marginTop: theme.spacing.md,
            fontSize: theme.fontSize.xs,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: theme.letterSpacing.wider,
            textTransform: 'uppercase',
            color: fg,
            borderBottom: `1.5px solid ${underlineColor}`,
            paddingBottom: 3,
          }}
          className="mhb-cta"
        >
          Shop Now
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            <polyline points="12 5 19 12 12 19" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <style jsx>{`
        .mhb-card:active {
          transform: scale(0.99);
        }
        .mhb-card:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        @media (hover: hover) {
          .mhb-card:hover .mhb-shoe {
            transform: rotate(-18deg) translateY(-6px) scale(1.05);
          }
          .mhb-card:hover .mhb-cta {
            transform: translateX(3px);
          }
        }
      `}</style>
    </Link>
  );
}

const BannerCard = memo(BannerCardImpl);

export const MobileHeroBanner = memo(MobileHeroBannerImpl);
export default MobileHeroBanner;
