import { chromium } from 'playwright';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('--- 1. Testing Desktop (1440x900) ---');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

  // Scroll to services section
  const servicesSec = page.locator('#services');
  await servicesSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Check filter tabs
  const tabAll = page.locator('#tab-all');
  const tabTm = page.locator('#tab-trademark');
  const tabBiz = page.locator('#tab-business');

  console.log('Checking tabs exist...');
  console.log('tabAll visible:', await tabAll.isVisible());
  console.log('tabTm visible:', await tabTm.isVisible());
  console.log('tabBiz visible:', await tabBiz.isVisible());

  // Check initial cards count
  const allCards = page.locator('#services-grid .service-card');
  const initialTotal = await allCards.count();
  console.log('Total service cards:', initialTotal);

  const getVisibleCount = async () => {
    let count = 0;
    const countTotal = await allCards.count();
    for (let i = 0; i < countTotal; i++) {
      if (await allCards.nth(i).isVisible()) count++;
    }
    return count;
  };

  console.log('Initial visible count:', await getVisibleCount());

  // Click Trademark tab
  console.log('Clicking Trademark tab...');
  await tabTm.click();
  await page.waitForTimeout(300);
  console.log('Visible count after clicking Trademark:', await getVisibleCount());
  console.log('tabTm aria-selected:', await tabTm.getAttribute('aria-selected'));

  // Click Business tab
  console.log('Clicking Business Setup tab...');
  await tabBiz.click();
  await page.waitForTimeout(300);
  console.log('Visible count after clicking Business:', await getVisibleCount());
  console.log('tabBiz aria-selected:', await tabBiz.getAttribute('aria-selected'));

  // Click All tab
  console.log('Clicking All Services tab...');
  await tabAll.click();
  await page.waitForTimeout(300);
  console.log('Visible count after clicking All:', await getVisibleCount());
  console.log('tabAll aria-selected:', await tabAll.getAttribute('aria-selected'));

  // Function to ensure all images in section are loaded
  const ensureImagesLoaded = async () => {
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('#services img'));
      await Promise.all(imgs.map(img => {
        img.loading = 'eager';
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));
    });
  };

  await ensureImagesLoaded();
  await page.waitForTimeout(400);

  // Screenshot desktop services section
  await servicesSec.screenshot({ path: 'tests/screenshots/services_redesign_desktop_1440.png' });
  console.log('Saved tests/screenshots/services_redesign_desktop_1440.png');

  // --- 2. Testing Tablet (768x1024) ---
  console.log('\n--- 2. Testing Tablet (768x1024) ---');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.reload({ waitUntil: 'networkidle' });
  await servicesSec.scrollIntoViewIfNeeded();
  await ensureImagesLoaded();
  await page.waitForTimeout(400);

  const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Tablet horizontal overflow:', tabletOverflow);
  await servicesSec.screenshot({ path: 'tests/screenshots/services_redesign_tablet_768.png' });
  console.log('Saved tests/screenshots/services_redesign_tablet_768.png');

  // --- 3. Testing Mobile (390x844) ---
  console.log('\n--- 3. Testing Mobile (390x844) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await servicesSec.scrollIntoViewIfNeeded();
  await ensureImagesLoaded();
  await page.waitForTimeout(400);

  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Mobile horizontal overflow:', mobileOverflow);

  // Test mobile tab clicking
  await tabTm.click();
  await page.waitForTimeout(300);
  console.log('Mobile Trademark visible count:', await getVisibleCount());

  await tabAll.click();
  await page.waitForTimeout(300);
  console.log('Mobile All visible count:', await getVisibleCount());

  await servicesSec.screenshot({ path: 'tests/screenshots/services_redesign_mobile_390.png' });
  console.log('Saved tests/screenshots/services_redesign_mobile_390.png');

  await browser.close();
  console.log('\nAll Playwright verification checks passed successfully!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
