# BRNDNUR Advisory LLP — Master Image Integration & Placement Report

**Document Purpose:** Definitive technical audit, mapping verification, and production status record for the integration of all 78 bespoke content image assets and 28 shared CTA background placements across the 32 website routes.
**Date:** October 19, 2026
**Lead Engineer:** Antigravity Engineering (Lead Frontend & Astro Visual Integration Specialist)
**Integration Status:** **100% COMPLETE — PRODUCTION READY & VERIFIED**

---

## Executive Summary

- **Total Canonical Routes:** 32 (100% verified)
- **Bespoke Content Images Generated & Sourced:** 78 / 78 (100% located in `78 IMAGES/`)
- **Bespoke Images Converted & Integrated:** 78 / 78 (100% placed into canonical paths)
- **Shared Brand Asset Placements:** 28 / 28 (`cta-leaves.webp` preserved across all 28 designated CTA sections)
- **Total Live DOM Image Placements:** 106 (78 bespoke + 28 CTA background)
- **Broken Image Links Detected:** 0 (100% HTTP 200 OK)
- **Static Output Build:** Clean static generation into `dist/` via Astro SSG
- **Responsive & Visual QA:** Verified on Desktop (1440px), Tablet (768px), and Mobile (390px)

---

## A. Asset Mapping Register (Assets 1–78)

