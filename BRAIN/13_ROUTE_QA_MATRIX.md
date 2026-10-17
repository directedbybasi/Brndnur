# Route QA Matrix Template

Use this table during route audit and update status only after tests are completed. Don't mark complete based on a file existing alone.

| No. | Route | File exists | Metadata/H1 | Local assets | Internal links | Responsive | Interaction | Content verified | Status |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | `/` | Yes | Audit | Audit | Audit | Audit | Audit | Frozen copy | FROZEN |
| 2 | `/trademark-registration/` | Yes | Audit | Audit | Audit | Audit | Audit | Price/legal review | REFERENCE |
| 3 | `/services/` | Yes | Audit | Audit | Audit | Audit | Audit | Service claims | REFERENCE |
| 4 | `/packages/` | Yes | Audit | Audit | Audit | Audit | Audit | Price conflict | REFERENCE/BLOCKED PRICING |
| 5–32 | See `01_PAGE_MANIFEST.md` | Not yet audited | — | — | — | — | — | — | TO AUDIT |

## Suggested script checks
- Parse all HTML files and collect `href`/`src` references.
- For local relative paths, resolve from each HTML file's directory; confirm the file exists or that the anchor ID exists in the target page.
- Report missing references, duplicate IDs, pages with no H1, duplicate titles, empty link labels, `href="#"`, images with missing alt attributes, and forms without real handlers.
- Validate CSS braces with an appropriate parser if available; don't rely only on a crude count when nested syntax or strings are present.
- Inspect browser rendering at agreed widths. A clean script report doesn't replace visual review.

## Batch completion note
At the end of each batch, update `10_DECISION_LOG.md` with changed files, completed URLs, actual tests run, remaining issues and next batch.
