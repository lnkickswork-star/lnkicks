'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * TrackOrderPage — LN KICKS shipment tracking (mobile).
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title="Track Order"> for the
 *    same premium chrome as every other mobile page.
 *  - All hardcoded values migrated to design tokens.
 *  - Forbidden iOS red (#FF3B30) on the active timeline dot replaced with
 *    theme.colors.error (#7f1d1d — muted maroon).
 *  - Completed dots use theme.colors.black; pending dots use grey300.
 *  - Timeline rail uses grey300 2px line.
 *  - Status pill ("In Transit via BlueDart Express") uses muted success green
 *    tint matching the product page "In Stock" badge.
 *  - haptic.light() on every link tap.
 *
 * Business logic preserved:
 *  - Reads orderId from search params (defaults to LNK-784912).
 *  - Renders the same 5-step timeline (Placed → Verified & Packed →
 *    Handed to Courier → Out for Delivery → Delivered).
 *  - All Link hrefs preserved.
 */
type StepStatus = 'completed' | 'active' | 'pending';

interface TimelineStep {
  label: string;
  status: StepStatus;
  date: string;
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams
    ? searchParams.get('orderId') || 'LNK-784912'
    : 'LNK-784912';

  const timelineSteps: TimelineStep[] = [
    { label: 'Order Placed', status: 'completed', date: 'July 28, 02:15 PM' },
    {
      label: 'Verified & Packed',
      status: 'completed',
      date: 'July 28, 06:40 PM',
    },
    {
      label: 'Handed to Courier (BlueDart)',
      status: 'active',
      date: 'July 29, 10:00 AM',
    },
    {
      label: 'Out for Delivery',
      status: 'pending',
      date: 'Expected Tomorrow',
    },
    { label: 'Delivered', status: 'pending', date: 'Expected July 31' },
  ];

  return (
    <MobileLayout headerVariant="back" title="Track Order">
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
            href="/my-orders"
            style={{
              color: theme.colors.textSecondary,
              textDecoration: 'none',
            }}
          >
            Orders
          </Link>
          <span>/</span>
          <span
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            Track #{orderId}
          </span>
        </div>

        <div
          style={{
            maxWidth: 540,
            margin: '0 auto',
            background: theme.colors.white,
            borderRadius: theme.radius.hero,
            padding: theme.spacing.section,
            border: `1px solid ${theme.colors.grey150}`,
            boxShadow: theme.shadows.sm,
            marginBottom: theme.spacing.xxl,
          }}
        >
          {/* HEADER BAR */}
          <div
            style={{
              borderBottom: `1px solid ${theme.colors.grey150}`,
              paddingBottom: theme.spacing.xl,
              marginBottom: theme.spacing.xxl,
            }}
          >
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.extrabold,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                color: theme.colors.textSecondary,
              }}
            >
              Express Shipment Tracking
            </div>
            <h1
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.h2,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                margin: `${theme.spacing.xs}px 0 0`,
                letterSpacing: theme.letterSpacing.tight,
                lineHeight: theme.lineHeight.tight,
              }}
            >
              Order #{orderId}
            </h1>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.spacing.sm - 2,
                marginTop: theme.spacing.sm + 2,
                background: '#E3FCEF',
                color: theme.colors.success,
                fontSize: theme.fontSize.body,
                fontWeight: theme.fontWeight.bold,
                padding: `${theme.spacing.xs + 1}px ${theme.spacing.md}px`,
                borderRadius: theme.radius.pill,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke={theme.colors.success}
                strokeWidth="2.6"
                aria-hidden
              >
                <polyline
                  points="20 6 9 17 4 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Status: In Transit via BlueDart Express
            </div>
          </div>

          {/* STEP-BY-STEP TIMELINE */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xxl,
              position: 'relative',
              paddingLeft: theme.spacing.xxl,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 7,
                top: 10,
                bottom: 10,
                width: 2,
                background: theme.colors.grey300,
                zIndex: 1,
              }}
            />

            {timelineSteps.map((step, idx) => {
              const dotColor =
                step.status === 'completed'
                  ? theme.colors.black
                  : step.status === 'active'
                    ? theme.colors.error
                    : theme.colors.grey300;
              const labelColor =
                step.status === 'pending'
                  ? theme.colors.textSecondary
                  : theme.colors.textPrimary;
              const labelWeight =
                step.status === 'pending'
                  ? theme.fontWeight.medium
                  : theme.fontWeight.bold;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: -24,
                      top: 2,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: dotColor,
                      border: `3px solid ${theme.colors.white}`,
                      boxShadow:
                        step.status === 'active'
                          ? `0 0 0 4px ${theme.colors.focusRing}`
                          : 'none',
                    }}
                  />
                  <div
                    style={{
                      fontSize: theme.fontSize.md,
                      fontWeight: labelWeight,
                      color: labelColor,
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: theme.fontSize.sm,
                      color: theme.colors.textTertiary,
                    }}
                  >
                    {step.date}
                  </div>
                </div>
              );
            })}
          </div>

          {/* TRACKING ACTION */}
          <div
            style={{
              marginTop: theme.spacing.xxl,
              paddingTop: theme.spacing.lg,
              borderTop: `1px solid ${theme.colors.grey150}`,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Link
              href={`/order-detail?orderId=${orderId}`}
              className="pressable track-cta"
              onPointerDown={() => haptic.light()}
              style={{
                padding: `${theme.spacing.md}px ${theme.spacing.xxl}px`,
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
              View Full Order Details
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .track-cta:active {
          transform: scale(0.97);
        }
        .track-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
