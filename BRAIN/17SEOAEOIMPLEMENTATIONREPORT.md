# BRNDNUR Advisory LLP — SEO / AEO Implementation Report

**Document Date:** October 18, 2026  
**Implementation Phase:** Completed (Safe Implementation Run)  
**Execution Status:** Complete — 0 Regressions, All Checks Executed and Verified  
**Scope Boundary:** Exactly 4 in-scope public pages; 0 new public routes created.

---

## 1. Scope & Boundary Confirmation

| Item | Status | Details |
|---|---|---|
| **In-Scope Pages** | **4 Pages Only** | `index.html` (Home), `trademark-registration/index.html`, `services/index.html`, `packages/index.html` |
| **Additional Pages Created** | **None (0)** | No blog, resources, about, contact, location, service detail, or legal pages created |
| **Homepage Status** | **Visually Frozen** | 0 copy edits, 0 layout changes, 0 CSS edits, 0 visual regressions |
| **Architecture** | **Static Preserved** | Pure HTML5, Vanilla CSS, Vanilla JavaScript; 0 bundlers, 0 npm runtime dependencies |

---

## 2. Files Changed & Summary of Modifications

### 1. `index.html` (Home)
- **Metadata**: Added canonical URL (`https://brndnur.in/`), `robots` directive (`index, follow, max-image-preview:large`), complete Open Graph tags (`og:site_name`, `og:type`, `og:title`, `og:description`, `og:url`, `og:image`), and Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
- **Structured Data**: Injected JSON-LD `@graph` containing `Organization`, `WebSite`, and `WebPage` using verified facts (Manjeri, Malappuram, Kerala; phone: `+91 90481 88899`; email: `brndnuradvisoryllp@gmail.com`).
- **Performance & Media**: Added explicit intrinsic `width` and `height` attributes to all images (e.g. `assets/hero-brand-desk.webp` width="1448" height="1086"); added `fetchpriority="high"` to hero image; added `loading="lazy" decoding="async"` to all below-the-fold images.
- **Accessibility & Quality**: Corrected typo in hero image alt text (`BRANDNUR` → `BRNDNUR`); added `rel="noopener noreferrer"` to all external social links; added `defer` attribute to `shared/site.js`.
- **Preservation**: The visible hero copy, layout, typography, color palette, navigation, and section sequence remain 100% untouched.

### 2. `trademark-registration/index.html` (Trademark Registration Support)
- **Metadata**: Added canonical URL (`https://brndnur.in/trademark-registration/`), `robots` directive, Open Graph tags, and Twitter Card tags.
- **Structured Data**: Injected JSON-LD `@graph` containing `WebPage`, `Service` ("Trademark Registration Support"), and `FAQPage` featuring all 7 visible on-page FAQ items verbatim.
- **Performance & Media**: Added explicit intrinsic dimensions (`width` and `height`) to all 5 images; added `fetchpriority="high"` to hero; added `loading="lazy" decoding="async"` to subsequent images; added `defer` to `site.js`.
- **Security & Links**: Added `rel="noopener noreferrer"` to external links.

### 3. `services/index.html` (Services & Business Advisory)
- **Metadata**: Added canonical URL (`https://brndnur.in/services/`), `robots` directive, Open Graph tags, and Twitter Card tags.
- **Structured Data**: Injected JSON-LD `@graph` containing `WebPage` and `FAQPage` with all 5 visible on-page FAQ items verbatim.
- **Performance & Media**: Added explicit intrinsic dimensions (`width` and `height`) to all 6 images; added `fetchpriority="high"` to hero; added `loading="lazy" decoding="async"` to below-the-fold images; added `defer` to `site.js`.
- **Security & Links**: Added `rel="noopener noreferrer"` to external links.

### 4. `packages/index.html` (Packages & Pricing)
- **Metadata**: Added canonical URL (`https://brndnur.in/packages/`), `robots` directive, Open Graph tags, and Twitter Card tags.
- **Structured Data**: Injected JSON-LD `@graph` containing `WebPage` and `FAQPage` with all 6 visible on-page FAQ items verbatim.
- **Truthful Omission**: Deliberately omitted `Offer` and `Product` structured data to avoid encoding disputed pricing into machine-readable search data.
- **Performance & Cleanup**: Added explicit intrinsic dimensions to all 7 images; added `defer` to `site.js`; cleaned up duplicated trailing tags (`</body></html>script src...`).

