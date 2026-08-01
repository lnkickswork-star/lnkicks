'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * ProfilePage — LN KICKS account profile (mobile).
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title="Profile"> for the same
 *    premium chrome (glass header with back arrow + LNKICKS + cart + profile,
 *    floating bottom nav, safe-area) as every other mobile page.
 *  - All hardcoded values migrated to design tokens.
 *  - Forbidden iOS red (#FF3B30) on the LOGOUT button replaced with
 *    theme.colors.error (#7f1d1d — muted maroon) — destructive but luxury.
 *  - Form inputs use radius.lg, border grey300, focus ring black.
 *  - Quick-nav links (My Orders / Addresses) replaced emoji with inline SVG
 *    icons on grey100 chips.
 *  - haptic.light() on every button tap.
 *  - pressable class + pressableStyle styled-jsx for tactile feedback.
 *
 * Business logic preserved:
 *  - Reads lnk_user from localStorage on mount.
 *  - Save writes lnk_user back to localStorage + showToast.
 *  - Logout clears lnk_user + redirects to /login.
 */
export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [name, setName] = useState('Charles Taylor');
  const [email, setEmail] = useState('charles.taylor@lnkicks.com');
  const [phone, setPhone] = useState('+91 98765 43210');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('lnk_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.name) setName(u.name);
        if (u.email) setEmail(u.email);
        if (u.phone) setPhone(u.phone);
      }
    } catch {
      // localStorage parse failure — leave defaults.
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    haptic.success();
    const updated = {
      name,
      email,
      phone,
      joined: 'January 2026',
      isLoggedIn: true,
    };
    localStorage.setItem('lnk_user', JSON.stringify(updated));
    showToast('Profile Updated Successfully!');
  };

  const handleLogout = () => {
    haptic.medium();
    localStorage.removeItem('lnk_user');
    showToast('Logged Out Successfully');
    router.push('/login');
  };

  return (
    <MobileLayout headerVariant="back" title="Profile">
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        <div
          style={{
            maxWidth: 540,
            margin: '0 auto',
            background: theme.colors.white,
            borderRadius: theme.radius.hero,
            padding: theme.spacing.section,
            border: `1px solid ${theme.colors.grey150}`,
            boxShadow: theme.shadows.xs,
          }}
        >
          {/* HEADER USER CARD */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xl,
              marginBottom: theme.spacing.xxl,
              borderBottom: `1px solid ${theme.colors.grey150}`,
              paddingBottom: theme.spacing.xxl,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: theme.colors.black,
                color: theme.colors.white,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.xxl,
                fontWeight: theme.fontWeight.extrabold,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {name.charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.h2,
                  fontWeight: theme.fontWeight.extrabold,
                  color: theme.colors.textPrimary,
                  margin: 0,
                  lineHeight: theme.lineHeight.tight,
                  letterSpacing: theme.letterSpacing.tight,
                }}
              >
                {name}
              </h1>
              <div
                style={{
                  fontSize: theme.fontSize.body,
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.hairline + 1,
                }}
              >
                Member since January 2026
              </div>
            </div>
          </div>

          {/* PROFILE EDIT FORM */}
          <form
            onSubmit={handleSaveProfile}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xl,
            }}
          >
            <FormRow label="Full Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="profile-input"
                style={inputStyle}
              />
            </FormRow>

            <FormRow label="Email Address">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="profile-input"
                style={inputStyle}
              />
            </FormRow>

            <FormRow label="Phone Number">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="profile-input"
                style={inputStyle}
              />
            </FormRow>

            <div
              style={{
                display: 'flex',
                gap: theme.spacing.md,
                marginTop: theme.spacing.md,
              }}
            >
              <button
                type="submit"
                className="pressable-strong profile-cta"
                aria-label="Save profile changes"
                style={{
                  flex: 1,
                  padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
                  background: theme.colors.black,
                  color: theme.colors.white,
                  borderRadius: theme.radius.pill,
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.bold,
                  letterSpacing: theme.letterSpacing.wider,
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="pressable-strong profile-cta"
                aria-label="Log out of account"
                style={{
                  padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
                  background: theme.colors.error,
                  color: theme.colors.white,
                  borderRadius: theme.radius.pill,
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.bold,
                  letterSpacing: theme.letterSpacing.wider,
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          </form>

          {/* QUICK NAVIGATION LINKS */}
          <div
            style={{
              marginTop: theme.spacing.section,
              borderTop: `1px solid ${theme.colors.grey150}`,
              paddingTop: theme.spacing.xxl,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: theme.spacing.md,
            }}
          >
            <QuickLink href="/my-orders" label="My Orders" icon="package" />
            <QuickLink href="/addresses" label="Addresses" icon="pin" />
          </div>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .profile-input:focus {
          border-color: ${theme.colors.black};
          box-shadow: 0 0 0 3px ${theme.colors.focusRing};
        }
        .profile-cta:active {
          transform: scale(0.97);
        }
        .profile-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .quick-link:active {
          transform: scale(0.97);
        }
        .quick-link:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
      `}</style>
    </MobileLayout>
  );
}

/* ─── helpers ─────────────────────────────────────────────────── */

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.grey300}`,
  fontSize: theme.fontSize.body,
  fontFamily: theme.fontFamily.body,
  color: theme.colors.textPrimary,
  background: theme.colors.white,
  outline: 'none',
  boxSizing: 'border-box',
  transition: `border-color ${theme.duration.fast} ${theme.easing.out}, box-shadow ${theme.duration.fast} ${theme.easing.out}`,
};

function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.bold,
          color: theme.colors.textSecondary,
          letterSpacing: theme.letterSpacing.wider,
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: theme.spacing.sm - 2,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function QuickLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: 'package' | 'pin';
}) {
  return (
    <Link
      href={href}
      className="pressable quick-link"
      onPointerDown={() => haptic.light()}
      style={{
        padding: theme.spacing.lg,
        background: theme.colors.grey100,
        borderRadius: theme.radius.xl,
        textDecoration: 'none',
        color: theme.colors.textPrimary,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm + 2,
        fontSize: theme.fontSize.body,
        fontWeight: theme.fontWeight.bold,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke={theme.colors.black}
        strokeWidth="2"
        aria-hidden
        style={{ flexShrink: 0 }}
      >
        {icon === 'package' ? (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            />
            <polyline
              points="3.27 6.96 12 12.01 20.73 6.96"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="12"
              y1="22.08"
              x2="12"
              y2="12"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
            />
            <circle cx="12" cy="10" r="3" />
          </>
        )}
      </svg>
      <span>{label}</span>
    </Link>
  );
}
