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
  --ease:cubic-bezier(0.25, 1, 0.5, 1);
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

/* TRENDING THIS WEEK - 3D LANDSCAPE COVERFLOW */
.container-inner{
  max-width:var(--container);
  margin:0 auto;
  padding:0 var(--px);
}
.trending-section{
  margin-top:70px;
  position:relative;
}
.section-hd-flex{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  margin-bottom:30px;
}
.eyebrow-line{
  display:inline-flex;
  align-items:center;
  gap:10px;
  font-size:11px;
  font-weight:600;
  letter-spacing:.2em;
  text-transform:uppercase;
  color:#777777;
  margin-bottom:10px;
}
.eyebrow-line::before{content:'—';color:#777777;font-weight:700}

.trending-h2{
  font-family:var(--font-sans);
  font-size:clamp(2.5rem, 3.8vw, 4.2rem);
  font-weight:400;
  letter-spacing:-0.02em;
  color:#111111;
  line-height:1;
}
.trending-h2 em{
  font-family:var(--font-serif);
  font-style:italic;
  font-weight:400;
  color:#111111;
}

.btn-view-all{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:12px 28px;
  border:1px solid #111111;
  background:transparent;
  color:#111111;
  font-size:11px;
  font-weight:700;
  letter-spacing:0.12em;
  text-transform:uppercase;
  border-radius:2px;
  transition:all 0.2s var(--ease);
}
.btn-view-all:hover{
  background:#111111;
  color:#ffffff;
}

/* 3D LANDSCAPE COVERFLOW CAROUSEL */
.coverflow-viewport{
  position:relative;
  width:100%;
  min-height:420px;
  perspective:1200px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  padding:30px 0 10px;
}
.coverflow-watermark{
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%, -50%);
  font-family:var(--font-display);
  font-size:clamp(160px, 22vw, 320px);
  font-weight:800;
  letter-spacing:0.02em;
  color:rgba(0,0,0,0.035);
  user-select:none;
  pointer-events:none;
  white-space:nowrap;
  z-index:0;
}

.coverflow-stage{
  position:relative;
  width:100%;
  max-width:1100px;
  height:330px;
  display:flex;
  align-items:center;
  justify-content:center;
  transform-style:preserve-3d;
  z-index:2;
}

.cover-card{
  position:absolute;
  width:580px;
  height:290px;
  background:#ffffff;
  border-radius:24px;
  padding:24px 28px;
  display:grid;
  grid-template-columns:42% 58%;
  align-items:center;
  gap:16px;
  box-shadow:0 20px 48px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04);
  transition:transform 0.55s var(--ease), opacity 0.55s var(--ease), box-shadow 0.55s var(--ease);
  cursor:pointer;
  user-select:none;
  border:1px solid rgba(0,0,0,0.05);
}

.cover-card.pos-center{
  transform:translate3d(0, 0, 0) scale(1) rotateY(0deg);
  opacity:1;
  z-index:10;
}
.cover-card.pos-left{
  transform:translate3d(-320px, 0, -110px) scale(0.84) rotateY(24deg);
  opacity:0.75;
  z-index:5;
  filter:brightness(0.96);
}
.cover-card.pos-right{
  transform:translate3d(320px, 0, -110px) scale(0.84) rotateY(-24deg);
  opacity:0.75;
  z-index:5;
  filter:brightness(0.96);
}

.card-img-wrap{
  height:100%;
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#F8F8F8;
  border-radius:16px;
  padding:16px;
  overflow:hidden;
  position:relative;
}
.card-img-wrap img{
  max-height:190px;
  width:auto;
  object-fit:contain;
  transition:transform 0.4s var(--ease);
  filter:drop-shadow(0 10px 20px rgba(0,0,0,0.12));
  position:relative;
  z-index:2;
}

.card-details{
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  height:100%;
  padding:8px 0 4px;
}
.card-brand{
  font-size:9.5px;
  font-weight:700;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:#999999;
}
.card-title{
  font-size:15px;
  font-weight:600;
  color:#111111;
  line-height:1.35;
  margin-top:6px;
}
.card-footer-row{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  margin-top:auto;
  padding-top:12px;
}
.card-price-current{
  font-size:16px;
  font-weight:700;
  color:#111111;
}
.card-price-orig{
  font-size:12px;
  color:#aaaaaa;
  text-decoration:line-through;
  margin-top:2px;
  display:block;
}
.btn-buy-pill{
  padding:10px 22px;
  background:#111111;
  color:#ffffff;
  font-size:10.5px;
  font-weight:700;
  letter-spacing:0.1em;
  text-transform:uppercase;
  border-radius:20px;
  transition:all 0.2s var(--ease);
}
.btn-buy-pill:hover{
  background:#333333;
}

/* PAGINATION CONTROLS BELOW COVERFLOW */
.coverflow-controls{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:20px;
  margin:20px 0 60px;
}
.ctrl-arrow{
  width:36px;
  height:36px;
  border-radius:50%;
  border:1px solid #E4E4E4;
  background:#ffffff;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#666666;
  cursor:pointer;
  transition:all 0.2s var(--ease);
}
.ctrl-arrow:hover{
  background:#111111;
  color:#ffffff;
  border-color:#111111;
}
.ctrl-dashes{
  display:flex;
  align-items:center;
  gap:8px;
}
.ctrl-dash{
  width:20px;
  height:2px;
  background:#E0E0E0;
  border-radius:1px;
  transition:all 0.3s var(--ease);
  cursor:pointer;
}
.ctrl-dash.active{
  width:32px;
  background:#111111;
}

/* MARQUEE TRUST BAR */
.marquee-trust-bar{
  height:80px;
  display:flex;
  align-items:center;
  overflow:hidden;
  border-top:1px solid #EBEBEB;
  border-bottom:1px solid #EBEBEB;
  background:#ffffff;
  margin-bottom:80px;
}
.trust-track{
  display:flex;
  align-items:center;
  gap:80px;
  white-space:nowrap;
  animation:trustMarquee 30s linear infinite;
}
@keyframes trustMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.trust-item{
  display:flex;
  align-items:center;
  gap:16px;
  flex-shrink:0;
}
.trust-badge-icon{
  width:44px;
  height:44px;
  border-radius:8px;
  background:#F5F5F5;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:12px;
  font-weight:800;
  color:#111111;
}
.trust-text{
  font-size:14px;
  font-weight:600;
  color:#111111;
}

