'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * AddProductPage — Admin "List a new exclusive sneaker" form.
 *
 * Stage 4g (admin) — Pattern C FULL REWRITE.
 * The original file used undefined Tailwind utility classes
 * (`bg-surface`, `text-headline-lg-mobile`, `font-headline-lg-mobile`,
 * `material-symbols-outlined`, `rounded-xl`, `bg-surface-container-lowest`,
 * `px-container-margin`, `space-y-stack-lg`, etc.) and Material Symbols font
 * icons — it rendered unstyled in production. This rewrite rebuilds the form
 * from scratch with MobileLayout + token-driven inline styles + inline SVG
 * icons.
 *
 * Layout:
 *  - `<MobileLayout headerVariant="back" title="Add Product" hideBottomNav>`
 *    (admin users do NOT see the consumer bottom nav).
 *  - Page title + sub-copy.
 *  - Form sections:
 *      1. Image upload (Upload box + preview card with delete affordance).
 *      2. Sneaker name input.
 *      3. Description textarea.
 *      4. Retail price + Category (2-col grid).
 *      5. Size availability chips (toggle).
 *      6. Settings toggles (Featured Product + Notify Subscribers).
 *  - Sticky Save Product CTA at the bottom of the viewport.
 *
 * Token usage:
 *  - Inputs: theme.radius.lg + 1.5px solid theme.colors.grey300 border,
 *    focus → theme.colors.black border (via :focus-within style).
 *  - Cards: theme.radius.xxl + 1px solid theme.colors.grey150 + shadows.xs.
 *  - Chips: theme.radius.pill; active → black bg / white text; inactive →
 *    grey100 bg / black text. haptic.selection() on tap.
 *  - Toggles: 40×24 pill on black (on) or grey300 (off); 16×16 white knob.
 *  - Save Product CTA: black + radius.pill + display font + uppercase +
 *    haptic.medium() + showToast() on click.
 *
 * Image component preserved verbatim (next/image, unoptimized, remote URL).
 */
