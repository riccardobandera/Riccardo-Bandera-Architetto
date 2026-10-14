// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://riccardobandera.com',
  // /blog/ mostra l'ultimo articolo e rimanda a Google l'indirizzo dell'articolo: fuori dalla sitemap
  integrations: [sitemap({ filter: (page) => !page.endsWith('/blog/') })],
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
