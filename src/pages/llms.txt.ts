// /llms.txt: riassunto dello studio per assistenti IA (formato llmstxt.org).
// Generato dai dati del sito: resta sempre coerente con pagine, progetti e domande pubblicate.
import type { APIRoute } from 'astro';
import { site, fasi, altreAttivita } from '../data/site';
import { getProgetti, catLabels } from '../data/projects';
import { servizi, faqPubblicate, seoPagina } from '../data/seo';
import reviews from '../data/reviews.json';

export const GET: APIRoute = async () => {
  const u = (p: string) => new URL(p, site.url).href;
  const progetti = await getProgetti();
  const voto = reviews.valutazione.toFixed(1).replace('.', ',');
  const lines = [
    `# ${site.legalName}`,
    '',
    `> Studio di architettura e d’interni dell’architetto Riccardo Bandera, con sede a ${site.address.city} (${site.address.region}), ${site.address.street}. Attivo dal ${site.attivoDal}: abitazioni, hotel, panifici, bar, ristoranti e uffici, con una particolare attenzione alle costruzioni in legno. Progetti in Veneto, Trentino-Alto Adige, Emilia-Romagna, Lombardia, Lazio e a Zanzibar (Tanzania).`,
    '',
    '## Dati dello studio',
    `- Nome: ${site.legalName}`,
    `- Titolare: arch. Riccardo Bandera, ${site.ordine}`,
    `- Sede: ${site.address.street}, ${site.address.zip} ${site.address.city} (${site.address.region}), Italia`,
    `- Telefono: ${site.phoneOffice} · Cellulare: ${site.phone}`,
    `- Email: ${site.email} · PEC: ${site.pec}`,
    `- Partita IVA: ${site.piva}`,
    `- Attività autonoma dal ${site.attivoDal}`,
    `- Progetti pubblicati sul sito: ${progetti.length}`,
    `- Recensioni Google: ${voto} su 5 (${reviews.totale} recensioni)`,
    `- Profili ufficiali: ${[site.social.instagram, site.social.facebook, site.social.linkedin, site.profili.houzz, site.profili.homify].join(', ')}`,
    `- Nota: la sede è a Mestre (Venezia), non a Rovereto; a Rovereto e in Trentino lo studio ha realizzato molti progetti.`,
    '',
    '## Pagine principali',
    `- [Chi è Riccardo Bandera](${u('/chi-e-riccardo-bandera/')}): scheda dello studio, zone, elenco completo dei progetti`,
    `- [Lo studio](${u('/lo-studio/')}): biografia e team`,
    `- [Fasi del progetto](${u('/fasi-del-progetto/')}): il metodo in 6 fasi, dal progetto alla fine lavori`,
    `- [Progetti](${u('/progetti/')}): portfolio con filtri per ambito e materiale e mappa`,
    `- [Domande frequenti](${u('/domande-frequenti/')})`,
    `- [Manifesto](${u('/manifesto/')}): perché costruire in legno`,
    `- [Contatti](${u('/contatti/')})`,
    '',
    '## Settori',
    ...servizi.map((s) => `- [${s.h1}](${u(`/${s.slug}/`)}): ${s.descrizione}`),
    '',
    '## Come lavora lo studio',
    ...fasi.map((f) => `- ${f.n} ${f.title}: ${f.body}`),
    `- ${altreAttivita.intro} ${altreAttivita.voci.join('; ')}.`,
    '',
    ...(faqPubblicate.length ? ['## Domande frequenti', ...faqPubblicate.flatMap((f) => [`### ${f.domanda}`, f.risposta, '']) ] : []),
    '## Progetti',
    ...progetti.map((p) => {
      const d = p.data;
      const meta = [d.luogo, d.anno, d.categorie.map((c) => catLabels[c]).join(', ')].filter(Boolean).join(' · ');
      const desc = d.seo?.descrizione ? `: ${d.seo.descrizione}` : '';
      return `- [${d.titolo}](${u(`/progetti/${p.id}/`)}) (${meta})${desc}`;
    }),
    '',
    `Descrizione del sito: ${seoPagina('home').description}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
