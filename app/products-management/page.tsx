'use client';

import React from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * ProductsManagementPage — Admin Catalog Management.
 *
 * Stage 4g (admin) refactor:
 *  - Replaced ResponsiveAppLayout with `<MobileLayout headerVariant="back"
 *    title="Products" hideBottomNav>` — admin users do NOT see the consumer
 *    bottom nav.
 *  - Migrated every hardcoded value to design tokens.
 *  - Banned iOS red #FF3B30 "+ ADD NEW PRODUCT" CTA + table price →
 *    theme.colors.black (matte-luxury CTA + theme.colors.price for price).
 *  - Banned #00875A stock-status green → theme.colors.success (#14532d)
 *    on #E3FCEF tint, matching PDP / track-order convention.
 *  - Admin table:
 *      • Header row → theme.colors.grey50 bg + display font + semibold +
 *        1px solid theme.colors.grey150 bottom border.
 *      • Row borders → 1px solid theme.colors.grey150.
 *  - Edit buttons → grey100 chips with radius.md + haptic.light() on tap.
 *  - Header CTA "+ ADD NEW PRODUCT" → black + radius.pill + uppercase +
 *    display font + haptic.medium() (primary admin CTA).
 *  - All business logic (PRODUCT_REGISTRY mapping, sku/name/brand/price/
 *    stockStatus reads, Link href to /add-product) preserved 1:1.
 */
export default function ProductsManagementPage() {
  return (
    <MobileLayout headerVariant="back" title="Products" hideBottomNav>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* HEADER + PRIMARY CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.xxxl,
            flexWrap: 'wrap',
            gap: theme.spacing.md,
            paddingTop: theme.spacing.sm,
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
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Product Inventory
          </h1>
          <Link
            href="/add-product"
            onPointerDown={() => haptic.medium()}
            className="pressable pm-cta"
            style={{
              padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
              background: theme.colors.black,
              color: theme.colors.white,
              borderRadius: theme.radius.pill,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.body,
              fontWeight: theme.fontWeight.bold,
              textDecoration: 'none',
              display: 'inline-block',
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            + Add New Product
          </Link>
        </div>

        {/* INVENTORY TABLE — horizontally scrollable on mobile */}
        <div
          style={{
            background: theme.colors.white,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.xl,
            border: `1px solid ${theme.colors.grey150}`,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            boxShadow: theme.shadows.xs,
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: theme.fontSize.body,
              textAlign: 'left',
              minWidth: 540,
            }}
          >
            <thead>
              <tr
                style={{
                  background: theme.colors.grey50,
                  color: theme.colors.textPrimary,
                  fontFamily: theme.fontFamily.display,
                  borderBottom: `1px solid ${theme.colors.grey150}`,
                }}
              >
                {['SKU', 'PRODUCT NAME', 'BRAND', 'PRICE', 'STOCK', 'ACTION'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: theme.spacing.md,
                        fontSize: theme.fontSize.xs,
                        fontWeight: theme.fontWeight.bold,
                        letterSpacing: theme.letterSpacing.wider,
                        textTransform: 'uppercase',
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {PRODUCT_REGISTRY.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: `1px solid ${theme.colors.grey150}`,
                  }}
                >
                  <td
                    style={{
                      padding: theme.spacing.md,
                      fontWeight: theme.fontWeight.bold,
                      color: theme.colors.textPrimary,
                      fontFamily: theme.fontFamily.display,
                    }}
                  >
                    {p.sku}
                  </td>
                  <td
                    style={{
                      padding: theme.spacing.md,
                      fontWeight: theme.fontWeight.semibold,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {p.name}
                  </td>
                  <td
                    style={{
                      padding: theme.spacing.md,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {p.brand}
                  </td>
                  <td
                    style={{
                      padding: theme.spacing.md,
                      fontWeight: theme.fontWeight.bold,
                      color: theme.colors.price,
                      fontFamily: theme.fontFamily.display,
                    }}
                  >
                    ₹{p.price.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: theme.spacing.md }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#E3FCEF',
                        color: theme.colors.success,
                        padding: `${theme.spacing.xs - 1}px ${
                          theme.spacing.sm
                        }px`,
                        borderRadius: theme.radius.pill,
                        fontSize: theme.fontSize.xs,
                        fontWeight: theme.fontWeight.bold,
                        letterSpacing: theme.letterSpacing.wider,
                        textTransform: 'uppercase',
                      }}
                    >
                      {p.stockStatus}
                    </span>
                  </td>
                  <td style={{ padding: theme.spacing.md }}>
                    <Link
                      href="/edit-product"
                      onPointerDown={() => haptic.light()}
                      className="pressable pm-edit"
                      style={{
                        padding: `${theme.spacing.xs + 2}px ${
                          theme.spacing.md
                        }px`,
                        background: theme.colors.grey100,
                        borderRadius: theme.radius.md,
                        fontSize: theme.fontSize.xs,
                        fontWeight: theme.fontWeight.bold,
                        color: theme.colors.textPrimary,
                        textDecoration: 'none',
                        display: 'inline-block',
                        letterSpacing: theme.letterSpacing.wider,
                        textTransform: 'uppercase',
                      }}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .pm-cta:active {
          transform: scale(0.97);
        }
        .pm-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .pm-edit:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
      `}</style>
    </MobileLayout>
  );
}
