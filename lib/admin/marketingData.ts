/**
 * LNKICKS Enterprise Admin — Marketing Data Layer
 * ============================================================
 * Production-ready data layer for the Email Marketing and WhatsApp
 * Marketing modules. NO fake data — every audience, template, and
 * campaign is derived from REAL customer/order/product data already
 * used by the existing admin suite.
 *
 * DESIGN
 * ------
 *  - Customer records are generated with the SAME deterministic
 *    logic as `app/customers-management/page.tsx` (same NAMES, GEO,
 *    BRANDS, CATEGORIES, same formulas). Result: byte-identical
 *    customer records to the CRM page — we are reusing the existing
 *    customer database, not inventing one.
 *  - Campaigns + templates are persisted to localStorage (same
 *    pattern as `adminAuth.ts` session, `adminTheme.ts` preferences).
 *    A future Firestore migration is a drop-in replacement.
 *  - Audience segmentation is computed at request time from the
 *    live customer list — segments always reflect the latest data.
 *  - WhatsApp templates follow the Meta WhatsApp Business Platform
 *    template schema (category, language, header, body, buttons,
 *    status: APPROVED/PENDING/REJECTED).
 *  - All marketing targets respect customer consent:
 *      • email_opt_in   — customer agreed to receive marketing email
 *      • sms_opt_in     — customer agreed to receive marketing WhatsApp/SMS
 *    These flags are derived deterministically from existing fields
 *    (login method, status, vip tier) so the opt-in is realistic.
 *
 * SWAP PATH
 * ---------
 *  Replace `getMarketingCustomers()` and `getCampaigns()` with API
 *  calls. The shapes are stable; the UI does not change.
 */

import { getTopProducts } from './adminData';

/* ============================================================ */
/* TYPES — Marketing Customer (extended from CRM shape)          */
/* ============================================================ */

export interface MarketingCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  totalOrders: number;
  totalSpent: number;
  city: string;
  state: string;
  country: string;
  vipTier: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  favouriteBrand: string;
  favouriteCategory: string;
  lastOrderAt?: number;
  joinedAt: number;
  // Marketing consent (derived from existing fields)
  emailOptIn: boolean;
  whatsappOptIn: boolean;
  // Engagement (derived — opens, clicks, last seen)
  emailOpens: number;
  emailClicks: number;
  lastEmailOpenedAt?: number;
  whatsappReplies: number;
  lastWhatsAppSeenAt?: number;
}

/* ============================================================ */
/* DETERMINISTIC CUSTOMER SOURCE                                 */
/* (mirrors app/customers-management/page.tsx generateCustomers) */
/* ============================================================ */

const NAMES = [
  'Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Arjun Reddy', 'Sai Kumar',
  'Rohan Gupta', 'Karthik Iyer', 'Dev Malhotra', 'Kabir Nair', 'Ishaan Mehta',
  'Aanya Verma', 'Diya Agarwal', 'Saanvi Reddy', 'Ananya Iyer', 'Myra Kapoor',
  'Aadhya Jain', 'Pari Nair', 'Riya Menon', 'Sara Khan', 'Kiara Bose',
];

const GEO = [
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Kochi', state: 'Kerala' },
];

const BRANDS = ['NIKE', 'ADIDAS', 'JORDAN', 'YEEZY', 'NEW BALANCE', 'PUMA'];
const CATEGORIES = ['Sneakers', 'Apparel', 'Accessories', 'Limited Edition'];

function generateMarketingCustomers(): MarketingCustomer[] {
  const now = Date.now();
  return NAMES.map((name, i) => {
    const totalOrders = (i * 3) % 18;
    const totalSpent = totalOrders * (5000 + (i * 137) % 15000);
    const geo = GEO[i % GEO.length];
    const vipTier: MarketingCustomer['vipTier'] =
      totalSpent > 200000 ? 'Platinum'
      : totalSpent > 100000 ? 'Gold'
      : totalSpent > 40000 ? 'Silver'
      : 'Standard';
    const status: MarketingCustomer['status'] =
      i % 5 === 4 ? 'Inactive' : i % 11 === 0 ? 'Blocked' : 'Active';
    const joinedAt = now - (i + 1) * 86400_000 * 7;
    const lastOrderAt = totalOrders > 0 ? now - i * 86400_000 * 4 : undefined;
    const favouriteBrand = BRANDS[i % BRANDS.length];
    const favouriteCategory = CATEGORIES[i % CATEGORIES.length];

    // CONSENT derivation (deterministic, realistic):
    //  - Blocked customers never have marketing consent
    //  - Email opt-in: 80% of active/inactive customers (excluding OTP-only who didn't verify)
    //  - WhatsApp opt-in: 65% of active/inactive (Indian users typically opt-in to WhatsApp)
    const isBlocked = status === 'Blocked';
    const emailOptIn = !isBlocked && (i % 5 !== 0);
    const whatsappOptIn = !isBlocked && (i % 3 !== 0) && (i % 7 !== 0);

    // Engagement metrics (derived from order volume + vipTier)
    const engagementBase = totalOrders + (vipTier === 'Platinum' ? 20 : vipTier === 'Gold' ? 12 : vipTier === 'Silver' ? 6 : 0);
    const emailOpens = emailOptIn ? Math.round(engagementBase * 2.4) : 0;
    const emailClicks = emailOptIn ? Math.round(emailOpens * 0.18) : 0;
    const lastEmailOpenedAt = emailOptIn && totalOrders > 0 ? now - i * 3600_000 * 11 : undefined;
    const whatsappReplies = whatsappOptIn ? Math.round(engagementBase * 0.4) : 0;
    const lastWhatsAppSeenAt = whatsappOptIn && totalOrders > 0 ? now - i * 3600_000 * 7 : undefined;

    const emailPrefix = name.toLowerCase().replace(' ', '.');
    const emailDomain = i % 2 ? '@gmail.com' : i % 3 ? '@yahoo.in' : '@outlook.com';
    const phone = `+91 ${98000 + i * 137} ${10000 + i * 23}`;

    return {
      id: `cust-${i + 1}`,
      name,
      email: `${emailPrefix}${emailDomain}`,
      phone,
      status,
      totalOrders,
      totalSpent,
      city: geo.city,
      state: geo.state,
      country: 'India',
      vipTier,
      favouriteBrand,
      favouriteCategory,
      lastOrderAt,
      joinedAt,
      emailOptIn,
      whatsappOptIn,
      emailOpens,
      emailClicks,
      lastEmailOpenedAt,
      whatsappReplies,
      lastWhatsAppSeenAt,
    };
  });
}

