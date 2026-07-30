import os

mobile_html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>LNKICKS — Mobile App</title>
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

.splash-top-bar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
  z-index:10;
}
.splash-brand-tag{
  font-family:'Oswald',sans-serif;
  font-size:16px;
  font-weight:800;
  letter-spacing:0.12em;
  color:#111111;
}
.btn-skip{
  font-size:12px;
  font-weight:700;
  letter-spacing:0.1em;
  text-transform:uppercase;
  color:#777777;
  padding:8px 16px;
  background:rgba(0,0,0,0.05);
  border-radius:20px;
  transition:all 0.2s ease;
}
.btn-skip:hover{
  background:#111111;
  color:#ffffff;
}

.splash-art-stage{
  position:relative;
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:20px 0;
  overflow:hidden;
}

.splash-vertical-text{
  font-family:'Oswald',sans-serif;
  font-size:110px;
  font-weight:900;
  letter-spacing:0.04em;
  color:#111111;
  writing-mode:vertical-rl;
  transform:rotate(180deg);
  user-select:none;
  pointer-events:none;
  line-height:0.9;
  opacity:0.95;
  z-index:1;
}

.splash-shoe-top{
  position:absolute;
  top:4%;
  left:6%;
  width:215px;
  height:auto;
  filter:drop-shadow(0 20px 30px rgba(0,0,0,0.22));
  transform:rotate(-28deg);
  animation:floatShoeTop 4s ease-in-out infinite alternate;
  z-index:3;
}
.splash-shoe-bottom{
  position:absolute;
  bottom:6%;
  right:4%;
  width:225px;
  height:auto;
  filter:drop-shadow(0 20px 30px rgba(0,0,0,0.22));
  transform:rotate(24deg);
  animation:floatShoeBottom 4s ease-in-out infinite alternate;
  z-index:3;
}

@keyframes floatShoeTop{
  from{transform:rotate(-28deg) translateY(0px)}
  to{transform:rotate(-24deg) translateY(-12px)}
}
@keyframes floatShoeBottom{
  from{transform:rotate(24deg) translateY(0px)}
  to{transform:rotate(28deg) translateY(12px)}
}

.splash-bottom-area{
  width:100%;
  z-index:10;
}
.splash-headline{
  font-family:'Oswald',sans-serif;
  font-size:36px;
  font-weight:800;
  line-height:1.05;
  color:#111111;
  letter-spacing:-0.02em;
  margin-bottom:24px;
}

.splash-cta-card{
  background:#111111;
  border-radius:28px;
  padding:20px 28px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  color:#ffffff;
  cursor:pointer;
  box-shadow:0 12px 32px rgba(0,0,0,0.25);
  transition:all 0.25s ease;
}
.splash-cta-card:active{
  transform:scale(0.98);
}
.splash-cta-text{
  font-family:'Oswald',sans-serif;
  font-size:18px;
  font-weight:700;
  letter-spacing:0.06em;
  text-transform:capitalize;
}
.splash-cta-chevrons{
  display:flex;
  align-items:center;
  gap:4px;
  color:rgba(255,255,255,0.7);
  font-size:18px;
  font-weight:800;
}

/* ==========================================
   2. MOBILE APP SWIPE DISCOVERY SCREEN
   ========================================== */
.swipe-app-header{
  padding:44px 16px 12px;
  display:flex;
  align-items:center;
  gap:10px;
  overflow-x:auto;
  scrollbar-width:none;
  background:#F4F4F6;
  z-index:10;
}
.swipe-app-header::-webkit-scrollbar{display:none}

.cat-pill{
  padding:10px 22px;
  border-radius:24px;
  font-size:14px;
  font-weight:600;
  background:#ffffff;
  color:#111111;
  white-space:nowrap;
  cursor:pointer;
  transition:all 0.2s ease;
  box-shadow:0 2px 8px rgba(0,0,0,0.03);
}
.cat-pill.active{
  background:#111111;
  color:#ffffff;
}

