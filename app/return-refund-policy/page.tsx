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
 * ReturnRefundPolicyPage — Pattern C rewrite.
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
 *  - Header: "Return & Refund Policy" + "Effective Date: October 24, 2023"
 *  - 30-Day Guarantee highlight card with check icon
 *  - Eligibility Conditions (3 bullets: wear / shoe box / authenticity tags)
 *  - Image illustration (Google-hosted URL preserved)
 *  - Refund Methods paragraph + 2-tile grid (Credit Card 5-7 Days /
 *    Store Credit Instant)
 *  - Non-Returnable Items bullet list (Final Drop / care products /
 *    socks-apparel / Clearance)
 *  - "Still have questions?" matte-black CTA + Contact Support button
 *  - "Initiate Return / Start Now" inline CTA (originally a fixed bottom
 *    bar; moved into the regular flow to avoid overlapping the floating
 *    bottom nav from MobileLayout).
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

export default function ReturnRefundPolicyPage() {
  const { showToast } = useApp();

  const eligibility = [
    {
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      text: 'Sneakers must show zero signs of wear, including creasing on the toe box or dirt on the outsoles.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="22.08" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      text: 'The original shoe box is considered part of the product and must be returned undamaged.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      text: 'Authenticity tags must remain intact and attached to the footwear.',
    },
  ];

  const refundMethods = [
    { label: 'Credit Card', value: '5-7 Days' },
    { label: 'Store Credit', value: 'Instant' },
  ];

  const nonReturnable = [
    'Limited Edition "Final Drop" releases',
    'Sneaker care products (sprays, cleaners)',
    'Socks and intimate apparel',
    'Items purchased during Clearance Sales',
  ];

  return (
    <MobileLayout headerVariant="back" title="Return & Refund Policy">
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
            Return &amp; Refund Policy
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              margin: 0,
            }}
          >
            Effective Date: October 24, 2023
          </p>
        </div>

        {/* 30-DAY GUARANTEE HIGHLIGHT */}
        <div
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
              gap: theme.spacing.md,
              marginBottom: theme.spacing.md,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke={theme.colors.success}
              strokeWidth="2.2"
              aria-hidden
              style={{ flexShrink: 0 }}
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.h2,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              30-Day Guarantee
            </span>
          </div>
          <p style={bodyStyle}>
            We offer a full refund or exchange for any unworn sneakers within
            30 days of the delivery date. Items must be in their original
            packaging with all tags attached.
          </p>
        </div>

        {/* SECTION 1 — ELIGIBILITY */}
        <SectionCard title="1. Eligibility Conditions">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.md,
            }}
          >
            {eligibility.map((it, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: theme.spacing.md,
                }}
              >
                <span
                  style={{
                    color: theme.colors.textSecondary,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {it.icon}
                </span>
                <p
                  style={{
                    fontSize: theme.fontSize.md,
                    color: theme.colors.textSecondary,
                    margin: 0,
                    lineHeight: theme.lineHeight.relaxed,
                  }}
                >
                  {it.text}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* IMAGE ILLUSTRATION */}
        <div
          style={{
            width: '100%',
            height: 180,
            borderRadius: theme.radius.lg,
            overflow: 'hidden',
            boxShadow: theme.shadows.xs,
            background: theme.colors.grey100,
          }}
        >
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwRP1u_npvwzyaXwlf-Jopec39swp2mxsxU5FPXq8j-s3-a_uIOerhcgp4nM2BMYMOwyNpgtZ-adbFr920k7OQ-YLsvJ2g7LoWLDVrrl7lEMNc92MPSt6qx05ta9JYF4ZoYH4Wob-D-PSgXT3HpSC1qufv4jgNOnsCAsb7DOF6lBWjeJK-unameU-LdVDmPgCSoy90uInKLJTEU1ohLXGQZu7DzXXWPfVa2jPWOSa0NF3lV3K22EyvW9wkZfNBjjUYznGM1tw59vc_"
            alt="Quality Control"
            width={400}
            height={300}
            unoptimized
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* SECTION 2 — REFUND METHODS */}
        <SectionCard title="2. Refund Methods">
          <p
            style={{
              ...bodyStyle,
              marginBottom: theme.spacing.md,
            }}
          >
            Once your return is inspected and approved, your refund will be
            processed to the original method of payment within 5-7 business
            days.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: theme.spacing.md,
            }}
          >
            {refundMethods.map((m) => (
              <div
                key={m.label}
                style={{
                  padding: theme.spacing.lg,
                  border: `1px solid ${theme.colors.grey150}`,
                  borderRadius: theme.radius.md,
                  background: theme.colors.white,
                }}
              >
                <p
                  style={{
                    fontSize: theme.fontSize.sm,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textSecondary,
                    letterSpacing: theme.letterSpacing.wider,
                    textTransform: 'uppercase',
                    margin: `0 0 ${theme.spacing.xs}px 0`,
                  }}
                >
                  {m.label}
                </p>
                <p
                  style={{
                    fontFamily: theme.fontFamily.display,
                    fontSize: theme.fontSize.title,
                    fontWeight: theme.fontWeight.extrabold,
                    color: theme.colors.textPrimary,
                    margin: 0,
                    letterSpacing: theme.letterSpacing.tight,
                  }}
                >
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* SECTION 3 — NON-RETURNABLE */}
        <SectionCard title="3. Non-Returnable Items">
          <ul
            style={{
              listStyle: 'disc',
              paddingLeft: theme.spacing.xl,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm,
            }}
          >
            {nonReturnable.map((item) => (
              <li
                key={item}
                style={{
                  fontSize: theme.fontSize.md,
                  color: theme.colors.textSecondary,
                  lineHeight: theme.lineHeight.relaxed,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* SUPPORT CTA */}
        <div
          style={{
            background: theme.colors.black,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: theme.shadows.lg,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke={theme.colors.white}
            strokeWidth="1.8"
            aria-hidden
            style={{ marginBottom: theme.spacing.md }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.title,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.white,
              margin: `0 0 ${theme.spacing.xs}px 0`,
              letterSpacing: theme.letterSpacing.tight,
            }}
          >
            Still have questions?
          </h3>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: 'rgba(255,255,255,0.78)',
              margin: `0 0 ${theme.spacing.xl}px 0`,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Our concierge team is available 24/7 to assist with your return
            process.
          </p>
          <Link
            href="/contact-us"
            onClick={() => {
              haptic.medium();
              showToast('Opening Contact Us');
            }}
            className="pressable-strong rr-cta"
            style={{
              width: '100%',
              padding: `${theme.spacing.lg + 2}px ${theme.spacing.md}px`,
              background: theme.colors.white,
              color: theme.colors.black,
              borderRadius: theme.radius.pill,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              textDecoration: 'none',
              textAlign: 'center',
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            Contact Support
          </Link>
        </div>

        {/* INITIATE RETURN INLINE CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing.lg,
            background: theme.colors.white,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.grey150}`,
            boxShadow: theme.shadows.xs,
            gap: theme.spacing.md,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: theme.fontSize.sm,
                color: theme.colors.textSecondary,
                margin: `0 0 ${theme.spacing.xs}px 0`,
              }}
            >
              Need to start?
            </p>
            <p
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.title,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                margin: 0,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              Initiate Return
            </p>
          </div>
          <Link
            href="/my-orders"
            onClick={() => {
              haptic.medium();
              showToast('Opening My Orders to start a return');
            }}
            className="pressable-strong rr-start"
            style={{
              padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
              background: theme.colors.black,
              color: theme.colors.white,
              borderRadius: theme.radius.pill,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              textDecoration: 'none',
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            Start Now
          </Link>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .rr-cta:active {
          transform: scale(0.97);
        }
        .rr-cta:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 3px;
        }
        .rr-start:active {
          transform: scale(0.97);
        }
        .rr-start:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
