/**
 * LNKICKS Enterprise Admin — Card System
 * ------------------------------------------------------------
 * Specialized card variants for common enterprise patterns.
 * All cards share the same visual language:
 *
 *   - 12px radius (dt.radius.lg)
 *   - 1px subtle border (tokens.border.subtle)
 *   - sm shadow at rest, md on hover
 *   - Hover: translateY(-2px) + border.strong
 *   - cubic-bezier(0.16,1,0.3,1) transitions
 *   - Inter font family
 *   - 8-point grid spacing
 *
 * The original `Card`, `Panel`, `PanelHeader` in `ui.tsx` remain
 * canonical for generic use. The variants below are SEMANTIC
 * specializations built on the same visual base.
 *
 * Variants:
 *   - MetricCard      (single KPI value with delta)
 *   - AnalyticsCard   (KPI + chart + comparison)
 *   - InformationCard (title + description + meta)
 *   - SummaryCard     (compact list of label/value pairs)
 *   - ProductCard     (image + name + brand + price + stock)
 *   - CustomerCard    (avatar + name + email + stats)
 *   - NotificationCard (icon + title + message + timestamp)
 *   - ActivityCard    (avatar + action description + timestamp)
 */

'use client';

import type { ReactNode, CSSProperties } from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';
import { dt } from '@/lib/admin/designTokens';
import { Icon, type IconName } from '@/components/admin/icons/Icon';
import { Badge, Avatar } from '@/components/admin/ui';

type Tk = AdminThemeTokens;

/* ─── Shared hover behavior ─────────────────────────────────── */

function hoverLift(tokens: Tk, hover?: boolean) {
  if (!hover) return {};
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = tokens.shadow.md;
      e.currentTarget.style.borderColor = tokens.border.strong;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = tokens.shadow.sm;
      e.currentTarget.style.borderColor = tokens.border.subtle;
    },
  } as const;
}

function cardBase(tokens: Tk, hover?: boolean): CSSProperties {
  return {
    background: tokens.bg.surface,
    border: `1px solid ${tokens.border.subtle}`,
    borderRadius: dt.radius.lg,
    boxShadow: tokens.shadow.sm,
    transition: `transform ${dt.motion.duration.base}ms ${dt.motion.easing.standard}, box-shadow ${dt.motion.duration.base}ms ${dt.motion.easing.standard}, border-color ${dt.motion.duration.base}ms ${dt.motion.easing.standard}`,
    cursor: hover ? 'pointer' : 'default',
    overflow: 'hidden',
  };
}

/* =========================================================== */
/* MetricCard — single KPI with delta                          */
/* =========================================================== */
export function MetricCard({
  tokens, label, value, delta, deltaSuffix = '%', deltaLabel,
  icon, tone = 'neutral', accent, hover, onClick, style,
}: {
  tokens: Tk; label: string; value: ReactNode;
  delta?: number; deltaSuffix?: string; deltaLabel?: string;
  icon?: IconName; tone?: 'positive' | 'negative' | 'neutral';
  accent?: string; hover?: boolean; onClick?: () => void; style?: CSSProperties;
}) {
  const positive = tone === 'positive';
  const negative = tone === 'negative';
  const deltaColor = positive ? tokens.status.success
    : negative ? tokens.status.error
    : tokens.text.secondary;
  const deltaBg = positive ? tokens.status.successBg
    : negative ? tokens.status.errorBg
    : tokens.bg.surfaceAlt;
  const arrow = positive ? '↑' : negative ? '↓' : '→';
  const accentColor = accent ?? (positive ? tokens.status.success : negative ? tokens.status.error : tokens.text.primary);

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
      style={{ ...cardBase(tokens, hover), padding: 18, ...style }}
      {...hoverLift(tokens, hover || !!onClick)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        {icon && (
          <div style={{
            width: 36, height: 36, borderRadius: dt.radius.md,
            background: tokens.bg.surfaceAlt,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: accentColor, border: `1px solid ${tokens.border.subtle}`,
          }}>
            <Icon name={icon} size={18} color={accentColor} />
          </div>
        )}
        {delta !== undefined && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 700, color: deltaColor,
            background: deltaBg, padding: '3px 8px', borderRadius: dt.radius.sm,
            letterSpacing: 0.3,
          }}>
            <span style={{ fontSize: 10 }}>{arrow}</span>
            {Math.abs(delta)}{deltaSuffix}
          </div>
        )}
      </div>
      <div style={{
        fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
        textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
        fontFamily: 'Inter, sans-serif',
      }}>{label}</div>
      <div style={{
        fontSize: 26, fontWeight: 800, color: tokens.text.primary,
        fontFamily: 'Inter, sans-serif', letterSpacing: '-0.025em', lineHeight: 1.1,
      }}>{value}</div>
      {deltaLabel && (
        <div style={{ marginTop: 8, fontSize: 10, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
          {deltaLabel}
        </div>
      )}
    </div>
  );
}

