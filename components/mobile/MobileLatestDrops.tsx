'use client';

import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { dropShadows } from '@/lib/mobile/theme/shadows';
import { transitions } from '@/lib/mobile/theme/motion';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { MOBILE_LATEST } from './mobileProducts';

/**
 * MobileLatestDrops — 2-column new arrivals grid.
 *
 * Premium floating-product presentation. NO cards, NO borders, NO box-shadows.
 * Each tile: floating sneaker on white + brand / name / price + Add to Cart.
 *
 * LN KICKS theme: white bg, black text, red price, black CTA pill.
 *
 * Phase 3 polish: design tokens, haptics, pressed states, focus rings,
 * memoization, useCallback for addToCart.
 */
function MobileLatestDropsImpl() {
  const { addToCart, showToast } = useApp();

  const handleAddToCart = useCallback(
    (p: typeof MOBILE_LATEST[number]) => {
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
    <section style={{ paddingTop: theme.spacing.section }}>
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
        <div>
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
            Fresh Arrivals
          </p>
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
            Latest Drops
          </h2>
        </div>
        <Link
          href="/products?filter=new"
          aria-label="See all latest drops"
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
      </div>

      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.spacing.lg,
        }}
      >
        {MOBILE_LATEST.map((p) => (
          <article
            key={p.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
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
                height: 140,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                draggable={false}
                className="mld-img"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: dropShadows.md,
                  transition: `transform ${theme.motion.duration.slow} ${theme.motion.easing.out}, filter ${theme.motion.duration.slow} ${theme.motion.easing.out}`,
                }}
              />
            </Link>

            <div
              style={{
                textAlign: 'center',
                marginTop: theme.spacing.md + 2,
                width: '100%',
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
                  marginBottom: theme.spacing.md,
                }}
              >
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
              <button
                type="button"
                onClick={() => handleAddToCart(p)}
                className="pressable mld-cta"
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
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .mld-img:hover {
          transform: translateY(-6px);
          filter: ${dropShadows.lg};
        }
        .mld-cta:hover {
          background-color: ${theme.colors.grey800} !important;
          transform: translateY(-1px);
        }
      `}</style>
      <style jsx>{pressableStyle}</style>
    </section>
  );
}

export const MobileLatestDrops = memo(MobileLatestDropsImpl);
export default MobileLatestDrops;
