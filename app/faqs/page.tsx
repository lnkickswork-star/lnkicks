'use client';

import React from 'react';

export default function FaqsPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!-- Main Viewport Shell -->
<div class="relative mx-auto w-[390px] h-[844px] bg-white overflow-hidden flex flex-col">
<!-- TopAppBar -->
<header class="docked full-width top-0 z-50 bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4">
<div class="flex items-center gap-4">
<button class="hover:opacity-80 transition-opacity active:scale-95 transition-transform text-primary dark:text-on-background">
<span class="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
</button>
<h1 class="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</h1>
</div>
<div class="flex gap-4">
<span class="material-symbols-outlined text-primary dark:text-on-background" data-icon="notifications">notifications</span>
</div>
</header>
<!-- Page Content -->
<main class="flex-1 overflow-y-auto px-6 pt-4 pb-32">
<!-- Header Section -->
<div class="mb-stack-lg">
<h2 class="text-display-lg-mobile font-display-lg-mobile text-primary mb-2">FAQs</h2>
<p class="text-body-md font-body-md text-secondary">Everything you need to know about your luxury sneaker experience.</p>
</div>
<!-- Search Bar (Style Guidance Reference) -->
<div class="mb-section-gap relative">
<div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline" data-icon="search">search</span>
</div>
<input class="w-full bg-[#F5F5F5] border-none rounded-xl py-4 pl-12 pr-4 text-body-md font-body-md focus:ring-1 focus:ring-primary" placeholder="Search questions..." type="text">
</div>
<!-- FAQ Categories -->
<div class="space-y-section-gap">
<!-- Category: Orders -->
<section>
<h3 class="text-title-lg font-title-lg text-primary mb-stack-md flex items-center gap-2">
<span class="material-symbols-outlined text-secondary" data-icon="shopping_bag">shopping_bag</span>
                        Orders
                    </h3>
<div class="space-y-4">
<!-- Accordion Item 1 -->
<div class="bg-white border border-[#EEEEEE] rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<button class="w-full flex justify-between items-center p-4 text-left hover:bg-surface-container-low transition-colors">
<span class="text-label-lg font-label-lg text-on-surface">How can I track my order?</span>
<span class="material-symbols-outlined text-outline" data-icon="expand_more">expand_more</span>
</button>
</div>
<!-- Accordion Item 2 -->
<div class="bg-white border border-[#EEEEEE] rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<button class="w-full flex justify-between items-center p-4 text-left border-b border-[#EEEEEE] bg-surface-container-low">
<span class="text-label-lg font-label-lg text-primary">Can I cancel my order?</span>
<span class="material-symbols-outlined text-primary" data-icon="expand_less">expand_less</span>
</button>
<div class="p-4 bg-white">
<p class="text-body-md font-body-md text-secondary leading-relaxed">
                                    Orders can be cancelled within 30 minutes of placement. After this window, our fulfillment center begins processing for high-speed delivery. Please contact our VIP concierge for urgent requests.
                                </p>
</div>
</div>
</div>
</section>
<!-- Category: Payments -->
<section class="mt-section-gap">
<h3 class="text-title-lg font-title-lg text-primary mb-stack-md flex items-center gap-2">
<span class="material-symbols-outlined text-secondary" data-icon="payments">payments</span>
                        Payments
                    </h3>
<div class="space-y-4">
<div class="bg-white border border-[#EEEEEE] rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<button class="w-full flex justify-between items-center p-4 text-left hover:bg-surface-container-low transition-colors">
<span class="text-label-lg font-label-lg text-on-surface">What payment methods do you accept?</span>
<span class="material-symbols-outlined text-outline" data-icon="expand_more">expand_more</span>
</button>
</div>
<div class="bg-white border border-[#EEEEEE] rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<button class="w-full flex justify-between items-center p-4 text-left hover:bg-surface-container-low transition-colors">
<span class="text-label-lg font-label-lg text-on-surface">Are my payment details secure?</span>
<span class="material-symbols-outlined text-outline" data-icon="expand_more">expand_more</span>
</button>
</div>
</div>
</section>
<!-- Category: Shipping & Returns -->
<section class="mt-section-gap">
<h3 class="text-title-lg font-title-lg text-primary mb-stack-md flex items-center gap-2">
<span class="material-symbols-outlined text-secondary" data-icon="local_shipping">local_shipping</span>
                        Shipping &amp; Returns
                    </h3>
<div class="space-y-4">
<div class="bg-white border border-[#EEEEEE] rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<button class="w-full flex justify-between items-center p-4 text-left hover:bg-surface-container-low transition-colors">
<span class="text-label-lg font-label-lg text-on-surface">How long does shipping take?</span>
<span class="material-symbols-outlined text-outline" data-icon="expand_more">expand_more</span>
</button>
</div>
<div class="bg-white border border-[#EEEEEE] rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<button class="w-full flex justify-between items-center p-4 text-left hover:bg-surface-container-low transition-colors">
<span class="text-label-lg font-label-lg text-on-surface">What is your return policy?</span>
<span class="material-symbols-outlined text-outline" data-icon="expand_more">expand_more</span>
</button>
</div>
</div>
</section>
<!-- Help Banner -->
<div class="mt-section-gap bg-primary rounded-2xl p-6 text-center shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
<h4 class="text-headline-md font-headline-md text-on-primary mb-2">Still need help?</h4>
<p class="text-body-md font-body-md text-on-primary opacity-80 mb-6">Our 24/7 Concierge team is here to assist with any further questions.</p>
<button class="w-full bg-white text-primary py-4 rounded-full font-label-lg text-label-lg hover:opacity-90 transition-opacity">
                        Contact Support
                    </button>
</div>
</div>
</main>
<!-- BottomNavBar (Filtered Visibility: Suppressed on Task-Focused Screens, but shown here as FAQ is part of navigation) -->
<nav class="fixed bottom-0 w-full h-[84px] z-50 bg-surface-container-lowest dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<button class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors">
<span class="material-symbols-outlined" data-icon="home">home</span>
</button>
<button class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors">
<span class="material-symbols-outlined" data-icon="search">search</span>
</button>
<button class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors">
<span class="material-symbols-outlined" data-icon="favorite">favorite</span>
</button>
<button class="flex items-center justify-center text-primary dark:text-on-background scale-110">
<span class="material-symbols-outlined" data-icon="person" style="font-variation-settings: 'FILL' 1;">person</span>
</button>
</nav>
</div>
<script src="js/app.js"></script>
` }} />
  );
}
