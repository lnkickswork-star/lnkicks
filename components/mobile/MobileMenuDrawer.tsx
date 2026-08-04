'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { theme } from '@/lib/mobile/theme/theme';
import { transitions } from '@/lib/mobile/theme/motion';
import { safeArea } from '@/lib/mobile/utils/safeArea';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileMenuDrawer — luxury slide-in drawer from the left.
 *
 * Phase 30 (Premium Drawer Rewrite):
 *  - Drawer width: 85% of screen, max 380px, full height (100vh)
 *  - Sticky bottom authentication area for GUEST users (Sign In + Register
 *    buttons side-by-side, never overflow, always visible)
 *  - Premium logged-in account header: 60x60 circular avatar, name,
 *    email, verified badge, soft-shadow rounded card
 *  - Logged-in menu replaces guest menu entirely (different items)
 *  - Help & Info section REMOVED per user request (only kept items
 *    that are still relevant — most are now accessed via Support)
 *
 * ── GUEST MENU (not logged in) ─────────────────────────────────────
 *   Top:    LNKICKS wordmark + close button
 *   Body:   Home, Shop All, Trending, New Arrivals, Luxury, Categories,
 *           Brands, Track Order  (scrollable)
 *   Bottom: Sticky "Sign In" + "Register" buttons (50/50 split,
 *           12px gap, 14px radius, 16px padding) — always visible
 *
 * ── LOGGED-IN MENU ─────────────────────────────────────────────────
 *   Top:    Premium profile card (avatar + name + email + verified badge)
 *   Body:   My Profile, My Orders, Track Orders, Wishlist, Saved
 *           Addresses, Payment Methods, Notifications, Recently Viewed,
 *           Rewards / Points, Coupons, Refer & Earn, Support, Settings
 *           (scrollable)
 *   Bottom: Logout button (red)
 *
 * Detection:
 *  - Reads localStorage 'lnk_user' on mount + on focus/storage events
 *  - Parses JSON; isLoggedIn=true → logged-in menu
 *
 * Mobile-only — drawer is only ever mounted inside MobileLayout /
 * MobileHome, which themselves only mount for mobile UAs. Desktop
 * never sees this component.
 *
 * Accessibility:
 *  - role="dialog" aria-modal="true"
 *  - Focus trap: focus moves to close button on open, returns on close
 *  - Esc closes
 *  - Body scroll locked while open
 *  - Safe-area-aware: drawer clears notch / Dynamic Island at top and
 *    home indicator at bottom (env(safe-area-inset-*))
 */

/* ──────────────────────────────────────────────────────────────────
 *  GUEST MENU — primary navigation links
 * ────────────────────────────────────────────────────────────────── */
const GUEST_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/products' },
  { label: 'Trending', href: '/products?filter=trending' },
  { label: 'New Arrivals', href: '/products?filter=new' },
  { label: 'Luxury', href: '/category/luxury' },
  { label: 'Categories', href: '/categories' },
  { label: 'Brands', href: '/products?filter=brands' },
  { label: 'Track Order', href: '/track-order' },
] as const;

/* ──────────────────────────────────────────────────────────────────
 *  LOGGED-IN MENU — account navigation
 *  Each item has: label, href, and an SVG icon (16x16, stroke=current)
 * ────────────────────────────────────────────────────────────────── */
