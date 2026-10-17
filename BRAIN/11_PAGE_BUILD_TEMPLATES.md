# Page Build Templates — Use Selectively

This file is a reusable quality template. Do not paste it into every page or create identical layouts; adapt each item to the actual route spec.

## New page implementation record
Before editing, note internally:
- Route + expected file path.
- Page purpose and primary visitor task.
- The exact matching route-spec file and content/trust requirements read.
- Existing components/assets to reuse.
- New files/assets required.
- Current internal links that must be connected.

## Basic HTML page shell requirements
Every page should contain:
- `<!doctype html>`, correct `lang="en"`, responsive viewport.
- A unique and accurate `<title>` and meta description.
- Existing shared font setup / CSS includes as appropriate.
- Skip link to `#main-content`.
- Header with shared markup and a working mobile menu.
- `<main id="main-content">` with one H1 and well-ordered H2/H3 sections.
- Contextual main CTA and relevant internal links.
- Shared footer.
- Shared JS and page-specific JS only where needed.

## Content wireframe template
Use this as a checklist, not a mandatory section order:
1. Hero: eyebrow, unique H1, short statement, primary CTA, optional secondary CTA, suitable image.
2. Main explanation: what this page helps the visitor decide/do.
3. Core information: service/process/comparison/table appropriate to the topic.
4. What the visitor needs / next steps.
5. Limitations or fee clarity where applicable.
6. FAQs only if the page benefits from them; avoid duplicate FAQ walls.
7. Related routes.
8. Contextual CTA.
9. Shared footer.

## SEO metadata template
- Title: `[Page topic] | BRNDNUR Advisory LLP` (unique and natural).
- Description: 140–160 chars as a guideline, summarizing what the page covers without unsupported claims.
- Canonical: add only once domain/canonical strategy has been confirmed; use the approved route, not a guessed alternative.
- H1 should match visitor intent rather than mechanically duplicate the title.
- Only add structured data/schema if fields are truthful and match visible content. Never create fake Review, AggregateRating, LegalService, LocalBusiness or Offer details.

## Design review checklist
- Does the first viewport tell the user what the page is and what to do?
- Is the H1 a manageable width with an intentional line break?
- Is the image relevant, correctly cropped and not reused from an unrelated route?
- Are descriptions short and scannable?
- Do column edges align with the page container?
- Does the section rhythm alternate where appropriate without becoming repetitive?
- Are any cards unnecessary? Can open columns or a single image-led split work better?
- Is the CTA area compact and clearly centered/split as the reference requires?
- Are text sizes still readable on a 375px screen?
- Are any decorative items creating blank columns or unexplained empty spaces?
