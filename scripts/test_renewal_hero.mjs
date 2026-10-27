import { chromium } from 'playwright';

async function testRenewalHero() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const viewports = [
    { name: '1440_large_desktop', width: 1440, height: 900 },
    { name: '1280_desktop', width: 1280, height: 800 },
    { name: '1024_small_desktop', width: 1024, height: 768 },
    { name: '768_tablet', width: 768, height: 1024 },
    { name: '390_mobile', width: 390, height: 844 },
    { name: '360_narrow_mobile', width: 360, height: 740 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:4321/trademark-renewal/', { waitUntil: 'networkidle' });

    const h1 = page.locator('#hero-title');
    const h1Text = await h1.innerText();
    const h1Lines = await page.evaluate(() => {
      const el = document.getElementById('hero-title');
      if (!el) return [];
      // Use range or client rects to see line breaks
      const text = el.innerText;
      return text.split('\n').map(l => l.trim()).filter(Boolean);
    });

    console.log(`\n[Viewport: ${vp.name} (${vp.width}px)]`);
    console.log('H1 innerText:', JSON.stringify(h1Text));
    console.log('Lines detected:', h1Lines);

    await page.locator('.hero').screenshot({ path: `tests/screenshots/before_renewal_${vp.name}.png` });
  }

  await browser.close();
}

testRenewalHero().catch(err => {
  console.error(err);
  process.exit(1);
});
