import React from 'react';
import Image from 'next/image';

export default function ShippingPolicyPage() {
  return (
    <>

<div className="relative w-[390px] h-[844px] bg-surface overflow-hidden flex flex-col">
{/* TopAppBar (Based on Shared Components) */}
<header className="bg-surface dark:bg-background docked full-width top-0 flex justify-between items-center w-full px-6 py-4 z-10">
<div className="flex items-center gap-4">
<button className="hover:opacity-80 transition-opacity active:scale-95">
<span className="material-symbols-outlined text-primary dark:text-on-background">arrow_back</span>
</button>
</div>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">LNKICKS</h1>
<div className="flex items-center">
<button className="hover:opacity-80 transition-opacity active:scale-95">
<span className="material-symbols-outlined text-primary dark:text-on-background">help_outline</span>
</button>
</div>
</header>
{/* Content Canvas */}
<main className="flex-1 overflow-y-auto hide-scrollbar px-container-margin pt-stack-lg pb-stack-lg">
{/* Page Header */}
<section className="mb-section-gap">
<h2 className="text-display-lg-mobile font-display-lg-mobile text-primary mb-stack-sm">Shipping Policy</h2>
<p className="text-body-md font-body-md text-secondary">Last updated: October 2023</p>
</section>
{/* Policy Sections */}
<div className="space-y-section-gap">
{/* Processing Times */}
<section className="space-y-stack-md">
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '\'FILL\' 1' }}>history</span>
<h3 className="text-title-lg font-title-lg text-primary">Processing Times</h3>
</div>
<div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<p className="text-body-md font-body-md text-on-surface leading-relaxed">
                            All orders are processed within <span className="font-bold">1-3 business days</span>. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of sneaker launches, shipments may be delayed by a few days.
                        </p>
</div>
</section>
{/* Shipping Rates & Delivery */}
<section className="space-y-stack-md">
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '\'FILL\' 1' }}>local_shipping</span>
<h3 className="text-title-lg font-title-lg text-primary">Shipping Rates</h3>
</div>
<div className="grid grid-cols-1 gap-stack-sm">
<div className="flex justify-between items-center p-stack-md border border-outline-variant rounded-lg">
<div>
<p className="text-label-lg font-label-lg text-primary">Standard Shipping</p>
<p className="text-label-sm font-label-sm text-secondary">5-7 Business Days</p>
</div>
<p className="text-title-lg font-title-lg text-primary">$15.00</p>
</div>
<div className="flex justify-between items-center p-stack-md border border-outline-variant rounded-lg">
<div>
<p className="text-label-lg font-label-lg text-primary">Express Delivery</p>
<p className="text-label-sm font-label-sm text-secondary">2-3 Business Days</p>
</div>
<p className="text-title-lg font-title-lg text-primary">$35.00</p>
</div>
<div className="flex justify-between items-center p-stack-md bg-primary text-on-primary rounded-lg">
<div>
<p className="text-label-lg font-label-lg">Premium Overnight</p>
<p className="text-label-sm font-label-sm opacity-80">Next Day Delivery</p>
</div>
<p className="text-title-lg font-title-lg">$65.00</p>
</div>
</div>
</section>
{/* Tracking Procedures */}
<section className="space-y-stack-md">
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '\'FILL\' 1' }}>location_on</span>
<h3 className="text-title-lg font-title-lg text-primary">Tracking Procedures</h3>
</div>
<div className="relative overflow-hidden rounded-xl bg-surface-container-high h-[180px]">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL7I5Tm2AZfCb9tXLfggQtL6M76zpkjsoRH0gTjSICboZ-krG0RvfUGmX-lnOgOYuHwbCklxzjg90VxB2cnV2v0sLn4ze2AtA35sBQ7wMt5aiaWUcR65pD2xc6zDaO4MAOkVc-NqdUlOcYhXY8Bt6_H_6CXlkr9h_2voYErqwuenh9MpQjQI9kLp2o6lbO6TiCQ_2_tMd_C09Cje6MHNP5YwNmcQKnICYfPSE1SFd2-54JedFnqjiVkRr5VeuCqYTy3xkdVbhqgeiU" alt="A clean, minimalist high-fashion editorial photo of a pair of limited edition sneakers inside a matte black luxury box being handled by a person wearing white gloves. The scene is brightly lit with high-key lighting, emphasizing the monochrome aesthetic and premium nature of the logistics process. Shadows are soft and diffused, creating a serene and professional atmosphere representative of a luxury brand's fulfillment center." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-stack-md">
<p className="text-on-primary text-body-md font-body-md">Real-time GPS tracking enabled for all premium shipments.</p>
</div>
</div>
<p className="text-body-md font-body-md text-on-surface leading-relaxed mt-stack-sm">
                        You will receive a shipment confirmation email containing your tracking number(s) once your order has shipped. The tracking number will be active within 24 hours.
                    </p>
</section>
{/* International Shipping */}
<section className="p-stack-lg bg-surface-container-low rounded-2xl border border-surface-container-highest">
<div className="flex items-start gap-stack-md">
<span className="material-symbols-outlined text-primary mt-1">public</span>
<div className="space-y-stack-sm">
<h3 className="text-title-lg font-title-lg text-primary">International Shipping</h3>
<p className="text-body-md font-body-md text-secondary">
                                LNKICKS currently ships to over 50 countries. Please note that customs duties and taxes are the responsibility of the recipient and may vary by destination.
                            </p>
</div>
</div>
</section>
{/* Damaged Items */}
<section className="space-y-stack-md mb-section-gap">
<div className="flex items-center gap-stack-sm">
<span className="material-symbols-outlined text-error" style={{ fontVariationSettings: '\'FILL\' 1' }}>report</span>
<h3 className="text-title-lg font-title-lg text-error">Damages &amp; Losses</h3>
</div>
<p className="text-body-md font-body-md text-on-surface leading-relaxed">
                        LNKICKS is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim or our support team for guidance.
                    </p>
</section>
</div>
{/* Footer Support CTA */}
<div className="mt-section-gap flex flex-col items-center gap-stack-md pb-stack-lg">
<p className="text-body-md font-body-md text-secondary">Still have questions?</p>
<button className="w-full bg-primary text-on-primary font-bold py-[18px] rounded-full hover:opacity-90 transition-all active:scale-[0.98]">
                    Contact Concierge Support
                </button>
</div>
</main>
{/* Suppression logic: BottomNavBar is suppressed for detailed policy sub-pages per rules */}
</div>

    </>
  );
}
