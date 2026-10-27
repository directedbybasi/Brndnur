# BRNDNUR Advisory LLP — Shared Component Guide

This guide details the responsibility, properties, markup contracts, and safe modification practices for every shared component in `src/components/`.

---

## 1. Global Navigation & Layout

### `src/layouts/BaseLayout.astro`
- **Role:** The foundational document wrapper for all 32 pages. Sets HTML `<head>`, canonical URL, preconnects, Open Graph & Twitter meta tags, JSON-LD Schema (Organization, LocalBusiness, LegalService, BreadcrumbList), and site scripts.
- **Props:**
  - `title: string` — Page title tag (including ` | BRNDNUR Advisory LLP`)
  - `description: string` — Meta description (150–160 chars)
  - `canonical: string` — Full canonical URL with trailing slash (e.g. `https://brndnur.com/services/`)
  - `ogImage?: string` — Open Graph banner image (defaults to `/assets/brndnur-og-banner.jpg`)
  - `currentPath?: string` — Active route path for navbar highlighting and WhatsApp context (e.g. `"/services/"`)
  - `robots?: string` — Robots directive (defaults to `"index, follow, max-image-preview:large"`)
  - `hasCustomSchema?: boolean` — Set to true if the page provides its own schema graph
- **Key Inclusions:**
  - Synchronous first-visit intro script (prevents flash of content)
  - Accessible Skip Link (`.skip-link`, WCAG 2.4.1)
  - `<Header />`, `<slot />`, `<Footer />`, `<FloatingWhatsApp />`
  - Inline accordion script and deferred `/scripts/carousel.js`

### `src/components/Header.astro`
- **Role:** Sticky top navigation bar. Includes the brand logo, desktop navigation with dropdowns (Services, Packages, Resources, About), contact CTA, and mobile hamburger drawer.
- **Props:**
  - `currentPath?: string` — Highlights the active navigation item with an animated gold underline.
- **Modifying Links:** To update header links or dropdown items, edit the `<nav class="bn-nav">` markup directly in `Header.astro`.

### `src/components/Footer.astro`
- **Role:** Global multi-column footer rendered on every page.
- **Contents:**
  - Brand identity & tagline ("Light up your brand")
  - Manjeri Malappuram statutory office address
  - Contact links: `+91 90481 88899`, `brndnuradvisoryllp@gmail.com`
  - Column links: Core Services, Package Solutions, Knowledge & Guides, Company & Legal Policies
  - Government fee disclaimer and copyright line.
- **Safe Modifications:** Contact details are static constants. If updating the office address or phone number, ensure `BaseLayout.astro` schema and `src/utils/whatsapp.ts` are updated to match.

### `src/components/Logo.astro`
- **Role:** Brand logo component rendering the official BRNDNUR shield mark and typography.
- **Props:**
  - `class?: string` — Additional CSS classes
  - `tagline?: boolean` — Whether to display the secondary tagline text
- **Asset Sources:** Uses `/assets/brndnur-logo-transparent.png` (or WebP).

---

## 2. Content & Presentation Components

### `src/components/hero/PageHero.astro`
- **Role:** Master hero component used across all dedicated service, package, and guide pages.
- **Props:**
  - `badge?: string` — Gold overline tag (e.g. `"Statutory Brand Protection"`)
  - `title: string` — Main H1 title
  - `highlightTitle?: string` — Gold-highlighted span within title
  - `lead: string` — Supporting introductory text
  - `imageSrc: string` — Hero image path (WebP)
  - `imageAlt: string` — Meaningful accessible alt text
  - `primaryBtnText?: string`, `primaryBtnUrl?: string`
  - `secondaryBtnText?: string`, `secondaryBtnUrl?: string`
- **Design Rule:** On desktop (`>= 1024px`), PageHero automatically applies the approved horizontal gradient mask: fade starts at 40% and reaches 100% opacity at 55%.

### `src/components/hero/HeroBenefitStrip.astro`
- **Role:** 3-pillar benefit strip displayed directly beneath hero sections.
- **Props:**
  - `items: Array<{ title: string; desc: string; icon?: string }>`
- **Design Rule:** 3 equal-width columns on desktop, 1 column on mobile, with gold dividing rules and navy headings.

### `src/components/CardCarousel.astro`
- **Role:** Universal horizontal auto-sliding card track component.
- **Props:**
  - `id?: string` — Unique HTML id attribute (required for multiple carousels)
  - `ariaLabel?: string` — Accessible label for screen readers
  - `autoplayInterval?: number` — Auto-advance interval in milliseconds (defaults to `5000`)
  - `class?: string` — Additional CSS classes (e.g. `"dark-carousel"`)
  - `showDots?: boolean` — Display pagination dots (defaults to `true`)
  - `showArrows?: boolean` — Display prev/next navigation buttons (defaults to `true`)
- **Autoplay Engine:** Powered by `/scripts/carousel.js`. Automatically pauses on hover, focus, touch, tab hidden, and reduced motion.

### `src/components/FaqItem.astro`
- **Role:** Accessible accordion item for FAQ hubs and page-level FAQ sections.
- **Props:**
  - `question: string` — The question text (rendered as `<button class="faq-question">`)
  - `answer: string` — The answer text (supports rich HTML or paragraphs)
  - `isOpen?: boolean` — Initially expanded state (defaults to `false`)
  - `number?: string` — Optional row index number (e.g. `"01"`, `"02"`)

---

## 3. Interactive & Conversion Components

### `src/components/FloatingWhatsApp.astro`
- **Role:** Floating bottom-right WhatsApp consultation widget.
- **Behavior:**
  - Automatically queries `src/utils/whatsapp.ts` for the pre-filled message matching `currentPath`.
  - Accessible tooltip and focus ring.
  - Positioned safely with `z-index: 999` without overlapping mobile navigation or footer links.

### `src/components/WhatsAppCTA.astro`
- **Role:** Contextual in-page WhatsApp button.
- **Props:**
  - `pageName: string`, `sectionName: string`, `enquiryType: string`, `topic: string`
  - `text?: string` — Button text (defaults to `"Chat on WhatsApp"`)
  - `variant?: 'primary' | 'secondary' | 'subtle'`

### `src/components/IntroAnimation.astro`
- **Role:** First-visit entrance animation overlay featuring the BRNDNUR shield logo and tagline.
- **Behavior:**
  - Displays once per session using `sessionStorage.setItem('brndnur_intro_played', 'true')`.
  - Replay query parameter (`?replay=1`) allows testing.
  - Skip button (`#bn-intro-skip`) allows immediate dismissal.
  - Automatically disabled when `prefers-reduced-motion: reduce` is detected.
