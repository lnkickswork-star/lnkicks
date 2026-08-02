'use client';

import React, { memo, useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { dropShadows } from '@/lib/mobile/theme/shadows';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { MOBILE_RECOMMENDED } from './mobileProducts';

/**
 * MobileRecommended — "Recommended For You" 2-column grid.
 *
 * PHASE 7 PREMIUM REDESIGN
 *   - 24px radius (radius.productCard) — matches Popular/New cards
 *   - Larger image area (4:3 aspect ratio, was 150px fixed height)
 *   - 22px internal padding — luxury breathing room
 *   - Product Name: 20px / 600 (was 16px)
 *   - Price: 22px / 700 (was 18px)
 *   - Brand: 12px / 500 gray (unchanged)
 *   - Rating: small minimal light gray stars
 *   - Floating circular Add button bottom-right with RIPPLE effect
 *   - Replaced the wide "Add to Cart" button with a small floating + button
 *   - Consistent card system across all product surfaces
 *
 * LN KICKS theme: white bg, black text, black price, black star rating,
 * floating black + button. Minimal luxury.
 */

/* ── Ripple effect for the Add button ─────────────────────────── */
type Ripple = { id: number; x: number; y: number };

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);

  const trigger = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++idRef.current;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  return { ripples, trigger };
}

function MobileRecommendedImpl() {
  const { addToCart, showToast } = useApp();

  const handleAddToCart = useCallback(
    (p: typeof MOBILE_RECOMMENDED[number]) => {
      haptic.light();
      addToCart({
        id: p.id,
        name: p.name,
        price: p.priceValue,
        image: p.image,
        qty: 1,
      });
      showToast(`${p.name} added to cart`);
    },
    [addToCart, showToast],
  );

  return (
    <section>
      <div
        style={{
          padding: `0 ${theme.spacing.sectionPadding}px`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.sectionPadding,
          gap: theme.spacing.md,
        }}
      >
        <div>
          {/* Eyebrow — 12px / 500 / uppercase / 0.5px tracking */}
          <p
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.caption,
              fontWeight: theme.fontWeight.medium,
              color: theme.colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: theme.letterSpacing.brandName,
              margin: `0 0 ${theme.spacing.sm}px 0`,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Picked For You
          </p>
          {/* Section Heading — 24px / 700 / 30px line height */}
          <h2
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.section,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.section,
              margin: 0,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Recommended
          </h2>
        </div>
        <Link
          href="/products?filter=recommended"
          aria-label="See all recommended products"
          onPointerDown={() => haptic.light()}
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.semibold,
            color: theme.colors.textPrimary,
            letterSpacing: theme.letterSpacing.normal,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            paddingBottom: 2,
            borderBottom: `1.5px solid ${theme.colors.black}`,
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          See All
        </Link>
      </div>

      <div
        style={{
          padding: `0 ${theme.spacing.sectionPadding}px`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.spacing.cardGapLg,
        }}
      >
        {MOBILE_RECOMMENDED.map((p) => (
          <RecommendedCard
            key={p.id}
            product={p}
            onAdd={handleAddToCart}
          />
        ))}
      </div>

      <style jsx>{pressableStyle}</style>
    </section>
  );
}

/* ── Single recommended card ──────────────────────────────────── */
type RecommendedCardProps = {
  product: typeof MOBILE_RECOMMENDED[number];
  onAdd: (p: typeof MOBILE_RECOMMENDED[number]) => void;
};

