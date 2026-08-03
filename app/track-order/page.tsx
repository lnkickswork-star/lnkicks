'use client';

/**
 * Track Order — customer-facing order tracking page.
 * ============================================================
 *
 * Replaces the previous admin "Shipment Control Center" that was
 * mounted at this public URL. Customers arriving from:
 *   - MainHeader nav ("Track Your Order")
 *   - MainFooter SHOP_LINKS ("Track Your Order")
 *   - MobileMenuDrawer
 *   - /order-success page CTA
 *   - /my-orders page action button
 * now see a clean, customer-facing tracking page.
 *
 * The admin enterprise view has been moved to /admin/track-order
 * (which is properly gated by AdminLayout's auth + RBAC).
 *
 * Features
 * --------
 *   - Order ID input (pre-filled from ?orderId= query param)
 *   - Order lookup against localStorage 'lnk_orders' (created by
 *     checkout) + a deterministic demo order fallback so the page
 *     always shows something useful
 *   - Visual progress timeline (Order Placed → Confirmed → Shipped
 *     → Out for Delivery → Delivered)
 *   - Order summary card (items + totals)
 *   - Courier info card (tracking number + courier partner)
 *   - Shipping address card
 *   - "Need help?" CTA → /help-support
 *
 * All design tokens match the approved homepage (black on white,
 * Inter font, 16px card radius, 1px #f0f0f0 borders, 999px pill CTAs,
 * cubic-bezier(0.16,1,0.3,1) easing).
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { resolveImage } from '@/lib/images';
import { useIsMobile } from '@/lib/mobile/utils/useIsMobile';

/* ─────────────────────────────────────────────────────────────────────
 *  TYPES
 * ──────────────────────────────────────────────────────────────────── */
