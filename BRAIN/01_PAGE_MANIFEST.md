# Canonical Page Manifest — 32 Routes

> **Current-task scope notice:** this is a long-term planned sitemap, not authorization to create pages during the current SEO/AEO pass. For the current request, only the four existing pages in the supplied project are in scope. Use `BRAIN/14_SEO_AEO_ANTIGRAVITY_MASTER_PROMPT.md`. Do not create missing routes unless the owner later changes scope explicitly.

This is the **single source of truth** for route names, public URLs and intended file locations. Do not invent alternate slugs. All public URLs use trailing slashes except `/404.html`; static files use `folder/index.html`.

**Status key:** `IN ZIP — FROZEN` = approved homepage; `IN ZIP — REFERENCE` = supplied page to preserve as design reference; `CHECK` = user says another copy exists but it was not found in the supplied project; `TO BUILD` = not present in the current project ZIP.

## Main navigation pages — 8
| No. | Page | Public URL | File | Current status |
|---:|---|---|---|---|
| 1 | Home — approved and fixed | `/` | `index.html` | IN ZIP — FROZEN |
| 2 | Trademark Registration | `/trademark-registration/` | `trademark-registration/index.html` | IN ZIP — REFERENCE |
| 3 | Services | `/services/` | `services/index.html` | IN ZIP — REFERENCE |
| 4 | Packages & Pricing | `/packages/` | `packages/index.html` | IN ZIP — REFERENCE; pricing requires owner confirmation |
| 5 | About BRNDNUR | `/about/` | `about/index.html` | TO BUILD |
| 6 | How It Works | `/how-it-works/` | `how-it-works/index.html` | TO BUILD |
| 7 | FAQs | `/faqs/` | `faqs/index.html` | TO BUILD |
| 8 | Contact | `/contact/` | `contact/index.html` | TO BUILD |

## Dedicated trademark pages — 6
| No. | Page | Public URL | File | Current status |
|---:|---|---|---|---|
| 9 | Trademark Classes | `/trademark-classes/` | `trademark-classes/index.html` | CHECK — search workspace for earlier HTML first |
| 10 | Brand Name Search | `/brand-name-search/` | `brand-name-search/index.html` | TO BUILD |
| 11 | Wordmark Registration | `/wordmark-registration/` | `wordmark-registration/index.html` | TO BUILD |
| 12 | Logo Trademark Registration | `/logo-trademark-registration/` | `logo-trademark-registration/index.html` | TO BUILD |
| 13 | Trademark Renewal | `/trademark-renewal/` | `trademark-renewal/index.html` | TO BUILD |
| 14 | Trademark Monitoring | `/trademark-monitoring/` | `trademark-monitoring/index.html` | TO BUILD |

## Business registration service pages — 4
| No. | Page | Public URL | File | Current status |
|---:|---|---|---|---|
| 15 | GST Registration Assistance | `/gst-registration/` | `gst-registration/index.html` | TO BUILD |
| 16 | Udyam / MSME Registration | `/udyam-msme-registration/` | `udyam-msme-registration/index.html` | TO BUILD |
| 17 | FSSAI Registration Assistance | `/fssai-registration/` | `fssai-registration/index.html` | TO BUILD |
| 18 | Business Setup Advisory | `/business-setup/` | `business-setup/index.html` | TO BUILD |

## Package detail pages — 4
| No. | Page | Public URL | File | Current status |
|---:|---|---|---|---|
| 19 | Individual / MSME Trademark Package | `/packages/individual-msme/` | `packages/individual-msme/index.html` | TO BUILD |
| 20 | Company / LLP Trademark Package | `/packages/company-llp/` | `packages/company-llp/index.html` | TO BUILD |
| 21 | Food Brand Package | `/packages/food-brand/` | `packages/food-brand/index.html` | TO BUILD |
| 22 | Gulf Return Business Package | `/packages/gulf-return-business/` | `packages/gulf-return-business/index.html` | TO BUILD |

## Resources and educational pages — 5
| No. | Page | Public URL | File | Current status |
|---:|---|---|---|---|
| 23 | Resources / Blog | `/resources/` | `resources/index.html` | TO BUILD |
| 24 | Trademark Registration Guide | `/resources/trademark-registration-guide/` | `resources/trademark-registration-guide/index.html` | TO BUILD |
| 25 | Trademark Class Guide | `/resources/trademark-class-guide/` | `resources/trademark-class-guide/index.html` | TO BUILD |
| 26 | Brand Name Search Guide | `/resources/brand-name-search-guide/` | `resources/brand-name-search-guide/index.html` | TO BUILD |
| 27 | Trademark Application Process | `/resources/trademark-application-process/` | `resources/trademark-application-process/index.html` | TO BUILD |

## Legal and system pages — 5
| No. | Page | Public URL | File | Current status |
|---:|---|---|---|---|
| 28 | Privacy Policy | `/privacy-policy/` | `privacy-policy/index.html` | TO BUILD; owner/legal review required |
| 29 | Terms & Conditions | `/terms-and-conditions/` | `terms-and-conditions/index.html` | TO BUILD; owner/legal review required |
| 30 | Disclaimer | `/disclaimer/` | `disclaimer/index.html` | TO BUILD; owner/legal review required |
| 31 | Refund & Cancellation Policy | `/refund-cancellation-policy/` | `refund-cancellation-policy/index.html` | TO BUILD; owner/legal review required |
| 32 | Custom 404 — Page Not Found | `/404.html` | `404.html` | TO BUILD |

## Navigation groups
- **Header:** Home, Trademark Registration, Services, Packages, About, How It Works, FAQs, Contact, Get in Touch.
- **Services discovery:** Trademark Classes, Brand Name Search, Wordmark, Logo, Renewal, Monitoring, GST, Udyam/MSME, FSSAI, Business Setup.
- **Packages:** four package detail routes nested under `/packages/`.
- **Resources:** resource index plus four guides.
- **Footer legal links:** Privacy Policy, Terms & Conditions, Disclaimer, Refund & Cancellation Policy.

## Linking convention
Use public URLs as the conceptual route map. In static HTML, follow the actual relative-file convention used by the supplied pages so links work both from the current folder setup and on static hosting: e.g. from the homepage, `services/index.html`; from `services/index.html` to packages, `../packages/index.html`; from `packages/` to a nested detail, `individual-msme/index.html`; from a nested package detail back to the homepage, `../../index.html`. Validate each path from its page location.

## Completion accounting
The route is complete only if its exact file exists, content is not placeholder-only, all local assets resolve, relevant interactions work, shared navigation/footer are present, and QA passes. Maintain a separate completion log in `10_DECISION_LOG.md`; do not mark a route complete from the presence of a link alone.
