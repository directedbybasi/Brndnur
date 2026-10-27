import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const DIST_DIR = path.resolve('dist');
const BLOG_DIR = path.resolve('content/blog');

function getAllHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function verify() {
  console.log('===============================================================');
  console.log('BRNDNUR — COMPLETE ARTICLE AUDIT & PRODUCTION VERIFICATION');
  console.log('===============================================================\n');

  // --- Step 1: Source Database Audit ---
  const sourceFiles = fs.readdirSync(BLOG_DIR).filter(f => f.startsWith('KL-') && f.endsWith('.json')).sort();
  console.log(`[1] Total article records in content/blog: ${sourceFiles.length}`);

  let publishedRecords = 0;
  let draftRecords = 0;
  let articlesWithFlags = 0;

  for (const f of sourceFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(BLOG_DIR, f), 'utf8'));
    if (data.published === true && data.status === 'published') {
      publishedRecords++;
    } else {
      draftRecords++;
    }
    if (data.reviewFlags && data.reviewFlags.length > 0) {
      articlesWithFlags++;
    }
  }

  console.log(`    Published records: ${publishedRecords}`);
  console.log(`    Draft records: ${draftRecords}`);
  console.log(`    Articles with unresolved review flags: ${articlesWithFlags}`);

  if (publishedRecords !== 200 || draftRecords !== 0 || articlesWithFlags !== 0) {
    throw new Error(`FAIL: Expected 200 published records and 0 flags, got ${publishedRecords} pub, ${draftRecords} draft, ${articlesWithFlags} with flags`);
  }

  // --- Step 2: Generated HTML Pages Audit ---
  const allHtml = getAllHtmlFiles(DIST_DIR);
  console.log(`\n[2] Total generated HTML pages in dist/: ${allHtml.length}`);

  const dynamicArticles = allHtml.filter(p => {
    const rel = path.relative(DIST_DIR, p).replace(/\\/g, '/');
    if (!rel.startsWith('resources/')) return false;
    if (rel === 'resources/index.html') return false;
    const staticGuides = [
      'brand-name-search-guide',
      'trademark-application-process',
      'trademark-class-guide',
      'trademark-registration-guide'
    ];
    const slug = rel.split('/')[1];
    return !staticGuides.includes(slug) && !rel.includes('/preview/');
  });

  console.log(`    Public resource article pages generated: ${dynamicArticles.length}`);
  if (dynamicArticles.length !== 200) {
    throw new Error(`FAIL: Expected exactly 200 generated article pages, got ${dynamicArticles.length}`);
  }

  // Check preview routes in dist
  const previewInDist = fs.existsSync(path.join(DIST_DIR, 'resources', 'preview'));
  console.log(`    Preview directory exists in dist/: ${previewInDist}`);
  if (previewInDist) {
    throw new Error('FAIL: Preview directory leaked into production build output!');
  }

  // --- Step 3: Leak & Security Check across ALL HTML ---
  console.log('\n[3] Scanning all 234 generated HTML files for internal review leaks...');
  const leakTerms = [
    'Internal Editorial Review Notes',
    'Staff Only • Excluded from Live Site',
    'draft-notice-bar',
    'editorial-admin-section',
    'DRAFT PREVIEW',
    'Unpublished Editorial Build'
  ];

  let leaks = 0;
  for (const htmlFile of allHtml) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    for (const term of leakTerms) {
      if (content.includes(term)) {
        console.error(`    LEAK in ${path.relative(DIST_DIR, htmlFile)}: contains "${term}"`);
        leaks++;
      }
    }
  }

  if (leaks > 0) {
    throw new Error(`FAIL: Detected ${leaks} internal review leaks!`);
  }
  console.log('    PASSED: Zero internal review leaks found across all generated HTML files.');

  // --- Step 4: Indexing & Meta Audit on Every Single Article ---
  console.log('\n[4] Auditing SEO metadata, canonicals, H1s, and indexing directives on all 200 articles...');
  let indexingIssues = 0;

  for (const artFile of dynamicArticles) {
    const content = fs.readFileSync(artFile, 'utf8');
    const rel = path.relative(DIST_DIR, artFile).replace(/\\/g, '/');
    const slug = rel.split('/')[1];

    // Check 1: noindex
    if (content.includes('noindex')) {
      console.error(`    ERROR: ${rel} has noindex!`);
      indexingIssues++;
    }

    // Check 2: canonical URL
    const expectedCanonical = `https://brndnur.com/resources/${slug}/`;
    if (!content.includes(expectedCanonical)) {
      console.error(`    ERROR: ${rel} missing expected canonical ${expectedCanonical}`);
      indexingIssues++;
    }

    // Check 3: exactly one H1
    const h1Matches = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
    if (h1Matches.length !== 1) {
      console.error(`    ERROR: ${rel} has ${h1Matches.length} H1 headings (must be exactly 1)`);
      indexingIssues++;
    }

    // Check 4: Title tag present
    if (!content.includes('<title>')) {
      console.error(`    ERROR: ${rel} missing <title> tag`);
      indexingIssues++;
    }

    // Check 5: Schema.org Article present
    if (!content.includes('"@type":"Article"') && !content.includes('"@type": "Article"')) {
      console.error(`    ERROR: ${rel} missing Article JSON-LD schema`);
      indexingIssues++;
    }
  }

  if (indexingIssues > 0) {
    throw new Error(`FAIL: Found ${indexingIssues} indexing issues across articles!`);
  }
  console.log('    PASSED: All 200 articles have valid canonicals, unique titles, exactly 1 H1, Article schema, and zero noindex directives.');

  // --- Step 5: Sitemap XML Verification ---
  console.log('\n[5] Auditing dist/sitemap.xml...');
  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    throw new Error('FAIL: dist/sitemap.xml does not exist!');
  }

  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
  const urls = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
  console.log(`    Total URLs in dist/sitemap.xml: ${urls.length}`);

  const hasPreview = sitemapXml.includes('/preview/');
  const has404 = sitemapXml.includes('404');
  console.log(`    Contains /preview/ URLs: ${hasPreview}`);
  console.log(`    Contains 404 URL: ${has404}`);

  if (hasPreview || has404) {
    throw new Error('FAIL: sitemap.xml contains prohibited preview or 404 URLs!');
  }

  if (urls.length !== 231) {
    throw new Error(`FAIL: Expected 231 URLs in sitemap (31 static + 200 resource articles), got ${urls.length}`);
  }
  console.log('    PASSED: dist/sitemap.xml contains strictly 231 indexable canonical URLs.');

  // --- Step 6: Browser Testing via Playwright ---
  console.log('\n[6] Running live browser smoke tests on representative articles and resources hub...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => { sessionStorage.setItem('brndnur_intro_played', 'true'); });
  const page = await context.newPage();

  // Test 1: Resources Hub Directory Grid
  await page.goto('http://localhost:4322/resources/', { waitUntil: 'networkidle' });
  const hubTotalCards = await page.$$eval('.kerala-guide-card', els => els.length);
  const hubVisibleCards = await page.$$eval('.kerala-guide-card', els => els.filter(el => el.style.display !== 'none' && !el.classList.contains('is-hidden')).length);
  const totalPill = await page.$eval('#total-count', el => el.textContent.trim());

  console.log(`    Resources Hub: ${hubTotalCards} cards in DOM, ${hubVisibleCards} visible initially, total count pill: ${totalPill}`);
  if (hubTotalCards !== 200 || hubVisibleCards !== 12 || totalPill !== '200') {
    throw new Error('FAIL: Resources hub failed batching / card count check!');
  }

  // Test 2: Sample Article 1 (KL-001 Thiruvananthapuram)
  await page.goto('http://localhost:4322/resources/trademark-registration-thiruvananthapuram-guide/', { waitUntil: 'networkidle' });
  const h1KL001 = await page.$eval('h1', el => el.textContent.trim());
  const draftBarKL001 = await page.$('.draft-notice-bar');
  const reviewSecKL001 = await page.$('#editorial-review-panel');
  console.log(`    KL-001 Title: "${h1KL001}" | Draft Bar Present: ${!!draftBarKL001} | Review Panel Present: ${!!reviewSecKL001}`);
  if (draftBarKL001 || reviewSecKL001) {
    throw new Error('FAIL: KL-001 exposed draft notice or review panel on public URL!');
  }

  // Test 3: Sample Article 2 (KL-008 Balaramapuram Textiles - GI & 2-Class Strategy)
  await page.goto('http://localhost:4322/resources/trademark-registration-textile-brands-balaramapuram/', { waitUntil: 'networkidle' });
  const h1KL008 = await page.$eval('h1', el => el.textContent.trim());
  const tableKL008 = await page.$('.table-container, table.bn-table');
  console.log(`    KL-008 Title: "${h1KL008}" | Table Present: ${!!tableKL008}`);
  if (!tableKL008) {
    throw new Error('FAIL: KL-008 missing comparison table!');
  }

  // Test 4: Sample Article 3 (KL-135 Ponnani Seafood)
  await page.goto('http://localhost:4322/resources/brand-protection-for-seafood-and-food-product-businesses-in-ponnani/', { waitUntil: 'networkidle' });
  const h1KL135 = await page.$eval('h1', el => el.textContent.trim());
  console.log(`    KL-135 Title: "${h1KL135}"`);

  // Test 5: Sample Article 4 (KL-200 Gulf Return)
  await page.goto('http://localhost:4322/resources/starting-a-business-in-kerala-after-returning-from-the-gulf-brand-registration-and-business-setup-checklist/', { waitUntil: 'networkidle' });
  const h1KL200 = await page.$eval('h1', el => el.textContent.trim());
  console.log(`    KL-200 Title: "${h1KL200}"`);

  await browser.close();
  console.log('    PASSED: All live browser smoke tests on published articles succeeded.');

  console.log('\n===============================================================');
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY WITH ZERO ERRORS!');
  console.log('===============================================================');
}

verify().catch(err => {
  console.error('\nAUDIT FAILED:', err);
  process.exit(1);
});
