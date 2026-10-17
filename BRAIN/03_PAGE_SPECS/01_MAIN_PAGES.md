# Page Specs A — Main Pages (Routes 1–8)

## 1. Home `/` — FROZEN / DO NOT REDESIGN
**File:** `index.html`.
- Preserve the current HTML content, visual layout, images, section order, typography, responsive rules and header/footer appearance.
- Only permit link-target changes needed to connect completed routes; make no visual or copy changes unless the owner specifically asks.
- Do not regenerate homepage artwork or replace it with an AI mockup.
- Before and after other work, check root `index.html` for unintended changes. Use a diff if editing the same project.

## 2. Trademark Registration `/trademark-registration/` — EXISTING REFERENCE
**File:** `trademark-registration/index.html`.
- Keep its current content/design unless directly asked to change it.
- Current visual flow: hero; why trademark registration matters; trademark support; registration process; Documents and Information (four open icon columns, vertical dividers, **no image**); pricing/FAQ section; centered navy CTA; shared homepage-style footer.
- Preserve the section-specific local images and soft cream/navy/gold theme.
- CTA should request a preliminary trademark search or discussion, not promise registration or availability.

## 3. Services `/services/` — EXISTING REFERENCE
**File:** `services/index.html`.
- Preserve its existing art direction and section order when building other pages.
- Current flow: image-blended hero; intro/why services matter; trademark services; business registration support; simple process; Why BRNDNUR; FAQ; compact centered WhatsApp CTA; shared footer.
- Use its alternating image/text sections, concise headings, service-specific images and open icon-led features as references for new service pages.

## 4. Packages & Pricing `/packages/` — EXISTING REFERENCE, PRICE CONFLICT
**File:** `packages/index.html`; page styles `packages/styles.css`.
- Preserve layout/design unless asked; package prices must be treated as unresolved until owner confirms current values.
- Current flow: hero; goal/package finder; four packages; trademark fee breakdown; what's included; add-on and ongoing support; three steps to a quote; FAQs; compact centered navy CTA; shared footer.
- Do not propagate the current fee table to detail pages as truth until the owner resolves the difference in `04_CONTENT_PRICING_AND_TRUST.md`.

## 5. About BRNDNUR `/about/`
**Purpose:** explain the firm’s advisory approach and values, without inventing history or credentials.
**Suggested section flow:**
1. **Hero:** “Guidance for Your Brand’s Next Chapter” (draft only; improve if needed); short description of trademark and business advisory support; CTA to Contact/WhatsApp; new warm office/workspace photo.
2. **What BRNDNUR Does:** one short paragraph and three open columns: Brand Protection, Business Registration Guidance, Practical Support.
3. **Our Approach:** a 5/7 or 6/6 split with page-specific photography and concise copy: listen, clarify options, explain scope/charges, guide next steps.
4. **Who We Help:** founders, small businesses, food businesses, entrepreneurs and existing trademark holders; don't promise all service types fit everyone.
5. **Our Principles:** clarity, transparent discussions, client-focused guidance; icon-led columns with dividers.
6. **How We Work:** 3-step process linking to `/how-it-works/`.
7. **CTA:** “Tell Us About Your Brand” linked to `/contact/` or WhatsApp.
8. Shared footer.
**Do not add:** founder biographies, year founded, client counts, “leading firm”, credentials, testimonials or success statistics without documented owner-approved proof.

## 6. How It Works `/how-it-works/`
**Purpose:** remove uncertainty about making an enquiry and deciding on a service.
**Suggested section flow:**
1. Hero: “A Clearer Way to Move Forward” with a concise description and CTA to WhatsApp.
2. Process timeline: 4 steps — Share your need; Review relevant options; Confirm scope/fees/documents; Proceed with agreed next steps. The exact service process differs; say “typically” where appropriate.
3. What to share: brand name/logo (if applicable), goods/services/business type, applicant/business category and existing registration/application details if any. Clarify that exact requirements vary.
4. What BRNDNUR discusses: options, process, likely documentation, scope, fee components, known limitations.
5. Before proceeding: written/clear scope and relevant charges; do not invent a guarantee or service-level agreement.
6. Related links: trademark, search, packages and business registration pages.
7. FAQs: what happens after enquiry, what documents are needed, whether the search guarantees approval, and how price is confirmed.
8. CTA and footer.
**Layout:** use an editorial timeline and one contextual image; avoid turning every step into a giant card.

## 7. FAQs `/faqs/`
**Purpose:** central FAQ source, organized for quick scanning and accessible interaction.
**Page design:** compact hero; category navigation/filter (only if functional); accordion grouped by category; related-service links; final CTA; footer.
**Required categories:**
- Brand name search.
- Trademark application and classes.
- Wordmark vs logo.
- Documents and application process.
- Fees, package prices and payment.
- GST/Udyam/MSME/FSSAI/business setup.
- Renewal and Brand Watch.
- Contact, cancellation and support.
**Content rules:** answer in 2–5 sentences when possible; avoid repeating current prices until verified. Explain uncertainty and link to the appropriate dedicated page. Use button-based accessible accordions with `aria-expanded`/`aria-controls`.

## 8. Contact `/contact/`
**Purpose:** let visitors contact BRNDNUR with minimal friction.
**Suggested section flow:**
1. Hero: “Let’s Talk About Your Brand” and one sentence setting expectations without promising response times.
2. Primary contact options: WhatsApp, phone, email; use confirmed details from `09_NAVIGATION_CONTACTS_AND_LINKS.md`.
3. Enquiry form only if genuinely functional (backend, email handler or integrated service). Fields may include name, WhatsApp/phone, email (optional), service needed and short message. Provide labels, validation and privacy link.
4. If no form backend exists, replace it with a WhatsApp enquiry panel; never show a false “submitted successfully” state.
5. Location: Manjeri, Malappuram, Kerala, India. Do not invent street address or embedded map pin.
6. What to prepare: service needed, brand/business name if applicable, general business category.
7. Privacy note linking `/privacy-policy/`.
8. Shared footer.
