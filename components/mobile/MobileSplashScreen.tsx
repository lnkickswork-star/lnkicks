'use client';

/**
 * MobileSplashScreen — premium mobile-only splash / intro overlay for LN KICKS.
 *
 * INSPIRATION
 * -----------
 * User-provided Nike reference image: clean white canvas, two sneakers
 * placed diagonally (top-left + bottom-right), large vertical brand
 * wordmark in the center, "Start your sports journey" subheadline, and a
 * matte-black "Get Started →" pill CTA at the bottom. We replace NIKE with
 * LNKICKS and elevate the aesthetic to match Apple / Samsung / Google
 * onboarding screens.
 *
 * BEHAVIOR
 * --------
 * - Shown ONLY on the mobile homepage (mounted inside MobileHome).
 *   Desktop homepage is completely untouched.
 * - Shows once per browser session (sessionStorage flag).
 * - Auto-dismisses after 5.5s.
 * - User can dismiss early via the top-right "Skip →" link or the
 *   bottom "Enter Store →" CTA.
 * - 380ms ease-out fade when dismissing (Apple-style).
 * - Locks body scroll while visible.
 *
 * DESIGN
 * ------
 * - Pure white background with a barely-there radial gradient for depth.
 * - Top-left shoe: Air Jordan 1 Low Powder Blue (transparent PNG).
 * - Bottom-right shoe: Adidas Samba OG (transparent PNG).
 * - Center: Large horizontal "LNKICKS" wordmark with -0.04em tracking,
 *   matte-black, 700 weight. Below it: a 32px black underline + tagline.
 * - Bottom: Matte-black pill CTA "Enter Store →" with soft layered shadow.
 * - All animations are GPU-accelerated (transform/opacity only),
 *   staggered entrance over ~900ms, 60fps.
 *
 * ACCESSIBILITY
 * -------------
 * - role="dialog" aria-modal="true" aria-label="LN KICKS welcome"
 * - Skip button is keyboard-focusable.
 * - prefers-reduced-motion: disables entrance animation.
 * - Body scroll locked while splash is visible.
 */

import React, { useEffect, useRef, useState } from 'react';
import { theme } from '@/lib/mobile/theme/theme';
import { safeArea } from '@/lib/mobile/utils/safeArea';

const STORAGE_KEY = 'lnkicks_splash_seen_session';
const AUTO_DISMISS_MS = 5500;

type Props = {
  /** Called when the splash finishes dismissing (after fade-out). */
  onComplete: () => void;
};

