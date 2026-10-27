import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4545/#checklist', { waitUntil: 'networkidle' });

  const bannerCard = page.locator('.prep-banner-card');
  await bannerCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  if (!fs.existsSync('.planning/screenshots')) {
    fs.mkdirSync('.planning/screenshots', { recursive: true });
  }

  // Check computed styles and text presence
  const data = await page.evaluate(() => {
    const card = document.querySelector('.prep-banner-card');
    const img = card.querySelector('.prep-banner-img');
    const title = card.querySelector('.prep-banner-title');
    const span = card.querySelector('.prep-banner-title span');
    const eyebrow = card.querySelector('.prep-banner-eyebrow');
    const desc = card.querySelector('.prep-banner-desc');

    return {
      imgSrc: img.getAttribute('src'),
      titleText: title.innerText.trim(),
      titleColor: window.getComputedStyle(title).color,
      spanColor: window.getComputedStyle(span).color,
      eyebrowText: eyebrow.innerText.trim(),
      eyebrowColor: window.getComputedStyle(eyebrow).color,
      descText: desc.innerText.trim(),
      descColor: window.getComputedStyle(desc).color,
      isOverlayVisible: window.getComputedStyle(card.querySelector('.prep-banner-overlay')).display !== 'none'
    };
  });

  console.log('Banner Text Overlay Verification Data:', JSON.stringify(data, null, 2));

  // Capture desktop screenshot of the banner card
  await bannerCard.screenshot({ path: '.planning/screenshots/prep_banner_text_overlay_desktop.png' });
  console.log('Desktop banner screenshot saved!');

  // Mobile screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await bannerCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await bannerCard.screenshot({ path: '.planning/screenshots/prep_banner_text_overlay_mobile.png' });
  console.log('Mobile banner screenshot saved!');

  await browser.close();
  console.log('All tests finished successfully!');
})();
