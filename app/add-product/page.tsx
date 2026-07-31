import React from 'react';
import Image from 'next/image';

export default function AddProductPage() {
  return (
    <>

{/* TopAppBar */}
<header className="bg-surface dark:bg-background docked full-width top-0 z-50">
<div className="flex justify-between items-center w-full px-6 py-4">
<div className="flex items-center gap-2">
<button className="hover:opacity-80 transition-opacity active:scale-95">
<span className="material-symbols-outlined text-primary dark:text-on-background">close</span>
</button>
</div>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</h1>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary dark:text-on-background">help_outline</span>
</div>
</div>
</header>
<main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-24 pt-4">
{/* Screen Title */}
<div className="mb-stack-lg">
<h2 className="text-headline-lg font-headline-lg text-primary">Add Product</h2>
<p className="text-body-md font-body-md text-secondary">List a new exclusive sneaker to the marketplace.</p>
</div>
{/* Form Section */}
<form className="space-y-stack-lg">
{/* Image Upload Section */}
<section>
<label className="text-label-lg font-label-lg text-primary mb-stack-sm block">Product Images</label>
<div className="grid grid-cols-2 gap-gutter">
<div className="aspect-square bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-outline mb-2">add_a_photo</span>
<span className="text-label-sm font-label-sm text-outline">Upload</span>
</div>
<div className="aspect-square bg-surface-container-low rounded-xl relative overflow-hidden group">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgI6rA9fPsXd3MkQ95LTS172zFUpk-yKW9FTp2oaqkhqD9hhi4542zjnZDPR2VoSPvFstPWwKCAeGo2oBVB9FAXzjZFOjANROVOo_c2oCIeVD3du0k-lOEyRrsCmVdj3Zj9I8OqWHskwJRe1cXonSGiQYad3MC3XpWVEIwkPXmqxdjf6d-oGEHPp2vPKICodxIA4O_MxXk_FU_VfAXL_XeMWb9WGv_x8vME0ueWEbuAIqlJeUybgyPXEosFFwZai9lvPAP2Orhjn3c" alt="A high-end, professionally photographed studio shot of a limited edition designer sneaker against a clean, minimal white background. The lighting is soft and diffused, highlighting the intricate textures of the premium materials. The overall aesthetic is clean, luxury, and modern, fitting htmlFor a high-fashion digital marketplace." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
<span className="material-symbols-outlined text-white">delete</span>
</div>
</div>
</div>
</section>
{/* Input: Name */}
<section>
<label className="text-label-lg font-label-lg text-primary mb-stack-sm block" htmlFor="sneaker-name">Sneaker Name</label>
<input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-body-md font-body-md focus:ring-2 focus:ring-primary" id="sneaker-name" placeholder="e.g. Air Jordan 1 Retro High" type="text" />
</section>
{/* Input: Description */}
<section>
<label className="text-label-lg font-label-lg text-primary mb-stack-sm block" htmlFor="description">Description</label>
<textarea className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-body-md font-body-md focus:ring-2 focus:ring-primary" id="description" placeholder="Describe the rarity, condition, and history..." rows={3}></textarea>
</section>
<div className="grid grid-cols-2 gap-gutter">
{/* Input: Price */}
<section>
<label className="text-label-lg font-label-lg text-primary mb-stack-sm block" htmlFor="price">Retail Price ($)</label>
<input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-body-md font-body-md focus:ring-2 focus:ring-primary" id="price" placeholder="450.00" type="number" />
</section>
{/* Input: Category */}
<section>
<label className="text-label-lg font-label-lg text-primary mb-stack-sm block" htmlFor="category">Category</label>
<select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-body-md font-body-md focus:ring-2 focus:ring-primary appearance-none" id="category">
<option>Basketball</option>
<option>Running</option>
<option>Lifestyle</option>
<option>Luxury</option>
</select>
</section>
</div>
{/* Size Availability */}
<section>
<label className="text-label-lg font-label-lg text-primary mb-stack-sm block">Size Availability (US)</label>
<div className="flex flex-wrap gap-2">
{/* Size Chips */}
<div className="px-4 py-2 rounded-full bg-primary text-on-primary text-label-sm font-label-sm cursor-pointer">7</div>
<div className="px-4 py-2 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm cursor-pointer hover:bg-surface-container transition-colors">8</div>
<div className="px-4 py-2 rounded-full bg-primary text-on-primary text-label-sm font-label-sm cursor-pointer">8.5</div>
<div className="px-4 py-2 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm cursor-pointer hover:bg-surface-container transition-colors">9</div>
<div className="px-4 py-2 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm cursor-pointer hover:bg-surface-container transition-colors">10</div>
<div className="px-4 py-2 rounded-full bg-primary text-on-primary text-label-sm font-label-sm cursor-pointer">11</div>
<div className="px-4 py-2 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm cursor-pointer hover:bg-surface-container transition-colors">12</div>
<div className="px-4 py-2 rounded-full bg-surface-container-highest text-primary text-label-sm font-label-sm cursor-pointer border border-dashed border-outline-variant">
<span className="material-symbols-outlined text-[14px]">add</span>
</div>
</div>
</section>
{/* Settings Toggles */}
<section className="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] space-y-4">
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="text-label-lg font-label-lg text-primary">Featured Product</span>
<span className="text-label-sm font-label-sm text-secondary">Show in main carousel</span>
</div>
<div className="w-10 h-6 bg-primary rounded-full relative flex items-center px-1">
<div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
</div>
</div>
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="text-label-lg font-label-lg text-primary">Notify Subscribers</span>
<span className="text-label-sm font-label-sm text-secondary">Send push notifications</span>
</div>
<div className="w-10 h-6 bg-surface-container-highest rounded-full relative flex items-center px-1">
<div className="w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
</section>
</form>
</main>
{/* Sticky Footer Action */}
<footer className="fixed bottom-0 w-full bg-surface/80 backdrop-blur-md px-6 py-6 pb-8 border-t border-surface-container">
<button className="w-full bg-primary text-on-primary rounded-full py-[18px] text-label-lg font-label-lg shadow-[0px_10px_30px_rgba(0,0,0,0.08)] active:scale-95 transition-transform">
      Save Product
    </button>
</footer>

    </>
  );
}
