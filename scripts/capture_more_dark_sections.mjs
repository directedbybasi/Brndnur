import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:4321/trademark-registration/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const ov = document.getElementById('bn-intro-overlay');
    if (ov) ov.remove();
    document.body.classList.remove('bn-intro-active');
  });

  const sec = await page.locator('section#documents');
  if (await sec.count() > 0) {
    await sec.scrollIntoViewIfNeeded();
    await sec.screenshot({ path: 'scratch/tm_docs_before_390.png' });
  }

  // Also check About page "Who We Advise" section
  await page.goto('http://localhost:4321/about/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const ov = document.getElementById('bn-intro-overlay');
    if (ov) ov.remove();
    document.body.classList.remove('bn-intro-active');
  });

  const aboutSec = await page.locator('section#who-we-advise');
  if (await aboutSec.count() > 0) {
    await aboutSec.scrollIntoViewIfNeeded();
    await aboutSec.screenshot({ path: 'scratch/about_advise_before_390.png' });
  }

  await browser.close();
  console.log('TM docs & about advise captured.');
}

check().catch(console.error);
