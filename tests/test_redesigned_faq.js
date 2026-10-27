import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const screenshotDir = path.resolve('tests/screenshots_faq_redesign');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch();
  console.log('--- Testing Redesigned Editorial FAQ Section ---');

  // 1. Desktop Test (1440x900)
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4545/#faq-preview', { waitUntil: 'networkidle' });

  const faqSection = page.locator('#faq-preview');
  await faqSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Take Desktop Collapsed Screenshot
  await faqSection.screenshot({ path: path.join(screenshotDir, 'faq_desktop_1440_collapsed.png') });
  console.log('✓ Desktop collapsed screenshot captured: faq_desktop_1440_collapsed.png');

  // Verify Heading & Intro
  const eyebrowText = await page.locator('#faq-preview .faq-eyebrow-text').textContent();
  const titleText = await page.locator('#faq-preview .faq-editorial-title').textContent();
  const descText = await page.locator('#faq-preview .faq-editorial-desc').textContent();
  console.log('Eyebrow:', eyebrowText.trim());
  console.log('Title:', titleText.replace(/\s+/g, ' ').trim());
  console.log('Desc:', descText.replace(/\s+/g, ' ').trim());

  // Verify all 8 items
  const items = page.locator('#faq-preview .faq-row-item');
  const count = await items.count();
  console.log(`Found ${count} FAQ items (expected 8).`);
  if (count !== 8) throw new Error(`Expected 8 items, found ${count}`);

  for (let i = 0; i < 8; i++) {
    const item = items.nth(i);
    const num = await item.locator('.faq-row-num').textContent();
    const q = await item.locator('.faq-row-question').textContent();
    const expectedNum = (i + 1).toString().padStart(2, '0');
    console.log(`  [${num.trim()}] ${q.trim()}`);
    if (num.trim() !== expectedNum) throw new Error(`Mismatch in item number at index ${i}: got ${num}, expected ${expectedNum}`);
  }

  // Open first item to test interaction and plus->minus
  const firstItem = items.first();
  const firstSummary = firstItem.locator('.faq-row-summary');
  await firstSummary.click();
  await page.waitForTimeout(300);

  const isOpen = await firstItem.evaluate(el => el.hasAttribute('open'));
  console.log('First item isOpen after click:', isOpen);
  if (!isOpen) throw new Error('First item did not open when clicked!');

  // Check vertical line opacity in open state
  const lineVOpacity = await firstItem.locator('.line-v').evaluate(el => window.getComputedStyle(el).opacity);
  console.log('Vertical line opacity in open state:', lineVOpacity);
  if (lineVOpacity !== '0') throw new Error(`Vertical line should have opacity 0 in open state, got ${lineVOpacity}`);

  // Take Desktop Expanded Screenshot
  await faqSection.screenshot({ path: path.join(screenshotDir, 'faq_desktop_1440_expanded.png') });
  console.log('✓ Desktop expanded screenshot captured: faq_desktop_1440_expanded.png');

  // Test Collapse
  await firstSummary.click();
  await page.waitForTimeout(300);
  const isClosed = await firstItem.evaluate(el => !el.hasAttribute('open'));
  console.log('First item isClosed after 2nd click:', isClosed);
  if (!isClosed) throw new Error('First item did not close when clicked again!');

  // Check View All button
  const viewAllBtn = page.locator('#faq-preview .faq-editorial-btn');
  const href = await viewAllBtn.getAttribute('href');
  const btnText = await viewAllBtn.textContent();
  console.log(`View all button href: '${href}', text: '${btnText.replace(/\s+/g, ' ').trim()}'`);
  if (href !== '/faqs/') throw new Error(`View all button href mismatch: ${href}`);

  // 2. Tablet Test (768x1024)
  const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await tabletPage.goto('http://localhost:4545/#faq-preview', { waitUntil: 'networkidle' });
  const tabletFaq = tabletPage.locator('#faq-preview');
  await tabletFaq.scrollIntoViewIfNeeded();
  await tabletPage.waitForTimeout(400);

  // Open item 02 on tablet
  await tabletFaq.locator('.faq-row-summary').nth(1).click();
  await tabletPage.waitForTimeout(300);
  await tabletFaq.screenshot({ path: path.join(screenshotDir, 'faq_tablet_768.png') });
  console.log('✓ Tablet screenshot captured: faq_tablet_768.png');

  // 3. Mobile Test (390x844)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:4545/#faq-preview', { waitUntil: 'networkidle' });
  const mobileFaq = mobilePage.locator('#faq-preview');
  await mobileFaq.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(400);

  // Check mobile overflow
  const isOverflowing = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow detected:', isOverflowing);
  if (isOverflowing) throw new Error('Horizontal overflow detected on mobile!');

  // Open item 01 on mobile
  await mobileFaq.locator('.faq-row-summary').nth(0).click();
  await mobilePage.waitForTimeout(300);
  await mobileFaq.screenshot({ path: path.join(screenshotDir, 'faq_mobile_390.png') });
  console.log('✓ Mobile screenshot captured: faq_mobile_390.png');

  await browser.close();
  console.log('--- ALL FAQ REDESIGN TESTS PASSED SUCCESSFULLY! ---');
})();
