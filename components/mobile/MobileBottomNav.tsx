'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { safeArea } from '@/lib/mobile/utils/safeArea';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileBottomNav — floating bottom navigation with center FAB.
 *
 * Layout (matches reference):
 *   ┌──────────────────────────────────────────────┐
 *   │  Home     Wishlist    ◉    Profile  Categories│
 *   └──────────────────────────────────────────────┘
 *                       ▲
 *              Center FAB (matte black, cart icon)
 *              Sits ABOVE the bar, slightly elevated.
 *
 *  - 4 nav items flanking the center: Home, Wishlist, Profile, Categories
 *  - Center FAB: matte black circle with shopping bag icon, links to /cart
 *  - Active nav item: black icon + black label
 *  - Inactive nav item: grey icon + grey label
 *  - White floating bar, soft shadow, full pill radius
 *  - FAB casts a deeper shadow (lg) for elevation
 *  - Cart badge count overlaid on the FAB
 *
 * LN KICKS theme: matte black accents, no blue.
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded values)
 *  - Safe-area-aware: floats above iOS Home Indicator
 *  - Haptic selection tick on nav tap; medium tick on FAB tap
 *  - Pressed state (scale 0.92) on items, scale 0.88 on FAB
 *  - Focus-visible ring
 *  - ARIA: role="navigation", aria-label, aria-current
 *  - Memoized — only re-renders when pathname or cart count changes
 */

type IconRenderer = (color: string) => React.ReactNode;

type NavItem = {
  label: string;
  href: string;
  icon: IconRenderer;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Wishlist',
    href: '/wishlist',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="2" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  // (center FAB slot — empty in the array, FAB rendered separately)
  {
    label: 'Profile',
    href: '/profile',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function MobileBottomNavImpl({
  hideCartFab = false,
}: {
  /** Hide the center cart FAB (used on /cart and /checkout to avoid
   *  double-cart UX — user is already in the cart flow). */
  hideCartFab?: boolean;
} = {}) {
  const pathname = usePathname() || '/';
  const { cart } = useApp();
  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav
      aria-label="Primary navigation"
      style={{
        position: 'fixed',
        bottom: safeArea.bottomNavOffset,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 24px)',
        maxWidth: 420,
        zIndex: theme.zIndex.nav,
      }}
    >
      {/* Nav bar with notch for FAB — 80px height per Phase 6 spec */}
      <div
        style={{
          position: 'relative',
          background: theme.colors.white,
          borderRadius: theme.radius.pill,
          border: `1px solid ${theme.colors.grey100}`,
          boxShadow: theme.shadows.lg,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 64px 1fr 1fr',
          alignItems: 'center',
          height: theme.spacing.bottomNavHeight,
          padding: `0 ${theme.spacing.sm}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Render 4 nav items, with the center column reserved for FAB */}
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <NavButton key={item.label} item={item} active={isActive(item.href)} />
        ))}

        {/* Center spacer — FAB renders absolutely above */}
        <div aria-hidden style={{ height: 1 }} />

        {NAV_ITEMS.slice(2).map((item) => (
          <NavButton key={item.label} item={item} active={isActive(item.href)} />
        ))}
      </div>

      {/* Center FAB — Cart action (hidden on /cart and /checkout via hideCartFab) */}
      {!hideCartFab && (
        <Link
          href="/cart"
          aria-label={cartCount > 0 ? `Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}` : 'Cart'}
          onPointerDown={() => haptic.medium()}
          className="pressable mbn-fab"
          style={{
            position: 'absolute',
            top: -22,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: theme.colors.primaryButton,
            color: theme.colors.buttonText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.shadows.lg,
            border: `3px solid ${theme.colors.white}`,
            textDecoration: 'none',
            zIndex: theme.zIndex.fab,
          }}
        >
          {/* Action icon = 22px per Phase 6 spec */}
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount > 0 && (
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                background: theme.colors.white,
                color: theme.colors.black,
                fontSize: 9.5,
                fontWeight: theme.fontWeight.bold,
                minWidth: 18,
                height: 18,
                borderRadius: theme.radius.pill,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `0 ${theme.spacing.xs}px`,
                border: `2px solid ${theme.colors.black}`,
                boxSizing: 'border-box',
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      )}

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .mbn-fab:active {
          transform: translateX(-50%) scale(${theme.scale.buttonPress});
        }
      `}</style>
    </nav>
  );
}

/* ── Nav button (one of the 4 flanking items) ─────────────────── */
function NavButtonImpl({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
      onPointerDown={() => haptic.selection()}
      className="pressable mbn-item"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        padding: `${theme.spacing.xs}px`,
        borderRadius: theme.radius.pill,
        textDecoration: 'none',
        background: 'transparent',
        color: active ? theme.colors.textPrimary : theme.colors.textTertiary,
        transition: `color ${theme.duration.standard} ${theme.easing.easeOut}, transform ${theme.duration.instant} ${theme.easing.easeOut}`,
      }}
    >
      {item.icon(active ? theme.colors.textPrimary : theme.colors.textTertiary)}
      {/* Bottom Navigation label — 11px / 500 (per Phase 6 spec) */}
      <span
        style={{
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.navLabel,
          fontWeight: theme.fontWeight.medium,
          letterSpacing: theme.letterSpacing.normal,
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        {item.label}
      </span>
    </Link>
  );
}

const NavButton = memo(NavButtonImpl);

export const MobileBottomNav = memo(MobileBottomNavImpl);
export default MobileBottomNav;