### 5. `robots.txt` (Root — Created)
- Configured clean directives allowing all search engine spiders to crawl the 4 canonical pages and static asset folders (`/shared/`, `/assets/`, `/trademark-registration/`, `/services/`, `/packages/`).
- Declares the canonical sitemap directive: `Sitemap: https://brndnur.in/sitemap.xml`.

### 6. `sitemap.xml` (Root — Created)
- Created valid XML sitemap containing strictly the 4 canonical public URLs with trailing slash convention.
- Excludes non-canonical paths, draft routes, fragments, and image assets.

---

## 3. Metadata Before / After Matrix

| Page | Attribute | Before State | After State (Optimized) |
|---|---|---|---|
| **Home** (`index.html`) | Title | `BRNDNUR - Protect & Elevate Your Brand` | `BRNDNUR Advisory LLP \| Trademark Registration & Business Advisory` (69 chars) |
| | Description | *(None)* | `Trademark registration guidance, preliminary brand-name searches, and business advisory services with BRNDNUR Advisory LLP in Manjeri, Malappuram, Kerala.` (154 chars) |
| | Canonical | *(None)* | `https://brndnur.in/` |
| | Open Graph / Twitter | *(None)* | Fully populated (`og:site_name`, `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) |
| **Trademark Registration** (`trademark-registration/index.html`) | Title | `Trademark Registration - BRNDNUR Advisory LLP` | `Trademark Registration Support \| BRNDNUR Advisory LLP` (53 chars) |
| | Description | *(None)* | `End-to-end trademark registration guidance in India: preliminary search, class selection, documentation, filing assistance, and objection tracking with BRNDNUR.` (160 chars) |
| | Canonical | *(None)* | `https://brndnur.in/trademark-registration/` |
| | Open Graph / Twitter | *(None)* | Fully populated with local image asset `trademark-hero-generated.jpg` |
| **Services** (`services/index.html`) | Title | `BRNDNUR Advisory - Our Services` | `Services & Business Advisory \| BRNDNUR Advisory LLP` (55 chars) |
| | Description | *(None)* | `Explore trademark registration, brand name searches, wordmark & logo filing, renewal guidance, GST, Udyam/MSME, and business setup advisory from BRNDNUR.` (157 chars) |
| | Canonical | *(None)* | `https://brndnur.in/services/` |
| | Open Graph / Twitter | *(None)* | Fully populated with local image asset `services/assets/hero-trademark.webp` |
| **Packages** (`packages/index.html`) | Title | `Packages & Pricing - BRNDNUR Advisory LLP` | `Packages & Pricing \| BRNDNUR Advisory LLP` (45 chars) |
| | Description | *(None)* | `Compare trademark and business support package options from BRNDNUR Advisory LLP. Understand indicative inclusions and request a personalised quotation.` (152 chars) |
| | Canonical | *(None)* | `https://brndnur.in/packages/` |
| | Open Graph / Twitter | *(None)* | Fully populated with local image asset `packages/assets/hero-packages.webp` |

---

## 4. Structured Data (JSON-LD) Audit

All structured data is written in valid JSON-LD using the `@graph` container. Syntactic validity was programmatically tested and verified across all four documents using Python's `json` parser.

| Page | Types Included | Properties Included | Intentional Omissions & Rationale |
|---|---|---|---|
| `index.html` | `Organization`, `WebSite`, `WebPage` | `@id`, `name`: "BRNDNUR Advisory LLP", `url`: "https://brndnur.in/", `telephone`: "+919048188899", `email`: "brndnuradvisoryllp@gmail.com", `addressLocality`: "Manjeri", `addressRegion`: "Kerala", `addressCountry`: "IN", `areaServed`: "IN" | Omitted exact street address, postal code, opening hours, sameAs social links, and AggregateRating (unverified in source). |
| `trademark-registration/index.html` | `WebPage`, `Service`, `FAQPage` | `Service` (`name`: "Trademark Registration Support", `serviceType`: "Intellectual Property Advisory"), `FAQPage` with 7 Q&A pairs | Omitted fixed pricing and government fee guarantees. All FAQ text reflects visible on-page copy verbatim. |
| `services/index.html` | `WebPage`, `FAQPage` | `WebPage`, `FAQPage` with 5 Q&A pairs reflecting trademark search, filing, renewal, GST/MSME advisory | Omitted standalone Service schema for secondary unbundled offerings to prevent misleading schema representation. |
| `packages/index.html` | `WebPage`, `FAQPage` | `WebPage`, `FAQPage` with 6 Q&A pairs covering process, documentation, timeline, and fee structures | **Omitted `Offer` / `Product` schema:** Project documentation notes discrepancies between package table fees (₹1,500 professional) and WhatsApp consultation figures (₹3,000+). Per claim-safety rules, omitted rather than fabricated. |

---

## 5. Crawlability & Indexing

- **Robots Directives:** Every page contains `<meta name="robots" content="index, follow, max-image-preview:large">`.
- **`robots.txt`:** Allows all spiders without arbitrary blocks, permits asset paths (`/shared/`, `/assets/`, etc.), and specifies the absolute sitemap location `https://brndnur.in/sitemap.xml`.
- **`sitemap.xml`:**
  - 4 canonical URLs strictly:
    1. `https://brndnur.in/`
    2. `https://brndnur.in/trademark-registration/`
    3. `https://brndnur.in/services/`
    4. `https://brndnur.in/packages/`
  - Validated via Python `xml.etree.ElementTree`. Zero syntax errors. Zero draft, temporary, or uncreated routes included.

---

## 6. AEO & Content Clarity

1. **Direct Answer Headings:** Preserved existing descriptive H2/H3 headings across all pages while keeping visible text unchanged on the frozen homepage.
2. **Visible Q&A Alignment:** All `FAQPage` structured data mirrors the exact on-page question and answer text rendered in accordions across the three reference pages.
3. **Accurate Alt Attributes:**
   - Homepage hero alt corrected from `"BRANDNUR advisory workspace"` to `"BRNDNUR Advisory workspace"`.
   - All other images feature descriptive, factual alt text without artificial keyword stuffing.
4. **Anchor Text:** Replaced ambiguous anchor texts where safe; preserved established WhatsApp query strings with clean URL encoding.

---

## 7. Accessibility & Performance Verification

### Performance Improvements
- **Cumulative Layout Shift (CLS) Prevention:** Calculated exact pixel dimensions from binary headers of all 24 image assets using PIL, and injected matching `width="..." height="..."` attributes into every `<img>` element.
- **Largest Contentful Paint (LCP) Optimization:** Added `fetchpriority="high"` to primary hero images across all 4 pages.
- **Lazy Loading:** Added `loading="lazy" decoding="async"` to all below-the-fold images.
- **Render-Blocking Script Removal:** Injected `defer` on `<script src="...site.js">` across all 4 pages.

### Accessibility Safeguards
- Native semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, `<a>`) maintained.
- All external links contain `rel="noopener noreferrer"`.
- Form inputs across pages inspected; all interactive elements have programmatic labels or associated text.
- Tested responsive behavior down to 375px mobile viewport in browser; no horizontal scrollbar or clipped text detected.

