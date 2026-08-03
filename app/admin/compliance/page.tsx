/**
 * LNKICKS Enterprise Admin — Copyright & Brand Compliance Center
 * ------------------------------------------------------------
 * Pre-publish compliance screening module.
 *
 * Mission:
 *   Help administrators identify and reduce copyright, trademark,
 *   branding, SEO and policy risks BEFORE a product is published.
 *   Encourage compliance — never bypass IP enforcement.
 *
 * Architecture:
 *   - Single-page module with internal tab navigation
 *   - Five tabs: Overview | Scan Studio | History | Trademark Registry | Settings
 *   - All data sourced from lib/admin/complianceData.ts
 *   - Detection engine in lib/admin/complianceEngine.ts (pure functions)
 *   - Export utilities in lib/admin/complianceExport.ts (CSV / XLSX / PDF)
 *
 * Hard IP-protection gate:
 *   The Scan Studio's "Publish Product" button is HARD-DISABLED when
 *   the scan returns recommendation === 'do_not_publish'. This is the
 *   active prevention mechanism — critical IP violations cannot be
 *   published until resolved and re-scanned.
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { Badge } from '@/components/admin/ui';
import { Icon } from '@/components/admin/icons/Icon';
import {
  getComplianceProducts,
  getComplianceHistory,
  getComplianceScoreTrend,
  getTrademarkRegistry,
} from '@/lib/admin/complianceData';
import { ScanStudio } from './_components/ScanStudio';
import {
  OverviewView, HistoryView, TrademarkRegistryView, SettingsView,
} from './_components/Views';

type Tab = 'overview' | 'scan_studio' | 'history' | 'registry' | 'settings';

export default function ComplianceCenterPage() {
  const { tokens } = useAdminTheme();
  const [tab, setTab] = useState<Tab>('overview');
  const [scanProductId, setScanProductId] = useState<string | undefined>(undefined);

  // Data — sourced once on mount (deterministic mock data)
  const products = useMemo(() => getComplianceProducts(), []);
  const history = useMemo(() => getComplianceHistory(), []);
  const trend = useMemo(() => getComplianceScoreTrend(), []);
  const registry = useMemo(() => getTrademarkRegistry(), []);

  // Selecting a product from overview should switch to scan studio
  function handleSelectProduct(id: string) {
    if (id) {
      setScanProductId(id);
      setTab('scan_studio');
    }
  }

  // Tab definition
  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: 'grid' as const },
    { key: 'scan_studio' as const, label: 'Scan Studio', icon: 'search' as const },
    { key: 'history' as const, label: 'History', icon: 'history' as const },
    { key: 'registry' as const, label: 'Trademark Registry', icon: 'shield' as const },
    { key: 'settings' as const, label: 'Settings', icon: 'settings' as const },
  ];

  // Pending count badge for Scan Studio tab
  const pendingCount = products.filter(p => p.status === 'pending_publish' || p.status === 'in_review').length;

  return (
    <AdminLayout
      title="Copyright & Brand Compliance Center"
      subtitle="Pre-publish IP, trademark & policy screening"
      breadcrumb={[
        { label: 'Admin', href: '/dashboard' },
        { label: 'Compliance Center' },
      ]}
    >
      <div className="lnk-compliance-root" style={{ minWidth: 0, overflowX: 'hidden' }}>

        {/* ─────────────────────────────────────────────────────── */}
        {/* HERO — mission statement                                */}
        {/* ─────────────────────────────────────────────────────── */}
        <div style={{
          background: tokens.bg.surface,
          border: `1px solid ${tokens.border.subtle}`,
          borderRadius: 14,
          padding: '20px 24px',
          marginBottom: 16,
          boxShadow: tokens.shadow.sm,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative shield watermark */}
          <div style={{
            position: 'absolute', right: -20, top: -10,
            color: tokens.border.subtle, opacity: 0.5,
            pointerEvents: 'none',
          }}>
            <Icon name="shield" size={140} />
          </div>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            position: 'relative',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11, flexShrink: 0,
              background: tokens.text.primary, color: tokens.bg.app,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="shield" size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap',
              }}>
                <h1 style={{
                  fontSize: 18, fontWeight: 700, color: tokens.text.primary,
                  letterSpacing: '-0.015em', margin: 0,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  Copyright &amp; Brand Compliance Center
                </h1>
                <Badge tokens={tokens} tone="success" dot>Active</Badge>
              </div>
              <p style={{
                fontSize: 13, color: tokens.text.secondary, lineHeight: 1.6,
                margin: 0, maxWidth: 760,
              }}>
                Identify and reduce copyright, trademark, branding, SEO, and policy risks
                <strong style={{ color: tokens.text.primary }}> before publishing</strong>. Every
                product is scanned across 10 fields and 5 categories — trademarks, images, SEO,
                content quality, and policy. Critical violations hard-block publication until
                resolved. This tool encourages compliance and does not bypass IP enforcement.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────── */}
        {/* TAB NAVIGATION                                          */}
        {/* ─────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          borderBottom: `1px solid ${tokens.border.subtle}`,
          marginBottom: 16, overflowX: 'auto',
        }} className="lnk-compliance-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              role="tab"
              aria-selected={tab === t.key}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 14px', cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t.key ? `2px solid ${tokens.text.primary}` : '2px solid transparent',
                color: tab === t.key ? tokens.text.primary : tokens.text.secondary,
                fontSize: 13, fontWeight: tab === t.key ? 700 : 600,
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
                transition: 'color 120ms ease, border-color 160ms ease',
                marginBottom: -1,
              }}
              onMouseEnter={(e) => { if (tab !== t.key) e.currentTarget.style.color = tokens.text.primary; }}
              onMouseLeave={(e) => { if (tab !== t.key) e.currentTarget.style.color = tokens.text.secondary; }}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
              {t.key === 'scan_studio' && pendingCount > 0 && (
                <Badge tokens={tokens} tone="warning" size="sm">{pendingCount}</Badge>
              )}
            </button>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────── */}
        {/* TAB CONTENT                                             */}
        {/* ─────────────────────────────────────────────────────── */}
        <div role="tabpanel">
          {tab === 'overview' && (
            <OverviewView
              tokens={tokens}
              products={products}
              history={history}
              trend={trend}
              onSelectProduct={handleSelectProduct}
            />
          )}
          {tab === 'scan_studio' && (
            <ScanStudio
              tokens={tokens}
              products={products}
              initialProductId={scanProductId}
              onProductPublished={() => { /* could refresh state */ }}
            />
          )}
          {tab === 'history' && (
            <HistoryView tokens={tokens} history={history} />
          )}
          {tab === 'registry' && (
            <TrademarkRegistryView tokens={tokens} registry={registry} />
          )}
          {tab === 'settings' && (
            <SettingsView tokens={tokens} />
          )}
        </div>
      </div>

      <style jsx>{`
        .lnk-compliance-tabs::-webkit-scrollbar { height: 4px; }
        .lnk-compliance-tabs::-webkit-scrollbar-track { background: transparent; }
        .lnk-compliance-tabs::-webkit-scrollbar-thumb { background: ${tokens.border.subtle}; border-radius: 2px; }
      `}</style>
    </AdminLayout>
  );
}
