import os
import shutil

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
components_ui = os.path.join(project_dir, "components", "ui")
components_layout = os.path.join(project_dir, "components", "layout")
os.makedirs(components_ui, exist_ok=True)
os.makedirs(components_layout, exist_ok=True)

# 1. ProductCard Component (components/ui/ProductCard.tsx)
product_card_code = """'use client';

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
"""

with open(os.path.join(components_ui, "ProductCard.tsx"), "w", encoding="utf-8") as f:
    f.write(product_card_code)

print("Created components/ui/ProductCard.tsx!")

# 2. Header Component (components/layout/Header.tsx)
header_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';

export const Header: React.FC = () => {
  const { cart } = useApp();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid #EBEBEB', padding: '0 80px', height: '72px', display: 'grid', gridTemplateColumns: '200px 1fr 200px', alignItems: 'center' }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 700, color: '#0A0A0A' }}>LNKICKS</div>
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
"""

with open(os.path.join(components_layout, "Header.tsx"), "w", encoding="utf-8") as f:
    f.write(header_code)

print("Created components/layout/Header.tsx!")

# 3. MobileFooter Component (components/layout/MobileFooter.tsx)
mobile_footer_code = """'use client';

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
      <Link href="/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '10.5px', fontWeight 600, textDecoration: 'none' }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Profile</span>
      </Link>
    </nav>
  );
};
"""

with open(os.path.join(components_layout, "MobileFooter.tsx"), "w", encoding="utf-8") as f:
    f.write(mobile_footer_code)

print("Created components/layout/MobileFooter.tsx!")
