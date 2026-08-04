'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';

/**
 * ProductCardActions — shared action row used by all desktop product cards.
 *
 * Renders three icon buttons (Wishlist · Quick View · Add to Cart) inside a
 * single pill container. Designed to sit ABOVE the product image so it never
 * overlaps the link-wrapped card body — the pill is positioned absolutely
 * (top-right) and uses pointer-events:auto while the parent link still
 * receives clicks on the rest of the image area.
 *
 *  ── Behaviour ──
 *   • Wishlist   → calls useApp().toggleWishlist() with the full WishlistItem.
 *                  The heart icon fills / unfills in sync with the wishlist
 *                  state for that product id.
 *   • Quick View → opens an inline modal (returned by this component via a
 *                  React portal-free overlay at the end of the DOM tree).
 *                  The modal shows the product image, brand, name, price,
 *                  and a "View Full Details" CTA that deep-links to the
 *                  product page. This is the production-ready Quick View —
 *                  not a placeholder toast.
 *   • Add to Cart→ calls useApp().addToCart() with the full CartItem.
 *
 *  ── Pointer-event contract ──
 *   Every clickable element in this component calls e.stopPropagation() and
 *   e.preventDefault() on its onMouseDown / onClick handler so the parent
 *   <Link> wrapping the card image never fires a navigation when the user
 *   actually clicked an action button. This eliminates "dead clicks" caused
 *   by the action buttons being inside a link.
 *
 *  ── z-index contract ──
 *   The pill is z-index:30 — always above the product image (z-index:1) and
 *   below the section header / nav arrows (which sit at z-index:50+).
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
  /** Visual variant — defaults to 'light' (dark icons on white pill) */
  variant?: 'light' | 'dark';
}

export default function ProductCardActions({
  product,
  layout = 'card',
  variant = 'light',
}: ProductCardActionsProps) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const didMountRef = useRef(false);

  // Avoid hydration mismatch: wishlist is loaded from localStorage post-mount
  const [isWishlisted, setIsWishlisted] = useState(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    }
    setIsWishlisted(wishlist.some((w) => w.id === product.id));
  }, [wishlist, product.id]);

  const isDark = variant === 'dark';

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const pillStyle: React.CSSProperties =
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
          background: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.92)',
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

  const iconBtn = (active: boolean): React.CSSProperties => ({
    width: 34,
    height: 34,
    borderRadius: 999,
    border: 'none',
    background: active
      ? '#0A0A0A'
      : layout === 'floating'
      ? 'transparent'
      : '#0A0A0A',
    color: active ? '#fff' : layout === 'floating' ? '#0A0A0A' : '#fff',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    transition:
      'background-color 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1), color 220ms ease',
  });

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
    <>
      <div
        className="pca-pill"
        style={pillStyle}
        // Stop drag-propagation in sliders so the pill never triggers a swipe.
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Wishlist */}
        <button
          type="button"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
          className="pca-icon pca-wish"
          style={iconBtn(isWishlisted)}
          onClick={(e) => {
            stop(e);
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.priceValue,
              image: product.image,
            });
          }}
        >
          <svg
            width={layout === 'floating' ? 15 : 15}
            height={layout === 'floating' ? 15 : 15}
            viewBox="0 0 24 24"
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        </button>

        {/* Quick View */}
        <button
          type="button"
          aria-label={`Quick view ${product.name}`}
          className="pca-icon pca-qv"
          style={iconBtn(false)}
          onClick={(e) => {
            stop(e);
            setQuickViewOpen(true);
          }}
        >
          <svg
            width={15}
            height={15}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        {/* Add to Cart — either icon (floating) or pill CTA (card) */}
        {layout === 'floating' ? (
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="pca-icon pca-cart pca-cart--floating"
            style={iconBtn(false)}
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
            <svg
              width={15}
              height={15}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        ) : (
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
        )}
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
          onAddToCart={() => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.priceValue,
              image: product.image,
              qty: 1,
            });
          }}
          onToggleWishlist={() => {
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.priceValue,
              image: product.image,
            });
          }}
          isWishlisted={isWishlisted}
        />
      )}

      <style jsx>{`
        .pca-icon:hover {
          transform: scale(1.08);
        }
        .pca-icon:focus-visible {
          outline: 2px solid #0a0a0a;
          outline-offset: 2px;
        }
        .pca-cta:hover,
        .pca-cart--floating:hover {
          background-color: #1f1f1f !important;
          transform: translateY(-1px);
        }
        .pca-cta:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
        }
        .pca-wish[aria-pressed='true'] {
          color: #ffffff !important;
          background-color: #0a0a0a !important;
        }
      `}</style>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  QuickViewModal — minimal premium modal                             */
/* ------------------------------------------------------------------ */

interface QuickViewModalProps {
  product: ProductCardActionsProduct;
  onClose: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isWishlisted: boolean;
}

function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: QuickViewModalProps) {
  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10,10,10,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'qv-fade 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="qv-card"
        style={{
          background: '#ffffff',
          borderRadius: 20,
          maxWidth: 880,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          boxShadow: '0 24px 64px rgba(0,0,0,0.24)',
          position: 'relative',
          animation: 'qv-pop 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close */}
        <button
          type="button"
          aria-label="Close quick view"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            zIndex: 5,
            width: 36,
            height: 36,
            borderRadius: 999,
            border: 'none',
            background: 'rgba(0,0,0,0.06)',
            color: '#0A0A0A',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>

        {/* Image */}
        <div
          style={{
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            minHeight: 360,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: 360,
              objectFit: 'contain',
              filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.18))',
            }}
          />
        </div>

        {/* Body */}
        <div
          style={{
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              margin: 0,
            }}
          >
            {product.brand}
          </p>
          <h3
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#0A0A0A',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0 4px 0' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#0A0A0A' }}>{product.price}</span>
            {product.comparePrice && (
              <span
                style={{
                  fontSize: 14,
                  color: '#9ca3af',
                  textDecoration: 'line-through',
                  fontWeight: 500,
                }}
              >
                {product.comparePrice}
              </span>
            )}
          </div>

          <p
            style={{
              fontSize: 13,
              color: '#6b7280',
              lineHeight: 1.6,
              margin: '6px 0 0 0',
            }}
          >
            Verified authentic by LN KICKS&apos; 6-step in-house check. Ships in 24 hrs via BlueDart Express.
            7-day hassle-free return on unworn pairs with original tags.
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                onAddToCart();
              }}
              style={{
                flex: '1 1 auto',
                minWidth: 180,
                padding: '14px 22px',
                borderRadius: 999,
                background: '#0A0A0A',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              className="qv-atc"
            >
              Add to Cart
              <svg width={13} height={13} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.4}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={onToggleWishlist}
              aria-pressed={isWishlisted}
              style={{
                width: 50,
                padding: 0,
                borderRadius: 999,
                background: isWishlisted ? '#0A0A0A' : 'transparent',
                color: isWishlisted ? '#fff' : '#0A0A0A',
                border: '1.5px solid #0A0A0A',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle wishlist"
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill={isWishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
            </button>
          </div>

          <Link
            href={product.href}
            onClick={onClose}
            style={{
              marginTop: 14,
              fontSize: 11,
              fontWeight: 700,
              color: '#0A0A0A',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              textDecoration: 'underline',
              textUnderlineOffset: 4,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            View Full Details
            <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes qv-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes qv-pop {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .qv-atc:hover {
          background-color: #1f1f1f !important;
          transform: translateY(-1px);
        }
        @media (max-width: 767px) {
          :global(.qv-card) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
