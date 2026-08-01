'use client';

import React from 'react';

/**
 * AnnouncementBar — topmost black bar with rotating shipping messaging.
 * Stitch design: bg #121212, white text, 10px tracking-widest uppercase.
 */
export default function AnnouncementBar() {
  return (
    <div
      style={{
        background: '#121212',
        color: '#ffffff',
        paddingTop: '10px',
        paddingBottom: '10px',
        textAlign: 'center',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}
    >
      FREE SHIPPING <span style={{ fontWeight: 400, opacity: 0.7 }}>ON ALL PREPAID ORDERS</span>
    </div>
  );
}
