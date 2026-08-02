'use client';

import React, { useState, useCallback } from 'react';
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

/**
 * ProductDetailPage — flagship mobile product page.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title={product.name}> so the
 *    page gets the same premium chrome (glass header, floating bottom nav
 *    with Cart FAB, menu drawer, safe-area) as the mobile homepage.
 *  - All hardcoded colors / sizes / radii migrated to mobile design tokens.
 *  - Add-to-Cart + Buy Now buttons are now FUNCTIONAL — wired to
 *    useApp().addToCart with the selected size + color, haptic feedback,
 *    and an explicit toast.
 *  - Banned iOS red #FF3B30 removed — price is BLACK (theme.colors.price),
 *    "IN STOCK" badge uses muted success green (theme.colors.success +
 *    a soft green-tint background — no harsh greens).
 *  - Image gallery: token-driven radius/padding, smaller height (320 vs
 *    380), drop-shadow.lg, black "AUTHENTIC" badge (not red).
 *  - Thumbnails: 72x72 with radius.lg + drop-shadow.xs, haptic on tap.
 *  - Size selector: radius.lg, haptic.selection on tap, focus-visible ring.
 *  - Color selector: radius.lg, haptic.selection on tap.
 *  - Trust badges: ✓ SVG icons in a grey50 card (no emoji).
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { addToCart, showToast } = useApp();

  const product =
    PRODUCT_REGISTRY.find((p) => p.slug === slug) || PRODUCT_REGISTRY[0];

  const [selectedSize, setSelectedSize] = useState<string>('UK 8');
  const [selectedColor, setSelectedColor] = useState<string>(
    product.availableColors[0] || 'Default',
  );
  const [activeImg, setActiveImg] = useState<string>(product.primaryImage);

  const handleAddToCart = useCallback(() => {
    haptic.medium();
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: `${product.name} (${selectedSize}, ${selectedColor})`,
      price: product.price,
      image: product.primaryImage,
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
      image: product.primaryImage,
      qty: 1,
    });
    router.push('/checkout');
  }, [product, selectedSize, selectedColor, addToCart, router]);

  const handleThumbTap = useCallback(
    (img: string) => {
      haptic.selection();
      setActiveImg(img);
    },
    [],
  );

  const handleSizeTap = useCallback((sz: string) => {
    haptic.selection();
    setSelectedSize(sz);
  }, []);

  const handleColorTap = useCallback((c: string) => {
    haptic.selection();
    setSelectedColor(c);
  }, []);

  return (
    <MobileLayout headerVariant="back" title={product.brand}>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* BREADCRUMB */}
        <div
          style={{
            fontSize: theme.fontSize.sm,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
          }}
        >
          <Link
            href="/"
            style={{ color: theme.colors.textSecondary, textDecoration: 'none' }}
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            style={{ color: theme.colors.textSecondary, textDecoration: 'none' }}
          >
            Products
          </Link>
          <span>/</span>
          <span style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeight.semibold }}>
            {product.name}
          </span>
        </div>

        {/* IMAGE GALLERY */}
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
            src={activeImg}
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
                src={img}
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

        {/* SIZE SELECTOR */}
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
            }}
          >
            {product.availableSizes.map((sz) => {
              const active = selectedSize === sz;
              return (
                <button
                  key={sz}
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
                    transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLOR SELECTOR */}
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
          <div style={{ display: 'flex', gap: theme.spacing.sm + 2, flexWrap: 'wrap' }}>
            {product.availableColors.map((c) => {
              const active = selectedColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorTap(c)}
                  aria-pressed={active}
                  className="pressable pdp-color"
                  style={{
                    padding: `${theme.spacing.sm + 2}px ${theme.spacing.md}px`,
                    borderRadius: theme.radius.lg,
                    border: active
                      ? `2px solid ${theme.colors.black}`
                      : `1px solid ${theme.colors.grey300}`,
                    background: active ? theme.colors.grey100 : theme.colors.white,
                    color: theme.colors.textPrimary,
                    fontSize: theme.fontSize.sm,
                    fontWeight: theme.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {c}
                </button>
              );
            })}
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
          transform: scale(0.96);
        }
        .pdp-color:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
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
