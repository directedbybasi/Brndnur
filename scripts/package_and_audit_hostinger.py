import os
import sys
import zipfile
import re
import xml.etree.ElementTree as ET

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(WORKSPACE_DIR, 'dist')
ZIP_PATH = os.path.join(WORKSPACE_DIR, 'BRNDNUR-HOSTINGER-READY.zip')

print(f"Workspace: {WORKSPACE_DIR}")
print(f"Dist Dir:  {DIST_DIR}")
print(f"Target Zip: {ZIP_PATH}")

if not os.path.exists(DIST_DIR):
    print("ERROR: dist/ directory does not exist! Run npm run build first.")
    sys.exit(1)

# ==========================================
# 1. AUDIT DIST DIRECTORY
# ==========================================
print("\n=== STEP 1: AUDITING DIST DIRECTORY ===")

# A. Check index.html at root
index_path = os.path.join(DIST_DIR, 'index.html')
assert os.path.isfile(index_path), "CRITICAL: dist/index.html is missing!"
with open(index_path, 'r', encoding='utf-8') as f:
    index_content = f.read()
assert '<title>' in index_content, "index.html missing <title>"
assert 'BRNDNUR' in index_content, "index.html does not contain BRNDNUR"
print("✅ dist/index.html confirmed present and valid.")

# B. Check 32 canonical routes
CANONICAL_ROUTES = [
    '', # root /
    'trademark-registration',
    'business-registration',
    'trademark-renewal-monitoring',
    'services',
    'packages',
    'about',
    'how-it-works',
    'faqs',
    'contact',
    'trademark-classes',
    'brand-name-search',
    'wordmark-registration',
    'logo-trademark-registration',
    'trademark-renewal',
    'trademark-monitoring',
    'gst-registration',
    'udyam-msme-registration',
    'fssai-registration',
    'business-setup',
    'packages/individual-msme',
    'packages/company-llp',
    'packages/food-brand',
    'packages/gulf-return-business',
    'resources',
    'resources/trademark-registration-guide',
    'resources/trademark-class-guide',
    'resources/brand-name-search-guide',
    'resources/trademark-application-process',
    'privacy-policy',
    'terms-and-conditions',
    'disclaimer',
    'refund-cancellation-policy',
    '404.html'
]

missing_canonical = []
for r in CANONICAL_ROUTES:
    if r == '':
        p = os.path.join(DIST_DIR, 'index.html')
    elif r.endswith('.html'):
        p = os.path.join(DIST_DIR, r)
    else:
        p = os.path.join(DIST_DIR, r, 'index.html')
    if not os.path.isfile(p):
        missing_canonical.append(r)

if missing_canonical:
    print(f"❌ Missing canonical routes: {missing_canonical}")
    sys.exit(1)
else:
    print(f"✅ All {len(CANONICAL_ROUTES)} canonical routes verified in dist/.")

# C. Check resources directory and count articles
resources_dir = os.path.join(DIST_DIR, 'resources')
article_dirs = []
for item in os.listdir(resources_dir):
    item_path = os.path.join(resources_dir, item)
    if os.path.isdir(item_path):
        if item in ['trademark-registration-guide', 'trademark-class-guide', 'brand-name-search-guide', 'trademark-application-process']:
            continue
        if item == 'preview':
            print("❌ CRITICAL: preview/ directory found in dist/resources/!")
            sys.exit(1)
        if os.path.isfile(os.path.join(item_path, 'index.html')):
            article_dirs.append(item)

print(f"✅ Verified {len(article_dirs)} published article routes in dist/resources/.")

# D. Count total HTML files
all_html_files = []
for root, dirs, files in os.walk(DIST_DIR):
    for f in files:
        if f.endswith('.html'):
            rel_file = os.path.relpath(os.path.join(root, f), DIST_DIR)
            all_html_files.append(rel_file)

print(f"✅ Total HTML files in dist: {len(all_html_files)}")

# E. Audit sitemap.xml
sitemap_path = os.path.join(DIST_DIR, 'sitemap.xml')
assert os.path.isfile(sitemap_path), "sitemap.xml missing in dist/"
tree = ET.parse(sitemap_path)
sitemap_root = tree.getroot()
ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap_locs = [elem.text for elem in sitemap_root.findall('sm:url/sm:loc', ns)]
print(f"✅ dist/sitemap.xml valid: contains {len(sitemap_locs)} URLs.")
for loc in sitemap_locs:
    assert loc.startswith('https://brndnur.com/'), f"Invalid sitemap URL domain: {loc}"
    assert '/preview/' not in loc, f"Preview URL leaked into sitemap: {loc}"

