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
 * PHASE 7 PREMIUM REDESIGN
 *   GOAT / Apple Store / Nike App product card inspiration:
 *     - 24px radius (radius.productCard) — softer, premium corners
 *     - Image area takes ~62% of card height (was 50% aspect square)
 *     - 22px internal padding (was 16px) — luxury breathing room
 *     - Product Name: 20px / 600 (was 16px)
 *     - Price: 22px / 700 (was 18px)
 *     - Brand: 12px / 500 gray (unchanged)
 *     - Rating: small minimal light gray stars
 *     - Floating circular Add button bottom-right with RIPPLE effect
 *     - Card width 200px (was 175px) — bigger, more substantial
 *     - Apple-like tap scale (0.97) + image hover lift
 *
 * Add-to-cart integrates with AppContext.addToCart — adds the product
 * with qty=1 and triggers the global toast.
 */

/* ── Star renderer (minimal, light gray) ──────────────────────── */
function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const total = 5;
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < total; i++) {
    let fill = 0;
    if (i < full) fill = 1;
    else if (i === full && hasHalf) fill = 0.5;
    stars.push(
      <svg
        key={i}
        viewBox="0 0 24 24"
        width="11"
        height="11"
        aria-hidden
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient
            id={`mpstar-${i}-${rating}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset={`${fill * 100}%`} stopColor={theme.colors.grey500} />
            <stop offset={`${fill * 100}%`} stopColor={theme.colors.grey300} />
          </linearGradient>
        </defs>
        <path
          d="M12 2l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.77l-5.91 3.39 1.13-6.57L2.45 8.94l6.6-.96L12 2z"
          fill={
            fill === 1
              ? theme.colors.grey500
              : fill === 0.5
                ? `url(#mpstar-${i}-${rating})`
                : theme.colors.grey300
          }
        />
      </svg>,
    );
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
      }}
      aria-label={`${rating} out of 5 stars`}
    >
      {stars}
    </span>
  );
}

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
        // Phase 7: 24px radius — softer, premium
        borderRadius: theme.radius.productCard,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // Phase 7: premium editorial shadow
        boxShadow: theme.shadows.premium,
        border: 'none',
        // Phase 7: wider card (was 175px) for more breathing room
        width: 200,
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
        {/* Image area — soft grey background, takes ~62% of card height */}
        <div
          style={{
            background: theme.colors.grey100,
            // Phase 7: 4:3 aspect ratio (was 1:1) — image takes more space
            aspectRatio: '4 / 3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Phase 7: 22px image area padding (was 16px)
            padding: theme.spacing.cardPadding,
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
              // Phase 7: bigger image — 95% of container (was 92%)
              maxWidth: '95%',
              maxHeight: '95%',
              objectFit: 'contain',
              filter: theme.dropShadows.md,
              transition: `transform ${theme.duration.slow} ${theme.easing.easeOut}`,
            }}
          />
        </div>

        {/* Body — Phase 7: 22px card padding */}
        <div
          style={{
            padding: `${theme.spacing.md}px ${theme.spacing.cardPadding}px ${theme.spacing.cardPadding}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xs,
          }}
        >
          {/* Brand — 12px / 500 / uppercase / 0.5px tracking */}
          <span
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.caption,
              fontWeight: theme.fontWeight.medium,
              letterSpacing: theme.letterSpacing.brandName,
              textTransform: 'uppercase',
              color: theme.colors.textSecondary,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {product.brand}
          </span>

          {/* Name — Phase 7: 20px / 600 (was 16px) */}
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
              minHeight: 52,
              letterSpacing: theme.letterSpacing.normal,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {product.name}
          </h3>

          {/* Rating — Caption 12px / 400, minimal light gray */}
          {typeof product.rating === 'number' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
                color: theme.colors.textTertiary,
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.caption,
                fontWeight: theme.fontWeight.regular,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              <Stars rating={product.rating} />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Price — Phase 7: 22px / 700 (was 18px) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: theme.spacing.sm,
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
            {product.comparePrice && (
              <span
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: theme.fontSize.md,
                  fontWeight: theme.fontWeight.medium,
                  color: theme.colors.textTertiary,
                  textDecoration: 'line-through',
                  opacity: 0.6,
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                {product.comparePrice}
              </span>
            )}
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
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: theme.colors.primaryButton,
          color: theme.colors.buttonText,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          // Phase 7: deeper elevation for the floating action
          boxShadow: theme.shadows.fab,
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {/* Card icon = 20px */}
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
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
        // Phase 7: 48px section spacing
        paddingTop: theme.spacing.sectionSpacing,
        paddingBottom: theme.spacing.sm,
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
          padding: `${theme.spacing.xs}px ${theme.spacing.sectionPadding}px ${theme.spacing.md}px`,
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
