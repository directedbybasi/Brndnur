import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith('.astro')) {
      results.push(full);
    }
  });
  return results;
}

const files = getFiles('src');
const imgRegex = /<img[^>]+>/g;
const allFound = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const tag = match[0];
    const srcMatch = tag.match(/src=["']([^"']+)["']/);
    const clsMatch = tag.match(/class=["']([^"']+)["']/);
    const src = srcMatch ? srcMatch[1] : '';
    const cls = clsMatch ? clsMatch[1] : '';
    allFound.push({ file: path.relative('.', f), src, cls, tag });
  }
});

console.log(`Found ${allFound.length} <img> tags.`);
allFound.forEach(item => {
  console.log(`${item.file.padEnd(50)} | src: ${item.src.padEnd(45)} | cls: ${item.cls}`);
});
