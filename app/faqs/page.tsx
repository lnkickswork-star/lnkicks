'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { useApp } from '@/components/context/AppContext';

/**
 * FaqsPage — Pattern C rewrite.
 *
 * The previous file used undefined Tailwind utility classes
 * (`bg-surface`, `text-primary`, `text-headline-lg-mobile`,
 * `material-symbols-outlined`, etc.) and Material Symbols font icons — it
 * rendered unstyled in production. This rewrite rebuilds the FAQ layout
 * from scratch with MobileLayout + tokens + inline SVG icons.
 *
 * Semantic content preserved 1:1:
 *  - Header ("FAQs" + sub-copy)
 *  - Search bar (now functional — filters the Q&A list)
 *  - Categories: Orders / Payments / Shipping & Returns
 *  - All 6 original questions; the one answer the original provided verbatim
 *    ("Orders can be cancelled within 30 minutes…"); the others (which the
 *    original left collapsed without answers) are filled in to match the
 *    answers given on /help-support, /shipping-policy, /return-refund-policy,
 *    /payment-methods so the FAQ actually delivers on its promises.
 *  - "Still need help?" CTA → /contact-us
 */
type FaqItem = { q: string; a: string };
type FaqCategory = { title: string; icon: React.ReactNode; items: FaqItem[] };

const CATEGORIES: FaqCategory[] = [
  {
    title: 'Orders',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
        <path d="M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    items: [
      {
        q: 'How can I track my order?',
        a: 'A tracking number is emailed to you once your order ships. You can also see live status by tapping TRACK ORDER on the order in My Orders, which opens the real-time Express Shipment timeline.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled within 30 minutes of placement. After this window, our fulfillment center begins processing for high-speed delivery. Please contact our VIP concierge for urgent requests.',
      },
    ],
  },
  {
    title: 'Payments',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" />
      </svg>
    ),
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, Mastercard, American Express, UPI (Google Pay / PhonePe / Paytm), Apple Pay, and Google Pay. All saved cards and digital wallets can be managed under Payment Methods.',
      },
      {
        q: 'Are my payment details secure?',
        a: 'Yes — all transactions are processed through a PCI-DSS compliant encrypted gateway using AES-256. We never store your full card number on our servers.',
      },
    ],
  },
  {
    title: 'Shipping & Returns',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="1" y="3" width="15" height="13" rx="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    items: [
      {
        q: 'How long does shipping take?',
        a: 'Prepaid orders ship via BlueDart Express and arrive within 2-4 business days across India. Standard Shipping takes 5-7 business days; Premium Overnight is next-day.',
      },
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day hassle-free return or size exchange for unworn sneakers with all original tags attached. Refunds are processed to your original payment method within 5-7 business days.',
      },
    ],
  },
];

