# LNKICKS Enterprise Admin — Global Design System

**ONE design language for the entire admin suite.**

Inspired by: Apple HIG, Google Material 3, Stripe Dashboard, Shopify Polaris, Linear, Vercel, Notion.

## Architecture

```
lib/admin/
  ├─ designTokens.ts     ← spacing, typography, radius, shadow, elevation,
  │                        opacity, motion, z-index, layout, colorPalette,
  │                        componentSize, keyframes, focusRing
  ├─ adminTheme.ts        ← light/dark/system theme tokens
  ├─ types.ts             ← AdminThemeTokens, AdminRole, KPI, etc.
  ├─ adminData.ts         ← existing data sources (NOT modified)
  └─ adminAuth.ts         ← session/RBAC (NOT modified)

components/admin/
  ├─ ui.tsx               ← 60+ legacy primitives (canonical, unchanged)
  ├─ AdminLayout.tsx      ← shell (unchanged)
  ├─ AdminSidebar.tsx     ← sidebar (unchanged)
  ├─ AdminTopbar.tsx      ← topbar (unchanged)
  ├─ PageHeader.tsx       ← page header (unchanged)
  ├─ EnterpriseDataTable.tsx  ← legacy table (kept for compat)
  ├─ icons/Icon.tsx       ← 90+ icon registry (canonical)
  ├─ charts/              ← LineChart, BarChart, DonutChart, Sparkline
  ├─ widgets/KPICard.tsx  ← specialized KPI widget
  └─ system/              ← NEW enterprise extensions
      ├─ index.ts         ← barrel export (re-exports ui.tsx + new)
      ├─ Typography.tsx   ← Display, H1-H4, Body, Caption, Label, Overline, Mono, Numeric, DeltaText, Truncate
      ├─ Buttons.tsx      ← Link, LoadingButton, SplitButton, ButtonToolbar, ToolbarDivider, FAB
      ├─ Forms.tsx        ← EmailInput, PhoneInput, PasswordInput, CurrencyInput, DateInput, TimeInput, Switch, Autocomplete, CharacterCounter, FormField, FormRow, FormSection, ValidationMessage
      ├─ Cards.tsx        ← MetricCard, AnalyticsCard, InformationCard, SummaryCard, ProductCard, CustomerCard, NotificationCard, ActivityCard
      ├─ Feedback.tsx     ← Alert, InlineMessage, SnackbarProvider/useSnackbar, LoadingOverlay, WarningState, InfoState, SkeletonTable, SkeletonCard, DotLoader, IndeterminateBar
      ├─ Overlays.tsx     ← BottomSheet, ImageViewer, QuickPreview, Popover
      ├─ DataTable.tsx    ← DataTable (sticky header/column, sorting, filtering, bulk, resizable, column visibility, density, saved views, context menu)
      └─ Accessibility.tsx ← VisuallyHidden, SkipLink, LiveRegionProvider/useAnnounce, KeyboardHint, usePrefersReducedMotion, useFocusReturn, useRovingTabIndex, contrast helpers
```

## Importing

Two equivalent import paths — pick one and stay consistent:

```tsx
// Path A — recommended (single source of truth)
import {
  Button, Card, Panel, Badge,                          // legacy
  MetricCard, AnalyticsCard,                            // cards
  Alert, InlineMessage, useSnackbar,                    // feedback
  BottomSheet, QuickPreview,                            // overlays
  DataTable,                                            // table
  EmailInput, CurrencyInput, FormField,                 // forms
  Display, H1, Body, Caption, Overline,                 // typography
  Link, SplitButton,                                    // buttons
  VisuallyHidden, SkipLink, useAnnounce,                // a11y
} from '@/components/admin/system';

// Path B — legacy (still works, no changes needed)
import { Button, Card, Panel, Badge } from '@/components/admin/ui';
```

Pages may mix both — `system/index.ts` re-exports everything from `ui.tsx`, so there are no name conflicts and no duplicate bundles.

