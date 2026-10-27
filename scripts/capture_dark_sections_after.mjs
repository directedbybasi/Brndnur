import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  const viewports = [
    { name: '390', width: 390, height: 844 },
    { name: '768', width: 768, height: 1024 },
    { name: '1280', width: 1280, height: 800 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    // 1. Packages page
    await page.goto('http://localhost:4321/packages/', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
    });

    const incSec = await page.$('.included-section');
    if (incSec) {
      await incSec.scrollIntoViewIfNeeded();
      await incSec.screenshot({ path: `scratch/packages_included_after_${vp.name}.png` });
    }

    const stepSec = await page.$('.steps-section');
    if (stepSec) {
      await stepSec.scrollIntoViewIfNeeded();
      await stepSec.screenshot({ path: `scratch/packages_steps_after_${vp.name}.png` });
    }

    const finderSec = await page.$('.finder');
    if (finderSec) {
      await finderSec.scrollIntoViewIfNeeded();
      await finderSec.screenshot({ path: `scratch/packages_finder_after_${vp.name}.png` });
    }

    // 2. Trademark Registration page
    await page.goto('http://localhost:4321/trademark-registration/', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
    });

    const docSec = await page.$('#documents');
    if (docSec) {
      await docSec.scrollIntoViewIfNeeded();
      await docSec.screenshot({ path: `scratch/tm_docs_after_${vp.name}.png` });
    }

    // 3. About page
    await page.goto('http://localhost:4321/about/', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
    });

    const adviseSec = await page.$('#who-we-advise');
    if (adviseSec) {
      await adviseSec.scrollIntoViewIfNeeded();
      await adviseSec.screenshot({ path: `scratch/about_advise_after_${vp.name}.png` });
    }
  }

  await browser.close();
  console.log('All verification screenshots captured successfully across viewports.');
}

capture().catch(console.error);
