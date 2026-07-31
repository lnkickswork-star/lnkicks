#!/usr/bin/env python3
"""
LNKICKS — per-route metadata layout generator.

For every route under app/ that does NOT already have a layout.tsx,
create one that exports a Next.js `metadata` object built from
lib/route-metadata.ts:createRouteMetadata().

For dynamic routes (/product/[slug], /category/[slug]) we export
`generateMetadata` instead of a static `metadata` object so the
title/description/OG image reflect the actual product/category.

Layouts are minimal pass-through wrappers:
    export default function RouteLayout({ children }) {
      return <>{children}</>;
    }

This is the standard Next.js pattern for attaching metadata to a
client-component page without converting the page itself to a
server component (which would require removing 'use client').
"""

from pathlib import Path

ROOT = Path('/home/z/my-project')
APP = ROOT / 'app'

# (route_dir_relative_to_app, title, description, path, optional kwargs)
# `path` is the canonical URL used for the alternates.canonical field.
ROUTES = [
    # Core
    ('mobile',                'LNKICKS — Mobile App',                                    'Mobile experience for LNKICKS — browse authentic luxury sneakers on the go.',                                '/mobile',                {'noIndex': True}),
    ('desktop',               'LNKICKS — Desktop Home',                                  'Desktop home for LNKICKS — shop authentic luxury sneakers and hyped drops.',                                  '/desktop',               {'noIndex': True}),

    # Catalog
    ('categories',            'Categories — LNKICKS',                                    'Browse all sneaker and apparel categories — Sneakers, Running, Basketball, Lifestyle, Training, Slides, Limited Edition.', '/categories',            {}),
    ('category-products',     'Sneakers & Apparel — LNKICKS',                            'Shop the full LNKICKS catalog of authentic luxury sneakers and apparel across all brands.',                   '/category-products',     {}),
    ('products',              'All Products — LNKICKS',                                  'Browse every authentic luxury sneaker and apparel product available at LNKICKS.',                             '/products',              {}),
    ('product/[slug]',        '__DYNAMIC__',                                             '__DYNAMIC__',                                                                                                 '__DYNAMIC__',            {'kind': 'product'}),
    ('category/[slug]',       '__DYNAMIC__',                                             '__DYNAMIC__',                                                                                                 '__DYNAMIC__',            {'kind': 'category'}),
    ('search',                'Search — LNKICKS',                                        'Search authentic luxury sneakers and apparel by brand, name, or category at LNKICKS.',                        '/search',                {}),
    ('filters',               'Filter Products — LNKICKS',                               'Refine your sneaker search by brand, size, color, and price with LNKICKS filters.',                           '/filters',               {'noIndex': True}),

    # Commerce
    ('cart',                  'Shopping Cart — LNKICKS',                                 'Review the authentic luxury sneakers and apparel in your LNKICKS shopping bag before checkout.',              '/cart',                  {'noIndex': True}),
    ('checkout',              'Checkout — LNKICKS',                                      'Securely complete your LNKICKS order with multiple payment options and fast shipping across India.',          '/checkout',              {'noIndex': True}),
    ('order-success',         'Order Confirmed — LNKICKS',                               'Your LNKICKS order is confirmed. Track your authentic luxury sneakers shipment here.',                        '/order-success',         {'noIndex': True}),
    ('order-failed',          'Order Failed — LNKICKS',                                  'Your LNKICKS order could not be completed. Please review your payment details and try again.',                '/order-failed',          {'noIndex': True}),
    ('order-detail',          'Order Details — LNKICKS',                                 'View detailed information about your LNKICKS order including items, shipping, and tracking.',                 '/order-detail',          {'noIndex': True}),
    ('track-order',           'Track Your Order — LNKICKS',                              'Track your LNKICKS order in real time — from authentication verification to delivery at your doorstep.',      '/track-order',           {'noIndex': True}),

    # Account
    ('profile',               'My Profile — LNKICKS',                                    'Manage your LNKICKS account profile, contact details, and personal preferences.',                             '/profile',               {'noIndex': True}),
    ('my-orders',             'My Orders — LNKICKS',                                     'View your complete LNKICKS order history including status, tracking, and invoice details.',                   '/my-orders',             {'noIndex': True}),
    ('addresses',             'Saved Addresses — LNKICKS',                               'Manage your saved shipping and billing addresses for faster LNKICKS checkout.',                               '/addresses',             {'noIndex': True}),
    ('payment-methods',       'Payment Methods — LNKICKS',                               'Manage your saved payment methods for secure and fast LNKICKS checkout.',                                     '/payment-methods',       {'noIndex': True}),
    ('wishlist',              'My Wishlist — LNKICKS',                                   'Your saved LNKICKS wishlist — authentic luxury sneakers and apparel you love, ready to buy.',                 '/wishlist',              {'noIndex': True}),
    ('notification-settings', 'Notification Settings — LNKICKS',                         'Manage how LNKICKS contacts you — order updates, drop alerts, and promotional notifications.',                '/notification-settings', {'noIndex': True}),

    # Auth
    ('login',                 'Login — LNKICKS',                                         'Sign in to your LNKICKS account to access orders, wishlist, and faster checkout.',                            '/login',                 {'noIndex': True}),
    ('register',              'Create Account — LNKICKS',                                'Create a LNKICKS account for exclusive member drops, faster checkout, and order tracking.',                   '/register',              {'noIndex': True}),
    ('admin-login',           'Admin Portal Login — LNKICKS',                            'Authorized LNKICKS staff portal access.',                                                                     '/admin-login',           {'noIndex': True}),

    # Admin
    ('dashboard',             'Admin Dashboard — LNKICKS',                               'LNKICKS admin dashboard — catalog, orders, customers, and analytics overview.',                               '/dashboard',             {'noIndex': True}),
    ('products-management',   'Manage Catalog — LNKICKS Admin',                          'Manage the LNKICKS product catalog — add, edit, and inventory-track authentic luxury sneakers.',              '/products-management',   {'noIndex': True}),
    ('orders-management',     'Manage Orders — LNKICKS Admin',                           'Manage and fulfill LNKICKS customer orders from the admin portal.',                                           '/orders-management',     {'noIndex': True}),
    ('customers-management',  'Manage Customers — LNKICKS Admin',                        'View and manage LNKICKS customer accounts, order history, and support tickets.',                              '/customers-management',  {'noIndex': True}),
    ('reports-analytics',     'Reports & Analytics — LNKICKS Admin',                     'Sales, inventory, and customer analytics reports for LNKICKS admin staff.',                                   '/reports-analytics',     {'noIndex': True}),
    ('settings-panel',        'Settings Panel — LNKICKS Admin',                          'Configure LNKICKS store settings — payments, shipping, taxes, and integrations.',                             '/settings-panel',        {'noIndex': True}),
    ('add-product',           'Add Product — LNKICKS Admin',                             'Add a new authentic luxury sneaker or apparel product to the LNKICKS catalog.',                               '/add-product',           {'noIndex': True}),
    ('edit-product',          'Edit Product — LNKICKS Admin',                            'Edit an existing LNKICKS catalog product — pricing, inventory, images, and metadata.',                        '/edit-product',          {'noIndex': True}),

    # Support
    ('contact-us',            'Contact Us — LNKICKS',                                    'Get in touch with LNKICKS customer support for orders, authenticity, and general inquiries.',                 '/contact-us',            {}),
    ('faqs',                  'Frequently Asked Questions — LNKICKS',                    'Answers to common LNKICKS questions on authenticity, shipping, returns, and sizing.',                         '/faqs',                  {}),
    ('help-support',          'Help & Support — LNKICKS',                                'LNKICKS help center — authenticity guarantee, shipping, returns, and account support.',                       '/help-support',          {}),
    ('size-guide',            'Size Guide — LNKICKS',                                    'LNKICKS footwear size guide — convert UK, US, and EU sizes for the perfect sneaker fit.',                     '/size-guide',            {}),

    # Policies
    ('privacy-policy',        'Privacy Policy — LNKICKS',                                'Read the LNKICKS privacy policy — how we collect, use, and protect your personal data.',                      '/privacy-policy',        {}),
    ('terms-conditions',      'Terms & Conditions — LNKICKS',                            'The terms and conditions governing your use of LNKICKS and purchases of authentic luxury sneakers.',          '/terms-conditions',      {}),
    ('return-refund-policy',  'Return & Refund Policy — LNKICKS',                        'LNKICKS return and refund policy — 7-day hassle-free returns and exchange on authentic sneakers.',            '/return-refund-policy',  {}),
    ('shipping-policy',       'Shipping Policy — LNKICKS',                               'LNKICKS shipping policy — express dispatch, delivery timelines, and shipping coverage across India.',         '/shipping-policy',       {}),
    ('cancellation-policy',   'Cancellation Policy — LNKICKS',                           'LNKICKS order cancellation policy — eligibility, timelines, and refund processing.',                          '/cancellation-policy',   {}),
]

