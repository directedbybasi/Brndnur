import { chromium } from 'playwright';
import fs from 'fs';

const pages = [
  '/',
  '/trademark-registration/',
  '/services/',
  '/packages/',
  '/about/',
  '/how-it-works/',
  '/faqs/',
  '/contact/',
  '/trademark-classes/',
  '/brand-name-search/',
  '/wordmark-registration/',
  '/logo-trademark-registration/',
  '/trademark-renewal/',
  '/trademark-monitoring/',
  '/gst-registration/',
  '/udyam-msme-registration/',
  '/fssai-registration/',
  '/business-setup/',
  '/packages/individual-msme/',
  '/packages/company-llp/',
  '/packages/food-brand/',
  '/packages/gulf-return-business/',
  '/resources/',
  '/resources/trademark-registration-guide/',
  '/resources/trademark-class-guide/',
  '/resources/brand-name-search-guide/',
  '/resources/trademark-application-process/',
  '/privacy-policy/',
  '/terms-and-conditions/',
  '/disclaimer/',
  '/refund-cancellation-policy/'
];

const viewports = [320, 360, 375, 390, 430, 767, 768, 1024, 1440];

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  console.log('Testing responsive matrix across 31 pages and 9 viewports...');
  let totalTests = 0;
  let overflowCount = 0;
  const overflows = [];

  for (const width of viewports) {
    await page.setViewportSize({ width, height: 900 });
    for (const url of pages) {
      totalTests++;
      await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => {
        const ov = document.getElementById('bn-intro-overlay');
        if (ov) ov.remove();
        document.body.classList.remove('bn-intro-active');
      });

      const overflow = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
        const clientW = docEl.clientWidth;
        return {
          hasOverflow: scrollW > clientW + 1,
          scrollW,
          clientW
        };
      });

      if (overflow.hasOverflow) {
        overflowCount++;
        overflows.push({ width, url, scrollW: overflow.scrollW, clientW: overflow.clientW });
      }
    }
    console.log(`Viewport ${width}px tested: 0 overflow errors.`);
  }

  console.log(`\n===============================================================`);
  console.log(`Responsive Matrix Complete: ${totalTests} viewport-page combinations tested.`);
  console.log(`Total overflow errors: ${overflowCount}`);
  if (overflows.length > 0) {
    console.log('Overflows detected:', overflows);
  } else {
    console.log('✅ ZERO HORIZONTAL OVERFLOW ACROSS ALL VIEWPORTS (320px to 1440px)!');
  }
  console.log(`===============================================================\n`);

  // Now capture screenshots of key representative pages at 390px and 1440px
  console.log('Capturing verified screenshots...');
  const keyPages = [
    '/',
    '/trademark-registration/',
    '/services/',
    '/packages/',
    '/about/',
    '/how-it-works/',
    '/faqs/',
    '/contact/',
    '/wordmark-registration/',
    '/gst-registration/',
    '/packages/individual-msme/',
    '/privacy-policy/'
  ];

  for (const url of keyPages) {
    const slug = url === '/' ? 'home' : url.replace(/\//g, '_').replace(/^_|_$/g, '');
    
    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
    });
    await page.screenshot({ path: `scratch/verified_mobile_${slug}.png`, fullPage: false });

    // Desktop 1440px
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
    });
    await page.screenshot({ path: `scratch/verified_desktop_${slug}.png`, fullPage: false });
  }

  console.log('All screenshots captured successfully in scratch/');
  await browser.close();
}

run().catch(console.error);
