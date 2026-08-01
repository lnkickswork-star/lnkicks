'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * LoginPage — LN KICKS members portal.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="minimal" hideBottomNav title="Login">
 *    so the page gets the same premium chrome (glass header with centered
 *    LNKICKS wordmark, safe-area clearance, skip link, service worker) as
 *    the rest of the app, WITHOUT the bottom nav — the user is not yet
 *    authenticated, so nav entries (Home / Wishlist / Cart / Profile) are
 *    not appropriate here.
 *  - All hardcoded colors / sizes / radii / shadows migrated to mobile
 *    design tokens. FORBIDDEN iOS red not present here, but #111111 /
 *    #777777 / #EBEBEB / #E0E0E0 all replaced with theme.colors.* tokens.
 *  - Form inputs are token-driven: radius.lg, 1.5px solid grey300 border,
 *    black focus border (via <style jsx>), md/lg padding.
 *  - Submit SIGN IN button fires haptic.medium() on press and uses the
 *    `pressable-strong` class for the primary-CTA scale animation.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const [email, setEmail] = useState('charles.taylor@lnkicks.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both Email and Password.');
      return;
    }

    const user = { name: 'Charles Taylor', email, phone: '+91 98765 43210', joined: 'January 2026', isLoggedIn: true };
    localStorage.setItem('lnk_user', JSON.stringify(user));
    showToast('Login Successful!');
    router.push('/profile');
  };

  // Shared token-driven input style — matches the stage-4b/4c/4d form recipe:
  // radius.lg + 1.5px solid grey300 + md/lg padding.
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
    borderRadius: theme.radius.lg,
    border: `1.5px solid ${theme.colors.grey300}`,
    fontSize: theme.fontSize.body,
    fontFamily: theme.fontFamily.body,
    color: theme.colors.textPrimary,
    outline: 'none',
    boxSizing: 'border-box',
    background: theme.colors.white,
    transition: 'border-color 180ms cubic-bezier(0.16, 1, 0.3, 1)',
  };

  // Shared eyebrow-label style (EMAIL ADDRESS / PASSWORD)
  const labelStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
    display: 'block',
    marginBottom: theme.spacing.sm - 2,
    letterSpacing: theme.letterSpacing.wider,
    textTransform: 'uppercase',
  };

  return (
    <MobileLayout headerVariant="minimal" hideBottomNav title="Login">
      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        <div
          style={{
            maxWidth: 440,
            margin: `${theme.spacing.xxl}px auto`,
            background: theme.colors.white,
            borderRadius: theme.radius.hero,
            padding: theme.spacing.section,
            border: `1px solid ${theme.colors.grey150}`,
            boxShadow: theme.shadows.sm,
          }}
        >
          {/* BRAND HEAD — secondary wordmark inside the card body.
              The MobileMinimalHeader already shows LNKICKS in the top bar;
              this is a decorative editorial reinforcement (Playfair serif)
              paired with the "MEMBERS PORTAL" eyebrow. */}
          <div style={{ textAlign: 'center', marginBottom: theme.spacing.xxxl }}>
            <div
              style={{
                fontFamily: theme.fontFamily.editorial,
                fontSize: theme.fontSize.h2,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                lineHeight: theme.lineHeight.tight,
              }}
            >
              LNKICKS
            </div>
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.extrabold,
                letterSpacing: theme.letterSpacing.widest,
                textTransform: 'uppercase',
                color: theme.colors.textSecondary,
                marginTop: theme.spacing.hairline,
              }}
            >
              Members Portal
            </div>
          </div>

          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}
          >
            <div>
              <label htmlFor="login-email" style={labelStyle}>
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                style={inputStyle}
              />
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: theme.spacing.sm - 2,
                }}
              >
                <label htmlFor="login-password" style={{ ...labelStyle, marginBottom: 0 }}>
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="pressable"
                  onPointerDown={() => haptic.light()}
                  style={{
                    fontSize: theme.fontSize.sm,
                    color: theme.colors.textSecondary,
                    textDecoration: 'underline',
                  }}
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              onPointerDown={() => haptic.medium()}
              className="pressable-strong auth-submit"
              style={{
                width: '100%',
                padding: `${theme.spacing.lg - 2}px ${theme.spacing.md}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.bold,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                marginTop: theme.spacing.sm + 2,
              }}
            >
              Sign In
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: theme.spacing.xxl,
              fontSize: theme.fontSize.body,
              color: theme.colors.textSecondary,
              fontFamily: theme.fontFamily.body,
            }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="pressable"
              onPointerDown={() => haptic.light()}
              style={{
                color: theme.colors.textPrimary,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'underline',
              }}
            >
              Join LNKICKS
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .auth-input:focus {
          border-color: ${theme.colors.black};
        }
        .auth-input:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .auth-submit:active {
          transform: scale(0.97);
        }
        .auth-submit:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
