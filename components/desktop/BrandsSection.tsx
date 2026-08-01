'use client';

import React from 'react';

/**
 * BrandsSection — single infinite horizontal marquee of luxury brand wordmarks.
 *
 * Refinements (Phase 1.5 → v2):
 *  - Renamed: "Brands at LN KICKS"
 *  - 11 brands: Nike, Jordan, Adidas, Puma, Reebok, Converse, Vans, HOKA,
 *    New Balance, ASICS, Yeezy
 *  - Continuous infinite horizontal scroll (CSS keyframes only — no JS)
 *  - ONE single marquee row (duplicate RTL row removed per user spec)
 *  - Each brand has unique typography to feel like a real logo lockup
 */

interface Brand {
  name: string;
  className: string;
  render?: React.ReactNode;
}

const BRANDS: Brand[] = [
  { name: 'Nike', className: 'brand-nike', render: <span>NIKE</span> },
  { name: 'Jordan', className: 'brand-jordan', render: <><span>JUMP</span><span style={{ fontStyle: 'italic', fontWeight: 400 }}>man</span></> },
  { name: 'Adidas', className: 'brand-adidas', render: <span>adidas</span> },
  { name: 'Puma', className: 'brand-puma', render: <span>PUMA</span> },
  { name: 'Reebok', className: 'brand-reebok', render: <span>REEBOK</span> },
  { name: 'Converse', className: 'brand-converse', render: <span>CONVERSE</span> },
  { name: 'Vans', className: 'brand-vans', render: <span><em>VANS</em></span> },
  { name: 'HOKA', className: 'brand-hoka', render: <span>HOKA</span> },
  { name: 'New Balance', className: 'brand-newbalance', render: <span>NEW BALANCE</span> },
  { name: 'ASICS', className: 'brand-asics', render: <span>ASICS</span> },
  { name: 'Yeezy', className: 'brand-yeezy', render: <span>YEEZY</span> },
];

export default function BrandsSection() {
  // Single duplicated track for seamless infinite scroll
  const track = [...BRANDS, ...BRANDS];

  return (
    <section
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        background: '#ffffff',
        borderTop: '1px solid #fafafa',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            marginBottom: '16px',
            margin: '0 0 16px 0',
          }}
        >
          Authenticated · Stocked · Trusted
        </p>
        <h2
          style={{
            fontSize: '56px',
            fontWeight: 800,
            marginBottom: '72px',
            textTransform: 'uppercase',
            letterSpacing: '-0.04em',
            margin: '0 0 72px 0',
          }}
        >
          Brands at <span style={{ fontStyle: 'italic', fontWeight: 300 }}>LN KICKS</span>
        </h2>
      </div>

      {/* Single marquee row (left → right) */}
      <div className="marquee-wrap">
        <div className="marquee-track marquee-track-ltr">
          {track.map((brand, idx) => (
            <div
              key={`r1-${idx}`}
              className={`brand-item ${brand.className}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 56px',
                flexShrink: 0,
                color: '#000',
                opacity: 0.85,
                transition: 'opacity 300ms ease, filter 300ms ease',
                cursor: 'pointer',
              }}
            >
              {brand.render}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-wrap {
          width: 100%;
          overflow: hidden;
          position: relative;
          filter: grayscale(1);
          transition: filter 500ms ease;
        }
        .marquee-wrap:hover {
          filter: grayscale(0);
        }
        .marquee-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
        }
        .marquee-track-ltr {
          animation: lnk-brand-marquee-ltr 48s linear infinite;
        }
        .marquee-wrap:hover .marquee-track {
          animation-play-state: paused;
        }
        .brand-item:hover {
          opacity: 1 !important;
        }
        @keyframes lnk-brand-marquee-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Per-brand typography */
        .brand-nike {
          font-size: 44px;
          font-weight: 900;
          letter-spacing: -0.02em;
          font-style: italic;
        }
        .brand-jordan {
          font-size: 36px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }
        .brand-jordan span:first-child {
          font-style: normal;
        }
        .brand-adidas {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }
        .brand-puma {
          font-size: 42px;
          font-weight: 900;
          font-style: italic;
          letter-spacing: -0.02em;
        }
        .brand-reebok {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .brand-converse {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 0.14em;
        }
        .brand-vans {
          font-size: 44px;
          font-weight: 900;
          letter-spacing: 0.02em;
        }
        .brand-hoka {
          font-size: 44px;
          font-weight: 800;
          letter-spacing: 0.06em;
        }
        .brand-newbalance {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .brand-asics {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 0.16em;
        }
        .brand-yeezy {
          font-size: 44px;
          font-weight: 300;
          letter-spacing: 0.04em;
          font-style: italic;
        }
      `}</style>
    </section>
  );
}
