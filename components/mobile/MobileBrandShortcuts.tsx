'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';

/**
 * MobileBrandShortcuts — premium horizontal scrolling capsule pills.
 *
 * PHASE 7 PREMIUM REDESIGN
 *   - Premium pill buttons with softer shadow (shadows.sm)
 *   - Better padding (10px × 18px) for more breathing room
 *   - Active state: matte black bg + white text + subtle elevation
 *   - Inactive state: white bg + black text + soft border
 *   - Apple-style spring transition (cubic-bezier(0.34, 1.56, 0.64, 1))
 *   - Press scale 0.95 for tactile feedback
 *   - Larger touch target (40px min height)
 *
 * Selection state is purely visual (first item defaults to active).
 * Tapping a chip navigates to /products?brand=<slug>.
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
    <section
      aria-label="Brand shortcuts"
    >
      <div
        className="mbs-scroller"
        role="list"
        style={{
          display: 'flex',
          gap: theme.spacing.sm,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: `${theme.spacing.xs}px ${theme.spacing.sectionPadding}px ${theme.spacing.sm}px`,
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
                // Phase 8: tighter padding (6px × 14px)
                padding: `${theme.spacing.sm - 2}px ${theme.spacing.md}px`,
                borderRadius: theme.radius.pill,
                // Phase 8: white bg for inactive
                background: isActive
                  ? theme.colors.primaryButton
                  : theme.colors.white,
                color: isActive
                  ? theme.colors.buttonText
                  : theme.colors.textPrimary,
                textDecoration: 'none',
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.semibold,
                letterSpacing: theme.letterSpacing.normal,
                whiteSpace: 'nowrap',
                minHeight: 32,
                // Phase 8: softer shadow on active, hairline border on inactive
                boxShadow: isActive
                  ? theme.shadows.sm
                  : theme.shadows.hairline,
                border: '1px solid transparent',
                // Phase 8: spring-like transition for Apple-quality feedback
                transition: `background-color ${theme.duration.standard} ${theme.easing.spring}, color ${theme.duration.standard} ${theme.easing.spring}, transform ${theme.duration.instant} ${theme.easing.easeOut}, box-shadow ${theme.duration.standard} ${theme.easing.easeOut}`,
                fontFeatureSettings: theme.fontFeatures,
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
          transform: scale(0.95);
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
