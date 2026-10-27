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
  '/refund-cancellation-policy/',
  '/404.html'
];

const viewports = [
  { name: 'Narrow mobile (320px)', w: 320, h: 568 },
  { name: 'Mobile (360px)', w: 360, h: 740 },
  { name: 'Mobile (375px)', w: 375, h: 667 },
  { name: 'Standard mobile (390px)', w: 390, h: 844 },
  { name: 'Large mobile (430px)', w: 430, h: 932 },
  { name: 'Tablet (768px)', w: 768, h: 1024 },
  { name: 'Small desktop (1024px)', w: 1024, h: 768 },
  { name: 'Desktop (1440px)', w: 1440, h: 900 }
];

async function runAudit() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  console.log(`Auditing ${pages.length} routes across ${viewports.length} viewports...`);

  const issues = [];

  for (const url of pages) {
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      try {
        const response = await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
        if (!response || response.status() >= 400 && url !== '/404.html') {
          issues.push({ url, vp: vp.name, error: `HTTP ${response?.status()}` });
          continue;
        }

        // Remove intro overlay if any
        await page.evaluate(() => {
          const ov = document.getElementById('bn-intro-overlay');
          if (ov) ov.remove();
          document.body.classList.remove('bn-intro-active');
          document.documentElement.classList.remove('bn-show-intro');
        });

        const check = await page.evaluate((vpWidth) => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const hasOverflow = scrollWidth > vpWidth + 1; // 1px threshold for subpixels

          // Find overflowing element if any
          let overflowEl = null;
          if (hasOverflow) {
            const all = document.querySelectorAll('*');
            for (const el of all) {
              const r = el.getBoundingClientRect();
              if (r.right > vpWidth + 1 && el.offsetParent !== null) {
                overflowEl = `${el.tagName.toLowerCase()}.${el.className} (right: ${Math.round(r.right)})`;
                break;
              }
            }
          }

          // Check H1
          const h1 = document.querySelector('h1');
          let h1Issue = null;
          if (h1) {
            const h1Rect = h1.getBoundingClientRect();
            if (h1Rect.width > vpWidth) {
              h1Issue = `H1 wider than viewport (${Math.round(h1Rect.width)}px > ${vpWidth}px)`;
            }
            if (h1Rect.left < 0 || h1Rect.right > vpWidth + 2) {
              h1Issue = `H1 offscreen (left: ${Math.round(h1Rect.left)}, right: ${Math.round(h1Rect.right)})`;
            }
          }

          return {
            hasOverflow,
            scrollWidth,
            overflowEl,
            h1Issue
          };
        }, vp.w);

        if (check.hasOverflow) {
          issues.push({ url, vp: vp.name, error: `Horizontal overflow: scrollWidth ${check.scrollWidth} > ${vp.w}. El: ${check.overflowEl}` });
        }
        if (check.h1Issue) {
          issues.push({ url, vp: vp.name, error: check.h1Issue });
        }
      } catch (err) {
        issues.push({ url, vp: vp.name, error: err.message });
      }
    }
  }

  await browser.close();

  console.log(`\n=== AUDIT RESULTS ===`);
  if (issues.length === 0) {
    console.log(`ALL 32 ROUTES PASSED across all 8 viewports! ZERO horizontal overflows and zero H1 defects!`);
  } else {
    console.log(`Found ${issues.length} issues:`);
    issues.forEach(i => console.log(`- [${i.vp}] ${i.url}: ${i.error}`));
  }
}

runAudit().catch(console.error);
