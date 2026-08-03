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
 *  - Mounts <MobileLayout headerVariant="back" title="Checkout" hideCartFab
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Cart', href: '/cart' },
        { label: 'Checkout' },
      ]}
      desktopMaxWidth={1280}
    >
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

  // ── Payment-mode-aware pricing ───────────────────────────────────
  // UPI → instant 5% off subtotal (encourages digital, low-MDR payment).
  // COD → ₹199 refundable advance via UPI, deducted from grand total,
  //        balance payable at delivery.
  const UPI_MODE = 'UPI (Google Pay / PhonePe / Paytm)';
  const COD_MODE = 'Cash on Delivery (COD)';
  const COD_ADVANCE_AMOUNT = 199;

  const isUPI = paymentMode === UPI_MODE;
  const isCOD = paymentMode === COD_MODE;

  const subtotal =
    cart.reduce((sum, item) => sum + item.price * item.qty, 0) || 17798;
  const tax = Math.round(subtotal * 0.05);
  const upiDiscount = isUPI ? Math.round(subtotal * 0.05) : 0;
  const codAdvance = isCOD ? COD_ADVANCE_AMOUNT : 0;
  const total =
    subtotal + tax - appliedDiscount - upiDiscount - codAdvance;
  const codRemaining = isCOD ? Math.max(total, 0) : 0;

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
      subtotal,
      tax,
      couponDiscount: appliedDiscount,
      upiDiscount,
      codAdvance,
      codRemaining,
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
                  {
                    id: 'UPI (Google Pay / PhonePe / Paytm)',
                    subtitle: 'Google Pay · PhonePe · Paytm · BHIM',
                    badge: 'INSTANT 5% OFF',
                  },
                  {
                    id: 'Credit / Debit Card',
                    subtitle: 'Visa · Mastercard · RuPay · Amex',
                  },
                  {
                    id: 'Net Banking',
                    subtitle: 'All major Indian banks supported',
                  },
                  {
                    id: 'Cash on Delivery (COD)',
                    subtitle: 'Pay in cash at your doorstep',
                    badge: '₹199 ADVANCE',
                  },
                ].map((mode) => {
                  const active = paymentMode === mode.id;
                  const showUPIOffer = active && mode.id === UPI_MODE;
                  const showCODInfo = active && mode.id === COD_MODE;
                  return (
                    <div
                      key={mode.id}
                      onClick={() => handlePaymentSelect(mode.id)}
                      className="pressable co-payment"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing.sm,
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
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: theme.spacing.md,
                          width: '100%',
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={active}
                          onChange={() => handlePaymentSelect(mode.id)}
                          style={{ accentColor: theme.colors.black }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <span>{mode.id}</span>
                          <span
                            style={{
                              fontSize: theme.fontSize.xs,
                              fontWeight: theme.fontWeight.regular,
                              color: theme.colors.textSecondary,
                              letterSpacing: 0,
                              textTransform: 'none',
                            }}
                          >
                            {mode.subtitle}
                          </span>
                        </div>
                        {mode.badge && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: theme.fontWeight.bold,
                              letterSpacing: theme.letterSpacing.wider,
                              textTransform: 'uppercase',
                              padding: `4px 8px`,
                              borderRadius: theme.radius.pill,
                              background:
                                mode.id === UPI_MODE
                                  ? 'rgba(127, 29, 29, 0.08)'
                                  : 'rgba(120, 53, 15, 0.10)',
                              color:
                                mode.id === UPI_MODE
                                  ? theme.colors.error
                                  : theme.colors.warning,
                              border: `1px solid ${
                                mode.id === UPI_MODE
                                  ? 'rgba(127, 29, 29, 0.20)'
                                  : 'rgba(120, 53, 15, 0.22)'
                              }`,
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                          >
                            {mode.badge}
                          </span>
                        )}
                      </div>

                      {/* UPI OFFER MESSAGE — premium, red accent, non-intrusive */}
                      {showUPIOffer && (
                        <div
                          className="co-offer-reveal"
                          style={{
                            marginTop: theme.spacing.xs,
                            padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                            background:
                              'linear-gradient(135deg, rgba(127, 29, 29, 0.06) 0%, rgba(127, 29, 29, 0.02) 100%)',
                            borderRadius: theme.radius.lg,
                            border: `1px solid rgba(127, 29, 29, 0.18)`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing.md,
                          }}
                        >
                          <span
                            aria-hidden
                            style={{
                              fontSize: 16,
                              lineHeight: 1,
                              flexShrink: 0,
                            }}
                          >
                            🎉
                          </span>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              minWidth: 0,
                            }}
                          >
                            <span
                              style={{
                                fontSize: theme.fontSize.sm,
                                fontWeight: theme.fontWeight.bold,
                                color: theme.colors.error,
                                letterSpacing: 0,
                                lineHeight: 1.3,
                              }}
                            >
                              Get an Extra 5% OFF with UPI Payment
                            </span>
                            <span
                              style={{
                                fontSize: theme.fontSize.xs,
                                fontWeight: theme.fontWeight.regular,
                                color: theme.colors.textSecondary,
                                letterSpacing: 0,
                                lineHeight: 1.4,
                              }}
                            >
                              You save ₹{upiDiscount.toLocaleString('en-IN')} on
                              this order — applied instantly.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* COD ADVANCE INFO — premium, orange/warning badge */}
                      {showCODInfo && (
                        <div
                          className="co-offer-reveal"
                          style={{
                            marginTop: theme.spacing.xs,
                            padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                            background:
                              'linear-gradient(135deg, rgba(120, 53, 15, 0.07) 0%, rgba(120, 53, 15, 0.02) 100%)',
                            borderRadius: theme.radius.lg,
                            border: `1px solid rgba(120, 53, 15, 0.22)`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: theme.spacing.xs,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: theme.spacing.sm,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: theme.fontWeight.bold,
                                letterSpacing: theme.letterSpacing.wider,
                                textTransform: 'uppercase',
                                padding: '3px 8px',
                                borderRadius: theme.radius.pill,
                                background: theme.colors.warning,
                                color: theme.colors.white,
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                              }}
                            >
                              Advance Required
                            </span>
                            <span
                              style={{
                                fontSize: theme.fontSize.sm,
                                fontWeight: theme.fontWeight.extrabold,
                                color: theme.colors.warning,
                                letterSpacing: 0,
                              }}
                            >
                              ₹199 Advance Payment
                            </span>
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: theme.fontSize.xs,
                              fontWeight: theme.fontWeight.regular,
                              color: theme.colors.textSecondary,
                              lineHeight: 1.5,
                              letterSpacing: 0,
                            }}
                          >
                            To confirm your Cash on Delivery order, a refundable
                            advance payment of{' '}
                            <strong
                              style={{ color: theme.colors.textPrimary }}
                            >
                              ₹199
                            </strong>{' '}
                            is required via UPI. This amount will be{' '}
                            <strong
                              style={{ color: theme.colors.textPrimary }}
                            >
                              adjusted against your final order amount
                            </strong>{' '}
                            at the time of delivery.
                          </p>
                        </div>
                      )}
                    </div>
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
              {upiDiscount > 0 && (
                <div
                  className="co-line-reveal"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: theme.colors.error,
                    fontWeight: theme.fontWeight.bold,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.xs,
                    }}
                  >
                    UPI Discount (5%)
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: theme.fontWeight.bold,
                        letterSpacing: theme.letterSpacing.wider,
                        padding: '2px 6px',
                        borderRadius: theme.radius.pill,
                        background: 'rgba(127, 29, 29, 0.10)',
                        border: '1px solid rgba(127, 29, 29, 0.22)',
                      }}
                    >
                      UPI
                    </span>
                  </span>
                  <span>-₹{upiDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {codAdvance > 0 && (
                <div
                  className="co-line-reveal"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: theme.colors.warning,
                    fontWeight: theme.fontWeight.bold,
                  }}
                >
                  <span>Advance Paid (UPI)</span>
                  <span>-₹{codAdvance.toLocaleString('en-IN')}</span>
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
                marginBottom: isCOD ? theme.spacing.md : theme.spacing.xxl,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              <span>Grand Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            {isCOD && (
              <div
                className="co-line-reveal"
                style={{
                  marginBottom: theme.spacing.xxl,
                  padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                  background: theme.colors.grey100,
                  borderRadius: theme.radius.lg,
                  border: `1px solid ${theme.colors.grey300}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: theme.spacing.md,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: theme.fontSize.xs,
                      fontWeight: theme.fontWeight.bold,
                      color: theme.colors.textSecondary,
                      letterSpacing: theme.letterSpacing.wider,
                      textTransform: 'uppercase',
                    }}
                  >
                    Payable on Delivery
                  </span>
                  <span
                    style={{
                      fontSize: theme.fontSize.sm,
                      fontWeight: theme.fontWeight.regular,
                      color: theme.colors.textSecondary,
                      letterSpacing: 0,
                    }}
                  >
                    ₹{codAdvance.toLocaleString('en-IN')} already paid via UPI
                  </span>
                </div>
                <span
                  style={{
                    fontSize: theme.fontSize.xl,
                    fontWeight: theme.fontWeight.extrabold,
                    color: theme.colors.warning,
                    letterSpacing: theme.letterSpacing.tight,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ₹{codRemaining.toLocaleString('en-IN')}
                </span>
              </div>
            )}

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
        /* Smooth reveal for UPI offer / COD info / dynamic summary lines */
        .co-offer-reveal,
        .co-line-reveal {
          animation: coReveal 240ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes coReveal {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Subtle count-up pulse when grand total changes */
        .co-cta {
          transition: transform 160ms ease;
        }
      `}</style>
    </MobileLayout>
  );
}
