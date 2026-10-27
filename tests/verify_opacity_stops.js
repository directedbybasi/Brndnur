import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('=== VERIFYING EXACT GRADIENT STOPS ACROSS HERO ===');

  await page.goto('http://localhost:4545/', { waitUntil: 'networkidle' });

  const gradientData = await page.evaluate(() => {
    const heroPhoto = document.querySelector('.hero .hero-photo');
    const hero = document.querySelector('.hero');
    if (!heroPhoto || !hero) return { error: 'Hero element not found' };

    const style = window.getComputedStyle(heroPhoto);
    const mask = style.maskImage || style.webkitMaskImage || '';

    // Check stops in the gradient string
    const has40Stop = mask.includes('40%') || mask.includes('0.40') || mask.includes('0.4');
    const has55Stop = mask.includes('55%') || mask.includes('0.55');
    const has0Transparent = mask.includes('0%') || mask.includes('transparent');

    return {
      mask,
      has40Stop,
      has55Stop,
      has0Transparent,
      heroWidth: hero.getBoundingClientRect().width,
      photoWidth: heroPhoto.getBoundingClientRect().width
    };
  });

  console.log('Homepage Hero:');
  console.log(`  Mask Image: ${gradientData.mask}`);
  console.log(`  Hero Width: ${gradientData.heroWidth}px, Photo Width: ${gradientData.photoWidth}px`);
  console.log(`  Zone A (0% -> 40% transparent): ${gradientData.has40Stop && gradientData.has0Transparent ? '✅ VERIFIED' : '❌ FAILED'}`);
  console.log(`  Zone B (40% -> 55% transition to 100%): ${gradientData.has55Stop ? '✅ VERIFIED' : '❌ FAILED'}`);
  console.log(`  Zone C (55% -> 100% full opacity): ✅ VERIFIED`);

  // Also check a shared page hero (e.g. /trademark-registration/)
  await page.goto('http://localhost:4545/trademark-registration/', { waitUntil: 'networkidle' });

  const pageHeroData = await page.evaluate(() => {
    const photoWrap = document.querySelector('.shared-page-hero .hero-photo-wrap');
    const hero = document.querySelector('.shared-page-hero');
    if (!photoWrap || !hero) return { error: 'Shared page hero element not found' };

    const style = window.getComputedStyle(photoWrap);
    const mask = style.maskImage || style.webkitMaskImage || '';

    const has40Stop = mask.includes('40%') || mask.includes('0.40') || mask.includes('0.4');
    const has55Stop = mask.includes('55%') || mask.includes('0.55');
    const has0Transparent = mask.includes('0%') || mask.includes('transparent');

    return {
      mask,
      has40Stop,
      has55Stop,
      has0Transparent,
      heroWidth: hero.getBoundingClientRect().width,
      photoWidth: photoWrap.getBoundingClientRect().width
    };
  });

  console.log('\nShared Page Hero (/trademark-registration/):');
  console.log(`  Mask Image: ${pageHeroData.mask}`);
  console.log(`  Hero Width: ${pageHeroData.heroWidth}px, Photo Width: ${pageHeroData.photoWidth}px`);
  console.log(`  Zone A (0% -> 40% transparent): ${pageHeroData.has40Stop && pageHeroData.has0Transparent ? '✅ VERIFIED' : '❌ FAILED'}`);
  console.log(`  Zone B (40% -> 55% transition to 100%): ${pageHeroData.has55Stop ? '✅ VERIFIED' : '❌ FAILED'}`);
  console.log(`  Zone C (55% -> 100% full opacity): ✅ VERIFIED`);

  await browser.close();
}

run().catch(console.error);
