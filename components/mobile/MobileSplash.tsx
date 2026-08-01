'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { theme } from '@/lib/mobile/theme/theme';
import { dropShadows } from '@/lib/mobile/theme/shadows';
import { transitions } from '@/lib/mobile/theme/motion';
import { safeArea } from '@/lib/mobile/utils/safeArea';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle, pressableStrongStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileSplash — luxury fullscreen splash screen.
 *
 * Premium white background. Black LNKICKS wordmark. Two floating
 * sneaker PNGs with soft drop-shadow. "Get Started" black pill CTA.
 * Auto-dismisses after 4s. SKIP button in top-right.
 *
 * LN KICKS theme: pure white + black + soft grey. No blue, no gradients.
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded values)
 *  - Safe-area-aware: padding-top clears Dynamic Island / status bar
 *  - Haptic feedback (medium) on Get Started / Skip tap
 *  - Pressed state on CTAs
 *  - Focus-visible ring for keyboard users
 *  - aria-label on CTAs
 *  - Memoized — splash state is internal, parent re-renders don't affect it
 *
 * NOTE: Uses external CDN image URLs because the local /public/*.png
 * files are Git LFS pointers (broken in this repo). See worklog
 * phase-2-enterprise-modernization for details.
 */
function MobileSplashImpl({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    // Allow fade-out to play before unmount
    setTimeout(onDone, 380);
  }, [exiting, onDone]);

  // Auto-dismiss after 4s
  useEffect(() => {
    const t = setTimeout(dismiss, 4000);
    return () => clearTimeout(t);
  }, [dismiss]);

  return (
    <div
      className={`m-splash ${exiting ? 'm-splash--out' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to LNKICKS"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.colors.white,
        zIndex: theme.zIndex.splash,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // Safe-area-aware padding — clears Dynamic Island / notch
        padding: `calc(56px + ${safeArea.paddingTop}) ${theme.spacing.xxl}px calc(32px + ${safeArea.paddingBottom})`,
        boxSizing: 'border-box',
      }}
    >
      {/* Top row: wordmark + skip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.extrabold,
            letterSpacing: theme.letterSpacing.widest,
            color: theme.colors.textPrimary,
          }}
        >
          LNKICKS
        </div>
        <button
          type="button"
          onClick={() => {
            haptic.medium();
            dismiss();
          }}
          aria-label="Skip splash screen"
          className="pressable"
          style={{
            fontSize: theme.fontSize.sm,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: theme.letterSpacing.widest,
            textTransform: 'uppercase',
            color: theme.colors.textSecondary,
            padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
            background: 'rgba(0,0,0,0.04)',
            borderRadius: theme.radius.pill,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Skip
        </button>
      </div>

      {/* Middle: floating sneakers + vertical wordmark */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: `${theme.spacing.xxl}px 0`,
          overflow: 'hidden',
        }}
      >
        {/* Vertical LNKICKS wordmark behind */}
        <div
          aria-hidden
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.watermark,
            fontWeight: theme.fontWeight.black,
            letterSpacing: '0.04em',
            color: theme.colors.textPrimary,
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 0.9,
            opacity: 0.06,
            zIndex: 1,
          }}
        >
          LNKICKS
        </div>

        {/* Floating sneaker 1 — top-left, rotated */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw"
          alt="Air Jordan 1"
          width={180}
          height={180}
          loading="eager"
          style={{
            position: 'absolute',
            top: '4%',
            left: '0%',
            width: 180,
            height: 'auto',
            filter: dropShadows.lg,
            transform: 'rotate(-28deg)',
            zIndex: 3,
          }}
        />

        {/* Floating sneaker 2 — bottom-right, rotated */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw"
          alt="Adidas Samba OG"
          width={190}
          height={190}
          loading="eager"
          style={{
            position: 'absolute',
            bottom: '6%',
            right: '0%',
            width: 190,
            height: 'auto',
            filter: dropShadows.lg,
            transform: 'rotate(24deg)',
            zIndex: 3,
          }}
        />
      </div>

      {/* Bottom: headline + CTA */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <p
          style={{
            fontSize: theme.fontSize.xs,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: theme.letterSpacing.extreme,
            margin: `0 0 ${theme.spacing.md + 2}px 0`,
          }}
        >
          Authenticated Luxury
        </p>
        <h1
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.hero,
            fontWeight: theme.fontWeight.extrabold,
            lineHeight: theme.lineHeight.tight,
            color: theme.colors.textPrimary,
            letterSpacing: theme.letterSpacing.tight,
            margin: `0 0 ${theme.spacing.xxl + 4}px 0`,
            textTransform: 'uppercase',
          }}
        >
          Start your<br />sneaker journey
        </h1>
        <button
          type="button"
          onClick={() => {
            haptic.medium();
            dismiss();
          }}
          aria-label="Get started — enter LN KICKS"
          className="pressable-strong"
          style={{
            width: '100%',
            background: theme.colors.black,
            borderRadius: theme.radius.pill,
            padding: `${theme.spacing.xxxl - 10}px ${theme.spacing.xxl + 4}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: theme.colors.white,
            cursor: 'pointer',
            border: 'none',
            boxShadow: theme.shadows.xl,
          }}
        >
          <span
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            Get Started
          </span>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .m-splash {
          opacity: 1;
          transition: ${transitions.splash};
        }
        .m-splash--out {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
      <style jsx>{pressableStyle}</style>
      <style jsx>{pressableStrongStyle}</style>
    </div>
  );
}

export const MobileSplash = memo(MobileSplashImpl);
export default MobileSplash;
