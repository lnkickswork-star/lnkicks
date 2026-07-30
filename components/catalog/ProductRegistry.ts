/* =========================================================
   LNKICKS CENTRALIZED PRODUCT REGISTRY & DATA MODEL
   ========================================================= */

export interface ProductItem {
  id: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  name: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  currency: string;
  images: string[];
  primaryImage: string;
  hoverImage?: string;
  availableSizes: string[];
  availableColors: string[];
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  limitedEdition?: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalURL: string;
}

export const PRODUCT_REGISTRY: ProductItem[] = [
  {
    id: 'prod-aj1-powder-blue',
    slug: 'air-jordan-1-low-black-powder-blue',
    sku: 'AJ1-PB-01',
    brand: 'NIKE',
    category: 'Sneakers',
    name: 'Air Jordan 1 Low Black Powder Blue',
    shortDescription: 'Classic low-top silhouette in iconic Carolina blue and black leather.',
    price: 8899,
    comparePrice: 18899,
    currency: 'INR',
    images: ['/jordan_powder_blue_nobg.png'],
    primaryImage: '/jordan_powder_blue_nobg.png',
    availableSizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Powder Blue', 'Black'],
    stockStatus: 'In Stock',
    featured: true,
    newArrival: true,
    rating: 4.9,
    reviewCount: 128,
    tags: ['Jordan', 'Low', 'Powder Blue'],
    seoTitle: 'Air Jordan 1 Low Powder Blue — LNKICKS',
    seoDescription: 'Buy authentic Air Jordan 1 Low Powder Blue in India.',
    canonicalURL: '/product/air-jordan-1-low-black-powder-blue'
  },
  {
    id: 'prod-samba-og-white',
    slug: 'samba-og-cloud-white-core-black',
    sku: 'SAMBA-OG-02',
    brand: 'ADIDAS',
    category: 'Sneakers',
    name: 'Samba OG Cloud White Core Black',
    shortDescription: 'Timeless terrace sneaker with full-grain leather and gum sole.',
    price: 9499,
    comparePrice: 16999,
    currency: 'INR',
    images: ['/samba_og_nobg.png'],
    primaryImage: '/samba_og_nobg.png',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9'],
    availableColors: ['White', 'Core Black'],
    stockStatus: 'In Stock',
    bestSeller: true,
    rating: 4.8,
    reviewCount: 94,
    tags: ['Samba', 'Adidas', 'Terrace'],
    seoTitle: 'Adidas Samba OG White — LNKICKS',
    seoDescription: 'Authentic Adidas Samba OG Cloud White in India.',
    canonicalURL: '/product/samba-og-cloud-white-core-black'
  },
  {
    id: 'prod-af1-triple-black',
    slug: 'nike-air-force-1-low-triple-black',
    sku: 'AF1-BLK-03',
    brand: 'NIKE',
    category: 'Lifestyle',
    name: 'Nike Air Force 1 Low Triple Black',
    shortDescription: 'Stealthy all-black leather Air Force 1 with encapsulated Nike Air cushion.',
    price: 6999,
    comparePrice: 10999,
    currency: 'INR',
    images: ['/af1_black_nobg.png'],
    primaryImage: '/af1_black_nobg.png',
    availableSizes: ['UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Black'],
    stockStatus: 'In Stock',
    featured: true,
    rating: 4.7,
    reviewCount: 210,
    tags: ['AF1', 'Triple Black', 'Nike'],
    seoTitle: 'Nike Air Force 1 Triple Black — LNKICKS',
    seoDescription: 'Shop Nike Air Force 1 Low Triple Black online.',
    canonicalURL: '/product/nike-air-force-1-low-triple-black'
  },
  {
    id: 'prod-puma-velophasis',
    slug: 'puma-velophasis-luxury-edition',
    sku: 'PUMA-VELO-04',
    brand: 'PUMA',
    category: 'Running',
    name: 'Puma Velophasis Luxury Edition',
    shortDescription: 'Y2K hybrid runner with metallic overlays and breathable mesh.',
    price: 8499,
    comparePrice: 14999,
    currency: 'INR',
    images: ['/puma_velo_nobg.png'],
    primaryImage: '/puma_velo_nobg.png',
    availableSizes: ['UK 7', 'UK 8', 'UK 9'],
    availableColors: ['Silver', 'Grey'],
    stockStatus: 'In Stock',
    newArrival: true,
    rating: 4.6,
    reviewCount: 45,
    tags: ['Puma', 'Runner', 'Velophasis'],
    seoTitle: 'Puma Velophasis — LNKICKS',
    seoDescription: 'Buy Puma Velophasis Luxury Edition.',
    canonicalURL: '/product/puma-velophasis-luxury-edition'
  },
  {
    id: 'prod-nb-9060-sea-salt',
    slug: 'new-balance-9060-sea-salt-gold',
    sku: 'NB-9060-05',
    brand: 'NEW BALANCE',
    category: 'Lifestyle',
    name: 'New Balance 9060 Sea Salt Gold',
    shortDescription: 'Futuristic chunky silhouette with ABZORB dual-density midsole.',
    price: 12999,
    comparePrice: 19999,
    currency: 'INR',
    images: ['/nb_9060_nobg.png'],
    primaryImage: '/nb_9060_nobg.png',
    availableSizes: ['UK 8', 'UK 9', 'UK 10', 'UK 11'],
    availableColors: ['Sea Salt', 'Gold'],
    stockStatus: 'In Stock',
    limitedEdition: true,
    rating: 4.9,
    reviewCount: 180,
    tags: ['NB 9060', 'New Balance', 'Sea Salt'],
    seoTitle: 'New Balance 9060 Sea Salt Gold — LNKICKS',
    seoDescription: 'Authentic New Balance 9060 Sea Salt Gold.',
    canonicalURL: '/product/new-balance-9060-sea-salt-gold'
  }
];
