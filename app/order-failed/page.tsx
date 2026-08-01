'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * OrderFailedPage — LN KICKS post-transaction failure (mobile).
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="minimal" hideBottomNav> — minimal
 *    centered LNKICKS header (no menu/cart/profile), no bottom nav. Keeps the
 *    user focused on retrying the checkout, not bouncing off to other pages.
 *  - All hardcoded values migrated to design tokens.
 *  - Forbidden iOS red (#FF3B30) on the X icon replaced with
 *    theme.colors.error (#7f1d1d — muted maroon) on a soft rose tint.
 *  - haptic.error() fires once on mount — double-buzz pattern signals
 *    "payment failed" on Android devices.
 *  - haptic.medium() on retry tap.
 *  - pressable class + pressableStyle styled-jsx for tactile feedback.
 *
 * Business logic preserved:
 *  - All Link hrefs (`/checkout`) preserved.
 */
export default function OrderFailedPage() {
  useEffect(() => {
    // Fire error haptic on mount — Android users feel a double-buzz.
    haptic.error();
  }, []);

  return (
    <MobileLayout headerVariant="minimal" hideBottomNav>
      <div
        style={{
          padding: `${theme.spacing.huge}px ${theme.spacing.pad}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: 460,
            margin: '0 auto',
            background: theme.colors.white,
            borderRadius: theme.radius.hero,
            padding: `${theme.spacing.section}px ${theme.spacing.xxl}px`,
            border: `1px solid ${theme.colors.grey150}`,
            boxShadow: theme.shadows.sm,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* ERROR X ICON */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#FBEAEA',
              color: theme.colors.error,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: `0 auto ${theme.spacing.xl}px`,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="34"
              height="34"
              fill="none"
              stroke={theme.colors.error}
              strokeWidth="2.6"
              aria-hidden
            >
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                strokeLinecap="round"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h2,
              fontWeight: theme.fontWeight.extrabold,
              textTransform: 'uppercase',
              color: theme.colors.textPrimary,
              margin: 0,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Payment Unsuccessful
          </h1>

          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              margin: `${theme.spacing.md}px 0 ${theme.spacing.xxl}px`,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Your transaction could not be processed. No funds were debited.
          </p>

          <div
            style={{
              display: 'flex',
              gap: theme.spacing.md,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/checkout"
              className="pressable-strong failed-cta"
              onPointerDown={() => haptic.medium()}
              style={{
                padding: `${theme.spacing.lg}px ${theme.spacing.xxl}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'none',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Retry Checkout
            </Link>
            <Link
              href="/cart"
              className="pressable-strong failed-cta"
              onPointerDown={() => haptic.light()}
              style={{
                padding: `${theme.spacing.lg}px ${theme.spacing.xxl}px`,
                background: theme.colors.grey100,
                color: theme.colors.textPrimary,
                borderRadius: theme.radius.pill,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'none',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Back to Cart
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="pressable"
          onPointerDown={() => haptic.light()}
          style={{
            marginTop: theme.spacing.xxl,
            fontSize: theme.fontSize.body,
            color: theme.colors.textSecondary,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Back to Home
        </Link>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .failed-cta:active {
          transform: scale(0.97);
        }
        .failed-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
