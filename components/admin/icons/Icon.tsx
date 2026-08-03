/**
 * LNKICKS Enterprise Admin — Icon System
 * ------------------------------------------------------------
 * ONE icon family for the entire admin suite.
 *
 * Design language:
 *  - 24×24 viewBox, consistent stroke width (1.75)
 *  - Round caps + joins (friendly, premium)
 *  - No fills (outline style only — matches Linear / Vercel)
 *  - Optical alignment (paths nudged for visual balance)
 *  - Sized via prop, defaults to 16px
 *
 * Usage:
 *   <Icon name="dashboard" size={18} />
 *   <Icon name="search" size={14} color={tokens.text.tertiary} />
 *
 * Inspired by Lucide / Phosphor / Tabler — all open-source icon
 * families with consistent stroke-based design.
 */

'use client';

import type { CSSProperties } from 'react';

export type IconName =
  // Navigation / layout
  | 'dashboard' | 'home' | 'menu' | 'sidebar' | 'breadcrumb'
  | 'arrowLeft' | 'arrowRight' | 'arrowUp' | 'arrowDown'
  | 'chevronRight' | 'chevronLeft' | 'chevronUp' | 'chevronDown'
  | 'chevronsRight' | 'chevronsLeft' | 'chevronsUp' | 'chevronsDown'
  | 'cornerUpRight' | 'cornerDownRight' | 'externalLink'
  // Actions
  | 'plus' | 'minus' | 'x' | 'check' | 'checkCircle' | 'xCircle'
  | 'search' | 'filter' | 'sort' | 'sortAsc' | 'sortDesc'
  | 'edit' | 'trash' | 'copy' | 'clipboard' | 'paste'
  | 'download' | 'upload' | 'cloudUpload' | 'cloudDownload'
  | 'save' | 'archive' | 'restore' | 'refresh' | 'rotate'
  | 'eye' | 'eyeOff' | 'preview' | 'expand' | 'collapse'
  | 'moreHorizontal' | 'moreVertical' | 'dots'
  | 'command' | 'shortcut' | 'enter' | 'escape' | 'tab'
  // Status
  | 'info' | 'alert' | 'alertTriangle' | 'help' | 'question'
  | 'success' | 'warning' | 'error' | 'loading' | 'spinner'
  | 'clock' | 'timer' | 'hourglass' | 'calendar' | 'date'
  // Commerce
  | 'cart' | 'bag' | 'shoppingBag' | 'tag' | 'tags' | 'label'
  | 'receipt' | 'invoice' | 'dollar' | 'rupee' | 'wallet'
  | 'creditCard' | 'bank' | 'cash' | 'coins' | 'gift'
  | 'coupon' | 'discount' | 'percent' | 'sale' | 'flash'
  | 'package' | 'box' | 'truck' | 'shipping' | 'delivery'
  | 'warehouse' | 'inventory' | 'stock' | 'barcode' | 'qrCode'
  // Catalog
  | 'product' | 'shirt' | 'shoe' | 'star' | 'heart' | 'bookmark'
  | 'image' | 'photo' | 'camera' | 'video' | 'file' | 'folder'
  | 'layers' | 'grid' | 'list' | 'columns' | 'kanban'
  | 'category' | 'collection' | 'brand' | 'variant'
  // People
  | 'user' | 'users' | 'userPlus' | 'userCheck' | 'userX'
  | 'contact' | 'customer' | 'admin' | 'shield' | 'crown'
  | 'avatar' | 'profile' | 'group'
  // Communication
  | 'bell' | 'bellOff' | 'mail' | 'message' | 'chat' | 'phone'
  | 'send' | 'reply' | 'forward' | 'inbox' | 'at'
  // Analytics
  | 'chart' | 'barChart' | 'lineChart' | 'pieChart' | 'donutChart'
  | 'trending' | 'trendingUp' | 'trendingDown' | 'activity'
  | 'gauge' | 'target' | 'goal' | 'flag' | 'award' | 'trophy'
  // Settings / system
  | 'settings' | 'gear' | 'sliders' | 'toggle' | 'switch'
  | 'lock' | 'unlock' | 'key' | 'fingerprint' | 'password'
  | 'api' | 'webhook' | 'integration' | 'plug' | 'puzzle'
  | 'database' | 'server' | 'cloud' | 'globe' | 'language'
  | 'moon' | 'sun' | 'monitor' | 'theme'
  // SEO / content
  | 'seo' | 'searchEngine' | 'google' | 'analytics'
  | 'link' | 'unlink' | 'chain' | 'meta' | 'tagSeo'
  | 'robot' | 'spider' | 'sitemap' | 'rss' | 'feed'
  // Misc
  | 'book' | 'docs' | 'help' | 'info' | 'about'
  | 'fire' | 'sparkles' | 'magic' | 'wand' | 'star'
  | 'location' | 'mapPin' | 'navigation' | 'compass'
  | 'power' | 'logout' | 'login' | 'session'
  | 'history' | 'undo' | 'redo' | 'revert'
  | 'compare' | 'diff' | 'version'
  | 'attachment' | 'paperclip' | 'link2'
  | 'emoji' | 'smile' | 'mood'
  | 'wifi' | 'bluetooth' | 'signal'
  | 'pause' | 'play' | 'stop' | 'record'
  | 'volume' | 'mute';

