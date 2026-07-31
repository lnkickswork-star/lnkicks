'use client';

import React from 'react';
import Link from 'next/link';

export const MobileFooter: React.FC = () => {
  return (
    <nav style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '408px', height: '68px', background: '#111111', borderRadius: '36px', border: '1px solid rgba(255,255,255,0.14)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center', zIndex: 1000, boxShadow: '0 16px 40px rgba(0,0,0,0.38)', padding: '0 8px', boxSizing: 'border-box' }}>
      <Link href="/mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none' }}>
        <div style={{ background: '#ffffff', padding: '8px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#111111' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111111" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#111111' }}>Home</span>
        </div>
      </Link>
      <Link href="/categories" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '10.5px', fontWeight: 600, textDecoration: 'none' }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span>Explore</span>
      </Link>
      <Link href="/wishlist" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '10.5px', fontWeight: 600, textDecoration: 'none' }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <span>Wishlist</span>
      </Link>
      <Link href="/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '10.5px', fontWeight: 600, textDecoration: 'none' }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Profile</span>
      </Link>
    </nav>
  );
};