| Asset No. | Temporary Source Filename | Canonical Production Filename | Canonical Output Path | Route | Intended Section | Target Res | Aspect Ratio | Source Found | Conversion Status | Integration Status | Visual QA | Notes / Status |
|:---:|:---|:---|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | `image-1.png_20261019180810.jpg` | `home-hero-brand-desk.png` | `public/assets/home-hero-brand-desk.png` | `/` | Your Brand Deservesa Stronger | 2880x2160 (Master 4K) | 4:3 | Verified | Converted (.PNG, 1047.8 KB) | Integrated | Verified | Production Active |
| 2 | `image-2.png_20261019180810.jpg` | `home-card-trademark.webp` | `public/assets/home-card-trademark.webp` | `/` | Informed Decisions. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 121.9 KB) | Integrated | Verified | Production Active |
| 3 | `image-3.png_20261019180810.jpg` | `home-card-search.webp` | `public/assets/home-card-search.webp` | `/` | Informed Decisions. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 132.9 KB) | Integrated | Verified | Production Active |
| 4 | `image-4.png_20261019180810.jpg` | `home-card-business.webp` | `public/assets/home-card-business.webp` | `/` | Informed Decisions. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 174.3 KB) | Integrated | Verified | Production Active |
| 5 | `image-5.png_20261019180810.jpg` | `home-about-partnership.webp` | `public/assets/home-about-partnership.webp` | `/` | More Than a Service.A Partner | 2880x1920 | 3:2 | Verified | Converted (.WEBP, 160.9 KB) | Integrated | Verified | Production Active |
| 6 | `image-6.png_20261019180810.jpg` | `tm-hero-protection.jpg` | `public/trademark-registration/assets/tm-hero-protection.jpg` | `/trademark-registration/` | Protect Your Brand.Build With | 2700x2160 | 5:4 | Verified | Converted (.JPG, 166.2 KB) | Integrated | Verified | Production Active |
| 7 | `image-7.png_20261019180810.jpg` | `tm-benefits-foundation.jpg` | `public/trademark-registration/assets/tm-benefits-foundation.jpg` | `/trademark-registration/` | Give Your Brand aStronger Foun | 2048x1536 | 4:3 | Verified | Converted (.JPG, 191.2 KB) | Integrated | Verified | Production Active |
| 8 | `image-8.png_20261019180810.jpg` | `tm-support-steps.jpg` | `public/trademark-registration/assets/tm-support-steps.jpg` | `/trademark-registration/` | Trademark Support,Step by Step | 2400x1600 | 3:2 | Verified | Converted (.JPG, 131.1 KB) | Integrated | Verified | Production Active |
| 9 | `image-9.png_20261019180810.jpg` | `tm-process-path.jpg` | `public/trademark-registration/assets/tm-process-path.jpg` | `/trademark-registration/` | A Clearer Path toTrademark Reg | 1920x2400 | 4:5 | Verified | Converted (.JPG, 309.0 KB) | Integrated | Verified | Production Active |
| 10 | `image-10.png_20261019180810.jpg` | `tm-faq-advisory.jpg` | `public/trademark-registration/assets/tm-faq-advisory.jpg` | `/trademark-registration/` | Common Questions. | 1800x2400 | 3:4 | Verified | Converted (.JPG, 156.2 KB) | Integrated | Verified | Production Active |
| 11 | `image-11.png_20261019180850.jpg` | `services-hero-trademark.webp` | `public/services/assets/services-hero-trademark.webp` | `/services/` | Build. Protect.Grow Your Brand | 2880x2160 | 4:3 | Verified | Converted (.WEBP, 152.9 KB) | Integrated | Verified | Production Active |
| 12 | `image-12.png_20261019180850.jpg` | `services-trademark-filing.webp` | `public/services/assets/services-trademark-filing.webp` | `/services/` | Trademark Services. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 108.2 KB) | Integrated | Verified | Production Active |
| 13 | `image-13.png_20261019180850.jpg` | `services-business-registration.webp` | `public/services/assets/services-business-registration.webp` | `/services/` | Business Registration Support. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 220.9 KB) | Integrated | Verified | Production Active |
| 14 | `image-14.png_20261019180850.jpg` | `services-process-search.webp` | `public/services/assets/services-process-search.webp` | `/services/` | A Simple Process. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 134.9 KB) | Integrated | Verified | Production Active |
| 15 | `image-15.png_20261019180850.jpg` | `services-why-brndnur.png` | `public/services/assets/services-why-brndnur.png` | `/services/` | More Than a Service.A Partner | 1920x2400 | 4:5 | Verified | Converted (.PNG, 1177.5 KB) | Integrated | Verified | Production Active |
| 16 | `image-16.png_20261019180850.jpg` | `services-faq-portfolio.webp` | `public/services/assets/services-faq-portfolio.webp` | `/services/` | Questions Before You Get Start | 1800x2400 | 3:4 | Verified | Converted (.WEBP, 154.8 KB) | Integrated | Verified | Production Active |
| 17 | `image-17.png_20261019180850.jpg` | `packages-hero-pricing.webp` | `public/packages/assets/packages-hero-pricing.webp` | `/packages/` | Clear Options.Practical Suppor | 3840x2160 (Master 4K) | 16:9 | Verified | Converted (.WEBP, 134.7 KB) | Integrated | Verified | Production Active |
| 18 | `image-18.png_20261019180850.jpg` | `packages-card-starter.webp` | `public/packages/assets/packages-card-starter.webp` | `/packages/` | Choose the Support That Fits Y | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 145.3 KB) | Integrated | Verified | Production Active |
| 19 | `image-19.png_20261019180850.jpg` | `packages-card-trademark.webp` | `public/packages/assets/packages-card-trademark.webp` | `/packages/` | Choose the Support That Fits Y | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 196.1 KB) | Integrated | Verified | Production Active |
| 20 | `image-20.png_20261019180850.jpg` | `packages-card-food.webp` | `public/packages/assets/packages-card-food.webp` | `/packages/` | Choose the Support That Fits Y | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 170.6 KB) | Integrated | Verified | Production Active |
| 21 | `image-21.png_20261019180920.jpg` | `packages-card-gulf.webp` | `public/packages/assets/packages-card-gulf.webp` | `/packages/` | Choose the Support That Fits Y | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 143.8 KB) | Integrated | Verified | Production Active |
| 22 | `image-22.png_20261019180920.jpg` | `packages-pricing-breakdown.webp` | `public/packages/assets/packages-pricing-breakdown.webp` | `/packages/` | Understand What You Pay For. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 157.6 KB) | Integrated | Verified | Production Active |
| 23 | `image-23.png_20261019180920.jpg` | `packages-watch-support.webp` | `public/packages/assets/packages-watch-support.webp` | `/packages/` | Support Beyond the Initial App | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 145.4 KB) | Integrated | Verified | Production Active |
| 24 | `image-24.png_20261019180920.jpg` | `packages-faq-legal.webp` | `public/packages/assets/packages-faq-legal.webp` | `/packages/` | Questions About Packages & Pri | 2560x1440 | 16:9 | Verified | Converted (.WEBP, 136.2 KB) | Integrated | Verified | Production Active |
| 25 | `image-25.png_20261019180920.jpg` | `about-hero-guidance.webp` | `public/assets/about-hero-guidance.webp` | `/about/` | Guidance for Your Brand’sNext | 2880x1920 | 3:2 | Verified | Converted (.WEBP, 164.9 KB) | Integrated | Verified | Production Active |
| 26 | `image-26.png_20261019180920.jpg` | `about-values-integrity.png` | `public/assets/about-values-integrity.png` | `/about/` | Clarity, Integrity, and Protec | 1920x2400 | 4:5 | Verified | Converted (.PNG, 1149.0 KB) | Integrated | Verified | Production Active |
| 27 | `image-27.png_20261019180920.jpg` | `about-card-trademark.webp` | `public/assets/about-card-trademark.webp` | `/about/` | Comprehensive Brand & Regulato | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 169.4 KB) | Integrated | Verified | Production Active |
| 28 | `image-28.png_20261019180920.jpg` | `about-card-corporate.webp` | `public/assets/about-card-corporate.webp` | `/about/` | Comprehensive Brand & Regulato | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 134.4 KB) | Integrated | Verified | Production Active |
| 29 | `image-29.png_20261019180920.jpg` | `about-card-search.webp` | `public/assets/about-card-search.webp` | `/about/` | Comprehensive Brand & Regulato | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 152.9 KB) | Integrated | Verified | Production Active |
| 30 | `image-30.png_20261019180920.jpg` | `how-hero-workflow.webp` | `public/assets/how-hero-workflow.webp` | `/how-it-works/` | A Clearer Way toProtect and Bu | 2880x2160 | 4:3 | Verified | Converted (.WEBP, 132.6 KB) | Integrated | Verified | Production Active |
| 31 | `image-31.png_20261019181010.jpg` | `how-prep-research.webp` | `public/assets/how-prep-research.webp` | `/how-it-works/` | How We Research and Prepare Yo | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 113.4 KB) | Integrated | Verified | Production Active |
| 32 | `image-32.png_20261019181010.jpg` | `how-step-search.webp` | `public/assets/how-step-search.webp` | `/how-it-works/` | What You Need to Get Started. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 147.2 KB) | Integrated | Verified | Production Active |
| 33 | `image-33.png_20261019181010.jpg` | `how-step-business.webp` | `public/assets/how-step-business.webp` | `/how-it-works/` | What You Need to Get Started. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 129.0 KB) | Integrated | Verified | Production Active |
| 34 | `image-34.png_20261019181010.jpg` | `how-step-filing.webp` | `public/assets/how-step-filing.webp` | `/how-it-works/` | What You Need to Get Started. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 130.3 KB) | Integrated | Verified | Production Active |
| 35 | `image-35.png_20261019181010.jpg` | `how-choice-start.webp` | `public/assets/how-choice-start.webp` | `/how-it-works/` | Find the Right Starting Point. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 160.2 KB) | Integrated | Verified | Production Active |
| 36 | `image-36.png_20261019181010.jpg` | `how-choice-scale.webp` | `public/assets/how-choice-scale.webp` | `/how-it-works/` | Find the Right Starting Point. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 153.9 KB) | Integrated | Verified | Production Active |
| 37 | `image-37.png_20261019181010.jpg` | `how-choice-protect.webp` | `public/assets/how-choice-protect.webp` | `/how-it-works/` | Find the Right Starting Point. | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 202.5 KB) | Integrated | Verified | Production Active |
| 38 | `image-38.png_20261019181010.jpg` | `faqs-hero-library.webp` | `public/assets/faqs-hero-library.webp` | `/faqs/` | Frequently AskedQuestions. | 3840x2160 | 16:9 | Verified | Converted (.WEBP, 173.8 KB) | Integrated | Verified | Production Active |
| 39 | `image-39.png_20261019181010.jpg` | `faqs-guidance-consultation.webp` | `public/assets/faqs-guidance-consultation.webp` | `/faqs/` | Clear Guidance, Without Commer | 1800x2400 | 3:4 | Verified | Converted (.WEBP, 198.8 KB) | Integrated | Verified | Production Active |
| 40 | `image-40.png_20261019181010.jpg` | `contact-hero-consultation.jpg` | `public/assets/contact-hero-consultation.jpg` | `/contact/` | Let’s Talk AboutYour Brand. | 2880x2160 | 4:3 | Verified | Converted (.JPG, 144.3 KB) | Integrated | Verified | Production Active |
| 41 | `image-41.png_20261019181049.jpg` | `classes-hero-catalog.jpg` | `public/assets/classes-hero-catalog.jpg` | `/trademark-classes/` | Find the Right TrademarkClass | 2880x2160 | 4:3 | Verified | Converted (.JPG, 137.6 KB) | Integrated | Verified | Production Active |
| 42 | `image-42.png_20261019181049.jpg` | `classes-avoid-overfiling.png` | `public/assets/classes-avoid-overfiling.png` | `/trademark-classes/` | Avoiding Over-Filing and Under | 1920x2400 | 4:5 | Verified | Converted (.PNG, 754.0 KB) | Integrated | Verified | Production Active |
| 43 | `image-43.png_20261019181049.jpg` | `search-hero-preclearance.webp` | `public/assets/search-hero-preclearance.webp` | `/brand-name-search/` | Check Your Brand NameBefore Yo | 2880x2160 | 4:3 | Verified | Converted (.WEBP, 146.2 KB) | Integrated | Verified | Production Active |
| 44 | `image-44.png_20261019181049.jpg` | `search-why-clearance.webp` | `public/assets/search-why-clearance.webp` | `/brand-name-search/` | Why Pre-Filing Clearance Prote | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 194.9 KB) | Integrated | Verified | Production Active |
| 45 | `image-45.png_20261019181049.jpg` | `wordmark-hero-typography.jpg` | `public/assets/wordmark-hero-typography.jpg` | `/wordmark-registration/` | Wordmark RegistrationSupport i | 2880x2160 | 4:3 | Verified | Converted (.JPG, 202.3 KB) | Integrated | Verified | Production Active |
| 46 | `image-46.png_20261019181049.jpg` | `wordmark-foundation-exclusivity.webp` | `public/assets/wordmark-foundation-exclusivity.webp` | `/wordmark-registration/` | The Foundation of Brand Exclus | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 186.6 KB) | Integrated | Verified | Production Active |
| 47 | `image-47.png_20261019181049.jpg` | `logo-hero-branding.jpg` | `public/assets/logo-hero-branding.jpg` | `/logo-trademark-registration/` | Logo & Device MarkTrademark Re | 2880x2160 | 4:3 | Verified | Converted (.JPG, 145.6 KB) | Integrated | Verified | Production Active |
| 48 | `image-48.png_20261019181049.jpg` | `logo-packaging-protection.webp` | `public/assets/logo-packaging-protection.webp` | `/logo-trademark-registration/` | Protecting Your Graphic Elemen | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 73.1 KB) | Integrated | Verified | Production Active |
| 49 | `image-49.png_20261019181049.jpg` | `renewal-hero-timeline.jpg` | `public/assets/renewal-hero-timeline.jpg` | `/trademark-renewal/` | Trademark Renewal &Maintenance | 2880x2160 | 4:3 | Verified | Converted (.JPG, 133.8 KB) | Integrated | Verified | Production Active |
| 50 | `image-50.png_20261019181049.jpg` | `renewal-ownership-maintenance.webp` | `public/assets/renewal-ownership-maintenance.webp` | `/trademark-renewal/` | Maintaining Perpetual Trademar | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 152.4 KB) | Integrated | Verified | Production Active |
| 51 | `image-51.png_20261019181123.jpg` | `monitoring-hero-watch.jpg` | `public/assets/monitoring-hero-watch.jpg` | `/trademark-monitoring/` | Trademark Monitoring &Brand Wa | 2880x2160 | 4:3 | Verified | Converted (.JPG, 113.2 KB) | Integrated | Verified | Production Active |
| 52 | `image-52.png_20261019181123.jpg` | `monitoring-surveillance-defense.webp` | `public/assets/monitoring-surveillance-defense.webp` | `/trademark-monitoring/` | Why Post-Registration Surveill | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 64.9 KB) | Integrated | Verified | Production Active |
| 53 | `image-53.png_20261019181123.jpg` | `gst-hero-compliance.webp` | `public/assets/gst-hero-compliance.webp` | `/gst-registration/` | GST RegistrationGuidance for Y | 2880x2160 | 4:3 | Verified | Converted (.WEBP, 102.5 KB) | Integrated | Verified | Production Active |
| 54 | `image-54.png_20261019181123.jpg` | `gst-tax-credibility.webp` | `public/assets/gst-tax-credibility.webp` | `/gst-registration/` | Unlocking Business Credibility | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 151.9 KB) | Integrated | Verified | Production Active |
| 55 | `image-55.png_20261019181123.jpg` | `udyam-hero-certificate.jpg` | `public/assets/udyam-hero-certificate.jpg` | `/udyam-msme-registration/` | Udyam / MSME RegistrationAssis | 2880x2160 | 4:3 | Verified | Converted (.JPG, 160.4 KB) | Integrated | Verified | Production Active |
| 56 | `image-56.png_20261019181123.jpg` | `udyam-growth-catalyst.webp` | `public/assets/udyam-growth-catalyst.webp` | `/udyam-msme-registration/` | Catalyst for Small Business Gr | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 239.6 KB) | Integrated | Verified | Production Active |
| 57 | `image-57.png_20261019181123.jpg` | `fssai-hero-food-safety.jpg` | `public/assets/fssai-hero-food-safety.jpg` | `/fssai-registration/` | FSSAI Food BusinessRegistratio | 2880x2160 | 4:3 | Verified | Converted (.JPG, 217.2 KB) | Integrated | Verified | Production Active |
| 58 | `image-58.png_20261019181123.jpg` | `fssai-packaging-standards.webp` | `public/assets/fssai-packaging-standards.webp` | `/fssai-registration/` | Mandatory Compliance for Packa | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 118.0 KB) | Integrated | Verified | Production Active |
| 59 | `image-59.png_20261019181123.jpg` | `setup-hero-foundations.jpg` | `public/assets/setup-hero-foundations.jpg` | `/business-setup/` | Business Setup & StartupAdviso | 2880x2160 | 4:3 | Verified | Converted (.JPG, 107.2 KB) | Integrated | Verified | Production Active |
| 60 | `image-60.png_20261019181123.jpg` | `setup-startup-readiness.webp` | `public/assets/setup-startup-readiness.webp` | `/business-setup/` | Building Sustainable Business | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 152.2 KB) | Integrated | Verified | Production Active |
| 61 | `image-61.png_20261019184218.jpg` | `pkg-indiv-hero.webp` | `public/packages/assets/pkg-indiv-hero.webp` | `/packages/individual-msme/` | Individual & MSMETrademark Pac | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 138.2 KB) | Integrated | Verified | Production Active |
| 62 | `image-62.png_20261019184218.jpg` | `pkg-indiv-breakdown.webp` | `public/packages/assets/pkg-indiv-breakdown.webp` | `/packages/individual-msme/` | Tailored for Sole Proprietors, | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 149.0 KB) | Integrated | Verified | Production Active |
| 63 | `image-63.png_20261019184218.jpg` | `pkg-corp-hero.webp` | `public/packages/assets/pkg-corp-hero.webp` | `/packages/company-llp/` | Company & LLPTrademark Package | 2880x2160 | 4:3 | Verified | Converted (.WEBP, 115.8 KB) | Integrated | Verified | Production Active |
| 64 | `image-64.png_20261019184218.jpg` | `pkg-corp-security.webp` | `public/packages/assets/pkg-corp-security.webp` | `/packages/company-llp/` | Corporate Intellectual Propert | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 177.0 KB) | Integrated | Verified | Production Active |
| 65 | `image-65.png_20261019184218.jpg` | `pkg-food-hero.webp` | `public/packages/assets/pkg-food-hero.webp` | `/packages/food-brand/` | Food BrandPackage for Enterpri | 2880x2160 | 4:3 | Verified | Converted (.WEBP, 218.1 KB) | Integrated | Verified | Production Active |
| 66 | `image-66.png_20261019184218.jpg` | `pkg-food-compliance.jpg` | `public/packages/assets/pkg-food-compliance.jpg` | `/packages/food-brand/` | Unified Brand Defense and Food | 2048x1536 | 4:3 | Verified | Converted (.JPG, 167.8 KB) | Integrated | Verified | Production Active |
| 67 | `image-67.png_20261019184218.jpg` | `pkg-gulf-hero.webp` | `public/packages/assets/pkg-gulf-hero.webp` | `/packages/gulf-return-business/` | Gulf-Return BusinessPackage fo | 2880x2160 | 4:3 | Verified | Converted (.WEBP, 193.0 KB) | Integrated | Verified | Production Active |
| 68 | `image-68.png_20261019184218.jpg` | `pkg-gulf-commercial.jpg` | `public/packages/assets/pkg-gulf-commercial.jpg` | `/packages/gulf-return-business/` | Guiding Kerala’s Global Return | 2048x1536 | 4:3 | Verified | Converted (.JPG, 184.8 KB) | Integrated | Verified | Production Active |
| 69 | `image-69.png_20261019184218.jpg` | `resources-hero-knowledge.webp` | `public/assets/resources-hero-knowledge.webp` | `/resources/` | Intellectual Property &Complia | 3840x2160 | 16:9 | Verified | Converted (.WEBP, 289.5 KB) | Integrated | Verified | Production Active |
| 70 | `image-70.png_20261019184218.jpg` | `resources-support-clarity.jpg` | `public/assets/resources-support-clarity.jpg` | `/resources/` | Empowering Indian Founders wit | 2880x1920 | 3:2 | Verified | Converted (.JPG, 171.6 KB) | Integrated | Verified | Production Active |
| 71 | `image-71.png_20261019184233.jpg` | `resources-card-tm.webp` | `public/assets/resources-card-tm.webp` | `/resources/` | Essential Brand Protection Kno | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 144.3 KB) | Integrated | Verified | Production Active |
| 72 | `image-72.png_20261019184233.jpg` | `resources-card-classes.jpg` | `public/assets/resources-card-classes.jpg` | `/resources/` | Essential Brand Protection Kno | 2048x1536 | 4:3 | Verified | Converted (.JPG, 180.9 KB) | Integrated | Verified | Production Active |
| 73 | `image-73.png_20261019184233.jpg` | `resources-card-search.webp` | `public/assets/resources-card-search.webp` | `/resources/` | Essential Brand Protection Kno | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 151.1 KB) | Integrated | Verified | Production Active |
| 74 | `image-74.png_20261019184233.jpg` | `resources-card-process.webp` | `public/assets/resources-card-process.webp` | `/resources/` | Essential Brand Protection Kno | 2048x1536 | 4:3 | Verified | Converted (.WEBP, 135.3 KB) | Integrated | Verified | Production Active |
| 75 | `image-75.png_20261019184233.jpg` | `guide-tm-reg-hero.jpg` | `public/assets/guide-tm-reg-hero.jpg` | `/resources/trademark-registration-guide/` | Trademark Registrationin India | 2880x2160 | 4:3 | Verified | Converted (.JPG, 173.7 KB) | Integrated | Verified | Production Active |
| 76 | `image-76.png_20261019184233.jpg` | `guide-class-hero.jpg` | `public/assets/guide-class-hero.jpg` | `/resources/trademark-class-guide/` | Trademark Class Guide: NICE Cl | 2880x2160 | 4:3 | Verified | Converted (.JPG, 238.0 KB) | Integrated | Verified | Production Active |
| 77 | `image-77.png_20261019184233.jpg` | `guide-search-hero.webp` | `public/assets/guide-search-hero.webp` | `/resources/brand-name-search-guide/` | Brand Name Search: The Essenti | 2880x2160 | 4:3 | Verified | Converted (.WEBP, 157.5 KB) | Integrated | Verified | Production Active |
| 78 | `image-78.png_20261019184233.jpg` | `guide-process-hero.jpg` | `public/assets/guide-process-hero.jpg` | `/resources/trademark-application-process/` | Trademark Application Processi | 1920x2400 | 4:5 | Verified | Converted (.JPG, 99.1 KB) | Integrated | Verified | Production Active |

