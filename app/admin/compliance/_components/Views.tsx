/**
 * LNKICKS Admin — Compliance Center supporting views
 * ------------------------------------------------------------
 * Bundle of the secondary tab views to keep imports tidy:
 *   - OverviewView     (dashboard with KPIs, score trend, queues)
 *   - HistoryView      (audit trail of compliance events)
 *   - TrademarkRegistryView (searchable brand registry)
 *   - SettingsView     (engine configuration + educational note)
 */

'use client';

import { useState, useMemo } from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';
import type {
  ComplianceProduct,
  ComplianceHistoryEntry,
  ComplianceScoreTrendPoint,
  TrademarkEntry,
  ComplianceHistoryAction,
} from '@/lib/admin/complianceTypes';
import {
  RISK_LEVEL_META,
  ISSUE_CATEGORY_META,
} from '@/lib/admin/complianceTypes';
import { getComplianceKPIs } from '@/lib/admin/complianceEngine';
import { LineChart } from '@/components/admin/charts/LineChart';
import { DonutChart } from '@/components/admin/charts/DonutChart';
import {
  Panel, Badge, Button, SearchInput, useToast,
} from '@/components/admin/ui';
import { Icon, type IconName } from '@/components/admin/icons/Icon';
import {
  RiskPill, StatCard, SectionLabel,
} from './shared';

type Tk = AdminThemeTokens;

/* ================================================================== */
/* OVERVIEW VIEW                                                       */
/* ================================================================== */

