import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const screenshotDir = path.resolve('tests/screenshots_faq_page');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch();
  console.log('--- Testing Consolidated Unified FAQ Page (30 Items) ---');

  // 1. Desktop Test (1440x900)
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4545/faqs/', { waitUntil: 'networkidle' });

  // 1.1 Verify Page Title & Meta
  const docTitle = await page.title();
  console.log('Document title:', docTitle);
  if (!docTitle.includes('Frequently Asked Questions')) {
    throw new Error(`Unexpected document title: ${docTitle}`);
  }

  // 1.2 Verify Header hierarchy
  const eyebrow = await page.locator('.faq-eyebrow-text').textContent();
  const heading = await page.locator('.faq-page-title').textContent();
  const desc = await page.locator('.faq-page-desc').textContent();
  console.log('Eyebrow:', eyebrow.trim());
  console.log('Heading:', heading.replace(/\s+/g, ' ').trim());
  console.log('Description:', desc.replace(/\s+/g, ' ').trim());

  if (!eyebrow.includes('FREQUENTLY ASKED QUESTIONS')) {
    throw new Error(`Eyebrow mismatch: ${eyebrow}`);
  }
  if (!heading.includes('Everything You Need to Know About') || !heading.includes('Trademarks & Business Registration')) {
    throw new Error(`Heading mismatch: ${heading}`);
  }

  // 1.3 Verify NO old separate category sections
  const oldHeadings = await page.$$eval('.section-heading h2', els => els.map(e => e.textContent));
  console.log('Section headings found (should not include old category names):', oldHeadings);
  for (const h of oldHeadings) {
    if (h.includes('Trademark Registration Essentials') || h.includes('MSME Discounts') || h.includes('GST, Udyam, FSSAI')) {
      throw new Error(`Found leftover legacy category heading: ${h}`);
    }
  }

  // 1.4 Verify All 30 Items
  const items = page.locator('#faq-unified-list .faq-row-item');
  const count = await items.count();
  console.log(`Found ${count} FAQ items (expected 30).`);
  if (count !== 30) {
    throw new Error(`Expected exactly 30 FAQ items, found ${count}`);
  }

  // Check sequential numbering 01 to 30
  for (let i = 0; i < 30; i++) {
    const item = items.nth(i);
    const num = await item.locator('.faq-row-num').textContent();
    const q = await item.locator('.faq-row-question').textContent();
    const expectedNum = (i + 1).toString().padStart(2, '0');
    if (num.trim() !== expectedNum) {
      throw new Error(`Mismatch at index ${i}: got ${num}, expected ${expectedNum}`);
    }
    console.log(`  [${num.trim()}] ${q.trim().slice(0, 50)}...`);
  }

  // 1.5 Test Accordion Interaction
  const firstItem = items.first();
  const firstSummary = firstItem.locator('.faq-row-summary');
  await firstSummary.click();
  await page.waitForTimeout(300);

  const isOpen = await firstItem.evaluate(el => el.hasAttribute('open'));
  console.log('First item isOpen after click:', isOpen);
  if (!isOpen) throw new Error('First item failed to expand!');

  // Check minus state
  const lineVOpacity = await firstItem.locator('.line-v').evaluate(el => window.getComputedStyle(el).opacity);
  console.log('First item vertical line opacity when open:', lineVOpacity);
  if (lineVOpacity !== '0') throw new Error(`Expected vertical line opacity 0, got ${lineVOpacity}`);

  // Screenshot Desktop Open
  await page.screenshot({ path: path.join(screenshotDir, 'faq_page_desktop_1440.png'), fullPage: true });
  console.log('✓ Desktop fullpage screenshot captured: faq_page_desktop_1440.png');

  // Collapse back
  await firstSummary.click();
  await page.waitForTimeout(200);

  // 1.6 Test Search Functionality
  console.log('Testing search functionality...');
  const searchInput = page.locator('#faq-search-input');
  await searchInput.fill('concession');
  await page.waitForTimeout(300);

  const visibleItems = await page.$$eval('#faq-unified-list .faq-row-item', els => 
    els.filter(e => window.getComputedStyle(e).display !== 'none').length
  );
  console.log(`Visible items matching "concession": ${visibleItems}`);
  if (visibleItems === 0 || visibleItems >= 30) {
    throw new Error(`Search filtering failed for "concession": found ${visibleItems}`);
  }

  // Test No Results
  await searchInput.fill('xyz123nonsensequery');
  await page.waitForTimeout(300);
  const noResultsVisible = await page.locator('#faq-no-results').isVisible();
  console.log('No results container visible on nonsense query:', noResultsVisible);
  if (!noResultsVisible) throw new Error('No results container should be visible!');

  // Test Clear Button
  const clearBtn = page.locator('#faq-search-clear');
  await clearBtn.click();
  await page.waitForTimeout(300);
  const allRestored = await page.$$eval('#faq-unified-list .faq-row-item', els => 
    els.filter(e => window.getComputedStyle(e).display !== 'none').length
  );
  console.log(`All items restored after clear: ${allRestored}`);
  if (allRestored !== 30) throw new Error(`Expected 30 items restored, got ${allRestored}`);

  // 1.7 Verify Closing Contact CTA
  const ctaHeading = await page.locator('.cta-band h2').textContent();
  const waBtn = page.locator('.cta-band a.btn-gold');
  const waHref = await waBtn.getAttribute('href');
  console.log('CTA Heading:', ctaHeading.replace(/\s+/g, ' ').trim());
  console.log('WhatsApp link:', waHref);
  if (!waHref.includes('wa.me')) throw new Error('CTA missing WhatsApp link');

  // 2. Tablet Test (768x1024)
  const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await tabletPage.goto('http://localhost:4545/faqs/', { waitUntil: 'networkidle' });
  await tabletPage.waitForTimeout(400);

  const tabletOverflow = await tabletPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Tablet horizontal overflow:', tabletOverflow);
  if (tabletOverflow) throw new Error('Horizontal overflow on tablet!');
  await tabletPage.screenshot({ path: path.join(screenshotDir, 'faq_page_tablet_768.png'), fullPage: false });

  // 3. Mobile Test (390x844)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:4545/faqs/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(400);

  const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Mobile horizontal overflow:', mobileOverflow);
  if (mobileOverflow) throw new Error('Horizontal overflow on mobile!');

  // Open item 01 on mobile
  await mobilePage.locator('#faq-unified-list .faq-row-summary').first().click();
  await mobilePage.waitForTimeout(300);
  await mobilePage.screenshot({ path: path.join(screenshotDir, 'faq_page_mobile_390.png') });
  console.log('✓ Mobile screenshot captured: faq_page_mobile_390.png');

  await browser.close();
  console.log('--- ALL UNIFIED FAQ PAGE TESTS PASSED SUCCESSFULLY! ---');
})();
