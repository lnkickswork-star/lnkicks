'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import ProductCardActions from './ProductCardActions';

/**
 * PremiumProductSlider — luxury editorial floating-product slider.
 *
 * ── Visual contract (Screenshot 646) ──
 *  Pure white background. NO product cards. NO card borders. NO card shadows.
 *  Shoes float directly on white with only a subtle drop-shadow on the image
 *  itself (filter: drop-shadow, NOT box-shadow on a card).
 *
 *  Layout (top → bottom):
 *    1. Centered section title (massive, weight 800, near-black)
 *    2. Centered subtitle (medium grey)
 *    3. Centered prev/next circular outline arrows
 *    4. Horizontal product row (5 visible on desktop, 3 tablet, 2 mobile)
 *
 *  Per-product (top → bottom):
 *    1. Transparent PNG product image (~280px tall) with soft drop-shadow
 *    2. Brand name (small, uppercase, grey #999)
 *    3. Product name (medium, black #0A0A0A)
 *    4. Price row: red bold current + grey strikethrough original
 *    5. Single 'Add to Cart' CTA button
 *
 *  NO badges. NO best-seller pills. NO instant-ship chips. Per user spec,
 *  the only chrome above each shoe is the shoe itself.
 *
 * ── Interaction ──
 *  - Click prev/next arrows
 *  - Drag / swipe (pointer events: mouse + touch + pen)
 *  - Horizontal wheel / trackpad swipe
 *  - Arrow keys (when focused)
 *  - Autoplay every 5s (pauses on hover)
 *  - Infinite loop (duplicated products at both ends, seamless jump-back)
 *
 * ── Hover ──
 *  Image lifts (translateY -8px) + drop-shadow deepens. Smooth 500ms ease.
 */

export interface SliderProduct {
  id: string;
  brand: string;
  name: string;
  price: string;
  /** Numeric price used for cart line items (INR). */
  priceValue: number;
  comparePrice?: string;
  /** @deprecated Badges are no longer rendered. Kept for type backwards-compat. */
  badge?: string;
  /** @deprecated Badge variants are no longer rendered. */
  badgeVariant?: 'black' | 'red' | 'gold' | 'cream';
  image: string;
  href: string;
}

interface PremiumProductSliderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  products: SliderProduct[];
  visibleCount?: { desktop: number; tablet: number; mobile: number };
  background?: string;
  paddingY?: number;
  id?: string;
  autoplayMs?: number;
}

// Badge styles removed per spec — no badges above products.
// SliderProduct.badge / badgeVariant fields remain on the type for
// backwards compatibility with callers that still pass them, but they
// are never read by this component.

