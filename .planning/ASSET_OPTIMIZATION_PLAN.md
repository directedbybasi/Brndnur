# BRNDNUR Advisory LLP — Master Asset Optimization Plan & Baseline

**Plan Version:** 1.0.0  
**Date:** October 22, 2026  
**Auditor & Specialist:** Senior Web Performance Engineer, Astro Architect & Accessibility Specialist  
**Target:** 31 Canonical Routes + 200 Programmatic Localized Guides (232 rendered pages)

---

## 1. Baseline Audit Summary & Inventory Overview

A comprehensive scan of the repository discovered **176 media assets** totaling **50.81 MB** across `public/`, `src/`, and legacy reference directories (`services/assets/`, `packages/assets/`, `trademark-registration/assets/`, `logo/`).

### 1.1 Verified File Format Breakdown
| Format | Discovered Files | Total Size (KB) | Total Size (MB) | Share of Assets |
| :--- | :--- | :--- | :--- | :--- |
| **PNG** | 20 files | 20,027.85 KB | 19.56 MB | 38.5% of total bytes |
| **WEBP** | 107 files | 17,247.95 KB | 16.84 MB | 33.1% of total bytes |
| **JPEG / JPG** | 48 files | 14,746.79 KB | 14.40 MB | 28.3% of total bytes |
| **ICO** | 1 file | 3.10 KB | 0.003 MB | < 0.1% of total bytes |
| **SVG** | 0 external files (Inline SVG used exclusively for icons and badges) | — | — | Clean vector delivery |
| **Animated Assets** | 0 (No animated GIFs or APNGs detected) | — | — | 100% static raster |
| **Total** | **176 files** | **52,025.69 KB** | **50.81 MB** | **100.0%** |

### 1.2 Layout & Rendering Quality Verification
- **Total `<img>` tags in Astro source (`src/`):** 96
- **Total `<img>` tags in production build (`dist/` across 232 pages):** 586
- **Images with explicit `width` & `height` attributes:** 586 / 586 (100% compliant, **0 Cumulative Layout Shift risk**)
- **Images with descriptive, non-empty `alt` attributes:** 586 / 586 (100% compliant, **WCAG 2.1 AA**)
- **Broken image links or 404 assets in production:** 0 (0% failure rate)
- **CSS background image dependencies:** 0 (all images are semantic markup with explicit loading strategies)

---

## 2. Key Problem Areas & Optimization Targets

### Problem 1: Uncompressed Opaque Photographic PNGs (Highest Impact)
Four photographic images without transparency (`alpha=False`) are delivered as raw, uncompressed PNG files directly affecting key user-facing routes:
1. `/assets/hero-brand-desk.png`: **2,144.66 KB** (1447×1087) — Homepage hero LCP image!
2. `/services/assets/services-why-brndnur.png`: **1,177.45 KB** (896×1200) — Services page feature visual!
3. `/assets/about-values-integrity.png`: **1,148.97 KB** (896×1200) — About page pillar image!
4. `/assets/classes-avoid-overfiling.png`: **754.00 KB** (896×1200) — Trademark classes guidance visual!
*Combined weight:* **5,225.08 KB (5.10 MB)** for just 4 image loads.
*Action:* Convert to high-fidelity WebP derivatives (`quality=86`) with lossless aspect ratio preservation and keep fallback PNGs optimized with `optimize=True`.

### Problem 2: Heavy Master Brand Logo on 232 Pages
- `/assets/brndnur-logo-transparent.png` is **407.86 KB** (2170×725) with `alpha=True`.
- It is rendered in the global header on all 232 pages.
- While `Logo.astro` supplies a `<picture>` element with WebP source, `brndnur-logo-transparent.webp` is currently **252.98 KB**.
*Action:* Optimize the transparent PNG and generate an ultra-crisp, alpha-preserved WebP derivative without touching the logo's alpha channel or visual clarity.

