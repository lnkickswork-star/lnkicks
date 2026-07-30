'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

export default function ProductsManagementPage() {
  return (
    <ResponsiveAppLayout title="CATALOG MANAGEMENT">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: 0 }}>Product Inventory</h1>
        <button style={{ padding: '12px 24px', background: '#FF3B30', color: '#ffffff', borderRadius: '24px', fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ ADD NEW PRODUCT</button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #EBEBEB', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #111111', color: '#111111', fontFamily: "'Oswald', sans-serif" }}>
              <th style={{ padding: '12px' }}>SKU</th>
              <th style={{ padding: '12px' }}>PRODUCT NAME</th>
              <th style={{ padding: '12px' }}>BRAND</th>
              <th style={{ padding: '12px' }}>PRICE</th>
              <th style={{ padding: '12px' }}>STOCK</th>
              <th style={{ padding: '12px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCT_REGISTRY.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #EBEBEB' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>{p.sku}</td>
                <td style={{ padding: '12px', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '12px', color: '#777777' }}>{p.brand}</td>
                <td style={{ padding: '12px', fontWeight: 700, color: '#FF3B30' }}>₹{p.price.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px', color: '#00875A', fontWeight: 700 }}>{p.stockStatus}</td>
                <td style={{ padding: '12px' }}>
                  <button style={{ padding: '6px 12px', background: '#F0F0F2', borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ResponsiveAppLayout>
  );
}