export default function FaqsPage() {
  const { showToast } = useApp();
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>('Orders-1');

  const normalize = (s: string) => s.toLowerCase().trim();
  const q = normalize(query);

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (it) =>
        q === '' ||
        normalize(it.q).includes(q) ||
        normalize(it.a).includes(q) ||
        normalize(cat.title).includes(q),
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <MobileLayout headerVariant="back" title="FAQs"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'FAQs' },
      ]}
      desktopMaxWidth={1024}
    >
      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.xxl,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xxl,
        }}
      >
        {/* HEADER */}
        <div>
          <h2
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h1,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.textPrimary,
              letterSpacing: theme.letterSpacing.tight,
              margin: `0 0 ${theme.spacing.xs}px 0`,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            FAQs
          </h2>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              lineHeight: theme.lineHeight.relaxed,
              margin: 0,
            }}
          >
            Everything you need to know about your luxury sneaker experience.
          </p>
        </div>

        {/* SEARCH */}
        <div style={{ position: 'relative' }}>
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: theme.spacing.lg,
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.colors.textTertiary,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              haptic.light();
              setQuery(e.target.value);
            }}
            placeholder="Search questions..."
            className="faq-search"
            style={{
              width: '100%',
              background: theme.colors.grey100,
              border: `1px solid ${theme.colors.grey200}`,
              borderRadius: theme.radius.lg,
              padding: `${theme.spacing.md + 2}px ${theme.spacing.md}px ${theme.spacing.md + 2}px ${theme.spacing.xxl + theme.spacing.lg}px`,
              fontSize: theme.fontSize.md,
              fontFamily: theme.fontFamily.body,
              color: theme.colors.textPrimary,
              outline: 'none',
            }}
          />
        </div>

        {/* CATEGORIES */}
        {filtered.length === 0 ? (
          <div
            style={{
              padding: `${theme.spacing.xxl}px ${theme.spacing.lg}px`,
              textAlign: 'center',
              color: theme.colors.textSecondary,
              fontSize: theme.fontSize.md,
            }}
          >
            No FAQs match “{query}”.
          </div>
        ) : (
          filtered.map((cat) => (
            <section key={cat.title}>
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.title,
                  fontWeight: theme.fontWeight.extrabold,
                  color: theme.colors.textPrimary,
                  margin: `0 0 ${theme.spacing.md}px 0`,
                  letterSpacing: theme.letterSpacing.tight,
                  lineHeight: theme.lineHeight.tight,
                }}
              >
                <span style={{ color: theme.colors.textSecondary }}>{cat.icon}</span>
                {cat.title}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.md,
                }}
              >
                {cat.items.map((it, idx) => {
                  const key = `${cat.title}-${idx}`;
                  const open = openKey === key;
                  return (
                    <div
                      key={key}
                      style={{
                        background: theme.colors.white,
                        border: `1px solid ${open ? theme.colors.black : theme.colors.grey150}`,
                        borderRadius: theme.radius.lg,
                        overflow: 'hidden',
                        boxShadow: theme.shadows.xs,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          haptic.selection();
                          setOpenKey(open ? null : key);
                        }}
                        aria-expanded={open}
                        className="pressable faq-row"
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: theme.spacing.md,
                          padding: theme.spacing.lg,
                          background: open ? theme.colors.grey50 : 'transparent',
                          border: 'none',
                          borderBottom: open
                            ? `1px solid ${theme.colors.grey150}`
                            : '1px solid transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          color: theme.colors.textPrimary,
                          fontFamily: theme.fontFamily.body,
                          fontSize: theme.fontSize.lg,
                          fontWeight: theme.fontWeight.semibold,
                        }}
                      >
                        <span style={{ flex: 1 }}>{it.q}</span>
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden
                          style={{
                            flexShrink: 0,
                            transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1)',
                            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: open ? theme.colors.textPrimary : theme.colors.textTertiary,
                          }}
                        >
                          <polyline
                            points="6 9 12 15 18 9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {open && (
                        <div
                          style={{
                            padding: theme.spacing.lg,
                            background: theme.colors.white,
                          }}
                        >
                          <p
                            style={{
                              fontSize: theme.fontSize.md,
                              color: theme.colors.textSecondary,
                              lineHeight: theme.lineHeight.relaxed,
                              margin: 0,
                            }}
                          >
                            {it.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}

        {/* STILL NEED HELP BANNER */}
        <div
          style={{
            background: theme.colors.black,
            borderRadius: theme.radius.xxl,
            padding: theme.spacing.xxl,
            textAlign: 'center',
            boxShadow: theme.shadows.lg,
          }}
        >
          <h4
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.title,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.white,
              margin: `0 0 ${theme.spacing.xs}px 0`,
              letterSpacing: theme.letterSpacing.tight,
            }}
          >
            Still need help?
          </h4>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: 'rgba(255,255,255,0.8)',
              margin: `0 0 ${theme.spacing.xl}px 0`,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Our 24/7 Concierge team is here to assist with any further questions.
          </p>
          <Link
            href="/contact-us"
            onClick={() => haptic.medium()}
            className="pressable-strong faq-cta"
            style={{
              display: 'block',
              width: '100%',
              padding: `${theme.spacing.lg + 2}px ${theme.spacing.md}px`,
              background: theme.colors.white,
              color: theme.colors.black,
              borderRadius: theme.radius.pill,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              textDecoration: 'none',
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            Contact Support
          </Link>
        </div>

        {/* SECONDARY LINK */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/help-support"
            onClick={() => {
              haptic.light();
              showToast('Opening Help & Support');
            }}
            className="pressable faq-link"
            style={{
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textSecondary,
              textDecoration: 'underline',
            }}
          >
            Back to Help &amp; Support
          </Link>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .faq-search:focus {
          border-color: ${theme.colors.black};
          box-shadow: 0 0 0 3px ${theme.colors.focusRing};
        }
        .faq-row:active {
          transform: scale(0.99);
        }
        .faq-row:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: -2px;
        }
        .faq-cta:active {
          transform: scale(0.97);
        }
        .faq-cta:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 3px;
        }
        .faq-link:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
