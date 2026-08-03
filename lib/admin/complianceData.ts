/**
 * LNKICKS Enterprise Admin — Copyright & Brand Compliance Center
 * ------------------------------------------------------------
 * Mock data sources for the compliance module.
 *
 * Includes:
 *  - Trademark registry (well-known sneaker / footwear brands)
 *  - Sample products awaiting compliance review (with intentional issues)
 *  - Compliance history (past scans & resolutions)
 *  - Compliance score trend (30-day)
 *
 * Swap for Firestore / Postgres later — same shapes, same signatures.
 */

import type {
  TrademarkEntry,
  ComplianceProduct,
  ComplianceHistoryEntry,
  ComplianceScoreTrendPoint,
} from './complianceTypes';

/* ------------------------------------------------------------------ */
/* Trademark registry                                                  */
/* ------------------------------------------------------------------ */
/**
 * The list of brands whose names trigger a compliance review when
 * referenced in product fields. Each entry carries:
 *  - canonical brand name
 *  - search variants (lowercased, includes common misspellings &
 *    model-line suffixes)
 *  - IP owner
 *  - category
 *  - human-readable guidance for the admin
 *  - authorization status (whether LNKICKS holds a reseller agreement)
 *
 * This list is intentionally narrow and educational — it is not a
 * substitute for legal counsel or a comprehensive trademark database.
 * It is a *first-line* screening tool to flag content for human review.
 */
