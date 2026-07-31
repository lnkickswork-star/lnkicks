import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
public_dir = os.path.join(project_dir, "public")
seo_dir = os.path.join(project_dir, "components", "seo")
os.makedirs(public_dir, exist_ok=True)
os.makedirs(seo_dir, exist_ok=True)

# 1. public/robots.txt
robots_txt = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout/
Disallow: /order-success/

Sitemap: https://www.lnkicks.com/sitemap.xml
"""

with open(os.path.join(public_dir, "robots.txt"), "w", encoding="utf-8") as f:
    f.write(robots_txt)

print("Created public/robots.txt!")

# 2. public/sitemap.xml
sitemap_xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.lnkicks.com/</loc><priority>1.0</priority></url>
  <url><loc>https://www.lnkicks.com/categories</loc><priority>0.9</priority></url>
  <url><loc>https://www.lnkicks.com/products</loc><priority>0.9</priority></url>
  <url><loc>https://www.lnkicks.com/product/air-jordan-1-low-black-powder-blue</loc><priority>0.8</priority></url>
  <url><loc>https://www.lnkicks.com/product/samba-og-cloud-white-core-black</loc><priority>0.8</priority></url>
  <url><loc>https://www.lnkicks.com/product/nike-air-force-1-low-triple-black</loc><priority>0.8</priority></url>
  <url><loc>https://www.lnkicks.com/search</loc><priority>0.7</priority></url>
  <url><loc>https://www.lnkicks.com/help-support</loc><priority>0.6</priority></url>
</urlset>
"""

with open(os.path.join(public_dir, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write(sitemap_xml)

print("Created public/sitemap.xml!")

# 3. components/seo/JsonLd.tsx
jsonld_code = """'use client';

import React from 'react';

export const OrganizationSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LNKICKS',
    url: 'https://www.lnkicks.com',
    logo: 'https://www.lnkicks.com/jordan_powder_blue_nobg.png',
    description: 'India\'s premier destination for authentic luxury sneakers and hyped drops.',
    sameAs: [
      'https://instagram.com/lnkicks',
      'https://twitter.com/lnkicks'
    ]
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
};
"""

with open(os.path.join(seo_dir, "JsonLd.tsx"), "w", encoding="utf-8") as f:
    f.write(jsonld_code)

print("Created components/seo/JsonLd.tsx!")

# 4. next.config.js (Security Headers)
next_config_code = """/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
"""

with open(os.path.join(project_dir, "next.config.js"), "w", encoding="utf-8") as f:
    f.write(next_config_code)

print("Updated next.config.js with Security Headers!")
