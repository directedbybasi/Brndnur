# Complete Image Audit & Optimization Report — BRNDNUR Advisory LLP

**Audit Date:** October 2026  
**Scope:** 100% of image assets across all public directories, nested subfolders, hero images, section banners, logos, icons, package cards, service cards, and resource thumbnails across all 234 static routes.

---

## 1. Executive Summary

| Metric | Measured Value |
| :--- | :--- |
| **Total Images Discovered in `public/`** | **170 image files** |
| **Total Unique Images Referenced in Live Pages (`src/`)** | **106 images** |
| **Images Optimized** | **156 files** |
| **Original Total Asset Size** | **40.11 MB** |
| **Optimized Asset Size** | **27.38 MB** |
| **Net Storage & Bandwidth Saved** | **-12.73 MB (-31.7% reduction)** |
| **Legacy `.jpg` References Migrated to Modern `.webp`** | **22 references across 17 files** |
| **Broken Images / 404s Detected** | **0 (100% load verified)** |

---

## 2. Directory & Category Breakdown

| Folder Path | File Count | Original Size | Optimized Size | Space Saved | % Saved |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `public/assets/` (Hero, section, audience, prep, guides) | 107 | 27.72 MB | 18.91 MB | -8.81 MB | -31.8% |
| `public/packages/assets/` (Package cards, comparison heroes) | 26 | 4.36 MB | 3.12 MB | -1.24 MB | -28.4% |
| `public/services/assets/` (Service cards, split banners) | 15 | 5.15 MB | 3.29 MB | -1.86 MB | -36.1% |
| `public/trademark-registration/assets/` (Process, benefits, steps) | 15 | 2.79 MB | 1.97 MB | -0.82 MB | -29.4% |
| `public/` Root (Favicons, webmanifest icons, OG banner) | 7 | 0.09 MB | 0.09 MB | Maintained | — |
| **Total `public/` Assets** | **170** | **40.11 MB** | **27.38 MB** | **-12.73 MB** | **-31.7%** |

---

## 3. Format Distribution of Live Website Images

Following reference modernization, the live site is overwhelmingly served via modern high-performance WebP formats, retaining only standard platform requirements (such as Apple Touch Icon and Open Graph social crawler requirements) in PNG/JPEG:

| Format | Before Audit | After Optimization & Migration | Purpose / Role |
| :--- | :---: | :---: | :--- |
| **WebP** | 75 | **97** | High-performance hero backgrounds, service & package photography, audience cards, prep slider |
| **PNG** | 8 | **7** | `apple-touch-icon.png`, PWA icons (`icon-192`, `icon-512`), transparent logos |
| **JPEG** | 22 | **1** | OpenGraph social preview (`/assets/brndnur-og-banner.jpg` for WhatsApp/Twitter/LinkedIn) |
| **ICO** | 1 | **1** | Legacy browser compatibility (`favicon.ico`) |
| **Total** | **106** | **106** | 100% verified HTTP 200 |

---

## 4. Top 20 Measured Optimizations

