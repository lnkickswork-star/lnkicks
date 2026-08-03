/**
 * LNKICKS Enterprise Admin — Copyright & Brand Compliance Engine
 * ------------------------------------------------------------
 * Pure detection functions that analyze a ComplianceProduct and
 * return structured issues across five categories:
 *
 *   1. Trademark    — registered brand name references
 *   2. Image        — logos, watermarks, marketing artwork, screenshots
 *   3. SEO          — keyword stuffing, duplicates, thin content
 *   4. Content      — grammar, readability, formatting, missing specs
 *   5. Policy       — replica/counterfeit claims, prohibited phrasing
 *
 * The engine is deterministic: same input always produces the same
 * output. It performs NO content modification — only detection and
 * recommendation. Every issue carries a human-readable explanation
 * and an actionable recommendation.
 *
 * Scoring:
 *   - Start at 100
 *   - Subtract severity-weighted penalties
 *   - Floor at 0
 *   - Risk level derived from score bands
 */

import type {
  ComplianceProduct,
  ComplianceScanResult,
  ComplianceIssue,
  TrademarkHit,
  ImageFlag,
  SeoFlag,
  ContentFlag,
  RiskLevel,
  PublishRecommendation,
  IssueSeverity,
  ProductFieldType,
} from './complianceTypes';
import { SEVERITY_META, RISK_LEVEL_META } from './complianceTypes';
import { TRADEMARK_REGISTRY } from './complianceData';

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

let _idSeq = 0;
function nextId(prefix: string): string {
  _idSeq += 1;
  return `${prefix}-${Date.now().toString(36)}-${_idSeq}`;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findSnippet(text: string, needle: string, radius = 40): string {
  if (!text || !needle) return '';
  const idx = text.toLowerCase().indexOf(needle.toLowerCase());
  if (idx === -1) return '';
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + needle.length + radius);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  return prefix + text.slice(start, end).trim() + suffix;
}