export const TRADEMARK_REGISTRY: TrademarkEntry[] = [
  {
    brand: 'Nike',
    variants: ['nike', 'nikee', 'nikey', 'just do it', 'swoosh', 'air max', 'air force 1', 'af1', 'dunk low', 'dunk high', 'blazer mid', 'cortez'],
    ipOwner: 'Nike, Inc.',
    category: 'footwear',
    guidance: 'Nike owns registered wordmarks and design marks (Swoosh). Use of Nike trademarks to sell Nike-branded products generally requires authorization from Nike or an authorized distributor. Verify reseller documentation before publishing.',
    authorizationStatus: 'authorized',
  },
  {
    brand: 'Jordan',
    variants: ['jordan', 'air jordan', 'jordan brand', 'aj1', 'aj3', 'aj4', 'aj11', 'jumpman', 'jordan 1', 'jordan 4', 'jordan 11'],
    ipOwner: 'Nike, Inc. (Jordan Brand)',
    category: 'footwear',
    guidance: 'Air Jordan is a sub-brand of Nike. The Jumpman silhouette is a registered design mark. Selling Jordan-branded products requires the same authorization as Nike products. Confirm reseller status before listing.',
    authorizationStatus: 'authorized',
  },
  {
    brand: 'Adidas',
    variants: ['adidas', 'adiddas', 'adidas originals', 'samba', 'gazelle', 'ultraboost', 'superstar', 'stan smith', 'three stripes', 'trefoil'],
    ipOwner: 'adidas AG',
    category: 'footwear',
    guidance: 'Adidas owns the Three Stripes and Trefoil design marks. Use of these marks or model names (Samba, Gazelle, Ultraboost) requires authorization or first-sale doctrine compliance. Keep documentation of authorized sourcing.',
    authorizationStatus: 'authorized',
  },
  {
    brand: 'Puma',
    variants: ['puma', 'puma suede', 'formstrip', 'puma rs-x'],
    ipOwner: 'PUMA SE',
    category: 'footwear',
    guidance: 'Puma owns the Formstrip design mark. Use of Puma trademarks requires authorization from Puma or an authorized distributor.',
    authorizationStatus: 'pending',
  },
  {
    brand: 'New Balance',
    variants: ['new balance', 'nb', 'nb 530', 'nb 9060', 'nb 990', 'nb 2002r', 'made in usa'],
    ipOwner: 'New Balance Athletics, Inc.',
    category: 'footwear',
    guidance: 'New Balance owns the "N" design mark and the "Made in USA" claim (regulated). Verify sourcing documentation and avoid unverified "Made in USA" claims.',
    authorizationStatus: 'authorized',
  },
  {
    brand: 'ASICS',
    variants: ['asics', 'gel-kayano', 'gel-lyte', 'gt-2000', 'asics tiger'],
    ipOwner: 'ASICS Corporation',
    category: 'footwear',
    guidance: 'ASICS owns the helix design mark and the ASICS wordmark. Reseller authorization recommended for listings using ASICS trademarks.',
    authorizationStatus: 'authorized',
  },
  {
    brand: 'Hoka',
    variants: ['hoka', 'hoka one one', 'hoka clone', 'hoka speedgoat', 'hoka bondi'],
    ipOwner: 'Hoka (Decker Brands)',
    category: 'footwear',
    guidance: 'Hoka is a registered wordmark of Decker Brands. Use in listings requires reseller authorization or first-sale compliance.',
    authorizationStatus: 'pending',
  },
  {
    brand: 'Salomon',
    variants: ['salomon', 'salomon xt-6', 'salomon s/lab', 'salomon speedcross'],
    ipOwner: 'Salomon Group',
    category: 'footwear',
    guidance: 'Salomon is a registered wordmark. Outdoor/athletic model names (XT-6, Speedcross) are also protected. Verify authorization before listing.',
    authorizationStatus: 'unknown',
  },
  {
    brand: 'Converse',
    variants: ['converse', 'chuck taylor', 'chuck 70', 'all star', 'one star'],
    ipOwner: 'Nike, Inc. (Converse)',
    category: 'footwear',
    guidance: 'Converse and Chuck Taylor are registered wordmarks owned by Nike. The Star Chevron is a design mark. Reseller authorization recommended.',
    authorizationStatus: 'authorized',
  },
  {
    brand: 'Yeezy',
    variants: ['yeezy', 'yeezy boost', 'yeezy 350', 'yeezy 700', 'yeezy slide', 'yeezy foam runner'],
    ipOwner: 'adidas AG (historical) / Ye (brand)',
    category: 'footwear',
    guidance: 'Yeezy brand rights have a complex history. The Yeezy wordmark is widely recognized. Confirm current licensing status before listing new Yeezy products.',
    authorizationStatus: 'unknown',
  },
  {
    brand: 'Travis Scott',
    variants: ['travis scott', 'cactus jack', 'ts x nike', 'ts x jordan', 'la flame'],
    ipOwner: 'Travis Scott (Cactus Jack)',
    category: 'footwear',
    guidance: 'Collaboration products (Travis Scott x Nike/Jordan) carry both Nike and Cactus Jack trademarks. These are limited-edition products; verify authenticity and sourcing.',
    authorizationStatus: 'unauthorized',
  },
  {
    brand: 'Off-White',
    variants: ['off-white', 'off white', 'virgil abloh', 'off-white™', 'industrial belt'],
    ipOwner: 'Off-White LLC',
    category: 'apparel',
    guidance: 'Off-White is a registered wordmark. The quotation-mark motif is a protected design element. Collaboration products (Off-White x Nike) require dual authorization.',
    authorizationStatus: 'unauthorized',
  },
];

/* ------------------------------------------------------------------ */
/* Sample products awaiting compliance review                         */
/* ------------------------------------------------------------------ */
/**
 * These sample products deliberately include various compliance issues
 * (trademark references, marketing copy from brand sites, watermarked
 * images, thin content, keyword stuffing, missing specs, etc.) so the
 * demo scanner has something realistic to flag.
 *
 * In production these would come from the catalog service.
 */

const NOW = Date.now();
const DAY = 86400000;