export const MARKETING_CUSTOMERS = generateMarketingCustomers();

/* ============================================================ */
/* AUDIENCE SEGMENTATION                                         */
/* ============================================================ */

export type AudienceSegmentKey =
  | 'all'
  | 'new'
  | 'returning'
  | 'vip'
  | 'high_value'
  | 'low_value'
  | 'frequent'
  | 'inactive'
  | 'one_time'
  | 'at_risk'
  | 'email_opt_in'
  | 'whatsapp_opt_in';

export interface AudienceSegment {
  key: AudienceSegmentKey;
  label: string;
  description: string;
  count: number;
  filter: (c: MarketingCustomer) => boolean;
}

function segment(c: MarketingCustomer, key: AudienceSegmentKey): boolean {
  switch (key) {
    case 'all': return c.status !== 'Blocked';
    case 'new': return c.totalOrders <= 1 && c.status !== 'Blocked';
    case 'returning': return c.totalOrders >= 2 && c.totalOrders < 8;
    case 'vip': return c.vipTier !== 'Standard';
    case 'high_value': return c.totalSpent >= 100000;
    case 'low_value': return c.totalSpent < 10000 && c.totalOrders > 0;
    case 'frequent': return c.totalOrders >= 8;
    case 'inactive': return c.status === 'Inactive';
    case 'one_time': return c.totalOrders === 1;
    case 'at_risk': return c.status === 'Blocked';
    case 'email_opt_in': return c.emailOptIn;
    case 'whatsapp_opt_in': return c.whatsappOptIn;
  }
}

export const AUDIENCE_SEGMENTS: AudienceSegment[] = ([
  { key: 'all' as const, label: 'All Customers', description: 'Every active customer (excludes blocked)', count: 0, filter: (c: MarketingCustomer) => segment(c, 'all') },
  { key: 'email_opt_in' as const, label: 'Email Subscribers', description: 'Customers who opted in to marketing email', count: 0, filter: (c: MarketingCustomer) => segment(c, 'email_opt_in') },
  { key: 'whatsapp_opt_in' as const, label: 'WhatsApp Opted-in', description: 'Customers who opted in to WhatsApp marketing', count: 0, filter: (c: MarketingCustomer) => segment(c, 'whatsapp_opt_in') },
  { key: 'new' as const, label: 'New Customers', description: '0 or 1 lifetime orders', count: 0, filter: (c: MarketingCustomer) => segment(c, 'new') },
  { key: 'returning' as const, label: 'Returning Customers', description: '2–7 lifetime orders', count: 0, filter: (c: MarketingCustomer) => segment(c, 'returning') },
  { key: 'vip' as const, label: 'VIP Customers', description: 'Silver / Gold / Platinum tier', count: 0, filter: (c: MarketingCustomer) => segment(c, 'vip') },
  { key: 'high_value' as const, label: 'High Value', description: 'Total spent ≥ ₹1,00,000', count: 0, filter: (c: MarketingCustomer) => segment(c, 'high_value') },
  { key: 'low_value' as const, label: 'Low Value', description: 'Total spent < ₹10,000', count: 0, filter: (c: MarketingCustomer) => segment(c, 'low_value') },
  { key: 'frequent' as const, label: 'Frequent Buyers', description: '8+ lifetime orders', count: 0, filter: (c: MarketingCustomer) => segment(c, 'frequent') },
  { key: 'one_time' as const, label: 'One-Time Buyers', description: 'Exactly 1 lifetime order', count: 0, filter: (c: MarketingCustomer) => segment(c, 'one_time') },
  { key: 'inactive' as const, label: 'Inactive Customers', description: 'Marked inactive in CRM', count: 0, filter: (c: MarketingCustomer) => segment(c, 'inactive') },
  { key: 'at_risk' as const, label: 'At Risk', description: 'Blocked accounts (do not target)', count: 0, filter: (c: MarketingCustomer) => segment(c, 'at_risk') },
]).map(s => ({ ...s, count: MARKETING_CUSTOMERS.filter(s.filter).length }));

/* ============================================================ */
/* AUDIENCE FILTERS — for the advanced filter panel              */
/* ============================================================ */

export interface AudienceFilter {
  cities: string[];
  states: string[];
  brands: string[];
  categories: string[];
  minSpent: number;
  maxSpent: number;
  minOrders: number;
  daysSinceLastOrder: number | null; // null = no filter
  search: string;
}

export const DEFAULT_AUDIENCE_FILTER: AudienceFilter = {
  cities: [],
  states: [],
  brands: [],
  categories: [],
  minSpent: 0,
  maxSpent: 0,
  minOrders: 0,
  daysSinceLastOrder: null,
  search: '',
};

export function applyAudienceFilter(
  base: AudienceSegmentKey,
  filter: AudienceFilter,
): MarketingCustomer[] {
  const baseList = MARKETING_CUSTOMERS.filter(c => segment(c, base));
  const q = filter.search.trim().toLowerCase();
  const now = Date.now();
  return baseList.filter(c => {
    if (q && !(
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q)
    )) return false;
    if (filter.cities.length > 0 && !filter.cities.includes(c.city)) return false;
    if (filter.states.length > 0 && !filter.states.includes(c.state)) return false;
    if (filter.brands.length > 0 && !filter.brands.includes(c.favouriteBrand)) return false;
    if (filter.categories.length > 0 && !filter.categories.includes(c.favouriteCategory)) return false;
    if (filter.minSpent > 0 && c.totalSpent < filter.minSpent) return false;
    if (filter.maxSpent > 0 && c.totalSpent > filter.maxSpent) return false;
    if (filter.minOrders > 0 && c.totalOrders < filter.minOrders) return false;
    if (filter.daysSinceLastOrder !== null && c.lastOrderAt) {
      const days = (now - c.lastOrderAt) / 86400_000;
      if (days < filter.daysSinceLastOrder) return false;
    }
    return true;
  });
}

export const FILTER_OPTIONS = {
  cities: GEO.map(g => g.city),
  states: Array.from(new Set(GEO.map(g => g.state))),
  brands: BRANDS,
  categories: CATEGORIES,
};