/* CARD STACK CONTAINER */
.swipe-stage-container{
  flex:1;
  position:relative;
  margin:10px 16px 16px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.swipe-card{
  position:absolute;
  width:100%;
  height:100%;
  max-height:480px;
  background:#ffffff;
  border-radius:32px;
  overflow:hidden;
  box-shadow:0 16px 40px rgba(0,0,0,0.08);
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
  user-select:none;
}

.swipe-card.card-0{ z-index:5; transform:scale(1) translateY(0); }
.swipe-card.card-1{ z-index:4; transform:scale(0.95) translateY(14px); opacity:0.9; }
.swipe-card.card-2{ z-index:3; transform:scale(0.90) translateY(28px); opacity:0.8; }
.swipe-card.card-3{ z-index:2; transform:scale(0.85) translateY(42px); opacity:0.7; }
.swipe-card.card-4{ z-index:1; transform:scale(0.80) translateY(56px); opacity:0.6; }

.swipe-card.swiped-left{
  transform:translateX(-140%) rotate(-20deg) !important;
  opacity:0 !important;
}
.swipe-card.swiped-right{
  transform:translateX(140%) rotate(20deg) !important;
  opacity:0 !important;
}

/* TOP BADGE INSIDE CARD */
.swipe-badge-pill{
  position:absolute;
  top:18px;
  left:18px;
  background:#FF3B30;
  color:#ffffff;
  font-size:11px;
  font-weight:800;
  letter-spacing:0.08em;
  text-transform:uppercase;
  padding:6px 14px;
  border-radius:16px;
  z-index:10;
  box-shadow:0 4px 12px rgba(255,59,48,0.3);
}

/* CARD IMAGE AREA */
.swipe-card-img-wrap{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:30px 24px 10px;
  position:relative;
  overflow:hidden;
}
.swipe-card-img-wrap img{
  max-height:260px;
  width:auto;
  object-fit:contain;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,0.14));
  transition:transform 0.3s ease;
}

/* BOTTOM DARK OVERLAY WITH DETAILS */
.swipe-card-info-overlay{
  background:linear-gradient(to top, rgba(15,15,15,0.95) 0%, rgba(15,15,15,0.75) 60%, transparent 100%);
  padding:40px 24px 24px;
  color:#ffffff;
  display:flex;
  flex-direction:column;
  gap:6px;
}
.swipe-brand-name{
  font-size:11px;
  font-weight:700;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:rgba(255,255,255,0.6);
}
.swipe-prod-title{
  font-size:20px;
  font-weight:700;
  line-height:1.25;
  color:#ffffff;
}
.swipe-price-row{
  display:flex;
  align-items:center;
  gap:10px;
  margin-top:4px;
}
.swipe-price-now{
  font-size:22px;
  font-weight:800;
  color:#FF3B30;
}
.swipe-price-old{
  font-size:14px;
  color:rgba(255,255,255,0.5);
  text-decoration:line-through;
}

/* FLOATING SWIPE ACTION BUTTONS */
.swipe-actions-bar{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:20px;
  padding:10px 0 20px;
  z-index:20;
}
.btn-action-undo{
  width:48px;
  height:48px;
  border-radius:50%;
  background:#ffffff;
  color:#111111;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 6px 18px rgba(0,0,0,0.08);
  cursor:pointer;
  transition:transform 0.2s ease;
}
.btn-action-dislike{
  width:62px;
  height:62px;
  border-radius:50%;
  background:#111111;
  color:#ffffff;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 8px 22px rgba(0,0,0,0.2);
  cursor:pointer;
  transition:transform 0.2s ease;
}
.btn-action-like{
  width:64px;
  height:64px;
  border-radius:50%;
  background:#FF3B30;
  color:#ffffff;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 10px 25px rgba(255,59,48,0.38);
  cursor:pointer;
  transition:transform 0.2s ease;
}
.btn-action-undo:active, .btn-action-dislike:active, .btn-action-like:active{
  transform:scale(0.9);
}

