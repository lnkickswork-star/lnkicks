'use client';

import React, { useState } from 'react';

/**
 * StreetwearIndia — centered pill-button selector for homegrown Indian brands.
 * Stitch design specs:
 *  - section: py-24 bg #fafafa
 *  - eyebrow: 10px gray-400 "Home Grown"
 *  - headline: text-7xl font-black "Streetwear in India"
 *  - pills: black active / white inactive w/ gray-100 border, rounded-2xl
 */

const BRANDS = ['Ayunk', 'SULLITT', 'Ctrl+P', 'LUMIÈRES', 'Sugga', 'GOD OF EMOTIONS'];

export default function StreetwearIndia() {
  const [active, setActive] = useState(0);

  return (
    <section style={{ paddingTop: '96px', paddingBottom: '96px', background: '#fafafa' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 900,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            marginBottom: '16px',
            margin: '0 0 16px 0',
          }}
        >
          Home Grown
        </p>
        <h2
          style={{
            fontSize: '72px',
            fontWeight: 900,
            marginBottom: '64px',
            textTransform: 'uppercase',
            letterSpacing: '-0.05em',
            margin: '0 0 64px 0',
            lineHeight: 1,
          }}
        >
          Streetwear in India
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
          {BRANDS.map((brand, idx) => (
            <button
              key={brand}
              onClick={() => setActive(idx)}
              className="streetwear-pill"
              style={{
                background: idx === active ? '#000' : '#fff',
                color: idx === active ? '#fff' : '#000',
                border: '1px solid #f3f4f6',
                paddingLeft: '48px',
                paddingRight: '48px',
                paddingTop: '16px',
                paddingBottom: '16px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'background-color 250ms ease, color 250ms ease',
              }}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .streetwear-pill:hover {
          background-color: ${''} !important;
        }
        .streetwear-pill:not([style*='background-color: #000']):hover {
          background-color: #f9fafb !important;
        }
      `}</style>
    </section>
  );
}
