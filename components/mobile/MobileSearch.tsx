'use client';

import React from 'react';
import Link from 'next/link';

/**
 * MobileSearch — premium search bar.
 *
 * White pill with soft shadow. Magnifying glass icon + placeholder text.
 * Filter icon button on the right. Tappable, links to /search.
 *
 * LN KICKS theme: white pill, black icons, soft grey placeholder.
 */
export default function MobileSearch() {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 999,
        height: 52,
        padding: '0 6px 0 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        border: '1px solid #f3f3f3',
      }}
    >
      <Link
        href="/search"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flex: 1,
          textDecoration: 'none',
          color: '#9ca3af',
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 13.5, fontWeight: 500 }}>Search sneakers, brands, collections...</span>
      </Link>
      <Link
        href="/filters"
        aria-label="Filters"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          textDecoration: 'none',
          border: 'none',
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <line x1="4" y1="21" x2="4" y2="14" strokeLinecap="round" />
          <line x1="4" y1="10" x2="4" y2="3" strokeLinecap="round" />
          <line x1="12" y1="21" x2="12" y2="12" strokeLinecap="round" />
          <line x1="12" y1="8" x2="12" y2="3" strokeLinecap="round" />
          <line x1="20" y1="21" x2="20" y2="16" strokeLinecap="round" />
          <line x1="20" y1="12" x2="20" y2="3" strokeLinecap="round" />
          <line x1="1" y1="14" x2="7" y2="14" strokeLinecap="round" />
          <line x1="9" y1="8" x2="15" y2="8" strokeLinecap="round" />
          <line x1="17" y1="16" x2="23" y2="16" strokeLinecap="round" />
        </svg>
      </Link>
    </div>
  );
}
