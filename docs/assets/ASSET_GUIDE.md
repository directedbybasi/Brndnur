# BRNDNUR Advisory LLP — Asset Management Guide & Catalogue

This guide documents asset naming conventions, directory structure, master source files, and runtime production assets.

---

## 1. Asset Storage Boundaries

To protect high-resolution source materials from being accidentally overwritten or deleted, the repository maintains a strict separation:

| Directory | Purpose | Retention Policy | Served to Users? |
| :--- | :--- | :--- | :---: |
| `public/assets/` | **Production Web Assets:** Optimized WebP/PNG files referenced in Astro markup and CSS. | Actively maintained; build copies to `dist/assets/`. | **Yes** |
| `logo/` (root) | **Master Brand Logos:** Original high-res source PNGs (`BRNDNUR Shield Brand Logo.png`). | **Permanent master source; NEVER delete.** | No |
| `assets/` (root) | **High-Res Source Masters:** Original uncompressed photographic assets (PNG/JPG). | **Permanent source archive; NEVER delete.** | No |
| `78 IMAGES/` (root) | **Prompt Reference Library:** Full initial generation assets mapped to prompts. | **Permanent reference archive; NEVER delete.** | No |

---

## 2. Naming Conventions & Aspect Ratios

- **Format:** Modern `.webp` is used for all photographic images; `.png` with alpha transparency is reserved for logos and vector marks.
- **Naming Pattern:** `[section-or-cluster]-[descriptor]-[optional-ratio].webp`
  - Examples: `hero-brand-desk.webp`, `audience-first-time-founders.webp`, `classes-avoid-overfiling.webp`
- **Standard Ratios:**
  - **Hero Desktop Images:** `16:9` or widescreen (~1200x675px) with right-aligned subject framing for gradient masks.
  - **Mobile Content Images:** `3:4` portrait aspect ratio on mobile screens (< 768px) with `object-fit: cover`.
  - **Brand & Why Us Images:** `1:1` square aspect ratio (e.g. `services-why-brndnur.webp`, 520x520px).
  - **Checklist & Prep Cards:** `16:9` widescreen ratio on preparation cards.

---

## 3. Production Asset Catalogue

