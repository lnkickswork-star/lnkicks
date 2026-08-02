'use client';

import React, { memo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import type { MobileProduct } from '@/components/mobile/mobileProducts';

/**
 * MobileNewArrivals — premium SNKRS / Apple-style feature banner.
 *
 * PHASE 22 REDESIGN — matches Adobe Express reference design.
 *   - Massive "NEW" watermark spanning the FULL card as a graphic
 *     background element (centered, ~220px tall, very subtle).
 *   - Removed description paragraph (cleaner, more editorial).
 *   - Removed strikethrough original price — only current price shown
 *     large and bold.
 *   - "Shop Now" button uses dark charcoal (#262626) bg so it reads
 *     as a distinct CTA against the pure black card (#0A0A0A).
 *   - Larger product image, floats directly on black with strong
 *     drop-shadow for depth.
 *   - 50/50 grid split — image gets more breathing room.
 *
 * LN KICKS theme: matte black background, white text, white product PNG,
 * pure luxury. No blue, no gradients.
 */

type MobileNewArrivalsProps = {
  product: MobileProduct;
  /** Optional collection label shown above product name (e.g. "Summer Drop") */
  collection?: string;
  /** Optional one-line marketing description — DEPRECATED in Phase 22.
   *  Kept for API compatibility but no longer rendered. */
  description?: string;
};

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

function MobileNewArrivalsImpl({
  product,
  collection = 'New Arrival',
}: MobileNewArrivalsProps) {
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
    <section
      aria-label="New Arrivals"
    >
      {/* Phase 17: removed the "Just Landed / New Arrivals / See all" editorial
          section header per user request — banner card stays exactly as is.
          The banner below now appears directly under whatever precedes it on
          the homepage, with the parent <main> flex gap (32px) controlling the
          vertical rhythm. */}

      {/* Featured promotional banner */}
      <div style={{ padding: `0 ${theme.spacing.sectionPadding}px` }}>
        <article
          className="mna-card pressable"
          style={{
            position: 'relative',
            background: theme.colors.black,
            // Phase 7: 24px radius — luxury magazine cover feel
            borderRadius: theme.radius.productCard,
            overflow: 'hidden',
            display: 'grid',
            // Phase 22: 50/50 split — image gets more breathing room
            gridTemplateColumns: '50fr 50fr',
            minHeight: 260,
            // Phase 8: standard premium shadow
            boxShadow: theme.shadows.premium,
            border: 'none',
          }}
        >
          {/* ── MASSIVE "NEW" watermark — spans full card as graphic ── */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: theme.fontFamily.display,
              // Phase 22: 220px — spans nearly the full card height
              fontSize: 220,
              fontWeight: theme.fontWeight.black,
              // Phase 22: slightly more visible (0.06) — reads as a graphic
              // element, not just a faint texture
              color: 'rgba(255,255,255,0.06)',
              letterSpacing: '-0.06em',
              lineHeight: 1,
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 0,
              whiteSpace: 'nowrap',
            }}
          >
            NEW
          </span>

          {/* ── Left: details ──────────────────────────────────────── */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: theme.spacing.sm,
              padding: `${theme.spacing.xl + 4}px ${theme.spacing.xl}px`,
            }}
          >
            {/* NEW eyebrow chip — white pill with black text */}
            <span
              style={{
                alignSelf: 'flex-start',
                background: theme.colors.white,
                color: theme.colors.black,
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.semibold,
                letterSpacing: theme.letterSpacing.normal,
                padding: `${theme.spacing.xs}px ${theme.spacing.sm + 2}px`,
                borderRadius: theme.radius.button,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {collection}
            </span>

            {/* Brand label — uppercase tracked grey */}
            <span
              style={{
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.caption,
                fontWeight: theme.fontWeight.medium,
                letterSpacing: theme.letterSpacing.brandName,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {product.brand}
            </span>

            {/* Display headline — Hero 24px / 700 */}
            <h3
              style={{
                margin: 0,
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.hero,
                fontWeight: theme.fontWeight.bold,
                lineHeight: theme.lineHeight.hero,
                letterSpacing: theme.letterSpacing.tight,
                color: theme.colors.white,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {product.name}
            </h3>

            {/* Price — Phase 22: ONLY current price, large & bold.
                Strikethrough original price removed per Adobe design. */}
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
                  fontSize: theme.fontSize.priceLg, // 17px
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.white,
                  letterSpacing: theme.letterSpacing.normal,
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                {product.price}
              </span>
            </div>

            {/* CTA + Add-to-cart row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                marginTop: theme.spacing.md,
              }}
            >
              <Link
                href={product.href}
                aria-label={`Shop ${product.name}`}
                onPointerDown={() => haptic.selection()}
                className="pressable mna-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.xs,
                  // Phase 22: dark charcoal #262626 — distinct from pure
                  // black card bg for clear depth perception
                  background: '#262626',
                  color: theme.colors.buttonText,
                  height: theme.spacing.buttonHeight,
                  padding: `0 ${theme.spacing.cardPadding + 4}px`,
                  borderRadius: theme.radius.button,
                  fontFamily: theme.fontFamily.body,
                  fontSize: theme.fontSize.md,
                  fontWeight: theme.fontWeight.semibold,
                  letterSpacing: theme.letterSpacing.normal,
                  textDecoration: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: `transform ${theme.duration.instant} ${theme.easing.easeOut}, background-color ${theme.duration.standard} ${theme.easing.easeOut}`,
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                Shop Now
                <svg
                  viewBox="0 0 24 24"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  aria-hidden
                >
                  <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  <polyline
                    points="12 5 19 12 12 19"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              {/* Add-to-cart icon button — outline style on dark bg, with ripple */}
              <button
                type="button"
                onClick={handleAdd}
                aria-label={`Add ${product.name} to cart`}
                className="pressable mna-add"
                style={{
                  width: theme.spacing.buttonHeight,
                  height: theme.spacing.buttonHeight,
                  borderRadius: '50%',
                  background: 'transparent',
                  color: theme.colors.white,
                  border: `1.5px solid rgba(255,255,255,0.3)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: `transform ${theme.duration.instant} ${theme.easing.easeOut}, border-color ${theme.duration.standard} ${theme.easing.easeOut}`,
                }}
              >
                {/* Action icon = 18px */}
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
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
                    className="mna-ripple"
                    style={{
                      position: 'absolute',
                      left: r.x,
                      top: r.y,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.4)',
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                      zIndex: 0,
                    }}
                  />
                ))}
              </button>
            </div>
          </div>

          {/* ── Right: large sneaker image — floats directly on black ── */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: theme.spacing.md,
              overflow: 'hidden',
            }}
          >
            <Link
              href={product.href}
              aria-label={`${product.brand} ${product.name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                textDecoration: 'none',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={`${product.brand} ${product.name}`}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="mna-img"
                style={{
                  // Phase 22: larger image — fills the right column,
                  // strong drop-shadow for depth against the black bg
                  maxWidth: '170%',
                  maxHeight: '170%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 32px rgba(0,0,0,0.55))',
                  transition: `transform ${theme.duration.slow} ${theme.easing.easeOut}`,
                }}
              />
            </Link>
          </div>

          <style jsx>{pressableStyle}</style>
          <style jsx>{`
            .mna-card:active {
              transform: scale(${theme.scale.buttonPress});
            }
            .mna-cta:active {
              transform: scale(${theme.scale.buttonPress});
            }
            .mna-add:active {
              transform: scale(${theme.scale.buttonPress});
              border-color: ${theme.colors.white};
            }
            @media (hover: hover) {
              .mna-card:hover {
                transform: scale(${theme.scale.cardHover});
                box-shadow: ${theme.shadows.editorialLg};
              }
              .mna-card:hover .mna-img {
                transform: translateY(-4px) scale(1.04);
              }
              .mna-card:hover .mna-cta {
                background: #333333;
              }
            }
            .mna-card:focus-within {
              outline: 2px solid ${theme.colors.white};
              outline-offset: 3px;
            }
            .mna-cta:focus-visible {
              outline: 2px solid ${theme.colors.white};
              outline-offset: 3px;
            }
            .mna-add:focus-visible {
              outline: 2px solid ${theme.colors.white};
              outline-offset: 3px;
            }
            .mna-ripple {
              animation: mna-ripple-anim 600ms ${theme.easing.easeOut} forwards;
            }
            @keyframes mna-ripple-anim {
              0% {
                width: 8px;
                height: 8px;
                opacity: 0.5;
              }
              100% {
                width: 140px;
                height: 140px;
                opacity: 0;
              }
            }
          `}</style>
        </article>
      </div>
    </section>
  );
}

export const MobileNewArrivals = memo(MobileNewArrivalsImpl);
export default MobileNewArrivals;
