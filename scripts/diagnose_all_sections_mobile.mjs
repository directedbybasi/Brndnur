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

async function run() {
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

    const pageAudit = await page.evaluate((currentUrl) => {
      const sections = Array.from(document.querySelectorAll('main > section, main > div > section, section.hero, section.section, section.cta-band, section.cta-section, .faq-page-section'));
      
      const secData = sections.map((sec, i) => {
        const cs = window.getComputedStyle(sec);
        const r = sec.getBoundingClientRect();
        
        // Find headings inside this section
        const h = sec.querySelector('h1, h2, h3, .section-title');
        const hCs = h ? window.getComputedStyle(h) : null;
        const hR = h ? h.getBoundingClientRect() : null;

        // Find eyebrow
        const eye = sec.querySelector('.eyebrow');
        const eyeR = eye ? eye.getBoundingClientRect() : null;

        // Find decorative rule/divider
        const rule = sec.querySelector('.gold-rule, .rule, .accent-line');
        const ruleR = rule ? rule.getBoundingClientRect() : null;

        // Find lead/desc
        const lead = sec.querySelector('.lead, .hero-lead, .section-copy > p, .section-heading > p');
        const leadR = lead ? lead.getBoundingClientRect() : null;

        // Find grid or card list
        const grid = sec.querySelector('.service-grid, .package-grid, .steps, .step-grid, .finder-grid, .feature-grid, .faq-list, .check-list, .faq-editorial-list, .benefits, .values, .split-grid');
        const gridR = grid ? grid.getBoundingClientRect() : null;

        // Find image inside section
        const img = sec.querySelector('img, .section-image, .rounded-photo, .photo, picture');
        const imgR = img ? img.getBoundingClientRect() : null;
        const imgCs = img ? window.getComputedStyle(img) : null;

        // Distance from heading or lead to grid
        let contentToGrid = null;
        if (gridR) {
          const anchor = leadR || hR;
          if (anchor) {
            contentToGrid = Math.round(gridR.top - anchor.bottom);
          }
        }

        // Distance from eyebrow to heading
        let eyeToH = null;
        if (eyeR && hR) {
          eyeToH = Math.round(hR.top - eyeR.bottom);
        }

        // Distance from heading to rule
        let hToRule = null;
        if (hR && ruleR) {
          hToRule = Math.round(ruleR.top - hR.bottom);
        }

        // Distance from rule or heading to lead
        let hOrRuleToLead = null;
        if (leadR) {
          const prev = ruleR || hR;
          if (prev) {
            hOrRuleToLead = Math.round(leadR.top - prev.bottom);
          }
        }

        return {
          index: i,
          tag: sec.tagName.toLowerCase(),
          cls: sec.className,
          id: sec.id,
          pt: cs.paddingTop,
          pb: cs.paddingBottom,
          mt: cs.marginTop,
          mb: cs.marginBottom,
          height: Math.round(r.height),
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          eyeToH,
          hToRule,
          hOrRuleToLead,
          contentToGrid,
          hasImg: !!img,
          imgTop: imgR ? Math.round(imgR.top) : null,
          imgBottom: imgR ? Math.round(imgR.bottom) : null,
          imgHeight: imgR ? Math.round(imgR.height) : null,
          imgOrder: imgCs ? imgCs.order : null
        };
      });

      // Calculate gaps between consecutive sections
      const gapsBetweenSections = [];
      for (let i = 0; i < secData.length - 1; i++) {
        const curr = secData[i];
        const next = secData[i + 1];
        gapsBetweenSections.push({
          from: `${curr.cls || curr.tag} (#${curr.id})`,
          to: `${next.cls || next.tag} (#${next.id})`,
          gap: next.top - curr.bottom
        });
      }

      return {
        url: currentUrl,
        sectionCount: secData.length,
        secData,
        gapsBetweenSections
      };
    }, url);

    report[url] = pageAudit;
  }

  await browser.close();

  const fs = await import('fs');
  fs.writeFileSync('scratch/all_sections_mobile_audit.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('Saved scratch/all_sections_mobile_audit.json');
}

run().catch(console.error);
