'use client';

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
