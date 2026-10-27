import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

function startStaticServer(port = 4455) {
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
      '.woff2': 'font/woff2'
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
          res.end('Not Found: ' + reqPath);
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
    server.on('error', reject);
  });
}

(async () => {
  const PORT = 4455;
  const server = await startStaticServer(PORT);
  console.log(`Test server running at http://127.0.0.1:${PORT}/`);

  const browser = await chromium.launch();
  let failures = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failures++;
    }
  }

  try {
    // =========================================================================
    // TEST 1: Homepage Services Carousel (#services-carousel-viewport) - 5000ms
    // =========================================================================
    console.log('\n--- 1. Testing Homepage Services Carousel Auto-Advance (5000ms) ---');
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });

      const viewportEl = page.locator('#services-carousel-viewport');
      await viewportEl.scrollIntoViewIfNeeded();

      // Check initial transform/state
      const initialTransform = await page.$eval('#services-grid', el => el.style.transform);
      console.log('  Initial services grid transform:', initialTransform || '0px');

      // Move mouse away to ensure no hover
      await page.mouse.move(0, 0);

      // Wait 3.5s -> should NOT have moved yet (since interval is 5000ms)
      await page.waitForTimeout(3500);
      const midTransform = await page.$eval('#services-grid', el => el.style.transform);
      assert(
        midTransform === initialTransform || midTransform === '' || midTransform === 'translateX(0px)',
        'Services carousel stayed on slide 1 at 3.5s (visible for ~5s before advance)'
      );

      // Wait additional 2.0s (total ~5.5s) -> should have advanced!
      await page.waitForTimeout(2000);
      const advancedTransform = await page.$eval('#services-grid', el => el.style.transform);
      console.log('  Transform after 5.5s total:', advancedTransform);
      assert(
        advancedTransform !== initialTransform && advancedTransform.includes('translateX(-'),
        'Services carousel automatically advanced after 5000ms interval'
      );

      // Test hover pause: move mouse over carousel viewport, wait 6.0s -> should NOT advance further
      await viewportEl.hover();
      const hoverStartTransform = await page.$eval('#services-grid', el => el.style.transform);
      await page.waitForTimeout(6000);
      const hoverEndTransform = await page.$eval('#services-grid', el => el.style.transform);
      assert(
        hoverEndTransform === hoverStartTransform,
        'Services carousel paused during hover (no advance during 6s hover)'
      );

      // Test focus pause: move mouse away, focus an interactive button inside viewport
      await page.mouse.move(0, 0);
      await page.focus('#services-carousel-viewport a');
      await page.waitForTimeout(300);
      const focusStartTransform = await page.$eval('#services-grid', el => el.style.transform);
      await page.waitForTimeout(6000);
      const focusEndTransform = await page.$eval('#services-grid', el => el.style.transform);
      assert(
        focusEndTransform === focusStartTransform,
        'Services carousel paused during interactive element focus'
      );

      await context.close();
    }

    // =========================================================================
    // TEST 2: Homepage Preparation Checklist Slider (#prep-slider) - 5000ms
    // =========================================================================
    console.log('\n--- 2. Testing Homepage Prep Checklist Slider (#prep-slider) (5000ms) ---');
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });

      const sliderEl = page.locator('#prep-slider');
      await sliderEl.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);

      const initialScroll = await page.$eval('#prep-slider', el => el.scrollLeft);
      console.log('  Initial prep slider scrollLeft:', initialScroll);

      // Wait 3.5s -> should NOT have moved
      await page.waitForTimeout(3500);
      const midScroll = await page.$eval('#prep-slider', el => el.scrollLeft);
      assert(midScroll === initialScroll, 'Prep slider stayed on slide at 3.5s');

      // Wait additional 2.0s (total ~5.5s) -> should have advanced!
      await page.waitForTimeout(2000);
      const advancedScroll = await page.$eval('#prep-slider', el => el.scrollLeft);
      console.log('  Prep slider scrollLeft after 5.5s total:', advancedScroll);
      assert(advancedScroll > initialScroll, 'Prep slider auto-advanced after 5000ms interval');

      // Test Hover pause on prep slider
      await page.locator('.prep-slider-wrapper').hover();
      const hoverStartPrep = await page.$eval('#prep-slider', el => el.scrollLeft);
      await page.waitForTimeout(6000);
      const hoverEndPrep = await page.$eval('#prep-slider', el => el.scrollLeft);
      assert(hoverEndPrep === hoverStartPrep, 'Prep slider paused while hovered (6s)');

      // Test Focus pause: reload to fresh slide, focus link inside currently visible card
      await page.mouse.move(0, 0);
      await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
      await page.locator('#prep-slider').scrollIntoViewIfNeeded();
      await page.focus('#prep-slider .prep-card-link');
      await page.waitForTimeout(300);
      const focusStartScroll = await page.$eval('#prep-slider', el => el.scrollLeft);
      await page.waitForTimeout(6000);
      const focusEndScroll = await page.$eval('#prep-slider', el => el.scrollLeft);
      assert(focusEndScroll === focusStartScroll, 'Prep slider paused while element focused (6s)');

      await context.close();
    }

    // =========================================================================
    // TEST 3: Universal CardCarousel on /packages/ Page - 5000ms
    // =========================================================================
    console.log('\n--- 3. Testing Universal CardCarousel on /packages/ Page (5000ms) ---');
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${PORT}/packages/`, { waitUntil: 'networkidle' });

      const carousel = page.locator('#packages-cards-carousel');
      await carousel.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);

      const initialScroll = await page.$eval('#packages-cards-carousel .bn-carousel-track', el => el.scrollLeft);
      console.log('  Packages cards carousel initial scrollLeft:', initialScroll);

      // Wait 3.5s -> should NOT have moved
      await page.waitForTimeout(3500);
      const midScroll = await page.$eval('#packages-cards-carousel .bn-carousel-track', el => el.scrollLeft);
      assert(midScroll === initialScroll, 'Packages cards carousel stayed on slide at 3.5s');

      // Wait additional 2.0s (total ~5.5s) -> should have advanced!
      await page.waitForTimeout(2000);
      const advancedScroll = await page.$eval('#packages-cards-carousel .bn-carousel-track', el => el.scrollLeft);
      console.log('  Packages cards carousel scrollLeft after 5.5s total:', advancedScroll);
      assert(advancedScroll > initialScroll, 'Packages cards carousel auto-advanced after 5000ms');

      // Test Hover pause on CardCarousel
      await carousel.hover();
      const hoverStartScroll = await page.$eval('#packages-cards-carousel .bn-carousel-track', el => el.scrollLeft);
      await page.waitForTimeout(6000);
      const hoverEndScroll = await page.$eval('#packages-cards-carousel .bn-carousel-track', el => el.scrollLeft);
      assert(hoverEndScroll === hoverStartScroll, 'CardCarousel paused during mouse hover (6s)');

      // Test Focus pause on CardCarousel: reload to clean state, focus link in visible card
      await page.mouse.move(0, 0);
      await page.goto(`http://127.0.0.1:${PORT}/packages/`, { waitUntil: 'networkidle' });
      await page.locator('#packages-cards-carousel').scrollIntoViewIfNeeded();
      await page.focus('#packages-cards-carousel a');
      await page.waitForTimeout(300);
      const focusStartCarousel = await page.$eval('#packages-cards-carousel .bn-carousel-track', el => el.scrollLeft);
      await page.waitForTimeout(6000);
      const focusEndCarousel = await page.$eval('#packages-cards-carousel .bn-carousel-track', el => el.scrollLeft);
      assert(focusEndCarousel === focusStartCarousel, 'CardCarousel paused while element inside is focused (6s)');

      await context.close();
    }

    // =========================================================================
    // TEST 4: Mobile & Tablet Responsiveness (/wordmark-registration/ & Mobile 390px)
    // =========================================================================
    console.log('\n--- 4. Testing CardCarousel on Mobile Viewport (390px) & Tablet (768px) ---');
    {
      // Mobile 390px
      const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(`http://127.0.0.1:${PORT}/wordmark-registration/`, { waitUntil: 'networkidle' });

      const mobileTrack = mobilePage.locator('#wordmark-value-carousel .bn-carousel-track');
      await mobileTrack.scrollIntoViewIfNeeded();

      const mobileInitialScroll = await mobilePage.$eval('#wordmark-value-carousel .bn-carousel-track', el => el.scrollLeft);
      // Wait 5.5s
      await mobilePage.waitForTimeout(5500);
      const mobileAdvScroll = await mobilePage.$eval('#wordmark-value-carousel .bn-carousel-track', el => el.scrollLeft);
      console.log('  Mobile 390px scrollLeft initial:', mobileInitialScroll, 'after 5.5s:', mobileAdvScroll);
      assert(mobileAdvScroll > mobileInitialScroll, 'CardCarousel advances automatically on mobile after 5000ms');

      await mobileContext.close();

      // Tablet 768px
      const tabletContext = await browser.newContext({ viewport: { width: 768, height: 1024 } });
      const tabletPage = await tabletContext.newPage();
      await tabletPage.goto(`http://127.0.0.1:${PORT}/packages/individual-msme/`, { waitUntil: 'networkidle' });

      const tabletTrack = tabletPage.locator('#pkg-msme-inclusions-carousel .bn-carousel-track');
      await tabletTrack.scrollIntoViewIfNeeded();
      await tabletPage.mouse.move(0, 0);

      const tabletInitialScroll = await tabletPage.$eval('#pkg-msme-inclusions-carousel .bn-carousel-track', el => el.scrollLeft);
      await tabletPage.waitForTimeout(5500);
      const tabletAdvScroll = await tabletPage.$eval('#pkg-msme-inclusions-carousel .bn-carousel-track', el => el.scrollLeft);
      console.log('  Tablet 768px scrollLeft initial:', tabletInitialScroll, 'after 5.5s:', tabletAdvScroll);
      assert(tabletAdvScroll > tabletInitialScroll, 'CardCarousel advances automatically on tablet after 5000ms');

      await tabletContext.close();
    }

    // =========================================================================
    // TEST 5: Respects prefers-reduced-motion: reduce
    // =========================================================================
    console.log('\n--- 5. Testing Accessibility: prefers-reduced-motion: reduce ---');
    {
      const reducedMotionContext = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'reduce'
      });
      const page = await reducedMotionContext.newPage();
      await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });

      // Check services carousel
      const initialServicesTransform = await page.$eval('#services-grid', el => el.style.transform);
      await page.waitForTimeout(6000);
      const finalServicesTransform = await page.$eval('#services-grid', el => el.style.transform);
      assert(
        finalServicesTransform === initialServicesTransform,
        'Services carousel respects prefers-reduced-motion (no auto-advance)'
      );

      // Check prep slider
      const initialPrepScroll = await page.$eval('#prep-slider', el => el.scrollLeft);
      await page.waitForTimeout(6000);
      const finalPrepScroll = await page.$eval('#prep-slider', el => el.scrollLeft);
      assert(
        finalPrepScroll === initialPrepScroll,
        'Prep slider respects prefers-reduced-motion (no auto-advance)'
      );

      // Check CardCarousel on /packages/
      await page.goto(`http://127.0.0.1:${PORT}/packages/`, { waitUntil: 'networkidle' });
      const initialPkgScroll = await page.$eval('#packages-cards-carousel .bn-carousel-track', el => el.scrollLeft);
      await page.waitForTimeout(6000);
      const finalPkgScroll = await page.$eval('#packages-cards-carousel .bn-carousel-track', el => el.scrollLeft);
      assert(
        finalPkgScroll === initialPkgScroll,
        'Packages CardCarousel respects prefers-reduced-motion (no auto-advance)'
      );

      await reducedMotionContext.close();
    }

  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n=====================================================');
  if (failures === 0) {
    console.log('ALL 5-SECOND AUTOPLAY VERIFICATION TESTS PASSED (0 FAILURES)');
    console.log('=====================================================');
    process.exit(0);
  } else {
    console.error(`COMPLETED WITH ${failures} FAILURE(S)`);
    console.log('=====================================================');
    process.exit(1);
  }
})();
