'use client';

/**
 * MobileEngagementPopup — premium bottom-sheet engagement popup (Phase 21).
 *
 * Ultra-premium mobile-only engagement modal inspired by Apple HIG,
 * Samsung One UI, and Google Material 3. Mounted on the mobile homepage
 * only — desktop is 100% untouched (the popup is gated by both the
 * MobileHome mount path AND a runtime `window.innerWidth < 768` check).
 *
 * ── Trigger ───────────────────────────────────────────────────────────
 * After 60 seconds of continuous homepage dwell time, IF:
 *   • viewport < 768px (mobile only)
 *   • user is NOT signed in (no `lnk_user` in localStorage)
 *   • popup has NOT already been shown this session (sessionStorage flag)
 *   • popup has NOT already been submitted this session
 *
 * ── Layout ────────────────────────────────────────────────────────────
 *   ┌──────────────────────────────────────────────┐
 *   │  [✕]                                            │  ← top banner (dark gradient)
 *   │                                                │
 *   │   Looking for your       [premium 3D shoe]    │
 *   │   perfect pair?          [✨ sparkles ✨]      │
 *   │   Discover premium sneakers…                  │
 *   │                                                │
 *   ├──────────────────────────────────────────────┤
 *   │  Unlock Exclusive Offers                       │  ← bottom card (white)
 *   │  Get early access to premium collections…     │
 *   │                                                │
 *   │  [+91 | ____________________]   phone input    │
 *   │                                                │
 *   │  [ Continue → ]              primary gradient  │
 *   │                                                │
 *   │  By continuing you agree to our Terms…         │
 *   └──────────────────────────────────────────────┘
 *
 * ── Animation ─────────────────────────────────────────────────────────
 * Bottom sheet slides up from off-screen (translateY(100%) → 0) using
 * Apple's standard ease-out curve `cubic-bezier(0.16, 1, 0.3, 1)` over
 * 420ms. Backdrop fades in (opacity 0 → 1) with a 6px blur. Exit is the
 * reverse — slide-down + fade-out, also 420ms ease-in.
 *
 * ── Dismissal ─────────────────────────────────────────────────────────
 *   • Tap backdrop                          → close
 *   • Tap circular close button (top-left)  → close
 *   • Press ESC                             → close
 *   • Swipe-down gesture on the sheet       → close
 *
 * On close, sessionStorage flag is set so the popup doesn't reappear
 * during the same browsing session (prevents annoyance).
 *
 * ── Accessibility ─────────────────────────────────────────────────────
 *   • role="dialog" + aria-modal="true"
 *   • aria-labelledby pointing to headline
 *   • Focus trap — focus moves to close button on open, returns to
 *     trigger element on close, Tab/Shift+Tab cycles within dialog
 *   • ESC key closes
 *   • All interactive elements have :focus-visible outlines
 *   • Backdrop click closes (but not when clicking inside the sheet)
 *
 * ── Performance ───────────────────────────────────────────────────────
 *   • Lazy-loaded by MobileHome via React.lazy + Suspense (only loads
 *     the JS chunk when below-the-fold renders, after main content)
 *   • All CSS via styled-jsx (no FOUC, no CLS)
 *   • Transform/opacity animations only — 60fps, GPU-accelerated
 *   • will-change: transform on the sheet during animation
 *   • Body scroll locked while open (overflow: hidden)
 *   • Zero external dependencies — vanilla React + styled-jsx
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';

// ── Constants ─────────────────────────────────────────────────────────

/** Dwell time before popup appears (ms). User specified 60s preference. */
const TRIGGER_DELAY_MS = 60_000;

/** Slide-up/slide-down duration. Kept in sync with CSS via --lnep-dur. */
const ANIM_DURATION_MS = 420;

/** sessionStorage keys — session-scoped so popup re-shows next visit. */
const SK_SHOWN = 'lnk_engagement_shown';
const SK_SUBMITTED = 'lnk_engagement_submitted';

