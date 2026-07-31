import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
app_dir = os.path.join(project_dir, "app")
os.makedirs(os.path.join(app_dir, "my-orders"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "order-detail"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "track-order"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "help-support"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "account", "orders"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "account", "orders", "[id]"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "account", "orders", "[id]", "tracking"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "account", "support"), exist_ok=True)

# 1. app/my-orders/page.tsx & app/account/orders/page.tsx
my_orders_code = """'use client';

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
"""

with open(os.path.join(app_dir, "my-orders", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(my_orders_code)

with open(os.path.join(app_dir, "account", "orders", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(my_orders_code)

print("Created app/my-orders/page.tsx and app/account/orders/page.tsx!")

# 2. app/track-order/page.tsx
track_order_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams ? searchParams.get('orderId') || 'LNK-784912' : 'LNK-784912';

  const timelineSteps = [
    { label: 'Order Placed', status: 'completed', date: 'July 28, 02:15 PM' },
    { label: 'Verified & Packed', status: 'completed', date: 'July 28, 06:40 PM' },
    { label: 'Handed to Courier (BlueDart)', status: 'active', date: 'July 29, 10:00 AM' },
    { label: 'Out for Delivery', status: 'pending', date: 'Expected Tomorrow' },
    { label: 'Delivered', status: 'pending', date: 'Expected July 31' }
  ];

  return (
    <ResponsiveAppLayout title="TRACK ORDER">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/my-orders" style={{ color: '#777777', textDecoration: 'none' }}>Orders</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>Track #{orderId}</span>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', background: '#ffffff', borderRadius: '28px', padding: '36px', border: '1px solid #EBEBEB', boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
        
        {/* HEADER BAR */}
        <div style={{ borderBottom: '1px solid #EBEBEB', paddingBottom: '20px', marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777777' }}>EXPRESS SHIPMENT TRACKING</div>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '28px', fontWeight: 800, color: '#111111', margin: '4px 0 0' }}>Order #{orderId}</h1>
          <div style={{ fontSize: '13px', color: '#00875A', fontWeight: 700, marginTop: '6px' }}>Status: In Transit via BlueDart Express</div>
        </div>

        {/* STEP-BY-STEP TIMELINE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '24px' }}>
          <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: '#E0E0E0', zIndex: 1 }}></div>

          {timelineSteps.map((step, idx) => (
            <div key={idx} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ position: 'absolute', left: '-24px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: step.status === 'completed' ? '#111111' : step.status === 'active' ? '#FF3B30' : '#E0E0E0', border: '3px solid #ffffff' }}></div>
              <div style={{ fontSize: '14px', fontWeight: step.status !== 'pending' ? 700 : 500, color: step.status === 'pending' ? '#777777' : '#111111' }}>{step.label}</div>
              <div style={{ fontSize: '11px', color: '#aaaaaa' }}>{step.date}</div>
            </div>
          ))}
        </div>

      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "track-order", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(track_order_code)

print("Created app/track-order/page.tsx!")

# 3. app/help-support/page.tsx
help_support_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function HelpSupportPage() {
  const faqs = [
    { q: 'How does LNKICKS verify product authenticity?', a: 'Every pair passes a 12-point physical verification check by our sneaker experts before being dispatched with our tamper-proof verification tag.' },
    { q: 'What is the estimated delivery time?', a: 'Prepaid orders ship via BlueDart Express and arrive within 2-4 business days across India.' },
    { q: 'What is your return & exchange policy?', a: 'We offer a 7-day hassle-free return or size exchange for unworn sneakers with all original tags attached.' }
  ];

  return (
    <ResponsiveAppLayout title="HELP & SUPPORT">
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', marginBottom: '28px' }}>Customer Support Center</h1>

        {/* FAQs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #EBEBEB' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111111', margin: '0 0 8px' }}>{faq.q}</h3>
              <p style={{ fontSize: '13px', color: '#555555', margin: 0, lineHeight: 1.5 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* CONTACT BOX */}
        <div style={{ background: '#111111', borderRadius: '24px', padding: '32px', color: '#ffffff', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>Need Additional Support?</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>Our customer service team is available Monday – Saturday (10 AM to 7 PM IST).</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href="mailto:support@lnkicks.com" style={{ padding: '12px 28px', background: '#ffffff', color: '#111111', borderRadius: '24px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>EMAIL SUPPORT</a>
          </div>
        </div>
      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "help-support", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(help_support_code)

print("Created app/help-support/page.tsx!")
