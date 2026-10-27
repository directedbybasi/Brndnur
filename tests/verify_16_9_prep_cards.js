import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  await page.goto('http://localhost:4545/#checklist', { waitUntil: 'networkidle' });

  const slider = page.locator('.prep-cards-track');
  await slider.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  if (!fs.existsSync('.planning/screenshots')) {
    fs.mkdirSync('.planning/screenshots', { recursive: true });
  }

  // Check card media aspect ratio and img natural dimensions
  const cardsData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.prep-card'));
    return cards.map((card, i) => {
      const media = card.querySelector('.prep-card-media');
      const img = card.querySelector('.prep-card-media img');
      const rect = media.getBoundingClientRect();
      return {
        index: i + 1,
        title: card.querySelector('h3').innerText.trim(),
        mediaWidth: rect.width,
        mediaHeight: rect.height,
        ratio: (rect.width / rect.height).toFixed(4),
        imgNaturalWidth: img.naturalWidth,
        imgNaturalHeight: img.naturalHeight,
        imgSrc: img.getAttribute('src')
      };
    });
  });

  console.log('Cards 16:9 Verification Data:', JSON.stringify(cardsData, null, 2));

  // Screenshot Cards 1-3 (start position)
  await page.locator('#checklist').screenshot({ path: '.planning/screenshots/prep_cards_16_9_start.png' });
  console.log('Saved prep_cards_16_9_start.png');

  // Click next button to inspect Cards 2-4
  await page.click('#prep-next');
  await page.waitForTimeout(500);

  // Click dot 5 to scroll to Cards 4-6
  await page.click('#prep-dots button[data-index="5"]');
  await page.waitForTimeout(600);
  await page.locator('#checklist').screenshot({ path: '.planning/screenshots/prep_cards_16_9_end.png' });
  console.log('Saved prep_cards_16_9_end.png');

  // Mobile screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await page.locator('#checklist').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator('#checklist').screenshot({ path: '.planning/screenshots/prep_cards_16_9_mobile.png' });
  console.log('Saved prep_cards_16_9_mobile.png');

  await browser.close();
  console.log('Verification finished successfully!');
})();
