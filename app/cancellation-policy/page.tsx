'use client';

import React from 'react';

export default function CancellationPolicyPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<main class="w-[390px] h-[844px] bg-background relative flex flex-col overflow-hidden shadow-2xl">
<!-- TopAppBar -->
<header class="docked full-width top-0 bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4 z-10">
<div class="flex items-center gap-4">
<button class="hover:opacity-80 transition-opacity active:scale-95">
<span class="material-symbols-outlined text-primary dark:text-on-background">arrow_back</span>
</button>
<h1 class="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">Cancellation Policy</h1>
</div>
<button class="hover:opacity-80 transition-opacity">
<span class="material-symbols-outlined text-primary dark:text-on-background">help_outline</span>
</button>
</header>
<div class="flex-1 overflow-y-auto px-6 pt-6 pb-24">
<!-- Hero/Status Section -->
<section class="mb-section-gap">
<div class="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
<div class="flex items-center gap-4 mb-4">
<div class="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center">
<span class="material-symbols-outlined">timer</span>
</div>
<div>
<p class="text-label-lg font-label-lg text-primary uppercase tracking-widest">Window</p>
<h2 class="text-headline-md font-headline-md">30-Minute Grace Period</h2>
</div>
</div>
<p class="text-body-md font-body-md text-secondary leading-relaxed">
            Orders can be cancelled instantly within the first 30 minutes of purchase through your account dashboard without any penalties.
          </p>
</div>
</section>
<!-- Guidelines Grid -->
<section class="mb-section-gap">
<h3 class="text-title-lg font-title-lg mb-stack-md">Cancellation Guidelines</h3>
<div class="space-y-gutter">
<!-- Guideline 1 -->
<div class="flex gap-stack-md group">
<div class="mt-1">
<span class="material-symbols-outlined text-primary">check_circle</span>
</div>
<div>
<h4 class="text-label-lg font-label-lg text-on-background mb-1">Pre-Shipment</h4>
<p class="text-body-md font-body-md text-secondary">If your order has not been picked up by the courier (usually within 2-4 hours), cancellation may still be possible via customer support.</p>
</div>
</div>
<!-- Guideline 2 -->
<div class="flex gap-stack-md group">
<div class="mt-1">
<span class="material-symbols-outlined text-primary">cancel</span>
</div>
<div>
<h4 class="text-label-lg font-label-lg text-on-background mb-1">Post-Shipment</h4>
<p class="text-body-md font-body-md text-secondary">Once an order has been marked as 'Shipped', it cannot be cancelled. You must wait for delivery and initiate a return.</p>
</div>
</div>
<!-- Guideline 3 -->
<div class="flex gap-stack-md group">
<div class="mt-1">
<span class="material-symbols-outlined text-primary">payments</span>
</div>
<div>
<h4 class="text-label-lg font-label-lg text-on-background mb-1">Refund Processing</h4>
<p class="text-body-md font-body-md text-secondary">Refunds are initiated immediately upon cancellation. Credits typically appear on your statement within 3-5 business days.</p>
</div>
</div>
</div>
</section>
<!-- Visual Process Step -->
<section class="mb-section-gap">
<div class="relative w-full h-48 rounded-xl overflow-hidden mb-stack-md">
<img alt="Secure digital payment processing" class="w-full h-full object-cover grayscale brightness-75" data-alt="A clean, high-contrast digital workspace showing a professional hand interacting with a sleek smartphone showing a confirmed transaction checkmark. The lighting is bright and minimal, reflecting a luxury high-end marketplace aesthetic with soft shadows. The overall mood is sophisticated, secure, and technologically advanced, dominated by whites and deep blacks." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0p0HrD1vx7pIEfksfUTrXpTMVjAf2QktraVtvjWrTbrOnTVZ5KifHU_J1B8jvBA3LsrGhsU1VPCMk9R1CZyB9DKGX8ypHEjolqaRzOUClJLY6XLonF_W9bLYniwwXBAdSe3PxYFYUm9CcMMoKzmJ4g_hz_aAuL23Oh8KVr8iQVUz7pY5Rz-vmFv823KWHRCaZoy9zSiyzXArrCzpnhJjY967FWNbFaAiCY09e5HZa3Yb0jGVsj-tSdC4RCzjgumWSY7ERbvvZjkdQ">
<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
<p class="text-on-primary text-title-lg font-title-lg">Fast, Automated Refunds</p>
</div>
</div>
</section>
<!-- Action Section -->
<section class="mb-stack-lg">
<h3 class="text-title-lg font-title-lg mb-stack-md">How to request</h3>
<div class="bg-surface-container p-5 rounded-xl border border-outline-variant space-y-4">
<div class="flex items-center justify-between">
<span class="text-body-md font-body-md">1. Go to "My Orders"</span>
<span class="material-symbols-outlined text-secondary text-sm">arrow_forward_ios</span>
</div>
<hr class="border-outline-variant">
<div class="flex items-center justify-between">
<span class="text-body-md font-body-md">2. Select the specific order</span>
<span class="material-symbols-outlined text-secondary text-sm">arrow_forward_ios</span>
</div>
<hr class="border-outline-variant">
<div class="flex items-center justify-between">
<span class="text-body-md font-body-md">3. Tap "Cancel Order" button</span>
<span class="material-symbols-outlined text-secondary text-sm">arrow_forward_ios</span>
</div>
</div>
</section>
<!-- Primary Action -->
<div class="mt-4">
<button class="w-full bg-primary text-on-primary py-[18px] rounded-full text-label-lg font-label-lg uppercase tracking-widest hover:opacity-90 transition-all active:scale-95">
          View My Recent Orders
        </button>
</div>
</div>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 w-full h-[84px] z-50 bg-surface-container-lowest dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<div class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined">home</span>
</div>
<div class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined">search</span>
</div>
<div class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined">favorite</span>
</div>
<!-- Profile Active for My Orders context -->
<div class="flex items-center justify-center text-primary dark:text-on-background scale-110">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">person</span>
</div>
</nav>
</main>
<script src="js/app.js"></script>
` }} />
  );
}
