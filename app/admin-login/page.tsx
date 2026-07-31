'use client';

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
