import fs from 'fs';
import path from 'path';

function findFiles(dir, ext = '.astro') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(full, ext));
    } else if (full.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

const astroFiles = findFiles('src');
console.log(`Found ${astroFiles.length} astro files.`);

for (const file of astroFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Check for dark sections or dark backgrounds
  const darkMatches = content.match(/<section[^>]*class=["'][^"']*(dark|navy|step|included|feature)[^"']*["'][^>]*>/gi);
  const inlineDark = content.match(/<section[^>]*style=["'][^"']*(#13233a|navy)[^"']*["'][^>]*>/gi);
  if (darkMatches || inlineDark) {
    console.log(`\nFile: ${file}`);
    if (darkMatches) darkMatches.forEach(m => console.log(`  Match: ${m}`));
    if (inlineDark) inlineDark.forEach(m => console.log(`  Inline: ${m}`));
  }
}
