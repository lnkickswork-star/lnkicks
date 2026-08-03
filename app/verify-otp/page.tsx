'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { TextField } from '@/components/auth/TextField';
import { PrimaryButton, pressableStyle } from '@/components/auth/AuthButtons';
import { WelcomeBonusPopup } from '@/components/auth/WelcomeBonusPopup';
import { authService } from '@/lib/auth/authService';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';

/**
 * VerifyOtpPage — Phase 31 Mobile OTP Login Flow
 *
 * Flow:
 *  1. User enters mobile number (+91 prefix, 10 digits)
 *  2. Click "Send OTP" → 6-digit OTP generated, stored with 60s expiry
 *     Demo OTP is 123456 (shown via toast so the user can complete the flow)
 *  3. OTP entry screen — 6 separate input boxes, auto-advance on input
 *  4. 60s countdown timer; "Resend OTP" enabled when timer hits 0
 *  5. Verify → on success, login or create new account
 *  6. If new user → ₹50 Welcome Bonus popup → /profile
 *  7. If existing user → /profile
 *
 * Security:
 *  - OTP expiry: 60 seconds
 *  - Resend cooldown: 60 seconds
 *  - Max attempts: 5 (then OTP invalidated)
 */
type Step = 'phone' | 'otp' | 'name';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [nameError, setNameError] = useState<string | undefined>();
  const [otpError, setOtpError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  // Countdown timer
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [bonusOpen, setBonusOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Redirect if already logged in
  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session) router.replace('/profile');
  }, [router]);

  // Countdown effect
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const formatPhoneDisplay = (p: string) => {
    const digits = p.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    return digits.slice(0, 5) + ' ' + digits.slice(5);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(undefined);

    const check = authService.validators.phone(phone);
    if (!check.valid) {
      setPhoneError(check.message);
      haptic.error();
      return;
    }

    // Check if existing user — if yes, skip name step; if no, will ask name after OTP
    const existing = authService.findUserByPhone(phone);
    if (!existing && !name) {
      // New user — go to name step first
      setStep('name');
      return;
    }

    setSendLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = authService.sendOtp(phone);
    setSendLoading(false);

    if (!result.ok) {
      setPhoneError(result.error);
      haptic.error();
      return;
    }

    haptic.success();
    setSecondsLeft(authService.OTP_EXPIRY_SECONDS);
    setStep('otp');

    // Show demo OTP in toast so the user can complete the flow
    if (result.demoCode) {
      showToast(`Demo OTP: ${result.demoCode}`);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(undefined);

    if (!name.trim()) {
      setNameError('Please enter your name to continue');
      haptic.error();
      return;
    }

    const check = authService.validators.name(name);
    if (!check.valid) {
      setNameError(check.message);
      haptic.error();
      return;
    }

    setSendLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = authService.sendOtp(phone);
    setSendLoading(false);

    if (!result.ok) {
      setNameError(result.error);
      haptic.error();
      return;
    }

    haptic.success();
    setSecondsLeft(authService.OTP_EXPIRY_SECONDS);
    setStep('otp');

    if (result.demoCode) {
      showToast(`Demo OTP: ${result.demoCode}`);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);

    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit) {
      haptic.selection();
      // Auto-advance to next input
      if (index < 5 && otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }

    if (otpError) setOtpError(undefined);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      otpInputRefs.current[index - 1]?.focus();
      const next = [...otp];
      next[index - 1] = '';
      setOtp(next);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const next = pasted.split('').concat(Array(6 - pasted.length).fill(''));
      setOtp(next);
      // Focus the last filled input or next empty one
      const focusIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[focusIdx]?.focus();
      haptic.selection();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(undefined);

    const code = otp.join('');
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits');
      haptic.error();
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const result = authService.verifyOtp(phone, code, name || undefined);
    setLoading(false);

    if (!result.ok || !result.session) {
      setOtpError(result.error);
      haptic.error();
      return;
    }

    haptic.success();
    showToast(`Welcome${result.result?.isNewUser ? ' to LNKICKS' : ' back'}, ${result.session.name.split(' ')[0]}!`);

    if (result.result?.welcomeBonusCredited) {
      setBonusOpen(true);
    } else {
      router.push('/profile');
    }
  };

  const handleResendOtp = async () => {
    if (secondsLeft > 0) return;
    setOtpError(undefined);
    setSendLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = authService.sendOtp(phone);
    setSendLoading(false);

    if (!result.ok) {
      setOtpError(result.error);
      haptic.error();
      return;
    }

    haptic.success();
    setSecondsLeft(authService.OTP_EXPIRY_SECONDS);
    setOtp(['', '', '', '', '', '']);
    otpInputRefs.current[0]?.focus();

    if (result.demoCode) {
      showToast(`Demo OTP: ${result.demoCode}`);
    }
  };

  const handleChangeNumber = () => {
    haptic.light();
    setStep('phone');
    setOtp(['', '', '', '', '', '']);
    setOtpError(undefined);
    setSecondsLeft(0);
  };

  if (!mounted) return null;

  // ─── PHONE STEP ──────────────────────────────────────────────
  if (step === 'phone') {
    return (
      <AuthShell
        layoutTitle="Mobile Login"
        eyebrow="OTP Verification"
        headline="Continue with Mobile"
        subtext="Enter your mobile number and we'll send you a one-time password to verify."
        footer={
          <>
            Prefer another method?{' '}
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
              Sign in with Email
            </Link>
          </>
        }
      >
        <form
          onSubmit={handleSendOtp}
          style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg, maxWidth: '100%', boxSizing: 'border-box' }}
        >
          <TextField
            id="otp-phone"
            label="Mobile Number"
            value={phone}
            onChange={(v) => {
              setPhone(v);
              if (phoneError) setPhoneError(undefined);
            }}
            placeholder="98765 43210"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            prefix="+91"
            maxLength={10}
            error={phoneError}
            autoFocus
            hint="We'll send a 6-digit code via SMS"
          />

          <PrimaryButton type="submit" loading={sendLoading}>
            {sendLoading ? 'Sending OTP...' : 'Send OTP'}
          </PrimaryButton>
        </form>

        <style jsx>{pressableStyle}</style>
      </AuthShell>
    );
  }

  // ─── NAME STEP (new user only) ───────────────────────────────
  if (step === 'name') {
    return (
      <AuthShell
        layoutTitle="Mobile Login"
        eyebrow="New Member"
        headline="What's Your Name?"
        subtext={`We don't have an account for ${formatPhoneDisplay(phone)} yet. Tell us your name to create one and get ₹50 welcome bonus.`}
        footer={
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleChangeNumber}
              className="pressable"
              onPointerDown={() => haptic.light()}
              style={{
                background: 'transparent',
                border: 'none',
                color: theme.colors.textPrimary,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.md,
                padding: 0,
              }}
            >
              Use a different number
            </button>
          </>
        }
      >
        <form
          onSubmit={handleNameSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg, maxWidth: '100%', boxSizing: 'border-box' }}
        >
          <TextField
            id="otp-name"
            label="Full Name"
            value={name}
            onChange={(v) => {
              setName(v);
              if (nameError) setNameError(undefined);
            }}
            placeholder="John Doe"
            autoComplete="name"
            error={nameError}
            autoFocus
          />

          <PrimaryButton type="submit" loading={sendLoading}>
            {sendLoading ? 'Sending OTP...' : 'Continue'}
          </PrimaryButton>
        </form>

        <style jsx>{pressableStyle}</style>
      </AuthShell>
    );
  }

  // ─── OTP STEP ────────────────────────────────────────────────
  return (
    <>
      <AuthShell
        layoutTitle="Verify OTP"
        eyebrow="OTP Verification"
        headline="Enter Verification Code"
        subtext={`We sent a 6-digit code to +91 ${formatPhoneDisplay(phone)}`}
        footer={
          <>
            Wrong number?{' '}
            <button
              type="button"
              onClick={handleChangeNumber}
              className="pressable"
              onPointerDown={() => haptic.light()}
              style={{
                background: 'transparent',
                border: 'none',
                color: theme.colors.textPrimary,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.md,
                padding: 0,
              }}
            >
              Change
            </button>
          </>
        }
      >
        <form
          onSubmit={handleVerify}
          style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg, maxWidth: '100%', boxSizing: 'border-box' }}
        >
          {/* OTP input boxes */}
          <div
            onPaste={handleOtpPaste}
            style={{
              display: 'flex',
              gap: 'clamp(6px, 2vw, 10px)',
              justifyContent: 'center',
              marginBottom: theme.spacing.md,
              flexWrap: 'nowrap',
            }}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { otpInputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                aria-label={`OTP digit ${i + 1}`}
                className="otp-box"
                style={{
                  width: 'clamp(36px, 11vw, 48px)',
                  height: 'clamp(44px, 13vw, 54px)',
                  textAlign: 'center',
                  fontSize: 'clamp(18px, 5vw, 22px)',
                  fontWeight: theme.fontWeight.bold,
                  fontFamily: theme.fontFamily.display,
                  color: theme.colors.textPrimary,
                  background: theme.colors.white,
                  border: `1.5px solid ${otpError ? theme.colors.error : digit ? theme.colors.black : theme.colors.grey300}`,
                  borderRadius: theme.radius.md,
                  outline: 'none',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease',
                  caretColor: theme.colors.black,
                  boxSizing: 'border-box',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Error message */}
          {otpError && (
            <div
              role="alert"
              style={{
                textAlign: 'center',
                fontSize: theme.fontSize.caption,
                color: theme.colors.error,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
              </svg>
              {otpError}
            </div>
          )}

          {/* Countdown / Resend */}
          <div
            style={{
              textAlign: 'center',
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              fontFamily: theme.fontFamily.body,
            }}
          >
            {secondsLeft > 0 ? (
              <>
                Resend OTP in{' '}
                <strong style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeight.semibold }}>
                  0:{secondsLeft.toString().padStart(2, '0')}
                </strong>
              </>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={sendLoading}
                className="pressable"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: sendLoading ? theme.colors.textTertiary : theme.colors.textPrimary,
                  fontSize: theme.fontSize.md,
                  fontWeight: theme.fontWeight.semibold,
                  cursor: sendLoading ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  fontFamily: theme.fontFamily.body,
                  padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                }}
              >
                {sendLoading ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <PrimaryButton type="submit" loading={loading}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
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
        .otp-box:focus {
          border-color: ${theme.colors.black} !important;
          box-shadow: 0 0 0 3px ${theme.colors.focusRing};
        }
      `}</style>
    </>
  );
}
