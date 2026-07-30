'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('lnk_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Fallback default sample order
        setOrders([
          {
            orderId: 'LNK-784912',
            date: 'July 28, 2026',
            total: 8899,
            paymentMode: 'UPI',
            items: [{ name: 'Air Jordan 1 Low Black Powder Blue', qty: 1, price: 8899, image: 'jordan_powder_blue_nobg.png' }],
            status: 'Shipped'
          }
        ]);
      }
    } catch (e) {}
  }, []);

  return (
    <ResponsiveAppLayout title="MY ORDERS">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/profile" style={{ color: '#777777', textDecoration: 'none' }}>Account</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>My Orders</span>
      </div>

      <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', marginBottom: '32px' }}>
        Order History ({orders.length})
      </h1>

      {orders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((ord, i) => (
            <div key={i} style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #EBEBEB', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              
              {/* ORDER HEADER BAR */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EBEBEB', paddingBottom: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '18px', fontWeight: 800, color: '#111111' }}>#{ord.orderId}</div>
                  <div style={{ fontSize: '12px', color: '#777777', marginTop: '2px' }}>Placed on {ord.date}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: ord.status === 'Delivered' ? '#E3FCEF' : '#E6FCFF', color: ord.status === 'Delivered' ? '#00875A' : '#008299', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '12px' }}>
                    {ord.status || 'Processing'}
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FF3B30' }}>
                    ₹{(ord.total || 8899).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* ORDER ITEMS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {ord.items && ord.items.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#F8F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img src={item.image ? (item.image.startsWith('/') ? item.image : `/${item.image}`) : '/jordan_powder_blue_nobg.png'} alt={item.name} style={{ maxHeight: '45px', width: 'auto', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#777777' }}>Qty: {item.qty || 1} | Price: ₹{(item.price || 8899).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link href={`/track-order?orderId=${ord.orderId}`} style={{ padding: '10px 20px', background: '#111111', color: '#ffffff', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', fontFamily: "'Oswald', sans-serif" }}>
                  TRACK ORDER
                </Link>
                <Link href={`/order-detail?orderId=${ord.orderId}`} style={{ padding: '10px 20px', background: '#F0F0F2', color: '#111111', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', fontFamily: "'Oswald', sans-serif" }}>
                  VIEW DETAILS
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* EMPTY ORDERS STATE */
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #EBEBEB' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 800, color: '#111111', margin: 0 }}>No Orders Placed Yet</h2>
          <p style={{ fontSize: '13px', color: '#777777', margin: '8px 0 24px' }}>Your recent purchases and drop orders will appear here.</p>
          <Link href="/products" style={{ display: 'inline-block', padding: '14px 32px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em' }}>
            START SHOPPING
          </Link>
        </div>
      )}
    </ResponsiveAppLayout>
  );
}
