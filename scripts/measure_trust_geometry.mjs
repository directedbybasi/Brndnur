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
  '/privacy-policy/'
];

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));

  for (const url of pages) {
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector('.hero, .page-hero, .shared-page-hero, header.hero');
      if (!hero) return null;
      const trust = hero.querySelector('.trust-row, .hero-features, .hero-trust-strip, .hero-assurances, [aria-label="Key Highlights"]');
      const trustRect = trust ? trust.getBoundingClientRect() : null;

      let next = hero.nextElementSibling;
      while (next && (next.tagName === 'SCRIPT' || next.tagName === 'STYLE' || next.offsetHeight === 0)) {
        next = next.nextElementSibling;
      }
      if (!next) return null;

      const nextRect = next.getBoundingClientRect();
      const nextCs = window.getComputedStyle(next);

      // In next section, find first visible element
      const firstEl = next.querySelector('.container > *, .wrap > *');
      const firstElRect = firstEl ? firstEl.getBoundingClientRect() : null;

      // Find first image in next section
      const firstImg = next.querySelector('img, picture, .section-image, .split-photo, .rounded-photo, .benefit-photo, .informed-media');
      const firstImgRect = firstImg ? firstImg.getBoundingClientRect() : null;

      return {
        trustBottom: trustRect ? Math.round(trustRect.bottom) : null,
        nextTop: Math.round(nextRect.top),
        nextPt: nextCs.paddingTop,
        nextPb: nextCs.paddingBottom,
        firstElTag: firstEl ? `${firstEl.tagName.toLowerCase()}.${firstEl.className}` : null,
        firstElTop: firstElRect ? Math.round(firstElRect.top) : null,
        firstImgTag: firstImg ? `${firstImg.tagName.toLowerCase()}.${firstImg.className}` : null,
        firstImgTop: firstImgRect ? Math.round(firstImgRect.top) : null,
        gapTrustToNextSection: trustRect ? Math.round(nextRect.top - trustRect.bottom) : null,
        gapTrustToFirstImg: (trustRect && firstImgRect) ? Math.round(firstImgRect.top - trustRect.bottom) : null,
        gapTrustToFirstEl: (trustRect && firstElRect) ? Math.round(firstElRect.top - trustRect.bottom) : null
      };
    });

    console.log(`PAGE: ${url}`);
    if (metrics) {
      console.log(`   Trust bottom: ${metrics.trustBottom} | Next section top: ${metrics.nextTop} (pt: ${metrics.nextPt}, pb: ${metrics.nextPb})`);
      console.log(`   gapTrustToNextSection: ${metrics.gapTrustToNextSection}px`);
      console.log(`   gapTrustToFirstEl: ${metrics.gapTrustToFirstEl}px (${metrics.firstElTag})`);
      console.log(`   gapTrustToFirstImg: ${metrics.gapTrustToFirstImg}px (${metrics.firstImgTag})`);
    } else {
      console.log(`   No hero or next section found`);
    }
  }

  await browser.close();
}

run().catch(console.error);
