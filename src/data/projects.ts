import type { ImageMetadata } from 'astro';
import raw from './content.raw.json';

// Mappa basename -> ImageMetadata (astro:assets ottimizza AVIF/WebP responsive)
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../images/projects/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);
const imgByName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const base = path.split('/').pop()!;
  imgByName.set(base, mod.default);
}
const resolve = (local: string | null | undefined): ImageMetadata | undefined => {
  if (!local) return undefined;
  return imgByName.get(local.split('/').pop()!);
};

export type CategoryKey = 'residenziale' | 'commerciale' | 'alberghiero' | 'direzionale';

export const catLabels: Record<string, string> = raw.catLabels as Record<string, string>;

export interface ProjectImage {
  image: ImageMetadata;
  alt: string;
}
export interface Project {
  slug: string;
  code: string | null;
  title: string;
  name: string;
  location: string | null;
  categories: string[];
  cover: ImageMetadata | undefined;
  coverAlt: string;
  gallery: ProjectImage[];
}

interface RawProject {
  slug: string;
  code: string | null;
  title: string;
  name: string;
  location: string | null;
  categories: string[];
  cover: string | null;
  gallery: { local: string; alt: string; section?: string | null }[];
}

function altFor(p: RawProject, given: string, i: number): string {
  const base = p.name?.replace(/\s+/g, ' ').trim() || p.title;
  const clean = (given || '').trim();
  if (clean && !/^(img|dsc|dscf|_dsc|foto|image|photo|screenshot|render)[\s_-]*\d*$/i.test(clean) && clean.length > 3) {
    return clean;
  }
  return i === 0 ? base : `${base}, vista ${i + 1}`;
}

const all: Project[] = (raw.projects as RawProject[])
  .map((p) => {
    const gallery: ProjectImage[] = p.gallery
      .map((g, i) => {
        const image = resolve(g.local);
        return image ? { image, alt: altFor(p, g.alt, i) } : null;
      })
      .filter((x): x is ProjectImage => x !== null);
    const cover = resolve(p.cover) ?? gallery[0]?.image;
    return {
      slug: p.slug,
      code: p.code,
      title: p.title,
      name: p.name,
      location: p.location,
      categories: p.categories,
      cover,
      coverAlt: gallery[0]?.alt ?? p.name,
      gallery,
    };
  })
  // Solo progetti con foto reali (esclude schede senza galleria: no segnaposto)
  .filter((p) => p.gallery.length > 0 && p.cover);

export const projects = all;

export const projectCount = all.length;

export function byCategory(cat: string): Project[] {
  return all.filter((p) => p.categories.includes(cat));
}

export const categories: { key: string; label: string; count: number }[] = Object.keys(catLabels)
  .map((key) => ({ key, label: catLabels[key], count: byCategory(key).length }))
  .filter((c) => c.count > 0);

// progetti "in evidenza" per la home: uno forte per categoria + riempimento
export const featured: Project[] = (() => {
  const picked: Project[] = [];
  const seen = new Set<string>();
  for (const key of Object.keys(catLabels)) {
    const first = all.find((p) => p.categories.includes(key) && p.gallery.length >= 4 && !seen.has(p.slug));
    if (first) { picked.push(first); seen.add(first.slug); }
  }
  for (const p of all) {
    if (picked.length >= 6) break;
    if (!seen.has(p.slug) && p.gallery.length >= 3) { picked.push(p); seen.add(p.slug); }
  }
  return picked.slice(0, 6);
})();

export function adjacent(slug: string): { prev: Project; next: Project } | null {
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  return { prev, next };
}

export function getProject(slug: string): Project | undefined {
  return all.find((p) => p.slug === slug);
}
