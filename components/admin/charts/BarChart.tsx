/**
 * BarChart — vertical bars with optional value labels and gradient.
 * Pure SVG, no deps.
 */

'use client';

import { useState } from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: BarDatum[];
  tokens: AdminThemeTokens;
  height?: number;
  formatValue?: (v: number) => string;
  defaultColor?: string;
}

const WIDTH = 800;

export function BarChart({
  data, tokens, height = 260,
  formatValue = (v) => String(v),
  defaultColor,
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const padding = { top: 20, right: 12, bottom: 36, left: 56 };
  const plotW = WIDTH - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const maxVal = Math.max(...data.map(d => d.value)) * 1.15;
  const barW = plotW / data.length * 0.65;
  const gap = plotW / data.length * 0.35;
  const step = plotW / data.length;

  const baseColor = defaultColor ?? tokens.chart.series[0];
  const gradId = 'bar-grad';

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = (maxVal / 4) * i;
    const y = padding.top + plotH - (i / 4) * plotH;
    return { y, v };
  });

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${WIDTH} ${height}`} width="100%" height={height} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={baseColor} stopOpacity="1" />
            <stop offset="100%" stopColor={baseColor} stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={padding.left} x2={WIDTH - padding.right}
              y1={t.y} y2={t.y}
              stroke={tokens.chart.grid} strokeWidth={1} strokeDasharray={i === 0 ? '0' : '4 4'}
            />
            <text x={padding.left - 8} y={t.y + 4} textAnchor="end" fontSize={10} fill={tokens.chart.axis} fontFamily="Inter, sans-serif">
              {formatValue(t.v)}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const h = ((d.value - 0) / (maxVal || 1)) * plotH;
          const x = padding.left + i * step + gap / 2;
          const y = padding.top + plotH - h;
          const color = d.color ?? `url(#${gradId})`;
          return (
            <g
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={x} y={y} width={barW} height={Math.max(h, 1)}
                rx={4}
                fill={color}
                opacity={hover === null || hover === i ? 1 : 0.55}
                style={{ transition: 'opacity 120ms ease' }}
              />
              {hover === i && (
                <text
                  x={x + barW / 2} y={y - 6}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={tokens.text.primary}
                  fontFamily="Inter, sans-serif"
                >
                  {formatValue(d.value)}
                </text>
              )}
              <text
                x={x + barW / 2} y={height - 12}
                textAnchor="middle"
                fontSize={10}
                fill={tokens.chart.axis}
                fontFamily="Inter, sans-serif"
              >
                {d.label.length > 10 ? d.label.slice(0, 9) + '…' : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
