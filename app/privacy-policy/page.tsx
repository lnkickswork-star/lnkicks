import React from 'react';
import Image from 'next/image';

export default function PrivacyPolicyPage() {
  return (
    <>

{/* Top App Bar (Asymmetric context: Suppressed Nav logic applied) */}
<header className="docked full-width top-0 z-50 bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4">
<div className="flex items-center gap-4">
<button className="hover:opacity-80 transition-opacity flex items-center justify-center active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary dark:text-on-background">arrow_back</span>
</button>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background">Privacy Policy</h1>
</div>
<button className="hover:opacity-80 transition-opacity flex items-center justify-center active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary dark:text-on-background">share</span>
</button>
</header>
{/* Main Content Canvas */}
<main className="px-6 pt-6 pb-24 max-w-[390px] mx-auto overflow-y-auto">
{/* Hero Introduction Section */}
<section className="mb-stack-lg">
<p className="text-body-lg font-body-lg text-secondary mb-stack-md leading-relaxed">
                At LNKICKS, your privacy is paramount. This policy outlines how we handle your personal data to provide a seamless luxury sneaker experience.
            </p>
<div className="h-[1px] w-full bg-outline-variant"></div>
</section>
{/* Information We Collect Section */}
<section className="mb-section-gap">
<div className="flex items-center gap-3 mb-stack-md">
<span className="material-symbols-outlined text-primary">analytics</span>
<h2 className="text-title-lg font-title-lg text-primary">Information We Collect</h2>
</div>
<div className="space-y-stack-md">
<div className="p-component-padding-y bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
<h3 className="text-label-lg font-label-lg text-primary mb-1">Personal Identifiers</h3>
<p className="text-body-md font-body-md text-on-surface-variant">Name, email address, and shipping details required for order fulfillment and account authentication.</p>
</div>
<div className="p-component-padding-y bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
<h3 className="text-label-lg font-label-lg text-primary mb-1">Device &amp; Usage Data</h3>
<p className="text-body-md font-body-md text-on-surface-variant">IP addresses, browser types, and interaction logs within the app to optimize our marketplace performance.</p>
</div>
</div>
</section>
{/* Visual Break / Abstract Graphic */}
<div className="mb-section-gap h-48 w-full rounded-2xl overflow-hidden relative">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJDMmD1r9zq_Zb2iPo6Kplosik_s7holY013l3qOP0mOGTKmZCCxDFk7XpmhkZLBJkYEDfLQX8ibqh9rSiWB1kDSMbzCWNWX3sxYqx2De87YulsvSk-Oqhjk52PS81TVKjNM0KCbx31NePFN4--1NUqZh0YWwItq8UvLJTAgMf9KmpZMhotmC-RizM0koSZrVRsun6ucwGqQiMMIclWwJJBQi6tg0BDxGa5TmAafDv05LS3jXPrdHgzw3pPPs0GW-TdJZSUV-0G1tE" alt="Privacy Security Abstract" width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
</div>
{/* How We Use Information Section */}
<section className="mb-section-gap">
<div className="flex items-center gap-3 mb-stack-md">
<span className="material-symbols-outlined text-primary">hub</span>
<h2 className="text-title-lg font-title-lg text-primary">How We Use Information</h2>
</div>
<ul className="space-y-stack-md list-none">
<li className="flex items-start gap-4">
<div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
<p className="text-body-md font-body-md text-on-surface-variant">To process transactions and manage your premium membership benefits securely.</p>
</li>
<li className="flex items-start gap-4">
<div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
<p className="text-body-md font-body-md text-on-surface-variant">To personalize your feed with high-end sneaker recommendations based on your preferences.</p>
</li>
<li className="flex items-start gap-4">
<div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
<p className="text-body-md font-body-md text-on-surface-variant">To communicate exclusive drops, order updates, and security alerts via encrypted channels.</p>
</li>
</ul>
</section>
{/* Data Protection Section */}
<section className="mb-section-gap p-stack-lg bg-primary rounded-2xl text-on-primary">
<div className="flex items-center gap-3 mb-stack-md">
<span className="material-symbols-outlined text-on-primary">shield_lock</span>
<h2 className="text-title-lg font-title-lg">Data Protection</h2>
</div>
<p className="text-body-md font-body-md opacity-90 leading-relaxed mb-stack-md">
                Your data is stored using industry-standard encryption (AES-256). We conduct regular security audits to ensure your collection and payment information remain impenetrable.
            </p>
<div className="flex gap-2">
<span className="px-3 py-1 bg-white/20 rounded-full text-label-sm font-label-sm">GDPR Compliant</span>
<span className="px-3 py-1 bg-white/20 rounded-full text-label-sm font-label-sm">End-to-End Encryption</span>
</div>
</section>
{/* Footer / Contact Section */}
<footer className="pb-stack-lg border-t border-outline-variant pt-stack-lg">
<h4 className="text-label-lg font-label-lg text-primary mb-2">Questions regarding privacy?</h4>
<p className="text-body-md font-body-md text-secondary mb-stack-md">Reach out to our compliance team for a detailed review of your data rights.</p>
<button className="w-full py-[18px] bg-primary text-on-primary rounded-full font-label-lg hover:opacity-90 transition-opacity active:scale-[0.98]">
                Contact Privacy Officer
            </button>
<div className="mt-stack-lg flex justify-center gap-6">
<span className="text-label-sm font-label-sm text-on-surface-variant">Terms of Service</span>
<span className="text-label-sm font-label-sm text-on-surface-variant">Cookie Policy</span>
</div>
</footer>
</main>
{/* Navigation suppressed per Destination Rule: Linear/Transactional page */}

    </>
  );
}
