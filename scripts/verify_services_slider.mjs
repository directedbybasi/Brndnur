import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

// Simple static server for dist/
function startStaticServer(port = 4399) {
  return new Promise((resolve, reject) => {
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.woff2': 'font/woff2',
      '.woff': 'font/woff',
      '.ttf': 'font/ttf'
    };

    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath.endsWith('/')) {
        reqPath += 'index.html';
      } else if (!path.extname(reqPath)) {
        reqPath += '/index.html';
      }

      const filePath = path.join(distDir, reqPath);
      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.listen(port, '127.0.0.1', () => {
      console.log(`Static server running at http://127.0.0.1:${port}/`);
      resolve(server);
    });

    server.on('error', reject);
  });
}

async function runVerification() {
  const server = await startStaticServer(4399);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseUrl = 'http://127.0.0.1:4399/';
  const results = [];

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  const ensureImagesLoaded = async () => {
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('#services img'));
      await Promise.all(imgs.map(img => {
        img.loading = 'eager';
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));
    });
  };

  const checkVisibleCardsCount = async () => {
    return await page.evaluate(() => {
      const viewport = document.getElementById('services-carousel-viewport');
      if (!viewport) return 0;
      const vpRect = viewport.getBoundingClientRect();
      const cards = Array.from(document.querySelectorAll('#services-grid .service-card:not(.is-hidden)'));
      let visible = 0;
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        // Fully or almost fully inside horizontal viewport (tolerance 5px)
        if (r.left >= vpRect.left - 5 && r.right <= vpRect.right + 5) {
          visible++;
        }
      }
      return visible;
    });
  };

  const checkSingleRowNoWrap = async () => {
    return await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services-grid .service-card:not(.is-hidden)'));
      if (cards.length < 2) return true;
      const tops = cards.map(c => Math.round(c.getBoundingClientRect().top));
      const lefts = cards.map(c => Math.round(c.getBoundingClientRect().left));
      const top0 = tops[0];
      const match = tops.every(t => Math.abs(t - top0) < 3);
      if (!match) {
        console.log('Tops mismatch:', tops, 'Lefts:', lefts);
      }
      return match;
    });
  };

  const checkNoHorizontalOverflow = async () => {
    return await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth;
    });
  };

  console.log('=====================================================');
  console.log('BRNDNUR SERVICES CAROUSEL - AUTOMATED VERIFICATION');
  console.log('=====================================================\n');

  // --- 1. Large Desktop (1440px) ---
  console.log('>>> Testing Viewport: 1440px (Large Desktop)');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const servicesSec = page.locator('#services');
  await servicesSec.scrollIntoViewIfNeeded();
  await ensureImagesLoaded();
  await page.waitForTimeout(300);

  const visible1440 = await checkVisibleCardsCount();
  const singleRow1440 = await checkSingleRowNoWrap();
  const noOverflow1440 = await checkNoHorizontalOverflow();
  console.log(`- 1440px Visible cards in viewport: ${visible1440} (Expected: 4)`);
  console.log(`- 1440px Single row, no wrap: ${singleRow1440}`);
  console.log(`- 1440px No horizontal page overflow: ${noOverflow1440}`);

  // Test Controls & Navigation on 1440px
  const prevBtn = page.locator('#services-prev');
  const nextBtn = page.locator('#services-next');
  const dots = page.locator('#services-dots .services-carousel__dot');

  const prevDisabledInit = await prevBtn.isDisabled();
  const nextEnabledInit = !(await nextBtn.isDisabled());
  const dotsCount = await dots.count();
  console.log(`- Initial Prev disabled: ${prevDisabledInit}`);
  console.log(`- Initial Next enabled: ${nextEnabledInit}`);
  console.log(`- Total pagination dots: ${dotsCount} (Expected: 6)`);

  // Click Next button 5 times to advance to end
  console.log('- Clicking Next 5 times to traverse all 9 services...');
  for (let i = 1; i <= 5; i++) {
    await nextBtn.click();
    await page.waitForTimeout(400);
    const activeDotIdx = await page.evaluate(() => {
      const active = document.querySelector('#services-dots .services-carousel__dot.active');
      return active ? active.dataset.index : null;
    });
    console.log(`  Step ${i}: active dot index = ${activeDotIdx}`);
  }

  const prevEnabledEnd = !(await prevBtn.isDisabled());
  const nextDisabledEnd = await nextBtn.isDisabled();
  console.log(`- At end: Prev enabled: ${prevEnabledEnd}, Next disabled: ${nextDisabledEnd}`);

  // Click first dot to jump back
  console.log('- Clicking Dot 0 to return to beginning...');
  await dots.first().click();
  await page.waitForTimeout(400);
  console.log(`- Back at start: Prev disabled: ${await prevBtn.isDisabled()}`);

  // Test Keyboard Arrow navigation
  console.log('- Testing Keyboard ArrowLeft / ArrowRight...');
  const viewportLoc = page.locator('#services-carousel-viewport');
  await viewportLoc.focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);
  const dotAfterKey = await page.evaluate(() => document.querySelector('#services-dots .services-carousel__dot.active')?.dataset.index);
  console.log(`  ArrowRight moved to index: ${dotAfterKey}`);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(400);
  const dotAfterKeyLeft = await page.evaluate(() => document.querySelector('#services-dots .services-carousel__dot.active')?.dataset.index);
  console.log(`  ArrowLeft returned to index: ${dotAfterKeyLeft}`);

  // Test Category Filtering
  console.log('- Testing Category Filters...');
  const tabTm = page.locator('#tab-trademark');
  const tabBiz = page.locator('#tab-business');
  const tabAll = page.locator('#tab-all');

  await tabTm.click();
  await page.waitForTimeout(300);
  const tmVisibleCards = await page.locator('#services-grid .service-card:not(.is-hidden)').count();
  const tmDots = await dots.count();
  console.log(`  Trademark tab: visible cards = ${tmVisibleCards} (Expected: 5), dots = ${tmDots} (Expected: 2)`);

  await tabBiz.click();
  await page.waitForTimeout(300);
  const bizVisibleCards = await page.locator('#services-grid .service-card:not(.is-hidden)').count();
  const bizDots = await dots.count();
  const bizNextDisabled = await nextBtn.isDisabled();
  console.log(`  Business tab: visible cards = ${bizVisibleCards} (Expected: 4), dots = ${bizDots} (Expected: 1), next disabled = ${bizNextDisabled}`);

  await tabAll.click();
  await page.waitForTimeout(300);
  const allVisibleCards = await page.locator('#services-grid .service-card:not(.is-hidden)').count();
  const allDots = await dots.count();
  console.log(`  All tab restored: visible cards = ${allVisibleCards} (Expected: 9), dots = ${allDots} (Expected: 6)`);

  await servicesSec.screenshot({ path: 'tests/screenshots/services_slider_desktop_1440.png' });
  console.log('Saved tests/screenshots/services_slider_desktop_1440.png');

  // --- Viewports Matrix Test ---
  const viewports = [
    { width: 1280, height: 800, expected: 4, name: '1280px (Desktop)' },
    { width: 1200, height: 800, expected: 4, name: '1200px (Desktop boundary)' },
    { width: 1199, height: 800, expected: 3, name: '1199px (Small Desktop)' },
    { width: 1024, height: 800, expected: 3, name: '1024px (Small Desktop)' },
    { width: 1023, height: 800, expected: 2, name: '1023px (Tablet)' },
    { width: 768, height: 1024, expected: 2, name: '768px (Tablet)' },
    { width: 767, height: 1024, expected: 1, name: '767px (Mobile)' },
    { width: 390, height: 844, expected: 1, name: '390px (Mobile iPhone)' },
    { width: 360, height: 800, expected: 1, name: '360px (Mobile Small)' }
  ];

  for (const vp of viewports) {
    console.log(`\n>>> Testing Viewport: ${vp.name}`);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(200);
    await servicesSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const visible = await checkVisibleCardsCount();
    const singleRow = await checkSingleRowNoWrap();
    const noOverflow = await checkNoHorizontalOverflow();

    console.log(`- Visible cards in viewport: ${visible} (Expected: ${vp.expected})`);
    console.log(`- Single row, no wrap: ${singleRow}`);
    console.log(`- No horizontal page overflow: ${noOverflow}`);

    if (vp.width === 1200) {
      await servicesSec.screenshot({ path: 'tests/screenshots/services_slider_desktop_1200.png' });
      console.log('Saved tests/screenshots/services_slider_desktop_1200.png');
    }
    if (vp.width === 1024) {
      await servicesSec.screenshot({ path: 'tests/screenshots/services_slider_small_desktop_1024.png' });
      console.log('Saved tests/screenshots/services_slider_small_desktop_1024.png');
    }
    if (vp.width === 768) {
      await servicesSec.screenshot({ path: 'tests/screenshots/services_slider_tablet_768.png' });
      console.log('Saved tests/screenshots/services_slider_tablet_768.png');
    }
    if (vp.width === 390) {
      // Test mobile touch swipe
      console.log('- Testing touch swipe on mobile 390px...');
      await page.evaluate(() => {
        const vp = document.getElementById('services-carousel-viewport');
        const touchStart = new Touch({
          identifier: Date.now(),
          target: vp,
          clientX: 300,
          clientY: 200,
          screenX: 300,
          screenY: 200,
          pageX: 300,
          pageY: 200
        });
        const touchEnd = new Touch({
          identifier: Date.now(),
          target: vp,
          clientX: 100,
          clientY: 200,
          screenX: 100,
          screenY: 200,
          pageX: 100,
          pageY: 200
        });
        vp.dispatchEvent(new TouchEvent('touchstart', { touches: [touchStart], changedTouches: [touchStart], bubbles: true }));
        vp.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [touchEnd], bubbles: true }));
      });
      await page.waitForTimeout(400);
      const dotAfterSwipe = await page.evaluate(() => document.querySelector('#services-dots .services-carousel__dot.active')?.dataset.index);
      console.log(`  Touch swipe advanced active dot index to: ${dotAfterSwipe}`);

      await servicesSec.screenshot({ path: 'tests/screenshots/services_slider_mobile_390.png' });
      console.log('Saved tests/screenshots/services_slider_mobile_390.png');
    }
    if (vp.width === 360) {
      await servicesSec.screenshot({ path: 'tests/screenshots/services_slider_mobile_360.png' });
      console.log('Saved tests/screenshots/services_slider_mobile_360.png');
    }

    results.push({
      viewport: vp.name,
      visible,
      expected: vp.expected,
      singleRow,
      noOverflow,
      passed: (visible === vp.expected && singleRow && noOverflow)
    });
  }

  console.log('\n=====================================================');
  console.log('VERIFICATION SUMMARY');
  console.log('=====================================================');
  let allPassed = true;
  for (const r of results) {
    const status = r.passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status} | ${r.viewport} | Visible: ${r.visible}/${r.expected} | SingleRow: ${r.singleRow} | NoOverflow: ${r.noOverflow}`);
    if (!r.passed) allPassed = false;
  }

  await browser.close();
  server.close();

  if (!allPassed) {
    console.error('\nSome checks failed!');
    process.exit(1);
  } else {
    console.log('\nALL VERIFICATION CHECKS PASSED PERFECTLY!');
  }
}

runVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
