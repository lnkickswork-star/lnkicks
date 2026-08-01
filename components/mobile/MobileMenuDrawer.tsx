'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

/**
 * MobileMenuDrawer — luxury slide-in drawer from the left.
 *
 * Triggered by the Menu button in MobileHeader. Premium dark overlay +
 * white drawer panel. Drawer contains: wordmark, primary nav links,
 * auth link, secondary utility links, social row.
 *
 * LN KICKS theme: white drawer, black text, soft grey dividers.
 */

const PRIMARY_LINKS = [
  { label: 'Home', href: '/mobile' },
  { label: 'Shop All', href: '/products' },
  { label: 'Trending', href: '/products?filter=trending' },
  { label: 'New Arrivals', href: '/products?filter=new' },
  { label: 'Luxury', href: '/category/luxury' },
  { label: 'Categories', href: '/categories' },
  { label: 'Brands', href: '/products?filter=brands' },
  { label: 'Track Order', href: '/track-order' },
];

const UTILITY_LINKS = [
  { label: 'About LN KICKS', href: '/about' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Returns & Refunds', href: '/return-refund-policy' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

export default function MobileMenuDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-hidden={!open}
      className={`mmd-root ${open ? 'mmd-root--open' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        pointerEvents: open ? 'auto' : 'none',
        visibility: open ? 'visible' : 'hidden',
      }}
    >
      {/* Dark overlay */}
      <div
        className="mmd-overlay"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,10,10,0.45)',
          opacity: open ? 1 : 0,
          transition: 'opacity 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-hidden
      />

      {/* Drawer panel */}
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
          width: 'min(86%, 360px)',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 0 60px rgba(0,0,0,0.18)',
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 22px 18px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: '#0A0A0A',
            }}
          >
            LNKICKS
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid #ececec',
              background: '#ffffff',
              color: '#0A0A0A',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 0 24px',
            WebkitOverflowScrolling: 'touch',
          }}
          className="mmd-scroll"
        >
          {/* Primary links */}
          <nav aria-label="Primary">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {PRIMARY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '15px 22px',
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: '#0A0A0A',
                      textDecoration: 'none',
                      borderBottom: '1px solid #f6f6f6',
                      transition: 'background-color 220ms ease',
                    }}
                    className="mmd-link"
                  >
                    {l.label}
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth CTA */}
          <div style={{ padding: '22px 22px 18px' }}>
            <Link
              href="/login"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                padding: '14px 20px',
                background: '#0A0A0A',
                color: '#ffffff',
                borderRadius: 999,
                textDecoration: 'none',
                fontFamily: 'var(--font-oswald), sans-serif',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              Sign In / Register
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Section divider */}
          <div style={{ padding: '0 22px', marginTop: 4 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                margin: '0 0 8px 0',
              }}
            >
              Help & Info
            </p>
          </div>

          {/* Utility links */}
          <nav aria-label="Utility">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {UTILITY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    style={{
                      display: 'block',
                      padding: '11px 22px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#6b7280',
                      textDecoration: 'none',
                      transition: 'color 220ms ease',
                    }}
                    className="mmd-util-link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Trust footer */}
          <div
            style={{
              padding: '24px 22px 0',
              marginTop: 12,
              borderTop: '1px solid #f0f0f0',
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#0A0A0A',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                margin: '0 0 8px 0',
              }}
            >
              100% Authentic
            </p>
            <p
              style={{
                fontSize: 11.5,
                color: '#9ca3af',
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              Verified by CheckCheck & LegitApp. Money-back guarantee on every pair.
            </p>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .mmd-scroll::-webkit-scrollbar {
          width: 0;
          display: none;
        }
        .mmd-link:active {
          background-color: #f6f6f6;
        }
        .mmd-util-link:active {
          color: #0a0a0a;
        }
      `}</style>
    </div>
  );
}