## Tokens — the source of truth

Every visual decision MUST come from `dt` (design tokens) or `tokens` (theme tokens passed via `useAdminTheme`). Never hardcode hex colors, px sizes, or transitions.

```tsx
import { dt } from '@/lib/admin/designTokens';
import { useAdminTheme } from '@/lib/admin/adminTheme';

const { tokens } = useAdminTheme();

dt.spacing.md           // 16  — default card padding
dt.spacing.lg           // 20  — comfortable card padding
dt.radius.md            // 8   — buttons, inputs
dt.radius.lg            // 12  — cards, panels
dt.elevation.sm         // '0 1px 2px ...'
dt.motion.duration.base // 180
dt.motion.easing.standard // 'cubic-bezier(0.16, 1, 0.3, 1)'
dt.zIndex.modal         // 1000
dt.typography.h1        // { fontSize: 18, lineHeight: 1.3, ... }

tokens.bg.surface       // card background
tokens.bg.surfaceAlt    // alt background
tokens.text.primary     // primary text
tokens.text.secondary   // secondary text
tokens.border.subtle    // 1px border color
tokens.status.success   // green
tokens.status.error     // red
```

## Typography Scale (1.125 ratio — Major Second)

| Token      | Size | Weight | Use case                       |
| ---------- | ---- | ------ | ------------------------------ |
| display    | 32   | 700    | hero KPI numbers               |
| pageTitle  | 22   | 700    | page title                     |
| h1         | 18   | 700    | section heading                |
| h2         | 15   | 700    | card title                     |
| h3         | 13   | 700    | sub-section                    |
| bodyLg     | 14   | 400    | primary readable text          |
| body       | 13   | 400    | default text                   |
| bodySm     | 12   | 400    | table cells, list items        |
| label      | 12   | 600    | form labels, menu items        |
| caption    | 11   | 500    | timestamps, helper text        |
| overline   | 10   | 700    | uppercase section labels       |
| micro      | 10   | 600    | badges, version numbers        |
| mono       | 12   | 500    | codes, IDs, SKUs               |

```tsx
<Display tokens={tokens}>₹2,84,910</Display>
<H1 tokens={tokens}>Inventory Management</H1>
<Body tokens={tokens}>3 variants available</Body>
<Caption tokens={tokens}>Updated 2 minutes ago</Caption>
<Overline tokens={tokens}>Top Products</Overline>
```

## Button System

**Variants** (from `ui.tsx`):
- `primary` — high-emphasis, dark on light / light on dark
- `secondary` — surface background, subtle border
- `outline` — transparent + border
- `ghost` — transparent, no border
- `danger` — red background, white text
- `success` — green background, white text

**Sizes**: sm (30px) / md (36px) / lg (44px)

**New** (from `system/Buttons.tsx`):
- `Link` — link-styled button, no chrome
- `SplitButton` — primary action + dropdown caret
- `LoadingButton` — semantic alias of Button with loading
- `ButtonToolbar` — joined horizontal group
- `FAB` — floating action button (mobile)

```tsx
<Button tokens={tokens} variant="primary" icon={<Icon name="plus" size={14} />}>
  Add product
</Button>

<SplitButton
  tokens={tokens}
  label="Save"
  onClick={handleSave}
  items={[
    { label: 'Save & New', onClick: handleSaveNew },
    { label: 'Save & Duplicate', onClick: handleDuplicate },
  ]}
/>
```

## Form System

**Typed inputs** (`system/Forms.tsx`):
- `EmailInput` — email + validation icon
- `PhoneInput` — country code + tel
- `PasswordInput` — show/hide + strength meter
- `CurrencyInput` — ₹ prefix + locale formatting
- `DateInput` — native date + clear button
- `TimeInput` — native time
- `Switch` — large iOS/Material 3 switch (alt to Toggle)
- `Autocomplete` — typeahead combobox with keyboard nav

