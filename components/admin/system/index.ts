/**
 * LNKICKS Enterprise Admin — Global Design System
 * ============================================================
 * SINGLE ENTRY POINT for the entire admin suite.
 *
 * This barrel re-exports every primitive from the legacy
 * `components/admin/ui.tsx` (60+ atoms/molecules) PLUS the new
 * enterprise extensions organized by category:
 *
 *   - Typography   (Display, H1-H4, Body, Caption, Label, Overline, Mono, Numeric, DeltaText)
 *   - Buttons      (Link, SplitButton, LoadingButton, ButtonToolbar, FAB)
 *   - Forms        (Email, Phone, Password, Currency, Date, Time, Switch, Autocomplete, CharacterCounter, FormField, FormRow, FormSection, ValidationMessage)
 *   - Cards        (MetricCard, AnalyticsCard, InformationCard, SummaryCard, ProductCard, CustomerCard, NotificationCard, ActivityCard)
 *   - Feedback     (Alert, InlineMessage, Snackbar, LoadingOverlay, WarningState, InfoState, SkeletonTable, SkeletonCard, DotLoader, IndeterminateBar)
 *   - Overlays     (BottomSheet, ImageViewer, QuickPreview, Popover)
 *   - DataTable    (DataTable — sticky header/column, sorting, filtering, virtualization-ready, bulk selection, resizable, column visibility, density, saved views, context menu)
 *   - Accessibility (VisuallyHidden, SkipLink, LiveRegion, KeyboardHint, useAnnounce, usePrefersReducedMotion, useFocusReturn, useRovingTabIndex, contrast helpers)
 *
 * Import pattern — pick one:
 *
 *   // Tree-shakeable named import (preferred)
 *   import { Button, Card, MetricCard, Alert } from '@/components/admin/system';
 *
 *   // Or import from a specific module for the smallest bundle
 *   import { MetricCard } from '@/components/admin/system/Cards';
 *   import { Alert } from '@/components/admin/system/Feedback';
 *
 * Backward compatibility — pages importing from `@/components/admin/ui`
 * continue to work without changes. The new components in this
 * directory are purely ADDITIVE.
 *
 * Design philosophy:
 *   - One token system: dt + AdminThemeTokens (adminTheme.ts + designTokens.ts)
 *   - One icon family: <Icon name="…" /> (icons/Icon.tsx)
 *   - One spacing scale: 8-point grid (dt.spacing)
 *   - One typography scale: 1.125 ratio (dt.typography)
 *   - One radius scale: sm/md/lg/xl/pill (dt.radius)
 *   - One elevation scale: xs/sm/md/lg/xl (dt.elevation)
 *   - One motion scale: 3 easings × 4 durations (dt.motion)
 *   - One z-index scale: 8 layers (dt.zIndex)
 *   - One color palette: semantic roles (adminTheme.ts)
 *
 * @example Quick start
 *   import { useAdminTheme } from '@/lib/admin/adminTheme';
 *   import { Panel, MetricCard, Alert, Button } from '@/components/admin/system';
 *
 *   function MyPage() {
 *     const { tokens } = useAdminTheme();
 *     return (
 *       <Panel tokens={tokens} title="Sales">
 *         <Alert tokens={tokens} severity="success" title="Goal reached!" />
 *         <MetricCard tokens={tokens} label="Revenue" value="₹2.4L" delta={12.4} tone="positive" />
 *       </Panel>
 *     );
 *   }
 */

'use client';

/* ─── Legacy primitives (re-exported, no changes) ──────────── */
export * from '@/components/admin/ui';

/* ─── New enterprise extensions ────────────────────────────── */
export * from './Typography';
export * from './Buttons';
export * from './Forms';
export * from './Cards';
export * from './Feedback';
export * from './Overlays';
export * from './DataTable';
export * from './Accessibility';
