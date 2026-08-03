'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, WishlistItem } from '@/types';

export type { CartItem, WishlistItem } from '@/types';

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
        <ToastPortal msg={toastMsg} />
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

/**
 * ToastPortal — viewport-aware toast.
 *
 * On mobile, sits at bottom: 90px (clears the floating bottom nav).
 * On desktop (≥768px), sits at bottom: 24px (no bottom nav present).
 *
 * The viewport detection runs client-side after mount; SSR renders
 * nothing (toast only fires from user interactions, never on first
 * paint, so there's no hydration mismatch risk).
 */
function ToastPortal({ msg }: { msg: string }) {
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    const detect = () => {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk/i.test(ua);
      setIsMobile(mobileUA || vw <= 768);
    };
    detect();
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: isMobile ? '90px' : '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#0a0a0a',
        color: '#ffffff',
        padding: isMobile ? '12px 24px' : '14px 28px',
        borderRadius: isMobile ? '30px' : '12px',
        fontSize: isMobile ? '13px' : '14px',
        fontWeight: 700,
        letterSpacing: isMobile ? 0 : '0.02em',
        zIndex: 99999,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)',
        fontFamily: 'inherit',
        maxWidth: 'calc(100vw - 32px)',
        transition: 'bottom 200ms ease, padding 200ms ease, border-radius 200ms ease',
        pointerEvents: 'none',
      }}
    >
      {msg}
    </div>
  );
}
