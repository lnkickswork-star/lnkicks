'use client';

import React from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * DashboardPage — Admin Executive Overview.
 *
 * Stage 4g (admin) refactor:
 *  - Replaced ResponsiveAppLayout with `<MobileLayout headerVariant="back"
 *    title="Dashboard" hideBottomNav>` — admin users do NOT see the consumer
 *    bottom nav (Home / Wishlist / Cart FAB / Profile / Categories).
 *  - Migrated every hardcoded value to design tokens (colors / spacing /
 *    radius / shadows / typography).
 *  - Banned iOS red #FF3B30 "SUPER ADMIN" badge → theme.colors.black chip;
 *    stat-card delta "+18.4%" → success green (#14532d) on #E3FCEF tint,
 *    "-4" → theme.colors.error (#7f1d1d) on #FBEAEA rose tint (matches the
 *    track-order / order-failed convention from stage-4b/4c/4d).
 *  - Stat cards: theme.radius.lg on theme.colors.white with
 *    1px solid theme.colors.grey150 border; large numeric value in
 *    theme.fontSize.h1 + theme.fontWeight.extrabold.
 *  - Admin nav strip uses token-driven chips with haptic.light() on tap.
 *  - Quick-management CTAs use radius.pill + display font + uppercase,
 *    haptic.medium() on tap (primary admin action).
 *  - All business logic (stats array, Link hrefs) preserved 1:1.
 */
export default function DashboardPage() {
  const stats = [
    { label: 'Total Revenue', value: '₹24,89,500', change: '+18.4%' },
    { label: 'Total Orders', value: '1,420', change: '+12.1%' },
    { label: 'Active Customers', value: '8,950', change: '+24.5%' },
    { label: 'Low Stock SKUs', value: '12', change: '-4' },
  ];

  const adminNav = [
    { href: '/dashboard', label: 'Dashboard', active: true },
    { href: '/products-management', label: 'Products', active: false },
    { href: '/orders-management', label: 'Orders', active: false },
    { href: '/customers-management', label: 'Customers', active: false },
    { href: '/settings-panel', label: 'Settings', active: false },
  ];

  return (
    <MobileLayout headerVariant="back" title="Dashboard" hideBottomNav>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* ADMIN NAV STRIP */}
        <nav
          aria-label="Admin navigation"
          style={{
            background: theme.colors.black,
            borderRadius: theme.radius.xxl,
            padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
            color: theme.colors.white,
            marginBottom: theme.spacing.xxl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: theme.spacing.md,
          }}
        >
          <div
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.extrabold,
              letterSpacing: theme.letterSpacing.wider,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ADMIN SUITE
            <span
              style={{
                fontSize: theme.fontSize.xs,
                background: theme.colors.white,
                color: theme.colors.black,
                padding: `${theme.spacing.xs - 1}px ${theme.spacing.sm}px`,
                borderRadius: theme.radius.pill,
                marginLeft: theme.spacing.sm,
                fontWeight: theme.fontWeight.bold,
                letterSpacing: theme.letterSpacing.wider,
              }}
            >
              SUPER ADMIN
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.md,
              fontSize: theme.fontSize.body,
              fontWeight: theme.fontWeight.semibold,
              flexWrap: 'wrap',
            }}
          >
            {adminNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onPointerDown={() => haptic.light()}
                className="pressable"
                style={{
                  color: n.active
                    ? theme.colors.white
                    : 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>

        <h1
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.h1,
            fontWeight: theme.fontWeight.extrabold,
            textTransform: 'uppercase',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xxxl,
            letterSpacing: theme.letterSpacing.tight,
            lineHeight: theme.lineHeight.tight,
          }}
        >
          Executive Overview
        </h1>

        {/* STATS WIDGETS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.giant,
          }}
        >
          {stats.map((s) => {
            const positive = s.change.startsWith('+');
            return (
              <div
                key={s.label}
                style={{
                  background: theme.colors.white,
                  borderRadius: theme.radius.lg,
                  padding: theme.spacing.xl,
                  border: `1px solid ${theme.colors.grey150}`,
                  boxShadow: theme.shadows.xs,
                }}
              >
                <div
                  style={{
                    fontSize: theme.fontSize.body,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textSecondary,
                    marginBottom: theme.spacing.sm,
                    letterSpacing: theme.letterSpacing.wide,
                  }}
                >
                  {s.label}
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
                  {s.value}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: theme.fontSize.xs,
                    fontWeight: theme.fontWeight.bold,
                    color: positive
                      ? theme.colors.success
                      : theme.colors.error,
                    background: positive ? '#E3FCEF' : '#FBEAEA',
                    padding: `${theme.spacing.xs - 1}px ${theme.spacing.sm}px`,
                    borderRadius: theme.radius.pill,
                    marginTop: theme.spacing.xs,
                    letterSpacing: theme.letterSpacing.wider,
                  }}
                >
                  {s.change} vs last month
                </div>
              </div>
            );
          })}
        </div>

        {/* QUICK MANAGEMENT LINKS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: theme.spacing.xl,
            paddingBottom: theme.spacing.giant,
          }}
        >
          <div
            style={{
              background: theme.colors.white,
              borderRadius: theme.radius.xxl,
              padding: theme.spacing.xxxl,
              border: `1px solid ${theme.colors.grey150}`,
              boxShadow: theme.shadows.xs,
            }}
          >
            <h3
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.xxl,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                margin: `0 0 ${theme.spacing.md}px 0`,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              Products &amp; Catalog
            </h3>
            <p
              style={{
                fontSize: theme.fontSize.body,
                color: theme.colors.textSecondary,
                lineHeight: theme.lineHeight.relaxed,
                marginBottom: theme.spacing.xl,
              }}
            >
              Manage 50,000+ sneaker SKUs, add new drops, update pricing, and
              adjust stock levels.
            </p>
            <Link
              href="/products-management"
              onPointerDown={() => haptic.medium()}
              className="pressable dash-cta"
              style={{
                padding: `${theme.spacing.sm + 2}px ${theme.spacing.xl}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.body,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'none',
                display: 'inline-block',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Manage Catalog →
            </Link>
          </div>

          <div
            style={{
              background: theme.colors.white,
              borderRadius: theme.radius.xxl,
              padding: theme.spacing.xxxl,
              border: `1px solid ${theme.colors.grey150}`,
              boxShadow: theme.shadows.xs,
            }}
          >
            <h3
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.xxl,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                margin: `0 0 ${theme.spacing.md}px 0`,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              Orders &amp; Fulfillment
            </h3>
            <p
              style={{
                fontSize: theme.fontSize.body,
                color: theme.colors.textSecondary,
                lineHeight: theme.lineHeight.relaxed,
                marginBottom: theme.spacing.xl,
              }}
            >
              Process pending customer orders, update BlueDart tracking numbers,
              and manage returns.
            </p>
            <Link
              href="/orders-management"
              onPointerDown={() => haptic.medium()}
              className="pressable dash-cta"
              style={{
                padding: `${theme.spacing.sm + 2}px ${theme.spacing.xl}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.body,
                fontWeight: theme.fontWeight.bold,
                textDecoration: 'none',
                display: 'inline-block',
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Manage Orders →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .dash-cta:active {
          transform: scale(0.97);
        }
        .dash-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
