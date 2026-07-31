import os
import shutil
import re

design_system_dir = r"C:\Users\sagar\Desktop\stitch_luxury_sneaker_app_design_system(1)\stitch_luxury_sneaker_app_design_system"
project_dir = r"c:\Users\sagar\Desktop\lnkcks"

page_mapping = {
    "04._categories_screen": "categories.html",
    "05._category_products": "category_products.html",
    "06._product_detail": "product_detail.html",
    "07._cart_screen": "cart.html",
    "08._checkout_screen": "checkout.html",
    "09._order_success": "order_success.html",
    "10._wishlist": "wishlist.html",
    "11._my_orders": "my_orders.html",
    "12._order_detail": "order_detail.html",
    "13._profile": "profile.html",
    "14._addresses": "addresses.html",
    "15._search": "search.html",
    "16._filters": "filters.html",
    "17._help_support": "help_support.html",
    "18._terms_conditions": "terms_conditions.html",
    "19._privacy_policy": "privacy_policy.html",
    "20._return_refund_policy": "return_refund_policy.html",
    "21._shipping_policy": "shipping_policy.html",
    "22._cancellation_policy": "cancellation_policy.html",
    "23._contact_us": "contact_us.html",
    "24._faqs": "faqs.html",
    "25._size_guide": "size_guide.html",
    "26._track_order": "track_order.html",
    "27._payment_methods": "payment_methods.html",
    "28._notification_settings": "notification_settings.html",
    "29._admin_login": "admin_login.html",
    "30._dashboard": "dashboard.html",
    "31._orders_management": "orders_management.html",
    "32._products_management": "products_management.html",
    "33._customers_management": "customers_management.html",
    "34._reports_analytics": "reports_analytics.html",
    "35._add_product": "add_product.html",
    "36._edit_product": "edit_product.html",
    "37._settings_panel": "settings_panel.html",
}

copied_count = 0
for folder_name, file_name in page_mapping.items():
    src_code = os.path.join(design_system_dir, folder_name, "code.html")
    dest_path = os.path.join(project_dir, file_name)
    if os.path.exists(src_code):
        shutil.copyfile(src_code, dest_path)
        copied_count += 1
        print(f"Copied {folder_name} -> {file_name}")

print(f"\nSuccessfully created {copied_count} standalone pages in project root!")

# Now update navigation links in index.html and mobile.html to point to these pages!

def link_mobile_nav():
    mobile_file = os.path.join(project_dir, "mobile.html")
    if not os.path.exists(mobile_file):
        return
    with open(mobile_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Link bottom nav items
    content = content.replace('href="#" class="nav-item active">\n            <div class="nav-item-pill">',
                              'href="mobile.html" class="nav-item active">\n            <div class="nav-item-pill">')
    content = re.sub(r'href="#"([^>]*>\s*<svg[^>]*>[\s\S]*?<span>Explore</span>)', r'href="categories.html"\1', content)
    content = re.sub(r'href="#"([^>]*>\s*<svg[^>]*>[\s\S]*?<span>Wishlist</span>)', r'href="wishlist.html"\1', content)
    content = re.sub(r'href="#"([^>]*>\s*<svg[^>]*>[\s\S]*?<span>Profile</span>)', r'href="profile.html"\1', content)

    # Link header search and cart
    content = content.replace('placeholder="Search fashion, sneakers, brands..."', 'placeholder="Search fashion, sneakers, brands..." onclick="window.location.href=\'search.html\'"')

    with open(mobile_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Linked mobile.html navigation items!")

def link_desktop_nav():
    desktop_file = os.path.join(project_dir, "index.html")
    if not os.path.exists(desktop_file):
        return
    with open(desktop_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Footer and Header Links
    link_replacements = {
        'href="#" class="footer-link">Authenticity Guarantee': 'href="help_support.html" class="footer-link">Authenticity Guarantee',
        'href="#" class="footer-link">Return &amp; Exchange Policy': 'href="return_refund_policy.html" class="footer-link">Return &amp; Exchange Policy',
        'href="#" class="footer-link">Terms and Conditions': 'href="terms_conditions.html" class="footer-link">Terms and Conditions',
        'href="#" class="footer-link">Shipping Policy': 'href="shipping_policy.html" class="footer-link">Shipping Policy',
        'href="#" class="footer-link">Contact Us': 'href="contact_us.html" class="footer-link">Contact Us',
        'href="#" class="footer-link">Privacy Policy': 'href="privacy_policy.html" class="footer-link">Privacy Policy',
        'href="#" class="footer-link">Sneakers': 'href="category_products.html" class="footer-link">Sneakers',
        'href="#" class="footer-link">Street Wear': 'href="categories.html" class="footer-link">Street Wear',
        'href="#" class="footer-link">Track Your Order': 'href="track_order.html" class="footer-link">Track Your Order',
    }

    for old_str, new_str in link_replacements.items():
        content = content.replace(old_str, new_str)

    with open(desktop_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Linked index.html navigation items!")

link_mobile_nav()
link_desktop_nav()