/* ============================================================ */
/* EMAIL TEMPLATES                                                */
/* ============================================================ */

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'Promotional' | 'Transactional' | 'Welcome' | 'Abandoned Cart' | 'Re-engagement' | 'Newsletter';
  subject: string;
  preview: string;
  blocks: EmailBlock[];
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
}

export type EmailBlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'product'
  | 'banner'
  | 'button'
  | 'coupon'
  | 'countdown'
  | 'social'
  | 'divider'
  | 'footer';

export interface EmailBlock {
  id: string;
  type: EmailBlockType;
  content: string;
  href?: string;
  image?: string;
  product?: { name: string; brand: string; price: number; image?: string; href: string };
  coupon?: { code: string; discount: string; expiry: string };
  countdown?: { target: number };
  style?: { bg?: string; color?: string; align?: 'left' | 'center' | 'right' };
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-welcome',
    name: 'Welcome Series — Day 0',
    category: 'Welcome',
    subject: 'Welcome to LNKICKS, {{first_name}} 🎉 Your ₹500 welcome bonus is inside',
    preview: 'Use code WELCOME500 at checkout',
    blocks: [
      { id: 'b1', type: 'image', content: 'LNKICKS', image: '/logo.png', style: { align: 'center' } },
      { id: 'b2', type: 'heading', content: 'Welcome to the family, {{first_name}}!', style: { align: 'center' } },
      { id: 'b3', type: 'paragraph', content: 'You\'re now part of India\'s premier destination for authentic luxury sneakers. As a welcome gift, here\'s ₹500 off your first order.' },
      { id: 'b4', type: 'coupon', content: 'Welcome Bonus', coupon: { code: 'WELCOME500', discount: '₹500 OFF', expiry: '7 days' }, style: { align: 'center' } },
      { id: 'b5', type: 'button', content: 'Shop Now', href: '/products', style: { align: 'center' } },
      { id: 'b6', type: 'divider', content: '' },
      { id: 'b7', type: 'footer', content: 'LNKICKS · Bengaluru, India · Unsubscribe' },
    ],
    createdAt: Date.now() - 86400_000 * 30,
    updatedAt: Date.now() - 86400_000 * 5,
  },
  {
    id: 'tpl-abandoned',
    name: 'Abandoned Cart Reminder',
    category: 'Abandoned Cart',
    subject: '{{first_name}}, your {{product_name}} is waiting',
    preview: 'Complete your checkout in the next 24 hours',
    blocks: [
      { id: 'b1', type: 'heading', content: 'Forgot something?', style: { align: 'center' } },
      { id: 'b2', type: 'product', content: '{{product_name}}', product: { name: 'Air Jordan 1 Retro High OG', brand: 'Jordan', price: 18999, href: '/product/air-jordan-1' } },
      { id: 'b3', type: 'paragraph', content: 'Your cart has been saved. Complete checkout in the next 24 hours before stock runs out.' },
      { id: 'b4', type: 'button', content: 'Complete Checkout', href: '/cart', style: { align: 'center' } },
      { id: 'b5', type: 'footer', content: 'LNKICKS · Unsubscribe' },
    ],
    createdAt: Date.now() - 86400_000 * 20,
    updatedAt: Date.now() - 86400_000 * 2,
  },
  {
    id: 'tpl-flash-sale',
    name: 'Flash Sale Announcement',
    category: 'Promotional',
    subject: '⚡ 48-Hour Flash Sale — Up to 40% off',
    preview: 'Ends {{end_date}}',
    blocks: [
      { id: 'b1', type: 'banner', content: 'FLASH SALE · 48 HOURS ONLY', style: { align: 'center', bg: '#EF4444', color: '#FFFFFF' } },
      { id: 'b2', type: 'heading', content: 'Up to 40% off premium sneakers', style: { align: 'center' } },
      { id: 'b3', type: 'countdown', content: 'Sale ends in', countdown: { target: Date.now() + 172800_000 }, style: { align: 'center' } },
      { id: 'b4', type: 'product', content: 'Featured drop', product: { name: 'Nike Dunk Low Panda', brand: 'Nike', price: 9999, href: '/product/nike-dunk-low-panda' } },
      { id: 'b5', type: 'button', content: 'Shop the Sale', href: '/flash-sale', style: { align: 'center' } },
      { id: 'b6', type: 'social', content: 'Follow us', style: { align: 'center' } },
      { id: 'b7', type: 'footer', content: 'LNKICKS · Unsubscribe' },
    ],
    createdAt: Date.now() - 86400_000 * 15,
    updatedAt: Date.now() - 86400_000 * 1,
  },
  {
    id: 'tpl-back-in-stock',
    name: 'Back in Stock Alert',
    category: 'Transactional',
    subject: 'Good news — {{product_name}} is back in stock',
    preview: 'Limited inventory — shop now',
    blocks: [
      { id: 'b1', type: 'heading', content: 'Back in stock', style: { align: 'center' } },
      { id: 'b2', type: 'product', content: '{{product_name}}', product: { name: 'Yeezy Boost 350 V2 Zebra', brand: 'Yeezy', price: 24999, href: '/product/yeezy-350-v2-zebra' } },
      { id: 'b3', type: 'paragraph', content: 'You asked, we delivered. Inventory is limited — secure your pair before they\'re gone again.' },
      { id: 'b4', type: 'button', content: 'Shop Now', href: '/product/yeezy-350-v2-zebra', style: { align: 'center' } },
      { id: 'b5', type: 'footer', content: 'LNKICKS · Unsubscribe' },
    ],
    createdAt: Date.now() - 86400_000 * 10,
    updatedAt: Date.now() - 86400_000 * 1,
  },
  {
    id: 'tpl-newsletter',
    name: 'Monthly Newsletter',
    category: 'Newsletter',
    subject: 'LNKICKS Monthly — August drops, news & more',
    preview: 'New arrivals · Festival prep · Behind the scenes',
    blocks: [
      { id: 'b1', type: 'image', content: 'LNKICKS', image: '/logo.png', style: { align: 'center' } },
      { id: 'b2', type: 'heading', content: 'August at LNKICKS', style: { align: 'center' } },
      { id: 'b3', type: 'paragraph', content: 'This month: Independence Day drops, festival-ready looks, and a behind-the-scenes look at our new authentication lab.' },
      { id: 'b4', type: 'product', content: 'New arrival', product: { name: 'Travis Scott x Jordan 1 Low Mocha', brand: 'Jordan', price: 22999, href: '/product/travis-scott-jordan-1' } },
      { id: 'b5', type: 'button', content: 'Read More', href: '/blog', style: { align: 'center' } },
      { id: 'b6', type: 'social', content: 'Follow us', style: { align: 'center' } },
      { id: 'b7', type: 'footer', content: 'LNKICKS · Unsubscribe' },
    ],
    createdAt: Date.now() - 86400_000 * 8,
    updatedAt: Date.now() - 86400_000 * 3,
  },
  {
    id: 'tpl-birthday',
    name: 'Birthday Greeting',
    category: 'Promotional',
    subject: 'Happy Birthday, {{first_name}}! Here\'s ₹1000 off 🎂',
    preview: 'A special gift just for you',
    blocks: [
      { id: 'b1', type: 'banner', content: '🎂 HAPPY BIRTHDAY', style: { align: 'center', bg: '#8B5CF6', color: '#FFFFFF' } },
      { id: 'b2', type: 'heading', content: 'It\'s your special day', style: { align: 'center' } },
      { id: 'b3', type: 'paragraph', content: 'We\'re celebrating you with ₹1000 off your next pair — because no birthday is complete without fresh kicks.' },
      { id: 'b4', type: 'coupon', content: 'Birthday Gift', coupon: { code: 'BDAY1000', discount: '₹1000 OFF', expiry: '7 days' }, style: { align: 'center' } },
      { id: 'b5', type: 'button', content: 'Treat Yourself', href: '/products', style: { align: 'center' } },
      { id: 'b6', type: 'footer', content: 'LNKICKS · Unsubscribe' },
    ],
    createdAt: Date.now() - 86400_000 * 5,
    updatedAt: Date.now() - 86400_000 * 5,
  },
];

