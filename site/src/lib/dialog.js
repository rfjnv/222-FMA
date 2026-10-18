// Accessible slide-in panels: focus trap, Esc to close, focus restore, scroll lock.
import { lenis } from './motion.js';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
let open = null;

export function createPanel(el, { onOpen, initialFocus } = {}) {
  let returnTo = null;
  const backdrop = el.previousElementSibling?.classList.contains('backdrop') ? el.previousElementSibling : null;

  const api = {
    el,
    isOpen: () => open === api,
    open(trigger) {
      if (open && open !== api) open.close(false);
      returnTo = trigger || document.activeElement;
      el.hidden = false;
      if (backdrop) backdrop.hidden = false;
      requestAnimationFrame(() => {
        el.classList.add('is-open');
        backdrop?.classList.add('is-open');
      });
      document.documentElement.classList.add('is-locked');
      lenis?.stop();
      open = api;
      onOpen?.();
      const target = (initialFocus && el.querySelector(initialFocus)) || el.querySelector(FOCUSABLE);
      setTimeout(() => target?.focus({ preventScroll: true }), 60);
    },
    close(restore = true) {
      if (open !== api) return;
      el.classList.remove('is-open');
      backdrop?.classList.remove('is-open');
      document.documentElement.classList.remove('is-locked');
      lenis?.start();
      open = null;
      const done = () => { if (open !== api) { el.hidden = true; if (backdrop) backdrop.hidden = true; } };
      el.addEventListener('transitionend', done, { once: true });
      setTimeout(done, 700);
      if (restore) returnTo?.focus?.({ preventScroll: true });
    },
  };

  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); api.close(); }
    if (e.key !== 'Tab') return;
    const items = [...el.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  backdrop?.addEventListener('click', () => api.close());
  el.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => api.close()));
  return api;
}
