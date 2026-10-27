import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('tests/screenshots/benefit-strip');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 390, height: 844 }
];

const PAGES = [
  { name: 'Home', slug: 'home', url: 'http://localhost:4545/' },
  { name: 'Trademark Registration', slug: 'trademark-registration', url: 'http://localhost:4545/trademark-registration/' },
  { name: 'Services', slug: 'services', url: 'http://localhost:4545/services/' },
  { name: 'Packages', slug: 'packages', url: 'http://localhost:4545/packages/' }
];

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  console.log('================================================================');
  console.log('AUDITING HERO BENEFIT STRIP STANDARDIZATION ACROSS PAGES');
  console.log('================================================================');

  let allPassed = true;

  for (const vp of VIEWPORTS) {
    console.log(`\n----------------- VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) -----------------`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const p of PAGES) {
      await page.goto(p.url, { waitUntil: 'networkidle' });
      
      const audit = await page.evaluate(() => {
        const row = document.querySelector('.hero .trust-row, .page-hero .trust-row');
        if (!row) return { error: 'No .trust-row found' };

        const rowRect = row.getBoundingClientRect();
        const rowStyle = window.getComputedStyle(row);
        const bodyWidth = document.body.clientWidth;
        const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

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
            rect: { top: Math.round(itemRect.top), left: Math.round(itemRect.left), width: Math.round(itemRect.width), height: Math.round(itemRect.height) },
            borderRight: itemStyle.borderRight,
            icon: {
              width: iconRect ? Math.round(iconRect.width) : null,
              height: iconRect ? Math.round(iconRect.height) : null,
              bg: iconStyle ? iconStyle.backgroundColor : null,
              borderRadius: iconStyle ? iconStyle.borderRadius : null,
              color: iconStyle ? iconStyle.color : null
            },
            label: {
              fontSize: labelStyle ? labelStyle.fontSize : null,
              fontWeight: labelStyle ? labelStyle.fontWeight : null,
              color: labelStyle ? labelStyle.color : null,
              lineHeight: labelStyle ? labelStyle.lineHeight : null
            }
          };
        });

        return {
          rowRect: { top: Math.round(rowRect.top), left: Math.round(rowRect.left), width: Math.round(rowRect.width), height: Math.round(rowRect.height) },
          hasHorizontalOverflow,
          itemsCount: items.length,
          items
        };
      });

      if (audit.error) {
        console.error(`❌ [FAIL] ${p.name}: ${audit.error}`);
        allPassed = false;
        continue;
      }

      // Verification assertions
      let pagePass = true;
      if (audit.itemsCount !== 3) {
        console.error(`❌ [FAIL] ${p.name}: Expected 3 benefit items, found ${audit.itemsCount}`);
        pagePass = false;
      }
      if (audit.hasHorizontalOverflow) {
        console.error(`❌ [FAIL] ${p.name}: Page has horizontal overflow!`);
        pagePass = false;
      }

      if (vp.name === 'Desktop') {
        // Assert single horizontal row
        const tops = audit.items.map(i => i.rect.top);
        const allSameTop = tops.every(t => Math.abs(t - tops[0]) <= 2);
        if (!allSameTop) {
          console.error(`❌ [FAIL] ${p.name}: Desktop items not on single line! Tops: ${tops.join(', ')}`);
          pagePass = false;
        }

        // Assert 32x32 icon boxes
        for (const item of audit.items) {
          if (item.icon.width !== 32 || item.icon.height !== 32) {
            console.error(`❌ [FAIL] ${p.name}: Item ${item.index} icon box is ${item.icon.width}x${item.icon.height}, expected 32x32`);
            pagePass = false;
          }
          if (item.label.fontSize !== '13px') {
            console.error(`❌ [FAIL] ${p.name}: Item ${item.index} font size is ${item.label.fontSize}, expected 13px`);
            pagePass = false;
          }
          if (item.label.fontWeight !== '600') {
            console.error(`❌ [FAIL] ${p.name}: Item ${item.index} font weight is ${item.label.fontWeight}, expected 600`);
            pagePass = false;
          }
        }

        // Assert dividers
        if (!audit.items[0].borderRight.includes('1px solid') || !audit.items[1].borderRight.includes('1px solid')) {
          console.error(`❌ [FAIL] ${p.name}: Dividers missing between items`);
          pagePass = false;
        }
        if (audit.items[2].borderRight.includes('1px solid')) {
          console.error(`❌ [FAIL] ${p.name}: Last item has unnecessary trailing divider`);
          pagePass = false;
        }
      }

      if (pagePass) {
        console.log(`✅ [PASS] ${p.name.padEnd(26)}: ${audit.items.map(i => i.text).join(' | ')}`);
      } else {
        allPassed = false;
      }

      // Screenshot the hero area and benefit strip
      const heroEl = await page.$('.hero, .page-hero');
      if (heroEl) {
        await page.evaluate(() => {
          const tb = document.querySelector('astro-dev-toolbar');
          if (tb) tb.style.display = 'none';
        });
        const screenshotPath = path.join(SCREENSHOT_DIR, `${p.slug}-${vp.name.toLowerCase()}.png`);
        await heroEl.screenshot({ path: screenshotPath });
      }
    }
    await context.close();
  }

  await browser.close();
  console.log('\n================================================================');
  if (allPassed) {
    console.log('🎉 ALL BENEFIT STRIP STANDARDIZATION CHECKS PASSED!');
  } else {
    console.log('⚠️ SOME BENEFIT STRIP CHECKS FAILED');
  }
  console.log('================================================================');
}

run().catch(console.error);
