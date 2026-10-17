import os
import re
import json
import xml.etree.ElementTree as ET

DIST_DIR = 'dist'
PAGES = [
    ('index.html', 'https://brndnur.in/'),
    ('trademark-registration/index.html', 'https://brndnur.in/trademark-registration/'),
    ('services/index.html', 'https://brndnur.in/services/'),
    ('packages/index.html', 'https://brndnur.in/packages/')
]

def check_sitemap():
    print("--- SITEMAP.XML IN DIST CHECK ---")
    sitemap_path = os.path.join(DIST_DIR, 'sitemap.xml')
    if not os.path.exists(sitemap_path):
        print("[FAIL] dist/sitemap.xml does not exist")
        return False
    try:
        tree = ET.parse(sitemap_path)
        root = tree.getroot()
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = [elem.text for elem in root.findall('ns:url/ns:loc', namespace)]
        print(f"[PASS] sitemap.xml is valid XML with {len(urls)} URLs:")
        expected_urls = [url for _, url in PAGES]
        for u in urls:
            print(f"  - {u}")
        if set(urls) == set(expected_urls):
            print("[PASS] sitemap.xml contains strictly the 4 canonical public URLs!")
            return True
        else:
            print(f"[FAIL] sitemap.xml mismatch: {urls}")
            return False
    except Exception as e:
        print(f"[FAIL] sitemap.xml error: {e}")
        return False

def check_robots():
    print("\n--- ROBOTS.TXT IN DIST CHECK ---")
    robots_path = os.path.join(DIST_DIR, 'robots.txt')
    if not os.path.exists(robots_path):
        print("[FAIL] dist/robots.txt does not exist")
        return False
    with open(robots_path, 'r', encoding='utf-8') as f:
        content = f.read()
    print("[PASS] robots.txt contents:\n" + content.strip())
    if 'Sitemap: https://brndnur.in/sitemap.xml' in content:
        print("[PASS] Sitemap directive is properly declared.")
        return True
    return False

def check_pages():
    print("\n--- DIST HTML PAGES VERIFICATION ---")
    titles = {}
    descriptions = {}
    all_passed = True

    for rel_path, expected_canonical in PAGES:
        file_path = os.path.join(DIST_DIR, rel_path)
        print(f"\nChecking [{file_path}]:")
        if not os.path.exists(file_path):
            print(f"  [FAIL] File missing: {file_path}")
            all_passed = False
            continue

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        base_dir = os.path.dirname(file_path)

        # Doctype & html lang
        if '<!DOCTYPE html>' in content or '<!doctype html>' in content:
            print("  [PASS] DOCTYPE declared")
        else:
            print("  [FAIL] Missing DOCTYPE")
            all_passed = False

        if '<html lang="en">' in content:
            print("  [PASS] <html lang=\"en\">")
        else:
            print("  [FAIL] Missing lang=\"en\"")
            all_passed = False

        # Charset & Viewport
        if 'charset="UTF-8"' in content or 'charset="utf-8"' in content:
            print("  [PASS] Charset UTF-8 present")
        else:
            print("  [FAIL] Missing charset")
            all_passed = False

        if 'name="viewport"' in content:
            print("  [PASS] Viewport meta present")
        else:
            print("  [FAIL] Missing viewport meta")
            all_passed = False

        # Title
        t_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
        if t_match:
            title = t_match.group(1).strip()
            print(f"  [PASS] Title: \"{title}\" (len: {len(title)})")
            titles[rel_path] = title
        else:
            print("  [FAIL] Missing title")
            all_passed = False

        # Description
        d_match = re.search(r'<meta\s+name="description"\s+content="(.*?)"', content, re.IGNORECASE)
        if d_match:
            desc = d_match.group(1).strip()
            print(f"  [PASS] Description: \"{desc}\" (len: {len(desc)})")
            descriptions[rel_path] = desc
        else:
            print("  [FAIL] Missing description")
            all_passed = False

        # Canonical
        c_match = re.search(r'<link\s+rel="canonical"\s+href="(.*?)"', content, re.IGNORECASE)
        if c_match:
            canon = c_match.group(1).strip()
            if canon == expected_canonical:
                print(f"  [PASS] Canonical matches expected: {canon}")
            else:
                print(f"  [FAIL] Canonical mismatch: expected {expected_canonical}, got {canon}")
                all_passed = False
        else:
            print("  [FAIL] Missing canonical tag")
            all_passed = False

        # Open Graph
        og_reqs = ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image']
        og_missing = [og for og in og_reqs if f'property="{og}"' not in content]
        if not og_missing:
            print("  [PASS] Open Graph tags complete")
        else:
            print(f"  [FAIL] Missing OG tags: {og_missing}")
            all_passed = False

        # Twitter Card
        tw_reqs = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']
        tw_missing = [tw for tw in tw_reqs if f'name="{tw}"' not in content]
        if not tw_missing:
            print("  [PASS] Twitter Card tags complete")
        else:
            print(f"  [FAIL] Missing Twitter tags: {tw_missing}")
            all_passed = False

        # Exactly 1 H1
        h1s = re.findall(r'<h1(?:\s+[^>]*)?>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
        if len(h1s) == 1:
            clean_h1 = re.sub(r'<[^>]+>', '', h1s[0]).strip().replace('\n', ' ')
            print(f"  [PASS] Exactly 1 H1: \"{clean_h1}\"")
        else:
            print(f"  [FAIL] H1 count is {len(h1s)} (expected 1)")
            all_passed = False

        # JSON-LD parse check
        jsonld_blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL)
        if jsonld_blocks:
            for i, blk in enumerate(jsonld_blocks):
                try:
                    data = json.loads(blk)
                    types = [item.get('@type') for item in data.get('@graph', [])] if '@graph' in data else [data.get('@type')]
                    print(f"  [PASS] JSON-LD block {i+1} valid! Types: {types}")
                except Exception as e:
                    print(f"  [FAIL] JSON-LD error: {e}")
                    all_passed = False
        else:
            print("  [WARN] No JSON-LD found")

        # Verify image assets resolve on disk
        imgs = re.findall(r'<img\s+([^>]+)>', content, re.IGNORECASE)
        print(f"  Checking {len(imgs)} images on disk...")
        for img in imgs:
            src_m = re.search(r'src="([^"]+)"', img)
            if not src_m:
                continue
            src = src_m.group(1)
            if src.startswith('http') or src.startswith('data:'):
                continue
            if src.startswith('/'):
                img_path = os.path.normpath(os.path.join(DIST_DIR, src.lstrip('/')))
            else:
                img_path = os.path.normpath(os.path.join(base_dir, src))
            if os.path.exists(img_path):
                pass
            else:
                print(f"    [FAIL] Missing image in dist: {src} -> {img_path}")
                all_passed = False

    # Uniqueness checks
    print("\n--- UNIQUENESS CHECKS ---")
    if len(set(titles.values())) == len(titles):
        print("[PASS] All 4 page titles are completely unique!")
    else:
        print("[FAIL] Duplicate titles detected!")
        all_passed = False

    if len(set(descriptions.values())) == len(descriptions):
        print("[PASS] All 4 descriptions are completely unique!")
    else:
        print("[FAIL] Duplicate descriptions detected!")
        all_passed = False

    return all_passed

if __name__ == '__main__':
    s = check_sitemap()
    r = check_robots()
    p = check_pages()
    print("\n==========================================")
    if s and r and p:
        print("ALL STATIC PRODUCTION DIST CHECKS PASSED!")
    else:
        print("SOME CHECKS REQUIRE ATTENTION")
    print("==========================================")