LAYOUT_TEMPLATE = """import React from 'react';
import type {{ Metadata }} from 'next';
import {{ createRouteMetadata }} from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({{
  title: {title_literal},
  description: {desc_literal},
  path: {path_literal},
{extra_fields}}});

export default function RouteLayout({{
  children,
}}: {{
  children: React.ReactNode;
}}) {{
  return <>{{children}}</>;
}}
"""

PRODUCT_DYNAMIC_TEMPLATE = """import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = PRODUCT_REGISTRY.find((p) => p.slug === params.slug) || PRODUCT_REGISTRY[0];
  return createRouteMetadata({
    title: `${product.seoTitle}`,
    description: product.seoDescription,
    path: `/product/${product.slug}`,
    image: product.primaryImage,
    ogType: 'product',
  });
}

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
"""

CATEGORY_DYNAMIC_TEMPLATE = """import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
import { CATEGORY_REGISTRY } from '@/components/category/CategoryRegistry';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const category = CATEGORY_REGISTRY.find((c) => c.slug === params.slug);
  const title = category ? `${category.name} — LNKICKS` : 'Category — LNKICKS';
  const description = category
    ? category.description
    : 'Browse authentic luxury sneakers and apparel by category at LNKICKS.';
  const path = category ? `/category/${category.slug}` : '/categories';
  return createRouteMetadata({
    title,
    description,
    path,
    image: category ? `/${category.image}` : undefined,
  });
}

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
"""


