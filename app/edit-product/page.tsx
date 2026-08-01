'use client';

import React from 'react';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * EditProductPage — Admin "Edit Existing Listing" form.
 *
 * Stage 4g (admin) — Pattern C FULL REWRITE.
 * The original file used undefined Tailwind utility classes
 * (`bg-surface`, `text-headline-lg-mobile`, `material-symbols-outlined`,
 * `rounded-xl`, `bg-surface-container-lowest`, `border-outline-variant`,
 * etc.) and Material Symbols font icons — it rendered unstyled in
 * production. This rewrite rebuilds the form from scratch with MobileLayout
 * + token-driven inline styles + inline SVG icons.
 *
 * Layout:
 *  - `<MobileLayout headerVariant="back" title="Edit Product" hideBottomNav>`.
 *  - Page title + SKU sub-copy.
 *  - Form sections:
 *      1. Image gallery (horizontal scroll: 2 existing previews with delete
 *         affordance + dashed "Add New" tile).
 *      2. Product name input.
 *      3. Price (USD) + Stock Quantity (2-col grid).
 *      4. Category + Default Size (2-col grid).
 *      5. Description textarea.
 *      6. Update Product CTA (primary) + Archive Listing (secondary).
 *
 * Token usage:
 *  - Inputs: theme.radius.lg + 1.5px solid theme.colors.grey300 border,
 *    focus → theme.colors.black border.
 *  - Image tiles: 128×128 radius.lg + grey150 border + grey50 well.
 *  - Update CTA: black + radius.pill + display font + uppercase +
 *    haptic.medium() + showToast() on click.
 *  - Archive Listing: textSecondary + uppercase; haptic.light() on click.
 *
 * Image components preserved verbatim (next/image, unoptimized, remote URLs).
 * Demo data (Air Jordan 1 Retro High '85, $200.00, qty 42, Basketball,
 * size 10.5, description copy) preserved from the original.
 */