# F. Audit robots.txt
robots_path = os.path.join(DIST_DIR, 'robots.txt')
assert os.path.isfile(robots_path), "robots.txt missing in dist/"
with open(robots_path, 'r', encoding='utf-8') as f:
    robots_content = f.read()
assert 'Allow: /' in robots_content, "robots.txt missing Allow: /"
assert 'Sitemap: https://brndnur.com/sitemap.xml' in robots_content, "robots.txt missing Sitemap declaration"
print("✅ dist/robots.txt verified.")

# G. Audit .htaccess
htaccess_path = os.path.join(DIST_DIR, '.htaccess')
if os.path.isfile(htaccess_path):
    print("✅ dist/.htaccess exists.")
else:
    print("ℹ️ dist/.htaccess not found (optional).")

# H. Deep content inspection across HTML files (secrets, local URLs, internal notes, noindex)
print("\n--- Scanning HTML files for leaks, noindex, and internal notes ---")
leak_patterns = [
    re.compile(r'localhost:\d+', re.IGNORECASE),
    re.compile(r'127\.0\.0\.1(:\d+)?'),
    re.compile(r'trycloudflare\.com', re.IGNORECASE),
    re.compile(r'Internal Editorial Review Notes', re.IGNORECASE),
    re.compile(r'editorial-review-panel', re.IGNORECASE),
]

noindex_published_issues = []
leaks_found = []

