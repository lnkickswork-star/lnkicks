import os
import re

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
js_dir = os.path.join(project_dir, "js")
os.makedirs(js_dir, exist_ok=True)

# 1. Create dedicated production Product Flow script js/product_flow.js
product_flow_js = """/* =========================================================
   LNKICKS PRODUCT FLOW & INTERACTION ENGINE (PRODUCT_FLOW.JS)
   ========================================================= */

(function(){
    document.addEventListener('DOMContentLoaded', function(){
        
        // A. GALLERY & THUMBNAIL SWITCHING
        const mainImage = document.querySelector('.gallery-main img, #main-product-img, .product-image-main, [data-main-img]');
        const thumbnails = document.querySelectorAll('.thumbnail, .gallery-thumb, .thumb-img, [data-thumb]');

        if (thumbnails.length > 0) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function(){
                    const newSrc = this.getAttribute('src') || this.querySelector('img')?.getAttribute('src');
                    if (newSrc && mainImage) {
                        mainImage.setAttribute('src', newSrc);
                        thumbnails.forEach(t => t.classList.remove('active', 'border-black', 'ring-2'));
                        this.classList.add('active');
                    }
                });
            });
        }

        // B. SIZE SELECTION
        let selectedSize = 'UK 8';
        const sizeBtns = document.querySelectorAll('.size-btn, .size-pill, [data-size], button:has(span:contains("UK"))');
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', function(e){
                e.preventDefault();
                sizeBtns.forEach(s => s.classList.remove('active', 'bg-black', 'text-white', 'border-black'));
                this.classList.add('active');
                selectedSize = this.textContent.trim();
            });
        });

        // C. COLOR SELECTION
        let selectedColor = 'Original';
        const colorBtns = document.querySelectorAll('.color-btn, .color-swatch, [data-color]');
        colorBtns.forEach(btn => {
            btn.addEventListener('click', function(e){
                e.preventDefault();
                colorBtns.forEach(c => c.classList.remove('active', 'ring-2', 'ring-black'));
                this.classList.add('active');
                selectedColor = this.getAttribute('data-color') || this.title || 'Selected Color';
            });
        });

        // D. QUANTITY SELECTOR
        let currentQty = 1;
        const qtyDisplay = document.querySelector('.qty-value, .quantity-input, #qty-val, [data-qty]');
        const qtyMinus = document.querySelector('.qty-minus, .btn-minus, [data-action="minus"]');
        const qtyPlus = document.querySelector('.qty-plus, .btn-plus, [data-action="plus"]');

        if (qtyMinus && qtyPlus) {
            qtyMinus.addEventListener('click', function(e){
                e.preventDefault();
                if (currentQty > 1) {
                    currentQty--;
                    if (qtyDisplay) qtyDisplay.textContent = currentQty;
                }
            });
            qtyPlus.addEventListener('click', function(e){
                e.preventDefault();
                currentQty++;
                if (qtyDisplay) qtyDisplay.textContent = currentQty;
            });
        }

        // E. ADD TO CART
        const addToCartBtn = document.querySelector('#btn-add-to-cart, .btn-add-cart, [data-action="add-cart"], button:contains("Add to Cart")');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e){
                e.preventDefault();
                const title = document.querySelector('h1, .product-title, .p-name')?.textContent?.trim() || 'LNKICKS Sneaker';
                const priceTxt = document.querySelector('.price, .product-price, .current-price')?.textContent?.replace(/[^0-9]/g, '') || '8899';
                const img = mainImage?.getAttribute('src') || 'jordan_powder_blue_nobg.png';

                if (window.LNKICKS && window.LNKICKS.addToCart) {
                    window.LNKICKS.addToCart({
                        id: title.toLowerCase().replace(/\\s+/g, '-'),
                        name: title,
                        price: parseInt(priceTxt, 10),
                        image: img,
                        size: selectedSize,
                        color: selectedColor,
                        qty: currentQty
                    });
                }
            });
        }

        // F. BUY NOW
        const buyNowBtn = document.querySelector('#btn-buy-now, .btn-buy-now, [data-action="buy-now"], button:contains("Buy Now")');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function(e){
                e.preventDefault();
                const title = document.querySelector('h1, .product-title, .p-name')?.textContent?.trim() || 'LNKICKS Sneaker';
                const priceTxt = document.querySelector('.price, .product-price, .current-price')?.textContent?.replace(/[^0-9]/g, '') || '8899';
                const img = mainImage?.getAttribute('src') || 'jordan_powder_blue_nobg.png';

                if (window.LNKICKS && window.LNKICKS.addToCart) {
                    window.LNKICKS.addToCart({
                        id: title.toLowerCase().replace(/\\s+/g, '-'),
                        name: title,
                        price: parseInt(priceTxt, 10),
                        image: img,
                        size: selectedSize,
                        color: selectedColor,
                        qty: currentQty
                    });
                }
                window.location.href = 'checkout.html';
            });
        }

        // G. WISHLIST TOGGLE
        const wishlistBtn = document.querySelector('#btn-wishlist, .btn-wishlist, .product-wishlist-icon');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function(e){
                e.preventDefault();
                const title = document.querySelector('h1, .product-title')?.textContent?.trim() || 'Sneaker';
                wishlistBtn.classList.toggle('active');
                if (window.LNKICKS && window.LNKICKS.toggleWishlist) {
                    window.LNKICKS.toggleWishlist({
                        id: title.toLowerCase().replace(/\\s+/g, '-'),
                        name: title
                    });
                }
            });
        }

        // H. BACK BUTTON
        const backBtns = document.querySelectorAll('.btn-back, [data-action="back"], .back-link');
        backBtns.forEach(btn => {
            btn.addEventListener('click', function(e){
                e.preventDefault();
                if (document.referrer && document.referrer.includes(window.location.host)) {
                    window.history.back();
                } else {
                    window.location.href = 'category_products.html';
                }
            });
        });

        // I. SHARE BUTTON
        const shareBtn = document.querySelector('#btn-share, .btn-share, [data-action="share"]');
        if (shareBtn) {
            shareBtn.addEventListener('click', function(e){
                e.preventDefault();
                if (navigator.share) {
                    navigator.share({
                        title: document.title,
                        url: window.location.href
                    }).catch(() => {});
                } else {
                    navigator.clipboard.writeText(window.location.href);
                    if (window.LNKICKS && window.LNKICKS.showToast) {
                        window.LNKICKS.showToast('Product link copied to clipboard!');
                    }
                }
            });
        }
    });
})();
"""

with open(os.path.join(js_dir, "product_flow.js"), "w", encoding="utf-8") as f:
    f.write(product_flow_js)

print("Created js/product_flow.js!")

# 2. Inject js/product_flow.js into product_detail.html, category_products.html, categories.html, search.html, wishlist.html
target_pages = [
    "product_detail.html", "category_products.html", "categories.html", 
    "search.html", "wishlist.html", "cart.html", "index.html", "mobile.html"
]

modified_count = 0
for p in target_pages:
    file_path = os.path.join(project_dir, p)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        if 'src="js/product_flow.js"' not in content:
            if '</body>' in content:
                content = content.replace('</body>', '<script src="js/product_flow.js"></script>\n</body>')
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                modified_count += 1

print(f"Injected product_flow.js into {modified_count} target pages!")