---

## 8. Required Quality-Check Matrix

| Category | Check Description | Result | Evidence / Notes |
|---|---|---|---|
| **Static HTML** | All 4 source files remain present | **PASS** | Verified on disk: `index.html`, `trademark-registration/index.html`, `services/index.html`, `packages/index.html`. |
| | Unique, accurate title on each page | **PASS** | Automated test verified 4 distinct titles (lengths: 45–69 chars). |
| | Unique meta description on each page | **PASS** | Automated test verified 4 distinct descriptions (lengths: 152–160 chars). |
| | Valid doctype, lang="en", charset, viewport | **PASS** | All 4 documents verified with standard HTML5 declarations. |
| | Exactly 1 `<h1>` per page | **PASS** | Automated test confirmed exactly one H1 per page; homepage H1 text unchanged. |
| | No contradictory or accidental `noindex` | **PASS** | All pages have explicit `index, follow, max-image-preview:large`. |
| | Self-referencing canonical URLs | **PASS** | Confirmed absolute HTTPS URLs ending with trailing slashes matching page paths. |
| | Open Graph & Twitter Cards complete | **PASS** | Verified all required tags present and resolving to valid local image paths. |
| **Crawlability** | `robots.txt` syntax & asset access | **PASS** | Validated; allows `/`, `/shared/`, `/assets/`, and specifies sitemap URL. |
| | `sitemap.xml` parses and contains only 4 pages | **PASS** | Parsed with `xml.etree.ElementTree`; exactly 4 canonical URLs present. |
| | Zero out-of-scope routes in sitemap | **PASS** | Excluded all 28 planned future manifest routes. |
| **Structured Data**| Valid JSON-LD syntax on all pages | **PASS** | Parsed all blocks with Python `json.loads`; 0 syntax errors. |
| | Fact accuracy & no fabricated claims | **PASS** | Strictly omitted unverified street addresses, reviews, and contested package pricing. |
| **Assets & Links**| All local CSS & JS references resolve | **PASS** | Verified against local filesystem and via local HTTP server (status 200). |
| | All local image `src` paths resolve | **PASS** | Verified all 24 images exist on disk and load successfully with HTTP 200. |
| | Telephone and WhatsApp links functional | **PASS** | Verified `tel:+919048188899` and clean URL-encoded WhatsApp messages. |
| | External links hardened | **PASS** | `rel="noopener noreferrer"` present on all external anchor tags. |
| **Preservation** | Homepage frozen design preserved | **PASS** | Visual inspection and browser rendering confirm zero composition/copy changes. |
| | Scope lock preserved (no extra pages) | **PASS** | Exactly 4 content HTML files exist in the public repository. |
| **Live Network** | Live DNS / Search Console / Analytics | **NOT RUN** | Staging/local run only. Post-deployment manual actions documented below. |

