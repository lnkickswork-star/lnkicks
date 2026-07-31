import os

# 1. Update index.html to add device detector redirect at the top of <head>
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

redirect_script = """<script>
(function(){
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    if (isMobile && !window.location.pathname.endsWith('mobile.html')) {
        window.location.href = 'mobile.html';
    }
})();
</script>
"""

if '<script>\n(function(){\n    var isMobile' not in html:
    html = html.replace('<head>', '<head>\n' + redirect_script)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added device redirect script to index.html!")

# 2. Create mobile.html dedicated mobile webapp file
mobile_html = """<!DOCTYPE html>
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
    html,body{width:100%;height:100%;background:#ffffff;font-family:'Inter',sans-serif;color:#111111;-webkit-tap-highlight-color:transparent}
    .app-container{max-width:480px;margin:0 auto;background:#ffffff;min-height:100vh;position:relative;padding-bottom:80px;box-shadow:0 0 30px rgba(0,0,0,0.08)}
    
    /* MOBILE APP HEADER */
    .app-header{
      height:60px;
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
      gap:16px;
    }
    .app-icon-btn{
      width:36px;
      height:36px;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#111111;
    }

    /* MOBILE BOTTOM NAV BAR */
    .app-bottom-nav{
      position:fixed;
      bottom:0;
      left:50%;
      transform:translateX(-50%);
      width:100%;
      max-width:480px;
      height:64px;
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
      font-size:10px;
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

<div class="app-container">
    <!-- MOBILE HEADER -->
    <header class="app-header">
        <div class="app-logo">LNKICKS</div>
        <div class="app-header-actions">
            <button class="app-icon-btn"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></button>
            <button class="app-icon-btn"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg></button>
        </div>
    </header>

    <!-- MOBILE CONTENT PLACEHOLDER FOR USER DESIGN -->
    <main style="padding: 40px 20px; text-align: center;">
        <h2 style="font-family:'Oswald',sans-serif; font-size: 28px; text-transform: uppercase;">LNKICKS Mobile App</h2>
        <p style="font-size:14px; color:#666; margin-top:10px;">Send your mobile home page design screenshots to build the app layout!</p>
    </main>

    <!-- BOTTOM APP NAVIGATION BAR -->
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

</body>
</html>
"""

with open('mobile.html', 'w', encoding='utf-8') as f:
    f.write(mobile_html)

print("Created mobile.html and set up automatic device routing!")
