/**
 * AuthButtons.tsx — Shared button components for auth pages.
 *
 *  - PrimaryButton   → matte black CTA (Sign In, Create Account)
 *  - SecondaryButton → white with border (Continue with Google, Mobile)
 *  - LoadingSpinner  → small inline spinner for button loading state
 */

'use client';

import React from 'react';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

export interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  onClick,
  type = 'submit',
  loading = false,
  disabled = false,
  fullWidth = true,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      onClick={() => {
        if (isDisabled) return;
        haptic.medium();
        onClick?.();
      }}
      disabled={isDisabled}
      className="pressable-strong auth-primary-btn"
      style={{
        width: fullWidth ? '100%' : 'auto',
        minHeight: 48,
        padding: `clamp(14px, 3vw, 16px) ${theme.spacing.md}px`,
        background: isDisabled ? theme.colors.grey400 : theme.colors.black,
        color: theme.colors.white,
        border: 'none',
        borderRadius: theme.radius.button,
        fontFamily: theme.fontFamily.body,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        letterSpacing: theme.letterSpacing.normal,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        transition: 'background 200ms ease, transform 120ms ease',
        opacity: isDisabled ? 0.7 : 1,
        boxSizing: 'border-box',
      }}
    >
      {loading && <LoadingSpinner />}
      <span>{children}</span>
    </button>
  );
}

export interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function SecondaryButton({
  children,
  onClick,
  type = 'button',
  loading = false,
  disabled = false,
  icon,
}: SecondaryButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      onClick={() => {
        if (isDisabled) return;
        haptic.light();
        onClick?.();
      }}
      disabled={isDisabled}
      className="pressable auth-secondary-btn"
      style={{
        width: '100%',
        minHeight: 48,
        padding: `clamp(14px, 3vw, 16px) ${theme.spacing.md}px`,
        background: theme.colors.white,
        color: theme.colors.textPrimary,
        border: `1.5px solid ${theme.colors.grey300}`,
        borderRadius: theme.radius.button,
        fontFamily: theme.fontFamily.body,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        letterSpacing: theme.letterSpacing.normal,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.md,
        transition: 'background 180ms ease, border-color 180ms ease, transform 120ms ease',
        boxSizing: 'border-box',
      }}
    >
      {loading ? <LoadingSpinner /> : icon}
      <span>{children}</span>
    </button>
  );
}

export function LoadingSpinner({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `2px solid rgba(255,255,255,0.3)`,
        borderTopColor: theme.colors.white,
        borderRadius: '50%',
        animation: 'auth-spin 600ms linear infinite',
      }}
    />
  );
}

export function DarkLoadingSpinner({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `2px solid ${theme.colors.grey200}`,
        borderTopColor: theme.colors.textPrimary,
        borderRadius: '50%',
        animation: 'auth-spin 600ms linear infinite',
      }}
    />
  );
}

export function PrimaryLinkButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (disabled) return;
        haptic.medium();
        onClick?.();
      }}
      disabled={disabled}
      className="pressable-strong"
      style={{
        width: '100%',
        minHeight: 48,
        padding: `clamp(14px, 3vw, 16px) ${theme.spacing.md}px`,
        background: disabled ? theme.colors.grey400 : theme.colors.black,
        color: theme.colors.white,
        border: 'none',
        borderRadius: theme.radius.button,
        fontFamily: theme.fontFamily.body,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </button>
  );
}

export { pressableStyle };

export default {
  PrimaryButton,
  SecondaryButton,
  LoadingSpinner,
  DarkLoadingSpinner,
  PrimaryLinkButton,
};
