'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import type { MobileProduct } from './mobileProducts';

/**
 * MobileProductSlider — reusable horizontal product slider for mobile.
 *
 * Premium floating-product presentation on pure white. NO cards, NO borders,
 * NO box-shadows on containers. Only soft drop-shadow on the image itself.
 *
 * Per-product: image / brand / name / price + strikethrough / single CTA.
 *
 * Interaction: native touch scroll (CSS scroll-snap), pointer drag for mouse,
 * wheel for trackpad. Smooth momentum. Snap-to-card.
 *
 * LN KICKS theme: white bg, black text, red price, black CTA pill.
 */
interface MobileProductSliderProps {
  title: string;
  eyebrow?: string;
  products: MobileProduct[];
  /** Card width on mobile (px). Default 200. */
  cardWidth?: number;
  /** Show "See all" link on the right of the title. */
  seeAllHref?: string;
  /** Compact card variant (smaller image, no CTA). Default false. */
  compact?: boolean;
}

export default function MobileProductSlider({
  title,
  eyebrow,
  products,
  cardWidth = 190,
  seeAllHref,
  compact = false,
}: MobileProductSliderProps) {
  const { addToCart, showToast } = useApp();
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Hide scrollbars but keep scrollability
  return (
    <section style={{ paddingTop: 36, paddingBottom: 8 }}>
      {/* Title row */}
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
        <div style={{ flex: 1, minWidth: 0 }}>
          {eyebrow && (
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
              {eyebrow}
            </p>
          )}
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
            {title}
          </h2>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
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
        )}
      </div>

      {/* Horizontal scroller */}
      <div
        ref={scrollerRef}
        className="mps-scroller"
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: '4px 18px 12px',
          margin: '0 -0px',
          cursor: 'grab',
        }}
      >
        {products.map((p) => (
          <article
            key={p.id}
            style={{
              flex: `0 0 ${cardWidth}px`,
              maxWidth: cardWidth,
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              userSelect: 'none',
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
                height: compact ? 130 : 160,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                draggable={false}
                className="mps-img"
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

            {/* Text block */}
            <div
              style={{
                textAlign: 'center',
                marginTop: compact ? 12 : 16,
                width: '100%',
                padding: '0 4px',
              }}
            >
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
                    margin: '0 0 8px 0',
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  flexWrap: 'wrap',
                  marginBottom: compact ? 0 : 12,
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
              {!compact && (
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
                  className="mps-cta"
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
              )}
            </div>
          </article>
        ))}
        {/* Trailing spacer so last card can scroll-snap to start */}
        <div aria-hidden style={{ flex: '0 0 18px', height: 1 }} />
      </div>

      <style jsx>{`
        .mps-scroller::-webkit-scrollbar {
          display: none;
        }
        .mps-scroller:active {
          cursor: grabbing;
        }
        .mps-img:hover {
          transform: translateY(-6px);
          filter: drop-shadow(0 22px 30px rgba(0, 0, 0, 0.18));
        }
        .mps-cta:hover {
          background-color: #1f1f1f !important;
          transform: translateY(-1px);
        }
        .mps-cta:focus-visible {
          outline: 2px solid #0a0a0a;
          outline-offset: 3px;
        }
      `}</style>
    </section>
  );
}
