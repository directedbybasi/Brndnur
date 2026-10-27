# Security, Privacy & Compliance Audit Report
**Client:** BRNDNUR Advisory LLP  
**Server Configuration:** Apache `.htaccess` (Hostinger Deployment)  

---

## 1. Production Security Headers (.htaccess)

Configured and verified in `public/.htaccess`:

```apache
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
  Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

| Security Header | Directive | Vulnerability Mitigated |
|---|---|---|
| **HSTS** | `max-age=31536000; includeSubDomains; preload` | SSL-stripping and man-in-the-middle attacks |
| **X-Content-Type-Options** | `nosniff` | MIME-type confusion and drive-by download attacks |
| **X-Frame-Options** | `SAMEORIGIN` | Clickjacking and unauthorized iframe embedding |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Referrer leakage of sensitive customer URL parameters |
| **Permissions-Policy** | `geolocation=(), microphone=(), camera=()` | Unauthorized hardware sensor access |
| **X-XSS-Protection** | `1; mode=block` | Legacy browser reflected cross-site scripting |

---

## 2. Secrets & Hygiene Scan

- **Git Repository Audit:** Scanned for `.env`, `*.key`, `*.pem`, API keys, database strings, or auth tokens.
- **Result:** **0 secrets detected.**
- **Forms & Data Protection:** Contact forms contain zero sensitive data leakage in URLs; submissions link to direct secure communication channels (WhatsApp / Email).
- **Privacy Policy:** Full privacy disclosure published at `/privacy-policy/` covering Indian Digital Personal Data Protection (DPDP) principles and transparent data minimization.
