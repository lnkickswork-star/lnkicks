import React from 'react';
import Image from 'next/image';

export default function OrderDetailPage() {
  return (
    <>

{/* Top App Bar */}
<header className="docked full-width top-0 z-50 bg-surface flex justify-between items-center w-full px-6 py-4">
<div className="flex items-center gap-4">
<button className="hover:opacity-80 transition-opacity active:scale 0.95 transition-transform text-primary">
<span className="material-symbols-outlined">arrow_back</span>
</button>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary">Order Detail</h1>
</div>
<button className="hover:opacity-80 transition-opacity active:scale 0.95 transition-transform text-primary">
<span className="material-symbols-outlined">notifications</span>
</button>
</header>
<main className="pt-4 pb-32 px-6 overflow-y-auto">
{/* Order Identification */}
<section className="mb-stack-lg">
<div className="flex justify-between items-end">
<div>
<p className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">Order ID</p>
<p className="text-title-lg font-title-lg text-primary">#LNK-8829410</p>
</div>
<div className="text-right">
<p className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">Date</p>
<p className="text-body-md font-body-md text-on-surface">Oct 24, 2023</p>
</div>
</div>
</section>
{/* Status Timeline (Stepper) */}
<section className="mb-section-gap p-component-padding-x bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<div className="flex justify-between relative">
{/* Progress Line */}
<div className="absolute top-4 left-0 w-full h-[2px] bg-surface-container-highest z-0">
<div className="h-full bg-primary w-[66%]"></div>
</div>
{/* Steps */}
<div className="relative z-10 flex flex-col items-center gap-2">
<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '\'FILL\' 1' }}>check</span>
</div>
<span className="text-label-sm font-label-sm text-primary">Placed</span>
</div>
<div className="relative z-10 flex flex-col items-center gap-2">
<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '\'FILL\' 1' }}>check</span>
</div>
<span className="text-label-sm font-label-sm text-primary">Processed</span>
</div>
<div className="relative z-10 flex flex-col items-center gap-2">
<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '\'FILL\' 1' }}>local_shipping</span>
</div>
<span className="text-label-sm font-label-sm text-primary">Shipped</span>
</div>
<div className="relative z-10 flex flex-col items-center gap-2">
<div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[18px]">inventory_2</span>
</div>
<span className="text-label-sm font-label-sm text-secondary">Delivered</span>
</div>
</div>
</section>
{/* Shipping & Payment Bento */}
<section className="grid grid-cols-1 gap-gutter mb-section-gap">
<div className="p-component-padding-x bg-surface-container-lowest rounded-xl border border-[#EEEEEE]">
<div className="flex items-center gap-2 mb-stack-sm text-primary">
<span className="material-symbols-outlined text-[20px]">location_on</span>
<h3 className="text-label-lg font-label-lg">Shipping Address</h3>
</div>
<p className="text-body-md font-body-md text-on-surface leading-relaxed">
                    Jonathan Sterling<br />
                    124 High-Fashion Blvd, Suite 402<br />
                    New York, NY 10012
                </p>
</div>
<div className="p-component-padding-x bg-surface-container-lowest rounded-xl border border-[#EEEEEE]">
<div className="flex items-center gap-2 mb-stack-sm text-primary">
<span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
<h3 className="text-label-lg font-label-lg">Payment Method</h3>
</div>
<div className="flex items-center justify-between">
<p className="text-body-md font-body-md text-on-surface">Visa ending in •••• 4492</p>
<div className="h-6 w-10 bg-surface-container flex items-center justify-center rounded">
<span className="text-[8px] font-bold text-secondary">VISA</span>
</div>
</div>
</div>
</section>
{/* Itemized List */}
<section className="mb-section-gap">
<h3 className="text-label-lg font-label-lg mb-stack-md text-primary uppercase tracking-widest">Order Items (2)</h3>
<div className="space-y-stack-md">
{/* Item 1 */}
<div className="flex gap-stack-md p-2 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<div className="w-24 h-24 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzwoBEK3VupvO8LVS4xR8fYFkXdvrS1lzTzXaFuxl-0QJwXYTxLZC56YPochnZBdxIK_vDbnDxNnFyXiIGk4JlKOUehBveBc7f8l_LESp5jQqSJPwwTbZEtH3JTT7JdehIdgDiCakXulsgeu5VAh-OLpKeerGvSu6HQ4Nwq-aeEge5di4TjghrfmF_xLXYuXMITjCBqfdV1sr8nhW42tyOobsXF4xhqdi0xL4n0fp05GXZkXbRMCVug2X1BIGmay3g4VnZ14SK7vHA" alt="A premium close-up shot of a limited edition sleek black and white leather luxury sneaker. The shoe is positioned artistically against a clean, off-white minimalist studio background with soft natural lighting and subtle shadows. The aesthetic is high-fashion and boutique, emphasizing the fine texture and craftsmanship of the footwear." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
</div>
<div className="flex flex-col justify-center flex-grow py-1">
<h4 className="text-title-lg font-title-lg text-primary leading-tight">Air Jordan 1 Retro High</h4>
<p className="text-label-sm font-label-sm text-secondary">Size: 10.5 US • Black/White</p>
<div className="mt-auto flex justify-between items-center">
<p className="text-label-lg font-label-lg text-primary">$190.00</p>
<p className="text-label-sm font-label-sm text-secondary">Qty: 1</p>
</div>
</div>
</div>
{/* Item 2 */}
<div className="flex gap-stack-md p-2 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<div className="w-24 h-24 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDisPbzAOVAgcnLDhPYajJGdEJ79tIQb55aBxfv01ZiRW3Zq1CcHU-VfPPepwoX6-cLd7DrECfpVHzbaxLYw7SgA78_iJgDQcpZIFFaVkdxjq-HWIZ3V-OldLHXJfmMlrgkskc4x8VyDp4uQpxxJzhDdvksYtKHMmjuOLyeRlefWKkzAoXpvEdFQ7qGslGpZ74jVJNH0V276Qnents5vyzYIeKWoKXxdw7CH1WdIijE194CmurJyF56LUwCO6Id_nrJj1UU7698jl0y" alt="A luxury designer sneaker featuring clean white leather and premium suede accents in light gray. The photo is taken in a minimalist high-key studio setting with bright, uniform lighting that highlights the sophisticated monochromatic palette. The focus is sharp on the intricate stitching and premium materials of the shoe." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
</div>
<div className="flex flex-col justify-center flex-grow py-1">
<h4 className="text-title-lg font-title-lg text-primary leading-tight">Yeezy Boost 350 V2</h4>
<p className="text-label-sm font-label-sm text-secondary">Size: 11 US • Cloud White</p>
<div className="mt-auto flex justify-between items-center">
<p className="text-label-lg font-label-lg text-primary">$220.00</p>
<p className="text-label-sm font-label-sm text-secondary">Qty: 1</p>
</div>
</div>
</div>
</div>
</section>
{/* Order Summary */}
<section className="p-component-padding-x bg-surface-container-lowest rounded-xl border-t border-[#EEEEEE]">
<div className="space-y-stack-sm py-component-padding-y">
<div className="flex justify-between text-body-md font-body-md text-secondary">
<span>Subtotal</span>
<span>$410.00</span>
</div>
<div className="flex justify-between text-body-md font-body-md text-secondary">
<span>Shipping</span>
<span>Free</span>
</div>
<div className="flex justify-between text-body-md font-body-md text-secondary">
<span>Tax</span>
<span>$32.80</span>
</div>
<div className="flex justify-between text-title-lg font-title-lg text-primary pt-stack-sm border-t border-[#EEEEEE]">
<span>Total Amount</span>
<span>$442.80</span>
</div>
</div>
<button className="w-full bg-primary text-on-primary py-4 rounded-full font-label-lg text-label-lg mt-stack-md active:scale-95 transition-transform">
                Download Invoice
            </button>
