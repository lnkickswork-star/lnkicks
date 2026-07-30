'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!-- Top App Bar (Asymmetric context: Suppressed Nav logic applied) -->
<header class="docked full-width top-0 z-50 bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4">
<div class="flex items-center gap-4">
<button class="hover:opacity-80 transition-opacity flex items-center justify-center active:scale-95 transition-transform">
<span class="material-symbols-outlined text-primary dark:text-on-background">arrow_back</span>
</button>
<h1 class="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">Privacy Policy</h1>
</div>
<button class="hover:opacity-80 transition-opacity flex items-center justify-center active:scale-95 transition-transform">
<span class="material-symbols-outlined text-primary dark:text-on-background">share</span>
</button>
</header>
<!-- Main Content Canvas -->
<main class="px-6 pt-6 pb-24 max-w-[390px] mx-auto overflow-y-auto">
<!-- Hero Introduction Section -->
<section class="mb-stack-lg">
<p class="text-body-lg font-body-lg text-secondary mb-stack-md leading-relaxed">
                At LNKICKS, your privacy is paramount. This policy outlines how we handle your personal data to provide a seamless luxury sneaker experience.
            </p>
<div class="h-[1px] w-full bg-outline-variant"></div>
</section>
<!-- Information We Collect Section -->
<section class="mb-section-gap">
<div class="flex items-center gap-3 mb-stack-md">
<span class="material-symbols-outlined text-primary">analytics</span>
<h2 class="text-title-lg font-title-lg text-primary">Information We Collect</h2>
</div>
<div class="space-y-stack-md">
<div class="p-component-padding-y bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
<h3 class="text-label-lg font-label-lg text-primary mb-1">Personal Identifiers</h3>
<p class="text-body-md font-body-md text-on-surface-variant">Name, email address, and shipping details required for order fulfillment and account authentication.</p>
</div>
<div class="p-component-padding-y bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
<h3 class="text-label-lg font-label-lg text-primary mb-1">Device &amp; Usage Data</h3>
<p class="text-body-md font-body-md text-on-surface-variant">IP addresses, browser types, and interaction logs within the app to optimize our marketplace performance.</p>
</div>
</div>
</section>
<!-- Visual Break / Abstract Graphic -->
<div class="mb-section-gap h-48 w-full rounded-2xl overflow-hidden relative">
<img alt="Privacy Security Abstract" class="w-full h-full object-cover" data-alt="A sophisticated and clean abstract image representing digital security in a luxury context. The scene features a close-up of high-end sneaker leather textures overlapping with sleek, translucent glass planes that catch soft, ambient studio lighting. A minimalist monochrome color palette of stark whites and deep blacks creates a sense of high-fidelity precision and protection. The mood is calm, exclusive, and technologically refined." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJDMmD1r9zq_Zb2iPo6Kplosik_s7holY013l3qOP0mOGTKmZCCxDFk7XpmhkZLBJkYEDfLQX8ibqh9rSiWB1kDSMbzCWNWX3sxYqx2De87YulsvSk-Oqhjk52PS81TVKjNM0KCbx31NePFN4--1NUqZh0YWwItq8UvLJTAgMf9KmpZMhotmC-RizM0koSZrVRsun6ucwGqQiMMIclWwJJBQi6tg0BDxGa5TmAafDv05LS3jXPrdHgzw3pPPs0GW-TdJZSUV-0G1tE">
<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
</div>
<!-- How We Use Information Section -->
<section class="mb-section-gap">
<div class="flex items-center gap-3 mb-stack-md">
<span class="material-symbols-outlined text-primary">hub</span>
<h2 class="text-title-lg font-title-lg text-primary">How We Use Information</h2>
</div>
<ul class="space-y-stack-md list-none">
<li class="flex items-start gap-4">
<div class="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
<p class="text-body-md font-body-md text-on-surface-variant">To process transactions and manage your premium membership benefits securely.</p>
</li>
<li class="flex items-start gap-4">
<div class="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
<p class="text-body-md font-body-md text-on-surface-variant">To personalize your feed with high-end sneaker recommendations based on your preferences.</p>
</li>
<li class="flex items-start gap-4">
<div class="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
<p class="text-body-md font-body-md text-on-surface-variant">To communicate exclusive drops, order updates, and security alerts via encrypted channels.</p>
</li>
</ul>
</section>
<!-- Data Protection Section -->
<section class="mb-section-gap p-stack-lg bg-primary rounded-2xl text-on-primary">
<div class="flex items-center gap-3 mb-stack-md">
<span class="material-symbols-outlined text-on-primary">shield_lock</span>
<h2 class="text-title-lg font-title-lg">Data Protection</h2>
</div>
<p class="text-body-md font-body-md opacity-90 leading-relaxed mb-stack-md">
                Your data is stored using industry-standard encryption (AES-256). We conduct regular security audits to ensure your collection and payment information remain impenetrable.
            </p>
<div class="flex gap-2">
<span class="px-3 py-1 bg-white/20 rounded-full text-label-sm font-label-sm">GDPR Compliant</span>
<span class="px-3 py-1 bg-white/20 rounded-full text-label-sm font-label-sm">End-to-End Encryption</span>
</div>
</section>
<!-- Footer / Contact Section -->
<footer class="pb-stack-lg border-t border-outline-variant pt-stack-lg">
<h4 class="text-label-lg font-label-lg text-primary mb-2">Questions regarding privacy?</h4>
<p class="text-body-md font-body-md text-secondary mb-stack-md">Reach out to our compliance team for a detailed review of your data rights.</p>
<button class="w-full py-[18px] bg-primary text-on-primary rounded-full font-label-lg hover:opacity-90 transition-opacity active:scale-[0.98]">
                Contact Privacy Officer
            </button>
<div class="mt-stack-lg flex justify-center gap-6">
<span class="text-label-sm font-label-sm text-on-surface-variant">Terms of Service</span>
<span class="text-label-sm font-label-sm text-on-surface-variant">Cookie Policy</span>
</div>
</footer>
</main>
<!-- Navigation suppressed per Destination Rule: Linear/Transactional page -->
<script src="js/app.js"></script>
` }} />
  );
}
