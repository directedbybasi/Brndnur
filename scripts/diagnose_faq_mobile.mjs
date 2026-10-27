import { chromium } from 'playwright';

const testPages = [
  '/',
  '/services/',
  '/packages/',
  '/trademark-registration/',
  '/faqs/',
  '/trademark-renewal/',
  '/trademark-classes/',
  '/trademark-monitoring/',
  '/wordmark-registration/',
  '/logo-trademark-registration/',
  '/gst-registration/',
  '/udyam-msme-registration/',
  '/fssai-registration/',
  '/business-setup/',
  '/packages/individual-msme/',
  '/packages/company-llp/',
  '/packages/food-brand/',
  '/packages/gulf-return-business/'
];

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });

  for (const p of testPages) {
    await page.goto(`http://localhost:4321${p}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
    });

    const faqDiagnostics = await page.evaluate((currentPath) => {
      // Find all FAQ rows / items / details
      const items = document.querySelectorAll('.faq-row-item, .faq-details, .faq-item, details.faq-item, .faq-list > details, .faq-list > .faq-item');
      const diagnostics = [];

      items.forEach((item, index) => {
        const numEl = item.querySelector('.faq-row-num, .faq-num');
        const vbarEl = item.querySelector('.faq-row-vbar');
        const questionEl = item.querySelector('.faq-row-question, .faq-question, summary');
        const toggleEl = item.querySelector('.faq-row-toggle, .faq-icon');
        const leadEl = item.querySelector('.faq-row-lead');

        const qStyle = questionEl ? window.getComputedStyle(questionEl) : null;
        const qRect = questionEl ? questionEl.getBoundingClientRect() : null;
        const leadStyle = leadEl ? window.getComputedStyle(leadEl) : null;
        const leadRect = leadEl ? leadEl.getBoundingClientRect() : null;

        diagnostics.push({
          index: index + 1,
          numText: numEl ? numEl.textContent.trim() : null,
          questionText: questionEl ? questionEl.textContent.trim() : null,
          hasVbar: !!vbarEl,
          hasToggle: !!toggleEl,
          questionVisible: qStyle ? (qStyle.display !== 'none' && qStyle.visibility !== 'hidden' && parseFloat(qStyle.opacity) > 0) : false,
          questionWidth: qRect ? qRect.width : 0,
          questionHeight: qRect ? qRect.height : 0,
          leadWidth: leadRect ? leadRect.width : 0,
          leadFlex: leadStyle ? leadStyle.flex : null,
          qColor: qStyle ? qStyle.color : null
        });
      });

      return {
        path: currentPath,
        itemCount: items.length,
        diagnostics
      };
    }, p);

    console.log(`\n--- PAGE: ${p} (${faqDiagnostics.itemCount} items) ---`);
    if (faqDiagnostics.itemCount > 0) {
      console.log(JSON.stringify(faqDiagnostics.diagnostics[0], null, 2));
      // Check if any item has width 0 or height 0 or questionVisible false
      const invisible = faqDiagnostics.diagnostics.filter(d => !d.questionVisible || d.questionWidth < 10 || d.questionHeight < 5);
      if (invisible.length > 0) {
        console.log(`⚠️ FOUND ${invisible.length} INVISIBLE QUESTIONS ON ${p}!`);
        console.log(JSON.stringify(invisible, null, 2));
      } else {
        console.log(`✅ All ${faqDiagnostics.itemCount} questions visible with width > 10px`);
      }
    }
  }

  // Also capture a screenshot of /services/ FAQ section
  await page.goto('http://localhost:4321/services/', { waitUntil: 'networkidle' });
  const faqSec = await page.$('.faq-section, #faqs');
  if (faqSec) {
    await faqSec.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'scratch/diagnose_services_faq_390.png' });
  }

  // Also capture /trademark-registration/ FAQ section
  await page.goto('http://localhost:4321/trademark-registration/', { waitUntil: 'networkidle' });
  const tmFaqSec = await page.$('.faq-section, #faqs');
  if (tmFaqSec) {
    await tmFaqSec.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'scratch/diagnose_tm_faq_390.png' });
  }

  // Also capture /packages/ FAQ section
  await page.goto('http://localhost:4321/packages/', { waitUntil: 'networkidle' });
  const pkgFaqSec = await page.$('.faq-section, #faqs');
  if (pkgFaqSec) {
    await pkgFaqSec.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'scratch/diagnose_packages_faq_390.png' });
  }

  await browser.close();
}

run().catch(console.error);
