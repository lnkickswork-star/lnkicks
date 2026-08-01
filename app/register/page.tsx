'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * RegisterPage — create a new LN KICKS member account.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="minimal" hideBottomNav title="Register">
 *    so the page gets the same premium chrome (glass header with centered
 *    LNKICKS wordmark, safe-area clearance, skip link, service worker) as
 *    the rest of the app, WITHOUT the bottom nav — the user is not yet
 *    authenticated, so nav entries (Home / Wishlist / Cart / Profile) are
 *    not appropriate here.
 *  - All hardcoded colors / sizes / radii / shadows migrated to mobile
 *    design tokens. #111111 / #777777 / #EBEBEB / #E0E0E0 all replaced
 *    with theme.colors.* tokens; var(--font-oswald) → theme.fontFamily.display.
 *  - Form inputs are token-driven: radius.lg, 1.5px solid grey300 border,
 *    black focus border (via <style jsx>), md/lg padding.
 *  - Submit CREATE ACCOUNT button fires haptic.medium() on press and uses
 *    the `pressable-strong` class for the primary-CTA scale animation.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill all registration fields.');
      return;
    }

    const user = { name, email, phone: '+91 98765 43210', joined: 'July 2026', isLoggedIn: true };
    localStorage.setItem('lnk_user', JSON.stringify(user));
    showToast('Welcome to LNKICKS!');
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

  // Shared eyebrow-label style (FULL NAME / EMAIL ADDRESS / PASSWORD)
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
    <MobileLayout headerVariant="minimal" hideBottomNav title="Register">
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
            boxShadow: theme.shadows.xs,
          }}
        >
          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h2,
              fontWeight: theme.fontWeight.extrabold,
              textTransform: 'uppercase',
              color: theme.colors.textPrimary,
              margin: `0 0 ${theme.spacing.xl}px 0`,
              textAlign: 'center',
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Create Account
          </h1>

          <form
            onSubmit={handleRegister}
            style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}
          >
            <div>
              <label htmlFor="register-name" style={labelStyle}>
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="auth-input"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="register-email" style={labelStyle}>
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="register-password" style={labelStyle}>
                Password
              </label>
              <input
                id="register-password"
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
              Create Account
            </button>
          </form>
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
