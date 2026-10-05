import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Smooth scrolling with Lenis. Skipped entirely under reduced motion, so the
// page falls back to plain native scrolling. Touch scrolling stays native
// (syncTouch is off), which keeps phones feeling like phones.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  const lenis = new Lenis({
    autoRaf: true,
    lerp: 0.09,
    wheelMultiplier: 1,
    stopInertiaOnNavigate: true,
  });

  // In-page links: animate with Lenis, then move focus to the target so
  // keyboard and screen-reader users land where the link points.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = decodeURIComponent(link.hash.slice(1));
    const target = id === 'top' || id === '' ? document.body : document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    lenis.scrollTo(target === document.body ? 0 : target, {
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      onComplete: () => {
        if (target === document.body) return;
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      },
    });
    history.pushState(null, '', `#${id}`);
  });
}
