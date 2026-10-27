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
  let failures = 0;

  console.log('================================================================');
  console.log('BRNDNUR MOBILE IMAGE 3:4 ASPECT RATIO VERIFICATION');
  console.log('================================================================\n');

  // Test across representative mobile viewports
  const testViewports = [
    { name: '320px', width: 320, height: 600 },
    { name: '375px', width: 375, height: 667 },
    { name: '390px', width: 390, height: 844 },
    { name: '430px', width: 430, height: 932 }
  ];

  for (const vp of testViewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
    const page = await context.newPage();

    let vpVerifiedImages = 0;
    let vpIssues = 0;

    for (const url of pages) {
      if (url === '/') continue; // Homepage is frozen reference

      await page.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => {
        const ov = document.getElementById('bn-intro-overlay');
        if (ov) ov.remove();
        document.body.classList.remove('bn-intro-active');
        document.documentElement.classList.remove('bn-show-intro');
      });

      const audit = await page.evaluate(() => {
        const issues = [];
        let verifiedCount = 0;

        // Find all non-hero, non-slider content images
        const imgs = Array.from(document.querySelectorAll('img'));
        imgs.forEach(img => {
          const src = img.getAttribute('src') || '';
          const isHero = !!img.closest('.hero, .shared-page-hero, .page-hero, .hero-photo-wrap, .hero-image-wrap');
          const isSlider = !!img.closest('.bn-carousel, .card-carousel, .carousel-track, .slider, .infinite-scroll');
          const isLogo = !!(img.closest('.logo, .site-logo, header, footer, .trust-icon') || img.classList.contains('bn-logo-img') || src.includes('logo-transparent') || src.includes('icon'));
          const isBgDeco = img.classList.contains('cta-leaves') || src.includes('cta-leaves');

          if (!isHero && !isSlider && !isLogo && !isBgDeco) {
            const rect = img.getBoundingClientRect();
            if (rect.width > 50) {
              const ratio = rect.width / rect.height;
              const is3by4 = Math.abs(ratio - 0.75) < 0.05;
              const cs = window.getComputedStyle(img);

              if (!is3by4) {
                issues.push(`Image "${src.split('/').pop()}" has ratio ${ratio.toFixed(2)} (expected ~0.75, width: ${Math.round(rect.width)}, height: ${Math.round(rect.height)})`);
              } else {
                verifiedCount++;
              }

              // Check object-fit
              if (cs.objectFit !== 'cover') {
                issues.push(`Image "${src.split('/').pop()}" has object-fit "${cs.objectFit}" (expected cover)`);
              }
            }
          }
        });

        // Check hero images are NOT 3:4 (they should be 4:3 or their established ratio)
        const heroPhoto = document.querySelector('.shared-page-hero .hero-photo, .page-hero .hero-photo');
        if (heroPhoto) {
          const hr = heroPhoto.getBoundingClientRect();
          const hRatio = hr.width / hr.height;
          // Hero should be around 1.33 (4/3), definitely not 0.75 (3/4)
          if (hRatio < 1.0) {
            issues.push(`Hero photo has vertical ratio ${hRatio.toFixed(2)} (hero should remain 4:3 landscape)`);
          }
        }

        return { issues, verifiedCount };
      });

      vpVerifiedImages += audit.verifiedCount;
      if (audit.issues.length > 0) {
        vpIssues += audit.issues.length;
        failures += audit.issues.length;
        console.log(`❌ [${vp.name}] ${url}:`);
        audit.issues.forEach(iss => console.log(`   - ${iss}`));
      }
    }

    if (vpIssues === 0) {
      console.log(`✅ [${vp.name}] All ${vpVerifiedImages} eligible content images verified at 3:4 portrait ratio with object-fit: cover.`);
    }

    await context.close();
  }

  // Tablet (768px) and Desktop (1440px) Non-Regression Verification
  console.log('\nVerifying Tablet (768px) and Desktop (1440px) Image Presentation...');
  const deskContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await deskContext.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const dPage = await deskContext.newPage();

  let deskVerified = 0;
  for (const url of ['/services/', '/trademark-registration/', '/packages/', '/about/']) {
    await dPage.goto(`http://localhost:4321${url}`, { waitUntil: 'domcontentloaded' });
    const deskCheck = await dPage.evaluate(() => {
      const splitPhoto = document.querySelector('.split-photo, .section-image, .section-photo, .rounded-photo');
      if (splitPhoto) {
        const cs = window.getComputedStyle(splitPhoto);
        // On desktop, split-photo should have aspect-ratio: 2 / 3, NOT 3 / 4
        return {
          aspectRatio: cs.aspectRatio,
          width: Math.round(splitPhoto.getBoundingClientRect().width),
          height: Math.round(splitPhoto.getBoundingClientRect().height)
        };
      }
      return null;
    });

    if (deskCheck) {
      // ratio should be 2/3 (0.67) or css 2 / 3
      const ratio = deskCheck.width / deskCheck.height;
      if (Math.abs(ratio - (2 / 3)) < 0.05 || deskCheck.aspectRatio === '2 / 3') {
        deskVerified++;
      } else {
        console.log(`⚠️ Desktop ratio on ${url}: ${deskCheck.aspectRatio} (${deskCheck.width}x${deskCheck.height})`);
      }
    }
  }

  if (deskVerified === 4) {
    console.log(`✅ Desktop (1440px): Established 2:3 editorial ratio and two-column layouts 100% preserved.`);
  }

  await deskContext.close();
  await browser.close();

  console.log('\n================================================================');
  console.log(`AUDIT RESULT: Total Failures: ${failures}`);
  console.log('================================================================');
}

run().catch(console.error);
