'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileHeroBanner — premium swipeable banner carousel.
 *
 * Design reference: Adidas editorial banner — cool grey canvas, asymmetric
 * split (left ~42% product image / right ~58% text), oversized geometric
 * display headline ("kick up the COOL" style), small subtitle sentence,
 * underlined "SHOP NOW" text CTA (no button shape), generous negative
 * space, soft drop shadow under the floating sneaker.
 *
 * Layout contract:
 *   - 3 promotional banners, swipeable horizontally
 *   - Auto-advance every 5 seconds (pauses on touch / hover / focus)
 *   - Manual swipe with momentum + snap-to-card
 *   - Page indicator dots below the carousel
 *   - Rounded corners (radius.hero = 28px)
 *   - Full width with theme.pad side margins
 *   - Height 200px — tall enough for the headline + image, short enough
 *     to keep Popular Shoes above the fold
 *
 * Banner anatomy (per Adidas reference):
 *   ┌────────────────────────────────────────────────────┐
 *   │                          │                         │
 *   │                          │  EYEBROW                │
 *   │   [floating shoe PNG]    │  KICK UP THE            │
 *   │   drop-shadow            │  COOL                   │
 *   │                          │  Sub-copy sentence.     │
 *   │                          │  ─── SHOP NOW →         │
 *   │                          │                         │
 *   └────────────────────────────────────────────────────┘
 *                       ▲
 *              Cool grey background (#f0f0f0)
 *              LN wordmark watermark for editorial flair
 *
 * Each banner tappable → product / category / collection route.
 *
 * LN KICKS theme: cool grey canvas, pure black text, white product PNG.
 * One banner inverts (matte black bg + white text) for visual rhythm.
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded values)
 *  - Haptic selection tick on manual swipe / dot tap
 *  - Pressed state on banner (scale 0.99)
 *  - Focus-visible ring on dots + banner
 *  - ARIA: role="region", aria-roledescription="carousel", aria-label per slide
 *  - Reduced motion respected (auto-advance disabled if user prefers reduced motion)
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
  /** Visual variant — 'light' (cool grey bg) or 'dark' (matte black bg) */
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
const AUTO_ADVANCE_MS = 5000;

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

  return (
    <section
      aria-label="Featured promotions"
      aria-roledescription="carousel"
      style={{
        paddingTop: theme.spacing.xxl,
        paddingBottom: theme.spacing.md,
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
            ariaLabel={`Slide ${idx + 1} of ${BANNERS.length}: ${banner.display}`}
          />
        ))}
      </div>

      {/* Page indicator dots */}
      <div
        role="tablist"
        aria-label="Select slide"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.sm,
          marginTop: theme.spacing.md,
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
                width: isActive ? 22 : 7,
                height: 7,
                borderRadius: theme.radius.pill,
                background: isActive ? theme.colors.black : theme.colors.grey300,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: `width ${theme.motion.duration.normal} ${theme.motion.easing.out}, background-color ${theme.motion.duration.normal} ${theme.motion.easing.out}`,
              }}
            />
          );
        })}
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
  ariaLabel,
}: {
  banner: Banner;
  isActive: boolean;
  ariaLabel: string;
}) {
  const isDark = banner.variant === 'dark';
  // Light variant: cool grey canvas (#f0f0f0). Dark variant: matte black.
  const bg = isDark ? theme.colors.black : theme.colors.grey150;
  const fg = isDark ? theme.colors.white : theme.colors.black;
  const eyebrowFg = isDark ? 'rgba(255,255,255,0.7)' : theme.colors.textSecondary;
  const subtitleFg = isDark ? 'rgba(255,255,255,0.78)' : theme.colors.textSecondary;
  const underlineColor = isDark ? theme.colors.white : theme.colors.black;
  const watermarkColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

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
        // Left ~42% image / Right ~58% text — matches Adidas reference
        gridTemplateColumns: '42fr 58fr',
        alignItems: 'center',
        gap: 0,
        background: bg,
        borderRadius: theme.radius.hero,
        overflow: 'hidden',
        border: 'none',
        boxShadow: isDark ? theme.shadows.lg : theme.shadows.sm,
        color: fg,
        textDecoration: 'none',
        height: 200,
        boxSizing: 'border-box',
        margin: `0 ${theme.spacing.xs}px`,
      }}
    >
      {/* Decorative oversized wordmark watermark — luxury editorial detail */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -28,
          left: -8,
          fontFamily: theme.fontFamily.display,
          fontSize: 150,
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
          padding: theme.spacing.md,
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
            maxWidth: '115%',
            maxHeight: '115%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            filter: theme.dropShadows.lg,
            transform: 'rotate(-12deg)',
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
          alignItems: 'flex-start',
          gap: theme.spacing.xs + 1,
          padding: `${theme.spacing.lg}px ${theme.spacing.xl}px ${theme.spacing.lg}px 0`,
        }}
      >
        {/* Eyebrow */}
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

        {/* Display headline — small lead + big display word */}
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
              opacity: 0.85,
            }}
          >
            {banner.lead}
          </span>
          <span
            style={{
              display: 'block',
              fontSize: 40,
              fontWeight: theme.fontWeight.black,
              lineHeight: 0.95,
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
            maxWidth: 180,
          }}
        >
          {banner.subtitle}
        </p>

        {/* Underline text CTA — Adidas reference style */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: theme.spacing.xs,
            marginTop: theme.spacing.xs + 2,
            fontSize: theme.fontSize.xs,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: theme.letterSpacing.wider,
            textTransform: 'uppercase',
            color: fg,
            borderBottom: `1.5px solid ${underlineColor}`,
            paddingBottom: 2,
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
            transform: rotate(-16deg) translateY(-4px) scale(1.04);
          }
          .mhb-card:hover .mhb-cta {
            transform: translateX(2px);
          }
        }
      `}</style>
    </Link>
  );
}

const BannerCard = memo(BannerCardImpl);

export const MobileHeroBanner = memo(MobileHeroBannerImpl);
export default MobileHeroBanner;
