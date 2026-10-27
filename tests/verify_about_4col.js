import { chromium } from 'playwright';

async function verifyAboutCards() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  console.log('========================================================================');
  console.log('VERIFYING ABOUT PAGE: 4 COLUMNS IN ONE ROW');
  console.log('========================================================================\n');

  // Test 1440px Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4545/about/', { waitUntil: 'networkidle' });

  const cards = await page.locator('.advise-grid .advise-card');
  const count = await cards.count();
  console.log(`Found ${count} advise cards.`);

  if (count !== 4) {
    console.error(`❌ Expected 4 cards, found ${count}`);
    await browser.close();
    process.exit(1);
  }

  // Check positions of all 4 cards
  const boxes = [];
  for (let i = 0; i < count; i++) {
    const box = await cards.nth(i).boundingBox();
    boxes.push(box);
  }

  console.log('Card bounding boxes at 1440px:');
  boxes.forEach((b, i) => console.log(`  Card ${i + 1}: top=${b.y.toFixed(1)}, left=${b.x.toFixed(1)}, width=${b.width.toFixed(1)}, height=${b.height.toFixed(1)}`));

  // All 4 cards must have the same top offset (within 2px tolerance) to be in one single row!
  const firstTop = boxes[0].y;
  const allInOneRow = boxes.every(b => Math.abs(b.y - firstTop) < 2);
  if (allInOneRow) {
    console.log('✅ [PASS] All 4 cards are in ONE row on 1440px desktop!');
  } else {
    console.error('❌ [FAIL] Cards wrapped into multiple rows on desktop!');
  }

  // Take screenshot of the "Who We Advise & Support" section
  const section = page.locator('section.section-alt').filter({ hasText: 'Who We Advise & Support' });
  await section.screenshot({ path: 'tests/about_who_we_advise_4col.png' });
  console.log('Saved screenshot to tests/about_who_we_advise_4col.png');

  // Test 1280px Desktop
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(100);
  const boxes1280 = [];
  for (let i = 0; i < count; i++) {
    boxes1280.push(await cards.nth(i).boundingBox());
  }
  const allInOneRow1280 = boxes1280.every(b => Math.abs(b.y - boxes1280[0].y) < 2);
  if (allInOneRow1280) {
    console.log('✅ [PASS] All 4 cards are in ONE row on 1280px desktop!');
  } else {
    console.error('❌ [FAIL] Cards wrapped on 1280px!');
  }

  // Test 768px Tablet (should be 2x2 grid)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(100);
  const box768Card1 = await cards.nth(0).boundingBox();
  const box768Card2 = await cards.nth(1).boundingBox();
  const box768Card3 = await cards.nth(2).boundingBox();
  const is2x2 = Math.abs(box768Card1.y - box768Card2.y) < 2 && box768Card3.y > box768Card1.y + 50;
  if (is2x2) {
    console.log('✅ [PASS] Cards responsively wrap to clean 2x2 grid on 768px tablet!');
  } else {
    console.log('ℹ️ Tablet layout check:', { y1: box768Card1.y, y2: box768Card2.y, y3: box768Card3.y });
  }

  // Test 390px Mobile (should be 1 column stacked)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  const boxMobile1 = await cards.nth(0).boundingBox();
  const boxMobile2 = await cards.nth(1).boundingBox();
  const isStacked = boxMobile2.y > boxMobile1.y + 50;
  if (isStacked) {
    console.log('✅ [PASS] Cards responsively stack into 1 column on 390px mobile!');
  }

  await browser.close();
}

verifyAboutCards().catch(console.error);
