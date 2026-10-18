# 222 FMA — storefront prototype

Art-directed e-commerce prototype for 222 FMA (Tashkent): home with the "Triptych 2·2·2" scroll moment, catalog, product page and slide-in bag. RU / UZ / EN, UZS / RUB / USD.

```bash
cd site
npm install
npm run dev        # http://localhost:5222
```

- `site/` — Vite multi-page app (vanilla JS, GSAP + ScrollTrigger, Lenis)
- `site/public/img/` — WebP renditions (480/960/1600) generated from `media/`
- `site/scripts/shots.mjs` — critique screenshots at 1440/1024/390 via installed Edge (`playwright-core`)

Prices, exchange rates, stock and the boutique address are placeholders for the presentation.
