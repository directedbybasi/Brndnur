import { chromium } from 'playwright';

const VIEWPORTS = [
  { name: 'Desktop (1536x900)', width: 1536, height: 900 },
  { name: 'Laptop (1366x768)', width: 1366, height: 768 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Mobile (390x844)', width: 390, height: 844 },
  { name: 'Narrow Mobile (360x800)', width: 360, height: 800 }
];

const PAGES = [
  { name: 'Homepage', url: 'http://localhost:4545/' },
  { name: 'Services', url: 'http://localhost:4545/services/' },
  { name: 'Packages', url: 'http://localhost:4545/packages/' },
  { name: 'Trademark Registration', url: 'http://localhost:4545/trademark-registration/' },
  { name: 'About', url: 'http://localhost:4545/about/' },
  { name: 'How It Works', url: 'http://localhost:4545/how-it-works/' },
  { name: 'FAQs', url: 'http://localhost:4545/faqs/' },
  { name: 'Contact', url: 'http://localhost:4545/contact/' },
  { name: 'Trademark Classes', url: 'http://localhost:4545/trademark-classes/' },
  { name: 'Brand Name Search', url: 'http://localhost:4545/brand-name-search/' },
  { name: 'Wordmark Registration', url: 'http://localhost:4545/wordmark-registration/' },
  { name: 'Logo TM Registration', url: 'http://localhost:4545/logo-trademark-registration/' },
  { name: 'Trademark Renewal', url: 'http://localhost:4545/trademark-renewal/' },
  { name: 'Trademark Monitoring', url: 'http://localhost:4545/trademark-monitoring/' },
  { name: 'GST Registration', url: 'http://localhost:4545/gst-registration/' },
  { name: 'Udyam MSME Registration', url: 'http://localhost:4545/udyam-msme-registration/' },
  { name: 'FSSAI Registration', url: 'http://localhost:4545/fssai-registration/' },
  { name: 'Business Setup', url: 'http://localhost:4545/business-setup/' },
  { name: 'Package: Individual MSME', url: 'http://localhost:4545/packages/individual-msme/' },
  { name: 'Package: Company LLP', url: 'http://localhost:4545/packages/company-llp/' },
  { name: 'Package: Food Brand', url: 'http://localhost:4545/packages/food-brand/' },
  { name: 'Package: Gulf Return', url: 'http://localhost:4545/packages/gulf-return-business/' },
  { name: 'Resources Hub', url: 'http://localhost:4545/resources/' },
  { name: 'Guide: TM Registration', url: 'http://localhost:4545/resources/trademark-registration-guide/' },
  { name: 'Guide: TM Class', url: 'http://localhost:4545/resources/trademark-class-guide/' },
  { name: 'Guide: Brand Search', url: 'http://localhost:4545/resources/brand-name-search-guide/' },
  { name: 'Guide: TM Process', url: 'http://localhost:4545/resources/trademark-application-process/' }
];

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failureList = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n========================================================================================`);
    console.log(`EVALUATING VIEWPORT: ${vp.name}`);
    console.log(`========================================================================================`);
    
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    // 1. Measure Homepage baseline
    await page.goto('http://localhost:4545/', { waitUntil: 'domcontentloaded' });
    const homeHeight = await page.evaluate(() => {
      const el = document.querySelector('.hero, .page-hero');
      return el ? Math.round(el.getBoundingClientRect().height * 10) / 10 : null;
    });

    console.log(`HOMEPAGE BASELINE HEIGHT: ${homeHeight}px\n`);

    for (const p of PAGES) {
      totalTests++;
      await page.goto(p.url, { waitUntil: 'domcontentloaded' });
      const pageInfo = await page.evaluate(() => {
        const el = document.querySelector('.hero, .page-hero');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          height: Math.round(rect.height * 10) / 10,
          computedHeight: window.getComputedStyle(el).height
        };
      });

      if (!pageInfo) {
        console.log(`❌ [FAIL] ${p.name.padEnd(28)}: NO HERO ELEMENT FOUND`);
        failedTests++;
        failureList.push({ viewport: vp.name, page: p.name, reason: 'NO_HERO' });
        continue;
      }

      const diff = Math.abs(pageInfo.height - homeHeight);
      const isMatch = diff <= 1.0;

      if (isMatch) {
        passedTests++;
        console.log(`✅ [PASS] ${p.name.padEnd(28)}: ${pageInfo.height}px (Diff: ${diff.toFixed(1)}px vs Home ${homeHeight}px)`);
      } else {
        failedTests++;
        console.log(`❌ [FAIL] ${p.name.padEnd(28)}: ${pageInfo.height}px (MISMATCH diff: ${diff.toFixed(1)}px vs Home ${homeHeight}px)`);
        failureList.push({ viewport: vp.name, page: p.name, height: pageInfo.height, homeHeight, diff });
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n========================================================================================`);
  console.log(`FINAL HEIGHT AUDIT SUMMARY:`);
  console.log(`Total Checks: ${totalTests}`);
  console.log(`Passed:       ${passedTests}`);
  console.log(`Failed:       ${failedTests}`);
  console.log(`Pass Rate:    ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log(`========================================================================================`);

  if (failureList.length > 0) {
    console.log(`Failures details:`, JSON.stringify(failureList, null, 2));
    process.exit(1);
  } else {
    console.log(`🎉 ALL 27 PAGES EXACTLY MATCH HOMEPAGE HERO HEIGHT ACROSS ALL 5 BREAKPOINTS!`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
