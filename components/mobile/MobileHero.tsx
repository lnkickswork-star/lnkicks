'use client';

import React from 'react';
import Link from 'next/link';

/**
 * MobileHero — premium editorial hero banner.
 *
 * Full-width black card with floating sneaker PNG, large headline,
 * sub-text, and a black "Shop Now" pill CTA. Premium drop-shadow.
 *
 * LN KICKS theme: black hero card on white page, white text, accent gold dot.
 *
 * NOTE: Uses external CDN image URL because local /public/*.png are LFS pointers.
 */
export default function MobileHero() {
  return (
    <section
      style={{
        position: 'relative',
        borderRadius: 28,
        overflow: 'hidden',
        background: '#0A0A0A',
        padding: '28px 24px 28px',
        color: '#ffffff',
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
      }}
    >
      {/* Background watermark wordmark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          fontFamily: 'var(--font-oswald), sans-serif',
          fontSize: 140,
          fontWeight: 900,
          color: 'rgba(255,255,255,0.04)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        LK
      </div>

      {/* Top: eyebrow + headline */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 220 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            margin: '0 0 14px 0',
          }}
        >
          Stocked & Loaded
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 38,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Premium<br />Sneakers
        </h2>
      </div>

      {/* Middle: floating sneaker */}
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
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw"
          alt="Air Jordan 1 Low Powder Blue"
          width={240}
          height={240}
          style={{
            width: 240,
            height: 'auto',
            maxWidth: '80%',
            filter: 'drop-shadow(0 24px 32px rgba(0,0,0,0.45))',
            transform: 'rotate(-18deg)',
          }}
        />
      </div>

      {/* Bottom: CTA row */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
              margin: '0 0 4px 0',
            }}
          >
            From
          </div>
          <div
            style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '-0.01em',
            }}
          >
            Rs. 6,199
          </div>
        </div>
        <Link
          href="/products"
          style={{
            background: '#ffffff',
            color: '#0A0A0A',
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '14px 24px',
            borderRadius: 999,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          Shop Now
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
