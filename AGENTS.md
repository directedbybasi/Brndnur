# AUTHORITATIVE TASK SCOPE & ARCHITECTURE — 32-ROUTE STATIC ASTRO REBUILD

This is the definitive project directive for BRNDNUR Advisory LLP.
The static website architecture is built with **Astro v5 (Static Output)**, **TypeScript**, and **Tailwind CSS** (with `preflight: false` to ensure exact design fidelity).

All 32 specified canonical routes are authorized, implemented, and verified in `src/pages/` generating into `dist/` for Hostinger static deployment.

The original four HTML pages (`index.html`, `trademark-registration/index.html`, `services/index.html`, `packages/index.html`) serve as the design source of truth. Their visual layouts, typography, image crops, colors, and responsive hierarchies are 100% matched and preserved.


---

# BRNDNUR Website — Persistent Agent Instructions

## Mission
Complete the BRNDNUR Advisory LLP static website defined in `BRAIN/01_PAGE_MANIFEST.md`. Use the uploaded/existing HTML as the source of truth for current approved visual design. Work incrementally and verify every change.

## Before acting
1. Read `BRAIN/00_START_HERE.md`.
2. Read only the page-spec file for the route(s) being worked on, plus the design, navigation, and trust documents relevant to the task.
3. Inspect the current HTML, CSS, JS and assets before editing. Never infer project state from memory alone.

## Non-negotiable rules
- **Freeze the homepage:** `index.html` is approved. Do not redesign it, rewrite its copy, replace its images, reorder sections or change visible styling. Only change a link target when necessary to make a planned route work, and keep its appearance unchanged.
- **Reference pages:** `trademark-registration/index.html`, `services/index.html`, and `packages/index.html` are visual/content references. Do not replace them with generic templates or change them without a specific request.
- **32-page source of truth:** implement only the canonical routes in `BRAIN/01_PAGE_MANIFEST.md`. Do not create alternate slugs or duplicate pages.
- **Shared system:** preserve the ivory `#F4EFE4`, navy `#13233A`, and gold `#A8781A` palette, Playfair Display headings, DM Sans body text, shared header/footer patterns, and spacing rules.
- **Distinct page designs:** share tokens and components, not identical section sequences. Every non-legal page needs a clear purpose, page-specific content, and visuals that fit that content.
- **No invented facts:** never invent prices, package inclusions, legal/tax requirements, claims, credentials, client stories, statistics, guarantees, timelines, staff names, business IDs, or policy terms. Flag conflicts for owner confirmation.
- **No fake interactions:** forms must genuinely submit or clearly say how to contact the business instead. No fake success states. Accordions, mobile navigation, and links must work.
- **Stay static:** use HTML/CSS/vanilla JS and the existing path convention unless the owner explicitly authorizes a stack migration. Do not add dependencies without need.
- **Use relative local assets:** never hotlink temporary image-generation URLs. Keep each route's assets local and test their paths.
- **Build in batches:** follow `BRAIN/07_BUILD_PLAN_AND_QA.md`; do not build all missing pages in one unreviewable pass.

## Done means
A route is complete only when its manifest file exists, content is accurate, title/meta/H1 are present, links and assets work, keyboard/mobile behavior is tested, and it passes the acceptance checklist. Report exact completed routes, checks actually run, unresolved decisions, and remaining routes. Never report the whole site complete while routes are missing.
