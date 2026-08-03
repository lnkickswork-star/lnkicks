'use client';

import React, { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { useApp } from '@/components/context/AppContext';

/**
 * PaymentMethodsPage — Pattern C rewrite.
 *
 * The previous file used undefined Tailwind utility classes
 * (`bg-surface`, `text-primary`, `text-headline-lg-mobile`,
 * `material-symbols-outlined`, etc.) and Material Symbols font icons — it
 * rendered unstyled in production. This rewrite rebuilds the saved-cards +
 * digital-wallet list from scratch with MobileLayout + tokens + inline SVG
 * icons.
 *
 * Semantic content preserved 1:1:
 *  - Title "Payment Methods" + sub "Manage your secure payment options".
 *  - Saved Cards section with 2 cards:
 *      • Platinum Member Card — •••• •••• •••• 8888 — 12/26 — Mastercard
 *      • Everyday Spend — •••• •••• •••• 4242 — 09/25 — VISA
 *  - Digital Wallets section:
 *      • Apple Pay — Default Wallet (selected)
 *      • Google Pay — Linked via john.doe@gmail.com (unselected)
 *  - "Add New Method" CTA at the bottom.
 *
 * Interactivity added (none existed in the original):
 *  - Wallet radio is now stateful — tap selects it with haptic.selection().
 *  - More-options + Add New Method fire haptic.light() + toast.
 */
type Wallet = {
  id: string;
  name: string;
  detail: string;
  icon: 'apple' | 'google';
};

const WALLETS: Wallet[] = [
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    detail: 'Default Wallet',
    icon: 'apple',
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    detail: 'Linked via john.doe@gmail.com',
    icon: 'google',
  },
];

function WalletIcon({ kind }: { kind: Wallet['icon'] }) {
  if (kind === 'apple') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
        <path d="M16.365 1.43c.018 1.067-.388 2.106-1.05 2.832-.7.778-1.815 1.38-2.91 1.296-.137-1.04.42-2.118 1.066-2.86.717-.815 1.922-1.388 2.894-1.268zM20.5 17.21c-.49 1.13-.722 1.633-1.353 2.633-.876 1.39-2.113 3.118-3.644 3.13-1.36.013-1.71-.885-3.558-.875-1.85.01-2.236.886-3.596.872-1.53-.018-2.7-1.582-3.576-2.97C2.49 17.05 2.21 13.27 3.49 11.26c.798-1.246 2.058-1.974 3.244-1.974 1.207 0 1.965.836 2.962.836.97 0 1.56-.836 2.96-.836 1.06 0 2.183.577 2.983 1.575-2.623 1.437-2.198 5.183.46 6.348zM14.4 16.07c-.296.692-.49 1.07-.49 1.07h-.005c-.34.748-.892 1.548-1.488 1.548-.5 0-.7-.27-.7-1.05 0-.27.04-.56.11-.85.27-.97.81-2.62.81-2.62h-.005c.34-.748.892-1.548 1.488-1.548.5 0 .7.27.7 1.05 0 .27-.04.56-.11.85z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" strokeLinecap="round" />
    </svg>
  );
}