| Asset Filename | Dimensions | Format | Intended Page / Section | Transparency | Alt Text Status |
| :--- | :---: | :---: | :--- | :---: | :--- |
| `brndnur-logo-transparent.png` | `512x512` | PNG | Header, Footer, Intro Animation | Required | Meaningful: "BRNDNUR Advisory LLP" |
| `brndnur-logo-background.webp` | `1024x1024` | WebP | Social sharing, Open Graph previews | No | Decorative brand mark |
| `brndnur-og-banner.jpg` | `1200x630` | JPG | Global Open Graph & Twitter Card banner | No | Meta preview |
| `hero-brand-desk.webp` | `1200x675` | WebP | Homepage Hero Section 1 | No | Minimalist executive desk with laptop and documents |
| `hero-brand-desk-mobile.webp` | `800x600` | WebP | Homepage Hero (Mobile Viewport) | No | Compact desk layout optimized for narrow screens |
| `audience-first-time-founders.webp` | `1200x675` | WebP | Homepage Section 5 (Founders Card) | No | Modern entrepreneur desk with notebook and brass pen |
| `audience-food-brands.webp` | `1200x675` | WebP | Homepage Section 5 (Food Brands Card) | No | Artisanal food products and gourmet packaging |
| `audience-growing-businesses.webp`| `1200x675` | WebP | Homepage Section 5 (Growing Businesses) | No | Professional corporate workspace and brand stationery |
| `audience-gulf-return.webp` | `1200x675` | WebP | Homepage Section 5 (Gulf Return Card) | No | Cross-border enterprise consultation materials |
| `prep-card-applicant.webp` | `640x360` | WebP | Homepage Section 7 (Checklist Card 1) | No | Applicant identity and business registration documents |
| `prep-card-brand-logo.webp` | `640x360` | WebP | Homepage Section 7 (Checklist Card 2) | No | Brand mark artwork and vector logo representations |
| `prep-card-products.webp` | `640x360` | WebP | Homepage Section 7 (Checklist Card 3) | No | Product line inventory and goods classification list |
| `prep-card-existing-tm.webp` | `640x360` | WebP | Homepage Section 7 (Checklist Card 4) | No | Prior trademark usage records and commercial evidence |
| `prep-card-deadlines.webp` | `640x360` | WebP | Homepage Section 7 (Checklist Card 5) | No | Statutory filing calendar and opposition deadlines |
| `prep-card-business-info.webp` | `640x360` | WebP | Homepage Section 7 (Checklist Card 6) | No | Legal entity formation and tax registration documents |
| `services-why-brndnur.webp` | `520x520` | WebP | Services Hub (`/services/`) Why Choose Us | No | Advisory consultation on warm ivory background |
| `about-values-integrity.webp` | `520x520` | WebP | About Us (`/about/`) Integrity Section | No | Advisory team working across legal documentation |
| `tm-hero-protection.webp` | `1200x675` | WebP | Trademark Registration Hero | No | Intellectual property documentation and legal certificate |
| `tm-benefits-foundation.webp` | `800x600` | WebP | Trademark Registration Core Values | No | Commercial foundation and exclusive brand ownership |
| `tm-process-path.webp` | `800x600` | WebP | Trademark Registration Step Journey | No | Step-by-step roadmap from search to registration |
| `tm-support-steps.webp` | `800x600` | WebP | Trademark Registration Support Workflow | No | Professional guidance through official objections |
| `tm-faq-advisory.webp` | `800x600` | WebP | Trademark Registration FAQs Section | No | Consultation session clarifying registry queries |
| `pkg-food-compliance.webp` | `800x600` | WebP | Food Brand Package Detail Page | No | Packaged organic food products with statutory labels |
| `pkg-gulf-commercial.webp` | `800x600` | WebP | Gulf Return Package Detail Page | No | Cross-border Gulf to Kerala commercial venture setup |
| `contact-hero-consultation.webp` | `1200x675` | WebP | Contact Us Page Hero | No | Welcoming advisory consultation desk in Manjeri |
| `fssai-hero-food-safety.webp` | `1200x675` | WebP | FSSAI Registration Page Hero | No | Food quality assurance and hygiene certification |
| `udyam-hero-certificate.webp` | `1200x675` | WebP | Udyam MSME Registration Hero | No | MSME manufacturing and enterprise documentation |
| `setup-hero-foundations.webp` | `1200x675` | WebP | Business Setup Advisory Hero | No | Startup launch roadmap and enterprise legal structures |
| `renewal-hero-timeline.webp` | `1200x675` | WebP | Trademark Renewal Hero | No | Ten-year renewal statutory timeline and registry ledger |
| `monitoring-hero-watch.webp` | `1200x675` | WebP | Trademark Monitoring Hero | No | Continuous Trademark Journal surveillance desk |
| `wordmark-hero-typography.webp` | `1200x675` | WebP | Wordmark Registration Hero | No | Distinctive typographic brand lettering and styling |
| `logo-hero-branding.webp` | `1200x675` | WebP | Logo Trademark Registration Hero | No | Visual insignia, device marks, and brand logos |

---

## 4. How to Safely Add or Update an Asset

1. Save the high-resolution uncompressed original into `assets/` (root) for permanent record.
2. Generate an optimized WebP derivative at the target display size using standard compression (82–85% quality).
3. Place the derivative into `public/assets/`.
4. Reference the asset via root-relative path `/assets/[filename].webp`.
5. Always supply descriptive `alt` text in the component (unless purely decorative, in which case use `alt=""` and `aria-hidden="true"`).
6. Run `npm run test` to verify zero broken image references.
