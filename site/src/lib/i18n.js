// Locale + currency state, UI dictionary and money formatting.
// Prototype exchange rates (base: UZS). Replace with live rates from the backend.
const RATES = { UZS: 1, USD: 1 / 12600, RUB: 80 / 12600 };
const ROUND = { UZS: 10000, USD: 5, RUB: 100 };
const INTL = { ru: 'ru-RU', uz: 'uz-Latn-UZ', en: 'en-US' };

export const LOCALES = ['ru', 'uz', 'en'];
export const CURRENCIES = ['UZS', 'RUB', 'USD'];

const read = (k, fallback, allowed) => {
  try {
    const v = localStorage.getItem(k);
    return allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
};

export const state = {
  locale: read('fma.locale', 'ru', LOCALES),
  currency: read('fma.currency', 'UZS', CURRENCIES),
};

export function setPref(key, value) {
  try { localStorage.setItem(`fma.${key}`, value); } catch {}
  location.reload();
}

const dict = {
  ru: {
    'nav.men': 'Мужчинам', 'nav.women': 'Женщинам', 'nav.knit': 'Трикотаж', 'nav.shoes-acc': 'Обувь и аксессуары', 'nav.all': 'Все изделия',
    'nav.menu': 'Меню', 'nav.close': 'Закрыть', 'nav.search': 'Поиск', 'nav.bag': 'Корзина', 'nav.home': 'Главная',
    'pref.title': 'Язык и валюта', 'pref.lang': 'Язык', 'pref.cur': 'Валюта',
    'hero.season': 'Осень — Зима 2026', 'hero.title1': 'Тишина', 'hero.title2': 'в движении',
    'hero.capsule': 'Капсула «Известняк»', 'hero.items': '9 изделий', 'hero.cta': 'Смотреть капсулу', 'hero.scroll': 'Листайте',
    'spread.title': 'Трикотаж, который держит форму',
    'spread.body': 'Меринос, кашемир и петельный хлопок 420 г/м². Мы шьём спортивные вещи по законам портновского ремесла: стойка не заваливается, молния не морщит, плечо сидит как у пиджака.',
    'spread.cta': 'Весь трикотаж',
    'new.title': 'Новое', 'new.cta': 'Все новинки',
    'bordeaux.capsule': 'Капсула «Бордо»', 'bordeaux.line': 'Цвет вечернего Ташкента. Худи и брюки из одной ткани.', 'bordeaux.cta': 'Смотреть костюм',
    'store.title': 'Бутик в Ташкенте', 'store.body': 'Примерка, подгонка длины брюк за один день и доставка по городу на следующий день.', 'store.hours': 'Открыто до 22:00', 'store.cta': 'Как добраться', 'store.address': 'Ташкент, ул. Мукими, 20А', 'store.metro': 'Метро «Новза» — 7 минут пешком', 'store.write': 'Написать в Telegram', 'footer.channel': 'Telegram-канал', 'footer.admin': 'Написать администратору', 'guide.ask': 'Не уверены в размере? Напишите нам — подберём.',
    'plp.items': ['изделие', 'изделия', 'изделий'], 'plp.filter': 'Фильтры', 'plp.view': 'Вид', 'plp.shown': 'Показано {n} из {total}', 'plp.more': 'Показать ещё',
    'plp.empty': 'Ничего не нашлось. Попробуйте снять фильтры.', 'plp.reset': 'Сбросить всё', 'plp.apply': 'Показать', 'plp.sort': 'Сортировка', 'plp.size': 'Размер', 'plp.color': 'Цвет', 'plp.category': 'Категория',
    'sort.featured': 'Рекомендуем', 'sort.new': 'Сначала новые', 'sort.asc': 'Цена по возрастанию', 'sort.desc': 'Цена по убыванию',
    'plp.look': 'Образ', 'plp.colors': ['цвет', 'цвета', 'цветов'], 'plp.remove': 'Убрать фильтр', 'plp.search': 'Результаты: «{q}»',
    'badge.new': 'Новинка', 'badge.low': 'Осталось мало',
    'pdp.color': 'Цвет', 'pdp.size': 'Размер', 'pdp.guide': 'Таблица размеров', 'pdp.add': 'Добавить в корзину', 'pdp.added': 'Добавлено', 'pdp.select': 'Выберите размер',
    'pdp.notify': 'Сообщить о поступлении', 'pdp.notified': 'Сообщим, когда размер появится', 'pdp.oos': 'нет в наличии', 'pdp.low': 'осталось мало',
    'pdp.delivery': 'Доставка по Ташкенту на следующий день. Возврат в течение 14 дней.',
    'pdp.desc': 'Описание', 'pdp.comp': 'Состав и уход', 'pdp.fit': 'Посадка', 'pdp.ship': 'Доставка и возврат',
    'pdp.shipText': 'Ташкент — курьером на следующий день, бесплатно от 3 000 000 сум. Регионы Узбекистана — 2–4 дня. Россия и СНГ — 5–9 дней. Вернуть или обменять изделие можно в течение 14 дней в бутике или курьером.',
    'pdp.complete': 'Дополнить образ', 'pdp.like': 'Вам может понравиться', 'pdp.photo': 'Фото {n} из {total}', 'pdp.sticky': 'В корзину',
    'guide.title': 'Таблица размеров', 'guide.note': 'Мерки тела в сантиметрах. Если вы между размерами, для свободной посадки выбирайте больший.',
    'guide.chest': 'Обхват груди', 'guide.waist': 'Обхват талии', 'guide.height': 'Рост', 'guide.foot': 'Длина стопы, см',
    'cart.title': 'Корзина', 'cart.empty': 'В корзине пока ничего нет.', 'cart.toShop': 'Перейти в каталог', 'cart.subtotal': 'Сумма', 'cart.checkout': 'Оформить заказ',
    'cart.free': 'До бесплатной доставки по Ташкенту осталось {sum}', 'cart.freeOk': 'Доставка по Ташкенту бесплатно', 'cart.remove': 'Удалить', 'cart.qty': 'Количество',
    'cart.size': 'Размер', 'cart.color': 'Цвет', 'cart.note': 'Оформление заказа подключается на платформе (Shopify Checkout). В прототипе этот шаг отключён.',
    'cart.added': '{title} добавлен в корзину', 'cart.dec': 'Меньше', 'cart.inc': 'Больше',
    'search.label': 'Что вы ищете?', 'search.placeholder': 'Худи, меринос, кроссовки…', 'search.hint': 'Часто ищут', 'search.none': 'Ничего не нашлось по запросу «{q}».', 'search.all': 'Все результаты',
    'footer.help': 'Помощь', 'footer.delivery': 'Доставка', 'footer.returns': 'Возврат и обмен', 'footer.care': 'Уход за изделиями', 'footer.company': 'Компания', 'footer.about': 'О бренде', 'footer.store': 'Бутик', 'footer.contacts': 'Контакты',
    'footer.legal': '© 2026 222 FMA. Прототип для презентации — цены и наличие условные.',
    'shot.look': 'образ', 'shot.front': 'вид спереди', 'shot.back': 'вид сзади', 'shot.detail': 'деталь', 'shot.street': 'на улице',
    'skip': 'Перейти к содержимому',
  },
  en: {
    'nav.men': 'Men', 'nav.women': 'Women', 'nav.knit': 'Knitwear', 'nav.shoes-acc': 'Shoes & accessories', 'nav.all': 'All pieces',
    'nav.menu': 'Menu', 'nav.close': 'Close', 'nav.search': 'Search', 'nav.bag': 'Bag', 'nav.home': 'Home',
    'pref.title': 'Language & currency', 'pref.lang': 'Language', 'pref.cur': 'Currency',
    'hero.season': 'Autumn — Winter 2026', 'hero.title1': 'Silence', 'hero.title2': 'in motion',
    'hero.capsule': 'The Limestone capsule', 'hero.items': '9 pieces', 'hero.cta': 'View the capsule', 'hero.scroll': 'Scroll',
    'spread.title': 'Knitwear that holds its shape',
    'spread.body': 'Merino, cashmere and 420 gsm loopback cotton. We build sportswear by the rules of tailoring: collars that stand, zips that lie flat, shoulders that sit like a jacket.',
    'spread.cta': 'All knitwear',
    'new.title': 'New in', 'new.cta': 'All new pieces',
    'bordeaux.capsule': 'The Bordeaux capsule', 'bordeaux.line': 'The colour of Tashkent at dusk. Hoodie and trousers in one fabric.', 'bordeaux.cta': 'View the set',
    'store.title': 'Our Tashkent boutique', 'store.body': 'Fittings, same-day trouser hemming and next-day delivery across the city.', 'store.hours': 'Open until 22:00', 'store.cta': 'Directions', 'store.address': '20A Muqimiy St, Tashkent', 'store.metro': 'Novza metro — 7 min walk', 'store.write': 'Message us on Telegram', 'footer.channel': 'Telegram channel', 'footer.admin': 'Message the team', 'guide.ask': 'Not sure about your size? Message us and we’ll help.',
    'plp.items': ['piece', 'pieces'], 'plp.filter': 'Filter', 'plp.view': 'View', 'plp.shown': 'Showing {n} of {total}', 'plp.more': 'Load more',
    'plp.empty': 'Nothing found. Try removing some filters.', 'plp.reset': 'Clear all', 'plp.apply': 'Show', 'plp.sort': 'Sort', 'plp.size': 'Size', 'plp.color': 'Colour', 'plp.category': 'Category',
    'sort.featured': 'Featured', 'sort.new': 'Newest', 'sort.asc': 'Price, low to high', 'sort.desc': 'Price, high to low',
    'plp.look': 'Look', 'plp.colors': ['colour', 'colours'], 'plp.remove': 'Remove filter', 'plp.search': 'Results for “{q}”',
    'badge.new': 'New', 'badge.low': 'Low stock',
    'pdp.color': 'Colour', 'pdp.size': 'Size', 'pdp.guide': 'Size guide', 'pdp.add': 'Add to bag', 'pdp.added': 'Added', 'pdp.select': 'Select a size',
    'pdp.notify': 'Notify me', 'pdp.notified': 'We’ll let you know when it’s back', 'pdp.oos': 'out of stock', 'pdp.low': 'low stock',
    'pdp.delivery': 'Next-day delivery in Tashkent. Returns within 14 days.',
    'pdp.desc': 'Description', 'pdp.comp': 'Composition & care', 'pdp.fit': 'Fit', 'pdp.ship': 'Delivery & returns',
    'pdp.shipText': 'Tashkent — next-day courier, free over UZS 3,000,000. Uzbekistan regions — 2–4 days. Russia & CIS — 5–9 days. Return or exchange within 14 days in store or by courier.',
    'pdp.complete': 'Complete the look', 'pdp.like': 'You may also like', 'pdp.photo': 'Image {n} of {total}', 'pdp.sticky': 'Add to bag',
    'guide.title': 'Size guide', 'guide.note': 'Body measurements in centimetres. Between sizes? Size up for a relaxed fit.',
    'guide.chest': 'Chest', 'guide.waist': 'Waist', 'guide.height': 'Height', 'guide.foot': 'Foot length, cm',
    'cart.title': 'Bag', 'cart.empty': 'Your bag is empty.', 'cart.toShop': 'Go to catalogue', 'cart.subtotal': 'Subtotal', 'cart.checkout': 'Checkout',
    'cart.free': '{sum} away from free Tashkent delivery', 'cart.freeOk': 'Free delivery in Tashkent', 'cart.remove': 'Remove', 'cart.qty': 'Quantity',
    'cart.size': 'Size', 'cart.color': 'Colour', 'cart.note': 'Checkout is handled by the platform (Shopify Checkout). This step is disabled in the prototype.',
    'cart.added': '{title} added to bag', 'cart.dec': 'Decrease', 'cart.inc': 'Increase',
    'search.label': 'What are you looking for?', 'search.placeholder': 'Hoodie, merino, sneakers…', 'search.hint': 'Popular', 'search.none': 'Nothing found for “{q}”.', 'search.all': 'All results',
    'footer.help': 'Help', 'footer.delivery': 'Delivery', 'footer.returns': 'Returns', 'footer.care': 'Garment care', 'footer.company': 'Company', 'footer.about': 'About', 'footer.store': 'Boutique', 'footer.contacts': 'Contact',
    'footer.legal': '© 2026 222 FMA. Presentation prototype — prices and stock are illustrative.',
    'shot.look': 'look', 'shot.front': 'front', 'shot.back': 'back', 'shot.detail': 'detail', 'shot.street': 'street',
    'skip': 'Skip to content',
  },
  uz: {
    'nav.men': 'Erkaklar', 'nav.women': 'Ayollar', 'nav.knit': 'Trikotaj', 'nav.shoes-acc': 'Poyabzal va aksessuarlar', 'nav.all': 'Barcha mahsulotlar',
    'nav.menu': 'Menyu', 'nav.close': 'Yopish', 'nav.search': 'Qidiruv', 'nav.bag': 'Savat', 'nav.home': 'Bosh sahifa',
    'pref.title': 'Til va valyuta', 'pref.lang': 'Til', 'pref.cur': 'Valyuta',
    'hero.season': 'Kuz — Qish 2026', 'hero.title1': 'Harakatdagi', 'hero.title2': 'sukunat',
    'hero.capsule': '“Ohaktosh” kapsulasi', 'hero.items': '9 ta mahsulot', 'hero.cta': 'Kapsulani koʻrish', 'hero.scroll': 'Pastga',
    'spread.title': 'Shaklini saqlaydigan trikotaj',
    'spread.body': 'Merinos, kashemir va 420 g/m² paxta. Sport kiyimlarini tikuvchilik qoidalari asosida tikamiz: yoqa turadi, molniya burishmaydi, yelka pidjakdek oʻtiradi.',
    'spread.cta': 'Barcha trikotaj',
    'new.title': 'Yangi', 'new.cta': 'Barcha yangiliklar',
    'bordeaux.capsule': '“Bordo” kapsulasi', 'bordeaux.line': 'Kechki Toshkent rangi. Xudi va shim bir matodan.', 'bordeaux.cta': 'Kostyumni koʻrish',
    'store.title': 'Toshkentdagi butik', 'store.body': 'Kiyib koʻrish, shim uzunligini bir kunda moslash va shahar boʻylab ertasi kuni yetkazib berish.', 'store.hours': '22:00 gacha ochiq', 'store.cta': 'Qanday borish mumkin', 'store.address': 'Toshkent, Muqimiy koʻchasi, 20A', 'store.metro': '“Novza” metrosi — 7 daqiqa piyoda', 'store.write': 'Telegramda yozish', 'footer.channel': 'Telegram kanal', 'footer.admin': 'Administratorga yozish', 'guide.ask': 'Oʻlchamni bilmayapsizmi? Bizga yozing — tanlab beramiz.',
    'plp.items': ['ta mahsulot', 'ta mahsulot'], 'plp.filter': 'Filtrlar', 'plp.view': 'Koʻrinish', 'plp.shown': '{total} tadan {n} tasi', 'plp.more': 'Yana koʻrsatish',
    'plp.empty': 'Hech narsa topilmadi. Filtrlarni olib tashlang.', 'plp.reset': 'Tozalash', 'plp.apply': 'Koʻrsatish', 'plp.sort': 'Saralash', 'plp.size': 'Oʻlcham', 'plp.color': 'Rang', 'plp.category': 'Toifa',
    'sort.featured': 'Tavsiya', 'sort.new': 'Avval yangilari', 'sort.asc': 'Narx: arzonidan', 'sort.desc': 'Narx: qimmatidan',
    'plp.look': 'Obraz', 'plp.colors': ['rang', 'rang'], 'plp.remove': 'Filtrni olib tashlash', 'plp.search': '“{q}” boʻyicha natijalar',
    'badge.new': 'Yangi', 'badge.low': 'Kam qoldi',
    'pdp.color': 'Rang', 'pdp.size': 'Oʻlcham', 'pdp.guide': 'Oʻlchamlar jadvali', 'pdp.add': 'Savatga qoʻshish', 'pdp.added': 'Qoʻshildi', 'pdp.select': 'Oʻlchamni tanlang',
    'pdp.notify': 'Kelganda xabar berish', 'pdp.notified': 'Oʻlcham kelganda xabar beramiz', 'pdp.oos': 'mavjud emas', 'pdp.low': 'kam qoldi',
    'pdp.delivery': 'Toshkent boʻylab ertasi kuni yetkazib berish. 14 kun ichida qaytarish.',
    'pdp.desc': 'Tavsif', 'pdp.comp': 'Tarkibi va parvarish', 'pdp.fit': 'Bichim', 'pdp.ship': 'Yetkazish va qaytarish',
    'pdp.shipText': 'Toshkent — ertasi kuni kuryer, 3 000 000 soʻmdan bepul. Oʻzbekiston viloyatlari — 2–4 kun. Rossiya va MDH — 5–9 kun. 14 kun ichida qaytarish yoki almashtirish mumkin.',
    'pdp.complete': 'Obrazni toʻldiring', 'pdp.like': 'Sizga yoqishi mumkin', 'pdp.photo': '{total} tadan {n}-surat', 'pdp.sticky': 'Savatga',
    'guide.title': 'Oʻlchamlar jadvali', 'guide.note': 'Tana oʻlchamlari santimetrda. Ikki oʻlcham orasida boʻlsangiz, kattasini tanlang.',
    'guide.chest': 'Koʻkrak', 'guide.waist': 'Bel', 'guide.height': 'Boʻy', 'guide.foot': 'Oyoq uzunligi, sm',
    'cart.title': 'Savat', 'cart.empty': 'Savat hozircha boʻsh.', 'cart.toShop': 'Katalogga oʻtish', 'cart.subtotal': 'Jami', 'cart.checkout': 'Buyurtma berish',
    'cart.free': 'Toshkent boʻylab bepul yetkazishgacha {sum} qoldi', 'cart.freeOk': 'Toshkent boʻylab bepul yetkazish', 'cart.remove': 'Oʻchirish', 'cart.qty': 'Soni',
    'cart.size': 'Oʻlcham', 'cart.color': 'Rang', 'cart.note': 'Buyurtma platformada (Shopify Checkout) rasmiylashtiriladi. Prototipda bu qadam oʻchirilgan.',
    'cart.added': '{title} savatga qoʻshildi', 'cart.dec': 'Kamaytirish', 'cart.inc': 'Koʻpaytirish',
    'search.label': 'Nima qidiryapsiz?', 'search.placeholder': 'Xudi, merinos, krossovka…', 'search.hint': 'Koʻp qidiriladi', 'search.none': '“{q}” boʻyicha hech narsa topilmadi.', 'search.all': 'Barcha natijalar',
    'footer.help': 'Yordam', 'footer.delivery': 'Yetkazib berish', 'footer.returns': 'Qaytarish', 'footer.care': 'Parvarish', 'footer.company': 'Kompaniya', 'footer.about': 'Brend haqida', 'footer.store': 'Butik', 'footer.contacts': 'Aloqa',
    'footer.legal': '© 2026 222 FMA. Taqdimot uchun prototip — narxlar va mavjudlik shartli.',
    'shot.look': 'obraz', 'shot.front': 'old tomondan', 'shot.back': 'orqa tomondan', 'shot.detail': 'detal', 'shot.street': 'koʻchada',
    'skip': 'Asosiy qismga oʻtish',
  },
};

export function t(key, vars = {}) {
  const raw = dict[state.locale][key] ?? dict.ru[key] ?? key;
  return typeof raw === 'string' ? raw.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') : raw;
}

const plural = new Intl.PluralRules(INTL.ru);
export function count(n, key) {
  const forms = t(key);
  if (state.locale === 'ru') {
    const idx = { one: 0, few: 1, many: 2, other: 2 }[plural.select(n)];
    return `${n} ${forms[idx]}`;
  }
  if (state.locale === 'uz') return `${n} ${forms[0]}`;
  return `${n} ${n === 1 ? forms[0] : forms[1]}`;
}

/** Pick a localized field from {ru, en, uz}; falls back to ru. */
export const L = (field) => (field ? field[state.locale] ?? field.ru : '');

export const intlLocale = () => INTL[state.locale];

export function convert(uzs, currency = state.currency) {
  const step = ROUND[currency];
  return Math.round((uzs * RATES[currency]) / step) * step;
}

export function money(uzs, currency = state.currency) {
  const amount = convert(uzs, currency);
  const loc = intlLocale();
  if (currency === 'UZS') {
    const n = new Intl.NumberFormat(loc === 'en-US' ? 'en-US' : 'ru-RU', { maximumFractionDigits: 0 }).format(amount);
    if (state.locale === 'en') return `UZS ${n}`;
    return `${n} ${state.locale === 'uz' ? 'soʻm' : 'сум'}`;
  }
  return new Intl.NumberFormat(loc === 'uz-Latn-UZ' ? 'ru-RU' : loc, {
    style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0,
  }).format(amount);
}

export const colorName = (COLORS, key) => L(COLORS[key].name);

document.documentElement.lang = state.locale;
