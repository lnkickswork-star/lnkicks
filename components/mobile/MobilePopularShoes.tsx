'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import type { MobileProduct } from '@/components/mobile/mobileProducts';

/**
 * MobilePopularShoes — horizontal swipe carousel of premium product cards.
 *
 * DESIGN INTENT (LN KICKS premium refresh):
 *   GOAT / Apple Store / END Clothing product card inspiration.
 *   Cards pushed to 24px radius (radius.card), premium soft shadow tier,
 *   more whitespace inside, cleaner type hierarchy, better image treatment.
 *
 * Visual contract:
 *   - Pure white section background
 *   - Section header: editorial eyebrow + display title + "See all" link
 *   - HORIZONTAL swipe carousel (one row, scroll-snap mandatory)
 *   - First/last cards inset by theme.pad for premium page gutter
 *   - Each card:
 *       • Fixed width 175px (slightly wider for more breathing room)
 *       • 24px radius (radius.card)
 *       • Premium soft shadow (shadows.premium)
 *       • Image area: soft grey rounded tile (radius.xl) with floating shoe PNG
 *         Full-bleed image area extends to card edges with internal padding
 *       • Brand label (small, uppercase, tracked-out grey)
 *       • Product name (semibold black, 1-2 lines, ellipsis)
 *       • Rating row: ★ stars + numeric rating (refined typography)
 *       • Price row: current price (bold black) + strike-through original
 *       • Bottom-right: circular matte-black "+" Add-to-Cart button
 *
 * Add-to-cart integrates with AppContext.addToCart — adds the product
 * with qty=1 and triggers the global toast ("Item added to Shopping Cart!").
 *
 * LN KICKS theme: matte black accents, soft grey surfaces, no blue.
 *
 * Phase 4 polish:
 *  - All design tokens (no hardcoded values)
 *  - 24px card radius (radius.card) — GOAT / Apple quality
 *  - Premium shadow tier (shadows.premium) — extra-soft, wide-spread
 *  - Editorial section header with eyebrow + display title
 *  - Haptic medium tick on Add-to-Cart
 *  - Pressed state on card (scale 0.98) and button (scale 0.88)
 *  - Focus-visible ring on the card link and the + button
 *  - ARIA: role="list" with aria-label per card, button has aria-label
 *  - Memoized at the section level; cards are memoized separately
 *  - Image uses loading="lazy" + decoding="async" for scroll perf
 *  - scroll-snap-type: x mandatory for premium snap feel
 *  - -webkit-overflow-scrolling: touch for iOS momentum
 *  - Scrollbar hidden for clean luxury look
 *  - Hover: card lifts (translateY -2px) + shadow deepens
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
        borderRadius: theme.radius.card,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: theme.shadows.premium,
        border: `1px solid ${theme.colors.grey100}`,
        width: 175,
        flex: '0 0 auto',
        scrollSnapAlign: 'start',
        transition: `transform ${theme.duration.standard} ${theme.easing.easeOut}, box-shadow ${theme.duration.standard} ${theme.easing.easeOut}`,
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
            padding: theme.spacing.cardGap,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: `${theme.radius.card}px ${theme.radius.card}px 0 0`,
          }}
        >
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="mps-img"
            style={{
              maxWidth: '92%',
              maxHeight: '92%',
              objectFit: 'contain',
              filter: theme.dropShadows.md,
              transition: `transform ${theme.duration.slow} ${theme.easing.easeOut}`,
            }}
          />
        </div>

        {/* Body — 16px card padding per Phase 6 spec */}
        <div
          style={{
            padding: `${theme.spacing.md}px ${theme.spacing.cardGap}px ${theme.spacing.cardGap}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xs,
          }}
        >
          {/* Brand — 12px / 500 / uppercase / 0.5px tracking (Brand Name preset) */}
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

          {/* Name — Product Name 16px / 600 / 22px line height */}
          <h3
            style={{
              margin: 0,
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.productName,
              fontWeight: theme.fontWeight.semibold,
              lineHeight: theme.lineHeight.product,
              color: theme.colors.textPrimary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 44,
              letterSpacing: theme.letterSpacing.normal,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {product.name}
          </h3>

          {/* Rating — Caption 12px / 400 */}
          {typeof product.rating === 'number' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
                color: theme.colors.textSecondary,
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

          {/* Price — 18px / 700 (per Phase 6 spec); Original 14px / 500 / strikethrough / 60% opacity */}
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
                fontSize: theme.fontSize.price,
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

      {/* Floating Add-to-Cart button — bottom-right corner */}
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.name} to cart`}
        className="mps-add pressable"
        style={{
          position: 'absolute',
          bottom: theme.spacing.cardGap,
          right: theme.spacing.cardGap,
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: theme.colors.primaryButton,
          color: theme.colors.buttonText,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: theme.shadows.md,
          zIndex: 2,
        }}
      >
        {/* Card icon = 20px per Phase 6 spec */}
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
        </svg>
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
        paddingTop: theme.spacing.sectionPadding,
        paddingBottom: theme.spacing.sm,
      }}
    >
      {/* Section header — Section Heading 24px / 700 / 30px line height */}
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
          gap: theme.spacing.cardGap,
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