function words(s: string): string[] {
  return (s || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(w => w.length > 0);
}

function wordCount(s: string): number {
  return words(s).length;
}

function sentenceCount(s: string): number {
  if (!s) return 0;
  const matches = s.match(/[.!?]+(\s|$)/g);
  return matches ? matches.length : (s.trim() ? 1 : 0);
}

/* ------------------------------------------------------------------ */
/* 1. Trademark detection                                              */
/* ------------------------------------------------------------------ */

const FIELD_TEXTS: Array<{ field: ProductFieldType; getter: (p: ComplianceProduct) => string }> = [
  { field: 'title',         getter: p => p.fields.title },
  { field: 'description',   getter: p => p.fields.description },
  { field: 'metaTitle',     getter: p => p.fields.metaTitle },
  { field: 'metaDescription', getter: p => p.fields.metaDescription },
  { field: 'altText',       getter: p => p.fields.altText },
  { field: 'fileName',      getter: p => p.fields.fileName },
  { field: 'seoContent',    getter: p => p.fields.seoContent },
  { field: 'bannerCopy',    getter: p => p.fields.bannerCopy },
];

export function detectTrademarks(product: ComplianceProduct): TrademarkHit[] {
  const hits: TrademarkHit[] = [];
  const seen = new Set<string>(); // dedupe (brand+field)

  for (const { field, getter } of FIELD_TEXTS) {
    const text = getter(product);
    if (!text) continue;
    for (const entry of TRADEMARK_REGISTRY) {
      for (const variant of entry.variants) {
        const re = new RegExp(`\\b${escapeRegex(variant)}\\b`, 'i');
        if (re.test(text)) {
          const key = `${entry.brand}|${field}`;
          if (seen.has(key)) break;
          seen.add(key);
          hits.push({
            brand: entry.brand,
            field,
            snippet: findSnippet(text, variant),
            ipOwner: entry.ipOwner,
            guidance: entry.guidance,
            authorizationStatus: entry.authorizationStatus,
          });
          break; // move to next brand
        }
      }
    }
  }

  // Also scan tags & collections (arrays)
  const arrayFields: Array<{ field: ProductFieldType; items: string[] }> = [
    { field: 'tags', items: product.fields.tags },
    { field: 'collections', items: product.fields.collections },
  ];
  for (const { field, items } of arrayFields) {
    for (const item of items) {
      for (const entry of TRADEMARK_REGISTRY) {
        const key = `${entry.brand}|${field}`;
        if (seen.has(key)) continue;
        for (const variant of entry.variants) {
          const re = new RegExp(`\\b${escapeRegex(variant)}\\b`, 'i');
          if (re.test(item)) {
            seen.add(key);
            hits.push({
              brand: entry.brand,
              field,
              snippet: item,
              ipOwner: entry.ipOwner,
              guidance: entry.guidance,
              authorizationStatus: entry.authorizationStatus,
            });
            break;
          }
        }
      }
    }
  }

  return hits;
}

/* ------------------------------------------------------------------ */
/* 2. Image review (heuristic — simulates a vision API)               */
/* ------------------------------------------------------------------ */

const IMAGE_ISSUE_MESSAGES: Record<
  ImageFlag['issue'],
  { explanation: string; recommendation: string; severity: IssueSeverity }
> = {
  large_logo: {
    explanation: 'A large brand logo is visible in this image. Large logos typically indicate the use of brand-owned marketing photography, which may require licensing.',
    recommendation: 'Replace with original product photography shot by your team, or use a clean product-on-white image where the brand logo is incidental rather than the focal point.',
    severity: 'warning',
  },
  watermark: {
    explanation: 'A watermark from another retailer, photographer, or brand was detected. Watermarked images are typically copyrighted and not authorized for reuse.',
    recommendation: 'Remove this image and replace with an original photograph or one for which you hold a written usage license.',
    severity: 'critical',
  },
  marketing_artwork: {
    explanation: 'This image appears to be brand-owned marketing artwork (campaign poster, lookbook shot, or promotional graphic). Such assets are typically protected by copyright and trademark law.',
    recommendation: 'Use original product photography instead. If you have a written license from the brand, attach it to the product record before publishing.',
    severity: 'critical',
  },
  brand_graphic: {
    explanation: 'A brand-owned graphic element (such as a brand pattern, motif, or design mark) appears prominently in this image.',
    recommendation: 'Crop or replace the image to remove the protected graphic, or use an image where the brand mark is incidental.',
    severity: 'warning',
  },
  screenshot: {
    explanation: 'This image appears to be a screenshot (likely from another retailer, social media, or brand site). Screenshots typically carry the copyright of the original source.',
    recommendation: 'Replace with an original photograph. Screenshots are not suitable for product listings.',
    severity: 'warning',
  },
  edited_material: {
    explanation: 'This image appears to be edited or altered marketing material. Edited brand materials can still infringe on the original copyright and trademark.',
    recommendation: 'Replace with original product photography. Avoid using edited versions of brand marketing assets.',
    severity: 'critical',
  },
  low_resolution: {
    explanation: 'This image is low-resolution, which may indicate it was sourced from a third party (rather than captured at high resolution by your team). Low-resolution images also degrade the product page experience.',
    recommendation: 'Upload a high-resolution image (at least 1000×1000px) captured by your team or licensed for use.',
    severity: 'info',
  },
  missing_alt: {
    explanation: 'This image has no alt text. Alt text is required for accessibility (WCAG 2.1 AA) and contributes to SEO. Missing alt text also makes it harder to verify image attribution.',
    recommendation: 'Add a descriptive alt text that explains what is shown in the image (e.g. "Adidas Samba OG white leather sneaker, side profile, on neutral background").',
    severity: 'warning',
  },
  unauthorized_photography: {
    explanation: 'This image may have been sourced from a brand site, retailer, or social media without authorization. Unauthorized use of third-party photography is a copyright infringement.',
    recommendation: 'Verify the source of this image. If you do not have a written license, replace it with original photography.',
    severity: 'critical',
  },
};

export function analyzeImages(product: ComplianceProduct): ImageFlag[] {
  const flags: ImageFlag[] = [];
  for (const img of product.images) {
    // Missing alt text — always check
    if (!img.alt || img.alt.trim().length === 0) {
      const meta = IMAGE_ISSUE_MESSAGES.missing_alt;
      flags.push({
        imageUrl: img.url,
        imageAlt: img.alt,
        issue: 'missing_alt',
        severity: meta.severity,
        explanation: meta.explanation,
        recommendation: meta.recommendation,
      });
    }
    // Low resolution
    if (img.width < 800 || img.height < 800) {
      const meta = IMAGE_ISSUE_MESSAGES.low_resolution;
      flags.push({
        imageUrl: img.url,
        imageAlt: img.alt,
        issue: 'low_resolution',
        severity: meta.severity,
        explanation: `${meta.explanation} (Detected: ${img.width}×${img.height}px)`,
        recommendation: meta.recommendation,
      });
    }
    // Hint-driven flags (simulating a vision API)
    for (const k of Object.keys(img.hints) as Array<keyof typeof img.hints>) {
      if (!img.hints[k]) continue;
      if (k === 'missing_alt' || k === 'low_resolution') continue; // already handled
      const meta = IMAGE_ISSUE_MESSAGES[k];
      flags.push({
        imageUrl: img.url,
        imageAlt: img.alt,
        issue: k,
        severity: meta.severity,
        explanation: meta.explanation,
        recommendation: meta.recommendation,
      });
    }
  }
  return flags;
}

/* ------------------------------------------------------------------ */
/* 3. SEO review                                                       */
/* ------------------------------------------------------------------ */

const SEO_ISSUE_MESSAGES: Record<
  SeoFlag['issue'],
  { explanation: string; recommendation: string; severity: IssueSeverity }
> = {
  keyword_stuffing: {
    explanation: 'A keyword or brand name is repeated excessively in this field. Search engines may penalize the page for keyword stuffing, and the repetition looks unnatural to shoppers.',
    recommendation: 'Reduce repetition. Use the primary keyword at most 2–3 times in the description, and vary related terms naturally.',
    severity: 'warning',
  },
  misleading_title: {
    explanation: 'The title contains words like "replica", "fake", "copy", "lookalike", or "dupe" which mislead shoppers about authenticity and may violate marketplace policies.',
    recommendation: 'Remove replica/counterfeit language. Only list authentic products with verifiable sourcing.',
    severity: 'critical',
  },
  duplicate_description: {
    explanation: 'The product description appears to be copied from another retailer or the brand\'s official site. Duplicate content is deprioritized by search engines and may infringe on the original copyright.',
    recommendation: 'Rewrite the description in your own words. Use original product photography to further differentiate the listing.',
    severity: 'warning',
  },
  duplicate_meta: {
    explanation: 'The meta description is identical or near-identical to the meta description of another product. This dilutes search visibility across the catalog.',
    recommendation: 'Write a unique meta description (140–160 characters) for this product that highlights its specific value proposition.',
    severity: 'warning',
  },
  thin_content: {
    explanation: 'This field has very little content. Thin content pages rank poorly in search results and provide limited value to shoppers.',
    recommendation: 'Expand the content with at least 2–3 paragraphs of original, descriptive copy. Include materials, sizing, and care information.',
    severity: 'warning',
  },
  broken_structured_data: {
    explanation: 'Structured data (schema.org JSON-LD) is missing or malformed. Search engines use this data to display rich snippets (price, availability, reviews) in search results.',
    recommendation: 'Add a Product schema.org JSON-LD block with name, image, price, availability, and brand fields.',
    severity: 'info',
  },
  missing_alt: {
    explanation: 'One or more product images are missing alt text. Alt text is required for accessibility and contributes to image SEO.',
    recommendation: 'Add descriptive alt text to every product image.',
    severity: 'warning',
  },
  missing_meta: {
    explanation: 'This product has no meta description. Search engines will auto-generate a snippet, often poorly.',
    recommendation: 'Write a meta description of 140–160 characters that summarizes the product and includes the primary keyword.',
    severity: 'warning',
  },
  title_too_long: {
    explanation: 'The meta title exceeds 60 characters. Search engines typically truncate titles beyond 60 chars in results.',
    recommendation: 'Trim the meta title to under 60 characters, keeping the primary keyword near the start.',
    severity: 'info',
  },
  title_too_short: {
    explanation: 'The meta title is under 30 characters. Short titles underutilize search-result real estate.',
    recommendation: 'Expand the meta title to 50–60 characters including the primary keyword and brand.',
    severity: 'info',
  },
};

const REPLICA_TERMS = ['replica', 'fake', 'copy', 'lookalike', 'dupe', 'counterfeit', 'knockoff', '1:1', 'aaa quality', 'first copy'];

export function analyzeSeo(product: ComplianceProduct): SeoFlag[] {
  const flags: SeoFlag[] = [];
  const f = product.fields;

  // Keyword stuffing — check title, description, seoContent
  const stuffFields: Array<{ field: ProductFieldType; text: string }> = [
    { field: 'title', text: f.title },
    { field: 'description', text: f.description },
    { field: 'seoContent', text: f.seoContent },
  ];
  for (const { field, text } of stuffFields) {
    if (!text) continue;
    // Find any word/phrase repeated 4+ times
    const tokens = words(text);
    const freq = new Map<string, number>();
    for (const t of tokens) {
      if (t.length < 4) continue; // skip short words
      freq.set(t, (freq.get(t) ?? 0) + 1);
    }
    let worst = { word: '', count: 0 };
    for (const [word, count] of freq) {
      if (count > worst.count) worst = { word, count };
    }
    if (worst.count >= 4) {
      const meta = SEO_ISSUE_MESSAGES.keyword_stuffing;
      flags.push({
        field,
        issue: 'keyword_stuffing',
        severity: meta.severity,
        explanation: `${meta.explanation} (Detected: "${worst.word}" appears ${worst.count} times)`,
        recommendation: meta.recommendation,
        metric: `"${worst.word}" × ${worst.count}`,
      });
    }
  }

  // Misleading title — replica terms in title/description/banner
  for (const { field, text } of stuffFields) {
    if (!text) continue;
    const lower = text.toLowerCase();
    const hit = REPLICA_TERMS.find(t => lower.includes(t));
    if (hit) {
      const meta = SEO_ISSUE_MESSAGES.misleading_title;
      flags.push({
        field,
        issue: 'misleading_title',
        severity: meta.severity,
        explanation: `${meta.explanation} (Detected: "${hit}")`,
        recommendation: meta.recommendation,
        metric: hit,
      });
    }
  }

  // Thin content — description under 30 words
  if (wordCount(f.description) < 30 && f.description.length > 0) {
    const meta = SEO_ISSUE_MESSAGES.thin_content;
    flags.push({
      field: 'description',
      issue: 'thin_content',
      severity: meta.severity,
      explanation: `${meta.explanation} (Detected: ${wordCount(f.description)} words)`,
      recommendation: meta.recommendation,
      metric: `${wordCount(f.description)} words`,
    });
  }
  if (f.seoContent.length === 0) {
    const meta = SEO_ISSUE_MESSAGES.thin_content;
    flags.push({
      field: 'seoContent',
      issue: 'thin_content',
      severity: meta.severity,
      explanation: 'SEO content field is empty. Without supporting copy, the product page will rank poorly in search results.',
      recommendation: meta.recommendation,
      metric: '0 words',
    });
  }

  // Missing meta description
  if (!f.metaDescription || f.metaDescription.trim().length === 0) {
    const meta = SEO_ISSUE_MESSAGES.missing_meta;
    flags.push({
      field: 'metaDescription',
      issue: 'missing_meta',
      severity: meta.severity,
      explanation: meta.explanation,
      recommendation: meta.recommendation,
    });
  }

  // Meta title length
  if (f.metaTitle) {
    const len = f.metaTitle.length;
    if (len > 60) {
      const meta = SEO_ISSUE_MESSAGES.title_too_long;
      flags.push({
        field: 'metaTitle',
        issue: 'title_too_long',
        severity: meta.severity,
        explanation: `${meta.explanation} (Detected: ${len} chars)`,
        recommendation: meta.recommendation,
        metric: `${len} chars`,
      });
    } else if (len < 30 && len > 0) {
      const meta = SEO_ISSUE_MESSAGES.title_too_short;
      flags.push({
        field: 'metaTitle',
        issue: 'title_too_short',
        severity: meta.severity,
        explanation: `${meta.explanation} (Detected: ${len} chars)`,
        recommendation: meta.recommendation,
        metric: `${len} chars`,
      });
    }
  }

  // Duplicate description — check for repeated phrases (3+ word phrases repeated)
  if (f.description.length > 100) {
    const desc = f.description.toLowerCase();
    const phrases = new Map<string, number>();
    const tokens = words(desc);
    for (let i = 0; i < tokens.length - 3; i++) {
      const phrase = tokens.slice(i, i + 4).join(' ');
      if (phrase.length < 12) continue;
      phrases.set(phrase, (phrases.get(phrase) ?? 0) + 1);
    }
    let hasDup = false;
    for (const [, count] of phrases) {
      if (count >= 2) { hasDup = true; break; }
    }
    if (hasDup) {
      const meta = SEO_ISSUE_MESSAGES.duplicate_description;
      flags.push({
        field: 'description',
        issue: 'duplicate_description',
        severity: meta.severity,
        explanation: meta.explanation,
        recommendation: meta.recommendation,
      });
    }
  }

  return flags;
}

/* ------------------------------------------------------------------ */
/* 4. Content quality                                                  */
/* ------------------------------------------------------------------ */

const CONTENT_ISSUE_MESSAGES: Record<
  ContentFlag['issue'],
  { explanation: string; recommendation: string; severity: IssueSeverity }
> = {
  grammar: {
    explanation: 'Potential grammar issue detected (capitalization or punctuation inconsistency). Poor grammar reduces shopper trust and brand authority.',
    recommendation: 'Proofread the content. Use sentence case for descriptions and title case for product titles. Ensure each sentence ends with proper punctuation.',
    severity: 'info',
  },
  readability: {
    explanation: 'The content is difficult to read (long sentences or run-on paragraphs). Shoppers scan product pages quickly — long blocks of text reduce comprehension.',
    recommendation: 'Break long sentences into shorter ones. Use paragraph breaks every 2–3 sentences. Add bullet points for key features.',
    severity: 'info',
  },
  formatting: {
    explanation: 'Formatting is inconsistent (mixed line endings, irregular spacing, or missing paragraph breaks). Inconsistent formatting looks unprofessional.',
    recommendation: 'Normalize whitespace, use consistent line breaks, and add paragraph breaks between logical sections.',
    severity: 'info',
  },
  duplicate_text: {
    explanation: 'The same phrase or sentence appears multiple times in this field. Duplicate text reduces readability and may indicate copy-pasted marketing material.',
    recommendation: 'Remove duplicate phrasing. Each sentence should add new information.',
    severity: 'warning',
  },
  incomplete_info: {
    explanation: 'Key product information is missing (e.g. materials, sizing, colorway). Missing information increases returns and customer support load.',
    recommendation: 'Add a "Specifications" section with materials, sizing, weight, colorway, and care instructions.',
    severity: 'warning',
  },
  missing_specs: {
    explanation: 'No specifications section detected. Specifications improve SEO and reduce pre-purchase questions.',
    recommendation: 'Add a structured specifications table: Upper, Outsole, Closure, Weight, Colorway, SKU.',
    severity: 'info',
  },
};

export function analyzeContent(product: ComplianceProduct): ContentFlag[] {
  const flags: ContentFlag[] = [];
  const f = product.fields;

  // Readability — average sentence length > 25 words = hard to read
  if (f.description) {
    const wc = wordCount(f.description);
    const sc = Math.max(1, sentenceCount(f.description));
    const avgLen = wc / sc;
    if (avgLen > 25 && wc > 30) {
      const meta = CONTENT_ISSUE_MESSAGES.readability;
      flags.push({
        field: 'description',
        issue: 'readability',
        severity: meta.severity,
        explanation: `${meta.explanation} (Avg sentence: ${Math.round(avgLen)} words)`,
        recommendation: meta.recommendation,
        metric: `${Math.round(avgLen)} wps`,
      });
    }
  }

  // Duplicate text — check for repeated sentences
  if (f.description) {
    const sentences = f.description.split(/[.!?]+/).map(s => s.trim().toLowerCase()).filter(s => s.length > 10);
    const seen = new Set<string>();
    let hasDup = false;
    for (const s of sentences) {
      if (seen.has(s)) { hasDup = true; break; }
      seen.add(s);
    }
    if (hasDup) {
      const meta = CONTENT_ISSUE_MESSAGES.duplicate_text;
      flags.push({
        field: 'description',
        issue: 'duplicate_text',
        severity: meta.severity,
        explanation: meta.explanation,
        recommendation: meta.recommendation,
      });
    }
  }

  // Incomplete info — description missing key terms
  if (f.description) {
    const lower = f.description.toLowerCase();
    const missing = [];
    if (!lower.includes('material') && !lower.includes('leather') && !lower.includes('mesh') && !lower.includes('suede') && !lower.includes('canvas')) {
      missing.push('materials');
    }
    if (!lower.includes('size') && !lower.includes('sizing')) missing.push('sizing');
    if (missing.length > 0) {
      const meta = CONTENT_ISSUE_MESSAGES.incomplete_info;
      flags.push({
        field: 'description',
        issue: 'incomplete_info',
        severity: meta.severity,
        explanation: `${meta.explanation} (Missing: ${missing.join(', ')})`,
        recommendation: meta.recommendation,
        metric: missing.join(', '),
      });
    }
  }

  // Missing specs
  const allText = `${f.description} ${f.seoContent}`.toLowerCase();
  if (!allText.includes('specifications') && !allText.includes('spec:') && !allText.includes('upper:') && !allText.includes('outsole:')) {
    const meta = CONTENT_ISSUE_MESSAGES.missing_specs;
    flags.push({
      field: 'description',
      issue: 'missing_specs',
      severity: meta.severity,
      explanation: meta.explanation,
      recommendation: meta.recommendation,
    });
  }

  // File name quality — generic file names like IMG_xxxx
  if (f.fileName) {
    const lower = f.fileName.toLowerCase();
    if (/^img[_-]/.test(lower) || /^dsc[_-]/.test(lower) || /^screenshot/.test(lower) || /\bmarketing\b/.test(lower) || /\bofficial\b/.test(lower)) {
      const meta = CONTENT_ISSUE_MESSAGES.formatting;
      flags.push({
        field: 'fileName',
        issue: 'formatting',
        severity: meta.severity,
        explanation: `The file name "${f.fileName}" suggests it may be a generic or marketing-sourced image. Descriptive file names improve SEO and asset management.`,
        recommendation: 'Rename the file using a descriptive pattern: brand-model-color-view.jpg (e.g. adidas-samba-og-white-side.jpg).',
      });
    }
  }

  return flags;
}

/* ------------------------------------------------------------------ */
/* 5. Policy review (replica/counterfeit claims)                     */
/* ------------------------------------------------------------------ */

export function analyzePolicy(product: ComplianceProduct): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];
  const allText = [
    product.fields.title,
    product.fields.description,
    product.fields.metaTitle,
    product.fields.metaDescription,
    product.fields.bannerCopy,
    product.fields.tags.join(' '),
  ].join(' ').toLowerCase();

  // Replica/counterfeit — critical policy violation
  for (const term of REPLICA_TERMS) {
    if (allText.includes(term)) {
      issues.push({
        id: nextId('pol'),
        category: 'policy',
        severity: 'critical',
        field: 'description',
        fieldLabel: 'Product Content',
        snippet: term,
        explanation: `This product contains the term "${term}" which indicates a possible counterfeit or replica listing. Listing counterfeit goods violates marketplace policy, consumer protection law, and intellectual property rights.`,
        recommendation: 'Do not publish this product. Remove the listing and verify the sourcing. Counterfeit goods cannot be sold on LNKICKS.',
        ruleId: 'policy.counterfeit',
      });
      break; // one flag is enough
    }
  }

  // "100% authentic" claim without verification
  if (allText.includes('100% authentic') || allText.includes('guaranteed authentic')) {
    issues.push({
      id: nextId('pol'),
      category: 'policy',
      severity: 'warning',
      field: 'description',
      fieldLabel: 'Product Description',
      snippet: '100% authentic',
      explanation: 'The product description makes an authenticity claim ("100% authentic" or similar). Such claims require verifiable sourcing documentation. Without proof, the claim may mislead consumers and expose the platform to liability.',
      recommendation: 'Either attach verifiable sourcing documentation (invoice from authorized distributor) or remove the authenticity claim.',
      ruleId: 'policy.authenticity_claim',
    });
  }

  // "Best price" / "lowest price" — pricing claims
  if (allText.includes('best price') || allText.includes('lowest price') || allText.includes('cheapest')) {
    issues.push({
      id: nextId('pol'),
      category: 'policy',
      severity: 'info',
      field: 'description',
      fieldLabel: 'Product Description',
      snippet: 'price claim',
      explanation: 'The product makes a pricing superlative claim ("best price", "lowest price", "cheapest"). Such claims are difficult to substantiate and may violate advertising standards.',
      recommendation: 'Remove pricing superlatives. Focus on value propositions like "free shipping", "authentic product", or "expert verification" instead.',
      ruleId: 'policy.pricing_claim',
    });
  }

  return issues;
}

