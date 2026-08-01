'use client';

import React, { useState } from 'react';

/**
 * Newsletter — oversized "Sign up and save" email capture.
 *
 * Refinements (Phase 1.5):
 *  - Polished spacing & typography (consistent with new LN KICKS system)
 *  - Premium italic kicker + editorial wordmark treatment
 *  - Refined input: focus state shows full border, not just outline
 *  - Submit button: subtle scale on hover (no over-animation)
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
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            marginBottom: '24px',
            margin: '0 0 24px 0',
          }}
        >
          Join the Drop List
        </p>
        <h2
          style={{
            fontSize: '120px',
            fontWeight: 800,
            letterSpacing: '-0.045em',
            marginBottom: '32px',
            lineHeight: 0.85,
            textTransform: 'uppercase',
            margin: '0 0 32px 0',
          }}
        >
          Sign up
          <br />
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>and</span> save
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: '#9ca3af',
            fontWeight: 400,
            marginBottom: '56px',
            margin: '0 0 56px 0',
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {submitted
            ? 'Thank you — check your inbox for a welcome discount.'
            : 'Be the first to know about Price Drops & Exclusive Releases.'}
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
              border: '1.5px solid transparent',
              borderRadius: '999px',
              paddingTop: '28px',
              paddingBottom: '28px',
              paddingLeft: '44px',
              paddingRight: '96px',
              fontSize: '18px',
              fontWeight: 600,
              outline: 'none',
              transition: 'border-color 350ms ease, background-color 350ms ease',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              color: '#000',
            }}
            className="newsletter-input"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="newsletter-submit"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#000',
              color: '#fff',
              width: '60px',
              height: '60px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1), background-color 350ms ease',
            }}
          >
            <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="newsletter-arrow">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .newsletter-input::placeholder {
          color: #9ca3af;
          font-weight: 500;
        }
        .newsletter-input:focus {
          border-color: #000 !important;
          background-color: #fff !important;
        }
        .newsletter-submit:hover {
          transform: translateY(-50%) scale(1.05) !important;
          background-color: #1f2937 !important;
        }
        .newsletter-submit:hover .newsletter-arrow {
          transform: translateX(3px);
        }
        .newsletter-arrow {
          transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 1280px) {
          h2 {
            font-size: 88px !important;
          }
        }
      `}</style>
    </section>
  );
}
