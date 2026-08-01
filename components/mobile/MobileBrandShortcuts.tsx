'use client';

import React from 'react';
import Link from 'next/link';

/**
 * MobileBrandShortcuts — horizontal scrolling circular brand chips.
 *
 * 10 premium brands: Nike, Jordan, Adidas, Puma, New Balance, ASICS,
 * Converse, Vans, Reebok, HOKA. Pure monochrome text-based logos on
 * soft-grey circular chips. Active chip = solid black bg + white text.
 *
 * LN KICKS theme: white bg, soft grey circles, black text, no colorful
 * logos. Premium minimal.
 *
 * Reference: Screenshot 650 — brand chips row, but in B&W instead of blue.
 */

const BRANDS = [
  { id: 'nike', label: 'Nike', href: '/products?brand=nike' },
  { id: 'jordan', label: 'Jordan', href: '/products?brand=jordan' },
  { id: 'adidas', label: 'Adidas', href: '/products?brand=adidas' },
  { id: 'puma', label: 'Puma', href: '/products?brand=puma' },
  { id: 'newbalance', label: 'New Balance', href: '/products?brand=new-balance' },
  { id: 'asics', label: 'ASICS', href: '/products?brand=asics' },
  { id: 'converse', label: 'Converse', href: '/products?brand=converse' },
  { id: 'vans', label: 'Vans', href: '/products?brand=vans' },
  { id: 'reebok', label: 'Reebok', href: '/products?brand=reebok' },
  { id: 'hoka', label: 'HOKA', href: '/products?brand=hoka' },
];

export default function MobileBrandShortcuts() {
  return (
    <section
      aria-label="Brand shortcuts"
      style={{
        paddingTop: 14,
        paddingBottom: 4,
      }}
    >
      <div
        className="mbs-scroller"
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: '0 14px',
        }}
      >
        {BRANDS.map((b, i) => {
          const isActive = i === 0; // Nike as default-active for visual interest
          return (
            <Link
              key={b.id}
              href={b.href}
              style={{
                flex: '0 0 auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px 8px 8px',
                borderRadius: 999,
                background: isActive ? '#0A0A0A' : '#f6f6f6',
                color: isActive ? '#ffffff' : '#0A0A0A',
                textDecoration: 'none',
                transition:
                  'background-color 280ms cubic-bezier(0.16, 1, 0.3, 1), color 280ms ease, transform 280ms ease',
                border: isActive ? '1px solid #0A0A0A' : '1px solid transparent',
              }}
              className="mbs-chip"
            >
              {/* Brand monogram circle */}
              <span
                aria-hidden
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: isActive ? 'rgba(255,255,255,0.15)' : '#ffffff',
                  color: isActive ? '#ffffff' : '#0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 800,
                  fontFamily: 'var(--font-oswald), sans-serif',
                  letterSpacing: '0.04em',
                  border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid #ececec',
                }}
              >
                {b.label.charAt(0)}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                {b.label}
              </span>
            </Link>
          );
        })}
        <div aria-hidden style={{ flex: '0 0 4px', height: 1 }} />
      </div>

      <style jsx>{`
        .mbs-scroller::-webkit-scrollbar {
          display: none;
        }
        .mbs-chip:active {
          transform: scale(0.96);
        }
      `}</style>
    </section>
  );
}
