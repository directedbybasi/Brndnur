import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4321';

async function testSmartHeader() {
  console.log('==============================================================');
  console.log('      BRNDNUR SMART ANIMATED HEADER VERIFICATION SUITE       ');
  console.log('==============================================================');

  const browser = await chromium.launch();
  let failures = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failures++;
    }
  }

  // --- TEST 1: Initial Page Load (Desktop 1440px) ---
  console.log('\n[TEST 1] Initial Page Load (Desktop 1440px)');
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

  const initialHeader = await page.evaluate(() => {
    const h = document.getElementById('site-header');
    if (!h) return null;
    const style = window.getComputedStyle(h);
    const rect = h.getBoundingClientRect();
    return {
      exists: true,
      position: style.position,
      top: style.top,
      zIndex: style.zIndex,
      rectTop: rect.top,
      rectHeight: rect.height,
      isHidden: h.classList.contains('bn-header--hidden'),
      transform: style.transform
    };
  });
  assert(initialHeader.exists, 'Header element #site-header found');
  assert(initialHeader.position === 'sticky', 'Header uses position: sticky');
  assert(initialHeader.rectTop === 0, 'Header is at the very top (rectTop === 0)');
  assert(!initialHeader.isHidden, 'Header does not have .bn-header--hidden on initial load');
  assert(initialHeader.transform === 'matrix(1, 0, 0, 1, 0, 0)' || initialHeader.transform === 'none', 'Header transform is normal (translateY 0)');

  // --- TEST 2: Downward Scroll (Past 100px) ---
  console.log('\n[TEST 2] Downward Scroll past 100px (Desktop)');
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(350); // wait for rAF and CSS transition

  const scrolledDown = await page.evaluate(() => {
    const h = document.getElementById('site-header');
    return {
      scrollY: window.scrollY,
      isHidden: h.classList.contains('bn-header--hidden'),
      transform: window.getComputedStyle(h).transform
    };
  });
  assert(scrolledDown.scrollY === 300, `Scrolled to ${scrolledDown.scrollY}px`);
  assert(scrolledDown.isHidden, 'Header gained .bn-header--hidden on scrolling down');

  // --- TEST 3: Small Upward Scroll (Bring Header back immediately) ---
  console.log('\n[TEST 3] Small Upward Scroll (Scroll from 300px to 280px)');
  await page.evaluate(() => window.scrollTo(0, 280));
  await page.waitForTimeout(350);

  const scrolledUp = await page.evaluate(() => {
    const h = document.getElementById('site-header');
    return {
      scrollY: window.scrollY,
      isHidden: h.classList.contains('bn-header--hidden'),
      isScrolled: h.classList.contains('bn-header--scrolled')
    };
  });
  assert(!scrolledUp.isHidden, 'Header removed .bn-header--hidden on small upward scroll (20px delta)');
  assert(scrolledUp.isScrolled, 'Header has .bn-header--scrolled elevation class');

  // --- TEST 4: Repeated Up-and-Down Scrolling (No Flicker) ---
  console.log('\n[TEST 4] Repeated Up-and-Down Scrolling (Stability)');
  let stable = true;
  for (let i = 0; i < 4; i++) {
    await page.evaluate(y => window.scrollTo(0, y), 400 + i * 50);
    await page.waitForTimeout(100);
    const downState = await page.evaluate(() => document.getElementById('site-header').classList.contains('bn-header--hidden'));
    if (!downState) stable = false;

    await page.evaluate(y => window.scrollTo(0, y), 380 + i * 50);
    await page.waitForTimeout(100);
    const upState = await page.evaluate(() => document.getElementById('site-header').classList.contains('bn-header--hidden'));
    if (upState) stable = false;
  }
  assert(stable, 'Header cleanly and reliably toggled without jitter during repeated direction changes');

  // --- TEST 5: Return to Top of Page ---
  console.log('\n[TEST 5] Return to Top of Page (scrollY = 0)');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(350);

  const backAtTop = await page.evaluate(() => {
    const h = document.getElementById('site-header');
    return {
      scrollY: window.scrollY,
      isHidden: h.classList.contains('bn-header--hidden'),
      isScrolled: h.classList.contains('bn-header--scrolled')
    };
  });
  assert(backAtTop.scrollY === 0, 'Scroll position is 0');
  assert(!backAtTop.isHidden, 'Header is visible at top');
  assert(!backAtTop.isScrolled, 'Elevation class removed at top');

  // --- TEST 6: Mobile Screen Size (390px) ---
  console.log('\n[TEST 6] Mobile Viewport (390px)');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 250));
  await page.waitForTimeout(350);

  const mobDown = await page.evaluate(() => document.getElementById('site-header').classList.contains('bn-header--hidden'));
  assert(mobDown, 'Mobile header hides on scroll down');

  await page.evaluate(() => window.scrollTo(0, 230));
  await page.waitForTimeout(350);
  const mobUp = await page.evaluate(() => document.getElementById('site-header').classList.contains('bn-header--hidden'));
  assert(!mobUp, 'Mobile header reveals on small scroll up');

  // --- TEST 7: Mobile Drawer Open Protection ---
  console.log('\n[TEST 7] Mobile Menu Open Protection (Never Hide When Menu Is Open)');
  // Open mobile drawer
  await page.click('.bn-toggle');
  await page.waitForTimeout(200);

  const drawerState = await page.evaluate(() => {
    const nav = document.getElementById('bn-nav');
    const toggle = document.querySelector('.bn-toggle');
    return {
      isOpen: nav.classList.contains('is-open'),
      aria: toggle.getAttribute('aria-expanded'),
      bodyClass: document.body.classList.contains('bn-nav-open')
    };
  });
  assert(drawerState.isOpen, 'Mobile drawer opened');

  // Scroll down while drawer is open
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(300);

  const drawerScrollState = await page.evaluate(() => {
    const h = document.getElementById('site-header');
    return {
      isHidden: h.classList.contains('bn-header--hidden'),
      transform: window.getComputedStyle(h).transform
    };
  });
  assert(!drawerScrollState.isHidden, 'Header DOES NOT hide when mobile drawer is open');

  // Close drawer
  await page.click('.bn-toggle');
  await page.waitForTimeout(200);

  // --- TEST 8: Keyboard Focus Protection (:focus-within) ---
  console.log('\n[TEST 8] Keyboard Focus Protection');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(350);

  // Header should be hidden initially
  const focusCheck1 = await page.evaluate(() => document.getElementById('site-header').classList.contains('bn-header--hidden'));
  assert(focusCheck1, 'Header hidden at 300px before focus');

  // Tab or focus an element inside the header
  await page.focus('#site-header a');
  await page.waitForTimeout(100);

  const focusCheck2 = await page.evaluate(() => {
    const h = document.getElementById('site-header');
    return {
      isHidden: h.classList.contains('bn-header--hidden'),
      isFocusWithin: h.matches(':focus-within')
    };
  });
  assert(!focusCheck2.isHidden, 'Header immediately reveals when a child element receives keyboard focus');

  // --- TEST 9: Multi-page Verification (Services, Packages, FAQs) ---
  console.log('\n[TEST 9] Multi-page Verification');
  const testRoutes = ['/services/', '/packages/', '/faqs/'];
  for (const r of testRoutes) {
    await page.goto(`${BASE_URL}${r}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(350);
    const rDown = await page.evaluate(() => document.getElementById('site-header').classList.contains('bn-header--hidden'));
    
    await page.evaluate(() => window.scrollTo(0, 270));
    await page.waitForTimeout(350);
    const rUp = await page.evaluate(() => document.getElementById('site-header').classList.contains('bn-header--hidden'));

    assert(rDown && !rUp, `Smart header works correctly on ${r} (hides on down, reveals on up)`);
  }

  // --- TEST 10: Reduced Motion Preference ---
  console.log('\n[TEST 10] Prefers-Reduced-Motion Check');
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  await rmContext.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const rmPage = await rmContext.newPage();
  await rmPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

  const rmTransition = await rmPage.evaluate(() => {
    const h = document.getElementById('site-header');
    const style = window.getComputedStyle(h);
    return style.transition;
  });
  assert(rmTransition.includes('none') || rmTransition === '', `Transition disabled on reduced-motion: "${rmTransition}"`);

  await rmContext.close();
  await context.close();
  await browser.close();

  console.log('\n==============================================================');
  if (failures === 0) {
    console.log('  🎉 ALL 10 SMART ANIMATED HEADER TESTS PASSED WITH 0 FAILURES! ');
  } else {
    console.error(`  ⚠️ ${failures} TEST CHECKS FAILED!`);
    process.exit(1);
  }
  console.log('==============================================================');
}

testSmartHeader().catch(err => {
  console.error(err);
  process.exit(1);
});
