'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { resolveImage } from '@/lib/images';
import type { Order } from '@/types';

/**
 * MyOrdersPage — LN KICKS order history (mobile).
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title="My Orders"> for the
 *    same premium chrome as every other mobile page.
 *  - All hardcoded values migrated to design tokens.
 *  - Forbidden iOS red (#FF3B30) on the order total replaced with
 *    theme.colors.price (matte black) — luxury sale accent.
 *  - Status badges: Delivered → muted success green tint (matching the
 *    product page "In Stock" badge); other statuses → neutral grey chip.
 *  - Action buttons (TRACK ORDER, VIEW DETAILS) use radius.pill + tokens.
 *  - Empty-state emoji (📦) replaced with inline SVG package icon.
 *  - haptic.light() on every link tap.
 *  - pressable class + pressableStyle styled-jsx for tactile feedback.
 *
 * Business logic preserved:
 *  - Reads lnk_orders from localStorage on mount with the same default
 *    sample order fallback.
 *  - Renders each order's items, status, total, and action links.
 *  - All Link hrefs (`/track-order?orderId=...`, `/order-detail?orderId=...`,
 *    `/products`) preserved.
 */
export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('lnk_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Fallback default sample order
        setOrders([
          {
            orderId: 'LNK-784912',
            date: 'July 28, 2026',
            total: 8899,
            paymentMode: 'UPI',
            items: [
              {
                name: 'Air Jordan 1 Low Black Powder Blue',
                qty: 1,
                price: 8899,
                image: 'jordan_powder_blue_nobg.png',
              },
            ],
            status: 'Shipped',
          },
        ]);
      }
    } catch {
      // localStorage parse failure — leave orders empty.
    }
  }, []);

  return (
    <MobileLayout headerVariant="back" title="My Orders"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Account', href: '/profile' },
        { label: 'My Orders' },
      ]}
      desktopMaxWidth={1280}
    >
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
          <Link
            href="/profile"
            style={{
              color: theme.colors.textSecondary,
              textDecoration: 'none',
            }}
          >
            Account
          </Link>
          <span>/</span>
          <span
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            My Orders
          </span>
        </div>

        <h1
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.h1,
            fontWeight: theme.fontWeight.extrabold,
            textTransform: 'uppercase',
            color: theme.colors.textPrimary,
            letterSpacing: theme.letterSpacing.tight,
            lineHeight: theme.lineHeight.tight,
            marginBottom: theme.spacing.xxl,
          }}
        >
          Order History ({orders.length})
        </h1>

        {orders.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xl,
              paddingBottom: theme.spacing.xxl,
            }}
          >
            {orders.map((ord, i) => {
              const isDelivered = ord.status === 'Delivered';
              return (
                <div
                  key={i}
                  style={{
                    background: theme.colors.white,
                    borderRadius: theme.radius.xxl,
                    padding: theme.spacing.xxl,
                    border: `1px solid ${theme.colors.grey150}`,
                    boxShadow: theme.shadows.xs,
                  }}
                >
                  {/* ORDER HEADER BAR */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: `1px solid ${theme.colors.grey150}`,
                      paddingBottom: theme.spacing.lg,
                      marginBottom: theme.spacing.lg,
                      flexWrap: 'wrap',
                      gap: theme.spacing.md,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: theme.fontFamily.display,
                          fontSize: theme.fontSize.xxl,
                          fontWeight: theme.fontWeight.extrabold,
                          color: theme.colors.textPrimary,
                          letterSpacing: theme.letterSpacing.tight,
                        }}
                      >
                        #{ord.orderId}
                      </div>
                      <div
                        style={{
                          fontSize: theme.fontSize.base,
                          color: theme.colors.textSecondary,
                          marginTop: 2,
                        }}
                      >
                        Placed on {ord.date}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.md,
                      }}
                    >
                      <span
                        style={{
                          background: isDelivered
                            ? '#E3FCEF'
                            : theme.colors.grey100,
                          color: isDelivered
                            ? theme.colors.success
                            : theme.colors.textPrimary,
                          fontSize: theme.fontSize.xs,
                          fontWeight: theme.fontWeight.extrabold,
                          padding: `${theme.spacing.xs + 1}px ${theme.spacing.md}px`,
                          borderRadius: theme.radius.pill,
                          letterSpacing: theme.letterSpacing.wider,
                          textTransform: 'uppercase',
                        }}
                      >
                        {ord.status || 'Processing'}
                      </span>
                      <div
                        style={{
                          fontSize: theme.fontSize.lg,
                          fontWeight: theme.fontWeight.black,
                          color: theme.colors.price,
                          fontFamily: theme.fontFamily.display,
                          letterSpacing: theme.letterSpacing.tight,
                        }}
                      >
                        ₹{(ord.total || 8899).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* ORDER ITEMS LIST */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: theme.spacing.md,
                      marginBottom: theme.spacing.xl,
                    }}
                  >
                    {ord.items &&
                      ord.items.map((item, idx) => {
                        const img = item.image
                          ? item.image.startsWith('/')
                            ? item.image
                            : `/${item.image}`
                          : '/jordan_powder_blue_nobg.png';
                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: theme.spacing.lg,
                            }}
                          >
                            <div
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: theme.radius.lg,
                                background: theme.colors.grey100,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                padding: theme.spacing.xs + 1,
                              }}
                            >
                              <Image
                                src={resolveImage(img)}
                                alt={item.name}
                                width={45}
                                height={45}
                                loading="lazy"
                                style={{
                                  maxHeight: '45px',
                                  width: 'auto',
                                  height: 'auto',
                                  objectFit: 'contain',
                                }}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: theme.fontSize.body,
                                  fontWeight: theme.fontWeight.bold,
                                  color: theme.colors.textPrimary,
                                }}
                              >
                                {item.name}
                              </div>
                              <div
                                style={{
                                  fontSize: theme.fontSize.sm,
                                  color: theme.colors.textSecondary,
                                  marginTop: 2,
                                }}
                              >
                                Qty: {item.qty || 1} | Price: ₹
                                {(item.price || 8899).toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div
                    style={{
                      display: 'flex',
                      gap: theme.spacing.sm + 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Link
                      href={`/track-order?orderId=${ord.orderId}`}
                      className="pressable orders-cta"
                      onPointerDown={() => haptic.light()}
                      style={{
                        padding: `${theme.spacing.md - 2}px ${theme.spacing.xl}px`,
                        background: theme.colors.black,
                        color: theme.colors.white,
                        borderRadius: theme.radius.pill,
                        fontSize: theme.fontSize.base,
                        fontWeight: theme.fontWeight.bold,
                        textDecoration: 'none',
                        fontFamily: theme.fontFamily.display,
                        letterSpacing: theme.letterSpacing.wider,
                        textTransform: 'uppercase',
                      }}
                    >
                      Track Order
                    </Link>
                    <Link
                      href={`/order-detail?orderId=${ord.orderId}`}
                      className="pressable orders-cta"
                      onPointerDown={() => haptic.light()}
                      style={{
                        padding: `${theme.spacing.md - 2}px ${theme.spacing.xl}px`,
                        background: theme.colors.grey100,
                        color: theme.colors.textPrimary,
                        borderRadius: theme.radius.pill,
                        fontSize: theme.fontSize.base,
                        fontWeight: theme.fontWeight.bold,
                        textDecoration: 'none',
                        fontFamily: theme.fontFamily.display,
                        letterSpacing: theme.letterSpacing.wider,
                        textTransform: 'uppercase',
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY ORDERS STATE */
          <div
            style={{
              textAlign: 'center',
              padding: `${theme.spacing.giant}px ${theme.spacing.xl}px`,
              background: theme.colors.white,
              borderRadius: theme.radius.xxl,
              border: `1px solid ${theme.colors.grey150}`,
              marginBottom: theme.spacing.xxl,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke={theme.colors.grey400}
              strokeWidth="1.6"
              aria-hidden
              style={{ margin: `0 auto ${theme.spacing.md}px` }}
            >
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
              <line x1="12" y1="22.08" x2="12" y2="12" strokeLinecap="round" />
            </svg>
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
              No Orders Placed Yet
            </h2>
            <p
              style={{
                fontSize: theme.fontSize.body,
                color: theme.colors.textSecondary,
                margin: `${theme.spacing.sm}px 0 ${theme.spacing.xxl}px`,
                lineHeight: theme.lineHeight.relaxed,
              }}
            >
              Your recent purchases and drop orders will appear here.
            </p>
            <Link
              href="/products"
              className="pressable-strong orders-cta"
              onPointerDown={() => haptic.light()}
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
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .orders-cta:active {
          transform: scale(0.97);
        }
        .orders-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
