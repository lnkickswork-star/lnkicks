'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/components/context/AppContext';

export default function DesktopHome() {
  const { cart } = useApp();
  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div style={{ background: '#ffffff', color: '#0A0A0A', fontFamily: "var(--font-inter), sans-serif", minHeight: '100vh' }}>
      
      {/* ANNOUNCEMENT BAR */}
      <div style={{ background: '#0A0A0A', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase' }}>
        Free Shipping on All Prepaid Orders | 100% Authenticity Guaranteed | 50,000+ Unique SKUs
      </div>

      {/* NAVIGATION */}
      <nav style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid #EBEBEB', padding: '0 80px', height: '72px', display: 'grid', gridTemplateColumns: '200px 1fr 200px', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: '26px', fontWeight: 700, color: '#0A0A0A' }}>LNKICKS</div>
          <div style={{ fontSize: '8.5px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A8A8A' }}>STOCK &amp; LOADED</div>
        </Link>
        <ul style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', listStyle: 'none', margin: 0, padding: 0 }}>
          <li><Link href="/category-products" style={{ textDecoration: 'none', color: '#4A4A4A', fontSize: '13px', fontWeight: 500 }}>Sneakers</Link></li>
          <li><Link href="/categories" style={{ textDecoration: 'none', color: '#4A4A4A', fontSize: '13px', fontWeight: 500 }}>Luxury Footwear</Link></li>
          <li><Link href="/category-products" style={{ textDecoration: 'none', color: '#4A4A4A', fontSize: '13px', fontWeight: 500 }}>Bags</Link></li>
          <li><Link href="/category-products" style={{ textDecoration: 'none', color: '#4A4A4A', fontSize: '13px', fontWeight: 500 }}>Clothing</Link></li>
          <li><Link href="/track-order" style={{ textDecoration: 'none', color: '#8A8A8A', fontSize: '13px', fontWeight: 500 }}>Track Order</Link></li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
          <Link href="/search" style={{ color: '#4A4A4A' }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></Link>
          <Link href="/admin-login" style={{ color: '#4A4A4A' }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></Link>
          <Link href="/cart" style={{ color: '#4A4A4A', position: 'relative' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
            {totalCartCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#0A0A0A', color: '#fff', borderRadius: '50%', width: '15px', height: '15px', fontSize: '8.5px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {totalCartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* HERO BANNER */}
      <section style={{ height: 'calc(100vh - 114px)', minHeight: '640px', background: '#0A0A0A', display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '58%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/jordan_powder_blue_nobg.png" alt="Hero Sneaker" width={540} height={540} priority style={{ width: '70%', maxWidth: '540px', height: 'auto', filter: 'drop-shadow(0 24px 80px rgba(0,0,0,.9))' }} />
        </div>
        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '46%', padding: '60px 80px 60px 48px', color: '#ffffff', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: '28px' }}>New Season 2026</div>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: '5.5rem', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-.025em', margin: '0 0 24px' }}>Stocked<br/>&amp; <em>Loaded.</em></h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.45)', maxWidth: '320px', marginBottom: '48px' }}>Finest collection of hyped and luxury footwear. Authenticity guaranteed on every single drop.</p>
          <Link href="/category-products" style={{ display: 'inline-flex', alignItems: 'center', padding: '18px 40px', background: '#ffffff', color: '#0A0A0A', borderRadius: '2px', fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
            <span>Shop Now →</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A0A0A', color: '#ffffff', padding: '80px 80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '56px', borderBottom: '1px solid rgba(255,255,255,.07)', paddingBottom: '64px' }}>
          <div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: '30px', fontWeight: 700 }}>LNKICKS</div>
            <div style={{ fontSize: '8.5px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: '22px' }}>STOCK &amp; LOADED</div>
            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,.3)', maxWidth: '260px' }}>India&apos;s premier destination for authentic luxury sneakers and hype footwear.</p>
          </div>
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '22px' }}>Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <Link href="/category-products" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none', fontSize: '13.5px' }}>Sneakers</Link>
              <Link href="/categories" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none', fontSize: '13.5px' }}>Luxury Footwear</Link>
              <Link href="/track-order" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none', fontSize: '13.5px' }}>Track Your Order</Link>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '22px' }}>Policies</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <Link href="/help-support" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none', fontSize: '13.5px' }}>Authenticity Guarantee</Link>
              <Link href="/return-refund-policy" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none', fontSize: '13.5px' }}>Return &amp; Refund Policy</Link>
              <Link href="/terms-conditions" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none', fontSize: '13.5px' }}>Terms &amp; Conditions</Link>
              <Link href="/shipping-policy" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none', fontSize: '13.5px' }}>Shipping Policy</Link>
              <Link href="/contact-us" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none', fontSize: '13.5px' }}>Contact Us</Link>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '22px', fontSize: '12px', color: 'rgba(255,255,255,.18)' }}>
          <div>© 2026 LNKICKS. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
}
