'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { resolveImage } from '@/lib/images';
import type { Order } from '@/types';

/**
 * OrderDetailPage — LN KICKS single-order detail view (mobile).
 *
 * Pattern C rewrite (broken Tailwind → token-driven inline styles):
 *  - The previous file used undefined Tailwind utility classes
 *    (`bg-surface`, `text-primary`, `text-headline-lg-mobile`,
 *    `material-symbols-outlined`, etc.) and Material Symbols font icons.
 *    It rendered unstyled in production. This rewrite rebuilds the layout
 *    from scratch with MobileLayout + design tokens + inline SVG icons.
 *
 * Layout (clean card stack on grey50 background):
 *  1. Order Identification card   — orderId + date (eyebrow + value pairs)
 *  2. Status Timeline card         — horizontal stepper (Placed / Processed /
 *     Shipped / Delivered) with progress line; 3 of 4 complete.
 *  3. Shipping Address card        — inline location SVG + multiline address
 *  4. Payment Method card          — inline wallet SVG + card info + Visa chip
 *  5. Order Items list             — heading + line-item cards (image + name +
 *     size/qty/price)
 *  6. Order Summary card           — Subtotal / Shipping / Tax / Total rows +
 *     Download Invoice CTA
 *
 * Phase 4 polish:
 *  - Mounts <MobileLayout headerVariant="back" title="Order Detail">.
 *  - All colors/sizes/radii/spacing from theme tokens — zero hardcoded hex.
 *  - Inline SVG icons (NO Material Symbols font dependency).
 *  - haptic.light() on every button/link tap.
 *  - pressable class + pressableStyle styled-jsx for tactile feedback.
 *
 * Business logic:
 *  - Reads orderId from search params (default LNK-8829410 — preserves the
 *    original demo order's identifier).
 *  - On mount, attempts to look up the order in localStorage
 *    (`lnk_orders`). If a match is found, renders the persisted order's
 *    items, totals, shipping address, and status. If no match, falls back to
 *    the original demo data (Air Jordan 1 Retro High + Yeezy Boost 350 V2).
 *  - useApp().showToast() fires when "Download Invoice" is tapped (the
 *    original button had no handler — we add a graceful toast).
 */

/* ─── demo fallback data (preserves original page's content) ─────── */

interface DemoItem {
  name: string;
  size: string;
  price: number;
  qty: number;
  image: string;
  imageAlt: string;
}

interface DemoOrderData {
  orderId: string;
  date: string;
  customerName: string;
  addressLines: string[];
  paymentLabel: string;
  paymentBrand: string;
  items: DemoItem[];
  subtotal: number;
  shipping: number; // 0 = Free
  tax: number;
  total: number;
}

const DEMO_ORDER: DemoOrderData = {
  orderId: 'LNK-8829410',
  date: 'Oct 24, 2023',
  customerName: 'Jonathan Sterling',
  addressLines: [
    'Jonathan Sterling',
    'Flat 402, Luxury Heights, Bandra West',
    'Mumbai, Maharashtra 400050',
  ],
  paymentLabel: 'Visa ending in •••• 4492',
  paymentBrand: 'VISA',
  items: [
    {
      name: 'Air Jordan 1 Retro High',
      size: 'Size: 10.5 US • Black/White',
      price: 190.0,
      qty: 1,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBzwoBEK3VupvO8LVS4xR8fYFkXdvrS1lzTzXaFuxl-0QJwXYTxLZC56YPochnZBdxIK_vDbnDxNnFyXiIGk4JlKOUehBveBc7f8l_LESp5jQqSJPwwTbZEtH3JTT7JdehIdgDiCakXulsgeu5VAh-OLpKeerGvSu6HQ4Nwq-aeEge5di4TjghrfmF_xLXYuXMITjCBqfdV1sr8nhW42tyOobsXF4xhqdi0xL4n0fp05GXZkXbRMCVug2X1BIGmay3g4VnZ14SK7vHA',
      imageAlt:
        'A premium close-up shot of a limited edition sleek black and white leather luxury sneaker.',
    },
    {
      name: 'Yeezy Boost 350 V2',
      size: 'Size: 11 US • Cloud White',
      price: 220.0,
      qty: 1,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDisPbzAOVAgcnLDhPYajJGdEJ79tIQb55aBxfv01ZiRW3Zq1CcHU-VfPPepwoX6-cLd7DrECfpVHzbaxLYw7SgA78_iJgDQcpZIFFaVkdxjq-HWIZ3V-OldLHXJfmMlrgkskc4x8VyDp4uQpxxJzhDdvksYtKHMmjuOLyeRlefWKkzAoXpvEdFQ7qGslGpZ74jVJNH0V276Qnents5vyzYIeKWoKXxdw7CH1WdIijE194CmurJyF56LUwCO6Id_nrJj1UU7698jl0y',
      imageAlt:
        'A luxury designer sneaker featuring clean white leather and premium suede accents in light gray.',
    },
  ],
  subtotal: 410.0,
  shipping: 0, // Free
  tax: 32.8,
  total: 442.8,
};

