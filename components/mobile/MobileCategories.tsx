'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { dropShadows } from '@/lib/mobile/theme/shadows';
import { haptic } from '@/lib/mobile/utils/haptics';
import { MOBILE_CATEGORIES } from './mobileProducts';

/**
 * MobileCategories — circular category rail.
 *
 * Horizontal scroller of circular category tiles. Each tile: floating
 * sneaker image inside a soft-grey circle, label below. Premium minimal.
 *
 * LN KICKS theme: white bg, soft grey circles, black labels.
 *
 * Phase 3 polish: design tokens, haptics, focus-visible, memoized.
 */
function MobileCategoriesImpl() {
  return (
    <section style={{ paddingTop: theme.spacing.section }}>
      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
          marginBottom: theme.spacing.xxl,
        }}
      >
        <p
          style={{
            fontSize: theme.fontSize.xs,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: theme.letterSpacing.extreme,
            margin: `0 0 ${theme.spacing.sm}px 0`,
          }}
        >
          Browse by
        </p>
        <h2
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.h2,
            fontWeight: theme.fontWeight.extrabold,
            color: theme.colors.textPrimary,
            letterSpacing: theme.letterSpacing.tight,
            lineHeight: 1,
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Categories
        </h2>
      </div>

      <div
        className="mcat-scroller"
        style={{
          display: 'flex',
          gap: theme.spacing.lg,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          padding: `${theme.spacing.xs}px ${theme.spacing.pad}px ${theme.spacing.md}px`,
        }}
      >
        {MOBILE_CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            aria-label={`Browse ${c.label} category`}
            onPointerDown={() => haptic.selection()}
            className="mcat-link"
            style={{
              flex: '0 0 88px',
              maxWidth: 88,
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: theme.spacing.sm,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: theme.colors.grey50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: `1px solid ${theme.colors.grey150}`,
                transition: `transform ${theme.motion.duration.slow} ${theme.motion.easing.out}`,
              }}
              className="mcat-circle"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.label}
                loading="lazy"
                draggable={false}
                style={{
                  maxWidth: '78%',
                  maxHeight: '78%',
                  objectFit: 'contain',
                  filter: dropShadows.xs,
                }}
              />
            </div>
            <span
              style={{
                fontSize: theme.fontSize.sm,
                fontWeight: theme.fontWeight.semibold,
                color: theme.colors.textPrimary,
                letterSpacing: '0.02em',
                textAlign: 'center',
              }}
            >
              {c.label}
            </span>
          </Link>
        ))}
        <div aria-hidden style={{ flex: `0 0 ${theme.spacing.pad}px`, height: 1 }} />
      </div>

      <style jsx>{`
        .mcat-scroller::-webkit-scrollbar {
          display: none;
        }
        .mcat-circle:hover {
          transform: translateY(-3px) scale(1.03);
        }
        .mcat-link:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
          border-radius: ${theme.radius.md};
        }
      `}</style>
    </section>
  );
}

export const MobileCategories = memo(MobileCategoriesImpl);
export default MobileCategories;
