'use client';

import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ResponsiveProductCard } from '@/components/ResponsiveProductCard';
import { PRODUCT_CATALOG } from '@/components/catalog/ProductCatalogRegistry';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * CategoryProductsPage — flat catalog view (/category-products) with filter
 * + sort UI shell. Distinct from /products which only lists PRODUCT_REGISTRY;
 * this route lists the wider PRODUCT_CATALOG registry.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title="Category"> so the page
 *    inherits the premium glass header + floating bottom nav + safe-area
 *    handling from the universal mobile shell.
 *  - All hardcoded colors / sizes / radii migrated to mobile design tokens.
 *  - Filter / sort controls use theme.radius.xl + grey100 / border tokens.
 *  - Haptic feedback on filter + sort interactions.
 *  - `pressable` class + styled-jsx for press-state micro-interactions.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function CategoryProductsPage() {
  return (
    <MobileLayout headerVariant="back" title="Category"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Products' },
      ]}
      desktopMaxWidth={1280}
    >
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
            All Products
          </span>
        </div>

        {/* HEADER & FILTER BAR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.xxxl,
            flexWrap: 'wrap',
            gap: theme.spacing.lg,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.title,
                fontWeight: theme.fontWeight.extrabold,
                textTransform: 'uppercase',
                color: theme.colors.textPrimary,
                margin: 0,
                lineHeight: theme.lineHeight.tight,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              Sneakers &amp; Apparel Catalog
            </h1>
            <p
              style={{
                fontSize: theme.fontSize.body,
                color: theme.colors.textSecondary,
                margin: `${theme.spacing.xs}px 0 0`,
                lineHeight: theme.lineHeight.relaxed,
              }}
            >
              Showing {PRODUCT_CATALOG.length} authentic products
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
          >
            <Link
              href="/filters"
              onPointerDown={() => haptic.light()}
              className="pressable cp-chip"
              style={{
                padding: `${theme.spacing.sm + 2}px ${theme.spacing.xl}px`,
                background: theme.colors.grey100,
                color: theme.colors.textPrimary,
                borderRadius: theme.radius.xl,
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>Filter</span>
            </Link>
            <select
              aria-label="Sort products"
              onChange={() => haptic.selection()}
              className="pressable cp-select"
              style={{
                padding: `${theme.spacing.sm + 2}px ${theme.spacing.lg}px`,
                background: theme.colors.white,
                border: `1px solid ${theme.colors.borderStrong}`,
                borderRadius: theme.radius.xl,
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.semibold,
                color: theme.colors.textPrimary,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Drops</option>
            </select>
          </div>
        </div>

        {/* ADAPTIVE PRODUCT GRID (4-col Desktop / 2-col Mobile) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: theme.spacing.xl,
          }}
        >
          {PRODUCT_CATALOG.map((p) => (
            <ResponsiveProductCard key={p.id} catalogProduct={p} />
          ))}
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .cp-chip:active {
          transform: scale(0.96);
        }
      `}</style>
    </MobileLayout>
  );
}
