'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { ProductCard } from '@/components/mobile/ProductCard';
import type { WishlistItem } from '@/types/wishlist';

/**
 * WishlistPage — saved-items page.
 *
 * PHASE 12 REFACTOR
 *   - Now uses the shared <ProductCard /> component for each saved item.
 *   - The card itself is defined in components/mobile/ProductCard.tsx and
 *     matches the Apple/Nike/GOAT-inspired master spec (white card, blue
 *     category label, 22px bold title, signature quarter-circle + button).
 *   - Wishlist-specific behavior preserved:
 *       • Remove (✕) button in the top-right actionSlot
 *       • "Move to Cart" CTA via onAddToCart override (so the toast says
 *         "Moved to Cart" and the item is removed from wishlist after add)
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();

  const handleRemove = useCallback(
    (item: WishlistItem) => {
      haptic.light();
      toggleWishlist(item);
    },
    [toggleWishlist],
  );

  const handleMoveToCart = useCallback(
    (item: WishlistItem) => {
      haptic.medium();
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price || 8899,
        image: item.image || 'jordan_powder_blue_nobg.png',
        qty: 1,
      });
      toggleWishlist(item);
    },
    [addToCart, toggleWishlist],
  );

  // Normalize a wishlist item's image into a usable <img src>.
  // WishlistItem.image is root-relative ("/foo.png") or undefined.
  const resolveImage = (item: WishlistItem) => {
    const src = item.image || '/jordan_powder_blue_nobg.png';
    return src.startsWith('/') ? src : `/${src}`;
  };

  // Build a small ✕ remove button to pass into ProductCard's actionSlot.
  const renderRemoveButton = (item: WishlistItem) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleRemove(item);
      }}
      aria-label={`Remove ${item.name} from wishlist`}
      className="pressable wl-remove"
      style={{
        background: theme.colors.grey100,
        border: 'none',
        borderRadius: '50%',
        width: 32,
        height: 32,
        color: theme.colors.black,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: theme.fontSize.body,
        fontWeight: theme.fontWeight.bold,
      }}
    >
      ✕
    </button>
  );

  return (
    <MobileLayout headerVariant="back" title="Wishlist">
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
            My Wishlist
          </span>
        </div>

        <h1
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.h1,
            fontWeight: theme.fontWeight.extrabold,
            textTransform: 'uppercase',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.huge,
            letterSpacing: theme.letterSpacing.tight,
            lineHeight: theme.lineHeight.tight,
          }}
        >
          Saved Items ({wishlist.length})
        </h1>

        {wishlist.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: theme.spacing.xl,
            }}
          >
            {wishlist.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                image={resolveImage(item)}
                price={item.price || 8899}
                href="/products"
                category="Saved"
                ctaLabel="Move to Cart"
                width="100%"
                showToastOnAdd={false}
                onAddToCart={() => handleMoveToCart(item)}
                actionSlot={renderRemoveButton(item)}
              />
            ))}
          </div>
        ) : (
          /* EMPTY WISHLIST STATE */
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
              ❤️
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
              Your Wishlist is Empty
            </h2>
            <p
              style={{
                fontSize: theme.fontSize.body,
                color: theme.colors.textSecondary,
                margin: `${theme.spacing.sm}px 0 ${theme.spacing.xxl}px`,
                lineHeight: theme.lineHeight.relaxed,
              }}
            >
              Save your favorite grails and drops by clicking the heart icon on
              any product.
            </p>
            <Link
              href="/products"
              onPointerDown={() => haptic.light()}
              className="pressable wl-cta"
              style={{
                display: 'inline-block',
                padding: `${theme.spacing.lg}px ${theme.spacing.huge}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'none',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Explore Products
            </Link>
          </div>
        )}
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .wl-remove:active {
          transform: scale(0.9);
        }
        .wl-cta:active {
          transform: scale(0.97);
        }
      `}</style>
    </MobileLayout>
  );
}
