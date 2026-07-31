'use client';

import React from 'react';

export default function AddProductPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!-- TopAppBar -->
<header class="bg-surface dark:bg-background docked full-width top-0 z-50">
<div class="flex justify-between items-center w-full px-6 py-4">
<div class="flex items-center gap-2">
<button class="hover:opacity-80 transition-opacity active:scale-95">
<span class="material-symbols-outlined text-primary dark:text-on-background">close</span>
</button>
</div>
<h1 class="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</h1>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary dark:text-on-background">help_outline</span>
</div>
</div>
</header>
<main class="flex-1 overflow-y-auto no-scrollbar px-6 pb-24 pt-4">
<!-- Screen Title -->
<div class="mb-stack-lg">
<h2 class="text-headline-lg font-headline-lg text-primary">Add Product</h2>
<p class="text-body-md font-body-md text-secondary">List a new exclusive sneaker to the marketplace.</p>
</div>
<!-- Form Section -->
<form class="space-y-stack-lg">
<!-- Image Upload Section -->
<section>
<label class="text-label-lg font-label-lg text-primary mb-stack-sm block">Product Images</label>
<div class="grid grid-cols-2 gap-gutter">
<div class="aspect-square bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-outline mb-2">add_a_photo</span>
<span class="text-label-sm font-label-sm text-outline">Upload</span>
</div>
<div class="aspect-square bg-surface-container-low rounded-xl relative overflow-hidden group">
<img class="w-full h-full object-cover" data-alt="A high-end, professionally photographed studio shot of a limited edition designer sneaker against a clean, minimal white background. The lighting is soft and diffused, highlighting the intricate textures of the premium materials. The overall aesthetic is clean, luxury, and modern, fitting for a high-fashion digital marketplace." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgI6rA9fPsXd3MkQ95LTS172zFUpk-yKW9FTp2oaqkhqD9hhi4542zjnZDPR2VoSPvFstPWwKCAeGo2oBVB9FAXzjZFOjANROVOo_c2oCIeVD3du0k-lOEyRrsCmVdj3Zj9I8OqWHskwJRe1cXonSGiQYad3MC3XpWVEIwkPXmqxdjf6d-oGEHPp2vPKICodxIA4O_MxXk_FU_VfAXL_XeMWb9WGv_x8vME0ueWEbuAIqlJeUybgyPXEosFFwZai9lvPAP2Orhjn3c">
<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
<span class="material-symbols-outlined text-white">delete</span>
</div>
</div>
</div>
</section>
<!-- Input: Name -->
<section>
<label class="text-label-lg font-label-lg text-primary mb-stack-sm block" for="sneaker-name">Sneaker Name</label>
<input class="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-body-md font-body-md focus:ring-2 focus:ring-primary" id="sneaker-name" placeholder="e.g. Air Jordan 1 Retro High" type="text">
</section>
<!-- Input: Description -->
<section>
<label class="text-label-lg font-label-lg text-primary mb-stack-sm block" for="description">Description</label>
<textarea class="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-body-md font-body-md focus:ring-2 focus:ring-primary" id="description" placeholder="Describe the rarity, condition, and history..." rows="3"></textarea>
</section>
<div class="grid grid-cols-2 gap-gutter">
<!-- Input: Price -->
<section>
<label class="text-label-lg font-label-lg text-primary mb-stack-sm block" for="price">Retail Price ($)</label>
<input class="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-body-md font-body-md focus:ring-2 focus:ring-primary" id="price" placeholder="450.00" type="number">
</section>
<!-- Input: Category -->
<section>
<label class="text-label-lg font-label-lg text-primary mb-stack-sm block" for="category">Category</label>
<select class="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-body-md font-body-md focus:ring-2 focus:ring-primary appearance-none" id="category">
<option>Basketball</option>
<option>Running</option>
<option>Lifestyle</option>
<option>Luxury</option>
</select>
</section>
</div>
<!-- Size Availability -->
<section>
<label class="text-label-lg font-label-lg text-primary mb-stack-sm block">Size Availability (US)</label>
<div class="flex flex-wrap gap-2">
<!-- Size Chips -->
<div class="px-4 py-2 rounded-full bg-primary text-on-primary text-label-sm font-label-sm cursor-pointer">7</div>
<div class="px-4 py-2 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm cursor-pointer hover:bg-surface-container transition-colors">8</div>
<div class="px-4 py-2 rounded-full bg-primary text-on-primary text-label-sm font-label-sm cursor-pointer">8.5</div>
<div class="px-4 py-2 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm cursor-pointer hover:bg-surface-container transition-colors">9</div>
<div class="px-4 py-2 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm cursor-pointer hover:bg-surface-container transition-colors">10</div>
<div class="px-4 py-2 rounded-full bg-primary text-on-primary text-label-sm font-label-sm cursor-pointer">11</div>
<div class="px-4 py-2 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm cursor-pointer hover:bg-surface-container transition-colors">12</div>
<div class="px-4 py-2 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm cursor-pointer border border-dashed border-outline-variant">
<span class="material-symbols-outlined text-[14px]">add</span>
</div>
</div>
</section>
<!-- Settings Toggles -->
<section class="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] space-y-4">
<div class="flex items-center justify-between">
<div class="flex flex-col">
<span class="text-label-lg font-label-lg text-primary">Featured Product</span>
<span class="text-label-sm font-label-sm text-secondary">Show in main carousel</span>
</div>
<div class="w-10 h-6 bg-primary rounded-full relative flex items-center px-1">
<div class="w-4 h-4 bg-white rounded-full ml-auto"></div>
</div>
</div>
<div class="flex items-center justify-between">
<div class="flex flex-col">
<span class="text-label-lg font-label-lg text-primary">Notify Subscribers</span>
<span class="text-label-sm font-label-sm text-secondary">Send push notifications</span>
</div>
<div class="w-10 h-6 bg-surface-container-highest rounded-full relative flex items-center px-1">
<div class="w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
</section>
</form>
</main>
<!-- Sticky Footer Action -->
<footer class="fixed bottom-0 w-full bg-surface/80 backdrop-blur-md px-6 py-6 pb-8 border-t border-surface-container">
<button class="w-full bg-primary text-on-primary rounded-full py-[18px] text-label-lg font-label-lg shadow-[0px_10px_30px_rgba(0,0,0,0.08)] active:scale-95 transition-transform">
      Save Product
    </button>
</footer>
<script src="js/app.js"></script>
` }} />
  );
}
