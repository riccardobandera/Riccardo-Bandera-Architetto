// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://riccardobandera.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // portfolio pesante di foto: qualità alta ma formati moderni
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
