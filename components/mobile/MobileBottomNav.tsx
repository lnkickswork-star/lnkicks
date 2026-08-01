'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { theme } from '@/lib/mobile/theme/theme';
import { safeArea } from '@/lib/mobile/utils/safeArea';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileBottomNav — premium floating bottom navigation.
 *
 * 5 items: Home, Categories, Wishlist, Cart, Profile.
 * Modern floating pill design with soft shadow.
 * Active item: black filled pill with white icon + label.
 * Inactive: grey icon + label on transparent.
 *
 * LN KICKS theme: white floating bar, black active state, soft grey inactive.
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded values)
 *  - Safe-area-aware: floats above iOS Home Indicator via env(safe-area-inset-bottom)
 *  - Haptic feedback (selection tick) on tap
 *  - Pressed state (scale 0.94) on tap
 *  - Focus-visible ring for keyboard navigation
 *  - ARIA: role="navigation", aria-label="Primary", aria-current="page" on active
 *  - Memoized — only re-renders when pathname changes
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
  {
    label: 'Wishlist',
    href: '/wishlist',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="2" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: 'Cart',
    href: '/cart',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function MobileBottomNavImpl() {
  const pathname = usePathname() || '/';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav
      aria-label="Primary navigation"
      style={{
        position: 'fixed',
        // 16px gap + safe-area-inset-bottom (clears iOS Home Indicator)
        bottom: safeArea.bottomNavOffset,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 24px)',
        maxWidth: 420,
        background: theme.colors.white,
        borderRadius: theme.radius.pill,
        border: `1px solid ${theme.colors.grey150}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        alignItems: 'center',
        zIndex: theme.zIndex.nav,
        boxShadow: theme.shadows.lg,
        padding: `${theme.spacing.sm}px ${theme.spacing.xs + 2}px`,
        boxSizing: 'border-box',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            className="pressable mbn-item"
            onPointerDown={() => haptic.selection()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              padding: `${theme.spacing.xs + 2}px ${theme.spacing.xs}px`,
              borderRadius: theme.radius.pill,
              textDecoration: 'none',
              background: active ? theme.colors.black : 'transparent',
              color: active ? theme.colors.white : theme.colors.textSecondary,
              transition: `background-color ${theme.motion.duration.normal} ${theme.motion.easing.out}, color ${theme.motion.duration.normal} ${theme.motion.easing.out}`,
            }}
          >
            {item.icon(active ? theme.colors.white : theme.colors.textSecondary)}
            <span
              style={{
                fontSize: theme.fontSize.micro,
                fontWeight: theme.fontWeight.bold,
                letterSpacing: theme.letterSpacing.wide,
                textTransform: 'uppercase',
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
      <style jsx>{pressableStyle}</style>
    </nav>
  );
}

export const MobileBottomNav = memo(MobileBottomNavImpl);
export default MobileBottomNav;
