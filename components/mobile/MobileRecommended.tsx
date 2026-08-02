'use client';

import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { MOBILE_RECOMMENDED } from './mobileProducts';
import { ProductCard } from '@/components/mobile/ProductCard';

/**
 * MobileRecommended — "Recommended For You" 2-column grid.
 *
 * PHASE 12 REFACTOR
 *   - Now uses the shared <ProductCard /> component (single source of truth).
 *   - The card itself is defined in components/mobile/ProductCard.tsx and
 *     matches the Apple/Nike/GOAT-inspired master spec.
 *   - This file only owns the section header + 2-col grid layout.
 *
 * LN KICKS theme: white bg, black text, black price, blue category label,
 * black quarter-circle + button in bottom-right corner. Minimal luxury.
 */

function MobileRecommendedImpl() {
  const { addToCart, showToast } = useApp();

  // Per-card add handler — preserves the existing toast + cart behavior.
  // The shared ProductCard also handles haptics + ripple internally.
  const handleAddToCart = useCallback(
    (p: typeof MOBILE_RECOMMENDED[number]) => {
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
    <section>
      <div
        style={{
          padding: `0 ${theme.spacing.sectionPadding}px`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          // Phase 23: tighter header→grid gap (8px, was 16px)
          marginBottom: theme.spacing.sm,
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
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            brand={p.brand}
            image={p.image}
            price={p.price}
            priceValue={p.priceValue}
            href={p.href}
            category={p.brand}
            width="100%"
            showToastOnAdd
            onAddToCart={() => handleAddToCart(p)}
          />
        ))}
      </div>

      <style jsx>{pressableStyle}</style>
    </section>
  );
}

export const MobileRecommended = memo(MobileRecommendedImpl);
export default MobileRecommended;
