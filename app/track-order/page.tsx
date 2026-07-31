'use client';

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
          <h1 style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '28px', fontWeight: 800, color: '#111111', margin: '4px 0 0' }}>Order #{orderId}</h1>
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
