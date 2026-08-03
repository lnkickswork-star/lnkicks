/**
 * LNKICKS Enterprise Admin — Copyright & Brand Compliance Center
 * ------------------------------------------------------------
 * Type system for the compliance module.
 *
 * Design philosophy:
 *  - Compliance is a *pre-publish* gate, not a post-publish audit
 *  - Every detected issue MUST have a human-readable explanation
 *    and an actionable recommendation (never auto-edit content)
 *  - Risk levels are deterministic given the same input; the engine
 *    is pure and side-effect free
 *  - Reports are immutable snapshots — once generated, they are
 *    saved with product history forever (audit trail)
 *
 * Architecture:
 *  - Types live here (storage-agnostic)
 *  - Detection engine lives in complianceEngine.ts (pure functions)
 *  - Mock data lives in complianceData.ts (swap for Firestore later)
 *  - Export utilities live in complianceExport.ts (CSV/XLSX/PDF)
 */

/* ------------------------------------------------------------------ */
/* Risk levels                                                         */
/* ------------------------------------------------------------------ */

export type RiskLevel = 'low' | 'medium' | 'high' | 'very_high';

export const RISK_LEVEL_META: Record<
  RiskLevel,
  { label: string; shortLabel: string; tone: 'success' | 'info' | 'warning' | 'critical'; color: string; range: string }
> = {
  low: { label: 'Low Risk', shortLabel: 'Low', tone: 'success', color: '#15803D', range: '80–100' },
  medium: { label: 'Medium Risk', shortLabel: 'Medium', tone: 'info', color: '#1D4ED8', range: '60–79' },
  high: { label: 'High Risk', shortLabel: 'High', tone: 'warning', color: '#B45309', range: '40–59' },
  very_high: { label: 'Very High Risk', shortLabel: 'Very High', tone: 'critical', color: '#B91C1C', range: '0–39' },
};

/* ------------------------------------------------------------------ */
/* Issue taxonomy                                                      */
/* ------------------------------------------------------------------ */

export type IssueCategory =
  | 'trademark'        // brand name references that may need authorization
  | 'image'            // logos, watermarks, marketing artwork
  | 'seo'              // keyword stuffing, duplicates, thin content
  | 'content_quality'  // grammar, readability, formatting
  | 'policy';          // reseller auth, prohibited claims, etc.

export const ISSUE_CATEGORY_META: Record<
  IssueCategory,
  { label: string; icon: string; description: string }
> = {
  trademark: {
    label: 'Trademark',
    icon: 'shield',
    description: 'References to registered brand names that may require authorization or attribution.',
  },
  image: {
    label: 'Image Review',
    icon: 'image',
    description: 'Logos, watermarks, marketing artwork, screenshots, or edited promotional material.',
  },
  seo: {
    label: 'SEO Review',
    icon: 'search',
    description: 'Keyword stuffing, duplicate meta, thin content, broken structured data.',
  },
  content_quality: {
    label: 'Content Quality',
    icon: 'edit',
    description: 'Grammar, readability, formatting, missing specifications, duplicate text.',
  },
  policy: {
    label: 'Policy',
    icon: 'alertTriangle',
    description: 'Reseller authorization, prohibited claims, marketplace policy concerns.',
  },
};

export type IssueSeverity = 'info' | 'warning' | 'critical';

export const SEVERITY_META: Record<
  IssueSeverity,
  { label: string; tone: 'info' | 'warning' | 'critical'; color: string; weight: number }
> = {
  info: { label: 'Info', tone: 'info', color: '#1D4ED8', weight: 3 },
  warning: { label: 'Warning', tone: 'warning', color: '#B45309', weight: 8 },
  critical: { label: 'Critical', tone: 'critical', color: '#B91C1C', weight: 18 },
};

/* ------------------------------------------------------------------ */
/* Product fields under scan                                           */
/* ------------------------------------------------------------------ */

export type ProductFieldType =
  | 'title'
  | 'description'
  | 'metaTitle'
  | 'metaDescription'
  | 'altText'
  | 'fileName'
  | 'tags'
  | 'collections'
  | 'seoContent'
  | 'bannerCopy';

export const FIELD_LABELS: Record<ProductFieldType, string> = {
  title: 'Product Title',
  description: 'Product Description',
  metaTitle: 'Meta Title',
  metaDescription: 'Meta Description',
  altText: 'Image Alt Text',
  fileName: 'File Name',
  tags: 'Tags',
  collections: 'Collections',
  seoContent: 'SEO Content',
  bannerCopy: 'Promotional Banner',
};

/* ------------------------------------------------------------------ */
/* Trademark registry                                                  */
/* ------------------------------------------------------------------ */

export interface TrademarkEntry {
  /** Canonical brand name (e.g. "Nike") */
  brand: string;
  /** All string variants the scanner should match (lowercased) */
  variants: string[];
  /** IP owner / rights holder */
  ipOwner: string;
  /** Brand category */
  category: 'footwear' | 'apparel' | 'lifestyle' | 'tech' | 'general';
  /** Why a reference may require review */
  guidance: string;
  /** Whether the platform currently holds an authorized-reseller agreement */
  authorizationStatus: 'authorized' | 'unauthorized' | 'pending' | 'unknown';
}

