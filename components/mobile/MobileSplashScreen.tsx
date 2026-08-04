'use client';

/**
 * MobileSplashScreen — premium mobile-only splash / intro overlay for LN KICKS.
 *
 * DESIGN (premium Apple × Nike × GOAT inspired):
 *  - Pure white background with a soft radial glow halo behind the shoes
 *    for depth and premium feel
 *  - "LNKICKS" wordmark at the top with refined typography + a small
 *    accent rule + tagline "PREMIUM SNEAKERS · INDIA"
 *  - Two sneakers floating in the middle with opposing diagonal angles,
 *    BOTH FULLY INSIDE THE VIEWPORT (no right-side cutoff):
 *      • LEFT shoe  — Nike Air Force 1 (white) rotated -22deg
 *      • RIGHT shoe — Yeezy Boost 350 V2 (beige/tan) rotated +18deg
 *    Both with soft drop-shadows + a subtle floating animation
 *  - "Get Started" button at the bottom — solid black pill, white text,
 *    generous padding, arrow icon, centered
 *  - "Swipe to explore" hint beneath CTA for premium app-store feel
 *  - Top-right "Skip" link
 *
 * BEHAVIOR:
 *  - Shown ONLY on the mobile homepage (mounted inside MobileHome)
 *  - Once per browser session (sessionStorage flag)
 *  - Auto-dismisses after 5.5s
 *  - User can dismiss via top-right "Skip" or bottom "Get Started"
 *  - 380ms ease-out fade when dismissing (Apple-style)
 *  - Locks body scroll while visible
 *
 * ACCESSIBILITY:
 *  - role="dialog" aria-modal="true" aria-label="LN KICKS welcome"
 *  - Skip + Get Started are keyboard-focusable
 *  - prefers-reduced-motion respected (skips choreography + float)
 *  - Body scroll locked while splash is visible
 *
 * Mobile-only — Desktop homepage never mounts this component.
 */

import React, { useEffect, useRef, useState } from 'react';
import { theme } from '@/lib/mobile/theme/theme';
import { safeArea } from '@/lib/mobile/utils/safeArea';

const STORAGE_KEY = 'lnkicks_splash_seen_session';
const AUTO_DISMISS_MS = 5500;

// CDN-hosted transparent-friendly product photos. The splash background
// is pure white, so these white-background product photos blend seamlessly.
const LEFT_SHOE_URL =
  'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5451714698fb.png';
