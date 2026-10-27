import os
import sys
import re
import json
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

WORKSPACE_ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
DIST_DIR = os.path.join(WORKSPACE_ROOT, 'dist')
CONTENT_DIR = os.path.join(WORKSPACE_ROOT, 'content')
SRC_DIR = os.path.join(WORKSPACE_ROOT, 'src')

def audit_website():
    report = {
        "summary": {},
        "routes": [],
        "content_records": [],
        "broken_internal_links": [],
        "broken_images": [],
        "heading_issues": [],
        "meta_issues": [],
        "empty_sections": [],
        "short_pages": []
    }

    # 1. Audit Content Records (content/blog/)
    blog_dir = os.path.join(CONTENT_DIR, 'blog')
    json_files = []
    if os.path.exists(blog_dir):
        json_files = [f for f in os.listdir(blog_dir) if f.startswith('KL-') and f.endswith('.json')]
    
    total_articles = len(json_files)
    valid_articles = 0
    article_slugs = set()
    required_fields = ['id', 'district', 'title', 'slug', 'metaTitle', 'metaDescription', 'primaryKeyword', 'quickAnswer', 'h2Sections', 'faqs']
    
    for f in json_files:
        fpath = os.path.join(blog_dir, f)
        try:
            with open(fpath, 'r', encoding='utf-8') as jf:
                data = json.load(jf)
            missing_fields = [rf for rf in required_fields if rf not in data or not data[rf]]
            
            # Check h2Sections
            h2_count = len(data.get('h2Sections', []))
            faq_count = len(data.get('faqs', []))
            
            rec_status = {
                "file": f,
                "id": data.get('id'),
                "slug": data.get('slug'),
                "district": data.get('district'),
                "h2_count": h2_count,
                "faq_count": faq_count,
                "published": data.get('published', False),
                "missing_fields": missing_fields
            }
            if not missing_fields and h2_count >= 2:
                valid_articles += 1
            if data.get('slug'):
                article_slugs.add(data.get('slug'))
            report["content_records"].append(rec_status)
        except Exception as e:
            report["content_records"].append({"file": f, "error": str(e)})

    # 2. Audit Generated HTML files in dist/
    generated_pages = []
    all_known_urls = set()
    
    for root, dirs, files in os.walk(DIST_DIR):
        for file in files:
            if file.endswith('.html'):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, DIST_DIR).replace('\\', '/')
                # Compute route
                if rel_path == 'index.html':
                    route = '/'
                elif rel_path.endswith('/index.html'):
                    route = '/' + rel_path[:-10]
                elif rel_path == '404.html':
                    route = '/404.html'
                else:
                    route = '/' + rel_path
                generated_pages.append((route, full_path, rel_path))
                all_known_urls.add(route)
                if not route.endswith('/') and route != '/404.html':
                    all_known_urls.add(route + '/')

    # 3. Check each generated page
    for route, full_path, rel_path in generated_pages:
        with open(full_path, 'r', encoding='utf-8') as f:
            html = f.read()

        text_length = len(re.sub(r'<[^>]+>', ' ', html).split())

        # Check if redirect page
        is_redirect = 'http-equiv="refresh"' in html.lower() or 'redirecting to' in html.lower()
        if is_redirect:
            # Verify redirect target and canonical
            report["redirect_routes"] = report.get("redirect_routes", [])
            report["redirect_routes"].append(route)
            continue

        # Title check
        m_title = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
        title = m_title.group(1).strip() if m_title else ""
        if not title:
            report["meta_issues"].append({"route": route, "issue": "Missing or empty <title>"})

        # Meta description
        m_desc = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
        desc = m_desc.group(1).strip() if m_desc else ""
        if not desc and route != '/404.html':
            report["meta_issues"].append({"route": route, "issue": "Missing or empty meta description"})

        # Canonical
        m_canon = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', html, re.IGNORECASE)
        canon = m_canon.group(1).strip() if m_canon else ""
        if not canon and route != '/404.html':
            report["meta_issues"].append({"route": route, "issue": "Missing rel=canonical"})

        # H1
        m_h1 = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.IGNORECASE | re.DOTALL)
        if len(m_h1) == 0:
            report["heading_issues"].append({"route": route, "issue": "Missing <h1> tag"})
        elif len(m_h1) > 1:
            report["heading_issues"].append({"route": route, "issue": f"Multiple <h1> tags ({len(m_h1)})"})

        # Short page
        if text_length < 150 and route != '/404.html':
            report["short_pages"].append({"route": route, "word_count": text_length})

        # Check images
        img_srcs = re.findall(r'<img\s+[^>]*src=["\']([^"\']+)["\']', html, re.IGNORECASE)
        for src in img_srcs:
            if src.startswith(('http://', 'https://', 'data:')):
                continue
            clean_src = src.split('?')[0].lstrip('/')
            img_path = os.path.join(DIST_DIR, clean_src.replace('/', os.sep))
            if not os.path.exists(img_path):
                report["broken_images"].append({"route": route, "image_src": src})

        # Check internal links
        a_hrefs = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', html, re.IGNORECASE)
        for href in a_hrefs:
            if href.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:', '#', 'data:')):
                continue
            # Parse internal link
            parsed = urlparse(href)
            path = parsed.path
            if not path or path == '':
                continue
            # Normalize trailing slash
            norm_path = path if path.endswith('/') or path.endswith('.html') else path + '/'
            if norm_path not in all_known_urls and path not in all_known_urls:
                report["broken_internal_links"].append({"from_route": route, "target": href, "normalized": norm_path})

        report["routes"].append({
            "route": route,
            "rel_path": rel_path,
            "title": title,
            "word_count": text_length,
            "has_header": 'bn-header' in html,
            "has_footer": 'bn-footer' in html
        })

    # Summary
    report["summary"] = {
        "total_generated_routes": len(generated_pages),
        "total_content_records": total_articles,
        "valid_content_records": valid_articles,
        "broken_internal_links_count": len(report["broken_internal_links"]),
        "broken_images_count": len(report["broken_images"]),
        "heading_issues_count": len(report["heading_issues"]),
        "meta_issues_count": len(report["meta_issues"]),
        "short_pages_count": len(report["short_pages"])
    }

    out_file = os.path.join(WORKSPACE_ROOT, '.planning', 'site_audit_report.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)

    print("==================================================================")
    print("                 COMPREHENSIVE WEBSITE AUDIT REPORT               ")
    print("==================================================================")
    print(f"Total static pages generated: {len(generated_pages)}")
    print(f"Total content records:        {total_articles} (Valid: {valid_articles})")
    print(f"Broken internal links:        {len(report['broken_internal_links'])}")
    print(f"Broken image references:      {len(report['broken_images'])}")
    print(f"Heading issues:               {len(report['heading_issues'])}")
    print(f"Metadata issues:              {len(report['meta_issues'])}")
    print(f"Suspiciously short pages:     {len(report['short_pages'])}")
    print("==================================================================")
    
    if report['broken_internal_links']:
        print("\nBroken internal links sample (up to 10):")
        for b in report['broken_internal_links'][:10]:
            print(f"  {b['from_route']} -> {b['target']}")

    if report['broken_images']:
        print("\nBroken images sample (up to 10):")
        for img in report['broken_images'][:10]:
            print(f"  {img['route']} -> {img['image_src']}")

    if report['heading_issues']:
        print("\nHeading issues sample (up to 10):")
        for h in report['heading_issues'][:10]:
            print(f"  {h['route']}: {h['issue']}")

    if report['meta_issues']:
        print("\nMeta issues sample (up to 10):")
        for m in report['meta_issues'][:10]:
            print(f"  {m['route']}: {m['issue']}")

if __name__ == '__main__':
    audit_website()
