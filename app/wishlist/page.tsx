'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * WishlistPage — saved-items page.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title="Wishlist"> so the page
 *    inherits the premium glass header + floating bottom nav + safe-area
 *    handling from the universal mobile shell.
 *  - All hardcoded colors / sizes / radii migrated to mobile design tokens.
 *  - Banned iOS red #FF3B30 removed — price is now BLACK (theme.colors.price),
 *    the "Move to Cart" CTA uses theme.colors.black background, and the
 *    remove-from-wishlist ✕ uses theme.colors.black (no harsh reds).
 *  - Haptic feedback on every tap (remove / move-to-cart / explore).
 *  - `pressable` class + styled-jsx for press-state micro-interactions.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();

  const handleRemove = useCallback(
    (item: Parameters<typeof toggleWishlist>[0]) => {
      haptic.light();
      toggleWishlist(item);
    },
    [toggleWishlist],
  );

  const handleMoveToCart = useCallback(
    (item: Parameters<typeof toggleWishlist>[0]) => {
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
              <div
                key={item.id}
                style={{
                  background: theme.colors.white,
                  borderRadius: theme.radius.xxl,
                  padding: theme.spacing.lg,
                  border: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: theme.shadows.xs,
                }}
              >
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  aria-label={`Remove ${item.name} from wishlist`}
                  className="pressable wl-remove"
                  style={{
                    position: 'absolute',
                    top: theme.spacing.md,
                    right: theme.spacing.md,
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

                <div
                  style={{
                    height: 130,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: theme.spacing.md,
                  }}
                >
                  <Image
                    src={
                      item.image
                        ? item.image.startsWith('/')
                          ? item.image
                          : `/${item.image}`
                        : '/jordan_powder_blue_nobg.png'
                    }
                    alt={item.name}
                    width={110}
                    height={110}
                    style={{
                      maxHeight: '110px',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      filter: theme.dropShadows.xs,
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontSize: theme.fontSize.body,
                    fontWeight: theme.fontWeight.semibold,
                    color: theme.colors.textPrimary,
                    margin: `0 0 ${theme.spacing.xs + 2}px`,
                    minHeight: 34,
                  }}
                >
                  {item.name}
                </h3>
                <div
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: theme.fontWeight.extrabold,
                    color: theme.colors.price,
                    marginBottom: theme.spacing.md + 2,
                    letterSpacing: theme.letterSpacing.tight,
                  }}
                >
                  ₹{item.price ? item.price.toLocaleString('en-IN') : '8,899'}
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveToCart(item)}
                  className="pressable wl-move"
                  aria-label={`Move ${item.name} to cart`}
                  style={{
                    width: '100%',
                    padding: `${theme.spacing.sm + 2}px ${theme.spacing.md}px`,
                    background: theme.colors.black,
                    color: theme.colors.white,
                    borderRadius: theme.radius.xl,
                    fontSize: theme.fontSize.base,
                    fontWeight: theme.fontWeight.bold,
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: theme.letterSpacing.wider,
                    textTransform: 'uppercase',
                  }}
                >
                  Move to Cart
                </button>
              </div>
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
        .wl-move:active {
          transform: scale(0.97);
        }
        .wl-cta:active {
          transform: scale(0.97);
        }
      `}</style>
    </MobileLayout>
  );
}