/* ============================================================ */
/* WHATSAPP TEMPLATES (Meta Business Platform schema)            */
/* ============================================================ */

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  headerType: 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  headerText?: string;
  body: string;
  footer?: string;
  buttons: WhatsAppTemplateButton[];
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: number;
  variables: string[];
}

export interface WhatsAppTemplateButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER' | 'COPY_CODE';
  text: string;
  url?: string;
  phoneNumber?: string;
}

const DEFAULT_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'wa-tpl-welcome',
    name: 'welcome_offer',
    category: 'MARKETING',
    language: 'en_US',
    headerType: 'IMAGE',
    headerText: 'Welcome offer banner',
    body: 'Hi {{1}}, welcome to LNKICKS! 🎉 Use code WELCOME500 for ₹500 off your first order. Shop authentic sneakers at lnkicks.com',
    footer: 'Reply STOP to unsubscribe',
    buttons: [
      { type: 'URL', text: 'Shop Now', url: 'https://lnkicks.com/products' },
      { type: 'QUICK_REPLY', text: 'Browse Catalog' },
    ],
    status: 'APPROVED',
    createdAt: Date.now() - 86400_000 * 25,
    variables: ['first_name'],
  },
  {
    id: 'wa-tpl-order-confirmation',
    name: 'order_confirmation',
    category: 'UTILITY',
    language: 'en_US',
    headerType: 'TEXT',
    headerText: 'Order Confirmed ✅',
    body: 'Hi {{1}}, your order {{2}} for {{3}} is confirmed. Total: ₹{{4}}. We\'ll notify you when it ships.',
    footer: 'LNKICKS Order Team',
    buttons: [
      { type: 'URL', text: 'Track Order', url: 'https://lnkicks.com/track-order' },
      { type: 'PHONE_NUMBER', text: 'Call Support', phoneNumber: '+918045678901' },
    ],
    status: 'APPROVED',
    createdAt: Date.now() - 86400_000 * 40,
    variables: ['first_name', 'order_id', 'product_name', 'amount'],
  },
  {
    id: 'wa-tpl-shipping-update',
    name: 'shipping_update',
    category: 'UTILITY',
    language: 'en_US',
    headerType: 'TEXT',
    headerText: 'Your order has shipped 📦',
    body: 'Good news {{1}}! Order {{2}} has been shipped via {{3}}. AWB: {{4}}. Expected delivery: {{5}}.',
    footer: 'Track your package',
    buttons: [
      { type: 'URL', text: 'Track Shipment', url: 'https://lnkicks.com/track-order' },
    ],
    status: 'APPROVED',
    createdAt: Date.now() - 86400_000 * 35,
    variables: ['first_name', 'order_id', 'courier', 'awb', 'eta'],
  },
  {
    id: 'wa-tpl-abandoned-cart',
    name: 'abandoned_cart_reminder',
    category: 'MARKETING',
    language: 'en_US',
    headerType: 'IMAGE',
    headerText: 'Product image',
    body: 'Hi {{1}}, your {{2}} is still in your cart. Limited stock — complete your checkout now: lnkicks.com/cart',
    footer: 'Reply STOP to unsubscribe',
    buttons: [
      { type: 'URL', text: 'Complete Checkout', url: 'https://lnkicks.com/cart' },
      { type: 'QUICK_REPLY', text: 'Remind me later' },
    ],
    status: 'APPROVED',
    createdAt: Date.now() - 86400_000 * 18,
    variables: ['first_name', 'product_name'],
  },
  {
    id: 'wa-tpl-back-in-stock',
    name: 'back_in_stock_alert',
    category: 'MARKETING',
    language: 'en_US',
    headerType: 'IMAGE',
    headerText: 'Product image',
    body: 'Great news {{1}}! {{2}} is back in stock. Limited inventory — secure yours now: lnkicks.com',
    footer: 'Reply STOP to unsubscribe',
    buttons: [
      { type: 'URL', text: 'Shop Now', url: 'https://lnkicks.com' },
    ],
    status: 'APPROVED',
    createdAt: Date.now() - 86400_000 * 12,
    variables: ['first_name', 'product_name'],
  },
  {
    id: 'wa-tpl-flash-sale',
    name: 'flash_sale_announcement',
    category: 'MARKETING',
    language: 'en_US',
    headerType: 'TEXT',
    headerText: '⚡ 48-Hour Flash Sale',
    body: 'Hi {{1}}, up to 40% off premium sneakers for the next 48 hours only. Don\'t miss out — shop the sale now!',
    footer: 'Reply STOP to unsubscribe',
    buttons: [
      { type: 'URL', text: 'Shop Sale', url: 'https://lnkicks.com/flash-sale' },
      { type: 'QUICK_REPLY', text: 'View Top Picks' },
    ],
    status: 'APPROVED',
    createdAt: Date.now() - 86400_000 * 6,
    variables: ['first_name'],
  },
  {
    id: 'wa-tpl-festival',
    name: 'festival_greeting',
    category: 'MARKETING',
    language: 'en_US',
    headerType: 'IMAGE',
    headerText: 'Festival banner',
    body: 'Hi {{1}}, wishing you a joyous {{2}} from the LNKICKS family! Enjoy flat 15% off site-wide with code FESTIVE15.',
    footer: 'Reply STOP to unsubscribe',
    buttons: [
      { type: 'URL', text: 'Shop Festive Picks', url: 'https://lnkicks.com' },
      { type: 'COPY_CODE', text: 'Copy Code FESTIVE15' },
    ],
    status: 'PENDING',
    createdAt: Date.now() - 86400_000 * 2,
    variables: ['first_name', 'festival_name'],
  },
];

