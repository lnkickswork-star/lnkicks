'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';

/**
 * MobileHeader — premium minimal sticky header.
 *
 * White background, soft bottom shadow on scroll. LNKICKS wordmark left,
 * wishlist + cart icons right (with live cart badge). Black icons on white.
 *
 * LN KICKS theme: pure white + black + soft grey.
 */
export default function MobileHeader() {
  const { cart, wishlist } = useApp();
  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
  const wishCount = wishlist.length;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'saturate(180%) blur(14px)',
        WebkitBackdropFilter: 'saturate(180%) blur(14px)',
        borderBottom: '1px solid #f3f3f3',
      }}
    >
      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Wordmark */}
        <Link
          href="/mobile"
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#0A0A0A',
            textDecoration: 'none',
          }}
        >
          LNKICKS
        </Link>

        {/* Right: wishlist + cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0A0A0A',
              textDecoration: 'none',
              position: 'relative',
              background: 'transparent',
              border: 'none',
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: '#0A0A0A',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 800,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {wishCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0A0A0A',
              textDecoration: 'none',
              position: 'relative',
              background: 'transparent',
              border: 'none',
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: '#0A0A0A',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 800,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
