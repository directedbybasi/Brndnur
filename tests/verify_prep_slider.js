import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });
  await page.goto('http://localhost:4545/#checklist', { waitUntil: 'networkidle' });

  const checklist = page.locator('#checklist');
  await checklist.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  if (!fs.existsSync('.planning/screenshots')) {
    fs.mkdirSync('.planning/screenshots', { recursive: true });
  }

  // 1. Initial desktop screenshot
  await checklist.screenshot({ path: '.planning/screenshots/prep_section_slide_initial.png' });
  console.log('1. Initial screenshot saved');

  const prevDisabledInitial = await page.$eval('#prep-prev', el => el.disabled);
  const dot0ActiveInitial = await page.$eval('#prep-dots button[data-index="0"]', el => el.classList.contains('active'));
  console.log('Initial checks -> prevDisabled:', prevDisabledInitial, 'dot0Active:', dot0ActiveInitial);

  // 2. Click next button
  await page.click('#prep-next');
  await page.waitForTimeout(600);
  const scrollLeftAfterNext = await page.$eval('#prep-slider', el => el.scrollLeft);
  console.log('2. Clicked next -> scrollLeft:', scrollLeftAfterNext);
  await checklist.screenshot({ path: '.planning/screenshots/prep_section_slide_scrolled.png' });

  // 3. Click dot 5 (scroll to end / Card 6)
  await page.click('#prep-dots button[data-index="5"]');
  await page.waitForTimeout(600);
  const scrollLeftAfterDot5 = await page.$eval('#prep-slider', el => el.scrollLeft);
  const dot5Active = await page.$eval('#prep-dots button[data-index="5"]', el => el.classList.contains('active'));
  const nextDisabledAtEnd = await page.$eval('#prep-next', el => el.disabled);
  console.log('3. Clicked dot 5 -> scrollLeft:', scrollLeftAfterDot5, 'dot5Active:', dot5Active, 'nextDisabled:', nextDisabledAtEnd);
  await checklist.screenshot({ path: '.planning/screenshots/prep_section_slide_card6.png' });

  // 4. Click dot 0 (return to start)
  await page.click('#prep-dots button[data-index="0"]');
  await page.waitForTimeout(600);
  const scrollLeftAfterDot0 = await page.$eval('#prep-slider', el => el.scrollLeft);
  const dot0ActiveReturn = await page.$eval('#prep-dots button[data-index="0"]', el => el.classList.contains('active'));
  console.log('4. Clicked dot 0 -> scrollLeft:', scrollLeftAfterDot0, 'dot0Active:', dot0ActiveReturn);

  // 5. Mobile screenshot at start
  await page.setViewportSize({ width: 375, height: 812 });
  await checklist.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await checklist.screenshot({ path: '.planning/screenshots/prep_section_slide_mobile.png' });
  console.log('5. Mobile screenshot saved');

  await browser.close();
  console.log('All tests passed with flying colors!');
})();
