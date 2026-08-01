'use client';

import React from 'react';
import { MOBILE_BRANDS } from './mobileProducts';

/**
 * MobileBrands — infinite horizontal marquee of brand wordmarks.
 *
 * Premium single-row marquee. CSS keyframe animation only (no JS).
 * Grayscale filter, hover reveals color. Smooth 38s linear infinite.
 *
 * LN KICKS theme: black wordmarks on white, soft grey dividers.
 */
export default function MobileBrands() {
  const track = [...MOBILE_BRANDS, ...MOBILE_BRANDS];

  return (
    <section
      style={{
        paddingTop: 40,
        paddingBottom: 36,
        background: '#ffffff',
        borderTop: '1px solid #fafafa',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '0 18px', textAlign: 'center', marginBottom: 24 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            margin: '0 0 8px 0',
          }}
        >
          Authenticated · Stocked · Trusted
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 30,
            fontWeight: 800,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            color: '#0A0A0A',
            lineHeight: 1,
          }}
        >
          Brands at <span style={{ fontStyle: 'italic', fontWeight: 300 }}>LN KICKS</span>
        </h2>
      </div>

      <div className="mb-marquee-wrap">
        <div className="mb-marquee-track">
          {track.map((b, idx) => (
            <div
              key={`mb-${idx}`}
              className={`mb-item ${b.className}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 28px',
                flexShrink: 0,
                color: '#0A0A0A',
                opacity: 0.85,
                transition: 'opacity 300ms ease',
              }}
            >
              {b.name}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .mb-marquee-wrap {
          width: 100%;
          overflow: hidden;
          position: relative;
          filter: grayscale(1);
          transition: filter 500ms ease;
        }
        .mb-marquee-wrap:hover {
          filter: grayscale(0);
        }
        .mb-marquee-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
          animation: lnk-mb-marquee 38s linear infinite;
        }
        .mb-marquee-wrap:hover .mb-marquee-track {
          animation-play-state: paused;
        }
        .mb-item:hover {
          opacity: 1 !important;
        }
        @keyframes lnk-mb-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .mb-nike { font-size: 30px; font-weight: 900; letter-spacing: -0.02em; font-style: italic; }
        .mb-jordan { font-size: 26px; font-weight: 900; letter-spacing: -0.02em; }
        .mb-adidas { font-size: 28px; font-weight: 700; letter-spacing: 0.08em; }
        .mb-puma { font-size: 30px; font-weight: 900; font-style: italic; letter-spacing: -0.02em; }
        .mb-reebok { font-size: 26px; font-weight: 700; letter-spacing: 0.04em; }
        .mb-converse { font-size: 26px; font-weight: 700; letter-spacing: 0.14em; }
        .mb-vans { font-size: 32px; font-weight: 900; letter-spacing: 0.02em; }
        .mb-hoka { font-size: 32px; font-weight: 800; letter-spacing: 0.06em; }
        .mb-newbalance { font-size: 22px; font-weight: 700; letter-spacing: 0.06em; }
        .mb-asics { font-size: 26px; font-weight: 700; letter-spacing: 0.16em; }
        .mb-yeezy { font-size: 32px; font-weight: 300; letter-spacing: 0.04em; font-style: italic; }
      `}</style>
    </section>
  );
}
