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

const MATRIX = [
  { name: 'Narrow Mobile (360x800)', width: 360, height: 800, isMobile: true },
  { name: 'Standard Mobile (390x844)', width: 390, height: 844, isMobile: true },
  { name: 'Large Mobile (430x932)', width: 430, height: 932, isMobile: true },
  { name: 'Tablet Portrait (768x1024)', width: 768, height: 1024, isMobile: false },
  { name: 'Tablet Breakpoint (1023x768)', width: 1023, height: 768, isMobile: false },
  { name: 'Desktop Baseline (1280x800)', width: 1280, height: 800, isMobile: false },
  { name: 'Desktop Baseline (1440x900)', width: 1440, height: 900, isMobile: false }
];

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let totalChecks = 0;
  let passedChecks = 0;
  const issues = [];

  for (const vp of MATRIX) {
    console.log(`\n======================================================`);
    console.log(`Testing Viewport: ${vp.name}`);
    console.log(`======================================================`);

    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const route of ROUTES) {
      totalChecks++;
      try {
        await page.goto(`http://localhost:4545${route}`, { waitUntil: 'domcontentloaded' });
        const check = await page.evaluate((isMobile) => {
          const docW = document.documentElement.clientWidth;
          const scrollW = document.documentElement.scrollWidth;
          const overflow = scrollW > docW + 1;

          const hero = document.querySelector('.hero, .page-hero');
          let heroVoid = false;
          let btnSmall = false;
          let edgeSlam = false;

          if (isMobile && hero) {
            const nextSec = hero.nextElementSibling;
            const heroRect = hero.getBoundingClientRect();
            // Check if there is an empty void of > 120px between content inside hero and hero bottom
            const copy = hero.querySelector('.hero-copy');
            if (copy) {
              const copyRect = copy.getBoundingClientRect();
              const voidHeight = heroRect.bottom - copyRect.bottom;
              if (voidHeight > 100) {
                heroVoid = true;
              }
              // Check if copy is slammed to 0px
              if (copyRect.left < 8) {
                edgeSlam = true;
              }
            }

            // Check button sizes
            const btns = hero.querySelectorAll('.actions .btn');
            btns.forEach(b => {
              const fs = parseFloat(window.getComputedStyle(b).fontSize);
              if (fs < 13) {
                btnSmall = true;
              }
            });
          }

          return { overflow, heroVoid, btnSmall, edgeSlam, docW, scrollW };
        }, vp.isMobile);

        if (check.overflow || check.heroVoid || check.btnSmall || check.edgeSlam) {
          console.log(`❌ [FAIL] ${route}: overflow=${check.overflow}, heroVoid=${check.heroVoid}, btnSmall=${check.btnSmall}, edgeSlam=${check.edgeSlam}`);
          issues.push({ vp: vp.name, route, check });
        } else {
          passedChecks++;
        }
      } catch (err) {
        console.error(`Error on ${route}:`, err.message);
        issues.push({ vp: vp.name, route, error: err.message });
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`FINAL RESPONSIVE MATRIX AUDIT REPORT`);
  console.log(`Total checks:  ${totalChecks}`);
  console.log(`Passed checks: ${passedChecks}`);
  console.log(`Failed checks: ${issues.length}`);
  console.log(`Pass rate:     ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);
  console.log(`======================================================`);

  if (issues.length > 0) {
    console.log(JSON.stringify(issues, null, 2));
    process.exit(1);
  } else {
    console.log(`🎉 ALL 32 ROUTES PASSED 100% OF MOBILE-FIRST & DESKTOP REGRESSION CHECKS ACROSS ALL 7 BREAKPOINTS!`);
  }
}

main();
