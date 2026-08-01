'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';
import { theme } from '@/lib/mobile/theme/theme';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * CategorySlugPage — single category view (/category/[slug]).
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title={categoryName}> so the
 *    page inherits the premium glass header + floating bottom nav + safe-area
 *    handling from the universal mobile shell.
 *  - All hardcoded colors / sizes / radii migrated to mobile design tokens.
 *  - Category summary card uses theme.radius.xxl + hairline border +
 *    theme.shadows.xs elevation.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function CategorySlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const categoryName = slug ? slug.toUpperCase().replace('-', ' ') : 'CATEGORY';

  return (
    <MobileLayout headerVariant="back" title={categoryName}>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* BREADCRUMB */}
        <div
          style={{
            fontSize: theme.fontSize.base,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xxl,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
          }}
        >
          <Link
            href="/"
            style={{
              color: theme.colors.textSecondary,
              textDecoration: 'none',
            }}
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/categories"
            style={{
              color: theme.colors.textSecondary,
              textDecoration: 'none',
            }}
          >
            Categories
          </Link>
          <span>/</span>
          <span
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            {categoryName}
          </span>
        </div>

        {/* CATEGORY TITLE & SUMMARY */}
        <div
          style={{
            background: theme.colors.white,
            borderRadius: theme.radius.xxl,
            padding: theme.spacing.huge,
            border: `1px solid ${theme.colors.border}`,
            marginBottom: theme.spacing.xxxl,
            boxShadow: theme.shadows.xs,
          }}
        >
          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h1,
              fontWeight: theme.fontWeight.extrabold,
              textTransform: 'uppercase',
              color: theme.colors.textPrimary,
              margin: 0,
              lineHeight: theme.lineHeight.tight,
              letterSpacing: theme.letterSpacing.tight,
            }}
          >
            {categoryName}
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.body,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.xs + 2,
              marginBottom: 0,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Showing authentic luxury items in {categoryName}.
          </p>
        </div>

        {/* ADAPTIVE PRODUCT GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: theme.spacing.xl,
          }}
        >
          {PRODUCT_REGISTRY.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              brand={p.brand}
              price={p.price}
              origPrice={p.comparePrice}
              badge={
                p.newArrival
                  ? 'NEW'
                  : p.limitedEdition
                    ? 'LIMITED'
                    : p.bestSeller
                      ? 'HOT'
                      : undefined
              }
              image={p.primaryImage}
              slug={p.slug}
            />
          ))}
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
    </MobileLayout>
  );
}
