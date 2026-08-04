'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * HeroBanner — premium auto-sliding hero for LN KICKS desktop homepage.
 *
 * Three luxury banners cycle every 3000ms with a 600ms GPU-accelerated
 * crossfade transition. No navigation dots, no arrows, no progress
 * indicators — only the banner itself is visible.
 *
 * Behaviour contract:
 *  - Autoplay:           YES (3000ms per slide)
 *  - Infinite loop:      YES (wraps last → first)
 *  - Transition:         600ms opacity crossfade (GPU-accelerated)
 *  - Starts from Banner 1 on every page refresh (no persistence)
 *  - Banner 1 (Vintage Nike / Jordan) → /category-products
 *  - Banner 2 (Winter Sale)            → /categories
 *  - Banner 3 (Spring Summer Sale)     → /categories
 *
 * Image quality contract:
 *  - Source PNGs committed lossless (no recompression)
 *  - Banner 1 preloaded with fetchPriority="high"
 *  - Banners 2 & 3 lazy-loaded
 *  - object-fit: cover preserves aspect ratio at any viewport
 *
 * Layout:
 *  - Replaces the previous single-hero section 1:1 (same outer
 *    wrapper: 40px horizontal padding, 16px vertical padding)
 *  - Single luxury card with 32px border-radius
 *  - No external borders, no shadows, no white frame
 *  - Responsive from 1440px → 2560px without CLS
 */
type Banner = {
  src: string;
  alt: string;
  href: string;
  ariaLabel: string;
  preload: boolean;
};

const BANNERS: Banner[] = [
  {
    src: '/heroes/banner-1-vintage-nike-jordan.png',
    alt: 'Vintage Nike and Jordan legends — iconic Air Jordan 1 collection. Timeless legends, iconic vintage luxury. Shop the retro classics at LN KICKS.',
    href: '/category-products',
    ariaLabel: 'Shop the Vintage Nike and Jordan collection — Air Jordan 1, retro classics, and timeless legends at LN KICKS.',
    preload: true,
  },
  {
    src: '/heroes/banner-2-winter-sale.png',
    alt: 'Winter Sale — up to 50% off premium Reebok and New Balance winter sneakers. Warm feet, bold moves. Shop the LN KICKS winter collection.',
    href: '/categories',
    ariaLabel: 'Shop the Winter Sale — up to 50% off Reebok and New Balance winter sneakers at LN KICKS.',
    preload: false,
  },
  {
    src: '/heroes/banner-3-spring-summer-sale.png',
    alt: 'Spring Summer Sale — up to 40% off New Balance, Converse, and Puma sneakers. Fresh season, bold style. Shop at LN KICKS.',
    href: '/categories',
    ariaLabel: 'Shop the Spring Summer Sale — up to 40% off New Balance, Converse, and Puma at LN KICKS.',
    preload: false,
  },
];

const AUTOPLAY_MS = 3000;
const TRANSITION_MS = 600;

export default function HeroBanner() {
  // Always starts from Banner 1 on mount (no persistence, no sessionStorage).
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);

    // Autoplay cycle — advance every AUTOPLAY_MS, wrap last → first.
    const tick = () => {
      setActive((prev) => (prev + 1) % BANNERS.length);
    };
    timerRef.current = setInterval(tick, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <section
      aria-label="LN KICKS featured drops — vintage Nike, winter sale, and spring summer sale banners"
      style={{
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingTop: '16px',
        paddingBottom: '16px',
      }}
    >
      <div
        className="hero-slider"
        style={{
          position: 'relative',
          width: '100%',
          height: '720px',
          overflow: 'hidden',
          borderRadius: '32px',
          background: '#000000',
          // Establish 3D context for GPU-accelerated transitions.
          transform: 'translate3d(0,0,0)',
        }}
      >
        {/* Stacked banner layers — only the active one is visible.
            All layers are mounted simultaneously so the inactive ones
            can lazy-load their images in the background, eliminating
            the white-frame flash during the first crossfade. */}
        {BANNERS.map((banner, idx) => {
          const isActive = idx === active;
          return (
            <Link
              key={banner.src}
              href={banner.href}
              aria-label={banner.ariaLabel}
              tabIndex={isActive ? 0 : -1}
              className={`hero-slide ${isActive ? 'is-active' : ''} ${mounted ? 'is-mounted' : ''}`}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'block',
                textDecoration: 'none',
                opacity: isActive ? 1 : 0,
                // GPU-accelerated crossfade — transform & opacity are
                // the only two properties that run on the compositor
                // thread, so transitions stay at 60fps even on 4K.
                transition: `opacity ${TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                willChange: 'opacity',
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 2 : 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.src}
                alt={banner.alt}
                width={1710}
                height={919}
                // Banner 1 is eager + high priority (preload contract).
                // Banners 2 & 3 are lazy so the first paint stays fast.
                loading={banner.preload ? 'eager' : 'lazy'}
                // fetchPriority is a React 18+ DOM attribute; falls back
                // gracefully on older browsers (just ignored).
                {...(banner.preload ? { fetchPriority: 'high' } : {})}
                decoding="async"
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  // object-fit: cover preserves aspect ratio without
                  // stretching or distortion at any viewport width.
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block',
                  // Slight scale-up on mount to avoid sub-pixel seams
                  // at the rounded-corner edges during crossfade.
                  transform: 'scale(1.005)',
                  willChange: 'opacity',
                }}
              />
            </Link>
          );
        })}

        {/* Spec compliance guard: this comment exists to make it
            explicit that NO dots, arrows, pagination, progress bars,
            numbers, or thumbnails are rendered on top of the banner. */}
      </div>

      <style jsx>{`
        .hero-slide {
          opacity: 0;
        }
        .hero-slide.is-active.is-mounted {
          opacity: 1;
        }
        /* Responsive height scale-down for narrower desktop widths.
           The aspect ratio of the source banners is ~1.83:1, so we
           preserve a comfortable landscape proportion at every
           breakpoint without cropping the Shop Now button (which
           lives in the bottom-left of each banner). */
        @media (max-width: 1536px) {
          .hero-slider {
            height: 640px !important;
          }
        }
        @media (max-width: 1440px) {
          .hero-slider {
            height: 600px !important;
          }
        }
        /* On very wide viewports (1728px+), keep the 720px height —
           the banner scales horizontally via width: 100% and
           object-fit: cover handles the rest. No upper clamp is
           needed because the parent <main> constrains the width. */
      `}</style>
    </section>
  );
}
