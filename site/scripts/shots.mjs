// Critique screenshots: node scripts/shots.mjs <outDir> [pass-name]
// Uses the locally installed Edge via playwright-core; dev server must be running on :5222.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const out = process.argv[2] || 'shots';
const tag = process.argv[3] || 'p1';
mkdirSync(out, { recursive: true });
const BASE = 'http://localhost:5222';
const WIDTHS = [1440, 1024, 390];

const browser = await chromium.launch({ channel: 'msedge' });
const errors = [];

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, deviceScaleFactor: 1, isMobile: w === 390, hasTouch: w === 390 });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && errors.push(`${w} ${page.url()} ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`${w} ${page.url()} ${e.message}`));
  const vh = w === 390 ? 844 : 900;

  // Home: signature moment frames, then full page
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${out}/${tag}-home-${w}-a.jpg`, quality: 70 });
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(vh * 0.55));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${out}/${tag}-home-${w}-b.jpg`, quality: 70 });
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(vh * 1.4));
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/${tag}-home-${w}-c.jpg`, quality: 70 });
  await scrollThrough(page);
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(vh * 1.5));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${tag}-home-${w}-full.jpg`, quality: 60, fullPage: true });

  // Catalog
  await page.goto(`${BASE}/catalog.html?cat=men`, { waitUntil: 'networkidle' });
  await scrollThrough(page);
  await page.screenshot({ path: `${out}/${tag}-plp-${w}-full.jpg`, quality: 60, fullPage: true });
  await page.click('[data-open-filters]');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/${tag}-plp-${w}-filters.jpg`, quality: 70 });

  // Product + cart drawer
  await page.goto(`${BASE}/product.html?p=zip-hoodie-kvartal&c=tobacco`, { waitUntil: 'networkidle' });
  await scrollThrough(page);
  await page.screenshot({ path: `${out}/${tag}-pdp-${w}-a.jpg`, quality: 70 });
  await page.screenshot({ path: `${out}/${tag}-pdp-${w}-full.jpg`, quality: 60, fullPage: true });
  await page.click('.size:nth-child(4)');
  await page.click('.info__add');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${out}/${tag}-cart-${w}.jpg`, quality: 70 });
  await page.evaluate(() => localStorage.clear());
  await ctx.close();
}

await browser.close();
console.log(errors.length ? errors.join('\n') : 'no console errors');
