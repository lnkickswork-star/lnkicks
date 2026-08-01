'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * MainFooter — premium dark footer for LN KICKS.
 *
 * Refinements (Phase 1.5):
 *  - Brand: LN KICKS — Luxury Sneaker Marketplace
 *  - Rebuilt layout: large brand block (left) + 3 link columns (right)
 *  - Premium newsletter block above the link grid
 *  - Better social icons with refined hover states
 *  - Removed "Kicks Machine is India's Destination..." paragraph
 *  - Refined typography hierarchy
 *  - Subtle reveal animations on link hover (right-shift + color)
 */

const SHOP_LINKS = [
  { label: 'Sneakers', href: '/category-products' },
  { label: 'Luxury Footwear', href: '/categories' },
  { label: 'Upcoming', href: '/category-products' },
  { label: 'Nike', href: '/category-products' },
  { label: 'Jordan', href: '/category-products' },
  { label: 'Adidas', href: '/category-products' },
  { label: 'Track Your Order', href: '/track-order' },
];

const POLICY_LINKS = [
  { label: 'Authenticity Guarantee', href: '/help-support' },
  { label: 'Return & Exchange Policy', href: '/return-refund-policy' },
  { label: 'Terms and Conditions', href: '/terms-conditions' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

const CATEGORY_LINKS = [
  { label: 'Sneakers', href: '/category-products' },
  { label: 'Street Wear', href: '/categories' },
  { label: 'Care & Accessories', href: '/category-products' },
  { label: 'Rayban x Meta Glasses', href: '/category-products' },
  { label: 'Sneaker Keychain', href: '/category-products' },
  { label: 'Socks', href: '/category-products' },
];

export default function MainFooter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer style={{ background: '#0a0a0a', color: '#ffffff' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '40px', paddingRight: '40px' }}>
        {/* Newsletter Block (top) */}
        <div
          style={{
            paddingTop: '96px',
            paddingBottom: '80px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                marginBottom: '16px',
                margin: '0 0 16px 0',
              }}
            >
              Sign up and Save Big
            </p>
            <h3
              style={{
                fontSize: '44px',
                fontWeight: 800,
                lineHeight: 1.05,
                margin: 0,
                letterSpacing: '-0.035em',
              }}
            >
              The Drop List.
              <br />
              <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#9ca3af' }}>
                Price drops, releases, rare finds.
              </span>
            </h3>
          </div>
          <form onSubmit={handleSubmit} style={{ position: 'relative', maxWidth: '520px', justifySelf: 'end', width: '100%' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={submitted ? 'Welcome to the list ✓' : 'Enter your email'}
              required
              aria-label="Email address"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '999px',
                paddingTop: '22px',
                paddingBottom: '22px',
                paddingLeft: '32px',
                paddingRight: '64px',
                fontSize: '15px',
                fontWeight: 600,
                outline: 'none',
                color: '#fff',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 350ms ease, background-color 350ms ease',
              }}
              className="footer-input"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="footer-submit"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                background: '#fff',
                color: '#000',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1), background-color 350ms ease',
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Main grid */}
        <div
          style={{
            paddingTop: '80px',
            paddingBottom: '64px',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            gap: '64px',
          }}
        >
          {/* Col 1 — Brand block */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', marginBottom: '28px' }}>
              <span
                style={{
                  fontSize: '26px',
                  fontWeight: 900,
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                }}
              >
                LN
              </span>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  lineHeight: 1,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                }}
              >
                KICKS
              </span>
            </div>
            <p
              style={{
                fontSize: '13px',
                color: '#9ca3af',
                lineHeight: 1.7,
                fontWeight: 500,
                margin: '0 0 32px 0',
                maxWidth: '320px',
              }}
            >
              Luxury Sneaker Marketplace. India&apos;s edit of authenticated, hyped &amp; rare footwear — verified by
              6-step in-house check, CheckCheck &amp; LegitApp.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {[
                {
                  label: 'Instagram',
                  svg: (
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.645 1.439-1.441s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  label: 'YouTube',
                  svg: (
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
                    </svg>
                  ),
                },
                {
                  label: 'X',
                  svg: (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: 'TikTok',
                  svg: (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="footer-social"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    transition: 'color 300ms ease, border-color 300ms ease, transform 300ms ease, background-color 300ms ease',
                  }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Shop nav */}
          <div>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: 800,
                marginBottom: '28px',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: '#fff',
                margin: '0 0 28px 0',
              }}
            >
              Shop
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {SHOP_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  style={{
                    color: '#9ca3af',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textDecoration: 'none',
                    transition: 'color 300ms ease, transform 300ms ease',
                    display: 'inline-block',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Information / policies */}
          <div>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: 800,
                marginBottom: '28px',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: '#fff',
                margin: '0 0 28px 0',
              }}
            >
              Information
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {POLICY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  style={{
                    color: '#9ca3af',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textDecoration: 'none',
                    transition: 'color 300ms ease, transform 300ms ease',
                    display: 'inline-block',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4 — Categories */}
          <div>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: 800,
                marginBottom: '28px',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: '#fff',
                margin: '0 0 28px 0',
              }}
            >
              Categories
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {CATEGORY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  style={{
                    color: '#9ca3af',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textDecoration: 'none',
                    transition: 'color 300ms ease, transform 300ms ease',
                    display: 'inline-block',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '32px',
            paddingBottom: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: '#6b7280',
              fontWeight: 700,
              margin: 0,
            }}
          >
            © 2026 LN KICKS · Luxury Sneaker Marketplace
          </p>
          <p
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#4b5563',
              fontWeight: 700,
              margin: 0,
            }}
          >
            Call +91 95480 57414 · Mon–Fri · 11AM–6PM IST
          </p>
        </div>
      </div>

      <style jsx>{`
        .footer-link:hover {
          color: #ffffff !important;
          transform: translateX(4px);
        }
        .footer-social:hover {
          color: #ffffff !important;
          border-color: rgba(255,255,255,0.4) !important;
          background-color: rgba(255,255,255,0.04) !important;
          transform: translateY(-2px);
        }
        .footer-input::placeholder {
          color: #6b7280;
          font-weight: 500;
        }
        .footer-input:focus {
          border-color: rgba(255,255,255,0.4) !important;
          background-color: rgba(255,255,255,0.06) !important;
        }
        .footer-submit:hover {
          transform: translateY(-50%) scale(1.05) !important;
          background-color: #e5e7eb !important;
        }
      `}</style>
    </footer>
  );
}
