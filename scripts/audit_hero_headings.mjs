import fs from 'fs';
import path from 'path';

function getAstroFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAstroFiles(fullPath));
    } else if (file.endsWith('.astro')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getAstroFiles('src/pages');
console.log('Total astro pages:', files.length);

const heroInfo = [];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    const rawH1 = h1Match[1].trim();
    const cleanH1 = rawH1.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    heroInfo.push({
      file: f.replace(/\\/g, '/'),
      rawH1,
      cleanH1,
      hasAmp: rawH1.includes('&') || rawH1.includes('&amp;')
    });
  }
});

console.log('Pages found with H1:', heroInfo.length);
heroInfo.forEach(p => {
  console.log(`\n[${p.file}]`);
  console.log(`RAW H1: ${p.rawH1}`);
  if (p.hasAmp) console.log(`HAS AMPERSAND: YES`);
});
