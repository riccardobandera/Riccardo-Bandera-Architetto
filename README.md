# Riccardo Bandera Architetto — sito

Restyling del sito dello studio (Mestre, VE). Portfolio foto-first, monocromatico, con focus su architettura d'interni e bioedilizia in legno.

## Stack
- **Astro 5** (SSG statico) + **Tailwind CSS v4** + **TypeScript**
- `astro:assets` per immagini responsive AVIF/WebP
- `@astrojs/sitemap` per la sitemap
- Content Collection `blog` (Markdown) — pronta per il CMS, al lancio è vuota
- Form contatti via **Netlify Forms**

## Sviluppo
```bash
npm install
npm run dev      # http://localhost:3110
npm run build    # output statico in dist/
npm run preview
```

## Struttura
- `src/data/site.ts` — copy reale (bio, team, manifesto, 6 fasi, recapiti, social)
- `src/data/content.raw.json` + `src/data/projects.ts` — 38 progetti reali con gallerie
- `src/images/projects/` — foto originali dello studio
- `src/components/` — Navbar, Footer, ProjectCard, Gallery (lightbox+swipe), CategoryFilter, ProcessSteps, ContactForm, SEO, Button
- `src/pages/` — home, lo-studio, manifesto, fasi-del-progetto, progetti (+ [slug]), blog (+ [slug]), contatti, privacy, cookie, 404
- `public/_redirects` — 301 dai vecchi URL WordPress/Blogger ai nuovi slug
- `netlify.toml` — build, header di sicurezza, cache asset

## Deploy (Netlify)
Repo statico: build `npm run build`, publish `dist`. I redirect 301 e Netlify Forms sono già configurati.

## Note per la consegna
- **Legali**: `privacy` e `cookie` sono bozze operative da validare con il consulente dello studio.
- **Blog**: aggiungere gli articoli reali in `src/content/blog/*.md` (frontmatter: title, date, excerpt, cover).
- **Contatti**: il form usa Netlify Forms (attivo solo dopo il deploy su Netlify).
- Contenuti e foto sono stati importati dal sito esistente; 3 schede senza foto reali (Villa tropicale Pwani, Hotel Tremosine, Guest house Nungwi) sono escluse dal portfolio finché non ci sono immagini.
