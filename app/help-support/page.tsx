'use client';

import React from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * HelpSupportPage — Customer Support Center.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - ResponsiveAppLayout replaced with <MobileLayout headerVariant="back" title="Help & Support">.
 *  - All hardcoded colors / sizes / radii / fonts migrated to theme.* tokens.
 *  - 3 FAQ cards on grey150-bordered white surfaces, plus a matte-black
 *    contact CTA card.
 *  - haptic.light() on email-support CTA tap; pressable class + focus rings.
 */
export default function HelpSupportPage() {
  const faqs = [
    {
      q: 'How does LNKICKS verify product authenticity?',
      a: 'Every pair passes a 12-point physical verification check by our sneaker experts before being dispatched with our tamper-proof verification tag.',
    },
    {
      q: 'What is the estimated delivery time?',
      a: 'Prepaid orders ship via BlueDart Express and arrive within 2-4 business days across India.',
    },
    {
      q: 'What is your return & exchange policy?',
      a: 'We offer a 7-day hassle-free return or size exchange for unworn sneakers with all original tags attached.',
    },
  ];

  return (
    <MobileLayout headerVariant="back" title="Help & Support"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Help & Support' },
      ]}
      desktopMaxWidth={1024}
    >
      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.xxl,
        }}
      >
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
          Customer Support Center
        </h1>

        {/* FAQ LIST */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg,
            marginBottom: theme.spacing.giant,
          }}
        >
          {faqs.map((faq, i) => (
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
              <h3
                style={{
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.textPrimary,
                  margin: `0 0 ${theme.spacing.sm}px 0`,
                  lineHeight: theme.lineHeight.snug,
                }}
              >
                {faq.q}
              </h3>
              <p
                style={{
                  fontSize: theme.fontSize.body,
                  color: theme.colors.textSecondary,
                  margin: 0,
                  lineHeight: theme.lineHeight.relaxed,
                }}
              >
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* CONTACT CARD */}
        <div
          style={{
            background: theme.colors.black,
            borderRadius: theme.radius.xxl,
            padding: theme.spacing.xxl,
            color: theme.colors.white,
            textAlign: 'center',
            boxShadow: theme.shadows.lg,
          }}
        >
          <h2
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h2,
              fontWeight: theme.fontWeight.extrabold,
              margin: `0 0 ${theme.spacing.sm}px 0`,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Need Additional Support?
          </h2>
          <p
            style={{
              fontSize: theme.fontSize.body,
              color: 'rgba(255,255,255,0.72)',
              marginBottom: theme.spacing.xxl,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Our customer service team is available Monday – Saturday (10 AM to 7 PM IST).
          </p>
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.md,
              justifyContent: 'center',
            }}
          >
            <a
              href="mailto:support@lnkicks.com"
              onClick={() => haptic.light()}
              className="pressable-strong hs-cta"
              style={{
                padding: `${theme.spacing.md}px ${theme.spacing.xxl}px`,
                background: theme.colors.white,
                color: theme.colors.black,
                borderRadius: theme.radius.pill,
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'none',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Email Support
            </a>
          </div>
        </div>

        {/* SECONDARY LINKS */}
        <div
          style={{
            marginTop: theme.spacing.xxl,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
            alignItems: 'center',
          }}
        >
          <Link
            href="/contact-us"
            onClick={() => haptic.light()}
            className="pressable hs-link"
            style={{
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textSecondary,
              textDecoration: 'underline',
            }}
          >
            Contact Us Form
          </Link>
          <Link
            href="/faqs"
            onClick={() => haptic.light()}
            className="pressable hs-link"
            style={{
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textSecondary,
              textDecoration: 'underline',
            }}
          >
            View All FAQs
          </Link>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .hs-cta:active {
          transform: scale(0.97);
        }
        .hs-cta:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 3px;
        }
        .hs-link:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
