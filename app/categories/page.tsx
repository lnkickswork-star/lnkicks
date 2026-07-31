import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { CATEGORY_REGISTRY } from '@/components/category/CategoryRegistry';

export default function CategoriesPage() {
  return (
    <ResponsiveAppLayout title="CATEGORIES">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>Categories</span>
      </div>

      {/* HERO BANNER */}
      <div style={{ background: '#111111', borderRadius: '24px', padding: '36px 32px', color: '#ffffff', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FF3B30', marginBottom: '8px' }}>EXPLORE CATALOG</div>
        <h1 style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '36px', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>Sneaker &amp; Apparel Categories</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', maxWidth: '480px', marginTop: '12px', marginBottom: 0 }}>Browse our curated collection by brand, performance, or lifestyle style.</p>
      </div>

      {/* CATEGORIES ADAPTIVE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {CATEGORY_REGISTRY.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #EBEBEB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '210px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', transition: 'transform 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#777777', background: '#F6F6F6', padding: '4px 10px', borderRadius: '12px' }}>{cat.productCount} Items</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: '0 0 6px' }}>{cat.name}</h3>
                <p style={{ fontSize: '12px', color: '#777777', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{cat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ResponsiveAppLayout>
  );
}
