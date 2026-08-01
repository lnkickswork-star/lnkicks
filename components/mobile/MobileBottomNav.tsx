'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * MobileBottomNav — premium floating bottom navigation.
 *
 * 5 items: Home, Categories, Wishlist, Cart, Profile.
 * Modern floating pill design with soft shadow.
 * Active item: black filled pill with white icon + label.
 * Inactive: grey icon + label on transparent.
 *
 * LN KICKS theme: white floating bar, black active state, soft grey inactive.
 */
const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/mobile',
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

export default function MobileBottomNav() {
  const pathname = usePathname() || '/mobile';

  const isActive = (href: string) => {
    if (href === '/mobile') return pathname === '/mobile' || pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav
      aria-label="Primary"
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 24px)',
        maxWidth: 420,
        background: '#ffffff',
        borderRadius: 999,
        border: '1px solid #f0f0f0',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 12px 32px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)',
        padding: '8px 6px',
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
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              padding: '6px 4px',
              borderRadius: 999,
              textDecoration: 'none',
              background: active ? '#0A0A0A' : 'transparent',
              color: active ? '#ffffff' : '#6b7280',
              transition:
                'background-color 300ms cubic-bezier(0.16, 1, 0.3, 1), color 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {item.icon(active ? '#ffffff' : '#6b7280')}
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
