'use client';

import React, { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import type { FlashSaleConfig } from '@/components/mobile/MobileFlashSale';

/**
 * FlashSaleSettingsPage — Admin panel for the mobile Flash Sale section.
 *
 * Phase 25 — backs the MobileFlashSale component on the mobile homepage.
 *
 * Config is persisted to localStorage key `lnk_flash_sale_config` so the
 * mobile homepage reads the same value client-side. (The app uses
 * localStorage for all state — no Prisma/database is installed.)
 *
 * Controls:
 *   - Enable / Disable Flash Sale (toggle)
 *   - Start Date & Time (datetime-local input)
 *   - End Date & Time (datetime-local input)
 *   - Featured Product Name + Brand
 *   - Original Price + Sale Price + Discount Badge
 *   - Button Link (href)
 *   - Main Image URL + 3-4 Gallery Image URLs
 *
 * Layout: MobileLayout (admin chrome) + token-driven inline styles.
 */

const STORAGE_KEY = 'lnk_flash_sale_config';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const DEFAULT_CONFIG: FlashSaleConfig = {
  enabled: true,
  startAt: new Date().toISOString(),
  endAt: new Date(Date.now() + THREE_DAYS_MS).toISOString(),
  productName: 'Air Jordan 1 Low',
  productBrand: 'Air Jordan',
  originalPrice: 'Rs. 18,999',
  salePrice: 'Rs. 8,899',
  discountBadge: '53% OFF',
  buttonLink: '/product/air-jordan-1-low-black-powder-blue',
  mainImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
  gallery: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
  ],
};

