import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all_sections_mobile_audit.json', 'utf8'));

console.log('========================================================================');
console.log('MOBILE SPACING NORMALISATION REPORT (TARGETS: 32-48px SECTION PADDING, ETC.)');
console.log('========================================================================\n');

let totalIssues = 0;

for (const [url, p] of Object.entries(data)) {
  const issues = [];

  // Check section paddings
  p.secData.forEach((s, idx) => {
    const pt = parseFloat(s.pt);
    const pb = parseFloat(s.pb);
    const name = `${s.cls || s.tag} (${s.id ? '#' + s.id : 'sec-' + idx})`;

    // Exclude hero if hero has 0 padding (photo top)
    if (!s.cls.includes('hero')) {
      if (pt < 28 || pt > 52) {
        issues.push(`[${name}] paddingTop: ${s.pt} (guideline: 32–48px)`);
      }
      if (pb < 28 || pb > 52) {
        issues.push(`[${name}] paddingBottom: ${s.pb} (guideline: 32–48px)`);
      }
    }

    if (s.eyeToH !== null && (s.eyeToH < 6 || s.eyeToH > 16)) {
      issues.push(`[${name}] eyebrow->heading: ${s.eyeToH}px (guideline: 8–12px)`);
    }

    if (s.hToRule !== null && (s.hToRule < 8 || s.hToRule > 20)) {
      issues.push(`[${name}] heading->rule: ${s.hToRule}px (guideline: 12–16px)`);
    }

    if (s.hOrRuleToLead !== null && (s.hOrRuleToLead < 10 || s.hOrRuleToLead > 26)) {
      issues.push(`[${name}] rule/heading->lead: ${s.hOrRuleToLead}px (guideline: 16–20px)`);
    }

    if (s.contentToGrid !== null && (s.contentToGrid < 16 || s.contentToGrid > 40)) {
      issues.push(`[${name}] content->grid: ${s.contentToGrid}px (guideline: 24–32px)`);
    }
  });

  // Check gaps between sections
  p.gapsBetweenSections.forEach(g => {
    if (g.gap !== 0) {
      issues.push(`Gap between ${g.from} and ${g.to}: ${g.gap}px (expected 0px since section padding handles spacing)`);
    }
  });

  if (issues.length > 0) {
    totalIssues += issues.length;
    console.log(`📌 PAGE: ${url} (${issues.length} issues)`);
    issues.forEach(iss => console.log(`   - ${iss}`));
    console.log('');
  } else {
    console.log(`✅ PAGE: ${url} (All sections within guidelines)`);
  }
}

console.log(`\nTOTAL DEVIATIONS FOUND: ${totalIssues}`);
