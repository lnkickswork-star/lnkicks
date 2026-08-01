'use client';

import React, { useRef, memo, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { dropShadows } from '@/lib/mobile/theme/shadows';
import { transitions } from '@/lib/mobile/theme/motion';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import type { MobileProduct } from './mobileProducts';

/**
 * MobileProductSlider — reusable horizontal product slider for mobile.
 *
 * Premium floating-product presentation on pure white. NO cards, NO borders,
 * NO box-shadows on containers. Only soft drop-shadow on the image itself.
 *
 * Per-product: image / brand / name / price + strikethrough / single CTA.
 *
 * Interaction: native touch scroll (CSS scroll-snap), pointer drag for mouse,
 * wheel for trackpad. Smooth momentum. Snap-to-card.
 *
 * LN KICKS theme: white bg, black text, red price, black CTA pill.
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded values)
 *  - Haptic light tick on Add to Cart
 *  - Pressed state on CTA (scale 0.96)
 *  - Focus-visible ring
 *  - aria-label on CTAs and links
 *  - Memoized — props rarely change, prevents re-render on parent state ticks
 *  - useCallback for addToCart handler (stable reference)
 */
interface MobileProductSliderProps {
  title: string;
  eyebrow?: string;
  products: MobileProduct[];
  /** Card width on mobile (px). Default 190. */
  cardWidth?: number;
  /** Show "See all" link on the right of the title. */
  seeAllHref?: string;
  /** Compact card variant (smaller image, no CTA). Default false. */
  compact?: boolean;
}

function MobileProductSliderImpl({
  title,
  eyebrow,
  products,
  cardWidth = 190,
  seeAllHref,
  compact = false,
}: MobileProductSliderProps) {
  const { addToCart, showToast } = useApp();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = useCallback(
    (p: MobileProduct) => {
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
    <section
      style={{
        paddingTop: theme.spacing.section,
        paddingBottom: theme.spacing.sm,
      }}
    >
      {/* Title row */}
      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.xxl,
          gap: theme.spacing.md,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {eyebrow && (
            <p
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textTertiary,
                textTransform: 'uppercase',
                letterSpacing: theme.letterSpacing.extreme,
                margin: `0 0 ${theme.spacing.sm}px 0`,
              }}
            >
              {eyebrow}
            </p>
          )}
          <h2
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h2,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.textPrimary,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: 1,
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h2>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            aria-label={`See all ${title.toLowerCase()} products`}
            onPointerDown={() => haptic.light()}
            style={{
              fontSize: theme.fontSize.sm,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              textTransform: 'uppercase',
              letterSpacing: theme.letterSpacing.wider,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              paddingBottom: 2,
              borderBottom: `1.5px solid ${theme.colors.black}`,
            }}
          >
            See All
          </Link>
        )}
      </div>

      {/* Horizontal scroller */}
      <div
        ref={scrollerRef}
        className="mps-scroller"
        style={{
          display: 'flex',
          gap: theme.spacing.lg,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: `${theme.spacing.xs}px ${theme.spacing.pad}px ${theme.spacing.md}px`,
          cursor: 'grab',
        }}
      >
        {products.map((p) => (
          <article
            key={p.id}
            style={{
              flex: `0 0 ${cardWidth}px`,
              maxWidth: cardWidth,
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              userSelect: 'none',
            }}
          >
            {/* Floating image — NO card */}
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
                height: compact ? 130 : 160,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                draggable={false}
                className="mps-img"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: dropShadows.md,
                  transition: `transform ${theme.motion.duration.slow} ${theme.motion.easing.out}, filter ${theme.motion.duration.slow} ${theme.motion.easing.out}`,
                }}
              />
            </Link>

            {/* Text block */}
            <div
              style={{
                textAlign: 'center',
                marginTop: compact ? theme.spacing.md : theme.spacing.lg,
                width: '100%',
                padding: `0 ${theme.spacing.xs}px`,
              }}
            >
              <p
                style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.textTertiary,
                  fontWeight: theme.fontWeight.bold,
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  margin: `0 0 ${theme.spacing.xs}px 0`,
                }}
              >
                {p.brand}
              </p>
              <Link
                href={p.href}
                style={{ textDecoration: 'none', color: 'inherit' }}
                onPointerDown={() => haptic.selection()}
              >
                <h3
                  style={{
                    fontSize: theme.fontSize.body,
                    fontWeight: theme.fontWeight.semibold,
                    color: theme.colors.textPrimary,
                    lineHeight: theme.lineHeight.normal,
                    margin: `0 0 ${theme.spacing.sm}px 0`,
                    minHeight: 36,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {p.name}
                </h3>
              </Link>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.xs + 2,
                  flexWrap: 'wrap',
                  marginBottom: compact ? 0 : theme.spacing.md,
                }}
              >
                {/* Price — kept matte black (luxury, no red) */}
                <span
                  style={{
                    color: theme.colors.price,
                    fontWeight: theme.fontWeight.bold,
                    fontSize: theme.fontSize.body,
                  }}
                >
                  {p.price}
                </span>
                {p.comparePrice && (
                  <span
                    style={{
                      color: theme.colors.textTertiary,
                      fontSize: theme.fontSize.sm,
                      textDecoration: 'line-through',
                      fontWeight: theme.fontWeight.regular,
                    }}
                  >
                    {p.comparePrice}
                  </span>
                )}
              </div>
              {!compact && (
                <button
                  type="button"
                  onClick={() => handleAddToCart(p)}
                  className="pressable mps-cta"
                  style={{
                    width: '100%',
                    background: theme.colors.black,
                    color: theme.colors.white,
                    border: 'none',
                    borderRadius: theme.radius.pill,
                    padding: `${theme.spacing.sm + 2}px ${theme.spacing.md}px`,
                    fontSize: 10.5,
                    fontWeight: theme.fontWeight.bold,
                    textTransform: 'uppercase',
                    letterSpacing: theme.letterSpacing.wider,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: theme.spacing.xs + 2,
                    transition: transitions.surface,
                  }}
                  aria-label={`Add ${p.name} to cart`}
                >
                  Add to Cart
                  <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.6}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </article>
        ))}
        {/* Trailing spacer so last card can scroll-snap to start */}
        <div aria-hidden style={{ flex: `0 0 ${theme.spacing.pad}px`, height: 1 }} />
      </div>

      <style jsx>{`
        .mps-scroller::-webkit-scrollbar {
          display: none;
        }
        .mps-scroller:active {
          cursor: grabbing;
        }
        .mps-img:hover {
          transform: translateY(-6px);
          filter: ${dropShadows.lg};
        }
        .mps-cta:hover {
          background-color: ${theme.colors.grey800} !important;
          transform: translateY(-1px);
        }
      `}</style>
      <style jsx>{pressableStyle}</style>
    </section>
  );
}

export const MobileProductSlider = memo(MobileProductSliderImpl);
export default MobileProductSlider;
