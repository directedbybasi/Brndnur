import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scratch/image_audit_data.json', 'utf8'));

const targets = [
  { url: '/trademark-registration/', src: 'tm-benefits-foundation', label: 'TM Reg Benefits (Landscape 4:3)' },
  { url: '/trademark-registration/', src: 'tm-process-path', label: 'TM Reg Process (Portrait 3:4)' },
  { url: '/trademark-registration/', src: 'tm-support-steps', label: 'TM Reg Support (Landscape 4:3)' },
  { url: '/trademark-registration/', src: 'tm-faq-advisory', label: 'TM Reg FAQ (Landscape 4:3)' },
  { url: '/services/', src: 'services-business-registration', label: 'Services Business (Landscape 4:3)' },
  { url: '/services/', src: 'services-why-brndnur', label: 'Services Why (Portrait 3:4)' },
  { url: '/services/', src: 'services-process-search', label: 'Services Process (Landscape 4:3)' },
  { url: '/packages/', src: 'packages-pricing-breakdown', label: 'Packages Pricing (Landscape 4:3)' },
  { url: '/packages/', src: 'packages-card-starter', label: 'Packages Card (Banner 16:10)' },
  { url: '/packages/', src: 'packages-watch-support', label: 'Packages Support (Landscape 4:3)' },
  { url: '/about/', src: 'about-values-integrity', label: 'About Story (Portrait 3:4)' },
  { url: '/brand-name-search/', src: 'search-why-clearance', label: 'Search Split (Landscape 4:3)' },
  { url: '/trademark-classes/', src: 'classes-avoid-overfiling', label: 'Classes Split (Portrait 3:4)' },
  { url: '/wordmark-registration/', src: 'wordmark-foundation-exclusivity', label: 'Wordmark Split (Landscape 4:3)' },
  { url: '/trademark-renewal/', src: 'renewal-ownership-maintenance', label: 'Renewal Split (Landscape 4:3)' },
  { url: '/trademark-monitoring/', src: 'monitoring-surveillance-defense', label: 'Monitoring Split (Landscape 4:3)' },
  { url: '/gst-registration/', src: 'gst-tax-credibility', label: 'GST Split (Landscape 4:3)' },
  { url: '/udyam-msme-registration/', src: 'udyam-growth-catalyst', label: 'Udyam Split (Landscape 4:3)' },
  { url: '/fssai-registration/', src: 'fssai-packaging-standards', label: 'FSSAI Split (Landscape 4:3)' },
  { url: '/business-setup/', src: 'setup-startup-readiness', label: 'Setup Split (Landscape 4:3)' },
  { url: '/packages/individual-msme/', src: 'pkg-indiv-breakdown', label: 'Pkg Indiv Split (Landscape 4:3)' },
  { url: '/resources/', src: 'resources-support-clarity', label: 'Resources Split (Landscape 4:3)' }
];

['desktop', 'tablet', 'mobile'].forEach(vp => {
  console.log('\n========================================================================================');
  console.log(`VIEWPORT: ${vp.toUpperCase()}`);
  console.log('========================================================================================');
  targets.forEach(t => {
    const routeData = data[t.url];
    if (!routeData || !routeData[vp]) {
      console.log(`${t.label.padEnd(38)}: Route data not found for ${t.url}`);
      return;
    }
    const item = routeData[vp].find(d => d.src && d.src.includes(t.src));
    if (item) {
      console.log(`${t.label.padEnd(42)}: ${String(item.renderedWidth).padStart(3)}x${String(item.renderedHeight).padEnd(3)} (Ratio: ${item.renderedRatio}) [Parent: ${item.parentWidth}x${item.parentHeight}]`);
    } else {
      console.log(`${t.label.padEnd(42)}: NOT FOUND in ${t.url}`);
    }
  });
});
