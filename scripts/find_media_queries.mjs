import fs from 'fs';

const css = fs.readFileSync('src/styles/global.css', 'utf8');
const lines = css.split(/\r?\n/);
lines.forEach((l, idx) => {
  if (l.includes('@media')) {
    console.log(`Line ${idx + 1}: ${l}`);
  }
});
