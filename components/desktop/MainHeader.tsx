'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';

/**
 * MainHeader — premium sticky header for LN KICKS.
 *
 * Refinements (Phase 1.5):
 *  - Brand: LN KICKS (replaces KM / Kicks Machine)
 *  - Nav: Sneakers, Luxury Footwear, Upcoming, Nike, Jordan, Adidas, Puma,
 *         Reebok, Track Your Order
 *  - Premium underline reveal on hover (animated width 0 → 100%)
 *  - Smoother color transitions, refined letter-spacing
 *  - Sticky header remains, gains subtle shadow on scroll
 */
const NAV_ITEMS = [
  { label: 'Sneakers', href: '/category-products' },
  { label: 'Luxury Footwear', href: '/categories' },
  { label: 'Upcoming', href: '/category-products' },
  { label: 'Nike', href: '/category-products' },
  { label: 'Jordan', href: '/category-products' },
  { label: 'Adidas', href: '/category-products' },
  { label: 'Puma', href: '/category-products' },
  { label: 'Reebok', href: '/category-products' },
  { label: 'Track Your Order', href: '/track-order' },
];

export default function MainHeader() {
  const { cart } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderBottom: '1px solid #f0f0f0',
        transition: 'box-shadow 400ms ease, border-color 400ms ease',
        boxShadow: scrolled ? '0 8px 32px -12px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '84px',
        }}
      >
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              textDecoration: 'none',
              color: 'inherit',
              gap: '6px',
            }}
          >
            <span
              className="lnk-logo"
              style={{
                fontSize: '24px',
                fontWeight: 900,
                letterSpacing: '0.02em',
                lineHeight: 1,
                color: '#000000',
                textTransform: 'uppercase',
                transition: 'letter-spacing 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'inline-block',
              }}
            >
              LN
            </span>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '0.18em',
                lineHeight: 1,
                color: '#000000',
                textTransform: 'uppercase',
              }}
            >
              KICKS
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
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
                position: 'relative',
                padding: '6px 0',
                transition: 'color 300ms ease',
              }}
            >
              {item.label}
              <span className="nav-underline" />
            </Link>
          ))}
        </nav>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link
            href="/search"
            className="icon-btn"
            style={{ color: '#000', display: 'inline-flex', padding: '6px', transition: 'opacity 300ms ease, transform 300ms ease' }}
            aria-label="Search"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="icon-btn"
            style={{ color: '#000', display: 'inline-flex', padding: '6px', transition: 'opacity 300ms ease, transform 300ms ease' }}
            aria-label="Account"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          <Link
            href="/cart"
            className="icon-btn"
            style={{
              color: '#000',
              display: 'inline-flex',
              padding: '6px',
              position: 'relative',
              transition: 'opacity 300ms ease, transform 300ms ease',
            }}
            aria-label={`Cart with ${cartCount} items`}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
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
        .nav-link .nav-underline {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 1.5px;
          width: 0;
          background: #000000;
          transition: width 380ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link:hover {
          color: #2a2a2a;
        }
        .nav-link:hover .nav-underline {
          width: 100%;
        }
        .icon-btn {
          opacity: 1;
        }
        .icon-btn:hover {
          opacity: 0.55;
          transform: translateY(-1px);
        }
        .lnk-logo:hover {
          letter-spacing: 0.08em;
        }
      `}</style>
    </header>
  );
}