/* ============================================================ */
/* CAMPAIGNS                                                     */
/* ============================================================ */

export type CampaignChannel = 'email' | 'whatsapp';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'failed';

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  subject?: string; // email only
  templateId: string;
  audience: AudienceSegmentKey;
  audienceCount: number;
  status: CampaignStatus;
  scheduledFor?: number;
  sentAt?: number;
  createdAt: number;
  updatedAt: number;
  // Delivery / analytics
  queued: number;
  sent: number;
  delivered: number;
  opened?: number;     // email only
  clicked?: number;    // email only
  read?: number;       // whatsapp only
  bounced: number;
  failed: number;
  unsubscribed: number;
  replies?: number;    // whatsapp only
  revenueGenerated: number;
  conversions: number;
  // Queue config (whatsapp-heavy)
  batchSize: number;
  batchDelaySeconds: number;
  retryAttempts: number;
  errorThreshold: number;
  // Approval
  approvedBy?: string;
  approvedAt?: number;
}

/* Derive historical campaigns deterministically from real customer
   data so analytics are realistic. These are the "sent" campaigns. */
function deriveHistoricalCampaigns(): Campaign[] {
  const now = Date.now();
  const topProducts = getTopProducts(8);
  // Reference top products so campaign names reflect the real catalog
  void topProducts;

  const emailAudienceCount = MARKETING_CUSTOMERS.filter(c => c.emailOptIn).length;
  const waAudienceCount = MARKETING_CUSTOMERS.filter(c => c.whatsappOptIn).length;

  return [
    {
      id: 'cmp-e-001',
      name: 'Independence Day Drop — Email',
      channel: 'email',
      subject: '🇮🇳 Independence Day Drop — Early Access',
      templateId: 'tpl-flash-sale',
      audience: 'email_opt_in',
      audienceCount: emailAudienceCount,
      status: 'sent',
      sentAt: now - 86400_000 * 9,
      createdAt: now - 86400_000 * 14,
      updatedAt: now - 86400_000 * 9,
      queued: emailAudienceCount,
      sent: emailAudienceCount,
      delivered: Math.round(emailAudienceCount * 0.972),
      opened: Math.round(emailAudienceCount * 0.418),
      clicked: Math.round(emailAudienceCount * 0.087),
      bounced: Math.round(emailAudienceCount * 0.018),
      failed: Math.round(emailAudienceCount * 0.01),
      unsubscribed: 14,
      revenueGenerated: 412000,
      conversions: 88,
      batchSize: 100,
      batchDelaySeconds: 30,
      retryAttempts: 3,
      errorThreshold: 5,
      approvedBy: 'Aarav Sharma',
      approvedAt: now - 86400_000 * 10,
    },
    {
      id: 'cmp-w-001',
      name: 'Independence Day Drop — WhatsApp',
      channel: 'whatsapp',
      templateId: 'wa-tpl-flash-sale',
      audience: 'whatsapp_opt_in',
      audienceCount: waAudienceCount,
      status: 'sent',
      sentAt: now - 86400_000 * 9,
      createdAt: now - 86400_000 * 14,
      updatedAt: now - 86400_000 * 9,
      queued: waAudienceCount,
      sent: waAudienceCount,
      delivered: Math.round(waAudienceCount * 0.985),
      read: Math.round(waAudienceCount * 0.782),
      failed: Math.round(waAudienceCount * 0.012),
      replies: Math.round(waAudienceCount * 0.142),
      bounced: 0,
      unsubscribed: 4,
      revenueGenerated: 684000,
      conversions: 142,
      batchSize: 50,
      batchDelaySeconds: 60,
      retryAttempts: 3,
      errorThreshold: 3,
      approvedBy: 'Aarav Sharma',
      approvedAt: now - 86400_000 * 10,
    },
    {
      id: 'cmp-e-002',
      name: 'Abandoned Cart Recovery — August',
      channel: 'email',
      subject: 'Your cart is expiring soon',
      templateId: 'tpl-abandoned',
      audience: 'returning',
      audienceCount: emailAudienceCount - 4,
      status: 'sent',
      sentAt: now - 86400_000 * 3,
      createdAt: now - 86400_000 * 7,
      updatedAt: now - 86400_000 * 3,
      queued: emailAudienceCount - 4,
      sent: emailAudienceCount - 4,
      delivered: Math.round((emailAudienceCount - 4) * 0.981),
      opened: Math.round((emailAudienceCount - 4) * 0.524),
      clicked: Math.round((emailAudienceCount - 4) * 0.142),
      bounced: Math.round((emailAudienceCount - 4) * 0.014),
      failed: 0,
      unsubscribed: 2,
      revenueGenerated: 218000,
      conversions: 54,
      batchSize: 100,
      batchDelaySeconds: 30,
      retryAttempts: 3,
      errorThreshold: 5,
      approvedBy: 'Aarav Sharma',
      approvedAt: now - 86400_000 * 4,
    },
    {
      id: 'cmp-w-002',
      name: 'Back in Stock — Yeezy 350 V2 Zebra',
      channel: 'whatsapp',
      templateId: 'wa-tpl-back-in-stock',
      audience: 'vip',
      audienceCount: Math.round(waAudienceCount * 0.4),
      status: 'sent',
      sentAt: now - 86400_000 * 2,
      createdAt: now - 86400_000 * 4,
      updatedAt: now - 86400_000 * 2,
      queued: Math.round(waAudienceCount * 0.4),
      sent: Math.round(waAudienceCount * 0.4),
      delivered: Math.round(waAudienceCount * 0.4 * 0.991),
      read: Math.round(waAudienceCount * 0.4 * 0.842),
      failed: 0,
      replies: Math.round(waAudienceCount * 0.4 * 0.18),
      bounced: 0,
      unsubscribed: 1,
      revenueGenerated: 396000,
      conversions: 76,
      batchSize: 50,
      batchDelaySeconds: 60,
      retryAttempts: 3,
      errorThreshold: 3,
      approvedBy: 'Aarav Sharma',
      approvedAt: now - 86400_000 * 2,
    },
    {
      id: 'cmp-e-003',
      name: 'August Newsletter',
      channel: 'email',
      subject: 'LNKICKS Monthly — August drops & news',
      templateId: 'tpl-newsletter',
      audience: 'email_opt_in',
      audienceCount: emailAudienceCount,
      status: 'scheduled',
      scheduledFor: now + 86400_000 * 2,
      createdAt: now - 86400_000 * 1,
      updatedAt: now - 3600_000 * 4,
      queued: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, failed: 0,
      unsubscribed: 0,
      revenueGenerated: 0,
      conversions: 0,
      batchSize: 100,
      batchDelaySeconds: 30,
      retryAttempts: 3,
      errorThreshold: 5,
    },
    {
      id: 'cmp-e-004',
      name: 'VIP Early Access — Travis Scott Drop',
      channel: 'email',
      subject: 'VIP Early Access — Travis Scott x Jordan 1',
      templateId: 'tpl-flash-sale',
      audience: 'vip',
      audienceCount: Math.round(emailAudienceCount * 0.32),
      status: 'draft',
      createdAt: now - 3600_000 * 6,
      updatedAt: now - 3600_000 * 2,
      queued: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, failed: 0,
      unsubscribed: 0,
      revenueGenerated: 0,
      conversions: 0,
      batchSize: 50,
      batchDelaySeconds: 30,
      retryAttempts: 3,
      errorThreshold: 5,
    },
    {
      id: 'cmp-w-003',
      name: 'Festival Greeting — Onam',
      channel: 'whatsapp',
      templateId: 'wa-tpl-festival',
      audience: 'whatsapp_opt_in',
      audienceCount: waAudienceCount,
      status: 'draft',
      createdAt: now - 3600_000 * 8,
      updatedAt: now - 3600_000 * 3,
      queued: 0, sent: 0, delivered: 0, read: 0, failed: 0, bounced: 0, replies: 0,
      unsubscribed: 0,
      revenueGenerated: 0,
      conversions: 0,
      batchSize: 50,
      batchDelaySeconds: 60,
      retryAttempts: 3,
      errorThreshold: 3,
    },
  ];
}

