# BRNDNUR Advisory LLP — Project Architecture & Structure

This document outlines the codebase organisation, route mapping, and directory structure for BRNDNUR Advisory LLP.

---

## 1. Directory Tree & Ownership

```text
BRNDNUR-Website/
├── public/                       # Static public assets served directly at root
│   ├── assets/                   # Optimized production image assets (WebP / PNG)
│   ├── scripts/
│   │   └── carousel.js           # Client-side 3-column auto-sliding carousel engine
│   ├── favicon.ico, .png         # Favicons, apple touch icons, Android icons
│   ├── site.webmanifest          # PWA manifest
│   ├── sitemap.xml               # Static XML sitemap for SEO
│   └── robots.txt                # Search engine crawler instructions
│
├── src/
│   ├── components/               # Reusable Astro UI components
│   │   ├── hero/
│   │   │   ├── PageHero.astro    # Master hero section with gradient masks & CTAs
│   │   │   └── HeroBenefitStrip.astro # 3-pillar benefit strip
│   │   ├── Button.astro          # Reusable styled button
│   │   ├── CardCarousel.astro    # Accessible auto-advancing card track
│   │   ├── FaqItem.astro         # Interactive accessible accordion item
│   │   ├── FloatingWhatsApp.astro# Global context-aware floating WhatsApp button
│   │   ├── Footer.astro          # Global site footer
│   │   ├── Header.astro          # Global site header with dropdowns & mobile drawer
│   │   ├── IntroAnimation.astro  # First-visit entrance animation overlay
│   │   ├── Logo.astro            # Master SVG/raster logo component
│   │   ├── SectionHeading.astro  # Standardised section header
│   │   └── WhatsAppCTA.astro     # In-page WhatsApp consultation buttons
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro      # Master HTML document layout (head, meta, schema, fonts)
│   │
│   ├── pages/                    # 32 Canonical routes + dynamic resource routes
│   │   ├── index.astro           # 1. Homepage (/)
│   │   ├── trademark-registration/ # 2. Trademark Registration (/trademark-registration/)
│   │   ├── services/             # 3. Services Hub (/services/)
│   │   ├── packages/             # 4. Packages Hub (/packages/)
│   │   │   ├── individual-msme/  # 19. Individual / MSME Trademark Package
│   │   │   ├── company-llp/      # 20. Company / LLP Trademark Package
│   │   │   ├── food-brand/       # 21. Food Brand Package
│   │   │   └── gulf-return-business/ # 22. Gulf Return Business Package
│   │   ├── about/                # 5. About BRNDNUR (/about/)
│   │   ├── how-it-works/         # 6. How It Works (/how-it-works/)
│   │   ├── faqs/                 # 7. Central FAQs Hub (/faqs/)
│   │   ├── contact/              # 8. Contact & Consultation (/contact/)
│   │   ├── trademark-classes/    # 9. Trademark Classes (/trademark-classes/)
│   │   ├── brand-name-search/    # 10. Brand Name Search (/brand-name-search/)
│   │   ├── wordmark-registration/ # 11. Wordmark Registration (/wordmark-registration/)
│   │   ├── logo-trademark-registration/ # 12. Logo Trademark Registration
│   │   ├── trademark-renewal/    # 13. Trademark Renewal (/trademark-renewal/)
│   │   ├── trademark-monitoring/ # 14. Trademark Monitoring (/trademark-monitoring/)
│   │   ├── gst-registration/     # 15. GST Registration Assistance
│   │   ├── udyam-msme-registration/ # 16. Udyam / MSME Registration
│   │   ├── fssai-registration/   # 17. FSSAI Registration Assistance
│   │   ├── business-setup/       # 18. Business Setup Advisory
│   │   ├── resources/            # 23. Resources / Blog Hub (/resources/)
│   │   │   ├── trademark-registration-guide/ # 24. Trademark Registration Guide
│   │   │   ├── trademark-class-guide/        # 25. Trademark Class Guide
│   │   │   ├── brand-name-search-guide/      # 26. Brand Name Search Guide
│   │   │   ├── trademark-application-process/ # 27. Trademark Application Process Guide
│   │   │   ├── [slug].astro      # Dynamic localized resource guides (/resources/:slug/)
│   │   │   └── preview/[slug].astro # Draft preview engine
│   │   ├── privacy-policy/       # 28. Privacy Policy (/privacy-policy/)
│   │   ├── terms-and-conditions/ # 29. Terms & Conditions (/terms-and-conditions/)
│   │   ├── refund-cancellation-policy/ # 30. Refund & Cancellation Policy
│   │   ├── disclaimer/           # 31. Disclaimer (/disclaimer/)
│   │   └── 404.astro             # 32. Custom 404 Error Page (/404.html)
│   │
│   ├── styles/
│   │   ├── tokens.css            # Single source of truth for design tokens
│   │   └── global.css            # Global CSS, base resets, fluid typography, utilities
│   │
│   └── utils/
│       ├── blog.ts               # Markdown article loader & parser
│       └── whatsapp.ts           # Type-safe, context-aware WhatsApp URL generation
│
├── content/                      # 54 localized Markdown resource articles
├── assets/                       # High-resolution master source images (do not delete)
├── logo/                         # Master logo source files (PNG with transparent background)
├── 78 IMAGES/                    # Prompt asset generation reference collection
├── tests/                        # Automated testing suites & verification scripts
├── scripts/                      # Engineering diagnostics & measurement scripts
├── docs/                         # Engineering documentation & guides
├── astro.config.mjs              # Astro configuration
├── tailwind.config.mjs           # Tailwind configuration (preflight: false)
└── tsconfig.json                 # TypeScript configuration
```

