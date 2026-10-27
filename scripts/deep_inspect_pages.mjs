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

async function deepInspect() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  const report = {};

  for (const url of pages) {
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });

    const data = await page.evaluate(() => {
      const hero = document.querySelector('.hero, .page-hero, .shared-page-hero, header.hero');
      if (!hero) return null;

      const eyebrow = hero.querySelector('.eyebrow');
      const h1 = hero.querySelector('h1');
      const goldRule = hero.querySelector('.gold-rule, .rule');
      const lead = hero.querySelector('.hero-lead, .lead, .hero-text, .hero-copy > p:not(.eyebrow)');
      const actions = hero.querySelector('.actions, .hero-actions, .button-row');
      const btns = actions ? Array.from(actions.querySelectorAll('.btn, .button, a.btn, a.button')) : [];
      const trust = hero.querySelector('.trust-row, .hero-features, .hero-trust-strip, .hero-assurances');
      const photoWrap = hero.querySelector('.hero-photo-wrap, .hero-media, .hero-image-wrap, .hero-image, .page-hero-photo');

      function cs(el) { return el ? window.getComputedStyle(el) : null; }
      function r(el) { return el ? el.getBoundingClientRect() : null; }

      // Look at section 2
      let sec2 = hero.nextElementSibling;
      while (sec2 && (sec2.tagName === 'SCRIPT' || sec2.tagName === 'STYLE' || sec2.offsetHeight === 0)) {
        sec2 = sec2.nextElementSibling;
      }
      const sec2Img = sec2 ? sec2.querySelector('img, .section-image, .section-photo, picture') : null;

      // Look at all sections
      const sections = Array.from(document.querySelectorAll('section, main > section')).map(s => {
        const c = window.getComputedStyle(s);
        return {
          cls: s.className,
          id: s.id,
          pt: c.paddingTop,
          pb: c.paddingBottom
        };
      });

      return {
        hero: {
          pt: cs(hero)?.paddingTop,
          pb: cs(hero)?.paddingBottom,
          eyebrowMb: cs(eyebrow)?.marginBottom,
          h1Mb: cs(h1)?.marginBottom,
          ruleMt: cs(goldRule)?.marginTop,
          ruleMb: cs(goldRule)?.marginBottom,
          leadMb: cs(lead)?.marginBottom,
          actionsMt: cs(actions)?.marginTop,
          actionsMb: cs(actions)?.marginBottom,
          actionsGap: cs(actions)?.gap,
          btnGap: btns.length > 1 ? Math.round(r(btns[1]).top - r(btns[0]).bottom) : null,
          trustMt: cs(trust)?.marginTop,
          trustMb: cs(trust)?.marginBottom,
          trustToHeroBottom: (trust && hero) ? Math.round(r(hero).bottom - r(trust).bottom) : null,
          trustToSec2Top: (trust && sec2) ? Math.round(r(sec2).top - r(trust).bottom) : null,
          trustToSec2Img: (trust && sec2Img) ? Math.round(r(sec2Img).top - r(trust).bottom) : null
        },
        sec2: sec2 ? {
          cls: sec2.className,
          id: sec2.id,
          pt: cs(sec2)?.paddingTop,
          pb: cs(sec2)?.paddingBottom,
          hasImg: !!sec2Img,
          imgIsFirst: sec2Img ? (r(sec2Img).top <= (r(sec2).top + parseFloat(cs(sec2).paddingTop) + 10)) : false
        } : null,
        sections
      };
    });

    report[url] = data;
  }

  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

deepInspect().catch(console.error);
