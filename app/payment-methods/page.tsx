import React from 'react';

export default function PaymentMethodsPage() {
  return (
    <>

{/* TopAppBar */}
<header className="bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50">
<div className="flex items-center gap-4">
<button className="hover:opacity-80 transition-opacity active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary dark:text-on-background">arrow_back</span>
</button>
<span className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</span>
</div>
<button className="hover:opacity-80 transition-opacity active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary dark:text-on-background">notifications</span>
</button>
</header>
<main className="w-[390px] px-container-margin pb-32">
{/* Screen Title */}
<section className="mt-stack-lg mb-section-gap">
<h1 className="text-headline-lg-mobile font-headline-lg-mobile text-primary">Payment Methods</h1>
<p className="text-body-md font-body-md text-secondary mt-1">Manage your secure payment options</p>
</section>
{/* Saved Cards Section */}
<section className="space-y-stack-md mb-section-gap">
<h2 className="text-label-lg font-label-lg text-secondary uppercase tracking-widest">Saved Cards</h2>
{/* Card 1: Premium Mastercard */}
<div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col justify-between h-48 relative overflow-hidden">
<div className="absolute top-0 right-0 p-4 opacity-10">
<span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: '\'FILL\' 1' }}>credit_card</span>
</div>
<div className="flex justify-between items-start z-10">
<div className="w-12 h-8 rounded-md flex items-center justify-center bg-primary">
<span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: '\'FILL\' 1' }}>contactless</span>
</div>
<span className="material-symbols-outlined text-primary">more_horiz</span>
</div>
<div className="z-10">
<p className="text-label-sm font-label-sm text-secondary mb-1">Platinum Member Card</p>
<p className="text-title-lg font-title-lg tracking-[0.2em] text-primary">•••• •••• •••• 8888</p>
</div>
<div className="flex justify-between items-end z-10">
<div className="flex flex-col">
<span className="text-[10px] font-bold text-secondary uppercase">Expiry</span>
<span className="text-label-lg font-label-lg text-primary">12/26</span>
</div>
<div className="flex items-center gap-1">
<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: '\'FILL\' 1' }}>stars</span>
</div>
<span className="text-label-sm font-label-sm font-bold text-primary">Mastercard</span>
</div>
</div>
</div>
{/* Card 2: Visa */}
<div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col justify-between h-48 relative overflow-hidden">
<div className="absolute top-0 right-0 p-4 opacity-5">
<span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: '\'FILL\' 1' }}>account_balance_wallet</span>
</div>
<div className="flex justify-between items-start z-10">
<div className="w-12 h-8 rounded-md flex items-center justify-center bg-surface-container-high">
<span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: '\'FILL\' 1' }}>contactless</span>
</div>
<span className="material-symbols-outlined text-primary">more_horiz</span>
</div>
<div className="z-10">
<p className="text-label-sm font-label-sm text-secondary mb-1">Everyday Spend</p>
<p className="text-title-lg font-title-lg tracking-[0.2em] text-primary">•••• •••• •••• 4242</p>
</div>
<div className="flex justify-between items-end z-10">
<div className="flex flex-col">
<span className="text-[10px] font-bold text-secondary uppercase">Expiry</span>
<span className="text-label-lg font-label-lg text-primary">09/25</span>
</div>
<span className="text-label-sm font-label-sm font-bold text-primary">VISA</span>
</div>
</div>
</section>
{/* Digital Wallets Section */}
<section className="space-y-stack-md mb-section-gap">
<h2 className="text-label-lg font-label-lg text-secondary uppercase tracking-widest">Digital Wallets</h2>
<div className="space-y-3">
{/* Apple Pay */}
<div className="bg-surface-container-lowest flex items-center justify-between p-4 rounded-xl border border-surface-container shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: '\'FILL\' 1' }}>ios</span>
</div>
<div>
<p className="text-title-lg font-title-lg text-primary">Apple Pay</p>
<p className="text-body-md font-body-md text-secondary">Default Wallet</p>
</div>
</div>
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
</div>
{/* Google Pay */}
<div className="bg-surface-container-lowest flex items-center justify-between p-4 rounded-xl border border-surface-container shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-primary">google</span>
</div>
<div>
<p className="text-title-lg font-title-lg text-primary">Google Pay</p>
<p className="text-body-md font-body-md text-secondary">Linked via john.doe@gmail.com</p>
</div>
</div>
<span className="material-symbols-outlined text-secondary">radio_button_unchecked</span>
</div>
</div>
</section>
{/* Add New Method */}
<section className="pb-10">
<button className="w-full py-[18px] bg-primary text-on-primary rounded-full font-label-lg text-label-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0px_10px_30px_rgba(0,0,0,0.08)] active:scale-95">
<span className="material-symbols-outlined">add</span>
                Add New Method
            </button>
</section>
</main>
{/* BottomNavBar (Suppressed as per navigation shell mandate for task-focused journey) */}
{/* But if required by strict context, we can add it. Here we prioritize the clean layout. */}


    </>
  );
}
