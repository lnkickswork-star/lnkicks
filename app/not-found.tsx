'use client';

import React from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * NotFound — 404 page.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - ResponsiveAppLayout replaced with <MobileLayout headerVariant="default">
 *    so a lost user sees the full nav (menu / cart / profile + bottom nav)
 *    and can immediately recover.
 *  - All hardcoded colors / sizes / radii / fonts migrated to theme.* tokens.
 *  - haptic.light() on RETURN TO HOME; pressable class + focus rings.
 */
export default function NotFound() {
  return (
    <MobileLayout
      headerVariant="default"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: '404 Not Found' },
      ]}
      desktopMaxWidth={640}
      desktopPaddingTop={64}
      desktopPaddingBottom={96}
    >
      <div
        style={{
          textAlign: 'center',
          padding: `${theme.spacing.mega}px ${theme.spacing.xl}px`,
          maxWidth: 500,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: theme.spacing.lg,
        }}
      >
        <div
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: 96,
            fontWeight: theme.fontWeight.extrabold,
            color: theme.colors.textPrimary,
            lineHeight: 1,
            letterSpacing: theme.letterSpacing.tightest,
          }}
          aria-hidden
        >
          404
        </div>
        <h1
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.h2,
            fontWeight: theme.fontWeight.bold,
            margin: `${theme.spacing.md}px 0 ${theme.spacing.xs}px 0`,
            textTransform: 'uppercase',
            color: theme.colors.textPrimary,
            letterSpacing: theme.letterSpacing.tight,
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            fontSize: theme.fontSize.md,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xxl,
            lineHeight: theme.lineHeight.relaxed,
            maxWidth: 320,
          }}
        >
          The page or drop you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          onClick={() => haptic.light()}
          className="pressable-strong nf-cta"
          style={{
            display: 'inline-block',
            padding: `${theme.spacing.lg}px ${theme.spacing.xxl}px`,
            background: theme.colors.black,
            color: theme.colors.white,
            borderRadius: theme.radius.pill,
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.bold,
            textDecoration: 'none',
            letterSpacing: theme.letterSpacing.wider,
            textTransform: 'uppercase',
          }}
        >
          Return to Home
        </Link>

        {/* Quick recovery links */}
        <div
          style={{
            marginTop: theme.spacing.xxl,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
            alignItems: 'center',
          }}
        >
          <Link
            href="/products"
            onClick={() => haptic.light()}
            className="pressable nf-link"
            style={{
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textSecondary,
              textDecoration: 'underline',
            }}
          >
            Browse Products
          </Link>
          <Link
            href="/search"
            onClick={() => haptic.light()}
            className="pressable nf-link"
            style={{
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textSecondary,
              textDecoration: 'underline',
            }}
          >
            Search Catalog
          </Link>
          <Link
            href="/help-support"
            onClick={() => haptic.light()}
            className="pressable nf-link"
            style={{
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textSecondary,
              textDecoration: 'underline',
            }}
          >
            Help &amp; Support
          </Link>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .nf-cta:active {
          transform: scale(0.97);
        }
        .nf-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .nf-link:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
