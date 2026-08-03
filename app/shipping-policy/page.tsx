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
 * ShippingPolicyPage — Pattern C rewrite.
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
 *  - Header: "Shipping Policy" + "Last updated: October 2023"
 *  - Processing Times paragraph (1-3 business days, weekends/holidays)
 *  - Shipping Rates table (Standard $15 / Express $35 / Premium Overnight $65)
 *  - Tracking Procedures (Google-hosted image + GPS tracking note +
 *    shipment-confirmation-email note)
 *  - International Shipping (50 countries + customs disclaimer)
 *  - Damages & Losses (LNKICKS not liable — contact carrier or support)
 *  - "Still have questions?" + "Contact Concierge Support" CTA
 */

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
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
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          fontFamily: theme.fontFamily.display,
          fontSize: theme.fontSize.h2,
          fontWeight: theme.fontWeight.extrabold,
          color: theme.colors.textPrimary,
          letterSpacing: theme.letterSpacing.tight,
          margin: `0 0 ${theme.spacing.md}px 0`,
          lineHeight: theme.lineHeight.tight,
        }}
      >
        <span style={{ color: theme.colors.textPrimary }}>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const bodyStyle: React.CSSProperties = {
  fontSize: theme.fontSize.md,
  color: theme.colors.textSecondary,
  lineHeight: theme.lineHeight.relaxed,
  margin: 0,
};

export default function ShippingPolicyPage() {
  const { showToast } = useApp();

  const rates = [
    { name: 'Standard Shipping', eta: '5-7 Business Days', price: '₹149' },
    { name: 'Express Delivery', eta: '2-3 Business Days', price: '₹299' },
    {
      name: 'Premium Overnight',
      eta: 'Next Day Delivery',
      price: '₹499',
      highlight: true,
    },
  ];

  return (
    <MobileLayout headerVariant="back" title="Shipping Policy"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Shipping Policy' },
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
        {/* HEADER */}
        <div>
          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h1,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.textPrimary,
              margin: `0 0 ${theme.spacing.xs}px 0`,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Shipping Policy
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              margin: 0,
            }}
          >
            Last updated: October 2023
          </p>
        </div>

        {/* PROCESSING TIMES */}
        <SectionCard
          title="Processing Times"
          icon={
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        >
          <p style={bodyStyle}>
            All orders are processed within{' '}
            <strong style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeight.bold }}>
              1-3 business days
            </strong>
            . Orders are not shipped or delivered on weekends or holidays. If we
            are experiencing a high volume of sneaker launches, shipments may be
            delayed by a few days.
          </p>
        </SectionCard>

        {/* SHIPPING RATES */}
        <SectionCard
          title="Shipping Rates"
          icon={
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="1" y="3" width="15" height="13" rx="1" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          }
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm,
            }}
          >
            {rates.map((r) => (
              <div
                key={r.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: theme.spacing.md,
                  borderRadius: theme.radius.md,
                  border: r.highlight
                    ? 'none'
                    : `1px solid ${theme.colors.grey150}`,
                  background: r.highlight
                    ? theme.colors.black
                    : theme.colors.white,
                  color: r.highlight
                    ? theme.colors.white
                    : theme.colors.textPrimary,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: theme.fontSize.lg,
                      fontWeight: theme.fontWeight.bold,
                      margin: `0 0 ${theme.spacing.xs}px 0`,
                      color: r.highlight
                        ? theme.colors.white
                        : theme.colors.textPrimary,
                    }}
                  >
                    {r.name}
                  </p>
                  <p
                    style={{
                      fontSize: theme.fontSize.sm,
                      margin: 0,
                      color: r.highlight
                        ? 'rgba(255,255,255,0.8)'
                        : theme.colors.textSecondary,
                    }}
                  >
                    {r.eta}
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: theme.fontFamily.display,
                    fontSize: theme.fontSize.title,
                    fontWeight: theme.fontWeight.extrabold,
                    margin: 0,
                    letterSpacing: theme.letterSpacing.tight,
                    color: r.highlight
                      ? theme.colors.white
                      : theme.colors.textPrimary,
                  }}
                >
                  {r.price}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* TRACKING PROCEDURES */}
        <SectionCard
          title="Tracking Procedures"
          icon={
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          }
        >
          <div
            style={{
              borderRadius: theme.radius.md,
              overflow: 'hidden',
              marginBottom: theme.spacing.md,
              position: 'relative',
              height: 160,
              background: theme.colors.grey100,
            }}
          >
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL7I5Tm2AZfCb9tXLfggQtL6M76zpkjsoRH0gTjSICboZ-krG0RvfUGmX-lnOgOYuHwbCklxzjg90VxB2cnV2v0sLn4ze2AtA35sBQ7wMt5aiaWUcR65pD2xc6zDaO4MAOkVc-NqdUlOcYhXY8Bt6_H_6CXlkr9h_2voYErqwuenh9MpQjQI9kLp2o6lbO6TiCQ_2_tMd_C09Cje6MHNP5YwNmcQKnICYfPSE1SFd2-54JedFnqjiVkRr5VeuCqYTy3xkdVbhqgeiU"
              alt="Clean minimalist high-fashion editorial photo of a pair of limited edition sneakers inside a matte black luxury box being handled by a person wearing white gloves."
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
                  'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: theme.spacing.md,
              }}
            >
              <p
                style={{
                  color: theme.colors.white,
                  fontSize: theme.fontSize.md,
                  margin: 0,
                  lineHeight: theme.lineHeight.snug,
                }}
              >
                Real-time GPS tracking enabled for all premium shipments.
              </p>
            </div>
          </div>
          <p style={bodyStyle}>
            You will receive a shipment confirmation email containing your
            tracking number(s) once your order has shipped. The tracking number
            will be active within 24 hours.
          </p>
        </SectionCard>

        {/* INTERNATIONAL SHIPPING */}
        <SectionCard
          title="International Shipping"
          icon={
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" strokeLinecap="round" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        >
          <p style={bodyStyle}>
            LNKICKS currently ships to over 50 countries. Please note that
            customs duties and taxes are the responsibility of the recipient and
            may vary by destination.
          </p>
        </SectionCard>

        {/* DAMAGES & LOSSES */}
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
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h2,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.error,
              letterSpacing: theme.letterSpacing.tight,
              margin: `0 0 ${theme.spacing.md}px 0`,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
            </svg>
            Damages &amp; Losses
          </h2>
          <p style={bodyStyle}>
            LNKICKS is not liable for any products damaged or lost during
            shipping. If you received your order damaged, please contact the
            shipment carrier to file a claim or our support team for guidance.
          </p>
        </section>

        {/* FOOTER SUPPORT CTA */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.spacing.md,
            paddingTop: theme.spacing.sm,
          }}
        >
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              margin: 0,
            }}
          >
            Still have questions?
          </p>
          <Link
            href="/contact-us"
            onClick={() => {
              haptic.medium();
              showToast('Opening Contact Us');
            }}
            className="pressable-strong sp-cta"
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
            Contact Concierge Support
          </Link>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .sp-cta:active {
          transform: scale(0.97);
        }
        .sp-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