const RIGHT_SHOE_URL =
  'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c5a30b3f90b6.png';

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
    setTimeout(() => onComplete(), 420);
  }

  if (!visible && mounted === false) return null;

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
        paddingTop: safeArea.paddingTop,
        paddingBottom: safeArea.paddingBottom,
        paddingLeft: safeArea.paddingLeft,
        paddingRight: safeArea.paddingRight,
        overflow: 'hidden',
      }}
    >
      {/* ── Soft radial glow halo behind shoes (depth + premium) ────── */}
      <div
        aria-hidden="true"
        className="lnk-splash__halo"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '125%',
          height: '125%',
          background:
            'radial-gradient(circle at 50% 50%, rgba(17,17,17,0.06) 0%, rgba(17,17,17,0.03) 28%, rgba(255,255,255,0) 60%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Skip link (top-right, subtle) ───────────────────────────── */}
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
          margin: '-8px -12px',
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
        {/* ── TOP: LNKICKS wordmark + accent rule + tagline ────────── */}
        <div
          className="lnk-splash__brand"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <h1
            className="lnk-splash__wordmark"
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: 'clamp(44px, 15vw, 56px)',
              fontWeight: theme.fontWeight.bold,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: theme.colors.textPrimary,
              margin: 0,
              fontFeatureSettings: theme.fontFeatures,
              textAlign: 'center',
            }}
          >
            LNKICKS
          </h1>

          {/* Accent rule — small horizontal line + dot for premium feel */}
          <div
            aria-hidden="true"
            className="lnk-splash__rule"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: 0,
            }}
          >
            <span
              style={{
                width: 28,
                height: 1,
                background: theme.colors.textPrimary,
                opacity: 0.4,
              }}
            />
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: theme.colors.textPrimary,
                opacity: 0.6,
              }}
            />
            <span
              style={{
                width: 28,
                height: 1,
                background: theme.colors.textPrimary,
                opacity: 0.4,
              }}
            />
          </div>

          {/* Tagline */}
          <p
            className="lnk-splash__tagline"
            style={{
              margin: 0,
              fontFamily: theme.fontFamily.body,
              fontSize: 11,
              fontWeight: theme.fontWeight.semibold,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: theme.colors.textSecondary,
              textAlign: 'center',
            }}
          >
            Premium Sneakers · India
          </p>
        </div>

        {/* ── MIDDLE: Two MIRROR-symmetric sneakers, centered as a pair ──
              Both shoes share identical width + maxWidth + rotation
              magnitude (±16deg). They are anchored to the screen center
              (left:50%) and use translate(-94%/-6%) so their visual
              centers are perfectly mirrored around 50%. A 12% overlap
              creates a clean, intertwined, premium composition that
              NEVER leans left or right. */}
        <div
          className="lnk-splash__shoes"
          aria-hidden="true"
          style={{
            position: 'relative',
            width: '100%',
            height: 280,
            marginTop: 36,
            marginBottom: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* LEFT shoe — anchored to center, mirrored -16deg */}
          <img
            src={LEFT_SHOE_URL}
            alt=""
            className="lnk-splash__shoe lnk-splash__shoe--left"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-94%, -50%) rotate(-16deg)',
              width: '44%',
              maxWidth: 165,
              height: 'auto',
              userSelect: 'none',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 20px 30px rgba(17,17,17,0.18))',
              zIndex: 1,
            }}
          />

          {/* RIGHT shoe — anchored to center, mirrored +16deg */}
          <img
            src={RIGHT_SHOE_URL}
            alt=""
            className="lnk-splash__shoe lnk-splash__shoe--right"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-6%, -50%) rotate(16deg)',
              width: '44%',
              maxWidth: 165,
              height: 'auto',
              userSelect: 'none',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 20px 30px rgba(17,17,17,0.18))',
              zIndex: 2,
            }}
          />
        </div>

        {/* ── BOTTOM: Get Started button + hint ────────────────────── */}
        <div
          className="lnk-splash__cta-wrap"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <button
            type="button"
            onClick={dismiss}
            className="lnk-splash__cta"
            aria-label="Get started — enter the LN KICKS store"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              width: '100%',
              maxWidth: 280,
              padding: '18px 44px',
              borderRadius: 12,
              background: theme.colors.black,
              color: theme.colors.white,
              border: 'none',
              fontFamily: theme.fontFamily.body,
              fontSize: 17,
              fontWeight: theme.fontWeight.semibold,
              letterSpacing: 0.2,
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              boxShadow:
                '0 1px 2px rgba(17,17,17,0.10), 0 8px 18px rgba(17,17,17,0.18), 0 18px 36px rgba(17,17,17,0.12)',
              transition: `transform ${theme.duration.instant} ${theme.easing.out}, box-shadow ${theme.duration.instant} ${theme.easing.out}`,
            }}
          >
            Get Started
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.14)',
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              →
            </span>
          </button>

          {/* Swipe hint — premium app-store style nudge */}
          <p
            className="lnk-splash__hint"
            style={{
              margin: 0,
              fontFamily: theme.fontFamily.body,
              fontSize: 11,
              fontWeight: theme.fontWeight.regular,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: theme.colors.textTertiary,
              textAlign: 'center',
            }}
          >
            Swipe to explore
          </p>
        </div>
      </div>

      {/* ── styles-jx ─────────────────────────────────────────────── */}
      <style jsx>{`
        .lnk-splash {
          opacity: 1;
          transition: opacity 380ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lnk-splash--out {
          opacity: 0;
          pointer-events: none;
        }

        /* Halo entrance */
        .lnk-splash__halo {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.85);
          transition:
            opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) 120ms,
            transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 120ms;
        }
        .lnk-splash--in .lnk-splash__halo {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        /* Skip link entrance */
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

        /* Brand block entrance */
        .lnk-splash__wordmark {
          opacity: 0;
          transform: translateY(12px) scale(0.96);
          transition:
            opacity 640ms cubic-bezier(0.16, 1, 0.3, 1) 200ms,
            transform 720ms cubic-bezier(0.16, 1, 0.3, 1) 200ms;
          will-change: transform, opacity;
        }
        .lnk-splash--in .lnk-splash__wordmark {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .lnk-splash__rule {
          opacity: 0;
          transform: translateY(6px);
          transition:
            opacity 520ms cubic-bezier(0.16, 1, 0.3, 1) 420ms,
            transform 520ms cubic-bezier(0.16, 1, 0.3, 1) 420ms;
        }
        .lnk-splash--in .lnk-splash__rule {
          opacity: 1 !important;
          transform: translateY(0);
        }

        .lnk-splash__tagline {
          opacity: 0;
          transform: translateY(6px);
          transition:
            opacity 520ms cubic-bezier(0.16, 1, 0.3, 1) 520ms,
            transform 520ms cubic-bezier(0.16, 1, 0.3, 1) 520ms;
        }
        .lnk-splash--in .lnk-splash__tagline {
          opacity: 1;
          transform: translateY(0);
        }

        /* Shoes entrance — left slides in from further left, right from
           further right. Both settle to a MIRROR-symmetric centered pair
           (translate -94% / -6%) so the composition never leans. */
        .lnk-splash__shoe--left {
          opacity: 0;
          transform: translate(-118%, -50%) rotate(-16deg);
          transition:
            opacity 720ms cubic-bezier(0.16, 1, 0.3, 1) 360ms,
            transform 820ms cubic-bezier(0.16, 1, 0.3, 1) 360ms;
          will-change: transform, opacity;
        }
        .lnk-splash--in .lnk-splash__shoe--left {
          opacity: 1;
          transform: translate(-94%, -50%) rotate(-16deg);
          animation: lnk-float-left 4.2s ease-in-out 1.4s infinite;
        }

        .lnk-splash__shoe--right {
          opacity: 0;
          transform: translate(18%, -50%) rotate(16deg);
          transition:
            opacity 720ms cubic-bezier(0.16, 1, 0.3, 1) 440ms,
            transform 820ms cubic-bezier(0.16, 1, 0.3, 1) 440ms;
          will-change: transform, opacity;
        }
        .lnk-splash--in .lnk-splash__shoe--right {
          opacity: 1;
          transform: translate(-6%, -50%) rotate(16deg);
          animation: lnk-float-right 4.6s ease-in-out 1.6s infinite;
        }

        /* Gentle floating animation — perfectly vertical bob only.
           No horizontal drift, so the centered pair stays centered. */
        @keyframes lnk-float-left {
          0%, 100% {
            transform: translate(-94%, -50%) rotate(-16deg);
          }
          50% {
            transform: translate(-94%, calc(-50% - 6px)) rotate(-16deg);
          }
        }
        @keyframes lnk-float-right {
          0%, 100% {
            transform: translate(-6%, -50%) rotate(16deg);
          }
          50% {
            transform: translate(-6%, calc(-50% - 8px)) rotate(16deg);
          }
        }

        /* CTA entrance */
        .lnk-splash__cta-wrap {
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 540ms cubic-bezier(0.16, 1, 0.3, 1) 700ms,
            transform 620ms cubic-bezier(0.16, 1, 0.3, 1) 700ms;
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

        /* Reduced motion: skip choreography + float loop */
        @media (prefers-reduced-motion: reduce) {
          .lnk-splash,
          .lnk-splash__skip,
          .lnk-splash__wordmark,
          .lnk-splash__rule,
          .lnk-splash__tagline,
          .lnk-splash__shoe--left,
          .lnk-splash__shoe--right,
          .lnk-splash__cta-wrap,
          .lnk-splash__halo {
            transition: opacity 200ms ease-out !important;
            transform: none !important;
            animation: none !important;
          }
          .lnk-splash--in .lnk-splash__shoe--left {
            transform: translate(-94%, -50%) rotate(-16deg) !important;
          }
          .lnk-splash--in .lnk-splash__shoe--right {
            transform: translate(-6%, -50%) rotate(16deg) !important;
          }
          .lnk-splash--in .lnk-splash__halo {
            transform: translate(-50%, -50%) scale(1) !important;
          }
        }
      `}</style>
    </div>
  );
}
