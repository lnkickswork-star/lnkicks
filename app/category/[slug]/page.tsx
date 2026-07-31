'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

export default function CategorySlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const categoryName = slug ? slug.toUpperCase().replace('-', ' ') : 'CATEGORY';

  return (
    <ResponsiveAppLayout title={categoryName}>
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/categories" style={{ color: '#777777', textDecoration: 'none' }}>Categories</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>{categoryName}</span>
      </div>

      {/* CATEGORY TITLE & SUMMARY */}
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #EBEBEB', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: 0 }}>{categoryName}</h1>
        <p style={{ fontSize: '13px', color: '#777777', marginTop: '6px', marginBottom: 0 }}>Showing authentic luxury items in {categoryName}.</p>
      </div>

      {/* ADAPTIVE PRODUCT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {PRODUCT_REGISTRY.map((p) => (
          <ProductCard key={p.id} id={p.id} name={p.name} brand={p.brand} price={p.price} origPrice={p.comparePrice} badge={p.newArrival ? 'NEW' : p.limitedEdition ? 'LIMITED' : p.bestSeller ? 'HOT' : undefined} image={p.primaryImage} />
        ))}
      </div>
    </ResponsiveAppLayout>
  );
}
