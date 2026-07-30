'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  origPrice?: number;
  badge?: string;
  image: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, name, brand, price, origPrice, badge, image }) => {
  const { toggleWishlist, addToCart } = useApp();

  return (
    <div style={{ background: '#ffffff', borderRadius: '24px', padding: '14px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 6px 20px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
      {badge && (
        <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#FF3B30', color: '#ffffff', fontSize: '9.5px', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', zIndex: 2 }}>
          {badge}
        </span>
      )}
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist({ id, name, price, image }); }}
        aria-label="Wishlist" 
        style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: '#F6F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3B30', border: 'none', cursor: 'pointer', zIndex: 2 }}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </button>

      <Link href="/product-detail" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', padding: '10px' }}>
          <img src={image.startsWith('/') ? image : `/${image}`} alt={name} style={{ maxHeight: '110px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))' }} />
        </div>
        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaaaaa' }}>{brand}</div>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#111111', marginTop: '2px', lineHeight: 1.3, minHeight: '34px' }}>{name}</h3>
        <div style={{ fontSize: '14px', fontWeight: 800, color: '#FF3B30', marginTop: '6px' }}>
          ₹{price.toLocaleString('en-IN')}
          {origPrice && <span style={{ fontSize: '11px', color: '#bbbbbb', textDecoration: 'line-through', fontWeight: 400, marginLeft: '4px' }}>₹{origPrice.toLocaleString('en-IN')}</span>}
        </div>
      </Link>

      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart({ id, name, price, image, qty: 1 }); }}
        style={{ marginTop: '10px', background: '#111111', color: '#ffffff', borderRadius: '20px', padding: '10px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', border: 'none', cursor: 'pointer', width: '100%' }}>
        <span>Add to Cart</span>
      </button>
    </div>
  );
};