export default function EditProductPage() {
  const { showToast } = useApp();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    haptic.medium();
    showToast('Product updated');
  };

  const handleArchive = () => {
    haptic.light();
    showToast('Listing archived');
  };

  return (
    <MobileLayout headerVariant="back" title="Edit Product" hideBottomNav>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* TITLE */}
        <div style={{ marginBottom: theme.spacing.xxl, paddingTop: theme.spacing.sm }}>
          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h1,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.textPrimary,
              margin: 0,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Edit Product
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.sm,
              fontFamily: theme.fontFamily.display,
              letterSpacing: theme.letterSpacing.wide,
            }}
          >
            ID: #SKU-99281-BLK
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xxl }}
        >
          {/* IMAGE GALLERY */}
          <section>
            <label
              htmlFor="ep-images"
              style={{
                display: 'block',
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing.sm,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Product Images
            </label>
            <div
              id="ep-images"
              style={{
                display: 'flex',
                gap: theme.spacing.md,
                overflowX: 'auto',
                paddingBottom: theme.spacing.xs,
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* Existing image 1 */}
              <div
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: 128,
                  height: 128,
                  background: theme.colors.grey50,
                  borderRadius: theme.radius.lg,
                  overflow: 'hidden',
                  border: `1px solid ${theme.colors.grey150}`,
                  boxShadow: theme.shadows.xs,
                }}
              >
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFAXLAkcGFyogtPbYG3gl1QfVebTeoz3noKPSARYBOgGC0-XVrIXDm3aP0vGBZssxnRswFfk-k01gqRxjrzCTSOkAne7oRVp6P9B21dx7-mqu185-Sk5g9yUZSHATXbBArz1Wvs8xUJI7am0vJKpVdSfu1gu7w4kcUV_Oq75Z5YV3cpIBTJhTM2DIuAqv2Ur9GA4oyLpP0JGXF8jpk0cS6Ch1j0fLA1Abkn6ajk36Rf0IsRDNb7NRTPENauCsb_gb33VbBPPL8xcDb"
                  alt="A side-profile high-resolution photograph of a premium black and white designer sneaker."
                  width={400}
                  height={300}
                  unoptimized
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => haptic.medium()}
                  aria-label="Remove image 1"
                  className="pressable ep-del"
                  style={{
                    position: 'absolute',
                    top: theme.spacing.xs + 2,
                    right: theme.spacing.xs + 2,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: 'none',
                    color: theme.colors.error,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    aria-hidden
                  >
                    <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                    <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Existing image 2 */}
              <div
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: 128,
                  height: 128,
                  background: theme.colors.grey50,
                  borderRadius: theme.radius.lg,
                  overflow: 'hidden',
                  border: `1px solid ${theme.colors.grey150}`,
                  boxShadow: theme.shadows.xs,
                }}
              >
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Jre6J4wYHZj0UQBJFaAhPVut3LPrDi_GE-GUln16qCnc5o7BEot5NgGVJ1GobC_j70PR5nH9kCxfwVYsKyDjqfzGDgF-BQDHU39raY2Ob9PSsYGMmRpimmDIe54vFyxVuPSI4HXiRbFvYuC_2GOJ1fs453cP1oCrCJFBMT2Cnrw68aar-2l8g35WPXjhAlkQpRYWnKEmYMEW7HpOEYcUliJrwkj3xHzMOzi3W-0OtGOGvVcCxorBN71lsUgy552rSfWYCtQVhsMV"
                  alt="Close-up artistic shot of the rear heel detail of a luxury sneaker featuring embossed branding."
                  width={400}
                  height={300}
                  unoptimized
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => haptic.medium()}
                  aria-label="Remove image 2"
                  className="pressable ep-del"
                  style={{
                    position: 'absolute',
                    top: theme.spacing.xs + 2,
                    right: theme.spacing.xs + 2,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: 'none',
                    color: theme.colors.error,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    aria-hidden
                  >
                    <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                    <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Add-new tile */}
              <button
                type="button"
                onClick={() => haptic.light()}
                aria-label="Add new image"
                className="pressable ep-add"
                style={{
                  flexShrink: 0,
                  width: 128,
                  height: 128,
                  background: theme.colors.white,
                  borderRadius: theme.radius.lg,
                  border: `2px dashed ${theme.colors.grey300}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.textSecondary,
                  cursor: 'pointer',
                  gap: theme.spacing.xs,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="12" y1="10" x2="12" y2="15" strokeLinecap="round" />
                  <line x1="9.5" y1="12.5" x2="14.5" y2="12.5" strokeLinecap="round" />
                  <circle cx="8" cy="9" r="1.2" fill="currentColor" stroke="none" />
                </svg>
                <span
                  style={{
                    fontSize: theme.fontSize.xs,
                    fontWeight: theme.fontWeight.bold,
                    letterSpacing: theme.letterSpacing.wider,
                    textTransform: 'uppercase',
                  }}
                >
                  Add New
                </span>
              </button>
            </div>
          </section>

          {/* PRODUCT NAME */}
          <section>
            <label htmlFor="ep-name" style={labelStyle}>
              Product Name
            </label>
            <input
              id="ep-name"
              type="text"
              defaultValue="Air Jordan 1 Retro High '85"
              style={inputStyle}
              className="ep-input"
            />
          </section>

          {/* PRICE + STOCK */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
            <section>
              <label htmlFor="ep-price" style={labelStyle}>
                Price (USD)
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: theme.spacing.lg,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: theme.colors.textSecondary,
                    fontSize: theme.fontSize.lg,
                    fontWeight: theme.fontWeight.semibold,
                    pointerEvents: 'none',
                  }}
                >
                  $
                </span>
                <input
                  id="ep-price"
                  type="number"
                  defaultValue="200.00"
                  style={{ ...inputStyle, paddingLeft: theme.spacing.xxl + theme.spacing.sm }}
                  className="ep-input"
                />
              </div>
            </section>
            <section>
              <label htmlFor="ep-stock" style={labelStyle}>
                Stock Quantity
              </label>
              <input
                id="ep-stock"
                type="number"
                defaultValue="42"
                style={inputStyle}
                className="ep-input"
              />
            </section>
          </div>

          {/* CATEGORY + DEFAULT SIZE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
            <section>
              <label htmlFor="ep-category" style={labelStyle}>
                Category
              </label>
              <select
                id="ep-category"
                defaultValue="Basketball"
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                className="ep-input"
              >
                <option>Basketball</option>
                <option>Lifestyle</option>
                <option>Running</option>
              </select>
            </section>
            <section>
              <label htmlFor="ep-size" style={labelStyle}>
                Default Size
              </label>
              <input
                id="ep-size"
                type="text"
                defaultValue="10.5"
                style={inputStyle}
                className="ep-input"
              />
            </section>
          </div>

          {/* DESCRIPTION */}
          <section>
            <label htmlFor="ep-desc" style={labelStyle}>
              Description
            </label>
            <textarea
              id="ep-desc"
              rows={4}
              defaultValue={
                "The Air Jordan 1 Retro High '85 brings back the iconic silhouette in its most authentic form. Featuring premium full-grain leather, high-fidelity stitching, and the original high-top collar height, this release is a must-have for serious collectors of the brand's history."
              }
              style={{
                ...inputStyle,
                resize: 'none',
                lineHeight: theme.lineHeight.relaxed,
              }}
              className="ep-input"
            />
          </section>

          {/* CTA ROW */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.md,
              paddingBottom: theme.spacing.giant,
              marginTop: theme.spacing.sm,
            }}
          >
            <button
              type="submit"
              className="pressable ep-update"
              style={{
                width: '100%',
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
                boxShadow: theme.shadows.lg,
              }}
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={handleArchive}
              className="pressable ep-archive"
              style={{
                width: '100%',
                padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                background: 'transparent',
                color: theme.colors.textPrimary,
                borderRadius: theme.radius.lg,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.bold,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Archive Listing
            </button>
          </div>
        </form>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .ep-input {
          transition: border-color 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ep-input:focus {
          outline: none;
          border-color: ${theme.colors.black};
        }
        .ep-update:active {
          transform: scale(0.97);
        }
        .ep-update:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .ep-archive:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .ep-add:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
      `}</style>
    </MobileLayout>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Shared form styles
 * ────────────────────────────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: theme.fontSize.xs,
  fontWeight: theme.fontWeight.bold,
  color: theme.colors.textPrimary,
  marginBottom: theme.spacing.sm,
  letterSpacing: theme.letterSpacing.wider,
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: theme.colors.white,
  border: `1.5px solid ${theme.colors.grey300}`,
  borderRadius: theme.radius.lg,
  padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
  fontSize: theme.fontSize.md,
  fontFamily: theme.fontFamily.body,
  color: theme.colors.textPrimary,
};
