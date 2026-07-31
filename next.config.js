/** @type {import('next').NextConfig} */

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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  /* ------------------------------------------------------------------
     Redirects — preserve URLs for deleted duplicate routes.

     Five routes were byte-identical duplicates of canonical routes
     and have been removed. These 301 redirects ensure no inbound
     links or bookmarks break.

       /admin/dashboard  → /dashboard               (admin)
       /admin/products   → /products-management      (admin)
       /account/profile  → /profile                  (account)
       /account/orders   → /my-orders                (account)
       /product-detail   → /product/<default-slug>   (catalog)

     The /product-detail redirect points to the first product in
     ProductRegistry because /product-detail carried no slug.
     ------------------------------------------------------------------ */
  async redirects() {
    return [
      {
        source: '/admin/dashboard',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/admin/products',
        destination: '/products-management',
        permanent: true,
      },
      {
        source: '/account/profile',
        destination: '/profile',
        permanent: true,
      },
      {
        source: '/account/orders',
        destination: '/my-orders',
        permanent: true,
      },
      {
        source: '/product-detail',
        destination: '/product/air-jordan-1-low-black-powder-blue',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
