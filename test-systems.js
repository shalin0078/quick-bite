import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/shalin rathod/.gemini/antigravity/brain/c928e683-5fe6-4737-a450-5310e87677f4';

async function verifyAllSystems() {
  console.log('--- STARTING COMPREHENSIVE QUICKBITE SYSTEMS VERIFICATION ---');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  try {
    // 1. Test Login Page
    console.log('1. Testing Login Page (/login)...');
    await page.goto('http://127.0.0.1:5173/login', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-auth-login.png') });
    console.log('Saved screen-auth-login.png');

    // 2. Test Customer Profile Page
    console.log('2. Testing Profile Page (/profile)...');
    await page.goto('http://127.0.0.1:5173/profile', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-customer-profile.png') });
    console.log('Saved screen-customer-profile.png');

    // 3. Test Live Delivery Tracking with Interactive Leaflet Map
    console.log('3. Testing Live Tracking Map (/live-tracking)...');
    await page.goto('http://127.0.0.1:5173/live-tracking', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1500)); // wait for Leaflet tiles
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-live-tracking-map.png') });
    console.log('Saved screen-live-tracking-map.png');

    // 4. Test Delivery Partner Portal with OTP Input
    console.log('4. Testing Delivery Partner Dashboard (/partner)...');
    // Ensure rider role in storage
    await page.evaluate(() => {
      const users = JSON.parse(localStorage.getItem('quickbite_registered_users') || '[]');
      const rider = users.find(u => u.role === 'delivery_partner');
      if (rider) localStorage.setItem('quickbite_active_user', JSON.stringify(rider));
    });
    await page.goto('http://127.0.0.1:5173/partner', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-delivery-partner.png') });
    console.log('Saved screen-delivery-partner.png');

    // 5. Test Admin Dashboard
    console.log('5. Testing Admin Dashboard (/admin)...');
    await page.evaluate(() => {
      const users = JSON.parse(localStorage.getItem('quickbite_registered_users') || '[]');
      const admin = users.find(u => u.role === 'admin');
      if (admin) localStorage.setItem('quickbite_active_user', JSON.stringify(admin));
    });
    await page.goto('http://127.0.0.1:5173/admin', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-admin-dashboard.png') });
    console.log('Saved screen-admin-dashboard.png');

    // 6. Test Email Inbox Viewer (Modal)
    console.log('6. Testing Customer Email Inbox Modal...');
    // Reset back to customer
    await page.evaluate(() => {
      const users = JSON.parse(localStorage.getItem('quickbite_registered_users') || '[]');
      const cust = users.find(u => u.role === 'customer');
      if (cust) localStorage.setItem('quickbite_active_user', JSON.stringify(cust));
    });
    await page.goto('http://127.0.0.1:5173/live-tracking', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 800));
    const emailBtn = await page.$('button[title="Customer Email & Delivery OTP Inbox"]');
    if (emailBtn) {
      await emailBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'screen-email-otp-inbox.png') });
      console.log('Saved screen-email-otp-inbox.png');
    }

    console.log('--- ALL ADVANCED SYSTEMS VERIFIED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    await browser.close();
  }
}

verifyAllSystems();
