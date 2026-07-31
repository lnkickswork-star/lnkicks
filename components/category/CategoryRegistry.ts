/* =========================================================
   LNKICKS CENTRAL CATEGORY REGISTRY & MODEL
   ========================================================= */

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  featured?: boolean;
}

export const CATEGORY_REGISTRY: Category[] = [
  { id: 'cat-sneakers', slug: 'sneakers', name: 'Sneakers', description: 'Hyped drops, iconic silhouettes, and luxury athletic sneakers.', image: 'jordan_powder_blue_nobg.png', icon: '👟', productCount: 450, featured: true },
  { id: 'cat-running', slug: 'running', name: 'Running & Performance', description: 'High-performance running shoes built for maximum speed & comfort.', image: 'samba_og_nobg.png', icon: '⚡', productCount: 220, featured: true },
  { id: 'cat-basketball', slug: 'basketball', name: 'Basketball', description: 'Retro Jordans and signature basketball footwear.', image: 'jordan_powder_blue_nobg.png', icon: '🏀', productCount: 310, featured: true },
  { id: 'cat-lifestyle', slug: 'lifestyle', name: 'Lifestyle & Streetwear', description: 'Everyday casual heat and streetwear statement kicks.', image: 'af1_black_nobg.png', icon: '🔥', productCount: 520, featured: true },
  { id: 'cat-training', slug: 'training', name: 'Training & Gym', description: 'Durable cross-trainers and workout footwear.', image: 'puma_velo_nobg.png', icon: '💪', productCount: 180 },
  { id: 'cat-slides', slug: 'slides', name: 'Slides & Foam', description: 'Luxury foam slides and comfortable slip-ons.', image: 'samba_og_nobg.png', icon: '🩴', productCount: 140 },
  { id: 'cat-accessories', slug: 'accessories', name: 'Accessories & Care', description: 'Premium shoe cleaner kits, socks, and keychains.', image: 'nb_9060_nobg.png', icon: '🎒', productCount: 95 },
  { id: 'cat-limited', slug: 'limited-edition', name: 'Limited Edition', description: 'Exclusive member-only drops and rare grails.', image: 'jordan_powder_blue_nobg.png', icon: '👑', productCount: 65, featured: true }
];
