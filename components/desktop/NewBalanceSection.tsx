'use client';

import React from 'react';
import PremiumProductSlider from './PremiumProductSlider';
import { NEW_BALANCE_PRODUCTS } from './sliderProducts';

/**
 * NewBalanceSection — "New Balance Collection" premium floating-product slider.
 */
export default function NewBalanceSection() {
  return (
    <PremiumProductSlider
      id="new-balance-collection"
      eyebrow="Made in USA"
      title="New Balance Collection"
      subtitle="990, 9060, 2002R. Dad-shoe energy meets premium craftsmanship."
      products={NEW_BALANCE_PRODUCTS}
      visibleCount={{ desktop: 5, tablet: 3, mobile: 2 }}
      background="#ffffff"
      paddingY={120}
      autoplayMs={6000}
    />
  );
}
