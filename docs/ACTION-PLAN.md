# BRNDNUR ADVISORY LLP — PRODUCTION ACTION PLAN & ROADMAP

**Document Version:** 1.0.0  
**Target Environment:** Hostinger Static Web Hosting (`public_html/`)  
**Deployment Tool:** Astro v5 SSG Static Build (`dist/`)  

---

## 1. Action Items Matrix (Priority Breakdown)

| Priority | Category | Action Item | Owner | Verification Status |
| :---: | :--- | :--- | :---: | :---: |
| **CRITICAL** | Build / Runtime | Complete static build of all 32 routes into `dist/` with zero missing templates | Lead Architect | **COMPLETED & VERIFIED** |
| **CRITICAL** | Routing / Server | Enforce HTTPS redirect, security headers (CSP, HSTS), and canonical trailing slashes in `.htaccess` | Systems Lead | **COMPLETED & VERIFIED** |
| **HIGH** | Technical SEO | Resolve footer heading jumps (`<h2>` to `<h4>`) across all 32 pages for strict semantic ordering | Senior Developer | **COMPLETED & VERIFIED** |
| **HIGH** | Structured Data | Implement automated Schema.org `WebPage` + `BreadcrumbList` across all 31 indexable routes | SEO Specialist | **COMPLETED & VERIFIED** |
| **HIGH** | Conversion | Verify all 124 WhatsApp CTA links point to official number `+91 90481 88899` with contextual queries | QA Engineer | **COMPLETED & VERIFIED** |
| **HIGH** | Asset Integrity | Audit binary formats of replaced raster images (`hero-brand-desk.png`, `why-brndnur.png`) and confirm zero broken sources | QA Engineer | **COMPLETED & VERIFIED** |
| **MEDIUM** | Accessibility | Fix WCAG 2.5.3 (Label in Name) mismatch on Header brand link and Footer social links | UI/UX Auditor | **COMPLETED & VERIFIED** |
| **MEDIUM** | Accessibility | Increase social link target hit areas to 34px for mobile touch compliance | UI/UX Auditor | **COMPLETED & VERIFIED** |
| **MEDIUM** | AEO / GEO | Deploy `public/llms.txt` documenting firm scope, statutory guidance, and verified contact points | AI Search Specialist | **COMPLETED & VERIFIED** |
| **LOW** | Post-Launch | Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools | Webmaster | **SCHEDULED POST-DEPLOY** |
| **LOW** | Post-Launch | Register official Google Business Profile citing canonical URL and verified phone | Marketing Lead | **SCHEDULED POST-DEPLOY** |

---

## 2. Completed Phase Actions (Implemented in Codebase)

### 2.1 Heading Hierarchy Normalization
- **Change:** In `src/components/Footer.astro`, changed column titles (`Quick Links`, `Our Services`, `Contact`) from `<h4>` to `<p class="bn-foot-title">`.
- **Impact:** Preserves 100% of the visual styling and typography while eliminating the heading level skip flagged by Lighthouse and SEO crawlers.
- **Verification:** `python scratch/verify_production_readiness.py` confirms 0 heading skips across all 32 pages.

### 2.2 Global Structured Data Automation
- **Change:** Updated `src/layouts/BaseLayout.astro` with an automated Schema.org generator for `WebPage` and `BreadcrumbList`.
- **Guard:** Introduced `hasCustomSchema={true}` prop to ensure specialized landing pages (`/`, `/packages/`, `/services/`, `/trademark-registration/`) output their dedicated Schema without duplication.
- **Verification:** All 31 indexable routes output valid, parseable Schema.org JSON-LD; error page `404.html` correctly omits indexing schema.

### 2.3 Image Format Integrity
- **Change:** Confirmed that `hero-brand-desk.png` and `why-brndnur.png` are valid PNGs matching magic bytes `89 50 4E 47`.
- **Asset Links:** Updated all image references to point directly to valid `.png` files.
- **Verification:** 106 of 106 images in `dist/` resolve to real files on disk with descriptive alt text.

### 2.4 Mobile Touch Target & Accessible Name Harmonization
- **Change:** Increased `.bn-socials a` hit area to 34px in `src/styles/global.css`.
- **Change:** Synchronized `Header.astro` brand link `aria-label` with its visible tagline, and wrapped decorative footer social icons in `<span aria-hidden="true">`.
- **Verification:** Lighthouse CI Accessibility score measured at 90–91 across all representative pages.

---

## 3. Hostinger Static Deployment Checklist (Step-by-Step)

When ready to publish to production, follow this exact procedure:

1. **Local Build Verification:**
   ```bash
   npm run build
   python tests/verify_dist.py
   python scratch/verify_production_readiness.py
   ```
   Ensure all checks return exit code 0.
2. **Prepare Files for Hostinger:**
   - The contents of `dist/` represent the complete static build.
   - Confirm `dist/.htaccess`, `dist/robots.txt`, `dist/sitemap.xml`, and `dist/llms.txt` are present at the root.
3. **Upload to Hostinger `public_html/`:**
   - Connect via Hostinger File Manager or SFTP (using Hostinger FTP credentials).
   - Upload all files from `dist/` directly into `public_html/`.
   - Ensure hidden files like `.htaccess` are transferred.
4. **Post-Deployment Live Smoke Tests:**
   - Verify HTTPS redirect: `http://brndnur.com` redirects to `https://brndnur.com/`.
   - Verify non-www redirect: `https://www.brndnur.com/` redirects to `https://brndnur.com/`.
   - Verify canonical URLs: Inspect page source of `/packages/`, `/services/`, and `/trademark-registration/`.
   - Test WhatsApp CTA: Click "Get in Touch" on mobile device to verify WhatsApp deep link opens with pre-filled message to `+91 90481 88899`.
   - Test 404 handler: Visit `https://brndnur.com/non-existent-page/` and verify custom 404 page renders.

---

## 4. Post-Launch Search Engine & AI Registry Submissions

| Platform | URL / Action | Objective |
| :--- | :--- | :--- |
| **Google Search Console** | Add property `https://brndnur.com/` and submit `https://brndnur.com/sitemap.xml` | Prompt indexing of all 31 canonical URLs |
| **Bing Webmaster Tools** | Import GSC property or submit sitemap | Index on Bing & Copilot discovery engine |
| **Schema Validator** | Run `https://validator.schema.org/` on homepage, `/trademark-registration/`, and `/packages/` | Confirm rich result eligibility |
| **Perplexity & Claude** | Test query: "What is BRNDNUR Advisory LLP and what trademark services do they offer in India?" | Verify AI answer synthesis from `llms.txt` |
