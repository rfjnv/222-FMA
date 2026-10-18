// Site chrome: header, menu, search, language/currency, cart drawer, footer.
import logoRaw from '../assets/logo.svg?raw';
import { products, bySlug, COLORS, CATEGORIES } from '../data/products.js';
import { state, t, L, money, setPref, LOCALES, CURRENCIES } from '../lib/i18n.js';
import { cart } from '../lib/cart.js';
import { createPanel } from '../lib/dialog.js';
import { picture } from '../lib/img.js';
import { productCard } from './card.js';
import { CONTACTS, ext } from '../data/contacts.js';

const FREE_SHIPPING = 3000000;
const LOCALE_LABEL = { ru: 'Русский', uz: 'Oʻzbekcha', en: 'English' };

const logoSvg = logoRaw.replace(/<\?xml[^>]*>/, '').replace(/fill="#[0-9A-Fa-f]{6}"/, 'fill="currentColor"');
/** Full mark (emblem + 222 + FMA). */
export const logoFull = (cls = '') => logoSvg.replace('<svg ', `<svg class="${cls}" aria-hidden="true" focusable="false" `);
/** Compact wordmark without the emblem, for the header. */
export const logoCompact = (cls = '') =>
  logoFull(cls).replace(/viewBox="[^"]*"/, 'viewBox="0 266 982 252"').replace(/width="\d+" height="\d+"/, '').replace(/<path id="emblem"[^>]*\/>/, '');

const catHref = (c) => `/catalog.html?cat=${c}`;

function headerHTML(page) {
  return `
  <a class="skip" href="#main">${t('skip')}</a>
  <header class="header" data-page="${page}">
    <nav class="header__nav" aria-label="${t('nav.menu')}">
      <button class="header__menu-btn u-link" type="button" data-open="menu" aria-haspopup="dialog">${t('nav.menu')}</button>
      <ul class="header__cats">
        ${CATEGORIES.map((c) => `<li><a class="u-link" href="${catHref(c)}">${t(`nav.${c}`)}</a></li>`).join('')}
      </ul>
    </nav>
    <a class="header__logo" href="/" aria-label="222 FMA — ${t('nav.home')}">${logoCompact()}</a>
    <div class="header__tools">
      <button class="u-link" type="button" data-open="search" aria-haspopup="dialog">${t('nav.search')}</button>
      <button class="u-link header__pref" type="button" data-open="prefs" aria-haspopup="dialog">${state.locale.toUpperCase()} · ${state.currency}</button>
      <button class="u-link" type="button" data-open="cart" aria-haspopup="dialog">${t('nav.bag')} <span class="bag-count" data-bag-count>(${cart.count})</span></button>
    </div>
  </header>`;
}

function panelsHTML() {
  return `
  <div class="backdrop" hidden></div>
  <div class="panel panel--left panel--menu" id="menu" role="dialog" aria-modal="true" aria-label="${t('nav.menu')}" hidden>
    <div class="panel__head"><span></span><button class="u-link" type="button" data-close>${t('nav.close')}</button></div>
    <ul class="menu-list">
      ${[...CATEGORIES, 'all'].map((c) => `<li><a href="${c === 'all' ? '/catalog.html' : catHref(c)}">${t(`nav.${c}`)}</a></li>`).join('')}
    </ul>
    <div class="menu-foot">
      <button class="u-link" type="button" data-open="search">${t('nav.search')}</button>
      <button class="u-link" type="button" data-open="prefs">${LOCALE_LABEL[state.locale]} · ${state.currency}</button>
    </div>
  </div>

  <div class="backdrop" hidden></div>
  <div class="panel panel--top panel--search" id="search" role="dialog" aria-modal="true" aria-label="${t('nav.search')}" hidden>
    <div class="panel__head"><span class="eyebrow">${t('nav.search')}</span><button class="u-link" type="button" data-close>${t('nav.close')}</button></div>
    <form class="search-form" action="/catalog.html" role="search">
      <label class="visually-hidden" for="q">${t('search.label')}</label>
      <input id="q" name="q" type="search" autocomplete="off" placeholder="${t('search.placeholder')}">
    </form>
    <div class="search-suggest">
      <span class="muted">${t('search.hint')}</span>
      ${['merino', 'hoodie', 'runner', 'bordeaux'].map((k) => {
        const label = { merino: { ru: 'Меринос', en: 'Merino', uz: 'Merinos' }, hoodie: { ru: 'Худи', en: 'Hoodie', uz: 'Xudi' }, runner: { ru: 'Кроссовки', en: 'Sneakers', uz: 'Krossovka' }, bordeaux: { ru: 'Бордо', en: 'Bordeaux', uz: 'Bordo' } }[k];
        return `<button class="u-link" type="button" data-suggest="${L(label)}">${L(label)}</button>`;
      }).join('')}
    </div>
    <div class="search-results" aria-live="polite"></div>
  </div>

  <div class="backdrop" hidden></div>
  <div class="panel panel--right panel--prefs" id="prefs" role="dialog" aria-modal="true" aria-labelledby="prefs-title" hidden>
    <div class="panel__head"><h2 id="prefs-title" class="panel__title">${t('pref.title')}</h2><button class="u-link" type="button" data-close>${t('nav.close')}</button></div>
    <fieldset class="pref-group"><legend>${t('pref.lang')}</legend>
      ${LOCALES.map((l) => `<label class="opt"><input type="radio" name="locale" value="${l}" ${l === state.locale ? 'checked' : ''}><span>${LOCALE_LABEL[l]}</span></label>`).join('')}
    </fieldset>
    <fieldset class="pref-group"><legend>${t('pref.cur')}</legend>
      ${CURRENCIES.map((c) => `<label class="opt"><input type="radio" name="currency" value="${c}" ${c === state.currency ? 'checked' : ''}><span>${c}</span></label>`).join('')}
    </fieldset>
  </div>

  <div class="backdrop" hidden></div>
  <div class="panel panel--right panel--cart" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title" hidden>
    <div class="panel__head"><h2 id="cart-title" class="panel__title">${t('cart.title')} <span data-bag-count>(${cart.count})</span></h2><button class="u-link" type="button" data-close>${t('nav.close')}</button></div>
    <div class="cart__body" data-cart-body></div>
  </div>
  <div class="visually-hidden" aria-live="polite" data-live></div>`;
}

