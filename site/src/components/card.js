import { COLORS } from '../data/products.js';
import { picture } from '../lib/img.js';
import { L, t, money, count } from '../lib/i18n.js';

const altFor = (p, colorKey, im) => `${L(p.title)}, ${L(COLORS[colorKey].name).toLowerCase()} — ${t(`shot.${im.shot}`)}`;

/** Product card: whole card is a link; hover crossfades to the second image. */
export function productCard(p, { sizes = '(min-width: 1024px) 33vw, 50vw', colorKey } = {}) {
  const color = p.colors.find((c) => c.key === colorKey) || p.colors[0];
  const [a, b] = color.images;
  const lowStock = p.sizes.filter((s) => s.inStock).length <= 2;
  const href = `/product.html?p=${p.handle}${color !== p.colors[0] ? `&c=${color.key}` : ''}`;
  return `
  <article class="card">
    <a class="card__link" href="${href}">
      <div class="card__media">
        ${picture(a, { alt: altFor(p, color.key, a), sizes, crop: true, className: 'card__img' })}
        ${b ? picture(b, { alt: '', sizes, crop: true, className: 'card__img card__img--alt' }) : ''}
      </div>
      <div class="card__info">
        <h3 class="card__title">${L(p.title)}</h3>
        <p class="card__price">${money(p.price)}</p>
        <p class="card__meta">
          ${p.colors.length > 1
            ? `<span class="swatches" aria-label="${count(p.colors.length, 'plp.colors')}">${p.colors.map((c) => `<i style="--sw:${COLORS[c.key].hex}"></i>`).join('')}</span>`
            : `<span>${L(COLORS[color.key].name)}</span>`}
          ${p.isNew ? `<span class="card__badge">${t('badge.new')}</span>` : lowStock ? `<span class="card__badge">${t('badge.low')}</span>` : ''}
        </p>
      </div>
    </a>
  </article>`;
}
