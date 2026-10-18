import '../styles/main.css';
import '../styles/home.css';
import { products, bySlug } from '../data/products.js';
import { t, L, money } from '../lib/i18n.js';
import { picture } from '../lib/img.js';
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion.js';
import { mountShell } from '../components/shell.js';
import { productCard } from '../components/card.js';
import { CONTACTS, ext } from '../data/contacts.js';

const main = document.getElementById('main');
main.classList.add('is-home');

const hoodie = bySlug('zip-hoodie-kvartal');
const trousers = bySlug('drawstring-trousers');
const newIn = products.filter((p) => p.isNew).slice(0, 3);

main.innerHTML = `
  <section class="hero" data-hero-end aria-labelledby="hero-title">
    <div class="hero__stage">
      <figure class="hero__panel hero__panel--l">${picture({ i: 8, fy: 0.4 }, { alt: 'Худи на молнии цвета экрю, крупный план', sizes: '34vw', eager: true })}</figure>
      <figure class="hero__panel hero__panel--r">${picture({ i: 49, fy: 0.35 }, { alt: 'Худи и брюки цвета бордо на улице Ташкента', sizes: '34vw', eager: true })}</figure>
      <figure class="hero__center">${picture({ i: 13, fx: 0.5, fy: 0.42 }, { alt: 'Мужчина и женщина в олимпийках из серого меланжа у известняковых колонн', sizes: '100vw', eager: true })}</figure>
      <div class="hero__scrim" aria-hidden="true"></div>
      <p class="hero__season u-caption">${t('hero.season')}</p>
      <p class="hero__scroll u-caption" aria-hidden="true">${t('hero.scroll')}</p>
      <h1 class="hero__title display" id="hero-title">
        <span class="line"><span>${t('hero.title1')}</span></span>
        <span class="line line--indent"><span><em>${t('hero.title2')}</em></span></span>
      </h1>
      <div class="hero__meta">
        <p class="u-caption">${t('hero.capsule')} · ${t('hero.items')}</p>
        <a class="u-link" href="/catalog.html?cat=men">${t('hero.cta')}</a>
      </div>
    </div>
  </section>

  <section class="spread grid" aria-labelledby="spread-title">
    <figure class="spread__small media">${picture({ i: 30 }, { alt: 'Молния и стойка джемпера из мериноса, макро', sizes: '(min-width: 1024px) 24vw, 46vw' })}</figure>
    <a class="spread__big media" href="/product.html?p=merino-zip-cardigan" aria-label="${L(bySlug('merino-zip-cardigan').title)}">${picture({ i: 46 }, { alt: 'Кардиган на молнии из мериноса цвета экрю в бутике 222 FMA', sizes: '(min-width: 1024px) 48vw, 100vw' })}</a>
    <div class="spread__text">
      <h2 class="display spread__title" id="spread-title">${t('spread.title')}</h2>
      <p>${t('spread.body')}</p>
      <a class="u-link" href="/catalog.html?cat=knit">${t('spread.cta')}</a>
    </div>
  </section>

  <section class="newin" aria-labelledby="new-title">
    <div class="section-head">
      <h2 class="display section-head__title" id="new-title">${t('new.title')}</h2>
      <a class="u-link" href="/catalog.html?sort=new">${t('new.cta')}</a>
    </div>
    <div class="rail">${newIn.map((p) => productCard(p, { sizes: '(min-width: 1024px) 33vw, 72vw' })).join('')}</div>
  </section>

  <section class="bordeaux" aria-labelledby="bordeaux-title">
    <a class="bordeaux__full" href="/product.html?p=zip-hoodie-kvartal&c=bordeaux">
      ${picture({ i: 47, fy: 0.3 }, { alt: 'Костюм цвета бордо, вид сзади, у ажурной ограды в Ташкенте', sizes: '100vw' })}
      <span class="bordeaux__cap u-caption">${t('bordeaux.capsule')}</span>
    </a>
    <div class="bordeaux__diptych">
      <figure class="media">${picture({ i: 48 }, { alt: 'Худи и брюки цвета бордо, образ целиком', sizes: '50vw' })}</figure>
      <figure class="media">${picture({ i: 49 }, { alt: 'Худи на молнии цвета бордо, вид спереди', sizes: '50vw' })}</figure>
    </div>
    <div class="bordeaux__text">
      <h2 class="display" id="bordeaux-title">${t('bordeaux.capsule')}</h2>
      <p>${t('bordeaux.line')}</p>
      <ul class="bordeaux__items">
        <li><a class="u-row" href="/product.html?p=${hoodie.handle}&c=bordeaux"><span>${L(hoodie.title)}</span><span class="tnum">${money(hoodie.price)}</span></a></li>
        <li><a class="u-row" href="/product.html?p=${trousers.handle}&c=bordeaux"><span>${L(trousers.title)}</span><span class="tnum">${money(trousers.price)}</span></a></li>
      </ul>
      <a class="u-link" href="/product.html?p=${hoodie.handle}&c=bordeaux">${t('bordeaux.cta')}</a>
    </div>
  </section>

  <section class="store grid" id="store" aria-labelledby="store-title">
    <figure class="store__img media">${picture({ i: 3 }, { alt: 'Фасад бутика 222 FMA в Ташкенте', sizes: '(min-width: 1024px) 40vw, 100vw' })}</figure>
    <div class="store__text">
      <h2 class="display" id="store-title">${t('store.title')}</h2>
      <p>${t('store.body')}</p>
      <address class="store__contacts">
        <span>${t('store.address')}</span>
        <span class="muted">${t('store.metro')}</span>
        <span class="muted">${t('store.hours')}</span>
        <a class="tnum" href="${CONTACTS.phoneHref}">${CONTACTS.phone}</a>
      </address>
      <p class="store__links">${ext(CONTACTS.map, t('store.cta'))}${ext(CONTACTS.telegramAdmin.href, t('store.write'))}</p>
    </div>
  </section>
`;

