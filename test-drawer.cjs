const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.error('*** PAGE ERROR STACK ***');
    console.error(error.stack || error.message);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('Page loaded.');
    await new Promise(r => setTimeout(r, 1000));

    // Click the drawer button
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(el => el.title?.includes('Chronicle') || el.textContent.includes('Chronicle') || el.textContent.includes('Consultation'));
      if (b) {
        b.click();
        return b.textContent || b.title;
      }
      return null;
    });

    console.log('Clicked:', clicked);
    await new Promise(r => setTimeout(r, 2000));

    // Also check if drawer appeared
    const hasDrawer = await page.evaluate(() => {
      return !!document.querySelector('.consultation-chronicles-drawer');
    });
    console.log('Has drawer in DOM:', hasDrawer);

  } catch (e) {
    console.error('Puppeteer exception:', e);
  }

  await browser.close();
  console.log('Test drawer finished.');
})();
