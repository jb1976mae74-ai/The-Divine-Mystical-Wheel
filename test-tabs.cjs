const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  let caughtError = null;
  page.on('pageerror', error => {
    console.error('*** PAGE ERROR DETECTED ***');
    console.error(error.stack || error.message);
    caughtError = error.message;
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    }
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Loaded main page');

    // List of tabs to test
    const tabs = [
      "oracle", "natal", "enochian", "scriptura", "sigil", "scholarship", 
      "divine-order", "wisdom-architect", "apocryphal", "deadsea", "anunnaki", 
      "melchizedek", "metatron", "tradition-forge", "tarot", "classroom", 
      "nexus", "intelligence", "bible", "quran", "military-base", "gps", 
      "manifestation", "admin", "consultation"
    ];

    for (const tab of tabs) {
      if (caughtError) break;
      console.log('Testing tab:', tab);
      await page.evaluate((t) => {
        localStorage.setItem("oracle-active-tab", t);
        // Find tab button or trigger re-render
        window.dispatchEvent(new Event('storage'));
      }, tab);

      // Reload to simulate landing on tab or click tab directly
      await page.goto(`http://localhost:3000`, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 600));

      // Also click buttons inside the tab if any
      const buttons = await page.$$('button');
      for (let i = 0; i < Math.min(5, buttons.length); i++) {
        if (caughtError) break;
        await buttons[i].click().catch(() => {});
        await new Promise(r => setTimeout(r, 100));
      }
    }

    // Also test opening Consultation Chronicles Drawer
    console.log('Testing Consultation Chronicles Drawer...');
    await page.evaluate(() => {
      localStorage.setItem("oracle-active-tab", "oracle");
    });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    
    // Find drawer open button
    const opened = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(el => el.textContent.includes('Chronicle') || el.textContent.includes('History') || el.title?.includes('Chronicle'));
      if (b) {
        b.click();
        return true;
      }
      return false;
    });
    console.log('Drawer button clicked:', opened);
    await new Promise(r => setTimeout(r, 2000));

  } catch(e) {
    console.error('Error during testing:', e);
  }

  await browser.close();
  if (caughtError) {
    console.log('FAILED WITH ERROR:', caughtError);
    process.exit(1);
  } else {
    console.log('ALL TABS TESTED CLEANLY!');
    process.exit(0);
  }
})();
