import { chromium } from 'playwright';
import fs from 'fs';

const outDir = 'scratch/final_verification';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: '320', w: 320, h: 568 },
  { name: '360', w: 360, h: 740 },
  { name: '375', w: 375, h: 667 },
  { name: '390', w: 390, h: 844 },
  { name: '430', w: 430, h: 932 },
  { name: '768', w: 768, h: 1024 },
  { name: '1024', w: 1024, h: 768 },
  { name: '1440', w: 1440, h: 900 }
];

async function captureAll() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  // 1. FAQ page across all 8 viewports
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto('http://localhost:4321/faqs/', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });
    await page.screenshot({ path: `${outDir}/faq_${vp.name}.png`, fullPage: false });
  }

  // 2. Representative pages at 390px and 1440px
  const pages = [
    { url: '/', name: 'homepage' },
    { url: '/trademark-registration/', name: 'trademark_reg' },
    { url: '/services/', name: 'services' },
    { url: '/packages/', name: 'packages' },
    { url: '/about/', name: 'about' },
    { url: '/contact/', name: 'contact' },
    { url: '/resources/', name: 'resources' }
  ];

  for (const p of pages) {
    for (const w of [390, 1440]) {
      const h = w === 390 ? 844 : 900;
      await page.setViewportSize({ width: w, height: h });
      await page.goto(`http://localhost:4321${p.url}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        const ov = document.getElementById('bn-intro-overlay');
        if (ov) ov.remove();
        document.body.classList.remove('bn-intro-active');
        document.documentElement.classList.remove('bn-show-intro');
      });
      await page.screenshot({ path: `${outDir}/${p.name}_${w}.png`, fullPage: false });
    }
  }

  await browser.close();
  console.log('All final verification screenshots captured in ' + outDir);
}

captureAll().catch(console.error);
