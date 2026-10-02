// Gallerie dei progetti "giustificate": in ogni riga le foto hanno la stessa altezza e larghezza
// proporzionale al formato, quindi niente vuoti di colore e niente ritagli.
// Regole (richiesta cliente): da tablet in su nessuna foto a tutta pagina, almeno 2 foto per riga
// e nessuna foto oltre il 62% della larghezza. Su telefono una foto per riga va bene.
// Vive nel layout globale perche le gallerie iniettate nella finestra di /progetti non eseguono script.

const CAP = 0.62;

function layout(g: HTMLElement) {
  const items = [...g.querySelectorAll<HTMLElement>(':scope > .jg-item')];
  const W = g.clientWidth;
  if (!items.length || !W) return;
  const gap = parseFloat(getComputedStyle(g).columnGap) || 0;
  const r = items.map((it) => parseFloat(it.style.getPropertyValue('--r')) || 1.5);
  const wide = W >= 700;
  // altezza di riferimento della riga: ogni riga piena le resta il piu vicino possibile (max +40%)
  const T = wide ? Math.min(300, Math.max(180, W * 0.22)) : Math.max(160, W * 0.6);
  const minH = T * 0.55;

  const maxOf = (ids: number[]) => Math.max(...ids.map((k) => r[k]));
  // la riga rispetta le regole: da tablet in su almeno 2 foto e nessuna oltre il tetto
  const capOk = (ids: number[], h: number) => !wide || (ids.length >= 2 && (maxOf(ids) * h) / W <= CAP);
  const rowH = (ids: number[]) => (W - (ids.length - 1) * gap) / ids.reduce((t, k) => t + r[k], 0);

  const rows: { idx: number[]; h: number; full: boolean }[] = [];
  let i = 0;
  while (i < items.length) {
    const idx = [i++];
    for (;;) {
      const sum = idx.reduce((t, k) => t + r[k], 0);
      if (sum * T + (idx.length - 1) * gap < W) {
        if (i < items.length) { idx.push(i++); continue; }
        // ultima riga: non si allarga e non supera la riga precedente
        const prev = rows.length ? rows[rows.length - 1].h : T;
        let h = Math.min(T, prev, rowH(idx));
        if (wide) h = Math.min(h, (CAP * W) / maxOf(idx));
        rows.push({ idx, h, full: false });
        break;
      }
      // riga piena: tra "con" e "senza" l'ultima foto scelgo l'altezza piu vicina a quella di riferimento
      const withH = rowH(idx);
      const without = idx.slice(0, -1);
      const withoutH = without.length ? rowH(without) : Infinity;
      const okWith = capOk(idx, withH);
      const okWithout = without.length > 0 && withoutH <= T * 1.4 && capOk(without, withoutH);
      if (okWithout && (!okWith || Math.abs(withoutH - T) < Math.abs(withH - T))) {
        i--; rows.push({ idx: without, h: withoutH, full: true }); break;
      }
      if (okWith || i >= items.length || (idx.length >= 2 && rowH([...idx, i]) < minH)) { rows.push({ idx, h: withH, full: true }); break; }
      // riga dominata da una foto troppo larga: aggiungo un'altra foto
      idx.push(i++);
    }
  }

  // la foto piu larga di una riga piena oltre il tetto viene ridotta insieme a tutta la riga
  for (const row of rows) {
    if (!wide) continue;
    const maxR = Math.max(...row.idx.map((k) => r[k]));
    if ((maxR * row.h) / W > CAP) { row.h = (CAP * W) / maxR; row.full = false; }
  }
  // l'ultima riga non e mai piu alta della penultima
  const last = rows[rows.length - 1];
  if (rows.length > 1 && !last.full) last.h = Math.min(last.h, rows[rows.length - 2].h);

  g.classList.add('jg--js');
  for (const row of rows) {
    let used = 0;
    row.idx.forEach((k, n) => {
      const last = n === row.idx.length - 1;
      const gaps = (row.idx.length - 1) * gap;
      let w = Math.floor(r[k] * row.h * 100) / 100;
      if (last && row.full) w = Math.max(0, W - gaps - used - 0.5);
      used += w;
      const s = items[k].style;
      s.width = `${w}px`;
      s.height = `${Math.round(row.h * 100) / 100}px`;
      // a fine riga lo spazio avanzato va nel margine, cosi la foto dopo va a capo
      s.marginRight = last ? `${Math.max(0, W - gaps - used - 0.5)}px` : '';
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
