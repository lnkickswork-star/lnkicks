'use client';

import React from 'react';

export default function EditProductPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!-- Mobile Container (390x844) -->
<div class="w-[390px] min-h-[844px] bg-surface relative overflow-y-auto pb-24 shadow-2xl">
<!-- TopAppBar (From JSON Mapping) -->
<header class="docked full-width top-0 sticky z-50 bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4">
<button class="hover:opacity-80 transition-opacity active:scale 0.95 transition-transform">
<span class="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 class="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</h1>
<button class="hover:opacity-80 transition-opacity active:scale 0.95 transition-transform">
<span class="material-symbols-outlined text-primary">more_vert</span>
</button>
</header>
<!-- Main Form Canvas -->
<main class="px-container-margin mt-stack-lg">
<div class="mb-section-gap">
<h2 class="text-headline-lg font-headline-lg text-primary mb-2">Edit Product</h2>
<p class="text-body-md font-body-md text-secondary">ID: #SKU-99281-BLK</p>
</div>
<form class="space-y-stack-lg">
<!-- Image Gallery Preview -->
<section>
<label class="text-label-lg font-label-lg text-primary block mb-stack-sm">Product Images</label>
<div class="flex gap-stack-sm overflow-x-auto pb-2">
<div class="relative flex-shrink-0 w-32 h-32 bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<img class="w-full h-full object-cover" data-alt="A side-profile high-resolution photograph of a premium black and white designer sneaker. The lighting is studio-quality with soft, diffused highlights emphasizing the leather texture. The overall aesthetic is ultra-minimalist and luxury-focused, set against a pristine white background with subtle grey shadows for depth." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFAXLAkcGFyogtPbYG3gl1QfVebTeoz3noKPSARYBOgGC0-XVrIXDm3aP0vGBZssxnRswFfk-k01gqRxjrzCTSOkAne7oRVp6P9B21dx7-mqu185-Sk5g9yUZSHATXbBArz1Wvs8xUJI7am0vJKpVdSfu1gu7w4kcUV_Oq75Z5YV3cpIBTJhTM2DIuAqv2Ur9GA4oyLpP0JGXF8jpk0cS6Ch1j0fLA1Abkn6ajk36Rf0IsRDNb7NRTPENauCsb_gb33VbBPPL8xcDb">
<button class="absolute top-2 right-2 bg-white/80 backdrop-blur-md rounded-full p-1 text-error">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
<div class="relative flex-shrink-0 w-32 h-32 bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<img class="w-full h-full object-cover" data-alt="Close-up artistic shot of the rear heel detail of a luxury sneaker featuring embossed branding. The image is captured in high-contrast monochrome with bright white studio lighting that creates sharp, clean lines. The composition is asymmetrical and modern, highlighting the high-end craftsmanship of the shoe." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Jre6J4wYHZj0UQBJFaAhPVut3LPrDi_GE-GUln16qCnc5o7BEot5NgGVJ1GobC_j70PR5nH9kCxfwVYsKyDjqfzGDgF-BQDHU39raY2Ob9PSsYGMmRpimmDIe54vFyxVuPSI4HXiRbFvYuC_2GOJ1fs453cP1oCrCJFBMT2Cnrw68aar-2l8g35WPXjhAlkQpRYWnKEmYMEW7HpOEYcUliJrwkj3xHzMOzi3W-0OtGOGvVcCxorBN71lsUgy552rSfWYCtQVhsMV">
<button class="absolute top-2 right-2 bg-white/80 backdrop-blur-md rounded-full p-1 text-error">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
<div class="flex-shrink-0 w-32 h-32 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center text-secondary-fixed-variant hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-[32px]">add_photo_alternate</span>
<span class="text-label-sm font-label-sm mt-1">Add New</span>
</div>
</div>
</section>
<!-- Product Name -->
<div class="space-y-2">
<label class="text-label-lg font-label-lg text-primary block">Product Name</label>
<input class="w-full bg-surface-container-lowest border-b border-outline-variant py-3 px-1 text-body-lg font-body-lg focus:outline-none focus:border-primary transition-colors" type="text" value="Air Jordan 1 Retro High '85">
</div>
<!-- Price & Stock Grid -->
<div class="grid grid-cols-2 gap-gutter">
<div class="space-y-2">
<label class="text-label-lg font-label-lg text-primary block">Price (USD)</label>
<div class="relative">
<span class="absolute left-0 top-3 text-body-lg font-body-lg text-secondary">$</span>
<input class="w-full bg-surface-container-lowest border-b border-outline-variant py-3 pl-4 pr-1 text-body-lg font-body-lg focus:outline-none focus:border-primary transition-colors" type="number" value="200.00">
</div>
</div>
<div class="space-y-2">
<label class="text-label-lg font-label-lg text-primary block">Stock Quantity</label>
<input class="w-full bg-surface-container-lowest border-b border-outline-variant py-3 px-1 text-body-lg font-body-lg focus:outline-none focus:border-primary transition-colors" type="number" value="42">
</div>
</div>
<!-- Category & Size -->
<div class="grid grid-cols-2 gap-gutter">
<div class="space-y-2">
<label class="text-label-lg font-label-lg text-primary block">Category</label>
<select class="w-full bg-surface-container-lowest border-b border-outline-variant py-3 px-1 text-body-lg font-body-lg focus:outline-none focus:border-primary appearance-none">
<option selected="">Basketball</option>
<option>Lifestyle</option>
<option>Running</option>
</select>
</div>
<div class="space-y-2">
<label class="text-label-lg font-label-lg text-primary block">Default Size</label>
<input class="w-full bg-surface-container-lowest border-b border-outline-variant py-3 px-1 text-body-lg font-body-lg focus:outline-none focus:border-primary transition-colors" type="text" value="10.5">
</div>
</div>
<!-- Description -->
<div class="space-y-2">
<label class="text-label-lg font-label-lg text-primary block">Description</label>
<textarea class="w-full bg-[#F5F5F5] rounded-xl p-4 text-body-md font-body-md text-on-surface focus:outline-none border-none resize-none leading-relaxed" rows="4">The Air Jordan 1 Retro High '85 brings back the iconic silhouette in its most authentic form. Featuring premium full-grain leather, high-fidelity stitching, and the original high-top collar height, this release is a must-have for serious collectors of the brand's history.</textarea>
</div>
<!-- Update Button -->
<div class="pt-stack-lg">
<button class="w-full bg-primary text-on-primary py-[18px] rounded-full font-label-lg text-label-lg shadow-[0px_10px_30px_rgba(0,0,0,0.08)] active:scale-95 transition-transform" type="submit">
                        Update Product
                    </button>
<button class="w-full mt-4 text-primary font-label-lg text-label-lg py-2 hover:bg-surface-container-low rounded-lg transition-colors" type="button">
                        Archive Listing
                    </button>
</div>
</form>
</main>
<!-- BottomNavBar (Suppressed for Transactional/Form Page as per Rule) -->
<!-- Instead, providing a soft footer indicator for mobile depth -->
<div class="h-10 w-full flex items-center justify-center pointer-events-none">
<div class="w-32 h-1 bg-surface-container-highest rounded-full"></div>
</div>
</div>
<script src="js/app.js"></script>
` }} />
  );
}
