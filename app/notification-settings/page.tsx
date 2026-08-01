'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { useApp } from '@/components/context/AppContext';

/**
 * NotificationSettingsPage — Pattern C rewrite.
 *
 * The previous file used undefined Tailwind utility classes
 * (`bg-surface`, `text-primary`, `text-headline-lg-mobile`,
 * `material-symbols-outlined`, `peer-checked:*`, etc.) and Material Symbols
 * font icons — it rendered unstyled in production (Tailwind `peer-checked`
 * variants require the actual Tailwind config; `bg-surface` etc. are
 * undefined). This rewrite rebuilds the toggle list from scratch with
 * MobileLayout + tokens + inline SVG icons + a custom toggle component.
 *
 * Semantic content preserved 1:1:
 *  - Header: "Preferences" + "Manage how you stay updated with LNKICKS."
 *  - Transactionals group:
 *      • Order Updates — Tracking, delivery, and returns (on)
 *      • Account Alerts — Security and privacy notifications (on)
 *  - Discovery group:
 *      • New Drops — Limited edition releases (off)
 *      • Promotions — Personalized offers and sales (off)
 *  - Save Preferences + Disable All CTAs.
 *  - "Need help with your account?" + "Contact Support 24/7" accent card.
 */
type SettingKey = 'orderUpdates' | 'accountAlerts' | 'newDrops' | 'promotions';

type SettingDef = {
  key: SettingKey;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

const TRANSACTIONALS: SettingDef[] = [
  {
    key: 'orderUpdates',
    title: 'Order Updates',
    subtitle: 'Tracking, delivery, and returns',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="1" y="3" width="15" height="13" rx="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    key: 'accountAlerts',
    title: 'Account Alerts',
    subtitle: 'Security and privacy notifications',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const DISCOVERY: SettingDef[] = [
  {
    key: 'newDrops',
    title: 'New Drops',
    subtitle: 'Limited edition releases',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 2v6M12 22v-6M2 12h6M22 12h-6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    key: 'promotions',
    title: 'Promotions',
    subtitle: 'Personalized offers and sales',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="7" y1="7" x2="7.01" y2="7" strokeLinecap="round" />
      </svg>
    ),
  },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="pressable ns-toggle"
      style={{
        width: 44,
        height: 24,
        borderRadius: theme.radius.pill,
        background: checked ? theme.colors.black : theme.colors.grey300,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
        transition: 'background 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: theme.colors.white,
          boxShadow: theme.shadows.xs,
          transition: 'left 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const { showToast } = useApp();
  const [settings, setSettings] = useState<Record<SettingKey, boolean>>({
    orderUpdates: true,
    accountAlerts: true,
    newDrops: false,
    promotions: false,
  });

  const toggle = (key: SettingKey) => {
    haptic.selection();
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    haptic.success();
    showToast('Notification preferences saved');
  };

  const handleDisableAll = () => {
    haptic.medium();
    setSettings({
      orderUpdates: false,
      accountAlerts: false,
      newDrops: false,
      promotions: false,
    });
    showToast('All notifications disabled');
  };

  const renderRow = (def: SettingDef) => (
    <div
      key={def.key}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.lg,
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: theme.colors.grey100,
            color: theme.colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {def.icon}
        </div>
        <div style={{ minWidth: 0 }}>
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
            {def.title}
          </p>
          <p
            style={{
              fontSize: theme.fontSize.sm,
              color: theme.colors.textSecondary,
              margin: 0,
            }}
          >
            {def.subtitle}
          </p>
        </div>
      </div>
      <Toggle
        checked={settings[def.key]}
        onChange={() => toggle(def.key)}
        label={def.title}
      />
    </div>
  );

  const renderGroup = (title: string, items: SettingDef[]) => (
    <div
      style={{
        background: theme.colors.white,
        borderRadius: theme.radius.xl,
        padding: theme.spacing.xl,
        border: `1px solid ${theme.colors.grey150}`,
        boxShadow: theme.shadows.xs,
      }}
    >
      <h3
        style={{
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.bold,
          color: theme.colors.textSecondary,
          letterSpacing: theme.letterSpacing.wider,
          textTransform: 'uppercase',
          margin: `0 0 ${theme.spacing.lg}px 0`,
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xl,
        }}
      >
        {items.map(renderRow)}
      </div>
    </div>
  );

  return (
    <MobileLayout headerVariant="back" title="Notification Settings">
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
            Preferences
          </h2>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              margin: 0,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Manage how you stay updated with LNKICKS.
          </p>
        </div>

        {/* GROUP 1 — TRANSACTIONALS */}
        {renderGroup('Transactionals', TRANSACTIONALS)}

        {/* GROUP 2 — DISCOVERY */}
        {renderGroup('Discovery', DISCOVERY)}

        {/* SAVE / DISABLE ALL */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
          }}
        >
          <button
            type="button"
            onClick={handleSave}
            className="pressable-strong ns-save"
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
            Save Preferences
          </button>
          <button
            type="button"
            onClick={handleDisableAll}
            className="pressable ns-disable"
            style={{
              width: '100%',
              padding: `${theme.spacing.lg + 2}px ${theme.spacing.md}px`,
              background: 'transparent',
              color: theme.colors.textPrimary,
              borderRadius: theme.radius.pill,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              border: `1.5px solid ${theme.colors.grey300}`,
              cursor: 'pointer',
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            Disable All
          </button>
        </div>

        {/* SUPPORT ACCENT CARD */}
        <Link
          href="/contact-us"
          onClick={() => haptic.light()}
          className="pressable ns-support"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing.xl,
            background: theme.colors.black,
            color: theme.colors.white,
            borderRadius: theme.radius.xxl,
            textDecoration: 'none',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: theme.shadows.lg,
          }}
        >
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.title,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.white,
                margin: `0 0 ${theme.spacing.xs}px 0`,
                lineHeight: theme.lineHeight.snug,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              Need help with your account?
            </p>
            <p
              style={{
                fontSize: theme.fontSize.sm,
                color: 'rgba(255,255,255,0.72)',
                margin: 0,
              }}
            >
              Contact Support 24/7
            </p>
          </div>
          <svg
            viewBox="0 0 24 24"
            width="80"
            height="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden
            style={{
              position: 'absolute',
              right: -20,
              top: -20,
              opacity: 0.18,
              color: theme.colors.white,
            }}
          >
            <path d="M12 1a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v3a4 4 0 0 1-4 4h-1v2a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-2H4a4 4 0 0 1-4-4V9a3 3 0 0 1 3-3h1V5a4 4 0 0 1 4-4z" strokeLinecap="round" strokeLinejoin="round" transform="translate(4 1)" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
            style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}
          >
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            <polyline points="12 5 19 12 12 19" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .ns-toggle:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .ns-save:active {
          transform: scale(0.97);
        }
        .ns-save:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .ns-disable:active {
          transform: scale(0.97);
        }
        .ns-disable:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .ns-support:active {
          transform: scale(0.99);
        }
        .ns-support:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