def js_literal(s: str) -> str:
    """Return a JS string literal, single-quoted, with escaping."""
    escaped = s.replace('\\', '\\\\').replace("'", "\\'")
    return f"'{escaped}'"


def write_layout(route_dir: Path, content: str) -> str:
    layout_path = route_dir / 'layout.tsx'
    if layout_path.exists():
        return f'SKIP (exists): {layout_path.relative_to(ROOT)}'
    layout_path.write_text(content, encoding='utf-8')
    return f'CREATE: {layout_path.relative_to(ROOT)}'


def main():
    created = 0
    skipped = 0
    for rel_dir, title, desc, path, opts in ROUTES:
        route_dir = APP / rel_dir
        if not route_dir.exists():
            print(f'SKIP (dir missing): {rel_dir}')
            skipped += 1
            continue

        if opts.get('kind') == 'product':
            content = PRODUCT_DYNAMIC_TEMPLATE
            result = write_layout(route_dir, content)
        elif opts.get('kind') == 'category':
            content = CATEGORY_DYNAMIC_TEMPLATE
            result = write_layout(route_dir, content)
        else:
            extra_lines = []
            if opts.get('noIndex'):
                extra_lines.append('  noIndex: true,')
            extra = '\n'.join(extra_lines)
            content = LAYOUT_TEMPLATE.format(
                title_literal=js_literal(title),
                desc_literal=js_literal(desc),
                path_literal=js_literal(path),
                extra_fields=extra,
            )
            result = write_layout(route_dir, content)

        print(result)
        if result.startswith('CREATE'):
            created += 1
        else:
            skipped += 1

    print(f'\nDone. Created {created} layout file(s); skipped {skipped}.')


if __name__ == '__main__':
    main()
