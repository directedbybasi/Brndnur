# Local & Regional SEO Audit Report
**Client:** BRNDNUR Advisory LLP  
**Primary Office:** Court Road, Manjeri, Malappuram, Kerala 676121  
**Tool:** `.agents/skills/agentic-seo/scripts/local_seo_checker.py`  
**Issues:** 0 Warnings, 0 Errors  

---

## 1. Local Search Signals & NAP Consistency

- **Business Name:** `BRNDNUR Advisory LLP` (used consistently across header, footer, metadata, and JSON-LD).
- **Physical Address:** `1st Floor, City Center, Court Road, Manjeri, Malappuram District, Kerala, PIN 676121`.
- **Phone Number:** `+91 90481 88899` (rendered in both international standard format and visual text).
- **Email:** `brndnuradvisoryllp@gmail.com`.
- **Operating Hours:** Monday to Saturday: 09:30 AM – 06:00 PM IST.

---

## 2. Geographic Discovery Tags

Implemented in `<head>` via `BaseLayout.astro`:
```html
<meta name="geo.region" content="IN-KL">
<meta name="geo.placename" content="Manjeri, Malappuram, Kerala">
<meta name="geo.position" content="11.1219;76.1210">
<meta name="ICBM" content="11.1219, 76.1210">
```

---

## 3. Map & Navigation Integration

- Physical address in `src/components/Footer.astro` is hyperlinked directly to Google Maps:
  `href="https://maps.google.com/?q=Manjeri,+Malappuram,+Kerala,+India"`
  allowing local users to initiate turn-by-turn navigation with one tap.

---

## 4. Regional Kerala Content Program

- **Municipalities Covered:** Manjeri, Malappuram, Kozhikode, Sulthan Bathery, Kalpetta, Thalassery, Kannur, Kanhangad, Kasaragod, Palakkad, Thrissur, Ernakulam.
- **Sectors Covered:** Spices, Coffee, Food Processing, Handloom, Tourism & Homestays, IT & Digital Agencies, Retail & Boutiques, E-commerce Sellers.
- **Local Guides Count:** 200 dedicated regional business guides under `content/blog/`.
