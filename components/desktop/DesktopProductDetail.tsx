'use client';

/**
 * DesktopProductDetail — premium desktop product detail layout.
 * ============================================================
 *
 * Inspired by Amazon, Nike, GOAT, StockX, Apple Store.
 *
 * Layout (≥769px viewport):
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │  Breadcrumb (Home / Category / Brand / Product)              │
 *   ├─────────────────────┬────────────────────────────────────────┤
 *   │                     │  Brand kicker                          │
 *   │   MAIN IMAGE        │  Product title (large)                 │
 *   │   (large square)    │  Rating row                            │
 *   │                     │  Price + compare + discount %          │
 *   │                     │  Short description                     │
 *   │                     │  ─────────────────────────────         │
 *   │                     │  Color selector (swatches)             │
 *   │                     │  Size selector (grid + size guide link)│
 *   │                     │  Quantity stepper                      │
 *   │                     │  Add to Cart + Buy Now (sticky CTA)    │
 *   │                     │  Wishlist + Share row                  │
 *   │                     │  ─────────────────────────────         │
 *   │                     │  Trust badges (authentic, shipping)    │
 *   │                     │  Delivery info (pincode check)         │
 *   ├─────────────────────┴────────────────────────────────────────┤
 *   │  THUMBNAIL STRIP (horizontal, scrollable)                    │
 *   ├──────────────────────────────────────────────────────────────┤
 *   │  Product Description (long-form)                             │
 *   │  Specifications table                                        │
 *   ├──────────────────────────────────────────────────────────────┤
 *   │  You Might Also Like (4-col grid)                            │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * Image zoom: hover on main image triggers scale(1.6) with cursor
 * crosshair, like Amazon. Touch devices fall back to plain view.
 *
 * All colors/typography match the approved homepage design language:
 *   - Black (#0a0a0a) on white (#ffffff)
 *   - Inter font (with var(--font-inter))
 *   - 16px card radius, 1px #f0f0f0 borders
 *   - Black pill CTAs, 999px radius
 *   - 9px / 700 / 0.22em uppercase brand kickers
 *   - cubic-bezier(0.16,1,0.3,1) easing
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/context/AppContext';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';
import { ResponsiveProductCard } from '@/components/ResponsiveProductCard';
import { resolveImage } from '@/lib/images';
import type { Product } from '@/types';

/* ─────────────────────────────────────────────────────────────────────
 *  COLOR NAME → HEX MAPPING (mirrors mobile PDP)
 * ──────────────────────────────────────────────────────────────────── */
function colorToHex(name: string): string {
  const n = name.toLowerCase().trim();
  if (n.includes('white') || n.includes('sea salt') || n.includes('bone') || n.includes('cream') || n.includes('off white') || n.includes('ivory') || n.includes('pearl')) return '#FFFFFF';
  if (n.includes('black')) return '#0A0A0A';
  if (n.includes('silver') || n.includes('metallic')) return '#C0C5CA';
  if (n.includes('grey') || n.includes('gray') || n.includes('ash')) return '#9CA3AF';
  if (n.includes('stone') || n.includes('graphite')) return '#52525B';
  if (n.includes('navy') || n.includes('midnight')) return '#1E293B';
  if (n.includes('royal')) return '#1D4ED8';
  if (n.includes('powder') || n.includes('sky')) return '#A5C9E0';
  if (n.includes('baby blue')) return '#BFDBFE';
  if (n.includes('blue')) return '#2563EB';
  if (n.includes('burgundy') || n.includes('wine')) return '#5B1A1A';
  if (n.includes('crimson')) return '#B91C1C';
  if (n.includes('red')) return '#DC2626';
  if (n.includes('olive')) return '#4D5B2A';
  if (n.includes('mint')) return '#A7F3D0';
  if (n.includes('forest')) return '#166534';
  if (n.includes('green')) return '#16A34A';
  if (n.includes('gold') || n.includes('champagne')) return '#D4AF37';
  if (n.includes('yellow') || n.includes('amber')) return '#F59E0B';
  if (n.includes('rose') || n.includes('pink') || n.includes('coral')) return '#EC4899';
  if (n.includes('purple') || n.includes('violet') || n.includes('lavender')) return '#7C3AED';
  if (n.includes('orange')) return '#EA580C';
  if (n.includes('brown') || n.includes('tan') || n.includes('cognac')) return '#78350F';
  return '#9CA3AF';
}

function isLightColor(name: string): boolean {
  const hex = colorToHex(name);
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return false;
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.85;
}

function getLowStockCount(productId: string, size: string): number {
  let h = 0;
  const s = `${productId}|${size}`;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return 1 + (h % 3);
}

interface Props {
  product: Product;
}

