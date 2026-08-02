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

// ── 11-card editorial hero slider ────────────────────────────────────
// Covers Nike, Puma, Adidas, Reebok, Jordan, New Balance.
// Image URLs verified working — mix of Google aida-public CDN (proven
// elsewhere on the homepage) and ZAI image-search OSS re-hosted URLs.
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
  {
    id: 'hero-nb-530',
    eyebrow: 'Daily Driver',
    lead: 'Move',
    display: 'DIFFERENT',
    subtitle: 'Cloud-soft cushioning, all-day comfort.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/new-balance-530-steel-grey',
    variant: 'dark',
  },
  {
    id: 'hero-puma-velophasis',
    eyebrow: 'Future Form',
    lead: 'Bold',
    display: 'STRIDES',
    subtitle: 'Tech-forward silhouette for the new era.',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0117cc523363.jpg',
    href: '/product/puma-velophasis-luxury-edition',
    variant: 'light',
  },
  {
    id: 'hero-reebok-classic',
    eyebrow: 'Vintage Heat',
    lead: 'Throwback',
    display: 'CROWN',
    subtitle: 'The Reebok icon, reborn for today.',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/001b3b05ce2b.jpg',
    href: '/product/reebok-classic-leather',
    variant: 'dark',
  },
  {
    id: 'hero-nike-af1',
    eyebrow: 'Forever Fresh',
    lead: 'White On',
    display: 'WHITE',
    subtitle: 'The icon that goes with everything.',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cd01d83ee3f7.jpg',
    href: '/product/nike-air-force-1-07',
    variant: 'light',
  },
  {
    id: 'hero-adidas-ultraboost',
    eyebrow: 'Engineered Speed',
    lead: 'Run The',
    display: 'CITY',
    subtitle: 'Boost energy return with every stride.',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/dd3d3fb42079.jpg',
    href: '/product/adidas-ultraboost-1-0',
    variant: 'dark',
  },
  {
    id: 'hero-puma-suede',
    eyebrow: 'Suede Heritage',
    lead: 'Classic',
    display: 'REBORN',
    subtitle: 'The original street icon since ’68.',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1887117978da.jpg',
    href: '/product/puma-suede-classic',
    variant: 'light',
  },
  {
    id: 'hero-jordan-1-high',
    eyebrow: 'High Heat',
    lead: 'Defy',
    display: 'GRAVITY',
    subtitle: 'The high-top that started it all.',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4a756d57e1c1.jpg',
    href: '/product/air-jordan-1-high-chicago',
    variant: 'dark',
  },
  {
    id: 'hero-reebok-club-c',
    eyebrow: 'Court Classic',
    lead: 'Clean',
    display: 'LINES',
    subtitle: 'Minimalist tennis heritage, everyday ready.',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/148340200fe4.jpg',
    href: '/product/reebok-club-c-85',
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
        // Phase 10: consistent 8px-system spacing (16px top, 20px bottom)
        paddingTop: theme.spacing.sectionPadding,
        paddingBottom: theme.spacing.sectionGap,
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
          // Phase 10: 16px side padding for peek preview + 16px BOTTOM padding
          // so card shadows aren't clipped by overflow-x:auto (CSS quirk:
          // overflow-x:auto forces overflow-y:auto, clipping vertical shadows).
          padding: `0 ${theme.spacing.sectionPadding}px ${theme.spacing.sectionPadding}px`,
          // Phase 9: 16px gap (was 8px) — clearer visual separation between cards
          gap: theme.spacing.xl,
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
        :global(.mhb-scroller) {
          -webkit-overflow-scrolling: touch;
        }
        :global(.mhb-scroller::-webkit-scrollbar) {
          display: none;
        }
        /* Phase 9: use :global() so the rule also applies to BannerCard-rendered
           children (styled-jsx scoping would otherwise skip them). */
        :global(.mhb-scroller > .mhb-card) {
          scroll-snap-align: start;
          flex: 0 0 72%;
          scroll-snap-stop: always;
        }
        @media (max-width: 380px) {
          :global(.mhb-scroller > .mhb-card) {
            flex: 0 0 78%;
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
        // Phase 8: 24px radius (was 32px) — more app-like
        borderRadius: theme.radius.productCard,
        overflow: 'hidden',
        border: 'none',
        // Phase 9: standard premium shadow — slightly stronger for clear separation
        boxShadow: theme.shadows.premiumLg,
        color: fg,
        textDecoration: 'none',
        // Phase 9: 320px tall (was 340) — narrower cards need slightly less height
        height: 320,
        boxSizing: 'border-box',
        // Phase 8: 20px internal padding
        padding: `${theme.spacing.xl}px ${theme.spacing.cardPadding}px`,
        transition: `transform ${theme.duration.standard} ${theme.easing.easeOut}, box-shadow ${theme.duration.standard} ${theme.easing.easeOut}`,
        // Phase 9: narrower card width (72%) for tighter slider feel
        width: '72%',
        flex: '0 0 72%',
        maxWidth: 300,
        // Phase 9: snap to start (was center) — prevents overlap during snap
        scrollSnapAlign: 'start',
        // Ensure this card stays in its own stacking context (no overlap)
        isolation: 'isolate',
        zIndex: 1,
      }}
    >
      {/* ── Eyebrow — 11px / 500 / uppercase / 0.5px tracking ── */}
      <span
        style={{
          color: eyebrowFg,
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.caption,
          fontWeight: theme.fontWeight.medium,
          letterSpacing: theme.letterSpacing.brandName,
          textTransform: 'uppercase',
          marginBottom: theme.spacing.sm,
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        {banner.eyebrow}
      </span>

      {/* ── Centered shoe image — Phase 8: smaller */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.image}
        alt=""
        aria-hidden
        draggable={false}
        className="mhb-img"
        style={{
          // Phase 9: smaller image to fit narrower card — 65% width, 140px max height
          maxWidth: '65%',
          maxHeight: 140,
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          marginBottom: theme.spacing.md,
          // Subtle drop shadow for depth on light variant only
          filter: isDark ? 'none' : theme.dropShadows.md,
          opacity: isActive ? 1 : 0.85,
          transition: `transform ${theme.duration.slow} ${theme.easing.easeOut}, opacity ${theme.duration.slow} ${theme.easing.easeOut}`,
        }}
      />

      {/* ── Headline — Hero 24px / 700 (auto via tokens) ── */}
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
            fontSize: theme.fontSize.md,
            fontWeight: theme.fontWeight.regular,
            letterSpacing: theme.letterSpacing.normal,
            lineHeight: theme.lineHeight.snug,
            marginBottom: 2,
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

      {/* ── Subtitle — Body 13px / 400 (auto via tokens) ─────── */}
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

      {/* ── Underline CTA — Button style 13px / 600 (auto via tokens) ── */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          marginTop: theme.spacing.md,
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.md,
          fontWeight: theme.fontWeight.semibold,
          letterSpacing: theme.letterSpacing.normal,
          color: fg,
          borderBottom: `1.5px solid ${underlineColor}`,
          paddingBottom: 2,
          fontFeatureSettings: theme.fontFeatures,
        }}
        className="mhb-cta"
      >
        Shop Now
        <svg
          viewBox="0 0 24 24"
          width="10"
          height="10"
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
