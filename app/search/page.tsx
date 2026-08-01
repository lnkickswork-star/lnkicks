'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * SearchPage — product discovery via query + brand/size filters.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title="Search"> so the page
 *    inherits the premium glass header + floating bottom nav + safe-area
 *    handling from the universal mobile shell.
 *  - All hardcoded colors / sizes / radii migrated to mobile design tokens.
 *  - Search input uses theme.radius.pill + soft border + token colors.
 *  - Banned iOS red #FF3B30 removed — Reset Filters uses muted
 *    theme.colors.error (#7f1d1d) instead of flashy iOS red.
 *  - Haptic feedback on chip select, filter change, reset, CTA tap.
 *  - `pressable` class + styled-jsx for press-state micro-interactions.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams ? searchParams.get('q') || '' : '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Jordan 1',
    'Samba OG',
    'Air Force 1',
    'Yeezy',
  ]);

  const popularTags = [
    'Jordan 1 Low',
    'Samba OG',
    'Air Force 1 Black',
    'New Balance 9060',
    'Puma Velophasis',
    'Dunk High',
  ];

  const filteredProducts = PRODUCT_REGISTRY.filter((p) => {
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());
    const matchesBrand =
      selectedBrand === 'All' ||
      p.brand.toUpperCase() === selectedBrand.toUpperCase();
    const matchesSize =
      selectedSize === 'All' || p.availableSizes.includes(selectedSize);
    return matchesQuery && matchesBrand && matchesSize;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    haptic.light();
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const handleChipClick = useCallback(
    (tag: string) => {
      haptic.selection();
      setQuery(tag);
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    haptic.medium();
    setQuery('');
    setSelectedBrand('All');
    setSelectedSize('All');
  }, []);

  return (
    <MobileLayout headerVariant="back" title="Search">
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
            Search
          </span>
        </div>

        {/* SEARCH BAR INPUT */}
        <form onSubmit={handleSearchSubmit} style={{ marginBottom: theme.spacing.xxl }}>
          <div
            style={{
              background: theme.colors.white,
              border: `1.5px solid ${theme.colors.black}`,
              borderRadius: theme.radius.pill,
              padding: `${theme.spacing.xs + 2}px ${theme.spacing.sm}px ${theme.spacing.xs + 2}px ${theme.spacing.xxl}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: theme.shadows.sm,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
                flex: 1,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke={theme.colors.black}
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sneakers, brands, categories..."
                aria-label="Search products"
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: theme.fontSize.md,
                  fontWeight: theme.fontWeight.medium,
                  color: theme.colors.textPrimary,
                  background: 'transparent',
                  fontFamily: theme.fontFamily.body,
                  minWidth: 0,
                }}
              />
            </div>
            <button
              type="submit"
              className="pressable search-submit"
              style={{
                padding: `${theme.spacing.md}px ${theme.spacing.xxl}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.bold,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Search
            </button>
          </div>
        </form>

        {/* POPULAR SEARCH CHIPS */}
        <div style={{ marginBottom: theme.spacing.huge }}>
          <div
            style={{
              fontSize: theme.fontSize.xs,
              fontWeight: theme.fontWeight.extrabold,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.sm + 2,
            }}
          >
            Popular Searches
          </div>
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.sm,
              flexWrap: 'wrap',
            }}
          >
            {popularTags.map((tag) => {
              const active = query === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleChipClick(tag)}
                  aria-pressed={active}
                  className="pressable search-chip"
                  style={{
                    padding: `${theme.spacing.xs + 2}px ${theme.spacing.lg}px`,
                    background: active ? theme.colors.black : theme.colors.grey100,
                    color: active ? theme.colors.white : theme.colors.textPrimary,
                    borderRadius: theme.radius.lg,
                    border: 'none',
                    fontSize: theme.fontSize.base,
                    fontWeight: theme.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: theme.transitions.color,
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* DISCOVERY CONTROL BAR & ACTIVE FILTERS */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.xxl,
            flexWrap: 'wrap',
            gap: theme.spacing.lg,
            borderBottom: `1px solid ${theme.colors.border}`,
            paddingBottom: theme.spacing.lg,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              flexWrap: 'wrap',
            }}
          >
            <select
              value={selectedBrand}
              onChange={(e) => {
                haptic.selection();
                setSelectedBrand(e.target.value);
              }}
              aria-label="Filter by brand"
              className="pressable search-select"
              style={{
                padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
                background: theme.colors.white,
                border: `1px solid ${theme.colors.borderStrong}`,
                borderRadius: theme.radius.lg,
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.semibold,
                color: theme.colors.textPrimary,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Brands</option>
              <option value="NIKE">Nike</option>
              <option value="ADIDAS">Adidas</option>
              <option value="PUMA">Puma</option>
              <option value="NEW BALANCE">New Balance</option>
            </select>

            <select
              value={selectedSize}
              onChange={(e) => {
                haptic.selection();
                setSelectedSize(e.target.value);
              }}
              aria-label="Filter by size"
              className="pressable search-select"
              style={{
                padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
                background: theme.colors.white,
                border: `1px solid ${theme.colors.borderStrong}`,
                borderRadius: theme.radius.lg,
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.semibold,
                color: theme.colors.textPrimary,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Sizes</option>
              <option value="UK 7">UK 7</option>
              <option value="UK 8">UK 8</option>
              <option value="UK 9">UK 9</option>
              <option value="UK 10">UK 10</option>
            </select>

            {(query || selectedBrand !== 'All' || selectedSize !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="pressable search-reset"
                style={{
                  padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
                  background: theme.colors.error,
                  color: theme.colors.white,
                  borderRadius: theme.radius.lg,
                  border: 'none',
                  fontSize: theme.fontSize.xs,
                  fontWeight: theme.fontWeight.bold,
                  cursor: 'pointer',
                  letterSpacing: theme.letterSpacing.wide,
                  textTransform: 'uppercase',
                }}
              >
                Reset Filters
              </button>
            )}
          </div>

          <div
            style={{
              fontSize: theme.fontSize.body,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textSecondary,
            }}
          >
            {filteredProducts.length} Results Found
          </div>
        </div>

        {/* PRODUCT RESULTS GRID OR EMPTY STATE */}
        {filteredProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: theme.spacing.xl,
            }}
          >
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                brand={p.brand}
                price={p.price}
                origPrice={p.comparePrice}
                badge={p.newArrival ? 'NEW' : undefined}
                image={p.primaryImage}
                slug={p.slug}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: `${theme.spacing.giant}px ${theme.spacing.xl}px`,
              background: theme.colors.white,
              borderRadius: theme.radius.xxl,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div
              style={{ fontSize: 48, marginBottom: theme.spacing.md }}
              aria-hidden
            >
              🔍
            </div>
            <h2
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.h2,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                margin: 0,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              No Products Found
            </h2>
            <p
              style={{
                fontSize: theme.fontSize.body,
                color: theme.colors.textSecondary,
                margin: `${theme.spacing.sm}px 0 ${theme.spacing.xxl}px`,
                lineHeight: theme.lineHeight.relaxed,
              }}
            >
              We couldn&apos;t find any sneakers matching &quot;{query}&quot;.
              Try checking your spelling or reset filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="pressable search-cta"
              style={{
                padding: `${theme.spacing.md}px ${theme.spacing.xxl}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.xxl,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.bold,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .search-chip:active {
          transform: scale(0.95);
        }
        .search-submit:active,
        .search-cta:active {
          transform: scale(0.97);
        }
      `}</style>
    </MobileLayout>
  );
}
