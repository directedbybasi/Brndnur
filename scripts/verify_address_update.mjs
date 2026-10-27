import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4321';

async function main() {
  const browser = await chromium.launch();
  
  // 1. Desktop Check
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  console.log('--- 1. Testing Contact Page Desktop (1440px) ---');
  await page.goto(`${BASE_URL}/contact/`, { waitUntil: 'domcontentloaded' });
  
  const contactData = await page.evaluate(() => {
    const card = document.querySelector('.bn-business-card');
    const addressEl = document.querySelector('.bn-card-address');
    const officeDesc = document.querySelector('.office-details');
    return {
      cardPresent: card !== null,
      cardAddress: addressEl ? addressEl.textContent.trim() : null,
      officeDetailsText: officeDesc ? officeDesc.textContent : ''
    };
  });
  console.log('Contact Page Desktop:', contactData);

  // Take screenshot of contact office card
  const officeCard = await page.$('.office-card');
  if (officeCard) {
    await officeCard.screenshot({ path: 'scratch/contact_business_card_desktop.png' });
    console.log('Screenshot saved: scratch/contact_business_card_desktop.png');
  }

  // 2. Footer Check Desktop
  console.log('\n--- 2. Testing Footer Address on Homepage ---');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  const footerAddress = await page.evaluate(() => {
    const contactLine = document.querySelector('.bn-footer a.bn-contact-line');
    return {
      href: contactLine ? contactLine.getAttribute('href') : null,
      text: contactLine ? contactLine.textContent.replace(/\s+/g, ' ').trim() : null
    };
  });
  console.log('Footer Address Homepage:', footerAddress);

  // 3. Mobile Check (390px)
  console.log('\n--- 3. Testing Contact Page Mobile (390px) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/contact/`, { waitUntil: 'domcontentloaded' });
  
  const mobileCard = await page.evaluate(() => {
    const card = document.querySelector('.bn-business-card');
    const rect = card ? card.getBoundingClientRect() : null;
    const bodyW = document.body.clientWidth;
    return {
      cardWidth: rect ? rect.width : 0,
      bodyWidth: bodyW,
      isWithinBounds: rect ? (rect.width <= bodyW) : false
    };
  });
  console.log('Contact Page Mobile:', mobileCard);

  const mobOfficeCard = await page.$('.office-card');
  if (mobOfficeCard) {
    await mobOfficeCard.screenshot({ path: 'scratch/contact_business_card_mobile.png' });
    console.log('Screenshot saved: scratch/contact_business_card_mobile.png');
  }

  // 4. Intro Animation Address Check
  console.log('\n--- 4. Testing Intro Animation Address ---');
  const freshContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const freshPage = await freshContext.newPage();
  await freshPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  
  const introAddress = await freshPage.evaluate(() => {
    const addr = document.querySelector('.bn-intro-address');
    return {
      present: addr !== null,
      text: addr ? addr.textContent.trim() : null
    };
  });
  console.log('Intro Animation Address:', introAddress);

  await freshContext.close();
  await context.close();
  await browser.close();
  console.log('\nAll address verification checks completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
