'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { useApp } from '@/components/context/AppContext';

/**
 * AddressesPage — Pattern C rewrite.
 *
 * The previous file used undefined Tailwind utility classes
 * (`bg-surface`, `text-primary`, `text-headline-lg-mobile`,
 * `material-symbols-outlined`, etc.) and Material Symbols font icons — it
 * rendered unstyled in production. This rewrite rebuilds the saved-address
 * card list from scratch with MobileLayout + tokens + inline SVG icons.
 *
 * Semantic content preserved 1:1:
 *  - "Add New Address" primary CTA at the top.
 *  - 3 saved addresses (Home / Work / Summer House) with the original
 *    recipient name, full street addresses, and phone numbers.
 *  - Home card carries the "DEFAULT" badge (filled black on white).
 *  - Each card exposes Edit + Delete actions (Delete uses muted error red).
 *  - Decorative grayscale map at the bottom with the "3 Saved Locations"
 *    pin badge (Google-hosted URL preserved).
 *
 * Interactivity added (none existed in the original):
 *  - Delete removes the address from the in-memory list + fires haptic.error()
 *    + toast.
 *  - Add / Edit fire haptic.light() + toast (no real form yet).
 */
type Address = {
  id: string;
  label: string;
  recipient: string;
  street: string;
  area: string;
  phone: string;
  isDefault?: boolean;
  icon: 'home' | 'work' | 'holiday';
};

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'home',
    label: 'Home',
    recipient: 'Alex Thompson',
    street: 'Flat 402, Luxury Heights, Bandra West',
    area: 'Mumbai, Maharashtra 400050',
    phone: '+91 98765 43210',
    isDefault: true,
    icon: 'home',
  },
  {
    id: 'work',
    label: 'Work',
    recipient: 'Alex Thompson',
    street: 'Tower B, 18th Floor, Cyber Hub',
    area: 'Gurugram, Haryana 122002',
    phone: '+91 98765 43210',
    icon: 'work',
  },
  {
    id: 'summer',
    label: 'Hill Station',
    recipient: 'Alex Thompson',
    street: 'Villa 12, Pine Valley, Mussoorie Road',
    area: 'Dehradun, Uttarakhand 248001',
    phone: '+91 98765 43210',
    icon: 'holiday',
  },
];