</section>
</main>
{/* Navigation Drawer (Hidden by default, structure represented) */}
<div className="fixed inset-0 bg-black/40 z-[60] hidden" id="nav-drawer">
<div className="h-full w-80 bg-surface dark:bg-background rounded-r-xl shadow-xl flex flex-col py-8 border-r border-outline-variant">
<div className="px-6 mb-8 flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx1LMbvm5p7UEuDJzOJltpxI8BW8s7MdKu3ogJ3BMuWBuQXZBOHiN9HI-6u1X8pGSMGgV7cG0b9xobWZ_R_J0AIPHWqTKV_OLurfTO7Nwuhb-nPtFv-4K3xYWgV1K2nO07QvngwfCCTQARYWsUqfeFfSIZg5XYvCSO0D2gz8Qt98kG1Bo_3J5rdW_fiRmVnazsNdSNIwmvRtG6Iv2F8wf_HTG3G8O149-bRzgjkcgr_sUyGpCPxWAu-M4lgYHKEB5ItiW2IAFO1Haf" alt="A professional studio portrait of a modern, stylish man in a high-fashion black turtleneck. The lighting is dramatic but soft, using a dark minimalist background to create an aura of exclusivity and luxury. The image reflects a high-end digital lifestyle aesthetic." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
</div>
<div>
<h2 className="text-title-lg font-title-lg text-primary">John Doe</h2>
<p className="text-body-md font-body-md text-secondary">Premium Member</p>
</div>
</div>
<nav className="flex flex-col gap-2">
<div className="text-on-surface-variant hover:bg-surface-container-low transition-colors px-6 py-3 flex items-center gap-4">
<span className="material-symbols-outlined">home</span>
<span className="text-body-md font-body-md">Home</span>
</div>
<div className="bg-secondary-container text-on-secondary-container rounded-lg mx-2 px-4 py-3 flex items-center gap-4 opacity-70">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>shopping_bag</span>
<span className="text-body-md font-body-md">My Orders</span>
</div>
<div className="text-on-surface-variant hover:bg-surface-container-low transition-colors px-6 py-3 flex items-center gap-4">
<span className="material-symbols-outlined">favorite</span>
<span className="text-body-md font-body-md">Wishlist</span>
</div>
<div className="text-on-surface-variant hover:bg-surface-container-low transition-colors px-6 py-3 flex items-center gap-4">
<span className="material-symbols-outlined">settings</span>
<span className="text-body-md font-body-md">Settings</span>
</div>
</nav>
</div>
</div>
{/* Bottom Navigation Bar */}
<nav className="fixed bottom-0 w-full h-[84px] z-50 bg-surface-container-lowest shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<div className="flex items-center justify-center text-secondary hover:text-primary transition-colors">
<span className="material-symbols-outlined">home</span>
</div>
<div className="flex items-center justify-center text-secondary hover:text-primary transition-colors">
<span className="material-symbols-outlined">search</span>
</div>
<div className="flex items-center justify-center text-secondary hover:text-primary transition-colors">
<span className="material-symbols-outlined">favorite</span>
</div>
<div className="flex items-center justify-center text-primary scale-110 duration-200 ease-out">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>person</span>
</div>
</nav>


    </>
  );
}
