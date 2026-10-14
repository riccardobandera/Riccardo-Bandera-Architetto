// Strisce da scorrere a destra su telefono (classe .m-strip, stili in global.css).
// [data-strip-next="id"]: il tasto "Scorri" porta avanti di una scheda, in fondo torna all'inizio.
// Col mouse (finestra stretta sul computer) la striscia si trascina.
const isStrip = (el: HTMLElement) => getComputedStyle(el).display === 'flex' && el.scrollWidth > el.clientWidth;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLButtonElement>('[data-strip-next]').forEach((btn) => {
  const strip = document.getElementById(btn.dataset.stripNext || '');
  if (!strip) return;
  btn.addEventListener('click', () => {
    const first = Array.from(strip.children).find((c) => (c as HTMLElement).offsetWidth > 0) as HTMLElement | undefined;
    const step = (first?.offsetWidth ?? strip.clientWidth * 0.8) + 16;
    const max = strip.scrollWidth - strip.clientWidth;
    strip.scrollTo({ left: strip.scrollLeft >= max - 4 ? 0 : strip.scrollLeft + step, behavior: reduce ? 'auto' : 'smooth' });
  });
});

document.querySelectorAll<HTMLElement>('.m-strip').forEach((strip) => {
  let x = 0, left = 0, down = false, moved = false, noClick = false;
  strip.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !isStrip(strip)) return;
    down = true; moved = false; x = e.clientX; left = strip.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - x;
    if (!moved && Math.abs(dx) > 5) { moved = true; strip.classList.add('is-drag'); }
    if (moved) { e.preventDefault(); strip.scrollLeft = left - dx; }
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    if (moved) { strip.classList.remove('is-drag'); noClick = true; setTimeout(() => (noClick = false), 0); }
  });
  // dopo un trascinamento il clic non apre il progetto
  strip.addEventListener('click', (e) => { if (noClick) { e.preventDefault(); e.stopPropagation(); } }, { capture: true });
  strip.addEventListener('dragstart', (e) => { if (isStrip(strip)) e.preventDefault(); });
});
