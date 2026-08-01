'use client';

import React, { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * SettingsPanelPage — Admin Settings panel.
 *
 * Stage 4g (admin) — Pattern C FULL REWRITE.
 * The original file used undefined Tailwind utility classes
 * (`bg-surface`, `text-headline-lg-mobile`, `font-headline-lg-mobile`,
 * `material-symbols-outlined`, `rounded-xl`, `bg-surface-container-lowest`,
 * `border-[#EEEEEE]`, `bg-[#6772E5]`, `space-y-stack-md`, etc.) and Material
 * Symbols font icons — it rendered unstyled in production. This rewrite
 * rebuilds the page from scratch with MobileLayout + token-driven inline
 * styles + inline SVG icons.
 *
 * Layout:
 *  - `<MobileLayout headerVariant="back" title="Settings" hideBottomNav>`.
 *  - Page title + sub-copy.
 *  - Settings sections:
 *      1. General Settings — marketplace name input + Maintenance Mode +
 *         Automatic SEO toggles.
 *      2. Payment Gateway — Stripe (connected) + PayPal (not configured).
 *      3. Shipping Configuration — flat-rate input + DHL Express + FedEx
 *         Overnight toggles.
 *      4. User Roles & Permissions — Super Administrator + Content
 *         Moderator rows + Create New Role button.
 *  - Sticky Save Changes CTA.
 *
 * Token usage:
 *  - Section cards: theme.radius.lg + 1px solid theme.colors.grey150 +
 *    theme.shadows.xs on theme.colors.white.
 *  - Inputs: theme.radius.lg + grey100 bg + 1.5px solid grey300 border,
 *    focus → black border.
 *  - Toggles: 44×24 pill on black (on) or grey300 (off); 18×18 white knob.
 *  - Payment gateway chips (Stripe / PayPal): 40×40 radius.md tinted
 *    wells (Stripe = black tinted, PayPal = grey100) — original used
 *    brand blue #6772E5 for Stripe but brand colors are forbidden in LN
 *    KICKS design system → replaced with theme.colors.black for Stripe
 *    connected state (the design system's accent surface).
 *  - Role avatars: 32×32 radius.pill on black (Super Admin) or grey200
 *    (Moderator) with 3-letter monogram.
 *  - Save Changes CTA: black + radius.pill + display font + uppercase +
 *    haptic.medium() + showToast() on click.
 *
 * All settings data (LNKICKS Luxury Boutique default, Stripe connected,
 * PayPal not configured, DHL Express on, FedEx Overnight off, Super
 * Administrator + Content Moderator roles) preserved verbatim from the
 * original.
 */
export default function SettingsPanelPage() {
  const { showToast } = useApp();

  // Toggle states — defaults match the original markup.
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [automaticSeo, setAutomaticSeo] = useState(true);
  const [dhlExpress, setDhlExpress] = useState(true);
  const [fedExOvernight, setFedExOvernight] = useState(false);

  const handleSave = () => {
    haptic.medium();
    showToast('Settings saved');
  };

  const handleToggle =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      haptic.selection();
      setter((v) => !v);
    };

  const handleRoleTap = (role: string) => {
    haptic.light();
    showToast(`Edit ${role} permissions`);
  };

  const handleCreateRole = () => {
    haptic.light();
    showToast('Create new role');
  };

  const handleSetupPaypal = () => {
    haptic.medium();
    showToast('Setup PayPal gateway');
  };

  return (
    <MobileLayout headerVariant="back" title="Settings" hideBottomNav>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* TITLE */}
        <div style={{ marginBottom: theme.spacing.xxl, paddingTop: theme.spacing.sm }}>
          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h1,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.textPrimary,
              margin: 0,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Admin Settings
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.sm,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Manage your marketplace operations and global configurations.
          </p>
        </div>

        {/* SETTINGS SECTIONS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xxl,
            paddingBottom: theme.spacing.giant,
          }}
        >
          {/* ── GENERAL SETTINGS ─────────────────────────────────── */}
          <section>
            <SectionHeading icon="gear" title="General Settings" />
            <div style={cardStyle}>
              {/* Marketplace name */}
              <div>
                <label htmlFor="sp-marketplace" style={labelStyle}>
                  Marketplace Name
                </label>
                <input
                  id="sp-marketplace"
                  type="text"
                  defaultValue="LNKICKS Luxury Boutique"
                  style={inputStyle}
                  className="sp-input"
                />
              </div>
              <ToggleRow
                label="Maintenance Mode"
                hint="Disable front-end access"
                on={maintenanceMode}
                onToggle={handleToggle(setMaintenanceMode)}
              />
              <ToggleRow
                label="Automatic SEO"
                hint="Generate meta tags automatically"
                on={automaticSeo}
                onToggle={handleToggle(setAutomaticSeo)}
              />
            </div>
          </section>

          {/* ── PAYMENT GATEWAY ──────────────────────────────────── */}
          <section>
            <SectionHeading icon="wallet" title="Payment Gateway" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              {/* Stripe — connected */}
              <div style={{ ...cardStyle, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, minWidth: 0 }}>
                  <GatewayChip variant="connected" icon="card" />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: theme.fontSize.md,
                        fontWeight: theme.fontWeight.semibold,
                        color: theme.colors.textPrimary,
                      }}
                    >
                      Stripe
                    </div>
                    <div
                      style={{
                        fontSize: theme.fontSize.xs,
                        color: theme.colors.textSecondary,
                        marginTop: 2,
                      }}
                    >
                      Connected • 0.5% fee
                    </div>
                  </div>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill={theme.colors.success}
                  stroke={theme.colors.success}
                  strokeWidth="1.5"
                  aria-hidden
                  style={{ flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10" fill={theme.colors.success} stroke="none" />
                  <polyline
                    points="7.5 12.5 10.5 15.5 16.5 8.5"
                    fill="none"
                    stroke={theme.colors.white}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* PayPal — not configured */}
              <div style={{ ...cardStyle, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, minWidth: 0 }}>
                  <GatewayChip variant="off" icon="wallet" />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: theme.fontSize.md,
                        fontWeight: theme.fontWeight.semibold,
                        color: theme.colors.textPrimary,
                      }}
                    >
                      PayPal
                    </div>
                    <div
                      style={{
                        fontSize: theme.fontSize.xs,
                        color: theme.colors.textSecondary,
                        marginTop: 2,
                      }}
                    >
                      Not configured
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSetupPaypal}
                  className="pressable sp-setup"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: theme.colors.textPrimary,
                    fontSize: theme.fontSize.body,
                    fontWeight: theme.fontWeight.bold,
                    cursor: 'pointer',
                    borderBottom: `1.5px solid ${theme.colors.textPrimary}`,
                    paddingBottom: 1,
                    letterSpacing: theme.letterSpacing.wider,
                    textTransform: 'uppercase',
                  }}
                >
                  Setup
                </button>
              </div>
            </div>
          </section>

          {/* ── SHIPPING CONFIGURATION ──────────────────────────── */}
          <section>
            <SectionHeading icon="truck" title="Shipping Configuration" />
            <div style={cardStyle}>
              <div>
                <label htmlFor="sp-shipping" style={labelStyle}>
                  Global Shipping Flat Rate ($)
                </label>
                <input
                  id="sp-shipping"
                  type="number"
                  placeholder="25.00"
                  style={inputStyle}
                  className="sp-input"
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: theme.spacing.md,
                  borderTop: `1px solid ${theme.colors.grey150}`,
                }}
              >
                <span
                  style={{
                    fontSize: theme.fontSize.md,
                    color: theme.colors.textPrimary,
                  }}
                >
                  DHL Express Integration
                </span>
                <Toggle on={dhlExpress} onToggle={handleToggle(setDhlExpress)} label="DHL Express Integration" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: theme.fontSize.md,
                    color: theme.colors.textPrimary,
                  }}
                >
                  FedEx Overnight
                </span>
                <Toggle on={fedExOvernight} onToggle={handleToggle(setFedExOvernight)} label="FedEx Overnight" />
              </div>
            </div>
          </section>

          {/* ── USER ROLES ───────────────────────────────────────── */}
          <section>
            <SectionHeading icon="badge" title="User Roles & Permissions" />
            <div
              style={{
                background: theme.colors.white,
                borderRadius: theme.radius.lg,
                overflow: 'hidden',
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.xs,
              }}
            >
              <RoleRow
                monogram="ADM"
                variant="admin"
                title="Super Administrator"
                hint="Full System Access"
                onTap={() => handleRoleTap('Super Administrator')}
              />
              <RoleRow
                monogram="MOD"
                variant="mod"
                title="Content Moderator"
                hint="Manage Listings & Users"
                onTap={() => handleRoleTap('Content Moderator')}
              />
              <button
                type="button"
                onClick={handleCreateRole}
                className="pressable sp-create-role"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: theme.spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.sm,
                  cursor: 'pointer',
                  fontFamily: theme.fontFamily.body,
                  fontSize: theme.fontSize.body,
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.textPrimary,
                  letterSpacing: theme.letterSpacing.wider,
                  textTransform: 'uppercase',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  aria-hidden
                >
                  <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                  <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                </svg>
                Create New Role
              </button>
            </div>
          </section>

          {/* SAVE CHANGES CTA */}
          <button
            type="button"
            onClick={handleSave}
            className="pressable sp-save"
            style={{
              width: '100%',
              padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
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
              boxShadow: theme.shadows.lg,
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .sp-input:focus {
          outline: none;
          border-color: ${theme.colors.black};
        }
        .sp-setup:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .sp-create-role:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: -2px;
        }
        .sp-save:active {
          transform: scale(0.98);
        }
        .sp-save:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Shared form styles
 * ────────────────────────────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: theme.fontSize.xs,
  fontWeight: theme.fontWeight.bold,
  color: theme.colors.textPrimary,
  marginBottom: theme.spacing.sm,
  letterSpacing: theme.letterSpacing.wider,
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: theme.colors.grey100,
  border: `1.5px solid ${theme.colors.grey300}`,
  borderRadius: theme.radius.lg,
  padding: `${theme.spacing.md + 2}px ${theme.spacing.lg}px`,
  fontSize: theme.fontSize.md,
  fontFamily: theme.fontFamily.body,
  color: theme.colors.textPrimary,
  transition: 'border-color 180ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const cardStyle: React.CSSProperties = {
  background: theme.colors.white,
  borderRadius: theme.radius.lg,
  padding: theme.spacing.lg,
  border: `1px solid ${theme.colors.grey150}`,
  boxShadow: theme.shadows.xs,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
};

