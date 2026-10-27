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
console.log('Inspecting benefit badges in all astro pages:\n');

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('<PageHero')) {
    // Check if trustBadges is passed
    const match = content.match(/trustBadges=\{([^}]+)\}/s) || content.match(/trustBadges=\{(\[[\s\S]*?\])\}/);
    if (match) {
      console.log(`[CUSTOM BADGES] ${f}`);
    } else {
      console.log(`[DEFAULT BADGES] ${f}`);
    }
  } else if (content.includes('trust-row')) {
    const itemCount = (content.match(/class=["']trust-item["']/g) || []).length;
    console.log(`[INLINE TRUST-ROW (${itemCount} items)] ${f}`);
  }
});
