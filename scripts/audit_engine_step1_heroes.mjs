import { chromium } from 'playwright';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  else if (!path.extname(reqPath)) reqPath += '/index.html';

  const filePath = path.join(process.cwd(), 'dist', reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const VIEWPORTS = [
  { name: 'Desktop (1536x900)', width: 1536, height: 900 },
  { name: 'Laptop (1366x768)', width: 1366, height: 768 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Mobile (390x844)', width: 390, height: 844 },
  { name: 'Narrow Mobile (360x800)', width: 360, height: 800 }
];

const PAGES_WITH_HEROES = [
  { name: 'Homepage', path: '/' },
  { name: 'Services Hub', path: '/services/' },
  { name: 'Packages Hub', path: '/packages/' },
  { name: 'Trademark Registration', path: '/trademark-registration/' },
  { name: 'About BRNDNUR', path: '/about/' },
  { name: 'How It Works', path: '/how-it-works/' },
  { name: 'Contact Page', path: '/contact/' },
  { name: 'Trademark Classes', path: '/trademark-classes/' },
  { name: 'Brand Name Search', path: '/brand-name-search/' },
  { name: 'Wordmark Registration', path: '/wordmark-registration/' },
  { name: 'Logo TM Registration', path: '/logo-trademark-registration/' },
  { name: 'Trademark Renewal', path: '/trademark-renewal/' },
  { name: 'Trademark Monitoring', path: '/trademark-monitoring/' },
  { name: 'GST Registration', path: '/gst-registration/' },
  { name: 'Udyam MSME Registration', path: '/udyam-msme-registration/' },
  { name: 'FSSAI Registration', path: '/fssai-registration/' },
  { name: 'Business Setup', path: '/business-setup/' },
  { name: 'Package: Individual MSME', path: '/packages/individual-msme/' },
  { name: 'Package: Company LLP', path: '/packages/company-llp/' },
  { name: 'Package: Food Brand', path: '/packages/food-brand/' },
  { name: 'Package: Gulf Return', path: '/packages/gulf-return-business/' },
  { name: 'Resources Hub', path: '/resources/' },
  { name: 'Guide: TM Registration', path: '/resources/trademark-registration-guide/' },
  { name: 'Guide: TM Class', path: '/resources/trademark-class-guide/' },
  { name: 'Guide: Brand Search', path: '/resources/brand-name-search-guide/' },
  { name: 'Guide: TM Process', path: '/resources/trademark-application-process/' }
];

const PORT = 4747;
server.listen(PORT, async () => {
  console.log(`Preview server running on port ${PORT}`);
  const browser = await chromium.launch({ headless: true });
  
  const auditResults = {
    viewports: {},
    summary: { totalAssertions: 0, passed: 0, failed: 0, mismatches: [] }
  };

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\nEvaluating Viewport: ${vp.name}`);
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      await context.addInitScript(() => {
        try { sessionStorage.setItem('brndnur_intro_played', 'true'); } catch(e) {}
      });
      const page = await context.newPage();

      // Measure homepage hero baseline
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);
      const homeData = await page.evaluate(() => {
        const el = document.querySelector('.hero, .page-hero');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          height: Math.round(rect.height * 10) / 10,
          width: Math.round(rect.width * 10) / 10,
          computedHeight: window.getComputedStyle(el).height
        };
      });

      console.log(`  -> Homepage Hero Baseline: ${homeData.height}px (computed: ${homeData.computedHeight})`);

      auditResults.viewports[vp.name] = {
        viewport: vp,
        baselineHeight: homeData.height,
        pages: []
      };

      for (const p of PAGES_WITH_HEROES) {
        auditResults.summary.totalAssertions++;
        await page.goto(`http://localhost:${PORT}${p.path}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(150);

        const pageHeroData = await page.evaluate(() => {
          const el = document.querySelector('.hero, .page-hero');
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const copy = el.querySelector('.hero-copy');
          const photo = el.querySelector('.hero-photo-wrap, .hero-photo');
          return {
            height: Math.round(rect.height * 10) / 10,
            width: Math.round(rect.width * 10) / 10,
            computedHeight: window.getComputedStyle(el).height,
            copyHeight: copy ? Math.round(copy.getBoundingClientRect().height * 10) / 10 : 0,
            photoHeight: photo ? Math.round(photo.getBoundingClientRect().height * 10) / 10 : 0,
            hasOverflow: el.scrollHeight > el.clientHeight + 2
          };
        });

        if (!pageHeroData) {
          console.error(`  ❌ [FAIL] ${p.name}: NO HERO ELEMENT`);
          auditResults.summary.failed++;
          auditResults.summary.mismatches.push({ viewport: vp.name, page: p.name, reason: 'NO_HERO' });
          continue;
        }

        const diff = Math.abs(pageHeroData.height - homeData.height);
        const isMatch = diff <= 1.0;

        if (isMatch) {
          auditResults.summary.passed++;
          console.log(`  ✅ [PASS] ${p.name.padEnd(28)}: ${pageHeroData.height}px (diff: ${diff.toFixed(1)}px)`);
        } else {
          auditResults.summary.failed++;
          console.error(`  ❌ [FAIL] ${p.name.padEnd(28)}: ${pageHeroData.height}px vs Baseline ${homeData.height}px (diff: ${diff.toFixed(1)}px)`);
          auditResults.summary.mismatches.push({
            viewport: vp.name,
            page: p.name,
            pageHeight: pageHeroData.height,
            baselineHeight: homeData.height,
            diff
          });
        }

        auditResults.viewports[vp.name].pages.push({
          page: p.name,
          path: p.path,
          height: pageHeroData.height,
          diff,
          isMatch,
          data: pageHeroData
        });
      }

      await context.close();
    }

    if (!fs.existsSync('.planning/audit')) {
      fs.mkdirSync('.planning/audit', { recursive: true });
    }

    fs.writeFileSync('.planning/audit/hero-measurements.json', JSON.stringify(auditResults, null, 2));
    console.log('\nAudit complete! Saved to .planning/audit/hero-measurements.json');
    console.log(`Results: ${auditResults.summary.passed}/${auditResults.summary.totalAssertions} Passed (${auditResults.summary.failed} Failed)`);
  } finally {
    await browser.close();
    server.close();
  }
});