export const COMPLIANCE_PRODUCTS: ComplianceProduct[] = [
  {
    id: 'cmp-001',
    name: 'Air Jordan 1 Retro High OG "Chicago" 2025 Edition',
    sku: 'AJ1-RH-OG-CHI-25',
    brand: 'Jordan',
    category: 'Sneakers',
    status: 'pending_publish',
    price: 24999,
    createdAt: NOW - 2 * DAY,
    updatedAt: NOW - 6 * 3600000,
    authorName: 'Editor Staff',
    authorRole: 'editor',
    fields: {
      title: 'Air Jordan 1 Retro High OG Chicago 2025 Edition — Authentic',
      description:
        'The Air Jordan 1 Retro High OG Chicago returns in 2025 with the iconic black, red, and white colorway that started it all. ' +
        'Featuring premium leather upper, Air-Sole cushioning, and the classic Wings logo. ' +
        'This is the official Nike release — 100% authentic with original box and tags. ' +
        'A must-have for every sneakerhead. Limited stock available. ' +
        'Buy now. Buy now. Buy now. Best price guaranteed. Free shipping. Cash on delivery available. ' +
        'The legendary silhouette that changed basketball forever. Don\'t miss out!',
      metaTitle: 'Air Jordan 1 Chicago 2025 | Buy Online India | Best Price | LNKICKS',
      metaDescription:
        'Buy Air Jordan 1 Chicago 2025 online at best price. 100% authentic. Free shipping. COD available. Limited stock. Order now.',
      altText: 'Air Jordan 1 Chicago red black white sneakers',
      fileName: 'nike-air-jordan-1-chicago-official-marketing-photo.jpg',
      tags: ['air jordan', 'jordan 1', 'chicago', 'nike', 'sneakers', 'basketball', 'authentic', 'premium', 'limited', 'rare', 'og', 'retro', 'high', 'red', 'black', 'white', 'leather', '2025', 'new', 'drop'],
      collections: ['Air Jordan', 'Nike', 'Basketball', 'New Arrivals', 'Premium'],
      seoContent:
        'Air Jordan 1 Chicago is the most iconic sneaker. Air Jordan 1 Chicago for sale. Buy Air Jordan 1 Chicago online. ' +
        'Best Air Jordan 1 Chicago price. Authentic Air Jordan 1 Chicago. Limited Air Jordan 1 Chicago stock. ' +
        'Air Jordan 1 Chicago 2025 release. Air Jordan 1 Chicago original.',
      bannerCopy: 'THE LEGEND RETURNS — Air Jordan 1 Chicago 2025. Shop Now. Authenticity Guaranteed.',
    },
    images: [
      {
        id: 'img-001-a',
        url: '/jordan_powder_blue.png',
        alt: 'Air Jordan 1 Chicago red black white sneakers',
        width: 1200, height: 1200,
        hints: { large_logo: true, marketing_artwork: true },
      },
      {
        id: 'img-001-b',
        url: '/jordan_powder_blue.png',
        alt: '',
        width: 1600, height: 1600,
        hints: { watermark: true, brand_graphic: true },
      },
      {
        id: 'img-001-c',
        url: '/af1_black.png',
        alt: 'Air Jordan 1 side view',
        width: 800, height: 800,
        hints: { screenshot: true },
      },
    ],
    lastScannedAt: NOW - 6 * 3600000,
    lastRiskLevel: 'very_high',
    lastScore: 28,
  },
  {
    id: 'cmp-002',
    name: 'Adidas Samba OG Cloud White Core Black',
    sku: 'AD-SMB-OG-CWB',
    brand: 'Adidas',
    category: 'Sneakers',
    status: 'in_review',
    price: 8999,
    createdAt: NOW - 4 * DAY,
    updatedAt: NOW - 18 * 3600000,
    authorName: 'Editor Staff',
    authorRole: 'editor',
    fields: {
      title: 'Adidas Samba OG Cloud White Core Black',
      description:
        'The Adidas Samba OG returns in the timeless Cloud White and Core Black colorway. ' +
        'Crafted with a soft leather upper and the signature T-toe overlay. ' +
        'Gum rubber outsole provides reliable grip on and off the pitch. ' +
        'A timeless silhouette that transitions effortlessly from street to casual wear.',
      metaTitle: 'Adidas Samba OG Cloud White | LNKICKS',
      metaDescription: 'Shop the Adidas Samba OG in Cloud White Core Black. Premium leather, gum sole, classic T-toe. Free shipping across India.',
      altText: 'Adidas Samba OG white black leather sneakers side profile',
      fileName: 'adidas-samba-og-cloud-white.jpg',
      tags: ['adidas', 'samba', 'og', 'cloud white', 'core black', 'leather', 'lifestyle'],
      collections: ['Adidas', 'Samba', 'Lifestyle'],
      seoContent:
        'A heritage football trainer turned street icon, the Samba OG needs no introduction. ' +
        'Premium leather upper, gum rubber outsole, and the classic T-toe construction that has defined the silhouette since 1950. ' +
        'Sizing: fits true to size. Recommended for everyday wear.',
      bannerCopy: 'Heritage Icon — Samba OG Cloud White. Now available.',
    },
    images: [
      {
        id: 'img-002-a',
        url: '/samba_og.png',
        alt: 'Adidas Samba OG white black leather sneakers side profile',
        width: 1000, height: 1000,
        hints: {},
      },
      {
        id: 'img-002-b',
        url: '/samba_og_nobg.png',
        alt: 'Adidas Samba OG product photo on white background',
        width: 1200, height: 1200,
        hints: {},
      },
    ],
    lastScannedAt: NOW - 18 * 3600000,
    lastRiskLevel: 'low',
    lastScore: 88,
  },
  {
    id: 'cmp-003',
    name: 'Nike Dunk Low Panda — Replica Edition',
    sku: 'NK-DK-LW-PND-RP',
    brand: 'Nike',
    category: 'Sneakers',
    status: 'blocked',
    price: 4999,
    createdAt: NOW - 6 * DAY,
    updatedAt: NOW - 2 * DAY,
    authorName: 'Marketing Lead',
    authorRole: 'marketing',
    fields: {
      title: 'Nike Dunk Low Panda Replica Edition — Looks Like Original',
      description:
        'Get the Nike Dunk Low Panda look for less! High quality replica that looks just like the original. ' +
        'Black and white colorway, premium feel, perfect for sneaker fans on a budget. ' +
        'Why pay 30k when you can get the same look for 5k?',
      metaTitle: 'Nike Dunk Low Panda Replica Cheap | Looks Like Original | Buy Now',
      metaDescription: 'Cheap Nike Dunk Low Panda replica. Looks like original. Best price. Buy now.',
      altText: 'nike dunk panda',
      fileName: 'nike-dunk-panda-replica-marketing.jpg',
      tags: ['nike', 'dunk', 'panda', 'replica', 'cheap', 'fake', 'copy', 'lookalike', 'dupe'],
      collections: ['Nike', 'Dunks'],
      seoContent: 'Nike Dunk Panda replica for sale cheap. Best replica. Looks like original.',
      bannerCopy: 'PANDA DUNK LOOK — Without The Price Tag. Shop Replicas Now.',
    },
    images: [
      {
        id: 'img-003-a',
        url: '/dunk_rose.png',
        alt: 'nike dunk panda',
        width: 600, height: 600,
        hints: { edited_material: true, low_resolution: true, unauthorized_photography: true },
      },
    ],
    lastScannedAt: NOW - 2 * DAY,
    lastRiskLevel: 'very_high',
    lastScore: 12,
  },
  {
    id: 'cmp-004',
    name: 'New Balance 530 Steel Grey',
    sku: 'NB-530-STG',
    brand: 'New Balance',
    category: 'Sneakers',
    status: 'pending_publish',
    price: 11999,
    createdAt: NOW - 1 * DAY,
    updatedAt: NOW - 3 * 3600000,
    authorName: 'Editor Staff',
    authorRole: 'editor',
    fields: {
      title: 'New Balance 530 Steel Grey',
      description:
        'The New Balance 530 in Steel Grey offers retro-running style with modern comfort. ' +
        'ABZORB cushioning underfoot. Mesh and suede upper. Made in USA quality.',
      metaTitle: 'New Balance 530 Steel Grey | LNKICKS',
      metaDescription: 'New Balance 530 Steel Grey with ABZORB cushioning. Premium materials.',
      altText: '',
      fileName: 'IMG_20250803_001.jpg',
      tags: ['new balance', '530', 'steel grey', 'retro running'],
      collections: ['New Balance', 'Retro Running'],
      seoContent: '',
      bannerCopy: '',
    },
    images: [
      {
        id: 'img-004-a',
        url: '/nb_9060_nobg.png',
        alt: '',
        width: 1200, height: 1200,
        hints: { missing_alt: true },
      },
    ],
    lastScannedAt: NOW - 3 * 3600000,
    lastRiskLevel: 'medium',
    lastScore: 67,
  },
  {
    id: 'cmp-005',
    name: 'Travis Scott x Jordan 1 Low Mocha',
    sku: 'TS-AJ1-LW-MCH',
    brand: 'Jordan',
    category: 'Sneakers',
    status: 'in_review',
    price: 89999,
    createdAt: NOW - 8 * DAY,
    updatedAt: NOW - 30 * 3600000,
    authorName: 'Editor Staff',
    authorRole: 'editor',
    fields: {
      title: 'Travis Scott x Air Jordan 1 Low "Mocha" — Reverse Swoosh',
      description:
        'The Travis Scott x Air Jordan 1 Low Mocha features the signature reversed Swoosh, ' +
        'Mocha brown accents, and Cactus Jack branding. ' +
        'One of the most coveted collaborations in sneaker culture. ' +
        'Comes with original packaging and Cactus Jack hangtag.',
      metaTitle: 'Travis Scott x Jordan 1 Low Mocha | LNKICKS',
      metaDescription: 'Travis Scott x Air Jordan 1 Low Mocha. Reverse Swoosh. Cactus Jack branding.',
      altText: 'Travis Scott Jordan 1 Low Mocha reverse swoosh',
      fileName: 'travis-scott-jordan-1-mocha.jpg',
      tags: ['travis scott', 'jordan', 'cactus jack', 'mocha', 'collab'],
      collections: ['Jordan', 'Travis Scott', 'Collaborations'],
      seoContent:
        'The Travis Scott x Air Jordan 1 Low Mocha is a flagship collaboration that needs no introduction. ' +
        'Featuring the iconic reverse Swoosh, Mocha brown overlays, and hidden Cactus Jack smiley detailing. ' +
        'A statement piece for serious collectors.',
      bannerCopy: 'Cactus Jack Meets Jumpman — TS x AJ1 Low Mocha. Limited Quantities.',
    },
    images: [
      {
        id: 'img-005-a',
        url: '/jordan_powder_blue.png',
        alt: 'Travis Scott Jordan 1 Low Mocha reverse swoosh',
        width: 1400, height: 1400,
        hints: { marketing_artwork: true, brand_graphic: true },
      },
    ],
    lastScannedAt: NOW - 30 * 3600000,
    lastRiskLevel: 'high',
    lastScore: 52,
  },
  {
    id: 'cmp-006',
    name: 'Generic White Leather Sneakers',
    sku: 'LK-WHT-LTR-001',
    brand: 'LNKICKS',
    category: 'Sneakers',
    status: 'pending_publish',
    price: 3499,
    createdAt: NOW - 12 * 3600000,
    updatedAt: NOW - 2 * 3600000,
    authorName: 'Editor Staff',
    authorRole: 'editor',
    fields: {
      title: 'Clean White Leather Sneakers — Minimalist Everyday',
      description:
        'A versatile white leather sneaker for everyday wear. ' +
        'Premium synthetic upper, cushioned insole, durable rubber outsole. ' +
        'Pairs effortlessly with jeans, chinos, or shorts.',
      metaTitle: 'White Leather Sneakers | LNKICKS',
      metaDescription: 'Minimalist white leather sneakers for everyday wear.',
      altText: 'White leather sneakers on neutral background',
      fileName: 'lk-white-leather-001.jpg',
      tags: ['white sneakers', 'leather', 'minimalist', 'everyday'],
      collections: ['LNKICKS Originals', 'Minimalist'],
      seoContent: 'A clean white sneaker is a wardrobe essential. Our take features a premium upper and all-day comfort.',
      bannerCopy: 'Everyday Minimal — Clean White Leather Sneakers.',
    },
    images: [
      {
        id: 'img-006-a',
        url: '/af1_black.png',
        alt: 'White leather sneakers on neutral background',
        width: 1100, height: 1100,
        hints: {},
      },
    ],
    lastScannedAt: NOW - 2 * 3600000,
    lastRiskLevel: 'low',
    lastScore: 92,
  },
  {
    id: 'cmp-007',
    name: 'Yeezy Boost 350 V2 Zebra',
    sku: 'YZ-350-V2-ZBR',
    brand: 'Yeezy',
    category: 'Sneakers',
    status: 'in_review',
    price: 32999,
    createdAt: NOW - 14 * DAY,
    updatedAt: NOW - 5 * DAY,
    authorName: 'Editor Staff',
    authorRole: 'editor',
    fields: {
      title: 'Adidas Yeezy Boost 350 V2 Zebra — Brand New In Box',
      description:
        'Adidas Yeezy Boost 350 V2 Zebra in brand new condition with original box. ' +
        'Primeknit upper, Boost midsole, Zebra stripe pattern. ' +
        'One of the most iconic Yeezy colorways.',
      metaTitle: 'Yeezy Boost 350 V2 Zebra | LNKICKS',
      metaDescription: 'Adidas Yeezy Boost 350 V2 Zebra. Brand new with box.',
      altText: 'Yeezy 350 V2 Zebra black white primeknit',
      fileName: 'adidas-yeezy-350-v2-zebra-marketing.jpg',
      tags: ['yeezy', 'adidas', '350 v2', 'zebra', 'boost'],
      collections: ['Yeezy', 'Adidas'],
      seoContent: '',
      bannerCopy: '',
    },
    images: [
      {
        id: 'img-007-a',
        url: '/yeezy_700.png',
        alt: 'Yeezy 350 V2 Zebra black white primeknit',
        width: 1300, height: 1300,
        hints: { watermark: true, marketing_artwork: true },
      },
    ],
    lastScannedAt: NOW - 5 * DAY,
    lastRiskLevel: 'high',
    lastScore: 47,
  },
  {
    id: 'cmp-008',
    name: 'Puma Suede Classic XXI',
    sku: 'PM-SDE-CLS-XXI',
    brand: 'Puma',
    category: 'Sneakers',
    status: 'published',
    price: 5499,
    createdAt: NOW - 20 * DAY,
    updatedAt: NOW - 10 * DAY,
    authorName: 'Editor Staff',
    authorRole: 'editor',
    fields: {
      title: 'Puma Suede Classic XXI — Black',
      description:
        'The Puma Suede Classic XXI returns in timeless black. ' +
        'Soft suede upper, Formstrip branding, rubber outsole. ' +
        'A streetwear icon since 1968.',
      metaTitle: 'Puma Suede Classic XXI Black | LNKICKS',
      metaDescription: 'Puma Suede Classic XXI black suede sneaker. Iconic Formstrip.',
      altText: 'Puma Suede Classic black suede sneaker',
      fileName: 'puma-suede-classic-black.jpg',
      tags: ['puma', 'suede', 'classic', 'black'],
      collections: ['Puma', 'Classics'],
      seoContent: 'The Puma Suede Classic needs no introduction. A streetwear staple for over 50 years.',
      bannerCopy: 'Street Icon — Puma Suede Classic XXI. Now available.',
    },
    images: [
      {
        id: 'img-008-a',
        url: '/puma_velo_nobg.png',
        alt: 'Puma Suede Classic black suede sneaker',
        width: 1100, height: 1100,
        hints: {},
      },
    ],
    lastScannedAt: NOW - 10 * DAY,
    lastRiskLevel: 'low',
    lastScore: 84,
  },
];

