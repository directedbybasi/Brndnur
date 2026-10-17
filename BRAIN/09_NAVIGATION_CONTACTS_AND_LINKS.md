# Navigation, Contact and Internal-Link Map

## 1. Canonical contact details
Use only the following unless the owner provides a verified update:
- Phone/WhatsApp: `+91 90481 88899`
- WhatsApp URL: `https://wa.me/919048188899`
- Email: `brndnuradvisoryllp@gmail.com`
- Location text: `Manjeri, Malappuram, Kerala, India`
- Domain: `brndnur.in`

If a phone number appears in generated art/mockups or a screenshot and differs from this document, do not copy it. Confirm with the owner. Do not invent a street address, directions link, social profile URL or map coordinate.

## 2. Header navigation
Order: Home · Trademark Registration · Services · Packages · About · How It Works · FAQs · Contact · Get in Touch.

On screens where the full nav no longer fits, use the shared mobile toggle/menu rather than squeezing or dropping links invisibly. `Get in Touch` should open the Contact page or a confirmed WhatsApp enquiry route. Don't introduce a second header style.

## 3. Footer navigation
**Quick Links:** Home, Trademark Registration, Services, Packages, About, How It Works, FAQs, Contact.

**Our Services:** Trademark Registration, Brand Name Search, Trademark Renewal & Monitoring, GST Assistance, Udyam/MSME Assistance, FSSAI Assistance, Business Setup Advisory. Add Wordmark/Logo/Classes only if footer space remains usable or the current approved reference contains them.

**Contact:** confirmed location, phone, email. Link phone with `tel:+919048188899`; email with `mailto:brndnuradvisoryllp@gmail.com`; WhatsApp with the verified wa.me URL.

**Legal strip:** `/privacy-policy/`, `/terms-and-conditions/`, `/disclaimer/`, `/refund-cancellation-policy/`.

## 4. Public routes and relative file paths
Use exact slugs from `01_PAGE_MANIFEST.md`. For static HTML, file hrefs should be relative to the current page:
- From root `index.html` to `/services/`: `services/index.html`.
- From `services/index.html` to root: `../index.html`.
- From `services/index.html` to packages: `../packages/index.html`.
- From `packages/index.html` to nested food package: `food-brand/index.html`.
- From `packages/food-brand/index.html` to root: `../../index.html`.
- From `resources/index.html` to article guide: `trademark-registration-guide/index.html`.
- From `resources/trademark-registration-guide/index.html` to resources index: `../index.html`.
- From nested routes back to shared CSS: count actual folder depth and test it; don't guess.

Public canonical URL concept always uses the manifest path. Avoid introducing both `/about` and `/about/` page variants. In-page hash targets must exist on that same destination page.

## 5. Contextual CTA prefilled WhatsApp messages
URL-encode the `text` parameter. Suggested English drafts (edit as needed):
- General: `Hello BRNDNUR, I would like to discuss your services. Please guide me on the next steps.`
- Trademark Registration: `Hello BRNDNUR, I would like to enquire about trademark registration for my brand. Please share the required information and current quotation.`
- Brand Name Search: `Hello BRNDNUR, I would like to request a preliminary brand name search. My brand name is [Brand Name].`
- Wordmark: `Hello BRNDNUR, I would like to discuss a wordmark application for my brand.`
- Logo: `Hello BRNDNUR, I would like to discuss trademark support for my logo.`
- Renewal: `Hello BRNDNUR, I would like to check the next steps for trademark renewal. I can share my registration details.`
- Monitoring: `Hello BRNDNUR, please share the current scope and quotation for Brand Watch/monitoring support.`
- GST: `Hello BRNDNUR, I would like guidance on GST registration for my business. Please let me know what details you need.`
- Udyam/MSME: `Hello BRNDNUR, I would like to enquire about Udyam/MSME registration assistance.`
- FSSAI: `Hello BRNDNUR, I would like to enquire about applicable FSSAI registration/licensing support for my food business.`
- Business setup: `Hello BRNDNUR, I would like to discuss registration and setup requirements for my business.`
- Package quote: `Hello BRNDNUR, I am interested in the [Package Name]. Please confirm current pricing, inclusions and any separate fees.`

Never prefill sensitive personal data into URLs. Encourage users to share only information needed for enquiry.

## 6. Internal link relationships
- Trademark Registration ↔ Brand Name Search, Trademark Classes, Wordmark, Logo, Renewal, Monitoring.
- Services ↔ every service page and Packages.
- Packages overview ↔ all four package detail pages and relevant individual services.
- Food Brand Package ↔ FSSAI, Udyam/MSME, Trademark Registration.
- Gulf Return Business Package ↔ Trademark Registration, Udyam/MSME, GST, FSSAI and Business Setup where relevant.
- Resources index ↔ four guide pages; each guide links to relevant service page(s) and official sources.
- FAQs ↔ related service/package page for each answer.
- Every page footer ↔ main navigation and legal routes.

## 7. Dead-link prohibition
Don't leave `href="#"`, placeholders, buttons with no action, generic `https://instagram.com`/`linkedin.com` roots, or links to not-yet-created pages in the final production state. During development, mark unfinished route references internally and resolve them before declaring integration complete.
