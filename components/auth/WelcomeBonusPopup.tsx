/**
 * WelcomeBonusPopup.tsx — Modal popup shown on first-time signup.
 *
 * Triggered when authService reports `welcomeBonusCredited: true`.
 *
 * Design:
 *  - Centered modal with backdrop scrim
 *  - Premium card: 28px radius, soft shadow, confetti emoji header
 *  - "₹50 Welcome Bonus has been added to your wallet"
 *  - Animated number counter
 *  - "Continue Shopping" CTA → /profile (where wallet is shown)
 */

'use client';

import React, { useEffect, useState } from 'react';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { WELCOME_BONUS_AMOUNT } from '@/lib/auth/authService';

export interface WelcomeBonusPopupProps {
  open: boolean;
  amount?: number;
  onClose: () => void;
  onContinue: () => void;
}

export function WelcomeBonusPopup({
  open,
  amount = WELCOME_BONUS_AMOUNT,
  onClose,
  onContinue,
}: WelcomeBonusPopupProps) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [visible, setVisible] = useState(false);

  // Trigger haptic + animation when opened
  useEffect(() => {
    if (open) {
      haptic.success();
      // Smooth number counter animation (0 → amount over 800ms)
      const start = Date.now();
      const duration = 900;
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayAmount(Math.round(eased * amount));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      // Fade in
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      setDisplayAmount(0);
    }
  }, [open, amount]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-bonus-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(17,17,17,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
        opacity: visible ? 1 : 0,
        transition: 'opacity 280ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="welcome-bonus-card"
        style={{
          width: '100%',
          maxWidth: 380,
          background: theme.colors.white,
          borderRadius: theme.radius.largeCard,
          padding: `clamp(24px, 5vw, 28px) clamp(20px, 4vw, 24px) clamp(20px, 4vw, 24px)`,
          textAlign: 'center',
          boxShadow: theme.shadows.xxl,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          transition: 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Decorative top accent */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.colors.black}, ${theme.colors.grey700}, ${theme.colors.black})`,
          }}
        />

        {/* Confetti / gift emoji */}
        <div
          style={{
            fontSize: 52,
            lineHeight: 1,
            marginBottom: theme.spacing.md,
            animation: 'welcome-pop 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          🎉
        </div>

        {/* Headline */}
        <h2
          id="welcome-bonus-title"
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: 22,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: `0 0 ${theme.spacing.sm}px`,
            letterSpacing: theme.letterSpacing.tight,
            lineHeight: theme.lineHeight.tight,
          }}
        >
          Welcome to LNKICKS!
        </h2>

        <p
          style={{
            fontSize: theme.fontSize.md,
            color: theme.colors.textSecondary,
            margin: `0 0 ${theme.spacing.xxl}px`,
            fontFamily: theme.fontFamily.body,
            lineHeight: theme.lineHeight.body,
          }}
        >
          ₹{displayAmount} Welcome Bonus has been added to your wallet.
        </p>

        {/* Wallet badge */}
        <div
          style={{
            background: theme.colors.offWhite,
            border: `1px solid ${theme.colors.grey200}`,
            borderRadius: theme.radius.lg,
            padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
            marginBottom: theme.spacing.xxl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <span style={{ fontSize: 20 }}>💰</span>
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textTertiary,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Wallet Balance
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                lineHeight: 1.1,
                fontFamily: theme.fontFamily.display,
              }}
            >
              ₹{displayAmount}
            </div>
          </div>
        </div>

        {/* Continue button */}
        <button
          type="button"
          onClick={() => {
            haptic.medium();
            onContinue();
          }}
          className="pressable-strong"
          style={{
            width: '100%',
            padding: `${theme.spacing.lg - 2}px ${theme.spacing.md}px`,
            background: theme.colors.black,
            color: theme.colors.white,
            border: 'none',
            borderRadius: theme.radius.button,
            fontFamily: theme.fontFamily.body,
            fontSize: theme.fontSize.md,
            fontWeight: theme.fontWeight.semibold,
            letterSpacing: theme.letterSpacing.normal,
            cursor: 'pointer',
          }}
        >
          Continue Shopping
        </button>

        <button
          type="button"
          onClick={onClose}
          className="pressable"
          style={{
            background: 'transparent',
            border: 'none',
            color: theme.colors.textTertiary,
            fontSize: theme.fontSize.caption,
            fontFamily: theme.fontFamily.body,
            cursor: 'pointer',
            marginTop: theme.spacing.md,
            padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
          }}
        >
          Maybe later
        </button>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        @keyframes welcome-pop {
          0% { transform: scale(0.3) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(8deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .pressable-strong:active {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  );
}

export default WelcomeBonusPopup;