export default function PaymentMethodsPage() {
  const { showToast } = useApp();
  const [selectedWallet, setSelectedWallet] = useState<string>('apple-pay');

  return (
    <MobileLayout headerVariant="back" title="Payment Methods"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Account', href: '/profile' },
        { label: 'Payment Methods' },
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
        {/* SCREEN TITLE */}
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
            Payment Methods
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              margin: 0,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Manage your secure payment options
          </p>
        </div>

        {/* SAVED CARDS */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
          }}
        >
          <h2
            style={{
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textSecondary,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Saved Cards
          </h2>

          {/* Premium Mastercard */}
          <div
            style={{
              background: theme.colors.white,
              borderRadius: theme.radius.xl,
              padding: theme.spacing.xl,
              border: `1px solid ${theme.colors.grey150}`,
              boxShadow: theme.shadows.xs,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 192,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: theme.spacing.sm,
                right: theme.spacing.sm,
                color: theme.colors.grey200,
                opacity: 0.5,
              }}
            >
              <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 32,
                  borderRadius: theme.radius.sm,
                  background: theme.colors.black,
                  color: theme.colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M2 8.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2" strokeLinecap="round" />
                  <path d="M2 8.5v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7" strokeLinecap="round" />
                  <path d="M6 12h.01M9 12h.5" strokeLinecap="round" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => {
                  haptic.light();
                  showToast('Card options menu');
                }}
                className="pressable pm-more"
                aria-label="Card options"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: theme.colors.textPrimary,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p
                style={{
                  fontSize: theme.fontSize.sm,
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.xs,
                  margin: `0 0 ${theme.spacing.xs}px 0`,
                }}
              >
                Platinum Member Card
              </p>
              <p
                style={{
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.title,
                  fontWeight: theme.fontWeight.extrabold,
                  letterSpacing: '0.2em',
                  color: theme.colors.textPrimary,
                  margin: 0,
                }}
              >
                •••• •••• •••• 8888
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: theme.fontSize.xs,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textSecondary,
                    letterSpacing: theme.letterSpacing.wider,
                    textTransform: 'uppercase',
                  }}
                >
                  Expiry
                </span>
                <span
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textPrimary,
                  }}
                >
                  12/26
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: theme.colors.grey100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.textPrimary,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: theme.fontSize.sm,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textPrimary,
                  }}
                >
                  Mastercard
                </span>
              </div>
            </div>
          </div>

          {/* Visa */}
          <div
            style={{
              background: theme.colors.white,
              borderRadius: theme.radius.xl,
              padding: theme.spacing.xl,
              border: `1px solid ${theme.colors.grey150}`,
              boxShadow: theme.shadows.xs,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 192,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: theme.spacing.sm,
                right: theme.spacing.sm,
                color: theme.colors.grey200,
                opacity: 0.4,
              }}
            >
              <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 32,
                  borderRadius: theme.radius.sm,
                  background: theme.colors.grey100,
                  color: theme.colors.textPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M2 8.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2" strokeLinecap="round" />
                  <path d="M2 8.5v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7" strokeLinecap="round" />
                  <path d="M6 12h.01M9 12h.5" strokeLinecap="round" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => {
                  haptic.light();
                  showToast('Card options menu');
                }}
                className="pressable pm-more"
                aria-label="Card options"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: theme.colors.textPrimary,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p
                style={{
                  fontSize: theme.fontSize.sm,
                  color: theme.colors.textSecondary,
                  margin: `0 0 ${theme.spacing.xs}px 0`,
                }}
              >
                Everyday Spend
              </p>
              <p
                style={{
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.title,
                  fontWeight: theme.fontWeight.extrabold,
                  letterSpacing: '0.2em',
                  color: theme.colors.textPrimary,
                  margin: 0,
                }}
              >
                •••• •••• •••• 4242
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: theme.fontSize.xs,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textSecondary,
                    letterSpacing: theme.letterSpacing.wider,
                    textTransform: 'uppercase',
                  }}
                >
                  Expiry
                </span>
                <span
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textPrimary,
                  }}
                >
                  09/25
                </span>
              </div>
              <span
                style={{
                  fontSize: theme.fontSize.sm,
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.textPrimary,
                  letterSpacing: theme.letterSpacing.wide,
                }}
              >
                VISA
              </span>
            </div>
          </div>
        </section>

        {/* DIGITAL WALLETS */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
          }}
        >
          <h2
            style={{
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textSecondary,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Digital Wallets
          </h2>

          {WALLETS.map((w) => {
            const selected = selectedWallet === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  haptic.selection();
                  setSelectedWallet(w.id);
                  showToast(`${w.name} set as default wallet`);
                }}
                aria-pressed={selected}
                className="pressable pm-wallet"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: theme.spacing.lg,
                  background: theme.colors.white,
                  borderRadius: theme.radius.xl,
                  border: selected
                    ? `2px solid ${theme.colors.black}`
                    : `1px solid ${theme.colors.grey150}`,
                  boxShadow: theme.shadows.xs,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.lg,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: selected
                        ? theme.colors.black
                        : theme.colors.grey100,
                      color: selected
                        ? theme.colors.white
                        : theme.colors.textPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <WalletIcon kind={w.icon} />
                  </div>
                  <div>
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
                      {w.name}
                    </p>
                    <p
                      style={{
                        fontSize: theme.fontSize.md,
                        color: theme.colors.textSecondary,
                        margin: 0,
                      }}
                    >
                      {w.detail}
                    </p>
                  </div>
                </div>
                {selected ? (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden style={{ color: theme.colors.textPrimary }}>
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.5 14.5l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden style={{ color: theme.colors.textTertiary }}>
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </button>
            );
          })}
        </section>

        {/* ADD NEW METHOD */}
        <button
          type="button"
          onClick={() => {
            haptic.light();
            showToast('Add new payment method');
          }}
          className="pressable-strong pm-cta"
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            boxShadow: theme.shadows.md,
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
          </svg>
          Add New Method
        </button>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .pm-wallet:active {
          transform: scale(0.99);
        }
        .pm-wallet:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .pm-more:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .pm-cta:active {
          transform: scale(0.97);
        }
        .pm-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
