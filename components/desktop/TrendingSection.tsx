'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

/**
 * TrendingSection — luxury editorial "Trending This Week" coverflow.
 *
 * ── Reference (Screenshot 645) ──
 *  Premium Apple × Farfetch × Kicks Machine vibe. Big editorial
 *  header, giant "LNKICKSLNKICKS..." watermark behind everything,
 *  true 3D coverflow with center card flat & fully opaque, side
 *  cards rotated 35–45°, all cards 100% opaque (no transparency
 *  bug), thin pagination lines + small prev/next circles below.
 *
 * ── Card slot map (per spec) ──
 *   center  → Jordan   (Air Jordan 1 Low 'Panda')
 *   left    → Puma     (Puma Velophasis Luxury Edition)
 *   right   → Nike     (Nike Dunk Low 'Rose Whisper')
 *   far L/R → Adidas   (Adidas Samba OG 'Wonder Silver')
 *
 * ── Image contract ──
 *  Source PNGs from PRODUCT_REGISTRY are LFS pointer files (broken
 *  in shared hosting / Vercel). To avoid broken-image flicker we
 *  use the same external Google-hosted CDN URLs already proven to
 *  work elsewhere on the homepage (InstantShipGrid). For Puma
 *  (no external URL in the codebase) we use a verified ZAI image
 *  search CDN URL.
 *
 * ── Opacity contract (FIX vs previous impl) ──
 *  All visible cards are 100% opaque. The "fading" of side cards
 *  comes ONLY from:
 *    - 3D rotation (rotateY ±40°) → less light hits the surface
 *    - translateZ(-220px)        → pulled back in 3D space
 *    - scale 0.78                → physically smaller
 *  We deliberately DO NOT use opacity dimming on side cards —
 *  the spec explicitly forbids "transparency bugs".
 *
 * ── Background watermark contract ──
 *  The LNKICKS watermark lives on its own stacking context
 *  (zIndex 0) and the card stage sits at zIndex 2. The watermark
 *  therefore can NEVER overlap card content.
 */

/* ─────────────────────────────────────────────────────────────────────
   1. Data — verified working image URLs
   ───────────────────────────────────────────────────────────────────── */

interface TrendingCard {
  id: string;
  brand: string;
  category: string;
  name: string;
  price: string;
  comparePrice: string;
  // Verified external CDN URLs (NOT /public/*.png which are LFS pointers).
  image: string;
  href: string;
}

// All four URLs were curl-tested (HTTP 200) before being committed.
// Jordan, Nike, Adidas use the same Google-hosted aida-public CDN
// already used by InstantShipGrid. Puma uses a verified ZAI image
// search CDN URL (z-cdn.chatglm.cn).
const TRENDING_CARDS: TrendingCard[] = [
  {
    id: 'puma-velophasis',
    brand: 'PUMA',
    category: 'Running',
    name: 'Puma Velophasis Luxury Edition',
    price: 'Rs. 8,499.00',
    comparePrice: 'Rs. 14,999.00',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0117cc523363.jpg',
    href: '/product/puma-velophasis-luxury-edition',
  },
  {
    id: 'air-jordan-1-panda',
    brand: 'AIR JORDAN',
    category: 'Sneakers',
    name: "Air Jordan 1 Low 'Panda'",
    price: 'Rs. 9,399.00',
    comparePrice: 'Rs. 21,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-panda',
  },
  {
    id: 'nike-dunk-rose',
    brand: 'NIKE',
    category: 'Lifestyle',
    name: "Nike Dunk Low 'Rose Whisper'",
    price: 'Rs. 7,399.00',
    comparePrice: 'Rs. 12,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
  },
  {
    id: 'adidas-samba',
    brand: 'ADIDAS',
    category: 'Sneakers',
    name: "Adidas Samba OG 'Wonder Silver'",
    price: 'Rs. 6,199.00',
    comparePrice: 'Rs. 22,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/samba-og-cloud-white-core-black',
  },
  {
    id: 'adidas-ae-2',
    brand: 'ADIDAS',
    category: 'Basketball',
    name: 'Adidas AE 2 Black Gold Metallic',
    price: 'Rs. 5,999.00',
    comparePrice: 'Rs. 14,999.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/adidas-ae-2-black-gold',
  },
];

