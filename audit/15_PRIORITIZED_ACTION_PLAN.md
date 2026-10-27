# Prioritized Master Action Plan & Production Verification
**Client:** BRNDNUR Advisory LLP  
**Framework Version:** Astro v5 Static SSG  

## 1. Action Items Summary by Severity

### P0 — Critical Security & Availability (Completed)
- [x] **Enforce HTTPS & Trailing Slashes:** Configured `mod_rewrite` rules in `public/.htaccess` ensuring canonical 301 redirects to HTTPS and directory trailing slashes.
- [x] **Eliminate 404 & Broken Links:** Verified all 31 canonical URLs resolve with HTTP 200; custom `404.html` deployed for unmatched routes.
- [x] **Zero Hardcoded Secrets:** Audited repository for API keys, passwords, and sensitive credentials (0 found).

### P1 — Indexing, Discoverability & Core Conversion (Completed)
- [x] **XML Sitemap Maintenance:** Validated `public/sitemap.xml` with `<lastmod>2026-10-22</lastmod>` across all 31 canonical routes.
- [x] **AI Search Knowledge Base:** Built `/llms.txt` and `/llms-full.txt` (100/100 compliance score via `llms_txt_checker.py`).
- [x] **AI Crawler Access Rules:** Explicitly documented and allowed all 11 major AI crawler families in `public/robots.txt`.
- [x] **Direct WhatsApp Conversion:** Verified pre-filled click-to-chat links with verified international number `+91 90481 88899`.

### P2 — Architecture, Accessibility & Rich Schema (Completed)
- [x] **Schema.org Graph Upgrade:** Added unified `Organization`, `LocalBusiness`, `ProfessionalService`, `LegalService`, `WebSite`, `WebPage`, and `BreadcrumbList` schema graph with complete NAP, Geo coordinates, and hours.
- [x] **WCAG 2.4.1 Skip-to-Content Link:** Implemented keyboard-accessible skip link with high-contrast styling in `BaseLayout.astro`.
- [x] **Accessible Anchor Texts:** Added `.sr-only` descriptive brand text to logo links in header and footer.
- [x] **Title Tag Standardization:** Standardized all inner page title tags within 60 characters with authoritative `| BRNDNUR` branding.

### P3 — External Production Integration (Client Delegated Steps)
- [ ] **Google Search Console & Bing Webmaster Verification:** Add DNS TXT record or HTML verification file upon domain DNS delegation.
- [ ] **Google Business Profile (GBP) Claiming:** Claim and verify official listing for Manjeri office to link review shortlink directly in footer.
- [ ] **Social Media URL Mapping:** Map live LinkedIn and X URLs in `BaseLayout.astro`'s `sameAs` schema once public accounts are published.