function LabelIcon({ kind }: { kind: Address['icon'] }) {
  const common = {
    viewBox: '0 0 24 24',
    width: 18,
    height: 18,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
  } as const;
  if (kind === 'home') {
    return (
      <svg {...common} aria-hidden>
        <path d="M3 12l9-9 9 9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 20v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'work') {
    return (
      <svg {...common} aria-hidden>
        <rect x="2" y="7" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // holiday
  return (
    <svg {...common} aria-hidden>
      <path d="M3 21V11l6-3 6 3v10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-5h6v5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 11V8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AddressesPage() {
  const { showToast } = useApp();
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);

  const handleDelete = (id: string, label: string) => {
    haptic.error();
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast(`${label} address removed`);
  };

  const handleAdd = () => {
    haptic.light();
    showToast('Add new address form coming soon');
  };

  const handleEdit = (label: string) => {
    haptic.light();
    showToast(`Editing ${label} address`);
  };

  return (
    <MobileLayout headerVariant="back" title="My Addresses"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Account', href: '/profile' },
        { label: 'Addresses' },
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
        {/* ADD NEW ADDRESS CTA */}
        <button
          type="button"
          onClick={handleAdd}
          className="pressable-strong addr-cta"
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
          Add New Address
        </button>

        {/* ADDRESS LIST */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
          }}
        >
          {addresses.length === 0 && (
            <div
              style={{
                padding: theme.spacing.xxl,
                background: theme.colors.white,
                borderRadius: theme.radius.xl,
                border: `1px solid ${theme.colors.grey150}`,
                textAlign: 'center',
                color: theme.colors.textSecondary,
                fontSize: theme.fontSize.md,
              }}
            >
              No saved addresses yet.
            </div>
          )}
          {addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                background: theme.colors.white,
                padding: theme.spacing.lg,
                borderRadius: theme.radius.xl,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.xs,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: theme.spacing.md,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    color: theme.colors.textPrimary,
                  }}
                >
                  <LabelIcon kind={addr.icon} />
                  <h3
                    style={{
                      fontFamily: theme.fontFamily.display,
                      fontSize: theme.fontSize.title,
                      fontWeight: theme.fontWeight.extrabold,
                      color: theme.colors.textPrimary,
                      margin: 0,
                      letterSpacing: theme.letterSpacing.tight,
                    }}
                  >
                    {addr.label}
                  </h3>
                </div>
                {addr.isDefault && (
                  <span
                    style={{
                      background: theme.colors.black,
                      color: theme.colors.white,
                      fontSize: theme.fontSize.xs,
                      fontWeight: theme.fontWeight.bold,
                      letterSpacing: theme.letterSpacing.wider,
                      textTransform: 'uppercase',
                      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                      borderRadius: theme.radius.sm,
                    }}
                  >
                    Default
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.xs,
                }}
              >
                <p
                  style={{
                    fontSize: theme.fontSize.lg,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textPrimary,
                    margin: 0,
                  }}
                >
                  {addr.recipient}
                </p>
                <p
                  style={{
                    fontSize: theme.fontSize.md,
                    color: theme.colors.textSecondary,
                    margin: 0,
                    lineHeight: theme.lineHeight.relaxed,
                  }}
                >
                  {addr.street}
                  <br />
                  {addr.area}
                </p>
                <p
                  style={{
                    fontSize: theme.fontSize.md,
                    color: theme.colors.textSecondary,
                    margin: `${theme.spacing.xs}px 0 0 0`,
                  }}
                >
                  {addr.phone}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.lg,
                  paddingTop: theme.spacing.xs,
                  borderTop: `1px solid ${theme.colors.grey150}`,
                  marginTop: theme.spacing.xs,
                }}
              >
                <button
                  type="button"
                  onClick={() => handleEdit(addr.label)}
                  className="pressable addr-act"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    background: 'transparent',
                    border: 'none',
                    color: theme.colors.textPrimary,
                    fontFamily: theme.fontFamily.body,
                    fontSize: theme.fontSize.lg,
                    fontWeight: theme.fontWeight.bold,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id, addr.label)}
                  className="pressable addr-act"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    background: 'transparent',
                    border: 'none',
                    color: theme.colors.error,
                    fontFamily: theme.fontFamily.body,
                    fontSize: theme.fontSize.lg,
                    fontWeight: theme.fontWeight.bold,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* DECORATIVE MAP */}
        <section
          style={{
            width: '100%',
            height: 160,
            borderRadius: theme.radius.xxl,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: theme.shadows.xs,
          }}
        >
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWn_5xsD8xnZ4gFRNuFht73QYiQpd7JIJ1UFvXh2IpbkqLj_LK4_KrILmE_6qZVaPytQ-qfJe6aUD3FQxrvPG7XiAk1Onw9K5anNsOZ-Q-Wnu4W0v_7Egb5lCmDwpPFyBWde2f5JveX8EQAVGiP1smZmcm8fRlvjZFzd-IWWceZIb24zZYWJf5cvuir3_Va1RDAmwzAOAGPUmnGq5gztYUqj_SqKMtS3q9XxXXF4lDhCn_6gZG-889lPloeJKnPl8IQPSyJyEKgPWN"
            alt="Minimalist high-contrast aerial map view of a metropolitan city grid with monochromatic black and white street lines."
            width={400}
            height={300}
            unoptimized
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(1) brightness(0.95)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                background: theme.colors.white,
                padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
                borderRadius: theme.radius.pill,
                boxShadow: theme.shadows.md,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                aria-hidden
                style={{ color: theme.colors.textPrimary }}
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span
                style={{
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.textPrimary,
                }}
              >
                {addresses.length} Saved Locations
              </span>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .addr-cta:active {
          transform: scale(0.97);
        }
        .addr-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .addr-act:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