/* ------------------------------------------------------------------ */
/* Compliance history (audit trail)                                   */
/* ------------------------------------------------------------------ */

export const COMPLIANCE_HISTORY: ComplianceHistoryEntry[] = [
  {
    id: 'ch-001', scanId: 'scan-001', productId: 'cmp-001', productName: 'Air Jordan 1 Retro High OG Chicago 2025',
    productSku: 'AJ1-RH-OG-CHI-25', timestamp: NOW - 6 * 3600000,
    actorName: 'Editor Staff', actorRole: 'editor', action: 'scan_run',
    riskLevel: 'very_high', score: 28,
    notes: '11 trademark hits, 3 image flags, keyword stuffing detected.',
  },
  {
    id: 'ch-002', scanId: 'scan-002', productId: 'cmp-002', productName: 'Adidas Samba OG Cloud White',
    productSku: 'AD-SMB-OG-CWB', timestamp: NOW - 18 * 3600000,
    actorName: 'Editor Staff', actorRole: 'editor', action: 'scan_run',
    riskLevel: 'low', score: 88,
  },
  {
    id: 'ch-003', scanId: 'scan-003', productId: 'cmp-002', productName: 'Adidas Samba OG Cloud White',
    productSku: 'AD-SMB-OG-CWB', timestamp: NOW - 17 * 3600000,
    actorName: 'Editor Staff', actorRole: 'editor', action: 'warning_resolved',
    ruleId: 'seo.title_too_long', notes: 'Trimmed meta title from 72 to 58 chars.',
  },
  {
    id: 'ch-004', scanId: 'scan-004', productId: 'cmp-003', productName: 'Nike Dunk Low Panda Replica Edition',
    productSku: 'NK-DK-LW-PND-RP', timestamp: NOW - 2 * DAY,
    actorName: 'LNKICKS Founder', actorRole: 'admin', action: 'product_blocked',
    riskLevel: 'very_high', score: 12,
    notes: 'Replica / counterfeit listing — auto-blocked. IP infringement risk.',
  },
  {
    id: 'ch-005', scanId: 'scan-005', productId: 'cmp-004', productName: 'New Balance 530 Steel Grey',
    productSku: 'NB-530-STG', timestamp: NOW - 3 * 3600000,
    actorName: 'Editor Staff', actorRole: 'editor', action: 'scan_run',
    riskLevel: 'medium', score: 67,
    notes: 'Missing alt text on hero image, generic file name.',
  },
  {
    id: 'ch-006', scanId: 'scan-006', productId: 'cmp-005', productName: 'Travis Scott x Jordan 1 Low Mocha',
    productSku: 'TS-AJ1-LW-MCH', timestamp: NOW - 30 * 3600000,
    actorName: 'Editor Staff', actorRole: 'editor', action: 'scan_run',
    riskLevel: 'high', score: 52,
    notes: 'Unauthorized collab product — reseller documentation required.',
  },
  {
    id: 'ch-007', scanId: 'scan-007', productId: 'cmp-006', productName: 'Generic White Leather Sneakers',
    productSku: 'LK-WHT-LTR-001', timestamp: NOW - 2 * 3600000,
    actorName: 'Editor Staff', actorRole: 'editor', action: 'scan_run',
    riskLevel: 'low', score: 92,
  },
  {
    id: 'ch-008', scanId: 'scan-007', productId: 'cmp-006', productName: 'Generic White Leather Sneakers',
    productSku: 'LK-WHT-LTR-001', timestamp: NOW - 90 * 60000,
    actorName: 'LNKICKS Founder', actorRole: 'admin', action: 'product_published',
    notes: 'Cleared for publication. All checks passed.',
  },
  {
    id: 'ch-009', scanId: 'scan-008', productId: 'cmp-007', productName: 'Yeezy Boost 350 V2 Zebra',
    productSku: 'YZ-350-V2-ZBR', timestamp: NOW - 5 * DAY,
    actorName: 'Editor Staff', actorRole: 'editor', action: 'scan_run',
    riskLevel: 'high', score: 47,
    notes: 'Marketing artwork detected, watermark present.',
  },
  {
    id: 'ch-010', scanId: 'scan-009', productId: 'cmp-008', productName: 'Puma Suede Classic XXI',
    productSku: 'PM-SDE-CLS-XXI', timestamp: NOW - 10 * DAY,
    actorName: 'Editor Staff', actorRole: 'editor', action: 'scan_run',
    riskLevel: 'low', score: 84,
  },
  {
    id: 'ch-011', scanId: 'scan-009', productId: 'cmp-008', productName: 'Puma Suede Classic XXI',
    productSku: 'PM-SDE-CLS-XXI', timestamp: NOW - 9 * DAY,
    actorName: 'Editor Staff', actorRole: 'editor', action: 'product_published',
    notes: 'Published after authorization pending review.',
  },
  {
    id: 'ch-012', productId: 'cmp-001', productName: 'Air Jordan 1 Retro High OG Chicago 2025',
    productSku: 'AJ1-RH-OG-CHI-25', timestamp: NOW - 5 * 3600000,
    actorName: 'LNKICKS Founder', actorRole: 'admin', action: 'warning_dismissed',
    ruleId: 'content.duplicate_text',
    notes: 'Acknowledged duplicate marketing copy — flagged for rewrite.',
  },
  {
    id: 'ch-013', productId: 'cmp-002', productName: 'Adidas Samba OG Cloud White',
    productSku: 'AD-SMB-OG-CWB', timestamp: NOW - 16 * 3600000,
    actorName: 'Editor Staff', actorRole: 'editor', action: 'warning_resolved',
    ruleId: 'image.missing_alt', notes: 'Added descriptive alt text for second image.',
  },
  {
    id: 'ch-014', timestamp: NOW - 4 * 3600000,
    actorName: 'LNKICKS Founder', actorRole: 'admin', action: 'report_exported',
    productId: 'cmp-005', productName: 'Travis Scott x Jordan 1 Low Mocha',
    productSku: 'TS-AJ1-LW-MCH',
    notes: 'Exported compliance report as PDF for legal review.',
  },
  {
    id: 'ch-015', timestamp: NOW - 7 * 3600000,
    actorName: 'LNKICKS Founder', actorRole: 'admin', action: 'rule_updated',
    productId: '-', productName: '-', productSku: '-',
    notes: 'Trademark registry updated — added Salomon variants.',
  },
];

