import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Kicks Machine — Stocked & Loaded. Finest collection of hyped and luxury sneakers and products.">
    <title>Kicks Machine — Stocked &amp; Loaded</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
/* RESET & BASE */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;scroll-behavior:smooth;background:#120d2b}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:#120d2b;color:#0A0A0A;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{text-decoration:none;color:inherit}
button{cursor:pointer;border:none;background:none;font-family:inherit}
ul{list-style:none}
img{display:block;max-width:100%}

:root{
  --navy-bg:#120d2b;
  --white:#FFFFFF;
  --black:#0A0A0A;
  --gray-50:#F8F8F8;
  --gray-100:#F2F2F2;
  --gray-200:#E4E4E4;
  --gray-400:#ADADAD;
  --gray-600:#6B6B6B;
  --gray-800:#2A2A2A;
  --border:#E4E4E4;
  --border-light:#EBEBEB;
  --container:1400px;
  --px:40px;
  --font-display:'Oswald',sans-serif;
  --font-serif:'Playfair Display',serif;
  --font-sans:'Inter',sans-serif;
  --ease:cubic-bezier(0.4,0,0.2,1);
}

/* TOP ANNOUNCEMENT BAR */
.ann-bar{
  background:var(--navy-bg);
  height:44px;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  padding:0 var(--px);
  color:#ffffff;
  font-size:13px;
  font-weight:500;
}
.ann-bar__socials{
  position:absolute;
  left:var(--px);
  display:flex;
  align-items:center;
  gap:16px;
}
.ann-bar__socials a{
  display:flex;
  align-items:center;
  color:rgba(255,255,255,0.85);
  transition:opacity 0.2s;
}
.ann-bar__socials a:hover{opacity:1}
.ann-bar__socials svg{width:16px;height:16px}
.ann-text{
  text-align:center;
  letter-spacing:0.02em;
  color:rgba(255,255,255,0.95);
}
.ann-text strong{
  font-weight:700;
  color:#ffffff;
  border-bottom:1.5px solid rgba(255,255,255,0.8);
  padding-bottom:1px;
}

/* MAIN WRAPPER WITH ROUNDED CORNERS */
.main-wrapper{
  background:#ffffff;
  border-radius:24px 24px 0 0;
  min-height:100vh;
  box-shadow:0 -4px 30px rgba(0,0,0,0.15);
  position:relative;
  z-index:10;
  padding-bottom:80px;
}

