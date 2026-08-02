'use client';

import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { dropShadows } from '@/lib/mobile/theme/shadows';
import { transitions } from '@/lib/mobile/theme/motion';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { MOBILE_RECOMMENDED } from './mobileProducts';

/**
 * MobileRecommended — "Recommended For You" section.
 *
 * DESIGN INTENT (LN KICKS premium refresh):
 *   2-column grid with soft grey surface tiles behind floating products.
 *   Cleaner typography. More breathing room. Premium Add-to-Cart pill.
 *
 * LN KICKS theme: white bg, black text, black price, black CTA pill,
 * black star rating. Minimal luxury.
 *
 * Phase 4 polish: design tokens, haptics, pressed states, focus rings,
 * memoization, useCallback for addToCart, Stars memoized, premium tiles.
 */
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
    <section style={{ paddingTop: theme.spacing.sectionPadding }}>
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
          gap: theme.spacing.cardGap,
        }}
      >
        {MOBILE_RECOMMENDED.map((p) => (
          <article
            key={p.id}
            className="mrec-tile"
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: theme.colors.white,
              borderRadius: theme.radius.card,
              border: `1px solid ${theme.colors.grey100}`,
              boxShadow: theme.shadows.premium,
              overflow: 'hidden',
              transition: `transform ${theme.duration.standard} ${theme.easing.easeOut}, box-shadow ${theme.duration.standard} ${theme.easing.easeOut}`,
            }}
          >
            {/* Image area — soft grey tile, full-bleed within card */}
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
                height: 150,
                background: theme.colors.grey100,
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                draggable={false}
                className="mrec-img"
                style={{
                  maxWidth: '88%',
                  maxHeight: '88%',
                  objectFit: 'contain',
                  filter: dropShadows.md,
                  transition: `transform ${theme.duration.slow} ${theme.easing.easeOut}, filter ${theme.duration.slow} ${theme.easing.easeOut}`,
                }}
              />
            </Link>

            <div
              style={{
                padding: `${theme.spacing.md}px ${theme.spacing.cardGap}px ${theme.spacing.cardGap}px`,
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
                {/* Product Name — 16px / 600 / 22px line height */}
                <h3
                  style={{
                    fontFamily: theme.fontFamily.body,
                    fontSize: theme.fontSize.productName,
                    fontWeight: theme.fontWeight.semibold,
                    color: theme.colors.textPrimary,
                    lineHeight: theme.lineHeight.product,
                    letterSpacing: theme.letterSpacing.normal,
                    margin: 0,
                    minHeight: 44,
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

              {/* Rating row — Caption 12px / 400 */}
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
                    color: theme.colors.textSecondary,
                    fontWeight: theme.fontWeight.regular,
                    marginLeft: 2,
                    fontFeatureSettings: theme.fontFeatures,
                  }}
                >
                  {p.rating?.toFixed(1) || '5.0'}
                </span>
              </div>

              {/* Price — 18px / 700 (per Phase 6 spec); Original 14px / 500 / strikethrough / 60% opacity */}
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
                    fontSize: theme.fontSize.price,
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
              {/* Add to Cart — Primary button: 48px height, 14px radius, #111111 bg, white text, 15px / 600 */}
              <button
                type="button"
                onClick={() => handleAddToCart(p)}
                className="pressable mrec-cta"
                style={{
                  width: '100%',
                  background: theme.colors.primaryButton,
                  color: theme.colors.buttonText,
                  border: 'none',
                  borderRadius: theme.radius.button,
                  height: theme.spacing.buttonHeight,
                  padding: `0 ${theme.spacing.md}px`,
                  fontFamily: theme.fontFamily.body,
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.semibold,
                  letterSpacing: theme.letterSpacing.normal,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.xs + 2,
                  transition: transitions.surface,
                  fontFeatureSettings: theme.fontFeatures,
                }}
                aria-label={`Add ${p.name} to cart`}
              >
                Add to Cart
                {/* Card icon = 20px per Phase 6 spec */}
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.4}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            </div>
          </article>
        ))}
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
          .mrec-cta:hover {
            background-color: ${theme.colors.grey800} !important;
            transform: translateY(-1px);
          }
        }
        .mrec-cta:active {
          transform: scale(${theme.scale.buttonPress});
        }
      `}</style>
      <style jsx>{pressableStyle}</style>
    </section>
  );
}

export const MobileRecommended = memo(MobileRecommendedImpl);
export default MobileRecommended;

/* ──────────────────────────────────────────────────────────────────
 *  Stars — 5-star rating display (0.5 step).
 *  Black filled stars, soft grey empty stars. Compact 12px size.
 *
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
            fill={filled || isHalf ? theme.colors.black : 'none'}
            stroke={filled || isHalf ? theme.colors.black : theme.colors.grey300}
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
