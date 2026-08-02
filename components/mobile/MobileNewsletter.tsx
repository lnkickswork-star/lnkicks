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
        padding: `${theme.spacing.section}px ${theme.spacing.pad}px ${theme.spacing.xxxl}px`,
      }}
    >
      <div
        style={{
          background: theme.colors.black,
          borderRadius: theme.radius.hero,
          padding: `${theme.spacing.huge}px ${theme.spacing.xxl}px`,
          color: theme.colors.white,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: theme.shadows.xl,
        }}
      >
        {/* Background watermark */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -30,
            right: -10,
            fontFamily: theme.fontFamily.display,
            fontSize: 120,
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
          <p
            style={{
              fontSize: theme.fontSize.xs,
              fontWeight: theme.fontWeight.bold,
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              letterSpacing: theme.letterSpacing.extreme,
              margin: `0 0 ${theme.spacing.md}px 0`,
            }}
          >
            Members Only
          </p>
          <h2
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.title + 2,
              fontWeight: theme.fontWeight.extrabold,
              lineHeight: 1.1,
              margin: `0 0 ${theme.spacing.sm + 2}px 0`,
              letterSpacing: theme.letterSpacing.tight,
              textTransform: 'uppercase',
            }}
          >
            Sign up<br />and save 10%
          </h2>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: 'rgba(255,255,255,0.7)',
              margin: `0 0 ${theme.spacing.xxl}px 0`,
              lineHeight: theme.lineHeight.relaxed,
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
              borderRadius: theme.radius.pill,
              padding: `${theme.spacing.xs + 2}px ${theme.spacing.xs + 2}px ${theme.spacing.xs + 2}px ${theme.spacing.pad}px`,
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
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
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.medium,
                fontFamily: 'inherit',
                minWidth: 0,
              }}
              className="mnews-input"
            />
            <button
              type="submit"
              aria-label="Subscribe to newsletter"
              className="pressable mnews-submit"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: theme.colors.white,
                color: theme.colors.textPrimary,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: `transform ${theme.motion.duration.instant} ${theme.motion.easing.out}`,
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          {submitted && (
            <p
              role="status"
              aria-live="polite"
              style={{
                fontSize: theme.fontSize.base,
                color: theme.colors.white,
                fontWeight: theme.fontWeight.semibold,
                margin: `${theme.spacing.md + 2}px 0 0 0`,
                padding: `${theme.spacing.sm + 2}px ${theme.spacing.md}px`,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: theme.radius.md,
                textAlign: 'center',
              }}
            >
              Thanks! Check your inbox to confirm.
            </p>
          )}

          <p
            style={{
              fontSize: 10.5,
              color: 'rgba(255,255,255,0.45)',
              margin: `${theme.spacing.md + 2}px 0 0 0`,
              lineHeight: theme.lineHeight.relaxed,
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
          transform: scale(1.05);
        }
      `}</style>
      <style jsx>{pressableStyle}</style>
    </section>
  );
}

export const MobileNewsletter = memo(MobileNewsletterImpl);
export default MobileNewsletter;
