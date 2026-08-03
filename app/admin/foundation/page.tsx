/**
 * LNKICKS Enterprise Admin — Design System Foundation Showcase
 * ------------------------------------------------------------
 * Storybook-style visual reference for the entire admin design
 * system. Every future admin page should inherit tokens &
 * primitives demonstrated here.
 *
 * Sections:
 *  1. Color palette (primary / accent / status / purple)
 *  2. Typography scale (display → micro)
 *  3. Spacing & radius scales
 *  4. Elevation scale (shadows)
 *  5. Icon library (60+ icons)
 *  6. Buttons (variants × sizes × states)
 *  7. Badges, Tags, Pills
 *  8. Inputs (text, select, textarea, checkbox, toggle, radio)
 *  9. Cards, Panels, Section
 * 10. Tabs (pill + underline), SegmentedControl, Stepper
 * 11. Modal, Drawer, ConfirmDialog
 * 12. Tooltip, Dropdown, Menu
 * 13. Toast (live demo)
 * 14. Table primitives (Th, Td, sortable headers)
 * 15. EmptyState, ErrorState, SuccessState, Skeleton
 * 16. Progress (bar + ring), Avatar, AvatarGroup
 * 17. Breadcrumb, Pagination, Kbd
 * 18. FilterPanel, FileUpload, NumberInput
 * 19. Layout primitives (Container, Stack, Inline, Grid)
 *
 * Access:
 *   Requires admin login (AdminLayout enforces auth).
 *   Visit /admin/foundation after logging in at /admin-login.
 */

'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Button, IconButton, ButtonGroup, Badge, StatusPill, Tag,
  Input, Textarea, Select, Checkbox, Toggle, Radio, SearchInput, NumberInput,
  Card, Panel, PanelHeader, Section,
  Tabs, TabsBar, SegmentedControl, Stepper,
  Modal, ConfirmDialog, DrawerA11y,
  Dropdown, MenuItem, MenuDivider,
  Tooltip, EmptyState, ErrorState, SuccessState, Skeleton,
  Breadcrumb, Pagination, ProgressBar, ProgressRing,
  Avatar, AvatarGroup, KeyValue, Stat, StatGrid, DescriptionList,
  Stack, Inline, Grid,
  Code, Kbd, ChevronIcon,
  TableWrap, Th, Td,
  FilterPanel, FileUpload,
  ToastProvider, useToast,
} from '@/components/admin/ui';
import { Icon, ALL_ICON_NAMES, type IconName } from '@/components/admin/icons/Icon';
import { dt } from '@/lib/admin/designTokens';
import { useAdminTheme } from '@/lib/admin/adminTheme';

/* =========================================================== */
/* Section wrapper                                             */
/* =========================================================== */
function ShowSection({
  tokens, id, title, description, children,
}: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  id: string; title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ scrollMarginTop: 80 }}>
      <Section
        tokens={tokens}
        title={title}
        description={description}
        action={<Badge tokens={tokens} tone="neutral">{id}</Badge>}
      >
        <Card tokens={tokens} style={{ padding: 20 }}>
          {children}
        </Card>
      </Section>
    </section>
  );
}

/* Sub-section label */
function SubLabel({ tokens, children }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
      textTransform: 'uppercase', letterSpacing: 0.8,
      fontFamily: 'Inter, sans-serif', marginBottom: 8,
    }}>{children}</div>
  );
}

/* Swatch for color tokens */
function Swatch({ label, color, tokens }: { label: string; color: string; tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{
        height: 56, borderRadius: dt.radius.md,
        background: color,
        border: `1px solid ${tokens.border.subtle}`,
      }} />
      <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
        {label}
      </div>
      <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace' }}>
        {color}
      </div>
    </div>
  );
}

/* =========================================================== */
/* Main page                                                    */
/* =========================================================== */
export default function FoundationPage() {
  const { tokens, mode, resolvedMode, setMode } = useAdminTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tabValue, setTabValue] = useState('overview');
  const [tabsBarValue, setTabsBarValue] = useState('all');
  const [segmented, setSegmented] = useState<'list' | 'grid' | 'kanban'>('list');
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [toggleVal, setToggleVal] = useState(false);
  const [radioVal, setRadioVal] = useState('option-a');
  const [numVal, setNumVal] = useState(5);
  const [searchVal, setSearchVal] = useState('');
  const [page, setPage] = useState(2);
  const [progress, setProgress] = useState(65);

  return (
    <AdminLayout
      title="Design System Foundation"
      subtitle="Tokens, primitives, and icons — the single source of truth"
      breadcrumb={[
        { label: 'Admin', href: '/dashboard' },
        { label: 'Foundation' },
      ]}
    >
      <ToastProvider tokens={tokens}>
        <FoundationContent
          tokens={tokens}
          mode={mode}
          resolvedMode={resolvedMode}
          setMode={setMode}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          confirmOpen={confirmOpen}
          setConfirmOpen={setConfirmOpen}
          tabValue={tabValue}
          setTabValue={setTabValue}
          tabsBarValue={tabsBarValue}
          setTabsBarValue={setTabsBarValue}
          segmented={segmented}
          setSegmented={setSegmented}
          checkboxVal={checkboxVal}
          setCheckboxVal={setCheckboxVal}
          toggleVal={toggleVal}
          setToggleVal={setToggleVal}
          radioVal={radioVal}
          setRadioVal={setRadioVal}
          numVal={numVal}
          setNumVal={setNumVal}
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          page={page}
          setPage={setPage}
          progress={progress}
          setProgress={setProgress}
        />
      </ToastProvider>
    </AdminLayout>
  );
}

