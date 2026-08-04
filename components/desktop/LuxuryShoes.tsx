'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCardActions from './ProductCardActions';

/**
 * LuxuryShoes — filterable horizontal carousel of luxury sneaker cards.
 *
 * Refinements (Phase 2):
 *  - Whole card is a single <Link> (no dead click areas)
 *  - Brand-theme price (black) — matches LN KICKS identity
 *  - Per-card Wishlist + Quick View + Add to Cart actions
 *    (uses shared ProductCardActions component)
 *  - Each card has tall editorial image with hover scale
 *  - Premium typography, ultra-luxury card treatment
 *  - Filter pills refined (active = black/white, hover = subtle bg)
 */

interface Shoe {
  id: string;
  brand: string;
  name: string;
  price: string;
  /** Numeric price used for cart line items (INR). */
  priceValue: number;
  image: string;
  badge?: string;
  href: string;
}

const SHOES: Shoe[] = [
  {
    id: 's1',
    brand: 'Louis Vuitton',
    name: 'LV Trainer Sneaker',
    price: 'Rs. 1,49,000',
    priceValue: 149000,
    badge: 'New',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/lv-trainer-sneaker',
  },
  {
    id: 's2',
    brand: 'Gucci',
    name: 'Gucci Screener Sneaker',
    price: 'Rs. 88,999',
    priceValue: 88999,
    badge: 'Monsoon Sale',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/gucci-screener-sneaker',
  },
  {
    id: 's3',
    brand: 'Prada',
    name: 'Prada America\'s Cup Sneaker',
    price: 'Rs. 1,12,000',
    priceValue: 112000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/prada-americas-cup-sneaker',
  },
  {
    id: 's4',
    brand: 'Balenciaga',
    name: 'Balenciaga Triple S Sneaker',
    price: 'Rs. 95,000',
    priceValue: 95000,
    badge: 'New',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/balenciaga-triple-s-sneaker',
  },
  {
    id: 's5',
    brand: 'Dior',
    name: 'Dior B23 High-Top Sneaker',
    price: 'Rs. 1,28,000',
    priceValue: 128000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeDHgD4sdEolj1Q6YY0dFBFam5YpICGBA2dZIy1CsoaOAyvFhphvbL7FSkNTAYouunPHoG9hNcKTvSWYd8ErjQY04V5XGIz8bL0hISKMtP5b4D4Qd5BnVZyOH32cafz8bJ5ecFNv5utNkkIW5w6gGyQftyHuDaBBRAkh9yHhMJ0E1VeGuDflsHiijdR0pef1sF8riPx9Jszb6CVCfz413_6TGPUGpuRbUCa5_hkXTubgyzvTrBsJ7mg',
    href: '/product/dior-b23-high-top-sneaker',
  },
];

const FILTERS = ['All', 'Louis Vuitton', 'Gucci', 'Prada', 'Balenciaga', 'Dior'];

export default function LuxuryShoes() {
  const [activeFilter, setActiveFilter] = useState(0);

  const visibleShoes =
    activeFilter === 0 ? SHOES : SHOES.filter((s) => s.brand === FILTERS[activeFilter]);

  return (
    <section style={{ paddingTop: '128px', paddingBottom: '128px', background: '#ffffff' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Header + filter pills */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.28em',
              marginBottom: '16px',
              margin: '0 0 16px 0',
            }}
          >
            Designer Vault
          </p>
          <h2
            style={{
              fontSize: '80px',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '40px',
              letterSpacing: '-0.045em',
              margin: '0 0 40px 0',
              lineHeight: 1,
            }}
          >
            Luxury Shoes
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {FILTERS.map((filter, idx) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(idx)}
                className="filter-pill"
                style={{
                  background: idx === activeFilter ? '#000' : 'transparent',
                  color: idx === activeFilter ? '#fff' : '#000',
                  paddingLeft: '28px',
                  paddingRight: '28px',
                  paddingTop: '13px',
                  paddingBottom: '13px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  border: '1px solid ' + (idx === activeFilter ? '#000' : '#e5e7eb'),
                  cursor: 'pointer',
                  transition: 'background-color 300ms ease, color 300ms ease, border-color 300ms ease',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Shoe carousel */}
        <div
          className="shoe-carousel"
          style={{
            display: 'flex',
            gap: '32px',
            overflowX: 'auto',
            paddingBottom: '24px',
            scrollbarWidth: 'none',
          }}
        >
          {visibleShoes.map((shoe) => (
            <div key={shoe.id} style={{ minWidth: '380px', flexShrink: 0 }} className="shoe-card">
              <Link
                href={shoe.href}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div
                  style={{
                    background: '#f8f8f8',
                    borderRadius: '24px',
                    padding: '32px',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '440px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {shoe.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        background: '#000',
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '6px 14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        borderRadius: '999px',
                        zIndex: 10,
                      }}
                    >
                      {shoe.badge}
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shoe.image}
                    alt={shoe.name}
                    className="shoe-img"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1), filter 700ms ease',
                      filter: 'saturate(0.95)',
                    }}
                  />
                </div>
              </Link>
              <div style={{ marginTop: '28px', textAlign: 'center' }}>
                <p
                  style={{
                    fontSize: '9px',
                    color: '#9ca3af',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.22em',
                    marginBottom: '8px',
                    margin: '0 0 8px 0',
                  }}
                >
                  {shoe.brand}
                </p>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    margin: '0 0 8px 0',
                  }}
                >
                  <Link href={shoe.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {shoe.name}
                  </Link>
                </h3>
                <p style={{ marginTop: '0', color: '#000', fontWeight: 700, fontSize: '14px', margin: '0 0 14px 0' }}>
                  {shoe.price}
                </p>
                {/* Card-style Add to Cart CTA below the price.
                    Single primary CTA per user spec — the floating overlay
                    pill above the image has been removed. */}
                <div
                  style={{ display: 'flex', justifyContent: 'center' }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <ProductCardActions product={shoe} layout="card" variant="light" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .shoe-carousel::-webkit-scrollbar {
          display: none;
        }
        .shoe-card:hover .shoe-img {
          transform: scale(1.06);
          filter: saturate(1.05);
        }
        .filter-pill:hover {
          background-color: #f3f4f6 !important;
          border-color: #d1d5db !important;
        }
      `}</style>
    </section>
  );
}
