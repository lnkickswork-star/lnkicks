'use client';

import React from 'react';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * ReportsAnalyticsPage — Admin Analytics dashboard.
 *
 * Stage 4g (admin) — Pattern C FULL REWRITE.
 * The original file used undefined Tailwind utility classes
 * (`bg-surface`, `text-headline-lg-mobile`, `font-headline-lg-mobile`,
 * `material-symbols-outlined`, `rounded-xl`, `bg-surface-container-lowest`,
 * `border-surface-container`, `text-display-lg-mobile`,
 * `font-display-lg-mobile`, etc.) and Material Symbols font icons — it
 * rendered unstyled in production. This rewrite rebuilds the page from
 * scratch with MobileLayout + token-driven inline styles + inline SVG icons.
 *
 * Layout:
 *  - `<MobileLayout headerVariant="back" title="Reports" hideBottomNav>`.
 *  - Title + Overview date range + filter pill.
 *  - KPI bento grid:
 *      • Revenue card (col-span-2) with monochrome bar chart.
 *      • Orders card with trend-up indicator.
 *      • Avg. Order card with neutral indicator.
 *  - Popular Products list (2 items with avatar + sales/rev).
 *  - Sales Trends chart card (SVG path mockup).
 *  - Customer Profile (radial chart placeholders for Male 68% / Female 32%).
 *
 * Token usage:
 *  - Cards: theme.radius.lg + 1px solid theme.colors.grey150 + theme.shadows.xs
 *    on theme.colors.white.
 *  - Bar chart bars: theme.colors.black at varying opacities (monochrome).
 *  - KPI delta pill: theme.colors.grey100 + black text.
 *  - Section titles: theme.fontFamily.display + extrabold + tight tracking.
 *
 * All demo data (Revenue $142,850.00 +12.4%, Orders 1,248 +8%, Avg. Order
 * $114.40, Air Jordan 1 Retro 428 Sold / $24,500 Rev, Yeezy Boost 350 382
 * Sold / $18,900 Rev, Peak 14th Aug $4,200/day, Male 68% / Female 32%)
 * preserved verbatim from the original. Image components preserved
 * (next/image, unoptimized, remote URLs).
 */
