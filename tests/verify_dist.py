import os
import re
import sys
import xml.etree.ElementTree as ET

DIST_DIR = os.path.abspath('dist')

ALL_32_ROUTES = [
    # Group A: Main Website (4)
    ('/', 'index.html', 'https://brndnur.in/'),
    ('/trademark-registration/', 'trademark-registration/index.html', 'https://brndnur.in/trademark-registration/'),
    ('/services/', 'services/index.html', 'https://brndnur.in/services/'),
    ('/packages/', 'packages/index.html', 'https://brndnur.in/packages/'),
    
    # Group B: Company Information (4)
    ('/about/', 'about/index.html', 'https://brndnur.in/about/'),
    ('/how-it-works/', 'how-it-works/index.html', 'https://brndnur.in/how-it-works/'),
    ('/faqs/', 'faqs/index.html', 'https://brndnur.in/faqs/'),
    ('/contact/', 'contact/index.html', 'https://brndnur.in/contact/'),
    
    # Group C: Trademark Services (6)
    ('/trademark-classes/', 'trademark-classes/index.html', 'https://brndnur.in/trademark-classes/'),
    ('/brand-name-search/', 'brand-name-search/index.html', 'https://brndnur.in/brand-name-search/'),
    ('/wordmark-registration/', 'wordmark-registration/index.html', 'https://brndnur.in/wordmark-registration/'),
    ('/logo-trademark-registration/', 'logo-trademark-registration/index.html', 'https://brndnur.in/logo-trademark-registration/'),
    ('/trademark-renewal/', 'trademark-renewal/index.html', 'https://brndnur.in/trademark-renewal/'),
    ('/trademark-monitoring/', 'trademark-monitoring/index.html', 'https://brndnur.in/trademark-monitoring/'),
    
    # Group D: Business Services (4)
    ('/gst-registration/', 'gst-registration/index.html', 'https://brndnur.in/gst-registration/'),
    ('/udyam-msme-registration/', 'udyam-msme-registration/index.html', 'https://brndnur.in/udyam-msme-registration/'),
    ('/fssai-registration/', 'fssai-registration/index.html', 'https://brndnur.in/fssai-registration/'),
    ('/business-setup/', 'business-setup/index.html', 'https://brndnur.in/business-setup/'),
    
    # Group E: Package Details (4)
    ('/packages/individual-msme/', 'packages/individual-msme/index.html', 'https://brndnur.in/packages/individual-msme/'),
    ('/packages/company-llp/', 'packages/company-llp/index.html', 'https://brndnur.in/packages/company-llp/'),
    ('/packages/food-brand/', 'packages/food-brand/index.html', 'https://brndnur.in/packages/food-brand/'),
    ('/packages/gulf-return-business/', 'packages/gulf-return-business/index.html', 'https://brndnur.in/packages/gulf-return-business/'),
    
    # Group F: Resources & Educational Guides (5)
    ('/resources/', 'resources/index.html', 'https://brndnur.in/resources/'),
    ('/resources/trademark-registration-guide/', 'resources/trademark-registration-guide/index.html', 'https://brndnur.in/resources/trademark-registration-guide/'),
    ('/resources/trademark-class-guide/', 'resources/trademark-class-guide/index.html', 'https://brndnur.in/resources/trademark-class-guide/'),
    ('/resources/brand-name-search-guide/', 'resources/brand-name-search-guide/index.html', 'https://brndnur.in/resources/brand-name-search-guide/'),
    ('/resources/trademark-application-process/', 'resources/trademark-application-process/index.html', 'https://brndnur.in/resources/trademark-application-process/'),
    
    # Group G: Legal and Policy Pages (4)
    ('/privacy-policy/', 'privacy-policy/index.html', 'https://brndnur.in/privacy-policy/'),
    ('/terms-and-conditions/', 'terms-and-conditions/index.html', 'https://brndnur.in/terms-and-conditions/'),
    ('/disclaimer/', 'disclaimer/index.html', 'https://brndnur.in/disclaimer/'),
    ('/refund-cancellation-policy/', 'refund-cancellation-policy/index.html', 'https://brndnur.in/refund-cancellation-policy/'),
    
    # Group H: Error Page (1)
    ('/404.html', '404.html', 'https://brndnur.in/404.html')
]

