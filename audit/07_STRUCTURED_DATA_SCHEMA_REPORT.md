# Structured Data & Schema Graph Validation Report
**Client:** BRNDNUR Advisory LLP  
**Tools:** `schema_required_props.py`, `entity_checker.py`  
**JSON-LD Format:** Linked `@graph` topology  

---

## 1. Unified Entity Topology

Every page on `brndnur.com` provides a coherent linked JSON-LD graph connecting:
1. `Organization` / `LocalBusiness` / `ProfessionalService` / `LegalService` (`@id: "https://brndnur.com/#organization"`)
2. `WebSite` (`@id: "https://brndnur.com/#website"`)
3. `WebPage` (`@id: "[CanonicalURL]#webpage"`)
4. `BreadcrumbList` (`@id: "[CanonicalURL]#breadcrumb"`)
5. `FAQPage` on applicable educational routes (`/`, `/trademark-registration/`, `/faqs/`)

---

## 2. Entity Properties Audit

- **Entity Types:** `["Organization", "LocalBusiness", "ProfessionalService", "LegalService"]`
- **Legal Name:** `BRNDNUR Advisory LLP`
- **URL:** `https://brndnur.com/`
- **Logo:** `https://brndnur.com/assets/brndnur-logo-transparent.png`
- **Image Banner:** `https://brndnur.com/assets/brndnur-og-banner.jpg`
- **Telephone:** `+91 90481 88899`
- **Email:** `brndnuradvisoryllp@gmail.com`
- **Price Range:** `$$`
- **PostalAddress:**
  - `streetAddress`: `1st Floor, City Center, Court Road`
  - `addressLocality`: `Manjeri`
  - `addressRegion`: `Kerala`
  - `postalCode`: `676121`
  - `addressCountry`: `IN`
- **GeoCoordinates:**
  - `latitude`: `11.1219`
  - `longitude`: `76.1210`
- **OpeningHoursSpecification:**
  - `dayOfWeek`: `Monday` through `Saturday`
  - `opens`: `09:30`
  - `closes`: `18:00`
- **AreaServed:** `Manjeri`, `Malappuram`, `Kozhikode`, `Wayanad`, `Kannur`, `Kasaragod`, `Palakkad`, `Thrissur`, `Ernakulam`, `Kerala`, `India`
- **Social sameAs Graph:**
  - `https://www.linkedin.com/company/brndnur`
  - `https://x.com/brndnur`
