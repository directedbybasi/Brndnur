import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('tests/screenshots/benefit-strip');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'Desktop_1440', width: 1440, height: 900, isDesktop: true },
  { name: 'Desktop_1280', width: 1280, height: 800, isDesktop: true },
  { name: 'Desktop_1024', width: 1024, height: 768, isDesktop: true },
  { name: 'Tablet_1023', width: 1023, height: 768, isTablet: true },
  { name: 'Tablet_768', width: 768, height: 1024, isTablet: true },
  { name: 'Mobile_430', width: 430, height: 932, isMobile: true },
  { name: 'Mobile_390', width: 390, height: 844, isMobile: true },
  { name: 'Narrow_360', width: 360, height: 800, isMobile: true }
];

const PAGES = [
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about/' },
  { name: 'Trademark Registration', url: '/trademark-registration/' },
  { name: 'Services', url: '/services/' },
  { name: 'Packages', url: '/packages/' },
  { name: 'Contact', url: '/contact/' },
  { name: 'FAQs', url: '/faqs/' },
  { name: 'How It Works', url: '/how-it-works/' },
  { name: 'Brand Name Search', url: '/brand-name-search/' },
  { name: 'Trademark Classes', url: '/trademark-classes/' },
  { name: 'Wordmark Registration', url: '/wordmark-registration/' },
  { name: 'Logo TM Registration', url: '/logo-trademark-registration/' },
  { name: 'Trademark Renewal', url: '/trademark-renewal/' },
  { name: 'Trademark Monitoring', url: '/trademark-monitoring/' },
  { name: 'GST Registration', url: '/gst-registration/' },
  { name: 'Udyam MSME', url: '/udyam-msme-registration/' },
  { name: 'FSSAI Registration', url: '/fssai-registration/' },
  { name: 'Business Setup', url: '/business-setup/' },
  { name: 'Package - Individual MSME', url: '/packages/individual-msme/' },
  { name: 'Package - Food Brand', url: '/packages/food-brand/' },
  { name: 'Package - Company LLP', url: '/packages/company-llp/' },
  { name: 'Package - Gulf Return', url: '/packages/gulf-return-business/' },
  { name: 'Resources Hub', url: '/resources/' },
  { name: 'Guide - TM Registration', url: '/resources/trademark-registration-guide/' },
  { name: 'Guide - TM Class', url: '/resources/trademark-class-guide/' },
  { name: 'Guide - Brand Search', url: '/resources/brand-name-search-guide/' },
  { name: 'Guide - TM Process', url: '/resources/trademark-application-process/' },
  { name: 'Legal - Privacy Policy', url: '/privacy-policy/' },
  { name: 'Legal - Terms', url: '/terms-and-conditions/' },
  { name: 'Legal - Refund', url: '/refund-cancellation-policy/' },
  { name: 'Legal - Disclaimer', url: '/disclaimer/' }
];

