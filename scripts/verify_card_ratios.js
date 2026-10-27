import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4545/');

  // Scroll down to services section so lazy images load
  await page.locator('#services').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Wait for all images in .service-photo-card to be loaded
  await page.waitForFunction(() => {
    const imgs = Array.from(document.querySelectorAll('.service-photo-card .card-media img'));
    return imgs.every(img => img.complete && img.naturalWidth > 0);
  });

  const cards = await page.locator('.service-photo-card .card-media img').all();
  console.log('Total card images loaded:', cards.length);

  for (let i = 0; i < cards.length; i++) {
    const box = await cards[i].boundingBox();
    const ratio = box.width / box.height;
    console.log(`Card ${i + 1}: ${box.width.toFixed(1)}px x ${box.height.toFixed(1)}px -> ratio: ${ratio.toFixed(3)} (target: 1.500)`);
  }

  // Capture screenshot of Group A & Group B section with all images loaded
  const section = page.locator('#services');
  await section.screenshot({ path: '.planning/screenshots/services_section_3_2_verified.png' });
  console.log('Saved screenshot: .planning/screenshots/services_section_3_2_verified.png');

  await browser.close();
}

check();
