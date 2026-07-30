'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { useApp } from '@/components/context/AppContext';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill all registration fields.');
      return;
    }

    const user = { name, email, phone: '+91 98765 43210', joined: 'July 2026', isLoggedIn: true };
    localStorage.setItem('lnk_user', JSON.stringify(user));
    showToast('Welcome to LNKICKS!');
    router.push('/profile');
  };

  return (
    <ResponsiveAppLayout title="REGISTER">
      <div style={{ maxWidth: '440px', margin: '40px auto', background: '#ffffff', borderRadius: '28px', padding: '36px', border: '1px solid #EBEBEB' }}>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: '0 0 20px', textAlign: 'center' }}>Create Account</h1>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>PASSWORD</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.08em', marginTop: '10px' }}>
            CREATE ACCOUNT
          </button>
        </form>
      </div>
    </ResponsiveAppLayout>
  );
}
