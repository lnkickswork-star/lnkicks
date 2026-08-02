'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileAdidasBanner — promotional banner below the brand shortcuts.
 *
 * Displays the Adidas promo image with:
 *   - 28px rounded corners (radius.largeCard)
 *   - Premium editorial shadow (shadows.editorial)
 *   - Subtle press scale + haptic feedback
 *   - 24px horizontal page padding (matches section padding)
 *   - 32px vertical section spacing (Phase 7 spec)
 *
 * Tappable → /products?brand=adidas route.
 *
 * Mobile-only — desktop homepage is not modified.
 */

function MobileAdidasBannerImpl() {
  return (
    <section
      aria-label="Adidas promotional banner"
      style={{
        // Phase 10: consistent 8px-system spacing (16px top, 20px bottom)
        paddingTop: theme.spacing.sectionPadding,
        paddingBottom: theme.spacing.sectionGap,
      }}
    >
      <div style={{ padding: `0 ${theme.spacing.sectionPadding}px` }}>
        <Link
          href="/products?brand=adidas"
          aria-label="Shop Adidas collection"
          onPointerDown={() => haptic.light()}
          className="mab-card pressable"
          style={{
            display: 'block',
            // Phase 8: 20px rounded corners (was 28px)
            borderRadius: theme.radius.card,
            overflow: 'hidden',
            boxShadow: theme.shadows.premium,
            border: 'none',
            position: 'relative',
            background: theme.colors.offWhite,
            transition: `transform ${theme.duration.standard} ${theme.easing.easeOut}, box-shadow ${theme.duration.standard} ${theme.easing.easeOut}`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banners/adidas-promo.jpg"
            alt="Shop the new Adidas collection at LN KICKS"
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              aspectRatio: '736 / 345',
              objectFit: 'cover',
            }}
          />

          <style jsx>{pressableStyle}</style>
          <style jsx>{`
            .mab-card:active {
              transform: scale(${theme.scale.buttonPress});
            }
            @media (hover: hover) {
              .mab-card:hover {
                transform: scale(${theme.scale.cardHover});
                box-shadow: ${theme.shadows.editorialLg};
              }
            }
            .mab-card:focus-visible {
              outline: 2px solid ${theme.colors.black};
              outline-offset: 3px;
            }
          `}</style>
        </Link>
      </div>
    </section>
  );
}

export const MobileAdidasBanner = memo(MobileAdidasBannerImpl);
export default MobileAdidasBanner;