export default function ReportsAnalyticsPage() {
  const { showToast } = useApp();

  const handleViewAll = () => {
    haptic.light();
    showToast('Viewing all popular products');
  };

  const handleProductTap = (name: string) => {
    haptic.light();
    showToast(`Open ${name} report`);
  };

  return (
    <MobileLayout headerVariant="back" title="Reports" hideBottomNav>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* TITLE + OVERVIEW */}
        <div
          style={{
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
          }}
        >
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
            Analytics
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: theme.spacing.md,
            }}
          >
            <span
              style={{
                fontSize: theme.fontSize.body,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textSecondary,
                letterSpacing: theme.letterSpacing.wide,
              }}
            >
              Overview • Aug 2024
            </span>
            <button
              type="button"
              onClick={() => haptic.selection()}
              className="pressable ra-filter"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
                background: theme.colors.grey100,
                padding: `${theme.spacing.xs + 1}px ${theme.spacing.md}px`,
                borderRadius: theme.radius.pill,
                border: 'none',
                cursor: 'pointer',
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              This Month
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                aria-hidden
              >
                <polyline
                  points="6 9 12 15 18 9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* KPI GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xxl,
          }}
        >
          {/* REVENUE — col-span-2 with bar chart */}
          <div
            style={{
              gridColumn: 'span 2',
              background: theme.colors.white,
              padding: theme.spacing.lg,
              borderRadius: theme.radius.lg,
              border: `1px solid ${theme.colors.grey150}`,
              boxShadow: theme.shadows.xs,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.sm,
              }}
            >
              <span
                style={{
                  fontSize: theme.fontSize.xs,
                  fontWeight: theme.fontWeight.bold,
                  color: theme.colors.textSecondary,
                  letterSpacing: theme.letterSpacing.wider,
                  textTransform: 'uppercase',
                }}
              >
                Total Revenue
              </span>
              <span
                style={{
                  background: theme.colors.grey100,
                  color: theme.colors.textPrimary,
                  padding: `${theme.spacing.xs - 1}px ${theme.spacing.sm}px`,
                  borderRadius: theme.radius.pill,
                  fontSize: theme.fontSize.xs,
                  fontWeight: theme.fontWeight.bold,
                  letterSpacing: theme.letterSpacing.wider,
                }}
              >
                +12.4%
              </span>
            </div>
            <div
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.h1,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                letterSpacing: theme.letterSpacing.tight,
                lineHeight: theme.lineHeight.tight,
              }}
            >
              $142,850.00
            </div>
            {/* Bar chart mockup (monochrome, opacity-stepped) */}
            <div
              style={{
                marginTop: theme.spacing.md,
                height: 80,
                display: 'flex',
                alignItems: 'flex-end',
                gap: theme.spacing.xs,
                position: 'relative',
                borderBottom: `1px solid ${theme.colors.grey150}`,
              }}
            >
              {[0.3, 0.45, 0.4, 0.6, 0.55, 0.85, 1].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: theme.colors.black,
                    opacity: 0.2 + h * 0.6,
                    height: `${h * 100}%`,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ORDERS KPI */}
          <KpiCard
            label="Orders"
            value="1,248"
            delta="+8%"
            trend="up"
          />

          {/* AVG ORDER KPI */}
          <KpiCard
            label="Avg. Order"
            value="$114.40"
            delta="0%"
            trend="flat"
          />
        </div>

        {/* POPULAR PRODUCTS */}
        <section style={{ marginBottom: theme.spacing.xxl }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md,
            }}
          >
            <h2
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.lg,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                margin: 0,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              Popular Products
            </h2>
            <button
              type="button"
              onClick={handleViewAll}
              className="pressable ra-view"
              style={{
                background: 'transparent',
                border: 'none',
                color: theme.colors.textSecondary,
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                cursor: 'pointer',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            {/* Product 1 */}
            <button
              type="button"
              onClick={() => handleProductTap('Air Jordan 1 Retro')}
              className="pressable ra-prod"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
                background: theme.colors.white,
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.xs,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: theme.colors.grey100,
                  borderRadius: theme.radius.md,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2RdEqvryRYx4x0uOlKqbCrfG7wkMWYToQJrSQSScv1px8owSBsc5aKczZb6HwzAniNfpjfjCkYD9S0jj5gi0YvusrjZJ_CL-R_FwdbR_X2floNgnhDeLRa7TCTMCvhapRjeetGxevkNfj0fj6JAauPNAyLKNv-NbME8LHIqmDYjVwwThtW8TAvYKmZVxvtCq-hSaddJSqWSTxzgMYlitcczlXuX0_rykuta5vsA2Mash2QWyHUXebavS_wOLDMpXjBC8mX14qbgHH"
                  alt="Nike"
                  width={120}
                  height={120}
                  unoptimized
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: theme.fontSize.body,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textPrimary,
                  }}
                >
                  Air Jordan 1 Retro
                </div>
                <div
                  style={{
                    fontSize: theme.fontSize.xs,
                    color: theme.colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  428 Sold • $24,500 Rev
                </div>
              </div>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke={theme.colors.textPrimary}
                strokeWidth="2"
                aria-hidden
                style={{ flexShrink: 0 }}
              >
                <polyline
                  points="9 6 15 12 9 18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Product 2 */}
            <button
              type="button"
              onClick={() => handleProductTap('Yeezy Boost 350')}
              className="pressable ra-prod"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
                background: theme.colors.white,
                padding: theme.spacing.md,
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.xs,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: theme.colors.grey100,
                  borderRadius: theme.radius.md,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRcVGKUXOhGIyufE3XtOSYFT5hfuOB34Fkk9X3LkVY94Sr7lPG6xptTpQb--ILIbbNtBW7v2lw5p_JD9gFEoESVGREGxMK0qJHR5vTz0W33wEeCfjE8aCTjFVkuAqxAaRRLdnSNcapWIu9BxsgmvJrVav7ezWgSbgOpu_MoeZqW5JdpGq2MgHxg3mvqgbPAnT69vvyuI6u_qkgziVS8WVogacxxnrlPqtb51T-1a3SohI2cmXQXYq4I0PxMPYTBfInmIAfJHC3ov6s"
                  alt="Adidas"
                  width={120}
                  height={120}
                  unoptimized
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: theme.fontSize.body,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textPrimary,
                  }}
                >
                  Yeezy Boost 350
                </div>
                <div
                  style={{
                    fontSize: theme.fontSize.xs,
                    color: theme.colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  382 Sold • $18,900 Rev
                </div>
              </div>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke={theme.colors.textPrimary}
                strokeWidth="2"
                aria-hidden
                style={{ flexShrink: 0 }}
              >
                <polyline
                  points="9 6 15 12 9 18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* SALES TRENDS */}
        <section style={{ marginBottom: theme.spacing.xxl }}>
          <h2
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.textPrimary,
              margin: `0 0 ${theme.spacing.md}px 0`,
              letterSpacing: theme.letterSpacing.tight,
            }}
          >
            Sales Trends
          </h2>
          <div
            style={{
              background: theme.colors.white,
              padding: theme.spacing.lg,
              borderRadius: theme.radius.lg,
              border: `1px solid ${theme.colors.grey150}`,
              boxShadow: theme.shadows.sm,
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textSecondary,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              <span>Peak: 14th Aug</span>
              <span>$4,200/day</span>
            </div>
            {/* SVG trend line mockup */}
            <svg
              viewBox="0 0 300 80"
              preserveAspectRatio="none"
              style={{ width: '100%', height: 96 }}
              aria-hidden
            >
              <path
                d="M0,60 Q30,55 50,40 T100,30 T150,50 T200,10 T250,35 T300,5"
                fill="none"
                stroke={theme.colors.black}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M0,60 Q30,55 50,40 T100,30 T150,50 T200,10 T250,35 T300,5 V80 H0 Z"
                fill={theme.colors.black}
                opacity="0.06"
              />
            </svg>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textSecondary,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              <span>01 Aug</span>
              <span>08 Aug</span>
              <span>15 Aug</span>
              <span>22 Aug</span>
              <span>31 Aug</span>
            </div>
          </div>
        </section>

        {/* CUSTOMER PROFILE — radial chart mockups */}
        <section style={{ paddingBottom: theme.spacing.giant }}>
          <h2
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.textPrimary,
              margin: `0 0 ${theme.spacing.md}px 0`,
              letterSpacing: theme.letterSpacing.tight,
            }}
          >
            Customer Profile
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: theme.spacing.md,
            }}
          >
            {/* Male 68% */}
            <div
              style={{
                background: theme.colors.white,
                padding: theme.spacing.lg,
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.xs,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              <RadialGauge percentage={68} />
              <span
                style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.textSecondary,
                  letterSpacing: theme.letterSpacing.wider,
                  textTransform: 'uppercase',
                  fontWeight: theme.fontWeight.bold,
                }}
              >
                Male
              </span>
            </div>

            {/* Female 32% */}
            <div
              style={{
                background: theme.colors.white,
                padding: theme.spacing.lg,
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.xs,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              <RadialGauge percentage={32} />
              <span
                style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.textSecondary,
                  letterSpacing: theme.letterSpacing.wider,
                  textTransform: 'uppercase',
                  fontWeight: theme.fontWeight.bold,
                }}
              >
                Female
              </span>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .ra-filter:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .ra-view:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .ra-prod:active {
          transform: scale(0.98);
        }
        .ra-prod:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
      `}</style>
    </MobileLayout>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * KpiCard — small KPI card (Orders, Avg. Order)
 * ────────────────────────────────────────────────────────────────── */
function KpiCard({
  label,
  value,
  delta,
  trend,
}: {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'flat';
}) {
  return (
    <div
      style={{
        background: theme.colors.white,
        padding: theme.spacing.lg,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.grey150}`,
        boxShadow: theme.shadows.xs,
      }}
    >
      <div
        style={{
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.bold,
          color: theme.colors.textSecondary,
          letterSpacing: theme.letterSpacing.wider,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: theme.fontFamily.display,
          fontSize: theme.fontSize.h2,
          fontWeight: theme.fontWeight.extrabold,
          color: theme.colors.textPrimary,
          marginTop: theme.spacing.xs,
          letterSpacing: theme.letterSpacing.tight,
          lineHeight: theme.lineHeight.tight,
        }}
      >
        {value}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          marginTop: theme.spacing.xs + 2,
          fontSize: theme.fontSize.xs,
          color: trend === 'up' ? theme.colors.success : theme.colors.textSecondary,
          fontWeight: theme.fontWeight.bold,
          letterSpacing: theme.letterSpacing.wider,
        }}
      >
        {trend === 'up' ? (
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            aria-hidden
          >
            <polyline
              points="4 14 12 6 20 14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="12" y1="6" x2="12" y2="20" strokeLinecap="round" />
          </svg>
        ) : (
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
          </svg>
        )}
        <span>{delta}</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * RadialGauge — circular percentage gauge (SVG)
 *  - Background ring (grey200)
 *  - Filled arc (black) — 0% at top, fills clockwise
 * ────────────────────────────────────────────────────────────────── */
function RadialGauge({ percentage }: { percentage: number }) {
  const size = 64;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  // Rotate -90deg so the arc starts at top; arc length = percentage * c.
  const offset = c * (1 - percentage / 100);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={theme.colors.grey200}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={theme.colors.black}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>
      <span
        style={{
          position: 'absolute',
          fontSize: theme.fontSize.body,
          fontWeight: theme.fontWeight.extrabold,
          color: theme.colors.textPrimary,
          fontFamily: theme.fontFamily.display,
        }}
      >
        {percentage}%
      </span>
    </div>
  );
}
