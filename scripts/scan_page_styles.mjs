import fs from 'fs';
import path from 'path';

const PAGES_DIR = path.resolve('src/pages');

function scanPageStyles() {
  const pages = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (item.endsWith('.astro')) pages.push(full);
    }
  }
  walk(PAGES_DIR);

  console.log(`Scanning ${pages.length} pages in src/pages for light text rules...\n`);

  for (const page of pages) {
    const rel = path.relative(PAGES_DIR, page).replace(/\\/g, '/');
    const content = fs.readFileSync(page, 'utf-8');
    const styleMatches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];

    for (const sm of styleMatches) {
      const lines = sm.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          (line.includes('#F4EFE4') || line.includes('#fff') || line.includes('#FFFCF6') || line.includes('#D9DFE8') || line.includes('#e1e6ed')) &&
          line.includes('color:')
        ) {
          const start = Math.max(0, i - 8);
          const block = lines.slice(start, i + 1).join('\n');
          console.log(`[${rel}] line: ${line.trim()}`);
          console.log(block);
          console.log('-----------------------------------------------------\n');
        }
      }
    }
  }
}

scanPageStyles();
