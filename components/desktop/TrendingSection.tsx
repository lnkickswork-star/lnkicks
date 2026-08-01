'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

/**
 * TrendingSection — luxury editorial "Trending This Week" coverflow.
 *
 * Spec contract (do not regress):
 *  - Section header: "RIGHT NOW" eyebrow + "Trending This Week" heading
 *    ("Trending" regular weight, "This Week" italic). "VIEW ALL" button
 *    is outlined (white bg, thin black border), top-right.
 *  - Behind cards: huge "LNKICKSLNKICKSLNKICKSLNKICKS" wordmark (no
 *    spaces, all caps, opacity ~6%) continuously translating LEFT → RIGHT
 *    via GPU-only `transform`, 60s linear infinite loop.
 *  - 3D coverflow: center card flat & full size; side cards rotated
 *    (rotateY ±35°), scaled (0.82), translated back, opacity dimmed
 *    (0.55 for absOffset=1, 0.22 for absOffset=2). Cards beyond
 *    absOffset > 2 hidden for perf.
 *  - Card layout (vertical, matches screenshot):
 *        ┌─────────────────────┐
 *        │     product image   │  ← ~58% of card height
 *        ├─────────────────────┤
 *        │ CATEGORY            │
 *        │ Product Name        │
 *        │ ₹price  ₹old-price  │
 *        │            [BUY NOW]│
 *        └─────────────────────┘
 *  - Autoplay: every 4000ms, infinite loop, pauses on hover/pointer-down.
 *  - Manual interactions: drag, swipe, mouse wheel, trackpad, click
 *    side card, keyboard ←/→, prev/next circle buttons.
 *  - Bottom controls: small prev circle, thin pagination lines
 *    (active = longer + black, inactive = short + light grey), small
 *    next circle. No dots, no thumbnails.
 *  - Products loaded dynamically from PRODUCT_REGISTRY. Selection
 *    priority: trending/featured → bestSeller → newArrival →
 *    limitedEdition → fallback to all (latest first).
 *
 * Performance:
 *  - GPU-only transforms (translateX, translateZ, rotateY, scale).
 *  - `will-change: transform, opacity` only on visible slides.
 *  - Images lazy-loaded (center card eager on first paint).
 *  - No layout thrash, no re-render loop, no CLS.
 */

/* ─────────────────────────────────────────────────────────────────────
   1. Types & data
   ───────────────────────────────────────────────────────────────────── */

interface TrendingCard {
  id: string;
  brand: string;
  category: string;
  name: string;
  price: string;
  comparePrice: string;
  image: string;
  href: string;
}

/** Format an INR integer as `Rs. 12,999.00` (matches project convention). */
function formatINR(value: number): string {
  return 'Rs. ' + value.toLocaleString('en-IN') + '.00';
}

/**
 * Build the trending list dynamically from the project's canonical
 * PRODUCT_REGISTRY. Never hardcodes products.
 *
 * Priority chain (the first non-empty bucket wins, then we fall back
 * to the next; final fallback is all products):
 *   1. featured  (trending / featured)
 *   2. bestSeller
 *   3. newArrival (latest)
 *   4. limitedEdition
 *   5. all products (latest first)
 *
 * We always show between 5 and 8 items — enough for a rich coverflow
 * without overcrowding the stage.
 */
function buildTrendingList(): TrendingCard[] {
  const featured = PRODUCT_REGISTRY.filter((p) => p.featured);
  const bestSellers = PRODUCT_REGISTRY.filter((p) => p.bestSeller);
  const newArrivals = PRODUCT_REGISTRY.filter((p) => p.newArrival);
  const limited = PRODUCT_REGISTRY.filter((p) => p.limitedEdition);

  const pool =
    featured.length >= 3
      ? featured
      : bestSellers.length >= 3
      ? bestSellers
      : newArrivals.length >= 3
      ? newArrivals
      : limited.length >= 3
      ? limited
      : PRODUCT_REGISTRY; // fallback — all products (latest first)

  // Cap at 8 for performance; never fewer than 3 (coverflow needs neighbors).
  const sliced = pool.slice(0, Math.min(8, Math.max(3, pool.length)));

  return sliced.map((p) => ({
    id: p.id,
    brand: p.brand,
    category: p.category,
    name: p.name,
    price: formatINR(p.price),
    comparePrice: p.comparePrice ? formatINR(p.comparePrice) : '',
    image: p.primaryImage,
    href: `/product/${p.slug}`,
  }));
}

