import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function OrderFailedPage() {
  return (
    <ResponsiveAppLayout title="ORDER FAILED">
      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '0 auto', background: '#ffffff', borderRadius: '28px', border: '1px solid #EBEBEB' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#FFEBE6', color: '#FF3B30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>✕</div>
        <h1 style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: 0 }}>Payment Unsuccessful</h1>
        <p style={{ fontSize: '14px', color: '#555555', margin: '12px 0 28px' }}>Your transaction could not be processed. No funds were debited.</p>
        <Link href="/checkout" style={{ padding: '14px 28px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "var(--font-oswald), sans-serif", fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          RETRY CHECKOUT
        </Link>
      </div>
    </ResponsiveAppLayout>
  );
}
