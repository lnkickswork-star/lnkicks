import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
app_dir = os.path.join(project_dir, "app")
os.makedirs(os.path.join(app_dir, "admin-login"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "dashboard"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "products-management"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "orders-management"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "customers-management"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "settings-panel"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "admin", "dashboard"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "admin", "products"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "admin", "orders"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "admin", "customers"), exist_ok=True)

# 1. app/admin-login/page.tsx
admin_login_code = """'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { useApp } from '@/components/context/AppContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const [email, setEmail] = useState('admin@lnkicks.com');
  const [password, setPassword] = useState('admin123');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@lnkicks.com' && password === 'admin123') {
      const adminSession = { role: 'Super Admin', name: 'Executive Admin', email, isLoggedIn: true };
      localStorage.setItem('lnk_admin', JSON.stringify(adminSession));
      showToast('Admin Portal Authenticated!');
      router.push('/dashboard');
    } else {
      showToast('Invalid Admin Credentials.');
    }
  };

  return (
    <ResponsiveAppLayout title="ADMIN PORTAL">
      <div style={{ maxWidth: '420px', margin: '40px auto', background: '#ffffff', borderRadius: '28px', padding: '36px', border: '2px solid #111111', boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#111111' }}>LNKICKS</div>
          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF3B30', marginTop: '2px' }}>ENTERPRISE ADMIN PORTAL</div>
        </div>

        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>ADMIN EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>PASSWORD</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: '#FF3B30', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.08em', marginTop: '10px' }}>
            AUTHENTICATE ADMIN →
          </button>
        </form>
      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "admin-login", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(admin_login_code)

print("Created app/admin-login/page.tsx!")

# 2. app/dashboard/page.tsx & app/admin/dashboard/page.tsx
dashboard_code = """'use client';

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
"""

with open(os.path.join(app_dir, "dashboard", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(dashboard_code)

with open(os.path.join(app_dir, "admin", "dashboard", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(dashboard_code)

print("Created app/dashboard/page.tsx!")

# 3. app/products-management/page.tsx
products_mgmt_code = """'use client';

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
"""

with open(os.path.join(app_dir, "products-management", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(products_mgmt_code)

with open(os.path.join(app_dir, "admin", "products", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(products_mgmt_code)

print("Created app/products-management/page.tsx!")
