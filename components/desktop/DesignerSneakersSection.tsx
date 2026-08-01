'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { DESIGNER_SNEAKERS } from './sliderProducts';
import type { SliderProduct } from './PremiumProductSlider';

/**
 * DesignerSneakersSection — premium luxury maison showcase.
 *
 * ── Visual contract (Screenshot 648, refined) ──
 *  Pure white background. NO product cards. NO card borders. NO card shadows.
 *  NO category pills (Gucci / Amiri / Balenciaga chips removed).
 *  NO badges (Instant Ship / Monsoon Sale removed).
 *  Shoes float directly on the page background with only a soft drop-shadow
 *  on the image itself (filter, not box-shadow).
 *
 *  Layout (top → bottom):
 *    1. Centered eyebrow (small uppercase grey)
 *    2. Centered header row — "Designer Sneakers" + nav arrows immediately
 *       beside the title (← → to the right). Title + arrows form ONE
 *       centered unit.
 *    3. Horizontal product row (5 visible desktop, 3 tablet, 2 mobile) with
 *       TIGHT spacing below the heading — no large gap.
 *
 *  Per-product (top → bottom):
 *    1. Transparent PNG product image (~300px tall) with soft drop-shadow
 *    2. Brand name (small, uppercase, grey)
 *    3. Product name (medium, black, weight 500)
 *    4. Price row: red bold current + grey strikethrough original
 *    5. Single 'Add to Cart' CTA button (pill, black, uppercase, cart icon)
 *
 * ── Interaction ──
 *  - Click prev/next arrows (beside the title)
 *  - Drag / swipe (pointer events: mouse + touch + pen)
 *  - Horizontal wheel / trackpad swipe
 *  - Arrow keys (when focused)
 *  - Autoplay every 6s (pauses on hover)
 *  - Infinite loop (3x duplication + seamless jump-back)
 *
 * ── Hover ──
 *  Image lifts (translateY -10px) + drop-shadow deepens. Smooth 500ms ease.
 */

interface DesignerSneakersSectionProps {
  /** Optional override of the default product list. */
  products?: SliderProduct[];
  /** Optional override of how many products are visible per viewport. */
  visibleCount?: { desktop: number; tablet: number; mobile: number };
}

const DEFAULT_VISIBLE = { desktop: 5, tablet: 3, mobile: 2 };

export default function DesignerSneakersSection({
  products = DESIGNER_SNEAKERS,
  visibleCount = DEFAULT_VISIBLE,
}: DesignerSneakersSectionProps) {
  // ── Cart integration ──
  const { addToCart, showToast } = useApp();

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
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitionOn(true));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionOn]);

  // ── Autoplay (pauses on hover / drag) ──
  useEffect(() => {
    if (isHovering || isDragging) return;
    const t = setInterval(goNext, 6000);
    return () => clearInterval(t);
  }, [goNext, isHovering, isDragging]);

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
  const baseTranslatePct = -(index * 100) / visible;
  const dragPct = containerRef.current
    ? (dragOffset / containerRef.current.offsetWidth) * 100
    : 0;
  const transform = `translate3d(${baseTranslatePct + dragPct}%, 0, 0)`;

  // ── Arrow button factory (used twice: in the title row) ──
  const ArrowButton = ({ direction }: { direction: 'prev' | 'next' }) => {
    const isPrev = direction === 'prev';
    return (
      <button
        type="button"
        onClick={isPrev ? goPrev : goNext}
        aria-label={isPrev ? 'Previous designer sneakers' : 'Next designer sneakers'}
        className="ds-arrow"
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '1.5px solid #E5E5E5',
          background: 'transparent',
          cursor: 'pointer',
          display: 'inline-flex',
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
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isPrev ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
          />
        </svg>
      </button>
    );
  };

  return (
    <section
      id="designer-sneakers"
      style={{
        background: '#ffffff',
        paddingTop: 96,
        paddingBottom: 112,
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
        {/* ── Header row: eyebrow + centered (title + arrows beside it) ── */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.28em',
              margin: '0 0 14px 0',
            }}
          >
            Maison Edit
          </p>
          {/* Title + arrows as ONE centered unit */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(40px, 5.4vw, 72px)',
                fontWeight: 800,
                color: '#0A0A0A',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              Designer Sneakers
            </h2>
            <div style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
              <ArrowButton direction="prev" />
              <ArrowButton direction="next" />
            </div>
          </div>
        </div>

        {/* ── Slider viewport ── */}
        <div
          ref={containerRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Designer Sneakers"
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
                  className="ds-product"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    pointerEvents: isDragging ? 'none' : 'auto',
                  }}
                >
                  {/* Image — floating on white, NO card */}
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
                      className="ds-image-wrap"
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 300,
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
                        className="ds-product-img"
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
                      maxWidth: 300,
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
                      <span
                        style={{
                          color: '#DC2626',
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
                    {/* Single premium CTA — Add to Cart */}
                    <button
                      type="button"
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.priceValue,
                          image: product.image,
                          qty: 1,
                        });
                        showToast(`${product.name} added to cart`);
                      }}
                      className="ds-cta"
                      style={{
                        background: '#0A0A0A',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 999,
                        padding: '11px 24px',
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        transition:
                          'background-color 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      Add to Cart
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
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </button>
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
            marginTop: 48,
          }}
        >
          {products.map((_, i) => {
            const realIdx = ((index - offset) % products.length + products.length) % products.length;
            const isActive = i === realIdx;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to designer sneaker ${i + 1}`}
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
        .ds-arrow:hover {
          background-color: #0a0a0a !important;
          color: #ffffff !important;
          border-color: #0a0a0a !important;
        }
        .ds-arrow:focus-visible {
          outline: 2px solid #0a0a0a;
          outline-offset: 3px;
        }
        .ds-product:hover .ds-product-img {
          transform: translateY(-10px);
          filter: drop-shadow(0 32px 42px rgba(0, 0, 0, 0.2));
        }
        .ds-cta:hover {
          background-color: #1f1f1f !important;
          transform: translateY(-1px);
        }
        .ds-cta:focus-visible {
          outline: 2px solid #0a0a0a;
          outline-offset: 3px;
        }
        @media (max-width: 1023px) {
          .ds-image-wrap {
            height: 250px !important;
          }
        }
        @media (max-width: 767px) {
          .ds-image-wrap {
            height: 210px !important;
          }
        }
      `}</style>
    </section>
  );
}
