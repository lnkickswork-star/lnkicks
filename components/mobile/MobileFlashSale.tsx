'use client';

import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileFlashSale — Premium Countdown Flash Sale section.
 *
 * PHASE 25 (rev 2) — Apple / Nike / GOAT-inspired luxury flash sale.
 *
 * Rev 2 fixes per user feedback:
 *   - Header layout stacked & centered — no more left-heavy / right-clipped timer
 *   - Timer moved BELOW the headline, centered, with full HH:MM:SS visible
 *   - Subtle dark red accent (#7F1D1D theme.colors.error) on the eyebrow
 *     chip, discount badge, and CTA hover — keeps luxury feel
 *   - Cleaner vertical rhythm, more breathing room
 *   - Gallery thumbnails restyled with cleaner active state
 *
 * Design language:
 *   - Matte black (#0A0A0A) card with 28px radius — matches LN KICKS hero cards
 *   - Glass-style countdown timer blocks (soft white-alpha bg, no neon)
 *   - Single featured product with 3-4 thumbnail gallery (tap to switch,
 *     smooth opacity fade)
 *   - Strikethrough original price → bold sale price → dark-red discount pill
 *   - Full-width "Buy Now" button (52px, 16px radius) with subtle press scale
 *   - Auto-hide when timer hits 0 (smooth height collapse)
 *   - No bright red, no gradients, no flashing — pure luxury minimal
 *
 * Config persistence:
 *   - Reads from localStorage key `lnk_flash_sale_config`
 *   - Admin page at /flash-sale-settings writes to the same key
 *   - Default seed config activates immediately on first visit
 *
 * Mounted in MobileHome.tsx ABOVE MobilePopularShoes per user spec.
 * Mobile-only — desktop homepage is untouched.
 */

// ── Types ──────────────────────────────────────────────────────────────
export interface FlashSaleConfig {
  enabled: boolean;
  startAt: string; // ISO 8601
  endAt: string;   // ISO 8601
  productName: string;
  productBrand: string;
  originalPrice: string;
  salePrice: string;
  discountBadge: string;
  buttonLink: string;
  mainImage: string;
  gallery: string[]; // 3-4 image URLs
}

// ── Default seed config — activates on first load ──────────────────────
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

const STORAGE_KEY = 'lnk_flash_sale_config';

function loadConfig(): FlashSaleConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    const parsed = JSON.parse(raw) as Partial<FlashSaleConfig>;
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

// ── Time remaining helper ──────────────────────────────────────────────
interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function getTimeRemaining(endAt: string): TimeRemaining {
  const now = Date.now();
  const end = new Date(endAt).getTime();
  let diff = Math.max(0, end - now);
  const totalMs = diff;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000);
  return { hours, minutes, seconds, totalMs };
}

// ── Countdown timer block (centered, glass-style) ──────────────────────
function TimerBlock({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, '0');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 12,
          minWidth: 60,
          padding: '10px 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <span
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: 22,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.white,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          {padded}
        </span>
      </div>
      <span
        style={{
          fontFamily: theme.fontFamily.body,
          fontSize: 10,
          fontWeight: theme.fontWeight.medium,
          color: 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontFeatureSettings: theme.fontFeatures,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────
function MobileFlashSaleImpl() {
  const [config, setConfig] = useState<FlashSaleConfig | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load config from localStorage on mount.
  useEffect(() => {
    setConfig(loadConfig());
    setMounted(true);
  }, []);

  // Re-check config when the section becomes visible (e.g., admin updated it).
  useEffect(() => {
    if (!mounted) return;
    const onFocus = () => setConfig(loadConfig());
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onFocus);
    };
  }, [mounted]);

  // Determine whether the sale is currently active.
  const isSaleActive = useCallback(() => {
    if (!config) return false;
    if (!config.enabled) return false;
    const now = Date.now();
    const start = new Date(config.startAt).getTime();
    const end = new Date(config.endAt).getTime();
    return now >= start && now < end;
  }, [config]);

  // Countdown tick.
  useEffect(() => {
    if (!config) return;
    if (!isSaleActive()) return;

    const tick = () => {
      const remaining = getTimeRemaining(config.endAt);
      setTimeRemaining(remaining);
      if (remaining.totalMs <= 0) {
        setCollapsed(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [config, isSaleActive]);

  // Reset collapse state if config changes (e.g., admin re-enables).
  useEffect(() => {
    if (config && isSaleActive()) {
      setCollapsed(false);
    }
  }, [config, isSaleActive]);

  // ── Render guards ────────────────────────────────────────────────────
  if (!mounted || !config) return null;
  if (!config.enabled) return null;
  if (Date.now() < new Date(config.startAt).getTime()) return null;
  if (collapsed) return null;
  if (!isSaleActive()) return null;

  const gallery = config.gallery.length > 0 ? config.gallery : [config.mainImage];

  // Dark red accent — subtle, luxury, matches theme.colors.error (#7F1D1D).
  // Used on: eyebrow chip border/text, discount badge bg, CTA hover.
  const ACCENT_DARK_RED = '#7F1D1D';
  const ACCENT_DARK_RED_SOFT = 'rgba(127, 29, 29, 0.18)';

  return (
    <section
      aria-label="Flash Sale"
      style={{
        paddingTop: 8,
        paddingBottom: 16,
      }}
    >
      <div style={{ padding: `0 ${theme.spacing.sectionPadding}px` }}>
        <article
          className="mfs-card"
          style={{
            position: 'relative',
            background: theme.colors.black,
            borderRadius: theme.radius.largeCard,
            overflow: 'hidden',
            boxShadow: theme.shadows.editorial,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* ── Header: stacked, centered ────────────────────────────── */}
          {/* Rev 2: previously the timer was on the right and got clipped.
              Now everything is stacked vertically and centered, so the
              full HH:MM:SS is always visible on any 360px viewport. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 8,
              padding: `${theme.spacing.xxl + 4}px ${theme.spacing.xxl}px ${theme.spacing.md}px`,
            }}
          >
            {/* ⚡ Limited Time Offer eyebrow — dark red accent chip */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: theme.fontFamily.body,
                fontSize: 11,
                fontWeight: theme.fontWeight.semibold,
                color: '#FCA5A5', // soft red-300 — readable on black
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: ACCENT_DARK_RED_SOFT,
                border: `1px solid rgba(127, 29, 29, 0.45)`,
                padding: '5px 12px',
                borderRadius: 999,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              <span aria-hidden style={{ fontSize: 11, lineHeight: 1 }}>⚡</span>
              Limited Time Offer
            </span>

            {/* Flash Sale headline */}
            <h3
              style={{
                margin: 0,
                fontFamily: theme.fontFamily.body,
                fontSize: 26,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.white,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              Flash Sale
            </h3>

            {/* Subtext — single line, balanced */}
            <p
              style={{
                margin: 0,
                fontFamily: theme.fontFamily.body,
                fontSize: 13,
                fontWeight: theme.fontWeight.regular,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.5,
                fontFeatureSettings: theme.fontFeatures,
                maxWidth: 280,
              }}
            >
              Exclusive premium sneakers at special pricing.
              <br />
              Offer expires when countdown ends.
            </p>
          </div>

          {/* ── Countdown timer — centered, full HH:MM:SS visible ────── */}
          {/* Rev 2: moved below the headline, centered. Three blocks with
              colons between. Scales to fit 360px viewports comfortably. */}
          {timeRemaining && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: 8,
                padding: `0 ${theme.spacing.xxl}px ${theme.spacing.xxl}px`,
              }}
            >
              <TimerBlock value={timeRemaining.hours} label="Hours" />
              <span
                aria-hidden
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 22,
                  fontWeight: theme.fontWeight.bold,
                  color: 'rgba(255,255,255,0.35)',
                  alignSelf: 'flex-start',
                  marginTop: 16,
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                :
              </span>
              <TimerBlock value={timeRemaining.minutes} label="Minutes" />
              <span
                aria-hidden
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 22,
                  fontWeight: theme.fontWeight.bold,
                  color: 'rgba(255,255,255,0.35)',
                  alignSelf: 'flex-start',
                  marginTop: 16,
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                :
              </span>
              <TimerBlock value={timeRemaining.seconds} label="Seconds" />
            </div>
          )}

          {/* ── Product showcase: main image + thumbnail gallery ──────── */}
          <div
            style={{
              padding: `0 ${theme.spacing.xxl}px ${theme.spacing.md}px`,
            }}
          >
            {/* Main image — fixed aspect ratio to prevent layout shift */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 11',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 20,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={i === activeImage ? `${config.productName} - view ${i + 1}` : ''}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className="mfs-main-img"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: i === activeImage ? 1 : 0,
                    transition: `opacity ${theme.duration.slow} ${theme.easing.easeOut}`,
                    filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.45))',
                  }}
                />
              ))}
            </div>

            {/* Thumbnail gallery — 3-4 small previews */}
            {gallery.length > 1 && (
              <div
                role="tablist"
                aria-label="Product image gallery"
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 10,
                  justifyContent: 'center',
                }}
              >
                {gallery.map((src, i) => {
                  const isActive = i === activeImage;
                  return (
                    <button
                      key={`thumb-${src}-${i}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`View image ${i + 1}`}
                      onClick={() => {
                        if (i !== activeImage) {
                          haptic.selection();
                          setActiveImage(i);
                        }
                      }}
                      className="mfs-thumb"
                      style={{
                        width: 56,
                        height: 56,
                        padding: 0,
                        background: 'rgba(255,255,255,0.04)',
                        border: isActive
                          ? '1.5px solid rgba(255,255,255,0.9)'
                          : '1px solid rgba(255,255,255,0.10)',
                        borderRadius: 12,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        opacity: isActive ? 1 : 0.6,
                        transition: `opacity ${theme.duration.fast} ${theme.easing.easeOut}, border-color ${theme.duration.fast} ${theme.easing.easeOut}`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Product info ──────────────────────────────────────────── */}
          <div
            style={{
              padding: `0 ${theme.spacing.xxl}px ${theme.spacing.md}px`,
            }}
          >
            {/* Brand eyebrow */}
            <span
              style={{
                display: 'block',
                fontFamily: theme.fontFamily.body,
                fontSize: 11,
                fontWeight: theme.fontWeight.medium,
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 4,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {config.productBrand}
            </span>

            {/* Product name */}
            <h4
              style={{
                margin: 0,
                fontFamily: theme.fontFamily.body,
                fontSize: 18,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.white,
                letterSpacing: '-0.01em',
                lineHeight: 1.25,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              {config.productName}
            </h4>

            {/* Price row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                marginTop: 12,
                flexWrap: 'wrap',
              }}
            >
              {/* Original price — strikethrough grey */}
              <span
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 14,
                  fontWeight: theme.fontWeight.medium,
                  color: 'rgba(255,255,255,0.45)',
                  textDecoration: 'line-through',
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                {config.originalPrice}
              </span>

              {/* Sale price — large bold white */}
              <span
                style={{
                  fontFamily: theme.fontFamily.body,
                  fontSize: 22,
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.white,
                  letterSpacing: '-0.02em',
                  fontFeatureSettings: theme.fontFeatures,
                }}
              >
                {config.salePrice}
              </span>

              {/* Discount badge — subtle dark-red pill (accent) */}
              {config.discountBadge && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: ACCENT_DARK_RED_SOFT,
                    color: '#FCA5A5',
                    fontFamily: theme.fontFamily.body,
                    fontSize: 11,
                    fontWeight: theme.fontWeight.semibold,
                    padding: '4px 10px',
                    borderRadius: 999,
                    letterSpacing: '0.02em',
                    border: '1px solid rgba(127, 29, 29, 0.45)',
                    fontFeatureSettings: theme.fontFeatures,
                  }}
                >
                  {config.discountBadge}
                </span>
              )}
            </div>
          </div>

          {/* ── Buy Now button ────────────────────────────────────────── */}
          <div
            style={{
              padding: `0 ${theme.spacing.xxl}px ${theme.spacing.xxl}px`,
            }}
          >
            <Link
              href={config.buttonLink}
              aria-label={`Buy ${config.productName} now`}
              onPointerDown={() => haptic.medium()}
              className="mfs-cta pressable"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                height: 52,
                borderRadius: 16,
                background: theme.colors.white,
                color: theme.colors.black,
                fontFamily: theme.fontFamily.body,
                fontSize: 16,
                fontWeight: theme.fontWeight.semibold,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.20)',
                transition: `transform ${theme.duration.instant} ${theme.easing.easeOut}, box-shadow ${theme.duration.fast} ${theme.easing.easeOut}, background-color ${theme.duration.fast} ${theme.easing.easeOut}`,
                fontFeatureSettings: theme.fontFeatures,
              }}
            >
              Buy Now
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
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
            </Link>
          </div>
        </article>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .mfs-card {
          animation: mfs-fade-in ${theme.duration.page} ${theme.easing.easeOut} both;
        }
        .mfs-cta:active {
          transform: scale(${theme.scale.buttonPress});
          box-shadow: 0 4px 12px rgba(0,0,0,0.30);
        }
        .mfs-thumb:active {
          transform: scale(${theme.scale.buttonPress});
        }
        @media (hover: hover) {
          .mfs-cta:hover {
            /* Rev 2: subtle dark-red tint on hover — accent tie-in */
            background: ${ACCENT_DARK_RED};
            color: ${theme.colors.white};
            transform: scale(1.01);
            box-shadow: 0 12px 32px rgba(127, 29, 29, 0.40), 0 4px 8px rgba(0,0,0,0.24);
          }
          .mfs-thumb:hover {
            opacity: 1;
            border-color: rgba(255,255,255,0.6);
          }
        }
        .mfs-cta:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 3px;
        }
        .mfs-thumb:focus-visible {
          outline: 2px solid ${theme.colors.white};
          outline-offset: 2px;
        }
        @keyframes mfs-fade-in {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export const MobileFlashSale = memo(MobileFlashSaleImpl);
export default MobileFlashSale;
