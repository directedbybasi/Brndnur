# Image and Asset Playbook

## 1. Asset rules
- Keep all current supplied assets. Do not overwrite an existing image to serve a different topic.
- New non-legal pages get images selected/generated for the page's own content; no generic image is reused across unrelated page clusters.
- Use local files under the relevant page's `assets/` folder. Avoid remote URLs and temporary image generator paths.
- Use WebP or optimized JPEG where practical; balance quality against page weight. Don't ship large multi-megabyte PNGs for ordinary page photography when an optimized WebP/JPEG will do.
- Store meaningful names in kebab-case, e.g. `hero-brand-search.webp`, `food-package.webp`, `renewal-documents.webp`.
- Do not add text in AI-generated images (logos, package copy, document paragraphs, fee figures). Text embedded in generation often renders incorrectly. Put all brand and content text in HTML/SVG.
- No fake certificates, official-looking seals, government portals, fake testimonials, identifiable real customer data, or photos claiming to depict a real BRNDNUR office unless supplied and approved.
- Ensure alt text is factual and concise. Do not use “image of” unless needed.

## 2. Visual direction
Premium editorial still life: warm daylight, cream/ivory, navy details, gold metal accents, polished marble or warm wood, notebooks/folders/books, plants, pens, tasteful workspaces. Avoid repeating the same exact arrangement too often. Use topic-specific objects for food, GST, business setup, international entrepreneurs, contact and informational resources.

## 3. Aspect ratios / composition
- Hero: typically wide 16:9 or 5:4; reserve space for HTML text when image is a background or blend.
- Image/text split: 4:3 or 5:4.
- Service/package cards: 4:3 or 16:9; all images in a grid must use the same ratio.
- About/team/story image: 4:5 or 5:4; no fabricated team members.
- FAQ/document visual: 4:3 or portrait only where the design calls for it.
- Legal pages: no image required.
- Apply CSS `aspect-ratio` and `object-fit: cover`; adjust `object-position: center` or custom focal positioning after preview. Never let images dictate section height.

## 4. Image generation prompt format
For each required image, brief the generator with:
1. Page/section purpose.
2. Main subject (specific, not generic desk only).
3. BRNDNUR palette and natural light.
4. View angle, focal point and negative space if needed.
5. Aspect ratio and crop constraints.
6. Negative instructions: no people (unless requested), no text/logos/letters/numbers, no watermark, no legible fake documents, no UI screenshots.

Example:
> Photorealistic premium still life for a trademark registration advisory website: ivory leather portfolio with a generic gold abstract seal (not letters), navy legal books, brass scales and a black-and-gold pen on veined cream marble in warm late-afternoon sunlight. Main subject positioned on the right with clean softly lit negative space on the left for an HTML headline. Wide 16:9 composition. No people, no readable text, no actual logos, no watermark, no fake official certificate.

## 5. Suggested image strategy by page type
- Main trademark page: new trademark-specific image or existing approved asset if it belongs to this exact page.
- Brand search: magnifying glass/search paperwork, no fake web portal UI.
- Wordmark/logo: brand mark proofs, printed typography sheets or logo artwork desk scene; avoid text baked in.
- Renewal/monitoring: calendar/documents/folders, no exact fabricated dates or legal claims.
- GST/Udyam/FSSAI: business documentation/workspace; food-specific image for FSSAI only; don't use official logos without permission.
- Package page: one hero, four distinct package visuals, pricing/ongoing-support/FAQ visuals only where useful. Each image conveys its package category; no repeated generic notebook on every card.
- Resources: one restrained editorial image per article if useful; otherwise typography/table of contents is better.
- Legal pages: text-first; no decorative images required.

## 6. Build-time checks
List every image reference and verify file existence. Check image dimensions and aspect ratio; check size/compression; review crops at desktop and mobile sizes; ensure alt text matches actual visual content. Remove unused assets only after confirming they aren't referenced by another route.
