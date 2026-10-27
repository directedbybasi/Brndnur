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

async function checkContrast() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });

  const lowContrastReports = [];

  for (const url of pages) {
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
    });

    const issues = await page.evaluate((currentUrl) => {
      const results = [];
      // Find cards/items
      const cards = document.querySelectorAll('.card, .service-card, .package-card, .step-item, .included-item, .doc-item, .advise-card, .feature, .step, .prep-card');
      
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

      function getEffectiveBg(el) {
        let cur = el;
        while (cur && cur !== document) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          const parsed = parseColor(bg);
          if (parsed && parsed.a > 0.1) {
            return { color: bg, parsed, el: cur };
          }
          cur = cur.parentElement;
        }
        return { color: 'rgb(244, 239, 228)', parsed: { r: 244, g: 239, b: 228, a: 1 }, el: document.body };
      }

      function getLuminance(rgb) {
        const a = [rgb.r, rgb.g, rgb.b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      cards.forEach(card => {
        // Find text elements inside card
        const headings = card.querySelectorAll('h2, h3, h4, p, span, a');
        const cardBg = window.getComputedStyle(card).backgroundColor;
        const parsedCardBg = parseColor(cardBg);

        // Check parent section background
        const sec = card.closest('section');
        const secBg = sec ? window.getComputedStyle(sec).backgroundColor : '';
        const parsedSecBg = parseColor(secBg);

        const isDarkSec = parsedSecBg && getLuminance(parsedSecBg) < 0.15; // Dark navy section

        if (isDarkSec) {
          // Check if card has light/grey background
          if (parsedCardBg) {
            const cardLum = getLuminance(parsedCardBg);
            // If card background is light or grey (> 0.25 luminance) inside dark section
            if (cardLum > 0.25) {
              results.push({
                url: currentUrl,
                cardClass: card.className,
                secClass: sec.className,
                cardBg,
                secBg,
                cardLum,
                issue: `Light card (${cardBg}) inside dark section (${secBg})`
              });
            }
          }

          // Check text contrast inside card
          headings.forEach(h => {
            const textColor = window.getComputedStyle(h).color;
            const parsedText = parseColor(textColor);
            if (parsedText && parsedCardBg) {
              const lumText = getLuminance(parsedText);
              const lumBg = getLuminance(parsedCardBg);
              const cr = (Math.max(lumText, lumBg) + 0.05) / (Math.min(lumText, lumBg) + 0.05);
              if (cr < 3.0 && h.textContent.trim().length > 0 && h.offsetParent !== null) {
                results.push({
                  url: currentUrl,
                  cardClass: card.className,
                  element: h.tagName + ': ' + h.textContent.trim().slice(0, 30),
                  textColor,
                  cardBg,
                  contrastRatio: cr.toFixed(2),
                  issue: `Low text contrast (${cr.toFixed(2)}:1)`
                });
              }
            }
          });
        }
      });

      return results;
    }, url);

    if (issues.length > 0) {
      lowContrastReports.push(...issues);
    }
  }

  await browser.close();
  console.log(`\n=== CONTRAST AUDIT RESULTS ===`);
  console.log(`Found ${lowContrastReports.length} contrast issues:`);
  lowContrastReports.forEach(r => console.log(JSON.stringify(r)));
}

checkContrast().catch(console.error);