// Start static server on dist
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join('dist', reqPath === '/' ? 'index.html' : reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    const mime = ext === '.html' ? 'text/html' : ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : ext === '.jpg' ? 'image/jpeg' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 4549;

server.listen(PORT, async () => {
  console.log(`Static server running on http://localhost:${PORT}`);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  console.log('========================================================================');
  console.log('COMPREHENSIVE AUDIT: 3-ITEM HERO BENEFIT STRIP ACROSS ALL 31 PAGES');
  console.log('========================================================================\n');

  let totalTests = 0;
  let passedTests = 0;
  let failures = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n================== VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) ==================`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    for (const p of PAGES) {
      totalTests++;
      const targetUrl = `http://localhost:${PORT}${p.url}`;
      await page.goto(targetUrl, { waitUntil: 'networkidle' });

      const audit = await page.evaluate(() => {
        const row = document.querySelector('.hero .trust-row, .page-hero .trust-row, .shared-page-hero .trust-row');
        if (!row) return { error: 'No .trust-row found in hero' };

        const rowRect = row.getBoundingClientRect();
        const docW = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;
        const hasOverflow = scrollW > docW + 1;

        const items = Array.from(row.querySelectorAll('.trust-item')).map((item, idx) => {
          const itemRect = item.getBoundingClientRect();
          const itemStyle = window.getComputedStyle(item);
          const icon = item.querySelector('.trust-icon');
          const iconRect = icon ? icon.getBoundingClientRect() : null;
          const iconStyle = icon ? window.getComputedStyle(icon) : null;
          const label = item.querySelector('.trust-label') || item.querySelector('span:not(.trust-icon)');
          const labelStyle = label ? window.getComputedStyle(label) : null;

          return {
            index: idx,
            text: item.innerText.replace(/\s+/g, ' ').trim(),
            rect: {
              top: Math.round(itemRect.top),
              left: Math.round(itemRect.left),
              width: Math.round(itemRect.width),
              height: Math.round(itemRect.height)
            },
            borderRight: itemStyle.borderRight,
            borderLeft: itemStyle.borderLeft,
            gridColumn: itemStyle.gridColumn,
            justifySelf: itemStyle.justifySelf,
            icon: {
              width: iconRect ? Math.round(iconRect.width) : null,
              height: iconRect ? Math.round(iconRect.height) : null,
              bg: iconStyle ? iconStyle.backgroundColor : null,
              borderRadius: iconStyle ? iconStyle.borderRadius : null,
              color: iconStyle ? iconStyle.color : null
            },
            label: {
              fontSize: labelStyle ? labelStyle.fontSize : null,
              fontWeight: labelStyle ? labelStyle.fontWeight : null
            }
          };
        });

        return {
          hasOverflow,
          docW,
          scrollW,
          itemsCount: items.length,
          items
        };
      });

      if (audit.error) {
        failures.push(`${vp.name} - ${p.name}: ${audit.error}`);
        console.log(`  ❌ [MISSING] ${p.name.padEnd(28)}: ${audit.error}`);
        continue;
      }

      let testPass = true;
      let reason = [];

      // Check item count
      if (audit.itemsCount !== 3) {
        testPass = false;
        reason.push(`Expected 3 items, found ${audit.itemsCount}`);
      }

      // Check overflow
      if (audit.hasOverflow) {
        testPass = false;
        reason.push(`Horizontal overflow (${audit.scrollW} > ${audit.docW})`);
      }

      // Desktop specific assertions (1440, 1280, 1024)
      if (vp.isDesktop) {
        // Assert single horizontal row
        const tops = audit.items.map(i => i.rect.top);
        const maxDiff = Math.max(...tops) - Math.min(...tops);
        if (maxDiff > 3) {
          testPass = false;
          reason.push(`Desktop items not in single row (top diff = ${maxDiff}px)`);
        }

        // Assert 32x32 icon boxes
        for (const item of audit.items) {
          if (item.icon.width !== 32 || item.icon.height !== 32) {
            testPass = false;
            reason.push(`Item ${item.index} icon is ${item.icon.width}x${item.icon.height} (expected 32x32)`);
          }
          if (item.label.fontSize !== '13px') {
            testPass = false;
            reason.push(`Item ${item.index} font-size is ${item.label.fontSize} (expected 13px)`);
          }
          if (item.label.fontWeight !== '600') {
            testPass = false;
            reason.push(`Item ${item.index} font-weight is ${item.label.fontWeight} (expected 600)`);
          }
        }

        // Assert dividers
        if (!audit.items[0].borderRight.includes('1px solid') || !audit.items[1].borderRight.includes('1px solid')) {
          testPass = false;
          reason.push('Missing dividers between desktop items');
        }
        if (audit.items[2].borderRight.includes('1px solid')) {
          testPass = false;
          reason.push('Unexpected divider after item 3');
        }
      }

      // Mobile specific assertions (< 768px: 430, 390, 360)
      if (vp.isMobile) {
        // Item 1 and Item 2 on top row
        const diffRow1 = Math.abs(audit.items[0].rect.top - audit.items[1].rect.top);
        if (diffRow1 > 4) {
          testPass = false;
          reason.push(`Mobile row 1 items not aligned (diff = ${diffRow1}px)`);
        }

        // Item 3 below row 1
        if (audit.items[2].rect.top <= audit.items[0].rect.top + 10) {
          testPass = false;
          reason.push('Mobile item 3 is not on second row below item 1 & 2');
        }

        // Item 3 centered
        if (!audit.items[2].gridColumn.includes('1 / -1') && !audit.items[2].gridColumn.includes('span 2')) {
          testPass = false;
          reason.push(`Mobile item 3 grid-column is '${audit.items[2].gridColumn}', expected '1 / -1'`);
        }

        // Icon box ~28x28
        for (const item of audit.items) {
          if (item.icon.width !== 28 || item.icon.height !== 28) {
            testPass = false;
            reason.push(`Mobile icon is ${item.icon.width}x${item.icon.height} (expected 28x28)`);
          }
        }
      }

      if (testPass) {
        passedTests++;
        if (vp.name === 'Desktop_1440' || vp.name === 'Mobile_390') {
          console.log(`  ✅ [PASS] ${p.name.padEnd(28)}: "${audit.items.map(i => i.text).join(' | ')}"`);
        }
      } else {
        failures.push(`${vp.name} - ${p.name}: ${reason.join('; ')}`);
        console.log(`  ❌ [FAIL] ${p.name.padEnd(28)}: ${reason.join('; ')}`);
      }
    }

    // Capture visual snapshots for key pages at Desktop and Mobile
    if (vp.name === 'Desktop_1440' || vp.name === 'Mobile_390') {
      const samplePages = ['Home', 'About', 'Trademark Registration', 'Services', 'Packages', 'Contact', 'FAQs', 'Legal - Privacy Policy'];
      for (const sp of PAGES.filter(x => samplePages.includes(x.name))) {
        await page.goto(`http://localhost:${PORT}${sp.url}`, { waitUntil: 'networkidle' });
        const heroEl = await page.$('.hero, .page-hero');
        if (heroEl) {
          const filename = `${sp.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${vp.name.toLowerCase()}.png`;
          await heroEl.screenshot({ path: path.join(SCREENSHOT_DIR, filename) });
        }
      }
    }

    await page.close();
  }

  await browser.close();
  server.close();

  console.log('\n========================================================================');
  console.log(`AUDIT RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round(passedTests / totalTests * 100)}%)`);
  if (failures.length === 0) {
    console.log('🎉 100% STANDARDIZED: ALL 31 HERO PAGES PERFECT ACROSS ALL 8 BREAKPOINTS!');
  } else {
    console.log(`⚠️ ${failures.length} ASSERTION FAILURES:`);
    failures.slice(0, 15).forEach(f => console.log('   -', f));
  }
  console.log('========================================================================');
});
