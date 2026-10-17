> **LEGACY PROMPT — NOT FOR THE CURRENT SEO/AEO TASK.** This prompt asks for expansion to the planned 32-page website. The current owner instruction is narrower: optimize only the four pages already supplied. Do not run this legacy prompt unless the owner explicitly authorizes a return to full-page expansion. For the current task, use `BRAIN/14_SEO_AEO_ANTIGRAVITY_MASTER_PROMPT.md`.

---

# Antigravity Task Prompt — Full Website Completion

Copy this into Antigravity after opening the `BRNDNUR-Website` folder as the workspace. Keep this prompt saved; for a smaller task, write a much narrower request and refer to the relevant brain file.

---

You are working inside the existing BRNDNUR Advisory LLP static website project. **Read root `AGENTS.md` and `BRAIN/00_START_HERE.md` first.** Do not generate a new site from scratch.

## Goal
Complete the canonical 32-page site in `BRAIN/01_PAGE_MANIFEST.md` using the supplied HTML files as the real implementation and visual reference, and follow `BRAIN/07_BUILD_PLAN_AND_QA.md` in reviewable batches.

## Preserve existing approved work
- `index.html` is the approved/frozen homepage: preserve its visible content, section order, layout, assets and styling. Only fix link targets if needed, with no visual change.
- `trademark-registration/index.html`, `services/index.html`, `packages/index.html` are the existing reference pages. Do not replace their design with generic templates.
- Reuse `shared/site.css` and `shared/site.js` for the common header/footer/navigation. Build the remaining routes using the existing static HTML/CSS/JS architecture.

## Before editing
1. Audit the actual files and current links.
2. Read the exact page specification file for the route batch.
3. Identify the specific files and assets to add/change.
4. Check `BRAIN/04_CONTENT_PRICING_AND_TRUST.md` for facts/price conflicts.
5. Search for the previously mentioned Trademark Classes HTML before creating a replacement.

## Build rules
- Work only on the current batch. Don't attempt all 32 pages in one huge code generation.
- Follow `BRAIN/02_DESIGN_SYSTEM.md` and `BRAIN/05_COMPONENTS_AND_INTERACTIONS.md`.
- Follow `BRAIN/06_IMAGE_AND_ASSET_RULES.md`; generate/import new content-specific images where needed and store them locally. No repeated generic imagery across unrelated sections.
- Follow `BRAIN/09_NAVIGATION_CONTACTS_AND_LINKS.md` for URLs, phone/email, WhatsApp, shared header/footer and internal linking.
- Do not invent prices, guarantees, official fees, approval timelines, client statistics, biographies or legal policy terms. Do not make form interactions fake.
- Each page needs unique metadata and one H1; internal links and assets must resolve.

## Workflow and reporting
For each batch: inspect → implement → test → visually review → fix → update status in `10_DECISION_LOG.md`. After each batch, report exact routes completed, files changed, checks run, pricing/legal items awaiting owner confirmation and routes still missing. Never say the site is complete until all 32 routes pass QA.

**Start now with Phase 0 audit only. Do not edit page visuals during the audit.** Return a concise route status table, internal links to missing routes, confirm whether Trademark Classes HTML exists, and recommend the first build batch.

---
