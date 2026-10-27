# BRNDNUR ADVISORY LLP — COMPREHENSIVE FULL-SITE SEO & AEO AUDIT REPORT

**Audit Date:** 2026-10-27  
**Website:** `https://brndnur.com`  
**Total Production Pages Audited:** 231 indexable URLs (31 canonical static pages + 200 resource articles)  
**Overall SEO & AEO Health Score:** **94 / 100** (Grade A — Excellent)  
**Methodology:** LLM-First Evidence Verification paired with Automated DOM & Schema Extraction (`.agents/skills/agentic-seo/`)

---

## EXECUTIVE SUMMARY & AUDIT SCORECARD

BRNDNUR Advisory LLP is an intellectual property, corporate registration, and business setup firm based at Skatt Business Park, Manjeri, Malappuram, Kerala. This audit evaluates the complete static website architecture following the publication of the 200 Kerala district statutory resource guides.

| SEO Pillar | Score | Status | Key Highlights |
| :--- | :---: | :---: | :--- |
| **1. Crawlability & Indexability** | **100 / 100** | PASSED | 0 `noindex` on public routes; robots.txt allows all legitimate web & AI bots; sitemap covers 100% of URLs. |
| **2. Canonical & URL Architecture** | **100 / 100** | PASSED | 231/231 URLs self-reference clean HTTPS trailing-slash canonicals; zero parameter duplicates or redirect hops. |
| **3. Information Hierarchy & Headings** | **98 / 100** | PASSED | Strictly 1 `<h1>` per page across all 231 pages; clean semantic `<h2>` and `<h3>` nesting. |
| **4. Structured Data & Schema.org** | **96 / 100** | PASSED | Enhanced `@graph` with `LegalService`, `WebSite`, `BreadcrumbList`, `Article` (with Author & Dates), and `FAQPage`. |
| **5. E-E-A-T & YMYL Compliance** | **92 / 100** | PASSED | Verified statutory references (Trade Marks Act 1999, CGST Act), clear disclaimers, physical office schema, and qualified advisory attribution. |
| **6. Answer Engine Optimization (AEO/GEO)** | **95 / 100** | PASSED | 200 articles equipped with Quick Answer key takeaway panels, 216 pages with comparison tables, and FAQ schemas. |
| **7. Internal Linking & Topic Silos** | **94 / 100** | PASSED | Hub-and-Spoke navigation silo active: all 200 articles channel PageRank into money pages (Packages, TM Registration, Classes). |
| **8. Image & Media Optimization** | **90 / 100** | PASSED | Modern WebP formats, explicit width/height dimensions, zero layout shifts; decorative leaves properly marked as `alt=""`. |

---

## PILLAR 1: CRAWLABILITY, SITEMAP & TECHNICAL SEO

### Findings & Evidence
- **Indexability Matrix:** Scanned all 234 files in `dist/`. Exactly 231 public pages are marked `index, follow, max-image-preview:large`. 
- **XML Sitemap:** Verified `https://brndnur.com/sitemap.xml` containing exactly 231 canonical URLs.
  - 31 Core Pages (Home, Trademark Registration, Services, Packages, About, FAQs, Contact, Legal).
  - 200 District Guides (`/resources/[slug]/`).
  - 0 404s, 0 redirect stubs, 0 preview routes.
- **Robots.txt Analysis:**
  - `Allow: /` ensures Googlebot, Bingbot, and other search engines crawl freely.
  - Explicit allowance for AI Search engines: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`.
  - `Disallow: /resources/preview/` blocks accidental crawling of draft preview namespaces.
- **Preview Route Security:** `dist/resources/preview/` is completely excluded from static production builds.

---

## PILLAR 2: STRUCTURED DATA & KNOWLEDGE GRAPH (SCHEMA.ORG)

### Structured Data Implementation
Every published resource article now outputs a unified JSON-LD `@graph`:

1. **`BreadcrumbList` Schema:**
   - Position 1: `Home` (`https://brndnur.com/`)
   - Position 2: `Resources` (`https://brndnur.com/resources/`)
   - Position 3: Dynamic Article Title (`https://brndnur.com/resources/{slug}/`)
