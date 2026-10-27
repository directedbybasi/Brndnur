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
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.json': 'application/json'
};

const PORT = 4848;
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

server.listen(PORT, async () => {
  console.log(`\n========================================================================`);
  console.log(`STARTING COMPREHENSIVE PLAYWRIGHT E2E BROWSER TEST SUITE (PORT ${PORT})`);
  console.log(`========================================================================\n`);

  const browser = await chromium.launch({ headless: true });
  let passed = 0;
  let failed = 0;
  const failures = [];

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${message}`);
    } else {
      failed++;
      failures.push(message);
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  try {
    // -------------------------------------------------------------------------
    // 1. DESKTOP INTERACTION TESTS (1440x900)
    // -------------------------------------------------------------------------
    console.log('[SUITE 1/5] Testing Desktop Shell, Navigation & Filter Tabs (1440x900)...');
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await desktopContext.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
    const desktopPage = await desktopContext.newPage();

    // Load Homepage
    await desktopPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await desktopPage.waitForTimeout(300);

    // Header logo link
    const logoHref = await desktopPage.locator('.bn-header .header-logo, .header-logo a').getAttribute('href');
    assert(logoHref === '/' || logoHref === 'https://brndnur.com/', 'Header logo links to homepage');

    // Service directory filter tabs
    const tabTm = desktopPage.locator('#tab-trademark');
    const tabBiz = desktopPage.locator('#tab-business');
    const tabAll = desktopPage.locator('#tab-all');

    if (await tabTm.count() > 0) {
      await tabTm.click();
      await desktopPage.waitForTimeout(200);
      const isTmActive = await tabTm.evaluate(el => el.classList.contains('active') || el.getAttribute('aria-selected') === 'true');
      assert(isTmActive, 'Clicking Trademark tab activates it');

      await tabBiz.click();
      await desktopPage.waitForTimeout(200);
      const isBizActive = await tabBiz.evaluate(el => el.classList.contains('active') || el.getAttribute('aria-selected') === 'true');
      assert(isBizActive, 'Clicking Business tab activates it');

      await tabAll.click();
      await desktopPage.waitForTimeout(200);
      const isAllActive = await tabAll.evaluate(el => el.classList.contains('active') || el.getAttribute('aria-selected') === 'true');
      assert(isAllActive, 'Clicking All Services tab resets view');
    }

    // Check Hero CTA destination & context
    const heroBtn = desktopPage.locator('.hero .btn-primary').first();
    const heroHref = await heroBtn.getAttribute('href');
    assert(heroHref.includes('wa.me/919048188899'), 'Homepage primary CTA points to WhatsApp +91 90481 88899');
    assert(heroHref.includes('Homepage') || heroHref.includes('Preliminary'), 'Homepage primary CTA has context prefill');

    // -------------------------------------------------------------------------
    // 2. FAQ ACCORDION INTERACTION TESTS
    // -------------------------------------------------------------------------
    console.log('\n[SUITE 2/5] Testing Accordion Expand/Collapse Behavior...');
    await desktopPage.goto(`http://localhost:${PORT}/faqs/`, { waitUntil: 'domcontentloaded' });
    await desktopPage.waitForTimeout(300);

    const faqItems = desktopPage.locator('details.faq-item, details.faq-row-item, .faq-item details');
    const faqCount = await faqItems.count();
    assert(faqCount > 0, `FAQs page contains ${faqCount} interactive details accordions`);

    if (faqCount > 0) {
      const firstFaq = faqItems.first();
      const summary = firstFaq.locator('summary');
      
      // Ensure initial state
      const initialOpen = await firstFaq.evaluate(el => el.hasAttribute('open'));
      // Toggle
      await summary.click();
      await desktopPage.waitForTimeout(200);
      const afterClickOpen = await firstFaq.evaluate(el => el.hasAttribute('open'));
      assert(afterClickOpen !== initialOpen, 'Clicking FAQ summary toggles accordion open attribute');

      // Toggle back
      await summary.click();
      await desktopPage.waitForTimeout(200);
      const restoredOpen = await firstFaq.evaluate(el => el.hasAttribute('open'));
      assert(restoredOpen === initialOpen, 'Clicking FAQ summary again restores original state');
    }

    await desktopContext.close();

    // -------------------------------------------------------------------------
    // 3. TABLET RESPONSIVENESS & DRAWER TESTS (768x1024)
    // -------------------------------------------------------------------------
    console.log('\n[SUITE 3/5] Testing Tablet Navigation & Layout Stability (768x1024)...');
    const tabletContext = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    await tabletContext.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
    const tabletPage = await tabletContext.newPage();

    await tabletPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await tabletPage.waitForTimeout(300);

    const tabletOverflow = await tabletPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert(!tabletOverflow, 'Homepage has zero horizontal scroll on Tablet (768px)');

    const tabletHero = await tabletPage.evaluate(() => {
      const el = document.querySelector('.hero, .page-hero');
      return el ? Math.round(el.getBoundingClientRect().height) : null;
    });
    assert(tabletHero === 629, `Tablet homepage hero matches token height (expected 629px, got ${tabletHero}px)`);

    await tabletContext.close();

    // -------------------------------------------------------------------------
    // 4. MOBILE DRAWER & HORIZONTAL OVERFLOW TESTS (390x844)
    // -------------------------------------------------------------------------
    console.log('\n[SUITE 4/5] Testing Mobile Drawer, Tap Targets & Overflow (390x844)...');
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await mobileContext.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(300);

    const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert(!mobileOverflow, 'Homepage has zero horizontal scroll on Mobile (390px)');

    // Mobile menu button
    const menuBtn = mobilePage.locator('button.bn-toggle');
    if (await menuBtn.count() > 0) {
      const initialExpanded = await menuBtn.getAttribute('aria-expanded');
      await menuBtn.click();
      await mobilePage.waitForTimeout(300);
      const afterExpanded = await menuBtn.getAttribute('aria-expanded');
      assert(afterExpanded === 'true' || afterExpanded !== initialExpanded, 'Mobile menu toggle opens mobile drawer');

      // Click again to close
      await menuBtn.click();
      await mobilePage.waitForTimeout(300);
      const closedExpanded = await menuBtn.getAttribute('aria-expanded');
      assert(closedExpanded === 'false' || closedExpanded === initialExpanded, 'Mobile menu toggle closes mobile drawer');
    }

    // -------------------------------------------------------------------------
    // 5. NARROW MOBILE (360x800) OVERFLOW TESTS ACROSS KEY ROUTES
    // -------------------------------------------------------------------------
    console.log('\n[SUITE 5/5] Testing Narrow Mobile Layout Stability (360x800)...');
    await mobilePage.setViewportSize({ width: 360, height: 800 });

    const keyRoutes = [
      '/',
      '/services/',
      '/packages/',
      '/trademark-registration/',
      '/contact/',
      '/about/',
      '/faqs/',
      '/resources/'
    ];

    for (const r of keyRoutes) {
      await mobilePage.goto(`http://localhost:${PORT}${r}`, { waitUntil: 'domcontentloaded' });
      await mobilePage.waitForTimeout(150);
      const hasHScroll = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert(!hasHScroll, `Route ${r.padEnd(25)} has zero horizontal overflow at 360px width`);
    }

    await mobileContext.close();

    console.log(`\n========================================================================`);
    console.log(`E2E TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    await browser.close();
    server.close();
  }
});
