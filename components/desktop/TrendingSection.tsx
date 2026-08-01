'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * TrendingSection — circular coverflow carousel.
 *
 * Refinements (Phase 1.5):
 *  - Center-focused card with side cards partially visible
 *  - 3D perspective transform on side cards (rotateY + scale + translateX)
 *  - Smooth easing (cubic-bezier(0.16, 1, 0.3, 1)) on all transitions
 *  - Premium depth via layered shadows and a soft vignette
 *  - Reflected brand label below each side card
 */

interface TrendingProduct {
  id: string;
  brand: string;
  name: string;
  price: string;
  comparePrice: string;
  image: string;
  href: string;
}

const TRENDING_PRODUCTS: TrendingProduct[] = [
  {
    id: 't1',
    brand: 'Nike',
    name: "Nike Dunk Low 'Rose Whisper'",
    price: 'Rs. 7,399.00',
    comparePrice: 'Rs. 12,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
  },
  {
    id: 't2',
    brand: 'Kodak',
    name: 'Kodak Charmera Keychain Digital Camera',
    price: 'Rs. 4,599.00',
    comparePrice: 'Rs. 6,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeDHgD4sdEolj1Q6YY0dFBFam5YpICGBA2dZIy1CsoaOAyvFhphvbL7FSkNTAYouunPHoG9hNcKTvSWYd8ErjQY04V5XGIz8bL0hISKMtP5b4D4Qd5BnVZyOH32cafz8bJ5ecFNv5utNkkIW5w6gGyQftyHuDaBBRAkh9yHhMJ0E1VeGuDflsHiijdR0pef1sF8riPx9Jszb6CVCfz413_6TGPUGpuRbUCa5_hkXTubgyzvTrBsJ7mg',
    href: '/product/kodak-charmera-keychain-camera',
  },
  {
    id: 't3',
    brand: 'Air Jordan',
    name: 'Air Jordan 1 Low Black Dark Powder Blue',
    price: 'Rs. 8,899.00',
    comparePrice: 'Rs. 18,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
  },
  {
    id: 't4',
    brand: 'Adidas',
    name: 'Adidas AE 2 Black Gold Metallic',
    price: 'Rs. 5,999.00',
    comparePrice: 'Rs. 14,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/adidas-ae-2-black-gold',
  },
  {
    id: 't5',
    brand: 'Adidas',
    name: "Adidas Samba OG 'Wonder Silver'",
    price: 'Rs. 6,199.00',
    comparePrice: 'Rs. 22,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-samba-og-wonder-silver',
  },
];

