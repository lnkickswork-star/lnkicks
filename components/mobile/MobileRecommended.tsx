'use client';

import React, { memo, useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { dropShadows } from '@/lib/mobile/theme/shadows';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { MOBILE_RECOMMENDED } from './mobileProducts';

/**
 * MobileRecommended — "Recommended For You" 2-column grid.
 *
 * PHASE 7 PREMIUM REDESIGN
 *   - 24px radius (radius.productCard) — matches Popular/New cards
 *   - Larger image area (4:3 aspect ratio, was 150px fixed height)
 *   - 22px internal padding — luxury breathing room
 *   - Product Name: 20px / 600 (was 16px)
 *   - Price: 22px / 700 (was 18px)
 *   - Brand: 12px / 500 gray (unchanged)
 *   - Rating: small minimal light gray stars
 *   - Floating circular Add button bottom-right with RIPPLE effect
 *   - Replaced the wide "Add to Cart" button with a small floating + button
 *   - Consistent card system across all product surfaces
 *
 * LN KICKS theme: white bg, black text, black price, black star rating,
 * floating black + button. Minimal luxury.
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
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  return { ripples, trigger };
}

function MobileRecommendedImpl() {
  const { addToCart, showToast } = useApp();

  const handleAddToCart = useCallback(
    (p: typeof MOBILE_RECOMMENDED[number]) => {
      haptic.light();
      addToCart({
        id: p.id,
        name: p.name,
        price: p.priceValue,
        image: p.image,
        qty: 1,
      });
      showToast(`${p.name} added to cart`);
    },
    [addToCart, showToast],
  );

  return (
    <section style={{ paddingTop: theme.spacing.sectionSpacing }}>
      <div
        style={{
          padding: `0 ${theme.spacing.sectionPadding}px`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.sectionPadding,
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
            Picked For You
          </p>
          {/* Section Heading — 24px / 700 / 30px line height */}
          <h2
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.section,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.section,
              margin: 0,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Recommended
          </h2>
        </div>
        <Link
          href="/products?filter=recommended"
          aria-label="See all recommended products"
          onPointerDown={() => haptic.light()}
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.semibold,
            color: theme.colors.textPrimary,
            letterSpacing: theme.letterSpacing.normal,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            paddingBottom: 2,
            borderBottom: `1.5px solid ${theme.colors.black}`,
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          See All
        </Link>
      </div>

      <div
        style={{
          padding: `0 ${theme.spacing.sectionPadding}px`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.spacing.cardGapLg,
        }}
      >
        {MOBILE_RECOMMENDED.map((p) => (
          <RecommendedCard
            key={p.id}
            product={p}
            onAdd={handleAddToCart}
          />
        ))}
      </div>

      <style jsx>{pressableStyle}</style>
    </section>
  );
}

/* ── Single recommended card ──────────────────────────────────── */
type RecommendedCardProps = {
  product: typeof MOBILE_RECOMMENDED[number];
  onAdd: (p: typeof MOBILE_RECOMMENDED[number]) => void;
};

