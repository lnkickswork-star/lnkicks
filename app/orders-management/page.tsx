import React from 'react';

export default function OrdersManagementPage() {
  return (
    <>

{/* TopAppBar */}
<header className="bg-surface dark:bg-background docked full-width top-0 z-40">
<div className="flex justify-between items-center w-full px-6 py-4">
<button className="hover:opacity-80 transition-opacity active:scale 0.95 transition-transform">
<span className="material-symbols-outlined text-primary dark:text-on-background">menu</span>
</button>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</h1>
<button className="hover:opacity-80 transition-opacity active:scale 0.95 transition-transform">
<span className="material-symbols-outlined text-primary dark:text-on-background">notifications</span>
</button>
</div>
</header>
<main className="flex-grow px-container-margin pb-32">
{/* Screen Header & Filters */}
<section className="mt-stack-lg">
<div className="flex flex-col gap-stack-md">
<h2 className="text-headline-md font-headline-md text-on-surface">Order Management</h2>
{/* Search Bar */}
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-4 text-on-surface-variant">search</span>
<input className="w-full bg-[#F5F5F5] rounded-xl py-3 pl-12 pr-4 border-none text-body-md focus:ring-1 focus:ring-primary" placeholder="Search orders..." type="text" />
</div>
{/* Filter Chips */}
<div className="flex gap-stack-sm overflow-x-auto pb-2 no-scrollbar">
<div className="bg-primary text-on-primary px-4 py-2 rounded-full whitespace-nowrap text-label-lg font-label-lg cursor-pointer">All Orders</div>
<div className="bg-[#F5F5F5] text-on-surface px-4 py-2 rounded-full whitespace-nowrap text-label-lg font-label-lg cursor-pointer hover:bg-surface-container-high transition-colors">Processing</div>
<div className="bg-[#F5F5F5] text-on-surface px-4 py-2 rounded-full whitespace-nowrap text-label-lg font-label-lg cursor-pointer hover:bg-surface-container-high transition-colors">Shipped</div>
<div className="bg-[#F5F5F5] text-on-surface px-4 py-2 rounded-full whitespace-nowrap text-label-lg font-label-lg cursor-pointer hover:bg-surface-container-high transition-colors">Delivered</div>
</div>
</div>
</section>
{/* Stats Overview (Asymmetric/Bento Style Lite) */}
<section className="mt-section-gap grid grid-cols-2 gap-gutter">
<div className="bg-surface-container-lowest p-component-padding-y rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE]">
<p className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Today&apos;s Revenue</p>
<p className="text-headline-md font-headline-md mt-1">$4,280</p>
</div>
<div className="bg-surface-container-lowest p-component-padding-y rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE]">
<p className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Active Orders</p>
<p className="text-headline-md font-headline-md mt-1">24</p>
</div>
</section>
{/* Orders List */}
<section className="mt-section-gap space-y-gutter">
<div className="flex justify-between items-center">
<h3 className="text-title-lg font-title-lg">Recent Orders</h3>
<span className="text-label-lg font-label-lg text-secondary cursor-pointer">Export CSV</span>
</div>
{/* Order Item 1 */}
<div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex flex-col gap-stack-sm">
<div className="flex justify-between items-start">
<div>
<p className="text-label-sm font-label-sm text-secondary">#ORD-28491</p>
<p className="text-title-lg font-title-lg mt-1">Marcus Thorne</p>
</div>
<span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm uppercase">Processing</span>
</div>
<div className="flex justify-between items-end mt-2">
<div className="flex flex-col">
<p className="text-body-md text-on-surface-variant">Oct 24, 2023</p>
<p className="text-label-sm font-label-sm text-secondary">2 Items</p>
</div>
<p className="text-headline-md font-headline-md">$890.00</p>
</div>
</div>
{/* Order Item 2 */}
<div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex flex-col gap-stack-sm">
<div className="flex justify-between items-start">
<div>
<p className="text-label-sm font-label-sm text-secondary">#ORD-28488</p>
<p className="text-title-lg font-title-lg mt-1">Elena Rodriguez</p>
</div>
<span className="bg-primary text-on-primary px-3 py-1 rounded-full text-label-sm font-label-sm uppercase">Shipped</span>
</div>
<div className="flex justify-between items-end mt-2">
<div className="flex flex-col">
<p className="text-body-md text-on-surface-variant">Oct 23, 2023</p>
<p className="text-label-sm font-label-sm text-secondary">1 Item</p>
</div>
<p className="text-headline-md font-headline-md">$1,250.00</p>
</div>
</div>
{/* Order Item 3 */}
<div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex flex-col gap-stack-sm">
<div className="flex justify-between items-start">
<div>
<p className="text-label-sm font-label-sm text-secondary">#ORD-28485</p>
<p className="text-title-lg font-title-lg mt-1">James Henderson</p>
</div>
<span className="bg-surface-container-high text-secondary px-3 py-1 rounded-full text-label-sm font-label-sm uppercase">Delivered</span>
</div>
<div className="flex justify-between items-end mt-2">
<div className="flex flex-col">
<p className="text-body-md text-on-surface-variant">Oct 23, 2023</p>
<p className="text-label-sm font-label-sm text-secondary">4 Items</p>
</div>
<p className="text-headline-md font-headline-md">$340.00</p>
</div>
</div>
{/* Order Item 4 */}
<div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] flex flex-col gap-stack-sm opacity-60">
<div className="flex justify-between items-start">
<div>
<p className="text-label-sm font-label-sm text-secondary">#ORD-28482</p>
<p className="text-title-lg font-title-lg mt-1">Sophia Chen</p>
</div>
<span className="bg-surface-container-high text-secondary px-3 py-1 rounded-full text-label-sm font-label-sm uppercase">Delivered</span>
</div>
<div className="flex justify-between items-end mt-2">
<div className="flex flex-col">
<p className="text-body-md text-on-surface-variant">Oct 22, 2023</p>
<p className="text-label-sm font-label-sm text-secondary">1 Item</p>
</div>
<p className="text-headline-md font-headline-md">$560.00</p>
</div>
</div>
</section>
</main>
{/* BottomNavBar */}
<nav className="bg-surface-container-lowest dark:bg-surface-container-low fixed bottom-0 w-full h-[84px] z-50 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<button className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">home</span>
</button>
<button className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">search</span>
</button>
<button className="flex items-center justify-center text-primary dark:text-on-background scale-110">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>favorite</span>
</button>
<button className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">person</span>
</button>
</nav>

    </>
  );
}
