import React from 'react';
import Image from 'next/image';

export default function ReturnRefundPolicyPage() {
  return (
    <>

{/* Mobile Viewport Container */}
<main className="w-[390px] h-[844px] bg-white relative overflow-hidden flex flex-col">
{/* TopAppBar (Transactional/Focus Screen: No standard Nav) */}
<header className="flex justify-between items-center w-full px-6 py-4 bg-surface dark:bg-background sticky top-0 z-10">
<div className="flex items-center gap-4">
<button className="hover:opacity-80 transition-opacity active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary">arrow_back</span>
</button>
<span className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary">LNKICKS</span>
</div>
<button className="hover:opacity-80 transition-opacity">
<span className="material-symbols-outlined text-primary">help_outline</span>
</button>
</header>
{/* Content Canvas */}
<section className="flex-1 overflow-y-auto px-6 py-stack-lg pb-24">
{/* Hero Header */}
<div className="mb-section-gap">
<h1 className="text-display-lg-mobile font-display-lg-mobile text-primary tracking-tight mb-2">Return &amp; Refund Policy</h1>
<p className="text-body-md font-body-md text-secondary">Effective Date: October 24, 2023</p>
</div>
{/* Feature Card / Key Condition Highlight */}
<div className="mb-section-gap p-6 bg-surface-container-low rounded-xl border border-[#EEEEEE] shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<div className="flex items-center gap-3 mb-stack-md">
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-title-lg font-title-lg text-primary">30-Day Guarantee</span>
</div>
<p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
          We offer a full refund or exchange for any unworn sneakers within 30 days of the delivery date. Items must be in their original packaging with all tags attached.
        </p>
</div>
{/* Policy Sections (Bento-lite Layout) */}
<div className="space-y-section-gap">
{/* Section 1 */}
<article>
<h2 className="text-headline-md font-headline-md text-primary mb-stack-md">1. Eligibility Conditions</h2>
<div className="space-y-stack-md">
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-secondary mt-0.5">straighten</span>
<p className="text-body-md font-body-md text-on-surface-variant">Sneakers must show zero signs of wear, including creasing on the toe box or dirt on the outsoles.</p>
</div>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-secondary mt-0.5">inventory_2</span>
<p className="text-body-md font-body-md text-on-surface-variant">The original shoe box is considered part of the product and must be returned undamaged.</p>
</div>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-secondary mt-0.5">verified</span>
<p className="text-body-md font-body-md text-on-surface-variant">Authenticity tags must remain intact and attached to the footwear.</p>
</div>
</div>
</article>
{/* Image Illustration */}
<div className="w-full h-48 rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwRP1u_npvwzyaXwlf-Jopec39swp2mxsxU5FPXq8j-s3-a_uIOerhcgp4nM2BMYMOwyNpgtZ-adbFr920k7OQ-YLsvJ2g7LoWLDVrrl7lEMNc92MPSt6qx05ta9JYF4ZoYH4Wob-D-PSgXT3HpSC1qufv4jgNOnsCAsb7DOF6lBWjeJK-unameU-LdVDmPgCSoy90uInKLJTEU1ohLXGQZu7DzXXWPfVa2jPWOSa0NF3lV3K22EyvW9wkZfNBjjUYznGM1tw59vc_" alt="Quality Control" width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
</div>
{/* Section 2 */}
<article>
<h2 className="text-headline-md font-headline-md text-primary mb-stack-md">2. Refund Methods</h2>
<p className="text-body-md font-body-md text-on-surface-variant leading-relaxed mb-stack-md">
            Once your return is inspected and approved, your refund will be processed to the original method of payment within 5-7 business days.
          </p>
<div className="grid grid-cols-2 gap-4">
<div className="p-4 border border-[#EEEEEE] rounded-lg">
<p className="text-label-sm font-label-sm text-secondary uppercase tracking-widest mb-1">Credit Card</p>
<p className="text-title-lg font-title-lg text-primary">5-7 Days</p>
</div>
<div className="p-4 border border-[#EEEEEE] rounded-lg">
<p className="text-label-sm font-label-sm text-secondary uppercase tracking-widest mb-1">Store Credit</p>
<p className="text-title-lg font-title-lg text-primary">Instant</p>
</div>
</div>
</article>
{/* Section 3 */}
<article>
<h2 className="text-headline-md font-headline-md text-primary mb-stack-md">3. Non-Returnable Items</h2>
<ul className="list-disc pl-5 space-y-2 text-body-md font-body-md text-on-surface-variant">
<li>Limited Edition &quot;Final Drop&quot; releases</li>
<li>Sneaker care products (sprays, cleaners)</li>
<li>Socks and intimate apparel</li>
<li>Items purchased during Clearance Sales</li>
</ul>
</article>
{/* Support CTA */}
<div className="bg-primary text-on-primary p-6 rounded-xl flex flex-col items-center text-center">
<span className="material-symbols-outlined text-[32px] mb-stack-md">support_agent</span>
<h3 className="text-title-lg font-title-lg mb-2">Still have questions?</h3>
<p className="text-body-md font-body-md opacity-80 mb-6">Our concierge team is available 24/7 to assist with your return process.</p>
<button className="w-full py-[18px] bg-white text-black font-bold rounded-full hover:opacity-90 transition-opacity">
            Contact Support
          </button>
</div>
</div>
</section>
{/* Bottom Action Area (Consistent with Premium Feel) */}
<div className="fixed bottom-0 w-full h-[84px] bg-white shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] px-6 flex items-center justify-between z-20">
<div className="flex flex-col">
<span className="text-label-sm font-label-sm text-secondary">Need to start?</span>
<span className="text-title-lg font-title-lg text-primary">Initiate Return</span>
</div>
<button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-[0px_10px_30px_rgba(0,0,0,0.08)] active:scale-95 transition-transform">
        Start Now
      </button>
</div>
</main>

    </>
  );
}
