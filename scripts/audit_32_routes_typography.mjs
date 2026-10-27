import { chromium } from 'playwright';

const routes = [
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
  '/refund-cancellation-policy/',
  '/disclaimer/',
  '/404.html'
];

async function audit() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  let totalPagesChecked = 0;
  let totalElementsChecked = 0;
  const issues = [];

  for (const route of routes) {
    try {
      const url = `http://localhost:4321${route}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
      await page.evaluate(() => {
        const ov = document.getElementById('bn-intro-overlay');
        if (ov) ov.remove();
        document.body.classList.remove('bn-intro-active');
      });

      const pageAudit = await page.evaluate((r) => {
        const selectors = [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', '.eyebrow', 'button', '.btn', 'a.bn-nav-link', 'input', 'select', 'textarea',
          '.service-card h3', '.package-card h3', '.audience-body h3', '.faq-question', 'summary'
        ];

        const nonDmSans = [];
        let count = 0;

        for (const sel of selectors) {
          const els = document.querySelectorAll(sel);
          els.forEach(el => {
            count++;
            const cs = window.getComputedStyle(el);
            const ff = cs.fontFamily;
            if (!ff.includes('DM Sans')) {
              nonDmSans.push({
                selector: sel,
                text: el.textContent ? el.textContent.trim().slice(0, 40) : '',
                fontFamily: ff
              });
            }
          });
        }

        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;

        return {
          route: r,
          count,
          nonDmSans,
          hasOverflow: scrollWidth > innerWidth
        };
      }, route);

      totalPagesChecked++;
      totalElementsChecked += pageAudit.count;

      if (pageAudit.nonDmSans.length > 0) {
        issues.push({ route, nonDmSans: pageAudit.nonDmSans });
      }

      if (pageAudit.hasOverflow) {
        issues.push({ route, error: 'Horizontal overflow on desktop' });
      }

    } catch (err) {
      issues.push({ route, error: err.message });
    }
  }

  // Also check representative mobile viewports
  const mobileViewports = [
    { name: '390px', width: 390, height: 844 },
    { name: '375px', width: 375, height: 667 }
  ];

  for (const mv of mobileViewports) {
    await page.setViewportSize({ width: mv.width, height: mv.height });
    for (const testRoute of ['/', '/services/', '/packages/', '/contact/', '/about/', '/faqs/']) {
      try {
        await page.goto(`http://localhost:4321${testRoute}`, { waitUntil: 'networkidle' });
        await page.evaluate(() => {
          const ov = document.getElementById('bn-intro-overlay');
          if (ov) ov.remove();
          document.body.classList.remove('bn-intro-active');
        });

        const mAudit = await page.evaluate(({ vpName, r }) => {
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => {
            const cs = window.getComputedStyle(h);
            return {
              tag: h.tagName,
              text: h.textContent.trim().slice(0, 30),
              ff: cs.fontFamily,
              size: cs.fontSize,
              weight: cs.fontWeight
            };
          });

          const nonDm = headings.filter(h => !h.ff.includes('DM Sans'));

          return {
            vp: vpName,
            route: r,
            hasOverflow: scrollWidth > innerWidth,
            scrollWidth,
            innerWidth,
            nonDmHeadings: nonDm
          };
        }, { vpName: mv.name, r: testRoute });

        if (mAudit.hasOverflow) {
          issues.push({ route: testRoute, error: `Mobile overflow at ${mv.name}: ${mAudit.scrollWidth} > ${mAudit.innerWidth}` });
        }
        if (mAudit.nonDmHeadings.length > 0) {
          issues.push({ route: testRoute, error: `Non-DM Sans headings at ${mv.name}`, details: mAudit.nonDmHeadings });
        }
      } catch (e) {
        issues.push({ route: testRoute, error: `Mobile test error: ${e.message}` });
      }
    }
  }

  await browser.close();

  console.log('=== AUDIT COMPLETE ===');
  console.log(`Total Pages Audited: ${totalPagesChecked}/${routes.length}`);
  console.log(`Total Typographic Elements Audited: ${totalElementsChecked}`);
  console.log(`Issues Found: ${issues.length}`);
  if (issues.length > 0) {
    console.log('Issues:', JSON.stringify(issues, null, 2));
  } else {
    console.log('ALL 32 ROUTES 100% PASS TYPOGRAPHY AUDIT WITH PURE DM SANS!');
  }
}

audit().catch(console.error);
