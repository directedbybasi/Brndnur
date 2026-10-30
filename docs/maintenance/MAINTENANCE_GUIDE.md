# BRNDNUR Advisory LLP — Long-Term Maintenance Guide

This guide is written for any engineer returning to this project after 3, 6, or 12 months. It provides actionable, step-by-step instructions for safely maintaining, extending, and upgrading the website without causing regressions.

---

## 1. Returning to the Codebase After a Long Break

### Step 1: Check Current State
```bash
git status --short
git branch
git log -n 5 --oneline
```
Never run destructive cleanup commands like `git reset --hard` or `git clean -fd`. Identify any uncommitted work first.

### Step 2: Install Dependencies
Ensure you are using Node.js v18.17+ or v20+.
```bash
npm install
```

### Step 3: Run Baseline Verification
Before writing any code, run the master audit suite to confirm the baseline is passing:
```bash
npm run build
npm test
```
All 32 routes should return 200 with 0 broken links and 0 errors.

---

## 2. How to Add a New Page

All 32 canonical routes are established. If adding a new route (e.g. `/services/patent-search/`):

1. **Create the Astro Page File:**
   Create `src/pages/services/patent-search/index.astro`.
2. **Import Required Layout & Components:**
   ```astro
   ---
   import BaseLayout from '../../../layouts/BaseLayout.astro';
   import PageHero from '../../../components/hero/PageHero.astro';
   import SectionHeading from '../../../components/SectionHeading.astro';
   ---

   <BaseLayout
     title="Patent Search Services | BRNDNUR Advisory LLP"
     description="Professional patent clearance and search guidance for Kerala enterprises."
     canonical="https://brndnur.com/services/patent-search/"
     currentPath="/services/patent-search/"
   >
     <main id="main-content">
       <PageHero ... />
       <!-- Page sections -->
     </main>
   </BaseLayout>
   ```
3. **Add Route to Sitemap:**
   Update `public/sitemap.xml` with the new URL and modification date.
4. **Update Navigation:**
   If the page belongs in the main header dropdown, add the link to `src/components/Header.astro`.
5. **Run Verification:**
   Run `npm run build && npm test` to verify zero broken links and valid schema.

---

## 3. How to Add a Resource or Blog Article

The website supports dynamic localized guides in `content/` rendered via `src/pages/resources/[slug].astro`:

1. Create a new markdown file in `content/` (e.g. `content/trademark-registration-for-cafes-in-kozhikode.md`).
2. Follow the established frontmatter structure:
   ```markdown
   ---
   id: "KL-055"
   title: "Trademark Registration for Cafes in Kozhikode"
   slug: "trademark-registration-for-cafes-in-kozhikode"
   district: "Kozhikode"
   status: "published"
   metaTitle: "Cafe Brand Protection Guide | Kozhikode | BRNDNUR"
   metaDescription: "Step-by-step trademark class 43 and food brand advisory for Kozhikode cafe founders."
   ---
   ```
3. Run `npm run build`. The dynamic route generator will automatically create `/resources/trademark-registration-for-cafes-in-kozhikode/index.html`.

---

## 4. How to Modify Styles Safely

### Single Source of Truth: Design Tokens
Never write ad-hoc hex colors or hardcoded font declarations. Always use the tokens in [src/styles/tokens.css](file:///c:/Users/user/Downloads/BRNDNUR-Website-/BRNDNUR-Website%201/src/styles/tokens.css):

- Backgrounds: `var(--ivory)` (`#F4EFE4`), `var(--ivory-soft)` (`#F8F4EB`), `var(--white)` (`#FFFCF6`)
- Inks: `var(--navy)` (`#13233A`), `var(--navy-deep)` (`#0C1C2C`), `var(--body)` (`#334155`)
- Accents: `var(--gold)` (`#A8781A`), `var(--gold-dark)` (`#8F6214`), `var(--gold-pale)` (`#F0E2C8`)
- Typography: Always `var(--sans)` (`"DM Sans", sans-serif`). Do NOT declare serif fonts!

### Avoiding Global Regressions
- Global styling lives in `src/styles/global.css`.
- Page-specific styling should be scoped inside `<style>` blocks in the respective `.astro` file.
- Astro automatically scopes styles in `<style>` blocks, protecting other pages from unwanted side-effects.

---

## 5. Non-Negotiable Project Invariants

When maintaining or updating this project, the following core invariants must be protected:

1. **Approved Homepage Visual Design:**
   `src/pages/index.astro` is the approved visual foundation. Do not reorder sections, change hero imagery, alter typography, or rewrite approved copy.
2. **Statutory Legal Compliance & Fee Separation:**
   Government fees (₹4,500 for Individual/MSME, ₹9,000 for Company/LLP) must remain explicitly separated from BRNDNUR professional advisory fees. Never guarantee trademark registration.
3. **Pure DM Sans Typography:**
   All headings and body copy across all pages must use `"DM Sans"`.
4. **Universal 5-Second Autoplay:**
   All card tracks, carousels, and image sliders must advance every `5000ms`, with hover/focus pause enabled and reduced-motion respected.
5. **Verified Contact Details:**
   Official office: *Skatt Business Park, Manjeri, Malappuram - 676121*. Phone: `+91 90481 88899`. Email: `brndnuradvisoryllp@gmail.com`.
