'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Revenue', value: '₹24,89,500', change: '+18.4%' },
    { label: 'Total Orders', value: '1,420', change: '+12.1%' },
    { label: 'Active Customers', value: '8,950', change: '+24.5%' },
    { label: 'Low Stock SKUs', value: '12', change: '-4' }
  ];

  return (
    <ResponsiveAppLayout title="ADMIN DASHBOARD">
      {/* ADMIN NAV BAR */}
      <div style={{ background: '#111111', borderRadius: '24px', padding: '16px 24px', color: '#ffffff', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '18px', fontWeight: 800, letterSpacing: '0.1em' }}>
          ADMIN SUITE <span style={{ fontSize: '11px', background: '#FF3B30', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>SUPER ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
          <Link href="/dashboard" style={{ color: '#ffffff', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/products-management" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Products</Link>
          <Link href="/orders-management" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Orders</Link>
          <Link href="/customers-management" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Customers</Link>
          <Link href="/settings-panel" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Settings</Link>
        </div>
      </div>

      <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', marginBottom: '28px' }}>Executive Overview</h1>

      {/* STATS WIDGETS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #EBEBEB', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#777777', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '28px', fontWeight: 800, color: '#111111' }}>{s.value}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: s.change.startsWith('+') ? '#00875A' : '#FF3B30', marginTop: '4px' }}>{s.change} vs last month</div>
          </div>
        ))}
      </div>

      {/* QUICK MANAGEMENT LINKS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', border: '1px solid #EBEBEB' }}>
          <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', fontWeight: 800, color: '#111111', margin: '0 0 12px' }}>Products &amp; Catalog</h3>
          <p style={{ fontSize: '13px', color: '#777777', marginBottom: '20px' }}>Manage 50,000+ sneaker SKUs, add new drops, update pricing, and adjust stock levels.</p>
          <Link href="/products-management" style={{ padding: '10px 20px', background: '#111111', color: '#ffffff', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>MANAGE CATALOG →</Link>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', border: '1px solid #EBEBEB' }}>
          <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', fontWeight: 800, color: '#111111', margin: '0 0 12px' }}>Orders &amp; Fulfillment</h3>
          <p style={{ fontSize: '13px', color: '#777777', marginBottom: '20px' }}>Process pending customer orders, update BlueDart tracking numbers, and manage returns.</p>
          <Link href="/orders-management" style={{ padding: '10px 20px', background: '#111111', color: '#ffffff', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>MANAGE ORDERS →</Link>
        </div>
      </div>
    </ResponsiveAppLayout>
  );
}
