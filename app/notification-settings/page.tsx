'use client';

import React from 'react';

export default function NotificationSettingsPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!-- Mobile Frame (390x844) -->
<main class="w-[390px] h-[844px] bg-background relative overflow-hidden shadow-2xl flex flex-col">
<!-- TopAppBar (From JSON) -->
<header class="docked full-width top-0 bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4 z-50">
<button class="text-primary dark:text-on-background hover:opacity-80 transition-opacity active:scale-0.95 transition-transform">
<span class="material-symbols-outlined">arrow_back</span>
</button>
<h1 class="text-label-lg font-label-lg text-primary dark:text-on-background">Notification Settings</h1>
<button class="text-primary dark:text-on-background hover:opacity-80 transition-opacity active:scale-0.95 transition-transform">
<span class="material-symbols-outlined">notifications</span>
</button>
</header>
<!-- Content Canvas -->
<div class="flex-1 overflow-y-auto px-container-margin py-stack-lg">
<!-- Header Section -->
<div class="mb-section-gap">
<h2 class="text-display-lg-mobile font-display-lg-mobile text-on-background tracking-tighter">Preferences</h2>
<p class="text-body-md font-body-md text-secondary mt-1">Manage how you stay updated with LNKICKS.</p>
</div>
<!-- Settings List -->
<div class="space-y-gutter">
<!-- Group 1: Account Activities -->
<div class="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<h3 class="text-label-sm font-label-sm text-secondary uppercase tracking-widest mb-4">Transactionals</h3>
<div class="space-y-stack-lg">
<!-- Row: Order Updates -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
</div>
<div>
<p class="text-title-lg font-title-lg text-on-background">Order Updates</p>
<p class="text-label-sm font-label-sm text-secondary">Tracking, delivery, and returns</p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input checked="" class="sr-only peer" type="checkbox">
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<!-- Row: Account Alerts -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-[20px]">security</span>
</div>
<div>
<p class="text-title-lg font-title-lg text-on-background">Account Alerts</p>
<p class="text-label-sm font-label-sm text-secondary">Security and privacy notifications</p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input checked="" class="sr-only peer" type="checkbox">
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>
<!-- Group 2: Marketing & Drops -->
<div class="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<h3 class="text-label-sm font-label-sm text-secondary uppercase tracking-widest mb-4">Discovery</h3>
<div class="space-y-stack-lg">
<!-- Row: New Drops -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-[20px]">flare</span>
</div>
<div>
<p class="text-title-lg font-title-lg text-on-background">New Drops</p>
<p class="text-label-sm font-label-sm text-secondary">Limited edition releases</p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input class="sr-only peer" type="checkbox">
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<!-- Row: Promotions -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-[20px]">sell</span>
</div>
<div>
<p class="text-title-lg font-title-lg text-on-background">Promotions</p>
<p class="text-label-sm font-label-sm text-secondary">Personalized offers and sales</p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input class="sr-only peer" type="checkbox">
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>
<!-- Footer CTA -->
<div class="mt-8 space-y-4">
<button class="w-full bg-primary text-on-primary py-[18px] rounded-full font-bold text-label-lg hover:opacity-90 active:scale-95 transition-all">
                        Save Preferences
                    </button>
<button class="w-full bg-transparent border border-outline text-primary py-[18px] rounded-full font-bold text-label-lg hover:bg-surface-container active:scale-95 transition-all">
                        Disable All
                    </button>
</div>
</div>
<!-- Asymmetric Accent Card -->
<div class="mt-section-gap relative rounded-2xl overflow-hidden h-32 flex items-center p-6 bg-primary">
<div class="relative z-10 w-2/3">
<p class="text-on-primary font-title-lg text-title-lg leading-tight">Need help with your account?</p>
<p class="text-on-primary-container text-label-sm mt-1">Contact Support 24/7</p>
</div>
<div class="absolute right-[-20px] top-[-20px] w-32 h-32 opacity-20">
<span class="material-symbols-outlined text-[120px] text-on-primary">support_agent</span>
</div>
</div>
</div>
<!-- BottomNavBar (From JSON) -->
<nav class="fixed bottom-0 w-full h-[84px] z-50 bg-surface-container-lowest dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<button class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors">
<span class="material-symbols-outlined">home</span>
</button>
<button class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors">
<span class="material-symbols-outlined">search</span>
</button>
<button class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors">
<span class="material-symbols-outlined">favorite</span>
</button>
<button class="flex items-center justify-center text-primary dark:text-on-background scale-110">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">person</span>
</button>
</nav>
</main>
<script src="js/app.js"></script>
<script src="js/user_account_engine.js"></script>
` }} />
  );
}
