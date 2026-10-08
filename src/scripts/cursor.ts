// Custom cursor and magnetic buttons. Only for a real mouse (hover + fine
// pointer) and only without reduced motion. Everything moves with transforms.
// If this script never runs, the native cursor and static buttons remain.

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

if (finePointer && !reduce) {
  const root = document.documentElement;

  /* ── Cursor ───────────────────────────────────── */
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring, dot);
  root.classList.add('has-cursor');

  const pos = { x: -100, y: -100 };
  const ringPos = { x: -100, y: -100 };
  let raf = 0;
  let visible = false;

  const INTERACTIVE = 'a, button, summary, label, [role="button"]';
  const TEXT = 'input:not([type="radio"]):not([type="checkbox"]), textarea, select, [contenteditable]';

  const tick = () => {
    ringPos.x = lerp(ringPos.x, pos.x, 0.2);
    ringPos.y = lerp(ringPos.y, pos.y, 0.2);
    dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    const settled = Math.abs(ringPos.x - pos.x) < 0.1 && Math.abs(ringPos.y - pos.y) < 0.1;
    raf = settled ? 0 : requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    pos.x = e.clientX;
    pos.y = e.clientY;
    if (!visible) {
      ringPos.x = pos.x;
      ringPos.y = pos.y;
      root.classList.add('cursor-visible');
      visible = true;
    }
    kick();
  }, { passive: true });

  document.addEventListener('pointerover', (e) => {
    const t = e.target as Element;
    root.classList.toggle('cursor-text', !!t.closest(TEXT));
    root.classList.toggle('cursor-btn', !!t.closest('.btn'));
    root.classList.toggle('cursor-btn-primary', !!t.closest('.btn--primary'));
    root.classList.toggle('cursor-link', !t.closest('.btn') && !!t.closest(INTERACTIVE));
  });
  document.addEventListener('pointerdown', () => root.classList.add('cursor-down'));
  document.addEventListener('pointerup', () => root.classList.remove('cursor-down'));
  document.documentElement.addEventListener('pointerleave', () => {
    root.classList.remove('cursor-visible');
    visible = false;
  });

  /* ── Magnetic buttons ─────────────────────────── */
  type Mag = { el: HTMLElement; inner: HTMLElement | null; x: number; y: number; tx: number; ty: number; raf: number };

  const animate = (m: Mag) => {
    m.x = lerp(m.x, m.tx, 0.18);
    m.y = lerp(m.y, m.ty, 0.18);
    m.el.style.setProperty('--mx', `${m.x.toFixed(2)}px`);
    m.el.style.setProperty('--my', `${m.y.toFixed(2)}px`);
    m.el.style.setProperty('--ix', `${(m.x * 0.45).toFixed(2)}px`);
    m.el.style.setProperty('--iy', `${(m.y * 0.45).toFixed(2)}px`);
    const done = Math.abs(m.x - m.tx) < 0.05 && Math.abs(m.y - m.ty) < 0.05;
    if (done && m.tx === 0 && m.ty === 0) {
      m.x = 0;
      m.y = 0;
      ['--mx', '--my', '--ix', '--iy'].forEach((v) => m.el.style.removeProperty(v));
    }
    m.raf = done ? 0 : requestAnimationFrame(() => animate(m));
  };

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const m: Mag = { el, inner: el.querySelector('.btn__inner'), x: 0, y: 0, tx: 0, ty: 0, raf: 0 };
    const start = () => { if (!m.raf) m.raf = requestAnimationFrame(() => animate(m)); };

    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      // Wide buttons pull less, so full-width buttons don't slide around.
      const reach = Math.min(10, 2400 / Math.max(r.width, 1));
      m.tx = ((e.clientX - r.left) / r.width - 0.5) * 2 * reach;
      m.ty = ((e.clientY - r.top) / r.height - 0.5) * 2 * reach * 0.6;
      start();
    });
    el.addEventListener('pointerleave', () => {
      m.tx = 0;
      m.ty = 0;
      start();
    });
  });
}
