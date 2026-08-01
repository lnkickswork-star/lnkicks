'use client';

import React from 'react';
import PremiumProductSlider from './PremiumProductSlider';
import { JORDAN_PRODUCTS } from './sliderProducts';

/**
 * JordanCollectionSection — "Jordan Collection" premium floating-product slider.
 */
export default function JordanCollectionSection() {
  return (
    <PremiumProductSlider
      id="jordan-collection"
      eyebrow="Retro Heritage"
      title="Jordan Collection"
      subtitle="Iconic silhouettes. Timeless colourways. Always authentic."
      products={JORDAN_PRODUCTS}
      visibleCount={{ desktop: 5, tablet: 3, mobile: 2 }}
      background="#ffffff"
      paddingY={120}
      autoplayMs={6000}
    />
  );
}
