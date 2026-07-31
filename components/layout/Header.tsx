'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';

export const Header: React.FC = () => {
  const { cart } = useApp();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid #EBEBEB', padding: '0 80px', height: '72px', display: 'grid', gridTemplateColumns: '200px 1fr 200px', alignItems: 'center' }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: '26px', fontWeight: 700, color: '#0A0A0A' }}>LNKICKS</div>
        <div style={{ fontSize: '8.5px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A8A8A' }}>STOCK &amp; LOADED</div>
      </Link>

      <ul style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', listStyle: 'none', margin: 0, padding: 0 }}>
        <li><Link href="/category-products" style={{ textDecoration: 'none', color: '#4A4A4A', fontSize: '13px', fontWeight: 500 }}>Sneakers</Link></li>
        <li><Link href="/categories" style={{ textDecoration: 'none', color: '#4A4A4A', fontSize: '13px', fontWeight: 500 }}>Luxury Footwear</Link></li>
        <li><Link href="/category-products" style={{ textDecoration: 'none', color: '#4A4A4A', fontSize: '13px', fontWeight: 500 }}>Bags</Link></li>
        <li><Link href="/category-products" style={{ textDecoration: 'none', color: '#4A4A4A', fontSize: '13px', fontWeight: 500 }}>Clothing</Link></li>
        <li><Link href="/track-order" style={{ textDecoration: 'none', color: '#8A8A8A', fontSize: '13px', fontWeight: 500 }}>Track Order</Link></li>
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
        <Link href="/search" style={{ color: '#4A4A4A' }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></Link>
        <Link href="/admin-login" style={{ color: '#4A4A4A' }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></Link>
        <Link href="/cart" style={{ color: '#4A4A4A', position: 'relative' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          {totalItems > 0 && (
            <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#0A0A0A', color: '#fff', borderRadius: '50%', width: '15px', height: '15px', fontSize: '8.5px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};
