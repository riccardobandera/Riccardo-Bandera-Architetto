// Lightbox globale delle gallerie dei progetti: clic su una foto per aprirla a schermo intero,
// poi zoom (clic, rotella, pizzico, pulsanti +/-) e trascinamento per spostarsi nella foto.
// Lavora per delega di eventi, quindi funziona anche nella finestra di /progetti dove il
// contenuto del progetto viene iniettato e i suoi script non partono.

type Slide = { src: string; alt: string };

const MAX = 5;
let root: HTMLDivElement | null = null;
let img: HTMLImageElement;
let stage: HTMLDivElement;
let counter: HTMLElement;
let btnIn: HTMLButtonElement;
let btnOut: HTMLButtonElement;
let slides: Slide[] = [];
let cur = 0;
let prevOverflow = '';
let lastFocus: Element | null = null;

// stato dello zoom: scala e spostamento (in px) rispetto alla foto centrata
let s = 1, tx = 0, ty = 0;

const icon = (d: string, size = 22) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="${d}"/></svg>`;

function build() {
  root = document.createElement('div');
  root.className = 'glb';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Immagine ingrandita');
  root.innerHTML = `
    <div class="glb-stage" data-glb-stage><img class="glb-img" alt="" draggable="false" /></div>
    <div class="glb-bar">
      <span class="glb-count" data-glb-count></span>
      <span class="glb-tools">
        <button type="button" class="glb-btn" data-glb-out aria-label="Riduci">${icon('M5 12h14')}</button>
        <button type="button" class="glb-btn" data-glb-in aria-label="Ingrandisci">${icon('M12 5v14M5 12h14')}</button>
        <button type="button" class="glb-btn" data-glb-close aria-label="Chiudi">${icon('M6 6l12 12M18 6L6 18')}</button>
      </span>
    </div>
    <button type="button" class="glb-nav glb-prev" data-glb-prev aria-label="Foto precedente">${icon('M15 6l-6 6 6 6', 30)}</button>
    <button type="button" class="glb-nav glb-next" data-glb-next aria-label="Foto successiva">${icon('M9 6l6 6-6 6', 30)}</button>`;
  document.body.appendChild(root);
  stage = root.querySelector('[data-glb-stage]')!;
  img = root.querySelector('.glb-img')!;
  counter = root.querySelector('[data-glb-count]')!;
  btnIn = root.querySelector('[data-glb-in]')!;
  btnOut = root.querySelector('[data-glb-out]')!;
  root.querySelector('[data-glb-close]')!.addEventListener('click', close);
  root.querySelector('[data-glb-prev]')!.addEventListener('click', () => go(-1));
  root.querySelector('[data-glb-next]')!.addEventListener('click', () => go(1));
  btnIn.addEventListener('click', () => zoomAt(s * 1.6));
  btnOut.addEventListener('click', () => zoomAt(s / 1.6));
  bindGestures();
}

// ---------- zoom ----------
function clamp() {
  // la foto zoomata non si stacca dai bordi: lo spostamento massimo e la parte che esce dallo schermo
  const mx = Math.max(0, (img.offsetWidth * s - stage.clientWidth) / 2);
  const my = Math.max(0, (img.offsetHeight * s - stage.clientHeight) / 2);
  tx = Math.min(mx, Math.max(-mx, tx));
  ty = Math.min(my, Math.max(-my, ty));
}
function apply(animate = false) {
  clamp();
  img.style.transition = animate ? 'transform 0.35s cubic-bezier(0.16,1,0.3,1)' : 'none';
  img.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  root!.classList.toggle('is-zoomed', s > 1.01);
  btnOut.disabled = s <= 1.01;
  btnIn.disabled = s >= MAX - 0.01;
}
// zoom verso la scala "next" tenendo fermo il punto (px, py) dello schermo (default: centro)
function zoomAt(next: number, px?: number, py?: number, animate = true) {
  const r = stage.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const x = (px ?? cx) - cx, y = (py ?? cy) - cy;
  next = Math.min(MAX, Math.max(1, next));
  tx = x - (x - tx) * (next / s);
  ty = y - (y - ty) * (next / s);
  s = next;
  if (s === 1) { tx = 0; ty = 0; }
  apply(animate);
}
const reset = () => { s = 1; tx = 0; ty = 0; apply(); };

function bindGestures() {
  const pts = new Map<number, { x: number; y: number }>();
  let start = { x: 0, y: 0, tx: 0, ty: 0, moved: false };
  let pinch: { d: number; s: number } | null = null;
  const dist = () => { const [a, b] = [...pts.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  const mid = () => { const [a, b] = [...pts.values()]; return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };

  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    try { stage.setPointerCapture(e.pointerId); } catch { /* puntatore non catturabile: si continua senza */ }
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) start = { x: e.clientX, y: e.clientY, tx, ty, moved: false };
    if (pts.size === 2) { pinch = { d: dist(), s }; start.moved = true; }
  });
  stage.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pts.size === 2) {
      const m = mid();
      zoomAt(pinch.s * (dist() / pinch.d), m.x, m.y, false);
      return;
    }
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) start.moved = true;
    if (s > 1.01) { tx = start.tx + dx; ty = start.ty + dy; apply(); }
  });
  const end = (e: PointerEvent) => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (pts.size > 0) return;
    const dx = e.clientX - start.x;
    if (!start.moved) {
      // clic/tocco: sulla foto zooma (o torna intera), fuori dalla foto chiude
      if (e.target === img) s > 1.01 ? zoomAt(1) : zoomAt(2.5, e.clientX, e.clientY);
      else if (s <= 1.01) close();
    } else if (s <= 1.01 && Math.abs(dx) > 50 && e.pointerType !== 'mouse') {
      go(dx < 0 ? 1 : -1); // swipe sul telefono
    }
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(s * Math.exp(-e.deltaY * 0.0018), e.clientX, e.clientY, false);
  }, { passive: false });
  window.addEventListener('resize', () => root && !root.hidden && apply());
}

// ---------- apertura e navigazione ----------
function render() {
  const sl = slides[cur];
  s = 1; tx = 0; ty = 0;
  img.style.transition = 'none';
  img.style.transform = '';
  root!.classList.remove('is-zoomed');
  img.src = sl.src;
  img.alt = sl.alt;
  counter.textContent = `${String(cur + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  root!.classList.toggle('is-single', slides.length < 2);
  apply();
}
function open(list: Slide[], i: number) {
  if (!root) build();
  slides = list;
  cur = i;
  lastFocus = document.activeElement;
  prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  root!.hidden = false;
  render();
  void root!.offsetWidth; // reflow: la dissolvenza parte anche senza aspettare un frame
  root!.classList.add('is-open');
  root!.querySelector<HTMLButtonElement>('[data-glb-close]')!.focus({ preventScroll: true });
}
function close() {
  if (!root || root.hidden) return;
  root.classList.remove('is-open');
  document.documentElement.style.overflow = prevOverflow;
  setTimeout(() => { if (!root!.classList.contains('is-open')) root!.hidden = true; }, 300);
  (lastFocus as HTMLElement | null)?.focus?.({ preventScroll: true });
}
const go = (d: number) => { if (slides.length > 1) { cur = (cur + d + slides.length) % slides.length; render(); } };

// copertina del progetto: apre la prima immagine della galleria
document.addEventListener('click', (e) => {
  const cov = (e.target as Element).closest<HTMLElement>('[data-open-gallery]');
  if (!cov) return;
  const scope = cov.closest('[data-project-modal]') ?? document;
  const first = scope.querySelector<HTMLElement>('[data-gallery] [data-lightbox]');
  if (first) { e.preventDefault(); first.click(); }
});

// testo lungo del progetto: "Continua a leggere" / "Riduci"
document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('[data-more-toggle]');
  if (!btn) return;
  const box = btn.closest('[data-more]');
  if (!box) return;
  const open = !box.classList.contains('is-open');
  box.classList.toggle('is-open', open);
  btn.setAttribute('aria-expanded', String(open));
  const label = btn.querySelector('[data-more-label]');
  if (label) label.textContent = open ? 'Riduci' : 'Continua a leggere';
  if (!open) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// clic su una foto di qualsiasi galleria (anche iniettata in seguito)
document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLElement>('[data-lightbox]');
  if (!btn) return;
  const gallery = btn.closest('[data-gallery]');
  if (!gallery) return;
  e.preventDefault();
  const btns = [...gallery.querySelectorAll<HTMLElement>('[data-lightbox]')];
  open(btns.map((b) => ({ src: b.dataset.full || '', alt: b.dataset.alt || '' })), btns.indexOf(btn));
});

// tastiera: in fase di cattura, cosi Esc chiude la foto e non anche la finestra del progetto
window.addEventListener('keydown', (e) => {
  if (!root || root.hidden) return;
  const k = e.key;
  if (k === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); s > 1.01 ? reset() : close(); }
  else if (k === 'ArrowLeft' && s <= 1.01) go(-1);
  else if (k === 'ArrowRight' && s <= 1.01) go(1);
  else if (k === '+' || k === '=') zoomAt(s * 1.6);
  else if (k === '-') zoomAt(s / 1.6);
  else return;
}, true);
