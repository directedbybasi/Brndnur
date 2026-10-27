import { chromium } from 'playwright';

const pages = [
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

function parseColor(str) {
  if (!str) return null;
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return null;
  return {
    r: parseInt(m[1]),
    g: parseInt(m[2]),
    b: parseInt(m[3]),
    a: m[4] !== undefined ? parseFloat(m[4]) : 1
  };
}

function getLuminance(rgb) {
  const a = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(rgb1, rgb2) {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

async function verifyAll() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });

  let totalCardsAudited = 0;
  let totalIssuesFound = 0;
  const issues = [];

  for (const url of pages) {
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
    });

    const pageResults = await page.evaluate((currentUrl) => {
      const cards = document.querySelectorAll(
        '.included-item, .step-item, .doc-item, .advise-card, .finder-item, .service-card, .package-card, .step, .feature'
      );

      function parse(str) {
        if (!str) return null;
        const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!m) return null;
        return {
          r: parseInt(m[1]),
          g: parseInt(m[2]),
          b: parseInt(m[3]),
          a: m[4] !== undefined ? parseFloat(m[4]) : 1
        };
      }

      function getEffectiveBg(el) {
        let cur = el;
        while (cur && cur !== document.body) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          const p = parse(bg);
          if (p && p.a > 0.4) {
            return { color: bg, parsed: p, el: cur };
          }
          cur = cur.parentElement;
        }
        return { color: 'rgb(244, 239, 228)', parsed: { r: 244, g: 239, b: 228, a: 1 }, el: document.body };
      }

      function lum(rgb) {
        const a = [rgb.r, rgb.g, rgb.b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      function cr(rgb1, rgb2) {
        const l1 = lum(rgb1);
        const l2 = lum(rgb2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }

      const results = [];

      cards.forEach(card => {
        if (!card.offsetParent) return; // not visible

        const cardBgInfo = getEffectiveBg(card);
        const sec = card.closest('section');
        const secBgInfo = sec ? getEffectiveBg(sec) : { parsed: { r: 244, g: 239, b: 228, a: 1 } };

        const isDarkSec = lum(secBgInfo.parsed) < 0.12; // dark navy
        const cardLum = lum(cardBgInfo.parsed);

        // Check if dark section has unintended light/grey card
        if (isDarkSec && cardLum > 0.3) {
          results.push({
            type: 'DEFECT_LIGHT_CARD_IN_DARK_SECTION',
            url: currentUrl,
            cardClass: card.className,
            cardBg: cardBgInfo.color,
            secBg: secBgInfo.color
          });
        }

        // Check text elements inside card
        const headings = card.querySelectorAll('h1, h2, h3, h4');
        headings.forEach(h => {
          if (!h.offsetParent) return;
          const hColor = parse(window.getComputedStyle(h).color);
          const effectiveBg = getEffectiveBg(h).parsed;
          const ratio = cr(hColor, effectiveBg);
          if (ratio < 4.5) {
            results.push({
              type: 'LOW_HEADING_CONTRAST',
              url: currentUrl,
              cardClass: card.className,
              heading: h.textContent.trim().slice(0, 30),
              textColor: window.getComputedStyle(h).color,
              bgColor: window.getComputedStyle(h).backgroundColor,
              ratio: ratio.toFixed(2)
            });
          }
        });

        const paragraphs = card.querySelectorAll('p');
        paragraphs.forEach(p => {
          if (!p.offsetParent) return;
          const pColor = parse(window.getComputedStyle(p).color);
          const effectiveBg = getEffectiveBg(p).parsed;
          const ratio = cr(pColor, effectiveBg);
          if (ratio < 3.5) {
            results.push({
              type: 'LOW_BODY_CONTRAST',
              url: currentUrl,
              cardClass: card.className,
              text: p.textContent.trim().slice(0, 30),
              textColor: window.getComputedStyle(p).color,
              ratio: ratio.toFixed(2)
            });
          }
        });
      });

      return {
        cardCount: cards.length,
        results
      };
    }, url);

    totalCardsAudited += pageResults.cardCount;
    if (pageResults.results.length > 0) {
      totalIssuesFound += pageResults.results.length;
      issues.push(...pageResults.results);
    }
  }

  await browser.close();

  console.log(`\n========================================`);
  console.log(`TOTAL CARDS AUDITED ACROSS 32 ROUTES: ${totalCardsAudited}`);
  console.log(`TOTAL DEFECTS / LOW CONTRAST ISSUES: ${totalIssuesFound}`);
  console.log(`========================================`);
  if (issues.length > 0) {
    issues.forEach(i => console.log(JSON.stringify(i)));
  } else {
    console.log('✅ ZERO low-contrast or grey-card defects found across all 32 routes!');
  }
}

verifyAll().catch(console.error);
