'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams ? searchParams.get('orderId') || 'LNK-784912' : 'LNK-784912';

  return (
    <ResponsiveAppLayout title="ORDER SUCCESS">
      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '540px', margin: '0 auto', background: '#ffffff', borderRadius: '28px', border: '1px solid #EBEBEB', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#E3FCEF', color: '#00875A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>✓</div>
        <h1 style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: 0 }}>Order Confirmed!</h1>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#777777', marginTop: '6px', marginBottom: '24px' }}>Order ID: #{orderId}</div>
        
        <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.6, marginBottom: '32px' }}>
          Thank you for shopping with LNKICKS! Your order has been placed successfully and is being verified by our authentication team.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/track-order?orderId=${orderId}`} style={{ padding: '14px 28px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "var(--font-oswald), sans-serif", fontSize: '13px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.08em' }}>
            TRACK ORDER
          </Link>
          <Link href="/products" style={{ padding: '14px 28px', background: '#F0F0F2', color: '#111111', borderRadius: '30px', fontFamily: "var(--font-oswald), sans-serif", fontSize: '13px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.08em' }}>
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </ResponsiveAppLayout>
  );
}
