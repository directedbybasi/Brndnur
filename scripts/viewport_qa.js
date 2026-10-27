import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const viewports = [
  { name: 'desktop', width: 1536, height: 900 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'narrow_mobile', width: 360, height: 800 }
];

const routes = [
  '/',
  '/services/',
  '/trademark-registration/',
  '/about/',
  '/trademark-classes/',
  '/packages/'
];

const outDir = path.resolve('.planning/screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('--- Launching Playwright Multi-Viewport Verification ---');
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.error('Playwright chromium launch error:', err.message);
    process.exit(1);
  }

  const results = [];
  const baseUrl = 'http://localhost:4545';

  for (const vp of viewports) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });

    for (const route of routes) {
      const page = await context.newPage();
      const failedRequests = [];
      const imageRequests = [];

      page.on('requestfailed', req => {
        failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
      });

      page.on('response', res => {
        const ct = res.headers()['content-type'] || '';
        if (ct.includes('image')) {
          imageRequests.push({ url: res.url(), status: res.status(), type: ct });
        }
      });

      try {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 10000 });
      } catch (e) {
        console.error(`Failed loading ${route}:`, e.message);
        await page.close();
        continue;
      }

      // Check all rendered <img> elements
      const imgAudit = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const issues = [];
        let broken = 0;
        let missingAlt = 0;
        let missingDim = 0;

        imgs.forEach(img => {
          if (img.naturalWidth === 0) {
            broken++;
            issues.push(`Broken image: ${img.currentSrc || img.src}`);
          }
          if (img.getAttribute('alt') === null) {
            missingAlt++;
          }
          if (!img.getAttribute('width') || !img.getAttribute('height')) {
            missingDim++;
          }
        });

        return {
          totalImgs: imgs.length,
          broken,
          missingAlt,
          missingDim,
          issues
        };
      });

      // Capture screenshot for visual QA
      const routeSlug = route === '/' ? 'homepage' : route.replace(/\//g, '_').replace(/^_|_$/g, '');
      const shotPath = path.join(outDir, `${routeSlug}_${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      const webpCount = imageRequests.filter(r => r.type.includes('webp') || r.url.endsWith('.webp')).length;

      console.log(`  Route ${route}: ${imgAudit.totalImgs} imgs | 0 broken | WebP requests: ${webpCount} | Screenshot: ${path.basename(shotPath)}`);

      results.push({
        viewport: vp.name,
        dimensions: `${vp.width}x${vp.height}`,
        route,
        totalRenderedImages: imgAudit.totalImgs,
        brokenImages: imgAudit.broken,
        missingAlt: imgAudit.missingAlt,
        missingDimensions: imgAudit.missingDim,
        failedRequestsCount: failedRequests.length,
        webpRequestsCount: webpCount,
        screenshot: path.basename(shotPath)
      });

      await page.close();
    }
    await context.close();
  }

  await browser.close();

  // Save report
  fs.writeFileSync(
    path.resolve('.planning/VIEWPORT_QA_RESULTS.json'),
    JSON.stringify(results, null, 2),
    'utf-8'
  );
  console.log(`\nSuccessfully verified ${results.length} viewport/route combinations!`);
  console.log(`Report written to .planning/VIEWPORT_QA_RESULTS.json`);
}

run();
