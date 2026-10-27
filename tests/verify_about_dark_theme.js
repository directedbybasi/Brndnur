import { chromium } from 'playwright';

async function verifyDarkAdviseSection() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  console.log('========================================================================');
  console.log('BRNDNUR — ABOUT PAGE "WHO WE ADVISE & SUPPORT" DARK THEME VERIFICATION');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. DESKTOP 1440px
  console.log('--- TESTING DESKTOP (1440x900) ---');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4545/about/', { waitUntil: 'networkidle' });

  const section = page.locator('#who-we-advise');
  const sectionVisible = await section.isVisible();
  assert(sectionVisible, 'Section #who-we-advise is present on About page');

  // Verify Section Background and Heading Colors
  const sectionColors = await page.evaluate(() => {
    const sec = document.querySelector('#who-we-advise');
    const eyebrow = sec.querySelector('.eyebrow');
    const h2 = sec.querySelector('h2');
    const p = sec.querySelector('.section-heading p:not(.eyebrow)');
    const card = sec.querySelector('.advise-card');
    const iconCircle = card.querySelector('.advise-icon-circle');
    const cardH3 = card.querySelector('h3');
    const cardP = card.querySelector('p');
    const link = card.querySelector('.text-link');

    const rgbToHex = (rgb) => {
      if (!rgb || rgb.startsWith('rgba(0, 0, 0, 0)')) return 'transparent';
      const m = rgb.match(/\d+/g);
      if (!m || m.length < 3) return rgb;
      return '#' + [m[0], m[1], m[2]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
    };

    return {
      secBg: rgbToHex(window.getComputedStyle(sec).backgroundColor),
      secBgRaw: window.getComputedStyle(sec).backgroundColor,
      eyebrowColor: rgbToHex(window.getComputedStyle(eyebrow).color),
      h2Color: rgbToHex(window.getComputedStyle(h2).color),
      pColor: rgbToHex(window.getComputedStyle(p).color),
      cardBg: rgbToHex(window.getComputedStyle(card).backgroundColor),
      cardBorder: window.getComputedStyle(card).borderColor,
      cardBorderHex: rgbToHex(window.getComputedStyle(card).borderColor),
      iconCircleBg: window.getComputedStyle(iconCircle).backgroundColor,
      iconColor: rgbToHex(window.getComputedStyle(iconCircle).color),
      cardH3Color: rgbToHex(window.getComputedStyle(cardH3).color),
      cardPColor: rgbToHex(window.getComputedStyle(cardP).color),
      linkColor: rgbToHex(window.getComputedStyle(link).color)
    };
  });

  console.log('Computed Section Colors:', sectionColors);

  // Assertions against palette:
  // Section background: #13233A (rgb(19, 35, 58))
  assert(sectionColors.secBg === '#13233A', `Section background is #13233A (found ${sectionColors.secBg})`);
  // Main heading: #F4EFE4 (rgb(244, 239, 228))
  assert(sectionColors.h2Color === '#F4EFE4', `Main heading is #F4EFE4 ivory (found ${sectionColors.h2Color})`);
  // Eyebrow label: #D4A647 (rgb(212, 166, 71))
  assert(sectionColors.eyebrowColor === '#D4A647', `Eyebrow label is #D4A647 gold (found ${sectionColors.eyebrowColor})`);
  // Intro paragraph: #D9DFE8 (rgb(217, 223, 232))
  assert(sectionColors.pColor === '#D9DFE8', `Intro paragraph is #D9DFE8 soft ivory-grey (found ${sectionColors.pColor})`);

  // Card assertions:
  // Card backgrounds: #1C2D46 (rgb(28, 45, 70))
  assert(sectionColors.cardBg === '#1C2D46', `Card background is #1C2D46 lighter navy (found ${sectionColors.cardBg})`);
  // Card borders: #3A4B61 (rgb(58, 75, 97))
  assert(sectionColors.cardBorderHex === '#3A4B61', `Card border is #3A4B61 subtle blue-grey (found ${sectionColors.cardBorderHex})`);
  // Card headings: #F4EFE4
  assert(sectionColors.cardH3Color === '#F4EFE4', `Card heading is #F4EFE4 ivory (found ${sectionColors.cardH3Color})`);
  // Card descriptions: #D9DFE8
  assert(sectionColors.cardPColor === '#D9DFE8', `Card description is #D9DFE8 soft ivory-grey (found ${sectionColors.cardPColor})`);
  // Icon circle background: muted gold tint
  assert(sectionColors.iconCircleBg.includes('168, 120, 26') || sectionColors.iconCircleBg.includes('0.2'), `Icon circle has muted gold background: ${sectionColors.iconCircleBg}`);
  // Icon and package link: #D4A647
  assert(sectionColors.iconColor === '#D4A647', `Icon color is #D4A647 gold (found ${sectionColors.iconColor})`);
  assert(sectionColors.linkColor === '#D4A647', `Package link is #D4A647 gold (found ${sectionColors.linkColor})`);

  // Hover effect test on card
  const firstCard = section.locator('.advise-card').first();
  await firstCard.hover();
  await page.waitForTimeout(100);
  const hoverBorder = await firstCard.evaluate(el => window.getComputedStyle(el).borderColor);
  console.log('Hover border color:', hoverBorder);

  // Capture Screenshot of Dark Section on Desktop
  await section.screenshot({ path: 'tests/about_who_we_advise_dark_desktop.png' });
  console.log('Saved tests/about_who_we_advise_dark_desktop.png');

  // 2. TABLET 768px
  console.log('\n--- TESTING TABLET (768x1024) ---');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(100);
  await section.screenshot({ path: 'tests/about_who_we_advise_dark_tablet.png' });
  console.log('Saved tests/about_who_we_advise_dark_tablet.png');
  const tabletCardCount = await section.locator('.advise-card').count();
  assert(tabletCardCount === 4, `All 4 cards rendered on tablet (found ${tabletCardCount})`);

  // 3. MOBILE 390px
  console.log('\n--- TESTING MOBILE (390x844) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  await section.screenshot({ path: 'tests/about_who_we_advise_dark_mobile.png' });
  console.log('Saved tests/about_who_we_advise_dark_mobile.png');
  const mobileCardCount = await section.locator('.advise-card').count();
  assert(mobileCardCount === 4, `All 4 cards rendered on mobile (found ${mobileCardCount})`);

  // 4. STRICT SCOPING CHECK: Ensure other pages do NOT have .section-dark-advise and keep their light themes
  console.log('\n--- TESTING STRICT SCOPING (Other Pages) ---');
  await page.goto('http://localhost:4545/', { waitUntil: 'networkidle' });
  const homeDarkSec = await page.locator('.section-dark-advise').count();
  assert(homeDarkSec === 0, 'Homepage does NOT contain .section-dark-advise');

  await page.goto('http://localhost:4545/services/', { waitUntil: 'networkidle' });
  const servicesDarkSec = await page.locator('.section-dark-advise').count();
  assert(servicesDarkSec === 0, 'Services page does NOT contain .section-dark-advise');

  await page.goto('http://localhost:4545/packages/', { waitUntil: 'networkidle' });
  const packagesDarkSec = await page.locator('.section-dark-advise').count();
  assert(packagesDarkSec === 0, 'Packages page does NOT contain .section-dark-advise');

  console.log('\n========================================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================================\n');

  await browser.close();
}

verifyDarkAdviseSection().catch(console.error);
