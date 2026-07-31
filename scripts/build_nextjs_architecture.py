import os
import shutil

project_dir = r"c:\Users\sagar\Desktop\lnkcks"

# Create directories for Next.js App Router architecture
app_dir = os.path.join(project_dir, "app")
components_dir = os.path.join(project_dir, "components")
public_dir = os.path.join(project_dir, "public")

os.makedirs(os.path.join(app_dir, "api"), exist_ok=True)
os.makedirs(os.path.join(components_dir, "layout"), exist_ok=True)
os.makedirs(os.path.join(components_dir, "ui"), exist_ok=True)
os.makedirs(os.path.join(components_dir, "context"), exist_ok=True)
os.makedirs(public_dir, exist_ok=True)

# 1. package.json
package_json = """{
  "name": "lnkicks-luxury-sneakers",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.3"
  }
}
"""
with open(os.path.join(project_dir, "package.json"), "w", encoding="utf-8") as f:
    f.write(package_json)

# 2. tsconfig.json
tsconfig_json = """{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
"""
with open(os.path.join(project_dir, "tsconfig.json"), "w", encoding="utf-8") as f:
    f.write(tsconfig_json)

# 3. next.config.js
next_config = """/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
"""
with open(os.path.join(project_dir, "next.config.js"), "w", encoding="utf-8") as f:
    f.write(next_config)

# 4. Copy all transparent shoe images into public/
image_files = [f for f in os.listdir(project_dir) if f.endswith('.png') or f.endswith('.jpg') or f.endswith('.svg')]
for img in image_files:
    src_p = os.path.join(project_dir, img)
    dst_p = os.path.join(public_dir, img)
    if os.path.isfile(src_p):
        shutil.copyfile(src_p, dst_p)

print(f"Copied {len(image_files)} asset images to public/ directory!")

# 5. Create App Context (components/context/AppContext.tsx)
app_context_code = """'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  qty: number;
}

export interface WishlistItem {
  id: string;
  name: string;
  price?: number;
  image?: string;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, delta: number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  clearCart: () => void;
  toastMsg: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('lnk_cart');
      const savedWish = localStorage.getItem('lnk_wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWish) setWishlist(JSON.parse(savedWish));
    } catch (e) {}
  }, []);

  const saveCartData = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('lnk_cart', JSON.stringify(newCart));
  };

  const saveWishlistData = (newWish: WishlistItem[]) => {
    setWishlist(newWish);
    localStorage.setItem('lnk_wishlist', JSON.stringify(newWish));
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const addToCart = (product: CartItem) => {
    const existingIdx = cart.findIndex(i => i.id === product.id && i.size === product.size);
    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].qty += (product.qty || 1);
      saveCartData(updated);
    } else {
      saveCartData([...cart, { ...product, qty: product.qty || 1 }]);
    }
    showToast('Item added to Shopping Cart!');
  };

  const removeFromCart = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    saveCartData(updated);
    showToast('Item removed from Cart');
  };

  const updateQty = (index: number, delta: number) => {
    const updated = [...cart];
    if (updated[index]) {
      const newQty = updated[index].qty + delta;
      if (newQty >= 1) {
        updated[index].qty = newQty;
        saveCartData(updated);
      }
    }
  };

  const toggleWishlist = (product: WishlistItem) => {
    const idx = wishlist.findIndex(i => i.id === product.id);
    if (idx > -1) {
      const updated = [...wishlist];
      updated.splice(idx, 1);
      saveWishlistData(updated);
      showToast('Removed from Wishlist');
    } else {
      saveWishlistData([...wishlist, product]);
      showToast('Saved to Wishlist ❤');
    }
  };

  const clearCart = () => {
    saveCartData([]);
  };

  return (
    <AppContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQty, toggleWishlist, clearCart, toastMsg, showToast }}>
      {children}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#111111',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '30px',
          fontSize: '13px',
          fontWeight: 700,
          zIndex: 99999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease'
        }}>
          {toastMsg}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
"""

with open(os.path.join(components_dir, "context", "AppContext.tsx"), "w", encoding="utf-8") as f:
    f.write(app_context_code)

print("Created components/context/AppContext.tsx!")

# 6. Create Next.js Root Layout (app/layout.tsx)
root_layout_code = """import React from 'react';
import { AppProvider } from '@/components/context/AppContext';

export const metadata = {
  title: 'LNKICKS — Stocked & Loaded',
  description: 'India\'s premier destination for authentic luxury sneakers and hyped drops.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', sans-serif", background: '#0A0A0A', color: '#0A0A0A' }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
"""

with open(os.path.join(app_dir, "layout.tsx"), "w", encoding="utf-8") as f:
    f.write(root_layout_code)

print("Created app/layout.tsx!")

# 7. Create Root Device Aware Switcher (app/page.tsx)
page_root_code = """'use client';

import React, { useEffect, useState } from 'react';
import MobileHome from './mobile/page';
import DesktopHome from './desktop/page';

export default function RootPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === null) return null;

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
"""

with open(os.path.join(app_dir, "page.tsx"), "w", encoding="utf-8") as f:
    f.write(page_root_code)

print("Created app/page.tsx device router!")
