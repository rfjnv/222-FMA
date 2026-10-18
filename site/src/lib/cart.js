// Tiny cart store persisted in localStorage. Lines are keyed by handle|color|size.
import { bySlug } from '../data/products.js';

const KEY = 'fma.cart';
const listeners = new Set();

function load() {
  try {
    const lines = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(lines) ? lines.filter((l) => bySlug(l.handle)) : [];
  } catch {
    return [];
  }
}

let lines = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  listeners.forEach((fn) => fn(lines));
}

const id = (l) => `${l.handle}|${l.color}|${l.size}`;

export const cart = {
  get lines() { return lines; },
  get count() { return lines.reduce((n, l) => n + l.qty, 0); },
  get subtotal() { return lines.reduce((s, l) => s + bySlug(l.handle).price * l.qty, 0); },
  add(handle, color, size) {
    const line = lines.find((l) => id(l) === `${handle}|${color}|${size}`);
    if (line) line.qty = Math.min(line.qty + 1, 9);
    else lines = [{ handle, color, size, qty: 1 }, ...lines];
    save();
  },
  setQty(key, qty) {
    lines = qty < 1 ? lines.filter((l) => id(l) !== key) : lines.map((l) => (id(l) === key ? { ...l, qty: Math.min(qty, 9) } : l));
    save();
  },
  remove(key) { this.setQty(key, 0); },
  key: id,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};
