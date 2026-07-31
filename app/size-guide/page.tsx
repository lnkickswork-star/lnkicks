import React from 'react';
import Image from 'next/image';

export default function SizeGuidePage() {
  return (
    <>

{/* Top App Bar */}
<header className="bg-surface sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity">arrow_back</span>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary">Size Guide</h1>
</div>
<span className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity">notifications</span>
</header>
<main className="flex-grow pb-32">
{/* Category Tabs */}
<div className="px-24px pt-stack-md">
<div className="flex bg-surface-container rounded-full p-1">
<button className="flex-1 py-3 px-2 text-center rounded-full bg-primary text-on-primary font-label-lg text-label-lg transition-all">Men</button>
<button className="flex-1 py-3 px-2 text-center rounded-full text-secondary font-label-lg text-label-lg hover:bg-surface-container-high transition-all">Women</button>
<button className="flex-1 py-3 px-2 text-center rounded-full text-secondary font-label-lg text-label-lg hover:bg-surface-container-high transition-all">Kids</button>
</div>
</div>
{/* Conversion Table Section */}
<section className="mt-section-gap px-24px">
<div className="flex justify-between items-end mb-stack-md">
<h2 className="text-title-lg font-title-lg text-primary">Conversion Chart</h2>
<span className="text-label-sm font-label-sm text-secondary">Standard Fit</span>
</div>
<div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="py-4 px-4 text-label-lg font-label-lg text-primary">US</th>
<th className="py-4 px-4 text-label-lg font-label-lg text-primary">UK</th>
<th className="py-4 px-4 text-label-lg font-label-lg text-primary">EU</th>
<th className="py-4 px-4 text-label-lg font-label-lg text-primary">CM</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-bright">
<td className="py-4 px-4 text-body-md font-body-md text-primary">8</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">7</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">41</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">26</td>
</tr>
<tr className="bg-surface-container-lowest hover:bg-surface-bright">
<td className="py-4 px-4 text-body-md font-body-md text-primary">8.5</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">7.5</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">42</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">26.5</td>
</tr>
<tr className="bg-primary-container text-on-primary-container">
<td className="py-4 px-4 text-body-md font-bold">9</td>
<td className="py-4 px-4 text-body-md font-bold">8</td>
<td className="py-4 px-4 text-body-md font-bold">42.5</td>
<td className="py-4 px-4 text-body-md font-bold">27</td>
</tr>
<tr className="hover:bg-surface-bright">
<td className="py-4 px-4 text-body-md font-body-md text-primary">9.5</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">8.5</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">43</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">27.5</td>
</tr>
<tr className="hover:bg-surface-bright">
<td className="py-4 px-4 text-body-md font-body-md text-primary">10</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">9</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">44</td>
<td className="py-4 px-4 text-body-md font-body-md text-secondary">28</td>
</tr>
</tbody>
</table>
</div>
<p className="mt-stack-sm text-label-sm font-label-sm text-secondary italic text-center">Recommended: Size up if between sizes.</p>
</section>
{/* How to Measure Section */}
<section className="mt-section-gap px-24px">
<h2 className="text-title-lg font-title-lg text-primary mb-stack-md">How to measure</h2>
<div className="space-y-gutter">
{/* Step 1 */}
<div className="flex gap-stack-md items-center bg-surface-container-lowest p-component-padding-x rounded-xl border border-outline-variant">
<div className="w-20 h-20 bg-surface-container rounded-lg flex items-center justify-center overflow-hidden">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjJxkNFgDxyyt4V15vk3og0qhojL8pcPlzNvRvGFzQamaGDrobSE6rmL6YBUvN05bdPyEK6M3rqcdRuCnxYcpY4Qh60Mx5HXWJ7GsqfkgZ4G9BVl7A1rZkWRXLqviO4uUkg9rryKsLYkkjxUd9qOzSTswkQvb3bhuBcxu-P8jXwp4rXNi1u9O-6vGECu5J_WfqE-CV1xN6vyx1IXc6umKez6cVlc4IX7l-VAMPJN4x2vWSplhRYnZ45B0XDe8KYyRADEEeWfhPiltW" alt="A minimalist line illustration showing a human foot placed flat on a piece of paper against a wall. The drawing is clean and clinical, using thin black lines on a light gray background to demonstrate the proper positioning htmlFor measuring foot length in a luxury sneaker store context." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
</div>
<div className="flex-1">
<h3 className="text-label-lg font-label-lg text-primary">1. Heel to Wall</h3>
<p className="text-body-md font-body-md text-secondary">Place your heel against a wall on a flat piece of paper.</p>
</div>
</div>
{/* Step 2 */}
<div className="flex gap-stack-md items-center bg-surface-container-lowest p-component-padding-x rounded-xl border border-outline-variant">
<div className="w-20 h-20 bg-surface-container rounded-lg flex items-center justify-center overflow-hidden">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsR9dm-8ViwYSv3vYNwv3VCh5jqkPs1iw06coG8hM81Yde-0CalTUVkvdRSt237gHOcR95kjQ1SaXdWvVNcE4txhf_FsKzwag7EHXNx6Cc9tpO67GD6AqcY5VtHEEcu9JAVApQpft_i0rPPuGRE3uuqDBcFwckF2tK79lOHzuwYTfCSsrv5a1wZv55q4fb2IHemiSAgcfXo15iWqKm5cdQm0Aglan19RYykYcrqua0zm38w2_Ts6b7QtmdCVAYGygv349Gwni6V4jf" alt="A detailed minimalist line drawing focusing on a pencil marking the tip of the longest toe on a piece of paper. The style is modern and high-end, emphasizing precision with sharp black strokes on a neutral surface, framed htmlFor a mobile screen interface." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
</div>
<div className="flex-1">
<h3 className="text-label-lg font-label-lg text-primary">2. Mark the Length</h3>
<p className="text-body-md font-body-md text-secondary">Mark the longest part of your foot on the paper.</p>
</div>
</div>
{/* Step 3 */}
<div className="flex gap-stack-md items-center bg-surface-container-lowest p-component-padding-x rounded-xl border border-outline-variant">
<div className="w-20 h-20 bg-surface-container rounded-lg flex items-center justify-center overflow-hidden">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUWon-VFZFyd8lZsgi1xVJaoTVLEkQ33uLeFhmWbkrwMa3AqsyRqgAoB8xoGzLHPNarMxpGRSbc0UAu8DT-_lFKJEg9bXpCsvsJN50_GYiE4Zmm2Z57GT7UIL0xZx-dTFOgZK6nQ1ZyYNevXagMifE4eO98vHG7DHSfZ4jzqjhWKz6RckSoGMroKj3DHILRKv_QCPxjxYd8N5tKJy7hkGEQhxMz2hb_Uh5MPNUUcaS9YQaEPLjkqu60z0eSKKakAtuw5EnltF8vlmh" alt="A simple line illustration of a ruler measuring the distance between two marked points on a paper. The design follows a high-contrast minimalist aesthetic with clean geometric lines, suitable htmlFor a professional luxury footwear marketplace application." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
</div>
<div className="flex-1">
<h3 className="text-label-lg font-label-lg text-primary">3. Measure</h3>
<p className="text-body-md font-body-md text-secondary">Measure the distance from the wall to your mark in centimeters.</p>
</div>
</div>
</div>
</section>
{/* CTA Section */}
<section className="mt-section-gap px-24px">
<button className="w-full bg-primary text-on-primary py-4 rounded-full font-label-lg text-label-lg shadow-[0px_10px_30px_rgba(0,0,0,0.08)] active:scale-95 transition-transform">
                Find My Perfect Fit
            </button>
<p className="mt-stack-md text-center text-body-md font-body-md text-secondary px-4">
                Still unsure? Our fit specialists are available 24/7.
            </p>
</section>
</main>
{/* Bottom Nav Bar */}
<nav className="fixed bottom-0 w-full h-[84px] z-50 bg-surface-container-lowest shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<a className="flex items-center justify-center text-secondary hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined">home</span>
</a>
<a className="flex items-center justify-center text-secondary hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined">search</span>
</a>
<a className="flex items-center justify-center text-secondary hover:text-primary transition-colors" href="#">
<span className="material-symbols-outlined">favorite</span>
</a>
<a className="flex items-center justify-center text-primary scale-110" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>person</span>
</a>
</nav>

    </>
  );
}
