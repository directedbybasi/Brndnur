# Design System — BRNDNUR Advisory LLP

## 1. Design reference priority
1. `index.html`: approved homepage. **Visually and copy frozen.**
2. `trademark-registration/index.html`: approved trademark-page reference.
3. `services/index.html`: approved services-page reference.
4. `packages/index.html`: current packages-page reference; price table contains an unresolved conflict.
5. `shared/site.css` and `shared/site.js`: common header/footer and mobile navigation implementation.
6. User-approved screenshots in the project/conversation: visual reference only; implementation details in source files remain authoritative unless the owner explicitly chooses a screenshot change.

Do not rebuild these four pages just to simplify integration. New pages must use the design system, but their composition must suit the page topic.

## 2. Brand tokens

| Token | Value | Use |
|---|---|---|
| `--bn-ivory` | `#F4EFE4` | Primary page background |
| `--bn-ivory-light` | `#F8F4EB` | Secondary sections/footer background |
| `--bn-navy` | `#13233A` | Primary text, dark CTA panels, selected cards |
| `--bn-gold` | `#A8781A` | Links, eyebrow labels, buttons, icon accents |
| `--bn-gold-dark` | `#8F6214` | Hover/focus-related gold state |
| `--bn-gold-pale` | `#F0E2C8` | Icon tiles and subtle highlights |
| `--bn-line` | `#DCCEB6` | Borders, section and column separators |
| `--bn-text` | `#26354A` | Body text |
| `--bn-muted` | `#566174` | Secondary body text |
| `--bn-white` | `#FFFCF6` | Text on dark backgrounds or card contrast |

Do not introduce pink, neon, bright gradients, glassmorphism, harsh black surfaces, saturated blues or multiple unrelated accent colours. Gold should be restrained, never used for long paragraphs.

## 3. Typography
- **Headings:** Playfair Display, with Georgia / Times New Roman fallback. Use normal or medium weight; editorial, not ultra-bold.
- **Body and UI:** DM Sans, with Arial fallback.
- **H1:** generally 48–60px desktop depending on the reference composition; 36–44px tablet; 32–38px mobile. Avoid huge text that forces awkward wraps.
- **H2:** 36–42px desktop; 32–38px tablet; 29–34px mobile.
- **H3:** 22–28px desktop; 20–24px mobile.
- **Body:** 16–18px desktop; 16–17px mobile; line-height 1.6–1.7.
- **Compact card copy:** preferably 14–16px, line-height at least 1.5; do not go below 13px for important text.
- **Eyebrow:** 11–12px, uppercase, 0.12–0.18em letter spacing, gold, medium/bold.
- **Labels/tables:** 13–15px where readable.
- **Weight:** avoid using bold for whole paragraphs. Use it for short labels or meaningful emphasis only.

## 4. Layout grid and spacing

| Property | Desktop ≥1280 | Tablet 768–1023 | Mobile <768 |
|---|---:|---:|---:|
| Content max width | 1200px | viewport less gutters | viewport less gutters |
| Side gutters | 48px (can use 40px at 1024–1279) | 28–32px | 20–24px |
| Grid | 12 columns | 8 columns | 4 columns |
| Grid gutter | 24px | 20px | 16px |
| Standard section vertical padding | 88–104px | 64–72px | 48–60px |
| Compact section vertical padding | 56–64px | 44–52px | 36–44px |
| Related elements gap | 16–24px | 16–20px | 12–16px |
| Distinct content groups gap | 32–48px | 28–36px | 24–32px |
| Card padding | 24px | 20–24px | 18–20px |

Use one centred content container per standard section. Background bands can be full-bleed; content inside must align to the same grid as neighboring sections. Do not create arbitrary left/right widths. On wide screens, do not stretch copy across the full width.

## 5. Column patterns
Use these as patterns, not mandatory templates:
- **6/6:** balanced hero text/image split.
- **5/7:** image plus broader text or feature list.
- **7/5:** when the content needs more room than the image.
- **4-up cards:** only when each item remains readable; prefer 2×2 if copy becomes cramped.
- **3-up open columns:** benefits, values or steps with thin vertical dividers.
- **2-column FAQ:** image/editorial content on one side and accordion on the other, only where it serves the page.
- **Single column:** legal and long-form educational pages.

