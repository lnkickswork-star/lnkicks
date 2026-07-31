import React from 'react';

export default function SettingsPanelPage() {
  return (
    <>

{/* TopAppBar */}
<header className="bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary dark:text-on-background hover:opacity-80 transition-opacity active:scale-95 transition-transform" data-icon="menu">menu</span>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</h1>
</div>
<div className="flex items-center">
<span className="material-symbols-outlined text-primary dark:text-on-background hover:opacity-80 transition-opacity active:scale-95 transition-transform" data-icon="notifications">notifications</span>
</div>
</header>
<main className="pt-20 pb-28 px-6 max-w-[390px] mx-auto overflow-y-auto h-screen">
{/* Page Title */}
<div className="mb-stack-lg">
<h2 className="text-headline-lg font-headline-lg">Admin Settings</h2>
<p className="text-body-md text-secondary mt-2">Manage your marketplace operations and global configurations.</p>
</div>
{/* Settings Sections */}
<div className="flex flex-col gap-section-gap">
{/* General Settings */}
<section>
<div className="flex items-center gap-2 mb-stack-md">
<span className="material-symbols-outlined text-primary" data-icon="settings">settings</span>
<h3 className="text-title-lg font-title-lg">General Settings</h3>
</div>
<div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] space-y-stack-md">
<div className="space-y-2">
<label className="text-label-lg font-label-lg px-1">Marketplace Name</label>
<input className="w-full bg-[#F5F5F5] border-none rounded-xl px-4 py-[14px] text-body-md focus:ring-1 focus:ring-primary" type="text" value="LNKICKS Luxury Boutique" />
</div>
<div className="flex items-center justify-between py-2">
<div>
<p className="text-body-lg font-semibold">Maintenance Mode</p>
<p className="text-label-sm text-secondary">Disable front-end access</p>
</div>
<button className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-container-highest transition-colors">
<span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
</button>
</div>
<div className="flex items-center justify-between py-2">
<div>
<p className="text-body-lg font-semibold">Automatic SEO</p>
<p className="text-label-sm text-secondary">Generate meta tags automatically</p>
</div>
<button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
<span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
</button>
</div>
</div>
</section>
{/* Payment Gateway Integration */}
<section>
<div className="flex items-center gap-2 mb-stack-md">
<span className="material-symbols-outlined text-primary" data-icon="payments">payments</span>
<h3 className="text-title-lg font-title-lg">Payment Gateway</h3>
</div>
<div className="flex flex-col gap-stack-md">
{/* Stripe Card */}
<div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-lg bg-[#6772E5] flex items-center justify-center">
<span className="material-symbols-outlined text-white" data-icon="credit_card">credit_card</span>
</div>
<div>
<p className="text-body-lg font-semibold">Stripe</p>
<p className="text-label-sm text-secondary">Connected • 0.5% fee</p>
</div>
</div>
<span className="material-symbols-outlined text-primary" data-icon="check_circle" style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
</div>
{/* PayPal Card */}
<div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
<span className="material-symbols-outlined text-secondary" data-icon="account_balance_wallet">account_balance_wallet</span>
</div>
<div>
<p className="text-body-lg font-semibold">PayPal</p>
<p className="text-label-sm text-secondary">Not configured</p>
</div>
</div>
<button className="text-label-lg font-label-lg text-primary border-b border-primary">Setup</button>
</div>
</div>
</section>
{/* Shipping Configuration */}
<section>
<div className="flex items-center gap-2 mb-stack-md">
<span className="material-symbols-outlined text-primary" data-icon="local_shipping">local_shipping</span>
<h3 className="text-title-lg font-title-lg">Shipping Configuration</h3>
</div>
<div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] space-y-stack-md">
<div className="space-y-2">
<label className="text-label-lg font-label-lg px-1">Global Shipping Flat Rate ($)</label>
<input className="w-full bg-[#F5F5F5] border-none rounded-xl px-4 py-[14px] text-body-md" placeholder="25.00" type="number" />
</div>
<div className="flex items-center justify-between pt-2 border-t border-[#EEEEEE]">
<p className="text-body-md">DHL Express Integration</p>
<button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
<span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
</button>
</div>
<div className="flex items-center justify-between">
<p className="text-body-md">FedEx Overnight</p>
<button className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-container-highest transition-colors">
<span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
</button>
</div>
</div>
</section>
{/* User Roles */}
<section>
<div className="flex items-center gap-2 mb-stack-md">
<span className="material-symbols-outlined text-primary" data-icon="badge">badge</span>
<h3 className="text-title-lg font-title-lg">User Roles &amp; Permissions</h3>
</div>
<div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE]">
<div className="flex items-center justify-between p-stack-md border-b border-[#EEEEEE] hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">ADM</div>
<div>
<p className="text-body-md font-semibold">Super Administrator</p>
<p className="text-label-sm text-secondary">Full System Access</p>
</div>
</div>
<span className="material-symbols-outlined text-secondary" data-icon="chevron_right">chevron_right</span>
</div>
<div className="flex items-center justify-between p-stack-md border-b border-[#EEEEEE] hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary text-[10px] font-bold">MOD</div>
<div>
<p className="text-body-md font-semibold">Content Moderator</p>
<p className="text-label-sm text-secondary">Manage Listings &amp; Users</p>
</div>
</div>
<span className="material-symbols-outlined text-secondary" data-icon="chevron_right">chevron_right</span>
</div>
<div className="flex items-center justify-center p-stack-md">
<button className="text-label-lg font-label-lg text-primary flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                            Create New Role
                        </button>
</div>
</div>
</section>
<div className="pb-10">
<button className="w-full bg-primary text-on-primary py-[18px] rounded-full font-bold text-body-lg shadow-[0px_10px_30px_rgba(0,0,0,0.08)] active:scale-95 transition-transform">
                    Save Changes
                </button>
</div>
</div>
</main>
{/* BottomNavBar */}
<nav className="bg-surface-container-lowest dark:bg-surface-container-low fixed bottom-0 w-full h-[84px] z-50 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<a className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="home">home</span>
</a>
<a className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="search">search</span>
</a>
<a className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="favorite">favorite</span>
</a>
<a className="flex items-center justify-center text-primary dark:text-on-background scale-110" href="#">
<span className="material-symbols-outlined" data-icon="person" style={{ fontVariationSettings: '\'FILL\' 1' }}>person</span>
</a>
</nav>

    </>
  );
}
