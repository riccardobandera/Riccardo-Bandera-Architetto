// Gallerie dei progetti "giustificate": in ogni riga le foto hanno la stessa altezza e larghezza
// proporzionale al formato, quindi niente vuoti di colore e niente ritagli.
// Regole (richiesta cliente): da tablet in su nessuna foto a tutta pagina, almeno 2 foto per riga
// e nessuna foto oltre il 62% della larghezza; tutte le righe piene, senza vuoti bianchi.
// Su telefono anche una foto per riga va bene.
// Vive nel layout globale perche le gallerie iniettate nella finestra di /progetti non eseguono script.

const CAP = 0.62;

function layout(g: HTMLElement) {
  const items = [...g.querySelectorAll<HTMLElement>(':scope > .jg-item')];
  const W = g.clientWidth;
  if (!items.length || !W) return;
  const gap = parseFloat(getComputedStyle(g).columnGap) || 0;
  const r = items.map((it) => parseFloat(it.style.getPropertyValue('--r')) || 1.5);
  const wide = W >= 700;
  // altezza di riferimento delle righe
  const T = wide ? Math.min(300, Math.max(180, W * 0.22)) : Math.max(160, W * 0.6);
  const maxPerRow = wide ? 7 : 3;
  // altezza massima di una riga piena
  const maxH = T * (wide ? 1.6 : 1.9);
  const rowH = (i: number, j: number, sum: number) => (W - (j - i - 1) * gap) / sum;

  // costo di una riga (foto da i a j-1, allargata a tutta la larghezza): quanto si allontana
  // dall'altezza di riferimento, piu penalita se viola le regole (min 2 foto, tetto 62%)
  const rowCost = (i: number, j: number) => {
    let sum = 0, maxR = 0;
    for (let k = i; k < j; k++) { sum += r[k]; maxR = Math.max(maxR, r[k]); }
    const h = rowH(i, j, sum);
    let c = Math.log(h / T) ** 2;
    if (wide && j - i < 2) c += 50;
    const frac = (maxR * h) / W;
    if (wide && frac > CAP) c += 20 + (frac - CAP) * 50;
    if (h > maxH) c += 10 + h / maxH;
    return c;
  };

  // ripartizione ottimale in righe (programmazione dinamica): TUTTE le righe, anche l'ultima,
  // arrivano da bordo a bordo, con altezze il piu possibile uniformi
  const n = items.length;
  const best = new Array<number>(n + 1).fill(Infinity);
  const from = new Array<number>(n + 1).fill(0);
  best[0] = 0;
  for (let j = 1; j <= n; j++) {
    for (let i = Math.max(0, j - maxPerRow); i < j; i++) {
      const c = best[i] + rowCost(i, j);
      if (c < best[j]) { best[j] = c; from[j] = i; }
    }
  }
  const rows: { idx: number[]; h: number; full: boolean }[] = [];
  for (let j = n; j > 0; j = from[j]) {
    const i = from[j];
    const idx = Array.from({ length: j - i }, (_, k) => i + k);
    rows.unshift({ idx, h: rowH(i, j, idx.reduce((t, k) => t + r[k], 0)), full: true });
  }

  // casi senza soluzione (es. una sola tavola panoramica): la riga si riduce fino al tetto
  for (const row of rows) {
    const maxR = Math.max(...row.idx.map((k) => r[k]));
    const capH = wide ? (CAP * W) / maxR : Infinity;
    const lim = Math.min(capH, maxH);
    if (row.h > lim) { row.h = lim; row.full = false; }
  }

  g.classList.add('jg--js');
  for (const row of rows) {
    const gaps = (row.idx.length - 1) * gap;
    const ws = row.idx.map((k) => Math.floor(r[k] * row.h * 100) / 100);
    if (row.full) ws[ws.length - 1] = Math.max(0, W - gaps - ws.slice(0, -1).reduce((t, w) => t + w, 0) - 0.5);
    // riga non piena (1-2 tavole che non possono allargarsi): centrata, il bianco si divide ai lati
    const left = Math.max(0, W - gaps - ws.reduce((t, w) => t + w, 0) - 0.5);
    row.idx.forEach((k, n) => {
      const s = items[k].style;
      s.width = `${ws[n]}px`;
      s.height = `${Math.round(row.h * 100) / 100}px`;
      s.marginLeft = n === 0 && left > 1 ? `${left / 2}px` : '';
      // a fine riga lo spazio avanzato va nel margine, cosi la foto dopo va a capo
      s.marginRight = n === row.idx.length - 1 ? `${left > 1 ? left / 2 : left}px` : '';
    });
  }
}

const seen = new WeakSet<Element>();
const ro = new ResizeObserver((entries) => entries.forEach((e) => layout(e.target as HTMLElement)));
const scan = (root: ParentNode = document) =>
  root.querySelectorAll<HTMLElement>('.jg').forEach((g) => {
    if (seen.has(g)) return;
    seen.add(g);
    layout(g);
    ro.observe(g);
  });

scan();
new MutationObserver((muts) => {
  for (const m of muts) for (const n of m.addedNodes) if (n instanceof HTMLElement) scan(n.parentNode ?? document);
}).observe(document.body, { childList: true, subtree: true });
