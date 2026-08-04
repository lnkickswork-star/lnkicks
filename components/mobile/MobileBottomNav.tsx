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
 * PHASE 7 PREMIUM REDESIGN
 *   - Softer, wider-spread shadow (shadows.lg — premium tier)
 *   - Apple-style backdrop blur (saturate 180% + blur 24px)
 *   - Center FAB with deeper elevation (shadows.fab) — perfectly centered
 *   - Smooth icon scale animation on active state (scale 1.05)
 *   - Better active state: filled icon + black label
 *   - Inactive: grey icon + grey label (lighter for contrast)
 *   - Spring-like transitions for tactile feedback
 *
 * Layout (matches reference):
 *   ┌──────────────────────────────────────────────┐
 *   │  Home     Wishlist    ◉    Profile  Categories│
 *   └──────────────────────────────────────────────┘
 *                       ▲
 *              Center FAB (matte black, cart icon)
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
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Wishlist',
    href: '/wishlist',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="2" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  // (center FAB slot — empty in the array, FAB rendered separately)
  {
    label: 'Profile',
    href: '/account',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="2" aria-hidden>
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
      {/* Nav bar with notch for FAB — 64px height */}
      <div
        style={{
          position: 'relative',
          // Phase 8: glass background with blur
          background: theme.colors.glass,
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderRadius: theme.radius.pill,
          border: `1px solid ${theme.colors.grey200}`,
          // Phase 8: standard premium shadow
          boxShadow: theme.shadows.md,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 52px 1fr 1fr',
          alignItems: 'center',
          height: theme.spacing.bottomNavHeight,
          padding: `0 ${theme.spacing.xs}px`,
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
            top: -18,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: theme.colors.primaryButton,
            color: theme.colors.buttonText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Phase 8: FAB elevation
            boxShadow: theme.shadows.fab,
            border: `2.5px solid ${theme.colors.white}`,
            textDecoration: 'none',
            zIndex: theme.zIndex.fab,
            // Phase 8: spring-like transition for tactile feedback
            transition: `transform ${theme.duration.instant} ${theme.easing.spring}`,
          }}
        >
          {/* Action icon = 18px */}
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
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
                fontSize: 8.5,
                fontWeight: theme.fontWeight.bold,
                minWidth: 16,
                height: 16,
                borderRadius: theme.radius.pill,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `0 ${theme.spacing.xs - 1}px`,
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
        gap: 2,
        padding: `${theme.spacing.xs}px`,
        borderRadius: theme.radius.pill,
        textDecoration: 'none',
        background: 'transparent',
        color: active ? theme.colors.textPrimary : theme.colors.textTertiary,
        // Phase 8: spring transition for icon + color change
        transition: `color ${theme.duration.standard} ${theme.easing.easeOut}, transform ${theme.duration.instant} ${theme.easing.spring}`,
      }}
    >
      <span
        className="mbn-icon"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Phase 8: scale active icon up slightly (1.05) for tactile feedback
          transform: active ? 'scale(1.05)' : 'scale(1)',
          transition: `transform ${theme.duration.standard} ${theme.easing.spring}`,
        }}
      >
        {item.icon(active ? theme.colors.textPrimary : theme.colors.textTertiary)}
      </span>
      {/* Bottom Navigation label — 11px / 500 */}
      <span
        style={{
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.navLabel,
          fontWeight: active ? theme.fontWeight.semibold : theme.fontWeight.medium,
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
