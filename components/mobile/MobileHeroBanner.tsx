'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileHeroBanner — simple full-width swipeable banner slider.
 *
 * DESIGN INTENT (per user request, Phase 5 simplification):
 *   - Simple, clean banner — NO 3D rotated shoe, NO asymmetric split,
 *     NO drop-shadow depth, NO toggle dots / numeric indicators.
 *   - Each slide is full-width, fits the mobile screen, swipeable with
 *     snap.
 *   - Premium B&W aesthetic preserved: alternating light (off-white) /
 *     dark (matte black) variants for visual rhythm.
 *   - Centered editorial composition: eyebrow → centered shoe image →
 *     display headline → subtitle → CTA underline.
 *
 * Visual contract:
 *   - 3 promotional banners, swipeable horizontally with snap
 *   - No auto-advance, no dots, no numeric indicators (per spec)
 *   - Full-bleed feel: banner extends edge-to-edge with theme.pad inner
 *     padding
 *   - Height 320px — tall enough for image + text, short enough to keep
 *     Popular Shoes near the fold
 *
 * Banner anatomy (per slide):
 *   ┌────────────────────────────────────────────────────┐
 *   │                                                    │
 *   │                  EYEBROW                           │
 *   │                                                    │
 *   │              [centered shoe PNG,                   │
 *   │               no rotation, no shadow]              │
 *   │                                                    │
 *   │                HEADLINE                            │
 *   │              Subtitle line.                        │
 *   │              ─── SHOP NOW →                        │
 *   │                                                    │
 *   └────────────────────────────────────────────────────┘
 *              ▲
 *      Light variant: off-white canvas (#FAFAFA)
 *      Dark variant: matte black (#0A0A0A)
 *
 * Each banner tappable → product / category / collection route.
 *
 * LN KICKS theme: pure B&W. Light slide = off-white canvas + black type.
 * Dark slide = matte black canvas + white type. Alternates for visual rhythm.
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
  return (
    <section
      aria-label="Featured promotions"
      style={{
        paddingTop: theme.spacing.sectionPadding,
        paddingBottom: theme.spacing.sectionPadding,
      }}
    >
      <div
        className="mhb-scroller"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: `0 ${theme.spacing.sectionPadding}px`,
          gap: 0,
        }}
      >
        {BANNERS.map((banner) => (
          <BannerCard key={banner.id} banner={banner} />
        ))}
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
      `}</style>
    </section>
  );
}

/* ── Single banner card ───────────────────────────────────────── */
function BannerCardImpl({ banner }: { banner: Banner }) {
  const isDark = banner.variant === 'dark';
  // Light variant: off-white canvas (#FAFAFA) — Apple Store warmth.
  // Dark variant: matte black (#0A0A0A).
  const bg = isDark ? theme.colors.black : theme.colors.offWhite;
  const fg = isDark ? theme.colors.white : theme.colors.black;
  const eyebrowFg = isDark ? 'rgba(255,255,255,0.65)' : theme.colors.textSecondary;
  const subtitleFg = isDark ? 'rgba(255,255,255,0.72)' : theme.colors.textSecondary;
  const underlineColor = isDark ? theme.colors.white : theme.colors.black;

  return (
    <Link
      href={banner.href}
      aria-label={`${banner.lead} ${banner.display}: ${banner.subtitle}`}
      className="mhb-card pressable"
      onPointerDown={() => haptic.light()}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        borderRadius: theme.radius.largeCard,
        overflow: 'hidden',
        border: 'none',
        boxShadow: isDark ? theme.shadows.lg : theme.shadows.premium,
        color: fg,
        textDecoration: 'none',
        height: 340,
        boxSizing: 'border-box',
        margin: `0 ${theme.spacing.xs}px`,
        padding: `${theme.spacing.sectionPadding}px`,
        transition: `transform ${theme.duration.standard} ${theme.easing.easeOut}`,
      }}
    >
      {/* ── Eyebrow — 12px / 500 / uppercase / 0.5px tracking (Brand Name preset) ── */}
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

      {/* ── Centered shoe image — NO rotation, NO drop shadow ────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.image}
        alt=""
        aria-hidden
        draggable={false}
        style={{
          maxWidth: '65%',
          maxHeight: 160,
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          marginBottom: theme.spacing.lg,
        }}
      />

      {/* ── Headline — Hero 32px / 700 / 38px line height (Phase 6 spec) ── */}
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
          maxWidth: 240,
          textAlign: 'center',
          marginTop: theme.spacing.xs,
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
          marginTop: theme.spacing.md,
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
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
          <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
          <polyline points="12 5 19 12 12 19" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      <style jsx>{`
        .mhb-card:active {
          transform: scale(${theme.scale.buttonPress});
        }
        @media (hover: hover) {
          .mhb-card:hover {
            transform: scale(${theme.scale.cardHover});
          }
        }
        .mhb-card:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </Link>
  );
}

const BannerCard = memo(BannerCardImpl);

export const MobileHeroBanner = memo(MobileHeroBannerImpl);
export default MobileHeroBanner;
