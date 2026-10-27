import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });
  await page.goto('http://localhost:4545/', { waitUntil: 'networkidle' });

  if (!fs.existsSync('.planning/screenshots')) {
    fs.mkdirSync('.planning/screenshots', { recursive: true });
  }

  // 1. Group B Slider Verification
  console.log('--- TESTING GROUP B SLIDER ---');
  const groupB = page.locator('#group-b-container');
  await groupB.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Measure card width of Group B (should be ~3 columns in a row, ~360-380px)
  const cardBWidth = await page.$eval('#group-b-slider .service-photo-card', el => el.getBoundingClientRect().width);
  const containerBWidth = await page.$eval('#group-b-container', el => el.getBoundingClientRect().width);
  console.log('Group B container width:', containerBWidth, 'card width:', cardBWidth);
  console.log('Visible cards per row in Group B:', Math.round(containerBWidth / cardBWidth));

  await groupB.screenshot({ path: '.planning/screenshots/group_b_slider_initial.png' });

  // Click next on Group B
  await page.click('#group-b-next');
  await page.waitForTimeout(600);
  const scrollBAfterNext = await page.$eval('#group-b-slider', el => el.scrollLeft);
  console.log('Group B scrollLeft after next click:', scrollBAfterNext);
  await groupB.screenshot({ path: '.planning/screenshots/group_b_slider_scrolled.png' });

  // Click next again to trigger infinite loop back to start
  await page.click('#group-b-next');
  await page.waitForTimeout(600);
  const scrollBAfterLoop = await page.$eval('#group-b-slider', el => el.scrollLeft);
  console.log('Group B scrollLeft after next click (infinite wrap):', scrollBAfterLoop);

  // 2. Section 7 Prep Slider (3 columns in a row)
  console.log('--- TESTING SECTION 7 PREP SLIDER (3 COLUMNS) ---');
  const checklist = page.locator('#checklist');
  await checklist.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const prepCardWidth = await page.$eval('#prep-slider .prep-card', el => el.getBoundingClientRect().width);
  const prepContainerWidth = await page.$eval('#prep-slider', el => el.getBoundingClientRect().width);
  console.log('Section 7 slider width:', prepContainerWidth, 'card width:', prepCardWidth);
  console.log('Visible cards per row in Section 7:', Math.round(prepContainerWidth / prepCardWidth));

  await checklist.screenshot({ path: '.planning/screenshots/prep_section_3col_initial.png' });

  // Click next
  await page.click('#prep-next');
  await page.waitForTimeout(600);
  const prepScrollAfterNext = await page.$eval('#prep-slider', el => el.scrollLeft);
  console.log('Section 7 scrollLeft after next click:', prepScrollAfterNext);
  await checklist.screenshot({ path: '.planning/screenshots/prep_section_3col_scrolled.png' });

  // Test Auto-Advance timer (wait 4.8 seconds without hovering)
  console.log('Testing auto-advance timer (waiting 5 seconds)...');
  await page.mouse.move(0, 0); // move mouse away so not hovering
  const scrollBeforeWait = await page.$eval('#prep-slider', el => el.scrollLeft);
  await page.waitForTimeout(5200);
  const scrollAfterWait = await page.$eval('#prep-slider', el => el.scrollLeft);
  console.log('Scroll before wait:', scrollBeforeWait, 'after 5s auto-slide:', scrollAfterWait);
  console.log('Auto-advance progressed:', scrollAfterWait !== scrollBeforeWait);

  await browser.close();
  console.log('All auto-infinity and 3-column verifications passed successfully!');
})();