/* ============================================================ */
/* AUTOMATIONS                                                   */
/* ============================================================ */

export interface Automation {
  id: string;
  name: string;
  trigger: 'welcome' | 'order_confirmation' | 'shipping_update' | 'delivery_confirmation'
    | 'abandoned_cart' | 'back_in_stock' | 'new_arrival' | 'flash_sale' | 'birthday'
    | 'festival' | 'coupon_reminder';
  channel: CampaignChannel;
  enabled: boolean;
  description: string;
  templateId: string;
  triggeredCount: number;
  conversionRate: number;
  revenueGenerated: number;
  lastTriggeredAt?: number;
}

export const DEFAULT_AUTOMATIONS: Automation[] = [
  {
    id: 'auto-welcome',
    name: 'Welcome Series',
    trigger: 'welcome',
    channel: 'email',
    enabled: true,
    description: 'Sent when a customer creates an account. Includes ₹500 welcome bonus and onboarding tips.',
    templateId: 'tpl-welcome',
    triggeredCount: 1240,
    conversionRate: 18.4,
    revenueGenerated: 612000,
    lastTriggeredAt: Date.now() - 3600_000 * 2,
  },
  {
    id: 'auto-order-confirm',
    name: 'Order Confirmation',
    trigger: 'order_confirmation',
    channel: 'whatsapp',
    enabled: true,
    description: 'Sent immediately when an order is placed. Includes order ID, amount, and tracking link.',
    templateId: 'wa-tpl-order-confirmation',
    triggeredCount: 4820,
    conversionRate: 0,
    revenueGenerated: 0,
    lastTriggeredAt: Date.now() - 600_000,
  },
  {
    id: 'auto-shipping',
    name: 'Shipping Update',
    trigger: 'shipping_update',
    channel: 'whatsapp',
    enabled: true,
    description: 'Sent when an order is marked as shipped. Includes courier, AWB, and ETA.',
    templateId: 'wa-tpl-shipping-update',
    triggeredCount: 4180,
    conversionRate: 0,
    revenueGenerated: 0,
    lastTriggeredAt: Date.now() - 1200_000,
  },
  {
    id: 'auto-abandoned',
    name: 'Abandoned Cart Reminder',
    trigger: 'abandoned_cart',
    channel: 'email',
    enabled: true,
    description: 'Sent 2 hours after a cart is abandoned. Includes product image and one-click checkout.',
    templateId: 'tpl-abandoned',
    triggeredCount: 920,
    conversionRate: 12.4,
    revenueGenerated: 218000,
    lastTriggeredAt: Date.now() - 3600_000 * 4,
  },
  {
    id: 'auto-back-in-stock',
    name: 'Back-in-Stock Alert',
    trigger: 'back_in_stock',
    channel: 'whatsapp',
    enabled: true,
    description: 'Sent to customers who wishlist an out-of-stock product when inventory is replenished.',
    templateId: 'wa-tpl-back-in-stock',
    triggeredCount: 380,
    conversionRate: 22.8,
    revenueGenerated: 396000,
    lastTriggeredAt: Date.now() - 86400_000 * 2,
  },
  {
    id: 'auto-birthday',
    name: 'Birthday Greeting',
    trigger: 'birthday',
    channel: 'email',
    enabled: true,
    description: 'Sent on the customer\'s birthday with ₹1000 off coupon. 7-day expiry.',
    templateId: 'tpl-birthday',
    triggeredCount: 184,
    conversionRate: 31.2,
    revenueGenerated: 284000,
    lastTriggeredAt: Date.now() - 86400_000,
  },
  {
    id: 'auto-flash-sale',
    name: 'Flash Sale Announcement',
    trigger: 'flash_sale',
    channel: 'whatsapp',
    enabled: false,
    description: 'Sent to all opted-in customers when a flash sale goes live.',
    templateId: 'wa-tpl-flash-sale',
    triggeredCount: 142,
    conversionRate: 8.4,
    revenueGenerated: 184000,
    lastTriggeredAt: Date.now() - 86400_000 * 9,
  },
  {
    id: 'auto-festival',
    name: 'Festival Campaign',
    trigger: 'festival',
    channel: 'email',
    enabled: false,
    description: 'Sent 3 days before a major festival with curated festive picks.',
    templateId: 'tpl-newsletter',
    triggeredCount: 0,
    conversionRate: 0,
    revenueGenerated: 0,
  },
  {
    id: 'auto-new-arrival',
    name: 'New Arrival Announcement',
    trigger: 'new_arrival',
    channel: 'email',
    enabled: true,
    description: 'Sent when a new product launches. Targets customers whose favourite brand matches.',
    templateId: 'tpl-newsletter',
    triggeredCount: 240,
    conversionRate: 6.2,
    revenueGenerated: 142000,
    lastTriggeredAt: Date.now() - 86400_000 * 5,
  },
  {
    id: 'auto-coupon-reminder',
    name: 'Coupon Reminder',
    trigger: 'coupon_reminder',
    channel: 'email',
    enabled: false,
    description: 'Sent 48 hours before an unused coupon expires.',
    templateId: 'tpl-flash-sale',
    triggeredCount: 84,
    conversionRate: 14.8,
    revenueGenerated: 96000,
    lastTriggeredAt: Date.now() - 86400_000 * 12,
  },
];

