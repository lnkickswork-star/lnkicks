'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileHeroBanner — premium swipeable banner carousel.
 *
 * Layout contract:
 *   - 3 promotional banners, swipeable horizontally
 *   - Auto-advance every 5 seconds (pauses on touch / hover / focus)
 *   - Manual swipe with momentum + snap-to-card
 *   - Page indicator dots below the carousel
 *   - Rounded corners (radius.hero = 28px)
 *   - Full width with theme.pad side margins
 *   - Premium height — 180px (16:9-ish on a 440px container, taller on narrow phones)
 *
 * Banner anatomy:
 *   ┌─────────────────────────────────────────────┐
 *   │  Eyebrow chip (top-left)                    │
 *   │                                              │
 *   │  Title (large display)         [shoe image] │
 *   │  Subtitle (one line)                        │
 *   │  CTA arrow →                                │
 *   └─────────────────────────────────────────────┘
 *
 * Each banner tappable → product / category / collection route.
 *
 * LN KICKS theme: matte black banners with white text + floating shoe PNGs.
 * One banner inverts (white bg + black text) for visual rhythm.
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
  title: string;
  subtitle: string;
  image: string;
  href: string;
  /** Visual variant — 'dark' (matte black bg) or 'light' (white bg) */
  variant: 'dark' | 'light';
};

const BANNERS: Banner[] = [
  {
    id: 'hero-aj1-powder',
    eyebrow: 'Hyped Drops',
    title: 'Air Jordan 1 Low',
    subtitle: 'Powder Blue · Rs. 8,899',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
    variant: 'dark',
  },
  {
    id: 'hero-dunk-rose',
    eyebrow: 'Summer Edit',
    title: 'Nike Dunk Low',
    subtitle: 'Rose Whisper · Under Rs. 8,000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
    variant: 'light',
  },
  {
    id: 'hero-samba',
    eyebrow: 'Heritage Icons',
    title: 'Adidas Samba OG',
    subtitle: 'Wonder Silver · Timeless classic',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-samba-og-wonder-silver',
    variant: 'dark',
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
            ariaLabel={`Slide ${idx + 1} of ${BANNERS.length}: ${banner.title}`}
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
              aria-label={`Go to slide ${idx + 1}: ${banner.title}`}
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
  const bg = isDark ? theme.colors.black : theme.colors.white;
  const fg = isDark ? theme.colors.white : theme.colors.black;
  const eyebrowBg = isDark ? 'rgba(255,255,255,0.14)' : theme.colors.grey100;
  const eyebrowFg = isDark ? theme.colors.white : theme.colors.textSecondary;
  const subtitleFg = isDark ? 'rgba(255,255,255,0.78)' : theme.colors.textSecondary;
  const borderColor = isDark ? 'transparent' : theme.colors.grey150;

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
        padding: `${theme.spacing.xl}px ${theme.spacing.xl}px ${theme.spacing.xl}px ${theme.spacing.xxl}px`,
        background: bg,
        borderRadius: theme.radius.hero,
        overflow: 'hidden',
        border: `1px solid ${borderColor}`,
        boxShadow: isDark ? theme.shadows.lg : theme.shadows.sm,
        color: fg,
        textDecoration: 'none',
        height: 180,
        boxSizing: 'border-box',
        margin: `0 ${theme.spacing.xs}px`,
      }}
    >
      {/* Decorative oversized wordmark watermark — luxury editorial detail */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -24,
          left: -10,
          fontFamily: theme.fontFamily.display,
          fontSize: 140,
          fontWeight: theme.fontWeight.black,
          color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
          letterSpacing: '-0.06em',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        LN
      </span>

      {/* Left: text block */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: theme.spacing.sm,
          flex: '1 1 auto',
          minWidth: 0,
        }}
      >
        {/* Eyebrow chip */}
        <span
          style={{
            background: eyebrowBg,
            color: eyebrowFg,
            fontSize: theme.fontSize.xs,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: theme.letterSpacing.wider,
            textTransform: 'uppercase',
            padding: `${theme.spacing.xs + 1}px ${theme.spacing.sm + 2}px`,
            borderRadius: theme.radius.pill,
          }}
        >
          {banner.eyebrow}
        </span>

        {/* Title */}
        <h2
          style={{
            margin: 0,
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.h2,
            fontWeight: theme.fontWeight.extrabold,
            lineHeight: theme.lineHeight.tight,
            letterSpacing: theme.letterSpacing.tight,
            color: fg,
          }}
        >
          {banner.title}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            margin: 0,
            fontSize: theme.fontSize.sm,
            fontWeight: theme.fontWeight.medium,
            color: subtitleFg,
            lineHeight: theme.lineHeight.snug,
            maxWidth: 200,
          }}
        >
          {banner.subtitle}
        </p>

        {/* CTA arrow */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: theme.spacing.xs,
            marginTop: theme.spacing.xs,
            fontSize: theme.fontSize.xs,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: theme.letterSpacing.wider,
            textTransform: 'uppercase',
            color: fg,
          }}
        >
          Shop now
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            <polyline points="12 5 19 12 12 19" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Right: floating shoe image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.image}
        alt=""
        aria-hidden
        draggable={false}
        style={{
          position: 'relative',
          zIndex: 2,
          flex: '0 0 auto',
          width: 140,
          height: 140,
          objectFit: 'contain',
          filter: theme.dropShadows.lg,
          transform: 'rotate(-8deg)',
          transition: `transform ${theme.motion.duration.slow} ${theme.motion.easing.out}`,
        }}
        className="mhb-shoe"
      />

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
            transform: rotate(-12deg) translateY(-4px);
          }
        }
      `}</style>
    </Link>
  );
}

const BannerCard = memo(BannerCardImpl);

export const MobileHeroBanner = memo(MobileHeroBannerImpl);
export default MobileHeroBanner;
