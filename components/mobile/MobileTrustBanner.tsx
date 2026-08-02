'use client';

import React, { memo } from 'react';
import { theme } from '@/lib/mobile/theme/theme';

/**
 * MobileTrustBanner — premium brand-story / trust banner (Phase 20).
 *
 * Mounted at the very BOTTOM of the mobile homepage, after MobileNewsletter
 * and before the floating MobileBottomNav. Provides an editorial "About
 * LN KICKS" closing statement reinforcing authenticity, curation, and the
 * brand's Indian origin.
 *
 * Design:
 *   - Off-white (#FAFAFA) card, 1px subtle grey border, 24px radius
 *     (intentionally light to contrast with the black MobileNewsletter
 *     card directly above it — the two together form a coordinated
 *     "Members Only → Our Promise" closing pair)
 *   - Eyebrow: "ABOUT LN KICKS" 11px uppercase, letter-spaced, gray
 *   - Headline: "Built on trust." 20px bold, tight tracking
 *   - Body: full brand-statement paragraph (13px / 1.55 line-height,
 *     secondary text color) — the exact copy provided by the user
 *   - Footer row: three minimal trust pillars with check icons
 *       · 100% Authentic   · Nationwide Shipping   · Since 2021
 *
 * Mobile-only — desktop homepage is untouched.
 */
function MobileTrustBannerImpl() {
  return (
    <section
      style={{
        // Only horizontal page-gutter padding; vertical rhythm is owned
        // by the parent <main> flex `gap` (32px).
        padding: `0 ${theme.spacing.sectionPadding}px`,
      }}
    >
      <div
        style={{
          background: theme.colors.offWhite,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.productCard, // 24px
          padding: `${theme.spacing.section}px ${theme.spacing.section}px ${theme.spacing.section - 4}px`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Eyebrow — "ABOUT LN KICKS" ─────────────────────────── */}
        <p
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: theme.fontSize.caption, // 11px
            fontWeight: theme.fontWeight.semibold, // 600
            color: theme.colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: theme.letterSpacing.wide, // 0.04em
            margin: `0 0 ${theme.spacing.md}px 0`, // 0 0 12px 0
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          About LN KICKS
        </p>

        {/* ── Headline — short editorial pull-line ───────────────── */}
        <h2
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: theme.fontSize.h2, // 20px
            fontWeight: theme.fontWeight.bold, // 700
            lineHeight: theme.lineHeight.hero, // 1.2
            color: theme.colors.textPrimary,
            letterSpacing: theme.letterSpacing.tight, // -0.02em
            margin: `0 0 ${theme.spacing.md + 2}px 0`, // 0 0 14px 0
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          Built on trust.
        </h2>

        {/* ── Body — the exact brand statement provided by the user ── */}
        <p
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: theme.fontSize.md, // 13px
            fontWeight: theme.fontWeight.regular, // 400
            color: theme.colors.textSecondary,
            lineHeight: 1.55, // slightly more generous than 1.45 for long-form prose
            margin: `0 0 ${theme.spacing.section}px 0`, // 0 0 24px 0
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          LNKICKS is India&rsquo;s premium destination for authentic sneakers,
          luxury fashion, and modern streetwear. Every product undergoes a
          rigorous multi-step authentication process before it reaches you.
          Since 2021, we&rsquo;ve been committed to delivering genuine products,
          fast nationwide shipping, and a shopping experience built on trust.
        </p>

        {/* ── Trust pillars row — 3 mini badges with check icons ──── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm, // 8px
            paddingTop: theme.spacing.md + 2, // 14px
            borderTop: `1px solid ${theme.colors.divider}`,
          }}
        >
          <TrustPillar label="100% Authentic" />
          <TrustPillar label="Nationwide Shipping" />
          <TrustPillar label="Since 2021" />
        </div>
      </div>
    </section>
  );
}

/** Compact trust pill — small check icon + label. */
function TrustPillar({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        flex: 1,
        minWidth: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="13"
        height="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        aria-hidden
        style={{
          color: theme.colors.textPrimary,
          flexShrink: 0,
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12.5l4.5 4.5L19 7.5"
        />
      </svg>
      <span
        style={{
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.caption - 1, // 10px — fits 3 pills in 360px viewport
          fontWeight: theme.fontWeight.medium, // 500
          color: theme.colors.textPrimary,
          letterSpacing: theme.letterSpacing.normal,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export const MobileTrustBanner = memo(MobileTrustBannerImpl);
export default MobileTrustBanner;
