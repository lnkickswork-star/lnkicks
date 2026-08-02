'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import type { MobileProduct } from '@/components/mobile/mobileProducts';
import { ProductCard } from '@/components/mobile/ProductCard';

/**
 * MobilePopularShoes — horizontal swipe carousel of premium product cards.
 *
 * PHASE 12 REFACTOR
 *   - Now uses the shared <ProductCard /> component (single source of truth).
 *   - The card itself is defined in components/mobile/ProductCard.tsx and
 *     matches the Apple/Nike/GOAT-inspired master spec: white card, 24px
 *     radius, 24px padding, blue category label, 22px bold title, 22px
 *     bold price, signature black quarter-circle "+" Add to Cart button
 *     integrated into the bottom-right corner.
 *   - This file only owns the section header + horizontal scroller.
 */

type MobilePopularShoesProps = {
  products: MobileProduct[];
  title?: string;
  seeAllHref?: string;
};

function MobilePopularShoesImpl({
  products,
  title = 'Popular Shoes',
  seeAllHref = '/products?filter=popular',
}: MobilePopularShoesProps) {
  return (
    <section
      aria-label={title}
      style={{
        // Phase 23: removed the +8px marginTop — the parent <main> flex gap
        // (now 16px) is the sole source of vertical rhythm.
      }}
    >
      {/* Section header — 24px / 700 / 30px line height */}
      <div
        style={{
          padding: `0 ${theme.spacing.sectionPadding}px`,
          // Phase 23: tighter header→cards gap (8px, was 16px)
          marginBottom: theme.spacing.sm,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
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
              Most Wanted
            </p>
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
              {title}
            </h2>
          </div>
          <Link
            href={seeAllHref}
            className="pressable"
            onPointerDown={() => haptic.light()}
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

      {/* Horizontal swipe carousel — uses the shared ProductCard */}
      <div
        role="list"
        className="mps-scroller"
        style={{
          display: 'flex',
          gap: theme.spacing.cardGapLg,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          // Phase 23: 12px TOP padding so card shadows aren't clipped and
          // cards don't touch the section border on top (was 4px which
          // caused the "0 top space" issue). 12px bottom for symmetry.
          padding: `${theme.spacing.md}px ${theme.spacing.sectionPadding}px ${theme.spacing.md}px`,
          msOverflowStyle: 'none',
        }}
      >
        {products.map((p) => (
          <div role="listitem" key={p.id} style={{ display: 'flex' }}>
            <ProductCard
              id={p.id}
              name={p.name}
              brand={p.brand}
              image={p.image}
              price={p.price}
              priceValue={p.priceValue}
              href={p.href}
              category={p.brand}
              width={180}
            />
          </div>
        ))}
        {/* Trailing spacer so the last card can scroll into the page gutter */}
        <div aria-hidden style={{ flex: '0 0 auto', width: 0 }} />
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .mps-scroller::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export const MobilePopularShoes = memo(MobilePopularShoesImpl);
export default MobilePopularShoes;
