import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
app_dir = os.path.join(project_dir, "app")
os.makedirs(os.path.join(app_dir, "login"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "register"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "forgot-password"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "reset-password"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "account", "profile"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "account", "addresses"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "account", "preferences"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "account", "security"), exist_ok=True)

# 1. app/login/page.tsx
login_code = """'use client';

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
"""

with open(os.path.join(app_dir, "login", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(login_code)

print("Created app/login/page.tsx!")

# 2. app/register/page.tsx
register_code = """'use client';

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
"""

with open(os.path.join(app_dir, "register", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(register_code)

print("Created app/register/page.tsx!")

# 3. app/account/profile/page.tsx & app/profile/page.tsx
profile_code = """'use client';

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
"""

with open(os.path.join(app_dir, "profile", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(profile_code)

with open(os.path.join(app_dir, "account", "profile", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(profile_code)

print("Created app/profile/page.tsx and app/account/profile/page.tsx!")