mountShell({ page: 'home' });

/* Signature moment — "Triptych 2·2·2": the centre frame opens to full bleed on scroll. */
const hero = document.querySelector('.hero');
const mm = gsap.matchMedia();

const sideInset = () => {
  const w = hero.clientWidth;
  const gap = parseFloat(getComputedStyle(hero).getPropertyValue('--tri-gap')) || 8;
  return (((w - 2 * gap) / 3 + gap) / w) * 100;
};

mm.add('(prefers-reduced-motion: no-preference)', () => {
  hero.classList.add('is-animated');
  const center = hero.querySelector('.hero__center');
  const lines = hero.querySelectorAll('.hero__title .line > span');

  gsap.set(lines, { yPercent: 140 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: hero, start: 'top top', end: '+=130%', pin: true, scrub: 0.8, invalidateOnRefresh: true },
  });
  tl.fromTo(center, { clipPath: () => `inset(0% ${sideInset()}% 0% ${sideInset()}%)` }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, 0)
    .fromTo(center.querySelector('img'), { scale: 1.14 }, { scale: 1, duration: 1, ease: 'power2.inOut' }, 0)
    .to('.hero__panel--l', { xPercent: -18, duration: 1, ease: 'power2.inOut' }, 0)
    .to('.hero__panel--r', { xPercent: 18, duration: 1, ease: 'power2.inOut' }, 0)
    .to('.hero__season, .hero__scroll', { autoAlpha: 0, duration: 0.25 }, 0)
    .to('.hero__scrim', { autoAlpha: 1, duration: 0.6 }, 0.5)
    .to(lines, { yPercent: 0, duration: 0.55, stagger: 0.12, ease: 'power3.out' }, 0.62)
    .fromTo('.hero__meta', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.95)
    .to({}, { duration: 0.25 });

  // Entrance: the three frames rise inside their windows in sequence, once.
  gsap.from('.hero__panel--l img, .hero__center img, .hero__panel--r img', {
    yPercent: 100, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.1,
  });

  return () => hero.classList.remove('is-animated');
});

if (reducedMotion) hero.classList.add('is-static');
addEventListener('load', () => ScrollTrigger.refresh());
