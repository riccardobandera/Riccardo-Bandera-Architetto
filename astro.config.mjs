// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

// /blog/ con 1 o 2 articoli mostra l'ultimo e rimanda a Google l'indirizzo dell'articolo: fuori dalla sitemap.
// Da 3 articoli diventa l'indice del Journal (stessa soglia di src/pages/blog/index.astro) ed entra nella sitemap.
const articoliPubblicati = readdirSync('./src/content/blog')
  .filter((f) => /\.mdx?$/.test(f))
  .filter((f) => !/^draft:\s*true/m.test(readFileSync(`./src/content/blog/${f}`, 'utf-8'))).length;
const journalIndice = articoliPubblicati >= 3;

// https://astro.build/config
export default defineConfig({
  site: 'https://riccardobandera.com',
  integrations: [sitemap({ filter: (page) => journalIndice || !page.endsWith('/blog/') })],
  vite: {
    plugins: [tailwindcss()],
    // in sviluppo GSAP (scorrimento del Metodo) va preparato subito all'avvio: se Vite lo scopre dopo,
    // ricalcola le dipendenze e il browser riceve "Outdated Optimize Dep" (il Metodo non scorre)
    optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger'] },
  },
  image: {
    // portfolio pesante di foto: qualità alta ma formati moderni
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
