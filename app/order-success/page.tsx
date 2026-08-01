'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * OrderSuccessPage — LN KICKS post-transaction confirmation (mobile).
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="minimal" hideBottomNav> — minimal
 *    centered LNKICKS header (no menu/cart/profile), no bottom nav. Keeps the
 *    user focused on the confirmation and prevents accidental nav away.
 *  - All hardcoded values migrated to design tokens.
 *  - Success check icon: muted success green tint (#E3FCEF bg +
 *    theme.colors.success stroke) matching the product page "In Stock" badge.
 *  - haptic.success() fires once on mount — double-rising-tap pattern signals
 *    "payment confirmed" on Android devices.
 *  - haptic.light() on every link tap.
 *  - pressable class + pressableStyle styled-jsx for tactile feedback.
 *
 * Business logic preserved:
 *  - Reads orderId from search params (defaults to LNK-784912).
 *  - All Link hrefs (`/track-order?orderId=...`, `/products`) preserved.
 */
export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams
    ? searchParams.get('orderId') || 'LNK-784912'
    : 'LNK-784912';

  useEffect(() => {
    // Fire success haptic on mount — Android users feel a rising double-tap.
    haptic.success();
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
            maxWidth: 480,
            margin: '0 auto',
            background: theme.colors.white,
            borderRadius: theme.radius.hero,
            padding: `${theme.spacing.section}px ${theme.spacing.xxl}px`,
            border: `1px solid ${theme.colors.grey150}`,
            boxShadow: theme.shadows.lg,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* SUCCESS CHECK ICON */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#E3FCEF',
              color: theme.colors.success,
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
              stroke={theme.colors.success}
              strokeWidth="2.6"
              aria-hidden
            >
              <polyline
                points="20 6 9 17 4 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h1,
              fontWeight: theme.fontWeight.extrabold,
              textTransform: 'uppercase',
              color: theme.colors.textPrimary,
              margin: 0,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Order Confirmed!
          </h1>

          <div
            style={{
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.sm,
              marginBottom: theme.spacing.xxl,
              letterSpacing: theme.letterSpacing.wide,
            }}
          >
            Order ID: #{orderId}
          </div>

          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              lineHeight: theme.lineHeight.relaxed,
              marginBottom: theme.spacing.xxl,
            }}
          >
            Thank you for shopping with LNKICKS! Your order has been placed
            successfully and is being verified by our authentication team.
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
              href={`/track-order?orderId=${orderId}`}
              className="pressable-strong success-cta"
              onPointerDown={() => haptic.light()}
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
              Track Order
            </Link>
            <Link
              href="/products"
              className="pressable-strong success-cta"
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
              Continue Shopping
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
        .success-cta:active {
          transform: scale(0.97);
        }
        .success-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
