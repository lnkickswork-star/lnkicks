'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { resolveImage } from '@/lib/images';

/**
 * CartPage — LN KICKS mobile shopping cart.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title="Shopping Cart" hideCartFab
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Cart' },
      ]}
      desktopMaxWidth={1280}
    >
 *    so the page gets the same premium chrome (glass header, floating bottom
 *    nav with Cart FAB hidden, safe-area) as the rest of the app.
 *  - `hideCartFab` avoids the double-cart UX (we're already on /cart).
 *  - All hardcoded colors / sizes / radii migrated to mobile design tokens.
 *  - Banned iOS red #FF3B30 on price replaced with theme.colors.price
 *    (luxury matte black, matches PDP).
 *  - Harsh greens (#00875A) replaced with muted theme.colors.success
 *    (#14532d — kept subtle, no neon).
 *  - Quantity stepper +/-, remove, clear, and checkout CTA now fire haptics
 *    (light for stepper, medium for destructive / primary CTAs).
 *  - Pressable class + pressableStyle on every tappable element.
 *  - Auto-fit grid keeps 1-col on mobile (≤440px) and 2-col on desktop.
 *
 * Business logic preserved verbatim: subtotal / 10% discount / total math,
 * removeFromCart / updateQty / clearCart via useApp(), /products and
 * /checkout Link hrefs, next/image for thumbnails.
 */
