import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: 'Desktop-1440', width: 1440, height: 900, expectGradient: true },
  { name: 'Desktop-1280', width: 1280, height: 800, expectGradient: true },
  { name: 'Desktop-1024', width: 1024, height: 768, expectGradient: true },
  { name: 'Tablet-1023',  width: 1023, height: 768, expectGradient: false },
  { name: 'Tablet-768',   width: 768,  height: 1024, expectGradient: false },
  { name: 'Mobile-767',   width: 767,  height: 844, expectGradient: false },
  { name: 'Mobile-390',   width: 390,  height: 844, expectGradient: false }
];

const PAGES_TO_TEST = [
  { name: 'Homepage', path: '/' },
  { name: 'Trademark Registration', path: '/trademark-registration/' },
  { name: 'Services', path: '/services/' },
  { name: 'Packages', path: '/packages/' }
];

const SCREENSHOT_DIR = path.resolve('tests/screenshots_gradient_audit');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  console.log('========================================================================');
  console.log('BRNDNUR — DESKTOP-ONLY HERO GRADIENT MASK VERIFICATION SUITE');
  console.log('========================================================================\n');

  for (const pageInfo of PAGES_TO_TEST) {
    console.log(`\n------------------------------------------------------------------------`);
    console.log(`PAGE: ${pageInfo.name} (${pageInfo.path})`);
    console.log(`------------------------------------------------------------------------`);

    for (const vp of VIEWPORTS) {
      totalTests++;
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();

      try {
        await page.goto(`http://127.0.0.1:4321${pageInfo.path}`, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
          // Check background image element
          const bgEl = document.querySelector('.shared-page-hero .hero-photo-wrap, .hero .hero-photo');
          const fgEl = document.querySelector('.shared-page-hero .hero-inner, .hero .hero-inner');
          const heroEl = document.querySelector('.hero, .shared-page-hero');

          if (!bgEl || !heroEl) {
            return { error: 'Hero or background layer not found' };
          }

          const bgStyle = window.getComputedStyle(bgEl);
          const fgStyle = fgEl ? window.getComputedStyle(fgEl) : null;
          const heroStyle = window.getComputedStyle(heroEl);

          const maskImage = bgStyle.maskImage || bgStyle.webkitMaskImage || '';
          const webkitMaskImage = bgStyle.webkitMaskImage || '';

          const hasGradient = (maskImage.includes('gradient') || webkitMaskImage.includes('gradient')) &&
                              !maskImage.includes('none') &&
                              (maskImage.includes('50%') && maskImage.includes('65%'));

          const isNone = maskImage === 'none' || maskImage === '' || webkitMaskImage === 'none' || webkitMaskImage === '';

          return {
            maskImage,
            webkitMaskImage,
            hasGradient,
            isNone,
            fgZIndex: fgStyle ? fgStyle.zIndex : null,
            fgOpacity: fgStyle ? fgStyle.opacity : null,
            heroBg: heroStyle.backgroundColor,
            heroWidth: heroEl.getBoundingClientRect().width,
            bgWidth: bgEl.getBoundingClientRect().width
          };
        });

        if (result.error) {
          console.error(`❌ [FAIL] ${vp.name}: ${result.error}`);
          failedTests++;
          await context.close();
          continue;
        }

        const isCompliant = vp.expectGradient ? result.hasGradient : (!result.hasGradient && result.isNone);

        if (isCompliant) {
          passedTests++;
          console.log(`✅ [PASS] ${vp.name.padEnd(14)}: Gradient ${vp.expectGradient ? 'ENABLED (40%-55%)' : 'DISABLED (none)'}`);
        } else {
          failedTests++;
          console.error(`❌ [FAIL] ${vp.name.padEnd(14)}: Expected ${vp.expectGradient ? 'gradient (40%-55%)' : 'none'}, got mask: "${result.maskImage || result.webkitMaskImage}"`);
        }

        // Capture screenshot for key viewports
        if (['Desktop-1440', 'Desktop-1024', 'Tablet-1023', 'Tablet-768', 'Mobile-390'].includes(vp.name)) {
          const shotName = `${pageInfo.name.toLowerCase().replace(/\s+/g, '_')}_${vp.name.toLowerCase()}.png`;
          const shotPath = path.join(SCREENSHOT_DIR, shotName);
          const heroLocator = page.locator('.hero, .shared-page-hero').first();
          await heroLocator.screenshot({ path: shotPath });
        }

      } catch (err) {
        console.error(`❌ [ERROR] ${vp.name}: ${err.message}`);
        failedTests++;
      } finally {
        await context.close();
      }
    }
  }

  console.log('\n========================================================================');
  console.log(`RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log('========================================================================');

  await browser.close();
  if (failedTests > 0) {
    process.exit(1);
  }
}

run();
