const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Maximum') || msg.text().includes('Error')) {
      console.log('PAGE LOG ERROR:', msg.text());
    }
  });
  page.on('pageerror', error => console.log('PAGE ERROR STACK:', error.stack || error.message));

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log('Page loaded successfully');

    // Test opening Consultation Chronicles drawer
    const drawerButtons = await page.$$('button');
    for (const btn of drawerButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Chronicle') || text.includes('History') || text.includes('Past Inquiries'))) {
        console.log('Clicking drawer button:', text.trim());
        await btn.click().catch(() => {});
        await new Promise(r => setTimeout(r, 1000));
        break;
      }
    }

    // Try testing all navigation tabs
    const navButtons = await page.$$('nav button, header button, [role="tab"]');
    for (let i = 0; i < navButtons.length; i++) {
      const btn = navButtons[i];
      const text = await page.evaluate(el => el.textContent, btn);
      if (text) {
        console.log('Clicking tab/nav:', text.trim());
        await btn.click().catch(() => {});
        await new Promise(r => setTimeout(r, 500));
      }
    }

    // Wait a little to see if any asynchronous error triggers
    await new Promise(r => setTimeout(r, 2000));
  } catch(e) {
    console.log('Script exception:', e.message);
  }
  
  await browser.close();
  console.log('Test completed.');
})();