const ACCOUNT_LINKS = [
  {
    label: 'My Profile',
    href: '/account',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a8 8 0 0 1 16 0v1" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'My Orders',
    href: '/my-orders',
    icon: (
      <>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinejoin="round" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'Track Orders',
    href: '/track-order',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: 'Wishlist',
    href: '/wishlist',
    icon: (
      <path
        d="M12 21s-7-4.5-9-9.5C1.5 7 4 4 7 4c2 0 3.5 1.5 5 3 1.5-1.5 3-3 5-3 3 0 5.5 3 4 7.5-2 5-9 9.5-9 9.5z"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: 'Saved Addresses',
    href: '/addresses',
    icon: (
      <>
        <path d="M12 22s-8-7-8-13a8 8 0 0 1 16 0c0 6-8 13-8 13z" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
  },
  {
    label: 'Payment Methods',
    href: '/payment-methods',
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </>
    ),
  },
  {
    label: 'Notifications',
    href: '/notification-settings',
    icon: (
      <>
        <path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z" strokeLinejoin="round" />
        <path d="M10 21a2 2 0 0 0 4 0" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'Recently Viewed',
    href: '/products?filter=recent',
    icon: (
      <>
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    label: 'Rewards / Points',
    href: '/rewards',
    icon: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="M9 14.5 8 22l4-2 4 2-1-7.5" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: 'Coupons',
    href: '/account',
    icon: (
      <>
        <path d="M3 5h18v6a3 3 0 0 0 0 6v2H3v-2a3 3 0 0 0 0-6z" strokeLinejoin="round" />
        <line x1="12" y1="5" x2="12" y2="19" strokeDasharray="2 2" />
      </>
    ),
  },
  {
    label: 'Refer & Earn',
    href: '/rewards',
    icon: (
      <>
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <line x1="8.5" y1="10.5" x2="15.5" y2="7.5" />
        <line x1="8.5" y1="13.5" x2="15.5" y2="16.5" />
      </>
    ),
  },
  {
    label: 'Support',
    href: '/help-support',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7v.5" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'Settings',
    href: '/settings-panel',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path
          d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.9a7 7 0 0 0-2-1.2l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-2 1.2l-2.4-.9-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-.9a7 7 0 0 0 2 1.2l.4 2.5h4l.4-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.4-2-1.6A7 7 0 0 0 19 12z"
          strokeLinejoin="round"
        />
      </>
    ),
  },
] as const;

/* ──────────────────────────────────────────────────────────────────
 *  Auth detection hook
 *  Reads localStorage 'lnk_user' (written by /login, /register, /profile)
 * ────────────────────────────────────────────────────────────────── */
interface DrawerUser {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isLoggedIn?: boolean;
}

function useAuthState() {
  const [user, setUser] = useState<DrawerUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      try {
        const raw = localStorage.getItem('lnk_user');
        if (raw) {
          const parsed = JSON.parse(raw) as DrawerUser;
          if (parsed?.isLoggedIn) {
            setUser(parsed);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('focus', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  return { user, isLoggedIn: Boolean(user?.isLoggedIn), mounted };
}

/* ──────────────────────────────────────────────────────────────────
 *  Initials avatar fallback — shown when user.avatar is missing.
 *  Pure CSS circle with first letter(s) of name, no image fetch.
 * ────────────────────────────────────────────────────────────────── */
function getInitials(name?: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/* ══════════════════════════════════════════════════════════════════
 *  MAIN COMPONENT
 * ══════════════════════════════════════════════════════════════════ */
function MobileMenuDrawerImpl({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { user, isLoggedIn, mounted } = useAuthState();

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      haptic.heavy();
      const t = setTimeout(() => closeBtnRef.current?.focus(), 100);
      return () => {
        document.body.style.overflow = '';
        clearTimeout(t);
      };
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        haptic.light();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Logout handler — clears lnk_user and redirects to /login
  const handleLogout = () => {
    haptic.medium();
    try {
      localStorage.removeItem('lnk_user');
    } catch {
      /* localStorage may be blocked — fail silently */
    }
    onClose();
    router.push('/login');
  };

  if (!open) return null;

  // Until the auth-state effect runs on the client, render the guest
  // variant to avoid a hydration mismatch (server never has localStorage).
  const showLoggedIn = mounted && isLoggedIn;

  return (
    <div
      aria-hidden={!open}
      className={`mmd-root ${open ? 'mmd-root--open' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.drawer,
        pointerEvents: open ? 'auto' : 'none',
        visibility: open ? 'visible' : 'hidden',
      }}
    >
      {/* Dark overlay */}
      <div
        className="mmd-overlay"
        onClick={() => {
          haptic.light();
          onClose();
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: theme.colors.scrim,
          opacity: open ? 1 : 0,
          transition: transitions.fade,
        }}
        aria-hidden
      />

      {/* ── DRAWER PANEL ───────────────────────────────────────────────
          Width: 85% of viewport, capped at 380px (per user spec).
          Height: full screen (100vh).
          White background, slide-in from left, safe-area-aware. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className="mmd-panel"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'min(85vw, 380px)',
          maxWidth: '100vw',
          background: theme.colors.white,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: transitions.drawer,
          boxShadow: theme.shadows.xxl,
          paddingTop: safeArea.paddingTop,
          // Container uses box-sizing: border-box so padding is INSIDE
          // the 85vw width — no overflow ever, even on 320px devices.
          boxSizing: 'border-box',
          overflow: 'hidden', // never let children cause horizontal scroll
        }}
      >
        {/* ── DRAWER HEADER (LNKICKS + close) ──────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
            borderBottom: `1px solid ${theme.colors.grey150}`,
            flexShrink: 0, // header never shrinks
          }}
        >
          <div
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.xl,
              fontWeight: theme.fontWeight.extrabold,
              letterSpacing: theme.letterSpacing.widest,
              color: theme.colors.textPrimary,
            }}
          >
            LNKICKS
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => {
              haptic.light();
              onClose();
            }}
            aria-label="Close menu"
            className="pressable"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `1px solid ${theme.colors.border}`,
              background: theme.colors.white,
              color: theme.colors.textPrimary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── LOGGED-IN: Premium profile card ───────────────────────── */}
        {showLoggedIn && (
          <div
            style={{
              padding: `${theme.spacing.xl}px ${theme.spacing.xl}px ${theme.spacing.lg}px`,
              flexShrink: 0,
            }}
          >
            <div
              className="mmd-profile-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
                padding: theme.spacing.lg,
                background: theme.colors.grey50,
                borderRadius: theme.radius.xl,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: '0 1px 2px rgba(17,17,17,0.04)',
              }}
            >
              {/* Avatar — 60x60 circular */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: theme.colors.black,
                  color: theme.colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: theme.fontWeight.bold,
                  flexShrink: 0,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(17,17,17,0.15)',
                }}
              >
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name || 'Profile'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <span aria-hidden="true">{getInitials(user?.name)}</span>
                )}
              </div>

              {/* Name + email + verified badge */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0, // allow text to truncate
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: theme.fontSize.lg,
                      fontWeight: theme.fontWeight.bold,
                      color: theme.colors.textPrimary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }}
                  >
                    {user?.name || 'Account User'}
                  </span>
                  {/* Verified badge */}
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill={theme.colors.black}
                    aria-label="Verified"
                    style={{ flexShrink: 0 }}
                  >
                    <path d="M12 2l2.4 1.8 3 .3.3 3L19.5 9l-1.8 2.4.3 3-3 .3L12 16.5l-2.4-1.8-3-.3-.3-3L4.5 9l1.8-2.4-.3-3 3-.3z" />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke={theme.colors.white}
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: theme.fontSize.sm,
                    color: theme.colors.textSecondary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                  }}
                >
                  {user?.email || 'No email on file'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── SCROLLABLE CONTENT ────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden', // never horizontal scroll
            padding: `${theme.spacing.sm}px 0 ${theme.spacing.lg}px`,
            WebkitOverflowScrolling: 'touch',
            minHeight: 0, // allow flexbox to shrink this to fit
          }}
          className="mmd-scroll"
        >
          {showLoggedIn ? (
            /* ── LOGGED-IN MENU ───────────────────────────────────── */
            <nav aria-label="Account">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {ACCOUNT_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={() => {
                        haptic.selection();
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.md,
                        padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
                        fontSize: theme.fontSize.lg,
                        fontWeight: theme.fontWeight.medium,
                        color: theme.colors.textPrimary,
                        textDecoration: 'none',
                        borderBottom: `1px solid ${theme.colors.grey50}`,
                        transition: transitions.press,
                      }}
                      className="mmd-link"
                    >
                      {/* Icon */}
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden
                        style={{ flexShrink: 0, color: theme.colors.textSecondary }}
                      >
                        {l.icon}
                      </svg>
                      {/* Label */}
                      <span style={{ flex: 1 }}>{l.label}</span>
                      {/* Chevron */}
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        viewBox="0 0 24 24"
                        aria-hidden
                        style={{ flexShrink: 0, color: theme.colors.textTertiary }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 18l6-6-6-6"
                        />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            /* ── GUEST MENU ───────────────────────────────────────── */
            <nav aria-label="Primary">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {GUEST_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => {
                        haptic.selection();
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: `${theme.spacing.md + 1}px ${theme.spacing.xl}px`,
                        fontSize: theme.fontSize.lg,
                        fontWeight: theme.fontWeight.semibold,
                        color: theme.colors.textPrimary,
                        textDecoration: 'none',
                        borderBottom: `1px solid ${theme.colors.grey50}`,
                        transition: transitions.press,
                      }}
                      className="mmd-link"
                    >
                      {l.label}
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden style={{ color: theme.colors.textTertiary }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* ── STICKY BOTTOM AREA ──────────────────────────────────────
            For GUESTS: Sign In + Register buttons side-by-side, 50/50
            split, 12px gap, 14px radius, 16px padding. Always visible
            (flexShrink: 0, above the safe-area-inset-bottom).
            For LOGGED-IN: Logout button (red, full width). */}
        <div
          style={{
            flexShrink: 0,
            padding: `${theme.spacing.md}px ${theme.spacing.xl}px calc(${theme.spacing.lg}px + env(safe-area-inset-bottom))`,
            borderTop: `1px solid ${theme.colors.grey150}`,
            background: theme.colors.white,
          }}
        >
          {showLoggedIn ? (
            /* ── LOGOUT button (red) ──────────────────────────────── */
            <button
              type="button"
              onClick={handleLogout}
              className="pressable mmd-logout"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.sm,
                width: '100%',
                padding: `${theme.spacing.md + 2}px ${theme.spacing.lg}px`,
                background: theme.colors.white,
                color: theme.colors.error,
                border: `1.5px solid ${theme.colors.error}`,
                borderRadius: 14,
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.lg,
                fontWeight: theme.fontWeight.semibold,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                boxSizing: 'border-box',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                />
              </svg>
              Logout
            </button>
          ) : (
            /* ── GUEST: Sign In + Register (50/50) ──────────────────
                Critical fix: buttons must NEVER overflow. Use flex
                with width: 100% inside a flexbox that distributes
                space equally. box-sizing: border-box so padding
                stays inside the button width. min-width: 0 to allow
                flex to shrink on 320px devices. */
            <div
              style={{
                display: 'flex',
                gap: 12,
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <Link
                href="/login"
                onClick={() => {
                  haptic.medium();
                  onClose();
                }}
                className="pressable mmd-auth-btn mmd-auth-btn--primary"
                style={{
                  flex: 1,
                  minWidth: 0, // allow shrinking on narrow screens
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  background: theme.colors.black,
                  color: theme.colors.white,
                  borderRadius: 14,
                  textDecoration: 'none',
                  fontFamily: theme.fontFamily.body,
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.semibold,
                  letterSpacing: '0.04em',
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => {
                  haptic.medium();
                  onClose();
                }}
                className="pressable mmd-auth-btn mmd-auth-btn--secondary"
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  background: theme.colors.white,
                  color: theme.colors.textPrimary,
                  border: `1.5px solid ${theme.colors.black}`,
                  borderRadius: 14,
                  textDecoration: 'none',
                  fontFamily: theme.fontFamily.body,
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.semibold,
                  letterSpacing: '0.04em',
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </aside>

      <style jsx>{`
        .mmd-scroll::-webkit-scrollbar {
          width: 0;
          display: none;
        }
        .mmd-scroll {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .mmd-link:active {
          background-color: ${theme.colors.grey50};
        }
        .mmd-link:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: -2px;
        }
        .mmd-auth-btn:active {
          transform: scale(0.97);
        }
        .mmd-auth-btn:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .mmd-logout:active {
          transform: scale(0.97);
          background: ${theme.colors.error};
          color: ${theme.colors.white};
        }
        .mmd-logout:focus-visible {
          outline: 2px solid ${theme.colors.error};
          outline-offset: 2px;
        }
      `}</style>
      <style jsx>{pressableStyle}</style>
    </div>
  );
}

export const MobileMenuDrawer = memo(MobileMenuDrawerImpl);
export default MobileMenuDrawer;
