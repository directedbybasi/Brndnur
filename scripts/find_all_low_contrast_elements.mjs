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
  '/privacy-policy/',
  '/terms-and-conditions/',
  '/disclaimer/',
  '/refund-cancellation-policy/'
];

// Helper to calculate contrast ratio with alpha blending
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
  if (!match) return { r: 19, g: 35, b: 58, a: 1 };
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1
  };
}

function blend(fg, bg) {
  return {
    r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
    g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
    b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
    a: 1
  };
}

async function audit() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const lowContrastList = [];

  for (const route of ROUTES) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
    // Wait for any animations to settle
    await page.waitForTimeout(1000);

    const issues = await page.evaluate((currentRoute) => {
      const results = [];

      function getEffectiveBg(el) {
        let colors = [];
        let cur = el;
        while (cur && cur !== document.documentElement) {
          const style = window.getComputedStyle(cur);
          const bg = style.backgroundColor;
          if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
            colors.push(bg);
          }
          cur = cur.parentElement;
        }
        // Base is body background or ivory #F4EFE4
        colors.push(window.getComputedStyle(document.body).backgroundColor || 'rgb(244, 239, 228)');
        return colors;
      }

      const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, li, a, dt, dd, th, td');
      for (const el of allElements) {
        // Skip hidden elements
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        if (el.offsetParent === null && style.position !== 'fixed') continue;

        const text = el.innerText ? el.innerText.trim() : '';
        if (!text || text.length < 2) continue;
        if (el.children.length > 0 && Array.from(el.children).some(c => c.innerText && c.innerText.trim() === text)) {
          // Skip container if child has same text
          continue;
        }

        const fg = style.color;
        const bgStack = getEffectiveBg(el);
        const opacity = parseFloat(style.opacity);

        results.push({
          route: currentRoute,
          tag: el.tagName,
          id: el.id,
          class: el.className,
          text: text.slice(0, 70),
          fg,
          bgStack,
          opacity
        });
      }
      return results;
    }, route);

    for (const item of issues) {
      let bgRgb = { r: 244, g: 239, b: 228, a: 1 }; // default ivory
      for (let i = item.bgStack.length - 1; i >= 0; i--) {
        const parsed = parseRgb(item.bgStack[i]);
        bgRgb = blend(parsed, bgRgb);
      }

      const fgRgb = parseRgb(item.fg);
      const effectiveFg = blend(fgRgb, bgRgb);
      const cr = contrast(effectiveFg, bgRgb);

      if (cr < 2.5) {
        lowContrastList.push({
          ...item,
          effectiveBg: `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`,
          contrast: cr.toFixed(2)
        });
      }
    }
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`TOTAL LOW CONTRAST TEXT ELEMENTS FOUND: ${lowContrastList.length}`);
  console.log(`======================================================\n`);

  for (const item of lowContrastList) {
    console.log(`[${item.route}] <${item.tag.toLowerCase()} class="${item.class}" id="${item.id}">`);
    console.log(`  Text: "${item.text}"`);
    console.log(`  Color: ${item.fg} on ${item.effectiveBg} (Contrast: ${item.contrast}:1, Opacity: ${item.opacity})`);
    console.log('---');
  }
}

audit();
