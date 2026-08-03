'use client';

/**
 * MobileSwipeDiscovery — Tinder-style swipeable product cards section.
 *
 * Phase 27 (Rev 2 — Premium Redesign)
 *   Premium Apple/Samsung/Google aesthetic. Key upgrades from Rev 1:
 *     - Layered shadows (tight dark + wide soft) for true depth
 *     - Image area uses a subtle radial glow that integrates with the card
 *       background (no harsh white box around the shoe)
 *     - Product name sits BELOW the image on the card body — clean typography,
 *       no overlay hack
 *     - Refined header: minimal eyebrow with proper letter-spacing, no cliché
 *       sparkle icon
 *     - Removed Tinder-clone hint chips (Pass / Tap to Save / Like) — replaced
 *       with a single elegant "Swipe" pill indicator
 *     - Equal-width buttons with refined weights and a chevron on Buy Now
 *     - Wishlist is icon-led with optional "Saved" state
 *     - Card background uses a deeper, more dimensional gradient
 *
 * Behavior (unchanged from Rev 1)
 *   - 5 product cards stacked like Tinder (top card fully interactive).
 *   - Drag left / right with finger; card rotates slightly while dragging.
 *   - Swipe > 110px (or velocity threshold) commits the swipe; otherwise snaps back.
 *   - When all 5 cards are swiped, the same 5 cards reload infinitely.
 *   - Stacked cards behind the top card scale slightly smaller and shift down,
 *     giving the depth-stack illusion.
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

/**
 * Card background gradients — alternating Black → Grey → Black → Grey → Black.
 * Rev 2: deeper, more dimensional gradients with a subtle top-light to suggest
 * a soft overhead studio reflection.
 */
const CARD_GRADIENTS: string[] = [
  // Card 0, 2, 4 — Black (deep charcoal with subtle top highlight)
  'linear-gradient(165deg, #1C1C1E 0%, #0E0E10 55%, #050507 100%)',
  // Card 1, 3 — Dark Grey (with cool tint)
  'linear-gradient(165deg, #3A3A3D 0%, #2B2B2E 55%, #1F1F22 100%)',
];

/**
 * Layered card shadow — tight dark for definition + wide soft for elevation.
 * This is what makes the card feel like a physical object floating above
 * the page, rather than a flat rectangle pasted on.
 */
const CARD_SHADOW =
  '0 2px 4px rgba(0,0,0,0.10), ' + // contact line
  '0 8px 16px rgba(0,0,0,0.18), ' + // tight dark
  '0 24px 40px rgba(0,0,0,0.28), ' + // medium
  'inset 0 1px 0 rgba(255,255,255,0.06)'; // top edge highlight

/**
 * Card height — viewport-relative so it ALWAYS fits on screen.
 * Uses CSS min() so the card scales down on short viewports (iPhone SE)
 * but never exceeds 380px on tall phones. The 60vh cap leaves room for
 * the section header (~80px), hint pill (~40px), and bottom nav (~90px).
 */
const CARD_HEIGHT_CSS = 'min(380px, 60vh)';

/** Fixed pixel height for the button row — guarantees Buy Now / Wishlist
 *  never get clipped regardless of card body % calculations. */
const BUTTON_ROW_HEIGHT = 48;

/** Fixed pixel height for the product name area. */
const NAME_AREA_HEIGHT = 44;

/** Number of cards visible in the stack (1 top + 2 behind for depth). */
const VISIBLE_STACK = 3;

/** Swipe thresholds (px). Beyond this → commit swipe. */
const SWIPE_THRESHOLD = 110;
const VELOCITY_THRESHOLD = 0.55; // px / ms

