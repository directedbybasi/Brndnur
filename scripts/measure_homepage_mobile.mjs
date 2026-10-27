import { chromium } from 'playwright';

async function measure() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  const testUrls = [
    '/',
    '/trademark-registration/',
    '/services/',
    '/packages/',
    '/about/',
    '/how-it-works/',
    '/faqs/',
    '/contact/',
    '/wordmark-registration/',
    '/gst-registration/',
    '/business-setup/',
    '/resources/'
  ];

  for (const url of testUrls) {
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
    });

    const data = await page.evaluate(() => {
      const hero = document.querySelector('.hero, .page-hero, .shared-page-hero');
      if (!hero) return { error: 'No hero found' };

      const eyebrow = hero.querySelector('.eyebrow');
      const h1 = hero.querySelector('h1');
      const goldRule = hero.querySelector('.gold-rule, .rule');
      const lead = hero.querySelector('.hero-lead, .hero-copy > p:not(.eyebrow), .lead');
      const actions = hero.querySelector('.actions, .hero-actions');
      const btns = actions ? Array.from(actions.querySelectorAll('.btn, a.btn')) : [];
      const trustRow = hero.querySelector('.trust-row, .hero-features, .hero-trust-strip');
      const photoWrap = hero.querySelector('.hero-photo-wrap, .hero-image-wrap, .hero-image, .page-hero-photo');
      const photo = hero.querySelector('.hero-photo, .hero-image img, .page-hero-photo img');

      function getBox(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        return {
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          height: Math.round(r.height),
          marginTop: cs.marginTop,
          marginBottom: cs.marginBottom,
          paddingTop: cs.paddingTop,
          paddingBottom: cs.paddingBottom,
          order: cs.order,
          display: cs.display
        };
      }

      // Check the next section after hero
      let nextSection = hero.nextElementSibling;
      while (nextSection && (nextSection.tagName !== 'SECTION' && !nextSection.classList.contains('section'))) {
        nextSection = nextSection.nextElementSibling;
      }

      return {
        heroBox: getBox(hero),
        eyebrowBox: getBox(eyebrow),
        h1Box: getBox(h1),
        goldRuleBox: getBox(goldRule),
        leadBox: getBox(lead),
        actionsBox: getBox(actions),
        btnCount: btns.length,
        btnsBoxes: btns.map(b => getBox(b)),
        trustRowBox: getBox(trustRow),
        photoWrapBox: getBox(photoWrap),
        nextSectionTag: nextSection ? nextSection.className : null,
        nextSectionBox: getBox(nextSection),
        gapTrustToNext: (trustRow && nextSection) ? Math.round(nextSection.getBoundingClientRect().top - trustRow.getBoundingClientRect().bottom) : null,
        gapPhotoToNext: (photoWrap && nextSection) ? Math.round(nextSection.getBoundingClientRect().top - photoWrap.getBoundingClientRect().bottom) : null
      };
    });

    console.log(`\n================== ${url} ==================`);
    console.log(JSON.stringify(data, null, 2));

    await page.screenshot({ path: `scratch/mobile_hero_${url.replace(/\//g, '_')}.png`, fullPage: false });
  }

  await browser.close();
}

measure().catch(console.error);
