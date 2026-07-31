import React from 'react';

export default function NotificationSettingsPage() {
  return (
    <>

{/* Mobile Frame (390x844) */}
<main className="w-[390px] h-[844px] bg-background relative overflow-hidden shadow-2xl flex flex-col">
{/* TopAppBar (From JSON) */}
<header className="docked full-width top-0 bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4 z-50">
<button className="text-primary dark:text-on-background hover:opacity-80 transition-opacity active:scale-0.95 transition-transform">
<span className="material-symbols-outlined">arrow_back</span>
</button>
<h1 className="text-label-lg font-label-lg text-primary dark:text-on-background">Notification Settings</h1>
<button className="text-primary dark:text-on-background hover:opacity-80 transition-opacity active:scale-0.95 transition-transform">
<span className="material-symbols-outlined">notifications</span>
</button>
</header>
{/* Content Canvas */}
<div className="flex-1 overflow-y-auto px-container-margin py-stack-lg">
{/* Header Section */}
<div className="mb-section-gap">
<h2 className="text-display-lg-mobile font-display-lg-mobile text-on-background tracking-tighter">Preferences</h2>
<p className="text-body-md font-body-md text-secondary mt-1">Manage how you stay updated with LNKICKS.</p>
</div>
{/* Settings List */}
<div className="space-y-gutter">
{/* Group 1: Account Activities */}
<div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<h3 className="text-label-sm font-label-sm text-secondary uppercase tracking-widest mb-4">Transactionals</h3>
<div className="space-y-stack-lg">
{/* Row: Order Updates */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
</div>
<div>
<p className="text-title-lg font-title-lg text-on-background">Order Updates</p>
<p className="text-label-sm font-label-sm text-secondary">Tracking, delivery, and returns</p>
</div>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
{/* Row: Account Alerts */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[20px]">security</span>
</div>
<div>
<p className="text-title-lg font-title-lg text-on-background">Account Alerts</p>
<p className="text-label-sm font-label-sm text-secondary">Security and privacy notifications</p>
</div>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>
{/* Group 2: Marketing & Drops */}
<div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<h3 className="text-label-sm font-label-sm text-secondary uppercase tracking-widest mb-4">Discovery</h3>
<div className="space-y-stack-lg">
{/* Row: New Drops */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[20px]">flare</span>
</div>
<div>
<p className="text-title-lg font-title-lg text-on-background">New Drops</p>
<p className="text-label-sm font-label-sm text-secondary">Limited edition releases</p>
</div>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
{/* Row: Promotions */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[20px]">sell</span>
</div>
<div>
<p className="text-title-lg font-title-lg text-on-background">Promotions</p>
<p className="text-label-sm font-label-sm text-secondary">Personalized offers and sales</p>
</div>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>
{/* Footer CTA */}
<div className="mt-8 space-y-4">
<button className="w-full bg-primary text-on-primary py-[18px] rounded-full font-bold text-label-lg hover:opacity-90 active:scale-95 transition-all">
                        Save Preferences
                    </button>
<button className="w-full bg-transparent border border-outline text-primary py-[18px] rounded-full font-bold text-label-lg hover:bg-surface-container active:scale-95 transition-all">
                        Disable All
                    </button>
</div>
</div>
{/* Asymmetric Accent Card */}
<div className="mt-section-gap relative rounded-2xl overflow-hidden h-32 flex items-center p-6 bg-primary">
<div className="relative z-10 w-2/3">
<p className="text-on-primary font-title-lg text-title-lg leading-tight">Need help with your account?</p>
<p className="text-on-primary-container text-label-sm mt-1">Contact Support 24/7</p>
</div>
<div className="absolute right-[-20px] top-[-20px] w-32 h-32 opacity-20">
<span className="material-symbols-outlined text-[120px] text-on-primary">support_agent</span>
</div>
</div>
</div>
{/* BottomNavBar (From JSON) */}
<nav className="fixed bottom-0 w-full h-[84px] z-50 bg-surface-container-lowest dark:bg-surface-container-low shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<button className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors">
<span className="material-symbols-outlined">home</span>
</button>
<button className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors">
<span className="material-symbols-outlined">search</span>
</button>
<button className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors">
<span className="material-symbols-outlined">favorite</span>
</button>
<button className="flex items-center justify-center text-primary dark:text-on-background scale-110">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>person</span>
</button>
</nav>
</main>


    </>
  );
}
