'use client';

import React from 'react';
import Link from 'next/link';

/**
 * HeroBanner — full-width rounded-[3rem] dark hero with background image,
 * right-aligned "STOCKED & LOADED" headline, and white "Shop Now" CTA.
 *
 * Stitch design specs:
 *  - section: px-4 py-4, lg:px-6
 *  - container: rounded-[2rem] lg:rounded-[3rem], h 500-700px, bg black
 *  - img: w-full h-full object-cover opacity-80
 *  - headline: text-5xl lg:text-8xl font-black leading-[0.9] uppercase
 *  - sub: text-base lg:text-xl font-serif-italic
 *  - CTA: bg-white text-black px-12 py-5 text-sm uppercase tracking-widest
 */
const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw';

export default function HeroBanner() {
  return (
    <section style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px' }}>
      <div
        className="hero-container"
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '48px',
          height: '700px',
          background: '#000000',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMG}
          alt="Stocked and Loaded — finest collection of hyped and luxury sneakers"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.8,
            transform: 'scale(1.02)',
            transition: 'transform 1200ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        {/* Gradient overlay for text legibility (premium enhancement) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.25) 100%)',
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
            paddingRight: '128px',
          }}
        >
          <div style={{ maxWidth: '560px', textAlign: 'right' }}>
            <h1
              className="hero-headline"
              style={{
                fontSize: '128px',
                fontWeight: 900,
                lineHeight: 0.9,
                textTransform: 'uppercase',
                marginBottom: '16px',
                color: '#ffffff',
                letterSpacing: '-0.04em',
                margin: '0 0 16px',
              }}
            >
              STOCKED &amp;
              <br />
              LOADED
            </h1>
            <p
              style={{
                fontSize: '20px',
                fontStyle: 'italic',
                marginBottom: '48px',
                color: 'rgba(255,255,255,0.9)',
                margin: '0 0 48px',
              }}
            >
              Finest collection of hyped and luxury.
            </p>
            <Link
              href="/category-products"
              className="hero-cta"
              style={{
                display: 'inline-block',
                background: '#ffffff',
                color: '#000000',
                paddingLeft: '48px',
                paddingRight: '48px',
                paddingTop: '20px',
                paddingBottom: '20px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                transition: 'background-color 250ms ease, transform 250ms cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-container:hover img {
          transform: scale(1.04);
        }
        .hero-cta:hover {
          background-color: #e5e7eb !important;
          transform: translateY(-1px);
        }
        @media (max-width: 1280px) {
          .hero-headline {
            font-size: 96px !important;
          }
        }
        @media (max-width: 1024px) {
          .hero-headline {
            font-size: 72px !important;
          }
        }
      `}</style>
    </section>
  );
}