---

## 9. Owner Decisions & Unresolved Items

The following items are preserved without guessing and require business owner confirmation:

1. **Package Fee Discrepancy:**
   - `packages/index.html` displays an individual package breakdown of ₹4,500 Govt + ₹1,500 Professional = ₹6,000 Total.
   - WhatsApp inquiry templates reference ₹3,000+ professional advisory fees.
   - *Action Taken:* Kept visible page text as-is; omitted machine-readable `Offer` pricing schema to prevent schema validation conflicts. Owner must confirm authoritative fee schedule.
2. **Official Social Media Handles:**
   - Social icon links in headers/footers point to generic domains (`https://www.instagram.com/`, `https://www.linkedin.com/`, `https://www.youtube.com/`).
   - *Action Taken:* Maintained links with security attributes; flagged for owner to provide exact company handles (e.g. `instagram.com/brndnur`).
3. **Out-of-Scope Legal Routes:**
   - Footer links point to `privacy-policy/index.html`, `terms-and-conditions/index.html`, `disclaimer/index.html`, and `refund-cancellation-policy/index.html`.
   - *Action Taken:* In adherence to the strict 4-page scope override, these pages were **not created**. When authorized under a separate task, create these legal pages.
4. **Production Domain & Hostinger Setup:**
   - Canonical base is configured as `https://brndnur.in/`.
   - Confirm Hostinger web server forces HTTPS and redirects `www.brndnur.in` to `https://brndnur.in/` (or vice versa according to primary domain preference).

---

## 10. Deployment Checklist (Hostinger Document Root)

When deploying to Hostinger:

1. **Upload Files:**
   - Upload `index.html`, `robots.txt`, `sitemap.xml`, and the directories `assets/`, `shared/`, `trademark-registration/`, `services/`, and `packages/` directly to `public_html/`.
2. **Post-Deployment HTTP Checks:**
   - Verify `https://brndnur.in/robots.txt` returns HTTP 200.
   - Verify `https://brndnur.in/sitemap.xml` returns HTTP 200 and loads valid XML.
   - Test that `http://` redirects cleanly (301) to `https://`.
   - Confirm trailing slash behavior (`/services` redirects to `/services/`).
3. **Search Engine Webmaster Tools:**
   - Log into [Google Search Console](https://search.google.com/search-console) for property `https://brndnur.in/`.
   - Submit `https://brndnur.in/sitemap.xml`.
   - Request indexing for `https://brndnur.in/`, `https://brndnur.in/trademark-registration/`, `https://brndnur.in/services/`, and `https://brndnur.in/packages/`.
   - Repeat submission in [Bing Webmaster Tools](https://www.bing.com/webmasters).
4. **Monitoring:**
   - Monitor URL Inspection in Google Search Console to verify rich-result detection for Organization and FAQ structured data.
