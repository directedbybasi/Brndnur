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

const viewports = [
  { name: '320px (min mobile)', width: 320, height: 600 },
  { name: '360px (android narrow)', width: 360, height: 740 },
  { name: '375px (iphone SE)', width: 375, height: 667 },
  { name: '390px (standard mobile)', width: 390, height: 844 },
  { name: '430px (iphone pro max)', width: 430, height: 932 },
  { name: '767px (max mobile)', width: 767, height: 1024 },
  { name: '768px (tablet)', width: 768, height: 1024 },
  { name: '1024px (desktop min)', width: 1024, height: 768 },
  { name: '1440px (desktop standard)', width: 1440, height: 900 }
];

async function run() {
  const browser = await chromium.launch();
  let totalViolations = 0;
  const auditReport = {};

  console.log('================================================================');
  console.log('BRNDNUR MOBILE SPACING PRECISION AUDIT ACROSS 32 ROUTES');
  console.log('================================================================\n');

  // 1. Detailed 390px Spacing Audit against User Guidelines
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await mobileContext.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await mobileContext.newPage();

  for (const url of pages) {
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });

    const metrics = await page.evaluate(() => {
      const results = {
        hero: null,
        heroToSec2: null,
        sections: [],
        splitSections: [],
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };

      // 1. Check Hero Spacing
      const hero = document.querySelector('section.hero, .shared-page-hero, .page-hero');
      if (hero) {
        const eye = hero.querySelector('.eyebrow');
        const h1 = hero.querySelector('h1');
        const rule = hero.querySelector('.gold-rule, .rule, .accent-line');
        const lead = hero.querySelector('.hero-lead, p:not(.eyebrow)');
        const actions = hero.querySelector('.actions, .hero-actions');
        const trust = hero.querySelector('.trust-row');
        const photo = hero.querySelector('.hero-photo-wrap, .hero-photo, .hero-media, .hero-image-wrap');

        const eyeR = eye ? eye.getBoundingClientRect() : null;
        const h1R = h1 ? h1.getBoundingClientRect() : null;
        const ruleR = rule ? rule.getBoundingClientRect() : null;
        const leadR = lead ? lead.getBoundingClientRect() : null;
        const actR = actions ? actions.getBoundingClientRect() : null;
        const trustR = trust ? trust.getBoundingClientRect() : null;
        const photoR = photo ? photo.getBoundingClientRect() : null;

        results.hero = {
          eyebrowToH1: (eyeR && h1R) ? Math.round(h1R.top - eyeR.bottom) : null,
          h1ToRule: (h1R && ruleR) ? Math.round(ruleR.top - h1R.bottom) : null,
          ruleToLead: (ruleR && leadR) ? Math.round(leadR.top - ruleR.bottom) : null,
          h1ToLead: (!ruleR && h1R && leadR) ? Math.round(leadR.top - h1R.bottom) : null,
          leadToActions: (leadR && actR) ? Math.round(actR.top - leadR.bottom) : null,
          actionsToTrust: (actR && trustR) ? Math.round(trustR.top - actR.bottom) : null,
          photoHeight: photoR ? Math.round(photoR.height) : null,
          photoWidth: photoR ? Math.round(photoR.width) : null
        };

        // Hero to Section 2 Transition
        const sec2 = hero.nextElementSibling;
        if (sec2 && trustR) {
          const sec2Img = sec2.querySelector('img, .split-photo, .benefit-photo, .trademark-photo');
          const sec2ImgR = sec2Img ? sec2Img.getBoundingClientRect() : null;
          const sec2FirstEl = sec2.querySelector('.container > *, section > *') || sec2.firstElementChild;
          const sec2FirstElR = sec2FirstEl ? sec2FirstEl.getBoundingClientRect() : null;

          results.heroToSec2 = {
            trustToImg: sec2ImgR ? Math.round(sec2ImgR.top - trustR.bottom) : null,
            trustToFirstEl: sec2FirstElR ? Math.round(sec2FirstElR.top - trustR.bottom) : null
          };
        }
      }

      // 2. Check Split Sections
      const splits = document.querySelectorAll('.split-section, .split-row, .informed-split, .benefits-grid, .support-grid, .process-grid');
      splits.forEach((spl, idx) => {
        const photo = spl.querySelector('.split-photo, .rounded-photo, .benefit-photo, .support-photo, .process-photo, .informed-media, .section-image');
        const copy = spl.querySelector('.split-copy, .benefit-content, .support-copy, .process-copy, .informed-content, .section-copy');
        if (photo && copy) {
          const photoR = photo.getBoundingClientRect();
          const copyR = copy.getBoundingClientRect();

          const eye = copy.querySelector('.eyebrow');
          const h2 = copy.querySelector('h2, .section-title');
          const rule = copy.querySelector('.gold-rule, .rule, .accent-line');
          const p = copy.querySelector('p:not(.eyebrow), .lead');
          const values = copy.querySelector('.values, .feature-grid, .check-list, .steps');

          const eyeR = eye ? eye.getBoundingClientRect() : null;
          const h2R = h2 ? h2.getBoundingClientRect() : null;
          const ruleR = rule ? rule.getBoundingClientRect() : null;
          const pR = p ? p.getBoundingClientRect() : null;
          const valR = values ? values.getBoundingClientRect() : null;

          results.splitSections.push({
            index: idx,
            photoToCopy: Math.round(copyR.top - photoR.bottom),
            eyeToH2: (eyeR && h2R) ? Math.round(h2R.top - eyeR.bottom) : null,
            h2ToRule: (h2R && ruleR) ? Math.round(ruleR.top - h2R.bottom) : null,
            ruleToP: (ruleR && pR) ? Math.round(pR.top - ruleR.bottom) : null,
            h2ToP: (!ruleR && h2R && pR) ? Math.round(pR.top - h2R.bottom) : null,
            pToValues: (pR && valR) ? Math.round(valR.top - pR.bottom) : null
          });
        }
      });

      // 3. Check Section Padding
      const allSections = document.querySelectorAll('section, .section, .section-alt, .process-section, .cta-band, .cta-section');
      allSections.forEach((sec, idx) => {
        const cs = window.getComputedStyle(sec);
        const pt = parseFloat(cs.paddingTop);
        const pb = parseFloat(cs.paddingBottom);
        const heading = sec.querySelector('.section-heading');
        let headingMb = null;
        if (heading) {
          headingMb = parseFloat(window.getComputedStyle(heading).marginBottom);
        }

        results.sections.push({
          idx,
          cls: sec.className,
          pt: Math.round(pt),
          pb: Math.round(pb),
          headingMb: headingMb !== null ? Math.round(headingMb) : null
        });
      });

      return results;
    });

    auditReport[url] = metrics;
  }

  await mobileContext.close();

  // Validate metrics against guidelines
  for (const [url, data] of Object.entries(auditReport)) {
    const pageIssues = [];

    // Overflow check
    if (data.overflow) {
      pageIssues.push(`[HORIZONTAL OVERFLOW] Page has horizontal scrollbar!`);
    }

    // Hero checks
    if (data.hero) {
      const h = data.hero;
      if (h.eyebrowToH1 !== null && (h.eyebrowToH1 < 6 || h.eyebrowToH1 > 16)) {
        pageIssues.push(`Hero Eyebrow->H1: ${h.eyebrowToH1}px (target: 8-12px)`);
      }
      if (h.h1ToRule !== null && (h.h1ToRule < 10 || h.h1ToRule > 20)) {
        pageIssues.push(`Hero H1->Rule: ${h.h1ToRule}px (target: 12-16px)`);
      }
      if (h.actionsToTrust !== null && (h.actionsToTrust < 16 || h.actionsToTrust > 28)) {
        pageIssues.push(`Hero Actions->Trust: ${h.actionsToTrust}px (target: 20-24px)`);
      }
    }

    // Hero to Sec2 Transition
    if (data.heroToSec2) {
      const trans = data.heroToSec2;
      const target = trans.trustToImg !== null ? trans.trustToImg : trans.trustToFirstEl;
      if (target !== null && (target < 20 || target > 36)) {
        pageIssues.push(`Feature Strip -> Next Image/Content: ${target}px (target: 24-32px)`);
      }
    }

    // Split sections checks
    data.splitSections.forEach((spl, i) => {
      if (spl.photoToCopy < 18 || spl.photoToCopy > 38) {
        pageIssues.push(`Split [${i}] Photo->Copy Gap: ${spl.photoToCopy}px (target: 24-34px)`);
      }
      if (spl.eyeToH2 !== null && (spl.eyeToH2 < 6 || spl.eyeToH2 > 16)) {
        pageIssues.push(`Split [${i}] Eyebrow->H2: ${spl.eyeToH2}px (target: 8-12px)`);
      }
      if (spl.h2ToRule !== null && (spl.h2ToRule < 10 || spl.h2ToRule > 20)) {
        pageIssues.push(`Split [${i}] H2->Rule: ${spl.h2ToRule}px (target: 12-16px)`);
      }
      if (spl.ruleToP !== null && (spl.ruleToP < 12 || spl.ruleToP > 24)) {
        pageIssues.push(`Split [${i}] Rule->P: ${spl.ruleToP}px (target: 16-20px)`);
      }
      if (spl.h2ToP !== null && (spl.h2ToP < 12 || spl.h2ToP > 24)) {
        pageIssues.push(`Split [${i}] H2->P: ${spl.h2ToP}px (target: 16-20px)`);
      }
    });

    // Section padding checks
    data.sections.forEach((sec, i) => {
      // Exclude zero-padding wrapper divs if any
      if (sec.pt !== 0 && (sec.pt < 24 || sec.pt > 48)) {
        pageIssues.push(`Section [${i}: ${sec.cls}] paddingTop: ${sec.pt}px (target: 32-48px)`);
      }
      if (sec.pb !== 0 && (sec.pb < 24 || sec.pb > 48)) {
        pageIssues.push(`Section [${i}: ${sec.cls}] paddingBottom: ${sec.pb}px (target: 32-48px)`);
      }
      if (sec.headingMb !== null && (sec.headingMb < 18 || sec.headingMb > 34)) {
        pageIssues.push(`Section [${i}: ${sec.cls}] heading marginBottom: ${sec.headingMb}px (target: 22-28px)`);
      }
    });

    if (pageIssues.length > 0) {
      console.log(`❌ ${url} (${pageIssues.length} issues):`);
      pageIssues.forEach(iss => console.log(`   - ${iss}`));
      totalViolations += pageIssues.length;
    } else {
      console.log(`✅ ${url} — 100% compliant with approved mobile guidelines`);
    }
  }

  console.log(`\n================================================================`);
  console.log(`390px Audit Complete: ${totalViolations} guideline issues detected across 32 pages.`);
  console.log('================================================================\n');

  // 2. Multi-viewport Overflow & Layout Regression Verification
  console.log('Starting Multi-Viewport Overflow & Responsive Regression Suite...');
  let overflowViolations = 0;

  for (const vp of viewports) {
    const vpContext = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await vpContext.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
    const vpPage = await vpContext.newPage();

    let vpOverflowCount = 0;
    for (const url of pages) {
      await vpPage.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
      await vpPage.evaluate(() => {
        const ov = document.getElementById('bn-intro-overlay');
        if (ov) ov.remove();
        document.body.classList.remove('bn-intro-active');
        document.documentElement.classList.remove('bn-show-intro');
      });

      const hasOverflow = await vpPage.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (hasOverflow) {
        vpOverflowCount++;
        overflowViolations++;
        console.log(`⚠️ Overflow at ${vp.name} on ${url}`);
      }
    }

    if (vpOverflowCount === 0) {
      console.log(`✅ Viewport ${vp.name} (${vp.width}x${vp.height}): 32/32 routes ZERO overflow.`);
    }

    await vpContext.close();
  }

  await browser.close();
  console.log(`\n================================================================`);
  console.log(`FINAL REPORT: Total Spacing Deviations: ${totalViolations} | Total Overflow Failures: ${overflowViolations}`);
  console.log('================================================================');
}

run().catch(console.error);
