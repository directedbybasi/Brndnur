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

server.listen(4546, async () => {
  console.log('Server started on 4546');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  // Test one dynamic article from [slug].astro
  // Let's find one slug in dist/resources/
  const resDir = path.join(distDir, 'resources');
  const items = fs.readdirSync(resDir).filter(f => fs.statSync(path.join(resDir, f)).isDirectory());
  console.log('Available resource subdirectories:', items.slice(0, 10));

  const testUrl = `http://localhost:4546/resources/preview/trademark-registration-in-kerala-a-complete-guide-to-the-application-process-documents-and-fees/`;
  console.log('Testing article URL:', testUrl);

  await page.goto(testUrl, { waitUntil: 'networkidle' });

  // Take screenshot
  fs.mkdirSync('tests/screenshots/article_audit', { recursive: true });
  await page.screenshot({ path: 'tests/screenshots/article_audit/article_390_top.png' });
  await page.screenshot({ path: 'tests/screenshots/article_audit/article_390_full.png', fullPage: true });

  const metrics = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const docScrollW = document.documentElement.scrollWidth;
    const bodyScrollW = document.body.scrollWidth;

    const elementsToCheck = [
      { name: 'header', el: document.querySelector('.bn-header') },
      { name: 'logo', el: document.querySelector('.bn-logo') },
      { name: 'nav-toggle', el: document.querySelector('.bn-toggle') },
      { name: 'breadcrumb', el: document.querySelector('.article-breadcrumb') },
      { name: 'hero', el: document.querySelector('.article-hero') },
      { name: 'article-title', el: document.querySelector('.article-title') },
      { name: 'gold-rule', el: document.querySelector('.gold-rule') },
      { name: 'article-meta-row', el: document.querySelector('.article-meta-row') },
      { name: 'article-layout', el: document.querySelector('.article-layout') },
      { name: 'quick-answer-card', el: document.querySelector('.quick-answer-card') },
      { name: 'article-main', el: document.querySelector('.article-main') },
      { name: 'first-section', el: document.querySelector('.article-section') },
      { name: 'first-table-wrap', el: document.querySelector('.table-wrap') },
      { name: 'first-table', el: document.querySelector('.bn-table') },
      { name: 'article-faqs', el: document.querySelector('.article-faqs') },
      { name: 'related-services-card', el: document.querySelector('.related-services-card') },
      { name: 'sidebar', el: document.querySelector('.article-sidebar') },
      { name: 'footer', el: document.querySelector('.bn-footer') }
    ];

    const elementPositions = elementsToCheck.map(item => {
      if (!item.el) return { name: item.name, exists: false };
      const r = item.el.getBoundingClientRect();
      return {
        name: item.name,
        exists: true,
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        overflowsRight: r.right > docW + 1
      };
    });

    const anyOverflows = [];
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > docW + 1) {
        anyOverflows.push({
          tag: el.tagName,
          className: el.className,
          right: Math.round(r.right),
          width: Math.round(r.width),
          text: (el.textContent || '').trim().slice(0, 40)
        });
      }
    });

    const main = document.querySelector('.article-main');
    const layout = document.querySelector('.article-layout');
    const mainStyle = main ? window.getComputedStyle(main) : null;
    const layoutStyle = layout ? window.getComputedStyle(layout) : null;

    const oversized = [];
    if (main) {
      main.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (r.width > docW - 32 || el.scrollWidth > docW - 32) {
          oversized.push({
            tag: el.tagName,
            cls: el.className,
            width: Math.round(r.width),
            scrollWidth: el.scrollWidth,
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            overflow: style.overflow,
            overflowX: style.overflowX,
            whiteSpace: style.whiteSpace,
            boxSizing: style.boxSizing,
            text: (el.textContent || '').trim().slice(0, 40)
          });
        }
      });
    }

    const tableWrap = document.querySelector('.table-wrap');
    const table = document.querySelector('.bn-table');

    return {
      viewport: { docW, docScrollW, bodyScrollW },
      layout: layout ? {
        width: Math.round(layout.getBoundingClientRect().width),
        display: layoutStyle.display,
        gridTemplateColumns: layoutStyle.gridTemplateColumns,
        gap: layoutStyle.gap
      } : null,
      main: main ? {
        width: Math.round(main.getBoundingClientRect().width),
        minWidth: mainStyle.minWidth,
        maxWidth: mainStyle.maxWidth,
        gridColumn: mainStyle.gridColumn
      } : null,
      tableWrap: tableWrap ? {
        width: Math.round(tableWrap.getBoundingClientRect().width),
        scrollWidth: tableWrap.scrollWidth,
        overflowX: window.getComputedStyle(tableWrap).overflowX,
        computedWidth: window.getComputedStyle(tableWrap).width
      } : null,
      table: table ? {
        width: Math.round(table.getBoundingClientRect().width),
        scrollWidth: table.scrollWidth,
        computedWidth: window.getComputedStyle(table).width
      } : null,
      oversized: oversized.slice(0, 10),
      elementPositions,
      anyOverflows: anyOverflows.slice(0, 15)
    };
  });

  console.log('Metrics at 390px:');
  console.log(JSON.stringify(metrics, null, 2));

  await browser.close();
  server.close();
  process.exit(0);
});
