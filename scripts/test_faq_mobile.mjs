import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  const viewports = [
    { w: 390, h: 844, name: '390' },
    { w: 360, h: 740, name: '360' },
    { w: 320, h: 568, name: '320' },
    { w: 1440, h: 900, name: '1440' }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto('http://localhost:4321/faqs/', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });
    await page.screenshot({ path: `scratch/faq_current_${vp.name}.png`, fullPage: false });
  }

  // Also capture homepage at 390
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const ov = document.getElementById('bn-intro-overlay');
    if (ov) ov.remove();
    document.body.classList.remove('bn-intro-active');
    document.documentElement.classList.remove('bn-show-intro');
  });
  await page.screenshot({ path: 'scratch/home_current_390.png', fullPage: false });

  await browser.close();
  console.log('Screenshots captured successfully.');
}

capture().catch(console.error);
