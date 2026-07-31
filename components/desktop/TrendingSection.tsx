'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * TrendingSection — horizontal carousel with one large featured product card
 * flanked by two smaller faded product cards. Includes dot navigation.
 *
 * Stitch design specs:
 *  - section: py-20
 *  - header: "Trending this week" 4xl/6xl black uppercase, "View All" link
 *  - carousel: horizontal scroll, featured card 800px wide w/ shadow
 *  - side cards: opacity-40 scale-90
 *  - nav: 48px round buttons + 3 dot indicators (48px x 3px)
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
    name: 'Dunk Low Rose',
    price: 'Rs. 7,399.00',
    comparePrice: 'Rs. 12,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
  },
  {
    id: 't2',
    brand: 'Kicks Machine',
    name: 'Kodak Charmera Keychain Digital Camera - Millennium',
    price: 'Rs. 4,599.00',
    comparePrice: 'Rs. 6,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeDHgD4sdEolj1Q6YY0dFBFam5YpICGBA2dZIy1CsoaOAyvFhphvbL7FSkNTAYouunPHoG9hNcKTvSWYd8ErjQY04V5XGIz8bL0hISKMtP5b4D4Qd5BnVZyOH32cafz8bJ5ecFNv5utNkkIW5w6gGyQftyHuDaBBRAkh9yHhMJ0E1VeGuDflsHiijdR0pef1sF8riPx9Jszb6CVCfz413_6TGPUGpuRbUCa5_hkXTubgyzvTrBsJ7mg',
    href: '/product/kodak-charmera-keychain-camera',
  },
  {
    id: 't3',
    brand: 'Nike',
    name: 'AJ1 Low Powder Blue',
    price: 'Rs. 8,899.00',
    comparePrice: 'Rs. 18,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
  },
];

export default function TrendingSection() {
  const [activeIdx, setActiveIdx] = useState(1); // Start with featured (middle) item

  const handleClickPrev = () => setActiveIdx((prev) => Math.max(0, prev - 1));
  const handleClickNext = () => setActiveIdx((prev) => Math.min(TRENDING_PRODUCTS.length - 1, prev + 1));

  return (
    <section style={{ paddingTop: '80px', paddingBottom: '80px', overflow: 'hidden' }}>
      {/* Section header */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          marginBottom: '48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '1px', background: '#000' }} />
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '10px',
                fontWeight: 700,
                color: '#9ca3af',
              }}
            >
              Right Now
            </span>
          </div>
          <h2 style={{ fontSize: '60px', fontWeight: 900, textTransform: 'uppercase', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
            Trending{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 500, textTransform: 'lowercase' }}>this week</span>
          </h2>
        </div>
        <button
          style={{
            borderBottom: '2px solid #000',
            paddingBottom: '4px',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            background: 'none',
            border: 'none',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: '#000',
            cursor: 'pointer',
            color: '#000',
          }}
        >
          View All
        </button>
      </div>

      {/* Carousel */}
      <div
        className="carousel-container"
        style={{
          display: 'flex',
          gap: '32px',
          overflowX: 'auto',
          paddingLeft: '15%',
          paddingRight: '15%',
          paddingBottom: '40px',
          scrollbarWidth: 'none',
        }}
      >
        {TRENDING_PRODUCTS.map((product, idx) => {
          const isFeatured = idx === activeIdx;
          return (
            <div
              key={product.id}
              style={{
                minWidth: isFeatured ? '800px' : '320px',
                opacity: isFeatured ? 1 : 0.4,
                transform: isFeatured ? 'scale(1)' : 'scale(0.9)',
                transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                ...(isFeatured
                  ? {
                      background: '#ffffff',
                      borderRadius: '40px',
                      padding: '64px',
                      border: '1px solid #f3f4f6',
                      boxShadow: '0 32px 64px -12px rgba(0,0,0,0.08)',
                      flexDirection: 'row',
                      gap: '48px',
                    }
                  : {}),
              }}
            >
              {isFeatured ? (
                <>
                  {/* Featured: text left, image right */}
                  <div style={{ flex: '3', order: 1 }}>
                    <span
                      style={{
                        textTransform: 'uppercase',
                        fontSize: '10px',
                        letterSpacing: '0.15em',
                        fontWeight: 700,
                        color: '#9ca3af',
                      }}
                    >
                      Kicks Machine
                    </span>
                    <h3
                      style={{
                        fontSize: '36px',
                        fontWeight: 900,
                        marginTop: '16px',
                        lineHeight: 1.1,
                        textTransform: 'uppercase',
                        margin: '16px 0 0 0',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {product.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '32px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 900 }}>{product.price}</span>
                      <span style={{ color: '#d1d5db', textDecoration: 'line-through', fontSize: '18px' }}>
                        {product.comparePrice}
                      </span>
                    </div>
                    <Link
                      href={product.href}
                      className="trending-cta"
                      style={{
                        display: 'inline-block',
                        marginTop: '40px',
                        background: '#000',
                        color: '#fff',
                        paddingLeft: '48px',
                        paddingRight: '48px',
                        paddingTop: '16px',
                        paddingBottom: '16px',
                        borderRadius: '999px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textDecoration: 'none',
                        transition: 'background-color 250ms ease',
                      }}
                    >
                      Buy Now
                    </Link>
                  </div>
                  <div style={{ flex: '2', display: 'flex', justifyContent: 'center', order: 2 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', maxWidth: '350px', height: 'auto', objectFit: 'contain' }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Side card: image + label */}
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '4 / 3',
                      background: '#f9fafb',
                      borderRadius: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px',
                      marginBottom: '24px',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p
                      style={{
                        textTransform: 'uppercase',
                        fontSize: '10px',
                        letterSpacing: '0.15em',
                        fontWeight: 700,
                        color: '#9ca3af',
                        marginBottom: '4px',
                        margin: '0 0 4px 0',
                      }}
                    >
                      KM
                    </p>
                    <h3 style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', margin: 0 }}>{product.name}</h3>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation arrows + dots */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', marginTop: '16px' }}>
        <button
          onClick={handleClickPrev}
          aria-label="Previous trending item"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '999px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'none',
            color: '#000',
            transition: 'background-color 250ms ease',
          }}
          className="carousel-arrow"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {TRENDING_PRODUCTS.map((_, idx) => (
            <span
              key={idx}
              style={{
                width: '48px',
                height: '3px',
                background: idx === activeIdx ? '#000' : '#f3f4f6',
                transition: 'background-color 250ms ease',
              }}
            />
          ))}
        </div>
        <button
          onClick={handleClickNext}
          aria-label="Next trending item"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '999px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'none',
            color: '#000',
            transition: 'background-color 250ms ease',
          }}
          className="carousel-arrow"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .carousel-container::-webkit-scrollbar {
          display: none;
        }
        .carousel-arrow:hover {
          background-color: #f9fafb !important;
        }
        .trending-cta:hover {
          background-color: #1f2937 !important;
        }
      `}</style>
    </section>
  );
}
