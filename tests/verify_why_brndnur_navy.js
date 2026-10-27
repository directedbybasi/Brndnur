import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4545/#about', { waitUntil: 'networkidle' });

  const aboutSection = page.locator('#about');
  await aboutSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  if (!fs.existsSync('.planning/screenshots')) {
    fs.mkdirSync('.planning/screenshots', { recursive: true });
  }

  // Check computed styles
  const styles = await page.evaluate(() => {
    const sec = document.querySelector('#about');
    const h2 = sec.querySelector('h2');
    const eyebrow = sec.querySelector('.eyebrow');
    const p = sec.querySelector('.about-copy > p');
    const strong = sec.querySelector('.value strong');
    const icon = sec.querySelector('.value-icon');

    return {
      secBg: window.getComputedStyle(sec).backgroundColor,
      h2Color: window.getComputedStyle(h2).color,
      eyebrowColor: window.getComputedStyle(eyebrow).color,
      pColor: window.getComputedStyle(p).color,
      strongColor: window.getComputedStyle(strong).color,
      iconColor: window.getComputedStyle(icon).color
    };
  });

  console.log('Section 6 computed styles:', styles);

  // Capture desktop screenshot
  await aboutSection.screenshot({ path: '.planning/screenshots/why_brndnur_navy_desktop.png' });
  console.log('Desktop screenshot saved!');

  // Capture mobile screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await aboutSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await aboutSection.screenshot({ path: '.planning/screenshots/why_brndnur_navy_mobile.png' });
  console.log('Mobile screenshot saved!');

  await browser.close();
  console.log('Verification finished successfully!');
})();
