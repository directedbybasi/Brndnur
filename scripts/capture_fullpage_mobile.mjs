import { chromium } from 'playwright';

const urls = [
  '/',
  '/trademark-registration/',
  '/services/',
  '/packages/',
  '/about/',
  '/wordmark-registration/',
  '/how-it-works/',
  '/faqs/',
  '/gst-registration/',
  '/packages/individual-msme/',
  '/resources/',
  '/contact/'
];

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => sessionStorage.setItem('brndnur_intro_played', 'true'));
  const page = await context.newPage();

  for (const url of urls) {
    await page.goto(`http://localhost:4321${url}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const ov = document.getElementById('bn-intro-overlay');
      if (ov) ov.remove();
      document.body.classList.remove('bn-intro-active');
      document.documentElement.classList.remove('bn-show-intro');
    });
    const slug = url === '/' ? 'home' : url.replace(/\//g, '_').replace(/^_|_$/g, '');
    await page.screenshot({ path: `scratch/fullpage_${slug}_390.png`, fullPage: true });
    console.log(`Captured fullpage for ${url}`);
  }

  await browser.close();
}

capture().catch(console.error);
