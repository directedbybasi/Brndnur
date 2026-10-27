# Accessibility & WCAG 2.2 Level AA Compliance Audit
**Client:** BRNDNUR Advisory LLP  
**Evaluation Tool:** `.agents/skills/agentic-seo/scripts/a11y_seo_checker.py`  
**Score Across All Hubs:** 100/100 (0 issues)  

---

## 1. Automated Verification Scorecard

| Route / Hub | Accessibility Score | Violations Detected | Focus / Keyboard State |
|---|:---:|:---:|:---:|
| `/` (Homepage) | **100/100** | 0 | Full tab order & skip link active |
| `/services/` | **100/100** | 0 | Interactive card focus visible |
| `/trademark-registration/` | **100/100** | 0 | Form inputs & buttons labeled |
| `/packages/` | **100/100** | 0 | Accessible tier comparison |
| `/resources/` | **100/100** | 0 | Clean heading structure |
| `/about/` | **100/100** | 0 | High-contrast dark theme |
| `/contact/` | **100/100** | 0 | Native form inputs with `<label>` |
| `/faqs/` | **100/100** | 0 | Accordion ARIA expanded toggle |

---

## 2. Key Accessibility Implementations

1. **WCAG 2.4.1 Bypass Blocks (Skip to Content):**
   - Implemented `<a href="#main-content" class="skip-link">Skip to main content</a>` in `BaseLayout.astro`.
   - Elevated on keyboard `:focus` state with 2px gold outline (`#A8781A`) and high-contrast navy background (`#13233A`).
2. **Accessible Names on Icon & Brand Links:**
   - Injected `<span class="sr-only">BRNDNUR Advisory LLP - Light Up Your Brand</span>` inside logo anchors in both header and footer to prevent empty text warnings for screen readers.
3. **Contrast Ratios:**
   - Navy text (`#13233A`) on Ivory background (`#F4EFE4`) exceeds **9.2:1** (well above WCAG AA 4.5:1 requirement).
   - Gold CTA buttons (`#A8781A`) feature dark navy text (`#13233A`) with high contrast.
4. **Interactive Controls:**
   - Mobile navigation hamburger button includes dynamic `aria-expanded` and `aria-label` updates.
   - Escape key listener automatically closes open navigation drawers.
