import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:4321/packages/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const ov = document.getElementById('bn-intro-overlay');
    if (ov) ov.remove();
    document.body.classList.remove('bn-intro-active');
  });

  const sec1 = await page.$('.included-section');
  if (sec1) {
    await sec1.scrollIntoViewIfNeeded();
    await sec1.screenshot({ path: 'scratch/packages_included_before_390.png' });
  }

  const sec2 = await page.$('.steps-section');
  if (sec2) {
    await sec2.scrollIntoViewIfNeeded();
    await sec2.screenshot({ path: 'scratch/packages_steps_before_390.png' });
  }

  await browser.close();
  console.log('Captured defect screenshots successfully.');
}

capture().catch(console.error);
