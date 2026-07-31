import os
import re

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
js_dir = os.path.join(project_dir, "js")
os.makedirs(js_dir, exist_ok=True)

# 1. Create global production app.js for state management, router, cart, wishlist, & navigation
app_js_content = """/* =========================================================
   LNKICKS GLOBAL PRODUCTION APPLICATION CORE (APP.JS)
   ========================================================= */

(function(){
    // A. DEVICE ROUTER
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const currentPath = window.location.pathname;

    if (isMobileDevice && currentPath.endsWith('index.html')) {
        window.location.href = 'mobile.html';
    } else if (!isMobileDevice && currentPath.endsWith('mobile.html')) {
        window.location.href = 'index.html';
    }

    // B. STATE MANAGERS (CART & WISHLIST)
    window.LNKICKS = window.LNKICKS || {};
    
    LNKICKS.cart = JSON.parse(localStorage.getItem('lnk_cart') || '[]');
    LNKICKS.wishlist = JSON.parse(localStorage.getItem('lnk_wishlist') || '[]');

    LNKICKS.saveCart = function() {
        localStorage.setItem('lnk_cart', JSON.stringify(LNKICKS.cart));
        LNKICKS.updateBadges();
    };

    LNKICKS.saveWishlist = function() {
        localStorage.setItem('lnk_wishlist', JSON.stringify(LNKICKS.wishlist));
        LNKICKS.updateBadges();
    };

    LNKICKS.addToCart = function(product) {
        const existing = LNKICKS.cart.find(i => i.id === product.id);
        if (existing) {
            existing.qty += (product.qty || 1);
        } else {
            LNKICKS.cart.push({
                id: product.id || 'prod_' + Date.now(),
                name: product.name || 'LNKICKS Sneaker',
                price: product.price || 8899,
                image: product.image || 'jordan_powder_blue_nobg.png',
                qty: product.qty || 1,
                size: product.size || 'UK 8'
            });
        }
        LNKICKS.saveCart();
        LNKICKS.showToast('Item added to Shopping Cart!');
    };

    LNKICKS.toggleWishlist = function(product) {
        const idx = LNKICKS.wishlist.findIndex(i => i.id === product.id);
        if (idx > -1) {
            LNKICKS.wishlist.splice(idx, 1);
            LNKICKS.showToast('Removed from Wishlist');
        } else {
            LNKICKS.wishlist.push(product);
            LNKICKS.showToast('Saved to Wishlist ❤');
        }
        LNKICKS.saveWishlist();
    };

    LNKICKS.updateBadges = function() {
        const totalItems = LNKICKS.cart.reduce((sum, item) => sum + item.qty, 0);
        document.querySelectorAll('.cart-badge, #cart-badge, .cart-count').forEach(el => {
            el.textContent = totalItems;
        });
        document.querySelectorAll('.wishlist-count').forEach(el => {
            el.textContent = LNKICKS.wishlist.length;
        });
    };

    // TOAST NOTIFICATION
    LNKICKS.showToast = function(msg) {
        let toast = document.getElementById('lnk-global-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'lnk-global-toast';
            toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:12px 24px;border-radius:30px;font-size:13px;font-weight:700;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,0.3);transition:all 0.3s ease;opacity:0;pointer-events:none;';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        toast.style.bottom = '95px';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.bottom = '90px';
        }, 2200);
    };

    // DOM CONTENT LOADED BINDINGS
    document.addEventListener('DOMContentLoaded', function(){
        LNKICKS.updateBadges();

        // 1. Bind Add To Cart Buttons
        document.querySelectorAll('.pcard__btn, .btn-drop-add, .btn-add-cart, [data-action="add-cart"]').forEach(btn => {
            btn.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                const card = btn.closest('.pcard, .drop-card, .mob-product-card') || document;
                const title = card.querySelector('.pcard__name, .drop-card-title, .mob-card-title, h1, h2')?.textContent?.trim() || 'LNKICKS Sneaker';
                const priceTxt = card.querySelector('.pcard__price, .drop-card-price, .mob-card-price, .price')?.textContent?.replace(/[^0-9]/g, '') || '8899';
                const img = card.querySelector('img')?.getAttribute('src') || 'jordan_powder_blue_nobg.png';
                
                LNKICKS.addToCart({
                    id: title.toLowerCase().replace(/\s+/g, '-'),
                    name: title,
                    price: parseInt(priceTxt, 10),
                    image: img
                });
            });
        });

        // 2. Bind Wishlist Heart Toggle Buttons
        document.querySelectorAll('.pcard__wish, .mob-btn-heart, .drop-card-heart, .btn-action-like').forEach(btn => {
            btn.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                const card = btn.closest('.pcard, .drop-card, .mob-product-card') || document;
                const title = card.querySelector('.pcard__name, .drop-card-title, .mob-card-title')?.textContent?.trim() || 'Sneaker';
                btn.classList.toggle('active');
                LNKICKS.toggleWishlist({
                    id: title.toLowerCase().replace(/\s+/g, '-'),
                    name: title
                });
            });
        });

        // 3. Bind Quick Shop & Product Card Navigation
        document.querySelectorAll('.pcard, .drop-card, .mob-product-card').forEach(card => {
            card.addEventListener('click', function(e){
                if (!e.target.closest('button') && !e.target.closest('a')) {
                    window.location.href = 'product_detail.html';
                }
            });
        });

        // 4. Bind Search Inputs
        document.querySelectorAll('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]').forEach(input => {
            input.addEventListener('keypress', function(e){
                if (e.key === 'Enter') {
                    e.preventDefault();
                    window.location.href = 'search.html?q=' + encodeURIComponent(input.value);
                }
            });
        });

        // 5. Bind Cart Buttons to Navigate to Cart Page
        document.querySelectorAll('.nav-btn[aria-label="Cart"], .app-icon-btn svg, [data-action="cart"]').forEach(btn => {
            const parent = btn.closest('button, a');
            if (parent && !parent.getAttribute('href')) {
                parent.addEventListener('click', function(){
                    window.location.href = 'cart.html';
                });
            }
        });
    });
})();
"""

