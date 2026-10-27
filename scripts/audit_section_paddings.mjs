import fs from 'fs';

let raw = fs.readFileSync('scratch/comprehensive_audit.json');
let text = raw.toString('utf8');
if (text.charCodeAt(0) === 0xFEFF || text.startsWith('\uFFFD\uFFFD') || raw[0] === 0xff && raw[1] === 0xfe) {
  text = raw.toString('utf16le');
}
text = text.replace(/^\uFEFF/, '').trim();
const data = JSON.parse(text);

console.log('--- AUDITING SECTION PADDINGS AND VERTICAL GAPS ---');

data.forEach(page => {
  if (page.error || !page.sections) return;
  const nonConforming = [];
  page.sections.forEach(s => {
    const pt = parseFloat(s.pt);
    const pb = parseFloat(s.pb);
    // Guideline: Section top and bottom padding: 32-48px
    if (pt > 50 || pb > 50 || pt < 20 || pb < 20) {
      nonConforming.push({
        cls: s.cls,
        pt: s.pt,
        pb: s.pb,
        headingToGrid: s.headingToGrid
      });
    }
  });

  if (nonConforming.length > 0) {
    console.log(`\nPAGE: ${page.url}`);
    nonConforming.forEach(nc => {
      console.log(`   [${nc.cls || 'section'}] pt: ${nc.pt}, pb: ${nc.pb} | headingToGrid: ${nc.headingToGrid}px`);
    });
  }
});
