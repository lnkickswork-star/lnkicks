'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * AdminLoginPage — LN KICKS enterprise admin portal.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="minimal" hideBottomNav title="Admin Login">
 *    so the page gets the same premium chrome (glass header with centered
 *    LNKICKS wordmark, safe-area clearance, skip link, service worker) as
 *    the rest of the app, WITHOUT the bottom nav — the user is not yet
 *    authenticated, so nav entries (Home / Wishlist / Cart / Profile) are
 *    not appropriate here.
 *  - All hardcoded colors / sizes / radii / shadows migrated to mobile
 *    design tokens. FORBIDDEN iOS red #FF3B30 eliminated:
 *      • "ENTERPRISE ADMIN PORTAL" eyebrow  → theme.colors.error
 *        (#7f1d1d muted maroon — preserves the visual "this is admin"
 *        signal without the harsh red)
 *      • AUTHENTICATE ADMIN submit button    → theme.colors.black
 *        (matches the primary-CTA pattern used everywhere else in the
 *        app — black, no harsh reds. This is an auth CTA, not destructive.)
 *  - Card border kept at 2px matte-black (theme.colors.black) — the original
 *    used a thicker black border to visually distinguish the admin portal
 *    from the consumer /login; that distinction is preserved.
 *  - Form inputs are token-driven: radius.lg, 1.5px solid grey300 border,
 *    black focus border (via <style jsx>), md/lg padding.
 *  - Submit AUTHENTICATE ADMIN button fires haptic.medium() on press and
 *    uses the `pressable-strong` class for the primary-CTA scale animation.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const [email, setEmail] = useState('admin@lnkicks.com');
  const [password, setPassword] = useState('admin123');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@lnkicks.com' && password === 'admin123') {
      const adminSession = { role: 'Super Admin', name: 'Executive Admin', email, isLoggedIn: true };
      localStorage.setItem('lnk_admin', JSON.stringify(adminSession));
      showToast('Admin Portal Authenticated!');
      router.push('/dashboard');
    } else {
      showToast('Invalid Admin Credentials.');
    }
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

  // Shared eyebrow-label style (ADMIN EMAIL / PASSWORD)
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
    <MobileLayout headerVariant="minimal" hideBottomNav title="Admin Login">
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
            maxWidth: 420,
            margin: `${theme.spacing.xxl}px auto`,
            background: theme.colors.white,
            borderRadius: theme.radius.hero,
            padding: theme.spacing.section,
            // Thicker matte-black border distinguishes the admin portal from
            // the consumer /login (which uses a 1px grey border).
            border: `2px solid ${theme.colors.black}`,
            boxShadow: theme.shadows.lg,
          }}
        >
          {/* BRAND HEAD — secondary wordmark inside the card body.
              The MobileMinimalHeader already shows LNKICKS in the top bar;
              this is a decorative editorial reinforcement (Playfair serif)
              paired with the "ENTERPRISE ADMIN PORTAL" eyebrow in muted
              maroon (theme.colors.error) — preserves the original's
              "this is admin" visual signal without the FORBIDDEN iOS red. */}
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
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                color: theme.colors.error,
                marginTop: theme.spacing.hairline,
              }}
            >
              Enterprise Admin Portal
            </div>
          </div>

          <form
            onSubmit={handleAdminLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}
          >
            <div>
              <label htmlFor="admin-email" style={labelStyle}>
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="admin-password" style={labelStyle}>
                Password
              </label>
              <input
                id="admin-password"
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
              Authenticate Admin →
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
