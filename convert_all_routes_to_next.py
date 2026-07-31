import os
import re

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
app_dir = os.path.join(project_dir, "app")

route_mapping = {
    "categories.html": "categories",
    "category_products.html": "category-products",
    "product_detail.html": "product-detail",
    "cart.html": "cart",
    "checkout.html": "checkout",
    "order_success.html": "order-success",
    "wishlist.html": "wishlist",
    "my_orders.html": "my-orders",
    "order_detail.html": "order-detail",
    "profile.html": "profile",
    "addresses.html": "addresses",
    "search.html": "search",
    "filters.html": "filters",
    "help_support.html": "help-support",
    "terms_conditions.html": "terms-conditions",
    "privacy_policy.html": "privacy-policy",
    "return_refund_policy.html": "return-refund-policy",
    "shipping_policy.html": "shipping-policy",
    "cancellation_policy.html": "cancellation-policy",
    "contact_us.html": "contact-us",
    "faqs.html": "faqs",
    "size_guide.html": "size-guide",
    "track_order.html": "track-order",
    "payment_methods.html": "payment-methods",
    "notification_settings.html": "notification-settings",
    "admin_login.html": "admin-login",
    "dashboard.html": "dashboard",
    "orders_management.html": "orders-management",
    "products_management.html": "products-management",
    "customers_management.html": "customers-management",
    "reports_analytics.html": "reports-analytics",
    "add_product.html": "add-product",
    "edit_product.html": "edit-product",
    "settings_panel.html": "settings-panel"
}

converted_count = 0

for html_file, route_dir in route_mapping.items():
    src_file = os.path.join(project_dir, html_file)
    if os.path.exists(src_file):
        with open(src_file, "r", encoding="utf-8") as f:
            html_content = f.read()

        # Extract body content or complete HTML container
        body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL | re.IGNORECASE)
        inner_html = body_match.group(1) if body_match else html_content

        # Escape unescaped curly braces and JSX entities for React
        inner_html_cleaned = inner_html.replace('{', '&#123;').replace('}', '&#125;').replace('class=', 'className=')

        target_dir = os.path.join(app_dir, route_dir)
        os.makedirs(target_dir, exist_ok=True)

        tsx_code = f"""'use client';

import React from 'react';

export default function {route_dir.replace('-', '_').title().replace('_', '')}Page() {{
  return (
    <div dangerouslySetInnerHTML={{{{ __html: `{inner_html.replace('`', '\\`').replace('${', '\\${')}` }}}} />
  );
}}
"""
        with open(os.path.join(target_dir, "page.tsx"), "w", encoding="utf-8") as f:
            f.write(tsx_code)
        
        converted_count += 1
        print(f"Converted {html_file} -> app/{route_dir}/page.tsx")

print(f"\nSuccessfully migrated {converted_count} webapp pages to Next.js App Router!")