export function OverviewView({
  tokens, products, history, trend, onSelectProduct,
}: {
  tokens: Tk;
  products: ComplianceProduct[];
  history: ComplianceHistoryEntry[];
  trend: ComplianceScoreTrendPoint[];
  onSelectProduct: (id: string) => void;
}) {
  const kpis = getComplianceKPIs(products);

  // Risk distribution
  const riskDistribution = useMemo(() => {
    const buckets: Record<string, number> = { low: 0, medium: 0, high: 0, very_high: 0 };
    for (const p of products) {
      if (p.lastRiskLevel) buckets[p.lastRiskLevel]++;
    }
    return [
      { label: 'Low', value: buckets.low, color: RISK_LEVEL_META.low.color },
      { label: 'Medium', value: buckets.medium, color: RISK_LEVEL_META.medium.color },
      { label: 'High', value: buckets.high, color: RISK_LEVEL_META.high.color },
      { label: 'Very High', value: buckets.very_high, color: RISK_LEVEL_META.very_high.color },
    ];
  }, [products]);

  // High-risk products queue
  const highRiskProducts = useMemo(() =>
    products.filter(p => p.lastRiskLevel === 'high' || p.lastRiskLevel === 'very_high')
      .sort((a, b) => (a.lastScore ?? 100) - (b.lastScore ?? 100)),
    [products]);

  // Recent activity (last 6)
  const recentActivity = history.slice(0, 6);

  // Score trend data for chart
  const trendData = useMemo(() => trend.map(p => ({
    label: p.label,
    values: [p.score],
  })), [trend]);

  return (
    <div>
      {/* KPI Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}>
        <StatCard
          tokens={tokens} label="Waiting Review" value={kpis.waiting}
          delta={-2} deltaLabel="vs last week" tone="positive"
          icon="clock" accent={tokens.status.warning}
          onClick={() => onSelectProduct(products.find(p => p.status === 'pending_publish' || p.status === 'in_review')?.id || '')}
        />
        <StatCard
          tokens={tokens} label="High Risk Products" value={kpis.highRisk}
          delta={1} deltaLabel="vs last week" tone="negative"
          icon="alertTriangle" accent={tokens.status.error}
          onClick={() => onSelectProduct(highRiskProducts[0]?.id || '')}
        />
        <StatCard
          tokens={tokens} label="Recently Scanned" value={kpis.recentlyScanned}
          delta={5} deltaLabel="in last 24h" tone="positive"
          icon="checkCircle" accent={tokens.status.info}
        />
        <StatCard
          tokens={tokens} label="Published" value={kpis.recentlyPublished}
          delta={2} deltaLabel="this week" tone="positive"
          icon="upload" accent={tokens.status.success}
        />
      </div>

      {/* Charts row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
        gap: 12, marginTop: 16,
      }} className="lnk-overview-charts">
        <Panel tokens={tokens} title="Compliance Score Trend" subtitle="Average compliance score across all scanned products, last 30 days"
          action={<Badge tokens={tokens} tone="success" dot>Improving</Badge>}>
          <LineChart
            tokens={tokens}
            data={trendData}
            series={[{ name: 'Score', color: tokens.chart.series[0] }]}
            height={260}
            showAreaFill={true}
            showCrosshair={true}
            formatValue={(v) => `${v}/100`}
          />
        </Panel>

        <Panel tokens={tokens} title="Risk Distribution" subtitle="Across products in the catalog">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            flexWrap: 'wrap', justifyContent: 'center', padding: '12px 0',
          }}>
            <DonutChart
              tokens={tokens}
              data={riskDistribution}
              size={180}
              thickness={26}
              centerLabel="Products"
              centerValue={String(products.length)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 140 }}>
              {riskDistribution.map(r => (
                <div key={r.label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontSize: 12, padding: '6px 10px', borderRadius: 8,
                  background: tokens.bg.surfaceAlt,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color }} />
                    <span style={{ color: tokens.text.secondary, fontWeight: 600 }}>{r.label}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: tokens.text.primary }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* High-risk queue + recent activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
        gap: 12, marginTop: 16,
      }} className="lnk-overview-queues">
        <Panel tokens={tokens} title="High-Risk Products" subtitle="Require attention before publication"
          action={<Badge tokens={tokens} tone="critical">{highRiskProducts.length} flagged</Badge>}>
          {highRiskProducts.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: tokens.text.tertiary }}>
              <Icon name="checkCircle" size={28} />
              <div style={{ marginTop: 8 }}>No high-risk products. All clear.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {highRiskProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => onSelectProduct(p.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 0', cursor: 'pointer',
                    background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${tokens.border.subtle}`,
                    textAlign: 'left', width: '100%',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'background 120ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    background: tokens.status.errorBg, color: tokens.status.error,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 13,
                  }}>
                    {p.lastScore ?? '—'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: tokens.text.primary,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.name}
                    </div>
                    <div style={{
                      fontSize: 11, color: tokens.text.tertiary,
                      display: 'flex', gap: 6, alignItems: 'center',
                    }}>
                      <span style={{ fontFamily: 'ui-monospace, monospace' }}>{p.sku}</span>
                      <span>•</span>
                      <span>{p.brand}</span>
                    </div>
                  </div>
                  <RiskPill tokens={tokens} riskLevel={p.lastRiskLevel || 'medium'} size="sm" />
                  <Icon name="chevronRight" size={14} />
                </button>
              ))}
            </div>
          )}
        </Panel>

        <Panel tokens={tokens} title="Recent Activity" subtitle="Latest compliance events">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivity.map((h, i) => (
              <div key={h.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 0',
                borderBottom: i < recentActivity.length - 1 ? `1px solid ${tokens.border.subtle}` : 'none',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  background: actionColor(tokens, h.action) + '20',
                  color: actionColor(tokens, h.action),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={actionIcon(h.action)} size={12} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: tokens.text.primary,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {h.productName}
                  </div>
                  <div style={{
                    fontSize: 10, color: tokens.text.tertiary,
                    display: 'flex', gap: 4, alignItems: 'center',
                  }}>
                    <span style={{ textTransform: 'capitalize' }}>{h.action.replace(/_/g, ' ')}</span>
                    <span>•</span>
                    <span>{formatRelative(h.timestamp)}</span>
                  </div>
                </div>
                {h.riskLevel && <RiskPill tokens={tokens} riskLevel={h.riskLevel} size="sm" />}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          .lnk-overview-charts, .lnk-overview-queues {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ================================================================== */
/* HISTORY VIEW                                                        */
/* ================================================================== */

export function HistoryView({
  tokens, history,
}: {
  tokens: Tk;
  history: ComplianceHistoryEntry[];
}) {
  const { push: pushToast } = useToast();
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<ComplianceHistoryAction | 'all'>('all');

  const filtered = useMemo(() => {
    return history.filter(h => {
      if (actionFilter !== 'all' && h.action !== actionFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return h.productName.toLowerCase().includes(q)
          || h.productSku.toLowerCase().includes(q)
          || h.actorName.toLowerCase().includes(q)
          || (h.notes || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [history, query, actionFilter]);

  const actions: Array<ComplianceHistoryAction | 'all'> = [
    'all', 'scan_run', 'warning_resolved', 'warning_dismissed',
    'product_published', 'product_blocked', 'report_exported', 'rule_updated',
  ];

  return (
    <div>
      <Panel tokens={tokens}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          marginBottom: 12,
        }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <SearchInput
              tokens={tokens}
              value={query}
              onChange={setQuery}
              placeholder="Search history by product, SKU, actor, notes…"
              style={{ width: '100%' }}
            />
          </div>
          <Button
            tokens={tokens}
            variant="secondary"
            size="md"
            icon={<Icon name="download" size={14} />}
            onClick={() => {
              pushToast({ tone: 'info', title: 'Export started', message: 'Compliance history will be exported as CSV.' });
              exportHistoryCSV(filtered);
            }}
          >
            Export History
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {actions.map(a => (
            <button
              key={a}
              onClick={() => setActionFilter(a)}
              style={{
                padding: '4px 10px', borderRadius: 6, border: 'none',
                background: actionFilter === a ? tokens.text.primary : tokens.bg.surfaceAlt,
                color: actionFilter === a ? tokens.bg.app : tokens.text.secondary,
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: 0.5, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 120ms ease',
              }}
            >
              {a === 'all' ? 'All' : a.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </Panel>

      <SectionLabel tokens={tokens}>
        {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
      </SectionLabel>

      <Panel tokens={tokens} padding="none">
        {filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', fontSize: 12, color: tokens.text.tertiary }}>
            No history entries match the current filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((h, i) => (
              <div key={h.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 16px',
                borderBottom: i < filtered.length - 1 ? `1px solid ${tokens.border.subtle}` : 'none',
                transition: 'background 120ms ease',
              }}
              className="lnk-history-row"
              onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: actionColor(tokens, h.action) + '20',
                  color: actionColor(tokens, h.action),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={actionIcon(h.action)} size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontSize: 13, fontWeight: 600, color: tokens.text.primary,
                    }}>
                      {h.productName}
                    </span>
                    <span style={{
                      fontSize: 10, fontFamily: 'ui-monospace, monospace',
                      color: tokens.text.tertiary,
                    }}>
                      {h.productSku}
                    </span>
                    <Badge tokens={tokens} tone="neutral" size="sm">
                      {h.action.replace(/_/g, ' ')}
                    </Badge>
                    {h.riskLevel && <RiskPill tokens={tokens} riskLevel={h.riskLevel} size="sm" />}
                    {typeof h.score === 'number' && (
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: tokens.text.secondary,
                      }}>
                        Score: {h.score}
                      </span>
                    )}
                  </div>
                  {h.notes && (
                    <div style={{
                      fontSize: 12, color: tokens.text.secondary, lineHeight: 1.5,
                      marginBottom: 4,
                    }}>
                      {h.notes}
                    </div>
                  )}
                  <div style={{
                    fontSize: 10, color: tokens.text.tertiary,
                    display: 'flex', gap: 6, alignItems: 'center',
                  }}>
                    <span>{h.actorName}</span>
                    <span>•</span>
                    <span style={{ textTransform: 'capitalize' }}>{h.actorRole}</span>
                    <span>•</span>
                    <span>{new Date(h.timestamp).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}</span>
                    <span>•</span>
                    <span>{formatRelative(h.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ================================================================== */
/* TRADEMARK REGISTRY VIEW                                             */
/* ================================================================== */

export function TrademarkRegistryView({
  tokens, registry,
}: {
  tokens: Tk;
  registry: TrademarkEntry[];
}) {
  const [query, setQuery] = useState('');
  const [authFilter, setAuthFilter] = useState<'all' | 'authorized' | 'pending' | 'unauthorized' | 'unknown'>('all');

  const filtered = useMemo(() => {
    return registry.filter(e => {
      if (authFilter !== 'all' && e.authorizationStatus !== authFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return e.brand.toLowerCase().includes(q)
          || e.ipOwner.toLowerCase().includes(q)
          || e.variants.some(v => v.includes(q));
      }
      return true;
    });
  }, [registry, query, authFilter]);

  return (
    <div>
      <Panel tokens={tokens}>
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: tokens.text.primary,
            marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="shield" size={14} />
            Trademark &amp; Brand Registry
          </div>
          <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.55 }}>
            A screening list of well-known brand names the compliance engine checks for. This list is
            educational and not a substitute for legal counsel. Add or update entries as your brand coverage expands.
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <SearchInput
              tokens={tokens}
              value={query}
              onChange={setQuery}
              placeholder="Search by brand, IP owner, or variant…"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {(['all', 'authorized', 'pending', 'unauthorized', 'unknown'] as const).map(s => (
              <button
                key={s}
                onClick={() => setAuthFilter(s)}
                style={{
                  padding: '4px 10px', borderRadius: 6, border: 'none',
                  background: authFilter === s ? tokens.text.primary : tokens.bg.surfaceAlt,
                  color: authFilter === s ? tokens.bg.app : tokens.text.secondary,
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: 0.5, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <SectionLabel tokens={tokens}>
        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
      </SectionLabel>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 12,
      }}>
        {filtered.map(entry => (
          <Panel key={entry.brand} tokens={tokens} padding="md">
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              gap: 8, marginBottom: 8,
            }}>
              <div>
                <div style={{
                  fontSize: 14, fontWeight: 700, color: tokens.text.primary,
                  fontFamily: 'Inter, sans-serif', letterSpacing: '-0.005em',
                }}>
                  {entry.brand}
                </div>
                <div style={{ fontSize: 11, color: tokens.text.tertiary }}>
                  {entry.ipOwner}
                </div>
              </div>
              <AuthBadge tokens={tokens} status={entry.authorizationStatus} />
            </div>
            <div style={{
              fontSize: 11, color: tokens.text.secondary, lineHeight: 1.55,
              marginBottom: 10,
            }}>
              {entry.guidance}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 4,
            }}>
              {entry.variants.slice(0, 6).map(v => (
                <span key={v} style={{
                  padding: '2px 6px', borderRadius: 4,
                  background: tokens.bg.surfaceAlt,
                  fontSize: 10, fontFamily: 'ui-monospace, monospace',
                  color: tokens.text.secondary,
                }}>
                  {v}
                </span>
              ))}
              {entry.variants.length > 6 && (
                <span style={{
                  padding: '2px 6px', fontSize: 10, color: tokens.text.tertiary,
                }}>
                  +{entry.variants.length - 6} more
                </span>
              )}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function AuthBadge({ tokens, status }: { tokens: Tk; status: TrademarkEntry['authorizationStatus'] }) {
  const config = {
    authorized: { tone: 'success' as const, label: 'Authorized' },
    pending: { tone: 'warning' as const, label: 'Pending' },
    unauthorized: { tone: 'critical' as const, label: 'Unauthorized' },
    unknown: { tone: 'neutral' as const, label: 'Unknown' },
  }[status];
  return <Badge tokens={tokens} tone={config.tone} dot>{config.label}</Badge>;
}

/* ================================================================== */
/* SETTINGS VIEW                                                       */
/* ================================================================== */

export function SettingsView({ tokens }: { tokens: Tk }) {
  return (
    <div>
      <Panel tokens={tokens} title="How the Compliance Engine Works" subtitle="An overview of the screening pipeline and what each check looks for">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 12,
        }}>
          {(Object.keys(ISSUE_CATEGORY_META) as Array<keyof typeof ISSUE_CATEGORY_META>).map(cat => {
            const meta = ISSUE_CATEGORY_META[cat];
            return (
              <div key={cat} style={{
                padding: 14, borderRadius: 10,
                background: tokens.bg.surfaceAlt,
                border: `1px solid ${tokens.border.subtle}`,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: tokens.bg.surface,
                    color: tokens.text.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={meta.icon as any} size={14} />
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: tokens.text.primary,
                  }}>
                    {meta.label}
                  </div>
                </div>
                <div style={{
                  fontSize: 11, color: tokens.text.secondary, lineHeight: 1.55,
                }}>
                  {meta.description}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel tokens={tokens} title="Scoring Model" subtitle="How the compliance score is calculated">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            padding: 14, borderRadius: 10,
            background: tokens.bg.surfaceAlt,
            border: `1px solid ${tokens.border.subtle}`,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: tokens.text.primary,
              marginBottom: 8,
            }}>
              Penalty Weights by Severity
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 8,
            }}>
              <PenaltyRow tokens={tokens} label="Info" weight={3} color={tokens.status.info} />
              <PenaltyRow tokens={tokens} label="Warning" weight={8} color={tokens.status.warning} />
              <PenaltyRow tokens={tokens} label="Critical" weight={18} color={tokens.status.error} />
            </div>
            <div style={{
              marginTop: 10, fontSize: 11, color: tokens.text.tertiary, lineHeight: 1.55,
            }}>
              Score = 100 − (sum of penalties). Floor at 0. Diminishing returns apply above 60 penalty points.
            </div>
          </div>

          <div style={{
            padding: 14, borderRadius: 10,
            background: tokens.bg.surfaceAlt,
            border: `1px solid ${tokens.border.subtle}`,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: tokens.text.primary,
              marginBottom: 8,
            }}>
              Risk Level Bands
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(Object.keys(RISK_LEVEL_META) as Array<keyof typeof RISK_LEVEL_META>).map(level => {
                const meta = RISK_LEVEL_META[level];
                return (
                  <div key={level} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 10px', borderRadius: 8,
                    background: tokens.bg.surface,
                  }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: meta.color }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, flex: 1 }}>
                      {meta.label}
                    </span>
                    <span style={{
                      fontSize: 11, fontFamily: 'ui-monospace, monospace',
                      color: tokens.text.tertiary,
                    }}>
                      Score {meta.range}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            padding: 14, borderRadius: 10,
            background: tokens.bg.surfaceAlt,
            border: `1px solid ${tokens.border.subtle}`,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: tokens.text.primary,
              marginBottom: 8,
            }}>
              Publish Gate Logic
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: tokens.text.secondary }}>
              <div>• <strong style={{ color: tokens.status.success }}>Cleared to Publish</strong> — Score ≥ 80, no critical issues</div>
              <div>• <strong style={{ color: tokens.status.warning }}>Review Required</strong> — Score 40–79, no critical issues</div>
              <div>• <strong style={{ color: tokens.status.error }}>Publishing Blocked</strong> — Critical issue present OR Score &lt; 40</div>
            </div>
            <div style={{
              marginTop: 10, padding: '8px 10px', borderRadius: 8,
              background: tokens.status.warningBg, border: `1px solid ${tokens.status.warning}30`,
              fontSize: 11, color: tokens.text.primary, lineHeight: 1.55,
            }}>
              <strong style={{ color: tokens.status.warning }}>Note:</strong> The publish gate is a hard block — products with critical IP violations
              (counterfeit listings, unauthorized collaborations, watermarked marketing artwork) cannot be published until the issues are resolved
              and a re-scan passes. This protects the platform from copyright, trademark, and policy enforcement actions.
            </div>
          </div>
        </div>
      </Panel>

      <Panel tokens={tokens} title="Legal &amp; Educational Notice" subtitle="Please read — important limitations">
        <div style={{
          padding: 16, borderRadius: 10,
          background: tokens.status.infoBg, border: `1px solid ${tokens.status.info}30`,
          fontSize: 12, color: tokens.text.primary, lineHeight: 1.65,
        }}>
          <p style={{ margin: '0 0 10px' }}>
            <strong style={{ color: tokens.status.info }}>This compliance center is a screening tool, not legal advice.</strong>{' '}
            It performs automated checks for common copyright, trademark, and policy risks before a product is published.
            It does not provide a legal opinion, and it does not guarantee that a product is free from IP claims.
          </p>
          <p style={{ margin: '0 0 10px' }}>
            The trademark registry covers a curated list of well-known sneaker and footwear brands. It is not exhaustive.
            New brands, model lines, and design marks should be added as your catalog expands. When in doubt, consult a
            qualified intellectual property attorney.
          </p>
          <p style={{ margin: 0 }}>
            <strong>For brand owners:</strong> If you believe a listing on LNKICKS infringes your intellectual property,
            please submit a takedown request through our legal channel. We respond to valid IP claims within 48 hours.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function PenaltyRow({ tokens, label, weight, color }: { tokens: Tk; label: string; weight: number; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 10px', borderRadius: 8,
      background: tokens.bg.surface,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 800, color: tokens.text.primary }}>−{weight}</span>
    </div>
  );
}

/* ================================================================== */
/* HELPERS                                                             */
/* ================================================================== */

function actionColor(tokens: Tk, action: ComplianceHistoryAction): string {
  switch (action) {
    case 'product_published': return tokens.status.success;
    case 'product_blocked': return tokens.status.error;
    case 'warning_resolved': return tokens.status.success;
    case 'warning_dismissed': return tokens.status.warning;
    case 'scan_run': return tokens.status.info;
    case 'report_exported': return tokens.text.secondary;
    case 'rule_updated': return tokens.text.secondary;
    default: return tokens.text.secondary;
  }
}

function actionIcon(action: ComplianceHistoryAction): IconName {
  switch (action) {
    case 'product_published': return 'upload';
    case 'product_blocked': return 'xCircle';
    case 'warning_resolved': return 'checkCircle';
    case 'warning_dismissed': return 'alertTriangle';
    case 'scan_run': return 'search';
    case 'report_exported': return 'download';
    case 'rule_updated': return 'settings';
    default: return 'info';
  }
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day > 7) return `${Math.floor(day / 7)}w ago`;
  if (day > 0) return `${day}d ago`;
  if (hr > 0) return `${hr}h ago`;
  if (min > 0) return `${min}m ago`;
  return 'just now';
}

function exportHistoryCSV(history: ComplianceHistoryEntry[]) {
  const rows: string[][] = [
    ['Timestamp', 'Action', 'Product', 'SKU', 'Actor', 'Role', 'Risk Level', 'Score', 'Notes'],
  ];
  for (const h of history) {
    rows.push([
      new Date(h.timestamp).toISOString(),
      h.action,
      h.productName,
      h.productSku,
      h.actorName,
      h.actorRole,
      h.riskLevel || '',
      h.score?.toString() || '',
      h.notes || '',
    ]);
  }
  const csv = rows.map(r => r.map(c => {
    const s = String(c);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LNKICKS-Compliance-History-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
