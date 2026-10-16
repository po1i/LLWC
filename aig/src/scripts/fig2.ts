// Fig. 2 draws itself once, when it is mostly in view.
document.documentElement.classList.add('js');
const fig = document.querySelector<HTMLElement>('[data-fig2]');
if (fig) {
  if (!('IntersectionObserver' in window)) fig.classList.add('is-drawn');
  else {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        fig.classList.add('is-drawn');
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(fig);
  }
}