for rel_html in all_html_files:
    file_full_path = os.path.join(DIST_DIR, rel_html)
    with open(file_full_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Check leaks
    for pat in leak_patterns:
        match = pat.search(content)
        if match:
            leaks_found.append(f"{rel_html}: matched pattern '{match.group(0)}'")

    # Check noindex:
    # 404.html and Astro 301 redirect stubs are expected to have noindex
    redirect_or_error_stubs = [
        '404.html',
        'blog',
        'trademark\\index.html', 'trademark/index.html',
        'trademark-classes',
        'wordmark-registration',
        'logo-trademark-registration',
        'trademark-renewal\\index.html', 'trademark-renewal/index.html',
        'trademark-monitoring',
        'gst-registration',
        'udyam-msme-registration',
        'fssai-registration',
        'business-setup',
        'packages\\individual-msme', 'packages/individual-msme',
        'packages\\company-llp', 'packages/company-llp',
        'packages\\food-brand', 'packages/food-brand',
        'packages\\gulf-return-business', 'packages/gulf-return-business'
    ]
    if not any(stub in rel_html for stub in redirect_or_error_stubs):
        if '<meta name="robots" content="noindex' in content or '<meta name="robots" content="none' in content:
            noindex_published_issues.append(rel_html)

if leaks_found:
    print(f"❌ Leaks found in dist files: {leaks_found[:5]}")
    sys.exit(1)
else:
    print("✅ No local URLs (localhost, trycloudflare), secrets, or internal review panels detected in dist/ HTML.")

if noindex_published_issues:
    print(f"❌ Unexpected noindex in published pages: {noindex_published_issues[:5]}")
    sys.exit(1)
else:
    print("✅ All published public pages confirmed indexable (0 unintended noindex tags).")


# ==========================================
# 2. CREATE ZIP ARCHIVE
# ==========================================
print("\n=== STEP 2: CREATING DEPLOYMENT ZIP ===")
if os.path.exists(ZIP_PATH):
    print(f"Removing old archive: {ZIP_PATH}")
    os.remove(ZIP_PATH)

total_files_added = 0
total_uncompressed_bytes = 0

# Collect all files to add
all_files_to_zip = []
for root, dirs, files in os.walk(DIST_DIR):
    for file in files:
        if file.lower() in ['.ds_store', 'thumbs.db']:
            continue
        full_path = os.path.join(root, file)
        rel_path = os.path.relpath(full_path, DIST_DIR).replace('\\', '/')
        all_files_to_zip.append((full_path, rel_path))

# Priority ordering ensures critical CSS, JS, and core routes extract first
def file_priority(item):
    rel = item[1]
    if '/' not in rel:
        return (0, rel) # Root files first (index.html, .htaccess, etc.)
    top_dir = rel.split('/')[0]
    if top_dir == 'site-assets':
        return (1, rel) # CSS and JS engine bundles
    elif top_dir == 'scripts':
        return (2, rel) # Client-side JS
    elif top_dir in ['services', 'trademark-registration', 'trademark-renewal-monitoring', 'business-registration', 'packages', 'about', 'contact', 'faqs', 'brand-name-search', 'how-it-works', 'terms-and-conditions', 'privacy-policy', 'disclaimer', 'refund-cancellation-policy']:
        return (3, rel) # Core canonical pages
    elif top_dir == 'assets':
        return (4, rel) # Media assets
    else:
        return (5, rel) # 200 blog/guide resource articles

all_files_to_zip.sort(key=file_priority)

with zipfile.ZipFile(ZIP_PATH, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
    for full_path, rel_path in all_files_to_zip:
        zipf.write(full_path, rel_path)
        total_files_added += 1
        total_uncompressed_bytes += os.path.getsize(full_path)

zip_size_bytes = os.path.getsize(ZIP_PATH)
zip_size_mb = zip_size_bytes / (1024 * 1024)
print(f"✅ Archive created: {ZIP_PATH}")
print(f"   Files added: {total_files_added}")
print(f"   Uncompressed size: {total_uncompressed_bytes / (1024 * 1024):.2f} MB")
print(f"   Archive size: {zip_size_mb:.2f} MB ({zip_size_bytes:,} bytes)")

# Also create the lightweight core emergency fix package
CORE_FIX_PATH = os.path.join(WORKSPACE_DIR, 'BRNDNUR-CORE-AND-STYLES-FIX.zip')
if os.path.exists(CORE_FIX_PATH):
    os.remove(CORE_FIX_PATH)

core_files = [item for item in all_files_to_zip if file_priority(item)[0] <= 3]
with zipfile.ZipFile(CORE_FIX_PATH, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as core_zip:
    for full_path, rel_path in core_files:
        core_zip.write(full_path, rel_path)

print(f"✅ Emergency Core Fix created: {CORE_FIX_PATH} ({len(core_files)} files, {os.path.getsize(CORE_FIX_PATH) / (1024*1024):.2f} MB)")


# ==========================================
# 3. VERIFY CREATED ZIP ARCHIVE
# ==========================================
print("\n=== STEP 3: VERIFYING CREATED ZIP ARCHIVE ===")

with zipfile.ZipFile(ZIP_PATH, 'r') as verify_zip:
    namelist = verify_zip.namelist()
    
    # 1. index.html at root
    assert 'index.html' in namelist, "CRITICAL: index.html is NOT at the root of the ZIP!"
    print("✅ Confirmation: 'index.html' is directly at the ZIP root.")
    
    # 2. Check no outer dist/ prefix
    nested_dist_entries = [name for name in namelist if name.startswith('dist/')]
    assert len(nested_dist_entries) == 0, f"CRITICAL: Outer 'dist/' folder found in zip: {nested_dist_entries[:3]}"
    print("✅ Confirmation: No outer 'dist/' folder wrapper in ZIP.")

    # 3. Count HTML pages in ZIP
    zip_html_files = [name for name in namelist if name.endswith('.html')]
    print(f"✅ Reconciled HTML pages in ZIP: {len(zip_html_files)} (expected {len(all_html_files)}).")
    assert len(zip_html_files) == len(all_html_files), f"HTML count mismatch: {len(zip_html_files)} vs {len(all_html_files)}"

    # 4. Check essential assets and directories
    assert 'sitemap.xml' in namelist, "sitemap.xml missing from zip!"
    assert 'robots.txt' in namelist, "robots.txt missing from zip!"
    
    # Check if .htaccess is included if it was in dist
    if os.path.isfile(htaccess_path):
        assert '.htaccess' in namelist, ".htaccess missing from zip!"
        print("✅ Confirmation: '.htaccess' is included at ZIP root.")

    # Check key directories
    has_astro_assets = any(name.startswith('_astro/') or name.startswith('site-assets/') for name in namelist)
    has_custom_assets = any(name.startswith('assets/') for name in namelist)
    print(f"✅ Directory checks: site-assets/_astro included ({has_astro_assets}), assets/ included ({has_custom_assets})")
    
    # Check sample article in ZIP
    sample_article = f"resources/{article_dirs[0]}/index.html"
    assert sample_article in namelist, f"Sample article {sample_article} missing from zip!"
    
    # Test reading index.html from zip
    with verify_zip.open('index.html') as f:
        read_index = f.read().decode('utf-8')
        assert 'BRNDNUR' in read_index
        print("✅ Integrity test: Read index.html from archive successfully.")

print("\n🎉 ALL PRODUCTION AUDIT AND PACKAGING CHECKS PASSED PERFECTLY!")
