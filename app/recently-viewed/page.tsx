'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ProductCard } from '@/components/mobile/ProductCard';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { getRecentlyViewed, clearRecentlyViewed, type RecentItem } from '@/lib/recently-viewed';
import type { CartItem } from '@/types';

/**
 * RecentlyViewedPage — LN KICKS recently-viewed products grid.
 *
 * Reads from localStorage `lnk_recently_viewed` (an array of product
 * snapshots, newest first). If empty, shows an empty state with a CTA
 * to browse products.
 *
 * Each product card uses the shared <ProductCard> so the look matches
 * the rest of the catalog. "Clear All" button wipes the history.
 *
 * Auth: NOT required. Anonymous users can still see their recently
 * viewed items (browser-local).
 */
export default function RecentlyViewedPage() {
  const { showToast, addToCart } = useApp();
  const [items, setItems] = useState<RecentItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setItems(getRecentlyViewed());
  }, []);

  const handleClear = () => {
    haptic.medium();
    clearRecentlyViewed();
    setItems([]);
    showToast('Recently viewed cleared');
  };

  const handleQuickAdd = (item: RecentItem) => {
    haptic.success();
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.priceValue,
      image: item.image,
      size: 'UK 9', // default size — user can change in cart
      qty: 1,
    };
    addToCart(cartItem);
  };

  return (
    <MobileLayout headerVariant="back" title="Recently Viewed"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'My Account', href: '/account' },
        { label: 'Recently Viewed' },
      ]}
      desktopMaxWidth={1024}
    >
      <div style={{ padding: `0 ${theme.spacing.pad}px ${theme.spacing.xxl + 12}px` }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: `${theme.spacing.lg}px 0 ${theme.spacing.md}px`,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.h2,
                  fontWeight: 800,
                  margin: 0,
                  letterSpacing: theme.letterSpacing.tight,
                  lineHeight: 1.1,
                }}
              >
                Recently Viewed
              </h1>
              {items.length > 0 && (
                <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 }}>
                  {items.length} {items.length === 1 ? 'item' : 'items'} · Last 30 days
                </div>
              )}
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="pressable"
                aria-label="Clear recently viewed history"
                style={{
                  padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                  background: 'transparent',
                  color: theme.colors.error,
                  border: `1px solid ${theme.colors.grey200}`,
                  borderRadius: theme.radius.pill,
                  fontFamily: theme.fontFamily.display,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Empty state */}
          {hydrated && items.length === 0 ? (
            <div
              style={{
                background: theme.colors.white,
                border: `1px solid ${theme.colors.grey150}`,
                borderRadius: theme.radius.hero,
                padding: `${theme.spacing.xxl + 12}px ${theme.spacing.xl}px`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: theme.colors.grey100,
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke={theme.colors.textSecondary} strokeWidth="1.8" aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.lg,
                  fontWeight: 700,
                  margin: `${theme.spacing.lg}px 0 6px`,
                }}
              >
                No recently viewed items
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: theme.colors.textSecondary,
                  margin: '0 0 20px',
                  lineHeight: 1.5,
                }}
              >
                Browse sneakers and they&apos;ll appear here so you can easily revisit them later.
              </p>
              <Link
                href="/products"
                className="pressable-strong"
                onPointerDown={() => haptic.light()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: `${theme.spacing.md}px ${theme.spacing.xxl}px`,
                  background: theme.colors.black,
                  color: theme.colors.white,
                  borderRadius: theme.radius.pill,
                  fontFamily: theme.fontFamily.display,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Browse Sneakers
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                  <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: theme.spacing.md,
              }}
            >
              {items.map((item) => (
                <div key={item.id + item.viewedAt} style={{ position: 'relative' }}>
                  <ProductCard
                    id={item.id}
                    brand={item.brand}
                    name={item.name}
                    price={item.price}
                    priceValue={item.priceValue}
                    comparePrice={item.comparePrice}
                    image={item.image}
                    href={item.href}
                  />
                  {/* Quick-add overlay button — top-right corner */}
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(item)}
                    className="pressable rv-quick-add"
                    aria-label={`Add ${item.name} to cart`}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: theme.colors.black,
                      color: theme.colors.white,
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 5,
                      boxShadow: '0 2px 6px rgba(17,17,17,0.18)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                      <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                      <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .rv-quick-add:active { transform: scale(0.9); }
      `}</style>
    </MobileLayout>
  );
}
