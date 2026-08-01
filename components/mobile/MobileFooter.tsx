'use client';

import React from 'react';
import Link from 'next/link';

/**
 * MobileFooter — premium minimal footer.
 *
 * Compact dark-on-white footer with LNKICKS wordmark, short tagline,
 * link columns (Shop / Help / Company), and social icons.
 *
 * LN KICKS theme: white bg, black text, soft grey dividers.
 */

const SHOP_LINKS = [
  { label: 'All Sneakers', href: '/products' },
  { label: 'Trending', href: '/products?filter=trending' },
  { label: 'Luxury', href: '/category/luxury' },
  { label: 'New Arrivals', href: '/products?filter=new' },
];

const HELP_LINKS = [
  { label: 'Track Order', href: '/track-order' },
  { label: 'Shipping', href: '/shipping-policy' },
  { label: 'Returns', href: '/return-refund-policy' },
  { label: 'Size Guide', href: '/size-guide' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact-us' },
  { label: 'Terms', href: '/terms-conditions' },
  { label: 'Privacy', href: '/privacy-policy' },
];

export default function MobileFooter() {
  return (
    <footer
      style={{
        background: '#ffffff',
        borderTop: '1px solid #f0f0f0',
        padding: '40px 18px 120px',
      }}
    >
      {/* Wordmark + tagline */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#0A0A0A',
            marginBottom: 8,
          }}
        >
          LNKICKS
        </div>
        <p
          style={{
            fontSize: 12,
            color: '#6b7280',
            margin: 0,
            lineHeight: 1.5,
            maxWidth: 280,
          }}
        >
          India&apos;s premium destination for authenticated luxury sneakers.
          Verified by CheckCheck & LegitApp. 100% money-back guarantee.
        </p>
      </div>

      {/* Link columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginBottom: 32,
        }}
      >
        <FooterColumn title="Shop" links={SHOP_LINKS} />
        <FooterColumn title="Help" links={HELP_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
      </div>

      {/* Social row */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Instagram', href: '#', icon: InstagramIcon },
          { label: 'X', href: '#', icon: XIcon },
          { label: 'YouTube', href: '#', icon: YoutubeIcon },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '1px solid #e5e5e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0A0A0A',
              textDecoration: 'none',
              transition: 'background-color 280ms ease, color 280ms ease',
            }}
            className="mfooter-social"
          >
            <s.icon />
          </a>
        ))}
      </div>

      {/* Bottom legal */}
      <div
        style={{
          paddingTop: 20,
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
          &copy; {new Date().getFullYear()} LN KICKS
        </p>
        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Made in India</p>
      </div>

      <style jsx>{`
        .mfooter-social:hover {
          background-color: #0a0a0a !important;
          color: #ffffff !important;
          border-color: #0a0a0a !important;
        }
      `}</style>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: '#0A0A0A',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          margin: '0 0 14px 0',
        }}
      >
        {title}
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              style={{
                fontSize: 12.5,
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 220ms ease',
              }}
              className="mfooter-link"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .mfooter-link:hover {
          color: #0a0a0a !important;
        }
      `}</style>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}
