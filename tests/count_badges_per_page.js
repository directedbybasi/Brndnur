import fs from 'fs';

const pagesWithCustom = [
  'src/pages/about/index.astro',
  'src/pages/brand-name-search/index.astro',
  'src/pages/business-setup/index.astro',
  'src/pages/contact/index.astro',
  'src/pages/faqs/index.astro',
  'src/pages/fssai-registration/index.astro',
  'src/pages/gst-registration/index.astro',
  'src/pages/how-it-works/index.astro',
  'src/pages/logo-trademark-registration/index.astro',
  'src/pages/packages/company-llp/index.astro',
  'src/pages/packages/food-brand/index.astro',
  'src/pages/packages/gulf-return-business/index.astro',
  'src/pages/packages/index.astro',
  'src/pages/packages/individual-msme/index.astro',
  'src/pages/resources/brand-name-search-guide/index.astro',
  'src/pages/resources/index.astro',
  'src/pages/resources/trademark-application-process/index.astro',
  'src/pages/resources/trademark-class-guide/index.astro',
  'src/pages/resources/trademark-registration-guide/index.astro',
  'src/pages/services/index.astro',
  'src/pages/trademark-classes/index.astro',
  'src/pages/trademark-monitoring/index.astro',
  'src/pages/trademark-registration/index.astro',
  'src/pages/trademark-renewal/index.astro',
  'src/pages/udyam-msme-registration/index.astro',
  'src/pages/wordmark-registration/index.astro'
];

for (const p of pagesWithCustom) {
  const content = fs.readFileSync(p, 'utf8');
  // find trustBadges=[ ... ]
  const badgeSection = content.slice(content.indexOf('trustBadges'));
  const openBracket = badgeSection.indexOf('[');
  let depth = 0;
  let closeBracket = -1;
  for (let i = openBracket; i < badgeSection.length; i++) {
    if (badgeSection[i] === '[') depth++;
    else if (badgeSection[i] === ']') {
      depth--;
      if (depth === 0) {
        closeBracket = i;
        break;
      }
    }
  }
  const arrayStr = badgeSection.slice(openBracket, closeBracket + 1);
  const objectMatches = arrayStr.match(/\{[\s\S]*?\}/g) || [];
  console.log(`${p.padEnd(60)}: ${objectMatches.length} badges`);
}