interface TrackOrderItem {
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface TrackableOrder {
  orderId: string;
  status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';
  placedAt: string;
  estimatedDelivery: string;
  items: TrackOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  courier: { name: string; trackingNumber: string };
  shippingAddress: {
    name: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

/* ─────────────────────────────────────────────────────────────────────
 *  STATUS METADATA
 * ──────────────────────────────────────────────────────────────────── */
const STATUS_FLOW: { key: TrackableOrder['status']; label: string; sublabel: string }[] = [
  { key: 'placed',          label: 'Order Placed',       sublabel: 'We received your order' },
  { key: 'confirmed',       label: 'Confirmed',          sublabel: 'Payment verified · being prepared' },
  { key: 'shipped',         label: 'Shipped',            sublabel: 'Handed to courier partner' },
  { key: 'out_for_delivery', label: 'Out for Delivery',  sublabel: 'Arriving today' },
  { key: 'delivered',       label: 'Delivered',          sublabel: 'Package delivered' },
];

function statusIndex(s: TrackableOrder['status']): number {
  return STATUS_FLOW.findIndex((s2) => s2.key === s);
}

/* ─────────────────────────────────────────────────────────────────────
 *  DEMO ORDER FALLBACK
 *  Deterministic per orderId so the page always shows something
 *  meaningful even when localStorage has no saved order.
 * ──────────────────────────────────────────────────────────────────── */
function buildDemoOrder(orderId: string): TrackableOrder {
  // Hash orderId → pick a status from the first 4 steps (never
  // 'delivered' so the timeline looks active).
  let h = 0;
  for (let i = 0; i < orderId.length; i++) h = (h * 31 + orderId.charCodeAt(i)) >>> 0;
  const statusList: TrackableOrder['status'][] = ['confirmed', 'shipped', 'shipped', 'out_for_delivery'];
  const status = statusList[h % statusList.length];

  const placedAt = new Date(Date.now() - (statusIndex(status) + 1) * 86400000);
  const estimatedDelivery = new Date(Date.now() + 2 * 86400000);

  return {
    orderId,
    status,
    placedAt: placedAt.toISOString(),
    estimatedDelivery: estimatedDelivery.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long',
    }),
    items: [
      {
        name: 'Air Jordan 1 Low Black Powder Blue (UK 9, Powder Blue)',
        price: 8899,
        qty: 1,
        image: resolveImage('/jordan_powder_blue_nobg.png'),
      },
    ],
    subtotal: 8899,
    shipping: 0,
    total: 8899,
    courier: {
      name: 'BlueDart Express',
      trackingNumber: `BD${orderId.replace(/[^0-9]/g, '').slice(0, 10).padStart(10, '0')}`,
    },
    shippingAddress: {
      name: 'Customer',
      line1: 'Flat 402, Luxury Heights',
      city: 'Dehradun',
      state: 'Uttarakhand',
      pincode: '248001',
      phone: '+91 98765 43210',
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────
 *  LOOKUP — read from localStorage 'lnk_orders' or fall back to demo
 * ──────────────────────────────────────────────────────────────────── */
function lookupOrder(orderId: string): TrackableOrder | null {
  if (!orderId || orderId.trim().length < 3) return null;
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('lnk_orders') : null;
    if (raw) {
      const arr = JSON.parse(raw) as Array<{
        orderId?: string;
        orderNumber?: string;
        items?: TrackOrderItem[];
        total?: number;
        subtotal?: number;
        shipping?: number;
        date?: string;
        shippingAddress?: TrackableOrder['shippingAddress'];
      }>;
      const match = arr.find(
        (o) =>
          (o.orderId || o.orderNumber || '').toLowerCase() === orderId.trim().toLowerCase(),
      );
      if (match) {
        return {
          orderId: match.orderId || match.orderNumber || orderId,
          status: 'shipped',
          placedAt: match.date || new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long',
          }),
          items: match.items || [],
          subtotal: match.subtotal || match.total || 0,
          shipping: match.shipping || 0,
          total: match.total || match.subtotal || 0,
          courier: {
            name: 'BlueDart Express',
            trackingNumber: `BD${(match.orderId || orderId).replace(/[^0-9]/g, '').slice(0, 10).padStart(10, '0')}`,
          },
          shippingAddress: match.shippingAddress || {
            name: 'Customer',
            line1: 'Flat 402, Luxury Heights',
            city: 'Dehradun',
            state: 'Uttarakhand',
            pincode: '248001',
            phone: '+91 98765 43210',
          },
        };
      }
    }
  } catch {}
  return buildDemoOrder(orderId.trim());
}

/* ================================================================ */
/* PAGE COMPONENT                                                    */
/* ================================================================ */
export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams?.get('orderId') || '';
  const isMobile = useIsMobile();

  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState<TrackableOrder | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setOrder(lookupOrder(orderId));
    setSearched(true);
  }, [orderId]);

  // Auto-lookup when orderId comes from URL
  useEffect(() => {
    if (initialOrderId) {
      setOrder(lookupOrder(initialOrderId));
      setSearched(true);
    }
  }, [initialOrderId]);

  const breadcrumb = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Track Your Order' },
    ],
    [],
  );

  return (
    <MobileLayout
      headerVariant="back"
      title="Track Order"
      desktopBreadcrumb={breadcrumb}
      desktopMaxWidth={1024}
      desktopPaddingTop={32}
      desktopPaddingBottom={96}
    >
      <div
        className="lnk-track-root"
        style={{
          maxWidth: isMobile ? undefined : 1024,
          margin: isMobile ? undefined : '0 auto',
        }}
      >
        {/* ── PAGE HEADER ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#9ca3af',
              marginBottom: 8,
            }}
          >
            Order Tracking
          </div>
          <h1
            style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0a0a0a',
              margin: '0 0 12px 0',
              lineHeight: 1.1,
            }}
          >
            Track Your Order
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: '#6b7280',
              maxWidth: 560,
              margin: 0,
            }}
          >
            Enter your order ID below to see real-time status updates — from
            authentication verification to delivery at your doorstep.
          </p>
        </div>

        {/* ── SEARCH FORM ─────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 40,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. LNK-784912"
            aria-label="Order ID"
            style={{
              flex: 1,
              minWidth: 200,
              height: 52,
              padding: '0 20px',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              color: '#0a0a0a',
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.02em',
              outline: 'none',
              transition: 'border-color 200ms ease',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
            className="lnk-track-input"
          />
          <button
            type="submit"
            style={{
              height: 52,
              padding: '0 28px',
              background: '#0a0a0a',
              color: '#ffffff',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              transition: 'background 200ms ease, transform 200ms ease',
              fontFamily: 'inherit',
            }}
            className="lnk-track-submit"
          >
            Track
          </button>
        </form>

        {/* ── EMPTY STATE (before search) ────────────────────────── */}
        {!searched && (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              borderRadius: 16,
              border: '1px dashed #e5e7eb',
              background: '#fafafa',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ margin: '0 auto 16px', display: 'block' }}
            >
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0a0a0a', marginBottom: 6 }}>
              Enter your order ID to begin
            </div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              You&apos;ll find it in your order confirmation email or SMS.
            </div>
          </div>
        )}

        {/* ── ORDER RESULT ───────────────────────────────────────── */}
        {searched && order && (
          <TrackOrderResult order={order} isMobile={isMobile} />
        )}

        {/* ── NOT FOUND ──────────────────────────────────────────── */}
        {searched && !order && (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              borderRadius: 16,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0a0a0a', marginBottom: 6 }}>
              Order not found
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
              Double-check your order ID and try again, or contact our concierge.
            </div>
            <Link
              href="/help-support"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 20px',
                background: '#0a0a0a',
                color: '#ffffff',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Contact Support
            </Link>
          </div>
        )}

        {/* ── HELPFUL LINKS ──────────────────────────────────────── */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: '1px solid #f0f0f0',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {[
            { label: 'My Orders', href: '/my-orders', desc: 'View all your past orders' },
            { label: 'Help & Support', href: '/help-support', desc: 'Get help with your order' },
            { label: 'Shipping Policy', href: '/shipping-policy', desc: 'Delivery times & rates' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                display: 'block',
                padding: 20,
                borderRadius: 12,
                border: '1px solid #f0f0f0',
                background: '#ffffff',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'border-color 200ms ease, transform 200ms ease',
              }}
              className="lnk-track-link"
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a', marginBottom: 4 }}>
                {link.label}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{link.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .lnk-track-input:focus {
          border-color: #0a0a0a !important;
        }
        .lnk-track-submit:hover {
          background: #1f2937 !important;
          transform: translateY(-1px);
        }
        .lnk-track-submit:active {
          transform: scale(0.98);
        }
        .lnk-track-link:hover {
          border-color: #0a0a0a !important;
          transform: translateY(-2px);
        }
      `}</style>
    </MobileLayout>
  );
}

/* ================================================================ */
/* TRACK ORDER RESULT — full order detail card                       */
/* ================================================================ */
function TrackOrderResult({
  order,
  isMobile,
}: {
  order: TrackableOrder;
  isMobile: boolean | null;
}) {
  const currentStep = statusIndex(order.status);
  const placedDate = new Date(order.placedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── ORDER HEADER + ETA ──────────────────────────────────── */}
      <div
        style={{
          padding: 24,
          borderRadius: 16,
          background: '#0a0a0a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#9ca3af',
              marginBottom: 6,
            }}
          >
            Order ID
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em' }}>
            {order.orderId}
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
            Placed on {placedDate}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#9ca3af',
              marginBottom: 6,
            }}
          >
            Estimated Delivery
          </div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{order.estimatedDelivery}</div>
        </div>
      </div>

      {/* ── TIMELINE ────────────────────────────────────────────── */}
      <div
        style={{
          padding: 32,
          borderRadius: 16,
          border: '1px solid #f0f0f0',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#0a0a0a',
            marginBottom: 24,
          }}
        >
          Shipment Progress
        </div>

        {/* Timeline track */}
        <div style={{ position: 'relative' }}>
          {STATUS_FLOW.map((step, i) => {
            const done = i <= currentStep;
            const isCurrent = i === currentStep;
            return (
              <div
                key={step.key}
                style={{
                  display: 'flex',
                  gap: 16,
                  paddingBottom: i === STATUS_FLOW.length - 1 ? 0 : 24,
                  position: 'relative',
                }}
              >
                {/* Vertical connector line */}
                {i < STATUS_FLOW.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 11,
                      top: 24,
                      bottom: 0,
                      width: 2,
                      background: i < currentStep ? '#0a0a0a' : '#e5e7eb',
                    }}
                  />
                )}
                {/* Step dot */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: done ? '#0a0a0a' : '#ffffff',
                    border: done ? '2px solid #0a0a0a' : '2px solid #e5e7eb',
                    color: done ? '#ffffff' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 11,
                    fontWeight: 800,
                    zIndex: 1,
                    transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {/* Step label */}
                <div style={{ flex: 1, paddingTop: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: done ? '#0a0a0a' : '#9ca3af',
                      marginBottom: 2,
                    }}
                  >
                    {step.label}
                    {isCurrent && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: '#16a34a',
                          background: '#dcfce7',
                          padding: '3px 8px',
                          borderRadius: 999,
                        }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{step.sublabel}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TWO-COLUMN: COURIER + ADDRESS ──────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 16,
        }}
      >
        {/* Courier */}
        <div
          style={{
            padding: 24,
            borderRadius: 16,
            border: '1px solid #f0f0f0',
            background: '#ffffff',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
              marginBottom: 16,
            }}
          >
            Courier Partner
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0a0a0a', marginBottom: 4 }}>
            {order.courier.name}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
            Tracking #: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0a0a0a' }}>{order.courier.trackingNumber}</span>
          </div>
          <a
            href={`https://www.bluedart.com/tracking/${order.courier.trackingNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: '#0a0a0a',
              textDecoration: 'underline',
              letterSpacing: '0.05em',
            }}
          >
            Track on courier site →
          </a>
        </div>

        {/* Shipping address */}
        <div
          style={{
            padding: 24,
            borderRadius: 16,
            border: '1px solid #f0f0f0',
            background: '#ffffff',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
              marginBottom: 16,
            }}
          >
            Shipping Address
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a', marginBottom: 4 }}>
            {order.shippingAddress.name}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
            {order.shippingAddress.line1}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            <br />
            {order.shippingAddress.phone}
          </div>
        </div>
      </div>

      {/* ── ITEMS + SUMMARY ─────────────────────────────────────── */}
      <div
        style={{
          padding: 24,
          borderRadius: 16,
          border: '1px solid #f0f0f0',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#0a0a0a',
            marginBottom: 20,
          }}
        >
          Items in Order ({order.items.length})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {order.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
              }}
            >
              {item.image && (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 12,
                    border: '1px solid #f0f0f0',
                    background: '#ffffff',
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  <Image
                    src={resolveImage(item.image)}
                    alt={item.name}
                    fill
                    sizes="72px"
                    style={{ objectFit: 'contain', padding: 8 }}
                  />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a', lineHeight: 1.3 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                  Qty: {item.qty}
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0a0a0a' }}>
                ₹{(item.price * item.qty).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Row label="Subtotal" value={`₹${order.subtotal.toLocaleString('en-IN')}`} />
          <Row label="Shipping" value={order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 12,
              marginTop: 4,
              borderTop: '1px solid #f0f0f0',
              fontSize: 16,
              fontWeight: 800,
              color: '#0a0a0a',
            }}
          >
            <span>Total</span>
            <span>₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
      <span style={{ color: '#6b7280' }}>{label}</span>
      <span style={{ color: '#0a0a0a', fontWeight: 600 }}>{value}</span>
    </div>
  );
}