export default function AddProductPage() {
  const { showToast } = useApp();

  // Size chip selection — default to 7, 8.5, 11 selected (matches original
  // "primary" state on those chips).
  const SIZES = ['7', '8', '8.5', '9', '10', '11', '12'];
  const [selectedSizes, setSelectedSizes] = useState<string[]>([
    '7',
    '8.5',
    '11',
  ]);

  // Toggle states (matches the original's "on" defaults).
  const [featured, setFeatured] = useState(true);
  const [notify, setNotify] = useState(false);

  const handleSizeToggle = (sz: string) => {
    haptic.selection();
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz],
    );
  };

  const handleToggleFeatured = () => {
    haptic.selection();
    setFeatured((v) => !v);
  };

  const handleToggleNotify = () => {
    haptic.selection();
    setNotify((v) => !v);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    haptic.medium();
    showToast('Product saved to catalog');
  };

  return (
    <MobileLayout headerVariant="back" title="Add Product" hideBottomNav>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* SCREEN TITLE */}
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
            Add Product
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.sm,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            List a new exclusive sneaker to the marketplace.
          </p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xxl }}>
          {/* IMAGE UPLOAD */}
          <section>
            <label
              htmlFor="ap-images"
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing.sm,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              Product Images
            </label>
            <div
              id="ap-images"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: theme.spacing.md,
              }}
            >
              {/* Upload tile */}
              <button
                type="button"
                onClick={() => haptic.light()}
                className="pressable ap-upload"
                aria-label="Upload product image"
                style={{
                  aspectRatio: '1 / 1',
                  background: theme.colors.grey50,
                  border: `2px dashed ${theme.colors.grey300}`,
                  borderRadius: theme.radius.lg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: theme.colors.grey500,
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h2l1.5-2h7L19 7h0a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
                <span
                  style={{
                    fontSize: theme.fontSize.xs,
                    fontWeight: theme.fontWeight.bold,
                    marginTop: theme.spacing.xs + 2,
                    letterSpacing: theme.letterSpacing.wider,
                    textTransform: 'uppercase',
                  }}
                >
                  Upload
                </span>
              </button>

              {/* Preview tile */}
              <div
                style={{
                  aspectRatio: '1 / 1',
                  background: theme.colors.grey50,
                  borderRadius: theme.radius.lg,
                  overflow: 'hidden',
                  border: `1px solid ${theme.colors.grey150}`,
                  position: 'relative',
                }}
              >
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgI6rA9fPsXd3MkQ95LTS172zFUpk-yKW9FTp2oaqkhqD9hhi4542zjnZDPR2VoSPvFstPWwKCAeGo2oBVB9FAXzjZFOjANROVOo_c2oCIeVD3du0k-lOEyRrsCmVdj3Zj9I8OqWHskwJRe1cXonSGiQYad3MC3XpWVEIwkPXmqxdjf6d-oGEHPp2vPKICodxIA4O_MxXk_FU_VfAXL_XeMWb9WGv_x8vME0ueWEbuAIqlJeUybgyPXEosFFwZai9lvPAP2Orhjn3c"
                  alt="A high-end, professionally photographed studio shot of a limited edition designer sneaker against a clean, minimal white background."
                  width={400}
                  height={300}
                  unoptimized
                  style={{
                    maxWidth: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    width: '100%',
                  }}
                />
                <button
                  type="button"
                  onClick={() => haptic.medium()}
                  aria-label="Delete image"
                  className="pressable ap-del"
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
            </div>
          </section>

          {/* NAME */}
          <section>
            <label htmlFor="sneaker-name" style={labelStyle}>
              Sneaker Name
            </label>
            <input
              id="sneaker-name"
              type="text"
              placeholder="e.g. Air Jordan 1 Retro High"
              style={inputStyle}
              className="ap-input"
            />
          </section>

          {/* DESCRIPTION */}
          <section>
            <label htmlFor="description" style={labelStyle}>
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe the rarity, condition, and history..."
              style={{ ...inputStyle, resize: 'none', lineHeight: theme.lineHeight.relaxed }}
              className="ap-input"
            />
          </section>

          {/* PRICE + CATEGORY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
            <section>
              <label htmlFor="price" style={labelStyle}>
                Retail Price ($)
              </label>
              <input
                id="price"
                type="number"
                placeholder="450.00"
                style={inputStyle}
                className="ap-input"
              />
            </section>
            <section>
              <label htmlFor="category" style={labelStyle}>
                Category
              </label>
              <select
                id="category"
                defaultValue="Basketball"
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                className="ap-input"
              >
                <option>Basketball</option>
                <option>Running</option>
                <option>Lifestyle</option>
                <option>Luxury</option>
              </select>
            </section>
          </div>

          {/* SIZE AVAILABILITY */}
          <section>
            <div style={{ ...labelStyle, marginBottom: theme.spacing.sm }}>
              Size Availability (US)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
              {SIZES.map((sz) => {
                const active = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleSizeToggle(sz)}
                    aria-pressed={active}
                    className="pressable ap-size"
                    style={{
                      padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                      borderRadius: theme.radius.pill,
                      background: active
                        ? theme.colors.black
                        : theme.colors.grey100,
                      color: active
                        ? theme.colors.white
                        : theme.colors.textPrimary,
                      border: 'none',
                      fontSize: theme.fontSize.xs,
                      fontWeight: theme.fontWeight.bold,
                      letterSpacing: theme.letterSpacing.wider,
                      cursor: 'pointer',
                      transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {sz}
                  </button>
                );
              })}
              {/* Add new size — dashed chip */}
              <button
                type="button"
                onClick={() => haptic.light()}
                aria-label="Add new size"
                className="pressable ap-size-add"
                style={{
                  padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                  borderRadius: theme.radius.pill,
                  background: theme.colors.white,
                  color: theme.colors.textSecondary,
                  border: `1.5px dashed ${theme.colors.grey300}`,
                  fontSize: theme.fontSize.xs,
                  fontWeight: theme.fontWeight.bold,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 36,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  aria-hidden
                >
                  <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                  <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </section>

          {/* SETTINGS TOGGLES */}
          <section
            style={{
              background: theme.colors.grey50,
              padding: theme.spacing.lg,
              borderRadius: theme.radius.lg,
              border: `1px solid ${theme.colors.grey150}`,
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg,
            }}
          >
            <ToggleRow
              label="Featured Product"
              hint="Show in main carousel"
              on={featured}
              onToggle={handleToggleFeatured}
            />
            <ToggleRow
              label="Notify Subscribers"
              hint="Send push notifications"
              on={notify}
              onToggle={handleToggleNotify}
            />
          </section>

          {/* STICKY SAVE CTA */}
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'saturate(180%) blur(14px)',
              WebkitBackdropFilter: 'saturate(180%) blur(14px)',
              borderTop: `1px solid ${theme.colors.grey150}`,
              padding: `${theme.spacing.md}px 0`,
              margin: `0 -${theme.spacing.pad}px`,
              paddingLeft: theme.spacing.pad,
              paddingRight: theme.spacing.pad,
              marginTop: theme.spacing.xs,
            }}
          >
            <button
              type="submit"
              className="pressable ap-save"
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
              Save Product
            </button>
          </div>
        </form>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .ap-input {
          transition: border-color 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ap-input:focus {
          outline: none;
          border-color: ${theme.colors.black};
        }
        .ap-upload:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .ap-size:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .ap-size-add:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .ap-save:active {
          transform: scale(0.97);
        }
        .ap-save:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
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

/* ──────────────────────────────────────────────────────────────────
 * ToggleRow — admin settings toggle (Featured / Notify Subscribers)
 * ────────────────────────────────────────────────────────────────── */
function ToggleRow({
  label,
  hint,
  on,
  onToggle,
}: {
  label: string;
  hint: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: theme.fontSize.md,
            fontWeight: theme.fontWeight.semibold,
            color: theme.colors.textPrimary,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: theme.fontSize.xs,
            color: theme.colors.textSecondary,
            marginTop: 2,
          }}
        >
          {hint}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className="pressable ap-toggle"
        style={{
          position: 'relative',
          width: 40,
          height: 24,
          borderRadius: theme.radius.pill,
          background: on ? theme.colors.black : theme.colors.grey300,
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 180ms cubic-bezier(0.16, 1, 0.3, 1)',
          flexShrink: 0,
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 3,
            left: on ? 21 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: theme.colors.white,
            boxShadow: theme.shadows.xs,
            transition: 'left 180ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </button>
    </div>
  );
}
