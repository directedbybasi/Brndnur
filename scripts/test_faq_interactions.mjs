import { chromium } from 'playwright';

async function testInteractions() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  const viewports = [320, 360, 375, 390, 430, 768, 1280];

  for (const w of viewports) {
    await page.setViewportSize({ width: w, height: 844 });
    await page.goto('http://localhost:4321/services/', { waitUntil: 'networkidle' });

    // Open first FAQ
    const firstFaqSummary = await page.$('.faq-row-item summary, details.faq-item summary');
    if (firstFaqSummary) {
      await firstFaqSummary.click();
      await page.waitForTimeout(100);
      
      const isOpen = await page.evaluate(() => {
        const d = document.querySelector('.faq-row-item, details.faq-item');
        const ans = d.querySelector('.faq-row-content, .faq-answer');
        const ansStyle = window.getComputedStyle(ans);
        return {
          hasOpenAttr: d.hasAttribute('open'),
          answerDisplay: ansStyle.display,
          answerHeight: ans.getBoundingClientRect().height,
          answerText: ans.textContent.trim().slice(0, 50),
          ansColor: ansStyle.color
        };
      });

      console.log(`[Width ${w}px] Services FAQ #1 expanded:`, JSON.stringify(isOpen));
      if (w === 390) {
        const faqSec = await page.$('.faq-section');
        await faqSec.screenshot({ path: 'scratch/services_faq_expanded_390.png' });
      }
    }
  }

  // Also test /packages/ expanded at 390px
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:4321/packages/', { waitUntil: 'networkidle' });
  const pkgSummary = await page.$('.faq-row-item summary, details.faq-item summary');
  if (pkgSummary) {
    await pkgSummary.click();
    await page.waitForTimeout(100);
    const faqSec = await page.$('.faq-section');
    await faqSec.screenshot({ path: 'scratch/packages_faq_expanded_390.png' });
  }

  // Keyboard navigation test
  await page.goto('http://localhost:4321/services/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  // Focus into summary
  await page.evaluate(() => {
    const s = document.querySelector('.faq-row-summary');
    if (s) s.focus();
  });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  const kbResult = await page.evaluate(() => {
    const d = document.querySelector('.faq-row-item');
    return d ? d.hasAttribute('open') : false;
  });
  console.log(`Keyboard Enter toggle test: ${kbResult ? 'PASSED' : 'FAILED'}`);

  await browser.close();
  console.log('Interactions test complete.');
}

testInteractions().catch(console.error);