function footerHTML() {
  return `
  <footer class="footer">
    <div class="footer__cols">
      <div><h2 class="footer__h">${t('footer.help')}</h2><ul><li><a class="u-link" href="#">${t('footer.delivery')}</a></li><li><a class="u-link" href="#">${t('footer.returns')}</a></li><li><a class="u-link" href="#">${t('footer.care')}</a></li></ul></div>
      <div><h2 class="footer__h">${t('footer.company')}</h2><ul><li><a class="u-link" href="#">${t('footer.about')}</a></li><li><a class="u-link" href="/#store">${t('footer.store')}</a></li><li>${ext(CONTACTS.map, t('store.address'))}</li></ul></div>
      <div><h2 class="footer__h">${t('nav.all')}</h2><ul>${CATEGORIES.map((c) => `<li><a class="u-link" href="${catHref(c)}">${t(`nav.${c}`)}</a></li>`).join('')}</ul></div>
      <div><h2 class="footer__h">${t('footer.contacts')}</h2><ul>
        <li><a class="u-link tnum" href="${CONTACTS.phoneHref}">${CONTACTS.phone}</a></li>
        <li>${ext(CONTACTS.instagram.href, `Instagram ${CONTACTS.instagram.handle}`)}</li>
        <li>${ext(CONTACTS.telegramChannel.href, `${t('footer.channel')} ${CONTACTS.telegramChannel.handle}`)}</li>
        <li>${ext(CONTACTS.telegramAdmin.href, t('footer.admin'))}</li>
        <li><button class="u-link" type="button" data-open="prefs">${LOCALE_LABEL[state.locale]} · ${state.currency}</button></li>
      </ul></div>
    </div>
    <a class="footer__mark" href="/" aria-label="222 FMA">${logoCompact()}</a>
    <p class="footer__legal">${t('footer.legal')}</p>
  </footer>`;
}

function cartLineHTML(l) {
  const p = bySlug(l.handle);
  const color = p.colors.find((c) => c.key === l.color) || p.colors[0];
  const key = cart.key(l);
  return `
  <li class="cart-line">
    <a class="cart-line__media" href="/product.html?p=${p.handle}&c=${color.key}" tabindex="-1" aria-hidden="true">${picture(color.images[0], { sizes: '96px', crop: true })}</a>
    <div class="cart-line__info">
      <a class="cart-line__title u-link" href="/product.html?p=${p.handle}&c=${color.key}">${L(p.title)}</a>
      <p class="muted">${L(COLORS[color.key].name)} · ${t('cart.size')} ${l.size}</p>
      <div class="cart-line__row">
        <div class="qty" role="group" aria-label="${t('cart.qty')}">
          <button type="button" data-qty="${key}" data-delta="-1" aria-label="${t('cart.dec')}">−</button>
          <span aria-live="polite">${l.qty}</span>
          <button type="button" data-qty="${key}" data-delta="1" aria-label="${t('cart.inc')}">+</button>
        </div>
        <button class="u-link muted" type="button" data-remove="${key}">${t('cart.remove')}</button>
      </div>
    </div>
    <p class="cart-line__price">${money(p.price * l.qty)}</p>
  </li>`;
}

