import { chromium } from 'playwright';

async function diagnose() {
  const browser = await chromium.launch();
  const viewports = [
    { name: 'mobile-375', width: 375, height: 667 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'desktop-1440', width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
    });

    const bannerInfo = await page.evaluate(() => {
      const banner = document.querySelector('.services-footer-banner');
      if (!banner) return null;
      const content = banner.querySelector('.services-footer-content');
      const text = banner.querySelector('.services-footer-text');
      const h4 = banner.querySelector('.services-footer-text h4');
      const p = banner.querySelector('.services-footer-text p');
      const btn = banner.querySelector('.services-footer-content .btn');

      const bannerRect = banner.getBoundingClientRect();
      const contentRect = content ? content.getBoundingClientRect() : null;
      const textRect = text ? text.getBoundingClientRect() : null;
      const h4Rect = h4 ? h4.getBoundingClientRect() : null;
      const pRect = p ? p.getBoundingClientRect() : null;
      const btnRect = btn ? btn.getBoundingClientRect() : null;

      const bannerCS = window.getComputedStyle(banner);
      const contentCS = content ? window.getComputedStyle(content) : null;
      const textCS = text ? window.getComputedStyle(text) : null;
      const h4CS = h4 ? window.getComputedStyle(h4) : null;
      const btnCS = btn ? window.getComputedStyle(btn) : null;

      const bodyWidth = document.body.getBoundingClientRect().width;
      const htmlScrollWidth = document.documentElement.scrollWidth;

      const gapBetween = (btnRect && pRect) ? Math.round(btnRect.top - pRect.bottom) : null;

      return {
        bannerWidth: Math.round(bannerRect.width),
        bannerHeight: Math.round(bannerRect.height),
        bannerPadding: bannerCS.padding,
        contentFlexDirection: contentCS.flexDirection,
        contentGap: contentCS.gap,
        h4FontFamily: h4CS.fontFamily,
        h4FontSize: h4CS.fontSize,
        h4FontWeight: h4CS.fontWeight,
        h4Color: h4CS.color,
        btnWidth: Math.round(btnRect.width),
        btnHeight: Math.round(btnRect.height),
        gapBetweenTextAndBtn: gapBetween,
        horizontalOverflow: htmlScrollWidth > window.innerWidth
      };
    });

    console.log(`=== Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    console.log(JSON.stringify(bannerInfo, null, 2));

    const bannerEl = await page.$('.services-footer-banner');
    if (bannerEl) {
      await bannerEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await bannerEl.screenshot({ path: `scratch/cta_${vp.name}.png` });
      console.log(`Saved screenshot: scratch/cta_${vp.name}.png`);
    }

    await page.close();
  }

  await browser.close();
}

diagnose().catch(console.error);
