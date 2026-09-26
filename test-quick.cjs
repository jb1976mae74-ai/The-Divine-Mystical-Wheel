const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('PAGE LOG [' + msg.type() + ']:', msg.text());
  });
  page.on('pageerror', error => console.log('PAGE ERROR STACK:', error.stack || error.message));

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('DOM Content Loaded!');

    // Wait 3 seconds for initial renders and effects
    await new Promise(r => setTimeout(r, 3000));
    console.log('Initial wait complete.');

    // Look for tabs and click each
    const tabSelectors = [
      'button',
      '[role="tab"]'
    ];
    
    // Evaluate in page context
    const errors = await page.evaluate(async () => {
      const errs = [];
      window.addEventListener('error', e => errs.push(e.message));
      return errs;
    });

    console.log('Collected errors so far:', errors);
  } catch(e) {
    console.log('Script exception:', e.message);
  }
  
  await browser.close();
  console.log('Done.');
})();
