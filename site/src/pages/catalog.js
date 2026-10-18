import '../styles/main.css';
import '../styles/catalog.css';
import { products, COLORS, CATEGORIES, inCategory } from '../data/products.js';
import { t, L, count } from '../lib/i18n.js';
import { picture } from '../lib/img.js';
import { mountShell, searchProducts } from '../components/shell.js';
import { productCard } from '../components/card.js';
import { createPanel } from '../lib/dialog.js';

// 11 cards + one 2×2 campaign tile fill exactly five rows of the 3-column grid.
const PAGE = 11;
const SORTS = ['featured', 'new', 'asc', 'desc'];
const main = document.getElementById('main');

/* ---------- URL state ---------- */
function readState() {
  const q = new URLSearchParams(location.search);
  return {
    cat: CATEGORIES.includes(q.get('cat')) ? q.get('cat') : 'all',
    sizes: q.getAll('size'),
    colors: q.getAll('color'),
    sort: SORTS.includes(q.get('sort')) ? q.get('sort') : 'featured',
    view: q.get('view') === '2' ? '2' : '3',
    q: q.get('q') || '',
    shown: Math.max(PAGE, Number(q.get('n')) || PAGE),
  };
}

function writeState(s, { push = true } = {}) {
  const q = new URLSearchParams();
  if (s.cat !== 'all') q.set('cat', s.cat);
  if (s.q) q.set('q', s.q);
  s.sizes.forEach((v) => q.append('size', v));
  s.colors.forEach((v) => q.append('color', v));
  if (s.sort !== 'featured') q.set('sort', s.sort);
  if (s.view !== '3') q.set('view', s.view);
  if (s.shown > PAGE) q.set('n', s.shown);
  const url = `${location.pathname}${q.toString() ? `?${q}` : ''}`;
  history[push ? 'pushState' : 'replaceState'](null, '', url);
}

function filter(s) {
  let list = s.q ? searchProducts(s.q) : products;
  list = list.filter((p) => inCategory(p, s.cat));
  if (s.sizes.length) list = list.filter((p) => p.sizes.some((z) => z.inStock && s.sizes.includes(z.label)));
  if (s.colors.length) list = list.filter((p) => p.colors.some((c) => s.colors.includes(c.key)));
  const sorted = [...list];
  if (s.sort === 'featured') sorted.sort((a, b) => a.order - b.order);
  if (s.sort === 'new') sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || a.order - b.order);
  if (s.sort === 'asc') sorted.sort((a, b) => a.price - b.price);
  if (s.sort === 'desc') sorted.sort((a, b) => b.price - a.price);
  return sorted;
}

/* Campaign frames interleaved into the grid, per category. */
const TILES = {
  all: { i: 13, fy: 0.45, label: 'hero.capsule', href: 'catalog.html?cat=men' },
  men: { i: 46, fy: 0.4, label: 'spread.title', href: 'product.html?p=merino-zip-cardigan' },
  women: { i: 15, fy: 0.4, label: 'hero.capsule', href: 'product.html?p=track-jacket-women' },
  knit: { i: 41, fy: 0.45, label: 'spread.title', href: 'product.html?p=cable-quarter-zip' },
  'shoes-acc': { i: 50, fy: 0.5, label: 'hero.season', href: 'product.html?p=crossbody-bag' },
};

/* ---------- Render ---------- */
let s = readState();