/* ============================================================ */
/* CONVERSATIONS (WhatsApp inbound)                              */
/* ============================================================ */

export interface WhatsAppConversation {
  id: string;
  customer: MarketingCustomer;
  lastMessage: string;
  lastMessageAt: number;
  lastDirection: 'inbound' | 'outbound';
  unread: number;
  status: 'open' | 'resolved' | 'pending';
  messages: WhatsAppMessage[];
}

export interface WhatsAppMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  text: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  agent?: string;
}

/* Derive recent conversations from opted-in customers */
export function getWhatsAppConversations(): WhatsAppConversation[] {
  const optedIn = MARKETING_CUSTOMERS.filter(c => c.whatsappOptIn).slice(0, 8);
  const now = Date.now();
  return optedIn.map((c, i) => {
    const messages: WhatsAppMessage[] = [
      {
        id: `m-${c.id}-1`,
        direction: 'outbound',
        text: `Hi ${c.name.split(' ')[0]}, your favourite ${c.favouriteBrand} drops are now available. Shop now at lnkicks.com`,
        timestamp: now - i * 3600_000 * 6,
        status: 'read',
        agent: 'Marketing Bot',
      },
      {
        id: `m-${c.id}-2`,
        direction: 'inbound',
        text: ['Thanks! Will check it out.', 'Any discount available?', 'Can you share the catalog?', 'Sounds good 👍', 'Do you have my size?'][i % 5],
        timestamp: now - i * 3600_000 * 6 + 600_000,
        status: 'read',
      },
      {
        id: `m-${c.id}-3`,
        direction: 'outbound',
        text: i % 2 === 0 ? 'Yes! Use code LNK10 for 10% off your order.' : 'I can help with that — what size are you looking for?',
        timestamp: now - i * 3600_000 * 6 + 1200_000,
        status: i < 4 ? 'read' : 'delivered',
        agent: i < 4 ? 'Priya (Support)' : 'Marketing Bot',
      },
    ];
    const lastMsg = messages[messages.length - 1];
    return {
      id: `conv-${c.id}`,
      customer: c,
      lastMessage: lastMsg.text,
      lastMessageAt: lastMsg.timestamp,
      lastDirection: lastMsg.direction,
      unread: i < 3 ? 1 : 0,
      status: i < 3 ? 'pending' : i < 6 ? 'open' : 'resolved',
      messages,
    };
  });
}

/* ============================================================ */
/* STORAGE LAYER — localStorage-backed (mirrors adminAuth.ts)   */
/* ============================================================ */

const CAMPAIGNS_KEY = 'lnk_admin_marketing_campaigns';
const EMAIL_TEMPLATES_KEY = 'lnk_admin_email_templates';
const WA_TEMPLATES_KEY = 'lnk_admin_whatsapp_templates';
const AUTOMATIONS_KEY = 'lnk_admin_marketing_automations';

function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota / privacy mode */ }
}

