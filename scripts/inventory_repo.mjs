import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

const EXCLUDE_DIRS = new Set(['.git', 'node_modules', 'dist', '.astro']);

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      files = files.concat(walk(path.join(dir, entry.name)));
    } else {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

const allFiles = walk(rootDir);

const inventory = {
  appSource: [],       // .astro, .ts, .js in src
  styles: [],          // .css in src and shared
  publicAssets: [],    // images, fonts, icons in public
  tooling: [],         // configs, package.json
  tests: [],           // tests/
  scripts: [],         // scripts/
  docs: [],            // docs/ and .md files
  generated: [],       // audit_results.json, SEO-REPORT.html, test pngs, scratch
  legacyOrBackup: [],  // _backup_static_v1, root html files
  other: []
};

for (const filePath of allFiles) {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const size = stat.size;

  const item = { path: relPath, size, ext };

  if (relPath.startsWith('src/')) {
    if (ext === '.css') {
      inventory.styles.push(item);
    } else if (['.astro', '.ts', '.js'].includes(ext)) {
      inventory.appSource.push(item);
    } else {
      inventory.appSource.push(item);
    }
  } else if (relPath.startsWith('public/')) {
    inventory.publicAssets.push(item);
  } else if (relPath.startsWith('tests/')) {
    if (['.png', '.jpg', '.webp'].includes(ext)) {
      inventory.generated.push(item);
    } else {
      inventory.tests.push(item);
    }
  } else if (relPath.startsWith('scripts/')) {
    inventory.scripts.push(item);
  } else if (relPath.startsWith('docs/') || relPath.startsWith('BRAIN/') || relPath.endsWith('.md')) {
    inventory.docs.push(item);
  } else if (relPath.startsWith('_backup_static_v1/')) {
    inventory.legacyOrBackup.push(item);
  } else if (relPath.startsWith('scratch/')) {
    inventory.generated.push(item);
  } else if (['package.json', 'package-lock.json', 'astro.config.mjs', 'tailwind.config.mjs', 'tsconfig.json', '.gitignore'].includes(relPath)) {
    inventory.tooling.push(item);
  } else if (['audit_results.json', 'SEO-REPORT.html', 'FULL-AUDIT-REPORT.md'].includes(relPath)) {
    inventory.generated.push(item);
  } else if (['index.html', 'services/index.html', 'packages/index.html', 'trademark-registration/index.html'].includes(relPath) || relPath.startsWith('packages/') || relPath.startsWith('services/') || relPath.startsWith('trademark-registration/')) {
    inventory.legacyOrBackup.push(item);
  } else {
    inventory.other.push(item);
  }
}

const summary = {
  totalFiles: allFiles.length,
  categories: {
    appSource: inventory.appSource.length,
    styles: inventory.styles.length,
    publicAssets: inventory.publicAssets.length,
    tooling: inventory.tooling.length,
    tests: inventory.tests.length,
    scripts: inventory.scripts.length,
    docs: inventory.docs.length,
    generated: inventory.generated.length,
    legacyOrBackup: inventory.legacyOrBackup.length,
    other: inventory.other.length
  }
};

console.log('=== INVENTORY SUMMARY ===');
console.log(JSON.stringify(summary, null, 2));

fs.writeFileSync('docs/PROJECT_INVENTORY.json', JSON.stringify({ summary, inventory }, null, 2));
console.log('Wrote docs/PROJECT_INVENTORY.json');
