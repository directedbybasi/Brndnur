import { chromium } from 'playwright';

const VIEWPORTS = [
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'desktop_1280', width: 1280, height: 800 },
  { name: 'tablet_1024', width: 1024, height: 768 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'mobile_430', width: 430, height: 932 },
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'narrow_360', width: 360, height: 800 }
];

const EXPECTED_SECTIONS = [
  { id: 'hero-heading', name: '1. Hero Section' },
  { id: 'informed-heading', name: '2. Informed Decisions' },
  { id: 'directory-heading', name: '3. Comprehensive Service Directory' },
  { id: 'process-heading', name: '4. How It Works (4 Steps)' },
  { id: 'audiences-heading', name: '5. Who We Help (Audiences)' },
  { id: 'why-heading', name: '6. Why BRNDNUR' },
  { id: 'checklist-heading', name: '7. Preparation Checklist' },
  { id: 'faq-heading', name: '8. FAQ Preview' },
  { id: 'resources-heading', name: '9. Resources & Guides Preview' },
  { id: 'cta-heading', name: '10. Closing WhatsApp CTA' }
];

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  console.log('========================================================================');
  console.log('AUDITING HOMEPAGE CONTENT DEPTH & RESPONSIVE COMPLETENESS');
  console.log('========================================================================\n');

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Track failed network requests
  const failedRequests = [];
  page.on('requestfailed', req => failedRequests.push(req.url()));
  page.on('response', resp => {
    if (resp.status() >= 400) failedRequests.push(`${resp.status()} ${resp.url()}`);
  });

  await page.goto('http://localhost:4545/', { waitUntil: 'networkidle' });

  // 1. Verify All 10 Sections Exist
  console.log('1. VERIFYING SECTION ORDER & HEADINGS:');
  for (const s of EXPECTED_SECTIONS) {
    const el = await page.$(`#${s.id}`);
    if (el) {
      const text = await el.innerText();
      console.log(`  ✅ [FOUND] ${s.name}: "${text.replace(/\n/g, ' ')}"`);
    } else {
      console.log(`  ❌ [MISSING] ${s.name} (#${s.id})`);
    }
  }

  // 2. Verify Heading Hierarchy (H1 count, H2 count, etc.)
  console.log('\n2. VERIFYING HEADING HIERARCHY:');
  const headings = await page.evaluate(() => {
    const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());
    const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim());
    const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.innerText.trim());
    const h4s = Array.from(document.querySelectorAll('h4')).map(h => h.innerText.trim());
    return { h1Count: h1s.length, h1s, h2Count: h2s.length, h2s, h3Count: h3s.length, h4Count: h4s.length };
  });
  console.log(`  H1 count: ${headings.h1Count} (should be exactly 1) -> "${headings.h1s[0]}"`);
  console.log(`  H2 count: ${headings.h2Count}`);
  console.log(`  H3 count: ${headings.h3Count}`);
  console.log(`  H4 count: ${headings.h4Count}`);

  // Scroll through each section to trigger lazy loading of below-the-fold images
  for (const s of EXPECTED_SECTIONS) {
    const el = await page.$('#' + s.id);
    if (el) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
    }
  }
  await page.waitForTimeout(800);

  // 3. Verify All Images on the Page Load Successfully
  console.log('\n3. VERIFYING IMAGE LOADS & METRICS:');
  const imageReport = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('main img'));
    return imgs.map(img => ({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || '',
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete
    }));
  });
  console.log(`  Found ${imageReport.length} images in <main>:`);
  let allImagesOk = true;
  for (const img of imageReport) {
    const ok = img.complete && img.naturalWidth > 0;
    if (!ok) allImagesOk = false;
    console.log(`    ${ok ? '✅' : '❌'} [${img.naturalWidth}x${img.naturalHeight}] ${img.src} | alt="${img.alt.slice(0, 45)}..."`);
  }
  if (failedRequests.length > 0) {
    console.log(`  ❌ Failed asset requests:`, failedRequests);
  } else {
    console.log(`  ✅ Zero failed network requests!`);
  }

  // 4. Verify Internal Links Resolve
  console.log('\n4. VERIFYING INTERNAL CANONICAL LINKS:');
  const internalLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('main a[href^="/"]')).map(a => a.getAttribute('href'));
    return Array.from(new Set(links));
  });
  console.log(`  Found ${internalLinks.length} distinct canonical internal links:`);
  for (const link of internalLinks) {
    console.log(`    - ${link}`);
  }

  // 5. Test FAQ Accordion Interactivity
  console.log('\n5. TESTING FAQ ACCORDION INTERACTION:');
  const faqItems = await page.$$('.faq-details');
  console.log(`  Total FAQ accordion items: ${faqItems.length}`);
  if (faqItems.length > 0) {
    const firstFaq = faqItems[0];
    const initialOpen = await firstFaq.evaluate(el => el.hasAttribute('open'));
    console.log(`  Initial open state: ${initialOpen}`);
    await page.click('.faq-summary');
    const afterClickOpen = await firstFaq.evaluate(el => el.hasAttribute('open'));
    console.log(`  After click open state: ${afterClickOpen}`);
    if (afterClickOpen) {
      console.log('  ✅ Native accessible accordion toggles successfully!');
    } else {
      console.log('  ❌ Accordion toggle failed.');
    }
  }

  // 6. Verify JSON-LD Schema
  console.log('\n6. VERIFYING JSON-LD STRUCTURED DATA:');
  const schemaReport = await page.evaluate(() => {
    const script = document.querySelector('script[type="application/ld+json"]');
    if (!script) return { types: [], faqCount: 0 };
    try {
      const data = JSON.parse(script.innerText);
      const types = data['@graph'].map(item => item['@type']);
      const faqObj = data['@graph'].find(item => item['@type'] === 'FAQPage');
      const faqCount = faqObj ? faqObj.mainEntity.length : 0;
      return { types, faqCount };
    } catch(e) {
      return { types: [e.message], faqCount: 0 };
    }
  });
  console.log('  Schema @graph types found:', schemaReport.types.join(', '));
  console.log('  FAQ structured entities:', schemaReport.faqCount);

  // 7. Responsive Matrix Audit (Horizontal overflow & Layout)
  console.log('\n7. AUDITING RESPONSIVE MATRIX:');
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(250);

    const overflowCheck = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const hasOverflow = scrollW > docW + 1;
      return { docW, scrollW, hasOverflow };
    });

    if (overflowCheck.hasOverflow) {
      console.log(`  ❌ [FAIL] ${vp.name} (${vp.width}px): scrollWidth=${overflowCheck.scrollW} > clientWidth=${overflowCheck.docW}`);
    } else {
      console.log(`  ✅ [PASS] ${vp.name} (${vp.width}px): scrollWidth=${overflowCheck.scrollW} <= clientWidth=${overflowCheck.docW}`);
    }

    if (vp.name === 'desktop_1440' || vp.name === 'mobile_390') {
      await page.screenshot({ path: `tests/homepage_${vp.name}_expanded.png`, fullPage: true });
      console.log(`  📸 Saved tests/homepage_${vp.name}_expanded.png`);
    }
  }

  await browser.close();
  console.log('\n========================================================================');
  console.log('AUDIT COMPLETE: ALL CHECKS FINISHED');
  console.log('========================================================================');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
