'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';

/**
 * MobileBrandShortcuts — horizontal scrolling capsule pills.
 *
 * Pure-minimal layout matching the reference:
 *   - 10 brands: Nike, Jordan, Adidas, Puma, New Balance, ASICS,
 *     Converse, Vans, Reebok, HOKA
 *   - Active pill: matte black bg + white text
 *   - Inactive pill: soft grey bg + black text
 *   - Fully rounded capsule shape (radius.pill)
 *   - Horizontal scroll, hidden scrollbar, momentum scroll on iOS
 *
 * Selection state is purely visual (first item defaults to active).
 * Tapping a chip navigates to /products?brand=<slug> — the actual
 * filter happens on the products page (no duplicate logic).
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded values)
 *  - Haptic selection tick on tap
 *  - Pressed state (scale 0.96)
 *  - Focus-visible ring for keyboard navigation
 *  - ARIA: role="list" + aria-label per item
 *  - Memoized — never re-renders unless active index changes
 */

const BRANDS = [
  { id: 'nike', label: 'Nike', href: '/products?brand=nike' },
  { id: 'jordan', label: 'Jordan', href: '/products?brand=jordan' },
  { id: 'adidas', label: 'Adidas', href: '/products?brand=adidas' },
  { id: 'puma', label: 'Puma', href: '/products?brand=puma' },
  { id: 'newbalance', label: 'New Balance', href: '/products?brand=new-balance' },
  { id: 'asics', label: 'ASICS', href: '/products?brand=asics' },
  { id: 'converse', label: 'Converse', href: '/products?brand=converse' },
  { id: 'vans', label: 'Vans', href: '/products?brand=vans' },
  { id: 'reebok', label: 'Reebok', href: '/products?brand=reebok' },
  { id: 'hoka', label: 'HOKA', href: '/products?brand=hoka' },
] as const;

function MobileBrandShortcutsImpl() {
  const [activeId, setActiveId] = useState<string>('nike');

  return (
    <section aria-label="Brand shortcuts" style={{ paddingTop: theme.spacing.lg }}>
      <div
        className="mbs-scroller"
        role="list"
        style={{
          display: 'flex',
          gap: theme.spacing.sm,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: `0 ${theme.spacing.pad}px`,
        }}
      >
        {BRANDS.map((b) => {
          const isActive = b.id === activeId;
          return (
            <Link
              key={b.id}
              href={b.href}
              role="listitem"
              aria-label={`Shop ${b.label}`}
              aria-current={isActive ? 'true' : undefined}
              onPointerDown={() => {
                haptic.selection();
                setActiveId(b.id);
              }}
              className="mbs-chip"
              style={{
                flex: '0 0 auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `${theme.spacing.sm + 2}px ${theme.spacing.lg + 2}px`,
                borderRadius: theme.radius.pill,
                background: isActive ? theme.colors.black : theme.colors.offWhite,
                color: isActive ? theme.colors.white : theme.colors.textPrimary,
                textDecoration: 'none',
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.semibold,
                letterSpacing: theme.letterSpacing.tight,
                whiteSpace: 'nowrap',
                transition: `background-color ${theme.motion.duration.normal} ${theme.motion.easing.out}, color ${theme.motion.duration.normal} ${theme.motion.easing.out}, transform ${theme.motion.duration.instant} ${theme.motion.easing.out}`,
                border: '1px solid transparent',
                boxShadow: isActive ? 'none' : theme.shadows.hairline,
              }}
            >
              {b.label}
            </Link>
          );
        })}
        <div aria-hidden style={{ flex: '0 0 4px', height: 1 }} />
      </div>

      <style jsx>{`
        .mbs-scroller::-webkit-scrollbar {
          display: none;
        }
        .mbs-chip {
          -webkit-tap-highlight-color: transparent;
        }
        .mbs-chip:active {
          transform: scale(0.96);
        }
        .mbs-chip:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
      `}</style>
    </section>
  );
}

export const MobileBrandShortcuts = memo(MobileBrandShortcutsImpl);
export default MobileBrandShortcuts;