/* =========================================================== */
/* Inner content — receives all state as props                  */
/* =========================================================== */
function FoundationContent({
  tokens, mode, resolvedMode, setMode,
  modalOpen, setModalOpen,
  drawerOpen, setDrawerOpen,
  confirmOpen, setConfirmOpen,
  tabValue, setTabValue,
  tabsBarValue, setTabsBarValue,
  segmented, setSegmented,
  checkboxVal, setCheckboxVal,
  toggleVal, setToggleVal,
  radioVal, setRadioVal,
  numVal, setNumVal,
  searchVal, setSearchVal,
  page, setPage,
  progress, setProgress,
}: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  mode: 'light' | 'dark' | 'system';
  resolvedMode: 'light' | 'dark';
  setMode: (m: 'light' | 'dark' | 'system') => void;
  modalOpen: boolean; setModalOpen: (v: boolean) => void;
  drawerOpen: boolean; setDrawerOpen: (v: boolean) => void;
  confirmOpen: boolean; setConfirmOpen: (v: boolean) => void;
  tabValue: string; setTabValue: (v: string) => void;
  tabsBarValue: string; setTabsBarValue: (v: string) => void;
  segmented: 'list' | 'grid' | 'kanban'; setSegmented: (v: 'list' | 'grid' | 'kanban') => void;
  checkboxVal: boolean; setCheckboxVal: (v: boolean) => void;
  toggleVal: boolean; setToggleVal: (v: boolean) => void;
  radioVal: string; setRadioVal: (v: string) => void;
  numVal: number; setNumVal: (v: number) => void;
  searchVal: string; setSearchVal: (v: string) => void;
  page: number; setPage: (v: number) => void;
  progress: number; setProgress: (v: number) => void;
}) {
  return (
    <Stack gap={32}>
      <style jsx>{`
        .lnk-foundation-nav {
          position: sticky; top: 64px; z-index: ${dt.zIndex.sticky};
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: ${dt.radius.lg}px;
          padding: 8px;
          display: flex; gap: 4px; overflow-x: auto;
          box-shadow: ${tokens.shadow.sm};
        }
        .lnk-foundation-nav a {
          padding: 6px 10px; border-radius: ${dt.radius.sm}px;
          font-size: 11px; font-weight: 600; font-family: 'Inter, sans-serif';
          color: ${tokens.text.secondary}; text-decoration: none;
          white-space: nowrap; transition: all 100ms ease;
        }
        .lnk-foundation-nav a:hover {
          background: ${tokens.bg.hover}; color: ${tokens.text.primary};
        }
      `}</style>

      {/* ── Intro / theme controls ─────────────────────────── */}
      <Card tokens={tokens} style={{ padding: 24 }}>
        <Inline gap={16} align="center" wrap>
          <div style={{ width: 48, height: 48, borderRadius: dt.radius.lg, background: tokens.text.primary, color: tokens.bg.app, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="sparkles" size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
              Enterprise Design System Foundation
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: tokens.text.secondary, fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
              The single source of truth for spacing, typography, color, icons, and primitives.
              Every future admin page inherits this foundation automatically.
            </p>
          </div>
          <Inline gap={8}>
            <SegmentedControl
              tokens={tokens}
              size="sm"
              value={mode}
              onChange={v => setMode(v as 'light' | 'dark' | 'system')}
              segments={[
                { value: 'light', label: 'Light', icon: <Icon name="sun" size={12} /> },
                { value: 'dark', label: 'Dark', icon: <Icon name="moon" size={12} /> },
                { value: 'system', label: 'Auto', icon: <Icon name="monitor" size={12} /> },
              ]}
            />
          </Inline>
        </Inline>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${tokens.border.subtle}` }}>
          <Inline gap={12} wrap>
            <KeyValue tokens={tokens} label="Resolved mode" value={resolvedMode} />
            <KeyValue tokens={tokens} label="Spacing scale" value="8pt grid" />
            <KeyValue tokens={tokens} label="Typography ratio" value="1.125 (Major Second)" mono />
            <KeyValue tokens={tokens} label="Radius steps" value="6 / 8 / 12 / 16 / 20 / 24" mono />
            <KeyValue tokens={tokens} label="Elevation steps" value="xs / sm / md / lg / xl" mono />
            <KeyValue tokens={tokens} label="Icon count" value={`${ALL_ICON_NAMES.length}+`} />
          </Inline>
        </div>
      </Card>

      {/* ── Section nav ────────────────────────────────────── */}
      <nav className="lnk-foundation-nav">
        <a href="#colors">Colors</a>
        <a href="#typography">Typography</a>
        <a href="#spacing">Spacing &amp; Radius</a>
        <a href="#elevation">Elevation</a>
        <a href="#icons">Icons</a>
        <a href="#buttons">Buttons</a>
        <a href="#badges">Badges &amp; Tags</a>
        <a href="#inputs">Inputs</a>
        <a href="#cards">Cards &amp; Panels</a>
        <a href="#tabs">Tabs &amp; Stepper</a>
        <a href="#overlays">Modal &amp; Drawer</a>
        <a href="#dropdown">Dropdown &amp; Tooltip</a>
        <a href="#toast">Toast</a>
        <a href="#table">Table</a>
        <a href="#states">States</a>
        <a href="#progress">Progress &amp; Avatar</a>
        <a href="#nav">Breadcrumb &amp; Pagination</a>
        <a href="#layout">Layout</a>
      </nav>

      {/* ── 1. COLORS ──────────────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="colors"
        title="Color Palette"
        description="Semantic roles — primary ink, accent blue, status colors. Calm, premium, never neon."
      >
        <Stack gap={20}>
          <div>
            <SubLabel tokens={tokens}>Primary (premium ink)</SubLabel>
            <Grid cols={6} gap={8} minColWidth={100}>
              {Object.entries(dt.colorPalette.primary).slice(0, 11).map(([k, v]) => (
                <Swatch key={k} tokens={tokens} label={`primary.${k}`} color={v} />
              ))}
            </Grid>
          </div>
          <div>
            <SubLabel tokens={tokens}>Accent (focus / links)</SubLabel>
            <Grid cols={6} gap={8} minColWidth={100}>
              {Object.entries(dt.colorPalette.accent).slice(0, 10).map(([k, v]) => (
                <Swatch key={k} tokens={tokens} label={`accent.${k}`} color={v} />
              ))}
            </Grid>
          </div>
          <div>
            <SubLabel tokens={tokens}>Status</SubLabel>
            <Grid cols={5} gap={8} minColWidth={120}>
              <Swatch tokens={tokens} label="success" color={tokens.status.success} />
              <Swatch tokens={tokens} label="warning" color={tokens.status.warning} />
              <Swatch tokens={tokens} label="error" color={tokens.status.error} />
              <Swatch tokens={tokens} label="info" color={tokens.status.info} />
              <Swatch tokens={tokens} label="purple" color={dt.colorPalette.purple[500]} />
            </Grid>
          </div>
          <div>
            <SubLabel tokens={tokens}>Surfaces</SubLabel>
            <Grid cols={4} gap={8} minColWidth={120}>
              <Swatch tokens={tokens} label="bg.app" color={tokens.bg.app} />
              <Swatch tokens={tokens} label="bg.surface" color={tokens.bg.surface} />
              <Swatch tokens={tokens} label="bg.surfaceAlt" color={tokens.bg.surfaceAlt} />
              <Swatch tokens={tokens} label="bg.hover" color={tokens.bg.hover} />
              <Swatch tokens={tokens} label="text.primary" color={tokens.text.primary} />
              <Swatch tokens={tokens} label="text.secondary" color={tokens.text.secondary} />
              <Swatch tokens={tokens} label="text.tertiary" color={tokens.text.tertiary} />
              <Swatch tokens={tokens} label="border.subtle" color={tokens.border.subtle} />
            </Grid>
          </div>
        </Stack>
      </ShowSection>

      {/* ── 2. TYPOGRAPHY ──────────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="typography"
        title="Typography Scale"
        description="Modular scale (1.125 ratio). Inter for sans, system mono for code. Use these roles — never hardcode sizes."
      >
        <Stack gap={12}>
          {Object.entries(dt.typography).map(([key, style]) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'baseline', gap: 16,
              padding: '8px 0', borderBottom: `1px solid ${tokens.border.subtle}`,
            }}>
              <div style={{
                width: 90, flexShrink: 0,
                fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
                textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Inter, sans-serif',
              }}>{key}</div>
              <div style={{
                fontSize: style.fontSize,
                lineHeight: style.lineHeight,
                fontWeight: style.fontWeight,
                letterSpacing: style.letterSpacing,
                textTransform: (style as { textTransform?: string }).textTransform ?? 'none',
                color: tokens.text.primary,
                fontFamily: (style as { fontFamily?: string }).fontFamily ?? 'Inter, sans-serif',
                flex: 1,
              }}>
                The quick brown fox jumps over the lazy dog
              </div>
              <div style={{
                fontSize: 10, color: tokens.text.tertiary,
                fontFamily: 'ui-monospace, monospace', flexShrink: 0,
              }}>
                {style.fontSize}px / {style.fontWeight}
              </div>
            </div>
          ))}
        </Stack>
      </ShowSection>

      {/* ── 3. SPACING & RADIUS ────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="spacing"
        title="Spacing & Radius"
        description="8-point grid for all spacing. Six-step radius scale. Use these tokens — never arbitrary px values."
      >
        <Stack gap={20}>
          <div>
            <SubLabel tokens={tokens}>Spacing scale (8pt grid)</SubLabel>
            <Inline gap={12} wrap align="flex-end">
              {Object.entries(dt.spacing).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: v || 2, height: 32,
                    background: tokens.text.primary, borderRadius: 2,
                    opacity: 0.85,
                  }} />
                  <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace' }}>
                    {k} ({v})
                  </div>
                </div>
              ))}
            </Inline>
          </div>
          <div>
            <SubLabel tokens={tokens}>Radius scale</SubLabel>
            <Inline gap={16} wrap align="flex-end">
              {Object.entries(dt.radius).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 64, height: 64,
                    background: tokens.bg.surfaceAlt,
                    border: `1px solid ${tokens.border.strong}`,
                    borderRadius: v,
                  }} />
                  <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace' }}>
                    {k} ({v})
                  </div>
                </div>
              ))}
            </Inline>
          </div>
        </Stack>
      </ShowSection>

      {/* ── 4. ELEVATION ───────────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="elevation"
        title="Elevation / Shadows"
        description="Five-step soft shadow scale. Layered ambient + key light — never harsh single shadows."
      >
        <Inline gap={20} wrap>
          {(Object.entries(dt.elevation) as [string, string][]).map(([k, v]) => (
            <div key={k} style={{
              width: 120, height: 80,
              background: tokens.bg.surface,
              borderRadius: dt.radius.lg,
              boxShadow: v,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, color: tokens.text.secondary,
              fontFamily: 'Inter, sans-serif',
            }}>{k}</div>
          ))}
        </Inline>
      </ShowSection>

      {/* ── 5. ICONS ───────────────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="icons"
        title={`Icon Library (${ALL_ICON_NAMES.length} icons)`}
        description="One icon family. 24×24 viewBox, 1.75 stroke, round caps. Consistent sizing across the entire admin."
      >
        <Grid cols={10} gap={8} minColWidth={64}>
          {ALL_ICON_NAMES.map(name => (
            <Tooltip key={name} tokens={tokens} content={name} side="top">
              <div style={{
                width: 48, height: 48, borderRadius: dt.radius.md,
                background: tokens.bg.surfaceAlt,
                border: `1px solid ${tokens.border.subtle}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: tokens.text.secondary, cursor: 'help',
                transition: `all ${dt.motion.duration.quick}ms ${dt.motion.easing.standard}`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = tokens.bg.surface;
                  e.currentTarget.style.color = tokens.text.primary;
                  e.currentTarget.style.borderColor = tokens.border.strong;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = tokens.bg.surfaceAlt;
                  e.currentTarget.style.color = tokens.text.secondary;
                  e.currentTarget.style.borderColor = tokens.border.subtle;
                }}
              >
                <Icon name={name as IconName} size={18} />
              </div>
            </Tooltip>
          ))}
        </Grid>
      </ShowSection>

      {/* ── 6. BUTTONS ─────────────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="buttons"
        title="Buttons"
        description="Six variants × three sizes. Loading, disabled, icon-leading, icon-trailing, full-width."
      >
        <Stack gap={20}>
          <div>
            <SubLabel tokens={tokens}>Variants (md)</SubLabel>
            <Inline gap={8} wrap>
              <Button tokens={tokens} variant="primary">Primary</Button>
              <Button tokens={tokens} variant="secondary">Secondary</Button>
              <Button tokens={tokens} variant="outline">Outline</Button>
              <Button tokens={tokens} variant="ghost">Ghost</Button>
              <Button tokens={tokens} variant="danger">Danger</Button>
              <Button tokens={tokens} variant="success">Success</Button>
            </Inline>
          </div>
          <div>
            <SubLabel tokens={tokens}>Sizes</SubLabel>
            <Inline gap={8} wrap align="center">
              <Button tokens={tokens} size="sm">Small</Button>
              <Button tokens={tokens} size="md">Medium</Button>
              <Button tokens={tokens} size="lg">Large</Button>
            </Inline>
          </div>
          <div>
            <SubLabel tokens={tokens}>With icons</SubLabel>
            <Inline gap={8} wrap>
              <Button tokens={tokens} icon={<Icon name="plus" size={14} />}>New product</Button>
              <Button tokens={tokens} variant="secondary" icon={<Icon name="download" size={14} />}>Export</Button>
              <Button tokens={tokens} variant="outline" iconRight={<Icon name="arrowRight" size={14} />}>Continue</Button>
              <Button tokens={tokens} variant="ghost" icon={<Icon name="refresh" size={14} />}>Refresh</Button>
              <Button tokens={tokens} variant="danger" icon={<Icon name="trash" size={14} />}>Delete</Button>
            </Inline>
          </div>
          <div>
            <SubLabel tokens={tokens}>States</SubLabel>
            <Inline gap={8} wrap>
              <Button tokens={tokens} loading>Loading</Button>
              <Button tokens={tokens} disabled>Disabled</Button>
              <Button tokens={tokens} variant="secondary" loading>Saving…</Button>
              <Button tokens={tokens} variant="danger" disabled>Disabled danger</Button>
            </Inline>
          </div>
          <div>
            <SubLabel tokens={tokens}>IconButton + ButtonGroup</SubLabel>
            <Inline gap={12} wrap align="center">
              <IconButton tokens={tokens} icon={<Icon name="search" size={14} />} label="Search" />
              <IconButton tokens={tokens} icon={<Icon name="settings" size={14} />} label="Settings" variant="outline" />
              <IconButton tokens={tokens} icon={<Icon name="bell" size={14} />} label="Notifications" variant="solid" />
              <ButtonGroup tokens={tokens}>
                <Button tokens={tokens} variant="ghost" size="sm">Day</Button>
                <Button tokens={tokens} variant="ghost" size="sm">Week</Button>
                <Button tokens={tokens} variant="ghost" size="sm">Month</Button>
              </ButtonGroup>
            </Inline>
          </div>
        </Stack>
      </ShowSection>

      {/* ── 7. BADGES & TAGS ───────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="badges"
        title="Badges, Status Pills, Tags"
        description="Six badge tones with optional dot. StatusPill auto-derives tone from status text. Tags are removable chips."
      >
        <Stack gap={16}>
          <div>
            <SubLabel tokens={tokens}>Badge tones</SubLabel>
            <Inline gap={8} wrap>
              <Badge tokens={tokens} tone="neutral">Neutral</Badge>
              <Badge tokens={tokens} tone="info">Info</Badge>
              <Badge tokens={tokens} tone="success">Success</Badge>
              <Badge tokens={tokens} tone="warning">Warning</Badge>
              <Badge tokens={tokens} tone="critical">Critical</Badge>
              <Badge tokens={tokens} tone="purple">Purple</Badge>
            </Inline>
          </div>
          <div>
            <SubLabel tokens={tokens}>With dot</SubLabel>
            <Inline gap={8} wrap>
              <Badge tokens={tokens} tone="success" dot>Active</Badge>
              <Badge tokens={tokens} tone="warning" dot>Pending</Badge>
              <Badge tokens={tokens} tone="critical" dot>Failed</Badge>
              <Badge tokens={tokens} tone="info" dot>Info</Badge>
            </Inline>
          </div>
          <div>
            <SubLabel tokens={tokens}>Status pills (auto-derived)</SubLabel>
            <Inline gap={8} wrap>
              <StatusPill tokens={tokens} status="Delivered" />
              <StatusPill tokens={tokens} status="Processing" />
              <StatusPill tokens={tokens} status="Cancelled" />
              <StatusPill tokens={tokens} status="Confirmed" />
              <StatusPill tokens={tokens} status="Out of Stock" />
              <StatusPill tokens={tokens} status="Published" />
              <StatusPill tokens={tokens} status="Draft" />
              <StatusPill tokens={tokens} status="Refunded" />
            </Inline>
          </div>
          <div>
            <SubLabel tokens={tokens}>Tags (removable)</SubLabel>
            <Inline gap={8} wrap>
              <Tag tokens={tokens}>Sneakers</Tag>
              <Tag tokens={tokens} tone="info" icon={<Icon name="tag" size={10} />}>Running</Tag>
              <Tag tokens={tokens} tone="success" onRemove={() => {}}>Active</Tag>
              <Tag tokens={tokens} tone="warning" onRemove={() => {}}>Sale</Tag>
              <Tag tokens={tokens} tone="critical" onRemove={() => {}}>Removed</Tag>
            </Inline>
          </div>
        </Stack>
      </ShowSection>

      {/* ── 8. INPUTS ──────────────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="inputs"
        title="Form Inputs"
        description="Text, textarea, select, checkbox, toggle, radio, number, search — all theme-aware and accessible."
      >
        <Stack gap={16}>
          <Grid cols={2} gap={16} minColWidth={240}>
            <Input
              tokens={tokens}
              label="Product name"
              placeholder="Air Jordan 1 Retro High"
              hint="Shown to customers in product listing"
              icon={<Icon name="shirt" size={14} />}
            />
            <Input
              tokens={tokens}
              label="SKU"
              placeholder="LNK-AJ1-001"
              error="SKU already exists in catalog"
            />
            <Select
              tokens={tokens}
              label="Category"
              defaultValue="sneakers"
              options={[
                { value: 'sneakers', label: 'Sneakers' },
                { value: 'apparel', label: 'Apparel' },
                { value: 'accessories', label: 'Accessories' },
              ]}
            />
            <Select
              tokens={tokens}
              label="Brand"
              defaultValue="nike"
              options={[
                { value: 'nike', label: 'Nike' },
                { value: 'adidas', label: 'Adidas' },
                { value: 'jordan', label: 'Jordan' },
                { value: 'yeezy', label: 'Yeezy' },
              ]}
            />
          </Grid>
          <Textarea
            tokens={tokens}
            label="Description"
            placeholder="Premium leather upper with rubber outsole…"
            hint="Markdown supported. Max 2000 characters."
            rows={3}
          />
          <div>
            <SubLabel tokens={tokens}>Checkbox / Toggle / Radio / Number / Search</SubLabel>
            <Inline gap={24} wrap align="center">
              <Checkbox tokens={tokens} label="Free shipping" checked={checkboxVal} onChange={setCheckboxVal} />
              <Checkbox tokens={tokens} label="Indeterminate" checked={false} indeterminate onChange={() => {}} />
              <Toggle tokens={tokens} checked={toggleVal} onChange={setToggleVal} label="Featured" />
              <Stack gap={6}>
                <Radio tokens={tokens} label="Option A" value="option-a" checked={radioVal === 'option-a'} onChange={setRadioVal} />
                <Radio tokens={tokens} label="Option B" value="option-b" checked={radioVal === 'option-b'} onChange={setRadioVal} />
              </Stack>
              <NumberInput tokens={tokens} value={numVal} onChange={setNumVal} min={0} max={99} suffix="qty" />
              <SearchInput tokens={tokens} value={searchVal} onChange={setSearchVal} placeholder="Search products…" />
            </Inline>
          </div>
        </Stack>
      </ShowSection>

      {/* ── 9. CARDS & PANELS ──────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="cards"
        title="Cards, Panels & Sections"
        description="Surface containers — Card (basic), Panel (with header), Section (page-level grouping)."
      >
        <Stack gap={16}>
          <Grid cols={3} gap={12} minColWidth={240}>
            <Card tokens={tokens} hover style={{ padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Inter, sans-serif' }}>Card (hoverable)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: tokens.text.primary, marginTop: 4, fontFamily: 'Inter, sans-serif' }}>₹2,84,560</div>
              <div style={{ fontSize: 11, color: tokens.status.success, marginTop: 2, fontFamily: 'Inter, sans-serif' }}>↑ 12.4% vs last week</div>
            </Card>
            <Panel
              tokens={tokens}
              title="Panel with accent"
              subtitle="Compact data display"
              accent="info"
              icon={<Icon name="chart" size={14} color={tokens.text.secondary} />}
            >
              <div style={{ fontSize: 12, color: tokens.text.secondary, fontFamily: 'Inter, sans-serif' }}>
                Panel body content goes here.
              </div>
            </Panel>
            <Card tokens={tokens} style={{ padding: 0, overflow: 'hidden' }}>
              <PanelHeader
                tokens={tokens}
                title="Standalone header"
                subtitle="Using PanelHeader"
                accent="purple"
                icon={<Icon name="star" size={14} color={tokens.text.secondary} />}
                action={<IconButton tokens={tokens} icon={<Icon name="moreHorizontal" size={14} />} label="More" />}
              />
              <div style={{ padding: 14, fontSize: 12, color: tokens.text.secondary, fontFamily: 'Inter, sans-serif' }}>
                Body content with header on top.
              </div>
            </Card>
          </Grid>
          <StatGrid cols={4}>
            <Stat tokens={tokens} label="Revenue" value="₹4.2L" delta={12.4} deltaLabel="vs last month" tone="positive" icon={<Icon name="rupee" size={12} />} />
            <Stat tokens={tokens} label="Orders" value="1,284" delta={-3.2} deltaLabel="vs last month" tone="negative" icon={<Icon name="cart" size={12} />} />
            <Stat tokens={tokens} label="Customers" value="892" delta={5.1} deltaLabel="vs last month" tone="positive" icon={<Icon name="users" size={12} />} />
            <Stat tokens={tokens} label="Conversion" value="3.4%" delta={0.2} deltaLabel="vs last month" tone="positive" icon={<Icon name="trendingUp" size={12} />} />
          </StatGrid>
        </Stack>
      </ShowSection>

      {/* ── 10. TABS & STEPPER ─────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="tabs"
        title="Tabs, SegmentedControl, Stepper"
        description="Three navigation patterns — pill tabs (compact), underline tabs (page-level), segmented control (iOS), stepper (multi-step flow)."
      >
        <Stack gap={20}>
          <div>
            <SubLabel tokens={tokens}>Tabs (pill style)</SubLabel>
            <Tabs
              tokens={tokens}
              active={tabValue}
              onChange={setTabValue}
              tabs={[
                { key: 'overview', label: 'Overview' },
                { key: 'analytics', label: 'Analytics', badge: 12 },
                { key: 'reports', label: 'Reports' },
                { key: 'settings', label: 'Settings' },
              ]}
            />
          </div>
          <div>
            <SubLabel tokens={tokens}>TabsBar (underline style)</SubLabel>
            <TabsBar
              tokens={tokens}
              value={tabsBarValue}
              onChange={setTabsBarValue}
              tabs={[
                { value: 'all', label: 'All', badge: 248 },
                { value: 'active', label: 'Active', badge: 192 },
                { value: 'draft', label: 'Draft', badge: 41 },
                { value: 'archived', label: 'Archived', badge: 15 },
              ]}
            />
          </div>
          <div>
            <SubLabel tokens={tokens}>SegmentedControl</SubLabel>
            <SegmentedControl
              tokens={tokens}
              value={segmented}
              onChange={v => setSegmented(v as 'list' | 'grid' | 'kanban')}
              segments={[
                { value: 'list', label: 'List', icon: <Icon name="list" size={12} /> },
                { value: 'grid', label: 'Grid', icon: <Icon name="grid" size={12} /> },
                { value: 'kanban', label: 'Kanban', icon: <Icon name="kanban" size={12} /> },
              ]}
            />
          </div>
          <div>
            <SubLabel tokens={tokens}>Stepper</SubLabel>
            <div style={{ maxWidth: 600 }}>
              <Stepper
                tokens={tokens}
                current={2}
                steps={[
                  { label: 'Cart', description: 'Items added' },
                  { label: 'Shipping', description: 'Address' },
                  { label: 'Payment', description: 'In progress' },
                  { label: 'Confirm', description: 'Review' },
                ]}
              />
            </div>
          </div>
        </Stack>
      </ShowSection>

      {/* ── 11. MODAL & DRAWER ─────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="overlays"
        title="Modal, Drawer, ConfirmDialog"
        description="Overlay surfaces with backdrop blur, focus trap, ESC to close, body scroll lock."
      >
        <Inline gap={8} wrap>
          <Button tokens={tokens} variant="secondary" onClick={() => setModalOpen(true)} icon={<Icon name="expand" size={14} />}>
            Open Modal
          </Button>
          <Button tokens={tokens} variant="secondary" onClick={() => setDrawerOpen(true)} icon={<Icon name="sidebar" size={14} />}>
            Open Drawer (a11y)
          </Button>
          <Button tokens={tokens} variant="danger" onClick={() => setConfirmOpen(true)} icon={<Icon name="alertTriangle" size={14} />}>
            Confirm Delete
          </Button>
        </Inline>

        <Modal
          tokens={tokens}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Edit product"
          subtitle="Changes will be visible to customers immediately"
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button tokens={tokens} onClick={() => setModalOpen(false)}>Save changes</Button>
            </>
          }
        >
          <Stack gap={12}>
            <Input tokens={tokens} label="Product name" placeholder="Air Jordan 1" />
            <Input tokens={tokens} label="Price" placeholder="₹12,999" icon={<Icon name="rupee" size={14} />} />
            <Select tokens={tokens} label="Category" options={[
              { value: 'sneakers', label: 'Sneakers' },
              { value: 'apparel', label: 'Apparel' },
            ]} />
            <Textarea tokens={tokens} label="Description" placeholder="…" rows={3} />
          </Stack>
        </Modal>

        <DrawerA11y
          tokens={tokens}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Order #LNK-2841"
          subtitle="Customer: Arjun Mehta"
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setDrawerOpen(false)}>Close</Button>
              <Button tokens={tokens} onClick={() => setDrawerOpen(false)}>Mark as shipped</Button>
            </>
          }
        >
          <DescriptionList
            tokens={tokens}
            items={[
              { label: 'Order ID', value: '#LNK-2841', mono: true },
              { label: 'Placed', value: 'Aug 3, 2026 — 14:32 IST' },
              { label: 'Total', value: '₹18,990' },
              { label: 'Items', value: '2 products' },
              { label: 'Payment', value: 'UPI · Paid' },
              { label: 'Shipping', value: 'Delhi → Mumbai' },
            ]}
          />
        </DrawerA11y>

        <ConfirmDialog
          tokens={tokens}
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => { setConfirmOpen(false); }}
          title="Delete product?"
          message="This will permanently remove the product from your catalog. This action cannot be undone."
          confirmLabel="Delete permanently"
          danger
        />
      </ShowSection>

      {/* ── 12. DROPDOWN & TOOLTIP ─────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="dropdown"
        title="Dropdown, Menu, Tooltip"
        description="Click-to-open dropdown menu with keyboard support. Hover/focus tooltip with 4 sides."
      >
        <Inline gap={16} wrap align="center">
          <Dropdown
            tokens={tokens}
            width={200}
            trigger={<Button tokens={tokens} variant="secondary" iconRight={<ChevronIcon direction="down" size={12} />}>Actions</Button>}
          >
            <MenuItem tokens={tokens} icon={<Icon name="edit" size={12} />} onClick={() => {}}>Edit</MenuItem>
            <MenuItem tokens={tokens} icon={<Icon name="copy" size={12} />} onClick={() => {}}>Duplicate</MenuItem>
            <MenuItem tokens={tokens} icon={<Icon name="archive" size={12} />} onClick={() => {}}>Archive</MenuItem>
            <MenuDivider tokens={tokens} />
            <MenuItem tokens={tokens} icon={<Icon name="trash" size={12} />} danger onClick={() => {}}>Delete</MenuItem>
          </Dropdown>

          <Inline gap={8}>
            <Tooltip tokens={tokens} content="Tooltip on top" side="top">
              <Button tokens={tokens} variant="outline" size="sm">Top</Button>
            </Tooltip>
            <Tooltip tokens={tokens} content="Below the button" side="bottom">
              <Button tokens={tokens} variant="outline" size="sm">Bottom</Button>
            </Tooltip>
            <Tooltip tokens={tokens} content="To the left" side="left">
              <Button tokens={tokens} variant="outline" size="sm">Left</Button>
            </Tooltip>
            <Tooltip tokens={tokens} content="To the right" side="right">
              <Button tokens={tokens} variant="outline" size="sm">Right</Button>
            </Tooltip>
          </Inline>
        </Inline>
      </ShowSection>

      {/* ── 13. TOAST ──────────────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="toast"
        title="Toast Notifications"
        description="Context-based toast system. Auto-dismiss after 4s. Four tones — success, error, info, warning."
      >
        <ToastDemoButtons tokens={tokens} />
      </ShowSection>

      {/* ── 14. TABLE ──────────────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="table"
        title="Table Primitives"
        description="Standardized Th / Td with sort indicators. TableWrap provides bordered scroll container."
      >
        <TableWrap tokens={tokens}>
          <thead>
            <tr>
              <Th tokens={tokens} sortable sortDir="asc" onSort={() => {}}>Product</Th>
              <Th tokens={tokens} sortable>SKU</Th>
              <Th tokens={tokens} align="right">Price</Th>
              <Th tokens={tokens} align="right">Stock</Th>
              <Th tokens={tokens}>Status</Th>
              <Th tokens={tokens} align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Air Jordan 1 Retro High', sku: 'LNK-AJ1-001', price: '₹18,999', stock: 24, status: 'Published' },
              { name: 'Nike Dunk Low Panda', sku: 'LNK-NDL-002', price: '₹9,499', stock: 8, status: 'Low Stock' },
              { name: 'Adidas Samba OG', sku: 'LNK-ASO-003', price: '₹8,999', stock: 0, status: 'Out of Stock' },
              { name: 'Yeezy 350 V2', sku: 'LNK-YZY-004', price: '₹22,999', stock: 12, status: 'Published' },
            ].map((row, i) => (
              <tr key={i}>
                <Td tokens={tokens} truncate>{row.name}</Td>
                <Td tokens={tokens}><Code tokens={tokens}>{row.sku}</Code></Td>
                <Td tokens={tokens} align="right">{row.price}</Td>
                <Td tokens={tokens} align="right">{row.stock}</Td>
                <Td tokens={tokens}><StatusPill tokens={tokens} status={row.status} /></Td>
                <Td tokens={tokens} align="right">
                  <Inline gap={4} justify="flex-end">
                    <IconButton tokens={tokens} icon={<Icon name="edit" size={12} />} label="Edit" size={24} />
                    <IconButton tokens={tokens} icon={<Icon name="moreHorizontal" size={12} />} label="More" size={24} />
                  </Inline>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </ShowSection>

      {/* ── 15. STATES ─────────────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="states"
        title="Empty / Error / Success / Loading States"
        description="Every page must handle these states gracefully. Skeletons for loading, branded empty states, retry-able errors."
      >
        <Grid cols={2} gap={12} minColWidth={280}>
          <Card tokens={tokens} style={{ padding: 0 }}>
            <EmptyState
              tokens={tokens}
              icon={<Icon name="package" size={24} />}
              title="No products yet"
              description="Add your first product to start selling. You can import from CSV or create one manually."
              action={<Button tokens={tokens} size="sm" icon={<Icon name="plus" size={12} />}>Add product</Button>}
            />
          </Card>
          <Card tokens={tokens} style={{ padding: 0 }}>
            <ErrorState
              tokens={tokens}
              title="Failed to load orders"
              message="Network error. Check your connection and try again."
              onRetry={() => {}}
            />
          </Card>
          <Card tokens={tokens} style={{ padding: 0 }}>
            <SuccessState
              tokens={tokens}
              title="Order placed successfully"
              message="Order #LNK-2842 has been confirmed and will ship within 24 hours."
            />
          </Card>
          <Card tokens={tokens} style={{ padding: 20 }}>
            <SubLabel tokens={tokens}>Skeletons</SubLabel>
            <Stack gap={8}>
              <Skeleton tokens={tokens} h={14} w="60%" />
              <Skeleton tokens={tokens} h={14} w="80%" />
              <Skeleton tokens={tokens} h={14} w="40%" />
              <Skeleton tokens={tokens} h={48} r={dt.radius.md} />
            </Stack>
          </Card>
        </Grid>
      </ShowSection>

      {/* ── 16. PROGRESS & AVATAR ──────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="progress"
        title="Progress, Avatar, Stat"
        description="Linear and circular progress indicators. Avatars with deterministic colors. AvatarGroup for stacked display."
      >
        <Stack gap={20}>
          <div>
            <SubLabel tokens={tokens}>Progress bar (interactive)</SubLabel>
            <Inline gap={12} wrap align="center">
              <div style={{ flex: 1, minWidth: 200 }}>
                <ProgressBar tokens={tokens} value={progress} />
              </div>
              <NumberInput tokens={tokens} value={progress} onChange={setProgress} min={0} max={100} suffix="%" />
            </Inline>
          </div>
          <div>
            <SubLabel tokens={tokens}>Progress ring (sizes)</SubLabel>
            <Inline gap={20} wrap align="center">
              <ProgressRing tokens={tokens} value={progress} size={32} />
              <ProgressRing tokens={tokens} value={progress} size={48} />
              <ProgressRing tokens={tokens} value={progress} size={72} />
              <ProgressRing tokens={tokens} value={progress} size={96} color={tokens.status.success} />
              <ProgressRing tokens={tokens} value={progress} size={96} color={tokens.status.warning} />
              <ProgressRing tokens={tokens} value={progress} size={96} color={tokens.status.error} />
            </Inline>
          </div>
          <div>
            <SubLabel tokens={tokens}>Avatars</SubLabel>
            <Inline gap={16} wrap align="center">
              <Avatar tokens={tokens} name="Arjun Mehta" size={24} color="#3B82F6" />
              <Avatar tokens={tokens} name="Priya Sharma" size={32} color="#10B981" />
              <Avatar tokens={tokens} name="Raj Patel" size={40} color="#F59E0B" />
              <Avatar tokens={tokens} name="Sneha Reddy" size={56} color="#8B5CF6" />
              <Avatar tokens={tokens} name="Vikram Singh" size={72} color="#EC4899" />
              <div style={{ width: 1, height: 40, background: tokens.border.subtle }} />
              <AvatarGroup
                tokens={tokens}
                size={32}
                users={[
                  { name: 'Arjun Mehta', color: '#3B82F6' },
                  { name: 'Priya Sharma', color: '#10B981' },
                  { name: 'Raj Patel', color: '#F59E0B' },
                  { name: 'Sneha Reddy', color: '#8B5CF6' },
                  { name: 'Vikram Singh', color: '#EC4899' },
                  { name: 'Anika Gupta', color: '#EF4444' },
                  { name: 'Karan Malhotra', color: '#06B6D4' },
                ]}
              />
            </Inline>
          </div>
        </Stack>
      </ShowSection>

      {/* ── 17. BREADCRUMB & PAGINATION ────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="nav"
        title="Breadcrumb, Pagination, Keyboard hints"
        description="Navigation helpers. Kbd component for documenting keyboard shortcuts."
      >
        <Stack gap={16}>
          <div>
            <SubLabel tokens={tokens}>Breadcrumb</SubLabel>
            <Breadcrumb
              tokens={tokens}
              items={[
                { label: 'Admin', href: '#' },
                { label: 'Catalog', href: '#' },
                { label: 'Products', href: '#' },
                { label: 'Air Jordan 1' },
              ]}
            />
          </div>
          <div>
            <SubLabel tokens={tokens}>Pagination</SubLabel>
            <Pagination tokens={tokens} page={page} totalPages={5} onPage={setPage} total={248} />
          </div>
          <div>
            <SubLabel tokens={tokens}>Keyboard hints</SubLabel>
            <Inline gap={12} wrap align="center">
              <Inline gap={4}><Kbd tokens={tokens}>⌘</Kbd><Kbd tokens={tokens}>K</Kbd><span style={{ fontSize: 12, color: tokens.text.secondary }}>Open command palette</span></Inline>
              <Inline gap={4}><Kbd tokens={tokens}>⌘</Kbd><Kbd tokens={tokens}>B</Kbd><span style={{ fontSize: 12, color: tokens.text.secondary }}>Toggle sidebar</span></Inline>
              <Inline gap={4}><Kbd tokens={tokens}>Esc</Kbd><span style={{ fontSize: 12, color: tokens.text.secondary }}>Close modal</span></Inline>
              <Inline gap={4}><Kbd tokens={tokens}>Tab</Kbd><span style={{ fontSize: 12, color: tokens.text.secondary }}>Next field</span></Inline>
            </Inline>
          </div>
        </Stack>
      </ShowSection>

      {/* ── 18. LAYOUT ─────────────────────────────────────── */}
      <ShowSection
        tokens={tokens}
        id="layout"
        title="Layout Primitives & FilterPanel"
        description="Container (1600 max), Stack (vertical), Inline (horizontal), Grid (responsive). FilterPanel for sidebar forms."
      >
        <Grid cols={3} gap={16} minColWidth={280}>
          <FilterPanel tokens={tokens} onApply={() => {}} onClear={() => {}}>
            <Select tokens={tokens} label="Category" options={[
              { value: 'sneakers', label: 'Sneakers' },
              { value: 'apparel', label: 'Apparel' },
            ]} />
            <Select tokens={tokens} label="Brand" options={[
              { value: 'nike', label: 'Nike' },
              { value: 'adidas', label: 'Adidas' },
            ]} />
            <Checkbox tokens={tokens} label="In stock only" checked={true} onChange={() => {}} />
            <Checkbox tokens={tokens} label="On sale" checked={false} onChange={() => {}} />
          </FilterPanel>

          <Card tokens={tokens} style={{ padding: 16 }}>
            <SubLabel tokens={tokens}>FileUpload</SubLabel>
            <FileUpload tokens={tokens} accept="image/*" onFiles={() => {}} />
          </Card>

          <Card tokens={tokens} style={{ padding: 16 }}>
            <SubLabel tokens={tokens}>Stack / Inline / Grid</SubLabel>
            <Stack gap={8}>
              <Inline gap={4}><Badge tokens={tokens} tone="info">Inline</Badge><Badge tokens={tokens} tone="success">horizontal</Badge></Inline>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                <div style={{ height: 24, background: tokens.bg.surfaceAlt, borderRadius: 4 }} />
                <div style={{ height: 24, background: tokens.bg.surfaceAlt, borderRadius: 4 }} />
                <div style={{ height: 24, background: tokens.bg.surfaceAlt, borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
                Use Stack for vertical rhythm, Inline for horizontal grouping, Grid for responsive layouts.
              </div>
            </Stack>
          </Card>
        </Grid>
      </ShowSection>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center', padding: '24px 0', fontSize: 11,
        color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif',
      }}>
        LNKICKS Enterprise Admin · Design System Foundation v1.0 · {ALL_ICON_NAMES.length} icons · 50+ primitives
      </div>
    </Stack>
  );
}

/* =========================================================== */
/* Toast demo — needs to be inside ToastProvider               */
/* =========================================================== */
function ToastDemoButtons({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  const { push } = useToast();
  return (
    <Inline gap={8} wrap>
      <Button
        tokens={tokens}
        variant="success"
        icon={<Icon name="check" size={14} />}
        onClick={() => push({ tone: 'success', title: 'Saved', message: 'Product changes published to storefront.' })}
      >Success toast</Button>
      <Button
        tokens={tokens}
        variant="danger"
        icon={<Icon name="alertTriangle" size={14} />}
        onClick={() => push({ tone: 'error', title: 'Failed to save', message: 'Network error. Try again.' })}
      >Error toast</Button>
      <Button
        tokens={tokens}
        variant="secondary"
        icon={<Icon name="info" size={14} />}
        onClick={() => push({ tone: 'info', title: 'New order', message: 'Order #LNK-2843 received.' })}
      >Info toast</Button>
      <Button
        tokens={tokens}
        variant="secondary"
        icon={<Icon name="alert" size={14} />}
        onClick={() => push({ tone: 'warning', title: 'Low stock', message: 'Air Jordan 1 has 3 units left.' })}
      >Warning toast</Button>
    </Inline>
  );
}
