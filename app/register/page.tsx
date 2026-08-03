'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { TextField } from '@/components/auth/TextField';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PrimaryButton, pressableStyle } from '@/components/auth/AuthButtons';
import { WelcomeBonusPopup } from '@/components/auth/WelcomeBonusPopup';
import { authService } from '@/lib/auth/authService';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';

/**
 * RegisterPage — Phase 31 Premium Signup
 *
 * Fields (per spec):
 *  - First Name        (required)
 *  - Last Name         (required)
 *  - Email             (required, validated)
 *  - Mobile Number     (required, 10-digit IN)
 *  - Password          (required, strength meter, eye toggle)
 *  - Confirm Password  (required, must match)
 *  - Referral Code     (optional, 4-12 alphanumeric)
 *  - Terms checkbox    (required: "I agree to Terms & Privacy Policy")
 *
 * Bonus:
 *  - ₹50 Welcome Bonus credited ONLY on first-time signup
 *  - Show popup: "🎉 Welcome to LNKICKS! ₹50 Welcome Bonus has been added to your wallet."
 *  - Existing users cannot trigger bonus (caught by authService.signupWithEmail duplicate check)
 *
 * UX:
 *  - Per-field validation (show error on blur or on submit)
 *  - Password strength meter (4 bars: weak/fair/good/strong)
 *  - Confirm password match indicator
 *  - Loading state on submit
 *  - Haptic feedback
 *  - Safe-area aware, mobile-first
 */
