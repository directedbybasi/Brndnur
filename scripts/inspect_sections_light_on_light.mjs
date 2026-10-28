import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4321';

const PAGES = [
  '/',
  '/services/',
  '/trademark-registration/',
  '/packages/',
  '/about/',
  '/how-it-works/',
  '/faqs/',
  '/contact/',
  '/brand-name-search/',
  '/business-registration/',
  '/trademark-renewal-monitoring/'
];

async function inspectSections() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('=== DETAILED SECTION TEXT AUDIT ===\n');

  for (const route of PAGES) {
    await page.goto(`${BASE_URL}${route}`);
    await page.waitForTimeout(500);

    const data = await page.evaluate(() => {
      const results = [];
      const sections = document.querySelectorAll('section, main > div');

      for (const sec of sections) {
        const secId = sec.id || sec.className || 'unnamed-section';
        const bg = window.getComputedStyle(sec).backgroundColor;
        
        // Find all headings and paragraphs inside this section
        const headings = sec.querySelectorAll('h1, h2, h3, p');
        for (const h of headings) {
          const style = window.getComputedStyle(h);
          const fg = style.color;
          const text = h.innerText.trim();
          if (!text) continue;

          // Check if foreground is close to ivory or white when section background is light
          const isLightBg = bg.includes('244, 239, 228') || bg.includes('255, 255, 255') || bg.includes('238, 228, 211') || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent';
          const isLightText = fg.includes('244, 239, 228') || fg.includes('255, 255, 255') || fg.includes('217, 223, 232') || fg.includes('255, 252, 246');

          if (isLightBg && isLightText) {
            results.push({
              secId,
              tag: h.tagName,
              class: h.className,
              text: text.slice(0, 60),
              fg,
              secBg: bg
            });
          }
        }
      }
      return results;
    });

    if (data.length > 0) {
      console.log(`🚨 ISSUES ON ROUTE: ${route} (${data.length} found)`);
      for (const item of data) {
        console.log(`  Section: ${item.secId} | <${item.tag.toLowerCase()} class="${item.class}">`);
        console.log(`    Text: "${item.text}"`);
        console.log(`    Color: ${item.fg} on Bg: ${item.secBg}`);
      }
      console.log('---');
    } else {
      console.log(`✅ ${route}: Clean! No light-on-light text.`);
    }
  }

  await browser.close();
}

inspectSections();
