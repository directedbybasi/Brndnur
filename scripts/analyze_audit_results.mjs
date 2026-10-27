import fs from 'fs';

let raw = fs.readFileSync('scratch/comprehensive_audit.json');
let text = raw.toString('utf8');
if (text.charCodeAt(0) === 0xFEFF || text.startsWith('\uFFFD\uFFFD') || raw[0] === 0xff && raw[1] === 0xfe) {
  text = raw.toString('utf16le');
}
text = text.replace(/^\uFEFF/, '').trim();
const data = JSON.parse(text);

console.log('Total pages audited:', data.length);

console.log('\n===============================================================');
console.log('1. HERO SPACING ANALYSIS (Target guidelines):');
console.log('   - Eyebrow to H1: 8–12px');
console.log('   - H1 to Rule: 12–16px');
console.log('   - H1/Rule to Lead: 16–20px');
console.log('   - Lead to CTA: 20–24px');
console.log('   - Between stacked CTA btns: 10–12px');
console.log('   - CTA to Feature strip (trust): 20–24px');
console.log('   - Trust to Next Image: 24–32px');
console.log('===============================================================\n');

data.forEach(page => {
  if (page.error) {
    console.log(`❌ ${page.url}: ERROR - ${page.error}`);
    return;
  }
  const h = page.heroData;
  if (!h) {
    console.log(`ℹ️ ${page.url}: No hero found`);
    return;
  }

  const issues = [];
  if (h.eyebrowToH1 !== null && (h.eyebrowToH1 < 6 || h.eyebrowToH1 > 16)) {
    issues.push(`Eyebrow->H1: ${h.eyebrowToH1}px (expected 8-12px)`);
  }
  if (h.h1ToRule !== null && (h.h1ToRule < 8 || h.h1ToRule > 20)) {
    issues.push(`H1->Rule: ${h.h1ToRule}px (expected 12-16px)`);
  }
  if (h.h1OrRuleToLead !== null && (h.h1OrRuleToLead < 12 || h.h1OrRuleToLead > 26)) {
    issues.push(`H1/Rule->Lead: ${h.h1OrRuleToLead}px (expected 16-20px)`);
  }
  if (h.leadToActions !== null && (h.leadToActions < 14 || h.leadToActions > 28)) {
    issues.push(`Lead->CTA: ${h.leadToActions}px (expected 20-24px)`);
  }
  if (h.btnGap !== null && (h.btnGap < 8 || h.btnGap > 16)) {
    issues.push(`Between CTA btns: ${h.btnGap}px (expected 10-12px)`);
  }
  if (h.actionsToTrust !== null && (h.actionsToTrust < 16 || h.actionsToTrust > 28)) {
    issues.push(`CTA->Trust: ${h.actionsToTrust}px (expected 20-24px)`);
  }
  if (h.trustToNextImg !== null && (h.trustToNextImg < 20 || h.trustToNextImg > 60)) {
    issues.push(`Trust->NextImg: ${h.trustToNextImg}px (expected 24-32px)`);
  }

  // Also check section padding on the page
  const sectionPadIssues = [];
  page.sections.forEach(s => {
    const pt = parseFloat(s.pt);
    const pb = parseFloat(s.pb);
    if (pt > 60 || pb > 60) {
      sectionPadIssues.push(`[${s.cls || s.tag}] pt=${s.pt}, pb=${s.pb}`);
    }
  });

  console.log(`PAGE: ${page.url} (Hero height: ${h.heroHeight}px, Photo height: ${h.photoHeight}px, Hero pb: ${h.heroPaddingBottom})`);
  console.log(`   Eyebrow->H1: ${h.eyebrowToH1}px | H1->Rule: ${h.h1ToRule}px | Lead: ${h.h1OrRuleToLead}px | CTA: ${h.leadToActions}px | BtnGap: ${h.btnGap}px | Trust: ${h.actionsToTrust}px | Trust->Next: ${h.trustToNextSection}px | Trust->NextImg: ${h.trustToNextImg}px`);
  if (issues.length > 0) {
    console.log(`   ⚠️ HERO ISSUES: ${issues.join(' | ')}`);
  }
  if (sectionPadIssues.length > 0) {
    console.log(`   ⚠️ LARGE SECTION PADDING: ${sectionPadIssues.slice(0, 3).join(' | ')}${sectionPadIssues.length > 3 ? ` (+${sectionPadIssues.length - 3} more)` : ''}`);
  }
  if (page.hasOverflow) {
    console.log(`   🚨 HORIZONTAL OVERFLOW: scrollWidth ${page.scrollWidth}px`);
  }
  console.log('');
});
