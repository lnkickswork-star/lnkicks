'use client';

import React, { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * OrdersManagementPage — Admin Orders list + filtering.
 *
 * Stage 4g (admin) — Pattern C FULL REWRITE.
 * The original file used undefined Tailwind utility classes
 * (`bg-surface`, `text-headline-lg-mobile`, `font-headline-lg-mobile`,
 * `material-symbols-outlined`, `rounded-xl`, `bg-surface-container-lowest`,
 * `bg-secondary-container`, `text-on-secondary-container`, etc.) and
 * Material Symbols font icons — it rendered unstyled in production. This
 * rewrite rebuilds the page from scratch with MobileLayout + token-driven
 * inline styles + inline SVG icons.
 *
 * Layout:
 *  - `<MobileLayout headerVariant="back" title="Orders" hideBottomNav>`.
 *  - Page title + search bar + status filter chips.
 *  - Stats grid (2-col): Today's Revenue + Active Orders.
 *  - Recent Orders header row + Export CSV link.
 *  - Order cards: orderId + customer name + status badge + date + items
 *    count + total.
 *
 * Token usage:
 *  - Order cards: theme.radius.lg + 1px solid theme.colors.grey150 +
 *    theme.shadows.xs on theme.colors.white.
 *  - Status badges: theme.radius.pill; Processing → warning amber tint
 *    (#FEF3C7 + warning #78350f), Shipped → black bg + white text,
 *    Delivered → success green tint (#E3FCEF + success #14532d).
 *  - Filter chips: theme.radius.pill; active → black bg + white text;
 *    inactive → grey100 bg. haptic.selection() on tap.
 *  - Search input: theme.radius.lg + grey100 bg + 1.5px solid grey300
 *    border, focus → black border.
 *  - Export CSV link: textSecondary underline + haptic.light() on tap.
 *
 * All 4 order records (Marcus Thorne / Elena Rodriguez / James Henderson /
 * Sophia Chen — with orderId, status, date, items count, total) preserved
 * verbatim from the original.
 */
export default function OrdersManagementPage() {
  const { showToast } = useApp();

  const filters = ['All Orders', 'Processing', 'Shipped', 'Delivered'] as const;
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>('All Orders');

  const orders = [
    {
      id: '#ORD-28491',
      customer: 'Marcus Thorne',
      status: 'Processing' as const,
      date: 'Oct 24, 2023',
      items: 2,
      total: '$890.00',
      dimmed: false,
    },
    {
      id: '#ORD-28488',
      customer: 'Elena Rodriguez',
      status: 'Shipped' as const,
      date: 'Oct 23, 2023',
      items: 1,
      total: '$1,250.00',
      dimmed: false,
    },
    {
      id: '#ORD-28485',
      customer: 'James Henderson',
      status: 'Delivered' as const,
      date: 'Oct 23, 2023',
      items: 4,
      total: '$340.00',
      dimmed: false,
    },
    {
      id: '#ORD-28482',
      customer: 'Sophia Chen',
      status: 'Delivered' as const,
      date: 'Oct 22, 2023',
      items: 1,
      total: '$560.00',
      dimmed: true,
    },
  ];

  const handleFilterTap = (f: (typeof filters)[number]) => {
    haptic.selection();
    setActiveFilter(f);
  };

  const handleExport = () => {
    haptic.light();
    showToast('Exporting orders CSV');
  };

  const handleOrderTap = (orderId: string) => {
    haptic.light();
    showToast(`Open ${orderId}`);
  };

  return (
    <MobileLayout headerVariant="back" title="Orders" hideBottomNav>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* TITLE */}
        <h1
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.h2,
            fontWeight: theme.fontWeight.extrabold,
            color: theme.colors.textPrimary,
            margin: `${theme.spacing.sm}px 0 ${theme.spacing.md}px 0`,
            letterSpacing: theme.letterSpacing.tight,
            lineHeight: theme.lineHeight.tight,
          }}
        >
          Order Management
        </h1>

        {/* SEARCH */}
        <div style={{ position: 'relative', marginBottom: theme.spacing.md }}>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke={theme.colors.textSecondary}
            strokeWidth="2"
            aria-hidden
            style={{
              position: 'absolute',
              left: theme.spacing.lg,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search orders..."
            aria-label="Search orders"
            className="om-search"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: theme.colors.grey100,
              border: `1.5px solid ${theme.colors.grey300}`,
              borderRadius: theme.radius.lg,
              padding: `${theme.spacing.md}px ${theme.spacing.md}px ${
                theme.spacing.md
              }px ${theme.spacing.xxl + theme.spacing.lg}px`,
              fontSize: theme.fontSize.md,
              fontFamily: theme.fontFamily.body,
              color: theme.colors.textPrimary,
              transition: 'border-color 180ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* FILTER CHIPS — horizontally scrollable */}
        <div
          style={{
            display: 'flex',
            gap: theme.spacing.sm,
            overflowX: 'auto',
            paddingBottom: theme.spacing.xs,
            marginBottom: theme.spacing.xxl,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {filters.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => handleFilterTap(f)}
                aria-pressed={active}
                className="pressable om-chip"
                style={{
                  background: active
                    ? theme.colors.black
                    : theme.colors.grey100,
                  color: active
                    ? theme.colors.white
                    : theme.colors.textPrimary,
                  padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
                  borderRadius: theme.radius.pill,
                  border: 'none',
                  fontSize: theme.fontSize.body,
                  fontWeight: theme.fontWeight.bold,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  letterSpacing: theme.letterSpacing.wider,
                  transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* STATS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xxl,
          }}
        >
          <StatCard label="Today's Revenue" value="$4,280" />
          <StatCard label="Active Orders" value="24" />
        </div>

        {/* RECENT ORDERS HEADER */}
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
            Recent Orders
          </h2>
          <button
            type="button"
            onClick={handleExport}
            className="pressable om-export"
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.colors.textSecondary,
              fontSize: theme.fontSize.body,
              fontWeight: theme.fontWeight.bold,
              cursor: 'pointer',
              fontFamily: theme.fontFamily.body,
            }}
          >
            Export CSV
          </button>
        </div>

        {/* ORDER CARDS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
            paddingBottom: theme.spacing.giant,
          }}
        >
          {orders.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => handleOrderTap(o.id)}
              className="pressable om-order"
              style={{
                textAlign: 'left',
                background: theme.colors.white,
                padding: theme.spacing.lg,
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.xs,
                cursor: 'pointer',
                opacity: o.dimmed ? 0.6 : 1,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: theme.spacing.md,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: theme.fontSize.xs,
                      color: theme.colors.textSecondary,
                      fontFamily: theme.fontFamily.display,
                      fontWeight: theme.fontWeight.bold,
                      letterSpacing: theme.letterSpacing.wider,
                    }}
                  >
                    {o.id}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fontFamily.display,
                      fontSize: theme.fontSize.lg,
                      fontWeight: theme.fontWeight.extrabold,
                      color: theme.colors.textPrimary,
                      marginTop: theme.spacing.xs,
                      letterSpacing: theme.letterSpacing.tight,
                      lineHeight: theme.lineHeight.snug,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {o.customer}
                  </div>
                </div>
                <StatusBadge status={o.status} />
              </div>

              {/* Footer row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginTop: theme.spacing.xs,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: theme.fontSize.body,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {o.date}
                  </span>
                  <span
                    style={{
                      fontSize: theme.fontSize.xs,
                      color: theme.colors.textSecondary,
                      marginTop: 2,
                      letterSpacing: theme.letterSpacing.wider,
                      textTransform: 'uppercase',
                      fontWeight: theme.fontWeight.bold,
                    }}
                  >
                    {o.items} {o.items === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: theme.fontFamily.display,
                    fontSize: theme.fontSize.h2,
                    fontWeight: theme.fontWeight.extrabold,
                    color: theme.colors.price,
                    letterSpacing: theme.letterSpacing.tight,
                    lineHeight: 1,
                  }}
                >
                  {o.total}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .om-search:focus {
          outline: none;
          border-color: ${theme.colors.black};
        }
        .om-chip:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .om-export:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .om-order:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
      `}</style>
    </MobileLayout>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * StatCard — admin order-management KPI card
 * ────────────────────────────────────────────────────────────────── */
function StatCard({ label, value }: { label: string; value: string }) {
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
          color: theme.colors.textSecondary,
          letterSpacing: theme.letterSpacing.wider,
          textTransform: 'uppercase',
          fontWeight: theme.fontWeight.bold,
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
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * StatusBadge — order status pill
 *  - Processing → warning amber tint
 *  - Shipped → inverted black
 *  - Delivered → success green tint
 * ────────────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: 'Processing' | 'Shipped' | 'Delivered' }) {
  const palette =
    status === 'Processing'
      ? { bg: '#FEF3C7', fg: theme.colors.warning }
      : status === 'Shipped'
        ? { bg: theme.colors.black, fg: theme.colors.white }
        : { bg: '#E3FCEF', fg: theme.colors.success };

  return (
    <span
      style={{
        background: palette.bg,
        color: palette.fg,
        padding: `${theme.spacing.xs + 1}px ${theme.spacing.md}px`,
        borderRadius: theme.radius.pill,
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.bold,
        letterSpacing: theme.letterSpacing.wider,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {status}
    </span>
  );
}
