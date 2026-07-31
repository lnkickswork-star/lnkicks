'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { useApp } from '@/components/context/AppContext';

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [name, setName] = useState('Charles Taylor');
  const [email, setEmail] = useState('charles.taylor@lnkicks.com');
  const [phone, setPhone] = useState('+91 98765 43210');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('lnk_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.name) setName(u.name);
        if (u.email) setEmail(u.email);
        if (u.phone) setPhone(u.phone);
      }
    } catch (e) {}
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { name, email, phone, joined: 'January 2026', isLoggedIn: true };
    localStorage.setItem('lnk_user', JSON.stringify(updated));
    showToast('Profile Updated Successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('lnk_user');
    showToast('Logged Out Successfully');
    router.push('/login');
  };

  return (
    <ResponsiveAppLayout title="MY PROFILE">
      <div style={{ maxWidth: '640px', margin: '0 auto', background: '#ffffff', borderRadius: '28px', padding: '36px', border: '1px solid #EBEBEB' }}>
        
        {/* HEADER USER CARD */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', borderBottom: '1px solid #EBEBEB', paddingBottom: '24px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#111111', color: '#ffffff', fontFamily: "'Oswald', sans-serif", fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {name.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 800, color: '#111111', margin: 0 }}>{name}</h1>
            <div style={{ fontSize: '13px', color: '#777777', marginTop: '2px' }}>Member since January 2026</div>
          </div>
        </div>

        {/* PROFILE EDIT FORM */}
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>PHONE NUMBER</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button type="submit" style={{ flex: 1, padding: '14px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              SAVE CHANGES
            </button>
            <button type="button" onClick={handleLogout} style={{ padding: '14px 24px', background: '#FF3B30', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              LOGOUT
            </button>
          </div>
        </form>

        {/* QUICK NAVIGATION LINKS */}
        <div style={{ marginTop: '36px', borderTop: '1px solid #EBEBEB', paddingTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Link href="/my-orders" style={{ padding: '14px', background: '#F8F8FA', borderRadius: '16px', textDecoration: 'none', color: '#111111', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>📦 My Orders</Link>
          <Link href="/addresses" style={{ padding: '14px', background: '#F8F8FA', borderRadius: '16px', textDecoration: 'none', color: '#111111', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>📍 Addresses</Link>
        </div>

      </div>
    </ResponsiveAppLayout>
  );
}
