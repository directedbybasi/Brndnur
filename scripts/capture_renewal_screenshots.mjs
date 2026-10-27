import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  const viewports = [
    { name: '1440_large_desktop', w: 1440, h: 900 },
    { name: '1280_desktop', w: 1280, h: 800 },
    { name: '1024_small_desktop', w: 1024, h: 768 },
    { name: '768_tablet', w: 768, h: 1024 },
    { name: '390_mobile', w: 390, h: 844 },
    { name: '360_narrow_mobile', w: 360, h: 740 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto('http://localhost:4321/trademark-renewal/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });

    const lines = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const range = document.createRange();
      const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
      let node;
      const words = [];
      while ((node = walker.nextNode())) {
        if (node.parentElement && window.getComputedStyle(node.parentElement).display === 'none') continue;
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
      return grouped.map(g => g.words.join(' '));
    });

    console.log(`[${vp.name}] lines:`, lines);
    await page.locator('.hero').screenshot({ path: `tests/screenshots/after_renewal_${vp.name}.png` });
  }

  // Also capture other key pages with ampersands: trademark-monitoring, resources, faqs
  for (const item of [
    { url: '/trademark-monitoring/', file: 'monitoring' },
    { url: '/resources/', file: 'resources' },
    { url: '/faqs/', file: 'faqs' }
  ]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`http://localhost:4321${item.url}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
    });
    await page.locator('.hero, .faq-page-header').screenshot({ path: `tests/screenshots/after_${item.file}_1440.png` });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`http://localhost:4321${item.url}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
    });
    await page.locator('.hero, .faq-page-header').screenshot({ path: `tests/screenshots/after_${item.file}_390.png` });
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
