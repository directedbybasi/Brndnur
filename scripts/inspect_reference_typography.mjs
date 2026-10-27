import { chromium } from 'playwright';

async function inspectReference() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const ov = document.getElementById('bn-intro-overlay');
    if (ov) ov.remove();
    document.body.classList.remove('bn-intro-active');
  });

  const styles = await page.evaluate(() => {
    const getElStyles = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        selector: sel,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontStyle: cs.fontStyle,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        color: cs.color
      };
    };

    return {
      eyebrow: getElStyles('#audiences .section-heading .eyebrow'),
      heading: getElStyles('#audiences-heading'),
      description: getElStyles('#audiences .section-heading p:not(.eyebrow)'),
      tag: getElStyles('.audience-tag'),
      cardH3: getElStyles('.audience-body h3'),
      cardP: getElStyles('.audience-body p'),
      cardLink: getElStyles('.audience-body .text-link'),
      // Also check other headings on homepage
      heroH1: getElStyles('.hero-title'),
      servicesH2: getElStyles('#services-heading'),
      serviceCardH3: getElStyles('.service-card h3'),
      processH2: getElStyles('#process-heading'),
      navLink: getElStyles('.bn-nav-link'),
      btn: getElStyles('.hero-actions .btn-primary')
    };
  });

  console.log(JSON.stringify(styles, null, 2));
  await browser.close();
}

inspectReference().catch(console.error);
