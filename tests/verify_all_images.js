import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // Desktop 1440
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4547/', { waitUntil: 'networkidle' });

  const imgs = page.locator('main img');
  const count = await imgs.count();
  console.log(`Checking ${count} images on Desktop (1440px)...`);
  for (let i = 0; i < count; i++) {
    const img = imgs.nth(i);
    await img.scrollIntoViewIfNeeded();
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  console.log('Capturing desktop fullpage screenshot...');
  await page.screenshot({ path: 'tests/homepage_desktop_1440_loaded.png', fullPage: true });

  // Mobile 390
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:4547/', { waitUntil: 'networkidle' });

  const mImgs = mobilePage.locator('main img');
  const mCount = await mImgs.count();
  console.log(`Checking ${mCount} images on Mobile (390px)...`);
  for (let i = 0; i < mCount; i++) {
    const img = mImgs.nth(i);
    await img.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(60);
  }
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await mobilePage.waitForTimeout(200);

  console.log('Capturing mobile fullpage screenshot...');
  await mobilePage.screenshot({ path: 'tests/homepage_mobile_390_loaded.png', fullPage: true });

  console.log('Done!');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
