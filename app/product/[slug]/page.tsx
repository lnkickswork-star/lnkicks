'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ResponsiveProductCard } from '@/components/ResponsiveProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { resolveImage } from '@/lib/images';
import { useIsMobile } from '@/lib/mobile/utils/useIsMobile';
import { DesktopProductDetail } from '@/components/desktop/DesktopProductDetail';

/**
 * ProductDetailPage — flagship mobile product page.
 *
 * Phase 29 (Mobile Product Page UI Refinement):
 *  - Breadcrumbs REMOVED. Page starts cleanly with the image gallery
 *    directly under the header (no empty space).
 *  - SIZE SELECTOR now shows a subtle "Only N left" low-stock pill above
 *    each size button. Counts are deterministic per product+size (1-3
 *    range) so they stay stable across re-renders.
 *  - COLOR SELECTOR redesigned: text buttons replaced with circular
 *    swatches filled with the actual color hex. A `colorToHex` mapper
 *    resolves any color name (Black, White, Powder Blue, Core Black,
 *    Silver, Grey, Sea Salt, Gold, Red, Green, etc.) to a real color.
 *    White swatch gets a subtle border for visibility. Selected swatch
 *    shows a premium 2px ring with a 4px offset, animated with a 200ms
 *    ease-out transition (no blinking, no oversized animation).
 *  - "Selected Color: <name>" label below swatches keeps the visible
 *    text label perfectly synchronized with the highlighted swatch.
 *  - Spacing rebalanced: paddingTop on first child removed (MobileLayout
 *    main already has spacing.lg top padding). Image gallery sits flush
 *    below the header.
 *
 * Phase 4 (Universal Polish) — preserved:
 *  - Mounts <MobileLayout headerVariant="back" title={product.brand}>
 *  - Add-to-Cart + Buy Now buttons wired to useApp().addToCart with
 *    haptic feedback and an explicit toast.
 *  - Trust badges: SVG checkmarks in a grey50 card.
 *  - All colors/sizes/radii use mobile design tokens.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */

/* ─────────────────────────────────────────────────────────────────────
 *  COLOR NAME → HEX MAPPING
 *  Resolves any product color name to a real hex value for swatch fill.
 *  Keyword-based so "Core Black", "Matte Black", "Triple Black" all
 *  resolve to black. Falls back to a neutral grey for unknowns.
 * ──────────────────────────────────────────────────────────────────── */
function colorToHex(name: string): string {
  const n = name.toLowerCase().trim();

  // ── Whites / off-whites (need a border, handled separately) ─────────
  if (
    n.includes('white') ||
    n.includes('sea salt') ||
    n.includes('bone') ||
    n.includes('cream') ||
    n.includes('off white') ||
    n.includes('ivory') ||
    n.includes('pearl')
  ) {
    return '#FFFFFF';
  }

  // ── Blacks ──────────────────────────────────────────────────────────
  if (n.includes('black')) return '#0A0A0A';

  // ── Greys / silvers ────────────────────────────────────────────────
  if (n.includes('silver') || n.includes('metallic')) return '#C0C5CA';
  if (n.includes('grey') || n.includes('gray') || n.includes('ash')) return '#9CA3AF';
  if (n.includes('stone') || n.includes('graphite')) return '#52525B';

  // ── Blues ──────────────────────────────────────────────────────────
  if (n.includes('navy') || n.includes('midnight')) return '#1E293B';
  if (n.includes('royal')) return '#1D4ED8';
  if (n.includes('powder') || n.includes('sky')) return '#A5C9E0';
  if (n.includes('baby blue')) return '#BFDBFE';
  if (n.includes('blue')) return '#2563EB';

  // ── Reds ───────────────────────────────────────────────────────────
  if (n.includes('burgundy') || n.includes('wine')) return '#5B1A1A';
  if (n.includes('crimson')) return '#B91C1C';
  if (n.includes('red')) return '#DC2626';

  // ── Greens ─────────────────────────────────────────────────────────
  if (n.includes('olive')) return '#4D5B2A';
  if (n.includes('mint')) return '#A7F3D0';
  if (n.includes('forest')) return '#166534';
  if (n.includes('green')) return '#16A34A';

  // ── Yellows / golds ────────────────────────────────────────────────
  if (n.includes('gold') || n.includes('champagne')) return '#D4AF37';
  if (n.includes('yellow') || n.includes('amber')) return '#F59E0B';

  // ── Pinks / purples ────────────────────────────────────────────────
  if (n.includes('rose') || n.includes('pink') || n.includes('coral')) return '#EC4899';
  if (n.includes('purple') || n.includes('violet') || n.includes('lavender')) return '#7C3AED';

  // ── Oranges / browns ───────────────────────────────────────────────
  if (n.includes('orange')) return '#EA580C';
  if (n.includes('brown') || n.includes('tan') || n.includes('cognac')) return '#78350F';

  // ── Fallback ───────────────────────────────────────────────────────
  return '#9CA3AF';
}

