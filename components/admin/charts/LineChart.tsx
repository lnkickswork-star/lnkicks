/**
 * LineChart — pure SVG multi-series line chart with gradient fill,
 * hover crosshair, and grid. No external deps.
 *
 * Props:
 *  - data: array of { label, value[] | value }
 *  - series: array of { name, color } — must match value[] length
 *  - height: px height of the chart area (default 260)
 *  - showGrid / showDots / showAreaFill / showCrosshair
 */

'use client';

import { useMemo, useState } from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';

export interface LineSeries {
  name: string;
  color: string;
}

export interface LinePoint {
  label: string;
  values: number[];
}

interface Props {
  data: LinePoint[];
  series: LineSeries[];
  height?: number;
  tokens: AdminThemeTokens;
  showGrid?: boolean;
  showDots?: boolean;
  showAreaFill?: boolean;
  showCrosshair?: boolean;
  formatValue?: (v: number) => string;
}

const WIDTH = 800; // viewBox width — scales responsively via CSS

export function LineChart({
  data, series, height = 260, tokens,
  showGrid = true, showDots = false, showAreaFill = true, showCrosshair = true,
  formatValue = (v) => String(v),
}: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const { padding, plotH, maxVal, xStep, points } = useMemo(() => {
    const padding = { top: 16, right: 16, bottom: 28, left: 56 };
    const plotW = WIDTH - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;
    const allVals = data.flatMap(d => d.values);
    const maxVal = Math.max(...allVals) * 1.1;
    const xStep = data.length > 1 ? plotW / (data.length - 1) : plotW;

    const points = series.map((_, si) =>
      data.map((d, di) => {
        const v = d.values[si] ?? 0;
        const x = padding.left + di * xStep;
        const y = padding.top + plotH - (v / (maxVal || 1)) * plotH;
        return { x, y, v };
      })
    );

    return { padding, plotW, plotH, maxVal, xStep, points };
  }, [data, series, height]);

  const gridLines = 4;
  const yTicks = Array.from({ length: gridLines + 1 }, (_, i) => {
    const v = (maxVal / gridLines) * i;
    const y = padding.top + plotH - (i / gridLines) * plotH;
    return { y, v };
  });

  // Unique IDs for gradient fills
  const gradIds = series.map((_, i) => `line-grad-${i}`);

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!showCrosshair) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
    // find nearest data point
    let nearest = 0;
    let bestDist = Infinity;
    for (let i = 0; i < data.length; i++) {
      const px = padding.left + i * xStep;
      const d = Math.abs(px - x);
      if (d < bestDist) { bestDist = d; nearest = i; }
    }
    setHoverIdx(nearest);
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
        style={{ display: 'block' }}
      >
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={gradIds[i]} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Grid */}
        {showGrid && yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={padding.left} x2={WIDTH - padding.right}
              y1={t.y} y2={t.y}
              stroke={tokens.chart.grid} strokeWidth={1} strokeDasharray={i === 0 ? '0' : '4 4'}
            />
            <text
              x={padding.left - 8} y={t.y + 4}
              textAnchor="end"
              fontSize={10}
              fill={tokens.chart.axis}
              fontFamily="Inter, system-ui, sans-serif"
            >
              {formatValue(t.v)}
            </text>
          </g>
        ))}

        {/* X-axis labels (every Nth to avoid crowding) */}
        {data.map((d, i) => {
          const stride = Math.max(1, Math.ceil(data.length / 8));
          if (i % stride !== 0 && i !== data.length - 1) return null;
          const x = padding.left + i * xStep;
          return (
            <text
              key={i}
              x={x} y={height - 8}
              textAnchor="middle"
              fontSize={10}
              fill={tokens.chart.axis}
              fontFamily="Inter, system-ui, sans-serif"
            >
              {d.label}
            </text>
          );
        })}

        {/* Area fills + lines */}
        {series.map((s, si) => {
          const pts = points[si];
          if (!pts.length) return null;
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
          const areaPath = `${path} L${pts[pts.length - 1].x.toFixed(1)},${padding.top + plotH} L${pts[0].x.toFixed(1)},${padding.top + plotH} Z`;
          return (
            <g key={si}>
              {showAreaFill && <path d={areaPath} fill={`url(#${gradIds[si]})`} />}
              <path
                d={path}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {showDots && pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={3} fill={s.color} />
              ))}
            </g>
          );
        })}

        {/* Crosshair */}
        {hoverIdx !== null && (
          <g>
            <line
              x1={padding.left + hoverIdx * xStep}
              x2={padding.left + hoverIdx * xStep}
              y1={padding.top} y2={padding.top + plotH}
              stroke={tokens.text.tertiary}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {series.map((s, si) => {
              const p = points[si][hoverIdx];
              if (!p) return null;
              return (
                <g key={si}>
                  <circle cx={p.x} cy={p.y} r={4} fill={tokens.bg.surface} stroke={s.color} strokeWidth={2} />
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {hoverIdx !== null && (
        <div
          style={{
            position: 'absolute',
            left: `${((padding.left + hoverIdx * xStep) / WIDTH) * 100}%`,
            top: 4,
            transform: 'translateX(-50%)',
            background: tokens.bg.surface,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 8,
            boxShadow: tokens.shadow.lg,
            padding: '8px 10px',
            fontSize: 11,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: tokens.text.primary,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4, color: tokens.text.secondary }}>
            {data[hoverIdx].label}
          </div>
          {series.map((s, si) => (
            <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: 'inline-block' }} />
              <span style={{ color: tokens.text.secondary }}>{s.name}:</span>
              <span style={{ fontWeight: 700 }}>{formatValue(data[hoverIdx].values[si] ?? 0)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
