'use client';

import React, { useState } from 'react';

/**
 * Newsletter — oversized "Stay Ahead of Every Drop" email capture.
 *
 * Refinements (Phase 2):
 *  - New heading: "Stay Ahead of Every Drop"
 *  - New subtext: "Get exclusive early access, restock alerts, member-only
 *    releases and offers."
 *  - Submit button shows "Subscribe" label + arrow that slides on hover.
 *  - Success animation: button morphs to a green-bordered check that
 *    pops in (scale 0.4 → 1.15 → 1 over 480ms).
 *  - Refined input: focus state shows full border, not just outline.
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
      }, 3600);
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
            fontSize: 'clamp(48px, 9vw, 120px)',
            fontWeight: 800,
            letterSpacing: '-0.045em',
            marginBottom: '32px',
            lineHeight: 0.9,
            textTransform: 'uppercase',
            margin: '0 0 32px 0',
          }}
        >
          Stay Ahead
          <br />
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>of every</span> drop
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
            ? "You're on the list — check your inbox for a welcome discount."
            : 'Get exclusive early access, restock alerts, member-only releases and offers.'}
        </p>
        <form onSubmit={handleSubmit} style={{ position: 'relative', maxWidth: '672px', margin: '0 auto' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={submitted ? "✓  You're on the list — welcome." : 'Enter your email'}
            required
            aria-label="Email address"
            style={{
              width: '100%',
              background: submitted ? '#f0fdf4' : '#f9fafb',
              border: submitted
                ? '1.5px solid rgba(34,197,94,0.6)'
                : '1.5px solid transparent',
              borderRadius: '999px',
              paddingTop: '28px',
              paddingBottom: '28px',
              paddingLeft: '44px',
              paddingRight: '160px',
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
              height: '60px',
              paddingLeft: '24px',
              paddingRight: '24px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1), background-color 350ms ease',
            }}
          >
            {submitted ? (
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                className="newsletter-check"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <>
                Subscribe
                <svg
                  width={20}
                  height={20}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="newsletter-arrow"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
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
          transform: translateY(-50%) scale(1.03) !important;
          background-color: #1f2937 !important;
        }
        .newsletter-submit:hover .newsletter-arrow {
          transform: translateX(3px);
        }
        .newsletter-arrow {
          transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .newsletter-check {
          animation: newsletter-check-pop 480ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes newsletter-check-pop {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          60% {
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
