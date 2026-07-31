import React from 'react';
import Image from 'next/image';

export default function CustomersManagementPage() {
  return (
    <>

{/* Top App Bar */}
<header className="bg-surface dock full-width top-0 z-50 flex justify-between items-center w-full px-6 py-4 max-w-[390px]">
<div className="flex items-center gap-4">
<button className="text-primary hover:opacity-80 transition-opacity active:scale 0.95 duration-200">
<span className="material-symbols-outlined">menu</span>
</button>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary">LNKICKS</h1>
</div>
<div className="flex items-center gap-4">
<button className="text-primary hover:opacity-80 transition-opacity active:scale 0.95 duration-200">
<span className="material-symbols-outlined">notifications</span>
</button>
</div>
</header>
{/* Main Content Canvas */}
<main className="flex-1 w-full max-w-[390px] px-container-margin pb-32">
{/* Header Section */}
<section className="mt-stack-lg mb-stack-md">
<h2 className="text-display-lg-mobile font-display-lg-mobile text-primary tracking-tight">Customers</h2>
<p className="text-body-md font-body-md text-secondary mt-1">Manage your boutique&apos;s clientele</p>
</section>
{/* Search & Filter Area */}
<section className="mb-stack-lg">
<div className="relative flex items-center bg-surface-container-low rounded-xl px-4 py-3">
<span className="material-symbols-outlined text-secondary mr-3">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-md font-body-md w-full placeholder:text-outline" placeholder="Search by name or email..." type="text" />
</div>
</section>
{/* Stats Overview (Asymmetric Layout) */}
<section className="grid grid-cols-2 gap-gutter mb-section-gap">
<div className="bg-primary text-on-primary p-5 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<p className="text-label-sm font-label-sm opacity-70">Total Users</p>
<p className="text-headline-lg font-headline-lg mt-1">1,284</p>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-3xl">
<p className="text-label-sm font-label-sm text-secondary">New Today</p>
<p className="text-headline-lg font-headline-lg text-primary mt-1">+12</p>
</div>
</section>
{/* Customer List (Luxury List Cards) */}
<section className="space-y-stack-md">
{/* Customer Card 1 */}
<div className="bg-surface-container-lowest p-4 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0gXLzCAbeUa0JoBkcUoR-72FUiHVdwxgC_Qw44SlLGVf3k0j0qSbT66jNn-ZfVeB0HhM_DlKyghsIc1OrKlhoJuCPzzPCgcqCIoA-Ftm6gaf4NScz1DIsuh7OsbDtfKEaUKkEFTYZ3gG5eZORXrABJd70HMjHfhqFunWS5z58OFzTdCXwMHhaGEqNxqlu4CyY_SIneIcjLtDDGO9yCGGi-0AkHC0gEeP9hxoRQUWpYh6zoH3tyz8JHQbqWmpuwdwFr64QcIPh4Zm3" alt="Close up professional portrait of a stylish male customer in his late 20s, featuring clean studio lighting with soft highlights. The background is a minimalist neutral grey, maintaining a high-end luxury marketplace aesthetic. The individual has a confident expression, perfectly groomed, aligning with the premium fashion brand identity." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
<div>
<h3 className="text-title-lg font-title-lg text-primary">Julian Vos</h3>
<p className="text-label-sm font-label-sm text-secondary">julian.vos@gmail.com</p>
</div>
</div>
<div className="text-right">
<p className="text-label-sm font-label-sm text-secondary">Orders</p>
<p className="text-label-lg font-label-lg text-primary">24</p>
</div>
</div>
<div className="flex gap-2">
<button className="flex-1 bg-primary text-on-primary py-3 rounded-full text-label-lg font-label-lg hover:opacity-90 transition-opacity">Manage Account</button>
<button className="px-4 border border-outline-variant rounded-full flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined">person</span>
</button>
</div>
</div>
{/* Customer Card 2 */}
<div className="bg-surface-container-lowest p-4 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-4 border border-transparent">
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1kYG6RbNcgBFV49SMttRhpq_vRm30S_xmINKpHi-aEAALaLM6K9byBMXWyB6WPtKUTiJZHH8FfhuadbTikATl-jowo0-kdBXcs3FEYa3d9muvQD68jXoyJwo8fysbBtKhR7iTLWTA31zmC1vya0Flqv_FV2dfQ52voAirIsCArQ4zDaLDglH52EtbP6aaFtnqxq6H1yyJu1CihLKZmpbWvX-tRn0sF4Qj33OY_1MQ0wLcQcCcAD0C8ID0P2UNzkrce4SofracTyqJ" alt="A sophisticated woman in high-fashion attire, photographed in a brightly lit, minimalist studio setting. The lighting is soft and airy, creating a high-key, modern luxury feel. The overall color palette is composed of pristine whites and deep blacks, reflecting an exclusive sneaker marketplace's brand identity. Her look is precise and curated." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
<div>
<h3 className="text-title-lg font-title-lg text-primary">Elena Rossi</h3>
<p className="text-label-sm font-label-sm text-secondary">e.rossi@luxury.it</p>
</div>
</div>
<div className="text-right">
<p className="text-label-sm font-label-sm text-secondary">Orders</p>
<p className="text-label-lg font-label-lg text-primary">18</p>
</div>
</div>
<div className="flex gap-2">
<button className="flex-1 bg-primary text-on-primary py-3 rounded-full text-label-lg font-label-lg hover:opacity-90 transition-opacity">Manage Account</button>
<button className="px-4 border border-outline-variant rounded-full flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined">person</span>
</button>
</div>
</div>
{/* Customer Card 3 */}
<div className="bg-surface-container-lowest p-4 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfcFN2Rpl5B_R0axNlvW8eDxcSancUSjCaoWdwRuZhIiLiBt8gAAOl7u33las1fPeD55L1qVd7yylCIhdUriQ0EnWpRYnE1rT8ZruCJ9YQCyIBWnXkWsFSgdT7oyBUj4O4__fGnILtkmQ9oCOm_K3JsSt_UuMTFzVRGCSKjdwJkh5rn0sBDbAbBu7z0eBhE_l-Odr2DHLIXx2lo93yVEDv19oGNHcUwtb8cuB6Ld5-K4kwyzJyA3yTOiTTaCm0UKH01i8o06rbx_-F" alt="Candid, sharp portrait of a modern urban man with a minimalist aesthetic. The image is captured in natural, bright daylight against a clean, white architectural background. The mood is sophisticated and exclusive, echoing a premium digital retail experience. High contrast and clean lines dominate the visual style." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
<div>
<h3 className="text-title-lg font-title-lg text-primary">Marcus Thorne</h3>
<p className="text-label-sm font-label-sm text-secondary">m.thorne@design.co</p>
</div>
</div>
<div className="text-right">
<p className="text-label-sm font-label-sm text-secondary">Orders</p>
<p className="text-label-lg font-label-lg text-primary">09</p>
</div>
</div>
<div className="flex gap-2">
<button className="flex-1 bg-primary text-on-primary py-3 rounded-full text-label-lg font-label-lg hover:opacity-90 transition-opacity">Manage Account</button>
<button className="px-4 border border-outline-variant rounded-full flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined">person</span>
</button>
</div>
</div>
{/* Customer Card 4 */}
<div className="bg-surface-container-lowest p-4 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEb4dZ9t7C9Gma3hFR8xhGvbfFECUy0X6e7V27hgBcW0Yt7YcZ7GaGq62p3C8UH1AyIVrOXBIyjPrG5XQFCO6VpCIDf4XzrStL5IrmqwzG7_2GH7UVjYUmJFAbSUdeR4xWLjS9W129QzDl_PsZgtd3bbmt4CUpDoOW7xzUxyLQeoP-aaneFjAP0VdP3VMLpjJV8pLokmu-M2YowDmoJGwMy482cJDLz1bJ5xRdkPqnMEPQeXvnwhNSoPUkBfHj00O3LY8btMQRCfFe" alt="Editorial style portrait of a creative professional woman in a minimalist, high-end studio. The lighting is diffused and professional, casting soft shadows that give depth to the image. The aesthetic is clean, monochrome, and high-contrast, fitting htmlFor a luxury digital brand. Every detail is sharp and precise." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
<div>
<h3 className="text-title-lg font-title-lg text-primary">Sasha Kim</h3>
<p className="text-label-sm font-label-sm text-secondary">skim@archive.io</p>
</div>
</div>
<div className="text-right">
<p className="text-label-sm font-label-sm text-secondary">Orders</p>
<p className="text-label-lg font-label-lg text-primary">31</p>
</div>
</div>
<div className="flex gap-2">
<button className="flex-1 bg-primary text-on-primary py-3 rounded-full text-label-lg font-label-lg hover:opacity-90 transition-opacity">Manage Account</button>
<button className="px-4 border border-outline-variant rounded-full flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined">person</span>
</button>
</div>
</div>
</section>
{/* Pagination / Load More */}
<section className="mt-stack-lg text-center">
<button className="text-label-lg font-label-lg text-secondary underline underline-offset-4 hover:text-primary transition-colors">
                Load 20 more customers
            </button>
</section>
</main>
{/* Bottom Nav Bar */}
<nav className="fixed bottom-0 w-full h-[84px] z-50 bg-surface-container-lowest shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8 max-w-[390px]">
<button className="flex items-center justify-center text-secondary hover:text-primary transition-colors">
<span className="material-symbols-outlined">home</span>
</button>
<button className="flex items-center justify-center text-secondary hover:text-primary transition-colors">
<span className="material-symbols-outlined">search</span>
</button>
<button className="flex items-center justify-center text-primary scale-110">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>person</span>
</button>
<button className="flex items-center justify-center text-secondary hover:text-primary transition-colors">
<span className="material-symbols-outlined">favorite</span>
</button>
</nav>

    </>
  );
}