/* NAVIGATION HEADER */
.header{
  height:84px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 var(--px);
  max-width:var(--container);
  margin:0 auto;
}
.logo-group{
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  text-decoration:none;
}
.logo-mark{
  font-family:var(--font-serif);
  font-size:32px;
  font-weight:700;
  line-height:0.9;
  color:#000;
  letter-spacing:-0.02em;
}
.logo-text{
  font-size:8.5px;
  font-weight:600;
  letter-spacing:0.25em;
  text-transform:uppercase;
  color:#666;
  margin-top:3px;
}
.nav-menu{
  display:flex;
  align-items:center;
  gap:28px;
}
.nav-link{
  font-size:14px;
  font-weight:500;
  color:#1A1A1A;
  transition:color 0.2s;
  padding:6px 0;
  position:relative;
}
.nav-link:hover{color:#000}
.nav-link::after{
  content:'';
  position:absolute;
  bottom:0;
  left:0;
  width:100%;
  height:1.5px;
  background:#000;
  transform:scaleX(0);
  transition:transform 0.2s var(--ease);
  transform-origin:left;
}
.nav-link:hover::after{transform:scaleX(1)}

.nav-icons{
  display:flex;
  align-items:center;
  gap:18px;
}
.icon-btn{
  width:38px;
  height:38px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:50%;
  color:#111;
  transition:background 0.2s, transform 0.2s;
}
.icon-btn:hover{
  background:#f4f4f4;
  transform:scale(1.05);
}
.icon-btn svg{width:20px;height:20px;stroke-width:1.8}

/* HERO SLIDER BANNER */
.hero-banner-container{
  max-width:var(--container);
  margin:12px auto 60px;
  padding:0 var(--px);
}
.hero-banner{
  background:#EAEAEA;
  background-image:
    linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size:40px 40px;
  border-radius:16px;
  display:grid;
  grid-template-columns:52% 48%;
  align-items:center;
  min-height:500px;
  overflow:hidden;
  position:relative;
  box-shadow:inset 0 0 40px rgba(0,0,0,0.03);
}

.hero-visual-side{
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px;
  position:relative;
}
.hero-visual-img{
  max-height:460px;
  width:auto;
  object-fit:contain;
  filter:drop-shadow(0 16px 32px rgba(0,0,0,0.18));
  transition:transform 0.5s var(--ease);
}
.hero-banner:hover .hero-visual-img{
  transform:scale(1.02);
}

.hero-text-side{
  padding:60px 48px 60px 20px;
  display:flex;
  flex-direction:column;
  align-items:flex-start;
}
.hero-title{
  font-family:var(--font-display);
  font-size:clamp(3.2rem, 5.2vw, 5.8rem);
  font-weight:800;
  line-height:0.95;
  letter-spacing:0.01em;
  text-transform:uppercase;
  color:#111111;
  margin-bottom:12px;
}
.hero-subtitle{
  font-family:var(--font-serif);
  font-size:clamp(1.2rem, 1.8vw, 1.5rem);
  font-style:italic;
  font-weight:400;
  color:#333333;
  margin-bottom:40px;
}
.btn-shop-now{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:16px 48px;
  border:2.5px solid #111111;
  background:transparent;
  color:#111111;
  font-family:var(--font-display);
  font-size:22px;
  font-weight:700;
  letter-spacing:0.06em;
  text-transform:uppercase;
  border-radius:2px;
  transition:all 0.25s var(--ease);
  cursor:pointer;
}
.btn-shop-now:hover{
  background:#111111;
  color:#ffffff;
  transform:translateY(-2px);
  box-shadow:0 8px 24px rgba(0,0,0,0.15);
}

/* CAROUSEL CONTROLS & SECTIONS */
.container-inner{
  max-width:var(--container);
  margin:0 auto;
  padding:0 var(--px);
}
.section-hd{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  margin-bottom:40px;
}
.eyebrow{
  display:inline-flex;
  align-items:center;
  gap:12px;
  font-size:11px;
  font-weight:600;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:#8A8A8A;
  margin-bottom:12px;
}
.eyebrow::before{content:'';width:24px;height:1px;background:#ADADAD}
.section-title{
  font-family:var(--font-serif);
  font-size:clamp(2.2rem,3.2vw,3.6rem);
  font-weight:600;
  letter-spacing:-.025em;
  line-height:1.05;
  color:#0A0A0A;
}
.section-title em{font-style:italic;font-weight:400;color:#8A8A8A}

.grid-5{display:grid;grid-template-columns:repeat(5,1fr);gap:20px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}

.pcard{
  background:#fff;
  border:1px solid #EBEBEB;
  border-radius:6px;
  overflow:hidden;
  cursor:pointer;
  display:flex;
  flex-direction:column;
  transition:all 0.3s var(--ease);
  position:relative;
}
.pcard:hover{
  box-shadow:0 12px 32px rgba(0,0,0,0.08);
  transform:translateY(-4px);
  border-color:#D0D0D0;
}
.pcard__img{
  aspect-ratio:1;
  overflow:hidden;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#F8F8F8;
}
.pcard__img svg{
  width:75%;
  height:75%;
  transition:transform 0.4s var(--ease);
  filter:drop-shadow(0 6px 16px rgba(0,0,0,0.1));
}
.pcard:hover .pcard__img svg{transform:scale(1.06) translateY(-4px)}
.pcard__badges{position:absolute;top:12px;left:12px;display:flex;flex-direction:column;gap:4px;z-index:2}
.badge{display:inline-flex;align-items:center;padding:4px 8px;border-radius:2px;font-size:8.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
.badge--black{background:#0A0A0A;color:#fff}
.badge--sale{background:#2A2A2A;color:#fff}
.pcard__wish{position:absolute;top:12px;right:12px;width:32px;height:32px;background:#fff;border:1px solid #EBEBEB;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:2;opacity:0;transform:scale(.8);transition:all .2s}
.pcard:hover .pcard__wish{opacity:1;transform:scale(1)}
.pcard__wish:hover{background:#0A0A0A;color:#fff}
.pcard__info{padding:16px;flex:1;display:flex;flex-direction:column}
.pcard__brand{font-size:9.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#8A8A8A;margin-bottom:6px}
.pcard__name{font-size:13.5px;font-weight:500;color:#0A0A0A;line-height:1.4;margin-bottom:12px;flex:1}
.pcard__price-row{display:flex;align-items:center;gap:8px;margin-top:auto}
.pcard__price{font-size:14px;font-weight:600;color:#0A0A0A}
.pcard__orig{font-size:12px;color:#ADADAD;text-decoration:line-through}
.pcard__btn{margin-top:12px;display:flex;align-items:center;justify-content:center;width:100%;padding:10px;background:#0A0A0A;color:#fff;border-radius:2px;font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;transition:background .2s}
.pcard__btn:hover{background:#2A2A2A}

/* STATS BAR */
.stats-bar{height:72px;display:flex;align-items:center;overflow:hidden;border-top:1px solid #EBEBEB;border-bottom:1px solid #EBEBEB;background:#fff;margin:60px 0}
.stats-track{display:flex;align-items:center;gap:72px;white-space:nowrap;animation:statsScroll 34s linear infinite}
@keyframes statsScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.stat-item{display:flex;align-items:center;gap:14px;flex-shrink:0}
.stat-item__icon{width:30px;height:30px;display:flex;align-items:center;justify-content:center;color:#0A0A0A}
.stat-item__icon svg{width:22px;height:22px;stroke-width:1.5}
.stat-item__txt{font-size:13px;color:#4A4A4A}
.stat-item__txt strong{font-weight:600;color:#0A0A0A}
.stat-sep{width:1px;height:20px;background:#E4E4E4;flex-shrink:0}

/* BRAND STMT */
.brand-stmt{min-height:460px;display:flex;align-items:center;background:#0A0A0A;border-radius:16px;margin:60px var(--px);color:#fff;position:relative;overflow:hidden}
.brand-stmt__inner{padding:60px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;width:100%}
.bs-ey{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:20px}
.bs-h2{font-family:var(--font-serif);font-size:clamp(2.8rem,4vw,4.8rem);font-weight:700;line-height:.95;color:#fff}
.bs-h2 em{font-style:italic;font-weight:300;color:rgba(255,255,255,.5)}
.bs-body{font-size:15px;font-weight:300;line-height:1.75;color:rgba(255,255,255,.5);margin-bottom:32px;max-width:420px}
.bs-stats{display:flex;gap:40px;padding-top:32px;border-top:1px solid rgba(255,255,255,.1)}
.bs-stat__n{font-family:var(--font-serif);font-size:2.2rem;font-weight:700;color:#fff}
.bs-stat__l{font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:6px}

/* FOOTER */
.footer{background:#0A0A0A;color:#fff;padding:60px 0 0;margin-top:60px;border-radius:0 0 24px 24px}
.footer-main{max-width:var(--container);margin:0 auto;padding:0 var(--px) 48px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;border-bottom:1px solid rgba(255,255,255,.08)}
.footer-logo{font-family:var(--font-serif);font-size:28px;font-weight:700;margin-bottom:4px}
.footer-logo-sub{font-size:8px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:20px}
.footer-col-title{font-size:10.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:18px}
.footer-links{display:flex;flex-direction:column;gap:12px}
.footer-link{font-size:13px;color:rgba(255,255,255,.35);transition:color .15s}
.footer-link:hover{color:rgba(255,255,255,.85)}
.footer-bottom{max-width:var(--container);margin:0 auto;padding:20px var(--px);display:flex;align-items:center;justify-content:space-between;font-size:12px;color:rgba(255,255,255,.2)}
</style>
</head>
<body>

<!-- TOP SUB HEADER -->
<div class="ann-bar" role="banner">
    <div class="ann-bar__socials">
        <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg></a>
        <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="4"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/></svg></a>
    </div>
    <div class="ann-text">
        <strong>Free Shipping</strong> on All Prepaid Orders
    </div>
</div>

<!-- MAIN ROUNDED WRAPPER -->
<div class="main-wrapper">

    <!-- HEADER / NAVIGATION -->
    <header class="header">
        <a href="/" class="logo-group">
            <div class="logo-mark">KM</div>
            <div class="logo-text">KICKS MACHINE</div>
        </a>

        <nav class="nav-menu">
            <a href="#" class="nav-link">Sneakers</a>
            <a href="#" class="nav-link">Luxury Footwear</a>
            <a href="#" class="nav-link">Bags</a>
            <a href="#" class="nav-link">Beauty</a>
            <a href="#" class="nav-link">Clothing</a>
            <a href="#" class="nav-link">Hype &amp; Care</a>
            <a href="#" class="nav-link">Track Your Order</a>
        </nav>

        <div class="nav-icons">
            <button class="icon-btn" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            <button class="icon-btn" aria-label="Account">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <button class="icon-btn" aria-label="Cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </button>
        </div>
    </header>

    <!-- HERO SLIDER BANNER -->
    <div class="hero-banner-container">
        <div class="hero-banner">
            <div class="hero-visual-side">
                <img class="hero-visual-img" src="hero_banner.png" alt="Stocked and Loaded - Retro TVs showing luxury products">
            </div>
            <div class="hero-text-side">
                <h1 class="hero-title">STOCKED &amp; LOADED</h1>
                <p class="hero-subtitle">Finest collection of hyped and luxury.</p>
                <button class="btn-shop-now">SHOP NOW</button>
            </div>
        </div>
    </div>

    <!-- TRENDING THIS WEEK -->
    <section style="margin-top:60px">
        <div class="container-inner">
            <div class="section-hd">
                <div>
                    <div class="eyebrow">Right Now</div>
                    <h2 class="section-title">Trending <em>This Week</em></h2>
                </div>
            </div>
            <div class="grid-5">
                <article class="pcard">
                    <div class="pcard__img">
                        <svg viewBox="0 0 300 200" fill="none"><ellipse cx="150" cy="186" rx="124" ry="11" fill="#C8C8C8"/><path d="M30,166 Q150,179 270,164 L268,179 Q150,193 32,178 Z" fill="#111"/><path d="M32,149 Q150,163 268,148 L270,166 Q150,180 30,166 Z" fill="white"/><path d="M35,149 C35,149 55,93 105,76 C135,65 162,68 185,79 C215,93 242,115 258,135 C266,147 260,158 252,163 Z" fill="#1a1a1a"/><path d="M35,149 C35,149 50,119 65,107 C80,94 102,89 122,93 C140,97 148,118 144,137 C140,153 118,161 96,163 C70,165 38,161 35,149 Z" fill="white"/><path d="M38,149 C25,141 23,121 32,102 C45,79 68,73 92,72 C114,71 126,87 124,106 C122,123 104,138 82,146 C60,153 42,157 38,149 Z" fill="#5A9AE0"/></svg>
                        <div class="pcard__badges"><span class="badge badge--black">Hot</span></div>
                        <button class="pcard__wish" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
                    </div>
                    <div class="pcard__info">
                        <div class="pcard__brand">Nike / Jordan</div>
                        <div class="pcard__name">Air Jordan 1 Low Black Dark Powder Blue</div>
                        <div class="pcard__price-row"><span class="pcard__price">&#8377;8,899</span><span class="pcard__orig">&#8377;18,899</span></div>
                        <button class="pcard__btn">Buy Now</button>
                    </div>
                </article>

                <article class="pcard">
                    <div class="pcard__img" style="background:#FAF8F5">
                        <svg viewBox="0 0 300 200" fill="none"><ellipse cx="150" cy="186" rx="124" ry="11" fill="#D0C8C0"/><path d="M30,166 Q150,179 270,164 L268,179 Q150,193 32,178 Z" fill="#3a2a1a"/><path d="M32,149 Q150,163 268,148 L270,166 Q150,180 30,166 Z" fill="#C8B898"/><path d="M35,149 C35,149 55,93 105,76 C135,65 162,68 185,79 C215,93 242,115 258,135 C266,147 260,158 252,163 Z" fill="#EAD8C0"/><path d="M35,149 C35,149 50,119 65,107 C80,94 102,89 122,93 C140,97 148,118 144,137 C140,153 118,161 96,163 C70,165 38,161 35,149 Z" fill="#F5EDE0"/><path d="M155,96 L218,132" stroke="#1a1a1a" stroke-width="7.5" fill="none" stroke-linecap="round"/><path d="M169,90 L232,126" stroke="#1a1a1a" stroke-width="7.5" fill="none" stroke-linecap="round"/></svg>
                        <div class="pcard__badges"><span class="badge badge--sale">Sale</span></div>
                        <button class="pcard__wish" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
                    </div>
                    <div class="pcard__info">
                        <div class="pcard__brand">Adidas</div>
                        <div class="pcard__name">Samba OG Cloud White Core Black Gum</div>
                        <div class="pcard__price-row"><span class="pcard__price">&#8377;9,499</span><span class="pcard__orig">&#8377;16,999</span></div>
                        <button class="pcard__btn">Buy Now</button>
                    </div>
                </article>

                <article class="pcard">
                    <div class="pcard__img" style="background:#F4F6F9">
                        <svg viewBox="0 0 300 200" fill="none"><ellipse cx="150" cy="186" rx="124" ry="11" fill="#B8C8D8"/><path d="M30,166 Q150,179 270,164 L268,179 Q150,193 32,178 Z" fill="#1a1a1a"/><path d="M32,149 Q150,163 268,148 L270,166 Q150,180 30,166 Z" fill="white"/><path d="M35,149 C35,149 55,93 105,76 C135,65 162,68 185,79 C215,93 242,115 258,135 C266,147 260,158 252,163 Z" fill="#3A6EC4"/><path d="M35,149 C35,149 50,119 65,107 C80,94 102,89 122,93 C140,97 148,118 144,137 C140,153 118,161 96,163 C70,165 38,161 35,149 Z" fill="#F5F5F5"/></svg>
                        <div class="pcard__badges"><span class="badge badge--black">Instant Ship</span></div>
                        <button class="pcard__wish" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
                    </div>
                    <div class="pcard__info">
                        <div class="pcard__brand">Nike</div>
                        <div class="pcard__name">Dunk Low Retro University Blue</div>
                        <div class="pcard__price-row"><span class="pcard__price">&#8377;7,399</span><span class="pcard__orig">&#8377;12,999</span></div>
                        <button class="pcard__btn">Buy Now</button>
                    </div>
                </article>

                <article class="pcard">
                    <div class="pcard__img">
                        <svg viewBox="0 0 300 200" fill="none"><ellipse cx="150" cy="190" rx="128" ry="9" fill="#888"/><path d="M24,166 Q150,181 276,164 L273,180 Q150,196 26,179 Z" fill="#0f0f0f"/><path d="M27,149 Q150,164 273,148 L276,166 Q150,182 24,166 Z" fill="#1e1e1e"/><path d="M78,149 C78,149 98,120 140,113 C162,110 188,113 204,126 C218,138 212,154 202,160 Z" fill="#2e2e2e"/><circle cx="106" cy="130" r="7.5" fill="#1e1e1e"/><circle cx="124" cy="123" r="7.5" fill="#1e1e1e"/><circle cx="142" cy="119" r="7.5" fill="#1e1e1e"/><circle cx="160" cy="121" r="7.5" fill="#1e1e1e"/></svg>
                        <div class="pcard__badges"><span class="badge badge--black">Instant Ship</span></div>
                        <button class="pcard__wish" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
                    </div>
                    <div class="pcard__info">
                        <div class="pcard__brand">Adidas Yeezy</div>
                        <div class="pcard__name">Adidas Yeezy Slide Onyx</div>
                        <div class="pcard__price-row"><span class="pcard__price">&#8377;10,499</span><span class="pcard__orig">&#8377;15,000</span></div>
                        <button class="pcard__btn">Buy Now</button>
                    </div>
                </article>

                <article class="pcard">
                    <div class="pcard__img" style="background:#F9F4F9">
                        <svg viewBox="0 0 300 200" fill="none"><ellipse cx="150" cy="186" rx="124" ry="11" fill="#C0B0C0"/><path d="M30,166 Q150,179 270,164 L268,179 Q150,193 32,178 Z" fill="#4a2a4a"/><path d="M32,149 Q150,163 268,148 L270,166 Q150,180 30,166 Z" fill="#E0C8E0"/><path d="M35,149 C35,149 55,93 105,76 C135,65 162,68 185,79 C215,93 242,115 258,135 C266,147 260,158 252,163 Z" fill="#C070B0"/><path d="M35,149 C35,149 50,119 65,107 C80,94 102,89 122,93 C140,97 148,118 144,137 C140,153 118,161 96,163 C70,165 38,161 35,149 Z" fill="#F5E8F5"/></svg>
                        <div class="pcard__badges"><span class="badge badge--sale">Monsoon Sale</span></div>
                        <button class="pcard__wish" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
                    </div>
                    <div class="pcard__info">
                        <div class="pcard__brand">Nike</div>
                        <div class="pcard__name">Dunk Low Rose Whisper Sale</div>
                        <div class="pcard__price-row"><span class="pcard__price">&#8377;7,399</span><span class="pcard__orig">&#8377;12,999</span></div>
                        <button class="pcard__btn">Buy Now</button>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <!-- STATS BAR -->
    <div class="stats-bar">
        <div class="stats-track">
            <div class="stat-item"><div class="stat-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div><div class="stat-item__txt"><strong>100%</strong> Authenticity Guaranteed</div></div>
            <div class="stat-sep"></div>
            <div class="stat-item"><div class="stat-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 7H4C2.9 7 2 7.9 2 9v10a2 2 0 002 2h16a2 2 0 002-2V9c0-1.1-.9-2-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg></div><div class="stat-item__txt"><strong>50,000+</strong> Unique SKUs</div></div>
            <div class="stat-sep"></div>
            <div class="stat-item"><div class="stat-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="stat-item__txt"><strong>1,00,000+</strong> Happy Customers</div></div>
            <div class="stat-sep"></div>
            <div class="stat-item"><div class="stat-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div><div class="stat-item__txt"><strong>Free</strong> Shipping on Prepaid</div></div>
        </div>
    </div>

    <!-- BRAND STATEMENT -->
    <section class="brand-stmt">
        <div class="brand-stmt__inner">
            <div>
                <div class="bs-ey">Our Promise</div>
                <h2 class="bs-h2">Redefining<br><em>Luxury</em><br>Resale.</h2>
            </div>
            <div>
                <p class="bs-body">Every piece is hand-verified by expert authenticators. We believe luxury should be accessible and authenticity non-negotiable.</p>
                <div class="bs-stats">
                    <div><div class="bs-stat__n">50K+</div><div class="bs-stat__l">Unique SKUs</div></div>
                    <div><div class="bs-stat__n">100K+</div><div class="bs-stat__l">Customers</div></div>
                    <div><div class="bs-stat__n">100%</div><div class="bs-stat__l">Authentic</div></div>
                </div>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="footer-main">
            <div>
                <div class="footer-logo">KM</div>
                <div class="footer-logo-sub">KICKS MACHINE</div>
                <p style="font-size:13px;line-height:1.7;color:rgba(255,255,255,0.4);max-width:280px;">India's premier destination for authentic luxury sneakers, streetwear, and designer products.</p>
            </div>
            <div>
                <div class="footer-col-title">Shop</div>
                <ul class="footer-links">
                    <li><a href="#" class="footer-link">Sneakers</a></li>
                    <li><a href="#" class="footer-link">Luxury Footwear</a></li>
                    <li><a href="#" class="footer-link">Bags</a></li>
                    <li><a href="#" class="footer-link">Beauty</a></li>
                    <li><a href="#" class="footer-link">Clothing</a></li>
                </ul>
            </div>
            <div>
                <div class="footer-col-title">Support</div>
                <ul class="footer-links">
                    <li><a href="#" class="footer-link">Track Your Order</a></li>
                    <li><a href="#" class="footer-link">Authentication</a></li>
                    <li><a href="#" class="footer-link">Shipping Policy</a></li>
                    <li><a href="#" class="footer-link">Contact Us</a></li>
                </ul>
            </div>
            <div>
                <div class="footer-col-title">Company</div>
                <ul class="footer-links">
                    <li><a href="#" class="footer-link">About Us</a></li>
                    <li><a href="#" class="footer-link">Store Locations</a></li>
                    <li><a href="#" class="footer-link">Privacy Policy</a></li>
                    <li><a href="#" class="footer-link">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <div>&copy; 2026 Kicks Machine. All rights reserved.</div>
            <div>100% Verified Authentic Resale</div>
        </div>
    </footer>

</div>

</body>
</html>
"""

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)
print("Updated index.html directly!")