**Scaffolding**:
- `FormField` — label + control + hint + error + counter
- `FormRow` — horizontal grid (1/2/3/4 cols)
- `FormSection` — visually grouped form region
- `ValidationMessage` — inline error/success/warning/hint
- `CharacterCounter` — live count vs max

```tsx
<FormField tokens={tokens} label="Email" required error={errors.email}>
  <EmailInput tokens={tokens} value={email} onChange={setEmail} />
</FormField>

<FormField tokens={tokens} label="Price" hint="Inclusive of all taxes">
  <CurrencyInput tokens={tokens} value={price} onChange={setPrice} />
</FormField>
```

## Table System

The new `DataTable` (`system/DataTable.tsx`) supports:
- ✓ Sticky header
- ✓ Sticky first column
- ✓ Sorting (click header)
- ✓ Filtering (per-column text filter)
- ✓ Pagination (with page size control)
- ✓ Bulk selection (with bulk action bar)
- ✓ Resizable columns (drag handle)
- ✓ Column visibility (toggle columns on/off)
- ✓ Density modes (compact / comfortable / spacious)
- ✓ Saved views (persisted state)
- ✓ Search highlighting
- ✓ Context menu (right-click row)
- ✓ Loading skeleton
- ✓ Empty state

```tsx
const columns: DataTableColumn<Product>[] = [
  { key: 'name', header: 'Name', sortable: true, sticky: 'left', minWidth: 200 },
  { key: 'sku', header: 'SKU', sortable: true, render: r => <Mono tokens={tokens}>{r.sku}</Mono> },
  { key: 'price', header: 'Price', align: 'right', sortable: true, sortValue: r => r.price },
];

<DataTable
  tokens={tokens}
  columns={columns}
  rows={products}
  getRowId={p => p.id}
  selectable
  searchable
  resizable
  columnVisibility
  savedViews
  density="comfortable"
  bulkActions={ids => <Button tokens={tokens} variant="danger">Delete ({ids.length})</Button>}
  onRowClick={p => router.push(`/edit-product?id=${p.id}`)}
  contextMenu={p => [
    { label: 'Edit', icon: 'edit', onClick: () => openEdit(p) },
    { label: 'Duplicate', icon: 'copy', onClick: () => duplicate(p) },
    { label: 'Delete', icon: 'trash', danger: true, onClick: () => remove(p) },
  ]}
/>
```

## Card System

- `MetricCard` — single KPI value with delta
- `AnalyticsCard` — KPI + chart + comparison
- `InformationCard` — title + description + meta
- `SummaryCard` — compact list of label/value pairs
- `ProductCard` — image + name + brand + price + stock
- `CustomerCard` — avatar + name + email + stats
- `NotificationCard` — icon + title + message + timestamp
- `ActivityCard` — avatar + action description + timestamp

```tsx
<MetricCard
  tokens={tokens}
  label="Revenue"
  value="₹2,84,910"
  delta={12.4}
  deltaLabel="vs last month"
  tone="positive"
  icon="rupee"
/>
```

## Feedback System

- `Alert` — inline page-level alert with severity + close
- `InlineMessage` — compact inline notice
- `SnackbarProvider` / `useSnackbar` — top-positioned toast with action
- `LoadingOverlay` — full-card/section loading mask
- `WarningState` — full-state warning panel
- `InfoState` — full-state info panel
- `SkeletonTable` — table-shaped loading placeholder
- `SkeletonCard` — card-shaped loading placeholder
- `DotLoader` — three-dot bouncing loader
- `IndeterminateBar` — linear indeterminate progress

```tsx
// Wrap your app once:
<SnackbarProvider tokens={tokens}>
  {children}
</SnackbarProvider>

// Then anywhere:
const snack = useSnackbar();
snack.push({
  title: 'Saved',
  message: 'Product updated successfully',
  severity: 'success',
  action: { label: 'Undo', onClick: () => revert() },
});
```

## Overlay System

