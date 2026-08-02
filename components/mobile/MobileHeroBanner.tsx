'use client';

import React, { memo, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileHeroBanner — editorial luxury magazine-cover hero slider.
 *
 * PHASE 7 PREMIUM REDESIGN
 *   Each card feels like a luxury magazine cover:
 *     - Tall 460px canvas with generous internal whitespace
 *     - 32px radius (radius.heroCard) — soft, premium corners
 *     - Bigger sneaker imagery (up to 70% of card width)
 *     - Editorial typography hierarchy: eyebrow → lead → display → subtitle
 *     - Smooth horizontal snap scrolling with peek preview of next card
 *     - Premium editorial shadows (shadows.editorial)
 *     - Soft fade-in on first paint + scroll-reveal
 *     - Alternating light (off-white) / dark (matte black) variants
 *
 * Visual contract:
 *   ┌─────────────────────────────────────────────┐
 *   │                                             │
 *   │              EYEBROW                        │
 *   │                                             │
 *   │      [centered sneaker — large, no rotation]│
 *   │                                             │
 *   │           lead line (regular)               │
 *   │           DISPLAY HEADLINE (bold)           │
 *   │           subtitle line                     │
 *   │           ─── Shop Now →                    │
 *   │                                             │
 *   └─────────────────────────────────────────────┘
 *
 * Each card tappable → product detail route. No dots, no numeric
 * indicators, no auto-advance (per Phase 5 spec — preserved).
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

function MobileHeroBannerImpl() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track which card is centered for fade-in animation
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const cardWidth = el.clientWidth;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(BANNERS.length - 1, idx)));
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      aria-label="Featured promotions"
      style={{
        // Phase 7: 48px section spacing for editorial breathing room
        paddingTop: theme.spacing.sectionSpacing,
        paddingBottom: theme.spacing.sectionPadding,
      }}
    >
      <div
        ref={scrollerRef}
        className="mhb-scroller"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          // 24px side padding gives peek preview of next card
          padding: `0 ${theme.spacing.sectionPadding}px`,
          gap: theme.spacing.cardGap,
        }}
      >
        {BANNERS.map((banner, idx) => (
          <BannerCard
            key={banner.id}
            banner={banner}
            isActive={idx === activeIndex}
          />
        ))}
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .mhb-scroller::-webkit-scrollbar {
          display: none;
        }
        .mhb-scroller > * {
          scroll-snap-align: center;
          // Each card takes ~88% of viewport width, leaving peek preview
          flex: '0 0 88%';
        }
        @media (max-width: 380px) {
          .mhb-scroller > * {
            flex: '0 0 92%';
          }
        }
      `}</style>
    </section>
  );
}

/* ── Single banner card ───────────────────────────────────────── */
function BannerCardImpl({
  banner,
  isActive,
}: {
  banner: Banner;
  isActive: boolean;
}) {
  const isDark = banner.variant === 'dark';
  // Light variant: off-white canvas (#FAFAFA) — Apple Store warmth.
  // Dark variant: matte black (#0A0A0A).
  const bg = isDark ? theme.colors.black : theme.colors.offWhite;
  const fg = isDark ? theme.colors.white : theme.colors.black;
  const eyebrowFg = isDark
    ? 'rgba(255,255,255,0.65)'
    : theme.colors.textSecondary;
  const subtitleFg = isDark
    ? 'rgba(255,255,255,0.72)'
    : theme.colors.textSecondary;
  const underlineColor = isDark ? theme.colors.white : theme.colors.black;

  return (
    <Link
      href={banner.href}
      aria-label={`${banner.lead} ${banner.display}: ${banner.subtitle}`}
      className={`mhb-card pressable ${isActive ? 'mhb-card--active' : ''}`}
      onPointerDown={() => haptic.light()}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        // Phase 7: 32px radius — luxury magazine cover
        borderRadius: theme.radius.heroCard,
        overflow: 'hidden',
        border: 'none',
        // Phase 7: editorial shadow tier — softer, wider spread
        boxShadow: isDark
          ? theme.shadows.editorial
          : theme.shadows.editorial,
        color: fg,
        textDecoration: 'none',
        // Phase 7: taller card for editorial scale (was 340px)
        height: 460,
        boxSizing: 'border-box',
        // Phase 7: 28px internal padding for breathing room
        padding: `${theme.spacing.sectionSpacing}px ${theme.spacing.sectionPadding}px`,
        transition: `transform ${theme.duration.standard} ${theme.easing.easeOut}, box-shadow ${theme.duration.standard} ${theme.easing.easeOut}`,
        // Each card width: 88% of viewport (peek preview of next card)
        width: '88%',
        flex: '0 0 88%',
        maxWidth: 420,
      }}
    >
      {/* ── Eyebrow — 12px / 500 / uppercase / 0.5px tracking ── */}
      <span
        style={{
          color: eyebrowFg,
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.caption,
          fontWeight: theme.fontWeight.medium,
          letterSpacing: theme.letterSpacing.brandName,
          textTransform: 'uppercase',
          marginBottom: theme.spacing.md,
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        {banner.eyebrow}
      </span>

      {/* ── Centered shoe image — larger (was 65% / 160px max) ──── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.image}
        alt=""
        aria-hidden
        draggable={false}
        className="mhb-img"
        style={{
          // Phase 7: bigger image — up to 75% width, taller max
          maxWidth: '75%',
          maxHeight: 220,
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          marginBottom: theme.spacing.xl,
          // Subtle drop shadow for depth on light variant only
          filter: isDark ? 'none' : theme.dropShadows.md,
          opacity: isActive ? 1 : 0.85,
          transition: `transform ${theme.duration.slow} ${theme.easing.easeOut}, opacity ${theme.duration.slow} ${theme.easing.easeOut}`,
        }}
      />

      {/* ── Headline — Hero 32px / 700 / 38px line height ── */}
      <h2
        style={{
          margin: 0,
          fontFamily: theme.fontFamily.body,
          lineHeight: theme.lineHeight.hero,
          letterSpacing: theme.letterSpacing.tight,
          color: fg,
          textAlign: 'center',
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.regular,
            letterSpacing: theme.letterSpacing.normal,
            lineHeight: theme.lineHeight.snug,
            marginBottom: theme.spacing.xs,
            opacity: 0.7,
          }}
        >
          {banner.lead}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: theme.fontSize.hero,
            fontWeight: theme.fontWeight.bold,
            lineHeight: theme.lineHeight.hero,
            letterSpacing: theme.letterSpacing.tight,
          }}
        >
          {banner.display}
        </span>
      </h2>

      {/* ── Subtitle — Body 14px / 400 / 20px line height ─────── */}
      <p
        style={{
          margin: 0,
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.md,
          fontWeight: theme.fontWeight.regular,
          color: subtitleFg,
          lineHeight: theme.lineHeight.body,
          maxWidth: 280,
          textAlign: 'center',
          marginTop: theme.spacing.sm,
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        {banner.subtitle}
      </p>

      {/* ── Underline CTA — Button style 15px / 600 ────────────── */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          marginTop: theme.spacing.xl,
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.lg,
          fontWeight: theme.fontWeight.semibold,
          letterSpacing: theme.letterSpacing.normal,
          color: fg,
          borderBottom: `1.5px solid ${underlineColor}`,
          paddingBottom: 3,
          fontFeatureSettings: theme.fontFeatures,
        }}
        className="mhb-cta"
      >
        Shop Now
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          aria-hidden
        >
          <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
          <polyline
            points="12 5 19 12 12 19"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <style jsx>{`
        .mhb-card:active {
          transform: scale(${theme.scale.buttonPress});
        }
        @media (hover: hover) {
          .mhb-card:hover {
            transform: scale(${theme.scale.cardHover});
            box-shadow: ${theme.shadows.editorialLg};
          }
          .mhb-card:hover .mhb-img {
            transform: translateY(-4px) scale(1.03);
          }
        }
        .mhb-card:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .mhb-card--active .mhb-img {
          animation: mhb-fade-up 600ms ${theme.easing.out} both;
        }
        @keyframes mhb-fade-up {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Link>
  );
}

const BannerCard = memo(BannerCardImpl);

export const MobileHeroBanner = memo(MobileHeroBannerImpl);
export default MobileHeroBanner;
