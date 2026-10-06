import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export type Progetto = CollectionEntry<'progetti'>;
export type Immagine = { src: ImageMetadata; alt?: string; home?: boolean; etichetta?: string };

export const catLabels: Record<string, string> = {
  residenziale: 'Residenziale',
  commerciale: 'Commerciale',
  alberghiero: 'Alberghiero',
  direzionale: 'Direzionale',
};

export const matLabels: Record<string, string> = {
  legno: 'Legno',
  pietra: 'Pietra',
  cemento: 'Cemento e resina',
  vetro: 'Vetro',
  metallo: 'Metallo',
  intonaco: 'Intonaco',
  laterizio: 'Laterizio',
  paglia: 'Paglia e fibre naturali',
};

let cache: Progetto[] | null = null;

/** Tutti i progetti pubblicati: prima i piu recenti, poi in ordine alfabetico. */
export async function getProgetti(): Promise<Progetto[]> {
  // in sviluppo niente cache: le modifiche ai progetti (anche dal CMS) si vedono subito
  if (cache && import.meta.env.PROD) return cache;
  const all = (await getCollection('progetti')).filter((p) => !p.data.bozza);
  cache = all.sort((a, b) => (b.data.anno ?? 0) - (a.data.anno ?? 0) || a.data.titolo.localeCompare(b.data.titolo, 'it'));
  return cache;
}

/**
 * Progetti selezionati della home: TUTTI quelli "In evidenza", nell'ordine scelto nel pannello
 * (campo "Posizione in home", 1 = primo; senza numero vanno dopo, dal piu recente).
 * Se sono meno di `min`, si completa con i progetti piu recenti.
 */
export async function getInEvidenza(min = 6): Promise<Progetto[]> {
  const all = await getProgetti();
  const pos = (p: Progetto) => p.data.ordineHome ?? Infinity;
  const top = all.filter((p) => p.data.evidenza).sort((a, b) => pos(a) - pos(b)); // sort stabile: a parita resta l'anno
  return top.length >= min ? top : [...top, ...all.filter((p) => !p.data.evidenza)].slice(0, min);
}

/**
 * Foto grandi della hero in home: quelle con "Foto grande in home" attivo nel pannello (fotografie e render).
 * Se non ne e scelta nessuna, si usano le copertine dei progetti in evidenza, cosi la hero non resta mai vuota.
 */
export async function getHeroImages(): Promise<{ src: ImageMetadata; slug: string }[]> {
  const all = await getProgetti();
  const scelte = all.flatMap((p) => [...p.data.foto, ...p.data.render].filter((i) => i.home).map((i) => ({ src: i.src, slug: p.id })));
  if (scelte.length) return scelte;
  return (await getInEvidenza(6)).flatMap((p) => {
    const c = coverOf(p);
    return c ? [{ src: c.src, slug: p.id }] : [];
  });
}

export async function byCategory(cat: string): Promise<Progetto[]> {
  return (await getProgetti()).filter((p) => p.data.categorie.includes(cat as never));
}

export async function getProgetto(id: string): Promise<Progetto | undefined> {
  return (await getProgetti()).find((p) => p.id === id);
}

export async function adjacent(id: string): Promise<{ prev: Progetto; next: Progetto } | null> {
  const all = await getProgetti();
  const i = all.findIndex((p) => p.id === id);
  if (i === -1) return null;
  return { prev: all[(i - 1 + all.length) % all.length], next: all[(i + 1) % all.length] };
}

/** Copertina: campo copertina, altrimenti prima foto/render disponibile. */
export function coverOf(p: Progetto): { src: ImageMetadata; alt: string } | null {
  const d = p.data;
  if (d.copertina) return { src: d.copertina as ImageMetadata, alt: d.copertinaAlt ?? d.titolo };
  const first = (d.foto[0] ?? d.render[0]) as Immagine | undefined;
  return first ? { src: first.src, alt: first.alt ?? d.titolo } : null;
}

/** Conteggi per i filtri (solo voci presenti). */
export async function facets() {
  const all = await getProgetti();
  const count = (key: 'categorie' | 'materiali') => {
    const m = new Map<string, number>();
    all.forEach((p) => (p.data[key] as string[]).forEach((k) => m.set(k, (m.get(k) ?? 0) + 1)));
    return m;
  };
  const cats = count('categorie');
  const mats = count('materiali');
  return {
    total: all.length,
    categorie: Object.keys(catLabels).filter((k) => cats.has(k)).map((k) => ({ key: k, label: catLabels[k], count: cats.get(k)! })),
    materiali: Object.keys(matLabels).filter((k) => mats.has(k)).map((k) => ({ key: k, label: matLabels[k], count: mats.get(k)! })).sort((a, b) => b.count - a.count),
  };
}
