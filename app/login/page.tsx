'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { useApp } from '@/components/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const [email, setEmail] = useState('charles.taylor@lnkicks.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both Email and Password.');
      return;
    }

    const user = { name: 'Charles Taylor', email, phone: '+91 98765 43210', joined: 'January 2026', isLoggedIn: true };
    localStorage.setItem('lnk_user', JSON.stringify(user));
    showToast('Login Successful!');
    router.push('/profile');
  };

  return (
    <ResponsiveAppLayout title="LOGIN">
      <div style={{ maxWidth: '440px', margin: '40px auto', background: '#ffffff', borderRadius: '28px', padding: '36px', border: '1px solid #EBEBEB', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#111111' }}>LNKICKS</div>
          <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#777777', marginTop: '2px' }}>MEMBERS PORTAL</div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777' }}>PASSWORD</label>
              <Link href="/forgot-password" style={{ fontSize: '11px', color: '#777777', textDecoration: 'underline' }}>Forgot?</Link>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.08em', marginTop: '10px' }}>
            SIGN IN
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#777777' }}>
          Don't have an account? <Link href="/register" style={{ color: '#111111', fontWeight: 700, textDecoration: 'underline' }}>Join LNKICKS</Link>
        </div>
      </div>
    </ResponsiveAppLayout>
  );
}
