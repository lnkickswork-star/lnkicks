'use client';

import React from 'react';
import Link from 'next/link';
import { MOBILE_FEATURED } from './mobileProducts';

/**
 * MobileFeaturedCollection — editorial 3-card horizontal collection.
 *
 * Each card is a tall premium tile with a floating sneaker on a soft
 * black or off-white background. Big editorial typography.
 *
 * LN KICKS theme: alternating black / white cards, gold accent dot.
 */
const CARD_THEMES: { bg: string; fg: string; sub: string; accent: string }[] = [
  { bg: '#0A0A0A', fg: '#ffffff', sub: 'rgba(255,255,255,0.65)', accent: '#ffffff' },
  { bg: '#ffffff', fg: '#0A0A0A', sub: '#6b7280', accent: '#0A0A0A' },
  { bg: '#f6f6f6', fg: '#0A0A0A', sub: '#6b7280', accent: '#0A0A0A' },
];

export default function MobileFeaturedCollection() {
  return (
    <section style={{ paddingTop: 36 }}>
      <div
        style={{
          padding: '0 18px',
          marginBottom: 18,
        }}
      >
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
          Curated Edit
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
          Featured Collection
        </h2>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: '4px 18px 12px',
        }}
        className="mfc-scroller"
      >
        {MOBILE_FEATURED.map((p, i) => {
          const theme = CARD_THEMES[i % CARD_THEMES.length];
          return (
            <Link
              key={p.id}
              href={p.href}
              style={{
                flex: '0 0 240px',
                maxWidth: 240,
                scrollSnapAlign: 'start',
                background: theme.bg,
                color: theme.fg,
                borderRadius: 24,
                padding: '20px 18px',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textDecoration: 'none',
                border: theme.bg === '#ffffff' ? '1px solid #f0f0f0' : 'none',
              }}
            >
              {/* Index number watermark */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 16,
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: 56,
                  fontWeight: 900,
                  color: theme.bg === '#0A0A0A' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                0{i + 1}
              </div>

              {/* Brand label */}
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: theme.sub,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  margin: 0,
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {p.brand}
              </p>

              {/* Floating sneaker */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '8px 0',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  draggable={false}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 130,
                    objectFit: 'contain',
                    filter:
                      theme.bg === '#0A0A0A'
                        ? 'drop-shadow(0 18px 24px rgba(0,0,0,0.5))'
                        : 'drop-shadow(0 16px 22px rgba(0,0,0,0.13))',
                    transform: 'rotate(-12deg)',
                  }}
                />
              </div>

              {/* Price + CTA arrow */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 10, color: theme.sub, fontWeight: 500, marginBottom: 2 }}>
                    From
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-oswald), sans-serif',
                      fontSize: 18,
                      fontWeight: 800,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {p.price}
                  </div>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: theme.accent,
                    color: theme.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
        <div aria-hidden style={{ flex: '0 0 18px', height: 1 }} />
      </div>

      <style jsx>{`
        .mfc-scroller::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
