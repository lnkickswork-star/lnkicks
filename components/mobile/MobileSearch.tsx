'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileSearch — premium search bar.
 *
 * White pill with soft shadow. Magnifying glass icon + placeholder text.
 * Filter icon button on the right. Tappable, links to /search.
 *
 * LN KICKS theme: white pill, black icons, soft grey placeholder.
 *
 * Phase 3 polish:
 *  - Design tokens
 *  - Haptic light tick on tap (both search + filter)
 *  - Pressed state (scale 0.97 on filter button)
 *  - Focus-visible ring
 *  - Memoized — stateless component, no re-render needed
 */
function MobileSearchImpl() {
  return (
    <div
      style={{
        background: theme.colors.white,
        borderRadius: theme.radius.pill,
        height: 52,
        padding: `0 ${theme.spacing.xs + 2}px 0 ${theme.spacing.pad}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: theme.shadows.xs,
        border: `1px solid ${theme.colors.divider}`,
      }}
    >
      <Link
        href="/search"
        aria-label="Search sneakers, brands, and collections"
        className="pressable ms-search-link"
        onPointerDown={() => haptic.light()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm + 2,
          flex: 1,
          textDecoration: 'none',
          color: theme.colors.textTertiary,
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 13.5, fontWeight: theme.fontWeight.medium }}>
          Search sneakers, brands, collections...
        </span>
      </Link>
      <Link
        href="/filters"
        aria-label="Open filters"
        className="pressable ms-filter-btn"
        onPointerDown={() => haptic.light()}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: theme.colors.black,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.white,
          textDecoration: 'none',
          border: 'none',
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <line x1="4" y1="21" x2="4" y2="14" strokeLinecap="round" />
          <line x1="4" y1="10" x2="4" y2="3" strokeLinecap="round" />
          <line x1="12" y1="21" x2="12" y2="12" strokeLinecap="round" />
          <line x1="12" y1="8" x2="12" y2="3" strokeLinecap="round" />
          <line x1="20" y1="21" x2="20" y2="16" strokeLinecap="round" />
          <line x1="20" y1="12" x2="20" y2="3" strokeLinecap="round" />
          <line x1="1" y1="14" x2="7" y2="14" strokeLinecap="round" />
          <line x1="9" y1="8" x2="15" y2="8" strokeLinecap="round" />
          <line x1="17" y1="16" x2="23" y2="16" strokeLinecap="round" />
        </svg>
      </Link>
      <style jsx>{pressableStyle}</style>
    </div>
  );
}

export const MobileSearch = memo(MobileSearchImpl);
export default MobileSearch;
