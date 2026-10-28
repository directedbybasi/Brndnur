import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');

function findTextRules() {
  const files = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (item.endsWith('.css') || item.endsWith('.astro')) {
        files.push(full);
      }
    }
  }
  walk(SRC_DIR);

  console.log(`Auditing ${files.length} CSS and Astro files for suspicious light-text rules...\n`);

  const suspiciousPatterns = [
    /color\s*:\s*(#f4efe4|#fff|#ffffff|white|#d9dfe8|#e2e8f0|#cbd5e1|#f1f5f9|transparent)/i,
    /-webkit-text-fill-color/i,
    /background-clip\s*:\s*text/i,
    /opacity\s*:\s*0/i
  ];

  const results = [];

  for (const file of files) {
    const rel = path.relative(SRC_DIR, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const pat of suspiciousPatterns) {
        if (pat.test(line)) {
          // Get surrounding context (selector)
          const start = Math.max(0, i - 5);
          const context = lines.slice(start, i + 1).join('\n');
          results.push({
            file: rel,
            lineNum: i + 1,
            matchedLine: line.trim(),
            context: context.trim()
          });
          break;
        }
      }
    }
  }

  console.log(`Found ${results.length} total matches. Filtering for light-on-light risks:\n`);

  // Specifically check for headings (h1, h2, h3, .section-heading, .title, p, .lead)
  // that have light color declarations without dark background in the rule
  const highRisk = [];
  for (const res of results) {
    const text = (res.context + ' ' + res.matchedLine).toLowerCase();
    if (
      (text.includes('h1') || text.includes('h2') || text.includes('h3') || text.includes('section-heading') || text.includes('heading') || text.includes('lead') || text.includes('.process') || text.includes('p:not') || text.includes('section-title') || text.includes('description') || text.includes('summary')) &&
      (text.includes('#f4efe4') || text.includes('#d9dfe8') || text.includes('#fff') || text.includes('transparent') || text.includes('-webkit-text-fill-color'))
    ) {
      highRisk.push(res);
    }
  }

  console.log(`=== HIGH RISK HEADINGS / PARAGRAPHS (${highRisk.length} entries) ===`);
  for (const r of highRisk) {
    console.log(`\n[${r.file}:${r.lineNum}] ${r.matchedLine}`);
    console.log(`Context:\n${r.context}`);
  }
}

findTextRules();
