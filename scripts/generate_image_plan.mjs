import fs from 'fs';

const items = JSON.parse(fs.readFileSync('scratch/image_audit_analysis.json', 'utf-8'));

// We want to generate the exact internal audit table required by Phase 3 of the prompt:
// Page route | Section | Image asset | Current problem | Current ratio | Recommended ratio | Fit behaviour | Desktop presentation | Mobile presentation | Implementation

const tableRows = [];

items.forEach(item => {
  if (item.sectionType === 'cta-overlay') return; // Skip background leaves

  const srcName = item.src.split('/').pop();
  let sectionName = item.section;
  if (item.parentClass) sectionName += ` (${item.parentClass})`;

  let currentProblem = '';
  let currentRatio = `Desktop: ${item.desktop.ratio} (${item.desktop.aspectRatio}), Mobile: ${item.mobile.ratio} (${item.mobile.aspectRatio})`;
  let recRatio = '';
  let fitBehavior = 'cover';
  let desktopPres = '';
  let mobilePres = '';
  let implementation = '';

  const nw = item.naturalWidth;
  const nh = item.naturalHeight;
  const nr = parseFloat(item.naturalRatio);

  if (item.sectionType === 'hero') {
    if (item.desktop.w === 1440 && item.desktop.h === 700) {
      currentProblem = 'Full-bleed desktop hero with gradient mask. Mobile renders at 4:3 (358x269).';
      recRatio = 'Desktop: Widescreen cover (16:9/2:1), Mobile: 4:3 or 3:2';
      fitBehavior = 'cover';
      desktopPres = '1440x700 with subtle horizontal gradient mask, object-fit: cover';
      mobilePres = 'Full-width 4:3 (358x269px) with object-fit: cover, centered subject';
      implementation = '.hero-photo-wrap, .page-hero-photo';
    } else {
      currentProblem = 'Hero image container sizing';
      recRatio = '16:9 or 3:2';
      fitBehavior = 'cover';
      desktopPres = 'Responsive hero container';
      mobilePres = 'Stacked 4:3';
      implementation = 'PageHero component';
    }
  } else if (item.sectionType === 'card') {
    if (item.src.includes('packages-card-')) {
      currentProblem = 'Package card header photo rendered at ~2:1 (361x180). Clean horizontal card banner.';
      recRatio = '16:9 or 16:10';
      fitBehavior = 'cover';
      desktopPres = '360x190px (16:9 banner), object-fit: cover';
      mobilePres = '100% width, 16:10 ratio, clean subject framing';
      implementation = '.package-photo img in packages/index.astro';
    } else {
      currentProblem = `Card thumbnail (natural ${nw}x${nh}). Rendered 4:3 (381x286). Matches natural ratio cleanly.`;
      recRatio = '4:3';
      fitBehavior = 'cover';
      desktopPres = '380x285px (4:3), object-fit: cover';
      mobilePres = '100% card width (4:3), object-fit: cover';
      implementation = '.service-card img, .card-grid img';
    }
  } else if (item.sectionType === 'editorial') {
    if (nr < 0.9) {
      // Natural portrait (e.g. 896x1200)
      currentProblem = `Naturally portrait (${nw}x${nh}). Squeezed to 2:3 (${item.desktop.w}x${item.desktop.h}) on desktop, forced to 3:4 on mobile. Excessive height relative to text.`;
      recRatio = '3:4 or 4:5 Portrait';
      fitBehavior = 'cover';
      desktopPres = 'max-width 400px, aspect-ratio: 3/4 (or 4/5), object-fit: cover, focal alignment';
      mobilePres = 'max-width 360px, aspect-ratio: 3/4, stacked above/below text';
      implementation = '.split-photo, .section-image, .rounded-photo';
    } else {
      // Natural landscape (e.g. 1200x896 = 4:3)
      currentProblem = `Naturally landscape (${nw}x${nh}, 4:3). Forced to vertical 2:3 (${item.desktop.w}x${item.desktop.h}) on desktop and 3:4 on mobile, cutting off 50% of the image (left/right subjects).`;
      recRatio = '4:3 or 3:2 Landscape/Balanced';
      fitBehavior = 'cover';
      desktopPres = 'max-width 460px, aspect-ratio: 4/3 (or 3/2), object-fit: cover, preserves full scene';
      mobilePres = 'max-width 380px, aspect-ratio: 4/3 (or 3/2), natural scene without severe side cropping';
      implementation = 'Scoped ratio variant for landscape editorial sections';
    }
  }

  tableRows.push({
    route: item.route,
    section: item.section,
    src: srcName,
    fullSrc: item.src,
    problem: currentProblem,
    currentRatio,
    recRatio,
    fitBehavior,
    desktopPres,
    mobilePres,
    implementation
  });
});

console.log(`Generated audit entries for ${tableRows.length} non-homepage content image sections.`);

// Write markdown table
let md = '# Section-by-Section Image Audit & Presentation Plan\n\n';
md += '| Page Route | Section | Image Asset | Current Problem | Current Ratio | Recommended Ratio | Fit | Desktop Presentation | Mobile Presentation | Implementation Target |\n';
md += '|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|\n';

tableRows.forEach(r => {
  md += `| \`${r.route}\` | ${r.section} | \`${r.src}\` | ${r.problem} | ${r.currentRatio} | **${r.recRatio}** | \`${r.fitBehavior}\` | ${r.desktopPres} | ${r.mobilePres} | \`${r.implementation}\` |\n`;
});

fs.writeFileSync('scratch/section_by_section_image_plan.md', md, 'utf-8');
console.log('Saved scratch/section_by_section_image_plan.md');
