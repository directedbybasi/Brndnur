# BRNDNUR Advisory LLP — Production Build & QA Report

**Project:** BRNDNUR Advisory LLP  
**Stack:** Astro v5.1.8 + TypeScript v5.7.3 + Tailwind CSS v3.4.17  
**Build Target:** Hostinger Static Web Hosting (`public_html` from `dist/`)  
**Date:** October 18, 2026  
**Status:** Complete — All Static, Type-Check, and Browser Tests Passed

---

## 1. Architecture & Technology Stack

| Component | Selected Version / Config | Notes |
|---|---|---|
| **Core Framework** | `astro` v5.1.8 | Configured for static site generation (`output: 'static'`, `build.format: 'directory'`) |
| **Language** | `typescript` v5.7.3 | Configured in `tsconfig.json` extending `astro/tsconfigs/strict` |
| **Styling** | `tailwindcss` v3.4.17 + `@astrojs/tailwind` v6.0.2 | Customized design tokens in `tailwind.config.mjs` (Ivory, Navy, Gold) |
| **Type & Template Diagnostics** | `@astrojs/check` v0.9.4 | Verified clean with `npm run check` (0 errors, 0 warnings, 0 hints across 16 files) |
| **Build Artifact Directory** | `dist/` | Completely standalone static HTML/CSS/JS with zero runtime Node.js dependency |

---

## 2. Page & Route Manifest Verification

Only the 4 authorized website pages exist and were built:

1. **Home (`/`)**
   - Source: `src/pages/index.astro`
   - Output: `dist/index.html`
   - Visual Status: 100% frozen layout, typography, and color composition. 0 visual regressions.
   - Title: `BRNDNUR Advisory LLP | Trademark Registration & Business Advisory`
   - Canonical: `https://brndnur.in/`
2. **Trademark Registration (`/trademark-registration/`)**
   - Source: `src/pages/trademark-registration/index.astro`
   - Output: `dist/trademark-registration/index.html`
   - Canonical: `https://brndnur.in/trademark-registration/`
   - Interactive: FAQ accordion verified expanding and collapsing.
3. **Services (`/services/`)**
   - Source: `src/pages/services/index.astro`
   - Output: `dist/services/index.html`
   - Canonical: `https://brndnur.in/services/`
   - Interactive: Service accordion verified.
4. **Packages & Pricing (`/packages/`)**
   - Source: `src/pages/packages/index.astro`
   - Output: `dist/packages/index.html`
   - Canonical: `https://brndnur.in/packages/`
   - Interactive: Pricing FAQ accordion verified.

---

## 3. Test & Verification Execution Matrix

| Test Suite | Command Executed | Result | Evidence / Details |
|---|---|---|---|
| **TypeScript / Template Diagnostics** | `npm run check` | **PASS** | 0 errors, 0 warnings, 0 hints across 16 files checked. |
| **Production Build Compilation** | `npm run build` | **PASS** | `4 page(s) built in 1.25s` with 0 warnings and 0 errors. |
| **Dist Static Asset Integrity** | `python tests/verify_dist.py` | **PASS** | Verified DOCTYPE, lang="en", charset, viewport, unique titles & descriptions, single H1 per page, canonical tags, Open Graph tags, Twitter tags, and on-disk image assets for all 4 pages. |
| **Sitemap Integrity** | `python tests/verify_dist.py` | **PASS** | `dist/sitemap.xml` validated with Python XML parser. Contains strictly the 4 canonical public URLs. |
| **Robots Directives** | `python tests/verify_dist.py` | **PASS** | `dist/robots.txt` validated; allows all crawling for public routes and static assets, declares canonical sitemap. |
| **Structured Data (JSON-LD)** | `python tests/verify_dist.py` | **PASS** | Injected JSON-LD blocks parsed cleanly on all 4 pages (`Organization`, `WebSite`, `WebPage`, `Service`, `FAQPage`). Contested pricing schema safely omitted. |
| **Browser Smoke Test** | `npx astro preview` via Chrome | **PASS** | Tested on localhost:4321: 0 console errors, mobile menu toggle functional, FAQ accordion interaction verified. |
| **Mobile Responsiveness** | Viewport 375×812 in browser | **PASS** | Hamburger menu toggle works smoothly; 0 horizontal scrolling overflow detected. |
| **Desktop Responsiveness** | Viewport 1280×800 in browser | **PASS** | Full horizontal navigation bar, hero grid, and cards render seamlessly. |
| **Live Hostinger DNS / SSL** | Live deployment checks | **NOT RUN** | Local build environment only; Hostinger deployment steps provided below. |

---

## 4. Hostinger Deployment Instructions

1. **Build Artifacts:**
   Run `npm run build` to generate the latest static build in the `dist/` directory.
2. **Upload Folder:**
   Upload the entire contents of `dist/` (NOT the `dist` folder itself) into Hostinger's `public_html` directory:
   - `dist/index.html` -> `public_html/index.html`
   - `dist/trademark-registration/` -> `public_html/trademark-registration/`
   - `dist/services/` -> `public_html/services/`
   - `dist/packages/` -> `public_html/packages/`
   - `dist/assets/` -> `public_html/assets/`
   - `dist/_astro/` -> `public_html/_astro/`
   - `dist/robots.txt` -> `public_html/robots.txt`
   - `dist/sitemap.xml` -> `public_html/sitemap.xml`
   - `dist/.htaccess` -> `public_html/.htaccess`
3. **Apache / Hostinger Configuration:**
   The included `dist/.htaccess` automatically forces HTTPS, prevents MIME-sniffing, enables compression (gzip/deflate), and configures browser caching for static WebP/JPG/CSS/JS assets.
