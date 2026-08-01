'use client';

import React from 'react';

/**
 * StatsMarquee — continuous horizontal marquee of brand stats.
 *
 * Refinements (Phase 1.5):
 *  - Replaces static 4-col grid with an infinite horizontal marquee
 *  - Two track copies stitched together for seamless loop
 *  - Pure CSS keyframes — no JS, no scroll listeners
 *  - Pauses on hover for accessibility
 */

interface Stat {
  icon: React.ReactNode;
  headline: string;
  label: string;
}

const STATS: Stat[] = [
  {
    icon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.31.17-.69.17-1 0l-7.97-4.44c-.31-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.97-4.44c.31-.17.69-.17 1 0l7.97 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5L12 10.85l5.96-3.35L12 4.15z" />
      </svg>
    ),
    headline: '50,000+',
    label: 'Unique SKUs',
  },
  {
    icon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
    headline: 'Verified',
    label: 'Authenticity Guaranteed',
  },
  {
    icon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    headline: '100,000+',
    label: 'Customers Served',
  },
  {
    icon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
      </svg>
    ),
    headline: 'Flagship',
    label: 'Rajpur Road, Dehradun',
  },
  {
    icon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    headline: '4.9 ★',
    label: '8,000+ Verified Reviews',
  },
  {
    icon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    headline: 'Free Shipping',
    label: 'On All Prepaid Orders',
  },
];

export default function TrustBadges() {
  // Duplicate the list so the loop is seamless
  const track = [...STATS, ...STATS];

  return (
    <section
      style={{
        paddingTop: '40px',
        paddingBottom: '40px',
        borderTop: '1px solid #f3f4f6',
        borderBottom: '1px solid #f3f4f6',
        overflow: 'hidden',
        background: '#ffffff',
      }}
    >
      <div className="marquee-wrap">
        <div className="marquee-track">
          {track.map((stat, idx) => (
            <div
              key={idx}
              className="marquee-item"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '18px',
                padding: '0 48px',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  background: '#f7f7f7',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 800,
                    fontSize: '22px',
                    lineHeight: 1,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    ...(stat.headline === 'Verified' || stat.headline === 'Flagship'
                      ? { fontStyle: 'italic', textTransform: 'uppercase' }
                      : {}),
                  }}
                >
                  {stat.headline}
                </p>
                <p
                  style={{
                    fontSize: '9px',
                    color: '#9ca3af',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    marginTop: '4px',
                    margin: '4px 0 0 0',
                  }}
                >
                  {stat.label}
                </p>
              </div>
              {/* Separator */}
              <span
                style={{
                  display: 'inline-block',
                  width: '4px',
                  height: '4px',
                  borderRadius: '999px',
                  background: '#e5e7eb',
                  marginLeft: '32px',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-wrap {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .marquee-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: lnk-marquee 38s linear infinite;
          will-change: transform;
        }
        .marquee-wrap:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes lnk-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
