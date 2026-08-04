'use client';

import React from 'react';
import { useApp } from '@/components/context/AppContext';

/**
 * ProductCardActions — shared action row used by all desktop product cards.
 *
 * Per user spec (Screenshot 664): the three icon buttons (Wishlist heart,
 * Quick View eye, Cart icon) have been REMOVED. Only the labeled
 * "Add to Cart" CTA pill remains, so the card still has a primary
 * purchase action without the icon clutter.
 *
 *  ── Behaviour ──
 *   • Add to Cart → calls useApp().addToCart() with the full CartItem.
 *
 *  ── Pointer-event contract ──
 *   The CTA calls e.stopPropagation() and e.preventDefault() on its
 *   onMouseDown / onClick handler so the parent <Link> wrapping the
 *   card image never fires a navigation when the user clicks the CTA.
 *
 *  ── z-index contract ──
 *   In floating layout the pill is z-index:30 — always above the product
 *   image (z-index:1) and below the section header / nav arrows (z-index:50+).
 *
 *  ── Props ──
 *   product — SliderProduct-shaped object (works for all desktop sections:
 *             InstantShipGrid, PremiumProductSlider, DesignerSneakersSection,
 *             LuxuryShoes).
 *   layout  — 'floating' | 'card'. Floating = pill hovers above image with
 *             soft shadow (used by floating-product sliders). Card = pill
 *             sits inside the text block below the image (used by grid
 *             layouts like InstantShip / Luxury Shoes).
 */

export interface ProductCardActionsProduct {
  id: string;
  brand: string;
  name: string;
  price: string;
  /** Numeric price used for cart line items (INR). */
  priceValue: number;
  comparePrice?: string;
  image: string;
  href: string;
  badge?: string;
}

interface ProductCardActionsProps {
  product: ProductCardActionsProduct;
  layout?: 'floating' | 'card';
  /** Visual variant — kept for API compatibility; both render the same CTA. */
  variant?: 'light' | 'dark';
}

export default function ProductCardActions({
  product,
  layout = 'card',
}: ProductCardActionsProps) {
  const { addToCart } = useApp();

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const pillWrapperStyle: React.CSSProperties =
    layout === 'floating'
      ? {
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 30,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.10)',
          border: '1px solid rgba(0,0,0,0.06)',
        }
      : {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 14,
        };

  const ctaPillStyle: React.CSSProperties =
    layout === 'floating'
      ? {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 34,
          padding: '0 14px',
          borderRadius: 999,
          background: '#0A0A0A',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          transition:
            'background-color 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }
      : {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '11px 22px',
          borderRadius: 999,
          background: '#0A0A0A',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          transition:
            'background-color 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        };

  return (
    <div
      className="pca-pill"
      style={pillWrapperStyle}
      // Stop drag-propagation in sliders so the pill never triggers a swipe.
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Add to Cart — labeled pill CTA (icon buttons removed per user spec) */}
      <button
        type="button"
        aria-label={`Add ${product.name} to cart`}
        className="pca-cta"
        style={ctaPillStyle}
        onClick={(e) => {
          stop(e);
          addToCart({
            id: product.id,
            name: product.name,
            price: product.priceValue,
            image: product.image,
            qty: 1,
          });
        }}
      >
        Add to Cart
        <svg
          width={13}
          height={13}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.4}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </button>

      <style jsx>{`
        .pca-cta:hover {
          background-color: #1f1f1f !important;
          transform: translateY(-1px);
        }
        .pca-cta:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
