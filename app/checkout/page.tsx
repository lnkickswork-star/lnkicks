'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * CheckoutPage — LN KICKS mobile express checkout.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title="Checkout" hideCartFab>
 *    so the page gets the same premium chrome (glass header, floating bottom
 *    nav with Cart FAB hidden, safe-area) as the rest of the app.
 *  - `hideCartFab` avoids the double-cart UX.
 *  - All hardcoded colors / sizes / radii migrated to mobile design tokens.
 *  - Banned iOS red #FF3B30 on PLACE ORDER CTA replaced with
 *    theme.colors.black (luxury matte-black, matches the rest of the
 *    purchase flow).
 *  - Harsh greens (#00875A) replaced with muted theme.colors.success
 *    (#14532d — kept subtle, no neon).
 *  - Apply-coupon, payment-mode select, and place-order all fire haptics
 *    (light for coupon apply, selection for payment pick, success/error
 *    patterns for outcomes, medium for the primary place-order CTA).
 *  - Auto-fit grid keeps 1-col on mobile (≤440px) and 2-col on desktop.
 *  - All business logic preserved verbatim: coupon validation (LNKICKS10
 *    → 10% off), 5% GST, localStorage order persistence under
 *    `lnk_orders`, /order-success?orderId= redirect.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, showToast } = useApp();

  const [shipping, setShipping] = useState({
    name: 'Charles Taylor',
    email: 'charles.taylor@lnkicks.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Luxury Heights, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  });

  const [paymentMode, setPaymentMode] = useState<string>(
    'UPI (Google Pay / PhonePe / Paytm)',
  );
  const [coupon, setCoupon] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  const subtotal =
    cart.reduce((sum, item) => sum + item.price * item.qty, 0) || 17798;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax - appliedDiscount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    haptic.light();
    if (coupon.trim().toUpperCase() === 'LNKICKS10') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedDiscount(disc);
      haptic.success();
      showToast('Coupon LNKICKS10 Applied! Saved 10%');
    } else {
      haptic.error();
      showToast('Invalid Coupon Code. Try LNKICKS10');
    }
  };

  const handlePaymentSelect = useCallback((mode: string) => {
    haptic.selection();
    setPaymentMode(mode);
  }, []);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.name || !shipping.address || !shipping.pincode) {
      haptic.error();
      showToast('Please complete shipping address fields.');
      return;
    }

    haptic.medium();

    const orderId = 'LNK-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      total,
      paymentMode,
      shipping,
      items:
        cart.length > 0
          ? cart
          : [{ name: 'Air Jordan 1 Low Powder Blue', qty: 1, price: 8899 }],
    };

    try {
      const orders = JSON.parse(localStorage.getItem('lnk_orders') || '[]');
      orders.unshift(newOrder);
      localStorage.setItem('lnk_orders', JSON.stringify(orders));
    } catch (e) {}

    clearCart();
    showToast('Order Placed Successfully!');
    router.push('/order-success?orderId=' + orderId);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.grey300}`,
    fontSize: theme.fontSize.body,
    fontFamily: theme.fontFamily.body,
    color: theme.colors.textPrimary,
    background: theme.colors.white,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
    display: 'block',
    marginBottom: theme.spacing.xs + 2,
    letterSpacing: theme.letterSpacing.wider,
    textTransform: 'uppercase',
  };

  return (
    <MobileLayout headerVariant="back" title="Checkout" hideCartFab>
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
            flexWrap: 'wrap',
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
          <Link
            href="/cart"
            style={{
              color: theme.colors.textSecondary,
              textDecoration: 'none',
            }}
          >
            Cart
          </Link>
          <span aria-hidden>/</span>
          <span
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            Checkout
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
          Express Checkout
        </h1>

        <form
          onSubmit={handlePlaceOrder}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: theme.spacing.huge,
            alignItems: 'start',
          }}
        >
          {/* LEFT COLUMN: SHIPPING ADDRESS + PAYMENT METHOD */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xxxl,
            }}
          >
            {/* STEP 1: SHIPPING ADDRESS */}
            <div
              style={{
                background: theme.colors.white,
                borderRadius: theme.radius.xxl,
                padding: theme.spacing.xxxl,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.xs,
              }}
            >
              <h2
                style={{
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.extrabold,
                  textTransform: 'uppercase',
                  color: theme.colors.textPrimary,
                  margin: `0 0 ${theme.spacing.xl}px`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.md,
                  letterSpacing: theme.letterSpacing.tight,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    background: theme.colors.black,
                    color: theme.colors.white,
                    width: theme.spacing.xxl,
                    height: theme.spacing.xxl,
                    borderRadius: '50%',
                    fontSize: theme.fontSize.base,
                    fontWeight: theme.fontWeight.bold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  1
                </span>
                Shipping Address
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: theme.spacing.lg,
                }}
              >
                <div>
                  <label htmlFor="co-name" style={labelStyle}>
                    Full Name
                  </label>
                  <input
                    id="co-name"
                    type="text"
                    value={shipping.name}
                    onChange={(e) =>
                      setShipping({ ...shipping, name: e.target.value })
                    }
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="co-phone" style={labelStyle}>
                    Phone Number
                  </label>
                  <input
                    id="co-phone"
                    type="text"
                    value={shipping.phone}
                    onChange={(e) =>
                      setShipping({ ...shipping, phone: e.target.value })
                    }
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="co-addr" style={labelStyle}>
                    Street Address
                  </label>
                  <input
                    id="co-addr"
                    type="text"
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping({ ...shipping, address: e.target.value })
                    }
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="co-city" style={labelStyle}>
                    City
                  </label>
                  <input
                    id="co-city"
                    type="text"
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping({ ...shipping, city: e.target.value })
                    }
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="co-pin" style={labelStyle}>
                    Pincode
                  </label>
                  <input
                    id="co-pin"
                    type="text"
                    value={shipping.pincode}
                    onChange={(e) =>
                      setShipping({ ...shipping, pincode: e.target.value })
                    }
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: PAYMENT METHOD */}
            <div
              style={{
                background: theme.colors.white,
                borderRadius: theme.radius.xxl,
                padding: theme.spacing.xxxl,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.xs,
              }}
            >
              <h2
                style={{
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.extrabold,
                  textTransform: 'uppercase',
                  color: theme.colors.textPrimary,
                  margin: `0 0 ${theme.spacing.xl}px`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.md,
                  letterSpacing: theme.letterSpacing.tight,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    background: theme.colors.black,
                    color: theme.colors.white,
                    width: theme.spacing.xxl,
                    height: theme.spacing.xxl,
                    borderRadius: '50%',
                    fontSize: theme.fontSize.base,
                    fontWeight: theme.fontWeight.bold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  2
                </span>
                Payment Method
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.md,
                }}
              >
                {[
                  'UPI (Google Pay / PhonePe / Paytm)',
                  'Credit / Debit Card',
                  'Net Banking',
                  'Cash on Delivery (COD)',
                ].map((mode) => {
                  const active = paymentMode === mode;
                  return (
                    <label
                      key={mode}
                      onClick={() => handlePaymentSelect(mode)}
                      className="pressable co-payment"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.md,
                        padding: `${theme.spacing.md + 2}px ${theme.spacing.xl}px`,
                        borderRadius: theme.radius.xl,
                        border: active
                          ? `2px solid ${theme.colors.black}`
                          : `1px solid ${theme.colors.grey300}`,
                        background: active
                          ? theme.colors.grey100
                          : theme.colors.white,
                        cursor: 'pointer',
                        fontSize: theme.fontSize.body,
                        fontWeight: theme.fontWeight.semibold,
                        color: theme.colors.textPrimary,
                        boxSizing: 'border-box',
                        transition: theme.transitions.surface,
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={active}
                        onChange={() => handlePaymentSelect(mode)}
                        style={{ accentColor: theme.colors.black }}
                      />
                      <span>{mode}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PAYMENT SUMMARY + PLACE ORDER CTA */}
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
              Payment Summary
            </h2>

            {/* COUPON INPUT */}
            <div style={{ marginBottom: theme.spacing.xl }}>
              <label htmlFor="co-coupon" style={labelStyle}>
                Have a Coupon Code?
              </label>
              <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                <input
                  id="co-coupon"
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="e.g. LNKICKS10"
                  style={{
                    flex: 1,
                    padding: `${theme.spacing.md - 2}px ${theme.spacing.md}px`,
                    borderRadius: theme.radius.lg,
                    border: `1px solid ${theme.colors.grey300}`,
                    fontSize: theme.fontSize.base,
                    fontFamily: theme.fontFamily.body,
                    color: theme.colors.textPrimary,
                    background: theme.colors.white,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="pressable-strong co-apply-btn"
                  style={{
                    padding: `${theme.spacing.md - 2}px ${theme.spacing.xl}px`,
                    background: theme.colors.black,
                    color: theme.colors.white,
                    borderRadius: theme.radius.lg,
                    fontSize: theme.fontSize.base,
                    fontWeight: theme.fontWeight.bold,
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: theme.letterSpacing.wider,
                    textTransform: 'uppercase',
                  }}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* SUMMARY BREAKDOWN */}
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
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST &amp; Taxes (5%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: theme.colors.success,
                    fontWeight: theme.fontWeight.bold,
                  }}
                >
                  <span>Coupon Discount</span>
                  <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Express Delivery</span>
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
              <span>Grand Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="submit"
              className="pressable-strong co-cta"
              style={{
                display: 'block',
                width: '100%',
                padding: `${theme.spacing.xl}px ${theme.spacing.lg}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                textAlign: 'center',
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.xxl,
                fontWeight: theme.fontWeight.extrabold,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                boxSizing: 'border-box',
              }}
            >
              Place Order →
            </button>
          </div>
        </form>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .co-payment:focus-within {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .co-apply-btn:active {
          transform: scale(0.97);
        }
        .co-cta:active {
          transform: scale(0.98);
        }
      `}</style>
    </MobileLayout>
  );
}
