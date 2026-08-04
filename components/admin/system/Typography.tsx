/**
 * LNKICKS Enterprise Admin — Typography System
 * ------------------------------------------------------------
 * One declarative typography scale for the entire admin suite.
 * Each primitive maps directly to a token in `dt.typography`, so
 * the visual language stays consistent on every page.
 *
 * Design philosophy:
 *  - Tokens are the source of truth; these components just apply them.
 *  - Color defaults to `tokens.text.primary` but is overridable per use.
 *  - Every text element accepts `as` prop to render semantic tags
 *    (h1, h2, h3, h4, p, span, label, etc.) without changing style.
 *  - No layout responsibility — these are pure typography atoms.
 *
 * Usage:
 *   <Display tokens={tokens}>₹2,84,910</Display>
 *   <H1 tokens={tokens}>Inventory Management</H1>
 *   <Body tokens={tokens}>3 variants available</Body>
 *   <Caption tokens={tokens}>Updated 2 minutes ago</Caption>
 *   <Overline tokens={tokens}>Top Products</Overline>
 */

'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';
import { dt } from '@/lib/admin/designTokens';

type Tk = AdminThemeTokens;

interface TextProps {
  tokens: Tk;
  children: ReactNode;
  /** Render as a different element while keeping typography style. */
  as?: ElementType;
  /** Override color (defaults to text.primary). Pass a token role or hex. */
  color?: string;
  /** Override alignment. */
  align?: CSSProperties['textAlign'];
  /** Override margin (default 0 — these are inline-style atoms). */
  margin?: CSSProperties['margin'];
  /** Override line-height (defaults to scale). */
  lineHeight?: CSSProperties['lineHeight'];
  /** Truncate to N lines with ellipsis. */
  truncate?: number | true;
  /** Inline style passthrough. */
  style?: CSSProperties;
  /** Title attribute (native tooltip) — useful for truncated text. */
  title?: string;
  /** Accessible label for screen readers when content is decorative. */
  'aria-label'?: string;
}

function makeText(
  scaleKey: keyof typeof dt.typography,
  defaultColor: (t: Tk) => string,
) {
  return function TextAtom({
    tokens, children, as, color, align, margin, lineHeight,
    truncate, style, title, ...rest
  }: TextProps) {
    const Comp = (as ?? 'span') as ElementType;
    const scale = dt.typography[scaleKey];
    const isTruncate = truncate === true || (typeof truncate === 'number' && truncate === 1);
    const isClamp = typeof truncate === 'number' && truncate > 1;
    return (
      <Comp
        title={title}
        style={{
          margin: margin ?? 0,
          fontSize: scale.fontSize,
          lineHeight: lineHeight ?? scale.lineHeight,
          fontWeight: scale.fontWeight,
          letterSpacing: (scale as { letterSpacing?: string }).letterSpacing ?? 0,
          textTransform: (scale as { textTransform?: 'uppercase' }).textTransform,
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          color: color ?? defaultColor(tokens),
          textAlign: align,
          ...(isTruncate ? {
            whiteSpace: 'nowrap' as const,
            overflow: 'hidden' as const,
            textOverflow: 'ellipsis' as const,
            minWidth: 0,
          } : {}),
          ...(isClamp ? {
            display: '-webkit-box' as const,
            WebkitLineClamp: truncate,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden' as const,
          } : {}),
          ...style,
        }}
        {...rest}
      >
        {children}
      </Comp>
    );
  };
}

/* ─── Scale primitives ───────────────────────────────────────── */

/** Display — hero numbers, KPI values, large totals. */
export const Display = makeText('display', t => t.text.primary);

/** H1 — page title (top of every admin page). */
export const H1 = makeText('pageTitle', t => t.text.primary);

/** H2 — section heading within a page. */
export const H2 = makeText('h1', t => t.text.primary);

/** H3 — card title, panel header. */
export const H3 = makeText('h2', t => t.text.primary);

/** H4 — sub-section, row title. */
export const H4 = makeText('h3', t => t.text.primary);

