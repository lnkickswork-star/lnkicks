'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = PRODUCT_REGISTRY.find(p => p.slug === slug) || PRODUCT_REGISTRY[0];

  const [selectedSize, setSelectedSize] = useState<string>('UK 8');
  const [selectedColor, setSelectedColor] = useState<string>(product.availableColors[0] || 'Default');
  const [activeImg, setActiveImg] = useState<string>(product.primaryImage);

  return (
    <ResponsiveAppLayout title={product.name}>
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/products" style={{ color: '#777777', textDecoration: 'none' }}>Products</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* PRODUCT PRESENTATION GRID (Desktop 2-col / Mobile 1-col) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', marginBottom: '64px' }}>
        
        {/* LEFT COLUMN: IMAGE GALLERY */}
        <div>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '40px', border: '1px solid #EBEBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: '380px', marginBottom: '16px' }}>
            <span style={{ position: 'absolute', top: '16px', left: '16px', background: '#FF3B30', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '4px 12px', borderRadius: '12px' }}>
              AUTHENTIC
            </span>
            <img src={activeImg} alt={product.name} style={{ maxHeight: '300px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.15))' }} />
          </div>

          {/* THUMBNAILS */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {product.images.map((img, i) => (
              <div key={i} onClick={() => setActiveImg(img)} style={{ width: '80px', height: '80px', borderRadius: '16px', background: '#ffffff', border: activeImg === img ? '2px solid #111111' : '1px solid #EBEBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '8px' }}>
                <img src={img} alt="Thumbnail" style={{ maxHeight: '60px', width: 'auto', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: PURCHASE PANEL & DETAILS */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777777' }}>{product.brand}</div>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, color: '#111111', margin: '4px 0 12px', lineHeight: 1.1 }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#FF3B30' }}>₹{product.price.toLocaleString('en-IN')}</span>
            {product.comparePrice && <span style={{ fontSize: '14px', color: '#aaaaaa', textDecoration: 'line-through' }}>₹{product.comparePrice.toLocaleString('en-IN')}</span>}
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#00875A', background: '#E3FCEF', padding: '4px 10px', borderRadius: '10px' }}>IN STOCK</span>
          </div>

          <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.6, marginBottom: '28px' }}>{product.shortDescription}</p>

          {/* SIZE SELECTOR UI */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#111111', marginBottom: '10px' }}>
              <span>SELECT SIZE (UK)</span>
              <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#777777' }}>Size Guide</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {product.availableSizes.map((sz) => (
                <button key={sz} onClick={() => setSelectedSize(sz)} style={{ padding: '12px 20px', borderRadius: '14px', border: selectedSize === sz ? '2px solid #111111' : '1px solid #E0E0E0', background: selectedSize === sz ? '#111111' : '#ffffff', color: selectedSize === sz ? '#ffffff' : '#111111', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* COLOR SELECTOR UI */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#111111', marginBottom: '10px' }}>SELECT COLOR</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {product.availableColors.map((c) => (
                <button key={c} onClick={() => setSelectedColor(c)} style={{ padding: '8px 16px', borderRadius: '14px', border: selectedColor === c ? '2px solid #111111' : '1px solid #E0E0E0', background: selectedColor === c ? '#F0F0F2' : '#ffffff', color: '#111111', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* PURCHASE BUTTONS (UI ONLY) */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <button style={{ flex: 1, padding: '16px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
              ADD TO CART
            </button>
            <button style={{ flex: 1, padding: '16px', background: '#FF3B30', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
              BUY NOW
            </button>
          </div>

          {/* SPECS TABS (Shipping, Return, Authenticity) */}
          <div style={{ borderTop: '1px solid #EBEBEB', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#555555' }}>
            <div>✓ 100% Authentic Guarantee with LNKICKS Verification Tag</div>
            <div>✓ Express Shipping in 2-4 Business Days across India</div>
            <div>✓ 7-Day Hassle-Free Return &amp; Exchange Policy</div>
          </div>
        </div>

      </div>

      {/* RELATED PRODUCTS SECTION */}
      <div style={{ borderTop: '1px solid #EBEBEB', paddingTop: '48px' }}>
        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', marginBottom: '24px' }}>You Might Also Like</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {PRODUCT_REGISTRY.slice(1, 5).map((p) => (
            <ProductCard key={p.id} id={p.id} name={p.name} brand={p.brand} price={p.price} origPrice={p.comparePrice} badge={p.newArrival ? 'NEW' : undefined} image={p.primaryImage} />
          ))}
        </div>
      </div>
    </ResponsiveAppLayout>
  );
}