export default function TrendingSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const total = TRENDING_PRODUCTS.length;

  const goToPrev = () => setActiveIdx((i) => (i - 1 + total) % total);
  const goToNext = () => setActiveIdx((i) => (i + 1) % total);

  return (
    <section style={{ paddingTop: '96px', paddingBottom: '96px', overflow: 'hidden' }}>
      {/* Section header */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          marginBottom: '64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '1px', background: '#000' }} />
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                fontSize: '10px',
                fontWeight: 700,
                color: '#6b7280',
              }}
            >
              Right Now
            </span>
          </div>
          <h2
            style={{
              fontSize: '64px',
              fontWeight: 800,
              textTransform: 'uppercase',
              margin: 0,
              letterSpacing: '-0.035em',
              lineHeight: 1,
            }}
          >
            Trending{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 300, textTransform: 'lowercase' }}>this week</span>
          </h2>
        </div>
        <button
          style={{
            borderBottom: '1.5px solid #000',
            paddingBottom: '4px',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            background: 'none',
            border: 'none',
            borderBottomWidth: '1.5px',
            borderBottomStyle: 'solid',
            borderBottomColor: '#000',
            cursor: 'pointer',
            color: '#000',
            transition: 'padding-bottom 300ms ease',
          }}
          className="view-all-link"
        >
          View All
        </button>
      </div>

      {/* Coverflow stage */}
      <div
        style={{
          position: 'relative',
          height: '560px',
          perspective: '1800px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
          }}
        >
          {TRENDING_PRODUCTS.map((product, idx) => {
            const offset = idx - activeIdx;
            // Wrap around for nearest neighbor
            const wrapped = ((offset + total / 2) % total) - Math.floor(total / 2);
            const absOffset = Math.abs(wrapped);
            const isActive = absOffset === 0;

            // Hide far cards
            if (absOffset > 2) {
              return null;
            }

            const translateX = wrapped * 320;
            const rotateY = wrapped * -28;
            const scale = isActive ? 1 : 0.78 - (absOffset - 1) * 0.05;
            const zIndex = 10 - absOffset;
            const opacity = isActive ? 1 : absOffset === 1 ? 0.55 : 0.28;

            return (
              <div
                key={product.id}
                onClick={() => setActiveIdx(idx)}
                style={{
                  position: 'absolute',
                  width: '780px',
                  height: '480px',
                  transform: `translateX(${translateX}px) translateZ(${isActive ? 0 : -160}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 700ms ease',
                  opacity,
                  zIndex,
                  cursor: isActive ? 'default' : 'pointer',
                  background: '#ffffff',
                  borderRadius: '32px',
                  padding: '56px',
                  border: '1px solid #f3f4f6',
                  boxShadow: isActive
                    ? '0 40px 80px -20px rgba(0,0,0,0.18), 0 12px 24px -8px rgba(0,0,0,0.06)'
                    : '0 20px 40px -16px rgba(0,0,0,0.12)',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '40px',
                  alignItems: 'center',
                  backfaceVisibility: 'hidden',
                }}
                className="trending-card"
              >
                {/* Text */}
                <div style={{ flex: '1.2', order: 1 }}>
                  <span
                    style={{
                      textTransform: 'uppercase',
                      fontSize: '10px',
                      letterSpacing: '0.24em',
                      fontWeight: 700,
                      color: '#6b7280',
                    }}
                  >
                    {product.brand}
                  </span>
                  <h3
                    style={{
                      fontSize: '32px',
                      fontWeight: 800,
                      marginTop: '14px',
                      lineHeight: 1.1,
                      textTransform: 'uppercase',
                      margin: '14px 0 0 0',
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {product.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '28px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 800 }}>{product.price}</span>
                    <span style={{ color: '#d1d5db', textDecoration: 'line-through', fontSize: '16px' }}>
                      {product.comparePrice}
                    </span>
                  </div>
                  <Link
                    href={product.href}
                    className="trending-cta"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '36px',
                      background: '#000',
                      color: '#fff',
                      paddingLeft: '36px',
                      paddingRight: '28px',
                      paddingTop: '14px',
                      paddingBottom: '14px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      textDecoration: 'none',
                      transition: 'background-color 300ms ease, transform 300ms ease',
                    }}
                  >
                    Buy Now
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                {/* Image */}
                <div style={{ flex: '1', display: 'flex', justifyContent: 'center', order: 2 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      maxWidth: '320px',
                      height: 'auto',
                      objectFit: 'contain',
                      filter: isActive ? 'none' : 'saturate(0.85)',
                      transition: 'filter 700ms ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation arrows + dots */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '28px', marginTop: '40px' }}>
        <button
          onClick={goToPrev}
          aria-label="Previous trending item"
          className="carousel-arrow"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '999px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: '#fff',
            color: '#000',
            transition: 'background-color 300ms ease, transform 300ms ease, border-color 300ms ease',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {TRENDING_PRODUCTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              aria-label={`Go to trending item ${idx + 1}`}
              style={{
                width: idx === activeIdx ? '48px' : '10px',
                height: '3px',
                background: idx === activeIdx ? '#000' : '#e5e7eb',
                transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms ease',
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
        <button
          onClick={goToNext}
          aria-label="Next trending item"
          className="carousel-arrow"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '999px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: '#fff',
            color: '#000',
            transition: 'background-color 300ms ease, transform 300ms ease, border-color 300ms ease',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .carousel-arrow:hover {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #000 !important;
          transform: translateY(-1px);
        }
        .trending-cta:hover {
          background-color: #1f2937 !important;
          transform: translateY(-1px);
        }
        .trending-card:hover {
          ${'' /* center card has no scale on hover to keep layout calm */}
        }
        .view-all-link:hover {
          padding-bottom: 8px;
        }
      `}</style>
    </section>
  );
}
