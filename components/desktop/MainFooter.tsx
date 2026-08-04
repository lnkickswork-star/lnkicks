'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * MainFooter — premium dark footer for LN KICKS (Phase 2 rebuild).
 *
 * Changes vs Phase 1.5:
 *  - Rounded top-left + top-right corners (32px) — footer floats as a
 *    premium section above the page background.
 *  - Removed "Call +91 ... · Mon–Fri · 11AM–6PM IST" lower info bar.
 *  - Added a "Payment Methods" strip with 12 monochrome (Apple-style)
 *    payment brand icons: BHIM UPI, Google Pay, PhonePe, Paytm, Visa,
 *    Mastercard, RuPay, American Express, UPI, Debit Card, Credit Card,
 *    Net Banking, Wallets.
 *  - Refreshed Shop column  → Sneakers / Luxury / Brands / New Arrivals /
 *    Coming Soon / Track Order / Gift Cards / Wishlist.
 *  - Refreshed Categories column → Collections / New Arrivals / Best
 *    Sellers / Upcoming Drops / Luxury Sneakers / Streetwear / Sale /
 *    Accessories / Gift Cards.
 *  - Refreshed Information column → kept existing policies + added
 *    Size Guide / Sneaker Care / Verification Process / FAQ.
 *  - Newsletter section heading updated to "Stay Ahead of Every Drop"
 *    with new copy and a success-animation on submit.
 *  - Micro-animations: hover lift on links, animated underline, arrow
 *    slide on CTA, opacity fade on social icons.
 *
 * Layout (top → bottom):
 *   1. Newsletter block (heading + subtext + email input + Subscribe button)
 *   2. Main grid (4 cols): Brand block · Shop · Information · Categories
 *   3. Payment Methods strip (12 monochrome icons in a wrap)
 *   4. Copyright bar (single line)
 */

const SHOP_LINKS = [
  { label: 'Sneakers', href: '/category-products' },
  { label: 'Luxury', href: '/categories' },
  { label: 'Brands', href: '/categories' },
  { label: 'New Arrivals', href: '/category-products' },
  { label: 'Coming Soon', href: '/category-products' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'Gift Cards', href: '/category-products' },
  { label: 'Wishlist', href: '/wishlist' },
];

