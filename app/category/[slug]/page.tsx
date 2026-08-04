'use client';

import { useParams } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ResponsiveProductCard } from '@/components/ResponsiveProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';
import { theme } from '@/lib/mobile/theme/theme';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * CategorySlugPage — single category view (/category/[slug]).
 *
 * Phase 29 (Mobile UI Refinement):
 *  - Breadcrumb REMOVED (back header already shows the category name).
 *  - Duplicate category H1 title card REMOVED (back header subtitle
 *    already displays the same name in uppercase).
 *  - Product grid now sits flush below the header — no empty space,
 *    no duplicate labels.
 *
 * Phase 4 (Universal Polish) — preserved:
 *  - Mounts <MobileLayout headerVariant="back" title={categoryName}
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Categories', href: '/categories' },
        { label: categoryName },
      ]}
      desktopMaxWidth={1280}
    >
 *  - All colors/sizes/radii use mobile design tokens.
 *
 * Desktop rendering preserved — MobileLayout detects UA + viewport width
 * and renders children untouched on desktop.
 */
export default function CategorySlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const categoryName = slug ? slug.toUpperCase().replace('-', ' ') : 'CATEGORY';

  return (
    <MobileLayout headerVariant="back" title={categoryName}>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* ── ADAPTIVE PRODUCT GRID ─────────────────────────────────────
            Phase 29: breadcrumb + duplicate H1 title card removed.
            Grid now sits flush below the header (MobileLayout main
            already has spacing.lg top padding). */}

        {/* Optional small category summary — kept compact, single line,
            so the grid can start closer to the header. Hidden if you
            want a truly bare grid; for now shown as a subtle eyebrow. */}
        <p
          style={{
            fontSize: theme.fontSize.body,
            color: theme.colors.textSecondary,
            margin: `0 0 ${theme.spacing.xl}px 0`,
            lineHeight: theme.lineHeight.relaxed,
          }}
        >
          Showing authentic luxury items in {categoryName}.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: theme.spacing.xl,
          }}
        >
          {PRODUCT_REGISTRY.map((p) => (
            <ResponsiveProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
    </MobileLayout>
  );
}
