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
 * DESIGN INTENT (LN KICKS premium refresh):
 *   Taller, more editorial. Bigger display type. More breathing room.
 *   Same matte black canvas + white type + floating product, but pushed
 *   to a more dramatic, Apple-store-quality composition.
 *
 * Design contract:
 *   - Full-width matte black card with radius.hero (28px)
 *   - Asymmetric split: LEFT (eyebrow / brand / display headline /
 *     description / price / CTA) | RIGHT (large premium sneaker image)
 *   - Taller 280px min-height (up from 240) for editorial scale
 *   - "NEW" eyebrow chip (matte black on white pill, top-left)
 *   - Large display headline in Oswald — product name, bigger now
 *   - One-sentence description (Inter, soft grey)
 *   - Price row (white bold + strike-through)
 *   - "Shop Now" CTA button (white pill on black, arrow icon)
 *   - Floating sneaker on the right with drop-shadow, slight rotation
 *
 * LN KICKS theme: matte black background, white text, white product PNG,
 * pure luxury. No blue, no gradients. Inspired by Nike SNKRS app feature
 * cards + Apple Store product cards.
 *
 * Phase 4 polish:
 *  - All design tokens (no hardcoded values)
 *  - Taller 280px canvas for editorial scale
 *  - Bigger display headline (fontSize.h2 → fontSize.h1)
 *  - More padding inside for breathing room
 *  - Haptic medium tick on Add-to-Cart, selection tick on CTA
 *  - Pressed state on card (scale 0.99) and CTA (scale 0.94)
 *  - Focus-visible ring on the card link and the + button
 *  - ARIA: article + aria-label, button has descriptive aria-label
 *  - Memoized
 *  - Image uses loading="lazy" + decoding="async" for scroll perf
 *  - Hover: image lifts + rotates further; CTA lifts
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
        paddingTop: theme.spacing.sectionPadding,
        paddingBottom: theme.spacing.sm,
      }}
    >
      {/* Editorial section header */}
      <div
        style={{
          padding: `0 ${theme.spacing.sectionPadding}px`,
          marginBottom: theme.spacing.sectionPadding,
        }}
      >
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
          Just Landed
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: theme.spacing.md,
          }}
        >
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
            New Arrivals
          </h2>
          <Link
            href="/products?filter=new"
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

      {/* Featured promotional banner */}
      <div style={{ padding: `0 ${theme.spacing.sectionPadding}px` }}>
        <article
          className="mna-card pressable"
          style={{
            position: 'relative',
            background: theme.colors.black,
            borderRadius: theme.radius.largeCard,
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '58fr 42fr',
            minHeight: 280,
            boxShadow: theme.shadows.lg,
            border: 'none',
          }}
        >
          {/* Decorative oversized wordmark watermark */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              bottom: -40,
              right: -12,
              fontFamily: theme.fontFamily.display,
              fontSize: 180,
              fontWeight: theme.fontWeight.black,
              color: 'rgba(255,255,255,0.045)',
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
              padding: `${theme.spacing.sectionGap}px ${theme.spacing.sectionPadding}px ${theme.spacing.sectionGap}px ${theme.spacing.sectionPadding}px`,
            }}
          >
            {/* NEW eyebrow chip — Button style 15px / 600 */}
            <span
              style={{
                alignSelf: 'flex-start',
                background: theme.colors.white,
                color: theme.colors.black,
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.lg,
                fontWeight: theme.fontWeight.semibold,
                letterSpacing: theme.letterSpacing.normal,
                padding: `${theme.spacing.xs + 1}px ${theme.spacing.md}px`,
                borderRadius: theme.radius.button,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {collection}
            </span>

            {/* Brand label — 12px / 500 / uppercase / 0.5px tracking */}
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

            {/* Display headline — Hero 32px / 700 / 38px line height */}
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

            {/* Description — Body 14px / 400 / 20px line height */}
            <p
              style={{
                margin: 0,
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.regular,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: theme.lineHeight.body,
                maxWidth: 220,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {desc}
            </p>

            {/* Price row — 18px / 700 (per Phase 6 spec) */}
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
                  color: theme.colors.white,
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
                    color: 'rgba(255,255,255,0.45)',
                    textDecoration: 'line-through',
                    fontWeight: theme.fontWeight.medium,
                    opacity: 0.6,
                    fontFeatureSettings: theme.fontFeatures,
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
                  // Primary button: #111111 bg, white text, 48px height, 14px radius
                  background: theme.colors.primaryButton,
                  color: theme.colors.buttonText,
                  height: theme.spacing.buttonHeight,
                  padding: `0 ${theme.spacing.sectionPadding}px`,
                  borderRadius: theme.radius.button,
                  fontFamily: theme.fontFamily.body,
                  fontSize: theme.fontSize.lg,
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
                  transition: `transform ${theme.duration.instant} ${theme.easing.easeOut}, border-color ${theme.duration.standard} ${theme.easing.easeOut}`,
                }}
              >
                {/* Action icon = 22px per Phase 6 spec */}
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
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
                  maxWidth: '135%',
                  maxHeight: '135%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: theme.dropShadows.lg,
                  transform: 'rotate(-14deg)',
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
            @media (hover: hover) {
              .mna-card:hover .mna-img {
                transform: rotate(-18deg) translateY(-6px) scale(1.05);
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