/* ------------------------------------------------------------------ */
/* Compliance score trend (30 days)                                   */
/* ------------------------------------------------------------------ */

function buildScoreTrend(): ComplianceScoreTrendPoint[] {
  const out: ComplianceScoreTrendPoint[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    // Deterministic-ish curve trending upward (compliance improving over time)
    const base = 62 + (29 - i) * 0.6;
    const wobble = Math.sin(i / 3) * 5;
    const score = Math.max(40, Math.min(95, Math.round(base + wobble)));
    const scans = 4 + Math.round(Math.abs(Math.sin(i / 1.7)) * 6);
    const blocked = Math.max(0, Math.round(Math.abs(Math.cos(i / 2.3)) * 2 - 0.5));
    out.push({
      date: d.toISOString().slice(0, 10),
      label,
      score,
      scans,
      blocked,
    });
  }
  return out;
}

export const COMPLIANCE_SCORE_TREND: ComplianceScoreTrendPoint[] = buildScoreTrend();

/* ------------------------------------------------------------------ */
/* Accessors (mirrors the adminData.ts pattern)                       */
/* ------------------------------------------------------------------ */

export function getComplianceProducts(): ComplianceProduct[] {
  return COMPLIANCE_PRODUCTS;
}

export function getComplianceProductById(id: string): ComplianceProduct | undefined {
  return COMPLIANCE_PRODUCTS.find(p => p.id === id);
}

export function getComplianceHistory(): ComplianceHistoryEntry[] {
  return [...COMPLIANCE_HISTORY].sort((a, b) => b.timestamp - a.timestamp);
}

export function getComplianceScoreTrend(): ComplianceScoreTrendPoint[] {
  return COMPLIANCE_SCORE_TREND;
}

export function getTrademarkRegistry(): TrademarkEntry[] {
  return TRADEMARK_REGISTRY;
}
