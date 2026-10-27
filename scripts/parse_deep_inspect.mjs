import fs from 'fs';

let raw = fs.readFileSync('scratch/deep_inspect.json');
let text = raw.toString('utf8');
if (text.charCodeAt(0) === 0xFEFF || text.startsWith('\uFFFD\uFFFD') || (raw[0] === 0xff && raw[1] === 0xfe)) {
  text = raw.toString('utf16le');
}
text = text.replace(/^\uFEFF/, '').trim();
const report = JSON.parse(text);

console.log('=== SUMMARY OF INSPECTION ===\n');

for (const [url, data] of Object.entries(report)) {
  if (!data || !data.hero) continue;
  const h = data.hero;
  const s2 = data.sec2;
  console.log(`URL: ${url}`);
  console.log(`   Hero: pt=${h.pt}, pb=${h.pb}`);
  console.log(`   Eyebrow mb=${h.eyebrowMb} | H1 mb=${h.h1Mb} | Rule mt=${h.ruleMt}, mb=${h.ruleMb} | Lead mb=${h.leadMb}`);
  console.log(`   Actions: mt=${h.actionsMt}, mb=${h.actionsMb}, gap=${h.actionsGap}, btnGap=${h.btnGap}px`);
  console.log(`   Trust: mt=${h.trustMt}, mb=${h.trustMb}`);
  console.log(`   Trust to Hero bottom: ${h.trustToHeroBottom}px`);
  console.log(`   Trust to Sec2 top: ${h.trustToSec2Top}px`);
  console.log(`   Trust to Sec2 img: ${h.trustToSec2Img}px (Sec2 pt=${s2?.pt}, hasImg=${s2?.hasImg}, imgIsFirst=${s2?.imgIsFirst})`);

  // Print any sections with padding > 48px or < 32px
  const weirdPads = data.sections.filter(s => {
    const pt = parseFloat(s.pt);
    const pb = parseFloat(s.pb);
    return pt > 48 || pb > 48;
  });
  if (weirdPads.length > 0) {
    console.log(`   ⚠️ Sections with padding > 48px:`, weirdPads.map(s => `${s.cls || 'sec'}(pt=${s.pt}, pb=${s.pb})`).join(', '));
  }
  console.log('');
}
