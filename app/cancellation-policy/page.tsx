'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { useApp } from '@/components/context/AppContext';

/**
 * CancellationPolicyPage — Pattern C rewrite.
 *
 * The previous file used undefined Tailwind utility classes
 * (`bg-surface`, `text-primary`, `text-headline-lg-mobile`,
 * `material-symbols-outlined`, etc.) and Material Symbols font icons — it
 * rendered unstyled in production. This rewrite rebuilds the policy layout
 * from scratch with MobileLayout + tokens + inline SVG icons.
 *
 * Per task spec: clean readable text — fontSize.md body, fontSize.h2
 * headings, textPrimary heading, textSecondary body, lineHeight.relaxed.
 * Sections wrapped in white cards on grey50 page background.
 *
 * Semantic content preserved 1:1:
 *  - 30-Minute Grace Period hero card (with timer icon + WINDOW eyebrow)
 *  - Cancellation Guidelines (3 items: Pre-Shipment / Post-Shipment /
 *    Refund Processing) with their exact descriptive text
 *  - "Fast, Automated Refunds" image banner (Google-hosted URL preserved)
 *  - "How to request" 3-step list:
 *      1. Go to "My Orders"
 *      2. Select the specific order
 *      3. Tap "Cancel Order" button
 *  - "View My Recent Orders" primary CTA → /my-orders
 */