/* ------------------------------------------------------------------ */
/* Roll-up: convert category-specific flags into unified issues       */
/* ------------------------------------------------------------------ */

function trademarkHitsToIssues(hits: TrademarkHit[]): ComplianceIssue[] {
  return hits.map(hit => ({
    id: nextId('tm'),
    category: 'trademark' as const,
    severity: hit.authorizationStatus === 'unauthorized' ? 'critical' : hit.authorizationStatus === 'authorized' ? 'info' : 'warning',
    field: hit.field,
    fieldLabel: hit.field,
    snippet: hit.snippet,
    explanation: `Reference to "${hit.brand}" (owned by ${hit.ipOwner}) detected. Authorization status: ${hit.authorizationStatus.toUpperCase()}. ${hit.guidance}`,
    recommendation: hit.authorizationStatus === 'authorized'
      ? 'Authorization on file. Verify the specific product is sourced from the authorized channel and keep documentation.'
      : hit.authorizationStatus === 'pending'
      ? 'Authorization pending. Do not publish until the reseller agreement is finalized.'
      : hit.authorizationStatus === 'unauthorized'
      ? 'No authorization on file. Do not publish until reseller documentation is verified by legal.'
      : 'Authorization status unknown. Verify the source and consult legal before publishing.',
    ruleId: `trademark.${hit.brand.toLowerCase().replace(/[^a-z]/g, '_')}`,
  }));
}

