'use client';

import React, { useState, useEffect, memo } from 'react';
import { theme } from '@/lib/mobile/theme/theme';
import { safeArea } from '@/lib/mobile/utils/safeArea';

/**
 * MobileLuxuryBar — slim premium announcement bar at the very top.
 *
 * Sits above MobileHeader. Matte black background, white text, slowly
 * rotating luxury status messages (authenticated / shipping / returns /
 * drops). Tiny height (28px) so it doesn't eat into the header.
 *
 * LN KICKS theme: pure black bar, white text, soft fade between messages.
 * Safe-area-aware: padding-top extends into the iOS status bar / Dynamic
 * Island area so the bar tucks under the notch cleanly.
 *
 * Memoized — message rotation causes re-render every 3.2s; memoizing
 * prevents unnecessary parent re-renders from re-mounting this bar.
 */
const MESSAGES = [
  'AUTHENTICATED BY CHECKCHECK & LEGITAPP',
  'FREE EXPRESS SHIPPING OVER ₹5,000',
  '7-DAY EASY RETURNS · 100% MONEY-BACK',
  'NEW DROPS EVERY FRIDAY · MEMBERS ONLY',
  'STOCKED IN INDIA · DISPATCHED IN 24H',
] as const;

function MobileLuxuryBarImpl() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: theme.colors.black,
        color: theme.colors.white,
        // Safe-area-aware: status bar (Dynamic Island) on iOS extends to ~59px
        paddingTop: safeArea.paddingTop,
        height: `calc(28px + ${safeArea.paddingTop})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        zIndex: theme.zIndex.bar,
      }}
    >
      <div
        key={idx}
        className="mlb-text"
        style={{
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.bold,
          letterSpacing: theme.letterSpacing.widest,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.92)',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: theme.colors.white,
            display: 'inline-block',
          }}
        />
        {MESSAGES[idx]}
      </div>

      <style jsx>{`
        .mlb-text {
          animation: mlb-fade ${theme.motion.duration.long} ${theme.motion.easing.out};
        }
        @keyframes mlb-fade {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export const MobileLuxuryBar = memo(MobileLuxuryBarImpl);
export default MobileLuxuryBar;
