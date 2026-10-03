import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Il pannello puo salvare i campi facoltativi vuoti come '' o null: li tratto come assenti,
// cosi un campo svuotato per sbaglio non blocca la pubblicazione.
const vuoto = (v: unknown) => (v === '' || v === null ? undefined : v);
const testo = () => z.preprocess(vuoto, z.string().optional());
const lista = <T extends z.ZodTypeAny>(t: T) => z.preprocess((v) => vuoto(v) ?? [], z.array(t));
const sino = () => z.preprocess((v) => vuoto(v) ?? false, z.boolean());

// Blog / Journal - pronto per il CMS. Il cliente aggiunge articoli in src/content/blog/*.md
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      excerpt: testo(),
      cover: z.preprocess(vuoto, image().optional()),
      coverAlt: testo(),
      // attività dello studio (pagina Fasi del progetto) a cui l'articolo è collegato: la card porta qui
      attivita: testo(),
      draft: sino(),
    }),
});

// Progetti: una cartella per progetto (index.md + immagini), modificabile dal CMS.

// "Posizione sulla mappa" dal pannello: coordinate copiate da Google Maps ("45.49, 12.24")
// oppure il link lungo di Google Maps (punto esatto !3d..!4d.., o centro @lat,lng, o ?q=lat,lng)
const coordDaLink = (t?: string) => {
  if (!t) return undefined;
  const num = String.raw`(-?\d{1,3}\.\d+)`;
  const m =
    t.match(new RegExp(String.raw`!3d${num}!4d${num}`)) ||
    t.match(new RegExp(String.raw`@${num},${num}`)) ||
    t.match(new RegExp(String.raw`[?&](?:q|query|ll)=${num}(?:,|%2C)(?:\s|%20|\+)*${num}`)) ||
    t.match(new RegExp(String.raw`^\s*${num}\s*,\s*${num}\s*$`));
  if (!m) return undefined;
  const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : undefined;
};

const immagini = (image: () => z.ZodTypeAny) =>
  // home: la foto gira nella hero della home (foto grande in alto)
  lista(z.object({ src: image(), alt: testo(), home: sino() }));

const progetti = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/progetti',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      codice: testo(), // interno: non mostrato sul sito
      anno: z.preprocess(vuoto, z.number().int().optional()),
      luogo: testo(),
      // indirizzo del locale o dell'edificio (mostrato nella scheda del progetto)
      indirizzo: testo(),
      categorie: lista(z.enum(['residenziale', 'commerciale', 'alberghiero', 'direzionale'])),
      materiali: lista(z.enum(['legno', 'pietra', 'cemento', 'vetro', 'metallo', 'intonaco', 'laterizio', 'paglia'])),
      coordinate: z.preprocess(
        (v) => (v && typeof v === 'object' && (vuoto((v as any).lat) === undefined || vuoto((v as any).lng) === undefined) ? undefined : vuoto(v)),
        z.object({ lat: z.number(), lng: z.number() }).optional(),
      ),
      // link di Google Maps incollato dal pannello: se mancano le coordinate, il punto sulla mappa si ricava da qui
      mappa: testo(),
      evidenza: sino(),
      // posizione tra i progetti in evidenza in home (1 = primo); vuoto = dopo quelli numerati
      ordineHome: z.preprocess(vuoto, z.number().int().optional()),
      bozza: sino(),
      // realizzato = opera costruita; progetto = non costruito o in corso
      stato: z.preprocess(vuoto, z.enum(['realizzato', 'progetto']).optional()),
      copertina: z.preprocess(vuoto, image().optional()),
      copertinaAlt: testo(),
      // titolo e descrizione per Google (se vuoti vengono generati da titolo e testo)
      seo: z.preprocess(vuoto, z.object({ titolo: testo(), descrizione: testo() }).optional()),
      tag: lista(z.string()),
      crediti: lista(z.object({ ruolo: z.string(), nome: z.string() })),
      foto: immagini(image),
      render: immagini(image),
      disegni: immagini(image),
      cantiere: immagini(image),
    })
    // la posizione incollata nel pannello ha la precedenza sulle coordinate gia salvate
    .transform((d) => ({ ...d, coordinate: coordDaLink(d.mappa) ?? d.coordinate })),
});

export const collections = { blog, progetti };
