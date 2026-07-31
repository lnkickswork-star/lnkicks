import React from 'react';
import Image from 'next/image';

export default function AddressesPage() {
  return (
    <>

{/* Top App Bar */}
<header className="docked full-width top-0 bg-surface flex justify-between items-center w-full px-6 py-4 z-50">
<div className="flex items-center gap-4">
<button className="hover:opacity-80 transition-opacity active:scale 0.95 transition-transform text-primary">
<span className="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
</button>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary">My Addresses</h1>
</div>
<div className="flex items-center gap-4">
<button className="hover:opacity-80 transition-opacity active:scale 0.95 transition-transform text-primary">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
</header>
<main className="w-full max-w-[390px] px-6 pb-32 flex flex-col gap-section-gap pt-stack-lg">
{/* Add New Address Button */}
<section className="w-full">
<button className="w-full bg-primary text-on-primary py-[18px] rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-[0px_10px_30px_rgba(0,0,0,0.08)] active:scale-95 transition-transform">
<span className="material-symbols-outlined text-[20px]" data-icon="add">add</span>
                Add New Address
            </button>
</section>
{/* Address List */}
<section className="flex flex-col gap-stack-md">
{/* Home Address Card */}
<div className="bg-surface-container-lowest p-component-padding-x rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col gap-stack-md">
<div className="flex justify-between items-start">
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-primary" data-icon="home" style={{ fontVariationSettings: '\'FILL\' 1' }}>home</span>
<h3 className="text-title-lg font-title-lg">Home</h3>
</div>
<span className="bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Default</span>
</div>
<div className="flex flex-col gap-1">
<p className="text-body-lg font-body-lg text-on-surface">Alex Thompson</p>
<p className="text-body-md font-body-md text-secondary leading-relaxed">
                        124 Luxury Plaza, Suite 402<br />
                        Upper East Side, New York, NY 10021
                    </p>
<p className="text-body-md font-body-md text-secondary mt-2">
                        +1 (555) 0123-4567
                    </p>
</div>
<div className="flex items-center gap-gutter pt-stack-sm border-t border-surface-container mt-2">
<button className="flex items-center gap-1 text-label-lg font-label-lg text-primary hover:opacity-70 transition-opacity">
<span className="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
                        Edit
                    </button>
<button className="flex items-center gap-1 text-label-lg font-label-lg text-error hover:opacity-70 transition-opacity">
<span className="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
                        Delete
                    </button>
</div>
</div>
{/* Work Address Card */}
<div className="bg-surface-container-lowest p-component-padding-x rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col gap-stack-md">
<div className="flex justify-between items-start">
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-secondary" data-icon="work">work</span>
<h3 className="text-title-lg font-title-lg">Work</h3>
</div>
</div>
<div className="flex flex-col gap-1">
<p className="text-body-lg font-body-lg text-on-surface">Alex Thompson</p>
<p className="text-body-md font-body-md text-secondary leading-relaxed">
                        Design District Tower, Floor 18<br />
                        Chelsea, New York, NY 10011
                    </p>
<p className="text-body-md font-body-md text-secondary mt-2">
                        +1 (555) 0123-9988
                    </p>
</div>
<div className="flex items-center gap-gutter pt-stack-sm border-t border-surface-container mt-2">
<button className="flex items-center gap-1 text-label-lg font-label-lg text-primary hover:opacity-70 transition-opacity">
<span className="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
                        Edit
                    </button>
<button className="flex items-center gap-1 text-label-lg font-label-lg text-error hover:opacity-70 transition-opacity">
<span className="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
                        Delete
                    </button>
</div>
</div>
{/* Summer House Card */}
<div className="bg-surface-container-lowest p-component-padding-x rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col gap-stack-md">
<div className="flex justify-between items-start">
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-secondary" data-icon="holiday_village">holiday_village</span>
<h3 className="text-title-lg font-title-lg">Summer House</h3>
</div>
</div>
<div className="flex flex-col gap-1">
<p className="text-body-lg font-body-lg text-on-surface">Alex Thompson</p>
<p className="text-body-md font-body-md text-secondary leading-relaxed">
                        45 Ocean Drive, Bayview<br />
                        East Hampton, NY 11937
                    </p>
<p className="text-body-md font-body-md text-secondary mt-2">
                        +1 (555) 0123-1122
                    </p>
</div>
<div className="flex items-center gap-gutter pt-stack-sm border-t border-surface-container mt-2">
<button className="flex items-center gap-1 text-label-lg font-label-lg text-primary hover:opacity-70 transition-opacity">
<span className="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
                        Edit
                    </button>
<button className="flex items-center gap-1 text-label-lg font-label-lg text-error hover:opacity-70 transition-opacity">
<span className="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
                        Delete
                    </button>
</div>
</div>
</section>
{/* Decorative Map Section (Contextual Visual) */}
<section className="w-full h-40 rounded-2xl overflow-hidden relative grayscale brightness-95">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWn_5xsD8xnZ4gFRNuFht73QYiQpd7JIJ1UFvXh2IpbkqLj_LK4_KrILmE_6qZVaPytQ-qfJe6aUD3FQxrvPG7XiAk1Onw9K5anNsOZ-Q-Wnu4W0v_7Egb5lCmDwpPFyBWde2f5JveX8EQAVGiP1smZmcm8fRlvjZFzd-IWWceZIb24zZYWJf5cvuir3_Va1RDAmwzAOAGPUmnGq5gztYUqj_SqKMtS3q9XxXXF4lDhCn_6gZG-889lPloeJKnPl8IQPSyJyEKgPWN" alt="A minimalist, high-contrast aerial map view of a metropolitan city grid. The aesthetic is monochromatic with deep blacks and sharp white street lines, reflecting a premium urban lifestyle. The lighting is clean and architectural, highlighting the geometric precision of the city planning in a sophisticated, minimalist luxury marketplace style." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
<div className="absolute inset-0 bg-black/10 flex items-center justify-center">
<div className="bg-surface px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="location_on" style={{ fontVariationSettings: '\'FILL\' 1' }}>location_on</span>
<span className="text-label-lg font-label-lg text-primary">3 Saved Locations</span>
</div>
</div>
</section>
</main>
{/* Bottom Navigation Bar */}
<nav className="fixed bottom-0 w-full h-[84px] z-50 bg-surface-container-lowest flex justify-around items-center px-10 pb-8 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)]">
<button className="flex items-center justify-center text-secondary hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="home">home</span>
</button>
<button className="flex items-center justify-center text-secondary hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="search">search</span>
</button>
<button className="flex items-center justify-center text-secondary hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="favorite">favorite</span>
</button>
<button className="flex items-center justify-center text-primary scale-110">
<span className="material-symbols-outlined" data-icon="person" style={{ fontVariationSettings: '\'FILL\' 1' }}>person</span>
</button>
</nav>


    </>
  );
}
