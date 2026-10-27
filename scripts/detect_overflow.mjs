import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const distDir = path.resolve('dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, '404.html');
  }
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(4545, async () => {
  console.log('Static server listening on 4545');

  // Let's gather routes from dist
  const routes = [
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

  // Also add some dynamic articles under /resources/*/
  const resourcesDist = path.join(distDir, 'resources');
  if (fs.existsSync(resourcesDist)) {
    const entries = fs.readdirSync(resourcesDist, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory() && ent.name !== 'preview') {
        const rPath = `/resources/${ent.name}/`;
        if (!routes.includes(rPath)) {
          routes.push(rPath);
        }
      }
    }
  }

  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: '360px', width: 360, height: 800 },
    { name: '375px', width: 375, height: 667 },
    { name: '390px', width: 390, height: 844 },
    { name: '412px', width: 412, height: 915 },
    { name: '430px', width: 430, height: 932 }
  ];

  let totalIssues = 0;

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const route of routes) {
      try {
        await page.goto(`http://localhost:4545${route}`, { waitUntil: 'load' });
        const result = await page.evaluate(() => {
          const docW = document.documentElement.clientWidth;
          const scrollW = document.documentElement.scrollWidth;
          const bodyW = document.body.clientWidth;
          const bodyScrollW = document.body.scrollWidth;

          const overflows = [];
          document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > docW + 1) {
              overflows.push({
                tag: el.tagName,
                id: el.id,
                className: typeof el.className === 'string' ? el.className.slice(0, 100) : '',
                right: Math.round(r.right),
                width: Math.round(r.width),
                text: (el.textContent || '').trim().slice(0, 50)
              });
            }
          });

          return {
            docW,
            scrollW,
            bodyW,
            bodyScrollW,
            hasHorizontalScroll: scrollW > docW || bodyScrollW > docW,
            overflows: overflows.slice(0, 10)
          };
        });

        if (result.hasHorizontalScroll || result.overflows.length > 0) {
          totalIssues++;
          console.log(`\n❌ [${vp.name}] OVERFLOW on ${route}`);
          console.log(`   docW: ${result.docW}, scrollW: ${result.scrollW}, bodyScrollW: ${result.bodyScrollW}`);
          console.log(`   Overflowing elements:`, JSON.stringify(result.overflows, null, 2));
        }
      } catch (err) {
        console.error(`Error on ${route}:`, err.message);
      }
    }
    await context.close();
  }

  console.log(`\n========================================`);
  console.log(`Audit complete. Total issues found: ${totalIssues}`);
  console.log(`========================================`);

  await browser.close();
  server.close();
  process.exit(0);
});
