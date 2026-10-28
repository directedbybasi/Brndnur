import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4321';

const ROUTES = [
  '/',
  '/services/',
  '/brand-name-search/',
  '/trademark-registration/',
  '/business-registration/',
  '/trademark-renewal-monitoring/',
  '/packages/',
  '/about/',
  '/how-it-works/',
  '/faqs/',
  '/contact/',
  '/trademark-classes/',
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

// Helper to compute relative luminance
function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b) + 0.05;
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

function parseRgb(colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1
  };
}

async function auditPages() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const allIssues = [];

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    // Wait for animations/renders
    await page.waitForTimeout(500);

    const issues = await page.evaluate((currentRoute) => {
      const pageIssues = [];

      function getEffectiveBg(el) {
        let cur = el;
        while (cur && cur !== document.documentElement) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
            return bg;
          }
          cur = cur.parentElement;
        }
        return window.getComputedStyle(document.body).backgroundColor || 'rgb(244, 239, 228)';
      }

      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, p, .lead, .section-lead, .eyebrow, .marks-intro, .rule');

      for (const el of textElements) {
        // Skip hidden elements that are display: none or within closed details
        const style = window.getComputedStyle(el);
        if (style.display === 'none') continue;

        const text = el.innerText.trim();
        if (!text && el.tagName !== 'DIV') continue;

        const fg = style.color;
        const bg = getEffectiveBg(el);
        const opacity = parseFloat(style.opacity);
        const visibility = style.visibility;

        // Check for invisible or extremely pale text
        pageIssues.push({
          route: currentRoute,
          tag: el.tagName,
          id: el.id,
          class: el.className,
          text: text.slice(0, 60),
          fg,
          bg,
          opacity,
          visibility
        });
      }

      return pageIssues;
    }, route);

    for (const item of issues) {
      const fgRgb = parseRgb(item.fg);
      const bgRgb = parseRgb(item.bg);
      const cr = contrast(fgRgb, bgRgb);

      // Low contrast threshold: < 2.5:1
      if (cr < 2.5 || item.opacity < 0.2 || item.visibility === 'hidden') {
        allIssues.push({
          ...item,
          contrast: cr.toFixed(2)
        });
      }
    }
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`FOUND ${allIssues.length} LOW-CONTRAST / INVISIBLE TEXT ISSUES:`);
  console.log(`======================================================\n`);

  for (const issue of allIssues) {
    console.log(`[${issue.route}] <${issue.tag.toLowerCase()} class="${issue.class}" id="${issue.id}">`);
    console.log(`  Text: "${issue.text}"`);
    console.log(`  Color: ${issue.fg} on Bg: ${issue.bg} (Contrast: ${issue.contrast}:1, Opacity: ${issue.opacity})`);
    console.log('---');
  }
}

auditPages();
