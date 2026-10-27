import fs from 'fs';
import path from 'path';

function findFiles(dir, extList) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (item === 'node_modules' || item === 'dist' || item === '.git' || item === '_backup_static_v1') continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findFiles(fullPath, extList));
    } else if (extList.some(ext => item.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = findFiles('./src', ['.astro', '.css']);
files.push('./shared/site.css');

const allFontDecls = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('font-family:') || line.includes('font:')) {
      allFontDecls.push({ file, line: idx + 1, text: line.trim() });
    }
  });
}

console.log(`Found ${allFontDecls.length} font declarations.`);
const nonSans = allFontDecls.filter(d => {
  const t = d.text.toLowerCase();
  // If it sets --sans or references var(--sans) or var(--bn-sans) or inherit or "DM Sans", it's fine.
  if (t.includes('var(--sans') || t.includes('var(--bn-sans') || t.includes('inherit')) return false;
  if (t.includes('"dm sans"') || t.includes("'dm sans'")) return false;
  return true;
});

console.log('Non-standard / Suspect font declarations:', JSON.stringify(nonSans, null, 2));
