import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
js_dir = os.path.join(project_dir, "js")
os.makedirs(js_dir, exist_ok=True)

# 1. Create dedicated production Cart & Checkout Engine js/cart_checkout_engine.js
cart_engine_js = """/* =========================================================
   LNKICKS CART & CHECKOUT ENGINE (CART_CHECKOUT_ENGINE.JS)
   ========================================================= */

(function(){
    document.addEventListener('DOMContentLoaded', function(){
        const page = window.location.pathname.split('/').pop();

        // ----------------------------------------------------
        // A. CART PAGE LOGIC (cart.html)
        // ----------------------------------------------------
        if (page === 'cart.html') {
            const cartItems = JSON.parse(localStorage.getItem('lnk_cart') || '[]');
            const cartContainer = document.querySelector('.cart-items-list, #cart-items-container, .cart-list');
            const emptyState = document.querySelector('.empty-cart-state, #empty-cart-view');

            function renderCart() {
                const items = JSON.parse(localStorage.getItem('lnk_cart') || '[]');
                
                if (items.length === 0) {
                    if (cartContainer) cartContainer.style.display = 'none';
                    if (emptyState) emptyState.style.display = 'block';
                    updateTotals(0, 0);
                    return;
                }

                if (cartContainer) cartContainer.style.display = 'block';
                if (emptyState) emptyState.style.display = 'none';

                let subtotal = 0;
                items.forEach((item, index) => {
                    subtotal += (item.price * item.qty);
                });

                updateTotals(subtotal, items.length);
            }

            function updateTotals(subtotal, count) {
                const discount = subtotal > 15000 ? 1000 : 0;
                const shipping = subtotal > 0 ? (subtotal > 10000 ? 0 : 250) : 0;
                const tax = Math.round(subtotal * 0.12);
                const grandTotal = Math.max(0, subtotal - discount + shipping + tax);

                document.querySelectorAll('.subtotal-val, [data-subtotal]').forEach(el => el.textContent = '₹' + subtotal.toLocaleString('en-IN'));
                document.querySelectorAll('.discount-val, [data-discount]').forEach(el => el.textContent = '-₹' + discount.toLocaleString('en-IN'));
                document.querySelectorAll('.shipping-val, [data-shipping]').forEach(el => el.textContent = shipping === 0 ? 'FREE' : '₹' + shipping);
                document.querySelectorAll('.tax-val, [data-tax]').forEach(el => el.textContent = '₹' + tax.toLocaleString('en-IN'));
                document.querySelectorAll('.grand-total-val, .total-val, [data-total]').forEach(el => el.textContent = '₹' + grandTotal.toLocaleString('en-IN'));
            }

            renderCart();

            // Bind Quantity +, -, Remove, Move to Wishlist
            document.addEventListener('click', function(e){
                const target = e.target.closest('button, a');
                if (!target) return;

                const items = JSON.parse(localStorage.getItem('lnk_cart') || '[]');

                // Plus Quantity
                if (target.classList.contains('qty-plus') || target.hasAttribute('data-qty-plus')) {
                    const idx = parseInt(target.getAttribute('data-index') || '0', 10);
                    if (items[idx]) {
                        items[idx].qty++;
                        localStorage.setItem('lnk_cart', JSON.stringify(items));
                        if (window.LNKICKS) window.LNKICKS.updateBadges();
                        renderCart();
                    }
                }

                // Minus Quantity
                if (target.classList.contains('qty-minus') || target.hasAttribute('data-qty-minus')) {
                    const idx = parseInt(target.getAttribute('data-index') || '0', 10);
                    if (items[idx] && items[idx].qty > 1) {
                        items[idx].qty--;
                        localStorage.setItem('lnk_cart', JSON.stringify(items));
                        if (window.LNKICKS) window.LNKICKS.updateBadges();
                        renderCart();
                    }
                }

                // Remove Item
                if (target.classList.contains('btn-remove-item') || target.hasAttribute('data-remove')) {
                    const idx = parseInt(target.getAttribute('data-index') || '0', 10);
                    items.splice(idx, 1);
                    localStorage.setItem('lnk_cart', JSON.stringify(items));
                    if (window.LNKICKS) window.LNKICKS.updateBadges();
                    renderCart();
                    if (window.LNKICKS) window.LNKICKS.showToast('Item removed from Cart');
                }

                // Coupon Code Apply
                if (target.id === 'btn-apply-coupon' || target.classList.contains('btn-apply-coupon')) {
                    e.preventDefault();
                    const couponInput = document.querySelector('#coupon-code-input, input[placeholder*="Coupon"]');
                    const code = couponInput?.value?.trim()?.toUpperCase();
                    if (code === 'LNKICKS10' || code === 'WELCOME20' || code === 'FREESHIP') {
                        if (window.LNKICKS) window.LNKICKS.showToast('Coupon ' + code + ' Applied Successfully!');
                    } else {
                        if (window.LNKICKS) window.LNKICKS.showToast('Invalid Coupon Code');
                    }
                }

                // Proceed to Checkout
                if (target.id === 'btn-checkout' || target.classList.contains('btn-checkout')) {
                    e.preventDefault();
                    window.location.href = 'checkout.html';
                }
            });
        }

        // ----------------------------------------------------
        // B. CHECKOUT PAGE LOGIC (checkout.html)
        // ----------------------------------------------------
        if (page === 'checkout.html') {
            const checkoutForm = document.querySelector('form, #checkout-form');
            const placeOrderBtn = document.querySelector('#btn-place-order, .btn-place-order, button:contains("Place Order")');

            // Payment Selection
            const paymentOptions = document.querySelectorAll('.payment-option, input[name="payment_method"]');
            paymentOptions.forEach(opt => {
                opt.addEventListener('click', function(){
                    paymentOptions.forEach(p => p.classList.remove('active', 'border-black'));
                    this.classList.add('active');
                });
            });

            if (placeOrderBtn) {
                placeOrderBtn.addEventListener('click', function(e){
                    e.preventDefault();

                    // Form Validation
                    const name = document.querySelector('input[name="fullname"], input[placeholder*="Name"]')?.value?.trim();
                    const phone = document.querySelector('input[name="phone"], input[placeholder*="Phone"]')?.value?.trim();
                    const address = document.querySelector('input[name="address"], textarea[placeholder*="Address"]')?.value?.trim();

                    if (!name || !phone || !address) {
                        if (window.LNKICKS) window.LNKICKS.showToast('Please fill in your Delivery Name, Phone & Address.');
                        return;
                    }

                    // Generate Order ID & Save Order
                    const orderId = 'LNK-' + Math.floor(100000 + Math.random() * 900000);
                    const cartItems = JSON.parse(localStorage.getItem('lnk_cart') || '[]');
                    const orderObj = {
                        orderId: orderId,
                        items: cartItems,
                        total: document.querySelector('.grand-total-val, .total-val')?.textContent || '₹14,999',
                        date: new Date().toLocaleDateString('en-IN'),
                        status: 'Confirmed'
                    };

                    const existingOrders = JSON.parse(localStorage.getItem('lnk_orders') || '[]');
                    existingOrders.unshift(orderObj);
                    localStorage.setItem('lnk_orders', JSON.stringify(existingOrders));

                    // Clear Cart & Update Badges
                    localStorage.setItem('lnk_cart', '[]');
                    if (window.LNKICKS) window.LNKICKS.updateBadges();

                    // Redirect to Order Success Page
                    window.location.href = 'order_success.html?orderId=' + orderId;
                });
            }
        }

        // ----------------------------------------------------
        // C. ORDER SUCCESS PAGE LOGIC (order_success.html)
        // ----------------------------------------------------
        if (page === 'order_success.html') {
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('orderId') || 'LNK-' + Math.floor(100000 + Math.random() * 900000);
            
            const orderIdDisplay = document.querySelector('.order-id, #order-id-val, [data-order-id]');
            if (orderIdDisplay) {
                orderIdDisplay.textContent = '#' + orderId;
            }

            // Continue Shopping Button
            const continueBtn = document.querySelector('.btn-continue-shopping, a:contains("Continue Shopping")');
            if (continueBtn) {
                continueBtn.addEventListener('click', function(e){
                    e.preventDefault();
                    const isMobile = window.innerWidth <= 768;
                    window.location.href = isMobile ? 'mobile.html' : 'index.html';
                });
            }

            // Track Order Button
            const trackBtn = document.querySelector('.btn-track-order, a:contains("Track Order")');
            if (trackBtn) {
                trackBtn.addEventListener('click', function(e){
                    e.preventDefault();
                    window.location.href = 'track_order.html?orderId=' + orderId;
                });
            }
        }
    });
})();
"""

with open(os.path.join(js_dir, "cart_checkout_engine.js"), "w", encoding="utf-8") as f:
    f.write(cart_engine_js)

print("Created js/cart_checkout_engine.js!")

# 2. Inject js/cart_checkout_engine.js into cart.html, checkout.html, order_success.html, wishlist.html
cart_pages = ["cart.html", "checkout.html", "order_success.html", "wishlist.html", "track_order.html", "index.html", "mobile.html"]

modified_count = 0
for p in cart_pages:
    file_path = os.path.join(project_dir, p)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        if 'src="js/cart_checkout_engine.js"' not in content:
            if '</body>' in content:
                content = content.replace('</body>', '<script src="js/cart_checkout_engine.js"></script>\n</body>')
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                modified_count += 1

print(f"Injected cart_checkout_engine.js into {modified_count} cart & checkout pages!")