/* ─────────────────────────────────────────────────────────────────────
   2. Constants
   ───────────────────────────────────────────────────────────────────── */

const AUTOPLAY_MS = 4000;
const TRANSITION_MS = 700;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Coverflow geometry — tuned to match the screenshot.
const CARD_WIDTH = 460;
const CARD_HEIGHT = 580;
const SIDE_OFFSET_X = 300; // horizontal distance between adjacent cards
const SIDE_ROTATE_Y = 35; // degrees
const SIDE_SCALE = 0.82;
const SIDE_TRANSLATE_Z = -180;

// Repeated marquee text. NO spaces, all caps — per spec.
const MARQUEE_TEXT = 'LNKICKSLNKICKSLNKICKSLNKICKS';
const MARQUEE_REPEAT = 6; // enough copies to overflow any viewport

/* ─────────────────────────────────────────────────────────────────────
   3. Component
   ───────────────────────────────────────────────────────────────────── */

export default function TrendingSection() {
  const cards = useMemo(buildTrendingList, []);
  const total = cards.length;

  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);

  // Drag / swipe state (pointer events — works for mouse + touch + pen).
  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Stable setters so listeners don't capture stale state.
  const advance = useCallback(() => {
    setActiveIdx((i) => (i + 1) % total);
  }, [total]);

  const regress = useCallback(() => {
    setActiveIdx((i) => (i - 1 + total) % total);
  }, [total]);

  /* --- Mount: reveal animation --- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* --- Autoplay (paused on hover or while dragging) --- */
  useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setInterval(advance, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, advance, total]);

  /* --- Keyboard ←/→ when stage is focused or hovered --- */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        regress();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        advance();
      }
    },
    [advance, regress]
  );

  /* --- Wheel / trackpad: convert vertical or horizontal scroll
         into prev/next navigation. Throttled via a flag. --- */
  const wheelLock = useRef(false);
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      // Only react to deliberate scroll, not micro-jitter.
      const magnitude = Math.abs(e.deltaX) + Math.abs(e.deltaY);
      if (magnitude < 12) return;
      if (wheelLock.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      wheelLock.current = true;
      const dir = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (dir > 0) advance();
      else regress();
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 450);
    },
    [advance, regress]
  );

  /* --- Drag / swipe (pointer events) --- */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    setPaused(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    dragDelta.current = e.clientX - dragStartX.current;
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragStartX.current === null) return;
      const dx = dragDelta.current;
      dragStartX.current = null;
      dragDelta.current = 0;
      setPaused(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* no-op — pointer may already be released */
      }
      // 50px threshold — feels natural on mouse + trackpad + touch
      if (dx <= -50) advance();
      else if (dx >= 50) regress();
    },
    [advance, regress]
  );

  /* --- Compute per-card transform from the active index --- */
  const getCardState = (idx: number) => {
    const offset = idx - activeIdx;
    // Wrap to nearest neighbor (so the carousel feels circular both ways).
    const wrapped = ((offset + total / 2) % total) - Math.floor(total / 2);
    const absOffset = Math.abs(wrapped);
    const isActive = absOffset === 0;

    return {
      wrapped,
      absOffset,
      isActive,
      hidden: absOffset > 2,
      translateX: wrapped * SIDE_OFFSET_X,
      rotateY: wrapped * -SIDE_ROTATE_Y,
      scale: isActive ? 1 : SIDE_SCALE - (absOffset - 1) * 0.06,
      translateZ: isActive ? 0 : SIDE_TRANSLATE_Z,
      opacity: isActive ? 1 : absOffset === 1 ? 0.55 : 0.22,
      zIndex: 20 - absOffset,
    };
  };

  /* ──────────────────────────────────────────────────────────────────
     Render
     ────────────────────────────────────────────────────────────────── */
  return (
    <section
      aria-label="Trending This Week — premium coverflow of trending sneakers"
      style={{
        position: 'relative',
        paddingTop: '96px',
        paddingBottom: '112px',
        overflow: 'hidden',
        background: '#ffffff',
      }}
    >
      {/* ─────────── Animated LNKICKS background wordmark ───────────
          Huge wordmark, very light grey (~6% opacity), translated
          LEFT → RIGHT continuously via GPU-only `transform`.
          Sits BEHIND every card (zIndex 0, cards are zIndex 10+). */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '180px',
          bottom: '120px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="lnkicks-marquee-track"
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            willChange: 'transform',
            // Start at -100% so the LEFT → RIGHT motion is visible
            // immediately on first paint.
            transform: 'translate3d(-50%, 0, 0)',
          }}
        >
          {Array.from({ length: MARQUEE_REPEAT }).map((_, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '320px',
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 1,
                color: '#000000',
                opacity: 0.06,
                marginRight: '0px',
                userSelect: 'none',
                display: 'block',
                transform: 'translateZ(0)',
              }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* ─────────── Section header ─────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: '1480px',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px',
          marginBottom: '56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px',
        }}
      >
        <div>
          {/* Eyebrow: small line + "RIGHT NOW" */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ width: '36px', height: '1px', background: '#000000' }} />
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.24em',
                fontSize: '10px',
                fontWeight: 700,
                color: '#6b7280',
              }}
            >
              Right Now
            </span>
          </div>
          {/* Heading: "Trending" regular + "This Week" italic */}
          <h2
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '72px',
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: '#000000',
            }}
          >
            Trending{' '}
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
            >
              This Week
            </span>
          </h2>
        </div>

        {/* VIEW ALL — outlined button, white bg, thin black border */}
        <Link
          href="/category-products"
          className="trending-view-all"
          aria-label="View all trending products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ffffff',
            color: '#000000',
            border: '1px solid #000000',
            borderRadius: '999px',
            padding: '14px 28px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            textDecoration: 'none',
            cursor: 'pointer',
            transition:
              'background-color 350ms cubic-bezier(0.16, 1, 0.3, 1), ' +
              'color 350ms cubic-bezier(0.16, 1, 0.3, 1), ' +
              'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
          }}
        >
          View All
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.4}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>

      {/* ─────────── Coverflow stage ─────────── */}
      <div
        ref={stageRef}
        className="trending-stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="Trending products carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: 'relative',
          zIndex: 2,
          height: '620px',
          perspective: '1800px',
          cursor: dragStartX.current !== null ? 'grabbing' : 'grab',
          outline: 'none',
          touchAction: 'pan-y',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
          }}
        >
          {cards.map((card, idx) => {
            const s = getCardState(idx);
            if (s.hidden) return null;

            const isCenter = s.isActive;

            return (
              <Link
                key={card.id}
                href={card.href}
                aria-label={`${card.brand} ${card.name} — ${card.price}. Buy now.`}
                aria-hidden={!isCenter}
                tabIndex={isCenter ? 0 : -1}
                onClick={(e) => {
                  // If the user clicked a non-center card, we want to
                  // bring it to center rather than navigate. Only the
                  // center card actually navigates on click.
                  if (!isCenter) {
                    e.preventDefault();
                    setActiveIdx(idx);
                  }
                  // If dragging ended with a small delta, suppress
                  // accidental navigation (handled by threshold above,
                  // but we also block here for safety).
                  if (Math.abs(dragDelta.current) > 8) {
                    e.preventDefault();
                  }
                }}
                className={`trending-card${isCenter ? ' is-active' : ''}`}
                style={{
                  position: 'absolute',
                  width: `${CARD_WIDTH}px`,
                  height: `${CARD_HEIGHT}px`,
                  transform: `translate3d(${s.translateX}px, 0, ${s.translateZ}px) rotateY(${s.rotateY}deg) scale(${s.scale})`,
                  transformStyle: 'preserve-3d',
                  transition: `transform ${TRANSITION_MS}ms ${EASE}, opacity ${TRANSITION_MS}ms ease`,
                  opacity: s.opacity,
                  zIndex: s.zIndex,
                  pointerEvents: 'auto',
                  textDecoration: 'none',
                  color: 'inherit',
                  background: '#ffffff',
                  borderRadius: '28px',
                  border: '1px solid #f1f1f4',
                  boxShadow: isCenter
                    ? '0 50px 100px -30px rgba(0,0,0,0.22), 0 16px 32px -12px rgba(0,0,0,0.08)'
                    : '0 24px 48px -20px rgba(0,0,0,0.14)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                }}
              >
                {/* ── Image area (top ~58% of card) ── */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '58%',
                    background:
                      'radial-gradient(circle at 50% 40%, #f8f8f8 0%, #efeff2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderBottom: '1px solid #f1f1f4',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={`${card.brand} ${card.name}`}
                    draggable={false}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{
                      maxWidth: '78%',
                      maxHeight: '78%',
                      objectFit: 'contain',
                      filter: isCenter ? 'none' : 'saturate(0.85) brightness(0.98)',
                      transition: `filter ${TRANSITION_MS}ms ease`,
                      userSelect: 'none',
                      pointerEvents: 'none',
                      transform: 'translateZ(0)',
                    }}
                  />
                  {/* Subtle floor shadow under product */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '14px',
                      background:
                        'radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 70%)',
                      filter: 'blur(4px)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                {/* ── Content area (bottom ~42%) ── */}
                <div
                  style={{
                    flex: 1,
                    padding: '24px 28px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Category */}
                    <span
                      style={{
                        display: 'block',
                        textTransform: 'uppercase',
                        fontSize: '10px',
                        letterSpacing: '0.22em',
                        fontWeight: 700,
                        color: '#9ca3af',
                        marginBottom: '8px',
                      }}
                    >
                      {card.category}
                    </span>
                    {/* Product name */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontSize: '20px',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        margin: 0,
                        color: '#0a0a0a',
                        letterSpacing: '-0.015em',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {card.name}
                    </h3>
                    {/* Price */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '12px',
                        marginTop: '14px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '20px',
                          fontWeight: 800,
                          color: '#000000',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {card.price}
                      </span>
                      {card.comparePrice && (
                        <span
                          style={{
                            fontSize: '13px',
                            color: '#9ca3af',
                            textDecoration: 'line-through',
                            fontWeight: 500,
                          }}
                        >
                          {card.comparePrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA: BUY NOW pill button */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '16px',
                    }}
                  >
                    <span
                      className="trending-cta"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#000000',
                        color: '#ffffff',
                        padding: '12px 22px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        transition:
                          'background-color 350ms cubic-bezier(0.16, 1, 0.3, 1), ' +
                          'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                        userSelect: 'none',
                      }}
                    >
                      Buy Now
                      <svg
                        width="11"
                        height="11"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.6}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─────────── Bottom controls: prev circle · thin lines · next circle ─── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          marginTop: '48px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <button
          type="button"
          onClick={regress}
          aria-label="Previous trending item"
          className="trending-circle-btn"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            border: '1px solid #d4d4d8',
            background: '#ffffff',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition:
              'background-color 300ms cubic-bezier(0.16, 1, 0.3, 1), ' +
              'color 300ms cubic-bezier(0.16, 1, 0.3, 1), ' +
              'border-color 300ms cubic-bezier(0.16, 1, 0.3, 1), ' +
              'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Thin pagination lines (not dots, not thumbnails) */}
        <div
          role="tablist"
          aria-label="Select trending slide"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {cards.map((card, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={card.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to trending item ${idx + 1}: ${card.name}`}
                onClick={() => setActiveIdx(idx)}
                style={{
                  width: isActive ? '40px' : '14px',
                  height: '2px',
                  background: isActive ? '#000000' : '#d4d4d8',
                  border: 'none',
                  borderRadius: '999px',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  transition:
                    'width 450ms cubic-bezier(0.16, 1, 0.3, 1), ' +
                    'background-color 300ms ease',
                }}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={advance}
          aria-label="Next trending item"
          className="trending-circle-btn"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            border: '1px solid #d4d4d8',
            background: '#ffffff',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition:
              'background-color 300ms cubic-bezier(0.16, 1, 0.3, 1), ' +
              'color 300ms cubic-bezier(0.16, 1, 0.3, 1), ' +
              'border-color 300ms cubic-bezier(0.16, 1, 0.3, 1), ' +
              'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* ─────────── Mounted reveal + scoped hover/marquee styles ─── */}
      <style jsx>{`
        /* Section fade-up on first paint — no CLS, no layout shift. */
        section {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 700ms ${EASE} 100ms,
            transform 700ms ${EASE} 100ms;
        }
        section.is-mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* LNKICKS wordmark — infinite LEFT → RIGHT motion.
           translate3d keeps it on the compositor thread (GPU only).
           60s is "very slow, almost unnoticeable" per spec. */
        .lnkicks-marquee-track {
          animation: lnkicks-marquee 60s linear infinite;
        }
        @keyframes lnkicks-marquee {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }

        /* VIEW ALL hover → invert to black bg / white text + micro-lift */
        .trending-view-all:hover {
          background-color: #000000 !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }

        /* BUY NOW hover → subtle lift + slightly darker bg */
        .trending-card .trending-cta:hover {
          transform: translateY(-1px);
          background-color: #1a1a1a !important;
        }

        /* Center card hover → micro-lift via translateZ (no layout shift) */
        .trending-card.is-active:hover {
          transform: translate3d(0, 0, 12px) rotateY(0deg) scale(1.012) !important;
        }

        /* Prev/Next circle buttons — hover invert */
        .trending-circle-btn:hover {
          background-color: #000000 !important;
          color: #ffffff !important;
          border-color: #000000 !important;
          transform: translateY(-1px);
        }

        /* Focus ring for keyboard users */
        .trending-stage:focus-visible,
        .trending-view-all:focus-visible,
        .trending-circle-btn:focus-visible {
          outline: 2px solid #000000;
          outline-offset: 3px;
        }

        /* Responsive — keep coverflow geometry comfortable at narrower
           desktop widths without cropping the center card's CTA. */
        @media (max-width: 1536px) {
          .trending-stage {
            height: 580px !important;
          }
        }
        @media (max-width: 1440px) {
          .trending-stage {
            height: 540px !important;
          }
        }
      `}</style>

      {/* Trigger mounted reveal — wrapped in a separate element so the
          styled-jsx selector above can attach the .is-mounted class. */}
      <MountedTrigger mounted={mounted} />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   4. Helper — adds `is-mounted` class to the parent <section> via a
      side-effect on the DOM. This is a tiny workaround so the
      styled-jsx `section.is-mounted` selector works without a wrapper
      div that would break the layout.
   ───────────────────────────────────────────────────────────────────── */
function MountedTrigger({ mounted }: { mounted: boolean }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const section = ref.current.closest('section');
    if (!section) return;
    if (mounted) section.classList.add('is-mounted');
    else section.classList.remove('is-mounted');
  }, [mounted]);
  return <span ref={ref} aria-hidden="true" style={{ display: 'none' }} />;
}