At medium widths, stack the complex split before either column becomes narrow. Mobile defaults to one column except tiny features that remain comfortably readable.

## 6. Components and dimensions
- Header: 76px minimum desktop, ~70px tablet, 68px mobile; use existing shared CSS.
- Brand mark/wordmark: retain supplied construction and tagline; do not replace with plain typed text if current mark assets are available.
- Main button: 44–50px tall desktop, minimum 44px touch height; 16–24px horizontal padding; 5–8px radius.
- Secondary button: transparent/ivory fill, 1px navy/gold border, same height as primary.
- Card radius: 6–12px. Image corners normally 6–8px; 12px only if the specific reference uses it.
- Borders/dividers: 1px `#DCCEB6`; use sparingly as separators between open columns or groups. Do not box every element.
- Icon tile: usually 40–48px square with pale gold fill and gold/navy line icon.
- CTA band: typically navy with ivory copy, gold eyebrow and one primary button; use a compact centered structure unless design reference specifically calls for a split.
- Tables: accessible header row; adequate cell padding; responsive wrapping/stacking rather than horizontal overflow on mobile.
- FAQ accordion: clear question line, right-aligned plus/minus, 1px horizontal separators, open/close animation respects reduced motion.

## 7. Image direction
- Photorealistic, warm natural light, ivory/navy/gold palette; premium stationery, professional workspace, documents, legal reference books, a laptop/work surface or topic-specific still life.
- Images should support the section message, not act as generic decoration.
- Avoid visible fake text/logos inside AI-generated images. Brand logos/wordmarks should be HTML/SVG or supplied assets, not embedded in generated scenes.
- Hero images may be 16:9 / 5:4 / 4:3 or a full-height side visual; choose based on the reference. Cards generally 4:3 or 16:9. About image may be 4:5. Text-first/legal pages need no image.
- Set explicit aspect ratio and `object-fit: cover`; adjust `object-position` so the key item stays visible. Do not allow an image's intrinsic dimensions to determine a huge section height.
- Use local assets only. Meaningful images get accurate alt text; decorative backgrounds use empty alt or CSS background.
- Do not reuse the same photograph across unrelated pages. Reuse the same asset only when it is genuinely a shared brand texture/logo or a second view of the same item in a closely related flow.

## 8. Motion, states and accessibility
- Visible keyboard focus; never remove outline without replacement.
- Hover effects subtle: colour shift or 1–2px lift; no excessive movement.
- Respect `prefers-reduced-motion: reduce`.
- Ensure body/background and gold labels meet reasonable contrast; never place small gold text on a noisy image.
- Buttons, menus and accordions must be keyboard-operable.
- Use semantic headings and landmarks, one H1 per page, skip link, descriptive link labels and alt text.

## 9. Responsive breakpoints
Use the existing project breakpoints as a starting point; adjust deliberately and test:
- ≤520px: single-column service/package cards; compact header and footer stack.
- ≤760px: tablet/mobile content layout and footer transition.
- ≤1040px: shared navigation converts to menu in `shared/site.css`.
- Target behavior checkpoints: 320, 375, 520, 760, 1024, 1280 and 1440px.

## 10. CSS implementation rules
- Prefer CSS custom properties and shared classes rather than repeating literal styles across every page.
- Use `shared/site.css` for the common header/footer. Use a page-local stylesheet for page-specific sections, but don't restyle `.bn-header` or `.bn-footer` independently.
- Scope page-specific CSS to a body/page class, e.g. `.page-packages`.
- Use `min-width: 0` in grid children when needed; guard long URLs/emails with `overflow-wrap:anywhere`.
- Avoid fixed heights for text-driven sections. Use `min-height` only when justified.
- Avoid empty hrefs, inline event handler attributes, duplicate IDs, and broad selectors that leak into the other pages.
