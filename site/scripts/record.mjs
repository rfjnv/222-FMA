// Scripted walkthrough video of the storefront for pitching.
// node scripts/record.mjs <desktop|mobile> <framesDir> [baseUrl]
// Captures CDP screencast frames (JPEG q90) with timestamps; encode with ffmpeg afterwards.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';

const mode = process.argv[2] || 'desktop';
const dir = process.argv[3] || 'frames';
const BASE = process.argv[4] || 'https://rfjnv.github.io/222-FMA/';
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

const desktop = mode === 'desktop';
// Output 1920×1080 (desktop) or 1080×1920 (mobile)
const viewport = desktop ? { width: 1440, height: 810 } : { width: 390, height: 693 };
const dsf = desktop ? 1920 / 1440 : 1080 / 390;

// Headless screencast ignores the context DSF; force it at browser level to get full-res frames.
const browser = await chromium.launch({ channel: 'msedge', args: [`--force-device-scale-factor=${dsf}`] });
const ctx = await browser.newContext({ viewport, deviceScaleFactor: dsf, isMobile: !desktop, hasTouch: !desktop, locale: 'ru-RU' });

// Visible cursor for desktop (headless has none); a soft tap ring on mobile.
await ctx.addInitScript((desktop) => {
  addEventListener('DOMContentLoaded', () => {
    const c = document.createElement('div');
    c.id = '__cursor';
    Object.assign(c.style, {
      position: 'fixed', left: '0', top: '0', width: desktop ? '14px' : '34px', height: desktop ? '14px' : '34px',
      margin: desktop ? '-7px 0 0 -7px' : '-17px 0 0 -17px', borderRadius: '50%', zIndex: 99999, pointerEvents: 'none',
      background: desktop ? 'rgba(29,32,43,.85)' : 'rgba(29,32,43,.18)', border: desktop ? '2px solid #f2f0ea' : '1px solid rgba(29,32,43,.4)',
      transition: 'transform .18s ease-out, opacity .3s', opacity: desktop ? '1' : '0', transform: 'translate(-100px,-100px)',
    });
    document.body.append(c);
    const move = (x, y) => (c.style.transform = `translate(${x}px, ${y}px)`);
    addEventListener('mousemove', (e) => move(e.clientX, e.clientY), true);
    addEventListener('mousedown', () => { c.style.opacity = '1'; c.style.scale = '0.75'; }, true);
    addEventListener('mouseup', () => { c.style.scale = '1'; if (!desktop) setTimeout(() => (c.style.opacity = '0'), 250); }, true);
    try { localStorage.removeItem('fma.cart'); } catch {}
  });
}, desktop);

const page = await ctx.newPage();

// Warm the cache so the recording has no loading gaps.
for (const p of ['', 'catalog.html?cat=men', 'product.html?p=zip-hoodie-kvartal', 'product.html?p=merino-zip-cardigan']) {
  await page.goto(BASE + p, { waitUntil: 'networkidle' });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(30); }
}
await page.evaluate(() => localStorage.clear());

const cdp = await ctx.newCDPSession(page);
const frames = [];
cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
  const n = frames.length;
  writeFileSync(`${dir}/f${String(n).padStart(5, '0')}.jpg`, Buffer.from(data, 'base64'));
  frames.push(metadata.timestamp);
  await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
});

const W = viewport.width, H = viewport.height;
let mx = W / 2, my = H / 2;
const wait = (ms) => page.waitForTimeout(ms);
async function moveTo(x, y, steps = 28) { await page.mouse.move(x, y, { steps }); mx = x; my = y; }
async function moveToEl(sel, steps = 28) {
  const box = await page.locator(sel).first().boundingBox();
  await moveTo(box.x + box.width / 2, box.y + box.height / 2, steps);
}
async function click(sel) {
  if (desktop) { await moveToEl(sel); await wait(250); }
  else { const b = await page.locator(sel).first().boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); }
  await page.locator(sel).first().click();
}
async function scrollBy(total, ms) {
  const step = 60, n = Math.max(1, Math.round(ms / step));
  for (let i = 0; i < n; i++) { await page.mouse.wheel(0, total / n); await wait(step); }
}
async function start() {
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: Math.round(W * dsf), maxHeight: Math.round(H * dsf), everyNthFrame: 1 });
}

if (desktop) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await moveTo(W * 0.7, H * 0.6, 1);
  await start();
  await wait(2600);                       // triptych entrance
  await scrollBy(1100, 3600);             // centre frame opens, title rises
  await wait(1800);
  await scrollBy(1500, 3200);             // editorial spread
  await wait(900);
  await scrollBy(900, 1800);              // new in
  await moveToEl('.newin .card:nth-child(2) .card__media'); await wait(1400);
  await moveToEl('.newin .card:nth-child(3) .card__media'); await wait(1300);
  await scrollBy(1500, 3000);             // bordeaux capsule
  await wait(700);
  await scrollBy(1700, 3200);
  await wait(900);
  await scrollBy(-240, 600); await wait(500); // header slides back in on scroll up
  await click('.header__cats a[href*="cat=men"]');
  await page.waitForLoadState('networkidle'); await wait(1300);
  await moveToEl('.plp__grid .card:nth-child(1) .card__media'); await wait(1200);
  await moveToEl('.plp__grid .card:nth-child(2) .card__media'); await wait(1000);
  await click('[data-open-filters]'); await wait(1300);
  await click('#filters .color-opts label:has(input[value="bordeaux"])'); await wait(700);
  await click('[data-apply]'); await wait(1500);
  await click('.plp__grid .card:nth-child(1) a');
  await page.waitForLoadState('networkidle'); await wait(1400);
  await click('.colors .color:nth-child(4)'); await wait(1100);
  await click('.colors .color:nth-child(3)'); await wait(1100);
  await click('.colors .color:nth-child(5)'); await wait(900);
  await click('.sizes .size:nth-child(3)'); await wait(500);
  await click('.info__add'); await wait(2600);   // bag drawer
  await moveTo(W * 0.5, H * 0.5); await wait(600);
} else {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await start();
  await wait(2600);
  await scrollBy(1000, 3400);
  await wait(1800);
  await scrollBy(1400, 3200);
  await wait(800);
  await page.evaluate(() => document.querySelector('.rail').scrollBy({ left: 260, behavior: 'smooth' })); await wait(1400);
  await scrollBy(1600, 3200);
  await wait(800);
  await page.goto(BASE, { waitUntil: 'domcontentloaded' }); await wait(1800); // Lenis fights a programmatic jump to top
  await click('[data-open="menu"]'); await wait(1400);
  await click('#menu .menu-list a[href*="cat=men"]');
  await page.waitForLoadState('networkidle'); await wait(1200);
  await scrollBy(900, 2200); await wait(600);
  await click('.plp__grid .card:nth-child(1) a');
  await page.waitForLoadState('networkidle'); await wait(1200);
  for (let i = 1; i <= 2; i++) { await page.evaluate(() => { const g = document.querySelector('[data-gallery]'); g.scrollBy({ left: g.firstElementChild.offsetWidth, behavior: 'smooth' }); }); await wait(1000); }
  await scrollBy(420, 1200); await wait(500);
  await click('.colors .color:nth-child(5)'); await wait(900);
  await click('.sizes .size:nth-child(3)'); await wait(500);
  await click('.info__add'); await wait(2600);
}

await cdp.send('Page.stopScreencast');
await wait(200);
writeFileSync(`${dir}/timestamps.json`, JSON.stringify(frames));
console.log(`${frames.length} frames, ${(frames.at(-1) - frames[0]).toFixed(1)}s`);
await browser.close();
