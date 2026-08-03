'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { TextField } from '@/components/auth/TextField';
import { PrimaryButton, pressableStyle } from '@/components/auth/AuthButtons';
import { authService } from '@/lib/auth/authService';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';

/**
 * ForgotPasswordPage — Phase 31
 *
 * Flow:
 *  1. User enters email
 *  2. Click "Send Reset Link"
 *  3. Show success popup ("If an account exists, a reset link has been sent")
 *  4. Provide "Back to Login" link
 *
 * Security:
 *  - Don't leak whether email exists (same success message either way)
 *  - Rate-limit resend attempts (3 per hour via localStorage)
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(undefined);

    const check = authService.validators.email(email);
    if (!check.valid) {
      setEmailError(check.message);
      haptic.error();
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const result = authService.requestPasswordReset(email);
    setLoading(false);

    if (!result.ok) {
      setEmailError(result.error);
      haptic.error();
      return;
    }

    haptic.success();
    setSent(true);
    showToast('Password reset link sent');
  };

  if (!mounted) return null;

  if (sent) {
    return (
      <AuthShell
        layoutTitle="Forgot Password"
        eyebrow="Account Recovery"
        headline="Check Your Email"
        subtext="If an account exists for the email you entered, we've sent a password reset link. Please check your inbox and spam folder."
        footer={
          <>
            Remember your password?{' '}
            <Link
              href="/login"
              className="pressable"
              onPointerDown={() => haptic.light()}
              style={{
                color: theme.colors.textPrimary,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'underline',
              }}
            >
              Back to Login
            </Link>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: `${theme.spacing.xl}px 0` }}>
          {/* Animated check icon */}
          <div
            style={{
              width: 72,
              height: 72,
              margin: '0 auto',
              borderRadius: '50%',
              background: 'rgba(20, 83, 45, 0.08)',
              border: `2px solid ${theme.colors.success}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fp-pop 480ms cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="36"
              height="36"
              fill="none"
              stroke={theme.colors.success}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.xxl,
              fontFamily: theme.fontFamily.body,
              lineHeight: theme.lineHeight.body,
            }}
          >
            Reset link sent to
            <br />
            <strong style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeight.semibold }}>
              {email}
            </strong>
          </p>

          <button
            type="button"
            onClick={() => {
              haptic.light();
              router.push('/login');
            }}
            className="pressable"
            style={{
              marginTop: theme.spacing.xxl,
              background: 'transparent',
              border: 'none',
              color: theme.colors.textPrimary,
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.semibold,
              cursor: 'pointer',
              padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
              fontFamily: theme.fontFamily.body,
            }}
          >
            ← Back to Login
          </button>
        </div>

        <style jsx>{pressableStyle}</style>
        <style jsx>{`
          @keyframes fp-pop {
            0% { transform: scale(0.3); opacity: 0; }
            60% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      layoutTitle="Forgot Password"
      eyebrow="Account Recovery"
      headline="Forgot Password"
      subtext="Enter your registered email address and we'll send you a link to reset your password."
      footer={
        <>
          Remember your password?{' '}
          <Link
            href="/login"
            className="pressable"
            onPointerDown={() => haptic.light()}
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeight.bold,
              textDecoration: 'underline',
            }}
          >
            Back to Login
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleReset}
        style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}
      >
        <TextField
          id="forgot-email"
          label="Email Address"
          value={email}
          onChange={(v) => {
            setEmail(v);
            if (emailError) setEmailError(undefined);
          }}
          placeholder="you@example.com"
          type="email"
          inputMode="email"
          autoComplete="email"
          error={emailError}
          autoFocus
          hint="We'll send a reset link to this email address"
        />

        <PrimaryButton type="submit" loading={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </PrimaryButton>
      </form>

      <style jsx>{pressableStyle}</style>
    </AuthShell>
  );
}
