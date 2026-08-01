'use client';

import React from 'react';

/**
 * BrandsSection — grayscale brand wordmarks that de-grayscale on hover.
 * Stitch design specs:
 *  - section: py-24 bg white, border-t gray-50
 *  - header: text-5xl font-black "Brands at KM"
 *  - brands: flex flex-wrap, gap-x-16 gap-y-12, opacity-80 grayscale hover:grayscale-0
 *  - each brand has unique typography (italic/bold/light/tracking-widest/etc.)
 */

interface Brand {
  name: string;
  className: string;
}

const BRANDS: Brand[] = [
  { name: 'Dior', className: 'brand-dior' },
  { name: 'crocs', className: 'brand-crocs' },
  { name: 'NIKE SB', className: 'brand-nike-sb' },
  { name: 'On', className: 'brand-on' },
  { name: 'ASICS', className: 'brand-asics' },
  { name: 'JORDAN', className: 'brand-jordan' },
  { name: 'Converse', className: 'brand-converse' },
  { name: 'HOKA', className: 'brand-hoka' },
];

export default function BrandsSection() {
  return (
    <section style={{ paddingTop: '96px', paddingBottom: '96px', background: '#ffffff', borderTop: '1px solid #fafafa' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: '48px',
            fontWeight: 900,
            marginBottom: '80px',
            textTransform: 'uppercase',
            letterSpacing: '-0.05em',
            margin: '0 0 80px 0',
          }}
        >
          Brands at KM
        </h2>
        <div
          className="brands-row"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: '64px',
            rowGap: '48px',
            opacity: 0.8,
          }}
        >
          {BRANDS.map((brand) => (
            <span key={brand.name} className={`brand-item ${brand.className}`}>
              {brand.name === 'NIKE SB' ? (
                <>
                  <em>NIKE</em> <span>SB</span>
                </>
              ) : (
                brand.name
              )}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .brands-row {
          filter: grayscale(1);
          transition: filter 400ms ease;
        }
        .brands-row:hover {
          filter: grayscale(0);
        }
        .brand-item {
          color: #000;
          cursor: pointer;
          transition: opacity 250ms ease;
        }
        .brand-item:hover {
          opacity: 0.6;
        }
        .brand-dior {
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -0.05em;
          font-style: italic;
        }
        .brand-crocs {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .brand-nike-sb {
          font-size: 30px;
          font-weight: 900;
          font-style: italic;
        }
        .brand-nike-sb em {
          font-style: italic;
        }
        .brand-nike-sb span {
          font-style: normal;
        }
        .brand-on {
          font-size: 40px;
          font-weight: 300;
        }
        .brand-asics {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .brand-jordan {
          font-size: 24px;
          font-weight: 900;
        }
        .brand-converse {
          font-size: 30px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .brand-hoka {
          font-size: 30px;
          font-weight: 900;
        }
      `}</style>
    </section>
  );
}
