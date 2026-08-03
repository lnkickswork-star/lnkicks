/**
 * DonutChart — pure SVG donut with center label + legend.
 * Used for order status breakdown, traffic sources, etc.
 */

'use client';

import { useState } from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DonutSlice[];
  tokens: AdminThemeTokens;
  size?: number;        // diameter in px
  thickness?: number;   // ring thickness
  centerLabel?: string;
  centerValue?: string;
  formatValue?: (v: number) => string;
}

export function DonutChart({
  data, tokens, size = 200, thickness = 28,
  centerLabel, centerValue,
  formatValue = (v) => String(v),
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((s, x) => s + x.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d, i) => {
    const pct = d.value / total;
    const len = pct * circumference;
    const seg = {
      idx: i,
      color: d.color,
      label: d.label,
      value: d.value,
      pct: Math.round(pct * 1000) / 10,
      dashArray: `${len.toFixed(2)} ${(circumference - len).toFixed(2)}`,
      dashOffset: -offset,
    };
    offset += len;
    return seg;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={tokens.chart.grid}
            strokeWidth={thickness}
          />
          {segments.map(s => (
            <circle
              key={s.idx}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={hover === s.idx ? thickness + 4 : thickness}
              strokeDasharray={s.dashArray}
              strokeDashoffset={s.dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{
                transition: 'stroke-width 150ms ease, opacity 150ms ease',
                opacity: hover === null || hover === s.idx ? 1 : 0.4,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHover(s.idx)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        {/* Center */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          {hover !== null ? (
            <>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
                {formatValue(data[hover].value)}
              </div>
              <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>
                {data[hover].label} · {segments[hover].pct}%
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
                {centerValue ?? formatValue(total)}
              </div>
              <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {centerLabel}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 140 }}>
        {segments.map(s => (
          <div
            key={s.idx}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 6px',
              borderRadius: 6,
              cursor: 'pointer',
              background: hover === s.idx ? tokens.bg.hover : 'transparent',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={() => setHover(s.idx)}
            onMouseLeave={() => setHover(null)}
          >
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: tokens.text.secondary, flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
