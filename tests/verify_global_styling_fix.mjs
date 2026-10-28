import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4321';

const ROUTES = [
  '/',
  '/services/',
  '/brand-name-search/',
  '/trademark-registration/',
  '/business-registration/',
  '/trademark-renewal-monitoring/',
  '/packages/',
  '/about/',
  '/resources/',
  '/contact/',
  '/resources/trademark-registration-in-kerala-a-complete-guide-to-the-application-process-documents-and-fees/'
];

const VIEWPORTS = [
  { name: 'Desktop (1440px)', width: 1440, height: 900 },
  { name: 'Tablet (768px)', width: 768, height: 1024 },
  { name: 'Mobile (390px)', width: 390, height: 844 }
];

async function runVerification() {
  console.log('🚀 Starting Comprehensive Multi-Page & Multi-Viewport Verification...');
  console.log(`Target: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  let totalTests = 0;
  let passedTests = 0;
  let failures = [];

  for (const route of ROUTES) {
    console.log(`\n======================================================`);
    console.log(`🔍 ROUTE: ${route}`);
    console.log(`======================================================`);

    for (const vp of VIEWPORTS) {
      totalTests++;
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height }
      });
      const page = await context.newPage();

      const consoleErrors = [];
      const failedRequests = [];
      let cssLoaded = false;
      let cssUrl = '';

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      page.on('requestfailed', req => {
        failedRequests.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
      });

      page.on('response', res => {
        const url = res.url();
        if (url.includes('.css')) {
          if (res.status() === 200) {
            cssLoaded = true;
            cssUrl = url;
          }
        }
      });

      try {
        const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 15000 });
        const status = response ? response.status() : 0;

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        // Check typography
        const typography = await page.evaluate(() => {
          const bodyFont = window.getComputedStyle(document.body).fontFamily;
          const h1 = document.querySelector('h1');
          const h1Font = h1 ? window.getComputedStyle(h1).fontFamily : 'No H1';
          return { bodyFont, h1Font };
        });

        // Check WhatsApp floating button dimensions
        const waDimensions = await page.evaluate(() => {
          const wa = document.querySelector('a[aria-label*="WhatsApp"], a[href*="whatsapp"], .floating-whatsapp, a[href*="wa.me"]');
          if (!wa) return null;
          const rect = wa.getBoundingClientRect();
          return { width: Math.round(rect.width), height: Math.round(rect.height) };
        });

        // Verification checks
        const issues = [];
        if (status !== 200) issues.push(`HTTP status ${status} (expected 200)`);
        if (!cssLoaded) issues.push(`CSS stylesheet failed to load 200 OK`);
        if (overflow) issues.push(`Horizontal overflow detected (${vp.width}px)`);
        if (consoleErrors.length > 0) issues.push(`Console errors: ${consoleErrors.join('; ')}`);
        if (failedRequests.length > 0) issues.push(`Failed requests: ${failedRequests.join('; ')}`);
        
        if (waDimensions) {
          if (waDimensions.width > 120 || waDimensions.height > 120) {
            issues.push(`WhatsApp button oversized: ${waDimensions.width}x${waDimensions.height}px`);
          }
        }

        if (issues.length === 0) {
          passedTests++;
          const waInfo = waDimensions ? ` | WA Icon: ${waDimensions.width}x${waDimensions.height}px` : '';
          console.log(`  ✅ [PASS] ${vp.name.padEnd(18)} | CSS: OK | H1: ${typography.h1Font.slice(0, 20)}... | Body: ${typography.bodyFont.slice(0, 15)}...${waInfo}`);
        } else {
          failures.push({ route, viewport: vp.name, issues });
          console.error(`  ❌ [FAIL] ${vp.name.padEnd(18)} | Issues: ${issues.join(' | ')}`);
        }

      } catch (err) {
        failures.push({ route, viewport: vp.name, issues: [err.message] });
        console.error(`  ❌ [FAIL] ${vp.name.padEnd(18)} | Exception: ${err.message}`);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`🏁 VERIFICATION SUMMARY`);
  console.log(`======================================================`);
  console.log(`Total Scenarios Tested: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failures.length}`);

  if (failures.length > 0) {
    console.log(`\nFailures detail:`);
    console.log(JSON.stringify(failures, null, 2));
    process.exit(1);
  } else {
    console.log(`\n🎉 ALL 11 ROUTES PASSED ACROSS ALL 3 VIEWPORTS (33/33 PASS)!`);
    process.exit(0);
  }
}

runVerification();