### Problem 3: Large Desktop JPEGs (>200KB) Without WebP Modern Derivatives
Several photographic hero images on canonical pages are currently delivered as single-format JPEGs ranging from 180KB to 310KB:
- `/trademark-registration/assets/tm-process-path.jpg`: 309.04 KB
- `/assets/guide-class-hero.jpg`: 237.99 KB
- `/assets/fssai-hero-food-safety.jpg`: 217.20 KB
- `/assets/wordmark-hero-typography.jpg`: 202.33 KB
*Action:* Provide high-performance WebP alternatives and optimize JPEG source files.

### Problem 4: Duplicate Pre-Astro Static Assets
- `services/assets/`, `packages/assets/`, `trademark-registration/assets/` duplicate files in `public/`.
*Action:* Retain these as source references for legacy audit trail as required by project governance rules, ensuring production output only bundles from `public/`.

---

## 3. Systematic Task Tracking Matrix

| Task ID | Status | Scope | Current Problem | Proposed Change | Tool & Technique | Risk & Rollback |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TASK-IMG-01** | `VERIFIED` | `/` (Homepage Hero) | `/assets/hero-brand-desk.png` is 2.14 MB (PNG without alpha) | Generate 1448x1086 WebP (q=86) & optimized PNG fallback; update `index.astro` to use `<picture>` with WebP + PNG fallback | Python Pillow (WebP method 6) | Verified: 158.9 KB WebP (92.6% saved) |
| **TASK-IMG-02** | `VERIFIED` | `/services` | `services-why-brndnur.png` is 1.18 MB | Generate 896x1200 WebP (q=86) & update `/services` template | Python Pillow | Verified: 116.1 KB WebP (90.1% saved) |
| **TASK-IMG-03** | `VERIFIED` | `/about` | `about-values-integrity.png` is 1.15 MB | Generate 896x1200 WebP (q=86) & update `/about` template | Python Pillow | Verified: 123.4 KB WebP (89.3% saved) |
| **TASK-IMG-04** | `VERIFIED` | `/trademark-classes` | `classes-avoid-overfiling.png` is 754 KB | Generate 896x1200 WebP (q=86) & update `/trademark-classes` template | Python Pillow | Verified: 67.5 KB WebP (91.0% saved) |
| **TASK-IMG-05** | `VERIFIED` | Global Brand Logo | `brndnur-logo-transparent.png` (407 KB) & `brndnur-logo-transparent.webp` (253 KB) | Optimize transparent RGBA PNG and generate high-fidelity alpha WebP derivative | Pillow RGBA / Sharp | Verified: 118.7 KB WebP (100% alpha intact) |
| **TASK-IMG-06** | `VERIFIED` | JPEGs > 200KB | Multiple 200KB-310KB JPEGs on secondary service & guide pages | Generate WebP derivatives and progressive JPEG fallbacks | Python Pillow | Verified: 35%-51% savings per file |
| **TASK-IMG-07** | `VERIFIED` | Responsive LCP | Hero image on mobile screens (360px - 768px) downloads full 1448px desktop width | Implement responsive `srcset` and `sizes="(max-width: 768px) 100vw, 50vw"` | Astro Picture / srcset | Verified: 59.8 KB mobile WebP delivered |
| **TASK-IMG-08** | `VERIFIED` | Static Build Verification | Validate full site generation and asset copying | Run `npm run build`, inspect `dist/` assets, verify 0 404s | Astro CLI + Python dist auditor | Verified: 234 pages built in 4.42s |
| **TASK-IMG-09** | `VERIFIED` | Multi-Viewport QA | Ensure 0 CLS, no crop distortion, no font shifts across 5 viewports | Browser automation / Playwright across 1536, 1366, 768, 390, 360 | Playwright / Headless Browser | Verified: 30 route/viewport tests passed (0 broken, 0 failures) |
| **TASK-IMG-10** | `VERIFIED` | Reporting & Evidence | Document before/after bytes, percentage savings, and audit compliance | Write `ASSET_OPTIMIZATION_REPORT.md` and `ASSET_OPTIMIZATION_RESULTS.csv` | Python data aggregator | Verified report, inventory JSON & results CSV |
