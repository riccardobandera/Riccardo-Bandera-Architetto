import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog / Journal - pronto per il CMS. Il cliente aggiunge articoli in src/content/blog/*.md
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      excerpt: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

// Progetti: una cartella per progetto (index.md + immagini), modificabile dal CMS
const immagini = (image: () => z.ZodTypeAny) =>
  z.array(z.object({ src: image(), alt: z.string().optional() })).default([]);

const progetti = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/progetti',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      codice: z.string().optional(), // interno: non mostrato sul sito
      anno: z.number().int().optional(),
      luogo: z.string().optional(),
      categorie: z.array(z.enum(['residenziale', 'commerciale', 'alberghiero', 'direzionale'])).default([]),
      materiali: z.array(z.enum(['legno', 'pietra', 'cemento', 'vetro', 'metallo', 'intonaco', 'laterizio', 'paglia'])).default([]),
      coordinate: z.object({ lat: z.number(), lng: z.number() }).optional(),
      evidenza: z.boolean().default(false),
      bozza: z.boolean().default(false),
      copertina: image().optional(),
      copertinaAlt: z.string().optional(),
      // titolo e descrizione per Google (se vuoti vengono generati da titolo e testo)
      seo: z.object({ titolo: z.string().optional(), descrizione: z.string().optional() }).optional(),
      tag: z.array(z.string()).default([]),
      crediti: z.array(z.object({ ruolo: z.string(), nome: z.string() })).default([]),
      foto: immagini(image),
      render: immagini(image),
      disegni: immagini(image),
      cantiere: immagini(image),
    }),
});

export const collections = { blog, progetti };
