/**
 * TextField.tsx — Premium text input with floating-label style eyebrow,
 * focus ring, error state, and optional prefix (e.g. +91 for phone).
 *
 * Used by /login, /register, /forgot-password, /verify-otp for non-password
 * fields. Pairs with PasswordInput for password fields.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { theme } from '@/lib/mobile/theme/theme';

export interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'search' | 'url';
  autoComplete?: string;
  error?: string;
  prefix?: string; // e.g. "+91"
  suffix?: React.ReactNode;
  autoFocus?: boolean;
  maxLength?: number;
  required?: boolean;
  /** Right-aligned helper link (e.g. "Forgot?") */
  rightHelper?: React.ReactNode;
  /** Optional hint shown below input (only when no error) */
  hint?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  autoComplete,
  error,
  prefix,
  suffix,
  autoFocus = false,
  maxLength,
  required = true,
  rightHelper,
  hint,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
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
        className={`auth-tf-field ${focused ? 'is-focused' : ''} ${hasError ? 'has-error' : ''}`}
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
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {prefix && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: theme.spacing.lg,
              paddingRight: theme.spacing.sm,
              fontSize: theme.fontSize.body,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textPrimary,
              borderRight: `1px solid ${theme.colors.grey200}`,
              height: '100%',
              paddingTop: 0,
              paddingBottom: 0,
              flexShrink: 0,
            }}
          >
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          required={required}
          className="auth-tf-input"
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
          }}
        />
        {suffix}
      </div>

      {/* Error or hint */}
      {hasError ? (
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
      ) : hint ? (
        <div
          style={{
            marginTop: theme.spacing.sm,
            fontSize: theme.fontSize.caption,
            color: theme.colors.textTertiary,
          }}
        >
          {hint}
        </div>
      ) : null}

      <style jsx>{`
        .auth-tf-field.has-error {
          border-color: ${theme.colors.error} !important;
        }
        .auth-tf-input::placeholder {
          color: ${theme.colors.textSecondary};
          opacity: 0.65;
        }
        .auth-tf-input:-webkit-autofill {
          -webkit-text-fill-color: ${theme.colors.textPrimary};
          -webkit-box-shadow: 0 0 0 1000px ${theme.colors.white} inset;
        }
      `}</style>
    </div>
  );
}

export default TextField;
