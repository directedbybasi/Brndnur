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
const allHeroes = [];

files.forEach(filePath => {
  const rel = filePath.replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');

  // Look for PageHero component
  const pageHeroMatch = content.match(/<PageHero([\s\S]*?)\/>/);
  if (pageHeroMatch) {
    const titleMatch = pageHeroMatch[1].match(/title=(?:\{["'`]([\s\S]*?)["'`]\}|["']([\s\S]*?)["'])/);
    allHeroes.push({
      file: rel,
      type: 'PageHero',
      titleHtml: titleMatch ? (titleMatch[1] || titleMatch[2]) : 'UNKNOWN'
    });
    return;
  }

  // Look for direct h1
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    allHeroes.push({
      file: rel,
      type: 'DirectH1',
      titleHtml: h1Match[1].trim()
    });
    return;
  }

  allHeroes.push({
    file: rel,
    type: 'NoDirectH1',
    titleHtml: 'NONE FOUND'
  });
});

console.log(`Audited ${allHeroes.length} pages:`);
allHeroes.forEach((h, idx) => {
  console.log(`${idx + 1}. [${h.type}] ${h.file}`);
  console.log(`   TITLE: ${h.titleHtml}`);
});