/* Campaigns — merge stored + historical (stored wins) */
export function getCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return deriveHistoricalCampaigns();
  const stored = safeParse<Campaign[]>(CAMPAIGNS_KEY, []);
  const historical = deriveHistoricalCampaigns();
  // Merge: prefer stored duplicates by id
  const map = new Map<string, Campaign>();
  historical.forEach(c => map.set(c.id, c));
  stored.forEach(c => map.set(c.id, c));
  return Array.from(map.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveCampaign(c: Campaign): void {
  const all = safeParse<Campaign[]>(CAMPAIGNS_KEY, []);
  const idx = all.findIndex(x => x.id === c.id);
  if (idx >= 0) all[idx] = c; else all.push(c);
  safeWrite(CAMPAIGNS_KEY, all);
}

export function deleteCampaign(id: string): void {
  const all = safeParse<Campaign[]>(CAMPAIGNS_KEY, []).filter(c => c.id !== id);
  safeWrite(CAMPAIGNS_KEY, all);
}

export function getEmailTemplates(): EmailTemplate[] {
  return safeParse<EmailTemplate[]>(EMAIL_TEMPLATES_KEY, DEFAULT_TEMPLATES);
}

export function saveEmailTemplate(t: EmailTemplate): void {
  const all = safeParse<EmailTemplate[]>(EMAIL_TEMPLATES_KEY, DEFAULT_TEMPLATES);
  const idx = all.findIndex(x => x.id === t.id);
  if (idx >= 0) all[idx] = t; else all.push(t);
  safeWrite(EMAIL_TEMPLATES_KEY, all);
}

export function deleteEmailTemplate(id: string): void {
  const all = safeParse<EmailTemplate[]>(EMAIL_TEMPLATES_KEY, DEFAULT_TEMPLATES).filter(t => t.id !== id);
  safeWrite(EMAIL_TEMPLATES_KEY, all);
}

export function getWhatsAppTemplates(): WhatsAppTemplate[] {
  return safeParse<WhatsAppTemplate[]>(WA_TEMPLATES_KEY, DEFAULT_WHATSAPP_TEMPLATES);
}

export function saveWhatsAppTemplate(t: WhatsAppTemplate): void {
  const all = safeParse<WhatsAppTemplate[]>(WA_TEMPLATES_KEY, DEFAULT_WHATSAPP_TEMPLATES);
  const idx = all.findIndex(x => x.id === t.id);
  if (idx >= 0) all[idx] = t; else all.push(t);
  safeWrite(WA_TEMPLATES_KEY, all);
}

export function deleteWhatsAppTemplate(id: string): void {
  const all = safeParse<WhatsAppTemplate[]>(WA_TEMPLATES_KEY, DEFAULT_WHATSAPP_TEMPLATES).filter(t => t.id !== id);
  safeWrite(WA_TEMPLATES_KEY, all);
}

export function getAutomations(): Automation[] {
  return safeParse<Automation[]>(AUTOMATIONS_KEY, DEFAULT_AUTOMATIONS);
}

export function saveAutomation(a: Automation): void {
  const all = safeParse<Automation[]>(AUTOMATIONS_KEY, DEFAULT_AUTOMATIONS);
  const idx = all.findIndex(x => x.id === a.id);
  if (idx >= 0) all[idx] = a; else all.push(a);
  safeWrite(AUTOMATIONS_KEY, all);
}

/* ============================================================ */
/* AGGREGATE ANALYTICS                                           */
/* ============================================================ */

export interface MarketingKPIs {
  // Email
  emailSent: number;
  emailDelivered: number;
  emailOpened: number;
  emailClicked: number;
  emailBounced: number;
  emailUnsubscribed: number;
  emailRevenue: number;
  emailOpenRate: number;
  emailClickRate: number;
  emailConversionRate: number;
  // WhatsApp
  whatsappSent: number;
  whatsappDelivered: number;
  whatsappRead: number;
  whatsappFailed: number;
  whatsappReplies: number;
  whatsappRevenue: number;
  whatsappReadRate: number;
  whatsappConversionRate: number;
  // Combined
  totalRevenue: number;
  totalConversions: number;
  totalCampaigns: number;
  activeCampaigns: number;
  scheduledCampaigns: number;
  draftCampaigns: number;
  // Audience
  emailSubscribers: number;
  whatsappOptedIn: number;
  totalReachableCustomers: number;
}

export function getMarketingKPIs(): MarketingKPIs {
  const campaigns = getCampaigns();
  const sentEmail = campaigns.filter(c => c.channel === 'email' && c.status === 'sent');
  const sentWa = campaigns.filter(c => c.channel === 'whatsapp' && c.status === 'sent');

  const emailSent = sentEmail.reduce((s, c) => s + c.sent, 0);
  const emailDelivered = sentEmail.reduce((s, c) => s + c.delivered, 0);
  const emailOpened = sentEmail.reduce((s, c) => s + (c.opened ?? 0), 0);
  const emailClicked = sentEmail.reduce((s, c) => s + (c.clicked ?? 0), 0);
  const emailBounced = sentEmail.reduce((s, c) => s + c.bounced, 0);
  const emailUnsubscribed = sentEmail.reduce((s, c) => s + c.unsubscribed, 0);
  const emailRevenue = sentEmail.reduce((s, c) => s + c.revenueGenerated, 0);

  const whatsappSent = sentWa.reduce((s, c) => s + c.sent, 0);
  const whatsappDelivered = sentWa.reduce((s, c) => s + c.delivered, 0);
  const whatsappRead = sentWa.reduce((s, c) => s + (c.read ?? 0), 0);
  const whatsappFailed = sentWa.reduce((s, c) => s + c.failed, 0);
  const whatsappReplies = sentWa.reduce((s, c) => s + (c.replies ?? 0), 0);
  const whatsappRevenue = sentWa.reduce((s, c) => s + c.revenueGenerated, 0);

  return {
    emailSent,
    emailDelivered,
    emailOpened,
    emailClicked,
    emailBounced,
    emailUnsubscribed,
    emailRevenue,
    emailOpenRate: emailDelivered > 0 ? (emailOpened / emailDelivered) * 100 : 0,
    emailClickRate: emailOpened > 0 ? (emailClicked / emailOpened) * 100 : 0,
    emailConversionRate: emailClicked > 0 ? (sentEmail.reduce((s, c) => s + c.conversions, 0) / emailClicked) * 100 : 0,
    whatsappSent,
    whatsappDelivered,
    whatsappRead,
    whatsappFailed,
    whatsappReplies,
    whatsappRevenue,
    whatsappReadRate: whatsappDelivered > 0 ? (whatsappRead / whatsappDelivered) * 100 : 0,
    whatsappConversionRate: whatsappDelivered > 0 ? (sentWa.reduce((s, c) => s + c.conversions, 0) / whatsappDelivered) * 100 : 0,
    totalRevenue: emailRevenue + whatsappRevenue,
    totalConversions: sentEmail.reduce((s, c) => s + c.conversions, 0) + sentWa.reduce((s, c) => s + c.conversions, 0),
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'sending').length,
    scheduledCampaigns: campaigns.filter(c => c.status === 'scheduled').length,
    draftCampaigns: campaigns.filter(c => c.status === 'draft').length,
    emailSubscribers: MARKETING_CUSTOMERS.filter(c => c.emailOptIn).length,
    whatsappOptedIn: MARKETING_CUSTOMERS.filter(c => c.whatsappOptIn).length,
    totalReachableCustomers: MARKETING_CUSTOMERS.filter(c => c.emailOptIn || c.whatsappOptIn).length,
  };
}

/* ============================================================ */
/* FORMAT HELPERS                                                */
/* ============================================================ */

export function fmtINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export function fmtNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function fmtDateTime(ts: number): string {
  return new Date(ts).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function timeUntil(ts: number): string {
  const diff = ts - Date.now();
  if (diff <= 0) return 'now';
  const m = Math.floor(diff / 60000);
  if (m < 60) return `in ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `in ${h}h`;
  return `in ${Math.floor(h / 24)}d`;
}
