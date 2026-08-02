'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import type { MobileProduct } from '@/components/mobile/mobileProducts';

/**
 * MobileNewArrivals — premium promotional banner (SNKRS / Apple style).
 *
 * Design contract:
 *   - Full-width matte black card with radius.hero (28px)
 *   - Asymmetric split: LEFT (collection / product name / description /
 *     price / CTA) | RIGHT (large premium sneaker image)
 *   - Matches the visual weight of MobileHeroBanner — same radius, same
 *     premium shadow, same editorial typography
 *   - "NEW" eyebrow chip (matte black on white pill, top-left)
 *   - Large display headline in Oswald — collection or product name
 *   - One-sentence description (Inter, soft grey)
 *   - Price row (white bold + strike-through)
 *   - "Shop Now" CTA button (white pill on black, arrow icon)
 *   - Floating sneaker on the right with drop-shadow, slight rotation
 *
 * LN KICKS theme: matte black background, white text, white product PNG,
 * pure luxury. No blue, no gradients. Inspired by Nike SNKRS app feature
 * cards + Apple Store product cards.
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded values)
 *  - Haptic medium tick on Add-to-Cart, selection tick on CTA
 *  - Pressed state on card (scale 0.99) and CTA (scale 0.94)
 *  - Focus-visible ring on the card link and the + button
 *  - ARIA: article + aria-label, button has descriptive aria-label
 *  - Memoized
 *  - Image uses loading="lazy" + decoding="async" for scroll perf
 */
type MobileNewArrivalsProps = {
  product: MobileProduct;
  /** Optional collection label shown above product name (e.g. "Summer Drop") */
  collection?: string;
  /** Optional one-line marketing description */
  description?: string;
};

function MobileNewArrivalsImpl({
  product,
  collection = 'New Arrival',
  description,
}: MobileNewArrivalsProps) {
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

  // Default description if none provided — uses brand + a short marketing line
  const desc =
    description ??
    `Fresh ${product.brand} straight off the truck. Limited sizes available.`;

  return (
    <section
      aria-label="New Arrivals"
      style={{
        paddingTop: theme.spacing.xxl,
        paddingBottom: theme.spacing.sm,
      }}
    >
      {/* Section header */}
      <div
        style={{
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
          New Arrivals
        </h2>
        <p
          style={{
            margin: `${theme.spacing.xs}px 0 0`,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textSecondary,
            fontWeight: theme.fontWeight.regular,
          }}
        >
          Fresh pairs, straight off the truck.
        </p>
      </div>

      {/* Featured promotional banner */}
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        <article
          className="mna-card pressable"
          style={{
            position: 'relative',
            background: theme.colors.black,
            borderRadius: theme.radius.hero,
            overflow: 'hidden',
            display: 'grid',
            // Left ~58% text / Right ~42% image — premium editorial split
            gridTemplateColumns: '58fr 42fr',
            minHeight: 240,
            boxShadow: theme.shadows.lg,
            border: 'none',
          }}
        >
          {/* Decorative oversized wordmark watermark */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              bottom: -34,
              right: -10,
              fontFamily: theme.fontFamily.display,
              fontSize: 160,
              fontWeight: theme.fontWeight.black,
              color: 'rgba(255,255,255,0.05)',
              letterSpacing: '-0.06em',
              lineHeight: 1,
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 0,
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
              padding: `${theme.spacing.xxl}px ${theme.spacing.xl}px ${theme.spacing.xxl}px ${theme.spacing.xxl}px`,
            }}
          >
            {/* NEW eyebrow chip */}
            <span
              style={{
                alignSelf: 'flex-start',
                background: theme.colors.white,
                color: theme.colors.black,
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                padding: `${theme.spacing.xs + 1}px ${theme.spacing.sm + 2}px`,
                borderRadius: theme.radius.pill,
              }}
            >
              {collection}
            </span>

            {/* Brand label */}
            <span
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              {product.brand}
            </span>

            {/* Display headline — product name, large */}
            <h3
              style={{
                margin: 0,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.h2,
                fontWeight: theme.fontWeight.extrabold,
                lineHeight: theme.lineHeight.tight,
                letterSpacing: theme.letterSpacing.tight,
                color: theme.colors.white,
                textTransform: 'uppercase',
              }}
            >
              {product.name}
            </h3>

            {/* Description */}
            <p
              style={{
                margin: 0,
                fontSize: theme.fontSize.sm,
                fontWeight: theme.fontWeight.regular,
                color: 'rgba(255,255,255,0.72)',
                lineHeight: theme.lineHeight.snug,
                maxWidth: 220,
              }}
            >
              {desc}
            </p>

            {/* Price row */}
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
                  fontSize: theme.fontSize.xxl,
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.white,
                  letterSpacing: theme.letterSpacing.tight,
                }}
              >
                {product.price}
              </span>
              {product.comparePrice && (
                <span
                  style={{
                    fontSize: theme.fontSize.md,
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'line-through',
                    fontWeight: theme.fontWeight.regular,
                  }}
                >
                  {product.comparePrice}
                </span>
              )}
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
                  background: theme.colors.white,
                  color: theme.colors.black,
                  padding: `${theme.spacing.sm + 2}px ${theme.spacing.lg}px`,
                  borderRadius: theme.radius.pill,
                  fontSize: theme.fontSize.xs,
                  fontWeight: theme.fontWeight.bold,
                  letterSpacing: theme.letterSpacing.wider,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Shop Now
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  <polyline points="12 5 19 12 12 19" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              {/* Add-to-cart icon button — outline style on dark bg */}
              <button
                type="button"
                onClick={handleAdd}
                aria-label={`Add ${product.name} to cart`}
                className="pressable mna-add"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: 'transparent',
                  color: theme.colors.white,
                  border: `1.5px solid rgba(255,255,255,0.32)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                  <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                  <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Right: large sneaker image ─────────────────────────── */}
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
                  maxWidth: '130%',
                  maxHeight: '130%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: theme.dropShadows.lg,
                  transform: 'rotate(-12deg)',
                  transition: `transform ${theme.motion.duration.slow} ${theme.motion.easing.out}`,
                }}
              />
            </Link>
          </div>

          <style jsx>{pressableStyle}</style>
          <style jsx>{`
            .mna-card:active {
              transform: scale(0.99);
            }
            .mna-cta:active {
              transform: scale(0.94);
            }
            .mna-add:active {
              transform: scale(0.88);
              border-color: ${theme.colors.white};
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
            @media (hover: hover) {
              .mna-card:hover .mna-img {
                transform: rotate(-16deg) translateY(-4px) scale(1.04);
              }
              .mna-cta:hover {
                background: ${theme.colors.grey200};
                transform: translateY(-1px);
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