export function DesktopProductDetail({ product }: Props) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist, showToast } = useApp();

  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes[0] || 'UK 8',
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.availableColors[0] || 'Default',
  );
  const [activeImg, setActiveImg] = useState<string>(product.primaryImage);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const inWishlist = wishlist.some((w) => w.id === product.id);

  const stockBySize = useMemo(() => {
    const map: Record<string, number> = {};
    for (const sz of product.availableSizes) {
      map[sz] = getLowStockCount(product.id, sz);
    }
    return map;
  }, [product.id, product.availableSizes]);

  const discountPct = useMemo(() => {
    if (!product.comparePrice || product.comparePrice <= product.price) return 0;
    return Math.round((1 - product.price / product.comparePrice) * 100);
  }, [product.comparePrice, product.price]);

  const relatedProducts = useMemo(
    () => PRODUCT_REGISTRY.filter((p) => p.id !== product.id).slice(0, 4),
    [product.id],
  );

  const handleAddToCart = useCallback(() => {
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: `${product.name} (${selectedSize}, ${selectedColor})`,
      price: product.price,
      image: resolveImage(product.primaryImage),
      qty,
      size: selectedSize,
    });
    showToast(`${product.name} added to cart`);
  }, [product, selectedSize, selectedColor, qty, addToCart, showToast]);

  const handleBuyNow = useCallback(() => {
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: `${product.name} (${selectedSize}, ${selectedColor})`,
      price: product.price,
      image: resolveImage(product.primaryImage),
      qty,
      size: selectedSize,
    });
    router.push('/checkout');
  }, [product, selectedSize, selectedColor, qty, addToCart, router]);

  const handleZoomMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }, []);

  const breadcrumb = [
    { label: 'Home', href: '/' },
    { label: product.category, href: '/category-products' },
    { label: product.brand, href: '/category-products' },
    { label: product.name },
  ];

  return (
    <div
      style={{
        background: '#ffffff',
        minHeight: '100vh',
        color: '#0a0a0a',
        fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
      }}
    >
      {/* ─── BREADCRUMB ─────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: '#9ca3af',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        {breadcrumb.map((item, i) => {
          const isLast = i === breadcrumb.length - 1;
          return (
            <React.Fragment key={i}>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    transition: 'color 200ms ease',
                  }}
                  className="lnk-pdp-crumb"
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: isLast ? '#0a0a0a' : '#9ca3af', fontWeight: 700 }}>
                  {item.label}
                </span>
              )}
              {!isLast && <span style={{ color: '#d1d5db', fontWeight: 400 }}>/</span>}
            </React.Fragment>
          );
        })}
      </nav>

      {/* ─── MAIN: GALLERY (left) + INFO (right) ─────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '64px',
          marginBottom: '64px',
        }}
      >
        {/* ── GALLERY (left column) ──────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main image with zoom-on-hover */}
          <div
            ref={imageWrapRef}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleZoomMove}
            style={{
              position: 'relative',
              aspectRatio: '1 / 1',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #f0f0f0',
              overflow: 'hidden',
              cursor: zoom ? 'zoom-in' : 'default',
            }}
          >
            {/* Badge */}
            <span
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: '#0a0a0a',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '8px 14px',
                borderRadius: '999px',
                zIndex: 2,
              }}
            >
              Authentic
            </span>

            {/* Discount badge */}
            {discountPct > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#ffffff',
                  color: '#0a0a0a',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '8px 14px',
                  borderRadius: '999px',
                  border: '1px solid #f0f0f0',
                  zIndex: 2,
                }}
              >
                -{discountPct}%
              </span>
            )}

            <Image
              src={resolveImage(activeImg)}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1280px) 50vw, 600px"
              style={{
                objectFit: 'contain',
                padding: '48px',
                transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1)',
                transform: zoom
                  ? `scale(1.8)`
                  : 'scale(1)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.08))',
              }}
            />
          </div>

          {/* Thumbnail strip (horizontal) */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            {product.images.map((img, i) => {
              const isActive = activeImg === img;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(img)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={isActive}
                  style={{
                    flexShrink: 0,
                    width: '88px',
                    height: '88px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: isActive
                      ? '2px solid #0a0a0a'
                      : '1px solid #f0f0f0',
                    padding: '8px',
                    cursor: 'pointer',
                    transition: 'border-color 200ms ease, transform 200ms ease',
                    position: 'relative',
                  }}
                  className="lnk-pdp-thumb"
                >
                  <Image
                    src={resolveImage(img)}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="88px"
                    style={{ objectFit: 'contain', padding: '4px' }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── INFO (right column) ────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Brand kicker */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#9ca3af',
              marginBottom: '8px',
            }}
          >
            {product.brand}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              margin: '0 0 12px 0',
              color: '#0a0a0a',
            }}
          >
            {product.name}
          </h1>

          {/* Rating row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              fontSize: '13px',
              color: '#6b7280',
            }}
          >
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={s <= Math.round(product.rating) ? '#0a0a0a' : '#e5e7eb'}
                >
                  <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.6-6.2 4.6 2.4-7.4L2 9.4h7.6z" />
                </svg>
              ))}
            </div>
            <span style={{ fontWeight: 700, color: '#0a0a0a' }}>{product.rating}</span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span>{product.reviewCount} reviews</span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>{product.stockStatus}</span>
          </div>

          {/* Price row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: 800,
                color: '#0a0a0a',
                letterSpacing: '-0.025em',
              }}
            >
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#d1d5db',
                  textDecoration: 'line-through',
                }}
              >
                ₹{product.comparePrice.toLocaleString('en-IN')}
              </span>
            )}
            {discountPct > 0 && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#16a34a',
                  background: '#dcfce7',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.05em',
                }}
              >
                Save {discountPct}%
              </span>
            )}
          </div>

          {/* Price subtext — tax incl. */}
          <div
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '24px',
            }}
          >
            Inclusive of all taxes. Free shipping across India.
          </div>

          {/* Short description */}
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#4b5563',
              marginBottom: '32px',
              maxWidth: '520px',
            }}
          >
            {product.shortDescription}
          </p>

          {/* Divider */}
          <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '32px' }} />

          {/* Color selector */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#0a0a0a',
                }}
              >
                Color: <span style={{ color: '#6b7280', fontWeight: 600 }}>{selectedColor}</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {product.availableColors.map((c) => {
                const active = selectedColor === c;
                const hex = colorToHex(c);
                const needsBorder = isLightColor(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    aria-pressed={active}
                    aria-label={`Color: ${c}`}
                    style={{
                      width: '48px',
                      height: '48px',
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'box-shadow 200ms cubic-bezier(0.16,1,0.3,1)',
                      boxShadow: active
                        ? `0 0 0 2px #ffffff, 0 0 0 4px #0a0a0a`
                        : 'none',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: hex,
                        border: needsBorder ? '1px solid #e5e7eb' : 'none',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size selector */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#0a0a0a',
                }}
              >
                Select Size (UK)
              </span>
              <Link
                href="/size-guide"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6b7280',
                  textDecoration: 'underline',
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                Size Guide
              </Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
                gap: '10px',
                maxWidth: '480px',
              }}
            >
              {product.availableSizes.map((sz) => {
                const active = selectedSize === sz;
                const stock = stockBySize[sz] ?? 2;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    aria-pressed={active}
                    style={{
                      padding: '14px 8px',
                      borderRadius: '12px',
                      border: active ? '2px solid #0a0a0a' : '1px solid #e5e7eb',
                      background: active ? '#0a0a0a' : '#ffffff',
                      color: active ? '#ffffff' : '#0a0a0a',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
                      position: 'relative',
                    }}
                    className="lnk-pdp-size"
                  >
                    {sz}
                    <span
                      style={{
                        display: 'block',
                        fontSize: '9px',
                        fontWeight: 600,
                        marginTop: '2px',
                        color: active ? '#9ca3af' : '#d97706',
                        letterSpacing: 0,
                        textTransform: 'none',
                      }}
                    >
                      Only {stock} left
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity stepper */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                marginBottom: '14px',
              }}
            >
              Quantity
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                style={{
                  width: '44px',
                  height: '44px',
                  border: 'none',
                  background: '#ffffff',
                  color: '#0a0a0a',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                −
              </button>
              <span
                style={{
                  minWidth: '40px',
                  textAlign: 'center',
                  fontSize: '15px',
                  fontWeight: 700,
                }}
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label="Increase quantity"
                style={{
                  width: '44px',
                  height: '44px',
                  border: 'none',
                  background: '#ffffff',
                  color: '#0a0a0a',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* CTA row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <button
              type="button"
              onClick={handleAddToCart}
              style={{
                padding: '18px 24px',
                background: '#0a0a0a',
                color: '#ffffff',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 200ms ease, transform 200ms ease',
              }}
              className="lnk-pdp-cta"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              style={{
                padding: '18px 24px',
                background: '#ffffff',
                color: '#0a0a0a',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                border: '1.5px solid #0a0a0a',
                cursor: 'pointer',
                transition: 'background 200ms ease, transform 200ms ease',
              }}
              className="lnk-pdp-cta"
            >
              Buy Now
            </button>
          </div>

          {/* Wishlist + Share row */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            <button
              type="button"
              onClick={() =>
                toggleWishlist({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: resolveImage(product.primaryImage),
                })
              }
              style={{
                flex: 1,
                padding: '14px',
                background: '#ffffff',
                color: inWishlist ? '#0a0a0a' : '#6b7280',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 200ms ease',
              }}
              className="lnk-pdp-secondary"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={inWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {inWishlist ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.share) {
                  navigator
                    .share({
                      title: product.name,
                      text: product.shortDescription,
                      url: typeof window !== 'undefined' ? window.location.href : '',
                    })
                    .catch(() => {});
                } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
                  showToast('Link copied to clipboard');
                }
              }}
              style={{
                flex: 1,
                padding: '14px',
                background: '#ffffff',
                color: '#6b7280',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 200ms ease',
              }}
              className="lnk-pdp-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
              </svg>
              Share
            </button>
          </div>

          {/* Trust badges */}
          <div
            style={{
              background: '#fafafa',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              marginBottom: '24px',
            }}
          >
            {[
              { title: '100% Authentic Guarantee', sub: 'Verified by LNKICKS 6-step in-house check' },
              { title: 'Express Shipping', sub: '2-4 business days across India · Free over ₹4,990' },
              { title: '7-Day Easy Returns', sub: 'Hassle-free returns & exchanges' },
            ].map((b) => (
              <div
                key={b.title}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#0a0a0a"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: 1 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a' }}>{b.title}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          <div
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a' }}>
                Deliver to <span style={{ color: '#6b7280', fontWeight: 600 }}>Dehradun 248001</span>
              </div>
              <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                Delivery by {new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · Free
              </div>
            </div>
            <button
              type="button"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#0a0a0a',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                letterSpacing: '0.05em',
              }}
              onClick={() => showToast('Pincode serviceable')}
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* ─── PRODUCT DESCRIPTION (full-width) ──────────────────── */}
      <section style={{ marginBottom: '64px' }}>
        <h2
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#0a0a0a',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          Product Description
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: '#4b5563',
                margin: '0 0 16px 0',
              }}
            >
              {product.shortDescription} Each pair is sourced directly from authorised
              retailers and passes through our 6-step in-house authentication process
              before being tagged with a tamper-evident LNKICKS verification sticker.
              The {product.name} features premium materials, the original manufacturer&apos;s
              packaging, and is backed by our 7-day return policy for complete peace of mind.
            </p>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: '#4b5563',
                margin: 0,
              }}
            >
              Whether you&apos;re adding to your collection or picking up a daily wearer,
              every LNKICKS order ships free across India with full tracking and is
              insured until it reaches your doorstep. Our concierge team is available
              11 AM – 6 PM IST, Monday to Friday, should you need any assistance.
            </p>
          </div>

          {/* Specifications */}
          <div
            style={{
              borderRadius: '16px',
              border: '1px solid #f0f0f0',
              padding: '24px',
              background: '#fafafa',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                marginBottom: '16px',
              }}
            >
              Specifications
            </div>
            <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { k: 'Brand', v: product.brand },
                { k: 'Category', v: product.category },
                { k: 'SKU', v: product.sku },
                { k: 'Available Sizes', v: product.availableSizes.join(', ') },
                { k: 'Available Colors', v: product.availableColors.join(', ') },
                { k: 'Stock Status', v: product.stockStatus },
                { k: 'Authenticity', v: 'LNKICKS Verified' },
              ].map((row) => (
                <div
                  key={row.k}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr',
                    gap: '12px',
                    fontSize: '13px',
                  }}
                >
                  <dt style={{ color: '#9ca3af', fontWeight: 600 }}>{row.k}</dt>
                  <dd style={{ color: '#0a0a0a', fontWeight: 600, margin: 0 }}>{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ─── RELATED PRODUCTS ──────────────────────────────────── */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '-0.015em',
              color: '#0a0a0a',
              margin: 0,
            }}
          >
            You Might Also Like
          </h2>
          <Link
            href="/products"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            className="lnk-pdp-viewall"
          >
            View All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '24px',
          }}
        >
          {relatedProducts.map((p) => (
            <ResponsiveProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <style jsx>{`
        :global(.lnk-pdp-crumb:hover) {
          color: #0a0a0a !important;
        }
        .lnk-pdp-thumb:hover {
          border-color: #0a0a0a !important;
          transform: translateY(-2px);
        }
        .lnk-pdp-size:hover {
          border-color: #0a0a0a !important;
        }
        .lnk-pdp-cta:hover {
          background: #1f2937;
          transform: translateY(-1px);
        }
        .lnk-pdp-cta:active {
          transform: scale(0.98);
        }
        .lnk-pdp-secondary:hover {
          color: #0a0a0a !important;
          border-color: #0a0a0a !important;
        }
        :global(.lnk-pdp-viewall:hover) {
          opacity: 0.7;
        }
        @media (max-width: 1024px) {
          /* On smaller desktops, narrow the gap and stack the description */
          :global(.lnk-pdp-grid) {
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default DesktopProductDetail;
