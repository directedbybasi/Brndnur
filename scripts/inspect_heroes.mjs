import fs from 'fs';
import path from 'path';

function getAstroFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) results = results.concat(getAstroFiles(full));
    else if (file.endsWith('.astro')) results.push(full);
  });
  return results;
}

const files = getAstroFiles('src/pages');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const usesPageHero = content.includes('<PageHero');
  const usesDirectHero = content.includes('hero') && content.includes('<section');
  const rel = f.replace(/\\/g, '/');
  console.log(rel, '->', usesPageHero ? 'PageHero' : (usesDirectHero ? 'DirectHero' : 'Other'));
});
