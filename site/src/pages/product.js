import '../styles/main.css';
import '../styles/catalog.css';
import '../styles/product.css';
import { products, bySlug, COLORS } from '../data/products.js';
import { t, L, money, convert, state } from '../lib/i18n.js';
import { picture, src } from '../lib/img.js';
import { cart } from '../lib/cart.js';
import { createPanel } from '../lib/dialog.js';
import { mountShell } from '../components/shell.js';
import { productCard } from '../components/card.js';
import { CONTACTS, ext } from '../data/contacts.js';

const params = new URLSearchParams(location.search);
const p = bySlug(params.get('p')) || products[0];
let color = p.colors.find((c) => c.key === params.get('c')) || p.colors[0];
let size = null;

const main = document.getElementById('main');
const catLabel = { men: 'nav.men', women: 'nav.women', shoes: 'nav.shoes-acc', acc: 'nav.shoes-acc' }[p.cat];
const catParam = { men: 'men', women: 'women', shoes: 'shoes-acc', acc: 'shoes-acc' }[p.cat];

const GUIDE = {
  apparel: {
    cols: ['guide.chest', 'guide.waist', 'guide.height'],
    rows: { XS: ['88–92', '72–76', '168–174'], S: ['92–96', '76–80', '172–178'], M: ['96–100', '80–84', '176–182'], L: ['100–104', '84–88', '180–186'], XL: ['104–110', '88–94', '184–190'], XXL: ['110–116', '94–100', '186–192'] },
  },
  shoes: { cols: ['guide.foot'], rows: { 40: ['25,5'], 41: ['26,2'], 42: ['27,0'], 43: ['27,7'], 44: ['28,5'], 45: ['29,2'] } },
  denim: { cols: ['guide.waist'], rows: { 28: ['71–73'], 30: ['76–78'], 32: ['81–83'], 34: ['86–88'], 36: ['91–93'] } },
};
const guide = p.cat === 'shoes' ? GUIDE.shoes : p.handle === 'denim-straight' ? GUIDE.denim : p.cat === 'acc' ? null : GUIDE.apparel;

const alt = (im) => `${L(p.title)}, ${L(COLORS[color.key].name).toLowerCase()} — ${t(`shot.${im.shot}`)}`;

function galleryHTML() {
  return color.images.map((im, n) => `
    <figure class="gallery__item${n === 0 ? ' gallery__item--lead' : ''}" id="img-${n + 1}">
      ${picture(im, { alt: alt(im), eager: n === 0, sizes: n === 0 ? '(min-width: 1024px) 64vw, 92vw' : '(min-width: 1024px) 32vw, 92vw' })}
    </figure>`).join('');
}

function sizesHTML() {
  return p.sizes.map((z) => `
    <label class="size${z.inStock ? '' : ' is-oos'}">
      <input type="radio" name="size" value="${z.label}" ${size === z.label ? 'checked' : ''}
        aria-label="${z.label}${z.inStock ? (z.low ? ` — ${t('pdp.low')}` : '') : ` — ${t('pdp.oos')}`}">
      <span>${z.label}</span>
    </label>`).join('');
}

const accordion = (key, body, open = false) => `
  <details class="acc" ${open ? 'open' : ''}><summary><span>${t(key)}</span><i aria-hidden="true"></i></summary><div class="acc__body">${body}</div></details>`;

const rail = (title, list) => list.length ? `
  <section class="pdp-rail" aria-label="${title}">
    <h2 class="display pdp-rail__title">${title}</h2>
    <div class="pdp-rail__grid">${list.map((x) => productCard(x, { sizes: '(min-width: 1024px) 25vw, 60vw' })).join('')}</div>
  </section>` : '';

const complete = (p.complete || []).map(bySlug).filter(Boolean);
const like = products.filter((x) => x.handle !== p.handle && !complete.includes(x) && x.cat === p.cat).slice(0, 4);

