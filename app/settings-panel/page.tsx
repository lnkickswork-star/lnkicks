'use client';

import React from 'react';

export default function SettingsPanelPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!-- TopAppBar -->
<header class="bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-primary dark:text-on-background hover:opacity-80 transition-opacity active:scale-95 transition-transform" data-icon="menu">menu</span>
<h1 class="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</h1>
</div>
<div class="flex items-center">
<span class="material-symbols-outlined text-primary dark:text-on-background hover:opacity-80 transition-opacity active:scale-95 transition-transform" data-icon="notifications">notifications</span>
</div>
</header>
<main class="pt-20 pb-28 px-6 max-w-[390px] mx-auto overflow-y-auto h-screen">
<!-- Page Title -->
<div class="mb-stack-lg">
<h2 class="text-headline-lg font-headline-lg">Admin Settings</h2>
<p class="text-body-md text-secondary mt-2">Manage your marketplace operations and global configurations.</p>
</div>
<!-- Settings Sections -->
<div class="flex flex-col gap-section-gap">
<!-- General Settings -->
<section>
<div class="flex items-center gap-2 mb-stack-md">
<span class="material-symbols-outlined text-primary" data-icon="settings">settings</span>
<h3 class="text-title-lg font-title-lg">General Settings</h3>
</div>
<div class="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] space-y-stack-md">
<div class="space-y-2">
<label class="text-label-lg font-label-lg px-1">Marketplace Name</label>
<input class="w-full bg-[#F5F5F5] border-none rounded-xl px-4 py-[14px] text-body-md focus:ring-1 focus:ring-primary" type="text" value="LNKICKS Luxury Boutique">
</div>
<div class="flex items-center justify-between py-2">
<div>
<p class="text-body-lg font-semibold">Maintenance Mode</p>
<p class="text-label-sm text-secondary">Disable front-end access</p>
</div>
<button class="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-container-highest transition-colors">
<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
</button>
</div>
<div class="flex items-center justify-between py-2">
<div>
<p class="text-body-lg font-semibold">Automatic SEO</p>
<p class="text-label-sm text-secondary">Generate meta tags automatically</p>
</div>
<button class="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
</button>
</div>
</div>
</section>
<!-- Payment Gateway Integration -->
<section>
<div class="flex items-center gap-2 mb-stack-md">
<span class="material-symbols-outlined text-primary" data-icon="payments">payments</span>
<h3 class="text-title-lg font-title-lg">Payment Gateway</h3>
</div>
<div class="flex flex-col gap-stack-md">
<!-- Stripe Card -->
<div class="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-[#6772E5] flex items-center justify-center">
<span class="material-symbols-outlined text-white" data-icon="credit_card">credit_card</span>
</div>
<div>
<p class="text-body-lg font-semibold">Stripe</p>
<p class="text-label-sm text-secondary">Connected • 0.5% fee</p>
</div>
</div>
<span class="material-symbols-outlined text-primary" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<!-- PayPal Card -->
<div class="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
<span class="material-symbols-outlined text-secondary" data-icon="account_balance_wallet">account_balance_wallet</span>
</div>
<div>
<p class="text-body-lg font-semibold">PayPal</p>
<p class="text-label-sm text-secondary">Not configured</p>
</div>
</div>
<button class="text-label-lg font-label-lg text-primary border-b border-primary">Setup</button>
</div>
</div>
</section>
<!-- Shipping Configuration -->
<section>
<div class="flex items-center gap-2 mb-stack-md">
<span class="material-symbols-outlined text-primary" data-icon="local_shipping">local_shipping</span>
<h3 class="text-title-lg font-title-lg">Shipping Configuration</h3>
</div>
<div class="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] space-y-stack-md">
<div class="space-y-2">
<label class="text-label-lg font-label-lg px-1">Global Shipping Flat Rate ($)</label>
<input class="w-full bg-[#F5F5F5] border-none rounded-xl px-4 py-[14px] text-body-md" placeholder="25.00" type="number">
</div>
<div class="flex items-center justify-between pt-2 border-t border-[#EEEEEE]">
<p class="text-body-md">DHL Express Integration</p>
<button class="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
</button>
</div>
<div class="flex items-center justify-between">
<p class="text-body-md">FedEx Overnight</p>
<button class="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-container-highest transition-colors">
<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
</button>
</div>
</div>
</section>
<!-- User Roles -->
<section>
<div class="flex items-center gap-2 mb-stack-md">
<span class="material-symbols-outlined text-primary" data-icon="badge">badge</span>
<h3 class="text-title-lg font-title-lg">User Roles &amp; Permissions</h3>
</div>
<div class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE]">
<div class="flex items-center justify-between p-stack-md border-b border-[#EEEEEE] hover:bg-surface-container-low transition-colors">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">ADM</div>
<div>
<p class="text-body-md font-semibold">Super Administrator</p>
<p class="text-label-sm text-secondary">Full System Access</p>
</div>
</div>
<span class="material-symbols-outlined text-secondary" data-icon="chevron_right">chevron_right</span>
</div>
<div class="flex items-center justify-between p-stack-md border-b border-[#EEEEEE] hover:bg-surface-container-low transition-colors">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary text-[10px] font-bold">MOD</div>
<div>
<p class="text-body-md font-semibold">Content Moderator</p>
<p class="text-label-sm text-secondary">Manage Listings &amp; Users</p>
</div>
</div>
<span class="material-symbols-outlined text-secondary" data-icon="chevron_right">chevron_right</span>
</div>
<div class="flex items-center justify-center p-stack-md">
<button class="text-label-lg font-label-lg text-primary flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                            Create New Role
                        </button>
</div>
</div>
</section>
<div class="pb-10">
<button class="w-full bg-primary text-on-primary py-[18px] rounded-full font-bold text-body-lg shadow-[0px_10px_30px_rgba(0,0,0,0.08)] active:scale-95 transition-transform">
                    Save Changes
                </button>
</div>
</div>
</main>
<!-- BottomNavBar -->
<nav class="bg-surface-container-lowest dark:bg-surface-container-low fixed bottom-0 w-full h-[84px] z-50 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<a class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
</a>
<a class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="search">search</span>
</a>
<a class="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="favorite">favorite</span>
</a>
<a class="flex items-center justify-center text-primary dark:text-on-background scale-110" href="#">
<span class="material-symbols-outlined" data-icon="person" style="font-variation-settings: 'FILL' 1;">person</span>
</a>
</nav>
<script src="js/app.js"></script>
` }} />
  );
}
