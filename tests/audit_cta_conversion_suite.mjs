import fs from 'fs';
import path from 'path';
import assert from 'assert';

const DIST_DIR = path.resolve('dist');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

console.log('--- RUNNING BRNDNUR CTA & CONVERSION AUDIT SUITE ---');

const htmlFiles = getAllHtmlFiles(DIST_DIR);
assert.ok(htmlFiles.length >= 235, `Expected >= 235 HTML files, found ${htmlFiles.length}`);

let totalWaInstances = 0;
let totalButtons = 0;
const uniqueWaMessages = new Map();
const deadLinks = [];
const emptyHrefs = [];

// Build set of valid routes
const validRoutes = new Set();
for (const file of htmlFiles) {
  let rel = path.relative(DIST_DIR, file).replace(/\\/g, '/');
  if (rel.endsWith('index.html')) {
    rel = '/' + rel.slice(0, -'index.html'.length);
  } else if (rel.endsWith('.html')) {
    rel = '/' + rel.slice(0, -'.html'.length);
  }
  validRoutes.add(rel);
  if (!rel.endsWith('/')) {
    validRoutes.add(rel + '/');
  }
}

const A_TAG_REGEX = /<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*?)>(.*?)<\/a>/gis;
const BUTTON_TAG_REGEX = /<button\s+([^>]*?)>(.*?)<\/button>/gis;

for (const filePath of htmlFiles) {
  const relPage = '/' + path.relative(DIST_DIR, filePath).replace(/\\/g, '/').replace(/index\.html$/, '');
  const html = fs.readFileSync(filePath, 'utf8');

  // Skip redirect pages for link checking
  if (html.includes('http-equiv="refresh"')) continue;

  let match;
  while ((match = A_TAG_REGEX.exec(html)) !== null) {
    const attrs = match[1] + ' ' + match[4];
    const href = match[3];
    const label = match[5].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');

    if (attrs.includes('btn') || attrs.includes('bn-cta') || attrs.includes('service-btn') || attrs.includes('resource-link') || attrs.includes('option-cta')) {
      totalButtons++;
    }

    if (href.startsWith('https://wa.me/') || href.startsWith('http://wa.me/')) {
      totalWaInstances++;
      const urlObj = new URL(href);
      assert.strictEqual(urlObj.pathname.replace(/^\//, ''), '919048188899', `Invalid WhatsApp phone number on ${relPage}: ${urlObj.pathname}`);

      const text = urlObj.searchParams.get('text') || '';
      assert.ok(text.length > 0, `Empty WhatsApp text param on ${relPage}`);

      const words = text.trim().split(/\s+/).filter(Boolean);
      const wordCount = words.length;

      // Verification checks
      assert.ok(
        wordCount >= 20 && wordCount <= 50,
        `WhatsApp message on ${relPage} (${label}) has word count ${wordCount}, outside required range [20, 50]. Message: "${text}"`
      );

      assert.ok(
        !/\[.*?\]/.test(text),
        `WhatsApp message on ${relPage} contains unresolved bracketed placeholder: "${text}"`
      );

      assert.ok(
        !/Website source:/i.test(text),
        `WhatsApp message on ${relPage} contains robotic 'Website source:' metadata`
      );

      assert.ok(
        !/Enquiry type:/i.test(text),
        `WhatsApp message on ${relPage} contains robotic 'Enquiry type:' metadata`
      );

      if (!uniqueWaMessages.has(href)) {
        uniqueWaMessages.set(href, { text, wordCount, pages: new Set([relPage]), labels: new Set([label]) });
      } else {
        const item = uniqueWaMessages.get(href);
        item.pages.add(relPage);
        item.labels.add(label);
      }
    } else if (href === '#' || href === '') {
      emptyHrefs.push({ page: relPage, label });
    } else if (href.startsWith('/') && !href.startsWith('//')) {
      const [pathname] = href.split('#');
      const normalized = pathname.endsWith('/') ? pathname : pathname + '/';
      if (pathname !== '' && !validRoutes.has(pathname) && !validRoutes.has(normalized)) {
        const assetPath = path.join(DIST_DIR, pathname.replace(/^\//, ''));
        if (!fs.existsSync(assetPath)) {
          deadLinks.push({ page: relPage, href, label });
        }
      }
    }
  }

  while ((match = BUTTON_TAG_REGEX.exec(html)) !== null) {
    totalButtons++;
  }
}

console.log(`✓ Scanned ${htmlFiles.length} HTML files.`);
console.log(`✓ Total WhatsApp link instances: ${totalWaInstances}`);
console.log(`✓ Unique WhatsApp message templates: ${uniqueWaMessages.size}`);
console.log(`✓ Total interactive button & CTA instances: ${totalButtons}`);
console.log(`✓ Dead internal links: ${deadLinks.length}`);
console.log(`✓ Unintentional empty hrefs (href="#"): ${emptyHrefs.length}`);

assert.strictEqual(deadLinks.length, 0, `Found ${deadLinks.length} dead links`);
assert.strictEqual(emptyHrefs.length, 0, `Found ${emptyHrefs.length} empty href="#" links`);

console.log('\n--- ALL CTA & WHATSAPP INTEGRITY TESTS PASSED SUCCESSFULLY! ---');
