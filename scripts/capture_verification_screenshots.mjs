import { chromium } from 'playwright';

const pagesToCapture = [
  { url: '/', name: 'homepage' },
  { url: '/trademark-registration/', name: 'trademark_registration' },
  { url: '/services/', name: 'services' },
  { url: '/packages/', name: 'packages' },
  { url: '/about/', name: 'about' },
  { url: '/how-it-works/', name: 'how_it_works' },
  { url: '/wordmark-registration/', name: 'wordmark_registration' },
  { url: '/privacy-policy/', name: 'privacy_policy' }
];

async function capture() {
  const browser = await chromium.launch();
  
  // Mobile 390px
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await mobileCtx.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const mPage = await mobileCtx.newPage();

  for (const p of pagesToCapture) {
    await mPage.goto(`http://localhost:4321${p.url}`, { waitUntil: 'networkidle' });
    await mPage.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });
    // Wait for fonts & images
    await mPage.waitForTimeout(400);
    await mPage.screenshot({ path: `scratch/mobile_390_${p.name}.png`, fullPage: false });
    console.log(`Saved scratch/mobile_390_${p.name}.png`);
  }
  await mobileCtx.close();

  // Desktop 1280px
  const deskCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await deskCtx.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const dPage = await deskCtx.newPage();

  for (const p of pagesToCapture) {
    await dPage.goto(`http://localhost:4321${p.url}`, { waitUntil: 'networkidle' });
    await dPage.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });
    await dPage.waitForTimeout(400);
    await dPage.screenshot({ path: `scratch/desktop_1280_${p.name}.png`, fullPage: false });
    console.log(`Saved scratch/desktop_1280_${p.name}.png`);
  }
  await deskCtx.close();

  await browser.close();
  console.log('All screenshots captured successfully.');
}

capture().catch(console.error);
