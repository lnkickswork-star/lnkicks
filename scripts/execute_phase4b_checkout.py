import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
app_dir = os.path.join(project_dir, "app")
os.makedirs(os.path.join(app_dir, "checkout"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "order-success"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "order-failed"), exist_ok=True)

# 1. app/checkout/page.tsx
checkout_page_code = """'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { useApp } from '@/components/context/AppContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, showToast } = useApp();

  const [shipping, setShipping] = useState({
    name: 'Charles Taylor',
    email: 'charles.taylor@lnkicks.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Luxury Heights, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050'
  });

  const [paymentMode, setPaymentMode] = useState<string>('UPI');
  const [coupon, setCoupon] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0) || 17798;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax - appliedDiscount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'LNKICKS10') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedDiscount(disc);
      showToast('Coupon LNKICKS10 Applied! Saved 10%');
    } else {
      showToast('Invalid Coupon Code. Try LNKICKS10');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.name || !shipping.address || !shipping.pincode) {
      showToast('Please complete shipping address fields.');
      return;
    }

    const orderId = 'LNK-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      total,
      paymentMode,
      shipping,
      items: cart.length > 0 ? cart : [{ name: 'Air Jordan 1 Low Powder Blue', qty: 1, price: 8899 }]
    };

    try {
      const orders = JSON.parse(localStorage.getItem('lnk_orders') || '[]');
      orders.unshift(newOrder);
      localStorage.setItem('lnk_orders', JSON.stringify(orders));
    } catch (e) {}

    clearCart();
    showToast('Order Placed Successfully!');
    router.push('/order-success?orderId=' + orderId);
  };

  return (
    <ResponsiveAppLayout title="CHECKOUT">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/cart" style={{ color: '#777777', textDecoration: 'none' }}>Cart</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>Checkout</span>
      </div>

      <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', marginBottom: '32px' }}>
        Express Checkout
      </h1>

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: SHIPPING ADDRESS & PAYMENT METHOD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* STEP 1: SHIPPING ADDRESS */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', border: '1px solid #EBEBEB' }}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#111111', color: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
              Shipping Address
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
                <input type="text" value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>PHONE NUMBER</label>
                <input type="text" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>STREET ADDRESS</label>
                <input type="text" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>CITY</label>
                <input type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>PINCODE</label>
                <input type="text" value={shipping.pincode} onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E0E0E0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* STEP 2: PAYMENT METHOD */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', border: '1px solid #EBEBEB' }}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#111111', color: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
              Payment Method
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['UPI (Google Pay / PhonePe / Paytm)', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery (COD)'].map((mode) => (
                <label key={mode} onClick={() => setPaymentMode(mode)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: '16px', border: paymentMode === mode ? '2px solid #111111' : '1px solid #E0E0E0', background: paymentMode === mode ? '#F8F8FA' : '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#111111' }}>
                  <input type="radio" name="payment" checked={paymentMode === mode} onChange={() => setPaymentMode(mode)} style={{ accentColor: '#111111' }} />
                  <span>{mode}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY & PLACE ORDER CTA */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', border: '1px solid #EBEBEB', boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: '0 0 20px', borderBottom: '1px solid #EBEBEB', paddingBottom: '12px' }}>Payment Summary</h2>

          {/* COUPON INPUT */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#777777', display: 'block', marginBottom: '6px' }}>HAVE A COUPON CODE?</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="e.g. LNKICKS10" style={{ flex: 1, padding: '10px 14px', borderRadius: '14px', border: '1px solid #E0E0E0', fontSize: '12px', outline: 'none' }} />
              <button onClick={handleApplyCoupon} style={{ padding: '10px 18px', background: '#111111', color: '#ffffff', borderRadius: '14px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Apply</button>
            </div>
          </div>

          {/* SUMMARY BREAKDOWN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#555555', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>GST &amp; Taxes (5%)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            {appliedDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00875A', fontWeight: 700 }}>
                <span>Coupon Discount</span>
                <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Express Delivery</span>
              <span style={{ color: '#00875A', fontWeight: 700 }}>FREE</span>
            </div>
          </div>

          <div style={{ borderTop: '2px solid #111111', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: '#111111', marginBottom: '24px' }}>
            <span>Grand Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>

          <button type="submit" style={{ display: 'block', width: '100%', padding: '18px', background: '#FF3B30', color: '#ffffff', borderRadius: '30px', textAlign: 'center', fontFamily: "'Oswald', sans-serif", fontSize: '16px', fontWeight: 800, border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
            PLACE ORDER →
          </button>
        </div>

      </form>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "checkout", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(checkout_page_code)

print("Created app/checkout/page.tsx!")

# 2. app/order-success/page.tsx
order_success_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams ? searchParams.get('orderId') || 'LNK-784912' : 'LNK-784912';

  return (
    <ResponsiveAppLayout title="ORDER SUCCESS">
      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '540px', margin: '0 auto', background: '#ffffff', borderRadius: '28px', border: '1px solid #EBEBEB', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#E3FCEF', color: '#00875A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>✓</div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: 0 }}>Order Confirmed!</h1>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#777777', marginTop: '6px', marginBottom: '24px' }}>Order ID: #{orderId}</div>
        
        <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.6, marginBottom: '32px' }}>
          Thank you for shopping with LNKICKS! Your order has been placed successfully and is being verified by our authentication team.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/track-order?orderId=${orderId}`} style={{ padding: '14px 28px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.08em' }}>
            TRACK ORDER
          </Link>
          <Link href="/products" style={{ padding: '14px 28px', background: '#F0F0F2', color: '#111111', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.08em' }}>
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "order-success", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(order_success_code)

print("Created app/order-success/page.tsx!")

# 3. app/order-failed/page.tsx
order_failed_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function OrderFailedPage() {
  return (
    <ResponsiveAppLayout title="ORDER FAILED">
      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '0 auto', background: '#ffffff', borderRadius: '28px', border: '1px solid #EBEBEB' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#FFEBE6', color: '#FF3B30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>✕</div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: 0 }}>Payment Unsuccessful</h1>
        <p style={{ fontSize: '14px', color: '#555555', margin: '12px 0 28px' }}>Your transaction could not be processed. No funds were debited.</p>
        <Link href="/checkout" style={{ padding: '14px 28px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          RETRY CHECKOUT
        </Link>
      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "order-failed", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(order_failed_code)

print("Created app/order-failed/page.tsx!")