/* ──────────────────────────────────────────────────────────────────
 * SectionHeading — section icon + title row
 * ────────────────────────────────────────────────────────────────── */
function SectionHeading({
  icon,
  title,
}: {
  icon: 'gear' | 'wallet' | 'truck' | 'badge';
  title: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke={theme.colors.textPrimary}
        strokeWidth="2"
        aria-hidden
      >
        {icon === 'gear' && (
          <>
            <circle cx="12" cy="12" r="3" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
            />
          </>
        )}
        {icon === 'wallet' && (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7a2 2 0 012-2h12a2 2 0 012 2v0H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2V9"
            />
            <circle cx="16.5" cy="12.5" r="1.4" fill="currentColor" stroke="none" />
          </>
        )}
        {icon === 'truck' && (
          <>
            <rect x="2" y="7" width="11" height="9" rx="1.5" strokeLinejoin="round" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10h4l3 3v3h-7z"
            />
            <circle cx="6" cy="18" r="1.6" />
            <circle cx="17" cy="18" r="1.6" />
          </>
        )}
        {icon === 'badge' && (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14a4 4 0 10-4-4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 20a5 5 0 0114 0"
            />
          </>
        )}
      </svg>
      <h2
        style={{
          fontFamily: theme.fontFamily.display,
          fontSize: theme.fontSize.lg,
          fontWeight: theme.fontWeight.extrabold,
          color: theme.colors.textPrimary,
          margin: 0,
          letterSpacing: theme.letterSpacing.tight,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * ToggleRow — labeled toggle with hint
 * ────────────────────────────────────────────────────────────────── */
function ToggleRow({
  label,
  hint,
  on,
  onToggle,
}: {
  label: string;
  hint: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: theme.fontSize.md,
            fontWeight: theme.fontWeight.semibold,
            color: theme.colors.textPrimary,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: theme.fontSize.xs,
            color: theme.colors.textSecondary,
            marginTop: 2,
          }}
        >
          {hint}
        </span>
      </div>
      <Toggle on={on} onToggle={onToggle} label={label} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Toggle — 44×24 pill switch with sliding 18×18 white knob
 * ────────────────────────────────────────────────────────────────── */
function Toggle({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className="pressable sp-toggle"
      style={{
        position: 'relative',
        width: 44,
        height: 24,
        borderRadius: theme.radius.pill,
        background: on ? theme.colors.black : theme.colors.grey300,
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        flexShrink: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: theme.colors.white,
          boxShadow: theme.shadows.xs,
          transition: 'left 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * GatewayChip — 40×40 tinted square with inline SVG icon
 *  - variant='connected' → black bg / white icon (Stripe — connected)
 *  - variant='off'       → grey100 bg / grey600 icon (PayPal — off)
 * ────────────────────────────────────────────────────────────────── */
function GatewayChip({
  variant,
  icon,
}: {
  variant: 'connected' | 'off';
  icon: 'card' | 'wallet';
}) {
  const isOn = variant === 'connected';
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: theme.radius.md,
        background: isOn ? theme.colors.black : theme.colors.grey100,
        color: isOn ? theme.colors.white : theme.colors.grey600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        {icon === 'card' && (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" strokeLinejoin="round" />
            <line x1="3" y1="9.5" x2="21" y2="9.5" />
            <line x1="7" y1="14.5" x2="11" y2="14.5" strokeLinecap="round" />
          </>
        )}
        {icon === 'wallet' && (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7a2 2 0 012-2h12a2 2 0 012 2v0H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2V9"
            />
            <circle cx="16.5" cy="12.5" r="1.4" fill="currentColor" stroke="none" />
          </>
        )}
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * RoleRow — role avatar + title + hint + chevron
 *  - variant='admin' → black avatar / white monogram (Super Admin)
 *  - variant='mod'   → grey200 avatar / black monogram (Moderator)
 * ────────────────────────────────────────────────────────────────── */
function RoleRow({
  monogram,
  variant,
  title,
  hint,
  onTap,
}: {
  monogram: string;
  variant: 'admin' | 'mod';
  title: string;
  hint: string;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="pressable sp-role"
      style={{
        width: '100%',
        background: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${theme.colors.grey150}`,
        padding: theme.spacing.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, minWidth: 0 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background:
              variant === 'admin' ? theme.colors.black : theme.colors.grey200,
            color:
              variant === 'admin'
                ? theme.colors.white
                : theme.colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: theme.fontSize.xs,
            fontWeight: theme.fontWeight.extrabold,
            letterSpacing: theme.letterSpacing.wider,
            flexShrink: 0,
          }}
        >
          {monogram}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textPrimary,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: theme.fontSize.xs,
              color: theme.colors.textSecondary,
              marginTop: 2,
            }}
          >
            {hint}
          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke={theme.colors.textSecondary}
        strokeWidth="2"
        aria-hidden
        style={{ flexShrink: 0 }}
      >
        <polyline
          points="9 6 15 12 9 18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