- `BottomSheet` — mobile-first slide-up sheet
- `ImageViewer` — lightbox modal for image preview
- `QuickPreview` — slide-over detail panel for entities
- `Popover` — lightweight anchored popover

```tsx
<QuickPreview
  tokens={tokens}
  open={open}
  onClose={() => setOpen(false)}
  title={product.name}
  subtitle={product.brand}
  avatar={<Avatar tokens={tokens} name={product.name} />}
  actions={<Button tokens={tokens} size="sm">Edit</Button>}
  footer={<Button tokens={tokens} variant="primary">Save</Button>}
>
  <DescriptionList tokens={tokens} items={[
    { label: 'SKU', value: product.sku, mono: true },
    { label: 'Stock', value: product.stock },
  ]} />
</QuickPreview>
```

## Accessibility (WCAG AA+)

- `VisuallyHidden` — hide visually, keep for screen readers
- `SkipLink` — skip-to-content link (render in AdminLayout)
- `LiveRegionProvider` / `useAnnounce` — dynamic announcements
- `KeyboardHint` — kbd-style shortcut display
- `usePrefersReducedMotion` — respect user motion preference
- `useFocusReturn` — return focus to trigger when overlay closes
- `useRovingTabIndex` — arrow-key nav for lists
- `meetsAA` / `meetsAAA` — color contrast validators

```tsx
// In AdminLayout:
<LiveRegionProvider>
  <SkipLink tokens={tokens} target="main-content" />
  <main id="main-content">{children}</main>
</LiveRegionProvider>

// Anywhere:
const announce = useAnnounce();
announce('3 products selected', 'polite');
```

## Color Palette (semantic roles, never raw hex)

| Role            | Light      | Dark       |
| --------------- | ---------- | ---------- |
| bg.app          | #F8F9FB    | #0B0F14    |
| bg.surface      | #FFFFFF    | #131820    |
| bg.surfaceAlt   | #F1F3F5    | #1A2029    |
| bg.hover        | #F1F3F5    | #1A2029    |
| text.primary    | #0A0A0A    | #F1F5F9    |
| text.secondary  | #475569    | #94A3B8    |
| text.tertiary   | #94A3B8    | #64748B    |
| border.subtle   | #E5E7EB    | #1F2937    |
| border.strong   | #CBD5E1    | #334155    |
| status.success  | #15803D    | #4ADE80    |
| status.warning  | #B45309    | #FBBF24    |
| status.error    | #B91C1C    | #F87171    |
| status.info     | #1D4ED8    | #60A5FA    |

## Motion (4 easings × 7 durations)

**Easings**:
- `standard` — `cubic-bezier(0.16, 1, 0.3, 1)` (default)
- `quick` — `cubic-bezier(0.4, 0, 0.2, 1)` (hover)
- `expressive` — `cubic-bezier(0.34, 1.56, 0.64, 1)` (entrance)
- `exit` — `cubic-bezier(0.4, 0, 1, 1)` (exit)

**Durations (ms)**:
`instant(0)` `quick(100)` `fast(140)` `base(180)` `slow(240)` `slower(320)` `slowest(480)`

## Z-Index Layers (8 layers, never use magic numbers)

| Layer    | Value | Use case                       |
| -------- | ----- | ------------------------------ |
| base     | 0     | page content                   |
| raised   | 1     | sticky headers, inline popovers |
| sticky   | 10    | sidebar, topbar                |
| dropdown | 200   | menus, dropdowns, tooltips     |
| drawer   | 500   | side drawers                   |
| modal    | 1000  | modals, dialogs                |
| toast    | 2000  | toast notifications            |
| command  | 3000  | command palette                |

## Performance

- All primitives are pure functional components → React fast path
- `useMemo` + `useCallback` used in interactive components
- styled-jsx `<style>` blocks are deduped by the compiler
- Tree-shakeable: importing one component does NOT bundle the rest
- No external CSS file — everything is inline-style + styled-jsx
- Legacy `ui.tsx` imports continue to work — no breaking changes

---

**Version**: 2.0.0
