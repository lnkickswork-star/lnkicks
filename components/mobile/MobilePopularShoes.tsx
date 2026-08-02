'use client';

import React, { memo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import type { MobileProduct } from '@/components/mobile/mobileProducts';

/**
 * MobilePopularShoes — horizontal swipe carousel of premium product cards.
 *
 * PHASE 9 SIMPLIFIED CARD
 *   - Removed: brand/category text, rating stars, sale/compare price
 *   - Kept: product name, simple single price, + add to cart button (right corner)
 *   - Inspired by reference design (Screenshot 650)
 */

/* ── Ripple effect for the Add button ─────────────────────────── */
type Ripple = { id: number; x: number; y: number };

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);

  const trigger = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++idRef.current;
    setRipples((prev) => [...prev, { id, x, y }]);
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  return { ripples, trigger };
}

/* ── Single card ──────────────────────────────────────────────── */
type PopularShoeCardProps = { product: MobileProduct };

function PopularShoeCardImpl({ product }: PopularShoeCardProps) {
  const { addToCart } = useApp();
  const { ripples, trigger } = useRipple();

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    haptic.medium();
    trigger(e);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceValue,
      image: product.image,
      qty: 1,
    });
  };

  return (
    <article
      className="mps-card pressable"
      style={{
        background: theme.colors.white,
        // Phase 8: 20px radius (smaller, more app-like)
        borderRadius: theme.radius.card,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // Phase 8: standard premium shadow
        boxShadow: theme.shadows.premium,
        border: 'none',
        // Phase 8: 160px card width (was 200px) — standard mobile commerce card
        width: 160,
        flex: '0 0 auto',
        scrollSnapAlign: 'start',
        transition: `transform ${theme.duration.standard} ${theme.easing.easeOut}, box-shadow ${theme.duration.standard} ${theme.easing.easeOut}`,
      }}
    >
      <Link
        href={product.href}
        aria-label={`${product.brand} ${product.name}, ${product.price}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image area — transparent background per Phase 8 spec */}
        <div
          style={{
            background: 'transparent',
            // Phase 8: 4:3 aspect ratio (was 1:1) — image takes more space
            aspectRatio: '4 / 3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Phase 8: 10px image area padding
            padding: theme.spacing.sm + 2,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: `${theme.radius.productCard}px ${theme.radius.productCard}px 0 0`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="mps-img"
            style={{
              // Phase 8: 92% of container
              maxWidth: '92%',
              maxHeight: '92%',
              objectFit: 'contain',
              filter: theme.dropShadows.md,
              transition: `transform ${theme.duration.slow} ${theme.easing.easeOut}`,
            }}
          />
        </div>

        {/* Body — Phase 8: 14px card padding */}
        <div
          style={{
            padding: `${theme.spacing.xs + 2}px ${theme.spacing.cardPadding}px ${theme.spacing.cardPadding}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Name — Phase 9: 14px / 600 (only name, no brand/category) */}
          <h3
            style={{
              margin: 0,
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.productNameLg,
              fontWeight: theme.fontWeight.semibold,
              lineHeight: theme.lineHeight.product,
              color: theme.colors.textPrimary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 38,
              letterSpacing: theme.letterSpacing.normal,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {product.name}
          </h3>

          {/* Simple Price — Phase 9: single price only, no sale/compare price */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginTop: theme.spacing.xs,
            }}
          >
            <span
              style={{
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.priceLg,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                letterSpacing: theme.letterSpacing.normal,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {product.price}
            </span>
          </div>
        </div>
      </Link>

      {/* Floating Add-to-Cart button — bottom-right corner with ripple */}
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.name} to cart`}
        className="mps-add pressable"
        style={{
          position: 'absolute',
          bottom: theme.spacing.cardPadding,
          right: theme.spacing.cardPadding,
          width: 32,
          height: 32,
          // Phase 11: rounded-square (squircle) per reference design — was '50%' circle.
          // 10px ≈ 31% of 32px button, matching the iOS squircle look in the reference.
          borderRadius: theme.radius.md,
          background: theme.colors.primaryButton,
          color: theme.colors.buttonText,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          // Phase 8: deeper elevation for the floating action
          boxShadow: theme.shadows.fab,
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {/* Card icon = 16px */}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          aria-hidden
          style={{ pointerEvents: 'none', zIndex: 1 }}
        >
          <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
        </svg>
        {/* Ripple elements */}
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden
            className="mps-ripple"
            style={{
              position: 'absolute',
              left: r.x,
              top: r.y,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.45)',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ))}
      </button>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .mps-card:active {
          transform: scale(${theme.scale.buttonPress});
        }
        .mps-add:active {
          transform: scale(${theme.scale.buttonPress});
        }
        .mps-card:focus-within {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        @media (hover: hover) {
          .mps-card:hover {
            transform: scale(${theme.scale.cardHover});
            box-shadow: ${theme.shadows.premiumLg};
          }
          .mps-card:hover .mps-img {
            transform: translateY(-4px) scale(1.04);
          }
        }
        .mps-ripple {
          animation: mps-ripple-anim 600ms ${theme.easing.easeOut} forwards;
        }
        @keyframes mps-ripple-anim {
          0% {
            width: 8px;
            height: 8px;
            opacity: 0.6;
          }
          100% {
            width: 120px;
            height: 120px;
            opacity: 0;
          }
        }
      `}</style>
    </article>
  );
}

