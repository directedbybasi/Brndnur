import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('scratch/image_audit_data.json', 'utf-8'));

const routes = Object.keys(data);
const issues = [];
const allSections = [];

for (const route of routes) {
  if (route === '/') continue; // Homepage protected

  const desktopImgs = data[route].desktop || [];
  const tabletImgs = data[route].tablet || [];
  const mobileImgs = data[route].mobile || [];

  desktopImgs.forEach((dImg, idx) => {
    // Skip logo, icon, leaves, header, footer unless problematic
    if (dImg.src.includes('logo') || dImg.src.includes('whatsapp') || dImg.src.includes('icon-')) return;

    const tImg = tabletImgs[idx] || {};
    const mImg = mobileImgs[idx] || {};

    allSections.push({
      route,
      src: dImg.src,
      alt: dImg.alt,
      class: dImg.class,
      parentClass: dImg.parentClass,
      section: dImg.section,
      naturalWidth: dImg.naturalWidth,
      naturalHeight: dImg.naturalHeight,
      naturalRatio: dImg.naturalRatio,
      desktop: {
        w: dImg.renderedWidth,
        h: dImg.renderedHeight,
        ratio: dImg.renderedRatio,
        fit: dImg.objectFit,
        aspectRatio: dImg.computedAspectRatio,
        parentW: dImg.parentWidth,
        parentH: dImg.parentHeight,
        parentRatio: dImg.parentAspectRatio
      },
      tablet: {
        w: tImg.renderedWidth,
        h: tImg.renderedHeight,
        ratio: tImg.renderedRatio,
        fit: tImg.objectFit,
        aspectRatio: tImg.computedAspectRatio
      },
      mobile: {
        w: mImg.renderedWidth,
        h: mImg.renderedHeight,
        ratio: mImg.renderedRatio,
        fit: mImg.objectFit,
        aspectRatio: mImg.computedAspectRatio,
        parentW: mImg.parentWidth,
        parentH: mImg.parentHeight,
        parentRatio: mImg.parentAspectRatio
      }
    });
  });
}

console.log(`Total non-homepage content image sections analyzed: ${allSections.length}`);

// Group by section type / image role
const report = allSections.map(item => {
  let sectionType = 'editorial';
  let recommendedRatio = '3:4';
  let fit = 'cover';
  let problem = 'None';

  const srcLower = item.src.toLowerCase();
  const parentLower = (item.parentClass + ' ' + item.class + ' ' + item.section).toLowerCase();

  // 1. CTA leaves / background decorative overlays
  if (srcLower.includes('cta-leaves')) {
    sectionType = 'cta-overlay';
    recommendedRatio = '16:9 (cover)';
    fit = 'cover';
    problem = 'Decorative background overlay - must remain full-bleed cover';
  }
  // 2. Hero images
  else if (parentLower.includes('hero') || parentLower.includes('page-hero') || srcLower.includes('hero')) {
    sectionType = 'hero';
    // Is it split hero photography?
    // Let's check natural ratio:
    const nr = parseFloat(item.naturalRatio);
    if (nr > 1.3) {
      recommendedRatio = '16:9 or 3:2';
      problem = item.mobile.aspectRatio === '3 / 4' ? 'Wide landscape hero forced to 3:4 portrait on mobile causing severe lateral cropping' : 'Check hero responsive crop';
    } else if (nr < 0.9) {
      recommendedRatio = '4:5 or 3:4';
      problem = 'Portrait hero photograph beside copy';
    } else {
      recommendedRatio = '4:3 or 1:1';
      problem = 'Balanced square/near-square hero photograph';
    }
  }
  // 3. Card collections / Carousels
  else if (parentLower.includes('card') || parentLower.includes('carousel') || parentLower.includes('service') || parentLower.includes('package')) {
    sectionType = 'card';
    recommendedRatio = '4:3 or 16:9';
    fit = 'cover';
    if (item.mobile.aspectRatio === '3 / 4' && !srcLower.includes('vertical')) {
      problem = 'Card image forced to 3:4 portrait on mobile distorting card layout';
    }
  }
  // 4. Document / Certificate previews (Udyam, TM-A, FSSAI)
  else if (srcLower.includes('certificate') || srcLower.includes('document') || parentLower.includes('document')) {
    sectionType = 'document';
    recommendedRatio = '3:4 or contain';
    fit = 'contain';
    problem = item.desktop.fit === 'cover' ? 'Document or certificate cropped by object-fit: cover cutting off seals/text' : 'Verify document readability';
  }
  // 5. Editorial split image-and-text
  else {
    sectionType = 'editorial';
    const nr = parseFloat(item.naturalRatio);
    if (nr > 1.2) {
      recommendedRatio = '4:3 or 3:2';
      problem = item.desktop.ratio.includes('0.66') || item.mobile.aspectRatio === '3 / 4' ? 'Landscape editorial photo squeezed into narrow 2:3 or 3:4 container cutting off sides' : 'Check editorial proportions';
    } else {
      recommendedRatio = '3:4 or 4:5';
      problem = 'Portrait editorial image';
    }
  }

  return {
    ...item,
    sectionType,
    recommendedRatio,
    fit,
    problem
  };
});

fs.writeFileSync('scratch/image_audit_analysis.json', JSON.stringify(report, null, 2), 'utf-8');
console.log('Saved scratch/image_audit_analysis.json');

// Print summary by sectionType
const typeCounts = report.reduce((acc, r) => { acc[r.sectionType] = (acc[r.sectionType] || 0) + 1; return acc; }, {});
console.log('Section counts:', typeCounts);
