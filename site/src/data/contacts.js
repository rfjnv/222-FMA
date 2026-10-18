// Real 222 FMA contacts (boutique on Yandex Maps, Telegram, Instagram).
export const CONTACTS = {
  phone: '+998 80 222 02 22',
  phoneHref: 'tel:+998802220222',
  map: 'https://yandex.uz/maps/org/222fma/244978226855/',
  telegramChannel: { handle: '@fma222_uz', href: 'https://t.me/fma222_uz' },
  telegramAdmin: { handle: '@fma222admin', href: 'https://t.me/fma222admin' },
  instagram: { handle: '@222fma.uz', href: 'https://www.instagram.com/222fma.uz/' },
};

export const ext = (href, label, cls = 'u-link') =>
  `<a class="${cls}" href="${href}" target="_blank" rel="noopener">${label}</a>`;
