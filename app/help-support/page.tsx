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
              flexWrap: 'wrap',
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" />
                <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Email Support
            </a>
            <a
              href="https://wa.me/918881286267?text=Hi%20LNKICKS%2C%20I%20need%20help%20with%20..."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptic.light()}
              className="pressable-strong hs-cta hs-cta--chat"
              style={{
                padding: `${theme.spacing.md}px ${theme.spacing.xxl}px`,
                background: 'transparent',
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                fontSize: theme.fontSize.base,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'none',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                border: `1.5px solid ${theme.colors.white}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Chat Support
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
