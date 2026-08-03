/**
 * LNKICKS Admin — Compliance Scan Studio
 * ------------------------------------------------------------
 * Pre-publish compliance screening workbench.
 *
 * Layout:
 *   ┌────────────────────────────┬───────────────────────────────────┐
 *   │  Product Queue (left rail) │  Scan Report (main panel)         │
 *   │  - searchable              │  - score gauge + risk pill         │
 *   │  - filter by status        │  - publish recommendation banner  │
 *   │  - per-product risk pill   │  - executive summary              │
 *   │  - click to select         │  - next steps                     │
 *   │                            │  - issues grouped by category     │
 *   │                            │  - export menu (PDF/XLSX/CSV)     │
 *   │                            │  - publish gate (blocks on crit)  │
 *   └────────────────────────────┴───────────────────────────────────┘
 *
 * The publish button is HARD-DISABLED when recommendation === 'do_not_publish'.
 * This is the active IP-protection mechanism the user requested.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';
import type {
  ComplianceProduct,
  ComplianceScanResult,
  IssueCategory,
} from '@/lib/admin/complianceTypes';
import {
  ISSUE_CATEGORY_META,
} from '@/lib/admin/complianceTypes';
import { runComplianceScan } from '@/lib/admin/complianceEngine';
import {
  exportScanCSV, exportScanXLSX, exportScanPDF,
} from '@/lib/admin/complianceExport';
import {
  Panel, Button, Badge, SearchInput, useToast,
} from '@/components/admin/ui';
import { Icon } from '@/components/admin/icons/Icon';
import {
  RiskGauge, RiskPill, IssueCard,
  RecommendationBanner, SectionLabel,
} from './shared';

type Tk = AdminThemeTokens;

interface Props {
  tokens: Tk;
  products: ComplianceProduct[];
  onProductPublished?: (productId: string, scan: ComplianceScanResult) => void;
  initialProductId?: string;
}

export function ScanStudio({ tokens, products, onProductPublished, initialProductId }: Props) {
  const { push: pushToast } = useToast();
  const [selectedId, setSelectedId] = useState<string | undefined>(initialProductId);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_review' | 'published' | 'blocked'>('all');
  const [scan, setScan] = useState<ComplianceScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');

  // Auto-select first product on mount
  useEffect(() => {
    if (!selectedId && products.length > 0) {
      setSelectedId(products[0].id);
    }
  }, [products, selectedId]);

  // Filtered product list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q)
          || p.sku.toLowerCase().includes(q)
          || p.brand.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, query, statusFilter]);

  const selectedProduct = useMemo(
    () => products.find(p => p.id === selectedId),
    [products, selectedId],
  );

  // Run a scan
  function handleScan() {
    if (!selectedProduct) return;
    setScanning(true);
    setScan(null);
    // Simulate async scan with a brief delay for UX
    setTimeout(() => {
      const result = runComplianceScan(selectedProduct);
      setScan(result);
      setScanning(false);
      pushToast({
        tone: result.recommendation === 'publish' ? 'success'
          : result.recommendation === 'do_not_publish' ? 'error'
          : 'warning',
        title: `Scan complete — Score ${result.score}/100`,
        message: result.summary,
      });
    }, 700);
  }

  // Auto-run scan when product changes
  useEffect(() => {
    if (!selectedProduct) { setScan(null); return; }
    handleScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function handlePublish() {
    if (!scan || !selectedProduct) return;
    if (scan.recommendation === 'do_not_publish') {
      pushToast({
        tone: 'error',
        title: 'Publishing blocked',
        message: 'This product has critical compliance violations and cannot be published. Resolve all critical issues and re-scan.',
      });
      return;
    }
    pushToast({
      tone: 'success',
      title: 'Product published',
      message: `${selectedProduct.name} is now live. Compliance report saved to product history.`,
    });
    onProductPublished?.(selectedProduct.id, scan);
  }

  function handleExport(format: 'pdf' | 'xlsx' | 'csv') {
    if (!scan) return;
    if (format === 'pdf') exportScanPDF(scan);
    else if (format === 'xlsx') exportScanXLSX(scan);
    else exportScanCSV(scan);
    pushToast({
      tone: 'info',
      title: 'Report exported',
      message: `Compliance report exported as ${format.toUpperCase()}.`,
    });
  }

  // Filtered issues for display
  const filteredIssues = useMemo(() => {
    if (!scan) return [];
    if (categoryFilter === 'all') return scan.issues;
    return scan.issues.filter(i => i.category === categoryFilter);
  }, [scan, categoryFilter]);

  // Issue counts by category
  const issueCounts = useMemo(() => {
    if (!scan) return {} as Record<IssueCategory, number>;
    const counts: Record<IssueCategory, number> = {
      trademark: 0, image: 0, seo: 0, content_quality: 0, policy: 0,
    };
    for (const i of scan.issues) counts[i.category]++;
    return counts;
  }, [scan]);

  return (
    <div className="lnk-scan-studio" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(280px, 320px) minmax(0, 1fr)',
      gap: 16, alignItems: 'start',
    }}>
      {/* ───────────────────────────────────────────────────────── */}
      {/* LEFT RAIL — product queue                                */}
      {/* ───────────────────────────────────────────────────────── */}
      <div style={{
        background: tokens.bg.surface,
        border: `1px solid ${tokens.border.subtle}`,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'sticky', top: 16,
      }}>
        <div style={{
          padding: '14px 14px 10px',
          borderBottom: `1px solid ${tokens.border.subtle}`,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: tokens.text.primary,
            fontFamily: 'Inter, sans-serif', letterSpacing: '-0.005em',
            marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="box" size={14} />
            Product Queue
            <Badge tokens={tokens} tone="neutral" size="sm">{filteredProducts.length}</Badge>
          </div>
          <SearchInput
            tokens={tokens}
            value={query}
            onChange={setQuery}
            placeholder="Search by name, SKU, brand…"
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
            {(['all', 'pending', 'in_review', 'published', 'blocked'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '3px 8px', borderRadius: 6, border: 'none',
                  background: statusFilter === s ? tokens.text.primary : tokens.bg.surfaceAlt,
                  color: statusFilter === s ? tokens.bg.app : tokens.text.secondary,
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: 0.5, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'background 120ms ease, color 120ms ease',
                }}
              >
                {s === 'in_review' ? 'Review' : s === 'all' ? 'All' : s === 'pending' ? 'Pending' : s === 'published' ? 'Published' : s === 'blocked' ? 'Blocked' : s}
              </button>
            ))}
          </div>
        </div>
        <div style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }} className="lnk-product-scroll">
          {filteredProducts.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: tokens.text.tertiary }}>
              No products match the current filters.
            </div>
          ) : filteredProducts.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 14px', cursor: 'pointer',
                background: selectedId === p.id ? tokens.bg.hover : 'transparent',
                border: 'none', borderBottom: `1px solid ${tokens.border.subtle}`,
                transition: 'background 120ms ease',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => { if (selectedId !== p.id) e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={(e) => { if (selectedId !== p.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 8, marginBottom: 4,
              }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: tokens.text.primary,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  {p.name}
                </div>
                {p.lastRiskLevel && <RiskPill tokens={tokens} riskLevel={p.lastRiskLevel} size="sm" />}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 10,
                color: tokens.text.tertiary,
              }}>
                <span style={{ fontFamily: 'ui-monospace, monospace' }}>{p.sku}</span>
                <span>•</span>
                <span>{p.brand}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* MAIN PANEL — scan report                                 */}
      {/* ───────────────────────────────────────────────────────── */}
      <div style={{ minWidth: 0 }}>
        {!selectedProduct ? (
          <Panel tokens={tokens} title="No product selected">
            <div style={{ padding: 32, textAlign: 'center', color: tokens.text.tertiary, fontSize: 13 }}>
              Select a product from the queue to run a compliance scan.
            </div>
          </Panel>
        ) : (
          <>
            {/* Product header + actions */}
            <Panel tokens={tokens}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: 16, flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
                      textTransform: 'uppercase', letterSpacing: 0.6,
                    }}>
                      Compliance Scan
                    </span>
                    <Badge tokens={tokens} tone="neutral" size="sm">{selectedProduct.status.replace(/_/g, ' ')}</Badge>
                  </div>
                  <h2 style={{
                    fontSize: 18, fontWeight: 700, color: tokens.text.primary,
                    letterSpacing: '-0.015em', margin: 0, marginBottom: 4,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {selectedProduct.name}
                  </h2>
                  <div style={{
                    fontSize: 12, color: tokens.text.secondary,
                    display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                  }}>
                    <span style={{ fontFamily: 'ui-monospace, monospace' }}>{selectedProduct.sku}</span>
                    <span>•</span>
                    <span>{selectedProduct.brand}</span>
                    <span>•</span>
                    <span>{selectedProduct.category}</span>
                    <span>•</span>
                    <span>₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Button
                    tokens={tokens}
                    variant="secondary"
                    size="sm"
                    icon={<Icon name="refresh" size={13} />}
                    onClick={handleScan}
                    loading={scanning}
                  >
                    Re-scan
                  </Button>
                  <ExportMenu tokens={tokens} onExport={handleExport} disabled={!scan} />
                </div>
              </div>
            </Panel>

            {/* Scan in progress state */}
            {scanning && (
              <Panel tokens={tokens}>
                <div style={{
                  padding: 48, textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: tokens.bg.surfaceAlt,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: tokens.text.secondary,
                  }}>
                    <Icon name="spinner" size={20} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: tokens.text.primary,
                      marginBottom: 4,
                    }}>
                      Running compliance scan…
                    </div>
                    <div style={{ fontSize: 12, color: tokens.text.tertiary }}>
                      Scanning {selectedProduct.fields ? '10' : 0} fields, {selectedProduct.images.length} images, and {12} trademark rules.
                    </div>
                  </div>
                </div>
              </Panel>
            )}

            {/* Scan results */}
            {!scanning && scan && (
              <>
                {/* Score hero + recommendation */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr)',
                  gap: 12,
                  marginTop: 12,
                }}>
                  <Panel tokens={tokens}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
                    }}>
                      <RiskGauge tokens={tokens} score={scan.score} riskLevel={scan.riskLevel} size={120} />
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap',
                        }}>
                          <RiskPill tokens={tokens} riskLevel={scan.riskLevel} />
                          <span style={{
                            fontSize: 10, color: tokens.text.tertiary,
                            fontFamily: 'ui-monospace, monospace',
                          }}>
                            {scan.id}
                          </span>
                        </div>
                        <div style={{
                          fontSize: 13, color: tokens.text.primary, lineHeight: 1.55,
                          marginBottom: 12,
                        }}>
                          {scan.summary}
                        </div>
                        <div style={{
                          display: 'flex', gap: 16, fontSize: 11, color: tokens.text.secondary,
                          flexWrap: 'wrap',
                        }}>
                          <Stat label="Fields" value={scan.fieldsScanned} />
                          <Stat label="Images" value={scan.imagesScanned} />
                          <Stat label="Issues" value={scan.issues.length} />
                          <Stat label="Critical" value={scan.issues.filter(i => i.severity === 'critical').length} />
                          <Stat label="Warnings" value={scan.issues.filter(i => i.severity === 'warning').length} />
                          <Stat label="Duration" value={`${scan.durationMs}ms`} />
                        </div>
                      </div>
                    </div>
                  </Panel>

                  <RecommendationBanner tokens={tokens} recommendation={scan.recommendation} />

                  {/* Next steps */}
                  {scan.nextSteps.length > 0 && (
                    <Panel tokens={tokens} title="Recommended Next Steps" subtitle="Ordered by priority — address critical issues first">
                      <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: tokens.text.primary, lineHeight: 1.7 }}>
                        {scan.nextSteps.map((s, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>{s}</li>
                        ))}
                      </ol>
                    </Panel>
                  )}
                </div>

                {/* Issues — grouped / filterable */}
                <SectionLabel tokens={tokens}>
                  Detected Issues ({scan.issues.length})
                </SectionLabel>

                {/* Category filter chips */}
                <div style={{
                  display: 'flex', gap: 6, flexWrap: 'wrap',
                  marginBottom: 12,
                }}>
                  <CategoryChip
                    tokens={tokens} active={categoryFilter === 'all'}
                    onClick={() => setCategoryFilter('all')}
                    label="All" count={scan.issues.length}
                  />
                  {(Object.keys(ISSUE_CATEGORY_META) as IssueCategory[]).map(cat => (
                    <CategoryChip
                      key={cat}
                      tokens={tokens}
                      active={categoryFilter === cat}
                      onClick={() => setCategoryFilter(cat)}
                      label={ISSUE_CATEGORY_META[cat].label}
                      count={issueCounts[cat]}
                      icon={ISSUE_CATEGORY_META[cat].icon}
                    />
                  ))}
                </div>

                {/* Issue cards */}
                {filteredIssues.length === 0 ? (
                  <Panel tokens={tokens}>
                    <div style={{
                      padding: 32, textAlign: 'center',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: tokens.status.successBg, color: tokens.status.success,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon name="checkCircle" size={20} />
                      </div>
                      <div style={{
                        fontSize: 13, fontWeight: 700, color: tokens.text.primary,
                      }}>
                        No issues in this category
                      </div>
                      <div style={{ fontSize: 12, color: tokens.text.tertiary }}>
                        All {ISSUE_CATEGORY_META[categoryFilter === 'all' ? 'trademark' : (categoryFilter as IssueCategory)].label.toLowerCase() || 'compliance'} checks passed.
                      </div>
                    </div>
                  </Panel>
                ) : (
                  <div style={{
                    display: 'grid', gap: 10,
                    gridTemplateColumns: 'minmax(0, 1fr)',
                  }}>
                    {filteredIssues.map(issue => (
                      <IssueCard key={issue.id} tokens={tokens} issue={issue} />
                    ))}
                  </div>
                )}

                {/* Publish gate */}
                <div style={{ marginTop: 16 }}>
                  <Panel tokens={tokens}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 16, flexWrap: 'wrap',
                    }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 700, color: tokens.text.primary,
                          marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                          <Icon name="lock" size={14} />
                          Publish Gate
                        </div>
                        <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.55 }}>
                          {scan.recommendation === 'publish'
                            ? 'All compliance checks passed. You can publish this product.'
                            : scan.recommendation === 'review_then_publish'
                            ? 'Review the warnings above. You can publish after acknowledging the risks, but resolving warnings is recommended.'
                            : 'This product is blocked from publishing due to critical compliance violations. Resolve all critical issues and re-run the scan to unlock publishing.'}
                        </div>
                      </div>
                      <Button
                        tokens={tokens}
                        variant={scan.recommendation === 'publish' ? 'success' : 'primary'}
                        size="md"
                        icon={<Icon name="upload" size={14} />}
                        onClick={handlePublish}
                        disabled={scan.recommendation === 'do_not_publish'}
                      >
                        {scan.recommendation === 'do_not_publish' ? 'Publishing Blocked' : 'Publish Product'}
                      </Button>
                    </div>
                  </Panel>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .lnk-product-scroll::-webkit-scrollbar { width: 6px; }
        .lnk-product-scroll::-webkit-scrollbar-track { background: transparent; }
        .lnk-product-scroll::-webkit-scrollbar-thumb { background: ${tokens.border.subtle}; border-radius: 3px; }
        .lnk-product-scroll::-webkit-scrollbar-thumb:hover { background: ${tokens.border.strong}; }
        @media (max-width: 900px) {
          .lnk-scan-studio { grid-template-columns: minmax(0, 1fr) !important; }
          .lnk-scan-studio > div:first-child { position: static !important; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
        {value}
      </div>
    </div>
  );
}

