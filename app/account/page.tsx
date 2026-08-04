'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import {
  authService,
  canClaimDailyLogin,
  claimDailyLoginReward,
  DAILY_LOGIN_REWARD_POINTS,
} from '@/lib/auth/authService';

/**
 * AccountPage — LN KICKS unified "My Account" dashboard.
 *
 * The hub every logged-in user lands on. Shows:
 *   1. User identity card (avatar, name, email, member since, tier badge)
 *   2. Wallet + Reward Points summary with one-tap "Claim Daily" CTA
 *   3. Quick-stats row (Orders count, Wishlist count, Reward pts)
 *   4. Full menu grid linking to every account sub-section:
 *        My Profile · My Orders · Track Order · Wishlist
 *        Payment Method · Notifications · Recently Viewed
 *        Reward Points (Wallet) · Support · Settings
 *   5. Logout button (uses theme.colors.error — luxury maroon)
 *
 * Auth gate: if no session, redirects to /login.
 */
export default function AccountPage() {
  const router = useRouter();
  const { showToast, wishlist } = useApp();

  const [session, setSession] = useState<ReturnType<typeof authService.getCurrentSession> | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [canClaimDaily, setCanClaimDaily] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const sess = authService.getCurrentSession();
    if (!sess) {
      router.replace('/login');
      return;
    }
    setSession(sess);
    if (sess.uid) {
      setCanClaimDaily(canClaimDailyLogin(sess.uid));
      try {
        const raw = localStorage.getItem('lnk_orders');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setOrdersCount(parsed.length);
        }
      } catch {
        // ignore parse failure
      }
    }
  }, [router]);

  const handleClaimDaily = () => {
    if (!session?.uid || claiming || !canClaimDaily) return;
    setClaiming(true);
    haptic.success();
    const txn = claimDailyLoginReward(session.uid);
    if (txn) {
      setCanClaimDaily(false);
      const fresh = authService.getCurrentSession();
      if (fresh) setSession(fresh);
      showToast(`+${DAILY_LOGIN_REWARD_POINTS} reward points claimed!`);
    } else {
      showToast('Already claimed today — come back tomorrow');
    }
    setClaiming(false);
  };

  const handleLogout = () => {
    haptic.medium();
    authService.clearSession();
    showToast('Logged out successfully');
    setTimeout(() => router.replace('/login'), 250);
  };

  const tier = useMemo(() => {
    const pts = session?.rewardPoints || 0;
    if (pts >= 2000) return { label: 'Platinum', color: theme.colors.textPrimary };
    if (pts >= 1000) return { label: 'Gold', color: '#B45309' };
    if (pts >= 500) return { label: 'Silver', color: '#6B7280' };
    return { label: 'Standard', color: theme.colors.textSecondary };
  }, [session]);

  if (!hydrated || !session) {
    return (
      <MobileLayout headerVariant="back" title="My Account">
        <div style={{ padding: 40, textAlign: 'center', color: theme.colors.textSecondary }}>
          Loading…
        </div>
      </MobileLayout>
    );
  }

  const initials = session.name
    .split(' ')
    .map((p) => p.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <MobileLayout headerVariant="back" title="My Account"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'My Account' },
      ]}
      desktopMaxWidth={1024}
    >
      <div style={{ padding: `0 ${theme.spacing.pad}px ${theme.spacing.xxl + 8}px` }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {/* ── USER IDENTITY CARD ─────────────────────────────────── */}
          <div
            className="acc-hero"
            style={{
              background: theme.colors.black,
              color: theme.colors.white,
              borderRadius: theme.radius.hero,
              padding: `${theme.spacing.xxl}px ${theme.spacing.xxl}px ${theme.spacing.xl}px`,
              marginBottom: theme.spacing.lg,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                right: -20,
                bottom: -28,
                fontFamily: theme.fontFamily.display,
                fontSize: 100,
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: 'rgba(255,255,255,0.04)',
                lineHeight: 1,
                pointerEvents: 'none',
              }}
            >
              LNKICKS
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg, position: 'relative' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: theme.colors.white,
                  color: theme.colors.black,
                  fontFamily: theme.fontFamily.display,
                  fontSize: 26,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h1
                    style={{
                      fontFamily: theme.fontFamily.display,
                      fontSize: theme.fontSize.h2,
                      fontWeight: 800,
                      margin: 0,
                      lineHeight: 1.1,
                      letterSpacing: theme.letterSpacing.tight,
                    }}
                  >
                    {session.name}
                  </h1>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: 999,
                      border: `1px solid ${tier.color}`,
                      color: tier.color,
                    }}
                  >
                    {tier.label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: theme.fontSize.sm,
                    color: 'rgba(255,255,255,0.7)',
                    marginTop: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {session.email || session.phone || 'Member'}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                  Member since {session.joined}
                </div>
              </div>
            </div>

            {/* Wallet + Reward Points row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginTop: theme.spacing.xl,
                position: 'relative',
              }}
            >
              <Link
                href="/rewards"
                className="pressable acc-stat"
                onPointerDown={() => haptic.light()}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: theme.radius.xl,
                  padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                  textDecoration: 'none',
                  color: theme.colors.white,
                  display: 'block',
                }}
              >
                <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                  Wallet Balance
                </div>
                <div style={{ fontFamily: theme.fontFamily.display, fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                  ₹{session.walletBalance || 0}
                </div>
              </Link>
              <Link
                href="/rewards"
                className="pressable acc-stat"
                onPointerDown={() => haptic.light()}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: theme.radius.xl,
                  padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                  textDecoration: 'none',
                  color: theme.colors.white,
                  display: 'block',
                }}
              >
                <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                  Reward Points
                </div>
                <div style={{ fontFamily: theme.fontFamily.display, fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                  {session.rewardPoints || 0} pts
                </div>
              </Link>
            </div>

            {canClaimDaily && (
              <button
                type="button"
                onClick={handleClaimDaily}
                disabled={claiming}
                className="pressable-strong acc-claim"
                aria-label={`Claim ${DAILY_LOGIN_REWARD_POINTS} daily login reward points`}
                style={{
                  marginTop: 10,
                  width: '100%',
                  padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                  background: theme.colors.white,
                  color: theme.colors.black,
                  border: 'none',
                  borderRadius: theme.radius.pill,
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.sm,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: claiming ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>🎁</span>
                {claiming ? 'Claiming…' : `Claim Daily +${DAILY_LOGIN_REWARD_POINTS} pts`}
              </button>
            )}
          </div>

          {/* ── QUICK STATS ROW ────────────────────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              marginBottom: theme.spacing.lg,
            }}
          >
            <StatBox label="Orders" value={ordersCount} href="/my-orders" />
            <StatBox label="Wishlist" value={wishlist.length} href="/wishlist" />
            <StatBox label="Points" value={session.rewardPoints || 0} href="/rewards" />
          </div>

          {/* ── MENU GRID ──────────────────────────────────────────── */}
          <div
            style={{
              background: theme.colors.white,
              borderRadius: theme.radius.hero,
              border: `1px solid ${theme.colors.grey150}`,
              overflow: 'hidden',
              marginBottom: theme.spacing.lg,
            }}
          >
            <SectionLabel>Account</SectionLabel>
            <MenuRow href="/profile" icon="user" label="My Profile" sub="Edit name, email, phone" />
            <MenuRow href="/my-orders" icon="package" label="My Orders" sub="View order history" badge={ordersCount > 0 ? String(ordersCount) : undefined} />
            <MenuRow href="/track-order" icon="truck" label="Track Order" sub="Live shipment status" />
            <MenuRow href="/wishlist" icon="heart" label="Wishlist" sub="Saved sneakers" badge={wishlist.length > 0 ? String(wishlist.length) : undefined} />

            <SectionLabel>Payments & Rewards</SectionLabel>
            <MenuRow href="/payment-methods" icon="card" label="Payment Method" sub="Cards, UPI, wallets" />
            <MenuRow href="/rewards" icon="gift" label="Reward Points & Wallet" sub="Earn, redeem, refer" badge="NEW" highlight />

            <SectionLabel>Activity</SectionLabel>
            <MenuRow href="/recently-viewed" icon="clock" label="Recently Viewed" sub="Your browsing history" />
            <MenuRow href="/notification-settings" icon="bell" label="Notifications" sub="Push, email, SMS prefs" />
            <MenuRow href="/addresses" icon="pin" label="Addresses" sub="Saved shipping addresses" />

            <SectionLabel>Help</SectionLabel>
            <MenuRow href="/help-support" icon="lifebuoy" label="Support" sub="Help center, contact us" />
            <MenuRow href="/settings-panel" icon="gear" label="Settings" sub="Privacy, security, app" />
          </div>

          {/* ── LOGOUT ─────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={handleLogout}
            className="pressable-strong acc-logout"
            aria-label="Log out of account"
            style={{
              width: '100%',
              padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
              background: theme.colors.white,
              color: theme.colors.error,
              border: `1px solid ${theme.colors.grey200}`,
              borderRadius: theme.radius.pill,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.md,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
            </svg>
            Log Out
          </button>

          <div
            style={{
              textAlign: 'center',
              fontSize: 11,
              color: theme.colors.textTertiary,
              marginTop: theme.spacing.xl,
              letterSpacing: '0.08em',
            }}
          >
            LN KICKS · v2.4 · Made in India
          </div>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .acc-stat:active { transform: scale(0.97); }
        .acc-claim:active { transform: scale(0.97); }
        .acc-claim:disabled { opacity: 0.6; }
        .acc-logout:active { transform: scale(0.97); }
        .acc-menu-row:active {
          background: ${theme.colors.grey50} !important;
        }
        .acc-menu-row:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: -2px;
        }
        .acc-claim:focus-visible,
        .acc-logout:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}

/* ─── helpers ─────────────────────────────────────────────────── */

function StatBox({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="pressable acc-stat"
      onPointerDown={() => haptic.light()}
      style={{
        background: theme.colors.white,
        border: `1px solid ${theme.colors.grey150}`,
        borderRadius: theme.radius.lg,
        padding: `${theme.spacing.md}px ${theme.spacing.sm}px`,
        textAlign: 'center',
        textDecoration: 'none',
        color: theme.colors.textPrimary,
        display: 'block',
      }}
    >
      <div style={{ fontFamily: theme.fontFamily.display, fontSize: 20, fontWeight: 800, color: theme.colors.textPrimary }}>
        {value}
      </div>
      <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.colors.textSecondary, marginTop: 2 }}>
        {label}
      </div>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: `${theme.spacing.lg}px ${theme.spacing.xl}px ${theme.spacing.sm}px`,
        background: theme.colors.grey50,
        borderBottom: `1px solid ${theme.colors.grey150}`,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: theme.colors.textSecondary,
      }}
    >
      {children}
    </div>
  );
}