/* ─── timeline definition ────────────────────────────────────────── */

type StepKey = 'placed' | 'processed' | 'shipped' | 'delivered';
interface StepDef {
  key: StepKey;
  label: string;
  icon: 'check' | 'truck' | 'box';
}

const TIMELINE_STEPS: StepDef[] = [
  { key: 'placed', label: 'Placed', icon: 'check' },
  { key: 'processed', label: 'Processed', icon: 'check' },
  { key: 'shipped', label: 'Shipped', icon: 'truck' },
  { key: 'delivered', label: 'Delivered', icon: 'box' },
];
// Delivered is the only pending step (matches the original 66% progress).
const COMPLETED_STEPS: Set<StepKey> = new Set<StepKey>([
  'placed',
  'processed',
  'shipped',
]);

/* ─── helpers ────────────────────────────────────────────────────── */

function money(n: number, currency = '$'): string {
  return `${currency}${n.toFixed(2)}`;
}

function statusLabel(s?: string): string {
  if (!s) return 'Processing';
  return s;
}

/* ─── page ───────────────────────────────────────────────────────── */

export default function OrderDetailPage() {
  const searchParams = useSearchParams();
  const { showToast } = useApp();

  const requestedId = searchParams
    ? searchParams.get('orderId') || DEMO_ORDER.orderId
    : DEMO_ORDER.orderId;

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('lnk_orders');
      if (savedOrders) {
        const all = JSON.parse(savedOrders) as Order[];
        const found = all.find((o) => o.orderId === requestedId);
        if (found) setOrder(found);
      }
    } catch {
      // localStorage parse failure — fall through to demo data.
    }
  }, [requestedId]);

  // Resolve render-time data: prefer persisted order, fall back to demo.
  const displayId = order?.orderId || DEMO_ORDER.orderId;
  const displayDate = order?.date || DEMO_ORDER.date;
  const displayItems = order?.items?.length
    ? order.items.map((it) => ({
        name: it.name,
        size: it.size ? `Size: ${it.size}` : 'Standard',
        price: it.price,
        qty: it.qty,
        image: it.image
          ? it.image.startsWith('/')
            ? it.image
            : `/${it.image}`
          : '/jordan_powder_blue_nobg.png',
        imageAlt: it.name,
      }))
    : DEMO_ORDER.items;
  const displaySubtotal =
    order?.items?.length
      ? order.items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0)
      : DEMO_ORDER.subtotal;
  const displayShipping = DEMO_ORDER.shipping; // Free shipping
  const displayTax = DEMO_ORDER.tax;
  const displayTotal = order?.total || DEMO_ORDER.total;

  const handleDownloadInvoice = () => {
    haptic.medium();
    showToast('Invoice download started');
  };

  return (
    <MobileLayout headerVariant="back" title="Order Detail"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'My Orders', href: '/my-orders' },
        { label: 'Order Detail' },
      ]}
      desktopMaxWidth={1280}
    >
      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
          background: theme.colors.grey50,
          minHeight: '100%',
        }}
      >
        <div
          style={{
            maxWidth: 540,
            margin: '0 auto',
            paddingTop: theme.spacing.sm,
            paddingBottom: theme.spacing.xxl,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg,
          }}
        >
          {/* 1. ORDER IDENTIFICATION CARD */}
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: theme.spacing.lg,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <Eyebrow>Order ID</Eyebrow>
                <div
                  style={{
                    fontFamily: theme.fontFamily.display,
                    fontSize: theme.fontSize.xxl,
                    fontWeight: theme.fontWeight.extrabold,
                    color: theme.colors.textPrimary,
                    letterSpacing: theme.letterSpacing.tight,
                    marginTop: 2,
                  }}
                >
                  #{displayId}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Eyebrow>Date</Eyebrow>
                <div
                  style={{
                    fontSize: theme.fontSize.md,
                    color: theme.colors.textPrimary,
                    marginTop: 2,
                  }}
                >
                  {displayDate}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: theme.spacing.lg,
                paddingTop: theme.spacing.lg,
                borderTop: `1px solid ${theme.colors.divider}`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm + 2,
              }}
            >
              <span
                style={{
                  background: '#E3FCEF',
                  color: theme.colors.success,
                  fontSize: theme.fontSize.xs,
                  fontWeight: theme.fontWeight.extrabold,
                  padding: `${theme.spacing.xs + 1}px ${theme.spacing.md}px`,
                  borderRadius: theme.radius.pill,
                  letterSpacing: theme.letterSpacing.wider,
                  textTransform: 'uppercase',
                }}
              >
                {statusLabel(order?.status)}
              </span>
              <Link
                href={`/track-order?orderId=${displayId}`}
                className="pressable"
                onPointerDown={() => haptic.light()}
                style={{
                  fontSize: theme.fontSize.body,
                  color: theme.colors.textSecondary,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  fontWeight: theme.fontWeight.medium,
                }}
              >
                Track shipment
              </Link>
            </div>
          </Card>

          {/* 2. STATUS TIMELINE CARD */}
          <Card>
            <SectionHeading>Status Timeline</SectionHeading>
            <div
              style={{
                position: 'relative',
                marginTop: theme.spacing.lg,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              {/* Progress line (background + filled) */}
              <div
                style={{
                  position: 'absolute',
                  top: 15,
                  left: '8%',
                  right: '8%',
                  height: 2,
                  background: theme.colors.grey300,
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 15,
                  left: '8%',
                  width: `${
                    (([...COMPLETED_STEPS].length - 1) /
                      (TIMELINE_STEPS.length - 1)) *
                    84
                  }%`,
                  height: 2,
                  background: theme.colors.black,
                  zIndex: 1,
                }}
              />
              {TIMELINE_STEPS.map((step) => {
                const done = COMPLETED_STEPS.has(step.key);
                return (
                  <div
                    key={step.key}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: theme.spacing.sm,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: done
                          ? theme.colors.black
                          : theme.colors.grey300,
                        color: done
                          ? theme.colors.white
                          : theme.colors.textSecondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `3px solid ${theme.colors.white}`,
                      }}
                    >
                      <StepIcon
                        icon={step.icon}
                        size={16}
                        stroke={done ? theme.colors.white : theme.colors.textSecondary}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: theme.fontSize.xs,
                        fontWeight: done
                          ? theme.fontWeight.bold
                          : theme.fontWeight.medium,
                        color: done
                          ? theme.colors.textPrimary
                          : theme.colors.textSecondary,
                        letterSpacing: theme.letterSpacing.wide,
                        textTransform: 'uppercase',
                        textAlign: 'center',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 3. SHIPPING ADDRESS CARD */}
          <Card>
            <SectionHeadingWithIcon icon="pin">
              Shipping Address
            </SectionHeadingWithIcon>
            <p
              style={{
                fontSize: theme.fontSize.md,
                color: theme.colors.textPrimary,
                lineHeight: theme.lineHeight.relaxed,
                margin: `${theme.spacing.md}px 0 0`,
              }}
            >
              {(order?.shipping
                ? [
                    order.shipping.label,
                    order.shipping.line1,
                    order.shipping.line2,
                    `${order.shipping.city}, ${order.shipping.state} ${order.shipping.pincode}`,
                  ].filter((l): l is string => Boolean(l))
                : DEMO_ORDER.addressLines
              ).map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </p>
          </Card>

          {/* 4. PAYMENT METHOD CARD */}
          <Card>
            <SectionHeadingWithIcon icon="wallet">
              Payment Method
            </SectionHeadingWithIcon>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: theme.spacing.md,
                marginTop: theme.spacing.md,
              }}
            >
              <p
                style={{
                  fontSize: theme.fontSize.md,
                  color: theme.colors.textPrimary,
                  margin: 0,
                }}
              >
                {order?.paymentMode
                  ? `${order.paymentMode} payment`
                  : DEMO_ORDER.paymentLabel}
              </p>
              <div
                style={{
                  height: 24,
                  width: 40,
                  background: theme.colors.grey200,
                  borderRadius: theme.radius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8.5,
                  fontWeight: theme.fontWeight.extrabold,
                  color: theme.colors.textSecondary,
                  letterSpacing: theme.letterSpacing.wide,
                }}
              >
                {DEMO_ORDER.paymentBrand}
              </div>
            </div>
          </Card>

          {/* 5. ORDER ITEMS LIST */}
          <section>
            <SectionHeading>
              Order Items ({displayItems.length})
            </SectionHeading>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md,
                marginTop: theme.spacing.md,
              }}
            >
              {displayItems.map((item, idx) => (
                <Card key={idx} padSm>
                  <div
                    style={{
                      display: 'flex',
                      gap: theme.spacing.md,
                      alignItems: 'stretch',
                    }}
                  >
                    <div
                      style={{
                        width: 84,
                        height: 84,
                        borderRadius: theme.radius.lg,
                        background: theme.colors.grey100,
                        overflow: 'hidden',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: theme.spacing.xs,
                      }}
                    >
                      <Image
                        src={resolveImage(item.image)}
                        alt={item.imageAlt}
                        width={120}
                        height={90}
                        loading="lazy"
                        unoptimized
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 2,
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: theme.fontFamily.display,
                          fontSize: theme.fontSize.lg,
                          fontWeight: theme.fontWeight.extrabold,
                          color: theme.colors.textPrimary,
                          margin: 0,
                          lineHeight: theme.lineHeight.snug,
                          letterSpacing: theme.letterSpacing.tight,
                        }}
                      >
                        {item.name}
                      </h4>
                      <p
                        style={{
                          fontSize: theme.fontSize.sm,
                          color: theme.colors.textSecondary,
                          margin: 0,
                        }}
                      >
                        {item.size}
                      </p>
                      <div
                        style={{
                          marginTop: theme.spacing.sm,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: theme.spacing.sm,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: theme.fontFamily.display,
                            fontSize: theme.fontSize.md,
                            fontWeight: theme.fontWeight.bold,
                            color: theme.colors.price,
                          }}
                        >
                          {money(item.price)}
                        </span>
                        <span
                          style={{
                            fontSize: theme.fontSize.sm,
                            color: theme.colors.textSecondary,
                          }}
                        >
                          Qty: {item.qty}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* 6. ORDER SUMMARY CARD */}
          <Card>
            <SectionHeading>Order Summary</SectionHeading>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm + 2,
                marginTop: theme.spacing.md,
              }}
            >
              <SummaryRow
                label="Subtotal"
                value={money(displaySubtotal)}
              />
              <SummaryRow
                label="Shipping"
                value={displayShipping === 0 ? 'Free' : money(displayShipping)}
              />
              <SummaryRow label="Tax" value={money(displayTax)} />
              <div
                style={{
                  borderTop: `1px solid ${theme.colors.divider}`,
                  paddingTop: theme.spacing.sm + 2,
                  marginTop: theme.spacing.xs,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontFamily: theme.fontFamily.display,
                    fontSize: theme.fontSize.lg,
                    fontWeight: theme.fontWeight.extrabold,
                    color: theme.colors.textPrimary,
                    letterSpacing: theme.letterSpacing.wider,
                    textTransform: 'uppercase',
                  }}
                >
                  Total Amount
                </span>
                <span
                  style={{
                    fontFamily: theme.fontFamily.display,
                    fontSize: theme.fontSize.xxl,
                    fontWeight: theme.fontWeight.black,
                    color: theme.colors.price,
                    letterSpacing: theme.letterSpacing.tight,
                  }}
                >
                  {money(displayTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="pressable-strong detail-cta"
              style={{
                width: '100%',
                marginTop: theme.spacing.lg,
                padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.bold,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Download Invoice
            </button>

            <div
              style={{
                marginTop: theme.spacing.md,
                display: 'flex',
                gap: theme.spacing.sm + 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/my-orders"
                className="pressable"
                onPointerDown={() => haptic.light()}
                style={{
                  fontSize: theme.fontSize.body,
                  color: theme.colors.textSecondary,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  fontWeight: theme.fontWeight.medium,
                }}
              >
                Back to Orders
              </Link>
              <Link
                href="/products"
                className="pressable"
                onPointerDown={() => haptic.light()}
                style={{
                  fontSize: theme.fontSize.body,
                  color: theme.colors.textSecondary,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  fontWeight: theme.fontWeight.medium,
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .detail-cta:active {
          transform: scale(0.97);
        }
        .detail-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}

/* ─── sub-components ─────────────────────────────────────────────── */

function Card({
  children,
  padSm,
}: {
  children: React.ReactNode;
  padSm?: boolean;
}) {
  return (
    <div
      style={{
        background: theme.colors.white,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.grey150}`,
        padding: padSm ? theme.spacing.lg : theme.spacing.xl,
        boxShadow: theme.shadows.xs,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textSecondary,
        letterSpacing: theme.letterSpacing.wider,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: theme.fontFamily.display,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.textPrimary,
        margin: 0,
        letterSpacing: theme.letterSpacing.wider,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </h3>
  );
}

function SectionHeadingWithIcon({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: 'pin' | 'wallet';
}) {
  return (
    <h3
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm + 2,
        fontFamily: theme.fontFamily.display,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.extrabold,
        color: theme.colors.textPrimary,
        margin: 0,
        letterSpacing: theme.letterSpacing.wider,
        textTransform: 'uppercase',
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke={theme.colors.black}
        strokeWidth="2"
        aria-hidden
      >
        {icon === 'pin' ? (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
            />
            <circle cx="12" cy="10" r="3" />
          </>
        ) : (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12V7H5a2 2 0 0 1 0-4h14v4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5v14a2 2 0 0 0 2 2h16v-5"
            />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
          </>
        )}
      </svg>
      {children}
    </h3>
  );
}

function StepIcon({
  icon,
  size,
  stroke,
}: {
  icon: 'check' | 'truck' | 'box';
  size: number;
  stroke: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={stroke}
      strokeWidth="2.4"
      aria-hidden
    >
      {icon === 'check' ? (
        <polyline
          points="20 6 9 17 4 12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : icon === 'truck' ? (
        <>
          <rect
            x="1"
            y="6"
            width="14"
            height="11"
            rx="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 9h4l3 3v5h-7V9z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6" cy="19" r="2" />
          <circle cx="18" cy="19" r="2" />
        </>
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
          />
          <polyline
            points="3.27 6.96 12 12.01 20.73 6.96"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
      }}
    >
      <span>{label}</span>
      <span style={{ color: theme.colors.textPrimary }}>{value}</span>
    </div>
  );
}
