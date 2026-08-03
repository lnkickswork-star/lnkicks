/**
 * LNKICKS Admin — Compliance Center shared UI helpers
 * ------------------------------------------------------------
 * Small reusable molecules specific to the compliance module:
 *  - RiskGauge (circular score gauge)
 *  - SeverityBadge (issue severity pill)
 *  - RiskPill (risk level pill)
 *  - IssueCard (one compliance issue, fully expanded)
 *  - StatCard (compact KPI card)
 *  - RecommendationBanner (publish / review / do-not-publish gate)
 */

'use client';

import type { AdminThemeTokens } from '@/lib/admin/types';
import type {
  RiskLevel,
  IssueSeverity,
  ComplianceIssue,
  PublishRecommendation,
} from '@/lib/admin/complianceTypes';
import {
  RISK_LEVEL_META,
  SEVERITY_META,
  ISSUE_CATEGORY_META,
} from '@/lib/admin/complianceTypes';
import { Icon } from '@/components/admin/icons/Icon';

type Tk = AdminThemeTokens;

/* ------------------------------------------------------------------ */
/* Risk gauge — circular SVG progress                                  */
/* ------------------------------------------------------------------ */

export function RiskGauge({
  tokens, score, riskLevel, size = 140,
}: {
  tokens: Tk; score: number; riskLevel: RiskLevel; size?: number;
}) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const dash = (pct / 100) * circ;
  const color = RISK_LEVEL_META[riskLevel].color;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={tokens.border.subtle} strokeWidth={stroke} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          style={{
            transition: 'stroke-dasharray 600ms cubic-bezier(0.16,1,0.3,1), stroke 200ms ease',
          }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 2,
      }}>
        <div style={{
          fontSize: size > 100 ? 28 : 20, fontWeight: 800,
          color: tokens.text.primary, letterSpacing: '-0.03em',
          fontFamily: 'Inter, sans-serif', lineHeight: 1,
        }}>
          {score}
        </div>
        <div style={{
          fontSize: 9, fontWeight: 700, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}>
          / 100
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Severity badge                                                      */
/* ------------------------------------------------------------------ */

export function SeverityBadge({ tokens, severity }: { tokens: Tk; severity: IssueSeverity }) {
  const meta = SEVERITY_META[severity];
  const tone = meta.tone;
  const colors: Record<typeof tone, { bg: string; fg: string }> = {
    info: { bg: tokens.status.infoBg, fg: tokens.status.info },
    warning: { bg: tokens.status.warningBg, fg: tokens.status.warning },
    critical: { bg: tokens.status.errorBg, fg: tokens.status.error },
  };
  const c = colors[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 6,
      background: c.bg, color: c.fg,
      fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
      textTransform: 'uppercase',
      fontFamily: 'Inter, sans-serif',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.fg }} />
      {meta.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Risk pill                                                           */
/* ------------------------------------------------------------------ */

export function RiskPill({ tokens, riskLevel, size = 'md' }: {
  tokens: Tk; riskLevel: RiskLevel; size?: 'sm' | 'md';
}) {
  const meta = RISK_LEVEL_META[riskLevel];
  const tone = meta.tone;
  const colors: Record<typeof tone, { bg: string; fg: string }> = {
    success: { bg: tokens.status.successBg, fg: tokens.status.success },
    info: { bg: tokens.status.infoBg, fg: tokens.status.info },
    warning: { bg: tokens.status.warningBg, fg: tokens.status.warning },
    critical: { bg: tokens.status.errorBg, fg: tokens.status.error },
  };
  const c = colors[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '2px 8px' : '4px 10px',
      borderRadius: 999,
      background: c.bg, color: c.fg,
      fontSize: size === 'sm' ? 10 : 11, fontWeight: 700, letterSpacing: 0.3,
      fontFamily: 'Inter, sans-serif',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.fg }} />
      {meta.shortLabel}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Issue card                                                          */
/* ------------------------------------------------------------------ */

export function IssueCard({ tokens, issue }: { tokens: Tk; issue: ComplianceIssue }) {
  const cat = ISSUE_CATEGORY_META[issue.category];
  return (
    <div style={{
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 12,
      padding: 14,
      background: tokens.bg.surface,
      transition: 'border-color 160ms ease, box-shadow 160ms ease',
    }}
    className="lnk-issue-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: tokens.bg.surfaceAlt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: tokens.text.secondary,
        }}>
          <Icon name={cat.icon as any} size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: tokens.text.primary,
              fontFamily: 'Inter, sans-serif', letterSpacing: '-0.005em',
            }}>
              {cat.label}
            </span>
            <SeverityBadge tokens={tokens} severity={issue.severity} />
            <span style={{
              fontSize: 10, color: tokens.text.tertiary, fontWeight: 600,
              fontFamily: 'ui-monospace, monospace', letterSpacing: 0.2,
            }}>
              {issue.ruleId}
            </span>
          </div>
          <div style={{
            fontSize: 12, color: tokens.text.primary, lineHeight: 1.55,
            marginBottom: 8,
          }}>
            {issue.explanation}
          </div>
          {issue.snippet && (
            <div style={{
              fontSize: 11, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
              borderRadius: 6, padding: '6px 8px', color: tokens.text.secondary,
              marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              &ldquo;{issue.snippet}&rdquo;
            </div>
          )}
          <div style={{
            display: 'flex', gap: 6, alignItems: 'flex-start',
            padding: '8px 10px', borderRadius: 8,
            background: tokens.status.infoBg,
            border: `1px solid ${tokens.status.info}20`,
          }}>
            <Icon name="info" size={13} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: tokens.status.info,
                textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2,
              }}>
                Recommendation
              </div>
              <div style={{
                fontSize: 12, color: tokens.text.primary, lineHeight: 1.5,
              }}>
                {issue.recommendation}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .lnk-issue-card:hover {
          border-color: ${tokens.border.strong} !important;
          box-shadow: ${tokens.shadow.sm};
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recommendation banner (publish gate)                                */
/* ------------------------------------------------------------------ */

export function RecommendationBanner({
  tokens, recommendation,
}: { tokens: Tk; recommendation: PublishRecommendation }) {
  const config = {
    publish: {
      tone: 'success' as const,
      title: 'Cleared to Publish',
      message: 'All compliance checks passed. This product is ready to be published.',
      icon: 'checkCircle' as const,
    },
    review_then_publish: {
      tone: 'warning' as const,
      title: 'Review Required Before Publishing',
      message: 'Some issues were detected. Review the recommendations below and resolve warnings before publishing. Critical issues must be addressed.',
      icon: 'alertTriangle' as const,
    },
    do_not_publish: {
      tone: 'critical' as const,
      title: 'Publication Blocked — Critical Risk',
      message: 'This product cannot be published due to critical compliance violations. Resolve all critical issues and re-run the scan before publishing.',
      icon: 'xCircle' as const,
    },
  }[recommendation];

  const colors = {
    success: { bg: tokens.status.successBg, fg: tokens.status.success, border: tokens.status.success },
    warning: { bg: tokens.status.warningBg, fg: tokens.status.warning, border: tokens.status.warning },
    critical: { bg: tokens.status.errorBg, fg: tokens.status.error, border: tokens.status.error },
  }[config.tone];

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: 16, borderRadius: 12,
      background: colors.bg,
      border: `1px solid ${colors.border}30`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: colors.fg, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={config.icon} size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: colors.fg,
          marginBottom: 4, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.005em',
        }}>
          {config.title}
        </div>
        <div style={{
          fontSize: 12, color: tokens.text.primary, lineHeight: 1.55,
        }}>
          {config.message}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card — compact KPI                                             */
