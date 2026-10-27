# BRNDNUR Advisory LLP — Testing & Quality Assurance Guide

This guide details all automated test suites, testing workflows, Playwright browser automation, and pass/fail criteria.

---

## 1. Quick Test Execution

Run test commands from the repository root:

```bash
# 1. Master site audit (all 32 canonical routes + 9 audit phases)
npm test

# 2. Universal 5-second slider & carousel autoplay verification
npm run test:autoplay

# 3. Complete 32-route typography & layout scan (2,700+ elements)
npm run test:typography

# 4. Full browser interaction and responsive matrix suite
npm run test:e2e

# 5. TypeScript and Astro template static check
npm run check
```

---

## 2. Test Suite Details

### A. Master Audit Suite (`tests/audit_master_suite.mjs`)
- **Execution:** `npm test` or `node tests/audit_master_suite.mjs`
- **Scope:** Verifies the compiled `dist/` directory served on preview or local static server.
- **Phases:**
  1. **Canonical Route Coverage:** Loops through all 32 canonical routes, asserting HTTP 200, exactly one `<h1>`, `<header class="bn-header">`, `<footer>`, and valid JSON-LD.
  2. **SEO Uniqueness:** Verifies that no two routes share identical `<title>` or `<meta name="description">` tags.
  3. **Asset & Image Health:** Decodes all images in the DOM, asserting `naturalWidth > 0` and HTTP 200.
  4. **Design Requirements:** Checks brand tokens (`#F4EFE4`, `#13233A`, `#A8781A`), Why BRNDNUR 1:1 image ratio, hero gradient stops (40%–55%), and animated navbar underline.
  5. **FAQ Page & Accordion:** Confirms exactly 30 FAQ items on `/faqs/` and tests interactive expand/collapse clicks.
  6. **Card Carousels:** Confirms 5000ms intervals, pagination dots, and navigation buttons.
  7. **Intro Animation:** Asserts overlay presence on first visit, dismissal on skip click, session storage persistence, and bypass on repeat visits.
  8. **Contact Form & Conversions:** Checks input names, types, and required attributes on `/contact/`.
  9. **Mobile Navigation Drawer:** Simulates hamburger toggle clicks, testing ARIA states and CSS classes.
  10. **Statutory Compliance:** Checks ₹4,500/₹9,000 fee separation, Trade Marks Act 1999 mentions, and absence of misleading registration guarantees.

### B. Universal 5-Second Autoplay Suite (`tests/verify_5s_autoplay_all_sliders.mjs`)
- **Execution:** `npm run test:autoplay`
- **Scope:** Time-sensitive Playwright verification of automatic advancement across viewports:
  - **3.5s Wait:** Confirms carousel has NOT moved prematurely.
  - **5.5s Wait:** Confirms carousel HAS moved smoothly.
  - **Hover Pause:** Hovers cursor for 6s; asserts track remains static.
  - **Focus Pause:** Focuses interactive link inside track for 6s; asserts track remains static.
  - **Mobile 390px & Tablet 768px:** Asserts auto-sliding on touch-enabled viewports.
  - **Reduced Motion:** Launches browser with `reducedMotion: 'reduce'`; asserts 0px movement over 6s.

### C. Typography Audit Suite (`scripts/audit_32_routes_typography.mjs`)
- **Execution:** `npm run test:typography`
- **Scope:** Inspects computed CSS properties of all headings (`h1`–`h6`), paragraphs, labels, eyebrows, buttons, inputs, textareas, and card titles across all 32 pages.
- **Assertion:** `fontFamily` must strictly include `"DM Sans"`. Asserts `document.documentElement.scrollWidth <= window.innerWidth` (zero horizontal overflow).

---

## 3. How to Interpret Failures & Debug

1. **Failure: `Broken images: X`**
   - Check the terminal output for the broken URL.
   - Verify that the image exists in `public/assets/` and was copied to `dist/assets/`.
   - Ensure the image path begins with `/assets/` and has no typos.

2. **Failure: `Mobile horizontal overflow: Xpx`**
   - Run `node scripts/detect_overflow.mjs` to identify the exact DOM node exceeding the viewport.
   - Inspect for unconstrained widths (`width: 600px` without `max-width: 100%`) or negative margins.

3. **Failure: `Non-DM Sans heading detected`**
   - Search the target page for explicit `font-family` declarations in `<style>` blocks.
   - Remove hardcoded fonts and replace with `var(--sans)` or remove the declaration so it inherits the global default.