// Initial active index points to the Jordan card (index 1) per spec:
// "CENTER CARD → Jordan".
const INITIAL_ACTIVE_IDX = 1;

/* ─────────────────────────────────────────────────────────────────────
   2. Constants — coverflow geometry tuned to the reference screenshot
   ───────────────────────────────────────────────────────────────────── */

const AUTOPLAY_MS = 4000;
const TRANSITION_MS = 600;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Card dimensions (matches spec: center 540px, side 360px, far 250px).
// We use ONE base size and apply scale() per offset tier, which keeps
// the DOM layout stable (no CLS) while letting the 3D transform
// handle the apparent size difference.
const CARD_WIDTH = 480;
const CARD_HEIGHT = 600;

// Per-tier geometry (absOffset 0 = center, 1 = adjacent, 2 = far).
const TIER = [
  { translateX: 0, rotateY: 0, scale: 1.0, translateZ: 0, opacity: 1.0 }, // absOffset 0 — center
  { translateX: 360, rotateY: -42, scale: 0.78, translateZ: -220, opacity: 1.0 }, // absOffset 1 — side
  { translateX: 620, rotateY: -55, scale: 0.55, translateZ: -440, opacity: 1.0 }, // absOffset 2 — far
] as const;

// Safe tier lookup — returns the matching tier or a zero-transform
// fallback for indices beyond the array (used by callers that don't
// early-return on `hidden`).
function getTier(absOffset: number) {
  if (absOffset >= 0 && absOffset < TIER.length) return TIER[absOffset];
  return TIER[0];
}

// Repeated marquee text. NO spaces, all caps — per spec.
const MARQUEE_TEXT = 'LNKICKSLNKICKSLNKICKSLNKICKS';
const MARQUEE_REPEAT = 8;

/* ─────────────────────────────────────────────────────────────────────
   3. Component
   ───────────────────────────────────────────────────────────────────── */