/* INSTANT SHIP SECTION */
.instant-ship-title{
  font-family:var(--font-sans);
  font-size:clamp(2.8rem, 4.5vw, 5rem);
  font-weight:800;
  text-align:center;
  color:#111111;
  margin-bottom:48px;
  letter-spacing:-0.03em;
}

.grid-5-products{
  display:grid;
  grid-template-columns:repeat(5, 1fr);
  gap:20px;
  margin-bottom:48px;
}

/* PRODUCT CARD WITH WATERMARK LNKICKS */
.product-card-clean{
  background:#ffffff;
  border-radius:4px;
  display:flex;
  flex-direction:column;
  position:relative;
  cursor:pointer;
  transition:transform 0.3s var(--ease);
}
.product-card-clean:hover{
  transform:translateY(-4px);
}
.badge-pill-black{
  position:absolute;
  top:12px;
  left:0;
  background:#000000;
  color:#ffffff;
  font-size:8px;
  font-weight:800;
  letter-spacing:0.12em;
  text-transform:uppercase;
  padding:4px 10px;
  border-radius:0 2px 2px 0;
  z-index:3;
}
.badge-pill-maroon{
  position:absolute;
  top:12px;
  left:0;
  background:#7a1a1a;
  color:#ffffff;
  font-size:8.5px;
  font-weight:800;
  letter-spacing:0.12em;
  text-transform:uppercase;
  padding:5px 12px;
  border-radius:0 2px 2px 0;
  z-index:3;
}

.product-card-clean__img{
  aspect-ratio:1;
  background:#F9F9F9;
  border-radius:4px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:16px;
  margin-bottom:16px;
  overflow:hidden;
  position:relative;
}

/* WATERMARK OVERLAY "LNKICKS" */
.card-watermark{
  position:absolute;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:var(--font-sans);
  font-size:38px;
  font-weight:900;
  color:rgba(0,0,0,0.045);
  letter-spacing:0.14em;
  text-transform:uppercase;
  pointer-events:none;
  user-select:none;
  z-index:1;
}

.product-card-clean__img img, .product-card-clean__img svg{
  width:100%;
  height:auto;
  max-height:180px;
  object-fit:contain;
  transition:transform 0.4s var(--ease);
  position:relative;
  z-index:2;
}
.product-card-clean:hover .product-card-clean__img img,
.product-card-clean:hover .product-card-clean__img svg{
  transform:scale(1.06);
}

.product-card-clean__brand{
  font-size:9px;
  font-weight:700;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:#aaaaaa;
  text-align:center;
  margin-bottom:6px;
}
.product-card-clean__name{
  font-size:14px;
  font-weight:600;
  color:#111111;
  text-align:center;
  line-height:1.35;
  margin-bottom:10px;
  min-height:38px;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;
}
.product-card-clean__price{
  text-align:center;
  font-size:13px;
  color:#666666;
}
.product-card-clean__price strong{
  color:#d9534f;
  font-weight:700;
}
.product-card-clean__price .orig{
  text-decoration:line-through;
  color:#b0b0b0;
  margin-left:6px;
  font-size:12px;
}

.btn-view-all-center{
  display:flex;
  justify-content:center;
  margin-bottom:90px;
}
.btn-pill-viewall{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:14px 40px;
  background:#111111;
  color:#ffffff;
  font-size:12px;
  font-weight:700;
  letter-spacing:0.1em;
  text-transform:uppercase;
  border-radius:30px;
  transition:all 0.25s var(--ease);
}
.btn-pill-viewall:hover{
  background:#333333;
  transform:translateY(-2px);
  box-shadow:0 8px 24px rgba(0,0,0,0.15);
}

/* ALL SNEAKERS / THE SNEAKER VAULT SECTION */
.sneaker-vault-section{
  margin-top:20px;
  margin-bottom:90px;
}
.grid-4-products{
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  gap:32px 24px;
  margin-top:44px;
}

/* ON RUNNING SHOES SECTION */
.on-running-section{
  margin-top:20px;
  margin-bottom:90px;
}
.on-running-header{
  text-align:center;
  margin-bottom:32px;
}
.on-running-title{
  font-family:var(--font-sans);
  font-size:clamp(3rem, 5vw, 5.2rem);
  font-weight:800;
  letter-spacing:-0.03em;
  color:#111111;
  margin-bottom:12px;
}
.on-running-subtitle{
  font-size:18px;
  font-weight:500;
  color:#333333;
  letter-spacing:-0.01em;
  margin-bottom:28px;
}
.on-running-arrows{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:14px;
  margin-bottom:48px;
}

/* DESIGNER SNEAKERS / LUXURY FOOTWEAR SECTION */
.designer-sneakers-section{
  margin-top:20px;
  margin-bottom:90px;
}
.designer-header-center{
  text-align:center;
  margin-bottom:36px;
}
.designer-title{
  font-family:var(--font-sans);
  font-size:clamp(3rem, 5vw, 5.2rem);
  font-weight:800;
  letter-spacing:-0.03em;
  color:#111111;
  margin-bottom:28px;
}
.brand-pills-row{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:14px;
  flex-wrap:wrap;
  position:relative;
}
.brand-pill{
  padding:12px 28px;
  border-radius:30px;
  font-size:14px;
  font-weight:600;
  background:#F5F5F5;
  color:#111111;
  cursor:pointer;
  transition:all 0.2s var(--ease);
}
.brand-pill.active{
  background:#111111;
  color:#ffffff;
}
.brand-pill:hover:not(.active){
  background:#EAEAEA;
}
.brand-arrows{
  display:flex;
  align-items:center;
  gap:10px;
  margin-left:12px;
}

