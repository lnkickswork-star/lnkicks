'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/components/context/AppContext';
import { resolveImage } from '@/lib/images';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  origPrice?: number;
  badge?: string;
  image: string;
  /** Product slug — used to build the canonical /product/[slug] URL. */
  slug?: string;
}

/**
 * Fallback product slug used when a ProductCard consumer does not
 * supply a slug (e.g. items from ProductCatalogRegistry which has
 * no slug field). The destination page resolves the slug via
 * PRODUCT_REGISTRY and falls back to the first product, so this
 * default simply guarantees a working product-detail URL.
 */
const DEFAULT_PRODUCT_SLUG = 'air-jordan-1-low-black-powder-blue';

/**
 * DesktopProductCard — premium product card matching the approved
 * homepage card design language (InstantShipGrid / TrendingSection).
 *
 * Design tokens (mirror components/desktop/InstantShipGrid.tsx):
 *   - Card: white bg, 16px radius, 1px #f0f0f0 border
 *   - Hover: shadow lift `0 24px 48px -16px rgba(0,0,0,0.12)` + border #e5e7eb
 *   - Image: aspect-ratio 1/1, padding 32px, object-fit contain,
 *            filter saturate(0.95) → hover saturate(1.05) + scale(1.08)
 *   - Badge: black pill, 999px radius, 8px / 700 / 0.2em uppercase
 *   - Brand kicker: 9px / 700 / 0.22em uppercase, color #9ca3af
 *   - Title: 14px / 700 uppercase, color #0a0a0a, 2-line clamp
 *   - Price: 18px / 800, color #0a0a0a
 *   - Compare price: 12px / 400, color #d1d5db, line-through
 *   - Wishlist heart: top-right, #9ca3af → #0a0a0a on hover
 *   - Add-to-cart: full-width black bar appears on hover (slide-up)
 *
 * NO iOS red anywhere. This card is the desktop counterpart to the
 * mobile card at components/mobile/ProductCard.tsx.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  brand,
  price,
  origPrice,
  badge,
  image,
  slug,
}) => {
  const { toggleWishlist, addToCart, wishlist } = useApp();

  const resolvedSrc = resolveImage(image);
  const productHref = slug ? `/product/${slug}` : `/product/${DEFAULT_PRODUCT_SLUG}`;
  const inWishlist = wishlist.some((w) => w.id === id);

  return (
    <div
      className="lnk-dp-card"
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'box-shadow 380ms cubic-bezier(0.16,1,0.3,1), border-color 380ms ease, transform 380ms cubic-bezier(0.16,1,0.3,1)',
        cursor: 'pointer',
        boxSizing: 'border-box',
      }}
    >
      {/* Badge (top-left) */}
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#0a0a0a',
            color: '#ffffff',
            fontSize: '8px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '6px 12px',
            borderRadius: '999px',
            zIndex: 3,
          }}
        >
          {badge}
        </span>
      )}

      {/* Wishlist heart (top-right) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist({ id, name, price, image: resolvedSrc });
        }}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={inWishlist}
        className="lnk-dp-wishlist"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#ffffff',
          border: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: inWishlist ? '#0a0a0a' : '#9ca3af',
          cursor: 'pointer',
          zIndex: 3,
          transition: 'color 200ms ease, border-color 200ms ease, transform 200ms ease',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill={inWishlist ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>

      <Link
        href={productHref}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        {/* Image area — aspect-ratio 1/1, padding 32px (matches homepage) */}
        <div
          className="lnk-dp-image-wrap"
          style={{
            position: 'relative',
            aspectRatio: '1 / 1',
            background: '#ffffff',
            borderRadius: '12px',
            marginBottom: '14px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
          }}
        >
          <Image
            src={resolvedSrc}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            style={{
              objectFit: 'contain',
              filter: 'saturate(0.95) drop-shadow(0 8px 16px rgba(0,0,0,0.06))',
              transition: 'transform 600ms cubic-bezier(0.16,1,0.3,1), filter 600ms ease',
            }}
            className="lnk-dp-image"
          />
        </div>

        {/* Brand kicker */}
        <div
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#9ca3af',
            marginBottom: '4px',
          }}
        >
          {brand}
        </div>

        {/* Title (2-line clamp) */}
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
            color: '#0a0a0a',
            lineHeight: 1.3,
            margin: '0 0 8px 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '36.4px',
          }}
        >
          {name}
        </h3>

        {/* Price row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#0a0a0a',
              letterSpacing: '-0.01em',
            }}
          >
            ₹{price.toLocaleString('en-IN')}
          </span>
          {origPrice && origPrice > price && (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: '#d1d5db',
                textDecoration: 'line-through',
              }}
            >
              ₹{origPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </Link>

      {/* Add to cart — full-width black bar */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addToCart({ id, name, price, image: resolvedSrc, qty: 1 });
        }}
        className="lnk-dp-add"
        aria-label={`Add ${name} to cart`}
        style={{
          marginTop: '12px',
          width: '100%',
          background: '#0a0a0a',
          color: '#ffffff',
          borderRadius: '999px',
          padding: '12px 16px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'background 200ms ease, transform 200ms ease',
        }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span>Add to Cart</span>
      </button>

      <style jsx>{`
        .lnk-dp-card:hover {
          box-shadow: 0 24px 48px -16px rgba(0,0,0,0.12);
          border-color: #e5e7eb;
          transform: translateY(-2px);
        }
        .lnk-dp-card:hover .lnk-dp-image {
          transform: scale(1.08);
          filter: saturate(1.05) drop-shadow(0 12px 24px rgba(0,0,0,0.1));
        }
        .lnk-dp-wishlist:hover {
          color: #0a0a0a !important;
          border-color: #e5e7eb !important;
          transform: translateY(-1px);
        }
        .lnk-dp-add:hover {
          background: #1f2937;
          transform: translateY(-1px);
        }
        .lnk-dp-add:active {
          transform: scale(0.98);
        }
        @media (max-width: 767px) {
          /* On small screens (when this card is shown in ResponsiveProductCard fallback),
             shrink padding so it doesn't look puffy next to mobile cards. */
          .lnk-dp-card {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};
