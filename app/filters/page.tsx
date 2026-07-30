'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function FiltersPage() {
  const [brand, setBrand] = useState('Nike');
  const [size, setSize] = useState('UK 8');
  const [price, setPrice] = useState(15000);

  return (
    <ResponsiveAppLayout title="FILTERS">
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #EBEBEB', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', marginBottom: '24px' }}>Filter Catalog</h1>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#111111', display: 'block', marginBottom: '10px' }}>BRAND</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok'].map((b) => (
              <button key={b} onClick={() => setBrand(b)} style={{ padding: '10px 18px', borderRadius: '14px', border: brand === b ? '2px solid #111111' : '1px solid #E0E0E0', background: brand === b ? '#111111' : '#ffffff', color: brand === b ? '#ffffff' : '#111111', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                {b}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#111111', display: 'block', marginBottom: '10px' }}>SIZE (UK)</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'].map((s) => (
              <button key={s} onClick={() => setSize(s)} style={{ padding: '10px 18px', borderRadius: '14px', border: size === s ? '2px solid #111111' : '1px solid #E0E0E0', background: size === s ? '#111111' : '#ffffff', color: size === s ? '#ffffff' : '#111111', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#111111', display: 'block', marginBottom: '10px' }}>MAX PRICE: ₹{price.toLocaleString('en-IN')}</label>
          <input type="range" min="3000" max="30000" step="1000" value={price} onChange={(e) => setPrice(Number(e.target.value))} style={{ width: '100%', accentColor: '#111111' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href={`/search?q=${brand}`} style={{ flex: 1, padding: '16px', background: '#111111', color: '#ffffff', borderRadius: '30px', textAlign: 'center', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
            APPLY FILTERS
          </Link>
        </div>
      </div>
    </ResponsiveAppLayout>
  );
}
