'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * LuxuryHandbags — filterable horizontal carousel of luxury bag cards.
 * Each card has a tall gray-bg rounded container with optional sale badge,
 * image with hover scale, and centered name + price below.
 *
 * Stitch design specs:
 *  - section: py-32 bg white
 *  - header: text-7xl font-black "Luxury Handbags"
 *  - filter pills: black active / gray-100 inactive, rounded-full text-[10px]
 *  - card container: min-w 400px, h 450px, bg #f9f9f9, rounded-[2rem], p-10
 *  - hover: image scale-105 duration-700
 *  - sale badge: #b20000, 9px font-black uppercase
 */

interface Bag {
  id: string;
  name: string;
  price: string;
  image: string;
  badge?: string;
  brand: string;
}

const BAGS: Bag[] = [
  {
    id: 'b1',
    brand: 'Coach',
    name: 'Coach Tabby Shoulder Bag 26',
    price: 'Rs. 42,999.00',
    badge: 'Monsoon Sale',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4eF8jmYcVEZ5zwW-ROO080WHnqib7f5VvXlt3XZ0MFT8MtyDOXmSpiwlk7xG-EjTHdxYdHnELWTaJqK5W7Kcrm9ApoNU-VhHxKglioFNQtW1d9QJjf2dOpEX0D2wQnEc3HWu91pKz0TiZLbIbxZA3zmQd_S598Q4k5p5gAhZCyjKzYORu6y5M3ffob-qaOB-ktal5X0b695fhSmkO5ZLGUJdhym_yd65ApeJFPKAP_lw3nFP4iK03dw',
  },
  {
    id: 'b2',
    brand: 'Coach',
    name: 'Coach Signature Monogram Tote',
    price: 'Rs. 38,499.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4eF8jmYcVEZ5zwW-ROO080WHnqib7f5VvXlt3XZ0MFT8MtyDOXmSpiwlk7xG-EjTHdxYdHnELWTaJqK5W7Kcrm9ApoNU-VhHxKglioFNQtW1d9QJjf2dOpEX0D2wQnEc3HWu91pKz0TiZLbIbxZA3zmQd_S598Q4k5p5gAhZCyjKzYORu6y5M3ffob-qaOB-ktal5X0b695fhSmkO5ZLGUJdhym_yd65ApeJFPKAP_lw3nFP4iK03dw',
  },
  {
    id: 'b3',
    brand: 'Coach',
    name: 'Coach Leather Crossbody',
    price: 'Rs. 29,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4eF8jmYcVEZ5zwW-ROO080WHnqib7f5VvXlt3XZ0MFT8MtyDOXmSpiwlk7xG-EjTHdxYdHnELWTaJqK5W7Kcrm9ApoNU-VhHxKglioFNQtW1d9QJjf2dOpEX0D2wQnEc3HWu91pKz0TiZLbIbxZA3zmQd_S598Q4k5p5gAhZCyjKzYORu6y5M3ffob-qaOB-ktal5X0b695fhSmkO5ZLGUJdhym_yd65ApeJFPKAP_lw3nFP4iK03dw',
  },
];

const FILTERS = ['All Coach Bags', 'Michael Kors', 'Kate Spade', 'Jacquemus'];

export default function LuxuryHandbags() {
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <section style={{ paddingTop: '128px', paddingBottom: '128px', background: '#ffffff' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Header + filter pills */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2
            style={{
              fontSize: '72px',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '40px',
              letterSpacing: '-0.04em',
              margin: '0 0 40px 0',
              lineHeight: 1,
            }}
          >
            Luxury Handbags
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            {FILTERS.map((filter, idx) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(idx)}
                className="filter-pill"
                style={{
                  background: idx === activeFilter ? '#000' : '#f3f4f6',
                  color: '#000',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  paddingTop: '14px',
                  paddingBottom: '14px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 250ms ease, color 250ms ease',
                  ...(idx === activeFilter ? { color: '#fff' } : {}),
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Bag carousel */}
        <div
          className="bag-carousel"
          style={{
            display: 'flex',
            gap: '40px',
            overflowX: 'auto',
            paddingBottom: '48px',
            scrollbarWidth: 'none',
          }}
        >
          {BAGS.map((bag) => (
            <div key={bag.id} style={{ minWidth: '400px' }} className="bag-card">
              <div
                style={{
                  background: '#f9f9f9',
                  borderRadius: '32px',
                  padding: '40px',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '450px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {bag.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '24px',
                      left: '24px',
                      background: '#b20000',
                      color: '#fff',
                      fontSize: '9px',
                      fontWeight: 900,
                      padding: '6px 16px',
                      textTransform: 'uppercase',
                      borderRadius: '2px',
                      zIndex: 10,
                    }}
                  >
                    {bag.badge}
                  </span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bag.image}
                  alt={bag.name}
                  className="bag-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                  <Link href="/category-products" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {bag.name}
                  </Link>
                </h3>
                <p style={{ marginTop: '8px', color: '#6b7280', fontWeight: 700, fontSize: '14px', margin: '8px 0 0 0' }}>{bag.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .bag-carousel::-webkit-scrollbar {
          display: none;
        }
        .bag-card:hover .bag-img {
          transform: scale(1.05);
        }
        .filter-pill:hover {
          background-color: #e5e7eb !important;
        }
      `}</style>
    </section>
  );
}
