'use client';

import React from 'react';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { useApp } from '@/components/context/AppContext';

/**
 * TermsConditionsPage — Pattern C rewrite.
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
 *  - Header: "Terms & Conditions" + "Last Updated: October 24, 2023"
 *  - Section 1 — Introduction
 *  - Section 2 — Use of Service
 *  - Section 3 — Authenticity Guarantee (with highlight box)
 *  - Section 4 — Payments & Transactions
 *  - Section 5 — Limitation of Liability
 *  - Section 6 — Privacy Policy (cross-reference)
 *  - Sneaker close-up image (Google-hosted URL preserved)
 *  - Footer: acknowledgement paragraph + "Accept and Continue" CTA
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

export default function TermsConditionsPage() {
  const { showToast } = useApp();

  return (
    <MobileLayout headerVariant="back" title="Terms & Conditions"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Terms & Conditions' },
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
            Terms &amp; Conditions
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.sm,
              color: theme.colors.textSecondary,
              margin: 0,
            }}
          >
            Last Updated: October 24, 2023
          </p>
        </div>

        {/* SECTION 1 */}
        <SectionCard title="1. Introduction">
          <p style={bodyStyle}>
            Welcome to LNKICKS. These Terms &amp; Conditions govern your use of
            our premium sneaker marketplace. By accessing our platform, you
            agree to be bound by these rules. Our service is designed to provide
            an exclusive, high-fidelity experience for sneaker enthusiasts and
            collectors globally.
          </p>
        </SectionCard>

        {/* SECTION 2 */}
        <SectionCard title="2. Use of Service">
          <p style={bodyStyle}>
            You must be at least 18 years of age to use this marketplace. We
            provide a curated selection of high-end footwear. Users are
            prohibited from using automated systems to scrape data, participate
            in unfair bidding practices, or misrepresent the authenticity of
            items listed for secondary sale.
          </p>
        </SectionCard>

        {/* SECTION 3 — with highlight box */}
        <SectionCard title="3. Authenticity Guarantee">
          <div
            style={{
              padding: theme.spacing.lg,
              background: theme.colors.grey50,
              border: `1px solid ${theme.colors.grey150}`,
              borderRadius: theme.radius.md,
              marginBottom: theme.spacing.md,
            }}
          >
            <p
              style={{
                fontSize: theme.fontSize.md,
                color: theme.colors.textPrimary,
                fontWeight: theme.fontWeight.semibold,
                margin: 0,
                lineHeight: theme.lineHeight.relaxed,
              }}
            >
              Every sneaker purchased through LNKICKS undergoes a rigorous
              multi-point inspection process by our master authenticators.
            </p>
          </div>
          <p style={bodyStyle}>
            We ensure that every pair of shoes delivered to our clients meets
            the highest standards of quality and original manufacture. Any item
            found to be counterfeit will be rejected, and the transaction will
            be voided immediately.
          </p>
        </SectionCard>

        {/* SECTION 4 */}
        <SectionCard title="4. Payments & Transactions">
          <p style={bodyStyle}>
            Transactions are processed through our secure, encrypted gateway.
            Prices are subject to market volatility and may change without
            notice. All sales are final once the authenticity verification
            process has been completed and the item has been shipped.
          </p>
        </SectionCard>

        {/* SECTION 5 */}
        <SectionCard title="5. Limitation of Liability">
          <p style={bodyStyle}>
            LNKICKS shall not be held liable for any indirect, incidental, or
            consequential damages resulting from the use or inability to use
            our services. We strive for 100% platform uptime but do not
            guarantee uninterrupted access during peak product drops.
          </p>
        </SectionCard>

        {/* SECTION 6 */}
        <SectionCard title="6. Privacy Policy">
          <p style={bodyStyle}>
            Your privacy is paramount. Please review our separate Privacy Policy
            which explains how we collect, use, and protect your personal data
            in accordance with international luxury digital standards.
          </p>
        </SectionCard>

        {/* VISUAL BREAK */}
        <div
          style={{
            width: '100%',
            height: 180,
            borderRadius: theme.radius.lg,
            overflow: 'hidden',
            background: theme.colors.grey100,
            boxShadow: theme.shadows.xs,
          }}
        >
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxyZeDHn2nRU_QELw7YusOnryqueNcWbfWfPxn6Jr3pHn5MsmEEWloaiPPKQ532eIQchYhQ28Nc9_4tD8RV90Bq1PsI5uubfzsfv9wkL77rd98_EGc4sCqWL5zuMMHTR1hoY-r7HhYFjiRFc7zaRuaOn3yDjM9Mt904HATEvELEV-IxTi9UJrGlbgZFSQUKO5WcIoP5UF4ULg23e2EvoYWVg9gMvPJ57vzsluXjHWRabDPeZR5fZfyytC5peWdCOGIVGQmW88cKzvE"
            alt="Sneaker close-up"
            width={400}
            height={300}
            unoptimized
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* FOOTER */}
        <footer
          style={{
            paddingTop: theme.spacing.lg,
            borderTop: `1px solid ${theme.colors.grey150}`,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg,
          }}
        >
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              margin: 0,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            By clicking below, you acknowledge that you have read and understood
            these terms in their entirety.
          </p>
          <button
            type="button"
            onClick={() => {
              haptic.success();
              showToast('Terms accepted — happy shopping');
            }}
            className="pressable-strong tc-cta"
            style={{
              width: '100%',
              padding: `${theme.spacing.lg + 2}px ${theme.spacing.md}px`,
              background: theme.colors.black,
              color: theme.colors.white,
              borderRadius: theme.radius.pill,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
              boxShadow: theme.shadows.md,
            }}
          >
            Accept and Continue
          </button>
        </footer>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .tc-cta:active {
          transform: scale(0.97);
        }
        .tc-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
