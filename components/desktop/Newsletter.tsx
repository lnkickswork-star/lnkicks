'use client';

import React, { useState } from 'react';

/**
 * Newsletter — oversized "Sign up and save" headline with email capture.
 * Stitch design specs:
 *  - section: py-40 bg white
 *  - headline: text-9xl font-black tracking-tighter "Sign up\nand save"
 *  - sub: text-xl gray-400 "Be the first to know..."
 *  - form: gray-50 bg, rounded-[2rem], py-8 px-12, with black 64px round submit btn
 */

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section style={{ paddingTop: '160px', paddingBottom: '160px', background: '#ffffff' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: '128px',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            marginBottom: '32px',
            lineHeight: 0.85,
            textTransform: 'uppercase',
            margin: '0 0 32px 0',
          }}
        >
          Sign up
          <br />
          and save
        </h2>
        <p style={{ fontSize: '20px', color: '#9ca3af', fontWeight: 500, marginBottom: '64px', margin: '0 0 64px 0' }}>
          {submitted ? 'Thank you — check your inbox for a welcome discount.' : 'Be the first to know about Price Drops & Exclusive Releases'}
        </p>
        <form onSubmit={handleSubmit} style={{ position: 'relative', maxWidth: '672px', margin: '0 auto' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            aria-label="Email address"
            style={{
              width: '100%',
              background: '#f9fafb',
              border: '2px solid transparent',
              borderRadius: '32px',
              paddingTop: '32px',
              paddingBottom: '32px',
              paddingLeft: '48px',
              paddingRight: '96px',
              fontSize: '20px',
              fontWeight: 700,
              outline: 'none',
              transition: 'border-color 250ms ease',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
            className="newsletter-input"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="newsletter-submit"
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#000',
              color: '#fff',
              width: '64px',
              height: '64px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .newsletter-input:focus {
          border-color: #000 !important;
        }
        .newsletter-submit:hover {
          transform: translateY(-50%) scale(1.1) !important;
        }
        @media (max-width: 1280px) {
          :global(.newsletter-headline) {
            font-size: 96px !important;
          }
        }
      `}</style>
    </section>
  );
}
