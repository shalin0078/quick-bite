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
    // 6. Order Tracking Page - Full View
    console.log('Visiting Order Tracking with taller viewport...');
    await page.goto('http://127.0.0.1:5173/order-tracking', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-6-order-tracking.png'), fullPage: false });
    console.log('Saved updated screen-6-order-tracking.png');

    // Also click "View Past Orders" to capture the past orders modal
    const viewOrdersBtn = await page.$('button:has-text("View Past Orders")');
    if (viewOrdersBtn) {
      await viewOrdersBtn.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-6-past-orders-modal.png'), fullPage: false });
      console.log('Saved screen-6-past-orders-modal.png');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

runTests();
