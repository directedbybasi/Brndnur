import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4545/#faq-preview', { waitUntil: 'networkidle' });

  const faqSection = page.locator('#faq-preview');
  await faqSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  if (!fs.existsSync('.planning/screenshots')) {
    fs.mkdirSync('.planning/screenshots', { recursive: true });
  }

  // Check computed styles
  const styles = await page.evaluate(() => {
    const sec = document.querySelector('#faq-preview');
    const h2 = sec.querySelector('h2');
    const eyebrow = sec.querySelector('.eyebrow');
    const p = sec.querySelector('.section-heading p:not(.eyebrow)');
    const card = sec.querySelector('.faq-details');
    const summary = sec.querySelector('.faq-summary');
    const summarySpan = sec.querySelector('.faq-summary span:first-child');
    const icon = sec.querySelector('.faq-icon-marker');
    const btn = sec.querySelector('.faq-footer .btn-secondary');

    return {
      secBg: window.getComputedStyle(sec).backgroundColor,
      h2Color: window.getComputedStyle(h2).color,
      eyebrowColor: window.getComputedStyle(eyebrow).color,
      leadPColor: window.getComputedStyle(p).color,
      cardBg: window.getComputedStyle(card).backgroundColor,
      cardBorder: window.getComputedStyle(card).borderColor,
      summaryColor: window.getComputedStyle(summary).color,
      summarySpanColor: window.getComputedStyle(summarySpan).color,
      iconColor: window.getComputedStyle(icon).color,
      btnBg: window.getComputedStyle(btn).backgroundColor,
      btnColor: window.getComputedStyle(btn).color,
      btnBorder: window.getComputedStyle(btn).borderColor
    };
  });

  console.log('Section 8 computed styles:', JSON.stringify(styles, null, 2));

  // Open first accordion to check open state styles
  const firstSummary = faqSection.locator('.faq-summary').first();
  await firstSummary.click();
  await page.waitForTimeout(300);

  const openCardStyles = await page.evaluate(() => {
    const openCard = document.querySelector('#faq-preview .faq-details[open]');
    const answerP = openCard.querySelector('.faq-content p');
    const icon = openCard.querySelector('.faq-icon-marker');
    return {
      openCardBg: window.getComputedStyle(openCard).backgroundColor,
      openCardBorder: window.getComputedStyle(openCard).borderColor,
      answerPColor: window.getComputedStyle(answerP).color,
      iconColor: window.getComputedStyle(icon).color,
      iconTransform: window.getComputedStyle(icon).transform
    };
  });
  console.log('Open accordion styles:', JSON.stringify(openCardStyles, null, 2));

  // Capture desktop screenshot
  await faqSection.screenshot({ path: '.planning/screenshots/faq_navy_desktop.png' });
  console.log('Desktop screenshot saved to .planning/screenshots/faq_navy_desktop.png');

  // Capture mobile screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await faqSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await faqSection.screenshot({ path: '.planning/screenshots/faq_navy_mobile.png' });
  console.log('Mobile screenshot saved to .planning/screenshots/faq_navy_mobile.png');

  await browser.close();
  console.log('FAQ Navy Verification finished successfully!');
})();