/* BRANDS AT LNKICKS SLIDER SECTION (EXACT MATCH TO SCREENSHOT) */
.brands-lnkicks-section{
  margin-top:20px;
  margin-bottom:90px;
  text-align:center;
}
.brands-lnkicks-title{
  font-family:var(--font-sans);
  font-size:clamp(3rem, 5vw, 5.2rem);
  font-weight:800;
  letter-spacing:-0.03em;
  color:#111111;
  margin-bottom:48px;
}
.brands-logo-slider-container{
  width:100%;
  overflow:hidden;
  padding:20px 0;
  position:relative;
}
.brands-logo-track{
  display:flex;
  align-items:center;
  gap:70px;
  white-space:nowrap;
  animation:brandMarquee 28s linear infinite;
}
@keyframes brandMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

.brand-logo-item{
  flex-shrink:0;
  display:flex;
  align-items:center;
  justify-content:center;
  height:60px;
  min-width:110px;
  transition:opacity 0.2s, transform 0.2s;
  cursor:pointer;
}
.brand-logo-item:hover{
  transform:scale(1.08);
}
.brand-logo-item svg, .brand-logo-item img{
  height:44px;
  width:auto;
  max-width:140px;
  object-fit:contain;
}

/* BRAND STMT & FOOTER */
.brand-stmt{min-height:460px;display:flex;align-items:center;background:#0A0A0A;border-radius:16px;margin:60px var(--px);color:#fff;position:relative;overflow:hidden}
.brand-stmt__inner{padding:60px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;width:100%}
.bs-ey{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:20px}
.bs-h2{font-family:var(--font-serif);font-size:clamp(2.8rem,4vw,4.8rem);font-weight:700;line-height:.95;color:#fff}
.bs-h2 em{font-style:italic;font-weight:300;color:rgba(255,255,255,.5)}
.bs-body{font-size:15px;font-weight:300;line-height:1.75;color:rgba(255,255,255,.5);margin-bottom:32px;max-width:420px}
.bs-stats{display:flex;gap:40px;padding-top:32px;border-top:1px solid rgba(255,255,255,.1)}
.bs-stat__n{font-family:var(--font-serif);font-size:2.2rem;font-weight:700;color:#fff}
.bs-stat__l{font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:6px}

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

    <!-- TRENDING THIS WEEK - 3D LANDSCAPE COVERFLOW SLIDER -->
    <section class="trending-section">
        <div class="container-inner">
            <div class="section-hd-flex">
                <div>
                    <div class="eyebrow-line">RIGHT NOW</div>
                    <h2 class="trending-h2">Trending <em>This Week</em></h2>
                </div>
                <a href="#" class="btn-view-all">VIEW ALL</a>
            </div>
        </div>

        <!-- 3D COVERFLOW VIEWPORT -->
        <div class="coverflow-viewport">
            <div class="coverflow-watermark">FREE</div>

            <div class="coverflow-stage" id="coverflow-stage">
                
                <!-- CARD 1 (LEFT) -->
                <div class="cover-card pos-left" data-index="0">
                    <div class="card-img-wrap">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="yeezy_700.png" alt="Adidas Yeezy 700 V3 Azael">
                    </div>
                    <div class="card-details">
                        <div>
                            <div class="card-brand">KICKS MACHINE</div>
                            <h3 class="card-title">Adidas Yeezy 700 V3 Azael Luxury Edition</h3>
                        </div>
                        <div class="card-footer-row">
                            <div class="card-price-block">
                                <span class="card-price-current">Rs. 18,999.00</span>
                                <span class="card-price-orig">Rs. 24,999.00</span>
                            </div>
                            <button class="btn-buy-pill">BUY NOW</button>
                        </div>
                    </div>
                </div>

                <!-- CARD 2 (CENTER) -->
                <div class="cover-card pos-center" data-index="1">
                    <div class="card-img-wrap">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="kodak_box.png" alt="Kodak Charmera Keychain Digital Camera Blind Box">
                    </div>
                    <div class="card-details">
                        <div>
                            <div class="card-brand">KICKS MACHINE</div>
                            <h3 class="card-title">Kodak Charmera Keychain Digital Camera Blind Box Collection - Millennium</h3>
                        </div>
                        <div class="card-footer-row">
                            <div class="card-price-block">
                                <span class="card-price-current">Rs. 4,599.00</span>
                                <span class="card-price-orig">Rs. 6,999.00</span>
                            </div>
                            <button class="btn-buy-pill">BUY NOW</button>
                        </div>
                    </div>
                </div>

                <!-- CARD 3 (RIGHT) -->
                <div class="cover-card pos-right" data-index="2">
                    <div class="card-img-wrap">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="jordan_powder_blue.png" alt="Air Jordan 1 Low Dark Powder Blue">
                    </div>
                    <div class="card-details">
                        <div>
                            <div class="card-brand">KICKS MACHINE</div>
                            <h3 class="card-title">Air Jordan 1 Low Black Dark Powder Blue</h3>
                        </div>
                        <div class="card-footer-row">
                            <div class="card-price-block">
                                <span class="card-price-current">Rs. 8,899.00</span>
                                <span class="card-price-orig">Rs. 18,899.00</span>
                            </div>
                            <button class="btn-buy-pill">BUY NOW</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- COVERFLOW PAGINATION CONTROLS -->
        <div class="coverflow-controls">
            <button class="ctrl-arrow" id="btn-prev" aria-label="Previous">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div class="ctrl-dashes">
                <div class="ctrl-dash" data-idx="0"></div>
                <div class="ctrl-dash active" data-idx="1"></div>
                <div class="ctrl-dash" data-idx="2"></div>
            </div>
            <button class="ctrl-arrow" id="btn-next" aria-label="Next">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
        </div>
    </section>

    <!-- MARQUEE TRUST BAR -->
    <div class="marquee-trust-bar">
        <div class="trust-track">
            <div class="trust-item"><div class="trust-badge-icon">50+</div><div class="trust-text">50000+ Unique SKUs</div></div>
            <div class="trust-item"><div class="trust-badge-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div><div class="trust-text">Authenticity Guaranteed</div></div>
            <div class="trust-item"><div class="trust-badge-icon">100K</div><div class="trust-text">100,000+ Customers</div></div>
            <div class="trust-item"><div class="trust-badge-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div class="trust-text">Shop In-Store</div></div>
            <!-- REPEAT MARQUEE -->
            <div class="trust-item"><div class="trust-badge-icon">50+</div><div class="trust-text">50000+ Unique SKUs</div></div>
            <div class="trust-item"><div class="trust-badge-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div><div class="trust-text">Authenticity Guaranteed</div></div>
            <div class="trust-item"><div class="trust-badge-icon">100K</div><div class="trust-text">100,000+ Customers</div></div>
            <div class="trust-item"><div class="trust-badge-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div class="trust-text">Shop In-Store</div></div>
        </div>
    </div>

    <!-- INSTANT SHIP SECTION -->
    <section>
        <div class="container-inner">
            <h2 class="instant-ship-title">Instant Ship</h2>
            
            <div class="grid-5-products">
                
                <!-- PRODUCT 1 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="jordan_powder_blue.png" alt="Air Jordan 1 Low Black Dark Powder Blue">
                    </div>
                    <div class="product-card-clean__brand">KICKS MACHINE</div>
                    <h3 class="product-card-clean__name">Air Jordan 1 Low Black Dark Powder Blue</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 8,899.00</strong> <span class="orig">Rs. 18,899.00</span>
                    </div>
                </article>

                <!-- PRODUCT 2 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="dunk_australia.png" alt="Dunk low Australia Sale">
                    </div>
                    <div class="product-card-clean__brand">DUNK LOW</div>
                    <h3 class="product-card-clean__name">Dunk low Australia Sale</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 7,899.00</strong> <span class="orig">Rs. 15,999.00</span>
                    </div>
                </article>

                <!-- PRODUCT 3 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="dunk_rose.png" alt="Nike Dunk Low 'Rose Whisper' Sale">
                    </div>
                    <div class="product-card-clean__brand">KICKS MACHINE</div>
                    <h3 class="product-card-clean__name">Nike Dunk Low 'Rose Whisper' Sale</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 7,399.00</strong> <span class="orig">Rs. 12,999.00</span>
                    </div>
                </article>

                <!-- PRODUCT 4 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="yeezy_slide.png" alt="Adidas Yeezy Slide Onyx">
                    </div>
                    <div class="product-card-clean__brand">KICKS MACHINE</div>
                    <h3 class="product-card-clean__name">Adidas Yeezy Slide Onyx</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 10,499.00</strong> <span class="orig">Rs. 15,999.00</span>
                    </div>
                </article>

                <!-- PRODUCT 5 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="foam_runner.png" alt="Yeezy Foam Runner 'Carbon' Sale">
                    </div>
                    <div class="product-card-clean__brand">KICKS MACHINE</div>
                    <h3 class="product-card-clean__name">Yeezy Foam Runner 'Carbon' Sale</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 7,999.00</strong> <span class="orig">Rs. 12,999.00</span>
                    </div>
                </article>

            </div>

            <!-- CENTERED VIEW ALL BUTTON -->
            <div class="btn-view-all-center">
                <a href="#" class="btn-pill-viewall">View All &rarr;</a>
            </div>
        </div>
    </section>

    <!-- ALL SNEAKERS / THE SNEAKER VAULT SECTION -->
    <section class="sneaker-vault-section">
        <div class="container-inner">
            <div class="section-hd-flex">
                <div>
                    <div class="eyebrow-line">THE SNEAKER VAULT</div>
                    <h2 class="trending-h2">All <em>Sneakers</em></h2>
                </div>
                <a href="#" class="btn-view-all">VIEW ALL &rarr;</a>
            </div>

            <div class="grid-4-products">
                
                <!-- ROW 1 - PRODUCT 1 -->
                <article class="product-card-clean">
                    <span class="badge-pill-maroon">MONSOON SALE</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="af1_black.png" alt="Nike Air Force 1 Triple Black">
                    </div>
                    <div class="product-card-clean__brand">NIKE</div>
                    <h3 class="product-card-clean__name">Nike Air Force 1 Triple Black</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 6,999.00</strong> <span class="orig">Rs. 10,999.00</span>
                    </div>
                </article>

                <!-- ROW 1 - PRODUCT 2 -->
                <article class="product-card-clean">
                    <span class="badge-pill-maroon">MONSOON SALE</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="samba_og.png" alt="Adidas Samba Og Cloud White Core Black">
                    </div>
                    <div class="product-card-clean__brand">ADIDAS</div>
                    <h3 class="product-card-clean__name">Adidas Samba Og Cloud White Core Black</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 7,499.00</strong> <span class="orig">Rs. 10,999.00</span>
                    </div>
                </article>

                <!-- ROW 1 - PRODUCT 3 -->
                <article class="product-card-clean">
                    <span class="badge-pill-maroon">MONSOON SALE</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none"><path d="M40,160 Q150,175 260,158 L256,172 Q150,188 42,170 Z" fill="#111"/><path d="M42,146 Q150,160 256,144 L260,160 Q150,175 40,160 Z" fill="white"/><path d="M45,146 C45,146 70,80 130,60 C160,50 200,65 220,100 C235,120 248,135 240,145 Z" fill="#9C3A3A"/><path d="M80,146 C80,146 100,105 130,95 C155,90 170,110 165,130 Z" fill="#E8B090"/><path d="M120,70 L200,110" stroke="#4A2A1A" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
                    </div>
                    <div class="product-card-clean__brand">JORDAN</div>
                    <h3 class="product-card-clean__name">Jordan 1 Mid Dusty Peach Night Maroon Womens</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 13,999.00</strong> <span class="orig">Rs. 20,999.00</span>
                    </div>
                </article>

                <!-- ROW 1 - PRODUCT 4 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none"><path d="M35,160 Q150,175 265,158 L262,172 Q150,188 37,170 Z" fill="#111"/><path d="M37,146 Q150,160 262,144 L265,160 Q150,175 35,160 Z" fill="#FAF6ED"/><path d="M40,146 C40,146 65,95 115,82 C145,75 175,85 195,110 C210,125 248,138 242,146 Z" fill="#2E2B2A"/><path d="M75,146 C75,146 95,115 120,105 C145,100 155,118 150,135 Z" fill="#FAF6ED"/><path d="M130,85 L210,125" stroke="#4A2A1A" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
                    </div>
                    <div class="product-card-clean__brand">JORDAN</div>
                    <h3 class="product-card-clean__name">Jordan 1 Low Premium Pale Ivory Off Noir Baroque</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 10,499.00</strong> <span class="orig">Rs. 18,499.00</span>
                    </div>
                </article>

                <!-- ROW 2 - PRODUCT 5 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <img src="jordan_powder_blue.png" alt="Jordan 1 Low White Aluminum (Women'S)">
                    </div>
                    <div class="product-card-clean__brand">JORDAN</div>
                    <h3 class="product-card-clean__name">Jordan 1 Low White Aluminum (Women'S)</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 8,899.00</strong> <span class="orig">Rs. 12,999.00</span>
                    </div>
                </article>

                <!-- ROW 2 - PRODUCT 6 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none"><path d="M40,160 Q150,175 260,158 L256,172 Q150,188 42,170 Z" fill="#d9534f"/><path d="M42,146 Q150,160 256,144 L260,160 Q150,175 40,160 Z" fill="white"/><path d="M45,146 C45,146 70,75 130,55 C160,45 200,60 220,95 C235,115 248,135 240,145 Z" fill="#111111"/><path d="M80,146 C80,146 100,100 130,90 C155,85 170,105 165,125 Z" fill="white"/><path d="M120,65 L200,105" stroke="#d9534f" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
                    </div>
                    <div class="product-card-clean__brand">JORDAN</div>
                    <h3 class="product-card-clean__name">Air Jordan 1 Retro High Og Black Toe Reimagined</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 13,299.00</strong> <span class="orig">Rs. 17,749.00</span>
                    </div>
                </article>

                <!-- ROW 2 - PRODUCT 7 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none"><path d="M35,160 Q150,175 265,158 L262,172 Q150,188 37,170 Z" fill="#d9534f"/><path d="M37,146 Q150,160 262,144 L265,160 Q150,175 35,160 Z" fill="white"/><path d="M40,146 C40,146 65,95 115,82 C145,75 175,85 195,110 C210,125 248,138 242,146 Z" fill="#111111"/><path d="M75,146 C75,146 95,115 120,105 C145,100 155,118 150,135 Z" fill="#d9534f"/><path d="M130,85 L210,125" stroke="#111111" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
                    </div>
                    <div class="product-card-clean__brand">JORDAN</div>
                    <h3 class="product-card-clean__name">Jordan 1 Low Bred Toe 2.0</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 10,499.00</strong> <span class="orig">Rs. 13,699.00</span>
                    </div>
                </article>

                <!-- ROW 2 - PRODUCT 8 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none"><ellipse cx="150" cy="186" rx="124" ry="11" fill="#A88855"/><path d="M30,166 Q150,179 270,164 L268,179 Q150,193 32,178 Z" fill="#907040"/><path d="M32,149 Q150,163 268,148 L270,166 Q150,180 30,166 Z" fill="#1B263B"/><path d="M35,149 C35,149 55,93 105,76 C135,65 162,68 185,79 C215,93 242,115 258,135 C266,147 260,158 252,163 Z" fill="#1B263B"/><path d="M155,96 L218,132" stroke="#ffffff" stroke-width="7.5" fill="none" stroke-linecap="round"/><path d="M169,90 L232,126" stroke="#ffffff" stroke-width="7.5" fill="none" stroke-linecap="round"/><path d="M183,85 L246,121" stroke="#ffffff" stroke-width="7.5" fill="none" stroke-linecap="round"/></svg>
                    </div>
                    <div class="product-card-clean__brand">ADIDAS</div>
                    <h3 class="product-card-clean__name">Adidas Samba Og Night Navy Gum</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 8,399.00</strong> <span class="orig">Rs. 28,499.00</span>
                    </div>
                </article>

            </div>
        </div>
    </section>

    <!-- ON RUNNING SHOES SECTION -->
    <section class="on-running-section">
        <div class="container-inner">
            <div class="on-running-header">
                <h2 class="on-running-title">On Running Shoes</h2>
                <p class="on-running-subtitle">Engineered for Speed. Designed for Style. Half the Price.</p>
                <div class="on-running-arrows">
                    <button class="ctrl-arrow" aria-label="Previous"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m15 18-6-6 6-6"/></svg></button>
                    <button class="ctrl-arrow" aria-label="Next"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 18 6-6-6-6"/></svg></button>
                </div>
            </div>

            <div class="grid-5-products">
                
                <!-- ON RUNNING 1 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none">
                            <path d="M30,165 Q150,178 270,163 L268,178 Q150,192 32,177 Z" fill="#111"/>
                            <path d="M35,148 C35,148 55,95 110,80 C140,70 170,80 190,105 C210,120 250,135 245,148 Z" fill="#1B3B48"/>
                            <ellipse cx="65" cy="162" rx="10" ry="6" fill="#ffffff" stroke="#111" stroke-width="2"/>
                            <ellipse cx="95" cy="164" rx="10" ry="6" fill="#ffffff" stroke="#111" stroke-width="2"/>
                            <ellipse cx="125" cy="165" rx="10" ry="6" fill="#ffffff" stroke="#111" stroke-width="2"/>
                            <ellipse cx="155" cy="164" rx="10" ry="6" fill="#ffffff" stroke="#111" stroke-width="2"/>
                            <ellipse cx="185" cy="163" rx="10" ry="6" fill="#ffffff" stroke="#111" stroke-width="2"/>
                            <ellipse cx="215" cy="161" rx="10" ry="6" fill="#ffffff" stroke="#111" stroke-width="2"/>
                            <circle cx="160" cy="115" r="8" stroke="#ffffff" stroke-width="3.5" fill="none"/>
                        </svg>
                    </div>
                    <div class="product-card-clean__brand">ON RUNNING</div>
                    <h3 class="product-card-clean__name">On Running Cloudmonster Navy Teal</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 13,999.00</strong> <span class="orig">Rs. 19,999.00</span>
                    </div>
                </article>

                <!-- ON RUNNING 2 -->
                <article class="product-card-clean">
                    <span class="badge-pill-maroon">MONSOON SALE</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none">
                            <path d="M30,165 Q150,178 270,163 L268,178 Q150,192 32,177 Z" fill="#D5D5D0"/>
                            <path d="M35,148 C35,148 55,95 110,80 C140,70 170,80 190,105 C210,120 250,135 245,148 Z" fill="#F4F4EE"/>
                            <ellipse cx="65" cy="162" rx="10" ry="6" fill="#ffffff" stroke="#D5D5D0" stroke-width="2"/>
                            <ellipse cx="95" cy="164" rx="10" ry="6" fill="#ffffff" stroke="#D5D5D0" stroke-width="2"/>
                            <ellipse cx="125" cy="165" rx="10" ry="6" fill="#ffffff" stroke="#D5D5D0" stroke-width="2"/>
                            <ellipse cx="155" cy="164" rx="10" ry="6" fill="#ffffff" stroke="#D5D5D0" stroke-width="2"/>
                            <ellipse cx="185" cy="163" rx="10" ry="6" fill="#ffffff" stroke="#D5D5D0" stroke-width="2"/>
                            <circle cx="160" cy="115" r="8" stroke="#111111" stroke-width="3.5" fill="none"/>
                        </svg>
                    </div>
                    <div class="product-card-clean__brand">ON RUNNING</div>
                    <h3 class="product-card-clean__name">On Running Cloudtilt Undyed White</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 14,499.00</strong> <span class="orig">Rs. 21,999.00</span>
                    </div>
                </article>

                <!-- ON RUNNING 3 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none">
                            <path d="M30,165 Q150,178 270,163 L268,178 Q150,192 32,177 Z" fill="#C5BA90"/>
                            <path d="M35,148 C35,148 55,95 110,80 C140,70 170,80 190,105 C210,120 250,135 245,148 Z" fill="#E6E0C5"/>
                            <ellipse cx="65" cy="162" rx="10" ry="6" fill="#ffffff" stroke="#C5BA90" stroke-width="2"/>
                            <ellipse cx="95" cy="164" rx="10" ry="6" fill="#ffffff" stroke="#C5BA90" stroke-width="2"/>
                            <ellipse cx="125" cy="165" rx="10" ry="6" fill="#ffffff" stroke="#C5BA90" stroke-width="2"/>
                            <ellipse cx="155" cy="164" rx="10" ry="6" fill="#ffffff" stroke="#C5BA90" stroke-width="2"/>
                            <circle cx="160" cy="115" r="8" stroke="#111111" stroke-width="3.5" fill="none"/>
                        </svg>
                    </div>
                    <div class="product-card-clean__brand">ON RUNNING</div>
                    <h3 class="product-card-clean__name">On Running Cloudsurfer Sand Gold</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 12,999.00</strong> <span class="orig">Rs. 18,999.00</span>
                    </div>
                </article>

                <!-- ON RUNNING 4 -->
                <article class="product-card-clean">
                    <span class="badge-pill-maroon">MONSOON SALE</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none">
                            <path d="M30,165 Q150,178 270,163 L268,178 Q150,192 32,177 Z" fill="#9DAED4"/>
                            <path d="M35,148 C35,148 55,95 110,80 C140,70 170,80 190,105 C210,120 250,135 245,148 Z" fill="#D6E0F5"/>
                            <ellipse cx="65" cy="162" rx="10" ry="6" fill="#ffffff" stroke="#9DAED4" stroke-width="2"/>
                            <ellipse cx="95" cy="164" rx="10" ry="6" fill="#ffffff" stroke="#9DAED4" stroke-width="2"/>
                            <ellipse cx="125" cy="165" rx="10" ry="6" fill="#ffffff" stroke="#9DAED4" stroke-width="2"/>
                            <ellipse cx="155" cy="164" rx="10" ry="6" fill="#ffffff" stroke="#9DAED4" stroke-width="2"/>
                            <circle cx="160" cy="115" r="8" stroke="#111111" stroke-width="3.5" fill="none"/>
                        </svg>
                    </div>
                    <div class="product-card-clean__brand">ON RUNNING</div>
                    <h3 class="product-card-clean__name">On Running Cloudtilt Lavender Blue</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 14,499.00</strong> <span class="orig">Rs. 21,999.00</span>
                    </div>
                </article>

                <!-- ON RUNNING 5 -->
                <article class="product-card-clean">
                    <span class="badge-pill-maroon">MONSOON SALE</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none">
                            <path d="M30,165 Q150,178 270,163 L268,178 Q150,192 32,177 Z" fill="#0A0A0A"/>
                            <path d="M35,148 C35,148 55,95 110,80 C140,70 170,80 190,105 C210,120 250,135 245,148 Z" fill="#222222"/>
                            <ellipse cx="65" cy="162" rx="10" ry="6" fill="#111111" stroke="#333333" stroke-width="2"/>
                            <ellipse cx="95" cy="164" rx="10" ry="6" fill="#111111" stroke="#333333" stroke-width="2"/>
                            <ellipse cx="125" cy="165" rx="10" ry="6" fill="#111111" stroke="#333333" stroke-width="2"/>
                            <ellipse cx="155" cy="164" rx="10" ry="6" fill="#111111" stroke="#333333" stroke-width="2"/>
                            <circle cx="160" cy="115" r="8" stroke="#ffffff" stroke-width="3.5" fill="none"/>
                        </svg>
                    </div>
                    <div class="product-card-clean__brand">ON RUNNING</div>
                    <h3 class="product-card-clean__name">On Running Cloudmonster All Black</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 13,999.00</strong> <span class="orig">Rs. 19,999.00</span>
                    </div>
                </article>

            </div>
        </div>
    </section>

    <!-- DESIGNER SNEAKERS / LUXURY FOOTWEAR SECTION -->
    <section class="designer-sneakers-section">
        <div class="container-inner">
            <div class="designer-header-center">
                <h2 class="designer-title">Designer Sneakers</h2>
                
                <!-- BRAND PILLS ROW -->
                <div class="brand-pills-row">
                    <div class="brand-pill active">Gucci</div>
                    <div class="brand-pill">Amiri</div>
                    <div class="brand-pill">The Luxury Outlet</div>
                    <div class="brand-pill">Balenciaga</div>
                    <div class="brand-pill">Louis Vuitton</div>
                    <div class="brand-pill">Dior</div>
                    
                    <div class="brand-arrows">
                        <button class="ctrl-arrow" aria-label="Previous"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m15 18-6-6 6-6"/></svg></button>
                        <button class="ctrl-arrow" aria-label="Next"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 18 6-6-6-6"/></svg></button>
                    </div>
                </div>
            </div>

            <!-- 5-COLUMN DESIGNER PRODUCTS GRID -->
            <div class="grid-5-products" style="margin-top:40px">
                
                <!-- DESIGNER PRODUCT 1: GUCCI THONG SANDAL -->
                <article class="product-card-clean">
                    <span class="badge-pill-maroon">MONSOON SALE</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none">
                            <path d="M30,172 L270,168 L265,178 L35,182 Z" fill="#111"/>
                            <path d="M45,170 C70,170 120,130 180,168 Z" stroke="#E63946" stroke-width="12" fill="none"/>
                            <path d="M45,170 C70,170 120,130 180,168 Z" stroke="#2A9D8F" stroke-width="6" fill="none"/>
                            <circle cx="120" cy="148" r="6" stroke="#D4AF37" stroke-width="2" fill="none"/>
                        </svg>
                    </div>
                    <div class="product-card-clean__brand">GUCCI</div>
                    <h3 class="product-card-clean__name">Gucci Web Thong Sandal Black</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 28,999.00</strong> <span class="orig">Rs. 42,000.00</span>
                    </div>
                </article>

                <!-- DESIGNER PRODUCT 2: GUCCI SLIDE INTERLOCKING G -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none">
                            <path d="M30,172 Q150,185 270,170 L265,182 Q150,195 32,184 Z" fill="#111"/>
                            <path d="M100,170 C105,120 170,120 185,170 Z" fill="#111"/>
                            <rect x="110" y="132" width="65" height="12" fill="#E63946"/>
                            <rect x="110" y="144" width="65" height="12" fill="#2A9D8F"/>
                        </svg>
                    </div>
                    <div class="product-card-clean__brand">GUCCI</div>
                    <h3 class="product-card-clean__name">Gucci Slide Interlocking G Black</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 32,499.00</strong> <span class="orig">Rs. 48,000.00</span>
                    </div>
                </article>

                <!-- DESIGNER PRODUCT 3: GUCCI LACE UP SHOE BUCKLE -->
                <article class="product-card-clean">
                    <span class="badge-pill-maroon">MONSOON SALE</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none">
                            <path d="M40,160 Q150,175 260,158 L256,180 Q150,195 42,178 Z" fill="#F4A261"/>
                            <path d="M42,142 C42,142 65,90 125,75 C155,68 190,80 210,105 C225,120 255,135 248,145 Z" fill="#111111"/>
                            <rect x="135" y="105" width="28" height="20" rx="3" stroke="#D4AF37" stroke-width="3" fill="none"/>
                        </svg>
                    </div>
                    <div class="product-card-clean__brand">GUCCI</div>
                    <h3 class="product-card-clean__name">Gucci Lace Up Shoe Buckle Black Orange</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 54,999.00</strong> <span class="orig">Rs. 75,000.00</span>
                    </div>
                </article>

                <!-- DESIGNER PRODUCT 4: GUCCI AGRADO RUBBER SLIDE -->
                <article class="product-card-clean">
                    <span class="badge-pill-maroon">MONSOON SALE</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none">
                            <path d="M30,172 Q150,185 270,170 L265,182 Q150,195 32,184 Z" fill="#111"/>
                            <path d="M90,170 C95,125 150,125 160,170 Z" fill="#E63946"/>
                            <path d="M150,170 C155,125 210,125 220,170 Z" fill="#2A9D8F"/>
                        </svg>
                    </div>
                    <div class="product-card-clean__brand">GUCCI</div>
                    <h3 class="product-card-clean__name">Gucci Agrado Grg Rubber Slide</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 29,999.00</strong> <span class="orig">Rs. 45,000.00</span>
                    </div>
                </article>

                <!-- DESIGNER PRODUCT 5: BALENCIAGA TRACK 2 -->
                <article class="product-card-clean">
                    <span class="badge-pill-black">INSTANT SHIP</span>
                    <div class="product-card-clean__img">
                        <div class="card-watermark">LNKICKS</div>
                        <svg viewBox="0 0 300 200" fill="none">
                            <path d="M30,165 Q150,178 270,163 L268,182 Q150,196 32,180 Z" fill="#111"/>
                            <path d="M35,148 C35,148 60,85 120,70 C150,60 185,75 205,100 C225,118 255,135 248,148 Z" fill="#2A2A2A"/>
                            <path d="M60,140 L120,80 M90,145 L150,85 M120,150 L180,90" stroke="#ffffff" stroke-width="3" fill="none"/>
                        </svg>
                    </div>
                    <div class="product-card-clean__brand">BALENCIAGA</div>
                    <h3 class="product-card-clean__name">Balenciaga Track 2 Black White</h3>
                    <div class="product-card-clean__price">
                        From <strong>Rs. 68,000.00</strong> <span class="orig">Rs. 89,000.00</span>
                    </div>
                </article>

            </div>
        </div>
    </section>

    <!-- BRANDS AT LNKICKS SLIDER SECTION (MATCHING SCREENSHOT) -->
    <section class="brands-lnkicks-section">
        <div class="container-inner">
            <h2 class="brands-lnkicks-title">Brands at LNKICKS</h2>
            
            <div class="brands-logo-slider-container">
                <div class="brands-logo-track">
                    
                    <!-- NIKE -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><path d="M10,35 C50,42 120,25 150,10 C100,18 40,24 25,28 C18,30 12,32 10,35 Z" fill="#111"/><text x="110" y="38" font-family="'Oswald', sans-serif" font-weight="800" font-size="28" fill="#111">NIKE</text></svg>
                    </div>
                    
                    <!-- ADIDAS -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><path d="M30,40 L45,40 L35,15 L20,40 Z M50,40 L65,40 L50,10 L35,40 Z M70,40 L85,40 L65,5 L50,40 Z" fill="#111"/><text x="95" y="38" font-family="'Inter', sans-serif" font-weight="800" font-size="24" fill="#111">adidas</text></svg>
                    </div>

                    <!-- NEW BALANCE -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><text x="10" y="36" font-family="'Oswald', sans-serif" font-weight="800" font-style="italic" font-size="34" fill="#111">N</text><text x="45" y="38" font-family="'Inter', sans-serif" font-weight="700" font-size="18" fill="#111">new balance</text></svg>
                    </div>

                    <!-- JORDAN -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><path d="M25,12 L30,5 L32,15 L42,24 L35,26 L30,42 L25,28 L15,22 Z" fill="#111"/><text x="50" y="36" font-family="'Oswald', sans-serif" font-weight="800" font-size="24" letter-spacing="3" fill="#111">JORDAN</text></svg>
                    </div>

                    <!-- PUMA -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><path d="M15,20 C25,10 35,15 45,12 C40,25 25,32 15,20 Z" fill="#111"/><text x="55" y="36" font-family="'Oswald', sans-serif" font-weight="800" font-size="26" letter-spacing="2" fill="#111">PUMA</text></svg>
                    </div>

                    <!-- REEBOK -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><text x="10" y="36" font-family="'Inter', sans-serif" font-weight="800" font-size="24" letter-spacing="1" fill="#111">Reebok</text></svg>
                    </div>

                    <!-- ON RUNNING / QC -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><circle cx="30" cy="25" r="16" stroke="#111" stroke-width="6" fill="none"/><circle cx="30" cy="18" r="4" fill="#111"/><text x="60" y="35" font-family="'Inter', sans-serif" font-weight="800" font-size="24" fill="#111">On / QC</text></svg>
                    </div>

                    <!-- CONVERSE -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><polygon points="25,10 30,24 44,24 32,32 37,46 25,36 13,46 18,32 6,24 20,24" fill="#111"/><text x="52" y="36" font-family="'Oswald', sans-serif" font-weight="700" font-size="20" letter-spacing="2" fill="#111">CONVERSE</text></svg>
                    </div>

                    <!-- ASICS -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><text x="10" y="36" font-family="'Inter', sans-serif" font-weight="800" font-style="italic" font-size="26" fill="#111">asics</text></svg>
                    </div>

                    <!-- HOKA -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><text x="10" y="36" font-family="'Oswald', sans-serif" font-weight="800" font-size="26" letter-spacing="2" fill="#111">HOKA</text></svg>
                    </div>

                    <!-- VANS -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><text x="10" y="36" font-family="'Oswald', sans-serif" font-weight="800" font-size="28" letter-spacing="3" fill="#111">VANS</text></svg>
                    </div>

                    <!-- CROCS -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><text x="10" y="36" font-family="'Inter', sans-serif" font-weight="800" font-size="24" fill="#111">crocs&trade;</text></svg>
                    </div>

                    <!-- DIOR -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><text x="10" y="38" font-family="'Playfair Display', serif" font-weight="700" font-size="32" fill="#111">Dior</text></svg>
                    </div>

                    <!-- AMIRI -->
                    <div class="brand-logo-item">
                        <svg viewBox="0 0 160 50" fill="none"><text x="10" y="36" font-family="'Oswald', sans-serif" font-weight="700" font-size="26" letter-spacing="4" fill="#111">AMIRI</text></svg>
                    </div>

                    <!-- REPEAT FOR INFINITE MARQUEE SLIDER -->
                    <div class="brand-logo-item"><svg viewBox="0 0 160 50" fill="none"><path d="M10,35 C50,42 120,25 150,10 C100,18 40,24 25,28 C18,30 12,32 10,35 Z" fill="#111"/><text x="110" y="38" font-family="'Oswald', sans-serif" font-weight="800" font-size="28" fill="#111">NIKE</text></svg></div>
                    <div class="brand-logo-item"><svg viewBox="0 0 160 50" fill="none"><path d="M30,40 L45,40 L35,15 L20,40 Z M50,40 L65,40 L50,10 L35,40 Z M70,40 L85,40 L65,5 L50,40 Z" fill="#111"/><text x="95" y="38" font-family="'Inter', sans-serif" font-weight="800" font-size="24" fill="#111">adidas</text></svg></div>
                    <div class="brand-logo-item"><svg viewBox="0 0 160 50" fill="none"><text x="10" y="36" font-family="'Oswald', sans-serif" font-weight="800" font-style="italic" font-size="34" fill="#111">N</text><text x="45" y="38" font-family="'Inter', sans-serif" font-weight="700" font-size="18" fill="#111">new balance</text></svg></div>
                    <div class="brand-logo-item"><svg viewBox="0 0 160 50" fill="none"><path d="M25,12 L30,5 L32,15 L42,24 L35,26 L30,42 L25,28 L15,22 Z" fill="#111"/><text x="50" y="36" font-family="'Oswald', sans-serif" font-weight="800" font-size="24" letter-spacing="3" fill="#111">JORDAN</text></svg></div>

                </div>
            </div>
        </div>
    </section>

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

<!-- INTERACTION SCRIPT -->
<script>
(function(){
    const cards = Array.from(document.querySelectorAll('.cover-card'));
    const dashes = Array.from(document.querySelectorAll('.ctrl-dash'));
    let activeIdx = 1;

    function updateStage() {
        cards.forEach((card, idx) => {
            card.classList.remove('pos-left', 'pos-center', 'pos-right');
            const diff = idx - activeIdx;
            if (diff === 0) {
                card.classList.add('pos-center');
            } else if (diff === -1 || (diff > 1 && idx === 0)) {
                card.classList.add('pos-left');
            } else {
                card.classList.add('pos-right');
            }
        });
        dashes.forEach((d, idx) => {
            d.classList.toggle('active', idx === activeIdx);
        });
    }

    cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            activeIdx = idx;
            updateStage();
        });
    });

    dashes.forEach((d, idx) => {
        d.addEventListener('click', () => {
            activeIdx = idx;
            updateStage();
        });
    });

    document.getElementById('btn-prev').addEventListener('click', () => {
        activeIdx = (activeIdx - 1 + cards.length) % cards.length;
        updateStage();
    });

    document.getElementById('btn-next').addEventListener('click', () => {
        activeIdx = (activeIdx + 1) % cards.length;
        updateStage();
    });

    updateStage();
})();
</script>
</body>
</html>
"""

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)
print("ADDED Brands at LNKICKS slider section with all requested brand logos below Designer Sneakers!")