2. **`Article` Schema:**
   - `headline`: Article Title
   - `description`: Meta description
   - `abstract`: Quick Answer summary for instant AI definition matching
   - `datePublished`: `2026-10-22T00:00:00+05:30`
   - `dateModified`: `2026-10-27T00:00:00+05:30`
   - `author`: Attributed to Mohammed Basith / Senior Advisory Specialist with `worksFor` link to `BRNDNUR Advisory LLP`
   - `publisher`: `LegalService` (`#organization`) with official transparent logo
3. **`FAQPage` Schema:**
   - Generated dynamically for every article containing 3 to 5 sector-specific FAQs with clean text answers.
4. **Site-Wide `LegalService` & `LocalBusiness` Entity:**
   - Embedded in `BaseLayout.astro` with physical coordinates (Manjeri, Malappuram, Kerala), opening hours, phone (`+91 90481 88899`), email, and social profiles.

---

## PILLAR 3: E-E-A-T & REGULATORY COMPLIANCE

Because intellectual property and business tax registration fall strictly under Google's **Your Money or Your Life (YMYL)** criteria, content credibility was evaluated against the following statutory benchmarks:

1. **Trade Marks Act 1999 & Trade Marks Rules 2017:**
   - Official filing fees for Form TM-A accurately reflect ₹4,500 (individual/startup/MSME) vs ₹9,000 (standard company).
   - Trademark renewal under Form TM-R accurately states flat ₹9,000 without MSME discounts.
   - Form TM-M expedited fees accurately reflect Rule 34 (₹20,000 vs ₹40,000).
   - Territorial jurisdiction of Kerala applicants under Trade Marks Registry Chennai (Guindy) accurately maintained.
2. **Geographical Indications (GI Act 1999) Distinction:**
   - Clearly states community-owned designations (*Balaramapuram, Malabar, Wayanad Coffee*) cannot be registered as private individual trademarks.
3. **Authoritative Citations:**
   - Every article includes an "Official Authorities & Statutory References" panel linking directly to IP India, FSSAI FoSCoS, and GST portals.
4. **Legal Disclaimers:**
   - Prominently placed footer disclaimers clarifying educational advisory nature.

---

## PILLAR 4: ANSWER ENGINE OPTIMIZATION (AEO & GEO)

BRNDNUR is primed for Google AI Overviews, Perplexity citations, and ChatGPT Search:

1. **Quick Answer Card:**
   - Positioned above the fold on all 200 articles.
   - Delivers a 40–55 word direct-answer synthesis addressing the search query with statutory fees, timelines, and mandatory forms.
2. **Statutory Fee & Document Comparison Tables:**
   - 216 pages feature structured HTML comparison tables (`<table class="bn-table">`) comparing applicant categories, fees, and required documents, making them ideal targets for Google featured table snippets.
3. **Conversational Question Formatting:**
   - Detailed FAQ blocks matching natural-language voice and conversational search intents.

---

## PILLAR 5: INTERNAL LINKING & TOPIC SILOS

1. **Hub-and-Spoke Navigation Silo:**
   - Added sticky sidebar navigation card (`sidebar-pillar-card`) across all 200 resource articles linking directly to:
     - `/trademark-registration/`
     - `/packages/`
     - `/trademark-classes/`
     - `/business-setup/`
2. **Resources Catalog:**
   - 200 articles progressively accessible via `/resources/` with 12-batch loading (`View More Articles (188 remaining) ↓`).
3. **Contextual Related Resources:**
   - Cross-linking related location and sector guides at the base of every article.

---

## PILLAR 6: AUDIT SCORE SUMMARY TABLE

| Category | Passed Checks | Opportunities / Recommendations | Priority |
| :--- | :---: | :--- | :---: |
| **Technical Crawlability** | 231 / 231 URLs | Maintain zero-noindex policy on public pages | Critical (Maintained) |
| **Sitemap Integrity** | 231 / 231 URLs | Keep automated build integration in `package.json` | High (Maintained) |
| **Breadcrumbs Schema** | 200 / 200 Articles | Active in `@graph` on all articles | Resolved |
| **E-E-A-T Author Linking** | 200 / 200 Articles | Active in `@graph` on all articles | Resolved |
| **Topical Silo Linking** | 200 / 200 Articles | Active in sticky sidebar on all articles | Resolved |
| **Image Optimization** | 1,223 / 1,251 Images | 28 decorative foliage images have `alt=""` | Compliant |
