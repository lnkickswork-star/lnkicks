'use client';

import React from 'react';
import PremiumProductSlider from './PremiumProductSlider';
import { ADIDAS_PRODUCTS } from './sliderProducts';

/**
 * AdidasOriginalsSection — "Adidas Originals" premium floating-product slider.
 */
export default function AdidasOriginalsSection() {
  return (
    <PremiumProductSlider
      id="adidas-originals"
      eyebrow="Terrace Heritage"
      title="Adidas Originals"
      subtitle="Samba, Gazelle, Campus. The icons that never go out of style."
      products={ADIDAS_PRODUCTS}
      visibleCount={{ desktop: 5, tablet: 3, mobile: 2 }}
      background="#ffffff"
      paddingY={120}
      autoplayMs={6000}
    />
  );
}
