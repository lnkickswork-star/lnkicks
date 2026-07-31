import React from 'react';
import Image from 'next/image';

export default function ContactUsPage() {
  return (
    <>

<div className="w-[390px] h-[844px] bg-background relative overflow-hidden flex flex-col shadow-2xl">
{/* TopAppBar */}
<header className="bg-surface dark:bg-background flex justify-between items-center w-full px-6 py-4 z-10 sticky top-0">
<div className="flex items-center gap-4">
<button className="hover:opacity-80 transition-opacity active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary dark:text-on-background">arrow_back</span>
</button>
<h1 className="text-headline-lg-mobile font-headline-lg-mobile font-extrabold tracking-tighter text-primary dark:text-on-background uppercase">Contact Us</h1>
</div>
<button className="hover:opacity-80 transition-opacity active:scale-95 transition-transform">
<span className="material-symbols-outlined text-primary dark:text-on-background">notifications</span>
</button>
</header>
<main className="flex-1 overflow-y-auto hide-scrollbar pb-32">
{/* Hero Map / Visual Section */}
<section className="px-6 mt-6">
<div className="w-full h-48 rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] bg-surface-container-high relative">
<Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgX3y3VxCdIBLuRkSel6rmWqkumRMqfbJ4xxvZji0k8vul9QVb-2pyXP1SrZjdHoLWfoDAhW7hCPB7emhHJVENf71kSVinCnPZl9OSwhjfm7wJGIOi4tVDFKpKbDXnmzCRR7hjzIuAsiGZFpYl3ImxkdwkQM_TXbjOrb62Qk1AK0rWwr-Wn-gfSB9OmC4YTQxlMwUo_z_A1RJTy_EFM0QrgCGgiAano932pbvG76PDyKuqkbPRXVOI8LOYjQh9E0qhA29okIV-OUp4" alt="A clean architectural photograph of a luxury high-end fashion boutique entrance in New York City. The lighting is bright and airy with high-key whites and deep black accents. Minimalist signage and large glass windows reflect a modern, premium aesthetic consistent with a luxury sneaker marketplace." width={400} height={300} unoptimized style={{ maxWidth: '100%', height: 'auto' }} />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
<div className="absolute bottom-4 left-4">
<p className="text-white font-label-lg text-label-lg">Flagship Studio</p>
<p className="text-white/80 font-label-sm text-label-sm">5th Ave, New York, NY</p>
</div>
</div>
</section>
{/* Quick Contact Options */}
<section className="px-6 mt-stack-lg">
<div className="grid grid-cols-3 gap-stack-md">
<button className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] hover:opacity-80 transition-all">
<span className="material-symbols-outlined text-primary mb-2">mail</span>
<span className="text-label-sm font-label-sm">Email</span>
</button>
<button className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] hover:opacity-80 transition-all">
<span className="material-symbols-outlined text-primary mb-2">call</span>
<span className="text-label-sm font-label-sm">Phone</span>
</button>
<button className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#EEEEEE] hover:opacity-80 transition-all">
<span className="material-symbols-outlined text-primary mb-2">forum</span>
<span className="text-label-sm font-label-sm">Chat</span>
</button>
</div>
</section>
{/* Contact Form */}
<section className="px-6 mt-section-gap">
<h2 className="text-title-lg font-title-lg text-primary mb-stack-md">Send us a message</h2>
<div className="space-y-stack-md">
<div>
<label className="block text-label-sm font-label-sm text-secondary mb-1">Full Name</label>
<input className="w-full px-4 py-3 bg-[#F5F5F5] border-none rounded-xl text-body-md font-body-md focus:ring-1 focus:ring-primary placeholder:text-[#A0A0A0]" placeholder="John Doe" type="text" />
</div>
<div>
<label className="block text-label-sm font-label-sm text-secondary mb-1">Email Address</label>
<input className="w-full px-4 py-3 bg-[#F5F5F5] border-none rounded-xl text-body-md font-body-md focus:ring-1 focus:ring-primary placeholder:text-[#A0A0A0]" placeholder="john.doe@gmail.com" type="email" />
</div>
<div>
<label className="block text-label-sm font-label-sm text-secondary mb-1">Message</label>
<textarea className="w-full px-4 py-3 bg-[#F5F5F5] border-none rounded-xl text-body-md font-body-md focus:ring-1 focus:ring-primary placeholder:text-[#A0A0A0] resize-none" placeholder="How can we help you?" rows={4}></textarea>
</div>
<button className="w-full py-[18px] bg-primary text-on-primary font-label-lg text-label-lg rounded-full shadow-[0px_10px_30px_rgba(0,0,0,0.08)] active:scale-95 transition-transform mt-2">
                        Send Message
                    </button>
</div>
</section>
{/* Physical Address Section */}
<section className="px-6 mt-section-gap">
<div className="p-6 bg-surface-container rounded-xl border border-[#EEEEEE]">
<h3 className="text-label-lg font-label-lg text-primary mb-2">LNKICKS Headquarter</h3>
<div className="flex items-start gap-3 text-secondary mb-4">
<span className="material-symbols-outlined text-[20px]">location_on</span>
<p className="text-body-md font-body-md">721 5th Ave, New York, NY 10022,<br />United States</p>
</div>
<div className="flex items-center gap-3 text-secondary mb-4">
<span className="material-symbols-outlined text-[20px]">schedule</span>
<p className="text-body-md font-body-md">Mon - Sat: 10:00 AM - 9:00 PM</p>
</div>
<button className="text-primary font-label-lg text-label-lg flex items-center gap-1 hover:opacity-70 transition-opacity">
                        View on Map
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
</button>
</div>
</section>
</main>
{/* BottomNavBar */}
<nav className="bg-surface-container-lowest dark:bg-surface-container-low fixed bottom-0 w-full h-[84px] z-50 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center px-10 pb-8">
<button className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">home</span>
</button>
<button className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">search</span>
</button>
<button className="flex items-center justify-center text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-background transition-colors active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined">favorite</span>
</button>
<button className="flex items-center justify-center text-primary dark:text-on-background scale-110 active:scale-90 duration-200 ease-out">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>person</span>
</button>
</nav>
</div>

    </>
  );
}
