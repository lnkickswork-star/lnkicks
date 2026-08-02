'use client';

import React, { memo } from 'react';
import { theme } from '@/lib/mobile/theme/theme';
import { MOBILE_BRANDS } from './mobileProducts';

/**
 * MobileBrands — infinite horizontal marquee of brand wordmarks.
 *
 * Premium single-row marquee. CSS keyframe animation only (no JS).
 * Grayscale filter, hover reveals color. Smooth 38s linear infinite.
 *
 * LN KICKS theme: black wordmarks on white, soft grey dividers.
 *
 * Phase 3 polish: design tokens, memoized, prefers-reduced-motion support.
 */
function MobileBrandsImpl() {
  const track = [...MOBILE_BRANDS, ...MOBILE_BRANDS];

  return (
    <section
      aria-label="Featured brands"
      style={{
        paddingTop: theme.spacing.sectionPadding,
        paddingBottom: theme.spacing.sectionPadding,
        background: theme.colors.offWhite,
        borderTop: `1px solid ${theme.colors.grey100}`,
        borderBottom: `1px solid ${theme.colors.grey100}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: `0 ${theme.spacing.sectionPadding}px`,
          textAlign: 'center',
          marginBottom: theme.spacing.sectionPadding,
        }}
      >
        {/* Eyebrow — 12px / 500 / uppercase / 0.5px tracking */}
        <p
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: theme.fontSize.caption,
            fontWeight: theme.fontWeight.medium,
            color: theme.colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: theme.letterSpacing.brandName,
            margin: `0 0 ${theme.spacing.sm}px 0`,
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          Authenticated · Stocked · Trusted
        </p>
        {/* Section Heading — 24px / 700 / 30px line height */}
        <h2
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: theme.fontSize.section,
            fontWeight: theme.fontWeight.bold,
            margin: 0,
            letterSpacing: theme.letterSpacing.tight,
            color: theme.colors.textPrimary,
            lineHeight: theme.lineHeight.section,
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          Brands at{' '}
          <span style={{ fontStyle: 'italic', fontWeight: theme.fontWeight.regular }}>
            LN KICKS
          </span>
        </h2>
      </div>

      <div className="mb-marquee-wrap">
        <div className="mb-marquee-track">
          {track.map((b, idx) => (
            <div
              key={`mb-${idx}`}
              className={`mb-item ${b.className}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: `0 ${theme.spacing.xxxl}px`,
                flexShrink: 0,
                color: theme.colors.textPrimary,
                opacity: 0.85,
                transition: `opacity ${theme.duration.slow} ${theme.easing.inOut}`,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {b.name}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .mb-marquee-wrap {
          width: 100%;
          overflow: hidden;
          position: relative;
          filter: grayscale(1);
          transition: filter ${theme.duration.long} ${theme.easing.inOut};
        }
        .mb-marquee-wrap:hover {
          filter: grayscale(0);
        }
        .mb-marquee-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
          animation: lnk-mb-marquee 38s linear infinite;
        }
        .mb-marquee-wrap:hover .mb-marquee-track {
          animation-play-state: paused;
        }
        .mb-item:hover {
          opacity: 1 !important;
        }
        @keyframes lnk-mb-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Respect user's reduced-motion preference */
        @media (prefers-reduced-motion: reduce) {
          .mb-marquee-track {
            animation: none;
          }
        }

        /* Brand wordmarks — Inter only, weights 300-700 per Phase 6 spec */
        .mb-nike { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; font-style: italic; font-family: var(--font-inter), system-ui, sans-serif; }
        .mb-jordan { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; font-family: var(--font-inter), system-ui, sans-serif; }
        .mb-adidas { font-size: 26px; font-weight: 700; letter-spacing: 0.08em; font-family: var(--font-inter), system-ui, sans-serif; }
        .mb-puma { font-size: 28px; font-weight: 700; font-style: italic; letter-spacing: -0.02em; font-family: var(--font-inter), system-ui, sans-serif; }
        .mb-reebok { font-size: 24px; font-weight: 700; letter-spacing: 0.04em; font-family: var(--font-inter), system-ui, sans-serif; }
        .mb-converse { font-size: 24px; font-weight: 700; letter-spacing: 0.14em; font-family: var(--font-inter), system-ui, sans-serif; }
        .mb-vans { font-size: 30px; font-weight: 700; letter-spacing: 0.02em; font-family: var(--font-inter), system-ui, sans-serif; }
        .mb-hoka { font-size: 30px; font-weight: 700; letter-spacing: 0.06em; font-family: var(--font-inter), system-ui, sans-serif; }
        .mb-newbalance { font-size: 22px; font-weight: 700; letter-spacing: 0.06em; font-family: var(--font-inter), system-ui, sans-serif; }
        .mb-asics { font-size: 24px; font-weight: 700; letter-spacing: 0.16em; font-family: var(--font-inter), system-ui, sans-serif; }
        .mb-yeezy { font-size: 30px; font-weight: 300; letter-spacing: 0.04em; font-style: italic; font-family: var(--font-inter), system-ui, sans-serif; }
      `}</style>
    </section>
  );
}

export const MobileBrands = memo(MobileBrandsImpl);
export default MobileBrands;