export default function PremiumProductSlider({
  title,
  subtitle,
  eyebrow,
  products,
  visibleCount = { desktop: 5, tablet: 3, mobile: 2 },
  background = '#ffffff',
  paddingY = 120,
  id,
  autoplayMs = 5000,
}: PremiumProductSliderProps) {
  // Cart / wishlist are handled by ProductCardActions inside each cell.

  // ── Guard: not enough products ──
  const safeVisible = {
    desktop: Math.min(visibleCount.desktop, Math.max(products.length, 1)),
    tablet: Math.min(visibleCount.tablet, Math.max(products.length, 1)),
    mobile: Math.min(visibleCount.mobile, Math.max(products.length, 1)),
  };

  // ── State ──
  const [index, setIndex] = useState(products.length); // start at first real product in middle copy
  const [visible, setVisible] = useState(safeVisible.desktop);
  const [transitionOn, setTransitionOn] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // ── Refs ──
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    startX: 0,
    currentX: 0,
    isDragging: false,
    startIndex: 0,
  });
  const wheelLock = useRef(false);
  const jumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Build extended product list (3x duplication for infinite loop) ──
  // Layout: [copy-L | real | copy-R]  each = products.length
  const offset = products.length;
  const extended = [...products, ...products, ...products];

  // ── Responsive visible count ──
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setVisible(safeVisible.mobile);
      else if (w < 1024) setVisible(safeVisible.tablet);
      else setVisible(safeVisible.desktop);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length, visibleCount.desktop, visibleCount.tablet, visibleCount.mobile]);

  // ── Navigation ──
  const goNext = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => i - 1);
  }, []);

  // ── Infinite loop: jump back to equivalent position after transition ──
  useEffect(() => {
    // Reached right duplicate end → jump back to first real product
    if (index >= offset + products.length) {
      if (jumpTimer.current) clearTimeout(jumpTimer.current);
      jumpTimer.current = setTimeout(() => {
        setTransitionOn(false);
        setIndex(offset);
      }, 620);
      return () => {
        if (jumpTimer.current) clearTimeout(jumpTimer.current);
      };
    }
    // Reached left duplicate end → jump to last real product
    if (index < offset) {
      if (jumpTimer.current) clearTimeout(jumpTimer.current);
      jumpTimer.current = setTimeout(() => {
        setTransitionOn(false);
        setIndex(offset + products.length - 1);
      }, 620);
      return () => {
        if (jumpTimer.current) clearTimeout(jumpTimer.current);
      };
    }
    // Within real range → ensure transition is on
    setTransitionOn(true);
  }, [index, offset, products.length]);

  // ── Re-enable transition after a no-transition jump ──
  useEffect(() => {
    if (!transitionOn) {
      // Next tick: re-enable transition so subsequent moves animate
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitionOn(true));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionOn]);

  // ── Autoplay (pauses on hover) ──
  useEffect(() => {
    if (isHovering || isDragging) return;
    const t = setInterval(goNext, autoplayMs);
    return () => clearInterval(t);
  }, [goNext, autoplayMs, isHovering, isDragging]);

  // ── Pointer / drag handlers ──
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragState.current = {
      startX: e.clientX,
      currentX: e.clientX,
      isDragging: true,
      startIndex: index,
    };
    setIsDragging(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.isDragging) return;
    dragState.current.currentX = e.clientX;
    const dx = e.clientX - dragState.current.startX;
    if (containerRef.current) {
      const cellWidth = containerRef.current.offsetWidth / visible;
      const offsetPx = Math.max(-cellWidth, Math.min(cellWidth, dx));
      setDragOffset(offsetPx);
    }
  };

  const finishDrag = (e: React.PointerEvent) => {
    if (!dragState.current.isDragging) return;
    const dx = dragState.current.currentX - dragState.current.startX;
    const threshold = 50;
    setDragOffset(0);
    dragState.current.isDragging = false;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    if (dx < -threshold) goNext();
    else if (dx > threshold) goPrev();
  };

  // ── Wheel (horizontal trackpad swipe) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < 20 && Math.abs(e.deltaY) < 20) return;
      // Prefer horizontal if dominant, otherwise allow vertical-to-horizontal
      const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 20) return;
      if (wheelLock.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      wheelLock.current = true;
      if (delta > 0) goNext();
      else goPrev();
      setTimeout(() => {
        wheelLock.current = false;
      }, 450);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [goNext, goPrev]);

  // ── Keyboard ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const isOurs = el === containerRef.current || containerRef.current?.contains(el as Node);
      if (!isOurs) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // ── Computed transform ──
  // Each cell occupies (100 / visible)% of the viewport.
  // To translate by `index` cells, move by -(index * 100 / visible)%.
  const baseTranslatePct = -(index * 100) / visible;
  const dragPct = containerRef.current
    ? (dragOffset / containerRef.current.offsetWidth) * 100
    : 0;
  const transform = `translate3d(${baseTranslatePct + dragPct}%, 0, 0)`;

  return (
    <section
      id={id}
      style={{
        background,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* ── Title block ── */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          {eyebrow && (
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.28em',
                margin: '0 0 16px 0',
              }}
            >
              {eyebrow}
            </p>
          )}
          <h2
            style={{
              fontSize: 'clamp(36px, 4.8vw, 60px)',
              fontWeight: 800,
              color: '#0A0A0A',
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                fontSize: 'clamp(15px, 1.1vw, 17px)',
                color: '#666',
                margin: '16px 0 0 0',
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* ── Navigation arrows (centered) ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            marginBottom: 56,
          }}
        >
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous products"
            className="pps-arrow"
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '1.5px solid #E5E5E5',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0A0A0A',
              transition:
                'background-color 250ms cubic-bezier(0.16, 1, 0.3, 1), color 250ms cubic-bezier(0.16, 1, 0.3, 1), border-color 250ms cubic-bezier(0.16, 1, 0.3, 1)',
              outline: 'none',
              padding: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next products"
            className="pps-arrow"
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '1.5px solid #E5E5E5',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0A0A0A',
              transition:
                'background-color 250ms cubic-bezier(0.16, 1, 0.3, 1), color 250ms cubic-bezier(0.16, 1, 0.3, 1), border-color 250ms cubic-bezier(0.16, 1, 0.3, 1)',
              outline: 'none',
              padding: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* ── Slider viewport ── */}
        <div
          ref={containerRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onPointerLeave={finishDrag}
          style={{
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
            outline: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              transform,
              transition: isDragging
                ? 'none'
                : transitionOn
                ? 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'none',
              willChange: 'transform',
            }}
          >
            {extended.map((product, i) => (
              <div
                key={`${product.id}-${i}`}
                style={{
                  flex: `0 0 ${100 / visible}%`,
                  maxWidth: `${100 / visible}%`,
                  padding: '0 18px',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  className="pps-product"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    pointerEvents: isDragging ? 'none' : 'auto',
                  }}
                >
                  {/* Image — floating on white, NO card. Actions overlay sits on top. */}
                  <Link
                    href={product.href}
                    aria-label={`${product.brand} ${product.name} — ${product.price}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <div
                      className="pps-image-wrap"
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 280,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        draggable={false}
                        className="pps-product-img"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 20px 28px rgba(0,0,0,0.13))',
                          transition:
                            'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), filter 500ms ease',
                          userSelect: 'none',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </Link>

                  {/* Text block */}
                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: 24,
                      maxWidth: 280,
                      padding: '0 8px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: '#9ca3af',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em',
                        margin: '0 0 6px 0',
                      }}
                    >
                      {product.brand}
                    </p>
                    <Link
                      href={product.href}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: '#0A0A0A',
                          lineHeight: 1.4,
                          margin: '0 0 12px 0',
                          minHeight: 42,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                        marginBottom: 16,
                      }}
                    >
                      {/* Brand-theme price (black) — replaces off-brand red */}
                      <span
                        style={{
                          color: '#0A0A0A',
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {product.price}
                      </span>
                      {product.comparePrice && (
                        <span
                          style={{
                            color: '#9ca3af',
                            fontSize: 13,
                            textDecoration: 'line-through',
                            fontWeight: 400,
                          }}
                        >
                          {product.comparePrice}
                        </span>
                      )}
                    </div>
                    {/* Card-style Add to Cart CTA below the price.
                        Single primary CTA per user spec — the floating
                        overlay pill above the image has been removed. */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <ProductCardActions product={product} layout="card" variant="light" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pagination dots ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 56,
          }}
        >
          {products.map((_, i) => {
            const realIdx = ((index - offset) % products.length + products.length) % products.length;
            const isActive = i === realIdx;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to product ${i + 1}`}
                onClick={() => setIndex(offset + i)}
                style={{
                  width: isActive ? 24 : 8,
                  height: 8,
                  borderRadius: 999,
                  border: 'none',
                  background: isActive ? '#0A0A0A' : '#D1D5DB',
                  cursor: 'pointer',
                  padding: 0,
                  transition:
                    'width 350ms cubic-bezier(0.16, 1, 0.3, 1), background-color 350ms ease',
                }}
              />
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .pps-arrow:hover {
          background-color: #0a0a0a !important;
          color: #ffffff !important;
          border-color: #0a0a0a !important;
        }
        .pps-arrow:focus-visible {
          outline: 2px solid #0a0a0a;
          outline-offset: 3px;
        }
        .pps-product:hover .pps-product-img {
          transform: translateY(-10px);
          filter: drop-shadow(0 32px 42px rgba(0, 0, 0, 0.2));
        }
        @media (max-width: 1023px) {
          .pps-image-wrap {
            height: 240px !important;
          }
        }
        @media (max-width: 767px) {
          .pps-image-wrap {
            height: 200px !important;
          }
        }
      `}</style>
    </section>
  );
}
