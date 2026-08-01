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
    comparePrice: 'Rs. 15,999',
    badge: 'Premium',
    badgeVariant: 'cream',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-yeezy-slide-onyx',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  NIKE RUNNING — performance running silhouettes
 * ────────────────────────────────────────────────────────────────────── */
export const NIKE_RUNNING_PRODUCTS: SliderProduct[] = [
  {
    id: 'nr-1',
    brand: 'Nike',
    name: 'Nike Air Max 90 "Infrared"',
    price: 'Rs. 11,999',
    comparePrice: 'Rs. 16,999',
    badge: 'Instant Ship',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/410762000a81.png',
    href: '/categories',
  },
  {
    id: 'nr-2',
    brand: 'Nike',
    name: 'Nike Air Max 1 "Triple White"',
    price: 'Rs. 10,499',
    comparePrice: 'Rs. 14,999',
    badge: 'New Drop',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/20842055dd98.png',
    href: '/categories',
  },
  {
    id: 'nr-3',
    brand: 'Nike',
    name: 'Nike Pegasus 40 "Black White"',
    price: 'Rs. 8,799',
    comparePrice: 'Rs. 12,499',
    badge: 'Best Seller',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a05b5735724c.jpg',
    href: '/categories',
  },
  {
    id: 'nr-4',
    brand: 'Nike',
    name: 'Nike Vapormax Flyknit 3',
    price: 'Rs. 14,999',
    comparePrice: 'Rs. 22,999',
    badge: 'Limited',
    badgeVariant: 'gold',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f1556aa3d5f1.png',
    href: '/categories',
  },
  {
    id: 'nr-5',
    brand: 'Nike',
    name: "Nike Dunk Low 'Rose Whisper'",
    price: 'Rs. 7,399',
    comparePrice: 'Rs. 12,999',
    badge: 'Monsoon Sale',
    badgeVariant: 'red',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
  },
  {
    id: 'nr-6',
    brand: 'Nike',
    name: "Nike Dunk Low 'Court Purple'",
    price: 'Rs. 6,499',
    comparePrice: 'Rs. 14,999',
    badge: 'Instant Ship',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-court-purple',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  JORDAN COLLECTION — Air Jordan retro silhouettes
 * ────────────────────────────────────────────────────────────────────── */
export const JORDAN_PRODUCTS: SliderProduct[] = [
  {
    id: 'jc-1',
    brand: 'Air Jordan',
    name: 'Air Jordan 1 Low Black Powder Blue',
    price: 'Rs. 8,899',
    comparePrice: 'Rs. 18,999',
    badge: 'Instant Ship',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
  },
  {
    id: 'jc-2',
    brand: 'Air Jordan',
    name: "Air Jordan 1 Low 'Panda'",
    price: 'Rs. 9,399',
    comparePrice: 'Rs. 21,999',
    badge: 'Best Seller',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-panda',
  },
  {
    id: 'jc-3',
    brand: 'Air Jordan',
    name: "Air Jordan 4 'Bred'",
    price: 'Rs. 18,999',
    comparePrice: 'Rs. 28,999',
    badge: 'Limited',
    badgeVariant: 'gold',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2872bf390dce.jpg',
    href: '/categories',
  },
  {
    id: 'jc-4',
    brand: 'Air Jordan',
    name: 'Air Jordan 1 Mid "Chicago"',
    price: 'Rs. 12,499',
    comparePrice: 'Rs. 19,999',
    badge: 'New Drop',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e14d8403d6a4.jpg',
    href: '/categories',
  },
  {
    id: 'jc-5',
    brand: 'Air Jordan',
    name: 'Air Jordan 1 High "Black Toe"',
    price: 'Rs. 16,999',
    comparePrice: 'Rs. 24,999',
    badge: 'Restocked',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2ef0bdd35267.jpg',
    href: '/categories',
  },
  {
    id: 'jc-6',
    brand: 'Air Jordan',
    name: 'Air Jordan 5 "Grape"',
    price: 'Rs. 15,499',
    comparePrice: 'Rs. 23,999',
    badge: 'Premium',
    badgeVariant: 'cream',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eacd4346337b.jpg',
    href: '/categories',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  ADIDAS ORIGINALS — Samba, Gazelle, Yeezy
 * ────────────────────────────────────────────────────────────────────── */
export const ADIDAS_PRODUCTS: SliderProduct[] = [
  {
    id: 'ao-1',
    brand: 'Adidas',
    name: "Adidas Samba OG 'Wonder Silver'",
    price: 'Rs. 6,199',
    comparePrice: 'Rs. 22,999',
    badge: 'Monsoon Sale',
    badgeVariant: 'red',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-samba-og-wonder-silver',
  },
  {
    id: 'ao-2',
    brand: 'Adidas Yeezy',
    name: "Adidas Yeezy Slide 'Onyx'",
    price: 'Rs. 10,499',
    comparePrice: 'Rs. 15,999',
    badge: 'Instant Ship',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-yeezy-slide-onyx',
  },
  {
    id: 'ao-3',
    brand: 'Adidas',
    name: 'Adidas Gazelle Indoor "Blue"',
    price: 'Rs. 7,499',
    comparePrice: 'Rs. 11,999',
    badge: 'New Drop',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eb14905e94a9.jpg',
    href: '/categories',
  },
  {
    id: 'ao-4',
    brand: 'Adidas',
    name: 'Adidas Samba OG "White Black"',
    price: 'Rs. 6,999',
    comparePrice: 'Rs. 12,999',
    badge: 'Best Seller',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/85001d66a4da.jpg',
    href: '/categories',
  },
  {
    id: 'ao-5',
    brand: 'Adidas',
    name: 'Adidas Campus 00s "Cloud White"',
    price: 'Rs. 7,999',
    comparePrice: 'Rs. 13,499',
    badge: 'Limited',
    badgeVariant: 'gold',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ee3de094377e.jpg',
    href: '/categories',
  },
  {
    id: 'ao-6',
    brand: 'Adidas',
    name: 'Adidas Forum Low "Clay Strata"',
    price: 'Rs. 8,499',
    comparePrice: 'Rs. 14,999',
    badge: 'Restocked',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e8306086ed6b.jpg',
    href: '/categories',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  YEEZY COLLECTION
 * ────────────────────────────────────────────────────────────────────── */
export const YEEZY_PRODUCTS: SliderProduct[] = [
  {
    id: 'yc-1',
    brand: 'Yeezy',
    name: "Yeezy Boost 350 V2 'Zebra'",
    price: 'Rs. 22,999',
    comparePrice: 'Rs. 34,999',
    badge: 'Limited',
    badgeVariant: 'gold',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fc0a6cd8ea34.png',
    href: '/categories',
  },
  {
    id: 'yc-2',
    brand: 'Yeezy',
    name: "Yeezy Boost 700 'Wave Runner'",
    price: 'Rs. 24,499',
    comparePrice: 'Rs. 36,999',
    badge: 'Best Seller',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/94662ce04934.jpg',
    href: '/categories',
  },
  {
    id: 'yc-3',
    brand: 'Yeezy',
    name: "Yeezy Slide 'Onyx'",
    price: 'Rs. 10,499',
    comparePrice: 'Rs. 15,999',
    badge: 'Instant Ship',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-yeezy-slide-onyx',
  },
  {
    id: 'yc-4',
    brand: 'Yeezy',
    name: "Yeezy Foam Runner 'MX Cinder'",
    price: 'Rs. 9,299',
    comparePrice: 'Rs. 14,499',
    badge: 'Restocked',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/yeezy-foam-runner-mx-cinder',
  },
  {
    id: 'yc-5',
    brand: 'Yeezy',
    name: "Yeezy Boost 350 'Bred'",
    price: 'Rs. 21,999',
    comparePrice: 'Rs. 32,999',
    badge: 'Premium',
    badgeVariant: 'cream',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/08386a4def95.jpg',
    href: '/categories',
  },
  {
    id: 'yc-6',
    brand: 'Yeezy',
    name: "Yeezy Slide 'Bone'",
    price: 'Rs. 9,999',
    comparePrice: 'Rs. 14,999',
    badge: 'New Drop',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/055c25e21dcb.jpg',
    href: '/categories',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  NEW BALANCE COLLECTION
 * ────────────────────────────────────────────────────────────────────── */
export const NEW_BALANCE_PRODUCTS: SliderProduct[] = [
  {
    id: 'nb-1',
    brand: 'New Balance',
    name: "New Balance 530 'Steel Grey'",
    price: 'Rs. 9,499',
    comparePrice: 'Rs. 20,499',
    badge: 'Instant Ship',
    badgeVariant: 'black',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/new-balance-530-steel-grey',
  },
  {
    id: 'nb-2',
    brand: 'New Balance',
    name: 'New Balance 9060 "Sea Salt"',
    price: 'Rs. 12,999',
    comparePrice: 'Rs. 19,999',
    badge: 'Limited',
    badgeVariant: 'gold',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d6ee3b6142a1.jpg',
    href: '/categories',
  },
  {
    id: 'nb-3',
    brand: 'New Balance',
    name: 'New Balance 2002R "Protection Pack"',
    price: 'Rs. 14,499',
    comparePrice: 'Rs. 22,999',
    badge: 'Best Seller',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6c59b732cd16.png',
    href: '/categories',
  },
  {
    id: 'nb-4',
    brand: 'New Balance',
    name: 'New Balance 990v6 "Grey"',
    price: 'Rs. 16,999',
    comparePrice: 'Rs. 24,999',
    badge: 'Premium',
    badgeVariant: 'cream',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ba10b22b0dca.png',
    href: '/categories',
  },
  {
    id: 'nb-5',
    brand: 'New Balance',
    name: 'New Balance 327 "Casablanca"',
    price: 'Rs. 11,499',
    comparePrice: 'Rs. 17,999',
    badge: 'New Drop',
    badgeVariant: 'black',
    image:
      'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/09e5af2f7c1c.jpg',
    href: '/categories',
  },
];
