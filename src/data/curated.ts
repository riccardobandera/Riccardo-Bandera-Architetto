import type { ImageMetadata } from 'astro';
import curated from './curated.json';

// tutte le immagini dei progetti, indicizzate come "slug/file.webp"
const files = import.meta.glob<{ default: ImageMetadata }>('../content/progetti/*/*.{webp,jpg,jpeg,png}', { eager: true });
const byKey = new Map<string, ImageMetadata>();
for (const [p, mod] of Object.entries(files)) {
  const parts = p.split('/');
  byKey.set(`${parts[parts.length - 2]}/${parts[parts.length - 1]}`, mod.default);
}
const img = (key: string): ImageMetadata | undefined => byKey.get(key);
const slugOf = (key: string) => key.split('/')[0];

// le foto della hero non sono qui: si scelgono nel pannello con "Foto grande in home" (vedi getHeroImages)

/** Evoluzione di un progetto, dal disegno all'opera finita (sezione Metodo in home). */
export const metodoProgetto = curated.metodoProgetto;
export const metodoImages = Object.fromEntries(curated.metodo.map(([n, k]) => [n, img(k)!])) as Record<string, ImageMetadata>;
export const metodoExtra = Object.fromEntries(Object.entries(curated.metodoExtra).map(([n, k]) => [n, img(k as string)!])) as Record<string, ImageMetadata>;

// immagini scelte da Riccardo per la pagina Fasi (cartelle Drive, ottobre 2026), in src/images/fasi/<fase>/
const fasiFiles = import.meta.glob<{ default: ImageMetadata }>('../images/fasi/*/*.webp', { eager: true });
const fasiByKey = new Map<string, ImageMetadata>();
for (const [p, mod] of Object.entries(fasiFiles)) fasiByKey.set(p.replace('../images/', ''), mod.default);

export type FaseImg = { src: ImageMetadata; alt: string; slug?: string; tavola?: boolean };
type VoceFase = string | { src: string; alt: string; tavola?: boolean };

/**
 * Immagini delle 6 fasi (si aprono con "Vedi esempi").
 * Ogni voce e una foto di un progetto del sito ("slug/file.webp") oppure un'immagine propria della pagina
 * ({ src: "fasi/01/...", alt, tavola }); tavola = disegno tecnico, mostrato intero.
 */
export const fasiImages = Object.fromEntries(
  Object.entries(curated.fasi).map(([n, voci]) => [
    n,
    (voci as VoceFase[])
      .map((v): FaseImg | null => {
        if (typeof v === 'string') {
          const src = img(v);
          return src ? { src, alt: '', slug: slugOf(v) } : null;
        }
        const src = fasiByKey.get(v.src);
        return src ? { src, alt: v.alt, tavola: !!v.tavola } : null;
      })
      .filter((x): x is FaseImg => x !== null),
  ]),
) as Record<string, FaseImg[]>;