function imageFlagsToIssues(flags: ImageFlag[]): ComplianceIssue[] {
  return flags.map(f => ({
    id: nextId('img'),
    category: 'image' as const,
    severity: f.severity,
    field: 'altText',
    fieldLabel: 'Product Image',
    snippet: f.imageUrl,
    explanation: f.explanation,
    recommendation: f.recommendation,
    ruleId: `image.${f.issue}`,
  }));
}

function seoFlagsToIssues(flags: SeoFlag[]): ComplianceIssue[] {
  return flags.map(f => ({
    id: nextId('seo'),
    category: 'seo' as const,
    severity: f.severity,
    field: f.field,
    fieldLabel: f.field,
    snippet: f.metric || '',
    explanation: f.explanation,
    recommendation: f.recommendation,
    ruleId: `seo.${f.issue}`,
  }));
}

function contentFlagsToIssues(flags: ContentFlag[]): ComplianceIssue[] {
  return flags.map(f => ({
    id: nextId('cnt'),
    category: 'content_quality' as const,
    severity: f.severity,
    field: f.field,
    fieldLabel: f.field,
    snippet: f.metric || '',
    explanation: f.explanation,
    recommendation: f.recommendation,
    ruleId: `content.${f.issue}`,
  }));
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

export function computeRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'low';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'high';
  return 'very_high';
}