---

## B. Route-Level Verification (All 32 Routes)

| Page ID | Page Name | Canonical URL | Bespoke Images | CTA Background | Total Placements | Desktop QA (1440px) | Mobile QA (390px) | Production Status |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|:---|
| Page #1 | Home | `/` | 5 | 1 (`cta-leaves.webp`) | 6 | Verified | Verified | 100% Production Verified |
| Page #2 | Trademark Registration | `/trademark-registration/` | 5 | None (Intentional) | 5 | Verified | Verified | 100% Production Verified |
| Page #3 | Services | `/services/` | 6 | None (Intentional) | 6 | Verified | Verified | 100% Production Verified |
| Page #4 | Packages & Pricing | `/packages/` | 8 | None (Intentional) | 8 | Verified | Verified | 100% Production Verified |
| Page #5 | About BRNDNUR | `/about/` | 5 | 1 (`cta-leaves.webp`) | 6 | Verified | Verified | 100% Production Verified |
| Page #6 | How It Works | `/how-it-works/` | 8 | 1 (`cta-leaves.webp`) | 9 | Verified | Verified | 100% Production Verified |
| Page #7 | FAQs | `/faqs/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #8 | Contact | `/contact/` | 1 | 1 (`cta-leaves.webp`) | 2 | Verified | Verified | 100% Production Verified |
| Page #9 | Trademark Classes | `/trademark-classes/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #10 | Brand Name Search | `/brand-name-search/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #11 | Wordmark Registration | `/wordmark-registration/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #12 | Logo Trademark Registration | `/logo-trademark-registration/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #13 | Trademark Renewal | `/trademark-renewal/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #14 | Trademark Monitoring | `/trademark-monitoring/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #15 | GST Registration Assistance | `/gst-registration/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #16 | Udyam / MSME Registration | `/udyam-msme-registration/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #17 | FSSAI Registration Assistance | `/fssai-registration/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #18 | Business Setup Advisory | `/business-setup/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #19 | Individual & MSME Package | `/packages/individual-msme/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #20 | Company & LLP Package | `/packages/company-llp/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #21 | Food Brand Package | `/packages/food-brand/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #22 | Gulf-Return Business Package | `/packages/gulf-return-business/` | 2 | 1 (`cta-leaves.webp`) | 3 | Verified | Verified | 100% Production Verified |
| Page #23 | Resources Hub | `/resources/` | 6 | 1 (`cta-leaves.webp`) | 7 | Verified | Verified | 100% Production Verified |
| Page #24 | Trademark Registration Guide | `/resources/trademark-registration-guide/` | 1 | 1 (`cta-leaves.webp`) | 2 | Verified | Verified | 100% Production Verified |
| Page #25 | Trademark Class Guide | `/resources/trademark-class-guide/` | 1 | 1 (`cta-leaves.webp`) | 2 | Verified | Verified | 100% Production Verified |
| Page #26 | Brand Name Search Guide | `/resources/brand-name-search-guide/` | 1 | 1 (`cta-leaves.webp`) | 2 | Verified | Verified | 100% Production Verified |
| Page #27 | Trademark Application Process Guide | `/resources/trademark-application-process/` | 1 | 1 (`cta-leaves.webp`) | 2 | Verified | Verified | 100% Production Verified |
| Page #28 | Privacy Policy | `/privacy-policy/` | 0 | 1 (`cta-leaves.webp`) | 1 | Verified | Verified | 100% Production Verified |
| Page #29 | Terms & Conditions | `/terms-and-conditions/` | 0 | 1 (`cta-leaves.webp`) | 1 | Verified | Verified | 100% Production Verified |
| Page #30 | Legal Disclaimer | `/disclaimer/` | 0 | 1 (`cta-leaves.webp`) | 1 | Verified | Verified | 100% Production Verified |
| Page #31 | Refund & Cancellation Policy | `/refund-cancellation-policy/` | 0 | 1 (`cta-leaves.webp`) | 1 | Verified | Verified | 100% Production Verified |
| Page #32 | Custom 404 Error Page | `/404.html` | 0 | None (Intentional) | 0 | Verified | Verified | 100% Production Verified |

