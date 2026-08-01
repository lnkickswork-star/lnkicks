'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * HeroBanner — premium sneaker editorial hero.
 *
 * Refinements (Phase 1.5):
 *  - Studio-grade luxury lighting via layered radial gradients
 *  - Editorial typography: oversized condensed wordmark + italic kicker
 *  - Refined CTA: pill with arrow, micro lift on hover
 *  - Subtle parallax: image drifts + scales on scroll
 *  - Wordmark fades-up on mount (single, smooth, no looping noise)
 */
const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw';

export default function HeroBanner() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (imgRef.current && y < 800) {
          imgRef.current.style.transform = `scale(${1.04 + y * 0.0002}) translate3d(0, ${y * 0.12}px, 0)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section style={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '16px', paddingBottom: '16px' }}>
      <div
        className="hero-container"
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '32px',
          height: '720px',
          background: '#000000',
        }}
      >
        {/* Background image with subtle parallax */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={HERO_IMG}
          alt="LN KICKS — stocked and loaded luxury sneaker editorial"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.78,
            transform: 'scale(1.04)',
            transition: 'transform 1200ms cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform',
          }}
        />

        {/* Luxury lighting — layered radial gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 30% 30%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 60%),' +
              'radial-gradient(ellipse 60% 80% at 70% 80%, rgba(20,20,20,0.45) 0%, rgba(0,0,0,0) 60%),' +
              'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.35) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hairline grain texture for editorial depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 3px)',
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: '120px',
          }}
        >
          <div
            className={`hero-copy ${mounted ? 'is-mounted' : ''}`}
            style={{ maxWidth: '600px', textAlign: 'right' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '28px',
                padding: '8px 14px',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '999px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '999px', opacity: 0.9 }} />
              <span
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 600,
                }}
              >
                Curated · Authenticated · Loaded
              </span>
            </div>
            <h1
              style={{
                fontSize: '128px',
                fontWeight: 800,
                lineHeight: 0.9,
                textTransform: 'uppercase',
                marginBottom: '24px',
                color: '#ffffff',
                letterSpacing: '-0.045em',
                margin: '0 0 24px',
              }}
            >
              STOCKED
              <br />
              <span style={{ fontStyle: 'italic', fontWeight: 300, opacity: 0.85 }}>&amp;</span> LOADED
            </h1>
            <p
              style={{
                fontSize: '18px',
                fontStyle: 'italic',
                marginBottom: '44px',
                color: 'rgba(255,255,255,0.85)',
                margin: '0 0 44px',
                fontWeight: 300,
                letterSpacing: '0.01em',
              }}
            >
              The finest edit of hyped &amp; luxury sneakers in India.
            </p>
            <Link
              href="/category-products"
              className="hero-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                background: '#ffffff',
                color: '#000000',
                paddingLeft: '40px',
                paddingRight: '32px',
                paddingTop: '18px',
                paddingBottom: '18px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                textDecoration: 'none',
                borderRadius: '999px',
                transition: 'background-color 350ms ease, transform 350ms cubic-bezier(0.16,1,0.3,1), box-shadow 350ms ease',
                boxShadow: '0 12px 32px -8px rgba(0,0,0,0.4)',
              }}
            >
              Shop the Drop
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="hero-cta-arrow">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-copy {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 900ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-copy.is-mounted {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-cta:hover {
          background-color: #f0f0f0 !important;
          transform: translateY(-2px);
          box-shadow: 0 18px 40px -8px rgba(0,0,0,0.5) !important;
        }
        .hero-cta:hover .hero-cta-arrow {
          transform: translateX(4px);
        }
        .hero-cta-arrow {
          transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 1280px) {
          .hero-copy h1 {
            font-size: 96px !important;
          }
        }
        @media (max-width: 1024px) {
          .hero-copy h1 {
            font-size: 72px !important;
          }
        }
      `}</style>
    </section>
  );
}
