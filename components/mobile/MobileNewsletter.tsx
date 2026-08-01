'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * MobileNewsletter — premium email capture.
 *
 * Black card with white text. Email input + arrow submit button.
 * "Sign up and save" headline. Premium pill input with black submit circle.
 *
 * LN KICKS theme: black card, white text, gold accent dot.
 */
export default function MobileNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <section style={{ padding: '40px 18px 28px' }}>
      <div
        style={{
          background: '#0A0A0A',
          borderRadius: 28,
          padding: '32px 24px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Background watermark */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -30,
            right: -10,
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 120,
            fontWeight: 900,
            color: 'rgba(255,255,255,0.04)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          LK
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              letterSpacing: '0.28em',
              margin: '0 0 12px 0',
            }}
          >
            Members Only
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.1,
              margin: '0 0 10px 0',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            Sign up<br />and save 10%
          </h2>
          <p
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.7)',
              margin: '0 0 24px 0',
              lineHeight: 1.5,
            }}
          >
            Be first to access new drops, private sales, and member-only sneakers.
          </p>

          <form
            onSubmit={onSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 999,
              padding: '6px 6px 6px 18px',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'inherit',
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              aria-label="Subscribe"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#ffffff',
                color: '#0A0A0A',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="mnews-submit"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          {submitted && (
            <p
              style={{
                fontSize: 12,
                color: '#ffffff',
                fontWeight: 600,
                margin: '14px 0 0 0',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 12,
                textAlign: 'center',
              }}
            >
              Thanks! Check your inbox to confirm.
            </p>
          )}

          <p
            style={{
              fontSize: 10.5,
              color: 'rgba(255,255,255,0.45)',
              margin: '14px 0 0 0',
              lineHeight: 1.5,
            }}
          >
            By subscribing you agree to our{' '}
            <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <style jsx>{`
        .mnews-submit:hover {
          transform: scale(1.05);
        }
        .mnews-submit:active {
          transform: scale(0.96);
        }
      `}</style>
    </section>
  );
}
