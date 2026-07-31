'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function NotFound() {
  return (
    <ResponsiveAppLayout title="404 NOT FOUND">
      <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '72px', fontWeight: 800, color: '#111111', lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 700, margin: '16px 0 8px', textTransform: 'uppercase' }}>Page Not Found</h1>
        <p style={{ fontSize: '14px', color: '#777777', marginBottom: '28px' }}>The page or drop you are looking for does not exist or has been moved.</p>
        <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em' }}>
          RETURN TO HOME
        </Link>
      </div>
    </ResponsiveAppLayout>
  );
}
