'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { MOBILE_RECOMMENDED } from './mobileProducts';

/**
 * MobileRecommended — "Recommended For You" section.
 *
 * Algorithmic-feel 2-column grid of personalized picks. Premium floating
 * product presentation (no cards, no borders). Each tile: floating
 * sneaker + brand / name / rating / price + Add to Cart CTA.
 *
 * LN KICKS theme: white bg, black text, red price, black CTA pill,
 * black star rating. Minimal luxury.
 */
export default function MobileRecommended() {
  const { addToCart, showToast } = useApp();

  return (
    <section style={{ paddingTop: 36 }}>
      <div
        style={{
          padding: '0 18px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 18,
          gap: 12,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.28em',
              margin: '0 0 8px 0',
            }}
          >
            Picked For You
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: 26,
              fontWeight: 800,
              color: '#0A0A0A',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            Recommended
          </h2>
        </div>
        <Link
          href="/products?filter=recommended"
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#0A0A0A',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            paddingBottom: 2,
            borderBottom: '1.5px solid #0A0A0A',
          }}
        >
          See All
        </Link>
      </div>

      <div
        style={{
          padding: '0 18px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        {MOBILE_RECOMMENDED.map((p) => (
          <article
            key={p.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Floating image — NO card */}
            <Link
              href={p.href}
              aria-label={`${p.brand} ${p.name} — ${p.price}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 140,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                draggable={false}
                className="mrec-img"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 22px rgba(0,0,0,0.13))',
                  transition:
                    'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), filter 400ms ease',
                }}
              />
            </Link>

            <div style={{ textAlign: 'center', marginTop: 14, width: '100%' }}>
              <p
                style={{
                  fontSize: 10,
                  color: '#9ca3af',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  margin: '0 0 4px 0',
                }}
              >
                {p.brand}
              </p>
              <Link href={p.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#0A0A0A',
                    lineHeight: 1.35,
                    margin: '0 0 6px 0',
                    minHeight: 36,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {p.name}
                </h3>
              </Link>

              {/* Rating row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  marginBottom: 8,
                }}
              >
                <Stars rating={p.rating || 5} />
                <span
                  style={{
                    fontSize: 10,
                    color: '#9ca3af',
                    fontWeight: 600,
                    marginLeft: 2,
                  }}
                >
                  {p.rating?.toFixed(1) || '5.0'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  flexWrap: 'wrap',
                  marginBottom: 12,
                }}
              >
                <span style={{ color: '#DC2626', fontWeight: 700, fontSize: 13 }}>{p.price}</span>
                {p.comparePrice && (
                  <span
                    style={{
                      color: '#9ca3af',
                      fontSize: 11,
                      textDecoration: 'line-through',
                      fontWeight: 400,
                    }}
                  >
                    {p.comparePrice}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  addToCart({
                    id: p.id,
                    name: p.name,
                    price: p.priceValue,
                    image: p.image,
                    qty: 1,
                  });
                  showToast(`${p.name} added to cart`);
                }}
                className="mrec-cta"
                style={{
                  width: '100%',
                  background: '#0A0A0A',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 999,
                  padding: '10px 12px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition:
                    'background-color 280ms cubic-bezier(0.16, 1, 0.3, 1), transform 280ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                aria-label={`Add ${p.name} to cart`}
              >
                Add to Cart
                <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.6}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .mrec-img:hover {
          transform: translateY(-6px);
          filter: drop-shadow(0 22px 30px rgba(0, 0, 0, 0.18));
        }
        .mrec-cta:hover {
          background-color: #1f1f1f !important;
          transform: translateY(-1px);
        }
        .mrec-cta:focus-visible {
          outline: 2px solid #0a0a0a;
          outline-offset: 3px;
        }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Stars — 5-star rating display (0.5 step).
 *  Black filled stars, soft grey empty stars. Compact 12px size.
 * ────────────────────────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        const isHalf = i === full && half;
        return (
          <svg
            key={i}
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill={filled || isHalf ? '#0A0A0A' : 'none'}
            stroke={filled || isHalf ? '#0A0A0A' : '#d1d5db'}
            strokeWidth="2"
            aria-hidden
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
}