// Convert ISO datetime to the value format expected by <input type="datetime-local">
function isoToLocalInput(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    // YYYY-MM-DDTHH:MM in local time
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

function localInputToIso(local: string): string {
  if (!local) return new Date().toISOString();
  const d = new Date(local);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// ── Reusable input component ───────────────────────────────────────────
function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span
        style={{
          display: 'block',
          fontFamily: theme.fontFamily.body,
          fontSize: 12,
          fontWeight: theme.fontWeight.semibold,
          color: theme.colors.textPrimary,
          marginBottom: 6,
          letterSpacing: '0.01em',
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span
          style={{
            display: 'block',
            marginTop: 4,
            fontFamily: theme.fontFamily.body,
            fontSize: 11,
            fontWeight: theme.fontWeight.regular,
            color: theme.colors.textSecondary,
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          {hint}
        </span>
      )}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 44,
  padding: `0 ${theme.spacing.md}px`,
  background: theme.colors.offWhite,
  border: `1.5px solid ${theme.colors.grey300}`,
  borderRadius: theme.radius.button,
  fontFamily: theme.fontFamily.body,
  fontSize: 14,
  fontWeight: theme.fontWeight.regular,
  color: theme.colors.textPrimary,
  outline: 'none',
  transition: `border-color ${theme.duration.fast} ${theme.easing.easeOut}`,
  fontFeatureSettings: theme.fontFeatures,
  boxSizing: 'border-box',
};

export default function FlashSaleSettingsPage() {
  const [config, setConfig] = useState<FlashSaleConfig | null>(null);
  const [saved, setSaved] = useState(false);

  // Load config from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(raw) });
      } else {
        setConfig(DEFAULT_CONFIG);
      }
    } catch {
      setConfig(DEFAULT_CONFIG);
    }
  }, []);

  if (!config) {
    return (
      <MobileLayout headerVariant="back" title="Flash Sale" hideBottomNav>
        <div style={{ padding: 24 }}>
          <p style={{ color: theme.colors.textSecondary }}>Loading…</p>
        </div>
      </MobileLayout>
    );
  }

  const update = (patch: Partial<FlashSaleConfig>) => {
    setConfig({ ...config, ...patch });
    setSaved(false);
  };

  const updateGallery = (index: number, value: string) => {
    const next = [...config.gallery];
    next[index] = value;
    update({ gallery: next });
  };

  const addGallerySlot = () => {
    if (config.gallery.length >= 4) return;
    update({ gallery: [...config.gallery, ''] });
  };

  const removeGallerySlot = (index: number) => {
    if (config.gallery.length <= 1) return;
    const next = config.gallery.filter((_, i) => i !== index);
    update({ gallery: next });
  };

  const handleSave = () => {
    haptic.medium();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaved(true);
    // Auto-hide the "Saved" pill after 2.4s
    setTimeout(() => setSaved(false), 2400);
  };

  const handleReset = () => {
    haptic.light();
    const fresh = {
      ...DEFAULT_CONFIG,
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + THREE_DAYS_MS).toISOString(),
    };
    setConfig(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <MobileLayout headerVariant="back" title="Flash Sale" hideBottomNav>
      <div style={{ padding: `0 ${theme.spacing.pad}px 120px` }}>
        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: theme.fontFamily.body,
              fontSize: 24,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              letterSpacing: '-0.02em',
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Flash Sale Settings
          </h1>
          <p
            style={{
              margin: '6px 0 0',
              fontFamily: theme.fontFamily.body,
              fontSize: 13,
              fontWeight: theme.fontWeight.regular,
              color: theme.colors.textSecondary,
              lineHeight: 1.45,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Configure the premium countdown flash sale section shown on the
            mobile homepage above Popular Shoes.
          </p>
        </div>

        {/* Section 1: Schedule + Enable */}
        <section
          style={{
            background: theme.colors.white,
            border: `1px solid ${theme.colors.grey150}`,
            borderRadius: theme.radius.card,
            padding: 16,
            marginBottom: 16,
            boxShadow: theme.shadows.xs,
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontFamily: theme.fontFamily.body,
              fontSize: 14,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Schedule
          </h2>

          {/* Enable toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: `1px solid ${theme.colors.divider}`,
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 14,
                  fontWeight: theme.fontWeight.semibold,
                  color: theme.colors.textPrimary,
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                Enable Flash Sale
              </div>
              <div
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 12,
                  fontWeight: theme.fontWeight.regular,
                  color: theme.colors.textSecondary,
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                Show the section on the mobile homepage
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={config.enabled}
              aria-label="Toggle flash sale"
              onClick={() => {
                haptic.light();
                update({ enabled: !config.enabled });
              }}
              style={{
                width: 44,
                height: 24,
                borderRadius: 999,
                background: config.enabled
                  ? theme.colors.black
                  : theme.colors.grey300,
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: `background-color ${theme.duration.fast} ${theme.easing.easeOut}`,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 3,
                  left: config.enabled ? 23 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: theme.colors.white,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transition: `left ${theme.duration.fast} ${theme.easing.easeOut}`,
                }}
              />
            </button>
          </div>

          <Field label="Start Date & Time">
            <input
              type="datetime-local"
              value={isoToLocalInput(config.startAt)}
              onChange={(e) => update({ startAt: localInputToIso(e.target.value) })}
              style={inputStyle}
            />
          </Field>

          <Field
            label="End Date & Time"
            hint="When the timer reaches this time, the section auto-hides."
          >
            <input
              type="datetime-local"
              value={isoToLocalInput(config.endAt)}
              onChange={(e) => update({ endAt: localInputToIso(e.target.value) })}
              style={inputStyle}
            />
          </Field>
        </section>

        {/* Section 2: Product info */}
        <section
          style={{
            background: theme.colors.white,
            border: `1px solid ${theme.colors.grey150}`,
            borderRadius: theme.radius.card,
            padding: 16,
            marginBottom: 16,
            boxShadow: theme.shadows.xs,
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontFamily: theme.fontFamily.body,
              fontSize: 14,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Featured Product
          </h2>

          <Field label="Product Brand">
            <input
              type="text"
              value={config.productBrand}
              onChange={(e) => update({ productBrand: e.target.value })}
              style={inputStyle}
              placeholder="Air Jordan"
            />
          </Field>

          <Field label="Product Name">
            <input
              type="text"
              value={config.productName}
              onChange={(e) => update({ productName: e.target.value })}
              style={inputStyle}
              placeholder="Air Jordan 1 Low"
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Original Price">
              <input
                type="text"
                value={config.originalPrice}
                onChange={(e) => update({ originalPrice: e.target.value })}
                style={inputStyle}
                placeholder="Rs. 18,999"
              />
            </Field>
            <Field label="Sale Price">
              <input
                type="text"
                value={config.salePrice}
                onChange={(e) => update({ salePrice: e.target.value })}
                style={inputStyle}
                placeholder="Rs. 8,899"
              />
            </Field>
          </div>

          <Field label="Discount Badge">
            <input
              type="text"
              value={config.discountBadge}
              onChange={(e) => update({ discountBadge: e.target.value })}
              style={inputStyle}
              placeholder="53% OFF"
            />
          </Field>

          <Field label="Button Link" hint="Where the Buy Now button should navigate.">
            <input
              type="text"
              value={config.buttonLink}
              onChange={(e) => update({ buttonLink: e.target.value })}
              style={inputStyle}
              placeholder="/product/air-jordan-1-low-black-powder-blue"
            />
          </Field>
        </section>

        {/* Section 3: Images */}
        <section
          style={{
            background: theme.colors.white,
            border: `1px solid ${theme.colors.grey150}`,
            borderRadius: theme.radius.card,
            padding: 16,
            marginBottom: 16,
            boxShadow: theme.shadows.xs,
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontFamily: theme.fontFamily.body,
              fontSize: 14,
              fontWeight: theme.fontWeight.bold,
              color: theme.colors.textPrimary,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Images
          </h2>

          <Field label="Main Image URL">
            <input
              type="url"
              value={config.mainImage}
              onChange={(e) => update({ mainImage: e.target.value })}
              style={inputStyle}
              placeholder="https://…"
            />
          </Field>

          {/* Main image preview */}
          {config.mainImage && (
            <div
              style={{
                width: '100%',
                aspectRatio: '16 / 11',
                background: theme.colors.offWhite,
                border: `1px solid ${theme.colors.grey150}`,
                borderRadius: theme.radius.button,
                overflow: 'hidden',
                marginBottom: 16,
              }}
            >
              <img
                src={config.mainImage}
                alt="Main preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Gallery slots */}
          <div
            style={{
              fontFamily: theme.fontFamily.body,
              fontSize: 12,
              fontWeight: theme.fontWeight.semibold,
              color: theme.colors.textPrimary,
              marginBottom: 8,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            Gallery Images ({config.gallery.length}/4)
          </div>

          {config.gallery.map((url, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 8,
                marginBottom: 8,
                alignItems: 'center',
              }}
            >
              <input
                type="url"
                value={url}
                onChange={(e) => updateGallery(i, e.target.value)}
                style={inputStyle}
                placeholder={`Gallery image ${i + 1} URL`}
              />
              {config.gallery.length > 1 && (
                <button
                  type="button"
                  aria-label={`Remove gallery image ${i + 1}`}
                  onClick={() => removeGallerySlot(i)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: theme.radius.button,
                    background: theme.colors.offWhite,
                    border: `1.5px solid ${theme.colors.grey300}`,
                    color: theme.colors.textSecondary,
                    cursor: 'pointer',
                    fontSize: 18,
                    fontWeight: theme.fontWeight.bold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {config.gallery.length < 4 && (
            <button
              type="button"
              onClick={addGallerySlot}
              className="pressable"
              style={{
                width: '100%',
                height: 40,
                borderRadius: theme.radius.button,
                background: theme.colors.offWhite,
                border: `1.5px dashed ${theme.colors.grey400}`,
                color: theme.colors.textSecondary,
                fontFamily: theme.fontFamily.body,
                fontSize: 13,
                fontWeight: theme.fontWeight.semibold,
                cursor: 'pointer',
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              + Add gallery image
            </button>
          )}
        </section>

        {/* Reset button */}
        <button
          type="button"
          onClick={handleReset}
          className="pressable"
          style={{
            width: '100%',
            height: 44,
            borderRadius: theme.radius.button,
            background: 'transparent',
            border: `1.5px solid ${theme.colors.grey300}`,
            color: theme.colors.textSecondary,
            fontFamily: theme.fontFamily.body,
            fontSize: 13,
            fontWeight: theme.fontWeight.semibold,
            cursor: 'pointer',
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          Reset to defaults
        </button>
      </div>

      {/* Sticky save bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: theme.colors.white,
          borderTop: `1px solid ${theme.colors.grey150}`,
          padding: `12px ${theme.spacing.pad}px`,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.04)',
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          <button
            type="button"
            onClick={handleSave}
            className="pressable"
            style={{
              width: '100%',
              height: 48,
              borderRadius: theme.radius.button,
              background: theme.colors.black,
              color: theme.colors.white,
              fontFamily: theme.fontFamily.body,
              fontSize: 15,
              fontWeight: theme.fontWeight.semibold,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFeatureSettings: theme.fontFeatures,
            }}
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        input:focus, button:focus-visible {
          border-color: ${theme.colors.black} !important;
          outline: none;
        }
      `}</style>
    </MobileLayout>
  );
}
