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
 * PrivacyPolicyPage — Pattern C rewrite.
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
 *  - Intro paragraph (privacy paramount + luxury sneaker experience)
 *  - "Information We Collect" with 2 cards (Personal Identifiers +
 *    Device & Usage Data)
 *  - Abstract graphic image (Google-hosted URL preserved)
 *  - "How We Use Information" 3-bullet list (transactions / personalization /
 *    communications)
 *  - "Data Protection" matte-black card (AES-256 + regular audits +
 *    GDPR Compliant + End-to-End Encryption badges)
 *  - Footer: "Questions regarding privacy?" + "Contact Privacy Officer" CTA
 *    + Terms of Service / Cookie Policy text links
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

export default function PrivacyPolicyPage() {
  const { showToast } = useApp();

  const collected = [
    {
      title: 'Personal Identifiers',
      body: 'Name, email address, and shipping details required for order fulfillment and account authentication.',
    },
    {
      title: 'Device & Usage Data',
      body: 'IP addresses, browser types, and interaction logs within the app to optimize our marketplace performance.',
    },
  ];

  const uses = [
    'To process transactions and manage your premium membership benefits securely.',
    'To personalize your feed with high-end sneaker recommendations based on your preferences.',
    'To communicate exclusive drops, order updates, and security alerts via encrypted channels.',
  ];

  const badges = ['GDPR Compliant', 'End-to-End Encryption'];

  return (
    <MobileLayout headerVariant="back" title="Privacy Policy"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Privacy Policy' },
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
        {/* INTRO */}
        <section
          style={{
            background: theme.colors.white,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.grey150}`,
            padding: theme.spacing.xl,
            boxShadow: theme.shadows.xs,
          }}
        >
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              lineHeight: theme.lineHeight.relaxed,
              margin: 0,
              marginBottom: theme.spacing.md,
            }}
          >
            At LNKICKS, your privacy is paramount. This policy outlines how we
            handle your personal data to provide a seamless luxury sneaker
            experience.
          </p>
          <div
            style={{
              height: 1,
              width: '100%',
              background: theme.colors.grey150,
            }}
          />
        </section>

        {/* INFORMATION WE COLLECT */}
        <SectionCard
          title="Information We Collect"
          icon={
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.md,
            }}
          >
            {collected.map((c) => (
              <div
                key={c.title}
                style={{
                  padding: theme.spacing.md,
                  background: theme.colors.grey50,
                  borderRadius: theme.radius.md,
                  border: `1px solid ${theme.colors.grey150}`,
                }}
              >
                <h3
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textPrimary,
                    margin: `0 0 ${theme.spacing.xs}px 0`,
                  }}
                >
                  {c.title}
                </h3>
                <p
                  style={{
                    fontSize: theme.fontSize.md,
                    color: theme.colors.textSecondary,
                    margin: 0,
                    lineHeight: theme.lineHeight.relaxed,
                  }}
                >
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ABSTRACT GRAPHIC */}
        <div
          style={{
            width: '100%',
            height: 180,
            borderRadius: theme.radius.lg,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: theme.shadows.xs,
            background: theme.colors.grey100,
          }}
        >
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJDMmD1r9zq_Zb2iPo6Kplosik_s7holY013l3qOP0mOGTKmZCCxDFk7XpmhkZLBJkYEDfLQX8ibqh9rSiWB1kDSMbzCWNWX3sxYqx2De87YulsvSk-Oqhjk52PS81TVKjNM0KCbx31NePFN4--1NUqZh0YWwItq8UvLJTAgMf9KmpZMhotmC-RizM0koSZrVRsun6ucwGqQiMMIclWwJJBQi6tg0BDxGa5TmAafDv05LS3jXPrdHgzw3pPPs0GW-TdJZSUV-0G1tE"
            alt="Abstract privacy and security graphic with high-contrast geometric patterns."
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
                'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
            }}
          />
        </div>

        {/* HOW WE USE INFORMATION */}
        <SectionCard
          title="How We Use Information"
          icon={
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" strokeLinecap="round" />
            </svg>
          }
        >
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.md,
            }}
          >
            {uses.map((u) => (
              <li
                key={u}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: theme.spacing.md,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    marginTop: 8,
                    borderRadius: '50%',
                    background: theme.colors.black,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontSize: theme.fontSize.md,
                    color: theme.colors.textSecondary,
                    margin: 0,
                    lineHeight: theme.lineHeight.relaxed,
                  }}
                >
                  {u}
                </p>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* DATA PROTECTION CARD (matte black) */}
        <section
          style={{
            background: theme.colors.black,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.xl,
            color: theme.colors.white,
            boxShadow: theme.shadows.lg,
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
              width="22"
              height="22"
              fill="none"
              stroke={theme.colors.white}
              strokeWidth="2"
              aria-hidden
            >
              <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="9" y="11" width="6" height="5" rx="1" />
              <path d="M10 11V9a2 2 0 0 1 4 0v2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.h2,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.white,
                letterSpacing: theme.letterSpacing.tight,
                margin: 0,
                lineHeight: theme.lineHeight.tight,
              }}
            >
              Data Protection
            </h2>
          </div>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: theme.lineHeight.relaxed,
              margin: `0 0 ${theme.spacing.md}px 0`,
            }}
          >
            Your data is stored using industry-standard encryption (AES-256). We
            conduct regular security audits to ensure your collection and
            payment information remain impenetrable.
          </p>
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.sm,
              flexWrap: 'wrap',
            }}
          >
            {badges.map((b) => (
              <span
                key={b}
                style={{
                  padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: theme.radius.pill,
                  fontSize: theme.fontSize.sm,
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.white,
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            paddingTop: theme.spacing.lg,
            borderTop: `1px solid ${theme.colors.grey150}`,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
          }}
        >
          <h4
            style={{
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              margin: 0,
            }}
          >
            Questions regarding privacy?
          </h4>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              margin: 0,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Reach out to our compliance team for a detailed review of your data
            rights.
          </p>
          <button
            type="button"
            onClick={() => {
              haptic.medium();
              showToast('Opening Privacy Officer contact');
            }}
            className="pressable-strong pp-cta"
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
            }}
          >
            Contact Privacy Officer
          </button>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: theme.spacing.xxl,
              marginTop: theme.spacing.sm,
            }}
          >
            <Link
              href="/terms-conditions"
              onClick={() => haptic.light()}
              className="pressable pp-link"
              style={{
                fontSize: theme.fontSize.sm,
                color: theme.colors.textSecondary,
                textDecoration: 'underline',
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              onClick={() => haptic.light()}
              className="pressable pp-link"
              style={{
                fontSize: theme.fontSize.sm,
                color: theme.colors.textSecondary,
                textDecoration: 'underline',
              }}
            >
              Cookie Policy
            </Link>
          </div>
        </footer>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .pp-cta:active {
          transform: scale(0.97);
        }
        .pp-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .pp-link:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