const PopularShoeCard = memo(PopularShoeCardImpl);

/* ── Section wrapper ──────────────────────────────────────────── */
type MobilePopularShoesProps = {
  products: MobileProduct[];
  title?: string;
  seeAllHref?: string;
};

function MobilePopularShoesImpl({
  products,
  title = 'Popular Shoes',
  seeAllHref = '/products?filter=popular',
}: MobilePopularShoesProps) {
  return (
    <section
      aria-label={title}
      style={{
        // Phase 11: parent <main> provides a 32px flex gap above this section;
        // add +8px marginTop so the Promotional Slider → Most Wanted transition
        // equals 40px (per spec). No paddingTop/paddingBottom here — vertical
        // rhythm is owned by the parent flex `gap`.
        marginTop: theme.spacing.sm,
      }}
    >
      {/* Section header — 24px / 700 / 30px line height */}
      <div
        style={{
          padding: `0 ${theme.spacing.sectionPadding}px`,
          marginBottom: theme.spacing.sectionPadding,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: theme.spacing.md,
          }}
        >
          <div>
            {/* Eyebrow — 12px / 500 / uppercase / 0.5px tracking */}
            <p
              style={{
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.caption,
                fontWeight: theme.fontWeight.medium,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: theme.letterSpacing.brandName,
                margin: `0 0 ${theme.spacing.sm}px 0`,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              Most Wanted
            </p>
            {/* Section Heading — 24px / 700 / 30px line height */}
            <h2
              style={{
                margin: 0,
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.section,
                fontWeight: theme.fontWeight.bold,
                letterSpacing: theme.letterSpacing.tight,
                color: theme.colors.textPrimary,
                lineHeight: theme.lineHeight.section,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {title}
            </h2>
          </div>
          <Link
            href={seeAllHref}
            className="pressable"
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textPrimary,
              textDecoration: 'none',
              letterSpacing: theme.letterSpacing.normal,
              whiteSpace: 'nowrap',
              paddingBottom: 2,
              borderBottom: `1.5px solid ${theme.colors.black}`,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            See all
          </Link>
        </div>
      </div>

      {/* Horizontal swipe carousel */}
      <div
        role="list"
        className="mps-scroller"
        style={{
          display: 'flex',
          gap: theme.spacing.cardGapLg,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          // Phase 10: 16px bottom padding so card shadows aren't clipped
          padding: `${theme.spacing.xs}px ${theme.spacing.sectionPadding}px ${theme.spacing.sectionPadding}px`,
          msOverflowStyle: 'none',
        }}
      >
        {products.map((p) => (
          <div role="listitem" key={p.id} style={{ display: 'flex' }}>
            <PopularShoeCard product={p} />
          </div>
        ))}
        {/* Trailing spacer so the last card can scroll into the page gutter */}
        <div aria-hidden style={{ flex: '0 0 auto', width: 0 }} />
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .mps-scroller::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export const MobilePopularShoes = memo(MobilePopularShoesImpl);
export default MobilePopularShoes;
