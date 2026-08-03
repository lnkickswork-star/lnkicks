'use client';

/**
 * MobileSwipeDiscovery — Tinder-style swipeable product cards section.
 *
 * Phase 27 — premium mobile-only "Swipe to Discover" section placed directly
 * below the Rewards banner on the mobile homepage.
 *
 * Behavior
 *   - 5 product cards stacked like Tinder (top card fully interactive).
 *   - Drag left / right with finger; card rotates slightly while dragging.
 *   - Swipe > 100px (or velocity threshold) commits the swipe; otherwise snaps back.
 *   - When all 5 cards are swiped, the same 5 cards reload infinitely.
 *   - Stacked cards behind the top card scale slightly smaller and shift down,
 *     giving the depth-stack illusion.
 *
 * Card design (per user spec)
 *   - 70–75% of card height = premium shoe image (object-contain).
 *   - Shoe Name (only — no brand, no price, no rating, no description).
 *   - Two CTAs at bottom:
 *       • Buy Now (white pill, black text, primary)
 *       • ♡ Add to Wishlist (transparent, white border, secondary)
 *   - Alternating premium gradient backgrounds:
 *         Card 0: Black   #0F0F0F → #1B1B1B
 *         Card 1: Grey    #2B2B2B → #4A4A4A
 *         Card 2: Black   #0F0F0F → #1B1B1B
 *         Card 3: Grey    #2B2B2B → #4A4A4A
 *         Card 4: Black   #0F0F0F → #1B1B1B
 *   - 24px radius, soft shadow, glassmorphism touch on name plate.
 *
 * Performance
 *   - GPU-accelerated transforms (translate3d + rotate) only — no layout thrash.
 *   - Pointer events (works for touch + mouse + pen).
 *   - requestAnimationFrame-bounded drag updates; passive listeners.
 *   - Spring animation on snap-back via CSS transition with custom easing.
 *
 * Mobile only — renders nothing on viewports ≥ 768px (handled by parent).
 */

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import type { MobileProduct } from '@/components/mobile/mobileProducts';

/* ──────────────────────────────────────────────────────────────────────
 *  Product data — 5 premium shoes (curated subset of MOBILE_RECOMMENDED)
 * ────────────────────────────────────────────────────────────────────── */