/* =========================================================== */
/* AnalyticsCard — KPI + embedded chart + comparison          */
/* =========================================================== */
export function AnalyticsCard({
  tokens, label, value, delta, deltaLabel, icon, tone = 'neutral',
  accent, chart, footer, hover, onClick, style,
}: {
  tokens: Tk; label: string; value: ReactNode;
  delta?: number; deltaLabel?: string;
  icon?: IconName; tone?: 'positive' | 'negative' | 'neutral';
  accent?: string; chart?: ReactNode; footer?: ReactNode;
  hover?: boolean; onClick?: () => void; style?: CSSProperties;
}) {
  const positive = tone === 'positive';
  const negative = tone === 'negative';
  const deltaColor = positive ? tokens.status.success
    : negative ? tokens.status.error
    : tokens.text.secondary;
  const arrow = positive ? '↑' : negative ? '↓' : '→';
  const accentColor = accent ?? (positive ? tokens.status.success : negative ? tokens.status.error : tokens.text.primary);

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
      style={{ ...cardBase(tokens, hover), padding: 18, ...style }}
      {...hoverLift(tokens, hover || !!onClick)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {icon && (
            <div style={{
              width: 28, height: 28, borderRadius: dt.radius.sm,
              background: tokens.bg.surfaceAlt,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: accentColor,
            }}>
              <Icon name={icon} size={14} color={accentColor} />
            </div>
          )}
          <span style={{
            fontSize: 11, fontWeight: 600, color: tokens.text.secondary,
            textTransform: 'uppercase', letterSpacing: 0.6,
            fontFamily: 'Inter, sans-serif',
          }}>{label}</span>
        </div>
        {delta !== undefined && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 700, color: deltaColor, fontFamily: 'Inter, sans-serif',
          }}>
            <span style={{ fontSize: 10 }}>{arrow}</span>{Math.abs(delta)}%
          </span>
        )}
      </div>
      <div style={{
        fontSize: 28, fontWeight: 800, color: tokens.text.primary,
        fontFamily: 'Inter, sans-serif', letterSpacing: '-0.025em', lineHeight: 1.1,
        marginBottom: 4,
      }}>{value}</div>
      {deltaLabel && (
        <div style={{ fontSize: 11, color: tokens.text.tertiary, marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
          {deltaLabel}
        </div>
      )}
      {chart && <div style={{ marginTop: 8 }}>{chart}</div>}
      {footer && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${tokens.border.subtle}` }}>{footer}</div>}
    </div>
  );
}

/* =========================================================== */
/* InformationCard — title + description + meta                */
/* =========================================================== */
export function InformationCard({
  tokens, title, description, icon, accent, meta, action,
  hover, onClick, style,
}: {
  tokens: Tk; title: string; description?: ReactNode;
  icon?: IconName; accent?: string; meta?: ReactNode;
  action?: ReactNode; hover?: boolean; onClick?: () => void; style?: CSSProperties;
}) {
  const accentColor = accent ?? tokens.text.primary;
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
      style={{ ...cardBase(tokens, hover), padding: 18, ...style }}
      {...hoverLift(tokens, hover || !!onClick)}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {icon && (
          <div style={{
            width: 40, height: 40, borderRadius: dt.radius.md,
            background: `${accentColor}14`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: accentColor, flexShrink: 0,
          }}>
            <Icon name={icon} size={20} color={accentColor} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 700, color: tokens.text.primary,
            fontFamily: 'Inter, sans-serif', marginBottom: 3,
          }}>{title}</div>
          {description && (
            <div style={{
              fontSize: 12, color: tokens.text.secondary,
              fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
            }}>{description}</div>
          )}
          {meta && (
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {meta}
            </div>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

/* =========================================================== */
/* SummaryCard — compact label/value pairs                     */
/* =========================================================== */
export function SummaryCard({
  tokens, title, subtitle, items, action, hover, style,
}: {
  tokens: Tk; title?: string; subtitle?: string;
  items: { label: string; value: ReactNode; tone?: 'default' | 'positive' | 'negative' | 'warning' }[];
  action?: ReactNode; hover?: boolean; style?: CSSProperties;
}) {
  return (
    <div
      style={{ ...cardBase(tokens, hover), padding: 18, ...style }}
      {...hoverLift(tokens, hover)}
    >
      {(title || action) && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: 14, gap: 12,
        }}>
          <div>
            {title && (
              <div style={{
                fontSize: 13, fontWeight: 700, color: tokens.text.primary,
                fontFamily: 'Inter, sans-serif',
              }}>{title}</div>
            )}
            {subtitle && (
              <div style={{
                fontSize: 11, color: tokens.text.secondary, marginTop: 2,
                fontFamily: 'Inter, sans-serif',
              }}>{subtitle}</div>
            )}
          </div>
          {action}
        </div>
      )}
      <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => {
          const color = item.tone === 'positive' ? tokens.status.success
            : item.tone === 'negative' ? tokens.status.error
            : item.tone === 'warning' ? tokens.status.warning
            : tokens.text.primary;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12,
              paddingBottom: 10,
              borderBottom: i === items.length - 1 ? 'none' : `1px solid ${tokens.border.subtle}`,
            }}>
              <dt style={{
                fontSize: 12, fontWeight: 500, color: tokens.text.secondary,
                fontFamily: 'Inter, sans-serif',
              }}>{item.label}</dt>
              <dd style={{
                margin: 0, fontSize: 13, fontWeight: 700, color,
                fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums',
              }}>{item.value}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

/* =========================================================== */
/* ProductCard — image + name + brand + price + stock          */
/* =========================================================== */
export function ProductCard({
  tokens, name, brand, sku, price, mrp, image, stock, status,
  hover, onClick, action, style,
}: {
  tokens: Tk; name: string; brand: string; sku?: string;
  price: ReactNode; mrp?: ReactNode; image?: string;
  stock?: number; status?: 'in-stock' | 'low-stock' | 'out-of-stock';
  hover?: boolean; onClick?: () => void; action?: ReactNode; style?: CSSProperties;
}) {
  const stockBadge = status === 'in-stock'
    ? <Badge tokens={tokens} tone="success" dot>In stock</Badge>
    : status === 'low-stock'
    ? <Badge tokens={tokens} tone="warning" dot>Low · {stock}</Badge>
    : status === 'out-of-stock'
    ? <Badge tokens={tokens} tone="critical" dot>Out of stock</Badge>
    : null;
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
      style={{ ...cardBase(tokens, hover ?? true), ...style }}
      {...hoverLift(tokens, (hover ?? true) || !!onClick)}
    >
      <div style={{
        aspectRatio: '4 / 3', background: tokens.bg.surfaceAlt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Icon name="package" size={32} color={tokens.text.tertiary} />
        )}
        {action && (
          <div style={{ position: 'absolute', top: 8, right: 8 }}>{action}</div>
        )}
      </div>
      <div style={{ padding: 14 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4,
          fontFamily: 'Inter, sans-serif',
        }}>{brand}</div>
        <div style={{
          fontSize: 13, fontWeight: 600, color: tokens.text.primary,
          fontFamily: 'Inter, sans-serif', marginBottom: 6,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</div>
        {sku && (
          <div style={{
            fontSize: 11, color: tokens.text.tertiary, marginBottom: 10,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          }}>{sku}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
          <span style={{
            fontSize: 16, fontWeight: 800, color: tokens.text.primary,
            fontFamily: 'Inter, sans-serif', letterSpacing: '-0.015em',
          }}>{price}</span>
          {mrp && (
            <span style={{
              fontSize: 12, color: tokens.text.tertiary,
              textDecoration: 'line-through', fontFamily: 'Inter, sans-serif',
            }}>{mrp}</span>
          )}
        </div>
        {stockBadge}
      </div>
    </div>
  );
}

/* =========================================================== */
/* CustomerCard — avatar + name + email + stats                */
/* =========================================================== */
export function CustomerCard({
  tokens, name, email, avatarColor, stats, hover, onClick, action, style,
}: {
  tokens: Tk; name: string; email: string; avatarColor?: string;
  stats?: { label: string; value: ReactNode }[];
  hover?: boolean; onClick?: () => void; action?: ReactNode; style?: CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
      style={{ ...cardBase(tokens, hover ?? true), padding: 16, ...style }}
      {...hoverLift(tokens, (hover ?? true) || !!onClick)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: stats ? 14 : 0 }}>
        <Avatar tokens={tokens} name={name} color={avatarColor} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: tokens.text.primary,
            fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{name}</div>
          <div style={{
            fontSize: 11, color: tokens.text.tertiary, marginTop: 2,
            fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{email}</div>
        </div>
        {action}
      </div>
      {stats && stats.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          gap: 8, padding: '10px 0 0', borderTop: `1px solid ${tokens.border.subtle}`,
        }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
                textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2,
                fontFamily: 'Inter, sans-serif',
              }}>{s.label}</div>
              <div style={{
                fontSize: 14, fontWeight: 700, color: tokens.text.primary,
                fontFamily: 'Inter, sans-serif',
              }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================== */
/* NotificationCard — icon + title + message + timestamp       */
/* =========================================================== */
export function NotificationCard({
  tokens, title, message, timestamp, severity = 'info', read,
  hover, onClick, action, style,
}: {
  tokens: Tk; title: string; message?: ReactNode;
  timestamp?: ReactNode; severity?: 'info' | 'success' | 'warning' | 'critical';
  read?: boolean; hover?: boolean; onClick?: () => void;
  action?: ReactNode; style?: CSSProperties;
}) {
  const color = severity === 'critical' ? tokens.status.error
    : severity === 'warning' ? tokens.status.warning
    : severity === 'success' ? tokens.status.success
    : tokens.status.info;
  const bg = severity === 'critical' ? tokens.status.errorBg
    : severity === 'warning' ? tokens.status.warningBg
    : severity === 'success' ? tokens.status.successBg
    : tokens.status.infoBg;
  const iconName: IconName = severity === 'critical' ? 'alertTriangle'
    : severity === 'warning' ? 'alertTriangle'
    : severity === 'success' ? 'checkCircle'
    : 'info';
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
      style={{
        ...cardBase(tokens, hover),
        padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start',
        background: read ? tokens.bg.surface : tokens.bg.hover,
        borderLeft: `3px solid ${color}`, ...style,
      }}
      {...hoverLift(tokens, hover)}
    >
      <div style={{
        width: 28, height: 28, borderRadius: dt.radius.md,
        background: bg, color, display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon name={iconName} size={14} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: tokens.text.primary,
            fontFamily: 'Inter, sans-serif',
          }}>{title}</div>
          {timestamp && (
            <div style={{
              fontSize: 10, color: tokens.text.tertiary,
              fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
            }}>{timestamp}</div>
          )}
        </div>
        {message && (
          <div style={{
            fontSize: 12, color: tokens.text.secondary, marginTop: 2,
            fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
          }}>{message}</div>
        )}
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </div>
    </div>
  );
}

/* =========================================================== */
/* ActivityCard — avatar + action description + timestamp      */
/* =========================================================== */
export function ActivityCard({
  tokens, actorName, actorColor, action, target, timestamp,
  icon, hover, onClick, style,
}: {
  tokens: Tk; actorName: string; actorColor?: string;
  action: string; target?: string; timestamp?: ReactNode;
  icon?: IconName; hover?: boolean; onClick?: () => void; style?: CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
      style={{
        ...cardBase(tokens, hover),
        padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center',
        ...style,
      }}
      {...hoverLift(tokens, hover)}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar tokens={tokens} name={actorName} color={actorColor} size={32} />
        {icon && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 16, height: 16, borderRadius: '50%',
            background: tokens.bg.surface, border: `2px solid ${tokens.bg.surface}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: tokens.text.secondary,
          }}>
            <Icon name={icon} size={9} color={tokens.text.secondary} />
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
        }}>
          <strong style={{ fontWeight: 700 }}>{actorName}</strong>{' '}
          <span style={{ color: tokens.text.secondary }}>{action}</span>{' '}
          {target && <strong style={{ fontWeight: 600 }}>{target}</strong>}
        </div>
        {timestamp && (
          <div style={{
            fontSize: 10, color: tokens.text.tertiary, marginTop: 2,
            fontFamily: 'Inter, sans-serif',
          }}>{timestamp}</div>
        )}
      </div>
    </div>
  );
}
