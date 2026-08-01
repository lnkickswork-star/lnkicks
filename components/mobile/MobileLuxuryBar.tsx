'use client';

import React, { useState, useEffect } from 'react';

/**
 * MobileLuxuryBar — slim premium announcement bar at the very top.
 *
 * Sits above MobileHeader. Matte black background, white text, slowly
 * rotating luxury status messages (authenticated / shipping / returns /
 * drops). Tiny height (28px) so it doesn't eat into the header.
 *
 * LN KICKS theme: pure black bar, white text, soft fade between messages.
 */
const MESSAGES = [
  'AUTHENTICATED BY CHECKCHECK & LEGITAPP',
  'FREE EXPRESS SHIPPING OVER ₹5,000',
  '7-DAY EASY RETURNS · 100% MONEY-BACK',
  'NEW DROPS EVERY FRIDAY · MEMBERS ONLY',
  'STOCKED IN INDIA · DISPATCHED IN 24H',
];

export default function MobileLuxuryBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: '#0A0A0A',
        color: '#ffffff',
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 101,
      }}
    >
      <div
        key={idx}
        className="mlb-text"
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.92)',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#ffffff',
            display: 'inline-block',
          }}
        />
        {MESSAGES[idx]}
      </div>

      <style jsx>{`
        .mlb-text {
          animation: mlb-fade 600ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes mlb-fade {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