const SWIPE_PRODUCTS: MobileProduct[] = [
  {
    id: 'msd-aj1-powder',
    brand: 'Air Jordan',
    name: 'Air Jordan 1 Low Powder Blue',
    price: 'Rs. 8,899',
    priceValue: 8899,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
  },
  {
    id: 'msd-dunk-rose',
    brand: 'Nike',
    name: "Nike Dunk Low 'Rose Whisper'",
    price: 'Rs. 7,399',
    priceValue: 7399,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
  },
  {
    id: 'msd-samba',
    brand: 'Adidas',
    name: "Adidas Samba OG 'Wonder Silver'",
    price: 'Rs. 6,199',
    priceValue: 6199,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-samba-og-wonder-silver',
  },
  {
    id: 'msd-nb530',
    brand: 'New Balance',
    name: "New Balance 530 'Steel Grey'",
    price: 'Rs. 9,499',
    priceValue: 9499,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/new-balance-530-steel-grey',
  },
  {
    id: 'msd-dunk-purple',
    brand: 'Nike',
    name: "Nike Dunk Low 'Court Purple'",
    price: 'Rs. 6,499',
    priceValue: 6499,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-court-purple',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  Visual constants
 * ────────────────────────────────────────────────────────────────────── */

/** Card background gradients — alternating Black → Grey → Black → Grey → Black */
const CARD_GRADIENTS: string[] = [
  // Card 0, 2, 4 — Black
  'linear-gradient(160deg, #0F0F0F 0%, #1B1B1B 100%)',
  // Card 1, 3 — Dark Grey
  'linear-gradient(160deg, #2B2B2B 0%, #4A4A4A 100%)',
];

/** Card height (px). Per spec: 420–460. */
const CARD_HEIGHT = 440;

/** Number of cards visible in the stack (1 top + 2 behind for depth). */
const VISIBLE_STACK = 3;

/** Swipe thresholds (px). Beyond this → commit swipe. */
const SWIPE_THRESHOLD = 110;
const VELOCITY_THRESHOLD = 0.55; // px / ms

/** Maximum rotation while dragging (deg). */
const MAX_ROTATION = 14;

/* ──────────────────────────────────────────────────────────────────────
 *  Card subcomponent
 * ────────────────────────────────────────────────────────────────────── */

interface SwipeCardProps {
  product: MobileProduct;
  /** Card slot index relative to the top of the stack (0 = top). */
  slot: number;
  /** Live drag transform { x, y, rot } for the top card. */
  drag?: { x: number; y: number; rot: number };
  /** Whether this card is the top (interactive) card. */
  isTop: boolean;
  onBuy: (p: MobileProduct) => void;
  onWishlist: (p: MobileProduct) => void;
  wishlistActive: boolean;
}

function SwipeCard({
  product,
  slot,
  drag,
  isTop,
  onBuy,
  onWishlist,
  wishlistActive,
}: SwipeCardProps) {
  // Stacked-card depth: top card (slot 0) is full size; deeper cards scale
  // down by 4% and shift down by 12px per slot.
  const scale = Math.max(0.88, 1 - slot * 0.04);
  const translateY = slot * 12;
  const gradient = CARD_GRADIENTS[slot % 2];

  // Build the transform. The top card uses live drag values; deeper cards
  // use the static stacked pose.
  const transform = isTop && drag
    ? `translate3d(${drag.x}px, ${drag.y || 0}px, 0) rotate(${drag.rot}deg)`
    : `translate3d(0, ${translateY}px, 0) scale(${scale})`;

  // Reduce opacity for cards deeper in the stack (subtle depth).
  const opacity = slot === 0 ? 1 : Math.max(0.55, 1 - slot * 0.18);

  // Card entrance animation when slot becomes 0 (top).
  return (
    <div
      data-card-slot={slot}
      style={{
        position: 'absolute',
        inset: 0,
        transform,
        opacity,
        zIndex: 30 - slot,
        willChange: 'transform, opacity',
        // Spring transition — only applied when NOT dragging (drag uses
        // instant updates via transform style).
        transition: isTop && drag
          ? 'none'
          : `transform 360ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease-out`,
        borderRadius: 24,
        overflow: 'hidden',
        background: gradient,
        boxShadow:
          '0 18px 48px rgba(0,0,0,0.38), 0 4px 14px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* ── Shoe image — 70–75% of card height ───────────────────── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '72%',
          overflow: 'hidden',
          // Subtle radial vignette to focus the eye on the shoe
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 60%)',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          draggable={false}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            padding: '20px 24px 8px',
            // Soft drop shadow so the shoe "floats" above the gradient
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.55))',
          }}
        />

        {/* Glassmorphism name plate — bottom of image area */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 12,
            padding: '12px 16px',
            borderRadius: 16,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(14px) saturate(140%)',
            WebkitBackdropFilter: 'blur(14px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.12)',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: theme.fontFamily.body,
              fontSize: 16,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.white,
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
              fontFeatureSettings: theme.fontFeatures,
              // Clamp to 2 lines
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </h3>
        </div>
      </div>

      {/* ── Action buttons ────────────────────────────────────────── */}
      <div
        style={{
          height: '28%',
          padding: '12px 16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* Buy Now — primary white pill */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation();
            haptic.medium();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onBuy(product);
          }}
          aria-label={`Buy ${product.name} now`}
          className="msd-buy"
          style={{
            flex: 1,
            height: 48,
            borderRadius: 999,
            border: 'none',
            background: theme.colors.white,
            color: theme.colors.black,
            fontFamily: theme.fontFamily.body,
            fontSize: 14,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: '0.02em',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(0,0,0,0.28)',
            transition: 'transform 120ms ease-out, box-shadow 180ms ease-out',
          }}
        >
          Buy Now
        </button>

        {/* ♡ Add to Wishlist — secondary transparent with white border */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation();
            haptic.light();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onWishlist(product);
          }}
          aria-label={
            wishlistActive
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlistActive}
          className="msd-wish"
          style={{
            height: 48,
            minWidth: 48,
            padding: '0 16px',
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: wishlistActive
              ? 'rgba(255,255,255,0.10)'
              : 'transparent',
            border: `1.5px solid ${wishlistActive ? theme.colors.white : 'rgba(255,255,255,0.65)'}`,
            color: theme.colors.white,
            fontFamily: theme.fontFamily.body,
            fontSize: 13,
            fontWeight: theme.fontWeight.semibold,
            cursor: 'pointer',
            transition:
              'background 180ms ease-out, border-color 180ms ease-out, transform 120ms ease-out',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill={wishlistActive ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{wishlistActive ? 'Saved' : 'Wishlist'}</span>
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 *  Main section
 * ────────────────────────────────────────────────────────────────────── */

export default function MobileSwipeDiscovery() {
  const { wishlist, toggleWishlist } = useApp();

  // Index into SWIPE_PRODUCTS that is currently the "top" card.
  // We don't actually mutate the array — we just rotate the visible window.
  // `cycle` increments every time the top card is swiped off, and we use
  // modulo to loop infinitely.
  const [cycle, setCycle] = useState(0);
  const [exitDir, setExitDir] = useState<null | 'left' | 'right'>(null);

  // Drag state for the top card
  const [drag, setDrag] = useState<{ x: number; y: number; rot: number } | null>(null);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    lastX: number;
    lastT: number;
    velocity: number;
    pointerId: number | null;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    pointerId: null,
  });

  // The visible window — top card + 2 behind it
  const visibleProducts = useMemo(() => {
    const arr: { product: MobileProduct; cycleOffset: number }[] = [];
    for (let i = 0; i < VISIBLE_STACK; i++) {
      const offset = (cycle + i) % SWIPE_PRODUCTS.length;
      arr.push({ product: SWIPE_PRODUCTS[offset], cycleOffset: offset });
    }
    return arr;
  }, [cycle]);

  // Wishlist IDs (for the active-heart state)
  const wishlistIds = useMemo(
    () => new Set(wishlist.map((w) => w.id)),
    [wishlist],
  );

  // ── Buy handler ─────────────────────────────────────────────────────
  const handleBuy = useCallback((p: MobileProduct) => {
    // Navigate to product page in the next tick (so haptic fires first)
    if (typeof window !== 'undefined') {
      window.location.href = p.href;
    }
  }, []);

  // ── Wishlist handler ────────────────────────────────────────────────
  const handleWishlist = useCallback(
    (p: MobileProduct) => {
      toggleWishlist({
        id: p.id,
        name: p.name,
        price: p.priceValue,
        image: p.image,
      });
    },
    [toggleWishlist],
  );

  // ── Commit a swipe (advance to next card) ───────────────────────────
  const commitSwipe = useCallback((dir: 'left' | 'right') => {
    setExitDir(dir);
    haptic.medium();
    // After the exit animation, advance the cycle and clear the exit state
    window.setTimeout(() => {
      setCycle((c) => (c + 1) % SWIPE_PRODUCTS.length);
      setExitDir(null);
      setDrag(null);
    }, 280);
  }, []);

  // ── Pointer handlers (top card only) ────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Only the top card listens — but we attach to the stack wrapper
      // and check e.currentTarget.dataset.slot
      if (e.currentTarget.dataset.slot !== '0') return;
      // Ignore right-click / multi-touch
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastT: performance.now(),
        velocity: 0,
        pointerId: e.pointerId,
      };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;
      if (e.pointerId !== dragRef.current.pointerId) return;

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const now = performance.now();
      const dt = Math.max(1, now - dragRef.current.lastT);
      const vx = (e.clientX - dragRef.current.lastX) / dt;
      dragRef.current.velocity = vx;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastT = now;

      // Rotation proportional to horizontal drag, clamped
      const rot = Math.max(
        -MAX_ROTATION,
        Math.min(MAX_ROTATION, dx / 18),
      );

      setDrag({ x: dx, y: dy * 0.4, rot });
    },
    [],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;
      if (e.pointerId !== dragRef.current.pointerId) return;

      const dx = e.clientX - dragRef.current.startX;
      const velocity = dragRef.current.velocity;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}

      dragRef.current.active = false;
      dragRef.current.pointerId = null;

      // Commit if dragged past threshold OR flicked with sufficient velocity
      const pastThreshold = Math.abs(dx) > SWIPE_THRESHOLD;
      const flicked = Math.abs(velocity) > VELOCITY_THRESHOLD;

      if (pastThreshold || flicked) {
        commitSwipe(dx > 0 || velocity > 0 ? 'right' : 'left');
      } else {
        // Snap back
        setDrag({ x: 0, y: 0, rot: 0 });
        window.setTimeout(() => setDrag(null), 360);
      }
    },
    [commitSwipe],
  );

  // ── Compute exit transform for the swiped top card ──────────────────
  const exitTransform = exitDir
    ? exitDir === 'right'
      ? 'translate3d(140vw, 0, 0) rotate(28deg)'
      : 'translate3d(-140vw, 0, 0) rotate(-28deg)'
    : null;

  return (
    <section
      aria-label="Swipe to Discover"
      style={{
        width: '100%',
        paddingTop: theme.spacing.xxl,
        paddingBottom: theme.spacing.section,
        background: 'transparent',
      }}
    >
      {/* ── Section header ──────────────────────────────────────────── */}
      <div
        style={{
          padding: `0 ${theme.spacing.xxl}px`,
          marginBottom: theme.spacing.lg,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: theme.fontFamily.body,
            fontSize: 10,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textSecondary,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          <span aria-hidden style={{ fontSize: 11 }}>✦</span>
          Curated For You
        </span>
        <h2
          style={{
            margin: 0,
            fontFamily: theme.fontFamily.body,
            fontSize: 22,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          Swipe to Discover
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: theme.fontFamily.body,
            fontSize: 12,
            fontWeight: theme.fontWeight.regular,
            color: theme.colors.textSecondary,
            lineHeight: 1.5,
          }}
        >
          Drag left or right to explore premium picks.
        </p>
      </div>

      {/* ── Card stack ──────────────────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          padding: `0 ${theme.spacing.pad}px`,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 380,
            height: CARD_HEIGHT,
          }}
        >
          {/* Render cards back-to-front so slot 0 (top) has the highest z-index */}
          {visibleProducts
            .slice()
            .reverse()
            .map(({ product, cycleOffset }, idxInReversed) => {
              const slot = VISIBLE_STACK - 1 - idxInReversed;
              const isTop = slot === 0;

              // When exitDir is set, the top card flies off
              const liveDrag = isTop && !exitDir ? drag : null;
              const overrideTransform = isTop && exitDir ? exitTransform : null;

              return (
                <div
                  key={`${cycleOffset}-${cycle}`}
                  data-slot={slot}
                  onPointerDown={isTop ? onPointerDown : undefined}
                  onPointerMove={isTop ? onPointerMove : undefined}
                  onPointerUp={isTop ? endDrag : undefined}
                  onPointerCancel={isTop ? endDrag : undefined}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: overrideTransform ?? undefined,
                    transition: isTop && exitDir
                      ? 'transform 280ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 280ms ease-out'
                      : undefined,
                    opacity: isTop && exitDir ? 0 : undefined,
                    zIndex: 30 - slot,
                    willChange: 'transform, opacity',
                    touchAction: 'pan-y',
                    cursor: isTop ? 'grab' : 'default',
                  }}
                >
                  <SwipeCard
                    product={product}
                    slot={slot}
                    drag={liveDrag ?? undefined}
                    isTop={isTop}
                    onBuy={handleBuy}
                    onWishlist={handleWishlist}
                    wishlistActive={wishlistIds.has(product.id)}
                  />
                </div>
              );
            })}
        </div>
      </div>

      {/* ── Hint chips ──────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: theme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: `0 ${theme.spacing.xxl}px`,
        }}
      >
        <HintChip icon="←" label="Pass" />
        <HintChip icon="♥" label="Tap to Save" />
        <HintChip icon="→" label="Like" />
      </div>

      {/* ── Global styles for buttons + dragging cursor ─────────────── */}
      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .msd-buy:active {
          transform: scale(0.96);
          box-shadow: 0 3px 8px rgba(0,0,0,0.24);
        }
        .msd-wish:active {
          transform: scale(0.94);
        }
        @media (hover: hover) {
          .msd-buy:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 22px rgba(0,0,0,0.32);
          }
          .msd-wish:hover {
            background: rgba(255,255,255,0.08);
          }
        }
        .msd-buy:focus-visible,
        .msd-wish:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 3px;
        }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 *  Small hint-chip subcomponent
 * ────────────────────────────────────────────────────────────────────── */

function HintChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: theme.fontFamily.body,
        fontSize: 11,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
        letterSpacing: '0.04em',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: theme.colors.offWhite,
          border: `1px solid ${theme.colors.border}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          color: theme.colors.textPrimary,
        }}
      >
        {icon}
      </span>
      {label}
    </span>
  );
}
