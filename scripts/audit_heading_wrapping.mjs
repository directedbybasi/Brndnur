import { chromium } from 'playwright';

async function auditHeadingWrapping() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => {
    sessionStorage.setItem('brndnur_intro_played', 'true');
  });

  const page = await context.newPage();

  const testPages = [
    { url: '/trademark-renewal/', name: 'Trademark Renewal' },
    { url: '/brand-name-search/', name: 'Brand Name Search' },
    { url: '/trademark-classes/', name: 'Trademark Classes' },
    { url: '/trademark-monitoring/', name: 'Trademark Monitoring' },
    { url: '/business-setup/', name: 'Business Setup' },
    { url: '/fssai-registration/', name: 'FSSAI Registration' },
    { url: '/gst-registration/', name: 'GST Registration' },
    { url: '/udyam-msme-registration/', name: 'Udyam Registration' },
    { url: '/wordmark-registration/', name: 'Wordmark Registration' },
    { url: '/logo-trademark-registration/', name: 'Logo Registration' },
    { url: '/about/', name: 'About' },
    { url: '/packages/', name: 'Packages' },
    { url: '/packages/individual-msme/', name: 'Pkg Individual MSME' },
    { url: '/packages/company-llp/', name: 'Pkg Company LLP' },
    { url: '/packages/food-brand/', name: 'Pkg Food Brand' },
    { url: '/packages/gulf-return-business/', name: 'Pkg Gulf Return' },
    { url: '/how-it-works/', name: 'How It Works' },
    { url: '/faqs/', name: 'FAQs' },
    { url: '/contact/', name: 'Contact' },
    { url: '/resources/', name: 'Resources' },
    { url: '/', name: 'Homepage' }
  ];

  const viewports = [
    { name: '1440px Large Desktop', width: 1440, height: 900 },
    { name: '1280px Desktop', width: 1280, height: 800 },
    { name: '1024px Small Desktop', width: 1024, height: 768 },
    { name: '768px Tablet', width: 768, height: 1024 },
    { name: '390px Mobile', width: 390, height: 844 },
    { name: '360px Narrow Mobile', width: 360, height: 740 }
  ];

  const issues = [];

  for (const pageItem of testPages) {
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:4321${pageItem.url}`, { waitUntil: 'domcontentloaded' });

      // Dismiss overlay if still present
      await page.evaluate(() => {
        const ov = document.getElementById('bn-intro-overlay');
        if (ov) ov.remove();
        document.body.classList.remove('bn-intro-active');
        document.documentElement.classList.remove('bn-show-intro');
      });

      const headingInfo = await page.evaluate(() => {
        const h1 = document.querySelector('.hero h1, .page-hero h1, h1');
        if (!h1) return null;

        // Extract rendered lines by walking text nodes / word bounding boxes
        const range = document.createRange();
        const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null);
        let node;
        const words = [];

        while ((node = walker.nextNode())) {
          const text = node.textContent;
          let match;
          const re = /\S+/g;
          while ((match = re.exec(text)) !== null) {
            range.setStart(node, match.index);
            range.setEnd(node, match.index + match[0].length);
            const rect = range.getBoundingClientRect();
            words.push({
              word: match[0],
              top: Math.round(rect.top),
              bottom: Math.round(rect.bottom),
              left: Math.round(rect.left),
              right: Math.round(rect.right)
            });
          }
        }

        // Group into lines by similar top position (within 6px)
        const lines = [];
        words.forEach(w => {
          let line = lines.find(l => Math.abs(l.top - w.top) < 8);
          if (!line) {
            line = { top: w.top, words: [] };
            lines.push(line);
          }
          line.words.push(w.word);
        });

        // Sort lines top to bottom
        lines.sort((a, b) => a.top - b.top);
        const renderedLines = lines.map(l => l.words.join(' '));

        const h1Rect = h1.getBoundingClientRect();
        const overflow = document.documentElement.scrollWidth > window.innerWidth;

        return {
          h1Text: h1.innerText.replace(/\s+/g, ' ').trim(),
          renderedLines,
          h1Width: Math.round(h1Rect.width),
          containerWidth: Math.round(h1.parentElement.getBoundingClientRect().width),
          hasOverflow: overflow
        };
      });

      if (headingInfo) {
        // Detect issues:
        // 1. Standalone '&' on any line
        const hasIsolatedAmp = headingInfo.renderedLines.some(l => l.trim() === '&');
        // 2. Orphan single character or isolated punctuation
        const hasIsolatedPunct = headingInfo.renderedLines.some(l => /^[&•–—]$/.test(l.trim()));
        // 3. Overflow
        const hasOverflow = headingInfo.hasOverflow;

        if (hasIsolatedAmp || hasIsolatedPunct || hasOverflow || (pageItem.url === '/trademark-renewal/' && vp.width <= 768)) {
          issues.push({
            page: pageItem.name,
            url: pageItem.url,
            viewport: vp.name,
            renderedLines: headingInfo.renderedLines,
            hasIsolatedAmp,
            hasOverflow
          });
        }
      }
    }
  }

  console.log(`\nAudit completed. Found ${issues.length} flagged occurrences:`);
  issues.forEach(iss => {
    console.log(`\n--- [${iss.page}] at ${iss.viewport} ---`);
    console.log('Rendered Lines:');
    iss.renderedLines.forEach((l, i) => console.log(`  Line ${i + 1}: "${l}"`));
    if (iss.hasIsolatedAmp) console.log('  ⚠️ ISOLATED AMPERSAND DETECTED!');
    if (iss.hasOverflow) console.log('  ⚠️ HORIZONTAL OVERFLOW DETECTED!');
  });

  await browser.close();
}

auditHeadingWrapping().catch(err => {
  console.error(err);
  process.exit(1);
});
