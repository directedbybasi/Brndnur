import { chromium } from 'playwright';

const ROUTES = [
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
  '/refund-cancellation-policy/',
  '/404.html'
];

const VIEWPORTS = [
  { name: 'Narrow Mobile (360px)', width: 360, height: 800 },
  { name: 'Standard Mobile (390px)', width: 390, height: 844 },
  { name: 'Large Mobile (430px)', width: 430, height: 932 }
];

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    console.log(`\nAuditing Viewport: ${vp.name}`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `http://localhost:4545${route}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const overflow = await page.evaluate(() => {
          const docW = document.documentElement.clientWidth;
          const scrollW = document.documentElement.scrollWidth;
          const bodyW = document.body.clientWidth;
          const hasOverflow = scrollW > docW;
          
          let culprit = null;
          if (hasOverflow) {
            const list = [];
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > docW + 1.5) {
                list.push({
                  tag: el.tagName,
                  id: el.id,
                  cls: el.className,
                  right: Math.round(r.right),
                  width: Math.round(r.width)
                });
              }
            });
            culprit = list.slice(0, 5);
          }

          return { docW, scrollW, bodyW, hasOverflow, culprit };
        });

        if (overflow.hasOverflow) {
          console.log(`❌ [OVERFLOW] ${route} (doc: ${overflow.docW}px, scroll: ${overflow.scrollW}px)`);
          console.log(`   Culprits:`, overflow.culprit);
          results.push({ vp: vp.name, route, ...overflow });
        } else {
          // passed
        }
      } catch (err) {
        console.error(`Error loading ${route}:`, err.message);
      }
    }
    await context.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`Total Overflow Issues Found: ${results.length}`);
  console.log(`======================================================`);
}

main();
