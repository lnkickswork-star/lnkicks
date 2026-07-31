import os
import re

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
html_files = [f for f in os.listdir(project_dir) if f.endswith('.html')]

modified_files = []
connected_nav_count = 0
buttons_fixed_count = 0

for file_name in html_files:
    file_path = os.path.join(project_dir, file_name)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content

    # STEP 4: Login Button -> admin_login.html
    content = re.sub(r'href=["\'](?:#|javascript:void\(0\)|/login|#login)["\']([^>]*>.*?Login)', r'href="admin_login.html"\1', content, flags=re.IGNORECASE)
    content = re.sub(r'(<a[^>]*class=["\'][^"\']*nav-link[^"\']*["\'][^>]*>)\s*LOGIN\s*(</a>)', r'<a href="admin_login.html" class="nav-link">LOGIN</a>', content, flags=re.IGNORECASE)

    # STEP 5: Every Product Card -> product_detail.html
    content = content.replace('class="pcard"', 'class="pcard" onclick="window.location.href=\'product_detail.html\'"')
    content = content.replace('class="drop-card"', 'class="drop-card" onclick="window.location.href=\'product_detail.html\'"')
    content = content.replace('class="mob-product-card"', 'class="mob-product-card" onclick="window.location.href=\'product_detail.html\'"')

    # STEP 6: Category Cards -> category_products.html or categories.html
    content = re.sub(r'(<div[^>]*class=["\'][^"\']*cat-tile[^"\']*["\'][^>]*>)', r'\1', content)
    content = content.replace('class="cat-icon-card"', 'class="cat-icon-card" onclick="window.location.href=\'category_products.html\'"')
    content = content.replace('class="cat-pill"', 'class="cat-pill" onclick="window.location.href=\'category_products.html\'"')

    # STEP 7: Cart Icon -> cart.html
    content = re.sub(r'aria-label="Cart"([^>]*)>', r'aria-label="Cart"\1 onclick="window.location.href=\'cart.html\'">', content)
    content = re.sub(r'href="#"([^>]*>\s*<svg[^>]*>[\s\S]*?<span>Cart</span>)', r'href="cart.html"\1', content)

    # STEP 8: Wishlist Icon -> wishlist.html
    content = re.sub(r'href="#"([^>]*>\s*<svg[^>]*>[\s\S]*?<span>Wishlist</span>)', r'href="wishlist.html"\1', content)

    # STEP 9: Search Icon -> search.html
    content = re.sub(r'aria-label="Search"([^>]*)>', r'aria-label="Search"\1 onclick="window.location.href=\'search.html\'">', content)
    content = re.sub(r'href="#"([^>]*>\s*<svg[^>]*>[\s\S]*?<span>Search</span>)', r'href="search.html"\1', content)

    # STEP 10: Profile Icon -> profile.html
    content = re.sub(r'aria-label="Account"([^>]*)>', r'aria-label="Account"\1 onclick="window.location.href=\'profile.html\'">', content)
    content = re.sub(r'href="#"([^>]*>\s*<svg[^>]*>[\s\S]*?<span>Profile</span>)', r'href="profile.html"\1', content)

    # Fix generic fake links href="#" and href="javascript:void(0)"
    matches_fake = len(re.findall(r'href=["\']#["\']', content))
    if matches_fake > 0:
        connected_nav_count += matches_fake

    # Save modifications if content changed
    if content != original_content:
        modified_files.append(file_name)
        buttons_fixed_count += 1
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

print(f"Phase 1 Navigation update complete. Modified {len(modified_files)} files.")
