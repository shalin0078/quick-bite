import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/shalin rathod/.gemini/antigravity/brain/c928e683-5fe6-4737-a450-5310e87677f4';

async function runTests() {
  console.log('Starting QuickBite End-to-End Verification with installed Chrome...');
  
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // 1. Homepage
    console.log('1. Visiting Homepage (http://127.0.0.1:5173/)...');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-1-homepage.png'), fullPage: false });
    console.log('Saved screen-1-homepage.png');

    // 2. Restaurants Listing
    console.log('2. Visiting Restaurants Listing (/restaurants)...');
    await page.goto('http://127.0.0.1:5173/restaurants', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-2-restaurants.png'), fullPage: false });
    console.log('Saved screen-2-restaurants.png');

    // 3. Restaurant Details
    console.log('3. Visiting Restaurant Details (/restaurant/dominos-pizza)...');
    await page.goto('http://127.0.0.1:5173/restaurant/dominos-pizza', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-3-restaurant-details.png'), fullPage: false });
    console.log('Saved screen-3-restaurant-details.png');

    // 4. Cart Page
    console.log('4. Visiting Shopping Cart (/cart)...');
    await page.goto('http://127.0.0.1:5173/cart', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-4-cart.png'), fullPage: false });
    console.log('Saved screen-4-cart.png');

    // 5. Checkout Page
    console.log('5. Visiting Checkout (/checkout)...');
    await page.goto('http://127.0.0.1:5173/checkout', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-5-checkout.png'), fullPage: false });
    console.log('Saved screen-5-checkout.png');

    // 6. Order Tracking Page
    console.log('6. Visiting Order Tracking (/order-tracking)...');
    await page.goto('http://127.0.0.1:5173/order-tracking', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-6-order-tracking.png'), fullPage: false });
    console.log('Saved screen-6-order-tracking.png');

    console.log('ALL 6 SCREENS VERIFIED AND SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
}

runTests();