const bodyStyle: React.CSSProperties = {
  fontSize: theme.fontSize.md,
  color: theme.colors.textSecondary,
  lineHeight: theme.lineHeight.relaxed,
  margin: 0,
};

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: theme.colors.white,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.grey150}`,
        padding: theme.spacing.xl,
        boxShadow: theme.shadows.xs,
      }}
    >
      <h2
        style={{
          fontFamily: theme.fontFamily.display,
          fontSize: theme.fontSize.h2,
          fontWeight: theme.fontWeight.extrabold,
          color: theme.colors.textPrimary,
          letterSpacing: theme.letterSpacing.tight,
          margin: `0 0 ${theme.spacing.md}px 0`,
          lineHeight: theme.lineHeight.tight,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const guidelines: {
  title: string;
  body: string;
  icon: React.ReactNode;
}[] = [
  {
    title: 'Pre-Shipment',
    body: 'If your order has not been picked up by the courier (usually within 2-4 hours), cancellation may still be possible via customer support.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <polyline points="7 12 10 15 17 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Post-Shipment',
    body: "Once an order has been marked as 'Shipped', it cannot be cancelled. You must wait for delivery and initiate a return.",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round" />
        <line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Refund Processing',
    body: 'Refunds are initiated immediately upon cancellation. Credits typically appear on your statement within 3-5 business days.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" />
      </svg>
    ),
  },
];

const steps = [
  'Go to "My Orders"',
  'Select the specific order',
  'Tap "Cancel Order" button',
];

export default function CancellationPolicyPage() {
  const { showToast } = useApp();

  return (
    <MobileLayout headerVariant="back" title="Cancellation Policy"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Cancellation Policy' },
      ]}
      desktopMaxWidth={1024}
    >
      <div
        style={{
          background: theme.colors.grey50,
          padding: `${theme.spacing.lg}px ${theme.spacing.pad}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.lg,
          paddingBottom: theme.spacing.xxl,
        }}
      >
        {/* HERO — 30-MINUTE GRACE PERIOD */}
        <section
          style={{
            background: theme.colors.white,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.grey150}`,
            padding: theme.spacing.xl,
            boxShadow: theme.shadows.xs,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.lg,
              marginBottom: theme.spacing.md,
            }}
          >
            <div
              style={{
                background: theme.colors.black,
                color: theme.colors.white,
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l2 2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 2h6M5 5l2-2M19 5l-2-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.textPrimary,
                  letterSpacing: theme.letterSpacing.wider,
                  textTransform: 'uppercase',
                  margin: `0 0 ${theme.spacing.xs}px 0`,
                }}
              >
                Window
              </p>
              <h2
                style={{
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.title,
                  fontWeight: theme.fontWeight.extrabold,
                  color: theme.colors.textPrimary,
                  margin: 0,
                  letterSpacing: theme.letterSpacing.tight,
                  lineHeight: theme.lineHeight.tight,
                }}
              >
                30-Minute Grace Period
              </h2>
            </div>
          </div>
          <p style={bodyStyle}>
            Orders can be cancelled instantly within the first 30 minutes of
            purchase through your account dashboard without any penalties.
          </p>
        </section>

        {/* CANCELLATION GUIDELINES */}
        <SectionCard title="Cancellation Guidelines">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg,
            }}
          >
            {guidelines.map((g) => (
              <div
                key={g.title}
                style={{
                  display: 'flex',
                  gap: theme.spacing.md,
                }}
              >
                <span
                  style={{
                    color: theme.colors.textPrimary,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {g.icon}
                </span>
                <div style={{ minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: theme.fontSize.lg,
                      fontWeight: theme.fontWeight.bold,
                      color: theme.colors.textPrimary,
                      margin: `0 0 ${theme.spacing.xs}px 0`,
                    }}
                  >
                    {g.title}
                  </h4>
                  <p
                    style={{
                      fontSize: theme.fontSize.md,
                      color: theme.colors.textSecondary,
                      margin: 0,
                      lineHeight: theme.lineHeight.relaxed,
                    }}
                  >
                    {g.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* VISUAL PROCESS STEP */}
        <section>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 180,
              borderRadius: theme.radius.lg,
              overflow: 'hidden',
              boxShadow: theme.shadows.xs,
              background: theme.colors.grey100,
            }}
          >
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0p0HrD1vx7pIEfksfUTrXpTMVjAf2QktraVtvjWrTbrOnTVZ5KifHU_J1B8jvBA3LsrGhsU1VPCMk9R1CZyB9DKGX8ypHEjolqaRzOUClJLY6XLonF_W9bLYniwwXBAdSe3PxYFYUm9CcMMoKzmJ4g_hz_aAuL23Oh8KVr8iQVUz7pY5Rz-vmFv823KWHRCaZoy9zSiyzXArrCzpnhJjY967FWNbFaAiCY09e5HZa3Yb0jGVsj-tSdC4RCzjgumWSY7ERbvvZjkdQ"
              alt="Secure digital payment processing"
              width={400}
              height={300}
              unoptimized
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: theme.spacing.xl,
              }}
            >
              <p
                style={{
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.title,
                  fontWeight: theme.fontWeight.extrabold,
                  color: theme.colors.white,
                  margin: 0,
                  letterSpacing: theme.letterSpacing.tight,
                  lineHeight: theme.lineHeight.tight,
                }}
              >
                Fast, Automated Refunds
              </p>
            </div>
          </div>
        </section>

        {/* HOW TO REQUEST */}
        <SectionCard title="How to request">
          <div
            style={{
              background: theme.colors.grey50,
              padding: theme.spacing.lg,
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.grey150}`,
            }}
          >
            {steps.map((s, i) => (
              <div key={s}>
                {i > 0 && (
                  <div
                    style={{
                      height: 1,
                      background: theme.colors.grey150,
                      margin: `${theme.spacing.md}px 0`,
                    }}
                  />
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: theme.spacing.md,
                  }}
                >
                  <span
                    style={{
                      fontSize: theme.fontSize.md,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {i + 1}. {s}
                  </span>
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                      style={{ color: theme.colors.textTertiary, flexShrink: 0 }}
                    >
                      <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* PRIMARY CTA */}
        <Link
          href="/my-orders"
          onClick={() => {
            haptic.medium();
            showToast('Opening My Orders');
          }}
          className="pressable-strong cp-cta"
          style={{
            width: '100%',
            padding: `${theme.spacing.lg + 2}px ${theme.spacing.md}px`,
            background: theme.colors.black,
            color: theme.colors.white,
            borderRadius: theme.radius.pill,
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.bold,
            textDecoration: 'none',
            textAlign: 'center',
            letterSpacing: theme.letterSpacing.wider,
            textTransform: 'uppercase',
            boxShadow: theme.shadows.md,
          }}
        >
          View My Recent Orders
        </Link>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .cp-cta:active {
          transform: scale(0.97);
        }
        .cp-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
