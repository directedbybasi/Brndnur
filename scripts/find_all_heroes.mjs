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

const files = getAstroFiles('src');

const heroes = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Check for PageHero
  const pageHeroMatches = content.matchAll(/<PageHero[\s\S]*?\/>/g);
  for (const m of pageHeroMatches) {
    const titleMatch = m[0].match(/title=(?:\{["'`]([\s\S]*?)["'`]\}|["']([\s\S]*?)["'])/);
    heroes.push({
      file: f.replace(/\\/g, '/'),
      type: 'PageHero',
      title: titleMatch ? (titleMatch[1] || titleMatch[2]) : 'UNKNOWN'
    });
  }

  // Check for direct hero sections
  const heroSectionMatches = content.matchAll(/<section[^>]*class=["'][^"']*\bhero\b[^"']*["'][^>]*>([\s\S]*?)<\/section>/g);
  for (const m of heroSectionMatches) {
    // If it contains h1
    const h1 = m[1].match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (h1 && !m[0].includes('shared-page-hero')) {
      heroes.push({
        file: f.replace(/\\/g, '/'),
        type: 'CustomHero',
        title: h1[1].trim()
      });
    }
  }
});

console.log(`Found ${heroes.length} heroes:`);
heroes.forEach((h, i) => {
  console.log(`${i + 1}. [${h.type}] ${h.file}`);
  console.log(`   TITLE: ${h.title}\n`);
});
