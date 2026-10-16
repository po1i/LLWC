// Progressive enhancement for Fig. 1. Level switching already works without
// this file (native radios + CSS :has). This adds drag, number keys,
// Home/End, a settled-level announcement, replay after drag, a one-time
// nudge, and keeps the figure from animating while off-screen.

const demo = document.querySelector<HTMLElement>('[data-demo]');

if (demo) {
  const radios = Array.from(demo.querySelectorAll<HTMLInputElement>('input[name="level"]'));
  const scale = demo.querySelector<HTMLElement>('[data-scale]')!;
  const rail = demo.querySelector<HTMLElement>('[data-rail]')!;
  const carriage = demo.querySelector<HTMLElement>('[data-carriage]')!;
  const live = demo.querySelector<HTMLElement>('[data-live]')!;
  const fig = demo.querySelector<HTMLElement>('[data-fig]')!;
  const layers = Array.from(demo.querySelectorAll<SVGGElement>('[data-layer]'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const total = radios.length;
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

  let current = Number(radios.find((r) => r.checked)?.value ?? 1);
  let touched = false;
  let announceTimer = 0;

  const markCurrent = () => {
    layers.forEach((g) => g.toggleAttribute('data-current', Number(g.dataset.layer) === current));
  };

  const announce = () => {
    clearTimeout(announceTimer);
    announceTimer = window.setTimeout(() => {
      const label = radios[current - 1].dataset.label;
      live.textContent = `Now showing: ${label}, level ${current} of ${total}.`;
    }, 350);
  };

  const select = (n: number, opts: { focus?: boolean; quiet?: boolean } = {}) => {
    n = clamp(n, 1, total);
    const r = radios[n - 1];
    if (!r.checked) r.checked = true;
    if (opts.focus) r.focus();
    if (n === current) return;
    current = n;
    demo.dataset.lvl = String(n);
    markCurrent();
    if (!opts.quiet) announce();
  };

  demo.dataset.lvl = String(current);
  markCurrent();

  radios.forEach((r) =>
    r.addEventListener('change', () => {
      touched = true;
      select(Number(r.value));
    }),
  );

  // Number keys jump straight to a level; Home and End go to the ends.
  scale.addEventListener('keydown', (e) => {
    let n = 0;
    if (/^[1-9]$/.test(e.key)) n = Number(e.key);
    else if (e.key === 'Home') n = 1;
    else if (e.key === 'End') n = total;
    if (!n || n > total) return;
    e.preventDefault();
    touched = true;
    select(n, { focus: true });
  });

  // Drag: the ribbon follows the pointer 1:1 and readings swap instantly at
  // each midpoint. On release the ribbon snaps and the reading resolves once.
  let drag: { id: number; x0: number; active: boolean } | null = null;
  let suppressClick = false;

  const levelAt = (clientX: number) => {
    const r = rail.getBoundingClientRect();
    const f = clamp((clientX - r.left) / r.width, 0, 0.9999);
    return { f, n: Math.floor(f * total) + 1, width: r.width };
  };

  scale.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    drag = { id: e.pointerId, x0: e.clientX, active: false };
  });

  scale.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.active) {
      if (Math.abs(e.clientX - drag.x0) < 6) return;
      drag.active = true;
      touched = true;
      scale.setPointerCapture(e.pointerId);
      demo.classList.add('is-dragging');
    }
    const { f, n, width } = levelAt(e.clientX);
    const lo = 0.5 / total, hi = 1 - lo;
    carriage.style.transform = `translateX(${(clamp(f, lo, hi) - lo) * width}px)`;
    select(n, { quiet: true });
  });

  const endDrag = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const wasActive = drag.active;
    drag = null;
    if (!wasActive) return;
    suppressClick = true;
    carriage.style.transform = '';
    demo.classList.remove('is-dragging');
    radios[current - 1].focus({ preventScroll: true });
    if (!reduce.matches) {
      demo.classList.add('replay');
      void demo.offsetWidth;
      demo.classList.remove('replay');
    }
    announce();
  };
  scale.addEventListener('pointerup', endDrag);
  scale.addEventListener('pointercancel', endDrag);
  scale.addEventListener(
    'click',
    (e) => {
      if (suppressClick) {
        e.preventDefault();
        suppressClick = false;
      }
    },
    true,
  );

  // Never play the figure's drawing while it is off-screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => fig.classList.toggle('fig-offscreen', !entry.isIntersecting),
      { threshold: 0.35 },
    ).observe(fig);

    // One quiet hint that the ribbon moves, only if nobody has touched it.
    const nudgeIO = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        nudgeIO.disconnect();
        if (reduce.matches) return;
        window.setTimeout(() => {
          if (touched) return;
          demo.classList.add('nudge');
          window.setTimeout(() => demo.classList.remove('nudge'), 1000);
        }, 800);
      },
      { threshold: 0.5 },
    );
    nudgeIO.observe(scale);
  }
}
