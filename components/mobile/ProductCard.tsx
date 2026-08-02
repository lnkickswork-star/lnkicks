'use client';

import React, { memo, useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * ProductCard — LN KICKS reusable MOBILE product card.
 *
 * Master spec (Phase 12 redesign):
 *   - Pure white card, 24px radius, soft premium shadow, NO border.
 *   - 24px internal padding, generous whitespace (Apple/Nike/GOAT feel).
 *   - Large centered product image (~45–50% of card height, contain mode).
 *   - Small BLUE category label above title (e.g. "Best Seller").
 *   - Semibold 14px black product name (max 2 lines, left-aligned, -0.02em tracking).
 *   - Semibold 13px black price near bottom-left (line-height 1.25).
 *   - Signature BLACK QUARTER-CIRCLE "+" Add to Cart button integrated into
 *     the bottom-right corner — NOT floating, attached to the corner,
 *     clipped by the card's overflow:hidden so it follows the card curve.
 *
 * Reusable everywhere:
 *   - MobilePopularShoes (homepage "Most Wanted")
 *   - MobileRecommended  (homepage "Recommended For You")
 *   - /wishlist, /search, /products, /category-products, /category/[slug],
 *     /product/[slug] (related items) on mobile
 *
 * Desktop homepage is NOT modified — this component is mobile-only.
 *
 * Existing features preserved:
 *   - addToCart via useApp()
 *   - showToast() on add
 *   - Haptic feedback (medium on add)
 *   - Ripple effect on Add button
 *   - Link wrapping (whole card clickable to /product/[slug])
 *   - Lazy image loading
 *   - Optional badge (NEW / LIMITED / HOT)
 *   - Optional comparePrice strikethrough
 *   - Optional action slot (top-right) for wishlist ✕ / heart
 *   - Press / hover / focus-visible states
 */

// ── Design constants ────────────────────────────────────────────────
// Apple blue — the single accent color allowed in the otherwise B&W theme.
// Per master spec: "Category Label — Small text — Blue color".
const CATEGORY_BLUE = '#0071e3';

// Quarter-circle Add-to-Cart button dimensions (spec: 58–64px range)
const FAB_SIZE = 60;
const FAB_RADIUS = 60;        // border-top-left-radius — full quarter circle
const FAB_ICON_SIZE = 24;     // + icon SVG render size
// Distance from the button's bottom-right corner to the icon's bottom-right.
// 14px places the icon's center at (32, 32) — the visual center of mass of
// the quarter circle (which is at ~(34.5, 34.5) for a 60×60 button).
const FAB_ICON_OFFSET = 14;

export interface ProductCardProps {
  // ── Identity ────────────────────────────────────────────────────────
  id: string;
  name: string;
  brand?: string;
  image: string;

  // ── Pricing ─────────────────────────────────────────────────────────
  /**
   * Either a pre-formatted string ("Rs. 8,899") OR a numeric value (8899).
   * Numeric values are formatted as ₹{n.toLocaleString('en-IN')}.
   */
  price: string | number;
  /** Numeric value used for cart line items. Defaults to parsed `price`. */
  priceValue?: number;
  /** Optional strikethrough compare price (string or number). */
  comparePrice?: string | number;

  // ── Navigation ──────────────────────────────────────────────────────
  /** Direct href. If omitted, falls back to /product/[slug]. */
  href?: string;
  /** Product slug — used to build /product/[slug] when no href provided. */
  slug?: string;

  // ── Optional metadata ───────────────────────────────────────────────
  /** Small blue label above title (e.g. "Best Seller", "New Arrival"). */
  category?: string;
  /** Optional badge pill at top-left of image (NEW / LIMITED / HOT). */
  badge?: string;
  /** Optional rating 0–5 (kept for type compat; not currently rendered). */
  rating?: number;

  // ── Cart ────────────────────────────────────────────────────────────
  /** Override the default useApp().addToCart behavior. */
  onAddToCart?: () => void;
  /** Default "Add to Cart". */
  ctaLabel?: string;
  /** Show toast on add (default true). */
  showToastOnAdd?: boolean;

  // ── Action slot (top-right) ─────────────────────────────────────────
  /** Custom action button rendered top-right (e.g. wishlist ✕, heart). */
  actionSlot?: React.ReactNode;

  // ── Layout ──────────────────────────────────────────────────────────
  /** Card width — number (px) or string. Default: '100%'. */
  width?: number | string;
  /** Lazy-load the product image (default true). */
  lazyLoad?: boolean;
}

// ── Helpers ─────────────────────────────────────────────────────────

/** Format a price prop for display. Numbers → ₹{n.toLocaleString('en-IN')}; strings pass through. */
function formatPrice(price: string | number): string {
  if (typeof price === 'number') {
    return `₹${price.toLocaleString('en-IN')}`;
  }
  return price;
}

/** Extract a numeric priceValue (for cart) from the price prop. */
function resolvePriceValue(price: string | number, priceValue?: number): number {
  if (typeof priceValue === 'number') return priceValue;
  if (typeof price === 'number') return price;
  // Try to parse "Rs. 8,899" / "₹8,899" → 8899
  const digits = price.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

// ── Ripple effect for the + button ─────────────────────────────────
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
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  return { ripples, trigger };
}

// ── Component ──────────────────────────────────────────────────────

function ProductCardImpl({
  id,
  name,
  brand,
  image,
  price,
  priceValue,
  comparePrice,
  href,
  slug,
  category,
  badge,
  rating: _rating,
  onAddToCart,
  ctaLabel = 'Add to Cart',
  showToastOnAdd = true,
  actionSlot,
  width = '100%',
  lazyLoad = true,
}: ProductCardProps) {
  const { addToCart, showToast } = useApp();
  const { ripples, trigger } = useRipple();

  const resolvedHref = href || (slug ? `/product/${slug}` : '/products');
  const resolvedPriceValue = resolvePriceValue(price, priceValue);
  const displayPrice = formatPrice(price);
  const displayComparePrice = comparePrice ? formatPrice(comparePrice) : null;
  const categoryLabel = category ?? brand ?? 'Best Seller';

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    haptic.medium();
    trigger(e);
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart({
        id,
        name,
        price: resolvedPriceValue,
        image,
        qty: 1,
      });
    }
    if (showToastOnAdd) {
      showToast('Item added to Shopping Cart!');
    }
  };

  return (
    <article
      className="pc-card pressable"
      style={{
        position: 'relative',
        background: theme.colors.white,
        borderRadius: theme.radius.productCard, // 24px
        overflow: 'hidden',                     // clips the FAB to follow the card curve
        boxShadow: theme.shadows.premium,
        border: 'none',
        width,
        flex: '0 0 auto',
        scrollSnapAlign: 'start',
        transition: `transform 180ms ${theme.easing.easeOut}, box-shadow 180ms ${theme.easing.easeOut}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Link
        href={resolvedHref}
        aria-label={`${brand ?? ''} ${name}, ${displayPrice}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* ── Image area — 1:1 aspect, centered, contain mode ────────── */}
        <div
          style={{
            background: theme.colors.white,
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing.xl, // 16px
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={`${brand ?? ''} ${name}`}
            loading={lazyLoad ? 'lazy' : 'eager'}
            decoding="async"
            draggable={false}
            className="pc-img"
            style={{
              maxWidth: '92%',
              maxHeight: '92%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              filter: theme.dropShadows.md,
              transition: `transform 180ms ${theme.easing.easeOut}`,
            }}
          />

          {/* Optional badge — pill at top-left of image */}
          {badge && (
            <span
              style={{
                position: 'absolute',
                top: theme.spacing.sm,
                left: theme.spacing.sm,
                background: theme.colors.black,
                color: theme.colors.white,
                fontSize: 10,
                fontWeight: theme.fontWeight.bold,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                padding: '4px 8px',
                borderRadius: theme.radius.sm,
                fontFamily: theme.fontFamily.body,
              }}
            >
              {badge}
            </span>
          )}

          {/* Optional action slot — top-right (e.g. wishlist ✕, heart) */}
          {actionSlot && (
            <div
              style={{
                position: 'absolute',
                top: theme.spacing.sm,
                right: theme.spacing.sm,
                zIndex: 3,
              }}
            >
              {actionSlot}
            </div>
          )}
        </div>

        {/* ── Body — 24px padding per spec, tight bottom for compact card
            Phase 16: reduced bottom padding 44 → 24 to eliminate the
            remaining whitespace below the price. The quarter-circle FAB
            (60×60, absolutely positioned at bottom:0/right:0) overlaps
            the body's lower-right region without needing body padding to
            reserve space for it — only the + icon (24px tall, offset 14px
            from bottom-right) needs clearance, and 24px is exactly enough. */}
        <div
          style={{
            padding: theme.spacing.section, // 24px
            paddingTop: theme.spacing.md,   // 12px — slightly tighter above title
            paddingBottom: 24,              // tight — was 44, still too much whitespace
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xs,          // 4px
          }}
        >
          {/* Category label — small blue, above title
              Phase 15: 11px → 10px (caption tier — mobile-optimized). */}
          <span
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: 10,
              fontWeight: theme.fontWeight.medium,
              color: CATEGORY_BLUE,
              letterSpacing: theme.letterSpacing.normal,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {categoryLabel}
          </span>

          {/* Title — 14px / 600 (semibold) / line-height 1.2 / -0.02em / max 2 lines / left-aligned
              Phase 15: 16px → 14px, weight 700 → 600 (user requested smaller
              text AND reduced boldness — premium mobile sizing). */}
          <h3
            style={{
              margin: 0,
              fontFamily: theme.fontFamily.body,
              fontSize: 14,
              fontWeight: theme.fontWeight.semibold,
              lineHeight: 1.2,
              color: theme.colors.black,
              letterSpacing: theme.letterSpacing.tight, // -0.02em
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 34, // 2 lines × ~17px (14px × 1.2 line-height)
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {name}
          </h3>

          {/* Price — 13px / 600 (semibold) / line-height 1.25, optional comparePrice strikethrough
              Phase 15: 14px → 13px, weight 700 → 600 (user requested smaller
              text AND reduced boldness). */}
          <div
            style={{
              marginTop: theme.spacing.xs, // 4px (was sm/8px — tighter title→price gap)
              display: 'flex',
              alignItems: 'baseline',
              gap: theme.spacing.sm,
            }}
          >
            <span
              style={{
                fontFamily: theme.fontFamily.body,
                fontSize: 13,
                fontWeight: theme.fontWeight.semibold,
                lineHeight: 1.25,
                color: theme.colors.black,
                letterSpacing: theme.letterSpacing.normal,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {displayPrice}
            </span>
            {displayComparePrice && (
              <span
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 11,
                  fontWeight: theme.fontWeight.regular,
                  color: theme.colors.textTertiary,
                  textDecoration: 'line-through',
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                {displayComparePrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ── Add to Cart — quarter-circle attached to bottom-right corner ──
          Implementation:
            - 60×60 square positioned at bottom:0, right:0 (NOT floating)
            - border-top-left-radius: 60px creates the quarter-circle arc
              whose center is at the button's bottom-right corner (= the
              card's bottom-right corner).
            - Card's overflow:hidden + 24px border-radius clips the button's
              bottom-right so it follows the card's curve — making the
              button feel "integrated into the card corner".
            - + icon is offset 14px from the bottom-right, placing its
              center at (32, 32) — the visual center of mass of the
              quarter circle (~34.5, 34.5).
      */}
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`${ctaLabel}: ${name}`}
        className="pc-add pressable"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: FAB_SIZE,
          height: FAB_SIZE,
          background: theme.colors.black,
          border: 'none',
          // Quarter circle: only top-left corner is rounded.
          // Other corners stay sharp — the card's overflow:hidden clips
          // the bottom-right corner to match the card's 24px border-radius.
          borderRadius: `${FAB_RADIUS}px 0 0 0`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: `0 ${FAB_ICON_OFFSET}px ${FAB_ICON_OFFSET}px 0`,
          cursor: 'pointer',
          boxShadow: theme.shadows.sm,
          transition: `transform 180ms ${theme.easing.easeOut}`,
          zIndex: 2,
          overflow: 'hidden',
          color: theme.colors.white,
        }}
      >
        {/* + icon — centered in the visible (bottom-right) region of the quarter circle */}
        <svg
          viewBox="0 0 24 24"
          width={FAB_ICON_SIZE}
          height={FAB_ICON_SIZE}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden
          style={{
            pointerEvents: 'none',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
        </svg>

        {/* Ripple elements */}
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden
            className="pc-ripple"
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
        .pc-card:active {
          transform: scale(0.97);
        }
        @media (hover: hover) {
          .pc-card:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.premiumLg};
          }
          .pc-card:hover .pc-img {
            transform: scale(1.03);
          }
        }
        .pc-card:focus-within {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .pc-add:active {
          transform: scale(1.08);
        }
        .pc-add:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .pc-ripple {
          animation: pc-ripple-anim 600ms ${theme.easing.easeOut} forwards;
        }
        @keyframes pc-ripple-anim {
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

export const ProductCard = memo(ProductCardImpl);
export default ProductCard;