function RecommendedCardImpl({ product: p, onAdd }: RecommendedCardProps) {
  const { ripples, trigger } = useRipple();

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    trigger(e);
    onAdd(p);
  };

  return (
    <article
      className="mrec-tile pressable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: theme.colors.white,
        // Phase 7: 24px radius — matches Popular/New cards
        borderRadius: theme.radius.productCard,
        border: 'none',
        boxShadow: theme.shadows.premium,
        overflow: 'hidden',
        position: 'relative',
        transition: `transform ${theme.duration.standard} ${theme.easing.easeOut}, box-shadow ${theme.duration.standard} ${theme.easing.easeOut}`,
      }}
    >
      {/* Image area — Phase 7: 4:3 aspect ratio (was 150px fixed height) */}
      <Link
        href={p.href}
        aria-label={`${p.brand} ${p.name} — ${p.price}`}
        onPointerDown={() => haptic.selection()}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          aspectRatio: '4 / 3',
          background: theme.colors.grey100,
          overflow: 'hidden',
          padding: theme.spacing.cardPadding,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="mrec-img"
          style={{
            maxWidth: '95%',
            maxHeight: '95%',
            objectFit: 'contain',
            filter: dropShadows.md,
            transition: `transform ${theme.duration.slow} ${theme.easing.easeOut}, filter ${theme.duration.slow} ${theme.easing.easeOut}`,
          }}
        />
      </Link>

      <div
        style={{
          // Phase 7: 22px card padding
          padding: `${theme.spacing.md}px ${theme.spacing.cardPadding}px ${theme.spacing.cardPadding}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: theme.spacing.xs,
        }}
      >
        {/* Brand — 12px / 500 / uppercase / 0.5px tracking */}
        <p
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: theme.fontSize.caption,
            color: theme.colors.textSecondary,
            fontWeight: theme.fontWeight.medium,
            textTransform: 'uppercase',
            letterSpacing: theme.letterSpacing.brandName,
            margin: 0,
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          {p.brand}
        </p>
        <Link
          href={p.href}
          style={{ textDecoration: 'none', color: 'inherit' }}
          onPointerDown={() => haptic.selection()}
        >
          {/* Product Name — Phase 7: 20px / 600 (was 16px) */}
          <h3
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.productNameLg,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textPrimary,
              lineHeight: theme.lineHeight.product,
              letterSpacing: theme.letterSpacing.normal,
              margin: 0,
              minHeight: 52,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {p.name}
          </h3>
        </Link>

        {/* Rating row — Caption 12px / 400, minimal light gray */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.hairline + 2,
            marginBottom: theme.spacing.xs,
          }}
        >
          <Stars rating={p.rating || 5} />
          <span
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.caption,
              color: theme.colors.textTertiary,
              fontWeight: theme.fontWeight.regular,
              marginLeft: 2,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {p.rating?.toFixed(1) || '5.0'}
          </span>
        </div>

        {/* Price — Phase 7: 22px / 700 (was 18px); Original 14px / 500 / strikethrough / 60% opacity */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs + 2,
            flexWrap: 'wrap',
            marginBottom: theme.spacing.sm,
          }}
        >
          <span
            style={{
              fontFamily: theme.fontFamily.body,
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeight.bold,
              fontSize: theme.fontSize.priceLg,
              letterSpacing: theme.letterSpacing.normal,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {p.price}
          </span>
          {p.comparePrice && (
            <span
              style={{
                fontFamily: theme.fontFamily.body,
                color: theme.colors.textTertiary,
                fontSize: theme.fontSize.md,
                textDecoration: 'line-through',
                fontWeight: theme.fontWeight.medium,
                opacity: 0.6,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {p.comparePrice}
            </span>
          )}
        </div>

        {/* Floating Add-to-Cart button — bottom-right corner with ripple */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${p.name} to cart`}
          className="pressable mrec-add"
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
          {ripples.map((r) => (
            <span
              key={r.id}
              aria-hidden
              className="mrec-ripple"
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
      </div>

      <style jsx>{`
        @media (hover: hover) {
          .mrec-tile:hover {
            transform: scale(${theme.scale.cardHover});
            box-shadow: ${theme.shadows.premiumLg};
          }
          .mrec-tile:hover .mrec-img {
            transform: translateY(-4px) scale(1.04);
            filter: ${dropShadows.lg};
          }
        }
        .mrec-tile:active {
          transform: scale(${theme.scale.buttonPress});
        }
        .mrec-add:active {
          transform: scale(${theme.scale.buttonPress});
        }
        .mrec-ripple {
          animation: mrec-ripple-anim 600ms ${theme.easing.easeOut} forwards;
        }
        @keyframes mrec-ripple-anim {
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

const RecommendedCard = memo(RecommendedCardImpl);

export const MobileRecommended = memo(MobileRecommendedImpl);
export default MobileRecommended;

/* ──────────────────────────────────────────────────────────────────
 *  Stars — 5-star rating display (0.5 step).
 *  Minimal light gray stars (Phase 7 spec).
 *  Memoized — only re-renders when rating prop changes.
 * ────────────────────────────────────────────────────────────────── */
const Stars = memo(function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        const isHalf = i === full && half;
        return (
          <svg
            key={i}
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill={filled || isHalf ? theme.colors.grey500 : 'none'}
            stroke={filled || isHalf ? theme.colors.grey500 : theme.colors.grey300}
            strokeWidth="2"
            aria-hidden
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
});
