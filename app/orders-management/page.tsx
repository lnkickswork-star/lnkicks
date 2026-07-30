'use client';

import React from 'react';

export default function OrdersManagementPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!-- TopAppBar -->
<header class="bg-surface dark:bg-background docked full-width top-0 z-40">
<div class="flex justify-between items-center w-full px-6 py-4">
<button class="hover:opacity-80 transition-opacity active:scale 0.95 transition-transform">
<span class="material-symbols-outlined text-primary dark:text-on-background">menu</span>
</button>
<h1 class="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</h1>
<button class="hover:opacity-80 transition-opacity active:scale 0.95 transition-transform">
<span class="material-symbols-outlined text-primary dark:text-on-background">notifications</span>
</button>
</div>
</header>
<main class="flex-grow px-container-margin pb-32">
<!-- Screen Header & Filters -->
<section class="mt-stack-lg">
<div class="flex flex-col gap-stack-md">
<h2 class="text-headline-md font-headline-md text-on-surface">Order Management</h2>
<!-- Search Bar -->
<div class="relative flex items-center">
<span class="material-symbols-outlined absolute left-4 text-on-surface-variant">search</span>
<input class="w-full bg-[#F5F5F5] rounded-xl py-3 pl-12 pr-4 border-none text-body-md focus:ring-1 focus:ring-primary" placeholder="Search orders..." type="text">
</div>
<!-- Filter Chips -->
<div class="flex gap-stack-sm overflow-x-auto pb-2 no-scrollbar">
<div class="bg-primary text-on-primary px-4 py-2 rounded-full whitespace-nowrap text-label-lg font-label-lg cursor-pointer">All Orders</div>
<div class="bg-[#F5F5F5] text-on-surface px-4 py-2 rounded-full whitespace-nowrap text-label-lg font-label-lg cursor-pointer hover:bg-surface-container-high transition-colors">Processing</div>
<div class="bg-[#F5F5F5] text-on-surface px-4 py-2 rounded-full whitespace-nowrap text-label-lg font-label-lg cursor-pointer hover:bg-surface-container-high transition-colors">Shipped</div>
<div class="bg-[#F5F5F5] text-on-surface px-4 py-2 rounded-full whitespace-nowrap text-label-lg font-label-lg cursor-pointer hover:bg-surface-container-high transition-colors">Delivered</div>
</div>
</div>
</section>
<!-- Stats Overview (Asymmetric/Bento Style Lite) -->
<section class="mt-section-gap grid grid-cols-2 gap-gutter">
<div class="bg-surface-container-lowest p-component-padding-y rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE]">
<p class="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Today's Revenue</p>
<p class="text-headline-md font-headline-md mt-1">$4,280</p>
</div>
<div class="bg-surface-container-lowest p-component-padding-y rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE]">
<p class="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Active Orders</p>
<p class="text-headline-md font-headline-md mt-1">24</p>
</div>
</section>
<!-- Orders List -->
<section class="mt-section-gap space-y-gutter">
<div class="flex justify-between items-center">
<h3 class="text-title-lg font-title-lg">Recent Orders</h3>
<span class="text-label-lg font-label-lg text-secondary cursor-pointer">Export CSV</span>
</div>
<!-- Order Item 1 -->
<div class="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex flex-col gap-stack-sm">
<div class="flex justify-between items-start">
<div>
<p class="text-label-sm font-label-sm text-secondary">#ORD-28491</p>
<p class="text-title-lg font-title-lg mt-1">Marcus Thorne</p>
</div>
<span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm uppercase">Processing</span>
</div>
<div class="flex justify-between items-end mt-2">
<div class="flex flex-col">
<p class="text-body-md text-on-surface-variant">Oct 24, 2023</p>
<p class="text-label-sm font-label-sm text-secondary">2 Items</p>
</div>
<p class="text-headline-md font-headline-md">$890.00</p>
</div>
</div>
<!-- Order Item 2 -->
<div class="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex flex-col gap-stack-sm">
<div class="flex justify-between items-start">
<div>
<p class="text-label-sm font-label-sm text-secondary">#ORD-28488</p>
<p class="text-title-lg font-title-lg mt-1">Elena Rodriguez</p>
</div>
<span class="bg-primary text-on-primary px-3 py-1 rounded-full text-label-sm font-label-sm uppercase">Shipped</span>
</div>
<div class="flex justify-between items-end mt-2">
<div class="flex flex-col">
<p class="text-body-md text-on-surface-variant">Oct 23, 2023</p>
<p class="text-label-sm font-label-sm text-secondary">1 Item</p>
</div>
<p class="text-headline-md font-headline-md">$1,250.00</p>
</div>
</div>
<!-- Order Item 3 -->
<div class="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex flex-col gap-stack-sm">
<div class="flex justify-between items-start">
<div>
<p class="text-label-sm font-label-sm text-secondary">#ORD-28485</p>
<p class="text-title-lg font-title-lg mt-1">James Henderson</p>
</div>
<span class="bg-surface-container-high text-secondary px-3 py-1 rounded-full text-label-sm font-label-sm uppercase">Delivered</span>
</div>
<div class="flex justify-between items-end mt-2">
<div class="flex flex-col">
<p class="text-body-md text-on-surface-variant">Oct 23, 2023</p>
<p class="text-label-sm font-label-sm text-secondary">4 Items</p>
</div>
<p class="text-headline-md font-headline-md">$340.00</p>
</div>
</div>
<!-- Order Item 4 -->
<div class="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex flex-col gap-stack-sm opacity-60">
<div class="flex justify-between items-start">
<div>
<p class="text-label-sm font-label-sm text-secondary">#ORD-28482</p>
<p class="text-title-lg font-title-lg mt-1">Sophia Chen</p>
</div>
<span class="bg-surface-container-high text-secondary px-3 py-1 rounded-full text-label-sm font-label-sm uppercase">Delivered</span>
</div>
<div class="flex justify-between items-end mt-2">
<div class="flex flex-col">
<p class="text-body-md text-on-surface-variant">Oct 22, 2023</p>
<p class="text-label-sm font-label-sm text-secondary">1 Item</p>
</div>
<p class="text-headline-md font-headline-md">$560.00</p>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="bg-surface-container-lowest dark:bg-surface-container-low fixed bottom-0 w-full h-[84px] z-50 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<button class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined">home</span>
</button>
<button class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined">search</span>
</button>
<button class="flex items-center justify-center text-primary dark:text-on-background scale-110">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">favorite</span>
</button>
<button class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined">person</span>
</button>
</nav>
<script src="js/app.js"></script>
` }} />
  );
}