with open(os.path.join(js_dir, "app.js"), "w", encoding="utf-8") as f:
    f.write(app_js_content)

print("Created js/app.js global router & state manager!")

# 2. Python Script to Audit and Repair Links, Buttons, Scripts, & Paths in ALL 36 Root HTML Pages
html_files = [f for f in os.listdir(project_dir) if f.endswith('.html')]

audit_report = {
    "total_files": len(html_files),
    "repaired_links": 0,
    "fixed_images": 0,
    "injected_app_js": 0,
    "broken_href_replaced": 0
}

# Real link replacements dictionary for all dead links
href_map = {
    'href="#"': 'href="javascript:void(0)"',
    'href="javascript:void(0)"': 'href="javascript:void(0)"',
    'href=""': 'href="index.html"'
}

for html_file in html_files:
    file_path = os.path.join(project_dir, html_file)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # A. Inject <script src="js/app.js"></script> before </body> if not present
    if 'src="js/app.js"' not in content and '<script src="js/app.js"></script>' not in content:
        if '</body>' in content:
            content = content.replace('</body>', '<script src="js/app.js"></script>\n</body>')
            audit_report["injected_app_js"] += 1

    # B. Fix common broken href links in navigation headers & footers
    content = content.replace('href="#" class="nav-link">Sneakers</a>', 'href="category_products.html" class="nav-link">Sneakers</a>')
    content = content.replace('href="#" class="nav-link">Luxury Footwear</a>', 'href="categories.html" class="nav-link">Luxury Footwear</a>')
    content = content.replace('href="#" class="nav-link">Bags</a>', 'href="category_products.html" class="nav-link">Bags</a>')
    content = content.replace('href="#" class="nav-link">Beauty</a>', 'href="category_products.html" class="nav-link">Beauty</a>')
    content = content.replace('href="#" class="nav-link">Clothing</a>', 'href="category_products.html" class="nav-link">Clothing</a>')
    content = content.replace('href="#" class="nav-link">Hype &amp; Care</a>', 'href="category_products.html" class="nav-link">Hype &amp; Care</a>')
    content = content.replace('href="#" class="nav-link" style="color:var(--text-muted)">Track Order</a>', 'href="track_order.html" class="nav-link">Track Order</a>')

    # C. Fix header action cart buttons
    content = re.sub(r'<button class="nav-btn" aria-label="Cart">', r'<button class="nav-btn" aria-label="Cart" onclick="window.location.href=\'cart.html\'">', content)
    content = re.sub(r'<button class="nav-btn" aria-label="Account">', r'<button class="nav-btn" aria-label="Account" onclick="window.location.href=\'profile.html\'">', content)
    content = re.sub(r'<button class="nav-btn" aria-label="Search">', r'<button class="nav-btn" aria-label="Search" onclick="window.location.href=\'search.html\'">', content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"AUDITED & REPAIRED all {len(html_files)} HTML pages in project!")
