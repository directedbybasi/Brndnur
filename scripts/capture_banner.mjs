import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const ov = document.getElementById('bn-intro-overlay');
    if (ov) ov.remove();
    document.body.classList.remove('bn-intro-active');
  });
  const banner = await page.$('.services-footer-banner');
  if (banner) {
    await banner.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await banner.screenshot({ path: 'scratch/banner_now.png' });
    console.log('Saved scratch/banner_now.png');
  }
  await browser.close();
}

run().catch(console.error);
