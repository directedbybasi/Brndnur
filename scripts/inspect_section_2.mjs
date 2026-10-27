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
  '/resources/trademark-class-guide/',
  '/resources/brand-name-search-guide/',
  '/resources/trademark-application-process/',
  '/privacy-policy/',
  '/terms-and-conditions/',
  '/disclaimer/',
  '/refund-cancellation-policy/'
];

async function inspectSection2() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  for (const url of pages) {
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });

    const info = await page.evaluate((currentUrl) => {
      const hero = document.querySelector('.hero, .page-hero, .shared-page-hero, header.hero');
      if (!hero) return null;
      const trust = hero.querySelector('.trust-row, .hero-features, .hero-trust-strip, .hero-assurances');
      const heroBottom = Math.round(hero.getBoundingClientRect().bottom);
      const trustBottom = trust ? Math.round(trust.getBoundingClientRect().bottom) : null;

      let next = hero.nextElementSibling;
      while (next && (next.tagName === 'SCRIPT' || next.tagName === 'STYLE' || next.offsetHeight === 0)) {
        next = next.nextElementSibling;
      }
      if (!next) return { url: currentUrl, noNext: true };

      const nextTop = Math.round(next.getBoundingClientRect().top);
      const csNext = window.getComputedStyle(next);

      // Find first visible child in next section
      const allChildren = Array.from(next.querySelectorAll('*')).filter(el => {
        const r = el.getBoundingClientRect();
        return r.height > 5 && r.width > 5 && window.getComputedStyle(el).display !== 'none';
      });

      // Sort by top
      allChildren.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      const firstChild = allChildren[0];
      const firstChildRect = firstChild ? firstChild.getBoundingClientRect() : null;
      const firstChildTag = firstChild ? `${firstChild.tagName.toLowerCase()}.${firstChild.className}` : null;

      // Find first image in next section
      const firstImg = next.querySelector('img, .section-image, .section-photo, picture');
      const firstImgRect = firstImg ? firstImg.getBoundingClientRect() : null;
      const firstImgTag = firstImg ? `${firstImg.tagName.toLowerCase()}.${firstImg.className}` : null;

      return {
        url: currentUrl,
        heroCls: hero.className,
        heroBottom,
        trustBottom,
        nextCls: next.className,
        nextPt: csNext.paddingTop,
        nextPb: csNext.paddingBottom,
        gapTrustToNextSection: trustBottom ? nextTop - trustBottom : null,
        gapHeroToNextSection: nextTop - heroBottom,
        firstChildTag,
        firstChildTop: firstChildRect ? Math.round(firstChildRect.top) : null,
        gapTrustToFirstChild: (trustBottom && firstChildRect) ? Math.round(firstChildRect.top - trustBottom) : null,
        firstImgTag,
        firstImgTop: firstImgRect ? Math.round(firstImgRect.top) : null,
        gapTrustToFirstImg: (trustBottom && firstImgRect) ? Math.round(firstImgRect.top - trustBottom) : null
      };
    }, url);

    console.log(JSON.stringify(info, null, 2));
  }

  await browser.close();
}

inspectSection2().catch(console.error);