function renderCart() {
  const body = document.querySelector('[data-cart-body]');
  document.querySelectorAll('[data-bag-count]').forEach((n) => (n.textContent = `(${cart.count})`));
  if (!cart.lines.length) {
    body.innerHTML = `<div class="cart__empty"><p>${t('cart.empty')}</p><a class="btn btn--line" href="/catalog.html">${t('cart.toShop')}</a></div>`;
    return;
  }
  const left = Math.max(FREE_SHIPPING - cart.subtotal, 0);
  body.innerHTML = `
    <ul class="cart__lines">${cart.lines.map(cartLineHTML).join('')}</ul>
    <div class="cart__foot">
      <p class="cart__ship">${left ? t('cart.free', { sum: money(left) }) : t('cart.freeOk')}</p>
      <div class="cart__bar" aria-hidden="true"><i style="transform:scaleX(${Math.min(cart.subtotal / FREE_SHIPPING, 1)})"></i></div>
      <p class="cart__total"><span>${t('cart.subtotal')}</span><span>${money(cart.subtotal)}</span></p>
      <button class="btn btn--solid" type="button" data-checkout>${t('cart.checkout')}</button>
      <p class="cart__note muted" hidden data-checkout-note>${t('cart.note')}</p>
    </div>`;
}

function searchResults(q) {
  const box = document.querySelector('.search-results');
  const query = q.trim().toLowerCase();
  if (query.length < 2) { box.innerHTML = ''; return; }
  const hits = searchProducts(query);
  box.innerHTML = hits.length
    ? `<div class="search-grid">${hits.slice(0, 4).map((p) => productCard(p, { sizes: '(min-width: 1024px) 20vw, 50vw' })).join('')}</div>
       <a class="u-link" href="/catalog.html?q=${encodeURIComponent(q.trim())}">${t('search.all')} (${hits.length})</a>`
    : `<p class="muted">${t('search.none', { q })}</p>`;
}

export function searchProducts(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    const hay = [
      ...Object.values(p.title), ...Object.values(p.description), ...Object.values(p.composition),
      ...p.colors.flatMap((c) => Object.values(COLORS[c.key].name)), p.handle,
    ].join(' ').toLowerCase();
    return words.every((w) => hay.includes(w) || hay.includes(w.slice(0, -1)));
  });
}

export function mountShell({ page = 'home' } = {}) {
  document.body.insertAdjacentHTML('afterbegin', headerHTML(page));
  document.body.insertAdjacentHTML('beforeend', footerHTML() + panelsHTML());

  const panels = {
    menu: createPanel(document.getElementById('menu')),
    search: createPanel(document.getElementById('search'), { initialFocus: '#q' }),
    prefs: createPanel(document.getElementById('prefs')),
    cart: createPanel(document.getElementById('cart')),
  };

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) panels[opener.dataset.open].open(opener);

    const qty = e.target.closest('[data-qty]');
    if (qty) {
      const line = cart.lines.find((l) => cart.key(l) === qty.dataset.qty);
      cart.setQty(qty.dataset.qty, line.qty + Number(qty.dataset.delta));
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) cart.remove(rm.dataset.remove);
    if (e.target.closest('[data-checkout]')) document.querySelector('[data-checkout-note]').hidden = false;

    const sug = e.target.closest('[data-suggest]');
    if (sug) { const q = document.getElementById('q'); q.value = sug.dataset.suggest; searchResults(q.value); q.focus(); }
  });

  document.getElementById('q').addEventListener('input', (e) => searchResults(e.target.value));
  document.querySelectorAll('#prefs input').forEach((input) =>
    input.addEventListener('change', () => setPref(input.name, input.value)));

  cart.subscribe(renderCart);
  renderCart();

  // Header: transparent over the home hero, solid elsewhere; hides on scroll down.
  const header = document.querySelector('.header');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    const heroEnd = document.querySelector('[data-hero-end]');
    const overHero = heroEnd ? heroEnd.getBoundingClientRect().bottom > 56 : false;
    header.classList.toggle('is-over-hero', overHero);
    const hide = !overHero && y > lastY && y > 240;
    header.classList.toggle('is-hidden', hide);
    document.documentElement.classList.toggle('header-hidden', hide);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const live = document.querySelector('[data-live]');
  return {
    openCart: (trigger) => panels.cart.open(trigger),
    announce: (msg) => { live.textContent = ''; setTimeout(() => (live.textContent = msg), 50); },
  };
}
