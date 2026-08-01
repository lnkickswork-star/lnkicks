'use client';

import React from 'react';
import PremiumProductSlider from './PremiumProductSlider';
import { NIKE_RUNNING_PRODUCTS } from './sliderProducts';

/**
 * NikeRunningSection — "Nike Running Shoes" premium floating-product slider.
 *
 * Reuses PremiumProductSlider with Nike-specific products and copy.
 * Same luxury editorial layout as TrendingSection — only the data changes.
 */
export default function NikeRunningSection() {
  return (
    <PremiumProductSlider
      id="nike-running"
      eyebrow="Performance Series"
      title="Nike Running Shoes"
      subtitle="Engineered for Speed. Designed for Style. Half the Price."
      products={NIKE_RUNNING_PRODUCTS}
      visibleCount={{ desktop: 5, tablet: 3, mobile: 2 }}
      background="#ffffff"
      paddingY={120}
      autoplayMs={6000}
    />
  );
}