/** localStorage key — the same one written by app/profile/page.tsx. */
const LK_USER = 'lnk_user';

/** Mobile-only viewport cap. Above this width the popup never shows. */
const MOBILE_MAX_WIDTH = 768;

/**
 * Air Jordan 1 Low "Powder Blue" — the hero sneaker image used across
 * the existing mobile homepage. Same CDN URL reused here for visual
 * consistency (no random external image).
 */
const SHOE_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw';

// ── Component ─────────────────────────────────────────────────────────

function MobileEngagementPopupImpl() {
  // `open` controls the rendered DOM presence (false → not in DOM at all,
  // preventing any CLS or layout impact when popup isn't active).
  // `visible` controls the CSS transition state — when open becomes true
  // we paint at translateY(100%) then on the next frame flip visible to
  // true so the transition fires.
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Phone input state + submission state
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Refs for focus trap + swipe handling
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const triggerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Trigger logic: schedule popup after 60s if all conditions met ──
  useEffect(() => {
    // SSR guard — never run on the server.
    if (typeof window === 'undefined') return;

    // Mobile-only — desktop must remain completely untouched.
    if (window.innerWidth >= MOBILE_MAX_WIDTH) return;

    // Don't show if user already signed in. Check the localStorage key
    // that app/profile/page.tsx writes — if `lnk_user` exists and has
    // `isLoggedIn: true`, the user is authenticated.
    try {
      const raw = localStorage.getItem(LK_USER);
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.isLoggedIn === true) return;
      }
    } catch {
      // parse failure — treat as not signed in, popup can show
    }

    // Don't show if already shown OR already submitted this session.
    try {
      if (sessionStorage.getItem(SK_SHOWN) === '1') return;
      if (sessionStorage.getItem(SK_SUBMITTED) === '1') return;
    } catch {
      // sessionStorage may be unavailable (private mode) — proceed
    }

    // Schedule the popup. We use a single setTimeout — pause/resume on
    // visibilitychange would be a refinement, but for a 60s trigger the
    // simple approach is fine and avoids the complexity of accumulated
    // dwell-time math.
    triggerTimerRef.current = setTimeout(() => {
      // Re-check viewport — user may have rotated to landscape / resized
      // to desktop width in the last 60s.
      if (window.innerWidth >= MOBILE_MAX_WIDTH) return;

      // Re-check auth — user may have logged in within the 60s window
      // (e.g., opened menu → Sign In → came back to homepage).
      try {
        const raw = localStorage.getItem(LK_USER);
        if (raw) {
          const u = JSON.parse(raw);
          if (u && u.isLoggedIn === true) return;
        }
      } catch {
        // ignore
      }

      // Mark shown so it doesn't reappear this session.
      try {
        sessionStorage.setItem(SK_SHOWN, '1');
      } catch {
        // ignore
      }

      // Remember which element had focus so we can restore it on close.
      previouslyFocusedRef.current =
        (document.activeElement as HTMLElement) || null;

      setOpen(true);
      haptic.medium();
    }, TRIGGER_DELAY_MS);

    return () => {
      if (triggerTimerRef.current) {
        clearTimeout(triggerTimerRef.current);
        triggerTimerRef.current = null;
      }
    };
  }, []);

  // ── Animation orchestration ─────────────────────────────────────────
  // When `open` flips to true, we render the DOM (translateY(100%),
  // invisible backdrop) then on the next animation frame flip `visible`
  // to true so the CSS transition fires. When `open` flips to false we
  // do the opposite — flip visible to false, then after the animation
  // duration unmount.
  useEffect(() => {
    if (open) {
      // Lock body scroll while popup is mounted.
      document.body.style.overflow = 'hidden';

      // Double-rAF ensures the initial off-screen state paints first,
      // otherwise the transition won't fire (browser coalesces the
      // style changes into a single paint).
      const r1 = requestAnimationFrame(() => {
        const r2 = requestAnimationFrame(() => {
          setVisible(true);
        });
        // Move focus to the close button once the sheet is in motion.
        // Small delay so screen readers announce the dialog first.
        setTimeout(() => closeBtnRef.current?.focus(), 100);
        return () => cancelAnimationFrame(r2);
      });
      return () => {
        cancelAnimationFrame(r1);
        document.body.style.overflow = '';
      };
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ── Close handler ───────────────────────────────────────────────────
  // Flips `visible` to false (triggers slide-down transition), then after
  // the animation duration elapses, unmounts the DOM via `setOpen(false)`.
  // Also restores focus to the element that had it before the popup opened
  // — important for keyboard users who Tabbed into the trigger.
  const handleClose = useCallback(() => {
    setVisible(false);
    haptic.light();
    window.setTimeout(() => {
      setOpen(false);
      previouslyFocusedRef.current?.focus?.();
    }, ANIM_DURATION_MS);
  }, []);

  // ── ESC key handler ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
      // Focus trap — Tab / Shift+Tab cycles within the dialog.
      if (e.key === 'Tab') {
        const sheet = sheetRef.current;
        if (!sheet) return;
        const focusables = sheet.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleClose]);

  // ── Swipe-down to dismiss ───────────────────────────────────────────
  // Track touch start Y; if the user drags down >80px past start, close.
  // Also applies a live translateY to the sheet during the drag for a
  // native-feeling "rubber-band" follow.
  const dragStartY = useRef<number | null>(null);
  const dragDelta = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragDelta.current = 0;
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (dragStartY.current === null) return;
      const dy = e.touches[0].clientY - dragStartY.current;
      // Only allow downward drag (positive dy). Ignore upward swipes.
      if (dy <= 0) {
        dragDelta.current = 0;
        return;
      }
      // Apply a slight rubber-band resistance (0.5x) for a premium feel.
      const resisted = dy * 0.5;
      dragDelta.current = resisted;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${resisted}px)`;
        sheetRef.current.style.transition = 'none';
      }
    },
    [],
  );

  const onTouchEnd = useCallback(() => {
    if (dragStartY.current === null) return;
    const sheet = sheetRef.current;
    if (sheet) {
      sheet.style.transition = '';
      sheet.style.transform = '';
    }
    // Threshold: 80px of actual finger travel (resisted to 40px on sheet).
    if (dragDelta.current >= 40) {
      handleClose();
    }
    dragStartY.current = null;
    dragDelta.current = 0;
  }, [handleClose]);

  // ── Phone input handler ─────────────────────────────────────────────
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Strip everything except digits, max 10 (Indian mobile).
      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
      setPhone(digits);
    },
    [],
  );

  // ── Submit handler ──────────────────────────────────────────────────
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (phone.length < 10) {
        haptic.error();
        phoneInputRef.current?.focus();
        return;
      }
      haptic.success();
      setSubmitting(true);
      // Simulate a brief network round-trip for premium feel (no real
      // backend wired yet — replace with fetch() when API is ready).
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
        try {
          sessionStorage.setItem(SK_SUBMITTED, '1');
        } catch {
          // ignore
        }
        // Auto-close 1.8s after success state shows.
        setTimeout(() => {
          handleClose();
        }, 1800);
      }, 700);
    },
    [phone, handleClose],
  );

  // ── Render ──────────────────────────────────────────────────────────
  // When `open` is false we render nothing — zero CLS, zero layout impact.
  if (!open) return null;

  return (
    <div
      aria-hidden={!visible}
      className="lnep-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.modal,
        pointerEvents: 'auto',
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      {/* ── Backdrop — dim + blur ─────────────────────────────────────── */}
      <div
        className="lnep-backdrop"
        onClick={handleClose}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,10,10,0.55)',
          opacity: visible ? 1 : 0,
          // Backdrop blur — iOS Safari prefix + standard
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          transition: `opacity ${ANIM_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      />

      {/* ── Bottom sheet ─────────────────────────────────────────────── */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lnep-headline"
        aria-describedby="lnep-subtext"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`lnep-sheet ${visible ? 'lnep-sheet--visible' : ''}`}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          // Width: nearly full width with 16px side margins.
          width: 'auto',
          margin: `0 ${theme.spacing.xl}px`,
          // Height: 75-80% of viewport.
          maxHeight: '78vh',
          background: theme.colors.white,
          borderRadius: 28,
          boxShadow: theme.shadows.xxl,
          overflow: 'hidden',
          // Initial off-screen state (CSS also has this for the !visible
          // class, but we set it inline too for the first paint).
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          willChange: 'transform',
        }}
      >
        {/* ── Top banner — dark gradient + shoe + sparkles ──────────── */}
        <div
          className="lnep-banner"
          style={{
            position: 'relative',
            background:
              'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 60%, #1F1F1F 100%)',
            padding: `${theme.spacing.xxxl}px ${theme.spacing.xl}px ${theme.spacing.sectionGapLg}px`,
            overflow: 'hidden',
            minHeight: 180,
          }}
        >
          {/* Subtle radial highlight on top-left for premium depth */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: -40,
              left: -40,
              width: 180,
              height: 180,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* ── Close button — top-left floating circular ──────────── */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label="Close popup"
            className="lnep-close"
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: theme.colors.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 5,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              aria-hidden
            >
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            </svg>
          </button>

          {/* ── Left-side text ─────────────────────────────────────── */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '62%',
            }}
          >
            <h2
              id="lnep-headline"
              style={{
                fontFamily: theme.fontFamily.body,
                fontSize: 22,
                fontWeight: theme.fontWeight.bold,
                lineHeight: 1.2,
                letterSpacing: theme.letterSpacing.tight,
                color: theme.colors.white,
                margin: 0,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              Looking for your perfect pair?
            </h2>
            <p
              id="lnep-subtext"
              style={{
                fontFamily: theme.fontFamily.body,
                fontSize: 12.5,
                fontWeight: theme.fontWeight.regular,
                lineHeight: 1.45,
                color: 'rgba(255,255,255,0.7)',
                margin: `${theme.spacing.sm}px 0 0 0`,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              Discover premium sneakers handpicked for your style.
            </p>
          </div>

          {/* ── Premium 3D shoe image — right side ─────────────────── */}
          <img
            src={SHOE_IMAGE_URL}
            alt="Air Jordan 1 Low Powder Blue sneaker"
            className="lnep-shoe"
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{
              position: 'absolute',
              right: -20,
              bottom: -10,
              width: 165,
              height: 'auto',
              objectFit: 'contain',
              filter:
                'drop-shadow(0 18px 28px rgba(0,0,0,0.45))',
              zIndex: 3,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />

          {/* ── Sparkle elements — floating premium accents ────────── */}
          <Sparkle top={22} right={42} size={4} delay={0} />
          <Sparkle top={62} right={148} size={3} delay={0.8} />
          <Sparkle top={108} right={36} size={5} delay={1.4} />
          <Sparkle top={130} right={120} size={3} delay={0.4} />
        </div>

        {/* ── Bottom section — white card ────────────────────────────── */}
        <div
          style={{
            background: theme.colors.white,
            padding: `${theme.spacing.sectionGapLg}px ${theme.spacing.xl}px ${theme.spacing.section}px`,
          }}
        >
          {submitted ? (
            // ── Success state ──
            <div
              style={{
                textAlign: 'center',
                padding: `${theme.spacing.sectionGapLg}px 0`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: theme.colors.black,
                  color: theme.colors.white,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.md,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12.5l4.5 4.5L19 7.5"
                  />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 18,
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.textPrimary,
                  margin: 0,
                  letterSpacing: theme.letterSpacing.tight,
                }}
              >
                You&rsquo;re on the list!
              </h3>
              <p
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 13,
                  color: theme.colors.textSecondary,
                  margin: `${theme.spacing.sm}px 0 0 0`,
                  lineHeight: 1.5,
                }}
              >
                Watch your phone for exclusive drops &amp; offers.
              </p>
            </div>
          ) : (
            // ── Default form state ──
            <>
              <h3
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 20,
                  fontWeight: theme.fontWeight.bold,
                  lineHeight: 1.2,
                  letterSpacing: theme.letterSpacing.tight,
                  color: theme.colors.textPrimary,
                  margin: 0,
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                Unlock Exclusive Offers
              </h3>
              <p
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 12.5,
                  fontWeight: theme.fontWeight.regular,
                  lineHeight: 1.5,
                  color: theme.colors.textSecondary,
                  margin: `${theme.spacing.sm}px 0 ${theme.spacing.sectionGapLg}px 0`,
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                Get early access to premium collections, exclusive deals and
                faster checkout.
              </p>

              {/* ── Phone input + Continue button (form) ─────────────── */}
              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="lnep-phone" className="lnep-label">
                  Phone Number
                </label>
                <div className="lnep-input-wrap">
                  {/* India country code prefix */}
                  <span className="lnep-cc" aria-hidden>
                    +91
                  </span>
                  <input
                    ref={phoneInputRef}
                    id="lnep-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    aria-label="Phone number"
                    className="lnep-input"
                  />
                </div>

                {/* ── Primary button — premium gradient ──────────────── */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="lnep-cta"
                  aria-label="Continue to receive exclusive offers"
                  style={{
                    width: '100%',
                    height: 52,
                    border: 'none',
                    borderRadius: 18,
                    background:
                      'linear-gradient(135deg, #1F1F1F 0%, #0A0A0A 100%)',
                    color: theme.colors.white,
                    fontFamily: theme.fontFamily.body,
                    fontSize: 15,
                    fontWeight: theme.fontWeight.semibold,
                    letterSpacing: 0.3,
                    cursor: submitting ? 'wait' : 'pointer',
                    marginTop: theme.spacing.md + 2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: theme.spacing.sm,
                    boxShadow:
                      '0 8px 20px rgba(10,10,10,0.22), 0 2px 6px rgba(10,10,10,0.12)',
                    WebkitTapHighlightColor: 'transparent',
                    transition: `transform 180ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease`,
                  }}
                >
                  {submitting ? 'Please wait…' : (
                    <>
                      Continue
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M13 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </button>

                {/* ── Privacy text ─────────────────────────────────────── */}
                <p
                  className="lnep-privacy"
                  style={{
                    fontFamily: theme.fontFamily.body,
                    fontSize: 10.5,
                    fontWeight: theme.fontWeight.regular,
                    lineHeight: 1.5,
                    color: theme.colors.textTertiary,
                    margin: `${theme.spacing.md + 2}px 0 0 0`,
                    textAlign: 'center',
                    fontFeatureSettings: theme.fontFeatures,
                  }}
                >
                  By continuing you agree to our{' '}
                  <Link href="/terms-conditions" className="lnep-link">
                    Terms
                  </Link>{' '}
                  &amp;{' '}
                  <Link href="/privacy-policy" className="lnep-link">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ── styled-jsx — all popup-specific CSS lives here ──────────── */}
      <style jsx>{`
        /* ── Bottom sheet slide-up ──────────────────────────────────── */
        .lnep-sheet {
          transition: transform ${ANIM_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateY(100%);
        }
        .lnep-sheet--visible {
          transform: translateY(0) !important;
        }

        /* ── Close button press state ───────────────────────────────── */
        .lnep-close {
          transition: transform 120ms cubic-bezier(0.16, 1, 0.3, 1),
            background-color 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lnep-close:active {
          transform: scale(0.9);
          background-color: rgba(255, 255, 255, 0.2);
        }
        .lnep-close:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 2px;
        }

        /* ── Shoe image float-in (subtle scale + fade on visible) ──── */
        .lnep-shoe {
          opacity: 0;
          transform: translateX(20px) scale(0.95);
          transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 120ms,
            transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 120ms;
        }
        .lnep-sheet--visible .lnep-shoe {
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        /* ── Form label ─────────────────────────────────────────────── */
        .lnep-label {
          display: block;
          font-family: ${theme.fontFamily.body};
          font-size: 11px;
          font-weight: ${theme.fontWeight.semibold};
          color: ${theme.colors.textSecondary};
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
          font-feature-settings: ${theme.fontFeatures};
        }

        /* ── Phone input wrapper ────────────────────────────────────── */
        .lnep-input-wrap {
          display: flex;
          align-items: center;
          background: ${theme.colors.offWhite};
          border: 1.5px solid ${theme.colors.border};
          border-radius: 16px;
          height: 52px;
          padding: 0 16px;
          transition: border-color 180ms cubic-bezier(0.16, 1, 0.3, 1),
            background-color 180ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lnep-input-wrap:focus-within {
          border-color: ${theme.colors.black};
          background: ${theme.colors.white};
          box-shadow: 0 0 0 4px rgba(17, 17, 17, 0.06);
        }

        /* ── Country code prefix ────────────────────────────────────── */
        .lnep-cc {
          font-family: ${theme.fontFamily.body};
          font-size: 15px;
          font-weight: ${theme.fontWeight.semibold};
          color: ${theme.colors.textPrimary};
          margin-right: 10px;
          padding-right: 10px;
          border-right: 1px solid ${theme.colors.border};
          user-select: none;
        }

        /* ── Phone input ────────────────────────────────────────────── */
        .lnep-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: ${theme.fontFamily.body};
          font-size: 15px;
          font-weight: ${theme.fontWeight.medium};
          color: ${theme.colors.textPrimary};
          height: 100%;
          min-width: 0;
          letter-spacing: 0.4px;
        }
        .lnep-input::placeholder {
          color: ${theme.colors.textTertiary};
          font-weight: ${theme.fontWeight.regular};
          letter-spacing: 0;
        }
        .lnep-input:focus-visible {
          outline: none;
        }

        /* ── Continue button — hover + press states ─────────────────── */
        .lnep-cta:hover {
          box-shadow: 0 12px 28px rgba(10, 10, 10, 0.28),
            0 4px 10px rgba(10, 10, 10, 0.14);
        }
        .lnep-cta:active {
          transform: scale(0.97);
          box-shadow: 0 4px 12px rgba(10, 10, 10, 0.2);
        }
        .lnep-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .lnep-cta:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        /* ── Privacy links ──────────────────────────────────────────── */
        .lnep-link {
          color: ${theme.colors.textSecondary};
          text-decoration: underline;
          text-underline-offset: 1px;
          transition: color 180ms ease;
        }
        .lnep-link:active {
          color: ${theme.colors.textPrimary};
        }

        /* ── Sparkle animation keyframes ────────────────────────────── */
        @keyframes lnep-sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.6) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
}

// ── Sparkle sub-component ──────────────────────────────────────────────
/**
 * Sparkle — a small 4-point star that pulses on a loop, giving the
 * premium "floating sparkle" effect around the shoe image. Pure CSS
 * animation (no JS), GPU-accelerated, doesn't trigger layout.
 */
function Sparkle({
  top,
  right,
  size,
  delay,
}: {
  top: number;
  right: number;
  size: number;
  delay: number;
}) {
  return (
    <svg
      aria-hidden
      width={size + 4}
      height={size + 4}
      viewBox="0 0 24 24"
      style={{
        position: 'absolute',
        top,
        right,
        zIndex: 4,
        pointerEvents: 'none',
        animation: `lnep-sparkle 2.6s ease-in-out ${delay}s infinite`,
        willChange: 'transform, opacity',
      }}
    >
      <path
        d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
        fill="rgba(255,255,255,0.85)"
      />
    </svg>
  );
}

export const MobileEngagementPopup = memo(MobileEngagementPopupImpl);
export default MobileEngagementPopup;
