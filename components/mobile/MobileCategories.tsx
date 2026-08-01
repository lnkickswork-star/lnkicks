'use client';

import React from 'react';
import Link from 'next/link';
import { MOBILE_CATEGORIES } from './mobileProducts';

/**
 * MobileCategories — circular category rail.
 *
 * Horizontal scroller of circular category tiles. Each tile: floating
 * sneaker image inside a soft-grey circle, label below. Premium minimal.
 *
 * LN KICKS theme: white bg, soft grey circles, black labels.
 */
export default function MobileCategories() {
  return (
    <section style={{ paddingTop: 36 }}>
      <div style={{ padding: '0 18px', marginBottom: 18 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            margin: '0 0 8px 0',
          }}
        >
          Browse by
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 26,
            fontWeight: 800,
            color: '#0A0A0A',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Categories
        </h2>
      </div>

      <div
        className="mcat-scroller"
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: '4px 18px 12px',
        }}
      >
        {MOBILE_CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            style={{
              flex: '0 0 88px',
              maxWidth: 88,
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: '#f6f6f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
                transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="mcat-circle"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.label}
                loading="lazy"
                draggable={false}
                style={{
                  maxWidth: '78%',
                  maxHeight: '78%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.10))',
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#0A0A0A',
                letterSpacing: '0.02em',
                textAlign: 'center',
              }}
            >
              {c.label}
            </span>
          </Link>
        ))}
        <div aria-hidden style={{ flex: '0 0 18px', height: 1 }} />
      </div>

      <style jsx>{`
        .mcat-scroller::-webkit-scrollbar {
          display: none;
        }
        .mcat-circle:hover {
          transform: translateY(-3px) scale(1.03);
        }
      `}</style>
    </section>
  );
}
