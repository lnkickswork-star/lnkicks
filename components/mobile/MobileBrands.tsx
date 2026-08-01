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
        paddingTop: theme.spacing.huge + 4,
        paddingBottom: theme.spacing.section,
        background: theme.colors.white,
        borderTop: `1px solid ${theme.colors.grey50}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
          textAlign: 'center',
          marginBottom: theme.spacing.xxl,
        }}
      >
        <p
          style={{
            fontSize: theme.fontSize.xs,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            margin: `0 0 ${theme.spacing.sm}px 0`,
          }}
        >
          Authenticated · Stocked · Trusted
        </p>
        <h2
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.h1,
            fontWeight: theme.fontWeight.extrabold,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: theme.letterSpacing.tightest,
            color: theme.colors.textPrimary,
            lineHeight: 1,
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
                transition: `opacity ${theme.motion.duration.slow} ${theme.motion.easing.inOut}`,
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
          transition: filter ${theme.motion.duration.long} ${theme.motion.easing.inOut};
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

        .mb-nike { font-size: 30px; font-weight: 900; letter-spacing: -0.02em; font-style: italic; }
        .mb-jordan { font-size: 26px; font-weight: 900; letter-spacing: -0.02em; }
        .mb-adidas { font-size: 28px; font-weight: 700; letter-spacing: 0.08em; }
        .mb-puma { font-size: 30px; font-weight: 900; font-style: italic; letter-spacing: -0.02em; }
        .mb-reebok { font-size: 26px; font-weight: 700; letter-spacing: 0.04em; }
        .mb-converse { font-size: 26px; font-weight: 700; letter-spacing: 0.14em; }
        .mb-vans { font-size: 32px; font-weight: 900; letter-spacing: 0.02em; }
        .mb-hoka { font-size: 32px; font-weight: 800; letter-spacing: 0.06em; }
        .mb-newbalance { font-size: 22px; font-weight: 700; letter-spacing: 0.06em; }
        .mb-asics { font-size: 26px; font-weight: 700; letter-spacing: 0.16em; }
        .mb-yeezy { font-size: 32px; font-weight: 300; letter-spacing: 0.04em; font-style: italic; }
      `}</style>
    </section>
  );
}

export const MobileBrands = memo(MobileBrandsImpl);
export default MobileBrands;
