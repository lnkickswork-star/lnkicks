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
  background:#ffffff;
  position:relative;
  overflow:hidden;
  box-shadow:0 0 40px rgba(0,0,0,0.5);
}

/* ==========================================
   FULLSCREEN ONBOARDING SPLASH SCREEN
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

/* TOP BAR WITH SKIP BUTTON */
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

/* CENTER ARTWORK WITH VERTICAL TYPOGRAPHY & FLOATING SHOES */
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

/* BOTTOM HEADLINE & BLACK CTA CARD CONTAINER */
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
   MAIN MOBILE APP HOME PAGE
   ========================================== */
.app-header{
  height:64px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 20px;
  position:sticky;
  top:0;
  background:#ffffff;
  z-index:100;
  border-bottom:1px solid #F0F0F0;
}
.app-logo{
  font-family:'Playfair Display',serif;
  font-size:24px;
  font-weight:700;
  color:#111111;
  letter-spacing:-0.02em;
}
.app-header-actions{
  display:flex;
  align-items:center;
  gap:14px;
}
.app-icon-btn{
  width:38px;
  height:38px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#111111;
  background:#F6F6F6;
}

/* MOBILE BOTTOM NAV BAR */
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
  align-items:flex-start;
  justify-content:center;
  align-items:center;
  gap:4px;
  color:#888888;
  font-size:10.5px;
  font-weight:600;
  text-decoration:none;
}
.nav-item.active{
  color:#111111;
}
.nav-item svg{width:22px;height:22px}
</style>
</head>
<body>

<div class="app-viewport">

    <!-- 1. FULLSCREEN ONBOARDING SPLASH SCREEN (ONE NIKE + ONE ADIDAS SHOE) -->
    <div class="splash-screen" id="splash-screen">
        
        <!-- TOP BAR -->
        <div class="splash-top-bar">
            <div class="splash-brand-tag">LNKICKS</div>
            <button class="btn-skip" id="btn-skip-splash">SKIP</button>
        </div>

        <!-- CENTER ARTWORK: FLOATING NIKE & ADIDAS SHOES + GIANT VERTICAL TYPOGRAPHY -->
        <div class="splash-art-stage">
            
            <!-- TOP FLOATING NIKE SHOE (AIR JORDAN 1 POWDER BLUE) -->
            <img class="splash-shoe-top" src="jordan_powder_blue.png" alt="Nike Air Jordan 1 Low Black Dark Powder Blue">

            <!-- GIANT VERTICAL BRAND TYPOGRAPHY -->
            <div class="splash-vertical-text">LNKICKS</div>

            <!-- BOTTOM FLOATING ADIDAS SHOE (ADIDAS SAMBA OG) -->
            <img class="splash-shoe-bottom" src="samba_og.png" alt="Adidas Samba OG White Black Gum">

        </div>

        <!-- BOTTOM HEADLINE & BLACK CTA BUTTON CONTAINER -->
        <div class="splash-bottom-area">
            <h1 class="splash-headline">Start your<br>sneaker journey</h1>
            
            <div class="splash-cta-card" id="btn-start-splash">
                <span class="splash-cta-text">Get Started</span>
                <div class="splash-cta-chevrons">&gt;&gt;&gt;</div>
            </div>
        </div>
    </div>

    <!-- 2. MOBILE APP HEADER -->
    <header class="app-header">
        <div class="app-logo">LNKICKS</div>
        <div class="app-header-actions">
            <button class="app-icon-btn"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></button>
            <button class="app-icon-btn"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg></button>
        </div>
    </header>

    <!-- 3. MOBILE APP HOME MAIN CONTENT -->
    <main style="padding: 24px 20px 100px;">
        <div style="background:#F6F6F6; border-radius:20px; padding:30px 20px; text-align:center;">
            <h2 style="font-family:'Oswald',sans-serif; font-size: 26px; text-transform: uppercase; color:#111;">LNKICKS Mobile App</h2>
            <p style="font-size:13px; color:#666; margin-top:8px;">Send screen 2, 3 &amp; 4 designs to build your complete mobile app homepage!</p>
        </div>
    </main>

    <!-- 4. BOTTOM APP NAVIGATION BAR -->
    <nav class="app-bottom-nav">
        <a href="#" class="nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <span>Home</span>
        </a>
        <a href="#" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Categories</span>
        </a>
        <a href="#" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>Wishlist</span>
        </a>
        <a href="#" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Account</span>
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
    f.write(mobile_html_content)

print("UPDATED Screen 1 with 1 Nike Shoe (Air Jordan 1 Low) and 1 Adidas Shoe (Adidas Samba OG)!")
