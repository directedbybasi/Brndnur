import { chromium } from 'playwright';

const viewports = [
  { name: 'Large Desktop', width: 1440, height: 900 },
  { name: 'Standard Desktop', width: 1280, height: 800 },
  { name: 'Small Desktop/Tablet Landscape', width: 1040, height: 768 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Mobile', width: 390, height: 844 },
];

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('--- AUDITING FOOTER LOGO & EMAIL DIMENSIONS ---');

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:4545/', { waitUntil: 'networkidle' });

    const headerLogo = await page.locator('.bn-header .header-logo img').boundingBox();
    const headerInner = await page.locator('.bn-header-inner').boundingBox();
    const footerLogo = await page.locator('.bn-footer .footer-logo img').boundingBox();
    const footerCol = await page.locator('.bn-footer-brand').boundingBox();
    const emailLink = await page.locator('.footer-contact-email').boundingBox();
    const emailSpan = await page.locator('.footer-contact-email span').boundingBox();

    // Check line count of email text via client rects
    const lineCount = await page.evaluate(() => {
      const el = document.querySelector('.footer-contact-email span');
      if (!el) return 0;
      const rects = el.getClientRects();
      return rects.length;
    });

    console.log(`\n[Viewport: ${vp.name} (${vp.width}x${vp.height})]`);
    console.log(`  Header Inner: height=${headerInner?.height.toFixed(1)}px`);
    console.log(`  Header Logo:  width=${headerLogo?.width.toFixed(1)}px, height=${headerLogo?.height.toFixed(1)}px`);
    console.log(`  Footer Col 1: width=${footerCol?.width.toFixed(1)}px`);
    console.log(`  Footer Logo:  width=${footerLogo?.width.toFixed(1)}px, height=${footerLogo?.height.toFixed(1)}px`);
    console.log(`  Email Box:    width=${emailLink?.width.toFixed(1)}px, height=${emailLink?.height.toFixed(1)}px`);
    console.log(`  Email Span:   width=${emailSpan?.width.toFixed(1)}px, height=${emailSpan?.height.toFixed(1)}px`);
    console.log(`  Email Lines:  ${lineCount} line(s) ${lineCount === 1 ? '✅ SINGLE LINE' : '(wrapped)'}`);

    // Take screenshot of footer
    const footer = await page.locator('.bn-footer');
    await footer.screenshot({ path: `tests/screenshot_footer_v2_${vp.name.replace(/[^a-zA-Z0-9]/g, '_')}.png` });
  }

  await browser.close();
}

run().catch(console.error);
