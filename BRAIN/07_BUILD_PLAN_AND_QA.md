# Implementation Order, QA and Definition of Done

> **Legacy expansion plan warning:** this document describes a broader 32-page build. It must not be executed for the current SEO/AEO task. The current task covers only the four supplied pages and their support files. No new pages may be created under the current scope; use `BRAIN/14_SEO_AEO_ANTIGRAVITY_MASTER_PROMPT.md` instead.

## 1. Work in small batches
Do not generate all missing pages in one pass. Implement one batch, inspect result, test it, and only then continue.

### Phase 0 — Audit, no redesign
- Inventory files and assets; map all internal links to the 32-page manifest.
- Search for the previously mentioned standalone Trademark Classes HTML and import only if actually found.
- Identify broken href/src paths and duplicated IDs.
- Build a status table in `10_DECISION_LOG.md`; don't alter home visuals.

### Phase 1 — Main pages
Build in this order: `/about/`, `/how-it-works/`, `/faqs/`, `/contact/`. Reuse shared shell; test contact details and actual functionality.

### Phase 2 — Trademark cluster
Build/import `/trademark-classes/`, then `/brand-name-search/`, `/wordmark-registration/`, `/logo-trademark-registration/`, `/trademark-renewal/`, `/trademark-monitoring/`. Verify current official trademark facts and link each page across the cluster.

### Phase 3 — Business registration cluster
Build `/gst-registration/`, `/udyam-msme-registration/`, `/fssai-registration/`, `/business-setup/`. Verify current official facts, categories, eligibility and fees.

### Phase 4 — Package detail pages
Build `/packages/individual-msme/`, `/packages/company-llp/`, `/packages/food-brand/`, `/packages/gulf-return-business/`. Wait for owner-confirmed package prices/scope before publishing them as fixed.

### Phase 5 — Resources
Build `/resources/` and the four guides. Verify every legal/trademark claim against current official sources and link references.

### Phase 6 — Legal/system
Build Privacy, Terms, Disclaimer, Refund/Cancellation and 404. Use owner/legal-reviewed business terms. Do not guess policy details.

### Phase 7 — Final integration
Update links in all pages to point to the canonical routes while preserving existing designs. Check route list, footer, CTA paths, metadata, assets, responsive widths, keyboard access and HTTP 404 behavior where hosting supports it.

## 2. Required technical conventions
- Stay with static HTML/CSS/vanilla JS unless the owner explicitly approves a stack change.
- New page path pattern: `slug/index.html`; nested package/resource pages use nested folders as in manifest; 404 is root `404.html`.
- Shared CSS/JS: `shared/site.css` and `shared/site.js`. Each page can have scoped local CSS as needed; don't independently reinvent shared header/footer.
- Use relative paths that are correct from the current file location. Test both local preview and deployed route behavior when possible.
- Every page: `<title>`, meta description, canonical path only when the domain/URL convention is confirmed, skip link, semantic landmarks, unique H1, logical heading hierarchy, useful alt attributes and visible focus.
- No dependencies/build tooling unless justified. If a dependency is added, document why, version and how deployment handles it.
- No runtime network dependency for local page images.

## 3. Per-page acceptance checklist
- [ ] Exact manifest file exists; no duplicate slug or wrong URL.
- [ ] Page has unique and accurate title/meta/H1.
- [ ] The content purpose and section order match the relevant page spec.
- [ ] Homepage and current reference pages remain visually unchanged unless requested.
- [ ] Header, footer, colours, typography and spacing fit the shared system.
- [ ] All internal hrefs resolve to existing pages or valid anchor IDs.
- [ ] All image/CSS/JS references resolve locally; image alt text is accurate.
- [ ] No placeholder content, generic social URLs, dead links, `href="#"` or fake form-success state.
- [ ] CTA action works; WhatsApp prefilled message is relevant and URL-encoded.
- [ ] FAQ/menu accordions work with keyboard, correct ARIA and focus states.
- [ ] No horizontal overflow at 320, 375, 520, 760, 1024, 1280 and 1440px.
- [ ] Text hierarchy, line wraps, column gaps and image crops were visually inspected.
- [ ] Reduced motion is respected; contrast and touch targets are acceptable.
- [ ] Pricing/official facts are verified or clearly marked indicative/owner-confirmation required.
- [ ] Legal drafts are flagged for owner/legal review.

## 4. Final site-level QA
- All 32 routes exist and can be opened.
- Header navigation and footer links cover the manifest; active-state behavior is sensible.
- Every internal service/package/resource link points to the exact matching page.
- Sitemap/page list status updated accurately; no page marked complete based solely on a placeholder.
- No duplicate titles/H1s for pages with different purposes.
- Check image loading, mobile menu, FAQ open/close, buttons, forms, telephone/email/WhatsApp links.
- Inspect at least one narrow mobile width, one tablet width and wide desktop for each layout family.
- Confirm `404.html` returns status 404 on deployed host if configuration allows.
- Check shared header/footer CSS changes on all existing pages before accepting them.

## 5. Definition of done
All 32 manifest routes exist, have accurate content and unique metadata, share the approved design system, use relevant assets, navigate correctly, pass functional/responsive/accessibility checks, and contain no unverified prices or legal claims presented as confirmed. Report route-by-route status and any remaining owner decisions.