---

## C. Shared CTA Background Audit (`cta-leaves.webp`)

- **Asset Path:** `public/assets/cta-leaves.webp` (also mirrored to `assets/cta-leaves.webp`)
- **File Size:** 42,488 bytes
- **Format:** WebP Image
- **Resolution:** 3840x2160 Master 4K (16:9 aspect ratio)
- **Visual Subject:** Architectural botanical still life with delicate shadows of areca palm and monstera fronds across warm ivory (#F4EFE4) limewashed plaster.
- **Design Rule:** Preserved as a single shared brand asset across all 28 designated CTA sections. Not replaced, not duplicated, and not inflated into bespoke asset counts.
- **Total Referenced Placements:** 28 HTML routes in `dist/` actively loading `cta-leaves.webp` with HTTP 200 OK.

---

## D. Automated Verification & Test Evidence

### 1. Build Verification
```bash
$ npm run build
19:49:38 [build] 32 page(s) built in 11.76s
19:49:38 [build] Complete!
```

### 2. Live HTTP Crawler & Broken Image Scan
```bash
$ python scratch/live_http_crawl.py
TOTAL ROUTES TESTED: 32
TOTAL IMAGE REQUESTS EXECUTED: 106
TOTAL FAILED IMAGE REQUESTS: 0
ALL 106 IMAGE PLACEMENTS ACROSS ALL 32 ROUTES LOADED WITH HTTP 200 SUCCESS!
```

### 3. Static Distribution Asset Audit (`scratch/audit_dist_images.py`)
```bash
Total HTML files found in dist/: 32
Total distinct images referenced across all pages: 79
Total broken image references: 0
Bespoke assets referenced in dist: 78 / 78 (100%)
CTA leaves referenced across 28 HTML pages in dist: 28 / 28 (100%)
```

### 4. Comprehensive 32-Route QA Suite (`tests/verify_dist.py`)
```bash
$ python tests/verify_dist.py
[CHECK 1] Inspecting all 32 routes in dist... -> 32 route files verified on disk.
[CHECK 2] Validating sitemap.xml... -> 31 URLs verified.
[CHECK 3] Validating robots.txt... -> Verified.
[CHECK 4] Validating Hostinger .htaccess... -> Verified.
[SUCCESS] ALL 32 ROUTES, METADATA, ASSETS, SITEMAP, ROBOTS, AND .HTACCESS VERIFIED 100% CLEAN!
```

### 5. 78-Image Prompt Suite QA Validation (`tests/validate_78_prompts.py`)
```bash
$ python tests/validate_78_prompts.py
[SUCCESS] ALL 12 VALIDATION CRITERIA PASSED CLEANLY (100% VERIFIED)!
```

---

## E. Progress Tracking & Sign-off

| Lifecycle Stage | Initial State | Final State | Verification Status |
|:---|:---:|:---:|:---|
| 1. Prompts Written | 78 / 78 | 78 / 78 | 100% Complete |
| 2. Prompts Validated | 78 / 78 | 78 / 78 | 100% Complete |
| 3. Images Generated | 0 / 78 | 78 / 78 | 100% Sourced from `78 IMAGES/` |
| 4. Images Visually Reviewed | 0 / 78 | 78 / 78 | 100% Verified against creative briefs |
| 5. Images Approved | 0 / 78 | 78 / 78 | 100% Approved |
| 6. Images Integrated | 0 / 78 | 78 / 78 | 100% Integrated into Astro templates |
| 7. Shared CTA Background | Verified | Verified | 28 Placements Active |

**Final Engineering Sign-Off:** All 78 bespoke images and 28 shared CTA backgrounds are active, correctly placed, fully responsive, and verified 100% error-free across all 32 website routes.