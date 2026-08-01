'use client';

import React from 'react';

/**
 * AnnouncementBar — topmost black bar with rotating shipping messaging.
 *
 * Refinements (Phase 1.5):
 *  - Premium stacked messages (no JS rotation — pure CSS marquee)
 *  - Hairline top border for editorial refinement
 *  - Diamond separators between messages
 */
export default function AnnouncementBar() {
  const messages = [
    'Free Shipping on All Prepaid Orders',
    'Cash on Delivery Available',
    'Verified Authenticity · 100% Money Back Guarantee',
    'Trusted by 80,000+ Customers',
  ];
  const track = [...messages, ...messages];

  return (
    <div
      style={{
        background: '#0a0a0a',
        color: '#ffffff',
        paddingTop: '11px',
        paddingBottom: '11px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div className="announcement-track">
        {track.map((msg, idx) => (
          <span
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0 32px',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              color: '#ffffff',
            }}
          >
            <span style={{ fontWeight: 400, opacity: 0.55, marginRight: '12px' }}>◇</span>
            {msg}
          </span>
        ))}
      </div>

      <style jsx>{`
        .announcement-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: lnk-announcement 40s linear infinite;
          will-change: transform;
        }
        @keyframes lnk-announcement {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
