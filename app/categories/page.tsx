'use client';

import React from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { CATEGORY_REGISTRY } from '@/components/category/CategoryRegistry';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * CategoriesPage — catalog overview / category landing.
 *
 * Phase 4 (Universal Polish) refactor:
 *  - Mounts <MobileLayout headerVariant="back" title="Categories"> so the
 *    page inherits the premium glass header + floating bottom nav + safe-area
 *    handling from the universal mobile shell.
 *  - All hardcoded colors / sizes / radii migrated to mobile design tokens.
 *  - Hero banner keeps its matte-black background but the banned iOS red
 *    #FF3B30 eyebrow is replaced with theme.colors.white (eyebrow on black
 *    surfaces must be white — no harsh reds anywhere on LN KICKS).
 *  - Category cards use theme.radius.xl + grey100-friendly surface +
 *    theme.shadows.xs elevation + haptic on tap.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function CategoriesPage() {
  return (
    <MobileLayout headerVariant="back" title="Categories"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Categories' },
      ]}
      desktopMaxWidth={1280}
    >
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* BREADCRUMB */}
        <div
          style={{
            fontSize: theme.fontSize.base,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xxl,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
          }}
        >
          <Link
            href="/"
            style={{
              color: theme.colors.textSecondary,
              textDecoration: 'none',
            }}
          >
            Home
          </Link>
          <span>/</span>
          <span
            style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            Categories
          </span>
        </div>

        {/* HERO BANNER */}
        <div
          style={{
            background: theme.colors.black,
            borderRadius: theme.radius.xxl,
            padding: `${theme.spacing.section}px ${theme.spacing.huge}px`,
            color: theme.colors.white,
            marginBottom: theme.spacing.giant,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: theme.shadows.lg,
          }}
        >
          <div
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.base,
              fontWeight: theme.fontWeight.extrabold,
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
              color: theme.colors.white,
              marginBottom: theme.spacing.sm,
            }}
          >
            Explore Catalog
          </div>
          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h1,
              fontWeight: theme.fontWeight.extrabold,
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: theme.lineHeight.tight,
              letterSpacing: theme.letterSpacing.tight,
            }}
          >
            Sneaker &amp; Apparel Categories
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 480,
              marginTop: theme.spacing.md,
              marginBottom: 0,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Browse our curated collection by brand, performance, or lifestyle
            style.
          </p>
        </div>

        {/* CATEGORIES ADAPTIVE GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: theme.spacing.xl,
          }}
        >
          {CATEGORY_REGISTRY.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              onPointerDown={() => haptic.light()}
              className="pressable"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  background: theme.colors.grey100,
                  borderRadius: theme.radius.xl,
                  padding: theme.spacing.xl,
                  border: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: 210,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: theme.shadows.xs,
                  transition: theme.transitions.surface,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 28 }} aria-hidden>
                    {cat.icon}
                  </span>
                  <span
                    style={{
                      fontSize: theme.fontSize.xs,
                      fontWeight: theme.fontWeight.bold,
                      color: theme.colors.textSecondary,
                      background: theme.colors.white,
                      padding: `${theme.spacing.xs}px ${theme.spacing.sm + 2}px`,
                      borderRadius: theme.radius.md,
                      letterSpacing: theme.letterSpacing.wide,
                      textTransform: 'uppercase',
                    }}
                  >
                    {cat.productCount} Items
                  </span>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: theme.fontFamily.display,
                      fontSize: theme.fontSize.xxl,
                      fontWeight: theme.fontWeight.extrabold,
                      textTransform: 'uppercase',
                      color: theme.colors.textPrimary,
                      margin: `0 0 ${theme.spacing.xs + 2}px`,
                      letterSpacing: theme.letterSpacing.tight,
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p
                    style={{
                      fontSize: theme.fontSize.base,
                      color: theme.colors.textSecondary,
                      margin: 0,
                      lineHeight: theme.lineHeight.normal,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
    </MobileLayout>
  );
}