/* MOBILE BOTTOM FLOATING NAV BAR */
.app-bottom-nav{
  height:68px;
  background:#ffffff;
  border-top:1px solid #EBEBEB;
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  align-items:center;
  z-index:1000;
  box-shadow:0 -4px 20px rgba(0,0,0,0.05);
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

    <!-- 2. TOP CATEGORY PILLS BAR -->
    <div class="swipe-app-header">
        <div class="cat-pill active">All</div>
        <div class="cat-pill">Shoes</div>
        <div class="cat-pill">Tops</div>
        <div class="cat-pill">Trousers</div>
        <div class="cat-pill">Accessories</div>
    </div>

    <!-- 3. SWIPE CARD STACK CONTAINER (5 CARDS WITH REQUESTED BRANDS) -->
    <div class="swipe-stage-container" id="card-stack">
        
        <!-- CARD 1: ADIDAS -->
        <div class="swipe-card card-0" data-index="0">
            <span class="swipe-badge-pill">20% OFF</span>
            <div class="swipe-card-img-wrap">
                <img src="samba_og_nobg.png" alt="Adidas Samba OG">
            </div>
            <div class="swipe-card-info-overlay">
                <span class="swipe-brand-name">ADIDAS</span>
                <h3 class="swipe-prod-title">Samba OG Cloud White Core Black</h3>
                <div class="swipe-price-row">
                    <span class="swipe-price-now">&#8377;9,499.00</span>
                    <span class="swipe-price-old">&#8377;16,999.00</span>
                </div>
            </div>
        </div>

        <!-- CARD 2: PUMA -->
        <div class="swipe-card card-1" data-index="1">
            <span class="swipe-badge-pill">HOT DROP</span>
            <div class="swipe-card-img-wrap">
                <img src="puma_velo_nobg.png" alt="Puma Velophasis Hype">
            </div>
            <div class="swipe-card-info-overlay">
                <span class="swipe-brand-name">PUMA</span>
                <h3 class="swipe-prod-title">Puma Velophasis Luxury Edition</h3>
                <div class="swipe-price-row">
                    <span class="swipe-price-now">&#8377;8,499.00</span>
                    <span class="swipe-price-old">&#8377;14,999.00</span>
                </div>
            </div>
        </div>

        <!-- CARD 3: NEW BALANCE -->
        <div class="swipe-card card-2" data-index="2">
            <span class="swipe-badge-pill">EXCLUSIVE</span>
            <div class="swipe-card-img-wrap">
                <img src="nb_9060_nobg.png" alt="New Balance 9060">
            </div>
            <div class="swipe-card-info-overlay">
                <span class="swipe-brand-name">NEW BALANCE</span>
                <h3 class="swipe-prod-title">New Balance 9060 Sea Salt Gold</h3>
                <div class="swipe-price-row">
                    <span class="swipe-price-now">&#8377;12,999.00</span>
                    <span class="swipe-price-old">&#8377;19,999.00</span>
                </div>
            </div>
        </div>

        <!-- CARD 4: JORDAN -->
        <div class="swipe-card card-3" data-index="3">
            <span class="swipe-badge-pill">INSTANT SHIP</span>
            <div class="swipe-card-img-wrap">
                <img src="jordan_powder_blue_nobg.png" alt="Air Jordan 1 Low">
            </div>
            <div class="swipe-card-info-overlay">
                <span class="swipe-brand-name">AIR JORDAN</span>
                <h3 class="swipe-prod-title">Air Jordan 1 Low Black Powder Blue</h3>
                <div class="swipe-price-row">
                    <span class="swipe-price-now">&#8377;8,899.00</span>
                    <span class="swipe-price-old">&#8377;18,899.00</span>
                </div>
            </div>
        </div>

        <!-- CARD 5: NIKE -->
        <div class="swipe-card card-4" data-index="4">
            <span class="swipe-badge-pill">MONSOON SALE</span>
            <div class="swipe-card-img-wrap">
                <img src="af1_black_nobg.png" alt="Nike Air Force 1">
            </div>
            <div class="swipe-card-info-overlay">
                <span class="swipe-brand-name">NIKE</span>
                <h3 class="swipe-prod-title">Nike Air Force 1 Low Triple Black</h3>
                <div class="swipe-price-row">
                    <span class="swipe-price-now">&#8377;6,999.00</span>
                    <span class="swipe-price-old">&#8377;10,999.00</span>
                </div>
            </div>
        </div>

    </div>

    <!-- 4. FLOATING ACTION BUTTONS (UNDO / DISLIKE / LIKE) -->
    <div class="swipe-actions-bar">
        <button class="btn-action-undo" id="btn-undo" aria-label="Undo">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
        <button class="btn-action-dislike" id="btn-dislike" aria-label="Dislike">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <button class="btn-action-like" id="btn-like" aria-label="Like">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
    </div>

    <!-- 5. MOBILE APP FLOATING BOTTOM NAVIGATION BAR -->
    <nav class="app-bottom-nav">
        <a href="#" class="nav-item active">
            <div class="nav-item-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 7h8M8 12h8M8 17h5"/></svg>
                <span>Swipe</span>
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

    // SWIPE CARD INTERACTION LOGIC
    let cards = Array.from(document.querySelectorAll('.swipe-card'));
    let currentIdx = 0;

    function swipeTopCard(direction) {
        if (currentIdx >= cards.length) return;
        const topCard = cards[currentIdx];
        if (direction === 'left') {
            topCard.classList.add('swiped-left');
        } else {
            topCard.classList.add('swiped-right');
        }
        currentIdx++;
    }

    function resetCards() {
        cards.forEach(card => {
            card.classList.remove('swiped-left', 'swiped-right');
        });
        currentIdx = 0;
    }

    document.getElementById('btn-dislike').addEventListener('click', () => swipeTopCard('left'));
    document.getElementById('btn-like').addEventListener('click', () => swipeTopCard('right'));
    document.getElementById('btn-undo').addEventListener('click', resetCards);
})();
</script>
</body>
</html>
"""

with open('mobile.html', 'w', encoding='utf-8') as f:
    f.write(mobile_html_content)

print("CREATED 5-Card Interactive Swipe Screen matching user screenshot!")
