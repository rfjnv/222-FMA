// Responsive image markup. All shoot images are 3:4 portraits exported as
// /img/fNN-{480,960,1600}.webp by the build script.
const pad = (i) => String(i).padStart(2, '0');

export const src = (i, w = 960) => `img/f${pad(i)}-${w}.webp`;

export const srcset = (i) => [480, 960, 1600].map((w) => `${src(i, w)} ${w}w`).join(', ');

/**
 * @param {object} im  image record { i, fx, fy, z }
 * @param {object} o   { alt, sizes, eager, className, crop } — crop=true applies the zoom crop
 */
export function picture(im, o = {}) {
  const { alt = '', sizes = '100vw', eager = false, className = '', crop = false } = o;
  const z = crop ? im.z ?? 1 : 1;
  const style = [
    `object-position:${(im.fx ?? 0.5) * 100}% ${(im.fy ?? 0.5) * 100}%`,
    z !== 1 ? `transform-origin:${(im.fx ?? 0.5) * 100}% ${(im.fy ?? 0.5) * 100}%;--z:${z}` : '',
  ].filter(Boolean).join(';');
  return `<img class="${className}${z !== 1 ? ' is-cropped' : ''}" src="${src(im.i)}" srcset="${srcset(im.i)}" sizes="${sizes}"
    width="1920" height="2560" alt="${alt.replace(/"/g, '&quot;')}" style="${style}"
    ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
}
