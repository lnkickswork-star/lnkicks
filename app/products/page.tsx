'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

export default function ProductsPage() {
  return (
    <ResponsiveAppLayout title="ALL PRODUCTS">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>All Products</span>
      </div>

      {/* COLLECTION BANNER */}
      <div style={{ background: '#111111', borderRadius: '24px', padding: '36px 32px', color: '#ffffff', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FF3B30', marginBottom: '6px' }}>LNKICKS COLLECTION</div>
          <h1 style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Authentic Luxury Footwear</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', marginBottom: 0 }}>Showing {PRODUCT_REGISTRY.length} authentic products</p>
        </div>
      </div>

      {/* TOOLBAR: FILTER DRAWER & SORT DROPDOWN SHELL */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ padding: '10px 20px', background: '#F0F0F2', color: '#111111', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            <span>Filter (Brand, Size, Color)</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#777777', fontWeight: 500 }}>Sort by:</span>
          <select style={{ padding: '10px 16px', background: '#ffffff', border: '1px solid #E0E0E0', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#111111', outline: 'none', cursor: 'pointer' }}>
            <option>Featured</option>
            <option>Newest</option>
            <option>Price: Low → High</option>
            <option>Price: High → Low</option>
            <option>Best Selling</option>
          </select>
        </div>
      </div>

      {/* ADAPTIVE PRODUCT GRID (4-col Desktop / 2-col Mobile) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {PRODUCT_REGISTRY.map((p) => (
          <ProductCard key={p.id} id={p.id} name={p.name} brand={p.brand} price={p.price} origPrice={p.comparePrice} badge={p.newArrival ? 'NEW' : p.limitedEdition ? 'LIMITED' : p.bestSeller ? 'HOT' : undefined} image={p.primaryImage} slug={p.slug} />
        ))}
      </div>

      {/* PAGINATION UI SHELL */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #E0E0E0', background: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Prev</button>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#111111', color: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>1</button>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #E0E0E0', background: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>2</button>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #E0E0E0', background: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Next</button>
      </div>
    </ResponsiveAppLayout>
  );
}
