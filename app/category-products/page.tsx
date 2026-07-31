'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_CATALOG } from '@/components/catalog/ProductCatalogRegistry';

export default function CategoryProductsPage() {
  return (
    <ResponsiveAppLayout title="CATALOG">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/categories" style={{ color: '#777777', textDecoration: 'none' }}>Categories</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>All Products</span>
      </div>

      {/* HEADER & FILTER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: 0 }}>Sneakers &amp; Apparel Catalog</h1>
          <p style={{ fontSize: '13px', color: '#777777', margin: '4px 0 0' }}>Showing {PRODUCT_CATALOG.length} authentic products</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/filters" style={{ padding: '10px 20px', background: '#F0F0F2', color: '#111111', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            <span>Filter</span>
          </Link>
          <select style={{ padding: '10px 16px', background: '#ffffff', border: '1px solid #E0E0E0', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#111111', outline: 'none', cursor: 'pointer' }}>
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Drops</option>
          </select>
        </div>
      </div>

      {/* ADAPTIVE PRODUCT GRID (4-col Desktop / 2-col Mobile) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {PRODUCT_CATALOG.map((p) => (
          <ProductCard key={p.id} id={p.id} name={p.name} brand={p.brand} price={p.price} origPrice={p.origPrice} badge={p.badge} image={p.image} />
        ))}
      </div>
    </ResponsiveAppLayout>
  );
}
