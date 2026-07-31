import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
js_dir = os.path.join(project_dir, "js")
os.makedirs(js_dir, exist_ok=True)

# 1. Create production User Account Engine js/user_account_engine.js
account_engine_js = """/* =========================================================
   LNKICKS USER ACCOUNT ENGINE (USER_ACCOUNT_ENGINE.JS)
   ========================================================= */

(function(){
    document.addEventListener('DOMContentLoaded', function(){
        const page = window.location.pathname.split('/').pop();

        // Default User Session Initializer
        if (!localStorage.getItem('lnk_user')) {
            const defaultUser = {
                name: 'Charles Taylor',
                email: 'charles.taylor@lnkicks.com',
                phone: '+91 98765 43210',
                joined: 'January 2026',
                isLoggedIn: true
            };
            localStorage.setItem('lnk_user', JSON.stringify(defaultUser));
        }

        const currentUser = JSON.parse(localStorage.getItem('lnk_user'));

        // ----------------------------------------------------
        // A. LOGIN PAGE LOGIC (admin_login.html)
        // ----------------------------------------------------
        if (page === 'admin_login.html') {
            const loginForm = document.querySelector('form, #login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', function(e){
                    e.preventDefault();
                    const email = document.querySelector('input[type="email"], input[name="email"]')?.value?.trim();
                    const pass = document.querySelector('input[type="password"], input[name="password"]')?.value?.trim();

                    if (!email || !pass) {
                        if (window.LNKICKS) window.LNKICKS.showToast('Please enter both Email and Password.');
                        return;
                    }

                    currentUser.isLoggedIn = true;
                    currentUser.email = email;
                    localStorage.setItem('lnk_user', JSON.stringify(currentUser));
                    if (window.LNKICKS) window.LNKICKS.showToast('Login successful!');

                    setTimeout(() => {
                        window.location.href = email.includes('admin') ? 'dashboard.html' : 'profile.html';
                    }, 500);
                });
            }
        }

        // ----------------------------------------------------
        // B. PROFILE PAGE LOGIC (profile.html)
        // ----------------------------------------------------
        if (page === 'profile.html') {
            const nameInput = document.querySelector('input[name="name"], #profile-name');
            const emailInput = document.querySelector('input[name="email"], #profile-email');
            const phoneInput = document.querySelector('input[name="phone"], #profile-phone');

            if (nameInput && currentUser.name) nameInput.value = currentUser.name;
            if (emailInput && currentUser.email) emailInput.value = currentUser.email;
            if (phoneInput && currentUser.phone) phoneInput.value = currentUser.phone;

            // Save Profile Changes
            const saveBtn = document.querySelector('#btn-save-profile, button:contains("Save")');
            if (saveBtn) {
                saveBtn.addEventListener('click', function(e){
                    e.preventDefault();
                    currentUser.name = nameInput?.value?.trim() || currentUser.name;
                    currentUser.email = emailInput?.value?.trim() || currentUser.email;
                    currentUser.phone = phoneInput?.value?.trim() || currentUser.phone;
                    localStorage.setItem('lnk_user', JSON.stringify(currentUser));
                    if (window.LNKICKS) window.LNKICKS.showToast('Profile updated successfully!');
                });
            }

            // Logout Button
            document.querySelectorAll('.btn-logout, [data-action="logout"], a:contains("Logout")').forEach(btn => {
                btn.addEventListener('click', function(e){
                    e.preventDefault();
                    currentUser.isLoggedIn = false;
                    localStorage.setItem('lnk_user', JSON.stringify(currentUser));
                    if (window.LNKICKS) window.LNKICKS.showToast('Logged out');
                    const isMobile = window.innerWidth <= 768;
                    setTimeout(() => {
                        window.location.href = isMobile ? 'mobile.html' : 'index.html';
                    }, 400);
                });
            });
        }

        // ----------------------------------------------------
        // C. MY ORDERS PAGE LOGIC (my_orders.html)
        // ----------------------------------------------------
        if (page === 'my_orders.html') {
            const orders = JSON.parse(localStorage.getItem('lnk_orders') || '[]');
            const ordersList = document.querySelector('.orders-list, #orders-container');

            if (ordersList && orders.length > 0) {
                // Dynamically ensure orders render
                document.querySelectorAll('.order-card-id').forEach((el, i) => {
                    if (orders[i]) el.textContent = '#' + orders[i].orderId;
                });
            }
        }

        // ----------------------------------------------------
        // D. TRACK ORDER PAGE LOGIC (track_order.html)
        // ----------------------------------------------------
        if (page === 'track_order.html') {
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('orderId') || 'LNK-784912';

            const trackingInput = document.querySelector('input[placeholder*="Order ID"]');
            if (trackingInput) trackingInput.value = '#' + orderId;
        }

        // ----------------------------------------------------
        // E. NOTIFICATION SETTINGS LOGIC (notification_settings.html)
        // ----------------------------------------------------
        if (page === 'notification_settings.html') {
            const switches = document.querySelectorAll('input[type="checkbox"]');
            switches.forEach(sw => {
                sw.addEventListener('change', function(){
                    if (window.LNKICKS) window.LNKICKS.showToast('Notification preference saved');
                });
            });
        }
    });
})();
"""

with open(os.path.join(js_dir, "user_account_engine.js"), "w", encoding="utf-8") as f:
    f.write(account_engine_js)

print("Created js/user_account_engine.js!")

# 2. Inject js/user_account_engine.js into all user account pages
account_pages = [
    "admin_login.html", "profile.html", "my_orders.html", 
    "order_detail.html", "track_order.html", "addresses.html", 
    "payment_methods.html", "notification_settings.html", "wishlist.html"
]

modified_count = 0
for p in account_pages:
    file_path = os.path.join(project_dir, p)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        if 'src="js/user_account_engine.js"' not in content:
            if '</body>' in content:
                content = content.replace('</body>', '<script src="js/user_account_engine.js"></script>\n</body>')
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                modified_count += 1

print(f"Injected user_account_engine.js into {modified_count} account pages!")
