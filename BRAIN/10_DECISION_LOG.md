# Owner Decisions and Project Status Log

This file prevents unresolved decisions from being forgotten. Update it after each batch. Do not claim owner approval unless the owner explicitly gives it.

## Current supplied project state (from `BRNDNUR-Website(3).zip`)
- [x] `index.html` exists — preserve as approved/frozen homepage.
- [x] `trademark-registration/index.html` exists — keep as design reference.
- [x] `services/index.html` exists — keep as design reference.
- [x] `packages/index.html` exists — keep as design reference, but price table conflict is unresolved.
- [x] `shared/site.css` and `shared/site.js` exist.
- [ ] Trademark Classes HTML: user says it exists, but not present in supplied project ZIP. Search workspace/user assets; import if found; otherwise document not found and implement from spec.
- [ ] Remaining 28 route files must be checked against manifest in a full audit (four routes exist now; a separate Trademark Classes file is not confirmed).

## Decisions requiring owner confirmation
1. **Trademark fees:** current `/packages/` table shows ₹4,500 + ₹1,500 = ₹6,000 for individual/small business and ₹9,000 + ₹2,000 = ₹11,000 for company/LLP. WhatsApp library shows different professional fees/approximate totals. Which rate table is current and approved?
2. **Brand Starter Pack:** confirm current public price, whether ₹3,500 is member-only, whether ₹4,999 is the normal price, and exact package inclusions.
3. **JCI/JCOM offers:** confirm if currently active and eligibility/terms before publishing.
4. **Food Brand Package:** confirm ₹12,000, exact inclusions and whether applicable government fees/other charges are included.
5. **Gulf Return Business Package:** confirm “starting ₹18,000”, exact eligibility, scope and exclusions.
6. **Brand Watch:** confirm current annual price range and monitoring frequency/deliverables.
7. **Website form handling:** confirm whether the site should use WhatsApp-only enquiries or a real backend/email form.
8. **Social accounts:** confirm official URLs before enabling social icons.
9. **Legal policies:** owner and legal review of Privacy, Terms, Disclaimer, Refund/Cancellation and exact business practices.
10. **Brand assets:** verify logo lockup/tagline file and exact approved TM usage. Do not reproduce uncertain TM symbols in newly drawn logo artwork.

## Per-batch work log template
Copy this block for each development pass:

### Batch [number] — [date]
- **Routes changed:**
- **Files changed:**
- **Routes completed:**
- **Checks actually run:**
- **Visual review:** [not run / desktop / tablet / mobile]
- **Broken links/assets remaining:**
- **Owner decisions needed:**
- **Next batch:**

## Final route status
Maintain a line for each manifest route when the audit/build begins. Allowed states: `FROZEN`, `REFERENCE`, `CHECK`, `IN PROGRESS`, `QA`, `COMPLETE`, `BLOCKED`. `COMPLETE` requires all criteria in `07_BUILD_PLAN_AND_QA.md`.
