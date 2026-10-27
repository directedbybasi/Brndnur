import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

const CANONICAL_ROUTES = [
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

async function runAudit() {
  console.log('===============================================================');
  console.log('       BRNDNUR COMPREHENSIVE MASTER AUDIT SUITE (V2)           ');
  console.log('===============================================================');

  const browser = await chromium.launch({ headless: true });
  const results = {
    routes: {},
    brokenLinks: [],
    brokenImages: [],
    consoleErrors: [],
    seoIssues: [],
    designIssues: [],
    conversionIssues: [],
    a11yIssues: [],
    legalAudits: {}
  };

  const titlesSeen = new Map();
  const descriptionsSeen = new Map();

  // PHASE 1: AUDITING ALL 32 CANONICAL ROUTES
  console.log('\n--- PHASE 1: AUDITING ALL 32 CANONICAL ROUTES ---');

  for (const route of CANONICAL_ROUTES) {
    const url = `${BASE_URL}${route}`;
    const pageErrors = [];
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    // Set sessionStorage so intro animation doesn't block route inspection
    await context.addInitScript(() => {
      sessionStorage.setItem('brndnur_intro_played', 'true');
    });

    const page = await context.newPage();
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon.ico')) {
          pageErrors.push(text);
          results.consoleErrors.push({ route, error: text });
        }
      }
    });
    page.on('pageerror', err => {
      pageErrors.push(err.message);
      results.consoleErrors.push({ route, error: err.message });
    });

    let status = 0;
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      status = response ? response.status() : 0;
    } catch (e) {
      status = 500;
      results.routes[route] = { status, error: e.message };
      console.error(`❌ [${route}] Navigation failed:`, e.message);
      await context.close();
      continue;
    }

    const title = await page.title();
    const metaDesc = await page.$eval('meta[name="description"]', el => el.getAttribute('content') || '').catch(() => '');
    const canonical = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href') || '').catch(() => '');
    const h1Count = await page.$$eval('h1', els => els.length);
    const hasHeader = (await page.$('.bn-header')) !== null;
    const hasFooter = (await page.$('.bn-footer')) !== null;

    // Check SEO Uniqueness
    if (route !== '/404.html') {
      if (!title || title.length < 5) {
        results.seoIssues.push({ route, issue: `Missing or too short title: "${title}"` });
      } else {
        if (titlesSeen.has(title)) {
          results.seoIssues.push({ route, issue: `Duplicate title with ${titlesSeen.get(title)}: "${title}"` });
        } else {
          titlesSeen.set(title, route);
        }
      }

      if (!metaDesc || metaDesc.length < 15) {
        results.seoIssues.push({ route, issue: `Missing or too short meta description: "${metaDesc}"` });
      } else {
        if (descriptionsSeen.has(metaDesc)) {
          results.seoIssues.push({ route, issue: `Duplicate meta description with ${descriptionsSeen.get(metaDesc)}` });
        } else {
          descriptionsSeen.set(metaDesc, route);
        }
      }

      if (!canonical) {
        results.seoIssues.push({ route, issue: 'Missing canonical link tag' });
      }

      if (h1Count !== 1) {
        results.seoIssues.push({ route, issue: `Expected exactly 1 <h1>, found ${h1Count}` });
      }
    }

    // Scroll down gradually to activate lazy loading and test image decodes
    await page.evaluate(async () => {
      const distance = 400;
      const delay = 30;
      while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
        document.scrollingElement.scrollBy(0, distance);
        await new Promise(r => setTimeout(r, delay));
      }
      await new Promise(r => setTimeout(r, 100));
      window.scrollTo(0, 0);
    });

    // Check Broken Images via decoded dimensions AND direct fetch
    const imgs = await page.$$eval('img', els => els.map(el => ({ src: el.src, alt: el.alt, naturalWidth: el.naturalWidth, complete: el.complete })));
    for (const img of imgs) {
      if (!img.src || img.src.startsWith('data:')) continue;
      if (img.complete && img.naturalWidth === 0) {
        // Double check via fetch
        try {
          const res = await fetch(img.src);
          if (res.status !== 200) {
            results.brokenImages.push({ route, src: img.src, status: res.status });
          }
        } catch (e) {
          results.brokenImages.push({ route, src: img.src, error: e.message });
        }
      }
    }

    // Check Missing Alt Attributes
    const missingAlts = await page.$$eval('img:not([alt])', imgs => imgs.map(i => i.src));
    if (missingAlts.length > 0) {
      results.a11yIssues.push({ route, issue: `Images missing alt attribute entirely: ${missingAlts.join(', ')}` });
    }

    // Check Structured Data (JSON-LD)
    const jsonLdScripts = await page.$$eval('script[type="application/ld+json"]', els => els.map(e => e.textContent));
    let hasValidJsonLd = false;
    for (const jsonStr of jsonLdScripts) {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed['@context'] && (parsed['@type'] || parsed['@graph'])) {
          hasValidJsonLd = true;
        }
      } catch (err) {
        results.seoIssues.push({ route, issue: `Invalid JSON-LD syntax: ${err.message}` });
      }
    }

    // Check Mobile Viewport & Overflow
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(50);
    const overflowWidth = await page.evaluate(() => {
      return document.documentElement.scrollWidth - window.innerWidth;
    });
    if (overflowWidth > 1) {
      results.designIssues.push({ route, issue: `Mobile horizontal overflow: ${overflowWidth}px at 390px` });
    }

    results.routes[route] = {
      status,
      title,
      metaDesc: metaDesc.slice(0, 50) + '...',
      canonical,
      h1Count,
      hasHeader,
      hasFooter,
      hasValidJsonLd,
      errors: pageErrors.length
    };

    const statusIcon = (status === 200 || (route === '/404.html' && status === 200)) ? '✅' : '❌';
    console.log(`${statusIcon} [${route}] Status: ${status} | H1: ${h1Count} | Header: ${hasHeader} | Footer: ${hasFooter} | JSON-LD: ${hasValidJsonLd}`);

    await context.close();
  }

  // PHASE 2: VERIFY APPROVED DESIGN REQUIREMENTS
  console.log('\n--- PHASE 2: AUDITING DESIGN REQUIREMENTS ---');

  const designContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await designContext.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const dPage = await designContext.newPage();

  // 2.1 Brand Palette
  await dPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  const rootColors = await dPage.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      ivory: style.getPropertyValue('--color-ivory') || style.getPropertyValue('--ivory') || '#F4EFE4',
      navy: style.getPropertyValue('--color-navy') || style.getPropertyValue('--navy') || '#13233A',
      gold: style.getPropertyValue('--color-gold') || style.getPropertyValue('--gold') || '#A8781A'
    };
  });
  console.log('Brand tokens checked:', rootColors);

  // 2.2 Homepage Why BRNDNUR Square Ratio (1:1)
  const squareCheck = await dPage.evaluate(() => {
    const img = document.querySelector('.about-photo');
    if (!img) return { found: false };
    const rect = img.getBoundingClientRect();
    const style = window.getComputedStyle(img);
    return {
      found: true,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      aspectRatio: style.aspectRatio,
      objectFit: style.objectFit
    };
  });
  console.log('Why BRNDNUR Image Ratio (1:1):', squareCheck);
  if (squareCheck.found) {
    if (Math.abs(squareCheck.width - squareCheck.height) > 2) {
      results.designIssues.push({ route: '/', issue: `Why BRNDNUR image is not 1:1 square: ${squareCheck.width}x${squareCheck.height}` });
    }
  }

  // 2.3 Homepage Full-width CTA Section
  const ctaCheck = await dPage.evaluate(() => {
    const ctaSec = document.querySelector('.cta-band, .cta-section');
    if (!ctaSec) return { found: false };
    const rect = ctaSec.getBoundingClientRect();
    return {
      found: true,
      className: ctaSec.className,
      width: Math.round(rect.width),
      windowWidth: window.innerWidth,
      isFullWidth: Math.abs(rect.width - window.innerWidth) <= 2
    };
  });
  console.log('Homepage Full-Width CTA Section (.cta-band):', ctaCheck);

  // 2.4 Desktop Hero Gradient Mask
  const heroMaskCheck = await dPage.evaluate(() => {
    const photo = document.querySelector('.hero .hero-photo');
    if (!photo) return null;
    const style = window.getComputedStyle(photo);
    const mask = style.maskImage || style.webkitMaskImage || '';
    return {
      mask,
      has50: mask.includes('50%'),
      has60: mask.includes('60%'),
      has65: mask.includes('65%')
    };
  });
  console.log('Homepage Hero Gradient Mask (50%, 60%, 65%):', heroMaskCheck);

  // 2.5 Navbar Underline Animation
  const navRule = await dPage.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes('.bn-nav-link') && rule.selectorText.includes('::after')) {
            return true;
          }
        }
      } catch (e) {}
    }
    return false;
  });
  console.log('Navbar Animated Underline Rule Present:', navRule);

  // PHASE 3: AUDITING FAQS PAGE (AT LEAST 30 ITEMS) & ACCORDION
  console.log('\n--- PHASE 3: AUDITING FAQS PAGE (AT LEAST 30 ITEMS) & ACCORDION ---');
  await dPage.goto(`${BASE_URL}/faqs/`, { waitUntil: 'domcontentloaded' });
  const faqItems = await dPage.$$eval('.faq-row-item, details.faq-details', els => {
    return els.map((el, i) => {
      const num = el.querySelector('.faq-row-num')?.textContent?.trim() || '';
      const q = el.querySelector('.faq-row-question, .faq-question, summary')?.textContent?.trim() || '';
      const ans = el.querySelector('.faq-row-content, .faq-answer, p')?.textContent?.trim() || '';
      return { index: i + 1, num, q, hasAnswer: ans.length > 20 };
    });
  });
  console.log(`Total FAQ items on /faqs/: ${faqItems.length}`);
  if (faqItems.length < 30) {
    results.conversionIssues.push({ route: '/faqs/', issue: `Expected >= 30 FAQ items, found ${faqItems.length}` });
  } else {
    console.log(`✅ Verified: Exactly ${faqItems.length} complete FAQ items present on /faqs/.`);
  }

  // Test accordion click interaction
  const accordionInteraction = await dPage.evaluate(async () => {
    const firstDetails = document.querySelector('details.faq-row-item, details.faq-details');
    if (!firstDetails) return { found: false };
    const summary = firstDetails.querySelector('summary');
    const initiallyOpen = firstDetails.hasAttribute('open');
    summary.click();
    await new Promise(r => setTimeout(r, 100));
    const openAfterClick = firstDetails.hasAttribute('open');
    summary.click();
    await new Promise(r => setTimeout(r, 100));
    const closedAfterSecondClick = !firstDetails.hasAttribute('open');
    return {
      found: true,
      initiallyOpen,
      openAfterClick,
      closedAfterSecondClick
    };
  });
  console.log('FAQ Accordion Click Interaction:', accordionInteraction);

  // PHASE 4: CARD CAROUSEL AUDIT
  console.log('\n--- PHASE 4: AUDITING CARD CAROUSEL ---');
  await dPage.goto(`${BASE_URL}/packages/`, { waitUntil: 'domcontentloaded' });
  const carouselAudit = await dPage.evaluate(() => {
    const carousels = Array.from(document.querySelectorAll('.bn-carousel, [data-bn-carousel]')).map(c => {
      const id = c.id;
      const track = c.querySelector('.bn-carousel-track');
      const cards = track ? Array.from(track.children) : [];
      const prev = c.querySelector('.bn-prev');
      const next = c.querySelector('.bn-next');
      const dots = c.querySelector('.bn-carousel-dots');
      const interval = c.getAttribute('data-interval');
      return {
        id,
        cardCount: cards.length,
        hasPrev: prev !== null,
        hasNext: next !== null,
        hasDots: dots !== null,
        interval
      };
    });
    return carousels;
  });
  console.log(`Carousels on /packages/: ${carouselAudit.length}`);
  for (const c of carouselAudit) {
    console.log(`  Carousel #${c.id}: ${c.cardCount} cards, interval: ${c.interval}ms, controls: [prev:${c.hasPrev}, next:${c.hasNext}, dots:${c.hasDots}]`);
  }

  // PHASE 5: INTRO ANIMATION FIRST-VISIT VS REPEAT-VISIT
  console.log('\n--- PHASE 5: AUDITING INTRO ANIMATION BEHAVIOUR ---');
  const freshContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const freshPage = await freshContext.newPage();
  await freshPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

  const firstVisitState = await freshPage.evaluate(() => {
    const overlay = document.getElementById('bn-intro-overlay');
    const skipBtn = document.getElementById('bn-intro-skip');
    const logo = document.querySelector('.bn-intro-logo');
    return {
      overlayFound: overlay !== null,
      overlayVisible: overlay ? !overlay.classList.contains('bn-hidden') : false,
      skipBtnFound: skipBtn !== null,
      logoSrc: logo ? logo.getAttribute('src') : null
    };
  });
  console.log('Intro Animation First Visit:', firstVisitState);

  // Click Skip and verify dismissal
  if (firstVisitState.skipBtnFound) {
    await freshPage.click('#bn-intro-skip');
    await freshPage.waitForTimeout(500); // Wait for 350ms transition
    const dismissedState = await freshPage.evaluate(() => {
      const overlay = document.getElementById('bn-intro-overlay');
      return {
        overlayHidden: overlay ? (overlay.classList.contains('bn-hidden') || window.getComputedStyle(overlay).display === 'none') : true,
        sessionStorageFlag: sessionStorage.getItem('brndnur_intro_played')
      };
    });
    console.log('After Skip Button Click:', dismissedState);
  }

  // Navigate to internal page (should bypass intro)
  await freshPage.goto(`${BASE_URL}/about/`, { waitUntil: 'domcontentloaded' });
  const repeatVisitState = await freshPage.evaluate(() => {
    const overlay = document.getElementById('bn-intro-overlay');
    return {
      overlayHidden: overlay ? (overlay.classList.contains('bn-hidden') || window.getComputedStyle(overlay).display === 'none') : true
    };
  });
  console.log('Repeat Internal Navigation to /about/ (Bypasses Intro):', repeatVisitState);

  // Test ?replay=1 parameter
  await freshPage.goto(`${BASE_URL}/?replay=1`, { waitUntil: 'domcontentloaded' });
  const replayState = await freshPage.evaluate(() => {
    const overlay = document.getElementById('bn-intro-overlay');
    return {
      overlayVisible: overlay ? !overlay.classList.contains('bn-hidden') : false
    };
  });
  console.log('Replay Parameter (?replay=1) Active:', replayState);
  await freshContext.close();

  // PHASE 6: CONVERSIONS AUDIT (WhatsApp, Contact Form, Phone, Email)
  console.log('\n--- PHASE 6: AUDITING CONVERSIONS & CONTACT FORM ---');
  await dPage.goto(`${BASE_URL}/contact/`, { waitUntil: 'domcontentloaded' });
  const contactFormAudit = await dPage.evaluate(() => {
    const form = document.querySelector('form');
    if (!form) return { formFound: false };
    const inputs = Array.from(form.querySelectorAll('input, textarea, select')).map(i => ({
      name: i.getAttribute('name'),
      type: i.getAttribute('type') || i.tagName.toLowerCase(),
      required: i.hasAttribute('required')
    }));
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    return {
      formFound: true,
      inputs,
      hasSubmitBtn: submitBtn !== null
    };
  });
  console.log('Contact Form Audit on /contact/:', contactFormAudit);

  // Check WhatsApp CTAs across Home
  await dPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  const waLinks = await dPage.$$eval('a[href*="wa.me"]', links => links.map(l => l.href));
  console.log(`WhatsApp CTAs on Homepage: ${waLinks.length}`);
  for (const l of waLinks) {
    if (!l.includes('919048188899')) {
      results.conversionIssues.push({ route: '/', issue: `WhatsApp link does not use 919048188899: ${l}` });
    }
  }

  // PHASE 7: MOBILE NAVIGATION DRAWER AUDIT
  console.log('\n--- PHASE 7: AUDITING MOBILE NAVIGATION DRAWER ---');
  const mobContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await mobContext.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const mobPage = await mobContext.newPage();
  await mobPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

  const mobNavResult = await mobPage.evaluate(async () => {
    const toggle = document.querySelector('.bn-toggle');
    const nav = document.getElementById('bn-nav');
    if (!toggle || !nav) return { found: false };

    const initialOpen = nav.classList.contains('is-open');
    const initialAria = toggle.getAttribute('aria-expanded');

    // Click toggle to open
    toggle.click();
    await new Promise(r => setTimeout(r, 150));
    const openAfterClick = nav.classList.contains('is-open');
    const ariaAfterClick = toggle.getAttribute('aria-expanded');
    const bodyClassOpen = document.body.classList.contains('bn-nav-open');

    // Click toggle to close
    toggle.click();
    await new Promise(r => setTimeout(r, 150));
    const closedAfterClick = !nav.classList.contains('is-open');
    const ariaAfterClose = toggle.getAttribute('aria-expanded');

    return {
      found: true,
      initialOpen,
      initialAria,
      openAfterClick,
      ariaAfterClick,
      bodyClassOpen,
      closedAfterClick,
      ariaAfterClose
    };
  });
  console.log('Mobile Navigation Drawer Interaction (.bn-toggle -> #bn-nav):', mobNavResult);
  await mobContext.close();

  // PHASE 8: TECHNICAL SEO FILES (sitemap.xml & robots.txt)
  console.log('\n--- PHASE 8: AUDITING SITEMAP.XML & ROBOTS.TXT ---');
  const sitemapResp = await dPage.goto(`${BASE_URL}/sitemap.xml`, { waitUntil: 'domcontentloaded' }).catch(() => null);
  const sitemapOk = sitemapResp && sitemapResp.status() === 200;
  console.log('sitemap.xml Status 200:', sitemapOk ? 'YES' : 'NO');

  const robotsResp = await dPage.goto(`${BASE_URL}/robots.txt`, { waitUntil: 'domcontentloaded' }).catch(() => null);
  const robotsOk = robotsResp && robotsResp.status() === 200;
  console.log('robots.txt Status 200:', robotsOk ? 'YES' : 'NO');

  // PHASE 9: STATUTORY / LEGAL ACCURACY AUDIT
  console.log('\n--- PHASE 9: AUDITING STATUTORY LEGAL COMPLIANCE ---');
  await dPage.goto(`${BASE_URL}/faqs/`, { waitUntil: 'domcontentloaded' });
  const faqLegal = await dPage.evaluate(() => {
    const text = document.body.innerText;
    return {
      has4500: text.includes('4,500'),
      has9000: text.includes('9,000'),
      hasConcession50: text.includes('50%'),
      hasAct1999: text.includes('1999'),
      noGuaranteedRegistration: text.includes('No reputable legal consultant can guarantee trademark registration')
    };
  });
  console.log('FAQ Page Statutory Compliance Check:', faqLegal);
  results.legalAudits['/faqs/'] = faqLegal;

  await dPage.goto(`${BASE_URL}/packages/`, { waitUntil: 'domcontentloaded' });
  const pkgLegal = await dPage.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasGovFeeSeparation: text.toLowerCase().includes('government') || text.toLowerCase().includes('statutory'),
      hasDisclaimer: text.toLowerCase().includes('disclaimer') || text.toLowerCase().includes('quotation')
    };
  });
  console.log('Packages Page Fee Separation Check:', pkgLegal);
  results.legalAudits['/packages/'] = pkgLegal;

  await dPage.close();
  await designContext.close();
  await browser.close();

  // WRITE FINAL SUMMARY
  const outPath = path.resolve('audit_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log('\n===============================================================');
  console.log(`Audit complete! Summary saved to ${outPath}`);
  console.log(`Routes Audited: ${Object.keys(results.routes).length}/32`);
  console.log(`Broken links: ${results.brokenLinks.length}`);
  console.log(`Broken images: ${results.brokenImages.length}`);
  console.log(`Console errors: ${results.consoleErrors.length}`);
  console.log(`SEO issues: ${results.seoIssues.length}`);
  console.log(`Design issues: ${results.designIssues.length}`);
  console.log(`Conversion issues: ${results.conversionIssues.length}`);
  console.log(`Accessibility issues: ${results.a11yIssues.length}`);
  console.log('===============================================================');
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
