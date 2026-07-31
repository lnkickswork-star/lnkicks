'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function HelpSupportPage() {
  const faqs = [
    { q: 'How does LNKICKS verify product authenticity?', a: 'Every pair passes a 12-point physical verification check by our sneaker experts before being dispatched with our tamper-proof verification tag.' },
    { q: 'What is the estimated delivery time?', a: 'Prepaid orders ship via BlueDart Express and arrive within 2-4 business days across India.' },
    { q: 'What is your return & exchange policy?', a: 'We offer a 7-day hassle-free return or size exchange for unworn sneakers with all original tags attached.' }
  ];

  return (
    <ResponsiveAppLayout title="HELP & SUPPORT">
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', marginBottom: '28px' }}>Customer Support Center</h1>

        {/* FAQs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #EBEBEB' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111111', margin: '0 0 8px' }}>{faq.q}</h3>
              <p style={{ fontSize: '13px', color: '#555555', margin: 0, lineHeight: 1.5 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* CONTACT BOX */}
        <div style={{ background: '#111111', borderRadius: '24px', padding: '32px', color: '#ffffff', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>Need Additional Support?</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>Our customer service team is available Monday – Saturday (10 AM to 7 PM IST).</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href="mailto:support@lnkicks.com" style={{ padding: '12px 28px', background: '#ffffff', color: '#111111', borderRadius: '24px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>EMAIL SUPPORT</a>
          </div>
        </div>
      </div>
    </ResponsiveAppLayout>
  );
}
