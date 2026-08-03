/**
 * PageHeader — consistent page hero for every admin page.
 *
 * Layout:
 *   [ Title + subtitle + breadcrumb ]   [ actions row ]
 *
 * Used at the top of every admin page for visual consistency.
 */

'use client';

import type { AdminThemeTokens } from '@/lib/admin/types';
import { Breadcrumb } from './ui';

interface Props {
  tokens: AdminThemeTokens;
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  meta?: React.ReactNode; // small stats / chips next to title
}

export function PageHeader({ tokens, title, subtitle, breadcrumb, actions, meta }: Props) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 16, flexWrap: 'wrap', marginBottom: 24,
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        {breadcrumb && (
          <div style={{ marginBottom: 8 }}>
            <Breadcrumb tokens={tokens} items={breadcrumb} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1 style={{
            margin: 0, fontSize: 24, fontWeight: 800,
            color: tokens.text.primary, fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.025em', lineHeight: 1.1,
          }}>{title}</h1>
          {meta}
        </div>
        {subtitle && (
          <p style={{
            margin: '6px 0 0 0', fontSize: 13, color: tokens.text.secondary,
            fontFamily: 'Inter, sans-serif', lineHeight: 1.5, maxWidth: 640,
          }}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
