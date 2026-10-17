# Shared Components and Interaction Contracts

## 1. Header/navigation
**Implementation:** reuse the markup/classes defined by existing pages and `shared/site.css`; do not create a second visual header. Important classes: `.bn-header`, `.bn-header-inner`, `.bn-brand`, `.bn-nav`, `.bn-cta`, `.bn-toggle`, `.bn-skip`.
- Desktop header is ~76px high, ivory background, subtle bottom divider.
- Logo/brand area about 150–175px wide; navigation readable and spaced; CTA at far right.
- Under the current shared breakpoint (~1040px), hide full navigation and show menu toggle; use existing `.is-open` behavior.
- Active route may use `aria-current="page"`; service/resource/package detail pages should have a reasonable active parent if the shell supports it.
- New submenu patterns are not required unless a genuine information-architecture need exists. Never shrink nav labels until unreadable.
- Test menu by mouse, touch and keyboard. Closing conditions: nav-link activation, click outside and Escape. Ensure `aria-expanded` stays current.

## 2. Footer
Reuse the same footer structure/classes `.bn-footer`, `.bn-footer-main`, `.bn-footer-brand`, `.bn-footer-col`, `.bn-footer-bottom`, `.bn-legal`.
- Four desktop groups: brand summary/socials; Quick Links; Our Services; Contact.
- Mobile: clean stacked/2-column intermediate layout as current CSS dictates; no horizontal overflow.
- Legal strip contains Privacy Policy, Terms & Conditions, Disclaimer and Refund & Cancellation Policy.
- Use confirmed phone/email/location only (see `09_NAVIGATION_CONTACTS_AND_LINKS.md`). Verify social URLs before presenting them as official.
- Footer link list may be the same everywhere; don't repeat full service descriptions in footer.

## 3. Button and CTA
- Primary button: gold or navy according to section context; 44–50px high; clearly action-labelled.
- Secondary button: thin border; same height; no button-like style for ordinary inline links.
- A CTA must do something: link to a real route, a section ID, `tel:`, `mailto:` or a verified WhatsApp URL.
- WhatsApp CTA may use prefilled `text=` only after URL encoding. Draft messages should mention the page/service (e.g. “Hello BRNDNUR, I’d like to discuss the Food Brand Package. Please share the current scope and quotation.”).
- Do not make a phone/WhatsApp icon appear active if no destination is set.

## 4. FAQ accordion
- Use semantic buttons for each question with `aria-expanded` and `aria-controls`, unique controlled panel IDs, visible focus state and correct keyboard behavior.
- The answer panel must actually expand/collapse. Use a small +/− or chevron that flips with state.
- At least 44px click/touch target height where feasible; don't create tiny plus-only targets.
- Use horizontal warm dividers rather than boxes around every item.
- Answer prices only from approved, current sources. Link to deeper service page when useful.
- Reduce/remove transition under `prefers-reduced-motion`.

## 5. Contact/enquiry form
- Use labels associated with inputs, appropriate input types, required indicators, accessible error messages and a privacy-policy link.
- Before implementing, inspect whether a backend or connected form service exists. If none, do not display a fake submission success. Prefer a direct WhatsApp/email CTA, or clearly say the form is a preview until wired.
- If a real form service is introduced, obtain owner approval and update Privacy Policy details to reflect actual processing.

## 6. Service/package cards
- Cards represent distinct options, not filler. Typical card contains contextual image or icon, title, 1–3 sentence explanation, concise inclusions, and one link.
- Ensure entire card click target is accessible if card is clickable, but avoid nested interactive elements inside a single link.
- Keep equal image ratio within a card row; tune `object-position` individually.
- Avoid adding price badges unless pricing is approved and the status of offer is clear.

## 7. Pricing table
- Desktop table needs semantic `<table>`, `<thead>`, `<tbody>`, meaningful row/column headers and readable padding.
- Mobile should transform to stacked labelled rows/cards or wrap cleanly; no horizontal scroll unless explicitly justified.
- Government fee, professional fee and total must be separate. Don't calculate/present totals before source numbers are approved.

## 8. Icons and imagery
- Prefer a consistent set of outline icons (SVG or an existing local icon system); maintain stroke and sizing consistency.
- Don't mix emoji, solid icon packs, random Unicode symbols and several unrelated icon styles.
- Images must be local and route-appropriate. Every meaningful image gets an alt description of what is shown; decorative images use empty alt.

## 9. Interaction audit
For every route, click each button, nav item, card link, footer link, accordion, anchor and form control. Check no `href="#"` remains unless a deliberate, valid same-page anchor is provided. Ensure in-page IDs exist and unique.
