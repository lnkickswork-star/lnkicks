import React from 'react';
import Image from 'next/image';

export default function TermsConditionsPage() {
  return (
    <>

<main className="w-[390px] h-[844px] bg-surface overflow-y-auto relative flex flex-col shadow-2xl">
{/* TopAppBar (Suppressed from Shell because of Transactional/Task-Focused Intent) */}
<header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md flex items-center justify-between px-container-margin py-stack-md">
<button className="flex items-center justify-center w-10 h-10 hover:opacity-80 transition-opacity">
<span className="material-symbols-outlined text-primary">arrow_back</span>
</button>
<h1 className="text-label-lg font-label-lg text-primary tracking-widest">LNKICKS</h1>
<div className="w-10"></div> {/* Spacer for symmetry */}
</header>
{/* Content Canvas */}
<article className="flex-1 px-container-margin pt-stack-md pb-section-gap">
<header className="mb-stack-lg">
<h2 className="text-display-lg-mobile font-display-lg-mobile text-primary mb-stack-sm">Terms &amp; Conditions</h2>
<p className="text-label-sm font-label-sm text-secondary">Last Updated: October 24, 2023</p>
</header>
<div className="space-y-stack-lg">
{/* Section 1 */}
<section>
<h3 className="text-title-lg font-title-lg text-primary mb-stack-md">1. Introduction</h3>
<p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                        Welcome to LNKICKS. These Terms &amp; Conditions govern your use of our premium sneaker marketplace. By accessing our platform, you agree to be bound by these rules. Our service is designed to provide an exclusive, high-fidelity experience for sneaker enthusiasts and collectors globally.
                    </p>
</section>
{/* Section 2 */}
<section>
<h3 className="text-title-lg font-title-lg text-primary mb-stack-md">2. Use of Service</h3>
<p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                        You must be at least 18 years of age to use this marketplace. We provide a curated selection of high-end footwear. Users are prohibited from using automated systems to scrape data, participate in unfair bidding practices, or misrepresent the authenticity of items listed for secondary sale.
                    </p>
</section>
{/* Section 3 */}
<section>
<h3 className="text-title-lg font-title-lg text-primary mb-stack-md">3. Authenticity Guarantee</h3>
<div className="p-stack-md bg-surface-container-low rounded-xl border border-outline-variant mb-stack-md">
<p className="text-body-md font-body-md text-primary font-semibold">
                            Every sneaker purchased through LNKICKS undergoes a rigorous multi-point inspection process by our master authenticators.
                        </p>
</div>
<p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                        We ensure that every pair of shoes delivered to our clients meets the highest standards of quality and original manufacture. Any item found to be counterfeit will be rejected, and the transaction will be voided immediately.
                    </p>
</section>
{/* Section 4 */}
<section>
<h3 className="text-title-lg font-title-lg text-primary mb-stack-md">4. Payments &amp; Transactions</h3>
<p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                        Transactions are processed through our secure, encrypted gateway. Prices are subject to market volatility and may change without notice. All sales are final once the authenticity verification process has been completed and the item has been shipped.
                    </p>
</section>
{/* Section 5 */}
<section>
<h3 className="text-title-lg font-title-lg text-primary mb-stack-md">5. Limitation of Liability</h3>
<p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                        LNKICKS shall not be held liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services. We strive for 100% platform uptime but do not guarantee uninterrupted access during peak product drops.
                    </p>
</section>
{/* Section 6 */}
<section>
<h3 className="text-title-lg font-title-lg text-primary mb-stack-md">6. Privacy Policy</h3>
<p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                        Your privacy is paramount. Please review our separate Privacy Policy which explains how we collect, use, and protect your personal data in accordance with international luxury digital standards.
                    </p>
</section>
</div>
{/* Visual Break / Image */}
<div className="my-section-gap overflow-hidden rounded-xl bg-surface-container-highest">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxyZeDHn2nRU_QELw7YusOnryqueNcWbfWfPxn6Jr3pHn5MsmEEWloaiPPKQ532eIQchYhQ28Nc9_4tD8RV90Bq1PsI5uubfzsfv9wkL77rd98_EGc4sCqWL5zuMMHTR1hoY-r7HhYFjiRFc7zaRuaOn3yDjM9Mt904HATEvELEV-IxTi9UJrGlbgZFSQUKO5WcIoP5UF4ULg23e2EvoYWVg9gMvPJ57vzsluXjHWRabDPeZR5fZfyytC5peWdCOGIVGQmW88cKzvE" alt="Sneaker Close-up" width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
</div>
{/* Footer Action */}
<div className="pt-stack-lg border-t border-outline-variant text-center">
<p className="text-body-md font-body-md text-secondary mb-stack-lg">
                    By clicking below, you acknowledge that you have read and understood these terms in their entirety.
                </p>
<button className="w-full py-[18px] bg-primary text-on-primary rounded-full text-label-lg font-label-lg hover:opacity-90 transition-opacity active:scale-[0.98]">
                    Accept and Continue
                </button>
</div>
</article>
</main>

    </>
  );
}
