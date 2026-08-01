'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';

/**
 * MobileBrandShortcuts — horizontal scrolling circular brand chips.
 *
 * 10 premium brands: Nike, Jordan, Adidas, Puma, New Balance, ASICS,
 * Converse, Vans, Reebok, HOKA. Pure monochrome text-based logos on
 * soft-grey circular chips. Active chip = solid black bg + white text.
 *
 * LN KICKS theme: white bg, soft grey circles, black text, no colorful
 * logos. Premium minimal.
 *
 * Phase 3 polish:
 *  - Design tokens
 *  - Haptic selection tick on tap
 *  - Pressed state (scale 0.96)
 *  - Focus-visible ring
 *  - Memoized
 *  - ARIA: section label, role="list" semantics
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
  return (
    <section
      aria-label="Brand shortcuts"
      style={{
        paddingTop: theme.spacing.gutter,
        paddingBottom: theme.spacing.hairline,
      }}
    >
      <div
        className="mbs-scroller"
        role="list"
        style={{
          display: 'flex',
          gap: theme.spacing.sm + 2,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: `0 ${theme.spacing.gutter}px`,
        }}
      >
        {BRANDS.map((b, i) => {
          const isActive = i === 0; // Nike as default-active for visual interest
          return (
            <Link
              key={b.id}
              href={b.href}
              role="listitem"
              aria-label={`Shop ${b.label}`}
              onPointerDown={() => haptic.selection()}
              className="mbs-chip"
              style={{
                flex: '0 0 auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                padding: `${theme.spacing.sm}px ${theme.spacing.lg}px ${theme.spacing.sm}px ${theme.spacing.sm}px`,
                borderRadius: theme.radius.pill,
                background: isActive ? theme.colors.black : theme.colors.grey50,
                color: isActive ? theme.colors.white : theme.colors.textPrimary,
                textDecoration: 'none',
                transition: `background-color ${theme.motion.duration.slow} ${theme.motion.easing.out}, color ${theme.motion.duration.normal} ${theme.motion.easing.out}, transform ${theme.motion.duration.instant} ${theme.motion.easing.out}`,
                border: isActive
                  ? `1px solid ${theme.colors.black}`
                  : '1px solid transparent',
              }}
            >
              {/* Brand monogram circle */}
              <span
                aria-hidden
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: isActive ? 'rgba(255,255,255,0.15)' : theme.colors.white,
                  color: isActive ? theme.colors.white : theme.colors.textPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: theme.fontSize.sm,
                  fontWeight: theme.fontWeight.extrabold,
                  fontFamily: theme.fontFamily.display,
                  letterSpacing: theme.letterSpacing.wide,
                  border: isActive
                    ? '1px solid rgba(255,255,255,0.18)'
                    : `1px solid ${theme.colors.border}`,
                }}
              >
                {b.label.charAt(0)}
              </span>
              <span
                style={{
                  fontSize: theme.fontSize.base,
                  fontWeight: theme.fontWeight.bold,
                  letterSpacing: theme.letterSpacing.wide,
                  whiteSpace: 'nowrap',
                }}
              >
                {b.label}
              </span>
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