function RecommendedCardImpl({ product: p, onAdd }: RecommendedCardProps) {
  const { ripples, trigger } = useRipple();

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    trigger(e);
    onAdd(p);
  };

  return (
    <article
      className="mrec-tile pressable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: theme.colors.white,
        // Phase 8: 20px radius (smaller, more app-like)
        borderRadius: theme.radius.card,
        border: 'none',
        boxShadow: theme.shadows.premium,
        overflow: 'hidden',
        position: 'relative',
        transition: `transform ${theme.duration.standard} ${theme.easing.easeOut}, box-shadow ${theme.duration.standard} ${theme.easing.easeOut}`,
      }}
    >
      {/* Image area — Phase 8: 4:3 aspect ratio, transparent background */}
      <Link
        href={p.href}
        aria-label={`${p.brand} ${p.name} — ${p.price}`}
        onPointerDown={() => haptic.selection()}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          aspectRatio: '4 / 3',
          background: 'transparent',
          overflow: 'hidden',
          padding: theme.spacing.sm + 2,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="mrec-img"
          style={{
            maxWidth: '92%',
            maxHeight: '92%',
            objectFit: 'contain',
            filter: dropShadows.md,
            transition: `transform ${theme.duration.slow} ${theme.easing.easeOut}, filter ${theme.duration.slow} ${theme.easing.easeOut}`,
          }}
        />
      </Link>

      <div
        style={{
          // Phase 8: 14px card padding
          padding: `${theme.spacing.xs + 2}px ${theme.spacing.cardPadding}px ${theme.spacing.cardPadding}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Link
          href={p.href}
          style={{ textDecoration: 'none', color: 'inherit' }}
          onPointerDown={() => haptic.selection()}
        >
          {/* Product Name — Phase 9: only name, no brand/category text */}
          <h3
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: theme.fontSize.productNameLg,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textPrimary,
              lineHeight: theme.lineHeight.product,
              letterSpacing: theme.letterSpacing.normal,
              margin: 0,
              minHeight: 38,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {p.name}
          </h3>
        </Link>

        {/* Simple Price — Phase 9: single price only, no sale/compare price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            marginTop: theme.spacing.xs,
            marginBottom: theme.spacing.sm,
          }}
        >
          <span
            style={{
              fontFamily: theme.fontFamily.body,
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeight.bold,
              fontSize: theme.fontSize.priceLg,
              letterSpacing: theme.letterSpacing.normal,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {p.price}
          </span>
        </div>

        {/* Floating Add-to-Cart button — bottom-right corner with ripple */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${p.name} to cart`}
          className="pressable mrec-add"
          style={{
            position: 'absolute',
            bottom: theme.spacing.cardPadding,
            right: theme.spacing.cardPadding,
            width: 32,
            height: 32,
            // Phase 11 (revised): perfect CIRCLE per latest reference design
            // (ChatGPT_Image_Aug_2__2026__03_30_02_PM). Solid black bg, white + icon.
            borderRadius: '50%',
            background: theme.colors.primaryButton,
            color: theme.colors.buttonText,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: theme.shadows.fab,
            zIndex: 2,
            overflow: 'hidden',
          }}
        >
          {/* Card icon = 16px */}
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            aria-hidden
            style={{ pointerEvents: 'none', zIndex: 1 }}
          >
            <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
          </svg>
          {ripples.map((r) => (
            <span
              key={r.id}
              aria-hidden
              className="mrec-ripple"
              style={{
                position: 'absolute',
                left: r.x,
                top: r.y,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.45)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          ))}
        </button>
      </div>

      <style jsx>{`
        @media (hover: hover) {
          .mrec-tile:hover {
            transform: scale(${theme.scale.cardHover});
            box-shadow: ${theme.shadows.premiumLg};
          }
          .mrec-tile:hover .mrec-img {
            transform: translateY(-4px) scale(1.04);
            filter: ${dropShadows.lg};
          }
        }
        .mrec-tile:active {
          transform: scale(${theme.scale.buttonPress});
        }
        .mrec-add:active {
          transform: scale(${theme.scale.buttonPress});
        }
        .mrec-ripple {
          animation: mrec-ripple-anim 600ms ${theme.easing.easeOut} forwards;
        }
        @keyframes mrec-ripple-anim {
          0% {
            width: 8px;
            height: 8px;
            opacity: 0.6;
          }
          100% {
            width: 120px;
            height: 120px;
            opacity: 0;
          }
        }
      `}</style>
    </article>
  );
}

const RecommendedCard = memo(RecommendedCardImpl);

export const MobileRecommended = memo(MobileRecommendedImpl);
export default MobileRecommended;
