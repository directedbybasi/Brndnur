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

const suspectRules = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('font-family') || line.includes('font:')) {
      // Check if it mentions serif or something unexpected
      if (
        line.toLowerCase().includes('playfair') ||
        line.toLowerCase().includes('georgia') ||
        line.toLowerCase().includes('times') ||
        (line.toLowerCase().includes('serif') && !line.includes('--serif: var(--sans)') && !line.includes('sans-serif'))
      ) {
        suspectRules.push({ file, line: idx + 1, content: line.trim() });
      }
    }
  });
}

console.log('Suspect Font Rules found:', JSON.stringify(suspectRules, null, 2));
