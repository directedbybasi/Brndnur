import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function optimizeLogos() {
  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  
  // 1. brndnur-logo-transparent.webp
  console.log('Optimizing brndnur-logo-transparent.webp...');
  const transparentSrc = path.join(assetsDir, 'brndnur-logo-transparent.png');
  const transparentWebpDest = path.join(assetsDir, 'brndnur-logo-transparent.webp');
  
  const webpBuf = await sharp(transparentSrc)
    .resize(1085, null, { withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toBuffer();
  fs.writeFileSync(transparentWebpDest, webpBuf);
  console.log('New brndnur-logo-transparent.webp size:', (webpBuf.length / 1024).toFixed(1) + ' KB');

  // 2. brndnur-logo-transparent.png fallback
  console.log('Optimizing brndnur-logo-transparent.png fallback...');
  const pngBuf = await sharp(transparentSrc)
    .resize(1085, null, { withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 95 })
    .toBuffer();
  fs.writeFileSync(transparentSrc, pngBuf);
  console.log('New brndnur-logo-transparent.png size:', (pngBuf.length / 1024).toFixed(1) + ' KB');

  // 3. brndnur-logo-background.png fallback
  console.log('Optimizing brndnur-logo-background.png fallback...');
  const bgSrc = path.join(assetsDir, 'brndnur-logo-background.png');
  const bgPngBuf = await sharp(bgSrc)
    .resize(1085, null, { withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 90 })
    .toBuffer();
  fs.writeFileSync(bgSrc, bgPngBuf);
  console.log('New brndnur-logo-background.png size:', (bgPngBuf.length / 1024).toFixed(1) + ' KB');

  console.log('Logo optimization complete!');
}

optimizeLogos().catch(console.error);
