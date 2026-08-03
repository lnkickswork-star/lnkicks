'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { TextField } from '@/components/auth/TextField';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { ORDivider } from '@/components/auth/ORDivider';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { PrimaryButton, SecondaryButton, pressableStyle } from '@/components/auth/AuthButtons';
import { WelcomeBonusPopup } from '@/components/auth/WelcomeBonusPopup';
import { authService } from '@/lib/auth/authService';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';

/**
 * LoginPage — Phase 31 Premium Authentication
 *
 * Three login methods:
 *  1. Email + Password (with eye toggle, Remember Me, Forgot Password)
 *  2. Continue with Google (mock Firebase Google Auth)
 *  3. Continue with Mobile Number (OTP) → routes to /verify-otp
 *
 * Premium UX:
 *  - Floating-label eyebrow inputs
 *  - Eye toggle on password (200ms crossfade)
 *  - Loading spinner on Sign In (button disabled while loading)
 *  - Haptic feedback on every interaction
 *  - Error messages with icon + red border
 *  - "OR" divider between email and social login (Google-style)
 *  - Welcome Bonus popup if first-time Google login credits ₹50
 *  - Safe-area-aware, mobile-first, no overflow
 *
 * Button order (per spec):
 *   Email → Password (eye) → Forgot Password → Sign In →
 *   OR divider → Continue with Google → Continue with Mobile →
 *   Create Account link
 */
export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Welcome bonus popup state
  const [bonusOpen, setBonusOpen] = useState(false);

  // Hydration safety — only render after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Load remembered email
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedEmail = localStorage.getItem('lnk_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session) {
      router.replace('/profile');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);

    // Validate email
    const emailCheck = authService.validators.email(email);
    if (!emailCheck.valid) {
      setEmailError(emailCheck.message);
      haptic.error();
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      haptic.error();
      return;
    }

    setLoading(true);

    // Simulate network latency for premium feel (real Firebase call would be async)
    await new Promise((r) => setTimeout(r, 700));

    const result = authService.loginWithEmail(email, password);
    setLoading(false);

    if (!result.ok) {
      setFormError(result.error);
      haptic.error();
      return;
    }

    // Persist "Remember Me"
    if (rememberMe) {
      localStorage.setItem('lnk_remember_email', email);
    } else {
      localStorage.removeItem('lnk_remember_email');
    }

    haptic.success();
    showToast(`Welcome back, ${result.session.name.split(' ')[0]}!`);

    // Existing user → no bonus popup, just go to profile
    router.push('/profile');
  };

  const handleGoogleLogin = async () => {
    setFormError(undefined);
    setGoogleLoading(true);

    await new Promise((r) => setTimeout(r, 900));

    /**
     * MOCK Google Auth — simulates the user picking a Google account.
     * In production, replace with:
     *   const provider = new firebase.auth.GoogleAuthProvider();
     *   const cred = await firebase.auth().signInWithPopup(provider);
     *   const user = cred.user;
     *   authService.loginWithGoogle({ name: user.displayName, email: user.email, avatar: user.photoURL });
     *
     * For demo, we use a fixed test Google identity the user can override
     * later by registering with their real email.
     */
    const mockGoogleUser = {
      name: 'Demo Google User',
      email: 'demo.google@gmail.com',
    };

    const result = authService.loginWithGoogle(mockGoogleUser);
    setGoogleLoading(false);

    if (!result.ok) {
      setFormError(result.error);
      haptic.error();
      return;
    }

    haptic.success();
    showToast(`Signed in as ${result.session.name}`);

    if (result.result.isNewUser && result.result.welcomeBonusCredited) {
      // Show welcome bonus popup, then route to profile on close
      setBonusOpen(true);
    } else {
      router.push('/profile');
    }
  };

  const handleMobileOtp = () => {
    haptic.light();
    router.push('/verify-otp');
  };

  if (!mounted) return null;

  return (
    <>
      <AuthShell
        layoutTitle="Login"
        eyebrow="Members Portal"
        headline="Welcome Back"
        subtext="Sign in to your LNKICKS account to access orders, wishlist, and faster checkout."
        footer={
          <>
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="pressable"
              onPointerDown={() => haptic.light()}
              style={{
                color: theme.colors.textPrimary,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'underline',
              }}
            >
              Create Account
            </Link>
          </>
        }
      >
        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}
        >
          <TextField
            id="login-email"
            label="Email Address"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (emailError) setEmailError(undefined);
              if (formError) setFormError(undefined);
            }}
            placeholder="you@example.com"
            type="email"
            inputMode="email"
            autoComplete="email"
            error={emailError}
            autoFocus
          />

          <PasswordInput
            id="login-password"
            label="Password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              if (passwordError) setPasswordError(undefined);
              if (formError) setFormError(undefined);
            }}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={passwordError}
            rightHelper={
              <Link
                href="/forgot-password"
                className="pressable"
                onPointerDown={() => haptic.light()}
                style={{
                  fontSize: theme.fontSize.sm,
                  color: theme.colors.textSecondary,
                  textDecoration: 'underline',
                }}
              >
                Forgot?
              </Link>
            }
          />

          {/* Remember Me */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => {
                haptic.selection();
                setRememberMe(e.target.checked);
              }}
              style={{
                width: 18,
                height: 18,
                accentColor: theme.colors.black,
                cursor: 'pointer',
              }}
            />
            <span
              style={{
                fontSize: theme.fontSize.md,
                color: theme.colors.textSecondary,
                fontFamily: theme.fontFamily.body,
              }}
            >
              Remember me on this device
            </span>
          </label>

          {/* Form-level error */}
          {formError && (
            <div
              role="alert"
              style={{
                background: 'rgba(127, 29, 29, 0.06)',
                border: `1px solid rgba(127, 29, 29, 0.18)`,
                borderRadius: theme.radius.md,
                padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                fontSize: theme.fontSize.md,
                color: theme.colors.error,
                display: 'flex',
                alignItems: 'flex-start',
                gap: theme.spacing.sm,
                fontFamily: theme.fontFamily.body,
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
              </svg>
              {formError}
            </div>
          )}

          <PrimaryButton type="submit" loading={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </PrimaryButton>
        </form>

        {/* OR divider */}
        <ORDivider />

        {/* Social login buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          <SecondaryButton
            onClick={handleGoogleLogin}
            loading={googleLoading}
            icon={<GoogleIcon size={18} />}
          >
            Continue with Google
          </SecondaryButton>

          <SecondaryButton
            onClick={handleMobileOtp}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="18" />
              </svg>
            }
          >
            Continue with Mobile Number
          </SecondaryButton>
        </div>
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
        @keyframes auth-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
