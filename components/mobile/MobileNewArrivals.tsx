'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import type { MobileProduct } from '@/components/mobile/mobileProducts';

/**
 * MobileNewArrivals — large featured product card.
 *
 * Visual contract:
 *   - Full-width card with rounded corners (radius.xxl)
 *   - Soft grey background image area (aspect ~4:5) containing the
 *     floating product PNG (drop-shadow on image, not card)
 *   - Overlayed "NEW" eyebrow chip top-left (matte black bg, white text)
 *   - Below image: brand label + product name (bold) + price row
 *   - Bottom-right: large circular Add-to-Cart button (matte black)
 *
 * Premium minimal — Apple Store / Nike App featured product card vibe.
 *
 * LN KICKS theme: matte black accents, no blue, soft grey surface.
 */
type MobileNewArrivalsProps = {
  product: MobileProduct;
  eyebrow?: string;
};

function MobileNewArrivalsImpl({
  product,
  eyebrow = 'New Arrival',
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

      {/* Featured card */}
      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
        }}
      >
        <article
          className="mna-card pressable"
          style={{
            position: 'relative',
            background: theme.colors.white,
            borderRadius: theme.radius.xxl,
            border: `1px solid ${theme.colors.grey150}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Link
            href={product.href}
            aria-label={`${product.brand} ${product.name}, ${product.price}`}
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
          >
            {/* Image area */}
            <div
              style={{
                position: 'relative',
                background: theme.colors.grey100,
                aspectRatio: '4 / 3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.spacing.xxl,
                overflow: 'hidden',
              }}
            >
              {/* NEW eyebrow chip */}
              <span
                style={{
                  position: 'absolute',
                  top: theme.spacing.md,
                  left: theme.spacing.md,
                  background: theme.colors.black,
                  color: theme.colors.white,
                  fontSize: theme.fontSize.xs,
                  fontWeight: theme.fontWeight.bold,
                  letterSpacing: theme.letterSpacing.wider,
                  textTransform: 'uppercase',
                  padding: `${theme.spacing.xs + 1}px ${theme.spacing.sm + 2}px`,
                  borderRadius: theme.radius.pill,
                  zIndex: 2,
                }}
              >
                {eyebrow}
              </span>

              <img
                src={product.image}
                alt={`${product.brand} ${product.name}`}
                loading="lazy"
                decoding="async"
                style={{
                  maxWidth: '78%',
                  maxHeight: '78%',
                  objectFit: 'contain',
                  filter: theme.dropShadows.lg,
                  transition: `transform ${theme.motion.duration.slow} ${theme.motion.easing.out}`,
                }}
              />
            </div>

            {/* Body */}
            <div
              style={{
                padding: `${theme.spacing.lg}px ${theme.spacing.lg}px ${theme.spacing.lg + 2}px`,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.xs,
              }}
            >
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
              <h3
                style={{
                  margin: 0,
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.h2,
                  fontWeight: theme.fontWeight.extrabold,
                  lineHeight: theme.lineHeight.tight,
                  letterSpacing: theme.letterSpacing.tight,
                  color: theme.colors.textPrimary,
                }}
              >
                {product.name}
              </h3>
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
                    color: theme.colors.textPrimary,
                  }}
                >
                  {product.price}
                </span>
                {product.comparePrice && (
                  <span
                    style={{
                      fontSize: theme.fontSize.md,
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

          {/* Floating Add-to-Cart button */}
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className="mna-add pressable"
            style={{
              position: 'absolute',
              bottom: theme.spacing.lg,
              right: theme.spacing.lg,
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: theme.colors.black,
              color: theme.colors.white,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: theme.shadows.lg,
              zIndex: 3,
            }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            </svg>
          </button>

          <style jsx>{pressableStyle}</style>
          <style jsx>{`
            .mna-card:active {
              transform: scale(0.99);
            }
            .mna-add:active {
              transform: scale(0.9);
            }
            .mna-card:focus-within {
              outline: 2px solid ${theme.colors.black};
              outline-offset: 2px;
            }
            @media (hover: hover) {
              .mna-card:hover img {
                transform: translateY(-6px) scale(1.03);
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