export default function MobileSplashScreen({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const dismissedRef = useRef(false);

  // ── Mount + entrance animation trigger ─────────────────────────────
  useEffect(() => {
    // Trigger entrance paint on next frame so CSS transitions fire.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Auto-dismiss after AUTO_DISMISS_MS ─────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => dismiss(), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // ── Lock body scroll while splash is visible ───────────────────────
  useEffect(() => {
    if (!visible) return;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.width = '';
    };
  }, [visible]);

  // ── Dismiss handler — fade out then notify parent ──────────────────
  function dismiss() {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* sessionStorage may be blocked — fail silently */
    }
    // Wait for fade-out transition before unmounting
    setTimeout(() => onComplete(), 420);
  }

  if (!visible && mounted === false) return null;

  // ── Entrance animation states (CSS-driven via `mounted` class) ─────
  // When mounted=true, the CSS class `lnk-splash--in` is added, which
  // transitions all entrance elements from their hidden state to visible.
  const inClass = mounted ? 'lnk-splash--in' : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="LN KICKS welcome"
      className={`lnk-splash ${inClass} ${visible ? '' : 'lnk-splash--out'}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.splash,
        background: theme.colors.white,
        // Safe-area-aware padding so status bar / home indicator don't
        // overlap the Skip button or CTA.
        paddingTop: safeArea.paddingTop,
        paddingBottom: safeArea.paddingBottom,
        paddingLeft: safeArea.paddingLeft,
        paddingRight: safeArea.paddingRight,
        overflow: 'hidden',
      }}
    >
      {/* ── Subtle radial gradient backdrop for depth ─────────────── */}
      <div
        className="lnk-splash__bg"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 0%, #FFFFFF 0%, #FAFAFA 55%, #F2F2F3 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Top-right Skip link ───────────────────────────────────── */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Skip welcome screen"
        className="lnk-splash__skip"
        style={{
          position: 'absolute',
          top: 'max(16px, env(safe-area-inset-top))',
          right: 'max(20px, env(safe-area-inset-right))',
          zIndex: 3,
          background: 'transparent',
          border: 'none',
          padding: '8px 12px',
          margin: '-8px -12px', // expand hit-area without visual shift
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.md,
          fontWeight: theme.fontWeight.semibold,
          letterSpacing: theme.letterSpacing.wide,
          color: theme.colors.textSecondary,
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        Skip
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            marginLeft: 6,
            transform: 'translateY(-0.5px)',
          }}
        >
          →
        </span>
      </button>

      {/* ── Main content stack ────────────────────────────────────── */}
      <div
        className="lnk-splash__content"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          maxWidth: 440,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
        }}
      >
        {/* ── Top-left shoe: Air Jordan 1 Low Powder Blue ──────────── */}
        <img
          src="/jordan_powder_blue_nobg.png"
          alt=""
          aria-hidden="true"
          className="lnk-splash__shoe lnk-splash__shoe--top"
          style={{
            position: 'absolute',
            top: '8%',
            left: '-8%',
            width: '52%',
            maxWidth: 220,
            transform: 'rotate(-18deg)',
            userSelect: 'none',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 18px 28px rgba(17,17,17,0.14))',
          }}
        />

        {/* ── Bottom-right shoe: Adidas Samba OG ───────────────────── */}
        <img
          src="/samba_og_nobg.png"
          alt=""
          aria-hidden="true"
          className="lnk-splash__shoe lnk-splash__shoe--bottom"
          style={{
            position: 'absolute',
            bottom: '12%',
            right: '-10%',
            width: '54%',
            maxWidth: 230,
            transform: 'rotate(14deg)',
            userSelect: 'none',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 20px 30px rgba(17,17,17,0.16))',
          }}
        />

        {/* ── Center: LNKICKS wordmark + tagline ───────────────────── */}
        <div
          className="lnk-splash__brand"
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Eyebrow */}
          <div
            className="lnk-splash__eyebrow"
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.caption,
              fontWeight: theme.fontWeight.bold,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
              color: theme.colors.textSecondary,
              marginBottom: 14,
            }}
          >
            India&apos;s Premium Sneaker House
          </div>

          {/* Wordmark */}
          <h1
            className="lnk-splash__wordmark"
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: 'clamp(44px, 16vw, 64px)',
              fontWeight: theme.fontWeight.bold,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: theme.colors.textPrimary,
              margin: 0,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            LNKICKS
          </h1>

          {/* Divider line */}
          <div
            className="lnk-splash__divider"
            style={{
              width: 36,
              height: 2,
              background: theme.colors.textPrimary,
              marginTop: 18,
              marginBottom: 14,
              transformOrigin: 'center',
            }}
          />

          {/* Tagline */}
          <p
            className="lnk-splash__tagline"
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.regular,
              lineHeight: 1.5,
              letterSpacing: theme.letterSpacing.normal,
              color: theme.colors.textSecondary,
              margin: 0,
              maxWidth: 280,
            }}
          >
            Step into authentic sneakers, handpicked for India.
          </p>
        </div>

        {/* ── Bottom CTA: Enter Store ──────────────────────────────── */}
        <div
          className="lnk-splash__cta-wrap"
          style={{
            position: 'absolute',
            bottom: 'max(36px, env(safe-area-inset-bottom))',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 3,
          }}
        >
          <button
            type="button"
            onClick={dismiss}
            className="lnk-splash__cta"
            aria-label="Enter the LN KICKS store"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              minWidth: 220,
              padding: '16px 32px',
              borderRadius: 999,
              background: theme.colors.primaryButton,
              color: theme.colors.buttonText,
              border: 'none',
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.semibold,
              letterSpacing: theme.letterSpacing.wide,
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              boxShadow:
                '0 1px 2px rgba(17,17,17,0.10), 0 8px 18px rgba(17,17,17,0.18), 0 18px 36px rgba(17,17,17,0.12)',
              transition: `transform ${theme.duration.instant} ${theme.easing.out}, box-shadow ${theme.duration.instant} ${theme.easing.out}`,
            }}
          >
            Enter Store
            <span aria-hidden="true" style={{ display: 'inline-block' }}>
              →
            </span>
          </button>
        </div>
      </div>

      {/* ── styles-jsx ─────────────────────────────────────────────── */}
      <style jsx>{`
        .lnk-splash {
          opacity: 1;
          transition: opacity 380ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lnk-splash--out {
          opacity: 0;
          pointer-events: none;
        }

        /* Entrance animation: hidden to visible via --in class */
        .lnk-splash__skip {
          opacity: 0;
          transform: translateY(-6px);
          transition:
            opacity 480ms cubic-bezier(0.16, 1, 0.3, 1) 200ms,
            transform 480ms cubic-bezier(0.16, 1, 0.3, 1) 200ms;
        }
        .lnk-splash--in .lnk-splash__skip {
          opacity: 1;
          transform: translateY(0);
        }
        .lnk-splash__skip:hover,
        .lnk-splash__skip:focus-visible {
          color: ${theme.colors.textPrimary};
          outline: none;
        }

        .lnk-splash__shoe--top {
          opacity: 0;
          transform: translate3d(-40px, -24px, 0) rotate(-18deg) scale(0.94);
          transition:
            opacity 720ms cubic-bezier(0.16, 1, 0.3, 1) 120ms,
            transform 820ms cubic-bezier(0.16, 1, 0.3, 1) 120ms;
          will-change: transform, opacity;
        }
        .lnk-splash--in .lnk-splash__shoe--top {
          opacity: 1;
          transform: translate3d(0, 0, 0) rotate(-18deg) scale(1);
        }

        .lnk-splash__shoe--bottom {
          opacity: 0;
          transform: translate3d(40px, 24px, 0) rotate(14deg) scale(0.94);
          transition:
            opacity 720ms cubic-bezier(0.16, 1, 0.3, 1) 200ms,
            transform 820ms cubic-bezier(0.16, 1, 0.3, 1) 200ms;
          will-change: transform, opacity;
        }
        .lnk-splash--in .lnk-splash__shoe--bottom {
          opacity: 1;
          transform: translate3d(0, 0, 0) rotate(14deg) scale(1);
        }

        .lnk-splash__eyebrow {
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity 480ms cubic-bezier(0.16, 1, 0.3, 1) 320ms,
            transform 480ms cubic-bezier(0.16, 1, 0.3, 1) 320ms;
        }
        .lnk-splash--in .lnk-splash__eyebrow {
          opacity: 1;
          transform: translateY(0);
        }

        .lnk-splash__wordmark {
          opacity: 0;
          transform: translateY(12px) scale(0.96);
          transition:
            opacity 640ms cubic-bezier(0.16, 1, 0.3, 1) 380ms,
            transform 720ms cubic-bezier(0.16, 1, 0.3, 1) 380ms;
          will-change: transform, opacity;
        }
        .lnk-splash--in .lnk-splash__wordmark {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .lnk-splash__divider {
          opacity: 0;
          transform: scaleX(0);
          transition:
            opacity 480ms cubic-bezier(0.16, 1, 0.3, 1) 540ms,
            transform 560ms cubic-bezier(0.16, 1, 0.3, 1) 540ms;
        }
        .lnk-splash--in .lnk-splash__divider {
          opacity: 1;
          transform: scaleX(1);
        }

        .lnk-splash__tagline {
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity 480ms cubic-bezier(0.16, 1, 0.3, 1) 620ms,
            transform 480ms cubic-bezier(0.16, 1, 0.3, 1) 620ms;
        }
        .lnk-splash--in .lnk-splash__tagline {
          opacity: 1;
          transform: translateY(0);
        }

        .lnk-splash__cta-wrap {
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 540ms cubic-bezier(0.16, 1, 0.3, 1) 760ms,
            transform 620ms cubic-bezier(0.16, 1, 0.3, 1) 760ms;
        }
        .lnk-splash--in .lnk-splash__cta-wrap {
          opacity: 1;
          transform: translateY(0);
        }

        .lnk-splash__cta:active {
          transform: scale(0.97);
          box-shadow:
            0 1px 1px rgba(17,17,17,0.10),
            0 4px 10px rgba(17,17,17,0.18),
            0 8px 18px rgba(17,17,17,0.10);
        }

        /* ── Reduced motion: skip entrance choreography ──────────── */
        @media (prefers-reduced-motion: reduce) {
          .lnk-splash,
          .lnk-splash__skip,
          .lnk-splash__shoe--top,
          .lnk-splash__shoe--bottom,
          .lnk-splash__eyebrow,
          .lnk-splash__wordmark,
          .lnk-splash__divider,
          .lnk-splash__tagline,
          .lnk-splash__cta-wrap {
            transition: opacity 200ms ease-out !important;
            transform: none !important;
          }
          .lnk-splash--in .lnk-splash__shoe--top {
            transform: rotate(-18deg) !important;
          }
          .lnk-splash--in .lnk-splash__shoe--bottom {
            transform: rotate(14deg) !important;
          }
        }
      `}</style>
    </div>
  );
}
