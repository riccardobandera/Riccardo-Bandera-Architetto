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

/** Immagini per le card della pagina Fasi. */
export const fasiImages = Object.fromEntries(
  Object.entries(curated.fasi).map(([n, keys]) => [n, (keys as string[]).map((k) => ({ src: img(k)!, slug: slugOf(k) })).filter((x) => x.src)]),
) as Record<string, { src: ImageMetadata; slug: string }[]>;
