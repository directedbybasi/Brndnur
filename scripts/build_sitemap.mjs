import fs from 'node:fs';
import path from 'node:path';

const blogDir = path.resolve('content/blog');
const publicDir = path.resolve('public');
const DOMAIN = 'https://brndnur.com';

// 1. Committed Canonical Static Routes (31 indexable public pages)
const STATIC_ROUTES = [
  // Group A: Main Pages
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/trademark-registration/', priority: '0.9', changefreq: 'weekly' },
  { path: '/services/', priority: '0.9', changefreq: 'weekly' },
  { path: '/packages/', priority: '0.8', changefreq: 'weekly' },

  // Group B: Company Information
  { path: '/about/', priority: '0.7', changefreq: 'monthly' },
  { path: '/how-it-works/', priority: '0.7', changefreq: 'monthly' },
  { path: '/faqs/', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact/', priority: '0.8', changefreq: 'monthly' },

  // Group C: Trademark Services
  { path: '/trademark-classes/', priority: '0.8', changefreq: 'monthly' },
  { path: '/brand-name-search/', priority: '0.8', changefreq: 'monthly' },
  { path: '/wordmark-registration/', priority: '0.8', changefreq: 'monthly' },
  { path: '/logo-trademark-registration/', priority: '0.8', changefreq: 'monthly' },
  { path: '/trademark-renewal/', priority: '0.7', changefreq: 'monthly' },
  { path: '/trademark-monitoring/', priority: '0.7', changefreq: 'monthly' },

  // Group D: Business Registration Services
  { path: '/gst-registration/', priority: '0.8', changefreq: 'monthly' },
  { path: '/udyam-msme-registration/', priority: '0.8', changefreq: 'monthly' },
  { path: '/fssai-registration/', priority: '0.8', changefreq: 'monthly' },
  { path: '/business-setup/', priority: '0.8', changefreq: 'monthly' },

  // Group E: Detailed Packages
  { path: '/packages/individual-msme/', priority: '0.8', changefreq: 'monthly' },
  { path: '/packages/company-llp/', priority: '0.8', changefreq: 'monthly' },
  { path: '/packages/food-brand/', priority: '0.8', changefreq: 'monthly' },
  { path: '/packages/gulf-return-business/', priority: '0.8', changefreq: 'monthly' },

  // Group F: Resources & Educational Guides
  { path: '/resources/', priority: '0.8', changefreq: 'weekly' },
  { path: '/resources/trademark-registration-guide/', priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/trademark-class-guide/', priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/brand-name-search-guide/', priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/trademark-application-process/', priority: '0.7', changefreq: 'monthly' },

  // Group G: Legal & Policy Pages
  { path: '/privacy-policy/', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms-and-conditions/', priority: '0.5', changefreq: 'yearly' },
  { path: '/disclaimer/', priority: '0.5', changefreq: 'yearly' },
  { path: '/refund-cancellation-policy/', priority: '0.5', changefreq: 'yearly' }
];

const LASTMOD = '2026-10-27';

const staticXmlEntries = STATIC_ROUTES.map(route => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');

// 2. Read all published articles dynamically from content/blog
const files = fs.readdirSync(blogDir).filter(f => f.startsWith('KL-') && f.endsWith('.json')).sort();
const articleUrls = [];

for (const file of files) {
  const d = JSON.parse(fs.readFileSync(path.join(blogDir, file), 'utf-8'));
  if (d.published === true && d.slug) {
    articleUrls.push(`  <url>
    <loc>${DOMAIN}/resources/${d.slug}/</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }
}

const fullSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Group A-G: Canonical Static Routes (${STATIC_ROUTES.length} Pages) -->
${staticXmlEntries}

  <!-- Group H: Kerala District Statutory Guides (200 Resource Articles) -->
${articleUrls.join('\n')}
</urlset>
`;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const targetFile = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(targetFile, fullSitemap, 'utf-8');
console.log(`Generated public/sitemap.xml with ${STATIC_ROUTES.length} static pages + ${articleUrls.length} resource articles (Total: ${STATIC_ROUTES.length + articleUrls.length} URLs).`);
