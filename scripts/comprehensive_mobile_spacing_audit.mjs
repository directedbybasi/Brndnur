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

  const results = [];

  for (const url of pages) {
    try {
      await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.evaluate(() => {
        const ov = document.getElementById('bn-intro-overlay');
        if (ov) ov.remove();
        document.body.classList.remove('bn-intro-active');
        document.documentElement.classList.remove('bn-show-intro');
      });

      const pageData = await page.evaluate((currentUrl) => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const hasOverflow = scrollWidth > 391;

        // Hero metrics
        const hero = document.querySelector('.hero, .page-hero, .shared-page-hero, header.hero');
        let heroData = null;

        if (hero) {
          const eyebrow = hero.querySelector('.eyebrow');
          const h1 = hero.querySelector('h1');
          const goldRule = hero.querySelector('.gold-rule, .rule');
          const lead = hero.querySelector('.hero-lead, .lead, .hero-text, .hero-copy > p:not(.eyebrow)');
          const actions = hero.querySelector('.actions, .hero-actions, .button-row');
          const btns = actions ? Array.from(actions.querySelectorAll('.btn, .button, a.btn, a.button')) : [];
          const trust = hero.querySelector('.trust-row, .hero-features, .hero-trust-strip, .hero-assurances');
          const photoWrap = hero.querySelector('.hero-photo-wrap, .hero-media, .hero-image-wrap, .hero-image, .page-hero-photo');

          function r(el) {
            return el ? el.getBoundingClientRect() : null;
          }
          function cs(el) {
            return el ? window.getComputedStyle(el) : null;
          }

          const rEye = r(eyebrow);
          const rH1 = r(h1);
          const rRule = r(goldRule);
          const rLead = r(lead);
          const rAct = r(actions);
          const rTrust = r(trust);
          const rPhoto = r(photoWrap);
          const rHero = r(hero);

          // Find the next element after hero
          let next = hero.nextElementSibling;
          while (next && (next.tagName === 'SCRIPT' || next.tagName === 'STYLE' || next.offsetHeight === 0)) {
            next = next.nextElementSibling;
          }
          const rNext = r(next);
          const nextImg = next ? next.querySelector('img, .section-image, .section-photo, .rounded-photo, picture') : null;
          const rNextImg = r(nextImg);

          heroData = {
            heroHeight: rHero ? Math.round(rHero.height) : 0,
            heroPaddingBottom: cs(hero) ? cs(hero).paddingBottom : '0',
            eyebrowToH1: (rEye && rH1) ? Math.round(rH1.top - rEye.bottom) : null,
            h1ToRule: (rH1 && rRule) ? Math.round(rRule.top - rH1.bottom) : null,
            h1OrRuleToLead: rLead ? Math.round(rLead.top - (rRule ? rRule.bottom : (rH1 ? rH1.bottom : 0))) : null,
            leadToActions: (rLead && rAct) ? Math.round(rAct.top - rLead.bottom) : null,
            btnGap: btns.length > 1 ? Math.round(btns[1].getBoundingClientRect().top - btns[0].getBoundingClientRect().bottom) : null,
            btnCount: btns.length,
            btnHeights: btns.map(b => Math.round(b.getBoundingClientRect().height)),
            actionsToTrust: (rAct && rTrust) ? Math.round(rTrust.top - rAct.bottom) : null,
            trustToHeroBottom: (rTrust && rHero) ? Math.round(rHero.bottom - rTrust.bottom) : null,
            trustToNextSection: (rTrust && rNext) ? Math.round(rNext.top - rTrust.bottom) : null,
            trustToNextImg: (rTrust && rNextImg) ? Math.round(rNextImg.top - rTrust.bottom) : null,
            photoTop: rPhoto ? Math.round(rPhoto.top) : null,
            photoBottom: rPhoto ? Math.round(rPhoto.bottom) : null,
            photoHeight: rPhoto ? Math.round(rPhoto.height) : null,
            photoOrder: cs(photoWrap) ? cs(photoWrap).order : null,
            contentOrder: hero.querySelector('.hero-inner, .hero-content, .hero-copy') ? cs(hero.querySelector('.hero-inner, .hero-content, .hero-copy')).order : null
          };
        }

        // Section padding across the page
        const sections = Array.from(document.querySelectorAll('section, .section, main > section')).map((s, idx) => {
          const style = window.getComputedStyle(s);
          const rect = s.getBoundingClientRect();
          const heading = s.querySelector('h2, .section-title, .section-heading');
          const grid = s.querySelector('.service-grid, .package-grid, .steps, .step-grid, .finder-grid, .feature-grid, .faq-list, .check-list, .faq-editorial-list, .benefits, .values');
          let headingToGrid = null;
          if (heading && grid) {
            headingToGrid = Math.round(grid.getBoundingClientRect().top - heading.getBoundingClientRect().bottom);
          }
          return {
            idx,
            tag: s.tagName,
            cls: s.className,
            pt: style.paddingTop,
            pb: style.paddingBottom,
            height: Math.round(rect.height),
            headingToGrid
          };
        });

        return {
          url: currentUrl,
          hasOverflow,
          scrollWidth,
          heroData,
          sectionCount: sections.length,
          sections
        };
      }, url);

      results.push(pageData);
    } catch (e) {
      results.push({ url, error: e.message });
    }
  }

  import('fs').then(fs => {
    fs.writeFileSync('scratch/comprehensive_audit.json', JSON.stringify(results, null, 2), 'utf8');
  });
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

audit().catch(console.error);
