'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileNewsletter — premium sign-up CTA banner (Phase 19 redesign).
 *
 * Redesigned per user reference image (1000073331.png):
 *   - Black card, 24px radius, premium shadow
 *   - "MEMBERS ONLY" uppercase eyebrow (gray)
 *   - "Sign up / and save 10%" two-line headline (32px bold white)
 *   - "Be first to access new drops..." body copy (13px light gray)
 *   - Row at bottom:
 *       [ Sign Up Now → ]   primary button — dark charcoal #2D2D2D bg,
 *                                    white text, 14px radius, semibold.
 *       [ + ]              secondary icon button — transparent bg,
 *                                    thin gray border, white + icon,
 *                                    circular (~56px).
 *
 * Phase 18 → 19 diff: replaced the email-input form with two CTA buttons
 * per the reference image. No email field, no success state, no privacy
 * link, no "LK" watermark — cleaner, more action-oriented.
 *
 * Mounted at the BOTTOM of the mobile homepage (after MobileRecommended,
 * before the floating MobileBottomNav). Mobile-only — desktop untouched.
 */
function MobileNewsletterImpl() {
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
          background: theme.colors.black,
          borderRadius: theme.radius.productCard, // 24px
          padding: `${theme.spacing.xl}px ${theme.spacing.section}px`, // 16px / 24px
          color: theme.colors.white,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: theme.shadows.premium,
        }}
      >
        <div style={{ position: 'relative', zIndex: theme.zIndex.base + 2 }}>
          {/* Eyebrow — "MEMBERS ONLY" uppercase, gray */}
          <p
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.caption, // 11px
              fontWeight: theme.fontWeight.medium, // 500
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              letterSpacing: theme.letterSpacing.brandName, // 0.5px
              margin: `0 0 ${theme.spacing.md}px 0`, // 0 0 12px 0
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Members Only
          </p>

          {/* Hero Heading — "Sign up / and save 10%" two lines, 32px bold */}
          <h2
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.hero, // 24px (mobile hero tier)
              fontWeight: theme.fontWeight.bold, // 700
              lineHeight: theme.lineHeight.hero, // 1.2
              margin: `0 0 ${theme.spacing.sm + 2}px 0`, // 0 0 10px 0
              letterSpacing: theme.letterSpacing.tight, // -0.02em
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Sign up
            <br />
            and save 10%
          </h2>

          {/* Body — description, 13px regular, light gray */}
          <p
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.md, // 13px
              fontWeight: theme.fontWeight.regular, // 400
              color: 'rgba(255,255,255,0.7)',
              margin: `0 0 ${theme.spacing.section}px 0`, // 0 0 24px 0
              lineHeight: theme.lineHeight.body, // 1.45
              maxWidth: 280,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Be first to access new drops, private sales, and member-only sneakers.
          </p>

          {/* CTA row — primary button + secondary icon button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm, // 8px
            }}
          >
            {/* Primary CTA — "Sign Up Now →" dark charcoal button */}
            <Link
              href="/register"
              aria-label="Sign up now to save 10%"
              onPointerDown={() => haptic.selection()}
              className="pressable mnews-cta"
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.xs, // 4px
                background: '#2D2D2D', // dark charcoal — distinct from card black
                color: theme.colors.white,
                height: 52,
                padding: `0 ${theme.spacing.section}px`, // 0 24px
                borderRadius: theme.radius.button, // 14px
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.lg, // 13px
                fontWeight: theme.fontWeight.semibold, // 600
                letterSpacing: theme.letterSpacing.normal,
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: `transform ${theme.duration.instant} ${theme.easing.easeOut}, background-color ${theme.duration.standard} ${theme.easing.easeOut}`,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              Sign Up Now
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M13 5l7 7-7 7"
                />
              </svg>
            </Link>

            {/* Secondary icon button — "+" circular, outline style */}
            <Link
              href="/register"
              aria-label="Quick sign up"
              onPointerDown={() => haptic.light()}
              className="pressable mnews-add"
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'transparent',
                color: theme.colors.white,
                border: '1.5px solid rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                transition: `transform ${theme.duration.instant} ${theme.easing.easeOut}, border-color ${theme.duration.standard} ${theme.easing.easeOut}`,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden
              >
                <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .mnews-cta:active {
          transform: scale(${theme.scale.buttonPress});
        }
        .mnews-add:active {
          transform: scale(${theme.scale.buttonPress});
          border-color: ${theme.colors.white};
        }
        @media (hover: hover) {
          .mnews-cta:hover {
            background: #3A3A3A;
          }
          .mnews-add:hover {
            border-color: rgba(255,255,255,0.5);
          }
        }
        .mnews-cta:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 3px;
        }
        .mnews-add:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 3px;
        }
      `}</style>
    </section>
  );
}

export const MobileNewsletter = memo(MobileNewsletterImpl);
export default MobileNewsletter;