/* ------------------------------------------------------------------ */
/* Detection outputs                                                   */
/* ------------------------------------------------------------------ */

export interface TrademarkHit {
  brand: string;
  field: ProductFieldType;
  snippet: string;
  ipOwner: string;
  guidance: string;
  authorizationStatus: TrademarkEntry['authorizationStatus'];
}

export type ImageIssueType =
  | 'large_logo'
  | 'watermark'
  | 'marketing_artwork'
  | 'brand_graphic'
  | 'screenshot'
  | 'edited_material'
  | 'low_resolution'
  | 'missing_alt'
  | 'unauthorized_photography';

export interface ImageFlag {
  imageUrl: string;
  imageAlt: string;
  issue: ImageIssueType;
  severity: IssueSeverity;
  explanation: string;
  recommendation: string;
}

export type SeoIssueType =
  | 'keyword_stuffing'
  | 'misleading_title'
  | 'duplicate_description'
  | 'duplicate_meta'
  | 'thin_content'
  | 'broken_structured_data'
  | 'missing_alt'
  | 'missing_meta'
  | 'title_too_long'
  | 'title_too_short';

export interface SeoFlag {
  field: ProductFieldType;
  issue: SeoIssueType;
  severity: IssueSeverity;
  explanation: string;
  recommendation: string;
  metric?: string;
}

export type ContentIssueType =
  | 'grammar'
  | 'readability'
  | 'formatting'
  | 'duplicate_text'
  | 'incomplete_info'
  | 'missing_specs';

export interface ContentFlag {
  field: ProductFieldType;
  issue: ContentIssueType;
  severity: IssueSeverity;
  explanation: string;
  recommendation: string;
  metric?: string;
}

/* ------------------------------------------------------------------ */
/* Unified compliance issue (rolled-up view)                          */
/* ------------------------------------------------------------------ */

export interface ComplianceIssue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  field: ProductFieldType;
  fieldLabel: string;
  snippet: string;
  explanation: string;
  recommendation: string;
  ruleId: string;
}

/* ------------------------------------------------------------------ */
/* Scan result — the immutable report                                 */
/* ------------------------------------------------------------------ */

export type PublishRecommendation =
  | 'publish'                // safe to publish
  | 'review_then_publish'    // admin should review but can proceed
  | 'do_not_publish';        // hard block — critical IP risk

export interface ComplianceScanResult {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productBrand: string;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  /** 0–100, higher = safer / lower risk */
  score: number;
  riskLevel: RiskLevel;
  recommendation: PublishRecommendation;
  fieldsScanned: number;
  imagesScanned: number;
  issues: ComplianceIssue[];
  trademarkHits: TrademarkHit[];
  imageFlags: ImageFlag[];
  seoFlags: SeoFlag[];
  contentFlags: ContentFlag[];
  /** Auto-generated executive summary (1–3 sentences) */
  summary: string;
  /** Suggested next steps, ordered by priority */
  nextSteps: string[];
}

/* ------------------------------------------------------------------ */
/* Product under compliance review                                    */
/* ------------------------------------------------------------------ */

export type ComplianceProductStatus =
  | 'draft'
  | 'in_review'
  | 'pending_publish'
  | 'published'
  | 'blocked'
  | 'rejected';

export interface ComplianceProduct {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  status: ComplianceProductStatus;
  price: number;
  createdAt: number;
  updatedAt: number;
  authorName: string;
  authorRole: string;
  fields: {
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    altText: string;
    fileName: string;
    tags: string[];
    collections: string[];
    seoContent: string;
    bannerCopy: string;
  };
  images: ComplianceProductImage[];
  /** Most recent scan id (if any) */
  lastScanId?: string;
  lastScannedAt?: number;
  lastRiskLevel?: RiskLevel;
  lastScore?: number;
}

export interface ComplianceProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  /** Heuristic flags precomputed for the demo (in real life the engine
   *  would call a vision API; here we simulate it) */
  hints: Partial<Record<ImageIssueType, boolean>>;
}

/* ------------------------------------------------------------------ */
/* Compliance history (audit trail)                                   */
/* ------------------------------------------------------------------ */

export type ComplianceHistoryAction =
  | 'scan_run'
  | 'warning_resolved'
  | 'warning_dismissed'
  | 'product_published'
  | 'product_blocked'
  | 'report_exported'
  | 'rule_updated';

export interface ComplianceHistoryEntry {
  id: string;
  scanId?: string;
  productId: string;
  productName: string;
  productSku: string;
  timestamp: number;
  actorName: string;
  actorRole: string;
  action: ComplianceHistoryAction;
  riskLevel?: RiskLevel;
  score?: number;
  notes?: string;
  /** For warning_resolved / dismissed — which rule was acted on */
  ruleId?: string;
}

/* ------------------------------------------------------------------ */
/* Dashboard KPIs                                                     */
/* ------------------------------------------------------------------ */

export interface ComplianceKPI {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  delta: number;
  deltaLabel: string;
  tone: 'positive' | 'negative' | 'neutral';
  icon: string;
  accent: string;
}

export interface ComplianceScoreTrendPoint {
  date: string;       // ISO date
  label: string;      // 'Aug 1'
  score: number;      // average compliance score that day
  scans: number;      // number of scans run that day
  blocked: number;    // number of products blocked
}
