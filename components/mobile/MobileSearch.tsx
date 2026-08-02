'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileSearch — premium pill search bar.
 *
 * Pure white pill, soft shadow, no border. Magnifying glass + placeholder.
 * Tappable → /search route. No filter button — keeps the bar minimal and
 * luxury, matching the Apple / Nike / GOAT mobile reference.
 *
 * LN KICKS theme: white pill, black icon, soft grey placeholder text.
 * Soft elevation shadow gives the bar a subtle "floating" feel without
 * being heavy. 56px touch-target height (Apple HIG minimum 44px).
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded values)
 *  - Haptic light tick on tap
 *  - Pressed state (scale 0.97)
 *  - Focus-visible ring
 *  - Memoized — stateless, never re-renders
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
        height: theme.spacing.buttonHeight,
        padding: `0 ${theme.spacing.cardGap}px`,
        background: theme.colors.offWhite,
        borderRadius: theme.radius.button,
        boxShadow: theme.shadows.premium,
        textDecoration: 'none',
        color: theme.colors.textTertiary,
        transition: `box-shadow ${theme.duration.standard} ${theme.easing.easeOut}, transform ${theme.duration.instant} ${theme.easing.easeOut}`,
      }}
    >
      {/* Action icon = 22px per Phase 6 spec */}
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        aria-hidden
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </svg>
      <span
        style={{
          fontFamily: theme.fontFamily.body,
          fontSize: theme.fontSize.lg,
          fontWeight: theme.fontWeight.regular,
          color: theme.colors.textTertiary,
          letterSpacing: theme.letterSpacing.normal,
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        Search sneakers, brands, collections...
      </span>
      <style jsx>{pressableStyle}</style>
    </Link>
  );
}

export const MobileSearch = memo(MobileSearchImpl);
export default MobileSearch;