const INFO_LINKS = [
  { label: 'Authenticity Guarantee', href: '/help-support' },
  { label: 'Return & Exchange Policy', href: '/return-refund-policy' },
  { label: 'Terms and Conditions', href: '/terms-conditions' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'FAQ', href: '/faqs' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Sneaker Care', href: '/help-support' },
  { label: 'Verification Process', href: '/help-support' },
];

const CATEGORY_LINKS = [
  { label: 'Collections', href: '/categories' },
  { label: 'New Arrivals', href: '/category-products' },
  { label: 'Best Sellers', href: '/category-products' },
  { label: 'Upcoming Drops', href: '/category-products' },
  { label: 'Luxury Sneakers', href: '/categories' },
  { label: 'Streetwear', href: '/categories' },
  { label: 'Sale', href: '/category-products' },
  { label: 'Accessories', href: '/category-products' },
  { label: 'Gift Cards', href: '/category-products' },
];

/* ── Payment method icons (monochrome Apple-style) ──
 * Each icon is an inline SVG that uses currentColor so it inherits the
 * footer's grey palette. Width/height tuned to ~28-32px so the strip
 * stays compact and premium.
 */

const PAYMENT_METHODS: Array<{ label: string; svg: React.ReactNode }> = [
  {
    label: 'BHIM UPI',
    svg: (
      <svg viewBox="0 0 48 24" width="44" height="22" aria-hidden="true">
        <text
          x="0"
          y="17"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="13"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="0.5"
        >
          BHIM
        </text>
        <text
          x="29"
          y="17"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="13"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="0.5"
        >
          UPI
        </text>
      </svg>
    ),
  },
  {
    label: 'Google Pay',
    svg: (
      <svg viewBox="0 0 60 24" width="58" height="22" aria-hidden="true">
        <text
          x="0"
          y="17"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="13"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="0.3"
        >
          G Pay
        </text>
      </svg>
    ),
  },
  {
    label: 'PhonePe',
    svg: (
      <svg viewBox="0 0 60 24" width="58" height="22" aria-hidden="true">
        <text
          x="0"
          y="17"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="13"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="-0.2"
        >
          PhonePe
        </text>
      </svg>
    ),
  },
  {
    label: 'Paytm',
    svg: (
      <svg viewBox="0 0 50 24" width="48" height="22" aria-hidden="true">
        <text
          x="0"
          y="17"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="14"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="-0.3"
        >
          Paytm
        </text>
      </svg>
    ),
  },
  {
    label: 'Visa',
    svg: (
      <svg viewBox="0 0 50 24" width="46" height="22" aria-hidden="true">
        <text
          x="0"
          y="18"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="16"
          fontWeight="900"
          fontStyle="italic"
          fill="currentColor"
          letterSpacing="0.5"
        >
          VISA
        </text>
      </svg>
    ),
  },
  {
    label: 'Mastercard',
    svg: (
      <svg viewBox="0 0 40 24" width="38" height="22" aria-hidden="true">
        <circle cx="15" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="25" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.4" />
      </svg>
    ),
  },
  {
    label: 'RuPay',
    svg: (
      <svg viewBox="0 0 56 24" width="54" height="22" aria-hidden="true">
        <text
          x="0"
          y="17"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="13"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="-0.2"
        >
          RuPay
        </text>
      </svg>
    ),
  },
  {
    label: 'American Express',
    svg: (
      <svg viewBox="0 0 50 24" width="48" height="22" aria-hidden="true">
        <text
          x="0"
          y="11"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="7"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="0.4"
        >
          AMERICAN
        </text>
        <text
          x="0"
          y="20"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="7"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="0.4"
        >
          EXPRESS
        </text>
      </svg>
    ),
  },
  {
    label: 'UPI',
    svg: (
      <svg viewBox="0 0 36 24" width="34" height="22" aria-hidden="true">
        <text
          x="0"
          y="17"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="13"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="0.5"
        >
          UPI
        </text>
      </svg>
    ),
  },
  {
    label: 'Debit Card',
    svg: (
      <svg viewBox="0 0 32 24" width="30" height="22" fill="none" aria-hidden="true">
        <rect x="1" y="3" width="30" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <rect x="1" y="7" width="30" height="3" fill="currentColor" />
        <rect x="5" y="14" width="10" height="2.5" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Credit Card',
    svg: (
      <svg viewBox="0 0 32 24" width="30" height="22" fill="none" aria-hidden="true">
        <rect x="1" y="3" width="30" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <rect x="1" y="7" width="30" height="3" fill="currentColor" />
        <rect x="5" y="14" width="10" height="2.5" rx="1" fill="currentColor" />
        <circle cx="24" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    label: 'Net Banking',
    svg: (
      <svg viewBox="0 0 32 24" width="30" height="22" fill="none" aria-hidden="true">
        <path d="M3 12 L16 4 L29 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="6" y="12" width="2.5" height="8" fill="currentColor" />
        <rect x="14.75" y="12" width="2.5" height="8" fill="currentColor" />
        <rect x="23.5" y="12" width="2.5" height="8" fill="currentColor" />
        <rect x="3" y="20" width="26" height="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Wallets',
    svg: (
      <svg viewBox="0 0 32 24" width="30" height="22" fill="none" aria-hidden="true">
        <rect x="1" y="5" width="30" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M1 9 H31" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="24" cy="14" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
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
      }, 3600);
    }
  };

  return (
    <footer
      style={{
        background: '#0a0a0a',
        color: '#ffffff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32, /* overlaps the section above so the rounded edge sits flush */
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px',
        }}
      >
        {/* ──────────────────────────────────────────────────────────
            1. Newsletter Block (top)
           ────────────────────────────────────────────────────────── */}
        <div
          className="footer-newsletter"
          style={{
            paddingTop: '112px',
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
              Stay Ahead of
              <br />
              <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#9ca3af' }}>
                Every Drop.
              </span>
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#9ca3af',
                fontWeight: 400,
                lineHeight: 1.6,
                margin: '20px 0 0 0',
                maxWidth: '440px',
              }}
            >
              Get exclusive early access, restock alerts, member-only releases and offers.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              position: 'relative',
              maxWidth: '520px',
              justifySelf: 'end',
              width: '100%',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={submitted ? '✓  You\'re on the list — welcome.' : 'Enter your email'}
              required
              aria-label="Email address"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: submitted
                  ? '1px solid rgba(34,197,94,0.6)'
                  : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '999px',
                paddingTop: '22px',
                paddingBottom: '22px',
                paddingLeft: '32px',
                paddingRight: '140px',
                fontSize: '15px',
                fontWeight: 600,
                outline: 'none',
                color: '#fff',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition:
                  'border-color 350ms ease, background-color 350ms ease, box-shadow 350ms ease',
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
                paddingLeft: '22px',
                paddingRight: '22px',
                height: '48px',
                background: '#fff',
                color: '#000',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                transition:
                  'transform 350ms cubic-bezier(0.16, 1, 0.3, 1), background-color 350ms ease',
              }}
            >
              {submitted ? (
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  className="footer-check"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <>
                  Subscribe
                  <svg
                    width={14}
                    height={14}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="footer-arrow"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ──────────────────────────────────────────────────────────
            2. Main grid: Brand · Shop · Information · Categories
           ────────────────────────────────────────────────────────── */}
        <div
          className="footer-grid"
          style={{
            paddingTop: '80px',
            paddingBottom: '64px',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1.2fr 1fr',
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
                  href: 'https://instagram.com/lnkicks',
                  svg: (
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.645 1.439-1.441s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  label: 'YouTube',
                  href: 'https://youtube.com/@lnkicks',
                  svg: (
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
                    </svg>
                  ),
                },
                {
                  label: 'X',
                  href: 'https://x.com/lnkicks',
                  svg: (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: 'TikTok',
                  href: 'https://tiktok.com/@lnkicks',
                  svg: (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
                    transition:
                      'color 300ms ease, border-color 300ms ease, transform 300ms ease, background-color 300ms ease',
                  }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Shop nav */}
          <FooterColumn title="Shop" links={SHOP_LINKS} />

          {/* Col 3 — Information / policies (extended) */}
          <FooterColumn title="Information" links={INFO_LINKS} />

          {/* Col 4 — Categories (refreshed) */}
          <FooterColumn title="Categories" links={CATEGORY_LINKS} />
        </div>

        {/* ──────────────────────────────────────────────────────────
            3. Payment Methods strip
           ────────────────────────────────────────────────────────── */}
        <div
          style={{
            paddingTop: '40px',
            paddingBottom: '40px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Payment Accepted
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              color: 'rgba(255,255,255,0.78)',
            }}
          >
            {PAYMENT_METHODS.map((m) => (
              <span
                key={m.label}
                aria-label={m.label}
                title={m.label}
                className="pay-icon"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '32px',
                  minWidth: '46px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  transition:
                    'color 250ms ease, border-color 250ms ease, background-color 250ms ease, transform 250ms ease',
                }}
              >
                {m.svg}
              </span>
            ))}
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            4. Copyright bar (single line — no phone number, no hours)
           ────────────────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '28px',
            paddingBottom: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            textAlign: 'center',
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
        </div>
      </div>

      <style jsx>{`
        /* Footer link hover: smooth underline slide + color shift */
        .footer-link {
          position: relative;
          display: inline-block;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -3px;
          height: 1px;
          width: 0;
          background: #ffffff;
          transition: width 280ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .footer-link:hover {
          color: #ffffff !important;
          transform: translateX(2px);
        }
        .footer-link:hover::after {
          width: 100%;
        }
        /* Social icon hover: subtle lift + brightening */
        .footer-social:hover {
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          background-color: rgba(255, 255, 255, 0.04) !important;
          transform: translateY(-2px);
        }
        /* Newsletter input focus */
        .footer-input::placeholder {
          color: #6b7280;
          font-weight: 500;
        }
        .footer-input:focus {
          border-color: rgba(255, 255, 255, 0.4) !important;
          background-color: rgba(255, 255, 255, 0.06) !important;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.04);
        }
        /* Submit hover — arrow slide */
        .footer-submit:hover {
          transform: translateY(-50%) scale(1.03) !important;
          background-color: #e5e7eb !important;
        }
        .footer-submit:hover .footer-arrow {
          transform: translateX(3px);
        }
        .footer-arrow {
          transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .footer-check {
          animation: footer-check-pop 480ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes footer-check-pop {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          60% {
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        /* Payment icon hover — brighten + lift */
        .pay-icon:hover {
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.32) !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
          transform: translateY(-2px);
        }
        /* Responsive — collapse grid to 2 cols on tablet, 1 col on mobile */
        @media (max-width: 1023px) {
          :global(.footer-grid) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 767px) {
          :global(.footer-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          :global(.footer-newsletter) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          :global(.footer-input) {
            padding-right: 120px !important;
          }
        }
      `}</style>
    </footer>
  );
}

/* ──────────────────────────────────────────────────────────
   FooterColumn — reusable 4-line nav column
   ────────────────────────────────────────────────────────── */

interface FooterColumnProps {
  title: string;
  links: Array<{ label: string; href: string }>;
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
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
        {title}
      </h4>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {links.map((link) => (
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
              width: 'fit-content',
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
