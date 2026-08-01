'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';

/**
 * MobileHeader — premium minimal sticky header.
 *
 * Layout: [Menu icon] [LN KICKS centered] [Wishlist] [Cart] [Profile]
 *
 * White glass background, soft bottom border. Black icons. Live cart +
 * wishlist badges. Tapping the Menu icon calls `onMenuClick` which opens
 * a MobileMenuDrawer rendered at the page level (sibling of MobileBottomNav)
 * so the drawer's z-index isn't trapped inside this header's stacking context.
 *
 * LN KICKS theme: pure white + black + soft grey.
 */
export default function MobileHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { cart, wishlist } = useApp();
  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
  const wishCount = wishlist.length;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'saturate(180%) blur(14px)',
        WebkitBackdropFilter: 'saturate(180%) blur(14px)',
        borderBottom: scrolled ? '1px solid #ececec' : '1px solid transparent',
        transition: 'border-color 280ms ease',
      }}
    >
      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          padding: '12px 14px',
          display: 'grid',
          gridTemplateColumns: '36px 1fr 36px 36px 36px',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {/* Left: Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: '#0A0A0A',
            cursor: 'pointer',
            transition: 'background-color 220ms ease',
          }}
          className="mh-icon-btn"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
            <line x1="3" y1="12" x2="15" y2="12" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
          </svg>
        </button>

        {/* Center: wordmark */}
        <Link
          href="/mobile"
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#0A0A0A',
            textDecoration: 'none',
            textAlign: 'center',
            justifySelf: 'center',
          }}
        >
          LNKICKS
        </Link>

        {/* Right: Wishlist */}
        <HeaderIconButton href="/wishlist" label="Wishlist" badge={wishCount}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </HeaderIconButton>

        {/* Right: Cart */}
        <HeaderIconButton href="/cart" label="Cart" badge={cartCount}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </HeaderIconButton>

        {/* Right: Profile */}
        <HeaderIconButton href="/profile" label="Profile" badge={0}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </HeaderIconButton>
      </div>

      <style jsx>{`
        .mh-icon-btn:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  HeaderIconButton — compact icon button used in the header right
 *  cluster. Renders a Link with a circular badge if `badge > 0`.
 * ────────────────────────────────────────────────────────────────── */
function HeaderIconButton({
  href,
  label,
  badge,
  children,
}: {
  href: string;
  label: string;
  badge: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0A0A0A',
        textDecoration: 'none',
        position: 'relative',
        background: 'transparent',
        transition: 'background-color 220ms ease',
      }}
      className="mh-icon-link"
    >
      {children}
      {badge > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            background: '#0A0A0A',
            color: '#fff',
            fontSize: 8.5,
            fontWeight: 800,
            minWidth: 14,
            height: 14,
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 3px',
            border: '1.5px solid #ffffff',
            boxSizing: 'border-box',
          }}
        >
          {badge}
        </span>
      )}
      <style jsx>{`
        .mh-icon-link:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </Link>
  );
}