/** Returns true for white/light colors that need a subtle border for visibility. */
function isLightColor(name: string): boolean {
  const hex = colorToHex(name);
  // Parse hex → relative luminance
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return false;
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;
  // Standard relative luminance formula (per WCAG)
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.85;
}

/* ─────────────────────────────────────────────────────────────────────
 *  LOW-STOCK COUNT — deterministic per (productId, size)
 *  Returns 1, 2, or 3 so it stays stable across re-renders but varies
 *  across sizes within the same product.
 * ──────────────────────────────────────────────────────────────────── */
function getLowStockCount(productId: string, size: string): number {
  let h = 0;
  const s = `${productId}|${size}`;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return 1 + (h % 3); // 1, 2, or 3
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { addToCart, showToast } = useApp();
  const isMobile = useIsMobile();

  const product =
    PRODUCT_REGISTRY.find((p) => p.slug === slug) || PRODUCT_REGISTRY[0];

  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes[0] || 'UK 8',
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.availableColors[0] || 'Default',
  );
  const [activeImg, setActiveImg] = useState<string>(product.primaryImage);

  // ── Precompute low-stock counts per size (stable per product+size) ──
  const stockBySize = useMemo(() => {
    const map: Record<string, number> = {};
    for (const sz of product.availableSizes) {
      map[sz] = getLowStockCount(product.id, sz);
    }
    return map;
  }, [product.id, product.availableSizes]);

  const handleAddToCart = useCallback(() => {
    haptic.medium();
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: `${product.name} (${selectedSize}, ${selectedColor})`,
      price: product.price,
      image: resolveImage(product.primaryImage),
      qty: 1,
    });
    showToast(`${product.name} added to cart`);
  }, [product, selectedSize, selectedColor, addToCart, showToast]);

  const handleBuyNow = useCallback(() => {
    haptic.medium();
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: `${product.name} (${selectedSize}, ${selectedColor})`,
      price: product.price,
      image: resolveImage(product.primaryImage),
      qty: 1,
    });
    router.push('/checkout');
  }, [product, selectedSize, selectedColor, addToCart, router]);

  const handleThumbTap = useCallback((img: string) => {
    haptic.selection();
    setActiveImg(img);
  }, []);

  const handleSizeTap = useCallback((sz: string) => {
    haptic.selection();
    setSelectedSize(sz);
  }, []);

  const handleColorTap = useCallback((c: string) => {
    haptic.selection();
    setSelectedColor(c);
  }, []);

  // ── Desktop: render the premium desktop PDP layout ────────────────
  // MobileLayout will detect desktop and wrap this in DesktopShell
  // (AnnouncementBar + MainHeader + MainFooter), but we still pass
  // desktopMaxWidth=1280 and a synthetic breadcrumb so the page
  // looks intentional on desktop rather than stretched-mobile.
  //
  // IMPORTANT: we must call all hooks above (useState, useMemo,
  // useCallback) BEFORE any early return, to satisfy the Rules of
  // Hooks. The mobile branch below uses some of these hooks; the
  // desktop branch (DesktopProductDetail) manages its own state.
  if (isMobile === false) {
    return (
      <MobileLayout
        headerVariant="back"
        title={product.brand}
        desktopMaxWidth={1280}
        desktopPaddingTop={32}
        desktopPaddingBottom={96}
      >
        <DesktopProductDetail product={product} />
      </MobileLayout>
    );
  }

  // During SSR + first paint, isMobile is null — render the mobile
  // layout (which itself returns null until detection completes, so
  // there's no flash of wrong content).
  return (
    <MobileLayout headerVariant="back" title={product.brand}>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* ── IMAGE GALLERY ─────────────────────────────────────────────
            Phase 29: breadcrumb removed. Gallery now sits flush below
            the header (MobileLayout main already has spacing.lg top). */}
        <div
          style={{
            background: theme.colors.white,
            borderRadius: theme.radius.xxl,
            padding: theme.spacing.xxl,
            border: `1px solid ${theme.colors.grey150}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: 320,
            marginBottom: theme.spacing.md,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: theme.spacing.md,
              left: theme.spacing.md,
              background: theme.colors.black,
              color: theme.colors.white,
              fontSize: theme.fontSize.xs,
              fontWeight: theme.fontWeight.extrabold,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
              padding: `${theme.spacing.xs + 1}px ${theme.spacing.sm + 2}px`,
              borderRadius: theme.radius.pill,
            }}
          >
            Authentic
          </span>

          <Image
            src={resolveImage(activeImg)}
            alt={product.name}
            width={300}
            height={300}
            priority
            style={{
              maxHeight: '260px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              filter: theme.dropShadows.lg,
            }}
          />
        </div>

        {/* THUMBNAILS */}
        <div
          style={{
            display: 'flex',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xxl,
          }}
        >
          {product.images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleThumbTap(img)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={activeImg === img}
              className="pressable pdp-thumb"
              style={{
                width: 72,
                height: 72,
                borderRadius: theme.radius.lg,
                background: theme.colors.white,
                border:
                  activeImg === img
                    ? `2px solid ${theme.colors.black}`
                    : `1px solid ${theme.colors.grey150}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: theme.spacing.xs + 2,
              }}
            >
              <Image
                src={resolveImage(img)}
                alt="Thumbnail"
                width={56}
                height={56}
                style={{
                  maxHeight: '56px',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: theme.dropShadows.xs,
                }}
              />
            </button>
          ))}
        </div>

        {/* PRODUCT INFO */}
        <div
          style={{
            fontSize: theme.fontSize.xs,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: theme.letterSpacing.wider,
            textTransform: 'uppercase',
            color: theme.colors.textSecondary,
          }}
        >
          {product.brand}
        </div>
        <h1
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.h1,
            fontWeight: theme.fontWeight.extrabold,
            color: theme.colors.textPrimary,
            margin: `${theme.spacing.xs}px 0 ${theme.spacing.md}px 0`,
            lineHeight: theme.lineHeight.tight,
            letterSpacing: theme.letterSpacing.tight,
          }}
        >
          {product.name}
        </h1>

        {/* PRICE + STOCK */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: theme.fontSize.h2,
              fontWeight: theme.fontWeight.black,
              color: theme.colors.price,
              letterSpacing: theme.letterSpacing.tight,
            }}
          >
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.comparePrice && (
            <span
              style={{
                fontSize: theme.fontSize.md,
                color: theme.colors.textTertiary,
                textDecoration: 'line-through',
                fontWeight: theme.fontWeight.regular,
              }}
            >
              ₹{product.comparePrice.toLocaleString('en-IN')}
            </span>
          )}
          <span
            style={{
              fontSize: theme.fontSize.xs,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.success,
              background: '#E3FCEF',
              padding: `${theme.spacing.xs + 1}px ${theme.spacing.sm + 2}px`,
              borderRadius: theme.radius.pill,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            In Stock
          </span>
        </div>

        <p
          style={{
            fontSize: theme.fontSize.md,
            color: theme.colors.textSecondary,
            lineHeight: theme.lineHeight.relaxed,
            marginBottom: theme.spacing.xxl,
          }}
        >
          {product.shortDescription}
        </p>

        {/* ── SIZE SELECTOR ─────────────────────────────────────────────
            Phase 29: each size now has a "Only N left" low-stock pill
            rendered above the size button. Layout = vertical column
            per size (pill + button stacked). Counts are deterministic
            per (productId, size), stable across re-renders. */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: theme.fontSize.sm,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.md,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            <span>Select Size (UK)</span>
            <Link
              href="/size-guide"
              style={{
                textDecoration: 'underline',
                color: theme.colors.textSecondary,
                fontSize: theme.fontSize.sm,
                fontWeight: theme.fontWeight.medium,
                letterSpacing: 'normal',
                textTransform: 'none',
              }}
            >
              Size Guide
            </Link>
          </div>
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.sm + 2,
              flexWrap: 'wrap',
              alignItems: 'flex-end', // pill+button columns align at the bottom
            }}
          >
            {product.availableSizes.map((sz) => {
              const active = selectedSize === sz;
              const stock = stockBySize[sz] ?? 2;
              return (
                <div
                  key={sz}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {/* Low-stock pill */}
                  <span
                    aria-label={`Only ${stock} left in ${sz}`}
                    style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: theme.fontWeight.medium,
                      letterSpacing: 0.2,
                      color: theme.colors.warning,
                      background: '#FEF6E7',
                      padding: '2px 8px',
                      borderRadius: theme.radius.pill,
                      lineHeight: 1.4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Only {stock} left
                  </span>

                  {/* Size button */}
                  <button
                    type="button"
                    onClick={() => handleSizeTap(sz)}
                    aria-pressed={active}
                    className="pressable pdp-size"
                    style={{
                      padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                      borderRadius: theme.radius.lg,
                      border: active
                        ? `2px solid ${theme.colors.black}`
                        : `1px solid ${theme.colors.grey300}`,
                      background: active ? theme.colors.black : theme.colors.white,
                      color: active ? theme.colors.white : theme.colors.textPrimary,
                      fontSize: theme.fontSize.body,
                      fontWeight: theme.fontWeight.bold,
                      cursor: 'pointer',
                      transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {sz}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── COLOR SELECTOR ────────────────────────────────────────────
            Phase 29 redesign: text buttons replaced with circular
            swatches filled with the actual color hex. Selected swatch
            shows a premium 2px ring offset 3px from the swatch, with a
            200ms ease-out transition (no blinking). A "Selected Color:
            <name>" label below keeps the text label synchronized with
            the highlighted swatch. */}
        <div style={{ marginBottom: theme.spacing.xxl }}>
          <div
            style={{
              fontSize: theme.fontSize.sm,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.md,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            Select Color
          </div>

          {/* Swatch row */}
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.md,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {product.availableColors.map((c) => {
              const active = selectedColor === c;
              const hex = colorToHex(c);
              const needsBorder = isLightColor(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorTap(c)}
                  aria-pressed={active}
                  aria-label={`Color: ${c}${active ? ' (selected)' : ''}`}
                  className="pressable pdp-color"
                  style={{
                    // Outer button = the ring + offset container
                    width: 44,
                    height: 44,
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // 200ms transition on the ring (premium, subtle)
                    transition:
                      'box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    // The ring is a box-shadow so it animates smoothly
                    boxShadow: active
                      ? `0 0 0 2px ${theme.colors.white}, 0 0 0 4px ${theme.colors.black}`
                      : 'none',
                  }}
                >
                  {/* Inner swatch — actual color fill */}
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'block',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: hex,
                      // White / off-white gets a subtle border for visibility
                      border: needsBorder
                        ? `1px solid ${theme.colors.grey300}`
                        : 'none',
                      boxShadow: active
                        ? '0 1px 2px rgba(17,17,17,0.10)'
                        : '0 1px 2px rgba(17,17,17,0.08)',
                      transition:
                        'box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Selected Color label — syncs perfectly with the active swatch */}
          <div
            aria-live="polite"
            style={{
              marginTop: theme.spacing.md,
              fontSize: theme.fontSize.body,
              color: theme.colors.textSecondary,
              fontWeight: theme.fontWeight.regular,
            }}
          >
            Selected Color:{' '}
            <span
              style={{
                color: theme.colors.textPrimary,
                fontWeight: theme.fontWeight.semibold,
              }}
            >
              {selectedColor}
            </span>
          </div>
        </div>

        {/* PURCHASE BUTTONS — FUNCTIONAL */}
        <div
          style={{
            display: 'flex',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xxl,
          }}
        >
          <button
            type="button"
            onClick={handleAddToCart}
            className="pressable-strong pdp-cta"
            aria-label={`Add ${product.name} to cart`}
            style={{
              flex: 1,
              padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
              background: theme.colors.black,
              color: theme.colors.white,
              borderRadius: theme.radius.pill,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="pressable-strong pdp-cta"
            aria-label={`Buy ${product.name} now`}
            style={{
              flex: 1,
              padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
              background: theme.colors.white,
              color: theme.colors.black,
              borderRadius: theme.radius.pill,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              border: `1.5px solid ${theme.colors.black}`,
              cursor: 'pointer',
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
            }}
          >
            Buy Now
          </button>
        </div>

        {/* TRUST BADGES */}
        <div
          style={{
            background: theme.colors.grey50,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
            fontSize: theme.fontSize.body,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.giant,
          }}
        >
          {[
            '100% Authentic Guarantee with LNKICKS Verification Tag',
            'Express Shipping in 2-4 Business Days across India',
            '7-Day Hassle-Free Return & Exchange Policy',
          ].map((line) => (
            <div
              key={line}
              style={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.sm }}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke={theme.colors.black}
                strokeWidth="2.6"
                aria-hidden
                style={{ flexShrink: 0, marginTop: 2 }}
              >
                <polyline
                  points="20 6 9 17 4 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{line}</span>
            </div>
          ))}
        </div>

        {/* RELATED PRODUCTS */}
        <div
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: theme.spacing.xxl,
            marginBottom: theme.spacing.xxl,
          }}
        >
          <h2
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h2,
              fontWeight: theme.fontWeight.extrabold,
              textTransform: 'uppercase',
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.xl,
              letterSpacing: theme.letterSpacing.tight,
            }}
          >
            You Might Also Like
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: theme.spacing.md,
            }}
          >
            {PRODUCT_REGISTRY.slice(1, 5).map((p) => (
              <ResponsiveProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .pdp-thumb:active {
          transform: scale(0.94);
        }
        .pdp-thumb:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .pdp-size:active {
          transform: scale(0.96);
        }
        .pdp-size:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .pdp-color:active {
          transform: scale(0.94);
        }
        .pdp-color:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
          border-radius: 50%;
        }
        .pdp-cta:active {
          transform: scale(0.97);
        }
        .pdp-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
