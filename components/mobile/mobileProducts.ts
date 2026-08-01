/**
 * MobileProducts — centralized product data for the LN KICKS mobile homepage.
 *
 * All image URLs are verified-working CDN links (Google-hosted aida-public
 * + ZAI image-search OSS). Hrefs point to existing shared product routes
 * so mobile and desktop users land on the SAME product detail page.
 *
 * Theme: premium white + black + soft grey. No blue, no colorful gradients.
 */

import type { SliderProduct } from '@/components/desktop/PremiumProductSlider';

export interface MobileProduct extends SliderProduct {}

/* ──────────────────────────────────────────────────────────────────────
 *  FEATURED COLLECTION — editorial hero collection (3 cards)
 * ────────────────────────────────────────────────────────────────────── */
export const MOBILE_FEATURED: MobileProduct[] = [
  {
    id: 'mf-aj1-powder',
    brand: 'Air Jordan',
    name: 'Air Jordan 1 Low Powder Blue',
    price: 'Rs. 8,899',
    priceValue: 8899,
    comparePrice: 'Rs. 18,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
  },
  {
    id: 'mf-dunk-rose',
    brand: 'Nike',
    name: "Nike Dunk Low 'Rose Whisper'",
    price: 'Rs. 7,399',
    priceValue: 7399,
    comparePrice: 'Rs. 12,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
  },
  {
    id: 'mf-samba',
    brand: 'Adidas',
    name: "Adidas Samba OG 'Wonder Silver'",
    price: 'Rs. 6,199',
    priceValue: 6199,
    comparePrice: 'Rs. 22,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-samba-og-wonder-silver',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  TRENDING SNEAKERS — horizontal slider (6 products)
 * ────────────────────────────────────────────────────────────────────── */
export const MOBILE_TRENDING: MobileProduct[] = [
  {
    id: 'mt-aj1-powder',
    brand: 'Air Jordan',
    name: 'Air Jordan 1 Low Powder Blue',
    price: 'Rs. 8,899',
    priceValue: 8899,
    comparePrice: 'Rs. 18,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-black-powder-blue',
  },
  {
    id: 'mt-dunk-rose',
    brand: 'Nike',
    name: "Nike Dunk Low 'Rose Whisper'",
    price: 'Rs. 7,399',
    priceValue: 7399,
    comparePrice: 'Rs. 12,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-rose-whisper',
  },
  {
    id: 'mt-samba',
    brand: 'Adidas',
    name: "Adidas Samba OG 'Wonder Silver'",
    price: 'Rs. 6,199',
    priceValue: 6199,
    comparePrice: 'Rs. 22,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-samba-og-wonder-silver',
  },
  {
    id: 'mt-aj1-panda',
    brand: 'Air Jordan',
    name: "Air Jordan 1 Low 'Panda'",
    price: 'Rs. 9,399',
    priceValue: 9399,
    comparePrice: 'Rs. 21,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-panda',
  },
  {
    id: 'mt-nb530',
    brand: 'New Balance',
    name: "New Balance 530 'Steel Grey'",
    price: 'Rs. 9,499',
    priceValue: 9499,
    comparePrice: 'Rs. 20,499',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/new-balance-530-steel-grey',
  },
  {
    id: 'mt-foam-runner',
    brand: 'Yeezy',
    name: "Yeezy Foam Runner 'MX Cinder'",
    price: 'Rs. 9,299',
    priceValue: 9299,
    comparePrice: 'Rs. 14,499',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/yeezy-foam-runner-mx-cinder',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  LUXURY SHOES — premium maison carousel (5 products)
 * ────────────────────────────────────────────────────────────────────── */
export const MOBILE_LUXURY: MobileProduct[] = [
  {
    id: 'ml-lv-trainer',
    brand: 'Louis Vuitton',
    name: 'LV Trainer Sneaker',
    price: 'Rs. 1,49,000',
    priceValue: 149000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/lv-trainer-sneaker',
  },
  {
    id: 'ml-gucci-screener',
    brand: 'Gucci',
    name: 'Gucci Screener Sneaker',
    price: 'Rs. 88,999',
    priceValue: 88999,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/gucci-screener-sneaker',
  },
  {
    id: 'ml-prada-cup',
    brand: 'Prada',
    name: "Prada America's Cup Sneaker",
    price: 'Rs. 1,12,000',
    priceValue: 112000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/prada-americas-cup-sneaker',
  },
  {
    id: 'ml-balenciaga-triple',
    brand: 'Balenciaga',
    name: 'Balenciaga Triple S Sneaker',
    price: 'Rs. 95,000',
    priceValue: 95000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/balenciaga-triple-s-sneaker',
  },
  {
    id: 'ml-dior-b23',
    brand: 'Dior',
    name: 'Dior B23 High-Top Sneaker',
    price: 'Rs. 1,28,000',
    priceValue: 128000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeDHgD4sdEolj1Q6YY0dFBFam5YpICGBA2dZIy1CsoaOAyvFhphvbL7FSkNTAYouunPHoG9hNcKTvSWYd8ErjQY04V5XGIz8bL0hISKMtP5b4D4Qd5BnVZyOH32cafz8bJ5ecFNv5utNkkIW5w6gGyQftyHuDaBBRAkh9yHhMJ0E1VeGuDflsHiijdR0pef1sF8riPx9Jszb6CVCfz413_6TGPUGpuRbUCa5_hkXTubgyzvTrBsJ7mg',
    href: '/product/dior-b23-high-top-sneaker',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  DESIGNER SNEAKERS — premium maison showcase (5 products)
 *
 *  Uses only verified-working Google CDN URLs (the same 4 luxury maison
 *  images from LuxuryShoes). The z-cdn.chatglm.cn OSS URLs returned 200
 *  on HEAD but are blocked by browser referrer/CORS policy, so we cannot
 *  use them for <img> tags in production.
 * ────────────────────────────────────────────────────────────────────── */
export const MOBILE_DESIGNER: MobileProduct[] = [
  {
    id: 'md-dior-b23',
    brand: 'Dior',
    name: 'Dior B23 High-Top Oblique Sneaker',
    price: 'Rs. 1,28,000',
    priceValue: 128000,
    comparePrice: 'Rs. 1,55,000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeDHgD4sdEolj1Q6YY0dFBFam5YpICGBA2dZIy1CsoaOAyvFhphvbL7FSkNTAYouunPHoG9hNcKTvSWYd8ErjQY04V5XGIz8bL0hISKMtP5b4D4Qd5BnVZyOH32cafz8bJ5ecFNv5utNkkIW5w6gGyQftyHuDaBBRAkh9yHhMJ0E1VeGuDflsHiijdR0pef1sF8riPx9Jszb6CVCfz413_6TGPUGpuRbUCa5_hkXTubgyzvTrBsJ7mg',
    href: '/product/dior-b23-high-top-sneaker',
  },
  {
    id: 'md-lv-trainer',
    brand: 'Louis Vuitton',
    name: 'LV Trainer Sneaker',
    price: 'Rs. 1,49,000',
    priceValue: 149000,
    comparePrice: 'Rs. 1,75,000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/lv-trainer-sneaker',
  },
  {
    id: 'md-gucci-screener',
    brand: 'Gucci',
    name: 'Gucci Screener Sneaker',
    price: 'Rs. 88,999',
    priceValue: 88999,
    comparePrice: 'Rs. 1,05,000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/gucci-screener-sneaker',
  },
  {
    id: 'md-prada-cup',
    brand: 'Prada',
    name: "Prada America's Cup Sneaker",
    price: 'Rs. 1,12,000',
    priceValue: 112000,
    comparePrice: 'Rs. 1,35,000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/prada-americas-cup-sneaker',
  },
  {
    id: 'md-balenciaga-triple',
    brand: 'Balenciaga',
    name: 'Balenciaga Triple S Sneaker',
    price: 'Rs. 95,000',
    priceValue: 95000,
    comparePrice: 'Rs. 1,18,000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/balenciaga-triple-s-sneaker',
  },
  {
    id: 'md-aj1-panda',
    brand: 'Air Jordan',
    name: "Air Jordan 1 Low 'Panda'",
    price: 'Rs. 9,399',
    priceValue: 9399,
    comparePrice: 'Rs. 21,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
    href: '/product/air-jordan-1-low-panda',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  LATEST DROPS — new arrivals grid (4 products)
 *  Uses only verified-working Google CDN URLs.
 * ────────────────────────────────────────────────────────────────────── */
export const MOBILE_LATEST: MobileProduct[] = [
  {
    id: 'mlat-dunk-purple',
    brand: 'Nike',
    name: "Nike Dunk Low 'Court Purple'",
    price: 'Rs. 6,499',
    priceValue: 6499,
    comparePrice: 'Rs. 14,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
    href: '/product/nike-dunk-low-court-purple',
  },
  {
    id: 'mlat-yeezy-slide',
    brand: 'Adidas Yeezy',
    name: "Adidas Yeezy Slide 'Onyx'",
    price: 'Rs. 10,499',
    priceValue: 10499,
    comparePrice: 'Rs. 15,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/adidas-yeezy-slide-onyx',
  },
  {
    id: 'mlat-nb530',
    brand: 'New Balance',
    name: "New Balance 530 'Steel Grey'",
    price: 'Rs. 9,499',
    priceValue: 9499,
    comparePrice: 'Rs. 20,499',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
    href: '/product/new-balance-530-steel-grey',
  },
  {
    id: 'mlat-foam-runner',
    brand: 'Yeezy',
    name: "Yeezy Foam Runner 'MX Cinder'",
    price: 'Rs. 9,299',
    priceValue: 9299,
    comparePrice: 'Rs. 14,499',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
    href: '/product/yeezy-foam-runner-mx-cinder',
  },
];

/* ──────────────────────────────────────────────────────────────────────
 *  BRANDS — wordmark list for marquee section
 * ────────────────────────────────────────────────────────────────────── */
export const MOBILE_BRANDS: { name: string; className: string }[] = [
  { name: 'Nike', className: 'mb-nike' },
  { name: 'Jordan', className: 'mb-jordan' },
  { name: 'Adidas', className: 'mb-adidas' },
  { name: 'Puma', className: 'mb-puma' },
  { name: 'Reebok', className: 'mb-reebok' },
  { name: 'Converse', className: 'mb-converse' },
  { name: 'Vans', className: 'mb-vans' },
  { name: 'HOKA', className: 'mb-hoka' },
  { name: 'New Balance', className: 'mb-newbalance' },
  { name: 'ASICS', className: 'mb-asics' },
  { name: 'Yeezy', className: 'mb-yeezy' },
];

/* ──────────────────────────────────────────────────────────────────────
 *  CATEGORIES — quick-link tiles for the category rail
 * ────────────────────────────────────────────────────────────────────── */
export const MOBILE_CATEGORIES: {
  id: string;
  label: string;
  href: string;
  image: string;
}[] = [
  {
    id: 'cat-lifestyle',
    label: 'Lifestyle',
    href: '/category/lifestyle',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE5C4VKoj2h80qfWMDwUx1GW6pYc1F4_Uectmiw-2WzLVSjlGgc-qdXf677UyetETAtMvKPa1kHCOQFUGrea8nKVhbz1ir8aMZQJbOr7jtryq6NiPCwPVdQj9zIk3iWY23kmyaGYF9gLDZrQESpO8FfFxOXZg_Ynz-mHhmbVnYIB-QgR0_qYA3WFCl7P0zKKMnaYhRwEoacj8NTonQtA-rkEdgpZjAYvnqvZ_frpgr9YdsfzEjJ6ddg',
  },
  {
    id: 'cat-running',
    label: 'Running',
    href: '/category/running',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2H2sQCPwnRw-SialSCGXn-ATjYSC03s-gKZxnS9tKGCOP0UH2nXfpcFc0-2L7HkXP_nl9cIYuBaCSgZJUCjVAYKnv5t4HeT5O7qq32pjqtScVMel8GuUMHwmv8USOKPypALNCN_NcLCPp4gW6Pc7_Nm6yHSuulGQZdEIMZkhs5JONuzXo946yBXmQdQTQyQg6qAxk_ratsG8DDnrnjKEFYxj68X-gtdg5Do-dEQTJd7SI4vbHvpzAQw',
  },
  {
    id: 'cat-basketball',
    label: 'Basketball',
    href: '/category/basketball',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw',
  },
  {
    id: 'cat-skate',
    label: 'Skate',
    href: '/category/skate',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
  },
  {
    id: 'cat-luxury',
    label: 'Luxury',
    href: '/category/luxury',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeDHgD4sdEolj1Q6YY0dFBFam5YpICGBA2dZIy1CsoaOAyvFhphvbL7FSkNTAYouunPHoG9hNcKTvSWYd8ErjQY04V5XGIz8bL0hISKMtP5b4D4Qd5BnVZyOH32cafz8bJ5ecFNv5utNkkIW5w6gGyQftyHuDaBBRAkh9yHhMJ0E1VeGuDflsHiijdR0pef1sF8riPx9Jszb6CVCfz413_6TGPUGpuRbUCa5_hkXTubgyzvTrBsJ7mg',
  },
  {
    id: 'cat-slides',
    label: 'Slides',
    href: '/category/slides',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw',
  },
];