main.innerHTML = `
  <article class="pdp">
    <div class="gallery" data-gallery aria-label="${L(p.title)}">${galleryHTML()}</div>
    <p class="gallery__counter u-caption tnum" aria-hidden="true" data-counter>1 / ${color.images.length}</p>

    <div class="info">
      <div class="info__inner">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a class="u-link" href="./">222 FMA</a><span aria-hidden="true">/</span>
          <a class="u-link" href="catalog.html?cat=${catParam}">${t(catLabel)}</a>
        </nav>
        <h1 class="info__title display">${L(p.title)}</h1>
        <p class="info__price tnum">${money(p.price)}</p>

        <fieldset class="info__block">
          <legend class="info__label"><span>${t('pdp.color')}:</span> <span data-color-name>${L(COLORS[color.key].name)}</span></legend>
          <div class="colors">
            ${p.colors.map((c) => `
              <label class="color" title="${L(COLORS[c.key].name)}">
                <input type="radio" name="color" value="${c.key}" ${c === color ? 'checked' : ''} aria-label="${L(COLORS[c.key].name)}">
                <span style="--sw:${COLORS[c.key].hex}"></span>
              </label>`).join('')}
          </div>
        </fieldset>

        <fieldset class="info__block" aria-describedby="size-msg">
          <legend class="info__label info__label--row">
            <span>${t('pdp.size')}</span>
          </legend>
          ${guide ? `<button type="button" class="u-link info__guide" data-guide aria-haspopup="dialog">${t('pdp.guide')}</button>` : ''}
          <div class="sizes" data-sizes>${sizesHTML()}</div>
          <p class="info__msg" id="size-msg" aria-live="polite" data-msg></p>
        </fieldset>

        <button type="button" class="btn btn--solid info__add" data-add>${t('pdp.add')}</button>
        <p class="info__ship muted">${t('pdp.delivery')}</p>

        <div class="accs">
          ${accordion('pdp.desc', `<p>${L(p.description)}</p>`, true)}
          ${accordion('pdp.comp', `<p>${L(p.composition)}</p><ul class="care">${L(p.care).map((c) => `<li>${c}</li>`).join('')}</ul>`)}
          ${p.fit ? accordion('pdp.fit', `<p>${L(p.fit)}</p>${p.model ? `<p class="muted">${L(p.model)}</p>` : ''}`) : ''}
          ${accordion('pdp.ship', `<p>${t('pdp.shipText')}</p>`)}
        </div>
      </div>
    </div>
  </article>

  ${rail(t('pdp.complete'), complete)}
  ${rail(t('pdp.like'), like)}

  <div class="sticky-add" data-sticky aria-hidden="true">
    <div><p class="sticky-add__title">${L(p.title)}</p><p class="tnum muted">${money(p.price)}</p></div>
    <button type="button" class="btn btn--solid" data-add tabindex="-1">${t('pdp.sticky')}</button>
  </div>

  ${guide ? `
  <div class="backdrop" hidden></div>
  <div class="panel panel--right" id="guide" role="dialog" aria-modal="true" aria-labelledby="guide-title" hidden>
    <div class="panel__head"><h2 class="panel__title" id="guide-title">${t('guide.title')}</h2><button class="u-link" type="button" data-close>${t('nav.close')}</button></div>
    <div class="guide">
      <p class="muted">${t('guide.note')}</p>
      <table>
        <thead><tr><th scope="col">${t('pdp.size')}</th>${guide.cols.map((c) => `<th scope="col">${t(c)}</th>`).join('')}</tr></thead>
        <tbody>${Object.entries(guide.rows).map(([k, v]) => `<tr><th scope="row">${k}</th>${v.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
      ${p.model ? `<p>${L(p.model)}</p>` : ''}
      <p>${t('guide.ask')} ${ext(CONTACTS.telegramAdmin.href, CONTACTS.telegramAdmin.handle)}</p>
    </div>
  </div>` : ''}
`;

const shell = mountShell({ page: 'product' });
const guidePanel = guide ? createPanel(document.getElementById('guide')) : null;
const msg = main.querySelector('[data-msg]');
const addBtn = main.querySelector('.info__add');

document.title = `${L(p.title)} — 222 FMA`;

/* ---------- Color switching (updates gallery + URL) ---------- */
main.querySelectorAll('input[name="color"]').forEach((input) => input.addEventListener('change', () => {
  color = p.colors.find((c) => c.key === input.value);
  main.querySelector('[data-color-name]').textContent = L(COLORS[color.key].name);
  main.querySelector('[data-gallery]').innerHTML = galleryHTML();
  main.querySelector('[data-gallery]').scrollLeft = 0;
  updateCounter(0);
  const url = new URL(location.href);
  url.searchParams.set('c', color.key);
  history.replaceState(null, '', url);
}));

/* ---------- Size + add to bag ---------- */
function setAddState() {
  const z = p.sizes.find((x) => x.label === size);
  if (z && !z.inStock) {
    addBtn.textContent = t('pdp.notify');
    addBtn.dataset.mode = 'notify';
  } else {
    addBtn.textContent = t('pdp.add');
    addBtn.dataset.mode = 'add';
  }
}

if (p.sizes.length === 1 && p.sizes[0].inStock) size = p.sizes[0].label;
main.querySelector('[data-sizes]').innerHTML = sizesHTML();

main.querySelector('[data-sizes]').addEventListener('change', (e) => {
  size = e.target.value;
  const z = p.sizes.find((x) => x.label === size);
  msg.textContent = !z.inStock ? `${size} — ${t('pdp.oos')}` : z.low ? `${size} — ${t('pdp.low')}` : '';
  msg.classList.remove('is-error');
  setAddState();
});

function add(trigger) {
  if (!size) {
    msg.textContent = t('pdp.select');
    msg.classList.add('is-error');
    main.querySelector('[data-sizes]').scrollIntoView({ block: 'center', behavior: 'smooth' });
    main.querySelector('[data-sizes] input:not(:disabled)')?.focus({ preventScroll: true });
    return;
  }
  if (addBtn.dataset.mode === 'notify') {
    msg.textContent = t('pdp.notified');
    msg.classList.remove('is-error');
    return;
  }
  cart.add(p.handle, color.key, size);
  shell.announce(t('cart.added', { title: L(p.title) }));
  addBtn.textContent = `${t('pdp.added')} ✓`;
  setTimeout(() => setAddState(), 1600);
  shell.openCart(trigger);
}
main.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', () => add(b)));
main.querySelector('[data-guide]')?.addEventListener('click', (e) => guidePanel.open(e.currentTarget));

/* ---------- Mobile: gallery counter + sticky add bar ---------- */
const gallery = main.querySelector('[data-gallery]');
const counter = main.querySelector('[data-counter]');
function updateCounter(i) { counter.textContent = `${i + 1} / ${color.images.length}`; }
gallery.addEventListener('scroll', () => {
  updateCounter(Math.round(gallery.scrollLeft / (gallery.firstElementChild?.offsetWidth || 1)));
}, { passive: true });

const sticky = main.querySelector('[data-sticky]');
let stickyShown = false;
function updateSticky() {
  const show = addBtn.getBoundingClientRect().bottom < 0;
  if (show === stickyShown) return;
  stickyShown = show;
  sticky.classList.toggle('is-visible', show);
  sticky.setAttribute('aria-hidden', String(!show));
  sticky.querySelector('button').tabIndex = show ? 0 : -1;
}
addEventListener('scroll', updateSticky, { passive: true });
updateSticky();

/* ---------- Structured data ---------- */
const ld = [
  {
    '@context': 'https://schema.org', '@type': 'Product',
    name: L(p.title), description: L(p.description), brand: { '@type': 'Brand', name: '222 FMA' },
    image: color.images.map((im) => new URL(src(im.i, 1600), location.href).href),
    color: L(COLORS[color.key].name), material: L(p.composition), sku: `${p.handle}-${color.key}`,
    offers: {
      '@type': 'Offer', priceCurrency: state.currency, price: convert(p.price),
      availability: p.sizes.some((z) => z.inStock) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: location.href,
    },
  },
  {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '222 FMA', item: new URL('./', location.href).href },
      { '@type': 'ListItem', position: 2, name: t(catLabel), item: new URL(`catalog.html?cat=${catParam}`, location.href).href },
      { '@type': 'ListItem', position: 3, name: L(p.title) },
    ],
  },
];
const script = document.createElement('script');
script.type = 'application/ld+json';
script.textContent = JSON.stringify(ld);
document.head.append(script);
