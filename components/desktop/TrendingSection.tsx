'use client';

import PremiumProductSlider from './PremiumProductSlider';
import { TRENDING_PRODUCTS } from './sliderProducts';

/**
 * TrendingSection — "Trending This Week" premium floating-product slider.
 *
 * This is a thin wrapper around PremiumProductSlider that supplies the
 * "Trending This Week" title, subtitle, and product list.
 *
 * Visual reference: Screenshot 646 (KicksMachine-style editorial slider).
 *  - Pure white background
 *  - Floating product images (NO cards, NO card borders, NO card shadows)
 *  - Only a soft drop-shadow on the image itself
 *  - Centered title + subtitle + circular nav arrows + horizontal slider
 *  - Pill badges above shoes (INSTANT SHIP / NEW DROP / etc.)
 *  - Brand / Name / Price (red) + strikethrough original
 *
 * The slider supports drag, swipe, wheel, keyboard, and autoplay.
 * See PremiumProductSlider.tsx for the full implementation.
 */
export default function TrendingSection() {
  return (
    <PremiumProductSlider
      id="trending"
      eyebrow="Curated Weekly"
      title="Trending This Week"
      subtitle="Engineered for Speed. Designed for Style. Half the Price."
      products={TRENDING_PRODUCTS}
      visibleCount={{ desktop: 5, tablet: 3, mobile: 2 }}
      background="#ffffff"
      paddingY={120}
      autoplayMs={5500}
    />
  );
}
