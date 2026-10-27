import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.astro')) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles('src/pages');
console.log('Total astro pages:', files.length);

const pagesWithHero = [];
const pagesWithoutHero = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasPageHero = content.includes('<PageHero');
  const hasTrustRow = content.includes('trust-row');
  const hasHero = content.includes('class="hero"') || content.includes("class='hero'") || content.includes('class="hero ');
  
  if (hasPageHero || hasTrustRow || hasHero) {
    pagesWithHero.push({ file: f, hasPageHero, hasTrustRow, hasHero });
  } else {
    pagesWithoutHero.push(f);
  }
});

console.log(`\nPages with hero/trust-row (${pagesWithHero.length}):`);
pagesWithHero.forEach(p => console.log(' ', p.file, 'PageHero:', p.hasPageHero, 'trust-row:', p.hasTrustRow));

console.log(`\nPages without hero (${pagesWithoutHero.length}):`);
pagesWithoutHero.forEach(f => console.log(' ', f));