main.innerHTML = `
  <div class="plp">
    <header class="plp__head">
      <nav class="crumbs" aria-label="Breadcrumb"><a class="u-link" href="./">222 FMA</a><span aria-hidden="true">/</span><span data-crumb></span></nav>
      <h1 class="plp__title display"><span data-title></span> <sup class="plp__count tnum" data-count></sup></h1>
      <ul class="plp__cats" aria-label="${t('plp.category')}">
        ${['all', ...CATEGORIES].map((c) => `<li><a class="u-link" data-cat="${c}" href="catalog.html${c === 'all' ? '' : `?cat=${c}`}">${t(`nav.${c}`)}</a></li>`).join('')}
      </ul>
    </header>
    <div class="plp__bar">
      <ul class="chips" data-chips></ul>
      <div class="plp__tools">
        <div class="view-toggle" role="group" aria-label="${t('plp.view')}">
          <span class="muted u-caption">${t('plp.view')}</span>
          <button type="button" class="u-link" data-view="2" aria-pressed="false">2</button>
          <button type="button" class="u-link" data-view="3" aria-pressed="false">3</button>
        </div>
        <button type="button" class="u-link" data-open-filters aria-haspopup="dialog">${t('plp.filter')} <span data-filter-count></span></button>
      </div>
    </div>
    <div class="plp__grid" data-grid></div>
    <div class="plp__more" data-more></div>
  </div>

  <div class="backdrop" hidden></div>
  <div class="panel panel--right panel--filters" id="filters" role="dialog" aria-modal="true" aria-labelledby="filters-title" hidden>
    <div class="panel__head"><h2 class="panel__title" id="filters-title">${t('plp.filter')}</h2><button class="u-link" type="button" data-close>${t('nav.close')}</button></div>
    <form class="filters" data-filters>
      <fieldset><legend>${t('plp.sort')}</legend>
        ${SORTS.map((v) => `<label class="opt"><input type="radio" name="sort" value="${v}"><span>${t(`sort.${v}`)}</span></label>`).join('')}
      </fieldset>
      <fieldset><legend>${t('plp.category')}</legend>
        ${['all', ...CATEGORIES].map((v) => `<label class="opt"><input type="radio" name="cat" value="${v}"><span>${t(`nav.${v}`)}</span></label>`).join('')}
      </fieldset>
      <fieldset><legend>${t('plp.size')}</legend>
        <div class="size-chips" data-size-chips></div>
      </fieldset>
      <fieldset><legend>${t('plp.color')}</legend>
        <div class="color-opts">
          ${[...new Set(products.flatMap((p) => p.colors.map((c) => c.key)))].map((k) => `<label class="opt"><input class="visually-hidden" type="checkbox" name="color" value="${k}"><i class="dot" style="--sw:${COLORS[k].hex}"></i><span>${L(COLORS[k].name)}</span></label>`).join('')}
        </div>
      </fieldset>
    </form>
    <div class="filters__foot">
      <button type="button" class="btn btn--line" data-reset>${t('plp.reset')}</button>
      <button type="button" class="btn btn--solid" data-apply></button>
    </div>
  </div>
`;

mountShell({ page: 'catalog' });
const grid = main.querySelector('[data-grid]');
const form = main.querySelector('[data-filters]');
const filtersPanel = createPanel(document.getElementById('filters'));

function tileHTML() {
  const tile = TILES[s.cat] || TILES.all;
  return `
  <a class="plp__tile" href="${tile.href}">
    ${picture({ i: tile.i, fy: tile.fy }, { alt: '', sizes: '(min-width: 1024px) 66vw, 100vw' })}
    <span class="plp__tile-cap u-caption">${t(tile.label)}</span>
  </a>`;
}

