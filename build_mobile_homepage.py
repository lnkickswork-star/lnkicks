import os

mobile_homepage_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>LNKICKS — Mobile App Homepage</title>
    <script>
    (function(){
        var isDesktop = window.innerWidth > 768 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isDesktop && !window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%;background:#0f0f0f;font-family:'Inter',sans-serif;color:#111111;-webkit-tap-highlight-color:transparent;overflow-x:hidden}

.app-viewport{
  max-width:440px;
  min-height:100vh;
  margin:0 auto;
  background:#F4F4F6;
  position:relative;
  overflow:hidden;
  box-shadow:0 0 40px rgba(0,0,0,0.5);
  display:flex;
  flex-direction:column;
  justify-content:space-between;
}

/* ==========================================
   1. FULLSCREEN ONBOARDING SPLASH SCREEN
   ========================================== */
.splash-screen{
  position:fixed;
  top:0;
  left:50%;
  transform:translateX(-50%);
  width:100%;
  max-width:440px;
  height:100vh;
  background:#F6F6F6;
  z-index:9999;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  padding:50px 24px 30px;
  transition:transform 0.6s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s ease;
}
.splash-screen.hide{
  transform:translate(-50%, -100%);
  opacity:0;
  pointer-events:none;
}

.splash-top-bar{display:flex;align-items:center;justify-content:space-between;width:100%;z-index:10;}
.splash-brand-tag{font-family:'Oswald',sans-serif;font-size:16px;font-weight:800;letter-spacing:0.12em;color:#111111;}
.btn-skip{font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#777777;padding:8px 16px;background:rgba(0,0,0,0.05);border-radius:20px;border:none;cursor:pointer;}

.splash-art-stage{position:relative;flex:1;display:flex;align-items:center;justify-content:center;margin:20px 0;overflow:hidden;}
.splash-vertical-text{font-family:'Oswald',sans-serif;font-size:110px;font-weight:900;letter-spacing:0.04em;color:#111111;writing-mode:vertical-rl;transform:rotate(180deg);user-select:none;pointer-events:none;line-height:0.9;opacity:0.95;z-index:1;}
.splash-shoe-top{position:absolute;top:4%;left:6%;width:215px;height:auto;filter:drop-shadow(0 20px 30px rgba(0,0,0,0.22));transform:rotate(-28deg);animation:floatShoeTop 4s ease-in-out infinite alternate;z-index:3;}
.splash-shoe-bottom{position:absolute;bottom:6%;right:4%;width:225px;height:auto;filter:drop-shadow(0 20px 30px rgba(0,0,0,0.22));transform:rotate(24deg);animation:floatShoeBottom 4s ease-in-out infinite alternate;z-index:3;}

@keyframes floatShoeTop{from{transform:rotate(-28deg) translateY(0px)}to{transform:rotate(-24deg) translateY(-12px)}}
@keyframes floatShoeBottom{from{transform:rotate(24deg) translateY(0px)}to{transform:rotate(28deg) translateY(12px)}}

.splash-bottom-area{width:100%;z-index:10;}
.splash-headline{font-family:'Oswald',sans-serif;font-size:36px;font-weight:800;line-height:1.05;color:#111111;letter-spacing:-0.02em;margin-bottom:24px;}
.splash-cta-card{background:#111111;border-radius:28px;padding:20px 28px;display:flex;align-items:center;justify-content:space-between;color:#ffffff;cursor:pointer;box-shadow:0 12px 32px rgba(0,0,0,0.25);}
.splash-cta-text{font-family:'Oswald',sans-serif;font-size:18px;font-weight:700;letter-spacing:0.06em;}
.splash-cta-chevrons{font-size:18px;font-weight:800;color:rgba(255,255,255,0.7);}

/* ==========================================
   2. MOBILE APP HOMEPAGE CONTENT
   ========================================== */
.mobile-home-container{
  padding:44px 20px 90px;
  display:flex;
  flex-direction:column;
  gap:24px;
}

/* TOP GREETING & LNKICKS HEADER (MATCHING SCREENSHOT) */
.home-greeting-bar{
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.greeting-sub{
  font-size:14px;
  font-weight:500;
  color:#777777;
  display:flex;
  align-items:center;
  gap:6px;
}
.home-main-title{
  font-family:'Playfair Display',serif;
  font-size:34px;
  font-weight:700;
  font-style:italic;
  color:#111111;
  letter-spacing:-0.02em;
  line-height:1.1;
  margin-top:2px;
}
.btn-notification-bell{
  width:46px;
  height:46px;
  border-radius:50%;
  background:#ffffff;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#111111;
  box-shadow:0 4px 14px rgba(0,0,0,0.05);
  border:none;
  cursor:pointer;
}

/* SEARCH INPUT BAR */
.home-search-bar{
  background:#ffffff;
  border-radius:30px;
  height:54px;
  padding:0 8px 0 20px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  box-shadow:0 4px 20px rgba(0,0,0,0.04);
}
.search-input-inner{
  display:flex;
  align-items:center;
  gap:12px;
  flex:1;
}
.search-input-inner svg{color:#888888;flex-shrink:0;}
.search-input-inner input{
  border:none;
  outline:none;
  font-family:'Inter',sans-serif;
  font-size:14px;
  color:#111111;
  width:100%;
}
.search-input-inner input::placeholder{color:#aaaaaa;}

.btn-filter-settings{
  width:40px;
  height:40px;
  border-radius:50%;
  background:#F0F0F2;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#111111;
  border:none;
  cursor:pointer;
}

/* HOT DEALS 🔥 SLIDER CAROUSEL (3 SHOE BANNERS) */
.section-title-italic{
  font-family:'Playfair Display',serif;
  font-size:22px;
  font-weight:700;
  font-style:italic;
  color:#111111;
  display:flex;
  align-items:center;
  gap:8px;
}

.hot-deals-slider-wrap{
  display:flex;
  gap:16px;
  overflow-x:auto;
  scrollbar-width:none;
  padding:4px 0 12px;
  margin:0 -20px;
  padding-left:20px;
  padding-right:20px;
}
.hot-deals-slider-wrap::-webkit-scrollbar{display:none}

.hot-deal-banner-card{
  min-width:290px;
  height:175px;
  border-radius:24px;
  overflow:hidden;
  position:relative;
  padding:24px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  color:#ffffff;
  box-shadow:0 12px 30px rgba(0,0,0,0.12);
  flex-shrink:0;
}

.banner-bg-adidas{
  background:linear-gradient(135deg, #111111 0%, #2a2a2a 100%);
}
.banner-bg-nike{
  background:linear-gradient(135deg, #1b2e3c 0%, #0d1720 100%);
}
.banner-bg-reebok{
  background:linear-gradient(135deg, #4a1c1c 0%, #1f0b0b 100%);
}

.banner-shoe-img{
  position:absolute;
  right:-10px;
  bottom:-10px;
  width:170px;
  height:auto;
  object-fit:contain;
  filter:drop-shadow(0 10px 20px rgba(0,0,0,0.35));
  transform:rotate(-14deg);
}

.banner-head{
  font-family:'Oswald',sans-serif;
  font-size:24px;
  font-weight:800;
  line-height:1;
  letter-spacing:0.02em;
}
.banner-sub{
  font-size:12px;
  color:rgba(255,255,255,0.75);
  margin-top:4px;
}
.btn-reveal-pill{
  align-self:flex-start;
  padding:8px 22px;
  background:#ffffff;
  color:#111111;
  font-size:12px;
  font-weight:700;
  border-radius:20px;
  border:none;
  cursor:pointer;
  box-shadow:0 4px 12px rgba(0,0,0,0.15);
}

/* TRENDING NOW SECTION */
.trending-header-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.btn-see-all-pill{
  font-size:12px;
  font-weight:600;
  color:#111111;
  background:#EAEAEA;
  padding:6px 16px;
  border-radius:20px;
  text-decoration:none;
}

.trending-products-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
}

.mob-product-card{
  background:#ffffff;
  border-radius:24px;
  padding:14px;
  display:flex;
  flex-direction:column;
  position:relative;
  box-shadow:0 6px 20px rgba(0,0,0,0.04);
}
.mob-badge-sale{
  position:absolute;
  top:12px;
  left:12px;
  background:#FF3B30;
  color:#ffffff;
  font-size:9.5px;
  font-weight:800;
  padding:4px 10px;
  border-radius:12px;
  z-index:2;
}
.mob-btn-heart{
  position:absolute;
  top:10px;
  right:10px;
  width:32px;
  height:32px;
  border-radius:50%;
  background:#F6F6F8;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#FF3B30;
  z-index:2;
  border:none;
}

.mob-card-img-wrap{
  height:130px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:10px;
  padding:10px;
}
.mob-card-img-wrap img{
  max-height:110px;
  width:auto;
  object-fit:contain;
  filter:drop-shadow(0 8px 16px rgba(0,0,0,0.1));
}

.mob-card-brand{
  font-size:9px;
  font-weight:700;
  letter-spacing:0.14em;
  text-transform:uppercase;
  color:#aaaaaa;
}
.mob-card-title{
  font-size:13px;
  font-weight:600;
  color:#111111;
  margin-top:2px;
  line-height:1.3;
  min-height:34px;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;
}
.mob-card-price{
  font-size:14px;
  font-weight:800;
  color:#FF3B30;
  margin-top:6px;
}
.mob-card-price .orig{
  font-size:11px;
  color:#bbbbbb;
  text-decoration:line-through;
  font-weight:400;
  margin-left:4px;
}

/* STICKY BOTTOM APP NAVIGATION BAR (WITH HOME TAB ACTIVE) */
.app-bottom-nav{
  position:fixed;
  bottom:0;
  left:50%;
  transform:translateX(-50%);
  width:100%;
  max-width:440px;
  height:68px;
  background:#ffffff;
  border-top:1px solid #EBEBEB;
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  align-items:center;
  z-index:1000;
  box-shadow:0 -4px 20px rgba(0,0,0,0.06);
}
.nav-item{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:4px;
  color:#888888;
  font-size:10.5px;
  font-weight:600;
  text-decoration:none;
}
.nav-item.active{
  color:#111111;
}
.nav-item-pill{
  background:#F0F0F2;
  padding:6px 18px;
  border-radius:20px;
  display:flex;
  align-items:center;
  gap:6px;
  color:#111111;
}
.nav-item svg{width:20px;height:20px}
</style>
</head>
<body>

<div class="app-viewport">

    <!-- 1. FULLSCREEN ONBOARDING SPLASH SCREEN -->
    <div class="splash-screen" id="splash-screen">
        <div class="splash-top-bar">
            <div class="splash-brand-tag">LNKICKS</div>
            <button class="btn-skip" id="btn-skip-splash">SKIP</button>
        </div>

        <div class="splash-art-stage">
            <img class="splash-shoe-top" src="jordan_powder_blue_nobg.png" alt="Nike Air Jordan 1">
            <div class="splash-vertical-text">LNKICKS</div>
            <img class="splash-shoe-bottom" src="samba_og_nobg.png" alt="Adidas Samba OG">
        </div>

        <div class="splash-bottom-area">
            <h1 class="splash-headline">Start your<br>sneaker journey</h1>
            <div class="splash-cta-card" id="btn-start-splash">
                <span class="splash-cta-text">Get Started</span>
                <div class="splash-cta-chevrons">&gt;&gt;&gt;</div>
            </div>
        </div>
    </div>

    <!-- 2. MOBILE HOME MAIN CONTENT CONTAINER -->
    <div class="mobile-home-container">
        
        <!-- TOP GREETING & LNKICKS TITLE -->
        <div class="home-greeting-bar">
            <div>
                <div class="greeting-sub">Hello, Sneakerhead <span style="font-size:16px;">👋</span></div>
                <h1 class="home-main-title">LNKICKS</h1>
            </div>
            <button class="btn-notification-bell" aria-label="Notifications">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
        </div>

        <!-- SEARCH INPUT BAR -->
        <div class="home-search-bar">
            <div class="search-input-inner">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" placeholder="Search fashion, sneakers, brands..." aria-label="Search sneakers">
            </div>
            <button class="btn-filter-settings" aria-label="Filter Settings">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            </button>
        </div>

        <!-- HOT DEALS 🔥 SECTION (3 SLIDER BANNERS: ADIDAS, NIKE, REEBOK) -->
        <div>
            <h2 class="section-title-italic">Hot Deals 🔥</h2>
            
            <div class="hot-deals-slider-wrap">
                
                <!-- BANNER 1: ADIDAS -->
                <div class="hot-deal-banner-card banner-bg-adidas">
                    <div>
                        <div class="banner-head">Get 20% off</div>
                        <div class="banner-sub">Enjoy discounts across Adidas collection</div>
                    </div>
                    <button class="btn-reveal-pill">Reveal</button>
                    <img class="banner-shoe-img" src="samba_og_nobg.png" alt="Adidas Banner Shoe">
                </div>

                <!-- BANNER 2: NIKE -->
                <div class="hot-deal-banner-card banner-bg-nike">
                    <div>
                        <div class="banner-head">Free Shipping</div>
                        <div class="banner-sub">On all prepaid Nike drops &amp; luxury orders</div>
                    </div>
                    <button class="btn-reveal-pill">Reveal</button>
                    <img class="banner-shoe-img" src="jordan_powder_blue_nobg.png" alt="Nike Banner Shoe">
                </div>

                <!-- BANNER 3: REEBOK / PUMA -->
                <div class="hot-deal-banner-card banner-bg-reebok">
                    <div>
                        <div class="banner-head">Monsoon Sale</div>
                        <div class="banner-sub">Up to 40% OFF on Hype &amp; Luxury drops</div>
                    </div>
                    <button class="btn-reveal-pill">Reveal</button>
                    <img class="banner-shoe-img" src="puma_velo_nobg.png" alt="Reebok Banner Shoe">
                </div>

            </div>
        </div>

        <!-- TRENDING NOW SECTION (GRID PRODUCT LIST) -->
        <div>
            <div class="trending-header-row" style="margin-bottom:14px;">
                <h2 class="section-title-italic">Trending Now</h2>
                <a href="#" class="btn-see-all-pill">See all</a>
            </div>

            <div class="trending-products-grid">
                
                <!-- PRODUCT 1 -->
                <div class="mob-product-card">
                    <span class="mob-badge-sale">24% OFF</span>
                    <button class="mob-btn-heart" aria-label="Wishlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <div class="mob-card-img-wrap">
                        <img src="af1_black_nobg.png" alt="Nike Air Force 1">
                    </div>
                    <span class="mob-card-brand">NIKE</span>
                    <h3 class="mob-card-title">Nike Air Force 1 Triple Black</h3>
                    <div class="mob-card-price">&#8377;6,999.00 <span class="orig">&#8377;10,999.00</span></div>
                </div>

                <!-- PRODUCT 2 -->
                <div class="mob-product-card">
                    <span class="mob-badge-sale">HOT SALE</span>
                    <button class="mob-btn-heart" aria-label="Wishlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <div class="mob-card-img-wrap">
                        <img src="samba_og_nobg.png" alt="Adidas Samba OG">
                    </div>
                    <span class="mob-card-brand">ADIDAS</span>
                    <h3 class="mob-card-title">Samba OG Cloud White Core Black</h3>
                    <div class="mob-card-price">&#8377;9,499.00 <span class="orig">&#8377;16,999.00</span></div>
                </div>

                <!-- PRODUCT 3 -->
                <div class="mob-product-card">
                    <span class="mob-badge-sale">14% OFF</span>
                    <button class="mob-btn-heart" aria-label="Wishlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <div class="mob-card-img-wrap">
                        <img src="jordan_powder_blue_nobg.png" alt="Air Jordan 1">
                    </div>
                    <span class="mob-card-brand">JORDAN</span>
                    <h3 class="mob-card-title">Air Jordan 1 Low Powder Blue</h3>
                    <div class="mob-card-price">&#8377;8,899.00 <span class="orig">&#8377;18,899.00</span></div>
                </div>

                <!-- PRODUCT 4 -->
                <div class="mob-product-card">
                    <span class="mob-badge-sale">EXCLUSIVE</span>
                    <button class="mob-btn-heart" aria-label="Wishlist">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                    <div class="mob-card-img-wrap">
                        <img src="nb_9060_nobg.png" alt="New Balance 9060">
                    </div>
                    <span class="mob-card-brand">NEW BALANCE</span>
                    <h3 class="mob-card-title">New Balance 9060 Sea Salt Gold</h3>
                    <div class="mob-card-price">&#8377;12,999.00 <span class="orig">&#8377;19,999.00</span></div>
                </div>

            </div>
        </div>

    </div>

    <!-- 3. UPDATED STICKY BOTTOM NAVIGATION BAR (WITH HOME ACTIVE) -->
    <nav class="app-bottom-nav">
        <a href="#" class="nav-item active">
            <div class="nav-item-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span>Home</span>
            </div>
        </a>
        <a href="#" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span>Explore</span>
        </a>
        <a href="#" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>Wishlist</span>
        </a>
        <a href="#" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profile</span>
        </a>
    </nav>

</div>

<script>
(function(){
    const splash = document.getElementById('splash-screen');
    const btnSkip = document.getElementById('btn-skip-splash');
    const btnStart = document.getElementById('btn-start-splash');

    function closeSplash() {
        splash.classList.add('hide');
    }

    if (btnSkip) btnSkip.addEventListener('click', closeSplash);
    if (btnStart) btnStart.addEventListener('click', closeSplash);
})();
</script>
</body>
</html>
"""

with open('mobile.html', 'w', encoding='utf-8') as f:
    f.write(mobile_homepage_html)

# Also save a copy inside mobile_screens/screen3_homepage.html
os.makedirs('mobile_screens', exist_ok=True)
with open('mobile_screens/screen3_homepage.html', 'w', encoding='utf-8') as f:
    f.write(mobile_homepage_html.replace('src="jordan_powder_blue_nobg.png"', 'src="../jordan_powder_blue_nobg.png"')
                                .replace('src="samba_og_nobg.png"', 'src="../samba_og_nobg.png"')
                                .replace('src="puma_velo_nobg.png"', 'src="../puma_velo_nobg.png"')
                                .replace('src="af1_black_nobg.png"', 'src="../af1_black_nobg.png"')
                                .replace('src="nb_9060_nobg.png"', 'src="../nb_9060_nobg.png"'))

print("CREATED Mobile Homepage in mobile.html and saved backup in mobile_screens/screen3_homepage.html!")