/** Maximum rotation while dragging (deg). */
const MAX_ROTATION = 12;

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
  // down by 4% and shift down by 10px per slot (Rev 3: tighter so total
  // stack height stays within the 380px card frame).
  const scale = Math.max(0.88, 1 - slot * 0.04);
  const translateY = slot * 10;
  const gradient = CARD_GRADIENTS[slot % 2];

  // Build the transform. The top card uses live drag values; deeper cards
  // use the static stacked pose.
  const transform = isTop && drag
    ? `translate3d(${drag.x}px, ${drag.y || 0}px, 0) rotate(${drag.rot}deg)`
    : `translate3d(0, ${translateY}px, 0) scale(${scale})`;

  // Reduce opacity for cards deeper in the stack (subtle depth).
  const opacity = slot === 0 ? 1 : Math.max(0.5, 1 - slot * 0.22);

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
          : `transform 420ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease-out`,
        borderRadius: 28,
        overflow: 'hidden',
        background: gradient,
        boxShadow: CARD_SHADOW,
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        boxSizing: 'border-box',
        // Flex column so image area + body always sum to 100% with no overflow
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Shoe image area — flex: 1 (fills remaining space) ──────────
          Rev 4: NO white box. mix-blend-mode: screen makes white JPEG
          backgrounds blend into the dark card — white pixels (255) become
          the card's dark color (transparent effect). Colored shoe pixels
          stay nearly unchanged. screen = inverse of multiply, perfect for
          dark surfaces. */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          minHeight: 0, // critical: lets flex item shrink
          overflow: 'hidden',
          background:
            'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0) 75%)',
          // ISOLATE the blend mode so it only affects this subtree,
          // not the card body below
          isolation: 'isolate',
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
            // screen blend: white bg → card color (transparent effect),
            // shoe pixels stay visible. Perfect on dark backgrounds.
            mixBlendMode: 'screen',
            // Slight brightness lift so the shoe pops
            filter: 'brightness(1.05) contrast(1.02) saturate(1.05)',
          }}
        />

        {/* Soft radial glow overlay ON TOP of the image to restore some
            depth that mix-blend-mode can wash out. Pointer-events:none so
            it never blocks drag. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 65% 50% at 50% 45%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 60%)',
          }}
        />

        {/* Brand badge — top-left, frosted glass */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px) saturate(140%)',
            WebkitBackdropFilter: 'blur(8px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.10)',
            fontFamily: theme.fontFamily.body,
            fontSize: 10,
            fontWeight: theme.fontWeight.semibold,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {product.brand}
        </div>
      </div>

      {/* ── Card body — name + CTAs (FIXED height, never overflows) ───
          Rev 4: switched from % heights to a flex-shrink:0 fixed-height
          body. This GUARANTEES the Buy Now / Wishlist buttons are always
          fully visible — they can never be clipped by the image area
          growing too tall. */}
      <div
        style={{
          flexShrink: 0,
          height: NAME_AREA_HEIGHT + BUTTON_ROW_HEIGHT + 28, // name + buttons + padding
          padding: '10px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxSizing: 'border-box',
        }}
      >
        {/* Product name — fixed height, 2-line clamp */}
        <h3
          style={{
            margin: 0,
            height: NAME_AREA_HEIGHT,
            fontFamily: theme.fontFamily.body,
            fontSize: 14.5,
            fontWeight: theme.fontWeight.semibold,
            color: theme.colors.white,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            fontFeatureSettings: theme.fontFeatures,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </h3>

        {/* Action buttons — fixed height row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: BUTTON_ROW_HEIGHT,
          }}
        >
          {/* Buy Now — primary white pill with chevron */}
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
              height: '100%',
              borderRadius: 999,
              border: 'none',
              background: theme.colors.white,
              color: theme.colors.black,
              fontFamily: theme.fontFamily.body,
              fontSize: 13.5,
              fontWeight: theme.fontWeight.semibold,
              letterSpacing: '0.01em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow:
                '0 2px 6px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.5)',
              transition:
                'transform 120ms ease-out, box-shadow 180ms ease-out',
            }}
          >
            Buy Now
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
              <polyline
                points="12 5 19 12 12 19"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Wishlist — icon-led secondary, square-ish, refined border */}
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
              height: '100%',
              width: 52,
              flexShrink: 0,
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: wishlistActive
                ? 'rgba(255,255,255,0.14)'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${wishlistActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)'}`,
              color: theme.colors.white,
              cursor: 'pointer',
              transition:
                'background 200ms ease-out, border-color 200ms ease-out, transform 120ms ease-out',
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
          </button>
        </div>
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
      if (e.currentTarget.dataset.slot !== '0') return;
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

      const pastThreshold = Math.abs(dx) > SWIPE_THRESHOLD;
      const flicked = Math.abs(velocity) > VELOCITY_THRESHOLD;

      if (pastThreshold || flicked) {
        commitSwipe(dx > 0 || velocity > 0 ? 'right' : 'left');
      } else {
        setDrag({ x: 0, y: 0, rot: 0 });
        window.setTimeout(() => setDrag(null), 420);
      }
    },
    [commitSwipe],
  );

  // ── Compute exit transform for the swiped top card ──────────────────
  const exitTransform = exitDir
    ? exitDir === 'right'
      ? 'translate3d(140vw, 0, 0) rotate(24deg)'
      : 'translate3d(-140vw, 0, 0) rotate(-24deg)'
    : null;

  // Current card position (1 of 5)
  const currentCardNum = (cycle % SWIPE_PRODUCTS.length) + 1;

  return (
    <section
      aria-label="Swipe to Discover"
      style={{
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.section,
        // Respect safe-area insets on notched Android/iOS devices
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        background: 'transparent',
      }}
    >
      {/* ── Section header — refined, minimal ─────────────────────────
          Rev 2: removed the cliché ✦ sparkle eyebrow. Clean eyebrow with
          proper letter-spacing. Tighter hierarchy. */}
      <div
        style={{
          padding: `0 ${theme.spacing.xxl}px`,
          marginBottom: theme.spacing.lg,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: 10,
            fontWeight: theme.fontWeight.semibold,
            color: theme.colors.textSecondary,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Discover
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: theme.fontFamily.body,
              fontSize: 24,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Swipe to Discover
          </h2>
          {/* Card position indicator — minimal, premium */}
          <span
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: 12,
              fontWeight: theme.fontWeight.medium,
              color: theme.colors.textSecondary,
              letterSpacing: '0.04em',
              fontFeatureSettings: theme.fontFeatures,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(currentCardNum).padStart(2, '0')}
            <span style={{ color: theme.colors.grey400, margin: '0 2px' }}>
              /
            </span>
            {String(SWIPE_PRODUCTS.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ── Card stack ──────────────────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
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
            height: CARD_HEIGHT_CSS,
            boxSizing: 'border-box',
          }}
        >
          {visibleProducts
            .slice()
            .reverse()
            .map(({ product, cycleOffset }, idxInReversed) => {
              const slot = VISIBLE_STACK - 1 - idxInReversed;
              const isTop = slot === 0;

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

      {/* ── Minimal swipe hint — single pill, not Tinder clone ───────
          Rev 2: removed the Pass / Tap to Save / Like chips — they were
          cheap Tinder clones. One elegant pill that fades after the user
          has swiped at least once. */}
      <div
        style={{
          marginTop: theme.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `0 ${theme.spacing.xxl}px`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 14px',
            borderRadius: 999,
            background: theme.colors.offWhite,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Left arrow */}
          <svg
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke={theme.colors.textSecondary}
            strokeWidth="2.4"
            aria-hidden
          >
            <line x1="19" y1="12" x2="5" y2="12" strokeLinecap="round" />
            <polyline
              points="12 19 5 12 12 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: 11,
              fontWeight: theme.fontWeight.medium,
              color: theme.colors.textSecondary,
              letterSpacing: '0.06em',
            }}
          >
            Swipe to explore
          </span>
          {/* Right arrow */}
          <svg
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke={theme.colors.textSecondary}
            strokeWidth="2.4"
            aria-hidden
          >
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            <polyline
              points="12 5 19 12 12 19"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ── Global styles for buttons + dragging cursor ─────────────── */}
      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .msd-buy:active {
          transform: scale(0.96);
          box-shadow: 0 1px 3px rgba(0,0,0,0.18);
        }
        .msd-wish:active {
          transform: scale(0.92);
        }
        @media (hover: hover) {
          .msd-buy:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 14px rgba(0,0,0,0.24),
              inset 0 1px 0 rgba(255,255,255,0.5);
          }
          .msd-wish:hover {
            background: rgba(255,255,255,0.10);
            border-color: rgba(255,255,255,0.35);
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
