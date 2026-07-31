'use client';

import React from 'react';
import Link from 'next/link';

/**
 * InstantShipGrid — 4-column product grid with "Instant Ship" badges.
 * Each card has a square product image (white bg, gray border), brand label,
 * product name, and red-accent price with strikethrough compare price.
 *
 * Stitch design specs:
 *  - section: py-24 bg #fcfcfc
 *  - header: text-8xl font-black "Instant Ship" + 20x6 black bar
 *  - grid: 4 cols, gap-x-8 gap-y-16
 *  - card image: aspect-square rounded-2xl white bg gray-100 border, p-8
 *  - badge: absolute top-4 left-4, black bg white text 8px tracking-widest
 *  - hover: image scale-110 duration-500
 *  - CTA: black pill "View All Collection" with arrow, hover:pr-20
 */

interface Product {
  id: string;
  brand: string;
  name: string;
  price: string;
  comparePrice: string;
  badge: string;
  image: string;
  href: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    brand: 'Kicks Machine',
    name: 'Air Jordan 1 Low Black Dark Powder Blue',
    price: 'Rs. 8,899.00',
    comparePrice: 'Rs. 18,999.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
  },
  {
    id: 'p2',
    brand: 'Nike',
    name: "Nike Dunk Low 'Rose Whisper' Sale",
    price: 'Rs. 7,399.00',
    comparePrice: 'Rs. 12,999.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
  },
  {
    id: 'p3',
    brand: 'Adidas Yeezy',
    name: 'Adidas Yeezy Slide Onyx Pure',
    price: 'Rs. 10,499.00',
    comparePrice: 'Rs. 15,999.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-yeezy-slide-onyx-pure',
  },
  {
    id: 'p4',
    brand: 'Kodak',
    name: 'Charmera Digital Camera Keychain',
    price: 'Rs. 4,599.00',
    comparePrice: 'Rs. 6,999.00',
    badge: 'Special',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeDHgD4sdEolj1Q6YY0dFBFam5YpICGBA2dZIy1CsoaOAyvFhphvbL7FSkNTAYouunPHoG9hNcKTvSWYd8ErjQY04V5XGIz8bL0hISKMtP5b4D4Qd5BnVZyOH32cafz8bJ5ecFNv5utNkkIW5w6gGyQftyHuDaBBRAkh9yHhMJ0E1VeGuDflsHiijdR0pef1sF8riPx9Jszb6CVCfz413_6TGPUGpuRbUCa5_hkXTubgyzvTrBsJ7mg',
    href: '/product/kodak-charmera-keychain-camera',
  },
];

export default function InstantShipGrid() {
  return (
    <section style={{ paddingTop: '96px', paddingBottom: '96px', background: '#fcfcfc' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
          <h2
            style={{
              fontSize: '96px',
              fontWeight: 900,
              textTransform: 'uppercase',
              textAlign: 'center',
              letterSpacing: '-0.05em',
              margin: 0,
              lineHeight: 1,
            }}
          >
            Instant Ship
          </h2>
          <div style={{ width: '80px', height: '6px', background: '#000', marginTop: '24px' }} />
        </div>

        {/* Product grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            columnGap: '32px',
            rowGap: '64px',
          }}
        >
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="product-card"
              style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              {/* Image container */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid #f3f4f6',
                  marginBottom: '24px',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    zIndex: 10,
                    background: '#000',
                    color: '#fff',
                    fontSize: '8px',
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                  }}
                >
                  {product.badge}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '32px',
                    transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
              {/* Text */}
              <div style={{ textAlign: 'center', paddingLeft: '8px', paddingRight: '8px' }}>
                <p
                  style={{
                    fontSize: '9px',
                    color: '#9ca3af',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    marginBottom: '8px',
                    margin: '0 0 8px 0',
                  }}
                >
                  {product.brand}
                </p>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '14px',
                    marginBottom: '12px',
                    height: '40px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textTransform: 'uppercase',
                    lineHeight: 1.4,
                    margin: '0 0 12px 0',
                  }}
                >
                  {product.name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#dc2626', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic' }}>
                      From
                    </span>
                    <span style={{ fontWeight: 900, fontSize: '18px' }}>{product.price}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#d1d5db', textDecoration: 'line-through' }}>{product.comparePrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
          <button
            className="view-all-cta"
            style={{
              background: '#000',
              color: '#fff',
              paddingLeft: '64px',
              paddingRight: '64px',
              paddingTop: '20px',
              paddingBottom: '20px',
              borderRadius: '999px',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '11px',
              letterSpacing: '0.2em',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            View All Collection
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-card:hover .product-img {
          transform: scale(1.1);
        }
        .view-all-cta:hover {
          padding-right: 80px !important;
          background-color: #111827 !important;
        }
      `}</style>
    </section>
  );
}