function CategoryChip({
  tokens, active, onClick, label, count, icon,
}: {
  tokens: Tk; active: boolean; onClick: () => void;
  label: string; count: number; icon?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
        background: active ? tokens.text.primary : tokens.bg.surface,
        color: active ? tokens.bg.app : tokens.text.secondary,
        border: `1px solid ${active ? tokens.text.primary : tokens.border.subtle}`,
        fontSize: 11, fontWeight: 700,
        fontFamily: 'Inter, sans-serif',
        transition: 'all 120ms ease',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = tokens.border.strong; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = tokens.border.subtle; }}
    >
      {icon && <Icon name={icon as any} size={12} />}
      {label}
      <span style={{
        background: active ? 'rgba(255,255,255,0.2)' : tokens.bg.surfaceAlt,
        padding: '0 6px', borderRadius: 4, fontSize: 10,
      }}>
        {count}
      </span>
    </button>
  );
}

function ExportMenu({ tokens, onExport, disabled }: {
  tokens: Tk;
  onExport: (format: 'pdf' | 'xlsx' | 'csv') => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <Button
        tokens={tokens}
        variant="secondary"
        size="sm"
        icon={<Icon name="download" size={13} />}
        onClick={() => setOpen(v => !v)}
        disabled={disabled}
      >
        Export
        <Icon name="chevronDown" size={12} />
      </Button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 199 }}
            onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', right: 0,
            minWidth: 180, zIndex: 200,
            background: tokens.bg.surface,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 10, boxShadow: tokens.shadow.lg,
            padding: 4, overflow: 'hidden',
            animation: 'admin-pop-in 140ms cubic-bezier(0.16,1,0.3,1)',
          }}>
            {([
              { fmt: 'pdf' as const, label: 'PDF Report', desc: 'Print-ready document', icon: 'file' as const },
              { fmt: 'xlsx' as const, label: 'Excel (.xls)', desc: 'Spreadsheet format', icon: 'grid' as const },
              { fmt: 'csv' as const, label: 'CSV', desc: 'Raw data export', icon: 'list' as const },
            ]).map(item => (
              <button
                key={item.fmt}
                onClick={() => { onExport(item.fmt); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', width: '100%', cursor: 'pointer',
                  background: 'transparent', border: 'none', borderRadius: 6,
                  color: tokens.text.primary, textAlign: 'left',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'background 100ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: tokens.bg.surfaceAlt,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: tokens.text.secondary,
                }}>
                  <Icon name={item.icon} size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
