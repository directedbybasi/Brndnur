import fs from 'fs';
import path from 'path';

function findFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(full));
    } else if (full.endsWith('.astro') || full.endsWith('.css')) {
      results.push(full);
    }
  }
  return results;
}

const files = findFiles('src');

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/(background(-color)?\s*:\s*(#13233a|#0d1d31|var\(--navy\)|var\(--navy-deep\)))/i.test(line)) {
      // Find what selector it belongs to if nearby
      const context = lines.slice(Math.max(0, idx - 5), idx + 2).join(' | ');
      console.log(`[${path.basename(f)}:${idx + 1}] ${line.trim()}  <-- Context: ${context.slice(0, 120)}...`);
    }
  });
}
