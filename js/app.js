/* =========================================================
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
