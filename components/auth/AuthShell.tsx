/**
 * AuthShell.tsx — Shared layout wrapper for all LNKICKS auth pages.
 *
 * Provides:
 *  - Premium white card with LNKICKS branding header
 *  - Eyebrow + headline + subtext
 *  - Consistent card width, padding, shadow
 *  - MobileLayout integration (headerVariant="minimal", hideBottomNav)
 *
 * Used by /login, /register, /forgot-password, /verify-otp.
 */

'use client';

import React from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

export interface AuthShellProps {
  /** Page title used by MobileLayout */
  layoutTitle: string;
  /** Card eyebrow (e.g. "Members Portal") */
  eyebrow?: string;
  /** Card headline (e.g. "Welcome Back") */
  headline: string;
  /** Card subtext (e.g. "Sign in to continue shopping") */
  subtext?: string;
  /** Card body content (form + CTAs) */
  children: React.ReactNode;
  /** Optional footer slot (e.g. "Don't have an account? Join LNKICKS") */
  footer?: React.ReactNode;
}

export function AuthShell({
  layoutTitle,
  eyebrow,
  headline,
  subtext,
  children,
  footer,
}: AuthShellProps) {
  return (
    <MobileLayout headerVariant="minimal" hideBottomNav title={layoutTitle}>
      <div
        style={{
          padding: `0 ${theme.spacing.xl}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 100px)',
          paddingBottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing.xxxl}px)`,
        }}
      >
        <div
          className="auth-shell-card"
          style={{
            maxWidth: 440,
            width: '100%',
            margin: `${theme.spacing.xxl}px auto`,
            background: theme.colors.white,
            borderRadius: theme.radius.largeCard,
            padding: theme.spacing.xxxl,
            border: `1px solid ${theme.colors.grey150}`,
            boxShadow: theme.shadows.premium,
          }}
        >
          {/* BRAND HEAD */}
          <div style={{ textAlign: 'center', marginBottom: theme.spacing.xxxl }}>
            <div
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: 28,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                lineHeight: 1,
                letterSpacing: theme.letterSpacing.widest,
              }}
            >
              LNKICKS
            </div>
            {eyebrow && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: theme.fontWeight.bold,
                  letterSpacing: theme.letterSpacing.widest,
                  textTransform: 'uppercase',
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.xs,
                }}
              >
                {eyebrow}
              </div>
            )}
          </div>

          {/* HEADLINE */}
          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: 22,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              textAlign: 'center',
              margin: `0 0 ${theme.spacing.sm}px`,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            {headline}
          </h1>

          {subtext && (
            <p
              style={{
                fontSize: theme.fontSize.md,
                color: theme.colors.textSecondary,
                textAlign: 'center',
                margin: `0 0 ${theme.spacing.xxxl}px`,
                fontFamily: theme.fontFamily.body,
                lineHeight: theme.lineHeight.body,
                maxWidth: 320,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {subtext}
            </p>
          )}

          {/* BODY */}
          {children}

          {/* FOOTER */}
          {footer && (
            <div
              style={{
                marginTop: theme.spacing.xxxl,
                paddingTop: theme.spacing.xxl,
                borderTop: `1px solid ${theme.colors.grey200}`,
                textAlign: 'center',
                fontSize: theme.fontSize.md,
                color: theme.colors.textSecondary,
                fontFamily: theme.fontFamily.body,
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .auth-shell-card {
          animation: auth-card-in 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes auth-card-in {
          0% { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </MobileLayout>
  );
}

export default AuthShell;
