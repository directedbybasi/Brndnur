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
  '/refund-cancellation-policy/',
  '/404.html'
];

async function audit() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  const results = {};

  for (const url of pages) {
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });

    const pageImages = await page.evaluate((currentUrl) => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map((img, i) => {
        const src = img.getAttribute('src') || '';
        const cls = img.className;
        const alt = img.getAttribute('alt') || '';
        const parent = img.parentElement;
        const parentCls = parent ? parent.className : '';
        const parentTag = parent ? parent.tagName.toLowerCase() : '';
        
        // Closest section or component
        const section = img.closest('section, header, footer, nav, .hero, .shared-page-hero, .page-hero');
        const secCls = section ? section.className : '';
        const secId = section ? section.id : '';
        
        // Is it inside a carousel/slider?
        const isSlider = !!img.closest('.bn-carousel, .card-carousel, .carousel-track, .bn-carousel-track, .slider, .infinite-scroll');
        
        // Is it inside a hero?
        const isHero = !!img.closest('.hero, .shared-page-hero, .page-hero, .hero-photo-wrap, .hero-image-wrap');
        
        // Is it a logo/icon/badge?
        const isLogo = !!(img.closest('.logo, .site-logo, header, footer, .trust-icon, .icon') || src.includes('logo') || src.includes('icon'));

        // Computed style
        const cs = window.getComputedStyle(img);
        const rect = img.getBoundingClientRect();
        const parentRect = parent ? parent.getBoundingClientRect() : null;

        // Ratio
        const ratio = rect.height > 0 ? (rect.width / rect.height) : 0;
        const is3by4 = Math.abs(ratio - (3 / 4)) < 0.05; // ~0.75 +/- 0.05

        return {
          index: i,
          src,
          cls,
          alt: alt.slice(0, 30),
          parentTag,
          parentCls,
          secCls,
          secId,
          isHero,
          isSlider,
          isLogo,
          isEligibleContentImg: !isHero && !isSlider && !isLogo && rect.width > 50,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          ratio: parseFloat(ratio.toFixed(2)),
          is3by4,
          aspectRatioCss: cs.aspectRatio,
          objectFit: cs.objectFit,
          objectPosition: cs.objectPosition,
          borderRadius: cs.borderRadius
        };
      });
    }, url);

    results[url] = pageImages;
  }

  await browser.close();

  const fs = await import('fs');
  fs.writeFileSync('scratch/all_images_mobile_audit.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved scratch/all_images_mobile_audit.json');

  // Summary analysis
  let totalEligible = 0;
  let totalEligible3by4 = 0;
  let non3by4Eligible = [];

  for (const [url, imgs] of Object.entries(results)) {
    imgs.forEach(img => {
      if (img.isEligibleContentImg) {
        totalEligible++;
        if (img.is3by4) {
          totalEligible3by4++;
        } else {
          non3by4Eligible.push({ url, ...img });
        }
      }
    });
  }

  console.log(`\n================================================================`);
  console.log(`TOTAL ELIGIBLE CONTENT IMAGES: ${totalEligible}`);
  console.log(`CURRENTLY 3:4 PORTRAIT: ${totalEligible3by4}`);
  console.log(`NEED ATTENTION: ${non3by4Eligible.length}`);
  console.log(`================================================================\n`);

  if (non3by4Eligible.length > 0) {
    console.log('List of images needing attention:');
    non3by4Eligible.forEach(item => {
      console.log(`- [${item.url}] src: ${item.src} | parent: ${item.parentTag}.${item.parentCls} | current: ${item.width}x${item.height} (ratio: ${item.ratio}) | css-aspect: ${item.aspectRatioCss}`);
    });
  }
}

audit().catch(console.error);
