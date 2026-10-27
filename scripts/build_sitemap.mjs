import fs from 'node:fs';
import path from 'node:path';

const blogDir = path.resolve('content/blog');
const publicDir = path.resolve('public');

// 1. Read base 31 static routes from scratch/sitemap.xml.bak
const baseSitemap = fs.readFileSync(path.resolve('scratch/sitemap.xml.bak'), 'utf-8');

// Extract all <url> blocks from base sitemap
const baseUrls = baseSitemap.slice(
  baseSitemap.indexOf('<url>'),
  baseSitemap.lastIndexOf('</url>') + 6
);

// 2. Read all 200 articles
const files = fs.readdirSync(blogDir).filter(f => f.startsWith('KL-') && f.endsWith('.json')).sort();
const articleUrls = [];

for (const file of files) {
  const d = JSON.parse(fs.readFileSync(path.join(blogDir, file), 'utf-8'));
  if (d.published === true && d.slug) {
    articleUrls.push(`  <url>
    <loc>https://brndnur.com/resources/${d.slug}/</loc>
    <lastmod>2026-10-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }
}

const fullSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${baseUrls}

  <!-- Group H: Kerala District Statutory Guides (200 Resource Articles) -->
${articleUrls.join('\n')}
</urlset>
`;

const targetFile = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(targetFile, fullSitemap, 'utf-8');
console.log(`Generated public/sitemap.xml with 31 static pages + ${articleUrls.length} resource articles (Total: ${31 + articleUrls.length} URLs).`);
