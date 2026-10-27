import { chromium } from 'playwright';

async function checkHeros() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  const pagesToTest = [
    { url: '/about/', name: 'about' },
    { url: '/services/', name: 'services' },
    { url: '/packages/', name: 'packages' },
    { url: '/contact/', name: 'contact' },
    { url: '/trademark-registration/', name: 'trademark-registration' },
    { url: '/brand-name-search/', name: 'brand-name-search' },
    { url: '/wordmark-registration/', name: 'wordmark-registration' },
    { url: '/gst-registration/', name: 'gst-registration' }
  ];

  await page.setViewportSize({ width: 390, height: 844 });

  for (const item of pagesToTest) {
    await page.goto(`http://localhost:4321${item.url}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });
    await page.screenshot({ path: `scratch/hero_${item.name}_390.png`, fullPage: false });
  }

  await browser.close();
  console.log('Sample hero screenshots captured.');
}

checkHeros().catch(console.error);