type MenuIcon = 'user' | 'package' | 'truck' | 'heart' | 'card' | 'gift' | 'clock' | 'bell' | 'pin' | 'lifebuoy' | 'gear';

function MenuRow({
  href,
  icon,
  label,
  sub,
  badge,
  highlight,
}: {
  href: string;
  icon: MenuIcon;
  label: string;
  sub: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="pressable acc-menu-row"
      onPointerDown={() => haptic.light()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
        textDecoration: 'none',
        color: theme.colors.textPrimary,
        borderBottom: `1px solid ${theme.colors.grey100}`,
        position: 'relative',
        transition: 'background 120ms ease-out',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: highlight ? theme.colors.black : theme.colors.grey100,
          color: highlight ? theme.colors.white : theme.colors.textPrimary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <MenuIconSvg name={icon} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.md,
            fontWeight: 700,
            color: theme.colors.textPrimary,
            lineHeight: 1.2,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
          {sub}
        </div>
      </div>
      {badge && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 8px',
            borderRadius: 999,
            background: highlight ? theme.colors.black : theme.colors.grey200,
            color: highlight ? theme.colors.white : theme.colors.textPrimary,
            textTransform: highlight ? 'uppercase' : 'none',
          }}
        >
          {badge}
        </span>
      )}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.colors.grey400} strokeWidth="2.4" aria-hidden style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

function MenuIconSvg({ name }: { name: MenuIcon }) {
  const stroke = 'currentColor';
  const sw = 2;
  const common = {
    viewBox: '0 0 24 24',
    width: 20,
    height: 20,
    fill: 'none' as const,
    stroke,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'user':
      return (
        <svg {...common}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'package':
      return (
        <svg {...common}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...common}>
          <rect x="1" y="3" width="15" height="13" rx="1" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'card':
      return (
        <svg {...common}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case 'gift':
      return (
        <svg {...common}>
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'lifebuoy':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
        </svg>
      );
    case 'gear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
  }
}
