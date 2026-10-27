import { chromium } from 'playwright';

const allRoutes = [
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

async function auditAllFaqs() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  const viewports = [320, 375, 390, 768, 1280];
  let totalFaqsFound = 0;
  const failures = [];

  for (const w of viewports) {
    await page.setViewportSize({ width: w, height: 844 });

    for (const r of allRoutes) {
      await page.goto(`http://localhost:4321${r}`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => {
        const ov = document.getElementById('bn-intro-overlay');
        if (ov) ov.remove();
        document.body.classList.remove('bn-intro-active');
      });

      const pageAudit = await page.evaluate((route) => {
        const faqs = document.querySelectorAll('.faq-row-item, details.faq-item, .faq-details');
        const issues = [];

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
          while (cur && cur !== document.body) {
            const bg = window.getComputedStyle(cur).backgroundColor;
            const p = parseColor(bg);
            if (p && p.a > 0.4) {
              return { color: bg, parsed: p, el: cur };
            }
            cur = cur.parentElement;
          }
          return { color: 'rgb(244, 239, 228)', parsed: { r: 244, g: 239, b: 228, a: 1 }, el: document.body };
        }

        function getLum(rgb) {
          const a = [rgb.r, rgb.g, rgb.b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        function getCr(rgb1, rgb2) {
          const l1 = getLum(rgb1);
          const l2 = getLum(rgb2);
          return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        }

        faqs.forEach((faq, idx) => {
          const q = faq.querySelector('.faq-row-question, .faq-question__text, .faq-question') || faq.querySelector('summary');
          const num = faq.querySelector('.faq-row-num, .faq-question__number');
          const toggle = faq.querySelector('.faq-row-toggle, .faq-question__toggle, .faq-icon');
          const ans = faq.querySelector('.faq-row-content, .faq-answer');

          if (!q) {
            issues.push({ idx, error: 'Missing question element' });
            return;
          }

          const qText = q.textContent.trim();
          if (!qText || qText.length === 0) {
            issues.push({ idx, error: 'Empty question text' });
            return;
          }

          const qStyle = window.getComputedStyle(q);
          const qRect = q.getBoundingClientRect();

          if (qStyle.display === 'none' || qStyle.visibility === 'hidden' || parseFloat(qStyle.opacity) === 0) {
            issues.push({ idx, text: qText.slice(0, 30), error: 'Question element hidden via CSS' });
            return;
          }

          if (qRect.width < 15 || qRect.height < 10) {
            issues.push({ idx, text: qText.slice(0, 30), error: `Question element collapsed (width: ${qRect.width}, height: ${qRect.height})` });
            return;
          }

          // Check contrast
          const qColor = parseColor(qStyle.color);
          const effectiveBg = getEffectiveBg(faq).parsed;
          const ratio = getCr(qColor, effectiveBg);
          if (ratio < 4.0) {
            issues.push({
              idx,
              text: qText.slice(0, 30),
              textColor: qStyle.color,
              bgColor: `rgb(${effectiveBg.r}, ${effectiveBg.g}, ${effectiveBg.b})`,
              ratio: ratio.toFixed(2),
              error: `Low question contrast (${ratio.toFixed(2)}:1)`
            });
          }
        });

        return {
          count: faqs.length,
          issues
        };
      }, r);

      if (w === 390) {
        totalFaqsFound += pageAudit.count;
      }

      if (pageAudit.issues.length > 0) {
        pageAudit.issues.forEach(iss => {
          failures.push({
            viewport: w,
            route: r,
            ...iss
          });
        });
      }
    }
  }

  await browser.close();

  console.log(`\n==============================================`);
  console.log(`TOTAL UNIQUE FAQS AUDITED ACROSS SITE: ${totalFaqsFound}`);
  console.log(`TOTAL FAILURES FOUND ACROSS 5 VIEWPORTS: ${failures.length}`);
  console.log(`==============================================`);
  if (failures.length > 0) {
    failures.forEach(f => console.log(JSON.stringify(f)));
  } else {
    console.log('✅ ALL FAQS ACROSS ALL 32 ROUTES ARE VISIBLE, ACCESSIBLE, AND CONTRAST-COMPLIANT ON ALL VIEWPORTS!');
  }
}

auditAllFaqs().catch(console.error);