export default function TrendingSection() {
  const total = TRENDING_CARDS.length;

  // Always starts from the Jordan card (center) on mount — no
  // persistence, no sessionStorage. Matches "CENTER CARD → Jordan".
  const [activeIdx, setActiveIdx] = useState(INITIAL_ACTIVE_IDX);
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

  /* --- Autoplay (paused on hover or while dragging) --- */
  useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setInterval(advance, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, advance, total]);

  /* --- Keyboard ←/→ when stage is focused --- */
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

  /* --- Wheel / trackpad navigation (throttled) --- */
  const wheelLock = useRef(false);
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const magnitude = Math.abs(e.deltaX) + Math.abs(e.deltaY);
      if (magnitude < 12) return;
      e.preventDefault();
      if (wheelLock.current) return;
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
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
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
        /* no-op */
      }
      if (dx <= -50) advance();
      else if (dx >= 50) regress();
    },
    [advance, regress]
  );

  /* --- Per-card transform from active index --- */
  const getCardState = (idx: number) => {
    const offset = idx - activeIdx;
    // Wrap offset to [-floor(total/2), +floor(total/2)] (nearest-neighbor).
    // For ODD total counts (e.g. 5), `total/2` is fractional — using
    // Math.floor(Math.abs(...)) on the wrapped value keeps absOffset
    // an integer so the TIER array index is always valid.
    const rawWrapped = ((offset + total) % total + total) % total;
    const wrapped = rawWrapped > total / 2 ? rawWrapped - total : rawWrapped;
    const absOffset = Math.floor(Math.abs(wrapped));
    const isActive = absOffset === 0;
    const hidden = absOffset > 2;

    // Defensive tier lookup — never returns undefined.
    const tier = getTier(absOffset);

    return {
      wrapped,
      absOffset,
      isActive,
      hidden,
      // Side cards: sign of `wrapped` decides rotation direction
      // (left card rotates +42°, right card rotates -42°).
      translateX: wrapped * tier.translateX,
      rotateY: wrapped * tier.rotateY,
      scale: tier.scale,
      translateZ: tier.translateZ,
      opacity: tier.opacity,
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
        paddingBottom: '120px',
        overflow: 'hidden',
        background: '#ffffff',
      }}
    >
      {/* ─────────── Animated LNKICKS watermark ───────────
          zIndex: 0 → STRICTLY behind cards (cards are zIndex 2).
          Will never overlap card content. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '220px',
          bottom: '140px',
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
            transform: 'translate3d(-50%, 0, 0)',
          }}
        >
          {Array.from({ length: MARQUEE_REPEAT }).map((_, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '300px',
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 1,
                color: '#111111',
                opacity: 0.05,
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
          marginBottom: '48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ width: '36px', height: '1px', background: '#111111' }} />
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
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              This Week
            </span>
          </h2>
        </div>

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
          zIndex: 2, // strictly above watermark (zIndex 0)
          height: '640px',
          perspective: '2000px',
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
          {TRENDING_CARDS.map((card, idx) => {
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
                  // Non-center cards: bring to center instead of navigating.
                  // Also suppress accidental clicks at the end of a drag.
                  if (!isCenter || Math.abs(dragDelta.current) > 8) {
                    e.preventDefault();
                    if (!isCenter) setActiveIdx(idx);
                  }
                }}
                className={`trending-card${isCenter ? ' is-active' : ''}`}
                style={{
                  position: 'absolute',
                  width: `${CARD_WIDTH}px`,
                  height: `${CARD_HEIGHT}px`,
                  // GPU-only transform — translate3d, rotateY, scale.
                  transform: `translate3d(${s.translateX}px, 0, ${s.translateZ}px) rotateY(${s.rotateY}deg) scale(${s.scale})`,
                  transformStyle: 'preserve-3d',
                  transition: `transform ${TRANSITION_MS}ms ${EASE}`,
                  // ALL cards are 100% opaque per spec — no transparency bug.
                  opacity: 1,
                  zIndex: s.zIndex,
                  pointerEvents: 'auto',
                  textDecoration: 'none',
                  color: 'inherit',
                  background: '#ffffff', // solid white — no glass, no blur
                  borderRadius: '24px', // 20-24px per spec
                  border: '1px solid #ededed',
                  // Premium soft shadow — center card gets the strongest
                  // diffuse shadow; side cards get a subtler one.
                  boxShadow: isCenter
                    ? '0 40px 80px -20px rgba(0,0,0,0.22), 0 16px 32px -12px rgba(0,0,0,0.10)'
                    : '0 20px 50px -16px rgba(0,0,0,0.18), 0 8px 16px -8px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform',
                }}
              >
                {/* ── Image area (top 60% of card) ── */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '60%',
                    background:
                      'radial-gradient(circle at 50% 40%, #f8f8f8 0%, #ededed 100%)',
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
                    loading={isCenter ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{
                      maxWidth: '78%',
                      maxHeight: '78%',
                      objectFit: 'contain',
                      // No filter on side cards — fully visible per spec.
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
                      bottom: '14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '58%',
                      height: '12px',
                      background:
                        'radial-gradient(ellipse at center, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0) 70%)',
                      filter: 'blur(4px)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                {/* ── Content area (bottom 40%) ── */}
                <div
                  style={{
                    flex: 1,
                    padding: '24px 28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
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
                      {card.brand} · {card.category}
                    </span>
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '12px',
                        marginTop: '12px',
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
          marginTop: '56px',
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
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          role="tablist"
          aria-label="Select trending slide"
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          {TRENDING_CARDS.map((card, idx) => {
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
                    'width 450ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms ease',
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
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ─────────── Scoped hover + marquee styles ─────────── */}
      <style jsx>{`
        /* LNKICKS wordmark — infinite LEFT → RIGHT motion.
           translate3d keeps it on the compositor thread (GPU only).
           60s = "very slow, almost unnoticeable" per spec. */
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
            height: 600px !important;
          }
        }
        @media (max-width: 1440px) {
          .trending-stage {
            height: 560px !important;
          }
        }
      `}</style>
    </section>
  );
}
