'use client';

import React from 'react';
import Link from 'next/link';

/**
 * MainFooter — dark #0a0a0a footer with 4-column grid + about paragraph.
 * Stitch design specs:
 *  - section: bg #0a0a0a, pt-32 pb-16
 *  - grid: 4 cols, gap-16, mb-32
 *    col 1: brand nav (white active link + gray-400 links)
 *    col 2: policy links
 *    col 3: categories (with "Categories" h4 heading)
 *    col 4: social icons (IG + YT) + mini newsletter
 *  - about: border-t white/10, pt-20, max-w-6xl, centered uppercase 11px bold
 *  - copyright: 9px uppercase tracking-[0.4em] gray-600
 */

const SHOP_LINKS = [
  { label: 'Sneakers', href: '/category-products' },
  { label: 'Luxury Footwear', href: '/categories' },
  { label: 'Bags', href: '/category-products' },
  { label: 'Beauty', href: '/category-products' },
  { label: 'Clothing', href: '/category-products' },
  { label: 'Hype & Care', href: '/category-products' },
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
  { label: 'Care Package', href: '/category-products' },
  { label: 'Blogs', href: '/category-products' },
];

const ABOUT_TEXT =
  "Kicks Machine is India's destination for authentic sneakers, luxury bags, and streetwear. We stock 50+ authenticated brands including Nike, Air Jordan, Adidas, Yeezy, New Balance, On Running, Hoka, ASICS, Salomon, Converse, Gucci, Balenciaga, Dior, Louis Vuitton, Off-White, Alexander McQueen, Supreme, Essentials (Fear of God), Travis Scott, Trapstar, Palm Angels, Coach, Michael Kors, Prada, Marc Jacobs, Jacquemus, Loewe, Rhode, Glossier, Whoop, and Ray-Ban Meta. Every pair is verified through a 6 step in house check plus CheckCheck and LegitApp with a 100% money back guarantee. Free shipping on all prepaid orders across India, with Cash on Delivery available. Founded in 2021, bootstrapped, and trusted by 80,000+ customers. Flagship store on Rajpur Road, Dehradun, and online everywhere in India.";

export default function MainFooter() {
  return (
    <footer style={{ background: '#0a0a0a', color: '#ffffff', paddingTop: '128px', paddingBottom: '64px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* 4-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '64px',
            marginBottom: '128px',
          }}
        >
          {/* Col 1 — Shop nav */}
          <div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {SHOP_LINKS.map((link, idx) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  style={{
                    color: idx === 0 ? '#ffffff' : '#9ca3af',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    transition: 'color 250ms ease',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 2 — Policy links */}
          <div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {POLICY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  style={{
                    color: '#9ca3af',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    transition: 'color 250ms ease',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Categories */}
          <div>
            <h4
              style={{
                fontSize: '20px',
                fontWeight: 900,
                marginBottom: '40px',
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                margin: '0 0 40px 0',
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
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textDecoration: 'none',
                    transition: 'color 250ms ease',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4 — Social + mini newsletter */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '48px' }}>
              <a
                href="#"
                aria-label="Instagram"
                className="footer-social"
                style={{ color: '#fff', display: 'inline-flex', transition: 'color 250ms ease' }}
              >
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.645 1.439-1.441s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="footer-social"
                style={{ color: '#fff', display: 'inline-flex', transition: 'color 250ms ease' }}
              >
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
                </svg>
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '999px',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                  paddingLeft: '32px',
                  paddingRight: '56px',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                  color: '#fff',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="footer-newsletter-btn"
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
                  transition: 'background-color 250ms ease',
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* About paragraph + copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '80px' }}>
          <div style={{ maxWidth: '1152px', margin: '0 auto', textAlign: 'center' }}>
            <p
              style={{
                fontSize: '11px',
                color: '#6b7280',
                lineHeight: 1.8,
                fontWeight: 700,
                marginBottom: '64px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 64px 0',
              }}
            >
              <strong style={{ color: '#d1d5db' }}>
                Kicks Machine is India&apos;s destination for authentic sneakers, luxury bags, and streetwear.
              </strong>{' '}
              {ABOUT_TEXT.split('Kicks Machine is India\'s destination for authentic sneakers, luxury bags, and streetwear.')[1] || ABOUT_TEXT}
            </p>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#4b5563', fontWeight: 900 }}>
              © 2024 KICKS MACHINE. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-link:hover {
          color: #ffffff !important;
        }
        .footer-social:hover {
          color: #9ca3af !important;
        }
        .footer-newsletter-btn:hover {
          background-color: #e5e7eb !important;
        }
      `}</style>
    </footer>
  );
}
