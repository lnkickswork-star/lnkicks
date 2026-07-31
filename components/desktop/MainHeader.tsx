'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';

/**
 * MainHeader — sticky white/95 backdrop-blur header with KM logo, 7-item nav,
 * and search/account/cart action icons. Integrates with AppContext for live
 * cart count badge.
 *
 * Stitch design specs:
 *  - height: 80px (h-20)
 *  - bg: white/95 backdrop-blur-md, border-b gray-100
 *  - logo: "KM" 3xl black + "KICKS MACHINE" 8px tracking-[0.3em]
 *  - nav: 11px bold uppercase tracking-wider, 7 items
 *  - icons: 20px stroke, hover:opacity-60
 */
const NAV_ITEMS = [
  { label: 'Sneakers', href: '/category-products' },
  { label: 'Luxury Footwear', href: '/categories' },
  { label: 'Bags', href: '/category-products' },
  { label: 'Beauty', href: '/category-products' },
  { label: 'Clothing', href: '/category-products' },
  { label: 'Hype & Care', href: '/category-products' },
  { label: 'Track Your Order', href: '/track-order' },
];

export default function MainHeader() {
  const { cart } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px',
        }}
      >
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <span
              className="km-logo"
              style={{
                fontSize: '30px',
                fontWeight: 900,
                letterSpacing: '-0.05em',
                lineHeight: 1,
                color: '#000000',
                transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'inline-block',
              }}
            >
              KM
            </span>
            <span
              style={{
                fontSize: '8px',
                letterSpacing: '0.3em',
                fontWeight: 700,
                marginTop: '4px',
                color: '#000000',
              }}
            >
              KICKS MACHINE
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-link"
              style={{
                color: '#000000',
                textDecoration: 'none',
                transition: 'color 250ms ease',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link
            href="/search"
            className="icon-btn"
            style={{ color: '#000', display: 'inline-flex', padding: '4px', transition: 'opacity 250ms ease' }}
            aria-label="Search"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="icon-btn"
            style={{ color: '#000', display: 'inline-flex', padding: '4px', transition: 'opacity 250ms ease' }}
            aria-label="Account"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          <Link
            href="/cart"
            className="icon-btn"
            style={{
              color: '#000',
              display: 'inline-flex',
              padding: '4px',
              position: 'relative',
              transition: 'opacity 250ms ease',
            }}
            aria-label={`Cart with ${cartCount} items`}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: '#000',
                  color: '#fff',
                  borderRadius: '999px',
                  minWidth: '16px',
                  height: '16px',
                  fontSize: '9px',
                  fontWeight: 700,
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

      <style jsx>{`
        .nav-link:hover {
          color: #6b7280 !important;
        }
        .icon-btn:hover {
          opacity: 0.6;
        }
        .km-logo:hover {
          transform: scale(1.05);
        }
      `}</style>
    </header>
  );
}
