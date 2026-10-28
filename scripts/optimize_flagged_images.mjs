import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function optimizeImages() {
  console.log('Optimizing flagged assets in public/assets/...\n');

  // 1. WhatsApp Icon
  const waSrc = 'public/assets/whatsapp-icon.png';
  if (fs.existsSync(waSrc)) {
    const origWa = fs.statSync(waSrc).size;
    // Overwrite PNG with optimized 120x120 PNG
    await sharp(waSrc)
      .resize(120, 120)
      .png({ compressionLevel: 9 })
      .toFile('public/assets/whatsapp-icon-temp.png');
    fs.renameSync('public/assets/whatsapp-icon-temp.png', waSrc);
    
    // Also create 120x120 WebP
    await sharp(waSrc)
      .resize(120, 120)
      .webp({ quality: 90 })
      .toFile('public/assets/whatsapp-icon.webp');
      
    const newWaPng = fs.statSync(waSrc).size;
    const newWaWebp = fs.statSync('public/assets/whatsapp-icon.webp').size;
    console.log(`whatsapp-icon.png: ${(origWa/1024).toFixed(1)} KB -> ${(newWaPng/1024).toFixed(1)} KB (WebP: ${(newWaWebp/1024).toFixed(1)} KB)`);
  }

  // 2. Card Images: 800px wide crisp 2x webp
  const cardImages = [
    'about-card-trademark.webp',
    'wordmark-foundation-exclusivity.webp',
    'renewal-ownership-maintenance.webp',
    'home-card-search.webp'
  ];

  for (const imgName of cardImages) {
    const imgPath = path.join('public/assets', imgName);
    if (fs.existsSync(imgPath)) {
      const origBuf = fs.readFileSync(imgPath);
      const origSize = origBuf.length;
      
      const newBuf = await sharp(origBuf)
        .resize(800, null, { withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toBuffer();
        
      fs.writeFileSync(imgPath, newBuf);
      console.log(`${imgName}: ${(origSize/1024).toFixed(1)} KB -> ${(newBuf.length/1024).toFixed(1)} KB (saved ${((origSize - newBuf.length)/1024).toFixed(1)} KB)`);
    }
  }

  console.log('\nImage optimization complete.');
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
