import { chromium } from 'playwright';

async function fullAudit() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  const pages = [
    '/',
    '/about/',
    '/brand-name-search/',
    '/business-setup/',
    '/contact/',
    '/disclaimer/',
    '/faqs/',
    '/fssai-registration/',
    '/gst-registration/',
    '/how-it-works/',
    '/logo-trademark-registration/',
    '/packages/',
    '/packages/company-llp/',
    '/packages/food-brand/',
    '/packages/gulf-return-business/',
    '/packages/individual-msme/',
    '/privacy-policy/',
    '/refund-cancellation-policy/',
    '/resources/',
    '/resources/brand-name-search-guide/',
    '/resources/trademark-application-process/',
    '/resources/trademark-class-guide/',
    '/resources/trademark-registration-guide/',
    '/services/',
    '/terms-and-conditions/',
    '/trademark-classes/',
    '/trademark-monitoring/',
    '/trademark-registration/',
    '/trademark-renewal/',
    '/udyam-msme-registration/',
    '/wordmark-registration/'
  ];

  const viewports = [
    { name: '1440', w: 1440, h: 900 },
    { name: '1280', w: 1280, h: 800 },
    { name: '1024', w: 1024, h: 768 },
    { name: '768', w: 768, h: 1024 },
    { name: '390', w: 390, h: 844 },
    { name: '360', w: 360, h: 740 }
  ];

  const report = [];

  for (const url of pages) {
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });

      // Dismiss overlay if still present
      await page.evaluate(() => {
        const ov = document.getElementById('bn-intro-overlay');
        if (ov) ov.remove();
        document.body.classList.remove('bn-intro-active');
        document.documentElement.classList.remove('bn-show-intro');
      });

      const res = await page.evaluate(() => {
        const h1 = document.querySelector('.hero h1, .page-hero h1, h1');
        if (!h1) return null;

        const range = document.createRange();
        const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
        let node;
        const words = [];
        while ((node = walker.nextNode())) {
          // Skip if parent is hidden
          if (node.parentElement && window.getComputedStyle(node.parentElement).display === 'none') {
            continue;
          }
          const text = node.textContent;
          let match;
          const re = /\S+/g;
          while ((match = re.exec(text)) !== null) {
            range.setStart(node, match.index);
            range.setEnd(node, match.index + match[0].length);
            const r = range.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
              words.push({ word: match[0], top: Math.round(r.top) });
            }
          }
        }
        const grouped = [];
        words.forEach(w => {
          let g = grouped.find(x => Math.abs(x.top - w.top) < 6);
          if (!g) { g = { top: w.top, words: [] }; grouped.push(g); }
          g.words.push(w.word);
        });
        grouped.sort((a,b) => a.top - b.top);
        const lines = grouped.map(g => g.words.join(' '));

        return {
          lines,
          text: h1.innerText.replace(/\s+/g, ' ').trim()
        };
      });

      if (!res) continue;

      const hasIsolatedAmp = res.lines.some(l => l.trim() === '&');
      const hasIsolatedShort = res.lines.some(l => l.trim().length <= 2 && !/^\d+$/.test(l.trim()));
      const lastLineWords = res.lines[res.lines.length - 1]?.split(' ') || [];
      const hasOrphanLastWord = res.lines.length > 1 && lastLineWords.length === 1 && lastLineWords[0].length < 10;

      if (hasIsolatedAmp || hasIsolatedShort) {
        report.push({
          url,
          vp: vp.name,
          lines: res.lines,
          type: hasIsolatedAmp ? 'ISOLATED_AMP' : 'SHORT_LINE'
        });
      }
    }
  }

  console.log('--- DEFECTS SUMMARY ---');
  console.log(`Total defects found: ${report.length}`);
  report.forEach(r => {
    console.log(`[${r.url} @ ${r.vp}px] [${r.type}] -> ${JSON.stringify(r.lines)}`);
  });

  await browser.close();
}

fullAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
