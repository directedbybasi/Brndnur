# BRNDNUR — Token-Efficient SEO/AEO Quick Prompts

Use the detailed specification in `BRAIN/14_SEO_AEO_ANTIGRAVITY_MASTER_PROMPT.md` as the contract. Do not paste that whole document into every follow-up. Keep each task scoped to one file or a tightly related group.

## First run — audit only

Open the `BRNDNUR-Website` folder as the Antigravity workspace. Read `AGENTS.md`, `BRAIN/00_START_HERE.md`, `BRAIN/02_DESIGN_SYSTEM.md`, `BRAIN/04_CONTENT_PRICING_AND_TRUST.md`, and the relevant sections of `BRAIN/14_SEO_AEO_ANTIGRAVITY_MASTER_PROMPT.md`.

**Scope:** only `index.html`, `trademark-registration/index.html`, `services/index.html`, `packages/index.html`, shared CSS/JS and required SEO support files. Do not create any other pages or routes.

Perform a read-only audit. Check titles, descriptions, canonical URLs, Open Graph, crawlability, sitemap/robots, image alt text, internal links, local contact consistency, schema opportunities, visible AEO answer quality, accessibility and performance risks. Inspect only relevant files; do not load the whole `.agents` tree. Reuse existing skills. Do not edit yet.

Return a prioritized findings table: issue, evidence/file, priority, proposed fix, visible design impact, owner approval required (yes/no). Identify pricing/domain/legal uncertainties separately.

## Apply one approved fix

Apply only this change: [describe fix] to [exact file(s)]. Use the smallest relevant project rule and skill. Preserve all four current page designs and keep the homepage visually frozen. Do not create other pages, routes, blog posts, or landing pages. Make the smallest evidence-backed change; test it immediately; report exact files and verification results. Mark checks that could not run as BLOCKED.

## Metadata-only batch

Review and update only `<title>`, meta description, canonical, Open Graph and related head metadata for the four existing pages. Confirm the production hostname/redirect convention before setting canonicals. Preserve visible headings, copy, section order and styling. Do not guess facts, promises, prices, credentials or social profile URLs. Report old/new metadata in a four-row table.

## Schema-only batch

Evaluate whether truthful JSON-LD is justified by visible content. Prefer a stable Organization entity and accurate WebPage references. Add LocalBusiness-specific address/hours only if the owner supplied verified data. No fake reviews, ratings, coordinates, credentials, social `sameAs` URLs or invisible FAQ content. Validate syntax and report chosen types/properties and evidence.

## Sitemap/robots batch

Use only the four actual existing public pages: `/`, `/trademark-registration/`, `/services/`, and `/packages/`, after confirming the preferred HTTPS host and deployed URL behavior. Do not include future routes listed in `BRAIN/01_PAGE_MANIFEST.md`. Ensure robots rules do not block these pages or necessary CSS/JS/assets. Do not invent `lastmod` dates. Test the generated files.

## End-of-task report

Report only what actually happened:
- Exact files changed.
- Before/after changes.
- Tests run and outcomes (PASS / FAIL / BLOCKED / NOT RUN).
- Visual regression result for the frozen homepage.
- Unresolved owner decisions.
- Deployment and Search Console/Bing follow-up.
- Explicit statement: no additional web pages were created.