export function computeRecommendation(
  score: number,
  issues: ComplianceIssue[],
): PublishRecommendation {
  const hasCritical = issues.some(i => i.severity === 'critical');
  const hasPolicyCritical = issues.some(i => i.category === 'policy' && i.severity === 'critical');
  if (hasPolicyCritical) return 'do_not_publish';
  if (hasCritical || score < 40) return 'do_not_publish';
  if (score < 80) return 'review_then_publish';
  return 'publish';
}

function computeScore(issues: ComplianceIssue[]): number {
  let penalty = 0;
  for (const i of issues) {
    penalty += SEVERITY_META[i.severity].weight;
  }
  // Slight diminishing returns on penalty
  if (penalty > 60) penalty = 60 + (penalty - 60) * 0.5;
  return Math.max(0, Math.round(100 - penalty));
}

/* ------------------------------------------------------------------ */
/* Summary & next steps                                                */
/* ------------------------------------------------------------------ */

function buildSummary(
  _product: ComplianceProduct,
  score: number,
  riskLevel: RiskLevel,
  issues: ComplianceIssue[],
): string {
  const parts: string[] = [];
  const critical = issues.filter(i => i.severity === 'critical').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const info = issues.filter(i => i.severity === 'info').length;

  parts.push(`Compliance score is ${score}/100 (${RISK_LEVEL_META[riskLevel].label}).`);
  if (critical > 0) {
    parts.push(`${critical} critical issue${critical > 1 ? 's' : ''} require${critical === 1 ? 's' : ''} resolution before publication.`);
  } else if (warnings > 0) {
    parts.push(`${warnings} warning${warnings > 1 ? 's' : ''} flagged for review.`);
  } else if (info > 0) {
    parts.push(`${info} informational note${info > 1 ? 's' : ''}.`);
  } else {
    parts.push('No issues detected — product is ready to publish.');
  }
  return parts.join(' ');
}

