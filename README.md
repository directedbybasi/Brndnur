# BRNDNUR Advisory LLP — Production Website Codebase

> **Authoritative Architecture:** Static Astro v5 (SSG) with TypeScript and Tailwind CSS (`preflight: false`).  
> **Output:** Static HTML/CSS/JS deployed to Hostinger (`dist/`).  
> **Canonical Routes:** 32 fully implemented and verified static routes in `src/pages/` + 54 regional resource guides.

---

## 1. Quick Start

### Prerequisites
- **Node.js**: v18.17.0+ or v20+
- **npm**: v9+
- **Playwright** (for browser testing): installed via npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
# Starts local development server at http://localhost:4321/
```

### Production Build
```bash
npm run build
# Compiles all 234 pages into the dist/ directory for static hosting.
```

### Production Preview
```bash
npm run preview
# Serves the compiled dist/ directory at http://localhost:4321/
```

---

## 2. Testing & Quality Assurance

All test suites can be executed via standard npm scripts:

| Command | Purpose | Tools |
| :--- | :--- | :--- |
| `npm test` | Complete 32-route master audit (status codes, H1s, JSON-LD, header/footer, links, images, overflow) | Playwright, Node.js |
| `npm run test:autoplay` | End-to-end verification of 5,000ms auto-advance, hover/focus pause, and reduced-motion | Playwright |
| `npm run test:typography` | Comprehensive scan of all 2,700+ elements for pure DM Sans font compliance | Playwright |
| `npm run test:e2e` | Full browser interaction and responsive matrix suite | Playwright |
| `npm run check` | Static typecheck and Astro template validation | Astro Check, TypeScript |

---

## 3. Project Directory Map

```text
BRNDNUR-Website/
├── public/                       # Static assets copied directly to dist/ root
│   ├── assets/                   # Optimized WebP/PNG production images
│   ├── scripts/
│   │   └── carousel.js           # Universal 3-column auto-sliding carousel engine
│   ├── favicon.ico, .png         # Multi-size brand favicons & touch icons
│   ├── site.webmanifest          # PWA web manifest
│   ├── sitemap.xml               # Complete production XML sitemap
│   └── robots.txt                # Production crawler directives
│
├── src/
│   ├── components/               # Shared Astro components
│   │   ├── hero/
│   │   │   ├── PageHero.astro    # Master hero layout with responsive gradient masks
│   │   │   └── HeroBenefitStrip.astro # 3-pillar benefit strip across hero sections
│   │   ├── CardCarousel.astro    # Accessible auto-advancing card track
│   │   ├── FaqItem.astro         # Accessible accordion item for FAQs
│   │   ├── FloatingWhatsApp.astro# Context-aware floating WhatsApp button
│   │   ├── Header.astro          # Sticky global navigation & mobile drawer
│   │   ├── Footer.astro          # Global multi-column footer with verified details
│   │   ├── Logo.astro            # Master SVG/raster logo with tagline
│   │   └── SectionHeading.astro  # Standardised section header with gold overline
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro      # Master layout (SEO metadata, JSON-LD, fonts, scripts)
│   │
│   ├── pages/                    # 32 Canonical routes + dynamic resource routes
│   │   ├── index.astro           # Homepage (/)
│   │   ├── about/                # About BRNDNUR (/about/)
│   │   ├── services/             # Services hub (/services/)
│   │   ├── packages/             # Packages hub & 4 detail packages (/packages/*)
│   │   ├── trademark-*/          # Dedicated trademark services
│   │   ├── resources/            # Knowledge hub & 4 flagship guides (/resources/*)
│   │   ├── contact/              # Contact & consultation (/contact/)
│   │   ├── faqs/                 # Central FAQs hub (/faqs/)
│   │   ├── legal policies        # Privacy, Terms, Refund, Disclaimer
│   │   └── 404.astro             # Custom 404 error page (/404.html)
│   │
│   ├── styles/
│   │   ├── tokens.css            # Single source of truth for color, font & spacing tokens
│   │   └── global.css            # Base reset, typography foundations, utilities
│   │
│   └── utils/
│       ├── blog.ts               # Content parser for dynamic resource articles
│       └── whatsapp.ts           # Type-safe, context-aware WhatsApp URL builder
│
├── content/                      # Structured Markdown articles for regional guides
├── tests/                        # Automated regression and verification test suites
├── scripts/                      # Engineering diagnostic and audit scripts
├── docs/                         # Architecture, component, asset, and maintenance guides
├── astro.config.mjs              # Astro static site generator configuration
├── tailwind.config.mjs           # Tailwind config (preflight: false)
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 4. Brand Design Tokens (Source of Truth)

All design tokens are defined in [src/styles/tokens.css](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/src/styles/tokens.css):

- **Palette**:
  - Ivory (`#F4EFE4` / `#F8F4EB` / `#EDE3D1`) — Primary page surface
  - Navy (`#13233A` / `#0C1C2C`) — Primary brand ink & dark sections
  - Gold (`#A8781A` / `#C28A25` / `#8F6214`) — Accents, eyebrows & icons
- **Typography**:
  - Font Family: `"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`
  - Headings: Weight `600`, line-height `1.15`–`1.25`, tracking `-0.025em` to `-0.01em`
  - Eyebrows: Weight `700`, uppercase, tracking `+0.16em`, color `#A8781A`
  - Body: Weight `400`, line-height `1.65`, color `#334155`

---

## 5. Deployment

The project builds directly to static HTML in `dist/` and is designed for hosting on **Hostinger**:
1. Run `npm run build`.
2. Upload the contents of `dist/` to the web root (`public_html/`).
3. Ensure `.htaccess` or server rules enforce trailing slashes and serve `index.html` for directories.
4. Detailed deployment procedures are documented in [docs/deployment/DEPLOYMENT_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/deployment/DEPLOYMENT_GUIDE.md).

---

## 6. Documentation Index

For in-depth guides, refer to:
- [docs/architecture/PROJECT_STRUCTURE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/architecture/PROJECT_STRUCTURE.md) — Directory organisation and route mapping
- [docs/architecture/COMPONENT_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/architecture/COMPONENT_GUIDE.md) — Shared components, props, and modification guidelines
- [docs/assets/ASSET_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/assets/ASSET_GUIDE.md) — Asset catalogue, master originals vs production derivatives
- [docs/maintenance/MAINTENANCE_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/maintenance/MAINTENANCE_GUIDE.md) — Long-term maintenance, how to add pages/content safely
- [docs/testing/TESTING_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/testing/TESTING_GUIDE.md) — Test suites, assertions, and visual QA
- [docs/deployment/DEPLOYMENT_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/deployment/DEPLOYMENT_GUIDE.md) — Hostinger static deployment & checklist
- [CHANGELOG.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/CHANGELOG.md) — Chronological log of maintenance updates and fixes
