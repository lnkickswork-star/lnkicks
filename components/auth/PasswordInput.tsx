/**
 * PasswordInput.tsx — Premium password field with show/hide eye toggle
 * and optional strength meter.
 *
 * Features:
 *  - Floating-label style eyebrow label
 *  - Eye icon button inside the field (right side)
 *  - Smooth icon crossfade on toggle (200ms)
 *  - Optional strength meter (4 bars: weak/fair/good/strong)
 *  - Error state with red border + helper text
 *  - Haptic feedback on toggle
 *  - Token-driven styling — matches existing auth input recipe.
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { validators } from '@/lib/auth/authService';

export interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  showStrength?: boolean;
  error?: string;
  /** Toggle right-aligned helper link (e.g. "Forgot?") */
  rightHelper?: React.ReactNode;
  autoFocus?: boolean;
  required?: boolean;
}

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = [
  theme.colors.grey300,
  '#DC2626', // red-600
  '#F59E0B', // amber-500
  '#3B82F6', // blue-500 (kept subtle, used only here for strength)
  '#16A34A', // green-600
];

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter your password',
  autoComplete = 'current-password',
  showStrength = false,
  error,
  rightHelper,
  autoFocus = false,
  required = true,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleVisibility = useCallback(() => {
    haptic.selection();
    setVisible((v) => !v);
  }, []);

  // Strength calculation
  const strength = React.useMemo(() => {
    if (!showStrength || !value) return 0;
    return validators.password(value).strength;
  }, [value, showStrength]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Slight delay to ensure mount + scroll into view
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  const hasError = !!error;
  const borderColor = hasError
    ? theme.colors.error
    : focused
      ? theme.colors.black
      : theme.colors.grey300;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.sm - 2,
        }}
      >
        <label
          htmlFor={id}
          style={{
            fontSize: theme.fontSize.sm,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textSecondary,
            letterSpacing: theme.letterSpacing.wider,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </label>
        {rightHelper}
      </div>

      <div
        className={`auth-pw-field ${focused ? 'is-focused' : ''} ${hasError ? 'has-error' : ''}`}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: theme.colors.white,
          border: `1.5px solid ${borderColor}`,
          borderRadius: theme.radius.lg,
          transition: 'border-color 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: focused ? `0 0 0 3px ${theme.colors.focusRing}` : 'none',
          overflow: 'hidden',
        }}
      >
        <input
          ref={inputRef}
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="auth-pw-input"
          style={{
            flex: 1,
            minWidth: 0,
            padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
            fontSize: theme.fontSize.body,
            fontFamily: theme.fontFamily.body,
            color: theme.colors.textPrimary,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            letterSpacing: visible ? 'normal' : '0.08em',
            transition: 'letter-spacing 200ms ease',
          }}
        />

        {/* Eye toggle button */}
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="pressable auth-pw-toggle"
          style={{
            flexShrink: 0,
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: theme.colors.textSecondary,
            cursor: 'pointer',
            marginRight: 4,
          }}
        >
          <EyeIcon visible={visible} />
        </button>
      </div>

      {/* Strength meter */}
      {showStrength && value && (
        <div
          style={{
            marginTop: theme.spacing.sm,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <div style={{ display: 'flex', gap: 4, flex: 1 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: i <= strength ? STRENGTH_COLORS[strength] : theme.colors.grey200,
                  transition: 'background 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: theme.fontWeight.semibold,
              color: strength > 0 ? STRENGTH_COLORS[strength] : theme.colors.textTertiary,
              minWidth: 50,
              textAlign: 'right',
            }}
          >
            {STRENGTH_LABELS[strength]}
          </span>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div
          style={{
            marginTop: theme.spacing.sm,
            fontSize: theme.fontSize.caption,
            color: theme.colors.error,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
          </svg>
          {error}
        </div>
      )}

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .auth-pw-field.has-error {
          border-color: ${theme.colors.error} !important;
        }
        .auth-pw-input::placeholder {
          color: ${theme.colors.textTertiary};
          letter-spacing: normal;
        }
        .auth-pw-input:-webkit-autofill {
          -webkit-text-fill-color: ${theme.colors.textPrimary};
          -webkit-box-shadow: 0 0 0 1000px ${theme.colors.white} inset;
        }
      `}</style>
    </div>
  );
}

// ── Eye icon (open / closed) ──────────────────────────────────────────
function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'opacity 200ms ease, transform 200ms ease',
        opacity: visible ? 0 : 1,
        position: visible ? 'absolute' : 'static',
      }}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default PasswordInput;
