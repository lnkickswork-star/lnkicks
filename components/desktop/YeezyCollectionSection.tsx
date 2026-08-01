'use client';

import React from 'react';
import PremiumProductSlider from './PremiumProductSlider';
import { YEEZY_PRODUCTS } from './sliderProducts';

/**
 * YeezyCollectionSection — "Yeezy Collection" premium floating-product slider.
 */
export default function YeezyCollectionSection() {
  return (
    <PremiumProductSlider
      id="yeezy-collection"
      eyebrow="Limited Drops"
      title="Yeezy Collection"
      subtitle="Boost 350, Foam Runner, Slides. The most coveted silhouettes."
      products={YEEZY_PRODUCTS}
      visibleCount={{ desktop: 5, tablet: 3, mobile: 2 }}
      background="#ffffff"
      paddingY={120}
      autoplayMs={6000}
    />
  );
}
