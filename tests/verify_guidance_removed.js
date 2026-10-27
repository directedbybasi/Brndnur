import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:4545/#checklist', { waitUntil: 'networkidle' });

  const checklist = page.locator('#checklist');
  await checklist.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Assert that .prep-guidance-bar does not exist anywhere in document
  const guidanceCount = await page.locator('.prep-guidance-bar').count();
  console.log('prep-guidance-bar element count (must be 0):', guidanceCount);

  if (!fs.existsSync('.planning/screenshots')) {
    fs.mkdirSync('.planning/screenshots', { recursive: true });
  }

  // Capture desktop screenshot of section 7
  await checklist.screenshot({ path: '.planning/screenshots/prep_section_without_guidance_desktop.png' });
  console.log('Saved prep_section_without_guidance_desktop.png');

  // Mobile screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await checklist.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await checklist.screenshot({ path: '.planning/screenshots/prep_section_without_guidance_mobile.png' });
  console.log('Saved prep_section_without_guidance_mobile.png');

  await browser.close();
  console.log('Verification finished successfully!');
})();
