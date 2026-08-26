import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog / Journal - pronto per il CMS (Decap/MD). Nessun contenuto placeholder:
// il cliente aggiunge articoli reali in src/content/blog/*.md
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

export const collections = { blog };
