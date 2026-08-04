'use client';

import React from 'react';
import Link from 'next/link';

/**
 * InstantShipGrid — 4-column premium sneaker grid.
 *
 * Refinements (Phase 2):
 *  - Whole card is a single <Link> (no dead click areas)
 *  - Brand-theme price (black, not red) — matches LN KICKS identity
 *  - Per-card Add-to-Cart actions removed per user spec — card is now
 *    click-through only (whole card navigates to product page)
 *  - "From" label uses luxury ice-blue (no more orange)
 *  - Card hover: image scale + subtle lift + shadow
 *  - Premium grayscale-to-color image transition on hover
 *  - Card border + soft shadow on hover for depth
 */

interface Product {
  id: string;
  brand: string;
  name: string;
  price: string;
  /** Numeric price used for cart line items (INR). */
  priceValue: number;
  comparePrice: string;
  badge: string;
  image: string;
  href: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    brand: 'Air Jordan',
    name: 'Air Jordan 1 Low Black Dark Powder Blue',
    price: 'Rs. 8,899.00',
    priceValue: 8899,
    comparePrice: 'Rs. 18,999.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
  },
  {
    id: 'p2',
    brand: 'Nike',
    name: "Nike Dunk Low 'Rose Whisper'",
    price: 'Rs. 7,399.00',
    priceValue: 7399,
    comparePrice: 'Rs. 12,999.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
  },
  {
    id: 'p3',
    brand: 'Adidas Yeezy',
    name: "Adidas Yeezy Slide 'Onyx'",
    price: 'Rs. 10,499.00',
    priceValue: 10499,
    comparePrice: 'Rs. 15,999.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-yeezy-slide-onyx',
  },
  {
    id: 'p4',
    brand: 'New Balance',
    name: "New Balance 530 'Steel Grey'",
    price: 'Rs. 9,499.00',
    priceValue: 9499,
    comparePrice: 'Rs. 20,499.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/new-balance-530-steel-grey',
  },
  {
    id: 'p5',
    brand: 'Nike',
    name: "Nike Dunk Low 'Court Purple'",
    price: 'Rs. 6,499.00',
    priceValue: 6499,
    comparePrice: 'Rs. 14,999.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-court-purple',
  },
  {
    id: 'p6',
    brand: 'Adidas',
    name: "Adidas Samba OG 'Wonder Silver'",
    price: 'Rs. 6,199.00',
    priceValue: 6199,
    comparePrice: 'Rs. 22,999.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-samba-og-wonder-silver',
  },
  {
    id: 'p7',
    brand: 'Air Jordan',
    name: "Air Jordan 1 Low 'Panda'",
    price: 'Rs. 9,399.00',
    priceValue: 9399,
    comparePrice: 'Rs. 21,999.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-panda',
  },
  {
    id: 'p8',
    brand: 'Yeezy',
    name: "Yeezy Foam Runner 'MX Cinder'",
    price: 'Rs. 9,299.00',
    priceValue: 9299,
    comparePrice: 'Rs. 14,499.00',
    badge: 'Instant Ship',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/yeezy-foam-runner-mx-cinder',
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
              fontWeight: 800,
              textTransform: 'uppercase',
              textAlign: 'center',
              letterSpacing: '-0.045em',
              margin: 0,
              lineHeight: 1,
            }}
          >
            Instant Ship
          </h2>
          <div style={{ width: '64px', height: '3px', background: '#000', marginTop: '24px' }} />
        </div>

        {/* Product grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            columnGap: '24px',
            rowGap: '56px',
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
                  border: '1px solid #f0f0f0',
                  marginBottom: '20px',
                  transition: 'box-shadow 400ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="product-image-wrap"
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    zIndex: 10,
                    background: '#000',
                    color: '#fff',
                    fontSize: '8px',
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                  }}
                >
                  {product.badge}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '32px',
                    transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), filter 600ms ease',
                    filter: 'saturate(0.95)',
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
                    letterSpacing: '0.22em',
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
                    {/* "From" — luxury ice-blue, replaces orange */}
                    <span
                      style={{
                        color: '#7AA5B5',
                        fontSize: '9px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        fontStyle: 'italic',
                        letterSpacing: '0.1em',
                      }}
                    >
                      From
                    </span>
                    {/* Brand-theme price (black) — replaces off-brand red */}
                    <span style={{ fontWeight: 800, fontSize: '18px', color: '#0A0A0A' }}>{product.price}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#d1d5db', textDecoration: 'line-through' }}>
                    {product.comparePrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
          <Link
            href="/products"
            className="view-all-cta"
            style={{
              background: '#000',
              color: '#fff',
              paddingLeft: '56px',
              paddingRight: '56px',
              paddingTop: '20px',
              paddingBottom: '20px',
              borderRadius: '999px',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '11px',
              letterSpacing: '0.22em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              border: 'none',
              textDecoration: 'none',
              transition: 'all 350ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            View All Collection
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="view-all-arrow">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .product-card:hover .product-img {
          transform: scale(1.08);
          filter: saturate(1.05);
        }
        .product-card:hover .product-image-wrap {
          box-shadow: 0 24px 48px -16px rgba(0,0,0,0.12);
        }
        .view-all-cta:hover {
          padding-right: 72px !important;
          background-color: #1f2937 !important;
        }
        .view-all-cta:hover .view-all-arrow {
          transform: translateX(4px);
        }
        .view-all-arrow {
          transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </section>
  );
}
