import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');

// Search for any CSS rule targeting headings or paragraphs with light colors
const globalCss = fs.readFileSync('src/styles/global.css', 'utf-8');
const lines = globalCss.split('\n');

console.log('=== CHECKING src/styles/global.css FOR LIGHT TEXT RULES ===\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (
    line.includes('color:') &&
    (line.includes('#F4EFE4') || line.includes('#fff') || line.includes('#D9DFE8') || line.includes('#FFFCF6') || line.includes('white'))
  ) {
    // Print previous 10 lines to see selector
    const start = Math.max(0, i - 10);
    const block = lines.slice(start, i + 1).join('\n');
    console.log(`Line ${i + 1}: ${line.trim()}`);
    console.log('Context:\n' + block);
    console.log('-----------------------------------------------------\n');
  }
}
