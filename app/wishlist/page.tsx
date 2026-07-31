'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { useApp } from '@/components/context/AppContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();

  return (
    <ResponsiveAppLayout title="MY WISHLIST">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>My Wishlist</span>
      </div>

      <h1 style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', marginBottom: '32px' }}>
        Saved Items ({wishlist.length})
      </h1>

      {wishlist.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {wishlist.map((item) => (
            <div key={item.id} style={{ background: '#ffffff', borderRadius: '24px', padding: '16px', border: '1px solid #EBEBEB', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <button onClick={() => toggleWishlist(item)} style={{ position: 'absolute', top: '12px', right: '12px', background: '#F6F6F8', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#FF3B30', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>

              <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Image src={item.image ? (item.image.startsWith('/') ? item.image : `/${item.image}`) : '/jordan_powder_blue_nobg.png'} alt={item.name} width={110} height={110} style={{ maxHeight: '110px', width: 'auto', height: 'auto', objectFit: 'contain' }} />
              </div>

              <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#111111', margin: '0 0 6px', minHeight: '34px' }}>{item.name}</h3>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FF3B30', marginBottom: '14px' }}>₹{item.price ? item.price.toLocaleString('en-IN') : '8,899'}</div>

              <button onClick={() => { addToCart({ id: item.id, name: item.name, price: item.price || 8899, image: item.image || 'jordan_powder_blue_nobg.png', qty: 1 }); toggleWishlist(item); }} style={{ width: '100%', padding: '10px', background: '#111111', color: '#ffffff', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* EMPTY WISHLIST STATE */
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #EBEBEB' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>❤️</div>
          <h2 style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '24px', fontWeight: 800, color: '#111111', margin: 0 }}>Your Wishlist is Empty</h2>
          <p style={{ fontSize: '13px', color: '#777777', margin: '8px 0 24px' }}>Save your favorite grails and drops by clicking the heart icon on any product.</p>
          <Link href="/products" style={{ display: 'inline-block', padding: '14px 32px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "var(--font-oswald), sans-serif", fontSize: '14px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em' }}>
            EXPLORE PRODUCTS
          </Link>
        </div>
      )}
    </ResponsiveAppLayout>
  );
}