export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [bonusOpen, setBonusOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Redirect if already logged in
  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session) {
      router.replace('/profile');
    }
  }, [router]);

  const setField = (field: string, value: string) => {
    switch (field) {
      case 'firstName': setFirstName(value); break;
      case 'lastName': setLastName(value); break;
      case 'email': setEmail(value); break;
      case 'phone': setPhone(value); break;
      case 'password': setPassword(value); break;
      case 'confirmPassword': setConfirmPassword(value); break;
      case 'referralCode': setReferralCode(value); break;
    }
    // Clear that field's error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateAll = (): boolean => {
    const next: Record<string, string> = {};

    const fn = authService.validators.name(firstName);
    if (!fn.valid) next.firstName = fn.message!;

    if (lastName) {
      const ln = authService.validators.name(lastName);
      if (!ln.valid) next.lastName = ln.message!;
    }

    const em = authService.validators.email(email);
    if (!em.valid) next.email = em.message!;

    const ph = authService.validators.phone(phone);
    if (!ph.valid) next.phone = ph.message!;

    const pw = authService.validators.password(password);
    if (!pw.valid) next.password = pw.message!;

    if (confirmPassword !== password) {
      next.confirmPassword = 'Passwords do not match';
    } else if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your password';
    }

    if (referralCode) {
      const rc = authService.validators.referralCode(referralCode);
      if (!rc.valid) next.referralCode = rc.message!;
    }

    if (!agreeTerms) {
      next.terms = 'Please accept the Terms & Privacy Policy to continue';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) {
      haptic.error();
      return;
    }

    setLoading(true);

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 900));

    const result = authService.signupWithEmail({
      firstName,
      lastName,
      email,
      phone,
      password,
      referralCode: referralCode || undefined,
    });

    setLoading(false);

    if (!result.ok) {
      // Surface the error — could be duplicate email/phone
      const err = result.error;
      if (err.toLowerCase().includes('email')) {
        setErrors((p) => ({ ...p, email: err }));
      } else if (err.toLowerCase().includes('mobile') || err.toLowerCase().includes('phone')) {
        setErrors((p) => ({ ...p, phone: err }));
      } else {
        setErrors((p) => ({ ...p, form: err }));
      }
      haptic.error();
      return;
    }

    haptic.success();
    showToast(`Welcome to LNKICKS, ${result.session.name.split(' ')[0]}!`);

    // Show welcome bonus popup (signup always credits bonus for new users)
    if (result.result.welcomeBonusCredited) {
      setBonusOpen(true);
    } else {
      router.push('/profile');
    }
  };

  if (!mounted) return null;

  // Password match indicator
  const confirmMatch = confirmPassword.length > 0 && confirmPassword === password;

  return (
    <>
      <AuthShell
        layoutTitle="Register"
        eyebrow="Join LNKICKS"
        headline="Create Account"
        subtext="Sign up to get exclusive drops, faster checkout, and a ₹50 welcome bonus in your wallet."
        footer={
          <>
            Already have an account?{' '}
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
              Sign In
            </Link>
          </>
        }
      >
        <form
          onSubmit={handleRegister}
          style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg, maxWidth: '100%', boxSizing: 'border-box' }}
        >
          {/* First Name + Last Name */}
          <div className="auth-name-row" style={{ display: 'grid', gap: theme.spacing.md }}>
            <TextField
              id="register-firstName"
              label="First Name"
              value={firstName}
              onChange={(v) => setField('firstName', v)}
              placeholder="John"
              autoComplete="given-name"
              error={errors.firstName}
              autoFocus
            />
            <TextField
              id="register-lastName"
              label="Last Name"
              value={lastName}
              onChange={(v) => setField('lastName', v)}
              placeholder="Doe"
              autoComplete="family-name"
              error={errors.lastName}
            />
          </div>

          {/* Email */}
          <TextField
            id="register-email"
            label="Email Address"
            value={email}
            onChange={(v) => setField('email', v)}
            placeholder="you@example.com"
            type="email"
            inputMode="email"
            autoComplete="email"
            error={errors.email}
          />

          {/* Mobile */}
          <TextField
            id="register-phone"
            label="Mobile Number"
            value={phone}
            onChange={(v) => setField('phone', v)}
            placeholder="98765 43210"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            prefix="+91"
            maxLength={10}
            error={errors.phone}
            hint="We'll send you a verification code via SMS"
          />

          {/* Password */}
          <PasswordInput
            id="register-password"
            label="Password"
            value={password}
            onChange={(v) => setField('password', v)}
            placeholder="Create a strong password"
            autoComplete="new-password"
            showStrength
            error={errors.password}
          />

          {/* Confirm Password */}
          <PasswordInput
            id="register-confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(v) => setField('confirmPassword', v)}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />

          {/* Match indicator */}
          {confirmMatch && !errors.confirmPassword && (
            <div
              style={{
                marginTop: -theme.spacing.sm,
                fontSize: theme.fontSize.caption,
                color: theme.colors.success,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Passwords match
            </div>
          )}

          {/* Referral Code */}
          <TextField
            id="register-referralCode"
            label="Referral Code"
            value={referralCode}
            onChange={(v) => setField('referralCode', v)}
            placeholder="Optional — e.g. JOHN4A2B"
            error={errors.referralCode}
            required={false}
            hint="Earn extra rewards when your friends shop too"
          />

          {/* Welcome bonus hint */}
          <div
            style={{
              background: 'rgba(20, 83, 45, 0.06)',
              border: '1px solid rgba(20, 83, 45, 0.18)',
              borderRadius: theme.radius.md,
              padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
          >
            <span style={{ fontSize: 22 }}>🎁</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: theme.fontSize.md,
                  fontWeight: theme.fontWeight.semibold,
                  color: theme.colors.success,
                  fontFamily: theme.fontFamily.body,
                }}
              >
                ₹50 Welcome Bonus
              </div>
              <div
                style={{
                  fontSize: theme.fontSize.caption,
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fontFamily.body,
                  marginTop: 2,
                }}
              >
                Credited to your wallet on signup — use it on your first order.
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: theme.spacing.sm,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                haptic.selection();
                setAgreeTerms(e.target.checked);
                if (errors.terms) {
                  setErrors((p) => {
                    const next = { ...p };
                    delete next.terms;
                    return next;
                  });
                }
              }}
              style={{
                width: 18,
                height: 18,
                accentColor: theme.colors.black,
                cursor: 'pointer',
                marginTop: 2,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: theme.fontSize.md,
                color: theme.colors.textSecondary,
                fontFamily: theme.fontFamily.body,
                lineHeight: theme.lineHeight.body,
              }}
            >
              I agree to the{' '}
              <Link
                href="/terms-conditions"
                className="pressable"
                style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeight.semibold, textDecoration: 'underline' }}
              >
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy-policy"
                className="pressable"
                style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeight.semibold, textDecoration: 'underline' }}
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          {errors.terms && (
            <div
              role="alert"
              style={{
                marginTop: -theme.spacing.sm,
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
              {errors.terms}
            </div>
          )}

          {errors.form && (
            <div
              role="alert"
              style={{
                background: 'rgba(127, 29, 29, 0.06)',
                border: '1px solid rgba(127, 29, 29, 0.18)',
                borderRadius: theme.radius.md,
                padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                fontSize: theme.fontSize.md,
                color: theme.colors.error,
                fontFamily: theme.fontFamily.body,
              }}
            >
              {errors.form}
            </div>
          )}

          <PrimaryButton type="submit" loading={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </PrimaryButton>
        </form>
      </AuthShell>

      <WelcomeBonusPopup
        open={bonusOpen}
        onClose={() => {
          setBonusOpen(false);
          router.push('/profile');
        }}
        onContinue={() => {
          setBonusOpen(false);
          router.push('/profile');
        }}
      />

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .auth-name-row {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        }
        @media (max-width: 380px) {
          .auth-name-row {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </>
  );
}