function render() {
  const list = filter(s);
  const visible = list.slice(0, s.shown);
  const title = s.q ? t('plp.search', { q: s.q }) : t(`nav.${s.cat}`);
  document.title = `${title} — 222 FMA`;
  main.querySelector('[data-title]').textContent = title;
  main.querySelector('[data-crumb]').textContent = title;
  main.querySelector('[data-count]').textContent = list.length;
  main.querySelectorAll('[data-cat]').forEach((a) => {
    if (a.dataset.cat === s.cat && !s.q) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  main.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.view === s.view));
  grid.dataset.view = s.view;

  const cards = visible.map((p) => productCard(p, {
    colorKey: s.colors.find((c) => p.colors.some((pc) => pc.key === c)),
    sizes: s.view === '2' ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 33vw, 50vw',
  }));
  if (cards.length > 6 && !s.q) cards.splice(6, 0, tileHTML());
  grid.innerHTML = cards.length ? cards.join('') : `<p class="plp__empty">${t('plp.empty')} <button class="u-link" type="button" data-reset>${t('plp.reset')}</button></p>`;

  main.querySelector('[data-more]').innerHTML = list.length
    ? `<p class="muted u-caption">${t('plp.shown', { n: visible.length, total: list.length })}</p>
       ${visible.length < list.length ? `<button type="button" class="btn btn--line" data-load>${t('plp.more')}</button>` : ''}
       <div class="plp__progress" aria-hidden="true"><i style="transform:scaleX(${visible.length / list.length})"></i></div>`
    : '';

  // Applied filter chips
  const chips = [
    ...s.sizes.map((v) => ({ k: 'size', v, label: `${t('plp.size')} ${v}` })),
    ...s.colors.map((v) => ({ k: 'color', v, label: L(COLORS[v].name) })),
  ];
  main.querySelector('[data-chips]').innerHTML = chips.map((c) =>
    `<li><button type="button" class="chip" data-chip="${c.k}:${c.v}" aria-label="${t('plp.remove')}: ${c.label}">${c.label} <span aria-hidden="true">×</span></button></li>`).join('')
    + (chips.length > 1 ? `<li><button type="button" class="u-link muted" data-reset>${t('plp.reset')}</button></li>` : '');
  main.querySelector('[data-filter-count]').textContent = chips.length ? `(${chips.length})` : '';
}

// Size options depend on the category: apparel letters, shoe sizes, denim waists.
function renderSizeChips(cat, checked) {
  const labels = [...new Set(products.filter((p) => inCategory(p, cat)).flatMap((p) => p.sizes.map((z) => z.label)))]
    .filter((l) => l !== 'One size');
  form.querySelector('[data-size-chips]').innerHTML = labels.map((v) =>
    `<label class="size-chip"><input type="checkbox" name="size" value="${v}" ${checked.includes(v) ? 'checked' : ''}><span>${v}</span></label>`).join('');
}

function syncForm() {
  renderSizeChips(s.cat, s.sizes);
  form.querySelectorAll('input').forEach((i) => {
    if (i.name === 'sort') i.checked = i.value === s.sort;
    if (i.name === 'cat') i.checked = i.value === s.cat;
    if (i.name === 'size') i.checked = s.sizes.includes(i.value);
    if (i.name === 'color') i.checked = s.colors.includes(i.value);
  });
  updateApply();
}

function formState() {
  const fd = new FormData(form);
  return { ...s, sort: fd.get('sort'), cat: fd.get('cat'), sizes: fd.getAll('size'), colors: fd.getAll('color'), shown: PAGE };
}

function updateApply() {
  const n = filter(formState()).length;
  document.querySelector('[data-apply]').textContent = `${t('plp.apply')} (${n})`;
}

function commit(next) {
  s = next;
  writeState(s);
  render();
}

form.addEventListener('change', (e) => {
  if (e.target.name === 'cat') renderSizeChips(e.target.value, new FormData(form).getAll('size'));
  updateApply();
});
document.querySelector('[data-apply]').addEventListener('click', () => { commit(formState()); filtersPanel.close(); });

main.addEventListener('click', (e) => {
  if (e.target.closest('[data-open-filters]')) { syncForm(); filtersPanel.open(e.target.closest('button')); }
  const view = e.target.closest('[data-view]');
  if (view) commit({ ...s, view: view.dataset.view });
  if (e.target.closest('[data-load]')) {
    const before = s.shown;
    commit({ ...s, shown: s.shown + PAGE });
    grid.querySelectorAll('.card')[before]?.querySelector('a')?.focus({ preventScroll: true });
  }
  const chip = e.target.closest('[data-chip]');
  if (chip) {
    const [k, v] = chip.dataset.chip.split(':');
    const key = k === 'size' ? 'sizes' : 'colors';
    commit({ ...s, [key]: s[key].filter((x) => x !== v), shown: PAGE });
  }
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-reset]')) return;
  commit({ ...s, sizes: [], colors: [], sort: 'featured', shown: PAGE });
  if (filtersPanel.isOpen()) syncForm();
});

addEventListener('popstate', () => { s = readState(); render(); });

render();