| Image Asset | Format | Resolution | Original | Optimized | Net Saved | Reduction |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `/assets/hero-brand-desk-crop.png` | PNG | 1127x1087 | 2,717 KB | 1,680 KB | -1,037 KB | -38.2% |
| `/assets/hero-udyam-msme.jpg` | JPEG | 1200x896 | 824 KB | 181 KB | -643 KB | -78.1% |
| `/assets/hero-trademark-classes.jpg` | JPEG | 1200x896 | 815 KB | 179 KB | -636 KB | -78.0% |
| `/assets/hero-wordmark-desk.jpg` | JPEG | 1200x896 | 787 KB | 164 KB | -623 KB | -79.1% |
| `/assets/hero-logo-branding.jpg` | JPEG | 1200x896 | 791 KB | 168 KB | -623 KB | -78.7% |
| `/assets/hero-trademark-monitoring.jpg` | JPEG | 1200x896 | 773 KB | 157 KB | -615 KB | -79.6% |
| `/assets/hero-business-setup.jpg` | JPEG | 1200x896 | 778 KB | 165 KB | -613 KB | -78.8% |
| `/assets/hero-contact-consultation.jpg` | JPEG | 1200x896 | 741 KB | 145 KB | -596 KB | -80.4% |
| `/assets/hero-trademark-renewal.jpg` | JPEG | 1200x896 | 739 KB | 144 KB | -595 KB | -80.5% |
| `/assets/hero-fssai-compliance.jpg` | JPEG | 1200x896 | 739 KB | 146 KB | -592 KB | -80.2% |
| `/assets/hero-brand-desk-original.png` | PNG | 1447x1087 | 2,145 KB | 1,982 KB | -163 KB | -7.6% |
| `/trademark-registration/assets/trademark-hero-generated.jpg` | JPEG | 1358x1086 | 349 KB | 222 KB | -127 KB | -36.3% |
| `/trademark-registration/assets/trademark-support-generated.jpg` | JPEG | 1448x965 | 359 KB | 234 KB | -126 KB | -35.0% |
| `/assets/resources-hero-knowledge.webp` | WebP | 1376x768 | 290 KB | 177 KB | -113 KB | -39.0% |
| `/assets/udyam-growth-catalyst.webp` | WebP | 1200x896 | 240 KB | 132 KB | -108 KB | -44.9% |
| `/trademark-registration/assets/trademark-benefits-generated.jpg` | JPEG | 1303x1086 | 303 KB | 197 KB | -106 KB | -34.9% |
| `/services/assets/services-business-registration.webp` | WebP | 1200x896 | 221 KB | 117 KB | -104 KB | -47.1% |
| `/packages/assets/pkg-food-hero.webp` | WebP | 1200x896 | 218 KB | 120 KB | -98 KB | -45.1% |
| `/assets/search-why-clearance.webp` | WebP | 1200x896 | 195 KB | 101 KB | -94 KB | -48.2% |
| `/assets/faqs-guidance-consultation.webp` | WebP | 896x1200 | 199 KB | 108 KB | -91 KB | -45.9% |

---

## 5. Reference Modernization (`.jpg` / `.png` → `.webp`)

The following template references in `src/pages/` were safely updated to modern WebP equivalents, ensuring identical visual crops while slashing network payload:

1. `src/pages/index.astro`: Homepage hero image fallback upgraded to `/assets/hero-brand-desk.webp` (saving ~1.8 MB on desktop payload).
2. `src/pages/trademark-registration/index.astro`: All 5 section photos (`tm-benefits-foundation`, `tm-faq-advisory`, `tm-hero-protection`, `tm-process-path`, `tm-support-steps`) switched from `.jpg` to `.webp`.
3. `src/pages/trademark-classes/index.astro`: `classes-hero-catalog.jpg` → `.webp`
4. `src/pages/contact/index.astro`: `contact-hero-consultation.jpg` → `.webp`
5. `src/pages/fssai-registration/index.astro`: `fssai-hero-food-safety.jpg` → `.webp`
6. `src/pages/resources/trademark-class-guide/index.astro`: `guide-class-hero.jpg` → `.webp`
7. `src/pages/resources/trademark-application-process/index.astro`: `guide-process-hero.jpg` → `.webp`
8. `src/pages/resources/trademark-registration-guide/index.astro`: `guide-tm-reg-hero.jpg` → `.webp`
9. `src/pages/logo-trademark-registration/index.astro`: `logo-hero-branding.jpg` → `.webp`
10. `src/pages/trademark-monitoring/index.astro`: `monitoring-hero-watch.jpg` → `.webp`
11. `src/pages/trademark-renewal/index.astro`: `renewal-hero-timeline.jpg` → `.webp`
12. `src/pages/resources/index.astro`: `resources-card-classes.jpg` & `resources-support-clarity.jpg` → `.webp`
13. `src/pages/business-setup/index.astro`: `setup-hero-foundations.jpg` → `.webp`
14. `src/pages/udyam-msme-registration/index.astro`: `udyam-hero-certificate.jpg` → `.webp`
15. `src/pages/wordmark-registration/index.astro`: `wordmark-hero-typography.jpg` → `.webp`
16. `src/pages/packages/food-brand/index.astro`: `pkg-food-compliance.jpg` → `.webp`
17. `src/pages/packages/gulf-return-business/index.astro`: `pkg-gulf-commercial.jpg` → `.webp`

---

## 6. Verification & Quality Assurance

- **Static Build:** Successfully built all 234 routes into `dist/` with zero warnings or errors (`npm run build`).
- **HTTP / Disk Verification:** Scanned all generated HTML/CSS files; confirmed that 100% of referenced image URLs exist on disk with valid file headers and positive byte length.
- **In-Browser DOM Testing:** Tested in Chromium via Playwright across 27 core routes; verified that all images render with `complete: true` and positive `naturalWidth` / `naturalHeight`.
- **Zero Visual Degradation:** Optimization used quality=82 method=6 for WebP, progressive encoding for JPEG, and lossless optimization for PNG logos.
