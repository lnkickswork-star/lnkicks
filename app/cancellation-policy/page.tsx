import React from 'react';
import Image from 'next/image';

export default function CancellationPolicyPage() {
  return (
    <>

<main className="w-[390px] h-[844px] bg-background relative flex flex-col overflow-hidden shadow-2xl">
{/* TopAppBar */}
<header className="docked full-width top-0 bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4 z-10">
<div className="flex items-center gap-4">
<button className="hover:opacity-80 transition-opacity active:scale-95">
<span className="material-symbols-outlined text-primary dark:text-on-background">arrow_back</span>
</button>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">Cancellation Policy</h1>
</div>
<button className="hover:opacity-80 transition-opacity">
<span className="material-symbols-outlined text-primary dark:text-on-background">help_outline</span>
</button>
</header>
<div className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
{/* Hero/Status Section */}
<section className="mb-section-gap">
<div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
<div className="flex items-center gap-4 mb-4">
<div className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined">timer</span>
</div>
<div>
<p className="text-label-lg font-label-lg text-primary uppercase tracking-widest">Window</p>
<h2 className="text-headline-md font-headline-md">30-Minute Grace Period</h2>
</div>
</div>
<p className="text-body-md font-body-md text-secondary leading-relaxed">
            Orders can be cancelled instantly within the first 30 minutes of purchase through your account dashboard without any penalties.
          </p>
</div>
</section>
{/* Guidelines Grid */}
<section className="mb-section-gap">
<h3 className="text-title-lg font-title-lg mb-stack-md">Cancellation Guidelines</h3>
<div className="space-y-gutter">
{/* Guideline 1 */}
<div className="flex gap-stack-md group">
<div className="mt-1">
<span className="material-symbols-outlined text-primary">check_circle</span>
</div>
<div>
<h4 className="text-label-lg font-label-lg text-on-background mb-1">Pre-Shipment</h4>
<p className="text-body-md font-body-md text-secondary">If your order has not been picked up by the courier (usually within 2-4 hours), cancellation may still be possible via customer support.</p>
</div>
</div>
{/* Guideline 2 */}
<div className="flex gap-stack-md group">
<div className="mt-1">
<span className="material-symbols-outlined text-primary">cancel</span>
</div>
<div>
<h4 className="text-label-lg font-label-lg text-on-background mb-1">Post-Shipment</h4>
<p className="text-body-md font-body-md text-secondary">Once an order has been marked as &apos;Shipped&apos;, it cannot be cancelled. You must wait for delivery and initiate a return.</p>
</div>
</div>
{/* Guideline 3 */}
<div className="flex gap-stack-md group">
<div className="mt-1">
<span className="material-symbols-outlined text-primary">payments</span>
</div>
<div>
<h4 className="text-label-lg font-label-lg text-on-background mb-1">Refund Processing</h4>
<p className="text-body-md font-body-md text-secondary">Refunds are initiated immediately upon cancellation. Credits typically appear on your statement within 3-5 business days.</p>
</div>
</div>
</div>
</section>
{/* Visual Process Step */}
<section className="mb-section-gap">
<div className="relative w-full h-48 rounded-xl overflow-hidden mb-stack-md">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0p0HrD1vx7pIEfksfUTrXpTMVjAf2QktraVtvjWrTbrOnTVZ5KifHU_J1B8jvBA3LsrGhsU1VPCMk9R1CZyB9DKGX8ypHEjolqaRzOUClJLY6XLonF_W9bLYniwwXBAdSe3PxYFYUm9CcMMoKzmJ4g_hz_aAuL23Oh8KVr8iQVUz7pY5Rz-vmFv823KWHRCaZoy9zSiyzXArrCzpnhJjY967FWNbFaAiCY09e5HZa3Yb0jGVsj-tSdC4RCzjgumWSY7ERbvvZjkdQ" alt="Secure digital payment processing" width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
<p className="text-on-primary text-title-lg font-title-lg">Fast, Automated Refunds</p>
</div>
</div>
</section>
{/* Action Section */}
<section className="mb-stack-lg">
<h3 className="text-title-lg font-title-lg mb-stack-md">How to request</h3>
<div className="bg-surface-container p-5 rounded-xl border border-outline-variant space-y-4">
<div className="flex items-center justify-between">
<span className="text-body-md font-body-md">1. Go to &quot;My Orders&quot;</span>
<span className="material-symbols-outlined text-secondary text-sm">arrow_forward_ios</span>
</div>
<hr className="border-outline-variant" />
<div className="flex items-center justify-between">
<span className="text-body-md font-body-md">2. Select the specific order</span>
<span className="material-symbols-outlined text-secondary text-sm">arrow_forward_ios</span>
</div>
<hr className="border-outline-variant" />
<div className="flex items-center justify-between">
<span className="text-body-md font-body-md">3. Tap &quot;Cancel Order&quot; button</span>
<span className="material-symbols-outlined text-secondary text-sm">arrow_forward_ios</span>
</div>
</div>
</section>
{/* Primary Action */}
<div className="mt-4">
<button className="w-full bg-primary text-on-primary py-[18px] rounded-full text-label-lg font-label-lg uppercase tracking-widest hover:opacity-90 transition-all active:scale-95">
          View My Recent Orders
        </button>
</div>
</div>
{/* BottomNavBar */}
<nav className="fixed bottom-0 w-full h-[84px] z-50 bg-surface-container-lowest dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<div className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">home</span>
</div>
<div className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">search</span>
</div>
<div className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">favorite</span>
</div>
{/* Profile Active for My Orders context */}
<div className="flex items-center justify-center text-primary dark:text-on-background scale-110">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>person</span>
</div>
</nav>
</main>

    </>
  );
}
