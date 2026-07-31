import React from 'react';
import Image from 'next/image';

export default function ReportsAnalyticsPage() {
  return (
    <>

{/* Mobile Container (390x844) */}
<div className="w-[390px] h-[844px] bg-surface relative overflow-hidden flex flex-col shadow-2xl">
{/* TopAppBar Component */}
<header className="bg-surface dark:bg-background docked full-width top-0 z-50">
<div className="flex justify-between items-center w-full px-6 py-4">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary dark:text-on-background cursor-pointer" data-icon="menu">menu</span>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</h1>
</div>
<div className="flex items-center">
<span className="material-symbols-outlined text-primary dark:text-on-background cursor-pointer" data-icon="notifications">notifications</span>
</div>
</div>
</header>
{/* Content Canvas */}
<main className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-24">
{/* Screen Title & Filter Section */}
<section className="mt-stack-lg flex flex-col gap-stack-sm">
<h2 className="text-headline-lg font-headline-lg text-primary">Analytics</h2>
<div className="flex items-center justify-between">
<span className="text-label-lg font-label-lg text-secondary">Overview • Aug 2024</span>
<div className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity">
<span className="text-label-sm font-label-sm text-primary">This Month</span>
<span className="material-symbols-outlined text-[16px]" data-icon="expand_more">expand_more</span>
</div>
</div>
</section>
{/* KPI Grid (Bento Style) */}
<section className="mt-stack-lg grid grid-cols-2 gap-gutter">
{/* Revenue Card */}
<div className="col-span-2 bg-surface-container-lowest p-component-padding-y px-component-padding-x rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
<div className="flex items-center justify-between mb-2">
<span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Total Revenue</span>
<span className="text-label-sm font-label-sm text-primary bg-surface-container px-2 py-0.5 rounded-full">+12.4%</span>
</div>
<div className="text-display-lg-mobile font-display-lg-mobile text-primary">$142,850.00</div>
{/* Line Chart Placeholder (Monochrome) */}
<div className="mt-4 h-20 w-full relative flex items-end gap-1">
<div className="w-full h-[2px] bg-surface-container absolute bottom-0"></div>
<div className="flex-1 bg-primary h-[30%] opacity-20 rounded-t-sm"></div>
<div className="flex-1 bg-primary h-[45%] opacity-30 rounded-t-sm"></div>
<div className="flex-1 bg-primary h-[40%] opacity-40 rounded-t-sm"></div>
<div className="flex-1 bg-primary h-[60%] opacity-50 rounded-t-sm"></div>
<div className="flex-1 bg-primary h-[55%] opacity-60 rounded-t-sm"></div>
<div className="flex-1 bg-primary h-[85%] opacity-80 rounded-t-sm"></div>
<div className="flex-1 bg-primary h-[100%] rounded-t-sm"></div>
</div>
</div>
{/* Orders Card */}
<div className="bg-surface-container-lowest p-component-padding-y px-component-padding-x rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
<span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Orders</span>
<div className="text-headline-lg font-headline-lg text-primary mt-1">1,248</div>
<div className="flex items-center gap-1 text-label-sm text-primary mt-2">
<span className="material-symbols-outlined text-[14px]" data-icon="trending_up">trending_up</span>
<span>8%</span>
</div>
</div>
{/* Avg Value Card */}
<div className="bg-surface-container-lowest p-component-padding-y px-component-padding-x rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
<span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Avg. Order</span>
<div className="text-headline-lg font-headline-lg text-primary mt-1">$114.40</div>
<div className="flex items-center gap-1 text-label-sm text-secondary mt-2">
<span className="material-symbols-outlined text-[14px]" data-icon="horizontal_rule">horizontal_rule</span>
<span>0%</span>
</div>
</div>
</section>
{/* Popular Products (Asymmetric List) */}
<section className="mt-section-gap">
<div className="flex items-center justify-between mb-stack-md">
<h3 className="text-title-lg font-title-lg text-primary">Popular Products</h3>
<span className="text-label-sm font-label-sm text-secondary hover:text-primary cursor-pointer">View All</span>
</div>
<div className="flex flex-col gap-stack-md">
{/* Product Item 1 */}
<div className="flex items-center gap-stack-md bg-surface-container-lowest p-3 rounded-xl border border-surface-container transition-transform active:scale-95">
<div className="w-16 h-16 bg-surface-container rounded-lg flex-shrink-0 overflow-hidden">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2RdEqvryRYx4x0uOlKqbCrfG7wkMWYToQJrSQSScv1px8owSBsc5aKczZb6HwzAniNfpjfjCkYD9S0jj5gi0YvusrjZJ_CL-R_FwdbR_X2floNgnhDeLRa7TCTMCvhapRjeetGxevkNfj0fj6JAauPNAyLKNv-NbME8LHIqmDYjVwwThtW8TAvYKmZVxvtCq-hSaddJSqWSTxzgMYlitcczlXuX0_rykuta5vsA2Mash2QWyHUXebavS_wOLDMpXjBC8mX14qbgHH" alt="Nike" width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
</div>
<div className="flex-1">
<div className="text-label-lg font-label-lg text-primary">Air Jordan 1 Retro</div>
<div className="text-label-sm font-label-sm text-secondary">428 Sold • $24,500 Rev</div>
</div>
<div className="text-right">
<span className="material-symbols-outlined text-primary" data-icon="chevron_right">chevron_right</span>
</div>
</div>
{/* Product Item 2 */}
<div className="flex items-center gap-stack-md bg-surface-container-lowest p-3 rounded-xl border border-surface-container transition-transform active:scale-95">
<div className="w-16 h-16 bg-surface-container rounded-lg flex-shrink-0 overflow-hidden">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRcVGKUXOhGIyufE3XtOSYFT5hfuOB34Fkk9X3LkVY94Sr7lPG6xptTpQb--ILIbbNtBW7v2lw5p_JD9gFEoESVGREGxMK0qJHR5vTz0W33wEeCfjE8aCTjFVkuAqxAaRRLdnSNcapWIu9BxsgmvJrVav7ezWgSbgOpu_MoeZqW5JdpGq2MgHxg3mvqgbPAnT69vvyuI6u_qkgziVS8WVogacxxnrlPqtb51T-1a3SohI2cmXQXYq4I0PxMPYTBfInmIAfJHC3ov6s" alt="Adidas" width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
</div>
<div className="flex-1">
<div className="text-label-lg font-label-lg text-primary">Yeezy Boost 350</div>
<div className="text-label-sm font-label-sm text-secondary">382 Sold • $18,900 Rev</div>
</div>
<div className="text-right">
<span className="material-symbols-outlined text-primary" data-icon="chevron_right">chevron_right</span>
</div>
</div>
</div>
</section>
{/* Sales Trends (Complex Chart Mockup) */}
<section className="mt-section-gap">
<h3 className="text-title-lg font-title-lg text-primary mb-stack-md">Sales Trends</h3>
<div className="bg-surface-container-lowest p-component-padding-y px-component-padding-x rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] border border-surface-container h-48 flex flex-col justify-between">
<div className="flex items-center justify-between text-label-sm font-label-sm text-secondary">
<span>Peak: 14th Aug</span>
<span>$4,200/day</span>
</div>
{/* SVG Trend Line Mockup */}
<div className="flex-1 flex items-center justify-center">
<svg className="w-full h-24 stroke-primary fill-none stroke-[2] opacity-80" viewBox="0 0 300 80">
<path d="M0,60 Q30,55 50,40 T100,30 T150,50 T200,10 T250,35 T300,5" strokeLinecap="round"></path>
<path className="fill-primary opacity-5" d="M0,60 Q30,55 50,40 T100,30 T150,50 T200,10 T250,35 T300,5 V80 H0 Z"></path>
</svg>
</div>
<div className="flex justify-between text-label-sm font-label-sm text-secondary mt-2">
<span>01 Aug</span>
<span>08 Aug</span>
<span>15 Aug</span>
<span>22 Aug</span>
<span>31 Aug</span>
</div>
</div>
</section>
{/* Demographics Section */}
<section className="mt-section-gap">
<h3 className="text-title-lg font-title-lg text-primary mb-stack-md">Customer Profile</h3>
<div className="flex gap-gutter">
{/* Radial Chart Placeholder */}
<div className="flex-1 bg-surface-container-lowest p-component-padding-y rounded-xl border border-surface-container flex flex-col items-center">
<div className="relative w-16 h-16 flex items-center justify-center">
<div className="absolute inset-0 border-[6px] border-surface-container rounded-full"></div>
<div className="absolute inset-0 border-[6px] border-primary border-r-transparent border-b-transparent rounded-full transform -rotate-45"></div>
<span className="text-label-sm font-label-sm text-primary">68%</span>
</div>
<span className="text-label-sm font-label-sm text-secondary mt-3">Male</span>
</div>
{/* Radial Chart Placeholder 2 */}
<div className="flex-1 bg-surface-container-lowest p-component-padding-y rounded-xl border border-surface-container flex flex-col items-center">
<div className="relative w-16 h-16 flex items-center justify-center">
<div className="absolute inset-0 border-[6px] border-surface-container rounded-full"></div>
<div className="absolute inset-0 border-[6px] border-primary border-l-transparent border-t-transparent rounded-full transform rotate-12"></div>
<span className="text-label-sm font-label-sm text-primary">32%</span>
</div>
<span className="text-label-sm font-label-sm text-secondary mt-3">Female</span>
</div>
</div>
</section>
</main>
{/* BottomNavBar Component */}
<nav className="bg-surface-container-lowest dark:bg-surface-container-low fixed bottom-0 w-full h-[84px] z-50 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)]">
<div className="flex justify-around items-center px-10 pb-8 h-full">
<div className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors cursor-pointer">
<span className="material-symbols-outlined" data-icon="home">home</span>
</div>
<div className="flex items-center justify-center text-primary dark:text-on-background scale-110 cursor-pointer">
<span className="material-symbols-outlined" data-icon="search" style={{ fontVariationSettings: '\'FILL\' 1' }}>search</span>
</div>
<div className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors cursor-pointer">
<span className="material-symbols-outlined" data-icon="favorite">favorite</span>
</div>
<div className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors cursor-pointer">
<span className="material-symbols-outlined" data-icon="person">person</span>
</div>
</div>
</nav>
</div>

    </>
  );
}