function buildNextSteps(issues: ComplianceIssue[]): string[] {
  const steps: string[] = [];
  const critical = issues.filter(i => i.severity === 'critical');
  const warnings = issues.filter(i => i.severity === 'warning');

  if (critical.some(i => i.category === 'policy')) {
    steps.push('Address policy violations first — counterfeit or unauthorized listings cannot be published.');
  }
  if (critical.some(i => i.category === 'trademark')) {
    steps.push('Verify reseller authorization for all trademark references. Attach documentation to the product record.');
  }
  if (critical.some(i => i.category === 'image')) {
    steps.push('Replace watermarked or marketing-artwork images with original product photography.');
  }
  if (warnings.some(i => i.category === 'seo')) {
    steps.push('Rewrite SEO content to address keyword stuffing, duplicates, or thin content.');
  }
  if (warnings.some(i => i.category === 'content_quality')) {
    steps.push('Improve content quality — add specifications, fix formatting, remove duplicate text.');
  }
  if (steps.length === 0) {
    steps.push('All checks passed. Product is cleared for publication.');
  }
  return steps;
}

/* ------------------------------------------------------------------ */
/* Top-level scan runner                                               */
/* ------------------------------------------------------------------ */

export function runComplianceScan(product: ComplianceProduct): ComplianceScanResult {
  const startedAt = Date.now();

  // Run all detectors
  const trademarkHits = detectTrademarks(product);
  const imageFlags = analyzeImages(product);
  const seoFlags = analyzeSeo(product);
  const contentFlags = analyzeContent(product);
  const policyIssues = analyzePolicy(product);

  // Roll up into unified issues
  const issues: ComplianceIssue[] = [
    ...trademarkHitsToIssues(trademarkHits),
    ...imageFlagsToIssues(imageFlags),
    ...seoFlagsToIssues(seoFlags),
    ...contentFlagsToIssues(contentFlags),
    ...policyIssues,
  ];

  // Sort: critical → warning → info
  const severityOrder: Record<IssueSeverity, number> = { critical: 0, warning: 1, info: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const score = computeScore(issues);
  const riskLevel = computeRiskLevel(score);
  const recommendation = computeRecommendation(score, issues);

  const fieldsScanned = FIELD_TEXTS.length + 2; // +2 for tags & collections
  const imagesScanned = product.images.length;

  const completedAt = Date.now();

  return {
    id: nextId('scan'),
    productId: product.id,
    productName: product.name,
    productSku: product.sku,
    productBrand: product.brand,
    startedAt,
    completedAt,
    durationMs: completedAt - startedAt,
    score,
    riskLevel,
    recommendation,
    fieldsScanned,
    imagesScanned,
    issues,
    trademarkHits,
    imageFlags,
    seoFlags,
    contentFlags,
    summary: buildSummary(product, score, riskLevel, issues),
    nextSteps: buildNextSteps(issues),
  };
}

/* ------------------------------------------------------------------ */
/* Dashboard KPI helpers                                               */
/* ------------------------------------------------------------------ */

export function getComplianceKPIs(products: ComplianceProduct[]) {
  const waiting = products.filter(p => p.status === 'pending_publish' || p.status === 'in_review').length;
  const highRisk = products.filter(p => p.lastRiskLevel === 'high' || p.lastRiskLevel === 'very_high').length;
  const recentlyScanned = products.filter(p => p.lastScannedAt && (Date.now() - p.lastScannedAt) < 24 * 3600000).length;
  const recentlyPublished = products.filter(p => p.status === 'published').length;
  const blocked = products.filter(p => p.status === 'blocked').length;
  const avgScore = products.length > 0
    ? Math.round(products.reduce((s, p) => s + (p.lastScore ?? 0), 0) / products.length)
    : 0;
  return { waiting, highRisk, recentlyScanned, recentlyPublished, blocked, avgScore };
}
