import fs from 'fs';

const items = JSON.parse(fs.readFileSync('scratch/image_audit_analysis.json', 'utf-8'));

console.log('========================================================================');
console.log('                     HERO IMAGES AUDIT                                  ');
console.log('========================================================================');
items.filter(i => i.sectionType === 'hero').forEach(i => {
  console.log(`[${i.route}]`);
  console.log(`  File: ${i.src}`);
  console.log(`  Natural: ${i.naturalWidth}x${i.naturalHeight} (Ratio: ${i.naturalRatio})`);
  console.log(`  Desktop: ${i.desktop.w}x${i.desktop.h} (Ratio: ${i.desktop.ratio}, AspectRatio: ${i.desktop.aspectRatio}, Fit: ${i.desktop.fit})`);
  console.log(`  Tablet:  ${i.tablet.w}x${i.tablet.h} (Ratio: ${i.tablet.ratio}, AspectRatio: ${i.tablet.aspectRatio})`);
  console.log(`  Mobile:  ${i.mobile.w}x${i.mobile.h} (Ratio: ${i.mobile.ratio}, AspectRatio: ${i.mobile.aspectRatio})`);
  console.log(`  Parent:  ${i.parentClass} (${i.desktop.parentW}x${i.desktop.parentH})`);
  console.log('------------------------------------------------------------------------');
});

console.log('\n========================================================================');
console.log('                   EDITORIAL SPLIT IMAGES AUDIT                         ');
console.log('========================================================================');
items.filter(i => i.sectionType === 'editorial').forEach(i => {
  console.log(`[${i.route}]`);
  console.log(`  File: ${i.src}`);
  console.log(`  Natural: ${i.naturalWidth}x${i.naturalHeight} (Ratio: ${i.naturalRatio})`);
  console.log(`  Desktop: ${i.desktop.w}x${i.desktop.h} (Ratio: ${i.desktop.ratio}, AspectRatio: ${i.desktop.aspectRatio}, Fit: ${i.desktop.fit})`);
  console.log(`  Tablet:  ${i.tablet.w}x${i.tablet.h} (Ratio: ${i.tablet.ratio}, AspectRatio: ${i.tablet.aspectRatio})`);
  console.log(`  Mobile:  ${i.mobile.w}x${i.mobile.h} (Ratio: ${i.mobile.ratio}, AspectRatio: ${i.mobile.aspectRatio})`);
  console.log(`  Parent:  ${i.parentClass} (${i.desktop.parentW}x${i.desktop.parentH})`);
  console.log('------------------------------------------------------------------------');
});

console.log('\n========================================================================');
console.log('                     CARD IMAGES AUDIT                                  ');
console.log('========================================================================');
items.filter(i => i.sectionType === 'card').forEach(i => {
  console.log(`[${i.route}]`);
  console.log(`  File: ${i.src}`);
  console.log(`  Natural: ${i.naturalWidth}x${i.naturalHeight} (Ratio: ${i.naturalRatio})`);
  console.log(`  Desktop: ${i.desktop.w}x${i.desktop.h} (Ratio: ${i.desktop.ratio}, AspectRatio: ${i.desktop.aspectRatio}, Fit: ${i.desktop.fit})`);
  console.log(`  Tablet:  ${i.tablet.w}x${i.tablet.h} (Ratio: ${i.tablet.ratio}, AspectRatio: ${i.tablet.aspectRatio})`);
  console.log(`  Mobile:  ${i.mobile.w}x${i.mobile.h} (Ratio: ${i.mobile.ratio}, AspectRatio: ${i.mobile.aspectRatio})`);
  console.log(`  Parent:  ${i.parentClass} (${i.desktop.parentW}x${i.desktop.parentH})`);
  console.log('------------------------------------------------------------------------');
});
