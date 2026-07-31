'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';

export const ResponsiveAppLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title = 'LNKICKS' }) => {
  const { cart } = useApp();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile === null) return null;

  // DESKTOP INTERNAL PAGE SHELL (Expands to 1440px full container, Desktop Luxury Header & Desktop Footer)
  if (!isMobile) {
    return (
      <div style={{ background: '#FFFFFF', color: '#0A0A0A', fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* DESKTOP HEADER */}
        <header style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid #EBEBEB', padding: '0 80px', height: '72px', display: 'grid', gridTemplateColumns: '200px 1fr 200px', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 700, color: '#0A0A0A' }}>LNKICKS</div>
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
        </header>

        {/* MAIN DESKTOP CONTENT CONTAINER */}
        <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '40px 80px', flex: 1, boxSizing: 'border-box' }}>
          {children}
        </main>

        {/* DESKTOP FOOTER */}
        <footer style={{ background: '#0A0A0A', color: '#ffffff', padding: '80px 80px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '56px', borderBottom: '1px solid rgba(255,255,255,.07)', paddingBottom: '64px' }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: 700 }}>LNKICKS</div>
              <div style={{ fontSize: '8.5px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: '22px' }}>STOCK &amp; LOADED</div>
              <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,.3)', maxWidth: '260px' }}>India's premier destination for authentic luxury sneakers and hype footwear.</p>
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

  // MOBILE INTERNAL PAGE SHELL (Mobile header, responsive container padding, cylindrical bottom navigation)
  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '440px', minHeight: '100vh', margin: '0 auto', background: '#F4F4F6', position: 'relative', overflowX: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* MOBILE INTERNAL HEADER */}
        <header style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: '#ffffff', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #F0F0F0' }}>
          <Link href="/mobile" style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#111111', textDecoration: 'none' }}>
            LNKICKS
          </Link>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: '#111111' }}>
            {title}
          </div>
          <Link href="/cart" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F6F6F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111111', textDecoration: 'none', position: 'relative' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
            {totalCartCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#111111', color: '#ffffff', borderRadius: '50%', width: '14px', height: '14px', fontSize: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {totalCartCount}
              </span>
            )}
          </Link>
        </header>

        {/* MAIN MOBILE CONTENT CONTAINER */}
        <main style={{ padding: '20px 16px 90px', flex: 1 }}>
          {children}
        </main>

        {/* CYLINDRICAL FLOATING PILL NAV BAR */}
        <nav style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '408px', height: '68px', background: '#111111', borderRadius: '36px', border: '1px solid rgba(255,255,255,0.14)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center', zIndex: 1000, boxShadow: '0 16px 40px rgba(0,0,0,0.38)', padding: '0 8px', boxSizing: 'border-box' }}>
          <Link href="/mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '10.5px', fontWeight: 600, textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
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
};
