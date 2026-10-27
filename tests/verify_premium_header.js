import { chromium } from 'playwright';

async function testHeader() {
  const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:4321';
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    try { sessionStorage.setItem('brndnur_intro_played', 'true'); } catch(e) {}
  });
  const page = await context.newPage();

  console.log('========================================================================');
  console.log('BRNDNUR — PREMIUM HEADER VERIFICATION SUITE');
  console.log(`Target: ${BASE_URL}`);
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
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

  // Check header height
  const headerBox = await page.locator('.bn-header-inner').boundingBox();
  assert(headerBox.height >= 78 && headerBox.height <= 86, `Header height is within 78-86px: ${headerBox.height.toFixed(1)}px`);

  // Check logo width
  const logoBox = await page.locator('.header-logo img').boundingBox();
  assert(logoBox.width >= 165 && logoBox.width <= 185, `Logo width is within 165-185px: ${logoBox.width.toFixed(1)}px`);

  // Check visible top-level desktop items
  const primaryDestinations = await page.evaluate(() => {
    const nav = document.getElementById('bn-nav');
    if (!nav) return [];
    const directChildren = Array.from(nav.children);
    return directChildren.filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && !el.classList.contains('bn-mobile-cta-wrap');
    }).map(el => el.textContent.trim().split('\n')[0].trim());
  });

  console.log('  Visible Primary Items:', primaryDestinations);
  assert(primaryDestinations.length === 5, `Exactly 5 primary destinations (found ${primaryDestinations.length}): ${primaryDestinations.join(', ')}`);

  // Check desktop CTA
  const desktopCta = await page.locator('.bn-header-inner > .bn-cta');
  const ctaVisible = await desktopCta.isVisible();
  assert(ctaVisible, 'Standalone desktop Get in Touch CTA is visible');

  // Capture clean desktop header screenshot
  await page.locator('.bn-header').screenshot({ path: 'tests/header_desktop_1440_default.png' });

  // Test Services Dropdown (Click & Hover)
  console.log('\n--- TESTING SERVICES DROPDOWN ---');
  const servicesDropdown = page.locator('.bn-dropdown[data-dropdown="services"]');
  const servicesTrigger = servicesDropdown.locator('.bn-dropdown-trigger');
  
  // Click to open
  await servicesTrigger.click();
  let servicesOpen = await servicesDropdown.evaluate(el => el.classList.contains('is-open'));
  let servicesAriaExpanded = await servicesTrigger.getAttribute('aria-expanded');
  assert(servicesOpen && servicesAriaExpanded === 'true', 'Services dropdown opens on click and sets aria-expanded="true"');

  // Capture screenshot with Services dropdown open
  await page.screenshot({ path: 'tests/header_desktop_1440_services_open.png', clip: { x: 0, y: 0, width: 1440, height: 480 } });

  // Check link count inside Services
  const servicesLinkCount = await servicesDropdown.locator('.bn-dropdown-list a, .bn-view-all-link').count();
  assert(servicesLinkCount === 12, `Services dropdown contains all 12 links (11 services + view all): found ${servicesLinkCount}`);

  // Test Escape key closes dropdown
  await page.keyboard.press('Escape');
  servicesOpen = await servicesDropdown.evaluate(el => el.classList.contains('is-open'));
  assert(!servicesOpen, 'Escape key closes Services dropdown');

  // Test Resources Dropdown
  console.log('\n--- TESTING RESOURCES DROPDOWN ---');
  const resourcesDropdown = page.locator('.bn-dropdown[data-dropdown="resources"]');
  const resourcesTrigger = resourcesDropdown.locator('.bn-dropdown-trigger');
  await resourcesTrigger.click();
  const resourcesOpen = await resourcesDropdown.evaluate(el => el.classList.contains('is-open'));
  assert(resourcesOpen, 'Resources dropdown opens on click');
  const resourcesLinkCount = await resourcesDropdown.locator('.bn-dropdown-list a').count();
  assert(resourcesLinkCount === 6, `Resources dropdown contains 6 guide/faq links: found ${resourcesLinkCount}`);
  await page.screenshot({ path: 'tests/header_desktop_1440_resources_open.png', clip: { x: 0, y: 0, width: 1440, height: 380 } });

  // Click outside closes dropdown
  await page.click('body', { position: { x: 100, y: 300 } });
  const resourcesClosed = await resourcesDropdown.evaluate(el => !el.classList.contains('is-open'));
  assert(resourcesClosed, 'Clicking outside closes Resources dropdown');

  // Test About Dropdown
  console.log('\n--- TESTING ABOUT DROPDOWN ---');
  const aboutDropdown = page.locator('.bn-dropdown[data-dropdown="about"]');
  const aboutTrigger = aboutDropdown.locator('.bn-dropdown-trigger');
  await aboutTrigger.click();
  const aboutOpen = await aboutDropdown.evaluate(el => el.classList.contains('is-open'));
  assert(aboutOpen, 'About dropdown opens on click');
  const aboutLinkCount = await aboutDropdown.locator('.bn-dropdown-list a').count();
  assert(aboutLinkCount === 3, `About dropdown contains 3 links (About, How It Works, Contact): found ${aboutLinkCount}`);
  await page.screenshot({ path: 'tests/header_desktop_1440_about_open.png', clip: { x: 0, y: 0, width: 1440, height: 320 } });
  // 2. STANDARD DESKTOP 1280px
  console.log('\n--- TESTING STANDARD DESKTOP (1280x800) ---');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(100);
  const header1280Box = await page.locator('.bn-header-inner').boundingBox();
  assert(header1280Box.height >= 78 && header1280Box.height <= 86, `Header height at 1280px is 82px: ${header1280Box.height.toFixed(1)}px`);
  const logo1280Box = await page.locator('.header-logo img').boundingBox();
  assert(logo1280Box.width >= 165 && logo1280Box.width <= 185, `Logo width at 1280px is proportionate: ${logo1280Box.width.toFixed(1)}px`);
  const noOverflow1280 = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  assert(noOverflow1280, 'No horizontal overflow at 1280px');

  // 3. SMALL DESKTOP / TABLET LANDSCAPE 1024px
  console.log('\n--- TESTING SMALL DESKTOP / TABLET LANDSCAPE (1024x768) ---');
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(100);
  const header1024Box = await page.locator('.bn-header-inner').boundingBox();
  assert(header1024Box.height >= 78 && header1024Box.height <= 86, `Header height at 1024px is 82px: ${header1024Box.height.toFixed(1)}px`);
  const logo1024Box = await page.locator('.header-logo img').boundingBox();
  assert(logo1024Box.width >= 150 && logo1024Box.width <= 180, `Logo width at 1024px is proportionate: ${logo1024Box.width.toFixed(1)}px`);
  const headerNoOverflow = await page.evaluate(() => document.querySelector('.bn-header').scrollWidth <= window.innerWidth);
  assert(headerNoOverflow, 'Header has no horizontal overflow at 1024px');
  const pageNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  assert(pageNoOverflow, 'Entire page has no horizontal overflow at 1024px');

  // 4. TABLET 768px
  console.log('\n--- TESTING TABLET (768x1024) ---');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

  const toggleVisibleTablet = await page.locator('.bn-toggle').isVisible();
  assert(toggleVisibleTablet, 'Mobile toggle button is visible at 768px');

  const desktopCtaHiddenTablet = await page.locator('.bn-header-inner > .bn-cta').isHidden();
  assert(desktopCtaHiddenTablet, 'Desktop standalone CTA is hidden at 768px');

  // Open mobile drawer
  await page.locator('.bn-toggle').click();
  const navIsOpenTablet = await page.locator('.bn-nav').evaluate(el => el.classList.contains('is-open'));
  assert(navIsOpenTablet, 'Mobile drawer opens on hamburger click');

  // Expand Services accordion
  await page.locator('.bn-dropdown[data-dropdown="services"] .bn-dropdown-trigger').click();
  const servicesAccordionOpen = await page.locator('.bn-dropdown[data-dropdown="services"]').evaluate(el => el.classList.contains('is-open'));
  assert(servicesAccordionOpen, 'Services accordion expands inside mobile drawer');

  await page.screenshot({ path: 'tests/header_tablet_768_drawer_open.png', clip: { x: 0, y: 0, width: 768, height: 750 } });

  // 3. MOBILE 390px
  console.log('\n--- TESTING MOBILE (390x844) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

  const mobileLogoBox = await page.locator('.header-logo img').boundingBox();
  assert(mobileLogoBox.width >= 135 && mobileLogoBox.width <= 180, `Mobile logo width is proportionate: ${mobileLogoBox.width.toFixed(1)}px`);

  // Default mobile header screenshot
  await page.locator('.bn-header').screenshot({ path: 'tests/header_mobile_390_default.png' });

  // Open mobile drawer on 390px
  await page.locator('.bn-toggle').click();
  const mobileCtaVisible = await page.locator('.bn-nav .bn-nav-cta').isVisible();
  assert(mobileCtaVisible, 'Get in Touch CTA is visible and accessible inside mobile drawer');

  await page.screenshot({ path: 'tests/header_mobile_390_drawer_open.png', clip: { x: 0, y: 0, width: 390, height: 600 } });

  console.log('\n========================================================================');
  console.log(`HEADER RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================================\n');

  await browser.close();
}

testHeader().catch(console.error);
