import { chromium } from 'playwright-core';
const out = process.argv[2];
const b = await chromium.launch({ channel: 'msedge' });
// reduced motion
let ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
let page = await ctx.newPage();
await page.goto('http://localhost:5222/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/rm-home.jpg`, quality: 70 });
await ctx.close();
// mobile PDP sticky bar state at top, after scroll, and keyboard flow
ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
page = await ctx.newPage();
await page.goto('http://localhost:5222/product.html?p=runner-222', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
console.log('sticky at top visible:', await page.evaluate(() => document.querySelector('[data-sticky]').classList.contains('is-visible')));
await page.evaluate(() => window.scrollTo(0, 1600)); await page.waitForTimeout(900);
console.log('sticky after scroll visible:', await page.evaluate(() => document.querySelector('[data-sticky]').classList.contains('is-visible')));
await page.screenshot({ path: `${out}/m-pdp-scrolled.jpg`, quality: 70 });
await page.click('[data-sticky] button'); await page.waitForTimeout(900);
await page.screenshot({ path: `${out}/m-pdp-noselect.jpg`, quality: 70 });
await ctx.close();
// keyboard: open cart with Enter, Esc closes and focus returns
ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
page = await ctx.newPage();
await page.goto('http://localhost:5222/catalog.html?cat=men&size=M&color=bordeaux', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${out}/plp-filtered.jpg`, quality: 70 });
console.log('filtered title/count:', await page.evaluate(() => document.querySelector('.plp__title').innerText.replace(/\n/g,' ')));
await page.focus('[data-open="cart"]'); await page.keyboard.press('Enter'); await page.waitForTimeout(700);
console.log('focus in cart:', await page.evaluate(() => document.activeElement.closest('#cart') !== null));
await page.keyboard.press('Escape'); await page.waitForTimeout(700);
console.log('focus restored:', await page.evaluate(() => document.activeElement.dataset.open));
await page.goBack().catch(()=>{});
await b.close();
