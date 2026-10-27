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

async function runImageAudit() {
  console.log('===============================================================');
  console.log('       BRNDNUR COMPREHENSIVE IMAGE AUDIT SUITE                 ');
  console.log('===============================================================');

  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 }
  ];

  const auditData = {};

  for (const vp of viewports) {
    console.log(`\n--- AUDITING VIEWPORT: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    // Bypass intro animation for audit speed
    await page.addInitScript(() => {
      sessionStorage.setItem('brndnur_intro_played', 'true');
    });

    for (const route of CANONICAL_ROUTES) {
      const url = `${BASE_URL}${route}`;
      try {
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        if (!resp || resp.status() !== 200) {
          console.warn(`[${vp.name}] Failed loading ${route} (status: ${resp?.status()})`);
          continue;
        }

        // Wait a tick for styles to settle
        await page.waitForTimeout(200);

        const pageImages = await page.evaluate((currentRoute) => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs.map((img, idx) => {
            const rect = img.getBoundingClientRect();
            const cs = window.getComputedStyle(img);
            const parent = img.parentElement;
            const parentRect = parent ? parent.getBoundingClientRect() : null;
            const parentCs = parent ? window.getComputedStyle(parent) : null;

            // Nearest section
            const section = img.closest('section, header, footer, aside, .section, .hero, .page-hero');
            const sectionClass = section ? (section.className || section.tagName.toLowerCase()) : 'body';
            const sectionId = section?.id || '';

            const naturalRatio = img.naturalWidth && img.naturalHeight ? (img.naturalWidth / img.naturalHeight).toFixed(3) : 'unknown';
            const renderedRatio = rect.width && rect.height ? (rect.width / rect.height).toFixed(3) : '0';

            return {
              route: currentRoute,
              index: idx,
              src: img.getAttribute('src') || '',
              alt: img.getAttribute('alt') || '',
              class: img.className || '',
              id: img.id || '',
              section: `${sectionClass}${sectionId ? '#' + sectionId : ''}`,
              parentTag: parent?.tagName.toLowerCase() || '',
              parentClass: parent?.className || '',
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              naturalRatio,
              renderedWidth: Math.round(rect.width),
              renderedHeight: Math.round(rect.height),
              renderedRatio,
              objectFit: cs.objectFit,
              objectPosition: cs.objectPosition,
              computedAspectRatio: cs.aspectRatio,
              parentWidth: parentRect ? Math.round(parentRect.width) : 0,
              parentHeight: parentRect ? Math.round(parentRect.height) : 0,
              parentAspectRatio: parentCs?.aspectRatio || 'none',
              isVisible: rect.width > 0 && rect.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'
            };
          }).filter(item => {
            // Filter out SVG data URIs or tiny 1px tracking if any
            return !item.src.startsWith('data:image/svg') && item.src !== '';
          });
        }, route);

        if (!auditData[route]) {
          auditData[route] = {};
        }
        auditData[route][vp.name] = pageImages;

        const contentImgs = pageImages.filter(i => !i.src.includes('logo') && !i.src.includes('whatsapp') && !i.src.includes('icon'));
        console.log(`[${vp.name}] ${route.padEnd(40)} -> ${pageImages.length} images (${contentImgs.length} content)`);
      } catch (err) {
        console.error(`Error auditing ${route} on ${vp.name}:`, err.message);
      }
    }
    await page.close();
    await context.close();
  }

  await browser.close();

  // Save audit data
  const outPath = path.resolve('scratch/image_audit_data.json');
  fs.writeFileSync(outPath, JSON.stringify(auditData, null, 2), 'utf-8');
  console.log(`\nAudit complete! Raw data saved to ${outPath}`);
}

runImageAudit().catch(console.error);
