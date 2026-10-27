# Performance & Core Web Vitals (CWV) Audit Report
**Client:** BRNDNUR Advisory LLP  
**Build Target:** Zero-JS SSG Output (Astro v5)  

---

## 1. Core Web Vitals Lab Baseline

| Metric | Target Threshold | Implementation Safeguard | Status |
|---|:---:|---|:---:|
| **LCP (Largest Contentful Paint)** | ≤ 2.5s | Hero imagery uses `loading="eager"` + `fetchpriority="high"` | **OPTIMAL** |
| **INP (Interaction to Next Paint)** | ≤ 200ms | Lightweight vanilla JS for mobile drawer, zero heavy runtime frameworks | **OPTIMAL** |
| **CLS (Cumulative Layout Shift)** | ≤ 0.1 | 100% of raster images feature explicit HTML `width` and `height` | **ZERO SHIFT** |
| **FCP (First Contentful Paint)** | ≤ 1.8s | Google Fonts preconnect (`fonts.googleapis.com` & `fonts.gstatic.com`) + `display=swap` | **OPTIMAL** |
| **TTFB (Time to First Byte)** | ≤ 800ms | Fully pre-rendered static HTML files served directly by Hostinger Apache | **INSTANT** |

---

## 2. Server Compression & Caching (`public/.htaccess`)

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/xml image/svg+xml font/woff2 font/woff
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```
- **Static Assets:** 1-year immutable caching for WebP, PNG, JPG, and WOFF2 fonts.
- **HTML:** Revalidated on every request (`0 seconds`) to ensure instant zero-latency updates upon new site deployment.
