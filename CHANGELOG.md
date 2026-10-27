# BRNDNUR Advisory LLP — Changelog

All notable changes to the BRNDNUR Advisory LLP static website project are documented in this file.

---

## [1.2.0] — 2026-10-26

### Added
- **Repository Inventory & Documentation Architecture**:
  - Created [README.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/README.md) with comprehensive local setup, testing, and deployment instructions.
  - Created [docs/architecture/PROJECT_STRUCTURE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/architecture/PROJECT_STRUCTURE.md) mapping all 32 canonical routes to owning components.
  - Created [docs/architecture/COMPONENT_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/architecture/COMPONENT_GUIDE.md) documenting shared component contracts, props, and modification guidelines.
  - Created [docs/assets/ASSET_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/assets/ASSET_GUIDE.md) detailing master source assets (`assets/`, `logo/`, `78 IMAGES/`) vs optimized production derivatives (`public/assets/`).
  - Created [docs/maintenance/MAINTENANCE_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/maintenance/MAINTENANCE_GUIDE.md) providing step-by-step procedures for returning developers to safely add pages, update copy, or adjust styles without regressions.
  - Created [docs/testing/TESTING_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/testing/TESTING_GUIDE.md) detailing automated test suites, Playwright execution, and pass/fail criteria.
  - Created [docs/deployment/DEPLOYMENT_GUIDE.md](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/docs/deployment/DEPLOYMENT_GUIDE.md) documenting the static deployment pipeline to Hostinger.
- **Npm Scripts**:
  - Added `npm test` (`node tests/audit_master_suite.mjs`).
  - Added `npm run test:autoplay` (`node tests/verify_5s_autoplay_all_sliders.mjs`).
  - Added `npm run test:typography` (`node scripts/audit_32_routes_typography.mjs`).
  - Added `npm run test:e2e` (`node tests/full_e2e_browser_suite.mjs`).

### Fixed
- **Homepage Package CTA Mobile Layout**:
  - Converted `.services-footer-banner` in [src/pages/index.astro](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/src/pages/index.astro) from fixed stretching heights to natural content-driven height (`height: auto !important; min-height: 0 !important;`), reducing mobile height from ~400px+ to 252px–254px.
  - Balanced vertical space to an exact 24px (`1.5rem`) gap between description and button.
  - Full-width button touch target (`width: 100%`, `min-height: 48px`).
  - Standardised heading typography to bold DM Sans sans-serif (`#F4EFE4`).
- **Website-Wide Typography Standardisation**:
  - Audited and standardised all 32 canonical routes around the homepage reference section ("Support for Every Stage of Your Business Journey", `#audiences`).
  - Replaced legacy `var(--serif)` in [src/pages/packages/index.astro](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/src/pages/packages/index.astro) with `var(--sans)`.
  - Bound all form elements (`input`, `select`, `textarea`) and button elements to `var(--sans)`.
  - Verified 2,725 elements across all 32 routes with 0 non-DM Sans font declarations.
- **Universal 5-Second Autoplay Standardisation**:
  - Standardised all carousels, sliders, and tracks across all pages to an exact 5,000ms auto-advance interval.
  - Ensured pause on hover, pause on interactive focus, pause on touch/drag with 5s resume delay, pause on tab visibility change, and compliance with `prefers-reduced-motion: reduce`.
  - Verified 100% pass across [tests/verify_5s_autoplay_all_sliders.mjs](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/tests/verify_5s_autoplay_all_sliders.mjs).
- **Workspace Cleanliness**:
  - Relocated root-level loose scratch screenshots into `scratch/`.
  - Documented asset boundaries to ensure zero accidental deletions of source image masters.

---

## [1.1.0] — Earlier Milestones
- 32-Route Static Astro Rebuild: Successfully implemented all 32 canonical routes defined in `BRAIN/01_PAGE_MANIFEST.md` in `src/pages/`.
- Legal & Statutory Compliance: Accurate fee separations, zero invented claims, authentic Manjeri Kerala address and phone details (+91 90481 88899).
- Image Optimization: WebP derivative generation, 1:1 ratio for brand sections, 3:4 portrait ratios for mobile content images, and desktop 40%–55% hero opacity gradients.
