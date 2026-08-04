'use client';

import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ResponsiveProductCard } from '@/components/ResponsiveProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * ProductsPage — full catalog listing with filter + sort UI shell.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title="Products"> so the page
 *    inherits the premium glass header + floating bottom nav + safe-area
 *    handling from the universal mobile shell.
 *  - All hardcoded colors / sizes / radii migrated to mobile design tokens.
 *  - Collection banner keeps matte-black background; the banned iOS red
 *    #FF3B30 eyebrow is replaced with theme.colors.white.
 *  - Filter / sort / pagination controls use theme.radius.xl chips +
 *    theme.colors.grey100 / border tokens.
 *  - Haptic feedback on every filter / sort / pagination tap.
 *  - `pressable` class + styled-jsx for press-state micro-interactions.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function ProductsPage() {
  return (
    <MobileLayout headerVariant="back" title="Products"
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
          <span
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            All Products
          </span>
        </div>

        {/* COLLECTION BANNER */}
        <div
          style={{
            background: theme.colors.black,
            borderRadius: theme.radius.xxl,
            padding: `${theme.spacing.section}px ${theme.spacing.huge}px`,
            color: theme.colors.white,
            marginBottom: theme.spacing.huge,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: theme.shadows.lg,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.extrabold,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                color: theme.colors.white,
                marginBottom: theme.spacing.xs + 2,
              }}
            >
              LNKICKS Collection
            </div>
            <h1
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.h1,
                fontWeight: theme.fontWeight.extrabold,
                textTransform: 'uppercase',
                margin: 0,
                lineHeight: theme.lineHeight.tight,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              Authentic Luxury Footwear
            </h1>
            <p
              style={{
                fontSize: theme.fontSize.body,
                color: 'rgba(255,255,255,0.7)',
                marginTop: theme.spacing.sm,
                marginBottom: 0,
                lineHeight: theme.lineHeight.relaxed,
              }}
            >
              Showing {PRODUCT_REGISTRY.length} authentic products
            </p>
          </div>
        </div>

        {/* TOOLBAR: FILTER DRAWER & SORT DROPDOWN SHELL */}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
          >
            <button
              type="button"
              onClick={() => haptic.light()}
              className="pressable products-chip"
              style={{
                padding: `${theme.spacing.sm + 2}px ${theme.spacing.xl}px`,
                background: theme.colors.grey100,
                color: theme.colors.textPrimary,
                borderRadius: theme.radius.xl,
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.bold,
                border: 'none',
                cursor: 'pointer',
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
              <span>Filter (Brand, Size, Color)</span>
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
            }}
          >
            <span
              style={{
                fontSize: theme.fontSize.base,
                color: theme.colors.textSecondary,
                fontWeight: theme.fontWeight.medium,
              }}
            >
              Sort by:
            </span>
            <select
              aria-label="Sort products"
              onChange={() => haptic.selection()}
              className="pressable products-select"
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
              <option>Newest</option>
              <option>Price: Low → High</option>
              <option>Price: High → Low</option>
              <option>Best Selling</option>
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
          {PRODUCT_REGISTRY.map((p) => (
            <ResponsiveProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* PAGINATION UI SHELL */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            marginTop: theme.spacing.giant,
          }}
        >
          <button
            type="button"
            onClick={() => haptic.light()}
            className="pressable products-page"
            style={{
              padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
              borderRadius: theme.radius.xl,
              border: `1px solid ${theme.colors.borderStrong}`,
              background: theme.colors.white,
              fontSize: theme.fontSize.base,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textPrimary,
              cursor: 'pointer',
            }}
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => haptic.light()}
            className="pressable products-page-active"
            style={{
              padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
              borderRadius: theme.radius.xl,
              border: 'none',
              background: theme.colors.black,
              color: theme.colors.white,
              fontSize: theme.fontSize.base,
              fontWeight: theme.fontWeight.bold,
              cursor: 'pointer',
            }}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => haptic.light()}
            className="pressable products-page"
            style={{
              padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
              borderRadius: theme.radius.xl,
              border: `1px solid ${theme.colors.borderStrong}`,
              background: theme.colors.white,
              fontSize: theme.fontSize.base,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textPrimary,
              cursor: 'pointer',
            }}
          >
            2
          </button>
          <button
            type="button"
            onClick={() => haptic.light()}
            className="pressable products-page"
            style={{
              padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
              borderRadius: theme.radius.xl,
              border: `1px solid ${theme.colors.borderStrong}`,
              background: theme.colors.white,
              fontSize: theme.fontSize.base,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textPrimary,
              cursor: 'pointer',
            }}
          >
            Next
          </button>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .products-chip:active,
        .products-page:active {
          transform: scale(0.96);
        }
        .products-page-active:active {
          transform: scale(0.95);
        }
      `}</style>
    </MobileLayout>
  );
}
