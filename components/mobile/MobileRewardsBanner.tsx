'use client';

import React, { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileRewardsBanner — Premium 3-step rewards timeline banner.
 *
 * PHASE 26 — Apple / Samsung One UI / Google Material inspired.
 *
 * Design language (matches LN KICKS mobile theme):
 *   - Premium white card (#FFFFFF) with 24px radius + soft editorial shadow
 *   - 3-step horizontal timeline with connecting line
 *   - Step 1 (Sign Up ₹50) — Active state: dark circle + green "Claim Now" badge
 *   - Step 2 (First Referral ₹50) — Locked: grey circle + lock icon
 *   - Step 3 (First Order ₹100) — Locked: grey circle + lock icon
 *   - Reward summary card with 3 bullet points
 *   - Full-width "Create Account" CTA (dark gradient, 18px radius, press scale)
 *   - Terms text below button
 *
 * Auth-aware:
 *   - Reads localStorage 'lnk_user' (written by /profile page)
 *   - If logged out → CTA = "Create Account", Step 1 active
 *   - If logged in → CTA = "Invite Friends", Step 1 completed (✓),
 *                    Steps 2 & 3 show "Pending"
 *
 * Mounted in MobileHome.tsx ABOVE MobileNewsletter per user spec.
 * Mobile-only — desktop homepage is untouched.
 */

// ── Types ──────────────────────────────────────────────────────────────
type StepStatus = 'completed' | 'active' | 'locked';

interface Step {
  id: number;
  /** Circle content — either an emoji or a ₹ amount */
  circleContent: string;
  circleType: 'text' | 'emoji';
  title: string;
  subtitle: string;
  /** Optional badge text shown below the circle (e.g. "Claim Now") */
  badge?: string;
  status: StepStatus;
}

// ── Subtle green accent — matches theme.colors.success (#14532D) ───────
// Kept muted/luxury. No bright emerald, no neon.
const ACCENT_GREEN = '#14532D';
const ACCENT_GREEN_SOFT_BG = 'rgba(20, 83, 45, 0.08)';
const ACCENT_GREEN_SOFT_BORDER = 'rgba(20, 83, 45, 0.20)';

// ── Auth detection ─────────────────────────────────────────────────────
function useAuthState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      try {
        const raw = localStorage.getItem('lnk_user');
        if (raw) {
          const parsed = JSON.parse(raw);
          setIsLoggedIn(Boolean(parsed?.isLoggedIn));
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('focus', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  return { isLoggedIn, mounted };
}

// ── Single timeline step ───────────────────────────────────────────────
function TimelineStep({
  step,
}: {
  step: Step;
}) {
  const isCompleted = step.status === 'completed';
  const isActive = step.status === 'active';
  const isLocked = step.status === 'locked';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Circle */}
      <div
        className={`mrb-circle ${isActive ? 'mrb-circle--active' : ''} ${isCompleted ? 'mrb-circle--done' : ''}`}
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isCompleted
            ? ACCENT_GREEN
            : isActive
              ? theme.colors.black
              : theme.colors.offWhite,
          border: isCompleted
            ? `1.5px solid ${ACCENT_GREEN}`
            : isActive
              ? `1.5px solid ${theme.colors.black}`
              : `1.5px solid ${theme.colors.grey200}`,
          color: isLocked ? theme.colors.grey400 : theme.colors.white,
          position: 'relative',
          boxShadow: isActive
            ? `0 4px 14px rgba(0,0,0,0.18), 0 0 0 4px ${ACCENT_GREEN_SOFT_BG}`
            : isCompleted
              ? '0 4px 14px rgba(20, 83, 45, 0.20)'
              : 'none',
          transition: `all ${theme.duration.slow} ${theme.easing.easeOut}`,
        }}
      >
        {step.circleType === 'text' ? (
          <span
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: 15,
              fontWeight: theme.fontWeight.bold,
              letterSpacing: '-0.02em',
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {isCompleted ? '✓' : step.circleContent}
          </span>
        ) : (
          <span style={{ fontSize: 26, lineHeight: 1 }} aria-hidden>
            {isCompleted ? '✓' : step.circleContent}
          </span>
        )}

        {/* Lock icon for locked steps — small, top-right */}
        {isLocked && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: theme.colors.white,
              border: `1px solid ${theme.colors.grey200}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.shadows.xs,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="10"
              height="10"
              fill="none"
              stroke={theme.colors.grey500}
              strokeWidth="2.4"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Sparkle for active step — top-right */}
        {isActive && (
          <div
            aria-hidden
            className="mrb-sparkle"
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: ACCENT_GREEN,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 2px 8px ${ACCENT_GREEN_SOFT_BORDER}`,
            }}
          >
            <svg viewBox="0 0 24 24" width="11" height="11" fill="white">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Title */}
      <span
        style={{
          display: 'block',
          marginTop: 10,
          fontFamily: theme.fontFamily.body,
          fontSize: 12,
          fontWeight: theme.fontWeight.semibold,
          color: isLocked ? theme.colors.grey500 : theme.colors.textPrimary,
          textAlign: 'center',
          letterSpacing: '-0.01em',
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        {step.title}
      </span>

      {/* Subtitle */}
      <span
        style={{
          display: 'block',
          marginTop: 2,
          fontFamily: theme.fontFamily.body,
          fontSize: 10,
          fontWeight: theme.fontWeight.regular,
          color: isLocked ? theme.colors.grey400 : theme.colors.textSecondary,
          textAlign: 'center',
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        {step.subtitle}
      </span>

      {/* Badge below circle */}
      {step.badge && (
        <span
          className={isActive ? 'mrb-badge--active' : ''}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginTop: 8,
            padding: '4px 10px',
            borderRadius: 999,
            fontFamily: theme.fontFamily.body,
            fontSize: 10,
            fontWeight: theme.fontWeight.semibold,
            letterSpacing: '0.02em',
            background: isActive ? ACCENT_GREEN : ACCENT_GREEN_SOFT_BG,
            color: isActive ? theme.colors.white : ACCENT_GREEN,
            border: `1px solid ${isActive ? ACCENT_GREEN : ACCENT_GREEN_SOFT_BORDER}`,
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          {step.badge}
        </span>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────
function MobileRewardsBannerImpl() {
  const { isLoggedIn, mounted } = useAuthState();

  // Don't render until mounted (avoids hydration mismatch on auth state).
  if (!mounted) return null;

  // Build steps based on auth state.
  const steps: Step[] = isLoggedIn
    ? [
        {
          id: 1,
          circleContent: '₹50',
          circleType: 'text',
          title: 'Sign Up',
          subtitle: 'Reward Claimed',
          status: 'completed',
        },
        {
          id: 2,
          circleContent: '👥',
          circleType: 'emoji',
          title: 'First Referral',
          subtitle: 'Earn ₹50',
          status: 'active',
          badge: 'Pending',
        },
        {
          id: 3,
          circleContent: '🛒',
          circleType: 'emoji',
          title: 'First Order',
          subtitle: 'Get ₹100 Cashback',
          status: 'locked',
        },
      ]
    : [
        {
          id: 1,
          circleContent: '₹50',
          circleType: 'text',
          title: 'Sign Up',
          subtitle: 'Instant Wallet Reward',
          status: 'active',
          badge: 'Claim Now',
        },
        {
          id: 2,
          circleContent: '👥',
          circleType: 'emoji',
          title: 'First Referral',
          subtitle: 'Earn ₹50',
          status: 'locked',
        },
        {
          id: 3,
          circleContent: '🛒',
          circleType: 'emoji',
          title: 'First Order',
          subtitle: 'Get ₹100 Cashback',
          status: 'locked',
        },
      ];

  const ctaText = isLoggedIn ? 'Invite Friends' : 'Create Account';
  const ctaHref = isLoggedIn ? '/profile' : '/login';
  const progressLabel = isLoggedIn
    ? '1 of 3 rewards unlocked'
    : '0 of 3 rewards unlocked';

  return (
    <section
      aria-label="Rewards Program"
      style={{
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      <div style={{ padding: `0 ${theme.spacing.sectionPadding}px` }}>
        <article
          className="mrb-card"
          style={{
            position: 'relative',
            background: theme.colors.white,
            borderRadius: theme.radius.productCard, // 24px per spec
            overflow: 'hidden',
            boxShadow: theme.shadows.premium,
            border: `1px solid ${theme.colors.grey150}`,
          }}
        >
          {/* ── Top heading ───────────────────────────────────────────── */}
          <div
            style={{
              padding: `${theme.spacing.xxl}px ${theme.spacing.xxl}px ${theme.spacing.md}px`,
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: theme.fontFamily.body,
                fontSize: 22,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              <span aria-hidden style={{ marginRight: 8 }}>🎁</span>
              Unlock Your Rewards
            </h3>
            <p
              style={{
                margin: '6px 0 0',
                fontFamily: theme.fontFamily.body,
                fontSize: 12,
                fontWeight: theme.fontWeight.regular,
                color: theme.colors.textSecondary,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {progressLabel}
            </p>
          </div>

          {/* ── 3-step timeline ──────────────────────────────────────── */}
          <div
            style={{
              position: 'relative',
              padding: `0 ${theme.spacing.md}px ${theme.spacing.md}px`,
            }}
          >
            {/* Connecting line behind circles */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 32, // half of circle height (64/2)
                left: '20%',
                right: '20%',
                height: 2,
                background: `linear-gradient(to right, ${ACCENT_GREEN} 0%, ${ACCENT_GREEN} 33%, ${theme.colors.grey200} 33%, ${theme.colors.grey200} 100%)`,
                zIndex: 1,
                borderRadius: 2,
              }}
            />

            {/* Steps */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 4,
                position: 'relative',
                zIndex: 2,
              }}
            >
              {steps.map((step) => (
                <TimelineStep
                  key={step.id}
                  step={step}
                />
              ))}
            </div>
          </div>

          {/* ── CTA button ───────────────────────────────────────────── */}
          <div
            style={{
              padding: `0 ${theme.spacing.xxl}px ${theme.spacing.md}px`,
            }}
          >
            <Link
              href={ctaHref}
              aria-label={ctaText}
              onPointerDown={() => haptic.medium()}
              className="mrb-cta pressable"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                height: 52,
                borderRadius: 18,
                // Premium dark gradient — subtle, matte, luxury
                background: `linear-gradient(180deg, ${theme.colors.primaryButton} 0%, ${theme.colors.black} 100%)`,
                color: theme.colors.white,
                fontFamily: theme.fontFamily.body,
                fontSize: 16,
                fontWeight: theme.fontWeight.semibold,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                boxShadow: '0 8px 20px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.10)',
                border: 'none',
                transition: `transform ${theme.duration.instant} ${theme.easing.easeOut}, box-shadow ${theme.duration.fast} ${theme.easing.easeOut}`,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {ctaText}
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                aria-hidden
              >
                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                <polyline
                  points="12 5 19 12 12 19"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </article>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .mrb-card {
          animation: mrb-fade-in ${theme.duration.page} ${theme.easing.easeOut} both;
        }
        .mrb-cta:active {
          transform: scale(${theme.scale.buttonPress});
          box-shadow: 0 4px 12px rgba(0,0,0,0.24);
        }
        @media (hover: hover) {
          .mrb-cta:hover {
            transform: translateY(-1px);
            box-shadow: 0 12px 28px rgba(0,0,0,0.28), 0 4px 8px rgba(0,0,0,0.16);
          }
        }
        .mrb-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }

        /* Active circle — subtle pulsing glow to draw the eye */
        .mrb-circle--active {
          animation: mrb-pulse 2.4s ${theme.easing.easeOut} infinite;
        }
        @keyframes mrb-pulse {
          0%, 100% {
            box-shadow: 0 4px 14px rgba(0,0,0,0.18), 0 0 0 4px rgba(20, 83, 45, 0.08);
          }
          50% {
            box-shadow: 0 4px 14px rgba(0,0,0,0.18), 0 0 0 8px rgba(20, 83, 45, 0.04);
          }
        }

        /* Active badge — subtle glow */
        .mrb-badge--active {
          animation: mrb-badge-glow 2.4s ${theme.easing.easeOut} infinite;
        }
        @keyframes mrb-badge-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(20, 83, 45, 0.0);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(20, 83, 45, 0.12);
          }
        }

        /* Active sparkle — slow rotation twinkle */
        .mrb-sparkle {
          animation: mrb-twinkle 3s ${theme.easing.easeOut} infinite;
          transform-origin: center;
        }
        @keyframes mrb-twinkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
            opacity: 0.85;
          }
        }

        @keyframes mrb-fade-in {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export const MobileRewardsBanner = memo(MobileRewardsBannerImpl);
export default MobileRewardsBanner;
