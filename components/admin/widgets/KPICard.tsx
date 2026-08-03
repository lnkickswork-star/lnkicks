/**
 * KPICard — reusable stat card for the enterprise dashboard.
 * Shows: icon, label, value, delta chip, sparkline.
 * Premium Apple/Nike-inspired minimal design.
 */

'use client';

import { Sparkline } from '../charts/Sparkline';
import type { AdminThemeTokens, KPI } from '@/lib/admin/types';

interface Props {
  kpi: KPI;
  tokens: AdminThemeTokens;
  compact?: boolean;
}

const ICON_PATHS: Record<string, string> = {
  rupee: 'M6 3h12M6 8h12M10 3c4 0 6 2 6 5s-2 5-6 5h-3l6 8',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  trending: 'M3 17l6-6 4 4 8-8M14 7h7v7',
  cart: 'M3 4h2l2.5 11h10l2-7H6M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
  check: 'M5 13l4 4L19 7',
  x: 'M6 6l12 12M6 18L18 6',
  users: 'M9 11a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0M17 11a4 4 0 100-8M21 20a7 7 0 00-5-6.7',
  'user-plus': 'M9 11a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0M19 8v6M22 11h-6',
  wallet: 'M3 7h15v12H3zM3 7l3-4h12l3 4M16 13h.01',
  ticket: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8z',
};

function Icon({ name, color, size = 16 }: { name: string; color: string; size?: number }) {
  const d = ICON_PATHS[name] ?? ICON_PATHS.trending;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function KPICard({ kpi, tokens, compact = false }: Props) {
  const positive = kpi.tone === 'positive';
  const negative = kpi.tone === 'negative';
  const deltaColor = positive ? tokens.status.success : negative ? tokens.status.error : tokens.text.secondary;
  const deltaBg = positive ? tokens.status.successBg : negative ? tokens.status.errorBg : tokens.bg.surfaceAlt;

  return (
    <div
      style={{
        background: tokens.bg.surface,
        border: `1px solid ${tokens.border.subtle}`,
        borderRadius: 14,
        padding: compact ? 14 : 18,
        boxShadow: tokens.shadow.sm,
        transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms ease',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = tokens.shadow.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = tokens.shadow.sm;
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: tokens.bg.surfaceAlt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: kpi.accent,
        }}>
          <Icon name={kpi.icon} color={kpi.accent} size={16} />
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          fontSize: 11, fontWeight: 700,
          color: deltaColor,
          background: deltaBg,
          padding: '3px 7px',
          borderRadius: 6,
          letterSpacing: 0.3,
        }}>
          <span>{positive ? '↑' : negative ? '↓' : '→'}</span>
          {Math.abs(kpi.delta)}%
        </div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600, color: tokens.text.secondary,
        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {kpi.label}
      </div>
      <div style={{
        fontSize: compact ? 20 : 24, fontWeight: 800, color: tokens.text.primary,
        fontFamily: 'Inter, system-ui, sans-serif',
        letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8,
      }}>
        {kpi.formattedValue}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
          {kpi.deltaLabel}
        </div>
        <Sparkline data={kpi.trend} color={kpi.accent} width={70} height={22} />
      </div>
    </div>
  );
}
