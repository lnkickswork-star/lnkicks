import os

# Create directory mobile_screens
os.makedirs('mobile_screens', exist_ok=True)

# 1. Screen 1: Splash Screen Standalone HTML
splash_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>LNKICKS — Screen 1: Splash Onboarding</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{width:100%;height:100%;background:#0f0f0f;font-family:'Inter',sans-serif;overflow:hidden}
    .splash-screen{
      max-width:440px;
      height:100vh;
      margin:0 auto;
      background:#F6F6F6;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      padding:50px 24px 30px;
      position:relative;
      box-shadow:0 0 40px rgba(0,0,0,0.5);
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
    .splash-headline{font-family:'Oswald',sans-serif;font-size:36px;font-weight:800;line-height:1.05;color:#111111;letter-spacing:-0.02em;margin-bottom:24px;}
    .splash-cta-card{background:#111111;border-radius:28px;padding:20px 28px;display:flex;align-items:center;justify-content:space-between;color:#ffffff;cursor:pointer;}
    .splash-cta-text{font-family:'Oswald',sans-serif;font-size:18px;font-weight:700;letter-spacing:0.06em;}
    .splash-cta-chevrons{font-size:18px;font-weight:800;color:rgba(255,255,255,0.7);}
    </style>
</head>
<body>
    <div class="splash-screen">
        <div class="splash-top-bar">
            <div class="splash-brand-tag">LNKICKS</div>
            <button class="btn-skip" onclick="alert('Navigating to Home Screen...')">SKIP</button>
        </div>
        <div class="splash-art-stage">
            <img class="splash-shoe-top" src="../jordan_powder_blue_nobg.png" alt="Nike Air Jordan 1">
            <div class="splash-vertical-text">LNKICKS</div>
            <img class="splash-shoe-bottom" src="../samba_og_nobg.png" alt="Adidas Samba OG">
        </div>
        <div class="splash-bottom-area">
            <h1 class="splash-headline">Start your<br>sneaker journey</h1>
            <div class="splash-cta-card" onclick="alert('Navigating to Home Screen...')">
                <span class="splash-cta-text">Get Started</span>
                <div class="splash-cta-chevrons">&gt;&gt;&gt;</div>
            </div>
        </div>
    </div>
</body>
</html>
"""

with open('mobile_screens/screen1_splash.html', 'w', encoding='utf-8') as f:
    f.write(splash_content)

# 2. Screen 2: Swipe Discovery Standalone HTML
swipe_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>LNKICKS — Screen 2: Swipe Discovery</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{width:100%;height:100%;background:#0f0f0f;font-family:'Inter',sans-serif;overflow:hidden}
    .app-viewport{max-width:440px;height:100vh;margin:0 auto;background:#F4F4F6;position:relative;display:flex;flex-direction:column;justify-content:space-between;}
    .swipe-app-header{padding:44px 16px 12px;display:flex;align-items:center;gap:10px;overflow-x:auto;scrollbar-width:none;}
    .cat-pill{padding:10px 22px;border-radius:24px;font-size:14px;font-weight:600;background:#ffffff;color:#111111;white-space:nowrap;}
    .cat-pill.active{background:#111111;color:#ffffff;}
    .swipe-stage-container{flex:1;position:relative;margin:10px 16px 16px;display:flex;align-items:center;justify-content:center;}
    .swipe-card{position:absolute;width:100%;height:100%;max-height:480px;background:#ffffff;border-radius:32px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,0.08);display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.4s ease, opacity 0.4s ease;}
    .swipe-card.card-0{ z-index:5; }
    .swipe-card.card-1{ z-index:4; transform:scale(0.95) translateY(14px); opacity:0.9; }
    .swipe-card.card-2{ z-index:3; transform:scale(0.90) translateY(28px); opacity:0.8; }
    .swipe-card.card-3{ z-index:2; transform:scale(0.85) translateY(42px); opacity:0.7; }
    .swipe-card.card-4{ z-index:1; transform:scale(0.80) translateY(56px); opacity:0.6; }
    .swipe-card.swiped-left{ transform:translateX(-140%) rotate(-20deg) !important; opacity:0 !important; }
    .swipe-card.swiped-right{ transform:translateX(140%) rotate(20deg) !important; opacity:0 !important; }
    .swipe-badge-pill{position:absolute;top:18px;left:18px;background:#FF3B30;color:#ffffff;font-size:11px;font-weight:800;padding:6px 14px;border-radius:16px;z-index:10;}
    .swipe-card-img-wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:30px 24px 10px;position:relative;}
    .swipe-card-img-wrap img{max-height:260px;width:auto;object-fit:contain;filter:drop-shadow(0 14px 28px rgba(0,0,0,0.14));}
    .swipe-card-info-overlay{background:linear-gradient(to top, rgba(15,15,15,0.95) 0%, rgba(15,15,15,0.75) 60%, transparent 100%);padding:40px 24px 24px;color:#ffffff;}
    .swipe-brand-name{font-size:11px;font-weight:700;letter-spacing:0.18em;color:rgba(255,255,255,0.6);}
    .swipe-prod-title{font-size:20px;font-weight:700;line-height:1.25;color:#ffffff;}
    .swipe-price-row{display:flex;align-items:center;gap:10px;margin-top:4px;}
    .swipe-price-now{font-size:22px;font-weight:800;color:#FF3B30;}
    .swipe-price-old{font-size:14px;color:rgba(255,255,255,0.5);text-decoration:line-through;}
    .swipe-actions-bar{display:flex;align-items:center;justify-content:center;gap:20px;padding:10px 0 20px;}
    .btn-action-undo{width:48px;height:48px;border-radius:50%;background:#ffffff;border:none;cursor:pointer;}
    .btn-action-dislike{width:62px;height:62px;border-radius:50%;background:#111111;color:#fff;border:none;cursor:pointer;}
    .btn-action-like{width:64px;height:64px;border-radius:50%;background:#FF3B30;color:#fff;border:none;cursor:pointer;}
    .app-bottom-nav{height:68px;background:#ffffff;border-top:1px solid #EBEBEB;display:grid;grid-template-columns:repeat(4, 1fr);align-items:center;}
    .nav-item{display:flex;flex-direction:column;align-items:center;color:#888;font-size:10.5px;font-weight:600;text-decoration:none;}
    .nav-item.active{color:#111;}
    </style>
</head>
<body>
<div class="app-viewport">
    <div class="swipe-app-header">
        <div class="cat-pill active">All</div><div class="cat-pill">Shoes</div><div class="cat-pill">Tops</div><div class="cat-pill">Trousers</div>
    </div>
    <div class="swipe-stage-container" id="card-stack">
        <div class="swipe-card card-0"><span class="swipe-badge-pill">20% OFF</span><div class="swipe-card-img-wrap"><img src="../samba_og_nobg.png" alt="Adidas"></div><div class="swipe-card-info-overlay"><span class="swipe-brand-name">ADIDAS</span><h3 class="swipe-prod-title">Samba OG Cloud White Core Black</h3><div class="swipe-price-row"><span class="swipe-price-now">&#8377;9,499.00</span><span class="swipe-price-old">&#8377;16,999.00</span></div></div></div>
        <div class="swipe-card card-1"><span class="swipe-badge-pill">HOT DROP</span><div class="swipe-card-img-wrap"><img src="../puma_velo_nobg.png" alt="Puma"></div><div class="swipe-card-info-overlay"><span class="swipe-brand-name">PUMA</span><h3 class="swipe-prod-title">Puma Velophasis Luxury Edition</h3><div class="swipe-price-row"><span class="swipe-price-now">&#8377;8,499.00</span><span class="swipe-price-old">&#8377;14,999.00</span></div></div></div>
        <div class="swipe-card card-2"><span class="swipe-badge-pill">EXCLUSIVE</span><div class="swipe-card-img-wrap"><img src="../nb_9060_nobg.png" alt="New Balance"></div><div class="swipe-card-info-overlay"><span class="swipe-brand-name">NEW BALANCE</span><h3 class="swipe-prod-title">New Balance 9060 Sea Salt Gold</h3><div class="swipe-price-row"><span class="swipe-price-now">&#8377;12,999.00</span><span class="swipe-price-old">&#8377;19,999.00</span></div></div></div>
        <div class="swipe-card card-3"><span class="swipe-badge-pill">INSTANT SHIP</span><div class="swipe-card-img-wrap"><img src="../jordan_powder_blue_nobg.png" alt="Jordan"></div><div class="swipe-card-info-overlay"><span class="swipe-brand-name">AIR JORDAN</span><h3 class="swipe-prod-title">Air Jordan 1 Low Black Powder Blue</h3><div class="swipe-price-row"><span class="swipe-price-now">&#8377;8,899.00</span><span class="swipe-price-old">&#8377;18,899.00</span></div></div></div>
        <div class="swipe-card card-4"><span class="swipe-badge-pill">MONSOON SALE</span><div class="swipe-card-img-wrap"><img src="../af1_black_nobg.png" alt="Nike"></div><div class="swipe-card-info-overlay"><span class="swipe-brand-name">NIKE</span><h3 class="swipe-prod-title">Nike Air Force 1 Low Triple Black</h3><div class="swipe-price-row"><span class="swipe-price-now">&#8377;6,999.00</span><span class="swipe-price-old">&#8377;10,999.00</span></div></div></div>
    </div>
    <div class="swipe-actions-bar">
        <button class="btn-action-undo" onclick="location.reload()">↺</button>
        <button class="btn-action-dislike" onclick="swipe('left')">✕</button>
        <button class="btn-action-like" onclick="swipe('right')">♥</button>
    </div>
    <nav class="app-bottom-nav">
        <a href="#" class="nav-item active">Swipe</a>
        <a href="#" class="nav-item">Explore</a>
        <a href="#" class="nav-item">Wishlist</a>
        <a href="#" class="nav-item">Profile</a>
    </nav>
</div>
<script>
let cards = Array.from(document.querySelectorAll('.swipe-card'));
let currentIdx = 0;
function swipe(dir) {
    if (currentIdx >= cards.length) return;
    cards[currentIdx].classList.add(dir === 'left' ? 'swiped-left' : 'swiped-right');
    currentIdx++;
}
</script>
</body>
</html>
"""

with open('mobile_screens/screen2_swipe.html', 'w', encoding='utf-8') as f:
    f.write(swipe_content)

print("SAVED screen1_splash.html and screen2_swipe.html inside mobile_screens directory!")
