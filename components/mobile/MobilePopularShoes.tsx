'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import type { MobileProduct } from '@/components/mobile/mobileProducts';

/**
 * MobilePopularShoes — horizontal swipe carousel of product cards.
 *
 * Visual contract (matches mobile reference):
 *   - Pure white section background
 *   - Section header: "Popular Shoes" (bold black) + "See all" link
 *   - HORIZONTAL swipe carousel (one row, scroll-snap)
 *   - First/last cards inset by theme.pad for premium page gutter
 *   - Each card:
 *       • Fixed width ~165px (so 2.2 cards are visible — peak/preview pattern)
 *       • 1. Soft grey rounded image area (radius.lg) with floating shoe PNG
 *         (drop-shadow on the image, NOT card box-shadow)
 *       • 2. Brand label (small, uppercase, grey)
 *       • 3. Product name (bold black, 1-2 lines, ellipsis)
 *       • 4. Price row: current price (bold black) + strike-through original
 *       • 5. Rating row: ★ stars + numeric rating
 *       • 6. Bottom-right: circular matte-black "+" Add-to-Cart button
 *
 * Add-to-cart integrates with AppContext.addToCart — adds the product
 * with qty=1 and triggers the global toast ("Item added to Shopping Cart!").
 *
 * LN KICKS theme: matte black accents, soft grey surfaces, no blue.
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded values)
 *  - Haptic medium tick on Add-to-Cart
 *  - Pressed state on card (scale 0.98) and button (scale 0.92)
 *  - Focus-visible ring on the card link and the + button
 *  - ARIA: role="list" with aria-label per card, button has aria-label
 *  - Memoized at the section level; cards are memoized separately
 *  - Image uses loading="lazy" + decoding="async" for scroll perf
 *  - scroll-snap-type: x mandatory for premium snap feel
 *  - -webkit-overflow-scrolling: touch for iOS momentum
 *  - Scrollbar hidden for clean luxury look
 */

/* ── Star renderer ────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  // Render 5 stars; fill proportional to rating (supports 0.5 steps).
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
          <linearGradient id={`mpstar-${i}-${rating}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset={`${fill * 100}%`} stopColor={theme.colors.black} />
            <stop offset={`${fill * 100}%`} stopColor={theme.colors.grey300} />
          </linearGradient>
        </defs>
        <path
          d="M12 2l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.77l-5.91 3.39 1.13-6.57L2.45 8.94l6.6-.96L12 2z"
          fill={fill === 1 ? theme.colors.black : fill === 0.5 ? `url(#mpstar-${i}-${rating})` : theme.colors.grey300}
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

/* ── Single card ──────────────────────────────────────────────── */
type PopularShoeCardProps = { product: MobileProduct };

function PopularShoeCardImpl({ product }: PopularShoeCardProps) {
  const { addToCart } = useApp();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptic.medium();
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
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: `1px solid ${theme.colors.grey150}`,
        // Fixed width so the carousel shows ~2.2 cards (peek/preview pattern)
        width: 165,
        flex: '0 0 auto',
        scrollSnapAlign: 'start',
      }}
    >
      <Link
        href={product.href}
        aria-label={`${product.brand} ${product.name}, ${product.price}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
      >
        {/* Image area — soft grey background with floating shoe */}
        <div
          style={{
            background: theme.colors.grey100,
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing.md,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: theme.radius.lg,
            margin: theme.spacing.xs,
          }}
        >
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              filter: theme.dropShadows.md,
              transition: `transform ${theme.motion.duration.slow} ${theme.motion.easing.out}`,
            }}
          />
        </div>

        {/* Body */}
        <div
          style={{
            padding: `${theme.spacing.xs}px ${theme.spacing.md}px ${theme.spacing.md}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xs,
          }}
        >
          {/* Brand */}
          <span
            style={{
              fontSize: theme.fontSize.xs,
              fontWeight: theme.fontWeight.bold,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
              color: theme.colors.textTertiary,
            }}
          >
            {product.brand}
          </span>

          {/* Name */}
          <h3
            style={{
              margin: 0,
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.semibold,
              lineHeight: theme.lineHeight.snug,
              color: theme.colors.textPrimary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 36,
            }}
          >
            {product.name}
          </h3>

          {/* Rating */}
          {typeof product.rating === 'number' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
                color: theme.colors.textSecondary,
                fontSize: theme.fontSize.sm,
                fontWeight: theme.fontWeight.medium,
              }}
            >
              <Stars rating={product.rating} />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Price */}
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
                fontSize: theme.fontSize.lg,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              {product.price}
            </span>
            {product.comparePrice && (
              <span
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: theme.fontWeight.regular,
                  color: theme.colors.textTertiary,
                  textDecoration: 'line-through',
                }}
              >
                {product.comparePrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Floating Add-to-Cart button — bottom-right corner */}
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.name} to cart`}
        className="mps-add pressable"
        style={{
          position: 'absolute',
          bottom: theme.spacing.md,
          right: theme.spacing.md,
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: theme.colors.black,
          color: theme.colors.white,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: theme.shadows.md,
          zIndex: 2,
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
        </svg>
      </button>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .mps-card:active {
          transform: scale(0.98);
        }
        .mps-add:active {
          transform: scale(0.88);
        }
        .mps-card:focus-within {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        @media (hover: hover) {
          .mps-card:hover img {
            transform: translateY(-4px) scale(1.04);
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
        paddingTop: theme.spacing.xxl,
        paddingBottom: theme.spacing.sm,
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          padding: `0 ${theme.spacing.pad}px`,
          marginBottom: theme.spacing.lg,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.title,
            fontWeight: theme.fontWeight.extrabold,
            letterSpacing: theme.letterSpacing.tight,
            color: theme.colors.textPrimary,
          }}
        >
          {title}
        </h2>
        <Link
          href={seeAllHref}
          className="pressable"
          style={{
            fontSize: theme.fontSize.sm,
            fontWeight: theme.fontWeight.semibold,
            color: theme.colors.textPrimary,
            textDecoration: 'none',
            letterSpacing: theme.letterSpacing.wide,
            textTransform: 'uppercase',
          }}
        >
          See all
        </Link>
      </div>

      {/* Horizontal swipe carousel */}
      <div
        role="list"
        className="mps-scroller"
        style={{
          display: 'flex',
          gap: theme.spacing.md,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          // Page gutter on both edges so first/last cards breathe
          padding: `${theme.spacing.xs}px ${theme.spacing.pad}px ${theme.spacing.md}px`,
          // Prevent vertical scroll capture
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