/* ------------------------------------------------------------------ */

export function StatCard({
  tokens, label, value, delta, deltaLabel, tone, icon, accent, onClick,
}: {
  tokens: Tk;
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  tone?: 'positive' | 'negative' | 'neutral';
  icon: string;
  accent: string;
  onClick?: () => void;
}) {
  const t = tone ?? 'neutral';
  const deltaColor = t === 'positive' ? tokens.status.success
    : t === 'negative' ? tokens.status.error
    : tokens.text.tertiary;
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      style={{
        padding: 16, borderRadius: 12,
        background: tokens.bg.surface,
        border: `1px solid ${tokens.border.subtle}`,
        boxShadow: tokens.shadow.sm,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 160ms cubic-bezier(0.16,1,0.3,1), box-shadow 160ms ease, border-color 160ms ease',
        position: 'relative', overflow: 'hidden',
      }}
      className="lnk-stat-card"
      onMouseEnter={(e) => {
        if (!onClick) return;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = tokens.shadow.md;
        e.currentTarget.style.borderColor = tokens.border.strong;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = tokens.shadow.sm;
        e.currentTarget.style.borderColor = tokens.border.subtle;
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: accent, opacity: 0.85,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.6,
          fontFamily: 'Inter, sans-serif',
        }}>
          {label}
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: accent + '15', color: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon as any} size={14} />
        </div>
      </div>
      <div style={{
        fontSize: 26, fontWeight: 800, color: tokens.text.primary,
        letterSpacing: '-0.025em', fontFamily: 'Inter, sans-serif',
        lineHeight: 1, marginBottom: 6,
      }}>
        {value}
      </div>
      {delta !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
          <span style={{ color: deltaColor, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            {delta > 0 ? '↑' : delta < 0 ? '↓' : '—'} {Math.abs(delta)}%
          </span>
          {deltaLabel && <span style={{ color: tokens.text.tertiary }}>{deltaLabel}</span>}
        </div>
      )}
      <style jsx>{`
        .lnk-stat-card:focus-visible {
          outline: 2px solid ${tokens.border.focus};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section label                                                       */
/* ------------------------------------------------------------------ */

export function SectionLabel({ tokens, children, action }: { tokens: Tk; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      margin: '24px 0 12px',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: tokens.text.tertiary,
        textTransform: 'uppercase', letterSpacing: 0.8,
        fontFamily: 'Inter, sans-serif',
      }}>
        {children}
      </div>
      {action}
    </div>
  );
}