/** Body large — primary readable text in panels. */
export const BodyLg = makeText('bodyLg', t => t.text.primary);

/** Body — default readable text. */
export const Body = makeText('body', t => t.text.primary);

/** Body small — table cells, list items. */
export const BodySm = makeText('bodySm', t => t.text.primary);

/** Caption — metadata, timestamps, helper text. */
export const Caption = makeText('caption', t => t.text.secondary);

/** Label — form labels, button text, menu items. */
export const Label = makeText('label', t => t.text.secondary);

/** Overline — uppercase section labels, table headers. */
export const Overline = makeText('overline', t => t.text.tertiary);

/** Micro — tiny badges, version numbers. */
export const Micro = makeText('micro', t => t.text.tertiary);

/** Mono — codes, IDs, SKUs. Uses monospace font family. */
export function Mono({
  tokens, children, as, color, align, margin, style, truncate, title, ...rest
}: TextProps) {
  const Comp = (as ?? 'code') as ElementType;
  const scale = dt.typography.mono;
  return (
    <Comp
      title={title}
      style={{
        margin: margin ?? 0,
        fontSize: scale.fontSize,
        lineHeight: scale.lineHeight,
        fontWeight: scale.fontWeight,
        fontFamily: scale.fontFamily,
        color: color ?? tokens.text.primary,
        textAlign: align,
        background: tokens.bg.surfaceAlt,
        padding: '1px 6px',
        borderRadius: dt.radius.sm,
        border: `1px solid ${tokens.border.subtle}`,
        ...(truncate ? {
          whiteSpace: 'nowrap' as const,
          overflow: 'hidden' as const,
          textOverflow: 'ellipsis' as const,
        } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* ─── Semantic helpers ───────────────────────────────────────── */

/** Truncated text — single-line ellipsis by default. */
export function Truncate({
  tokens, children, lines = 1, align, color, style, title, ...rest
}: TextProps & { lines?: number }) {
  const isSingle = lines === 1;
  return (
    <span
      title={title}
      style={{
        display: isSingle ? 'block' : '-webkit-box',
        fontSize: dt.typography.body.fontSize,
        lineHeight: dt.typography.body.lineHeight,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: color ?? tokens.text.primary,
        textAlign: align,
        ...(isSingle ? {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
        } : {
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

/** Numeric — formats a number with locale + tabular figures. */
export function Numeric({
  tokens, value, currency, locale = 'en-IN', precision, color, style, ...rest
}: {
  tokens: Tk; value: number; currency?: string; locale?: string;
  precision?: number; color?: string; style?: CSSProperties;
} & Omit<TextProps, 'children' | 'tokens'>) {
  let formatted: string;
  if (currency) {
    formatted = new Intl.NumberFormat(locale, {
      style: 'currency', currency, maximumFractionDigits: precision ?? 0,
    }).format(value);
  } else {
    formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: precision ?? 0,
    }).format(value);
  }
  return (
    <span
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: dt.typography.body.fontSize,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.005em',
        color: color ?? tokens.text.primary,
        ...style,
      }}
      {...rest}
    >
      {formatted}
    </span>
  );
}

/** DeltaText — colored +/- percentage change. */
export function DeltaText({
  tokens, value, suffix = '%', colorize = true, style, ...rest
}: {
  tokens: Tk; value: number; suffix?: string; colorize?: boolean;
  style?: CSSProperties;
} & Omit<TextProps, 'children' | 'tokens' | 'color'>) {
  const positive = value > 0;
  const negative = value < 0;
  const color = !colorize ? tokens.text.secondary
    : positive ? tokens.status.success
    : negative ? tokens.status.error
    : tokens.text.secondary;
  const arrow = positive ? '↑' : negative ? '↓' : '→';
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: dt.typography.caption.fontSize,
        fontWeight: 700, color, ...style,
      }}
      {...rest}
    >
      <span style={{ fontSize: 10 }}>{arrow}</span>
      {Math.abs(value)}{suffix}
    </span>
  );
}

export type { TextProps };
