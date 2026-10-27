import { chromium } from 'playwright';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4545/', { waitUntil: 'networkidle' });

  // Locate the informed section
  const section = page.locator('#informed');
  const screenshotPath = path.resolve('.planning/screenshots/informed_section_4_5_desktop.png');
  await section.screenshot({ path: screenshotPath });
  console.log('Saved screenshot:', screenshotPath);

  // Also mobile viewport
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:4545/', { waitUntil: 'networkidle' });
  const mobileSection = mobilePage.locator('#informed');
  const mobileScreenshotPath = path.resolve('.planning/screenshots/informed_section_4_5_mobile.png');
  await mobileSection.screenshot({ path: mobileScreenshotPath });
  console.log('Saved mobile screenshot:', mobileScreenshotPath);

  await browser.close();
}

capture();
