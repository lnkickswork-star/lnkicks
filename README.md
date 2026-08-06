# lnkicks 👟

An enterprise-grade, premium e-commerce platform and discovery application for high-end sneaker enthusiasts. Built with a responsive Next.js architecture, the application delivers fluid micro-interactions, beautiful dark-themed aesthetics, and a premium sneaker browsing and shopping experience.

---

## 🌟 Features

* **Interactive Catalog & Sneakers Vault**: Discover rare design drops, filter shoes by premium brands, and explore rich catalogs.
* **Tinder-Style Swipe Interface**: A mobile-first interactive sneaker discovery card flow to swipe and find the perfect shoes.
* **Modern Next.js Architecture**: Dynamically routes and displays sneaker product collections with Next.js App Router infrastructure.
* **Responsive Layout Engine**: Built to scale seamlessly from ultra-widescreen desktops down to mobile-first interfaces.
* **Full E-Commerce Flow**: Advanced checkout flows, cart management, wishlist, shipping, cancellation, and return/refund tracking.
* **Robust Admin Dashboard**: Complete backend management panels for products, orders, customers, and analytics reporting.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js (App Router), React, TypeScript, TailwindCSS / CSS3 variables
* **Asset Optimization**: High-fidelity compressed PNGs with transparent background support
* **Build Systems**: Webpack, SWC Compiler, package.json pipeline
* **Automation**: Python script engines for layout compilation, image transparency conversion, and automated compliance auditing.

---

## 📂 Folder Structure

```
lnkicks/
├── app/                  # Next.js page components, routing, and server-side configurations
│   ├── account/          # User profiles, order logs
│   ├── admin/            # Dashboard and admin controls
│   └── ...               # Checkout, products, and static page routes
├── components/           # Reusable UI component registry (ProductCard, Layout, SEO)
│   ├── catalog/          # Registries for shoe products
│   ├── layout/           # App-wide responsive wrappers
│   └── ui/               # Core atomic layout elements
├── js/                   # Legacy commerce core engine files (Cart, Discovery, Users)
├── mobile_screens/       # Raw templates for mobile-specific design layouts
├── public/               # Public static assets, sneaker images, robots.txt, sitemap.xml
└── *.py                  # Operations scripts (migration, regression audits, compliance checks)
```

---

## 🚀 Installation & Local Development

### 1. Prerequisites
Ensure you have Node.js (v18.x or later) installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## ⚙️ Environment Variables

The application reads **4 user-configurable env vars** (plus 5 auto-set by
the runtime). See [`.env.production.example`](.env.production.example) and
[docs/deployment/ENVIRONMENT-VARIABLES.md](docs/deployment/ENVIRONMENT-VARIABLES.md)
for the full audit and deployment report.

Minimum required to boot:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

Recommended (for clean startup logs):
```env
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=918881286267
```

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing & Repository Information

Contributions are welcome! Please open an issue or submit a pull request for any design improvements or engine optimizations.

* **Repository**: [https://github.com/lnkickswork-star/lnkicks.git](https://github.com/lnkickswork-star/lnkicks.git)
* **Author**: `lnkickswork-star`