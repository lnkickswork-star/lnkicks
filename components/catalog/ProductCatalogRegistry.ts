/* =========================================================
   LNKICKS CENTRAL PRODUCT CATALOG REGISTRY
   ========================================================= */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  origPrice?: number;
  badge?: string;
  image: string;
  sku: string;
  gender: 'Men' | 'Women' | 'Unisex';
  inStock: boolean;
}

export const PRODUCT_CATALOG: Product[] = [
  { id: 'jordan-1-powder-blue', name: 'Air Jordan 1 Low Black Powder Blue', brand: 'NIKE', category: 'Sneakers', price: 8899, origPrice: 18899, badge: 'NEW', image: 'jordan_powder_blue_nobg.png', sku: 'AJ1-PB-01', gender: 'Unisex', inStock: true },
  { id: 'samba-og-white', name: 'Samba OG Cloud White Core Black', brand: 'ADIDAS', category: 'Sneakers', price: 9499, origPrice: 16999, badge: 'HOT', image: 'samba_og_nobg.png', sku: 'SAMBA-OG-02', gender: 'Unisex', inStock: true },
  { id: 'nike-af1-black', name: 'Nike Air Force 1 Low Triple Black', brand: 'NIKE', category: 'Lifestyle', price: 6999, origPrice: 10999, badge: 'SALE', image: 'af1_black_nobg.png', sku: 'AF1-BLK-03', gender: 'Men', inStock: true },
  { id: 'puma-velophasis', name: 'Puma Velophasis Luxury Edition', brand: 'PUMA', category: 'Running', price: 8499, origPrice: 14999, badge: 'NEW', image: 'puma_velo_nobg.png', sku: 'PUMA-VELO-04', gender: 'Unisex', inStock: true },
  { id: 'nb-9060-sea-salt', name: 'New Balance 9060 Sea Salt Gold', brand: 'NEW BALANCE', category: 'Lifestyle', price: 12999, origPrice: 19999, badge: 'HOT', image: 'nb_9060_nobg.png', sku: 'NB-9060-05', gender: 'Men', inStock: true },
  { id: 'reebok-club-c', name: 'Reebok Club C 85 Vintage', brand: 'REEBOK', category: 'Lifestyle', price: 7499, origPrice: 11999, image: 'jordan_powder_blue_nobg.png', sku: 'RBK-C85-06', gender: 'Unisex', inStock: true },
  { id: 'onitsuka-mexico-66', name: 'Onitsuka Tiger Mexico 66 Yellow', brand: 'ONITSUKA TIGER', category: 'Sneakers', price: 10999, origPrice: 15999, image: 'af1_black_nobg.png', sku: 'OT-MEX-07', gender: 'Unisex', inStock: true },
  { id: 'dunk-high-royal', name: 'Dunk High Deep Royal Edition', brand: 'NIKE', category: 'Basketball', price: 15360, origPrice: 22000, badge: 'LIMITED', image: 'jordan_powder_blue_nobg.png', sku: 'NK-DUNK-08', gender: 'Unisex', inStock: true }
];
