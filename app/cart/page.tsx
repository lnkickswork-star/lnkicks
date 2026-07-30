'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { useApp } from '@/components/context/AppContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;

  return (
    <ResponsiveAppLayout title="SHOPPING CART">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>Shopping Cart</span>
      </div>

      <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', marginBottom: '32px' }}>
        Shopping Bag ({cart.reduce((sum, item) => sum + item.qty, 0)} Items)
      </h1>

      {cart.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* CART ITEMS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #EBEBEB', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '16px', background: '#F8F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={item.image.startsWith('/') ? item.image : `/${item.image}`} alt={item.name} style={{ maxHeight: '70px', width: 'auto', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111111', margin: '0 0 4px', lineHeight: 1.3 }}>{item.name}</h3>
                  <div style={{ fontSize: '12px', color: '#777777', marginBottom: '12px' }}>Size: {item.size || 'UK 8'}</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* QUANTITY SELECTOR */}
                    <div style={{ display: 'flex', alignItems: 'center', background: '#F0F0F2', borderRadius: '16px', padding: '2px 8px' }}>
                      <button onClick={() => updateQty(index, -1)} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 700, padding: '4px 8px', cursor: 'pointer' }}>-</button>
                      <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => updateQty(index, 1)} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 700, padding: '4px 8px', cursor: 'pointer' }}>+</button>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#FF3B30' }}>
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <button onClick={() => removeFromCart(index)} style={{ background: 'none', border: 'none', color: '#aaaaaa', cursor: 'pointer', padding: '8px' }}>
                  ✕
                </button>
              </div>
            ))}

            <button onClick={clearCart} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#777777', fontSize: '12px', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', marginTop: '8px' }}>
              Clear Shopping Bag
            </button>
          </div>

          {/* ORDER SUMMARY CARD */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', border: '1px solid #EBEBEB', boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: '0 0 20px', borderBottom: '1px solid #EBEBEB', paddingBottom: '12px' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#555555', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Bag Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00875A' }}>
                <span>Estimated Savings (10%)</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Delivery</span>
                <span style={{ color: '#00875A', fontWeight: 700 }}>FREE</span>
              </div>
            </div>

            <div style={{ borderTop: '2px solid #111111', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: '#111111', marginBottom: '24px' }}>
              <span>Total Amount</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <Link href="/checkout" style={{ display: 'block', width: '100%', padding: '16px', background: '#111111', color: '#ffffff', borderRadius: '30px', textAlign: 'center', fontFamily: "'Oswald', sans-serif", fontSize: '15px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.08em', boxSizing: 'border-box' }}>
              PROCEED TO CHECKOUT →
            </Link>
          </div>

        </div>
      ) : (
        /* EMPTY CART STATE */
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #EBEBEB' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛍️</div>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 800, color: '#111111', margin: 0 }}>Your Shopping Bag is Empty</h2>
          <p style={{ fontSize: '13px', color: '#777777', margin: '8px 0 24px' }}>Looks like you haven't added any authentic luxury kicks yet.</p>
          <Link href="/products" style={{ display: 'inline-block', padding: '14px 32px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em' }}>
            START SHOPPING
          </Link>
        </div>
      )}
    </ResponsiveAppLayout>
  );
}
