'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * FiltersPage — mobile filter form for catalog search.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - ResponsiveAppLayout replaced with <MobileLayout headerVariant="back" title="Filters">.
 *  - Every hardcoded color / size / radius / font migrated to theme.* tokens.
 *  - Haptic.selection() on every brand + size chip tap; haptic.light() on the
 *    range slider drag and haptic.medium() on APPLY FILTERS.
 *  - `pressable` class + pressableStyle + focus-visible rings added.
 */
export default function FiltersPage() {
  const [brand, setBrand] = useState('Nike');
  const [size, setSize] = useState('EU 40');
  const [price, setPrice] = useState(15000);

  const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok'];
  const sizes = ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'];

  return (
    <MobileLayout headerVariant="back" title="Filters"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Filters' },
      ]}
      desktopMaxWidth={1024}
    >
      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.xxl,
        }}
      >
        <div
          style={{
            background: theme.colors.white,
            borderRadius: theme.radius.xxl,
            padding: theme.spacing.xxl,
            border: `1px solid ${theme.colors.grey150}`,
            boxShadow: theme.shadows.xs,
          }}
        >
          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.title,
              fontWeight: theme.fontWeight.extrabold,
              textTransform: 'uppercase',
              color: theme.colors.textPrimary,
              letterSpacing: theme.letterSpacing.tight,
              marginBottom: theme.spacing.xxl,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Filter Catalog
          </h1>

          {/* BRAND */}
          <div style={{ marginBottom: theme.spacing.xxl }}>
            <label
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                display: 'block',
                marginBottom: theme.spacing.md,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Brand
            </label>
            <div
              style={{
                display: 'flex',
                gap: theme.spacing.md,
                flexWrap: 'wrap',
              }}
            >
              {brands.map((b) => {
                const active = brand === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      haptic.selection();
                      setBrand(b);
                    }}
                    aria-pressed={active}
                    className="pressable filter-chip"
                    style={{
                      padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                      borderRadius: theme.radius.lg,
                      border: active
                        ? `2px solid ${theme.colors.black}`
                        : `1px solid ${theme.colors.grey300}`,
                      background: active
                        ? theme.colors.black
                        : theme.colors.white,
                      color: active
                        ? theme.colors.white
                        : theme.colors.textPrimary,
                      fontSize: theme.fontSize.base,
                      fontWeight: theme.fontWeight.bold,
                      cursor: 'pointer',
                      transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIZE */}
          <div style={{ marginBottom: theme.spacing.xxl }}>
            <label
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                display: 'block',
                marginBottom: theme.spacing.md,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Size (UK)
            </label>
            <div
              style={{
                display: 'flex',
                gap: theme.spacing.md,
                flexWrap: 'wrap',
              }}
            >
              {sizes.map((s) => {
                const active = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      haptic.selection();
                      setSize(s);
                    }}
                    aria-pressed={active}
                    className="pressable filter-chip"
                    style={{
                      padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                      borderRadius: theme.radius.lg,
                      border: active
                        ? `2px solid ${theme.colors.black}`
                        : `1px solid ${theme.colors.grey300}`,
                      background: active
                        ? theme.colors.black
                        : theme.colors.white,
                      color: active
                        ? theme.colors.white
                        : theme.colors.textPrimary,
                      fontSize: theme.fontSize.base,
                      fontWeight: theme.fontWeight.bold,
                      cursor: 'pointer',
                      transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRICE */}
          <div style={{ marginBottom: theme.spacing.xxl }}>
            <label
              style={{
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                display: 'block',
                marginBottom: theme.spacing.md,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Max Price: ₹{price.toLocaleString('en-IN')}
            </label>
            <input
              type="range"
              min={3000}
              max={30000}
              step={1000}
              value={price}
              onChange={(e) => {
                haptic.light();
                setPrice(Number(e.target.value));
              }}
              aria-label="Maximum price"
              style={{
                width: '100%',
                accentColor: theme.colors.black,
                cursor: 'pointer',
              }}
            />
          </div>

          {/* APPLY */}
          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <Link
              href={`/search?q=${encodeURIComponent(brand)}`}
              onClick={() => haptic.medium()}
              className="pressable-strong filter-cta"
              aria-label="Apply filters and search"
              style={{
                flex: 1,
                padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                textAlign: 'center',
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.lg,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'none',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Apply Filters
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .filter-chip:active {
          transform: scale(0.96);
        }
        .filter-chip:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .filter-cta:active {
          transform: scale(0.97);
        }
        .filter-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
