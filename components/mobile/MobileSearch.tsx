'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileSearch — premium pill search bar.
 *
 * PHASE 7 PREMIUM REDESIGN
 *   - Taller 52px (was 48px) for better touch target + visual weight
 *   - Premium soft shadow (shadows.search — diffuse, premium)
 *   - Softer border (1px grey200, was none)
 *   - Better icon alignment (22px icon, 12px gap)
 *   - More horizontal padding (20px, was 16px)
 *   - Apple-style press scale (0.97) + haptic feedback
 *
 * LN KICKS theme: white pill, black icon, soft grey placeholder text.
 */
function MobileSearchImpl() {
  return (
    <Link
      href="/search"
      aria-label="Search sneakers, brands, and collections"
      className="pressable ms-search"
      onPointerDown={() => haptic.light()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm + 2,
        // Phase 8: 44px height (Material Design minimum touch target)
        height: 44,
        // Phase 8: 14px horizontal padding
        padding: `0 ${theme.spacing.md}px`,
        background: theme.colors.white,
        borderRadius: theme.radius.button,
        // Phase 8: lighter shadow + softer border
        boxShadow: theme.shadows.search,
        border: `1px solid ${theme.colors.grey200}`,
        textDecoration: 'none',
        color: theme.colors.textTertiary,
        transition: `box-shadow ${theme.duration.standard} ${theme.easing.easeOut}, transform ${theme.duration.instant} ${theme.easing.easeOut}, border-color ${theme.duration.standard} ${theme.easing.easeOut}`,
      }}
    >
      {/* Action icon = 18px per Phase 8 spec */}
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        aria-hidden
        style={{ flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </svg>
      <span
        style={{
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.md,
          fontWeight: theme.fontWeight.regular,
          color: theme.colors.textTertiary,
          letterSpacing: theme.letterSpacing.normal,
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        Search sneakers, brands, collections...
      </span>
      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .ms-search:active {
          transform: scale(${theme.scale.buttonPress});
        }
        @media (hover: hover) {
          .ms-search:hover {
            border-color: ${theme.colors.grey300};
            box-shadow: ${theme.shadows.md};
          }
        }
      `}</style>
    </Link>
  );
}

export const MobileSearch = memo(MobileSearchImpl);
export default MobileSearch;
