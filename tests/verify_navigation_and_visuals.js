import { chromium } from 'playwright';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const viewports = [
    { name: 'desktop_1440', width: 1440, height: 900 },
    { name: 'desktop_1280', width: 1280, height: 800 },
    { name: 'mobile_390', width: 390, height: 844 },
  ];

  console.log('=== VERIFYING NAVIGATION INTEGRITY & CAPTURING VISUALS ===');

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:4545/', { waitUntil: 'networkidle' });

    const header = await page.locator('.bn-header');
    const headerLogo = await page.locator('.bn-header .header-logo img');
    const nav = await page.locator('.bn-nav');
    const cta = await page.locator('.bn-header .bn-cta');
    const footer = await page.locator('.bn-footer');

    const logoBox = await headerLogo.boundingBox();
    console.log(`\n[Viewport: ${vp.name}]`);
    console.log(`  Header Logo: ${logoBox?.width.toFixed(1)}px x ${logoBox?.height.toFixed(1)}px at (x=${logoBox?.x.toFixed(1)}, y=${logoBox?.y.toFixed(1)})`);

    if (vp.width >= 1040) {
      const navBox = await nav.boundingBox();
      const ctaBox = await cta.boundingBox();

      console.log(`  Nav Box: x=${navBox?.x.toFixed(1)}, width=${navBox?.width.toFixed(1)}px`);
      console.log(`  CTA Box: x=${ctaBox?.x.toFixed(1)}, width=${ctaBox?.width.toFixed(1)}px`);

      // Check collision
      const logoRight = (logoBox?.x || 0) + (logoBox?.width || 0);
      const navLeft = navBox?.x || 0;
      const navRight = (navBox?.x || 0) + (navBox?.width || 0);
      const ctaLeft = ctaBox?.x || 0;

      const gapLogoNav = navLeft - logoRight;
      const gapNavCta = ctaLeft - navRight;

      console.log(`  Gap Logo -> Nav: ${gapLogoNav.toFixed(1)}px (Must be > 0)`);
      console.log(`  Gap Nav -> CTA:  ${gapNavCta.toFixed(1)}px (Must be > 0)`);

      if (gapLogoNav <= 0 || gapNavCta <= 0) {
        console.error('❌ COLLISION DETECTED!');
      } else {
        console.log('✅ Spacing is healthy and balanced. No collision!');
      }

      // Check if nav links wrap
      const navLinks = await page.locator('.bn-nav > a').all();
      let firstY = null;
      let wrapped = false;
      for (const link of navLinks) {
        const isVisible = await link.isVisible();
        if (isVisible) {
          const box = await link.boundingBox();
          if (box) {
            if (firstY === null) firstY = Math.round(box.y);
            else if (Math.abs(Math.round(box.y) - firstY) > 5) {
              wrapped = true;
            }
          }
        }
      }
      console.log(`  Nav links single-line: ${!wrapped ? '✅ PASS' : '❌ WRAPPED'}`);
    }

    // Screenshots
    await header.screenshot({ path: `tests/screenshot_header_${vp.name}.png` });
    await footer.screenshot({ path: `tests/screenshot_footer_${vp.name}.png` });
    console.log(`  Saved screenshots: tests/screenshot_header_${vp.name}.png, tests/screenshot_footer_${vp.name}.png`);
  }

  await browser.close();
}

run().catch(console.error);