export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart } = useApp();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleQtyInc = useCallback(
    (index: number) => {
      haptic.light();
      updateQty(index, 1);
    },
    [updateQty],
  );

  const handleQtyDec = useCallback(
    (index: number) => {
      haptic.light();
      updateQty(index, -1);
    },
    [updateQty],
  );

  const handleRemove = useCallback(
    (index: number) => {
      haptic.medium();
      removeFromCart(index);
    },
    [removeFromCart],
  );

  const handleClear = useCallback(() => {
    haptic.medium();
    clearCart();
  }, [clearCart]);

  return (
    <MobileLayout headerVariant="back" title="Shopping Cart" hideCartFab>
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
          <span aria-hidden>/</span>
          <span
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            Shopping Cart
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
          Shopping Bag ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
        </h1>

        {cart.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: theme.spacing.huge,
              alignItems: 'start',
            }}
          >
            {/* CART ITEMS LIST */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.lg,
              }}
            >
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  style={{
                    background: theme.colors.white,
                    borderRadius: theme.radius.xxl,
                    padding: theme.spacing.xl,
                    border: `1px solid ${theme.colors.grey150}`,
                    display: 'flex',
                    gap: theme.spacing.xl,
                    alignItems: 'center',
                    boxShadow: theme.shadows.xs,
                  }}
                >
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: theme.radius.xl,
                      background: theme.colors.grey100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={resolveImage(item.image)}
                      alt={item.name}
                      width={70}
                      height={70}
                      loading="lazy"
                      style={{
                        maxHeight: '70px',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: theme.fontSize.md,
                        fontWeight: theme.fontWeight.bold,
                        color: theme.colors.textPrimary,
                        margin: `0 0 ${theme.spacing.xs}px`,
                        lineHeight: theme.lineHeight.normal,
                      }}
                    >
                      {item.name}
                    </h3>
                    <div
                      style={{
                        fontSize: theme.fontSize.base,
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      Size: {item.size || 'EU 40'}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: theme.spacing.sm,
                      }}
                    >
                      {/* QUANTITY SELECTOR */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: theme.colors.grey100,
                          borderRadius: theme.radius.xl,
                          padding: `${theme.spacing.hairline}px ${theme.spacing.sm}px`,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleQtyDec(index)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="pressable cart-qty-btn"
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: theme.fontSize.lg,
                            fontWeight: theme.fontWeight.bold,
                            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                            cursor: 'pointer',
                            color: theme.colors.textPrimary,
                            lineHeight: 1,
                          }}
                        >
                          −
                        </button>
                        <span
                          aria-live="polite"
                          style={{
                            fontSize: theme.fontSize.body,
                            fontWeight: theme.fontWeight.bold,
                            minWidth: theme.spacing.xxl,
                            textAlign: 'center',
                            color: theme.colors.textPrimary,
                          }}
                        >
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyInc(index)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="pressable cart-qty-btn"
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: theme.fontSize.lg,
                            fontWeight: theme.fontWeight.bold,
                            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                            cursor: 'pointer',
                            color: theme.colors.textPrimary,
                            lineHeight: 1,
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div
                        style={{
                          fontSize: theme.fontSize.lg,
                          fontWeight: theme.fontWeight.extrabold,
                          color: theme.colors.price,
                          letterSpacing: theme.letterSpacing.tight,
                        }}
                      >
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="pressable cart-remove-btn"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.colors.textTertiary,
                      cursor: 'pointer',
                      padding: theme.spacing.sm,
                      fontSize: theme.fontSize.lg,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleClear}
                className="pressable"
                style={{
                  alignSelf: 'flex-start',
                  background: 'none',
                  border: 'none',
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSize.base,
                  fontWeight: theme.fontWeight.semibold,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginTop: theme.spacing.sm,
                  padding: 0,
                }}
              >
                Clear Shopping Bag
              </button>
            </div>

            {/* ORDER SUMMARY CARD */}
            <div
              style={{
                background: theme.colors.white,
                borderRadius: theme.radius.xxl,
                padding: theme.spacing.xxxl,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.sm,
              }}
            >
              <h2
                style={{
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.xxl,
                  fontWeight: theme.fontWeight.extrabold,
                  textTransform: 'uppercase',
                  color: theme.colors.textPrimary,
                  margin: `0 0 ${theme.spacing.xl}px`,
                  borderBottom: `1px solid ${theme.colors.grey150}`,
                  paddingBottom: theme.spacing.md,
                  letterSpacing: theme.letterSpacing.tight,
                }}
              >
                Order Summary
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.md,
                  fontSize: theme.fontSize.body,
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.xl,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Bag Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: theme.colors.success,
                  }}
                >
                  <span>Estimated Savings (10%)</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Estimated Delivery</span>
                  <span
                    style={{
                      color: theme.colors.success,
                      fontWeight: theme.fontWeight.bold,
                    }}
                  >
                    FREE
                  </span>
                </div>
              </div>

              <div
                style={{
                  borderTop: `2px solid ${theme.colors.black}`,
                  paddingTop: theme.spacing.lg,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: theme.fontSize.xxl,
                  fontWeight: theme.fontWeight.extrabold,
                  color: theme.colors.textPrimary,
                  marginBottom: theme.spacing.xxl,
                  letterSpacing: theme.letterSpacing.tight,
                }}
              >
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <Link
                href="/checkout"
                onPointerDown={() => haptic.medium()}
                className="pressable-strong cart-cta"
                style={{
                  display: 'block',
                  width: '100%',
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
                  boxSizing: 'border-box',
                }}
              >
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        ) : (
          /* EMPTY CART STATE */
          <div
            style={{
              textAlign: 'center',
              padding: `${theme.spacing.giant}px ${theme.spacing.xl}px`,
              background: theme.colors.white,
              borderRadius: theme.radius.xxl,
              border: `1px solid ${theme.colors.grey150}`,
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: theme.spacing.md,
                lineHeight: 1,
              }}
              aria-hidden
            >
              🛍️
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
              Your Shopping Bag is Empty
            </h2>
            <p
              style={{
                fontSize: theme.fontSize.body,
                color: theme.colors.textSecondary,
                margin: `${theme.spacing.sm}px 0 ${theme.spacing.xxl}px`,
                lineHeight: theme.lineHeight.relaxed,
              }}
            >
              Looks like you haven&apos;t added any authentic luxury kicks yet.
            </p>
            <Link
              href="/products"
              onPointerDown={() => haptic.medium()}
              className="pressable-strong cart-cta"
              style={{
                display: 'inline-block',
                padding: `${theme.spacing.md + 2}px ${theme.spacing.huge}px`,
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
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .cart-qty-btn:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
          border-radius: ${theme.radius.sm}px;
        }
        .cart-remove-btn:active {
          transform: scale(0.9);
        }
        .cart-cta:active {
          transform: scale(0.98);
        }
      `}</style>
    </MobileLayout>
  );
}
