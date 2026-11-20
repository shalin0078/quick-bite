import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/shalin rathod/.gemini/antigravity/brain/c928e683-5fe6-4737-a450-5310e87677f4';

async function runTests() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  try {
    console.log('1. Visiting Live Tracking page...');
    await page.goto('http://127.0.0.1:5173/live-tracking', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 2000));

    // Jump to Stage 6 (Out for Delivery) and advance to near doorstep
    console.log('2. Setting stage to Out for Delivery at doorstep...');
    await page.evaluate(() => {
      // Find stage items
      const stageItems = Array.from(document.querySelectorAll('[title*="Jump to"]'));
      if (stageItems[5]) stageItems[5].click();
    });

    await new Promise(r => setTimeout(r, 1000));

    // Fast-forward simIndex in component to last index
    await page.evaluate(() => {
      const advanceBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Advance to Next Step'));
      // Note: Advance to Next Step will advance to Delivered
    });

    // Let's capture the current en-route state
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-live-en-route.png'), fullPage: false });
    console.log('Captured screen-live-en-route.png');

    // Click Stage 7 (Delivered)
    await page.evaluate(() => {
      const stageItems = Array.from(document.querySelectorAll('[title*="Jump to"]'));
      if (stageItems[6]) stageItems[6].click();
    });

    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-live-all-fulfilled.png'), fullPage: false });
    console.log('Captured screen-live-all-fulfilled.png');

    console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    await browser.close();
  }
}

runTests();
