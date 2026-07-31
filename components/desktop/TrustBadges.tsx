'use client';

import React from 'react';

/**
 * TrustBadges — 4-column grid with icon + headline + label.
 * Stitch design specs:
 *  - section: py-16, border-y gray-100
 *  - grid: 4 cols, gap-12
 *  - icon: 48x48 gray-50 rounded-xl
 *  - headline: 2xl font-black
 *  - label: 9px gray-400 uppercase tracking-widest
 */

interface Badge {
  icon: React.ReactNode;
  headline: string;
  label: string;
}

const BADGES: Badge[] = [
  {
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.31.17-.69.17-1 0l-7.97-4.44c-.31-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.97-4.44c.31-.17.69-.17 1 0l7.97 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5L12 10.85l5.96-3.35L12 4.15z" />
      </svg>
    ),
    headline: '50000+',
    label: 'Unique SKUs',
  },
  {
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
    headline: 'Verified',
    label: 'Authenticity Guaranteed',
  },
  {
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    headline: '100,000+',
    label: 'Customers Served',
  },
  {
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
      </svg>
    ),
    headline: 'Shop',
    label: 'In-Store Experience',
  },
];

export default function TrustBadges() {
  return (
    <section
      style={{
        paddingTop: '64px',
        paddingBottom: '64px',
        borderTop: '1px solid #f3f4f6',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '48px',
        }}
      >
        {BADGES.map((badge, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: '#f9fafb',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                flexShrink: 0,
              }}
            >
              {badge.icon}
            </div>
            <div>
              <p
                style={{
                  fontWeight: 900,
                  fontSize: '24px',
                  lineHeight: 1,
                  margin: 0,
                  ...(badge.headline === 'Verified' || badge.headline === 'Shop'
                    ? { fontStyle: 'italic', textTransform: 'uppercase' }
                    : {}),
                }}
              >
                {badge.headline}
              </p>
              <p
                style={{
                  fontSize: '9px',
                  color: '#9ca3af',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginTop: '4px',
                  margin: '4px 0 0 0',
                }}
              >
                {badge.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
