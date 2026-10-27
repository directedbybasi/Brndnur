# BRNDNUR Advisory LLP — Static Deployment Guide

This guide details the procedure for compiling and deploying the static BRNDNUR Advisory LLP website to **Hostinger** (or any static web host).

---

## 1. Static Build Process

The website uses Astro v5 with static output (`output: 'static'`). Every page is pre-rendered at build time into pure HTML, CSS, JavaScript, and asset files.

To compile the production release:
```bash
npm run build
```
This outputs all 234 static routes into the `dist/` directory in approximately 3 seconds.

---

## 2. Deploying to Hostinger

### Method A: Hostinger File Manager / Git Deployment (Recommended)
1. **Connect Repository:** In Hostinger hPanel, navigate to **Git** or **Website Deployment**.
2. **Build Configuration:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. **Trigger Deploy:** Push to `master` branch to initiate automatic static build.

### Method B: Manual SFTP / File Manager Upload
1. Run `npm run build` locally.
2. In Hostinger hPanel, open **File Manager** and navigate to `public_html/`.
3. Upload the entire contents of the `dist/` folder directly into `public_html/`.
4. Ensure `index.html` is located directly in `public_html/index.html`.

---

## 3. Server Configuration (`.htaccess`)

For Hostinger Apache/LiteSpeed hosting, create or verify `.htaccess` in the web root (`public_html/.htaccess`):

```apache
# ----------------------------------------------------------------------
# BRNDNUR Advisory LLP — Production .htaccess Configuration
# ----------------------------------------------------------------------

RewriteEngine On

# 1. Enforce HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Enforce trailing slashes on directories
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !(.[a-zA-Z0-9]{1,5})$
RewriteRule ^(.*)([^/])$ https://%{HTTP_HOST}/$1$2/ [L,R=301]

# 3. Custom 404 Error Page
ErrorDocument 404 /404.html

# 4. Gzip & Brotli Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# 5. Leverage Browser Caching for Static Assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

---

## 4. Pre-Deployment Checklist

Before deploying any update to production, verify:
- [ ] `npm run check` completed with 0 errors.
- [ ] `npm run build` generated all 234 pages.
- [ ] `npm test` passed all 32 canonical route checks.
- [ ] `npm run test:autoplay` passed all 5-second carousel tests.
- [ ] `npm run test:typography` passed all font compliance checks.
- [ ] `public/sitemap.xml` and `public/robots.txt` are present in `dist/`.

---

## 5. Post-Deployment Verification

After deploying to live production:
1. Verify `https://brndnur.com/` loads instantly with HTTP 200.
2. Click the floating WhatsApp button and confirm it opens `wa.me/919048188899` with contextual message.
3. Test a subpage with a trailing slash (e.g. `https://brndnur.com/services/`).
4. Trigger a 404 URL (e.g. `https://brndnur.com/nonexistent-test/`) and verify the custom 404 page loads.
5. Inspect SSL certificate and HTTP-to-HTTPS automatic redirection.
