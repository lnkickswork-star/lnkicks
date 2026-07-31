'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';

export default function MobileHome() {
  const { cart, toggleWishlist, addToCart } = useApp();
  const [splashHidden, setSplashHidden] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '440px', minHeight: '100vh', margin: '0 auto', background: '#F4F4F6', position: 'relative', overflowX: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* 1. FULLSCREEN SPLASH SCREEN */}
        {!splashHidden && (
          <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '440px', height: '100vh', background: '#F6F6F6', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '50px 24px 30px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', zIndex: 10 }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', fontWeight: 800, letterSpacing: '0.12em', color: '#111111' }}>LNKICKS</div>
              <button onClick={() => setSplashHidden(true)} style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#777777', padding: '8px 16px', background: 'rgba(0,0,0,0.05)', borderRadius: '20px', border: 'none', cursor: 'pointer' }}>SKIP</button>
            </div>

            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', overflow: 'hidden' }}>
              <img src="/jordan_powder_blue_nobg.png" alt="Nike Air Jordan 1" style={{ position: 'absolute', top: '4%', left: '6%', width: '215px', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.22))', transform: 'rotate(-28deg)', zIndex: 3 }} />
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '110px', fontWeight: 900, letterSpacing: '0.04em', color: '#111111', writingMode: 'vertical-rl', transform: 'rotate(180deg)', userSelect: 'none', pointerEvents: 'none', lineHeight: 0.9, opacity: 0.95, zIndex: 1 }}>LNKICKS</div>
              <img src="/samba_og_nobg.png" alt="Adidas Samba OG" style={{ position: 'absolute', bottom: '6%', right: '4%', width: '225px', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.22))', transform: 'rotate(24deg)', zIndex: 3 }} />
            </div>

            <div style={{ width: '100%', zIndex: 10 }}>
              <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '36px', fontWeight: 800, lineHeight: 1.05, color: '#111111', letterSpacing: '-0.02em', marginBottom: '24px' }}>Start your<br/>sneaker journey</h1>
              <div onClick={() => setSplashHidden(true)} style={{ background: '#111111', borderRadius: '28px', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ffffff', cursor: 'pointer', boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '0.06em' }}>Get Started</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>&gt;&gt;&gt;</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MAIN MOBILE CONTENT */}
        <div style={{ padding: '44px 20px 110px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TOP GREETING */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#777777', display: 'flex', alignItems: 'center', gap: '6px' }}>Hello, Sneakerhead <span style={{ fontSize: '16px' }}>👋</span></div>
              <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: '2px' }}>LNKICKS</h1>
            </div>
            <Link href="/profile" style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111111', boxShadow: '0 4px 14px rgba(0,0,0,0.05)', border: 'none', textDecoration: 'none' }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </Link>
          </div>

          {/* SEARCH BAR */}
          <div style={{ background: '#ffffff', borderRadius: '30px', height: '54px', padding: '0 8px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <Link href="/search" style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, textDecoration: 'none', color: '#aaaaaa' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span style={{ fontSize: '14px' }}>Search fashion, sneakers, brands...</span>
            </Link>
            <Link href="/filters" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F0F0F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111111', border: 'none', textDecoration: 'none' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            </Link>
          </div>

          {/* HOT DEALS */}
          <div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '22px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', display: 'flex', alignItems: 'center', gap: '8px' }}>Hot Deals 🔥</h2>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '4px 0 12px', margin: '0 -20px', paddingLeft: '20px', paddingRight: '20px' }}>
              <div style={{ minWidth: '280px', height: '165px', borderRadius: '24px', background: 'linear-gradient(135deg, #111111 0%, #2a2a2a 100%)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#ffffff', position: 'relative', flexShrink: 0 }}>
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 800 }}>Get 20% off</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>Enjoy discounts across Adidas collection</div>
                </div>
                <Link href="/category-products?brand=ADIDAS" style={{ alignSelf: 'flex-start', padding: '8px 22px', background: '#ffffff', color: '#111111', fontSize: '12px', fontWeight: 700, borderRadius: '20px', textDecoration: 'none' }}>Reveal</Link>
                <img src="/samba_og_nobg.png" alt="Adidas" style={{ position: 'absolute', right: '-15px', bottom: '-15px', width: '150px', height: 'auto', transform: 'rotate(-14deg)' }} />
              </div>
            </div>
          </div>

          {/* NEXT DROP CARD */}
          <div style={{ background: '#ffffff', borderRadius: '28px', padding: '24px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', boxShadow: '0 6px 20px rgba(0,0,0,0.04)', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ background: '#111111', color: '#ffffff', fontFamily: "'Oswald', sans-serif", fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', padding: '5px 14px', borderRadius: '14px', marginBottom: '12px' }}>NEXT DROP</div>
            <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '26px', fontWeight: 800, color: '#111111', margin: 0 }}>DUNK HIGH 'DEEP ROYAL'</h3>
            <div style={{ fontSize: '13px', color: '#777777', marginTop: '4px', marginBottom: '12px' }}>Exclusively for LNKICKS Members</div>
            <div style={{ width: '100%', maxWidth: '240px', height: '110px', margin: '10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="/jordan_powder_blue_nobg.png" alt="Dunk High" style={{ maxHeight: '100px', maxWidth: '100%', height: 'auto', objectFit: 'contain' }} />
            </div>
            <Link href="/product-detail" style={{ background: '#111111', color: '#ffffff', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, letterSpacing: '0.12em', padding: '14px 36px', borderRadius: '30px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <span>NOTIFY ME</span>
            </Link>
          </div>

        </div>

        {/* 3. CYLINDRICAL FLOATING PILL NAV BAR */}
        <nav style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '408px', height: '68px', background: '#111111', borderRadius: '36px', border: '1px solid rgba(255,255,255,0.14)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center', zIndex: 1000, boxShadow: '0 16px 40px rgba(0,0,0,0.38)', padding: '0 8px', boxSizing: 'border-box' }}>
          <Link href="/mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none' }}>
            <div style={{ background: '#ffffff', padding: '8px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#111111' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111111" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#111111' }}>Home</span>
            </div>
          </Link>
          <Link href="/categories" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '10.5px', fontWeight: 600, textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span>Explore</span>
          </Link>
          <Link href="/wishlist" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '10.5px', fontWeight: 600, textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>Wishlist</span>
          </Link>
          <Link href="/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '10.5px', fontWeight: 600, textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profile</span>
          </Link>
        </nav>

      </div>
    </div>
  );
}
