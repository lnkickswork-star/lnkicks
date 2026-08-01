/**
 * SliderProducts — centralized product data for premium category sliders.
 *
 * Each category section on the homepage pulls from these arrays. Images
 * are verified-working CDN URLs (Google-hosted aida-public + ZAI image-search
 * OSS re-hosted). Hrefs point to existing product/category routes only.
 *
 * Badge variants: 'black' (default) | 'red' (sale) | 'gold' (limited) | 'cream'
 */

import type { SliderProduct } from './PremiumProductSlider';

/* ──────────────────────────────────────────────────────────────────────
 *  TRENDING THIS WEEK — mixed brand showcase
 * ────────────────────────────────────────────────────────────────────── */
export const TRENDING_PRODUCTS: SliderProduct[] = [
  {
    id: 'trend-aj1-powder',
    brand: 'Air Jordan',
    name: 'Air Jordan 1 Low Black Powder Blue',
    price: 'Rs. 8,899',
    priceValue: 8899,
    comparePrice: 'Rs. 18,999',
    badge: 'Instant Ship',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
  },
  {
    id: 'trend-dunk-rose',
    brand: 'Nike',
    name: "Nike Dunk Low 'Rose Whisper'",
    price: 'Rs. 7,399',
    priceValue: 7399,
    comparePrice: 'Rs. 12,999',
    badge: 'New Drop',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
  },
  {
    id: 'trend-samba',
    brand: 'Adidas',
    name: "Adidas Samba OG 'Wonder Silver'",
    price: 'Rs. 6,199',
    priceValue: 6199,
    comparePrice: 'Rs. 22,999',
    badge: 'Monsoon Sale',
    badgeVariant: 'red',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-samba-og-wonder-silver',
  },
  {
    id: 'trend-aj1-panda',
    brand: 'Air Jordan',
    name: "Air Jordan 1 Low 'Panda'",
    price: 'Rs. 9,399',
    priceValue: 9399,
    comparePrice: 'Rs. 21,999',
    badge: 'Best Seller',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-panda',
  },
  {
    id: 'trend-nb530',
    brand: 'New Balance',
    name: "New Balance 530 'Steel Grey'",
    price: 'Rs. 9,499',
    priceValue: 9499,
    comparePrice: 'Rs. 20,499',
    badge: 'Limited',
    badgeVariant: 'gold',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/new-balance-530-steel-grey',
  },
  {
    id: 'trend-foam-runner',
    brand: 'Yeezy',
    name: "Yeezy Foam Runner 'MX Cinder'",
    price: 'Rs. 9,299',
    priceValue: 9299,
    comparePrice: 'Rs. 14,499',
    badge: 'Restocked',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/yeezy-foam-runner-mx-cinder',
  },
  {
    id: 'trend-dunk-purple',
    brand: 'Nike',
    name: "Nike Dunk Low 'Court Purple'",
    price: 'Rs. 6,499',
    priceValue: 6499,
    comparePrice: 'Rs. 14,999',
    badge: 'Instant Ship',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-court-purple',
  },
  {
    id: 'trend-yeezy-slide',
    brand: 'Adidas Yeezy',
    name: "Adidas Yeezy Slide 'Onyx'",
    price: 'Rs. 10,499',
    priceValue: 10499,
    comparePrice: 'Rs. 15,999',
    badge: 'Premium',
    badgeVariant: 'cream',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-yeezy-slide-onyx',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  DESIGNER SNEAKERS — luxury maison showcase (Gucci, Amiri, Balenciaga,
 *  Louis Vuitton, Dior, Margiela, Off-White, McQueen, Saint Laurent,
 *  Bottega Veneta). Premium floating-product slider with arrows beside
 *  the heading. NO badges. NO category pills. ONE Add to Cart CTA.
 * ────────────────────────────────────────────────────────────────────── */
export const DESIGNER_SNEAKERS: SliderProduct[] = [
  {
    id: 'ds-amiri-skeleton',
    brand: 'Amiri',
    name: 'Amiri Skeleton Runner Black Leather',
    price: 'Rs. 88,999',
    priceValue: 88999,
    comparePrice: 'Rs. 1,14,499',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7ce9504e74c9.jpg',
    href: '/product/amiri-skeleton-runner',
  },
  {
    id: 'ds-margiela-german',
    brand: 'Maison Margiela',
    name: "Margiela Replica German Trainer",
    price: 'Rs. 74,999',
    priceValue: 74999,
    comparePrice: 'Rs. 92,000',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0111bfeab797.jpg',
    href: '/product/margiela-replica-german-trainer',
  },
  {
    id: 'ds-offwhite-ooo',
    brand: 'Off-White',
    name: "Off-White OOO Canvas Sneaker",
    price: 'Rs. 52,999',
    priceValue: 52999,
    comparePrice: 'Rs. 68,000',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/38d3b39730f6.jpg',
    href: '/product/off-white-ooo-canvas',
  },
  {
    id: 'ds-mcqueen-oversized',
    brand: 'Alexander McQueen',
    name: "Alexander McQueen Oversized White",
    price: 'Rs. 62,499',
    priceValue: 62499,
    comparePrice: 'Rs. 78,000',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3026e549e391.jpg',
    href: '/product/mcqueen-oversized-white',
  },
  {
    id: 'ds-balenciaga-speed',
    brand: 'Balenciaga',
    name: "Balenciaga Speed Sock Knit Black",
    price: 'Rs. 70,999',
    priceValue: 70999,
    comparePrice: 'Rs. 89,000',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6b9d02b45f61.jpg',
    href: '/product/balenciaga-speed-sock-knit',
  },
  {
    id: 'ds-sl-06',
    brand: 'Saint Laurent',
    name: "Saint Laurent SL/06 Court Sneaker",
    price: 'Rs. 67,999',
    priceValue: 67999,
    comparePrice: 'Rs. 82,000',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/85d97f07ea43.jpg',
    href: '/product/saint-laurent-sl06-court',
  },
  {
    id: 'ds-bottega-track',
    brand: 'Bottega Veneta',
    name: "Bottega Veneta Track Sneaker",
    price: 'Rs. 89,999',
    priceValue: 89999,
    comparePrice: 'Rs. 1,10,000',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/89e79109c536.jpg',
    href: '/product/bottega-veneta-track',
  },
  {
    id: 'ds-dior-b23',
    brand: 'Dior',
    name: "Dior B23 High-Top Oblique Sneaker",
    price: 'Rs. 1,28,000',
    priceValue: 128000,
    comparePrice: 'Rs. 1,55,000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeDHgD4sdEolj1Q6YY0dFBFam5YpICGBA2dZIy1CsoaOAyvFhphvbL7FSkNTAYouunPHoG9hNcKTvSWYd8ErjQY04V5XGIz8bL0hISKMtP5b4D4Qd5BnVZyOH32cafz8bJ5ecFNv5utNkkIW5w6gGyQftyHuDaBBRAkh9yHhMJ0E1VeGuDflsHiijdR0pef1sF8riPx9Jszb6CVCfz413_6TGPUGpuRbUCa5_hkXTubgyzvTrBsJ7mg',
    href: '/product/dior-b23-high-top-sneaker',
  },
];

