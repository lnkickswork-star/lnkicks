'use client';

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileNewsletter — premium email capture.
 *
 * Black card with white text. Email input + arrow submit button.
 * "Sign up and save" headline. Premium pill input with black submit circle.
 *
 * LN KICKS theme: black card, white text, gold accent dot.
 *
 * Phase 3 polish: design tokens, haptics, pressed states, focus-visible,
 * memoized, useCallback for submit, accessible form labels.
 */
function MobileNewsletterImpl() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      haptic.success();
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3500);
    },
    [email],
  );

  return (
    <section
      style={{
        // Phase 10: consistent 8px-system spacing (20px top, 20px bottom)
        padding: `${theme.spacing.sectionGap}px ${theme.spacing.sectionPadding}px ${theme.spacing.sectionGap}px`,
      }}
    >
      <div
        style={{
          background: theme.colors.black,
          // Phase 8: 24px radius (was 32px)
          borderRadius: theme.radius.productCard,
          // Phase 8: 20px internal padding (was 32px)
          padding: `${theme.spacing.xl}px ${theme.spacing.cardPadding}px`,
          color: theme.colors.white,
          position: 'relative',
          overflow: 'hidden',
          // Phase 8: standard premium shadow
          boxShadow: theme.shadows.premium,
        }}
      >
        {/* Background watermark */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -20,
            right: -8,
            fontFamily: theme.fontFamily.display,
            fontSize: 80,
            fontWeight: theme.fontWeight.black,
            color: 'rgba(255,255,255,0.04)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          LK
        </div>

        <div style={{ position: 'relative', zIndex: theme.zIndex.base + 2 }}>
          {/* Eyebrow — 12px / 500 / uppercase / 0.5px tracking */}
          <p
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.caption,
              fontWeight: theme.fontWeight.medium,
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              letterSpacing: theme.letterSpacing.brandName,
              margin: `0 0 ${theme.spacing.md}px 0`,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Members Only
          </p>
          {/* Hero Heading — 32px / 700 / 38px line height */}
          <h2
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.hero,
              fontWeight: theme.fontWeight.bold,
              lineHeight: theme.lineHeight.hero,
              margin: `0 0 ${theme.spacing.sm + 2}px 0`,
              letterSpacing: theme.letterSpacing.tight,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Sign up<br />and save 10%
          </h2>
          {/* Body — 14px / 400 / 20px line height */}
          <p
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.md,
              color: 'rgba(255,255,255,0.7)',
              margin: `0 0 ${theme.spacing.sectionPadding}px 0`,
              lineHeight: theme.lineHeight.body,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Be first to access new drops, private sales, and member-only sneakers.
          </p>

          <form
            onSubmit={onSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: theme.radius.button,
              padding: `${theme.spacing.xs + 2}px ${theme.spacing.xs + 2}px ${theme.spacing.xs + 2}px ${theme.spacing.sectionPadding}px`,
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {/* Search Placeholder style — 15px / 400 */}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address for newsletter signup"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: theme.colors.white,
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.lg,
                fontWeight: theme.fontWeight.regular,
                minWidth: 0,
                fontFeatureSettings: theme.fontFeatures,
              }}
              className="mnews-input"
            />
            <button
              type="submit"
              aria-label="Subscribe to newsletter"
              className="pressable mnews-submit"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: theme.colors.white,
                color: theme.colors.textPrimary,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: `transform ${theme.duration.instant} ${theme.easing.easeOut}`,
              }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          {submitted && (
            <p
              role="status"
              aria-live="polite"
              style={{
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.caption,
                color: theme.colors.white,
                fontWeight: theme.fontWeight.semibold,
                margin: `${theme.spacing.md + 2}px 0 0 0`,
                padding: `${theme.spacing.sm + 2}px ${theme.spacing.md}px`,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: theme.radius.button,
                textAlign: 'center',
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              Thanks! Check your inbox to confirm.
            </p>
          )}

          <p
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.caption,
              color: 'rgba(255,255,255,0.45)',
              margin: `${theme.spacing.md + 2}px 0 0 0`,
              lineHeight: theme.lineHeight.body,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            By subscribing you agree to our{' '}
            <Link
              href="/privacy-policy"
              style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'underline' }}
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <style jsx>{`
        .mnews-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .mnews-input:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 4px;
          border-radius: ${theme.radius.sm};
        }
        .mnews-submit:hover {
          transform: scale(${theme.scale.cardHover});
        }
        .mnews-submit:active {
          transform: scale(${theme.scale.buttonPress});
        }
      `}</style>
      <style jsx>{pressableStyle}</style>
    </section>
  );
}

export const MobileNewsletter = memo(MobileNewsletterImpl);
export default MobileNewsletter;
