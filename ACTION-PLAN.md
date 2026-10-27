# BRNDNUR ADVISORY LLP — SEO & AEO ACTION PLAN

**Status:** High-Priority Code Enhancements Implemented & Verified in Production Build  
**Scope:** 231 Public Pages + 200 Published Resource Articles  
**Target:** Organic Search Dominance across Kerala IP/Business Queries & AI Overviews (Perplexity, ChatGPT, Google)

---

## PRIORITY ROADMAP

| Priority | Task Description | Impact | Effort | Implementation Status |
| :---: | :--- | :---: | :---: | :---: |
| **P0** | **BreadcrumbList Schema Generation:** Embed BreadcrumbList in JSON-LD on all 200 resource articles | High | Low | **COMPLETED & VERIFIED** |
| **P0** | **E-E-A-T Author & Publisher Schema:** Add Author (Person), DatePublished, DateModified, and LegalService publisher | High | Low | **COMPLETED & VERIFIED** |
| **P0** | **Zero-Noindex Public Enforcement:** Ensure all 200 articles remain `index, follow` without preview leakage | Critical | Low | **COMPLETED & VERIFIED** |
| **P1** | **Hub-and-Spoke Navigation Silos:** Sticky sidebar links on all 200 articles pointing to core money pages | High | Medium | **COMPLETED & VERIFIED** |
| **P1** | **AEO Quick Answer Schema Alignment:** Integrate `abstract` property into Article schema from `quickAnswer` | High | Low | **COMPLETED & VERIFIED** |
| **P1** | **Automated Sitemap Pipeline:** Dynamic sitemap generation during `npm run build` covering all 231 URLs | High | Low | **COMPLETED & VERIFIED** |
| **P2** | **Google Business Profile Alignment:** Ensure local citations (Manjeri, Malappuram, Kerala) mirror schema | Medium | Medium | Ready for Production Launch |
| **P2** | **External Authority Backlinks:** Secure directory listings on Kerala Startup Mission, K-BIP, and MSME forums | Medium | Ongoing | Post-Launch Task |

---

## 1. COMPLETED P0 ENHANCEMENTS (VERIFIED IN `dist/`)

### 1.1 Complete BreadcrumbList Schema on All 200 Articles
- **Location:** `src/pages/resources/[slug].astro`
- **Action:** Injected structured BreadcrumbList into `@graph` with 3-tier hierarchy (`Home` &rarr; `Resources` &rarr; Article Title).
- **Result:** Resolves Google Search Console missing breadcrumbs warning; activates visual breadcrumb snippets in search engine results.

### 1.2 E-E-A-T Authorship & Freshness Metadata
- **Location:** `src/pages/resources/[slug].astro`
- **Action:** Added `author` (`Person` with `worksFor` linking to `BRNDNUR Advisory LLP`), `datePublished`, `dateModified`, and `publisher` with official transparent logo.
- **Result:** Satisfies Google's YMYL (Your Money or Your Life) content trust guidelines.

### 1.3 Hub-and-Spoke Topical Authority Silo
- **Location:** `src/components/ArticleDetail.astro`
- **Action:** Added `.sidebar-pillar-card` inside `.sidebar-sticky-wrapper` linking every article directly to:
  - `/trademark-registration/` (Core trademark filing service)
  - `/packages/` (Fixed-fee commercial packages)
  - `/trademark-classes/` (Nice classification database)
  - `/business-setup/` (Kerala startup and entity registration)
- **Result:** Channels internal PageRank and organic authority directly from long-tail district articles to primary revenue-generating pages.

---

## 2. ONGOING RECOMMENDATIONS (POST-LAUNCH)

1. **Google Search Console (GSC) Setup:**
   - Submit `https://brndnur.com/sitemap.xml`.
   - Monitor indexation coverage for all 231 URLs.
2. **Local Google Business Profile (GBP):**
   - Verify listing at Skatt Business Park, Manjeri, Malappuram, Kerala with identical phone (`+91 90481 88899`) and category (`Legal Service / Business Advisory`).
3. **AI Search Citation Tracking:**
   - Monitor citations in Google AI Overviews and Perplexity for Kerala-specific trademark queries (e.g., *"How much does trademark registration cost for an MSME in Kerala?"*).
