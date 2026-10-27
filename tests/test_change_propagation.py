import os
import sys
import subprocess
import re
import json

WORKSPACE_ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
PAGE_HERO_COMPONENT = os.path.join(WORKSPACE_ROOT, 'src', 'components', 'hero', 'PageHero.astro')
ABOUT_PAGE = os.path.join(WORKSPACE_ROOT, 'src', 'pages', 'about', 'index.astro')
DIST_SERVICES = os.path.join(WORKSPACE_ROOT, 'dist', 'services', 'index.html')
DIST_ABOUT = os.path.join(WORKSPACE_ROOT, 'dist', 'about', 'index.html')
DIST_PACKAGES = os.path.join(WORKSPACE_ROOT, 'dist', 'packages', 'index.html')

def test_shared_hero_component_propagation():
    print("[TEST 1/3] Testing Shared PageHero Component Propagation...")
    with open(PAGE_HERO_COMPONENT, 'r', encoding='utf-8') as f:
        original_hero = f.read()

    test_attr = 'data-hero-system-test="brndnur-authoritative-hero-verified"'
    if test_attr in original_hero:
        print("ERROR: Test attribute already in PageHero.astro!")
        return False

    target_str = '<section class={`hero page-hero shared-page-hero'
    if target_str not in original_hero:
        print(f"ERROR: '{target_str}' not found in PageHero.astro!")
        return False

    try:
        # Inject harmless test attribute into <section ...
        modified_hero = original_hero.replace(target_str, f'<section {test_attr} class={{`hero page-hero shared-page-hero', 1)
        with open(PAGE_HERO_COMPONENT, 'w', encoding='utf-8') as f:
            f.write(modified_hero)

        print("  -> Injected temporary harmless test attribute into PageHero.astro")
        print("  -> Compiling via npm run build...")
        res = subprocess.run(['npm', 'run', 'build'], cwd=WORKSPACE_ROOT, capture_output=True, text=True, shell=True)
        if res.returncode != 0:
            print("  -> Build failed during test!")
            print(res.stderr)
            return False

        # Verify that all consuming pages in dist/ received this attribute
        targets = [DIST_SERVICES, DIST_ABOUT, DIST_PACKAGES]
        all_passed = True
        for t in targets:
            with open(t, 'r', encoding='utf-8') as f:
                content = f.read()
            if test_attr in content:
                print(f"  -> SUCCESS: Shared hero attribute propagated to {os.path.relpath(t, WORKSPACE_ROOT)}")
            else:
                print(f"  -> FAILED: Shared hero attribute missing from {os.path.relpath(t, WORKSPACE_ROOT)}")
                all_passed = False

        return all_passed
    finally:
        # Revert PageHero.astro
        with open(PAGE_HERO_COMPONENT, 'w', encoding='utf-8') as f:
            f.write(original_hero)
        print("  -> Restored original PageHero.astro cleanly.")

def test_page_specific_hero_content():
    print("\n[TEST 2/3] Testing Page-Specific Hero Content Isolation...")
    with open(ABOUT_PAGE, 'r', encoding='utf-8') as f:
        original_about = f.read()

    target_eyebrow = 'eyebrow="About BRNDNUR Advisory LLP"'
    if target_eyebrow not in original_about:
        print(f"ERROR: '{target_eyebrow}' not found in about/index.astro!")
        return False

    test_marker = 'TEST_PAGE_SPECIFIC_HERO_TITLE_9999'
    modified_about = original_about.replace(target_eyebrow, f'eyebrow="{test_marker}"', 1)

    try:
        with open(ABOUT_PAGE, 'w', encoding='utf-8') as f:
            f.write(modified_about)

        print("  -> Injected temporary eyebrow test string into src/pages/about/index.astro")
        print("  -> Compiling via npm run build...")
        subprocess.run(['npm', 'run', 'build'], cwd=WORKSPACE_ROOT, capture_output=True, text=True, shell=True)

        with open(DIST_ABOUT, 'r', encoding='utf-8') as f:
            about_html = f.read()
        with open(DIST_SERVICES, 'r', encoding='utf-8') as f:
            services_html = f.read()

        about_has = test_marker in about_html
        services_has = test_marker in services_html

        if about_has and not services_has:
            print("  -> SUCCESS: Only target page (About) reflected the content change; Services remained unaffected!")
            return True
        else:
            print(f"  -> FAILED: Isolation failed! About has: {about_has}, Services has: {services_has}")
            return False
    finally:
        with open(ABOUT_PAGE, 'w', encoding='utf-8') as f:
            f.write(original_about)
        print("  -> Restored original src/pages/about/index.astro cleanly.")

def test_content_record_propagation():
    print("\n[TEST 3/3] Testing Dynamic Article Content Record Propagation (content/blog/KL-001.json)...")
    content_file = os.path.join(WORKSPACE_ROOT, 'content', 'blog', 'KL-001.json')
    with open(content_file, 'r', encoding='utf-8') as f:
        original_json = f.read()

    data = json.loads(original_json)
    slug = data['slug']
    target_dist = os.path.join(WORKSPACE_ROOT, 'dist', 'resources', 'preview', slug, 'index.html')

    test_lead = "TEST_PROPAGATION_VERIFICATION_STRING_12345"
    data['quickAnswer'] = test_lead

    try:
        with open(content_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

        print(f"  -> Injected temporary verification string into {os.path.relpath(content_file, WORKSPACE_ROOT)}")
        print("  -> Compiling via npm run build...")
        subprocess.run(['npm', 'run', 'build'], cwd=WORKSPACE_ROOT, capture_output=True, text=True, shell=True)

        if not os.path.exists(target_dist):
            print(f"  -> FAILED: Target dist file {os.path.relpath(target_dist, WORKSPACE_ROOT)} not found!")
            return False

        with open(target_dist, 'r', encoding='utf-8') as f:
            dist_html = f.read()

        if test_lead in dist_html:
            print(f"  -> SUCCESS: Injected content string found in {os.path.relpath(target_dist, WORKSPACE_ROOT)}")
            return True
        else:
            print(f"  -> FAILED: Injected content string missing from {os.path.relpath(target_dist, WORKSPACE_ROOT)}")
            return False
    finally:
        with open(content_file, 'w', encoding='utf-8') as f:
            f.write(original_json)
        print("  -> Restored original content/blog/KL-001.json cleanly.")

def run_all():
    print("==================================================================")
    print("       BRNDNUR CONTROLLED CHANGE PROPAGATION TEST SUITE           ")
    print("==================================================================")
    p1 = test_shared_hero_component_propagation()
    p2 = test_page_specific_hero_content()
    p3 = test_content_record_propagation()

    print("\n  -> Performing final clean production build...")
    subprocess.run(['npm', 'run', 'build'], cwd=WORKSPACE_ROOT, capture_output=True, text=True, shell=True)
    print("  -> Production build complete.")

    all_passed = p1 and p2 and p3
    if all_passed:
        print("\n[FINAL RESULT] All Controlled Propagation Tests: 100% PASSED!")
    else:
        print("\n[FINAL RESULT] Some Controlled Propagation Tests FAILED!")
    return all_passed

if __name__ == '__main__':
    ok = run_all()
    sys.exit(0 if ok else 1)