---

## 2. Canonical Route to File Mapping

| No. | Canonical Route | Astro Source File | Output Path |
| :---: | :--- | :--- | :--- |
| **1** | `/` | `src/pages/index.astro` | `dist/index.html` |
| **2** | `/trademark-registration/` | `src/pages/trademark-registration/index.astro` | `dist/trademark-registration/index.html` |
| **3** | `/services/` | `src/pages/services/index.astro` | `dist/services/index.html` |
| **4** | `/packages/` | `src/pages/packages/index.astro` | `dist/packages/index.html` |
| **5** | `/about/` | `src/pages/about/index.astro` | `dist/about/index.html` |
| **6** | `/how-it-works/` | `src/pages/how-it-works/index.astro` | `dist/how-it-works/index.html` |
| **7** | `/faqs/` | `src/pages/faqs/index.astro` | `dist/faqs/index.html` |
| **8** | `/contact/` | `src/pages/contact/index.astro` | `dist/contact/index.html` |
| **9** | `/trademark-classes/` | `src/pages/trademark-classes/index.astro` | `dist/trademark-classes/index.html` |
| **10** | `/brand-name-search/` | `src/pages/brand-name-search/index.astro` | `dist/brand-name-search/index.html` |
| **11** | `/wordmark-registration/` | `src/pages/wordmark-registration/index.astro` | `dist/wordmark-registration/index.html` |
| **12** | `/logo-trademark-registration/` | `src/pages/logo-trademark-registration/index.astro` | `dist/logo-trademark-registration/index.html` |
| **13** | `/trademark-renewal/` | `src/pages/trademark-renewal/index.astro` | `dist/trademark-renewal/index.html` |
| **14** | `/trademark-monitoring/` | `src/pages/trademark-monitoring/index.astro` | `dist/trademark-monitoring/index.html` |
| **15** | `/gst-registration/` | `src/pages/gst-registration/index.astro` | `dist/gst-registration/index.html` |
| **16** | `/udyam-msme-registration/` | `src/pages/udyam-msme-registration/index.astro` | `dist/udyam-msme-registration/index.html` |
| **17** | `/fssai-registration/` | `src/pages/fssai-registration/index.astro` | `dist/fssai-registration/index.html` |
| **18** | `/business-setup/` | `src/pages/business-setup/index.astro` | `dist/business-setup/index.html` |
| **19** | `/packages/individual-msme/` | `src/pages/packages/individual-msme/index.astro` | `dist/packages/individual-msme/index.html` |
| **20** | `/packages/company-llp/` | `src/pages/packages/company-llp/index.astro` | `dist/packages/company-llp/index.html` |
| **21** | `/packages/food-brand/` | `src/pages/packages/food-brand/index.astro` | `dist/packages/food-brand/index.html` |
| **22** | `/packages/gulf-return-business/` | `src/pages/packages/gulf-return-business/index.astro` | `dist/packages/gulf-return-business/index.html` |
| **23** | `/resources/` | `src/pages/resources/index.astro` | `dist/resources/index.html` |
| **24** | `/resources/trademark-registration-guide/` | `src/pages/resources/trademark-registration-guide/index.astro` | `dist/resources/trademark-registration-guide/index.html` |
| **25** | `/resources/trademark-class-guide/` | `src/pages/resources/trademark-class-guide/index.astro` | `dist/resources/trademark-class-guide/index.html` |
| **26** | `/resources/brand-name-search-guide/` | `src/pages/resources/brand-name-search-guide/index.astro` | `dist/resources/brand-name-search-guide/index.html` |
| **27** | `/resources/trademark-application-process/` | `src/pages/resources/trademark-application-process/index.astro` | `dist/resources/trademark-application-process/index.html` |
| **28** | `/privacy-policy/` | `src/pages/privacy-policy/index.astro` | `dist/privacy-policy/index.html` |
| **29** | `/terms-and-conditions/` | `src/pages/terms-and-conditions/index.astro` | `dist/terms-and-conditions/index.html` |
| **30** | `/refund-cancellation-policy/` | `src/pages/refund-cancellation-policy/index.astro` | `dist/refund-cancellation-policy/index.html` |
| **31** | `/disclaimer/` | `src/pages/disclaimer/index.astro` | `dist/disclaimer/index.html` |
| **32** | `/404.html` | `src/pages/404.astro` | `dist/404.html` |

---

## 3. Key Architecture Principles

1. **Static Output (SSG):** All pages generate into self-contained HTML files (`folder/index.html`), ensuring instantaneous load times, zero runtime server dependencies, and perfect static hosting on Hostinger.
2. **Zero Preflight Interference:** Tailwind CSS is enabled with `preflight: false` in `astro.config.mjs` and `tailwind.config.mjs`. This preserves our exact CSS design tokens, line-heights, and responsive typography without Tailwind overriding browser defaults unexpectedly.
3. **Pure DM Sans Typography:** Every heading, body copy, navigation link, form input, and button is bound to `--sans: "DM Sans", ...`.
4. **Contextual WhatsApp Tracking:** WhatsApp CTA clicks route through `src/utils/whatsapp.ts`, sending a pre-filled, professional message detailing the specific page and service to `+91 90481 88899`.