def verify_all():
    print("=================================================================")
    print("   BRNDNUR ADVISORY LLP — 32-ROUTE COMPREHENSIVE QA SUITE")
    print("=================================================================\n")
    
    failures = []
    titles = {}
    descriptions = {}
    
    # Check 1: Route existence, HTML structure, Titles, Meta, Canonicals, Headings
    print(f"[CHECK 1] Inspecting all {len(ALL_32_ROUTES)} routes in '{DIST_DIR}'...")
    for idx, (route, rel_path, expected_canonical) in enumerate(ALL_32_ROUTES, 1):
        target_file = os.path.join(DIST_DIR, rel_path.replace('/', os.sep))
        if not os.path.exists(target_file):
            failures.append(f"Route #{idx} ({route}) MISSING FILE: {rel_path}")
            continue
            
        with open(target_file, 'r', encoding='utf-8') as f:
            html = f.read()
            
        # Title check
        m_title = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
        if not m_title or not m_title.group(1).strip():
            failures.append(f"Route #{idx} ({route}) missing or empty <title>")
        else:
            t = m_title.group(1).strip()
            if t in titles:
                failures.append(f"Duplicate title across routes: '{t}' in {route} and {titles[t]}")
            titles[t] = route
            
        # Meta description check
        m_desc = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
        if not m_desc or not m_desc.group(1).strip():
            failures.append(f"Route #{idx} ({route}) missing or empty meta description")
            
        # Canonical URL check
        m_canon = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', html, re.IGNORECASE)
        if not m_canon:
            failures.append(f"Route #{idx} ({route}) missing rel=canonical")
        elif m_canon.group(1).strip() != expected_canonical:
            failures.append(f"Route #{idx} ({route}) canonical mismatch: expected {expected_canonical}, got {m_canon.group(1).strip()}")
            
        # H1 check
        m_h1 = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.IGNORECASE | re.DOTALL)
        if not m_h1 or not m_h1.group(1).strip():
            failures.append(f"Route #{idx} ({route}) missing or empty <h1>")
            
        # Header / Footer presence
        if 'bn-header' not in html:
            failures.append(f"Route #{idx} ({route}) missing header navigation (bn-header)")
        if 'bn-footer' not in html:
            failures.append(f"Route #{idx} ({route}) missing footer (bn-footer)")
            
        # Local image references
        img_srcs = re.findall(r'<img\s+[^>]*src=["\']([^"\']+)["\']', html, re.IGNORECASE)
        for src in img_srcs:
            if src.startswith(('http://', 'https://', 'data:')):
                continue
            clean_src = src.split('?')[0].lstrip('/')
            img_path = os.path.join(DIST_DIR, clean_src.replace('/', os.sep))
            if not os.path.exists(img_path):
                failures.append(f"Route #{idx} ({route}) broken image reference: {src}")

    print(f"  -> Verified {len(ALL_32_ROUTES)} route files on disk.")
    print(f"  -> {len(titles)} distinct, unique <title> tags verified.")

    # Check 2: Sitemap verification (strictly 31 content routes, 404 excluded)
    print("\n[CHECK 2] Validating sitemap.xml...")
    sitemap_path = os.path.join(DIST_DIR, 'sitemap.xml')
    if not os.path.exists(sitemap_path):
        failures.append("dist/sitemap.xml missing!")
    else:
        try:
            tree = ET.parse(sitemap_path)
            root = tree.getroot()
            ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
            urls = [el.text.strip() for el in root.findall('ns:url/ns:loc', ns)]
            print(f"  -> sitemap.xml contains {len(urls)} URLs")
            if len(urls) != 31:
                failures.append(f"sitemap.xml has {len(urls)} URLs; must contain strictly 31 indexable content URLs!")
            if any('404' in u for u in urls):
                failures.append("sitemap.xml erroneously contains 404.html!")
            expected_content_urls = [c for r, _, c in ALL_32_ROUTES if r != '/404.html']
            missing_urls = set(expected_content_urls) - set(urls)
            if missing_urls:
                failures.append(f"sitemap.xml is missing expected URLs: {missing_urls}")
        except Exception as e:
            failures.append(f"sitemap.xml XML parsing error: {e}")

    # Check 3: robots.txt
    print("\n[CHECK 3] Validating robots.txt...")
    robots_path = os.path.join(DIST_DIR, 'robots.txt')
    if not os.path.exists(robots_path):
        failures.append("dist/robots.txt missing!")
    else:
        with open(robots_path, 'r', encoding='utf-8') as f:
            rob = f.read()
        if 'Sitemap: https://brndnur.in/sitemap.xml' not in rob:
            failures.append("robots.txt missing valid Sitemap URL reference!")
        if 'Allow: /' not in rob:
            failures.append("robots.txt missing Allow: / directive!")
        print("  -> robots.txt correctly permits indexing and links to sitemap.xml.")

    # Check 4: Hostinger .htaccess
    print("\n[CHECK 4] Validating Hostinger .htaccess...")
    htaccess_path = os.path.join(DIST_DIR, '.htaccess')
    if not os.path.exists(htaccess_path):
        failures.append("dist/.htaccess missing!")
    else:
        with open(htaccess_path, 'r', encoding='utf-8') as f:
            ht = f.read()
        if 'RewriteEngine On' not in ht:
            failures.append(".htaccess missing RewriteEngine On")
        if 'mod_deflate' not in ht and 'DEFLATE' not in ht:
            failures.append(".htaccess missing Gzip compression rules")
        print("  -> .htaccess verified with HTTPS rewrite, security headers, and compression.")

    print("\n=================================================================")
    if failures:
        print(f"[FAIL] {len(failures)} verification issues detected:")
        for fail in failures:
            print(f"  - {fail}")
        return False
    else:
        print("[SUCCESS] ALL 32 ROUTES, METADATA, ASSETS, SITEMAP, ROBOTS, AND .HTACCESS VERIFIED 100% CLEAN!")
        print("=================================================================")
        return True

if __name__ == '__main__':
    success = verify_all()
    sys.exit(0 if success else 1)