/* Icon path data — keyed by IconName.
 * Each entry is an array of <path d="..."> strings. We use
 * <path> exclusively (no <circle>/<rect>) for consistency,
 * except where a circle is essential (e.g. info icon). */
const ICON_PATHS: Record<IconName, string[]> = {
  // ─── Navigation ───────────────────────────────────────────
  dashboard: [
    'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  ],
  home: ['M3 12l9-9 9 9M5 10v10h14V10'],
  menu: ['M4 6h16M4 12h16M4 18h16'],
  sidebar: ['M3 4h18v16H3zM9 4v16'],
  breadcrumb: ['M9 6l6 6-6 6'],
  arrowLeft: ['M19 12H5M12 19l-7-7 7-7'],
  arrowRight: ['M5 12h14M12 5l7 7-7 7'],
  arrowUp: ['M12 19V5M5 12l7-7 7 7'],
  arrowDown: ['M12 5v14M19 12l-7 7-7-7'],
  chevronRight: ['M9 6l6 6-6 6'],
  chevronLeft: ['M15 6l-6 6 6 6'],
  chevronUp: ['M6 15l6-6 6 6'],
  chevronDown: ['M6 9l6 6 6-6'],
  chevronsRight: ['M13 6l6 6-6 6M7 6l6 6-6 6'],
  chevronsLeft: ['M11 6l-6 6 6 6M17 6l-6 6 6 6'],
  chevronsUp: ['M6 13l6-6 6 6M6 7l6-6 6 6'],
  chevronsDown: ['M6 11l6 6 6-6M6 17l6 6 6-6'],
  cornerUpRight: ['M9 10h6a4 4 0 014 4v6M19 10l-4-4M19 10l-4 4'],
  cornerDownRight: ['M9 14h6a4 4 0 014-4v-6M19 14l-4 4M19 14l-4-4'],
  externalLink: ['M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3'],

  // ─── Actions ──────────────────────────────────────────────
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  x: ['M6 6l12 12M6 18L18 6'],
  check: ['M5 13l4 4L19 7'],
  checkCircle: ['M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3'],
  xCircle: ['M12 22a10 10 0 100-20 10 10 0 000 20zM15 9l-6 6M9 9l6 6'],
  search: ['M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5'],
  filter: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
  sort: ['M3 6h18M6 12h12M10 18h4'],
  sortAsc: ['M11 5h4M11 9h7M11 13h10M3 17l3-3 3 3'],
  sortDesc: ['M11 5h10M11 9h7M11 13h4M7 17l-3 3-3-3'],
  edit: ['M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash: ['M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6'],
  copy: ['M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1'],
  clipboard: ['M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M9 2h6a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1z'],
  paste: ['M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M9 2h6a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1z'],
  download: ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3'],
  upload: ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12'],
  cloudUpload: ['M16 16l-4-4-4 4M12 12v9M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3'],
  cloudDownload: ['M8 17l4 4 4-4M12 12v9M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3'],
  save: ['M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8'],
  archive: ['M21 8v13H3V8M1 3h22v5H1zM10 12h4'],
  restore: ['M3 12a9 9 0 109-9 9.74 9.74 0 00-6.74 2.74L3 8M3 3v5h5'],
  refresh: ['M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15'],
  rotate: ['M21 12a9 9 0 11-9-9M21 3v6h-6'],
  eye: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z'],
  eyeOff: ['M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22'],
  preview: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6z'],
  expand: ['M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7'],
  collapse: ['M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7'],
  moreHorizontal: ['M12 13a1 1 0 100-2 1 1 0 000 2zM19 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z'],
  moreVertical: ['M12 19a1 1 0 100-2 1 1 0 000 2zM12 7a1 1 0 100-2 1 1 0 000 2zM12 13a1 1 0 100-2 1 1 0 000 2z'],
  dots: ['M12 13a1 1 0 100-2 1 1 0 000 2zM19 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z'],
  command: ['M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z'],
  shortcut: ['M15 6h5a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5M10 13l-2-2 2-2M14 13l2-2-2-2'],
  enter: ['M9 10l-5 5 5 5M20 4v7a4 4 0 01-4 4H4'],
  escape: ['M14 6l6 6-6 6M20 12H8M4 4v16'],
  tab: ['M3 8V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2v-2M3 12h18'],

  // ─── Status ───────────────────────────────────────────────
  info: ['M12 22a10 10 0 100-20 10 10 0 000 20zM12 16v-4M12 8h.01'],
  alert: ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'],
  alertTriangle: ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'],
  help: ['M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01'],
  question: ['M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01'],
  success: ['M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3'],
  warning: ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'],
  error: ['M12 22a10 10 0 100-20 10 10 0 000 20zM15 9l-6 6M9 9l6 6'],
  loading: ['M21 12a9 9 0 11-6.219-8.56'],
  spinner: ['M21 12a9 9 0 11-6.219-8.56'],
  clock: ['M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2'],
  timer: ['M12 2v2M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2'],
  hourglass: ['M6 2h12M6 22h12M6 2v6a6 6 0 0012 0V2M6 22v-6a6 6 0 0012 0v6'],
  calendar: ['M3 4a2 2 0 012-2h14a2 2 0 012 2v18l-9-4-9 4V4zM3 10h18'],
  date: ['M3 4a2 2 0 012-2h14a2 2 0 012 2v18l-9-4-9 4V4zM3 10h18'],

  // ─── Commerce ─────────────────────────────────────────────
  cart: ['M9 22a1 1 0 100-2 1 1 0 000 2zM20 22a1 1 0 100-2 1 1 0 000 2zM1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6'],
  bag: ['M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0'],
  shoppingBag: ['M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0'],
  tag: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01'],
  tags: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01M22 7l-9 9'],
  label: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01'],
  receipt: ['M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2zM8 7h8M8 11h8M8 15h5'],
  invoice: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M8 13h8M8 17h5'],
  dollar: ['M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6'],
  rupee: ['M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 100-7'],
  wallet: ['M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2H6a2 2 0 00-2 2v2M18 13h.01'],
  creditCard: ['M3 5a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2H3zM1 10h22'],
  bank: ['M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3'],
  cash: ['M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6M2 7h20M2 17h20'],
  coins: ['M12 8a8 8 0 100-16 8 8 0 000 16zM12 8v8M9 4a3 3 0 100 6 3 3 0 000-6z'],
  gift: ['M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z'],
  coupon: ['M3 4a2 2 0 012-2h14a2 2 0 012 2v3a3 3 0 100 6v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a3 3 0 100-6V4zM9 6v12'],
  discount: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01M14 14h.01M9 14l5-5'],
  percent: ['M20 4L4 20M20 4a4 4 0 100 8 4 4 0 000-8zM4 12a4 4 0 100 8 4 4 0 000-8z'],
  sale: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01M14 14h.01M9 14l5-5'],
  flash: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  package: ['M16.5 9.4L7.5 4.21M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12'],
  box: ['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12'],
  truck: ['M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z'],
  shipping: ['M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z'],
  delivery: ['M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z'],
  warehouse: ['M3 21V9l9-6 9 6v12M3 21h18M9 21v-6h6v6M9 12h.01M15 12h.01'],
  inventory: ['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12'],
  stock: ['M3 3v18h18M7 14l4-4 4 4 6-6'],
  barcode: ['M3 5v14M6 5v14M9 5v14M12 5v14M15 5v14M18 5v14M21 5v14'],
  qrCode: ['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14h1v1M14 20h1v1M20 20h1v1'],

  // ─── Catalog ──────────────────────────────────────────────
  product: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01'],
  shirt: ['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'],
  shoe: ['M2 16h20l-2-7H10L8 4H2v12zM2 16a2 2 0 002 2h16a2 2 0 002-2'],
  star: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  heart: ['M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z'],
  bookmark: ['M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z'],
  image: ['M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21'],
  photo: ['M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21'],
  camera: ['M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h3l2-3h8l2 3h3a2 2 0 012 2v11zM12 17a4 4 0 100-8 4 4 0 000 8z'],
  video: ['M23 7l-7 5 7 5V7zM1 5h15v14H1a2 2 0 01-2-2V7a2 2 0 012-2z'],
  file: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6'],
  folder: ['M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z'],
  layers: ['M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'],
  grid: ['M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'],
  list: ['M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'],
  columns: ['M12 3h8a2 2 0 012 2v14a2 2 0 01-2 2h-8M3 5a2 2 0 012-2h4v18H5a2 2 0 01-2-2V5z'],
  kanban: ['M3 4a2 2 0 012-2h4a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4zM13 4a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2h-4a2 2 0 01-2-2V4z'],
  category: ['M20 7h-9M14 17H5M20 7l-3-3M20 7l-3 3M5 17l3-3M5 17l3 3'],
  collection: ['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
  brand: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  variant: ['M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5'],

  // ─── People ───────────────────────────────────────────────
  user: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z'],
  users: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 4M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75'],
  userPlus: ['M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 7a4 4 0 100 4M20 8v6M23 11h-6'],
  userCheck: ['M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 7a4 4 0 100 4M17 11l2 2 4-4'],
  userX: ['M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 7a4 4 0 100 4M18 8l6 6M24 8l-6 6'],
  contact: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z'],
  customer: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z'],
  admin: ['M12 22a10 10 0 100-20 10 10 0 000 20zM12 8v4M12 16h.01'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  crown: ['M2 18h20M3 6l5 5 4-7 4 7 5-5-2 12H5L3 6z'],
  avatar: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z'],
  profile: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z'],
  group: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 4M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75'],

  // ─── Communication ────────────────────────────────────────
  bell: ['M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0'],
  bellOff: ['M13.73 21a2 2 0 01-3.46 0M18.63 13A17.89 17.89 0 0118 8M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14M18 8a6 6 0 00-9.33-5M1 1l22 22'],
  mail: ['M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 7l-10 7L2 7'],
  message: ['M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z'],
  chat: ['M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z'],
  phone: ['M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z'],
  send: ['M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z'],
  reply: ['M9 17l-5-5 5-5M4 12h11a4 4 0 014 4v4'],
  forward: ['M15 17l5-5-5-5M20 12H9a4 4 0 00-4 4v4'],
  inbox: ['M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z'],
  at: ['M12 2a10 10 0 100 20 10 10 0 005-1M12 16a4 4 0 100-8 4 4 0 000 8zM22 12c0 4-2 7-5 7s-3-3-3-7V8a3 3 0 016 0'],

  // ─── Analytics ────────────────────────────────────────────
  chart: ['M3 3v18h18M7 14l4-4 4 4 6-6'],
  barChart: ['M12 20V10M18 20V4M6 20v-6'],
  lineChart: ['M3 3v18h18M7 14l4-4 4 4 6-6'],
  pieChart: ['M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10l8.21 3.79z'],
  donutChart: ['M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10l8.21 3.79zM12 8a4 4 0 100 8 4 4 0 000-8z'],
  trending: ['M23 6l-9.5 9.5-5-5L1 18M17 6h6v6'],
  trendingUp: ['M23 6l-9.5 9.5-5-5L1 18M17 6h6v6'],
  trendingDown: ['M23 18l-9.5-9.5-5 5L1 6M17 18h6v-6'],
  activity: ['M22 12h-4l-3 9L9 3l-3 9H2'],
  gauge: ['M12 14l4-4M3 12a9 9 0 1118 0'],
  target: ['M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z'],
  goal: ['M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z'],
  flag: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7'],
  award: ['M12 15a7 7 0 100-14 7 7 0 000 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  trophy: ['M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0012 0V2z'],

  // ─── Settings / system ───────────────────────────────────
  settings: ['M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z'],
  gear: ['M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z'],
  sliders: ['M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6'],
  toggle: ['M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6'],
  switch: ['M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6'],
  lock: ['M5 11h14v10H5zM8 11V7a4 4 0 018 0v4'],
  unlock: ['M5 11h14v10H5zM8 11V7a4 4 0 018 0'],
  key: ['M21 2l-2 2M15 8l3-3M19 6l-2 2M14 5a6 6 0 11-8 8M11 8l-7 7M9 10l-1 1M7 12l-1 1M5 14l-1 1'],
  fingerprint: ['M12 11a2 2 0 00-2 2c0 1.02-.1 2.51-.26 4M16 12a4 4 0 00-4-4M8 22c.5-3 1-5 1-7M2 12c0-2.72.99-5.2 2.62-7.1M22 20c-.46-2.28-1-4.5-1-6 0-2.21-1.79-4-4-4M9.32 5.65A6 6 0 0118 12c0 .75.06 1.5.16 2.25'],
  password: ['M21 2l-2 2M15 8l3-3M19 6l-2 2M14 5a6 6 0 11-8 8M11 8l-7 7M9 10l-1 1M7 12l-1 1M5 14l-1 1'],
  api: ['M4 17l6-6-6-6M12 19h8'],
  webhook: ['M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 012 16c.01-.94.59-1.94 1.34-2.49M7.5 4.21a4 4 0 015.66 5.66M9 22l1.99-3.98M15.34 14.66l-1.99 3.98M16 4a4 4 0 011.66 7.62'],
  integration: ['M14 4a2 2 0 00-4 0v10.54a4 4 0 104 0V4z'],
  plug: ['M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 01-4 4h-4a4 4 0 01-4-4V8h12z'],
  puzzle: ['M14 4a2 2 0 00-4 0v6H4a2 2 0 000 4h6v6a2 2 0 104 0v-6h6a2 2 0 000-4h-6V4z'],
  database: ['M12 2C6.48 2 2 3.79 2 6s4.48 4 10 4 10-1.79 10-4-4.48-4-10-4zM2 6v6c0 2.21 4.48 4 10 4s10-1.79 10-4V6M2 12v6c0 2.21 4.48 4 10 4s10-1.79 10-4v-6'],
  server: ['M2 2h20v6H2zM2 16h20v6H2zM6 6h.01M6 20h.01'],
  cloud: ['M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z'],
  globe: ['M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z'],
  language: ['M5 8h14M9 3v3M7 21l5-12 5 12M12 8v4'],
  moon: ['M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'],
  sun: ['M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'],
  monitor: ['M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2zM2 20h20'],
  theme: ['M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'],

  // ─── SEO / content ───────────────────────────────────────
  seo: ['M25 4a13 13 0 11-3.85 9.15M21 4l-9 9M14 4l-9 9M4 11l-2-2'],
  searchEngine: ['M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5M11 7v4M9 9h4'],
  google: ['M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10c5.1 0 9.34-3.82 9.94-8.76'],
  analytics: ['M3 3v18h18M7 14l4-4 4 4 6-6'],
  link: ['M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71'],
  unlink: ['M17.7 7.7a2.5 2.5 0 113.6 3.5l-1.5 1.5M2.7 12.3l1.5-1.5a2.5 2.5 0 013.6 0M14.5 9.5L9.5 14.5M9.5 4.5l-2 2M16.5 14.5l2 2M22 22L2 2'],
  chain: ['M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71'],
  meta: ['M2 4l6 16 4-10 4 10 6-16'],
  tagSeo: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01'],
  robot: ['M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M9 12h.01M15 12h.01M8 20V8M16 20V8M3 16a4 4 0 004 4M21 16a4 4 0 01-4 4M3 8a4 4 0 014-4M21 8a4 4 0 00-4-4'],
  spider: ['M12 2a4 4 0 014 4M12 2a4 4 0 00-4 4M8 6a4 4 0 108 0M12 6v8M4 8l4 2M20 8l-4 2M4 12l4 1M20 12l-4 1M4 16l4-1M20 16l-4-1M3 20l5-2M21 20l-5-2M9 14a3 3 0 006 0'],
  sitemap: ['M3 12h6M9 12a3 3 0 100 6M15 12h6M15 12a3 3 0 110 6M9 18h6M12 6v6M9 6h6'],
  rss: ['M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M6 19a1 1 0 100-2 1 1 0 000 2z'],
  feed: ['M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M6 19a1 1 0 100-2 1 1 0 000 2z'],

  // ─── Misc ─────────────────────────────────────────────────
  book: ['M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z'],
  docs: ['M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15zM8 7h8M8 11h6'],
  about: ['M12 22a10 10 0 100-20 10 10 0 000 20zM12 16v-4M12 8h.01'],
  fire: ['M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z'],
  sparkles: ['M12 3l1.91 5.91L20 11l-6.09 2.09L12 19l-1.91-5.91L4 11l6.09-2.09L12 3zM19 3l.7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7L19 3zM5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15z'],
  magic: ['M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.936A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.963 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.581a.5.5 0 010 .964L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.963 0z'],
  wand: ['M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M15 9h0M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5'],
  location: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z'],
  mapPin: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z'],
  navigation: ['M3 11l19-9-9 19-2-8-8-2z'],
  compass: ['M12 22a10 10 0 100-20 10 10 0 000 20zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z'],
  power: ['M18.36 6.64a9 9 0 11-12.73 0M12 2v10'],
  logout: ['M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9'],
  login: ['M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3'],
  session: ['M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9'],
  history: ['M3 3v5h5M3.05 13A9 9 0 1012 3.05M3 3l4 4M12 7v5l4 2'],
  undo: ['M9 14L4 9l5-5M4 9h11a5 5 0 010 10h-2'],
  redo: ['M15 14l5-5-5-5M20 9H9a5 5 0 000 10h2'],
  revert: ['M3 12a9 9 0 109-9 9.74 9.74 0 00-6.74 2.74L3 8M3 3v5h5'],
  compare: ['M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5'],
  diff: ['M12 3v6M9 6h6M5 21l4-9 4 9M3 21h12M14 15h4M14 18h7'],
  version: ['M3 12a9 9 0 109-9 9.74 9.74 0 00-6.74 2.74L3 8M3 3v5h5'],
  attachment: ['M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48'],
  paperclip: ['M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48'],
  link2: ['M9 17H7A5 5 0 017 7h2M15 7h2a5 5 0 010 10h-2M8 12h8'],
  emoji: ['M12 22a10 10 0 100-20 10 10 0 000 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01'],
  smile: ['M12 22a10 10 0 100-20 10 10 0 000 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01'],
  mood: ['M12 22a10 10 0 100-20 10 10 0 000 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01'],
  wifi: ['M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01'],
  bluetooth: ['M7 7l10 10-5 5V2l5 5L7 17'],
  signal: ['M2 22h20M2 18l4-4M2 14l8-8M2 10l12-12'],
  pause: ['M6 4h4v16H6zM14 4h4v16h-4z'],
  play: ['M5 3l14 9-14 9V3z'],
  stop: ['M6 6h12v12H6z'],
  record: ['M12 9a3 3 0 100 6 3 3 0 000-6z'],
  volume: ['M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07'],
  mute: ['M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6'],
};

/* =========================================================== */
/* Icon component                                               */
/* =========================================================== */

export interface IconProps {
  /** Icon name — see IconName union for the full list. */
  name: IconName;
  /** Square dimension in px. Defaults to 16. */
  size?: number;
  /** Stroke color. Defaults to `currentColor` (inherits from parent). */
  color?: string;
  /** Stroke width. Defaults to 1.75 — tune down to 1.5 for larger sizes. */
  strokeWidth?: number;
  /** Fill. Icons are outline-only by default; set to a color to fill. */
  fill?: string;
  /** Extra class names. */
  className?: string;
  /** Inline style overrides. */
  style?: CSSProperties;
  /** Accessible label. If omitted, icon is `aria-hidden`. */
  'aria-label'?: string;
  /** Whether to mark this icon as decorative (default: true if no aria-label). */
  decorative?: boolean;
}

export function Icon({
  name,
  size = 16,
  color = 'currentColor',
  strokeWidth = 1.75,
  fill = 'none',
  className,
  style,
  'aria-label': ariaLabel,
  decorative,
}: IconProps) {
  const paths = ICON_PATHS[name] || ICON_PATHS.question;
  const isDecorative = decorative ?? !ariaLabel;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      role={isDecorative ? undefined : 'img'}
      aria-hidden={isDecorative ? true : undefined}
      aria-label={ariaLabel}
      focusable="false"
    >
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

/* =========================================================== */
/* Helper — list all icon names (used by showcase page)         */
/* =========================================================== */
export const ALL_ICON_NAMES: IconName[] = Object.keys(ICON_PATHS) as IconName[];

/* =========================================================== */
/* Backwards-compat aliases — keep old imports working          */
/* =========================================================== */
/** @deprecated Use <Icon name="x" /> instead. Kept for backwards compat. */
export function CloseIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return <Icon name="x" size={size} color={color} />;
}

/** @deprecated Use <Icon name="chevronDown" /> instead. Kept for backwards compat. */
export function ChevronDown({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return <Icon name="chevronDown" size={size} color={color} />;
}

/** @deprecated Use <Icon name="plus" /> instead. Kept for backwards compat. */
export function PlusIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return <Icon name="plus" size={size} color={color} />;
}

/** @deprecated Use <Icon name="search" /> instead. Kept for backwards compat. */
export function SearchIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return <Icon name="search" size={size} color={color} />;
}
