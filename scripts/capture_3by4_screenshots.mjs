import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  // 1. Services section 2
  await page.goto('http://localhost:4321/services/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const ov = document.getElementById('bn-intro-overlay');
    if (ov) ov.remove();
    document.body.classList.remove('bn-intro-active');
  });
  const secTrademark = await page.$('#trademark-services');
  if (secTrademark) {
    await secTrademark.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'scratch/section_3by4_services_trademark.png' });
    console.log('Saved scratch/section_3by4_services_trademark.png');
  }

  // 2. Trademark registration section 2
  await page.goto('http://localhost:4321/trademark-registration/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const ov = document.getElementById('bn-intro-overlay');
    if (ov) ov.remove();
    document.body.classList.remove('bn-intro-active');
  });
  const secWhy = await page.$('#why');
  if (secWhy) {
    await secWhy.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'scratch/section_3by4_tm_why.png' });
    console.log('Saved scratch/section_3by4_tm_why.png');
  }

  // 3. Packages ongoing support section
  await page.goto('http://localhost:4321/packages/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const ov = document.getElementById('bn-intro-overlay');
    if (ov) ov.remove();
    document.body.classList.remove('bn-intro-active');
  });
  const secOngoing = await page.$('#ongoing-support');
  if (secOngoing) {
    await secOngoing.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'scratch/section_3by4_packages_ongoing.png' });
    console.log('Saved scratch/section_3by4_packages_ongoing.png');
  }

  await context.close();
  await browser.close();
}

capture().catch(console.error);
