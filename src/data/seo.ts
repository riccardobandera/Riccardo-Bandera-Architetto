// Titoli e descrizioni per Google delle pagine fisse, domande frequenti e pagine per settore.
// I testi stanno in JSON (modificabili dal CMS): qui solo la logica.
import pagine from './seo-pagine.json';
import faqData from './faq.json';
import serviziData from './servizi.json';

export type PaginaSeo = keyof typeof pagine;
export const seoPagina = (k: PaginaSeo, vars: Record<string, string | number> = {}) => {
  const p = pagine[k];
  const fill = (s: string) => s.replace(/\{(\w+)\}/g, (m, v) => (v in vars ? String(vars[v]) : m));
  return { title: fill(p.titolo), description: fill(p.descrizione) };
};

// ---- domande frequenti: si pubblicano SOLO quelle con una risposta (scritta dall'architetto)
export type Faq = { domanda: string; tema: string; risposta: string; traccia?: string; priorita?: string; pagine: string[]; fonte?: string };
export const faq: Faq[] = faqData.domande.map((f) => ({ ...f, pagine: f.pagine ?? [] }));
export const faqAggiornato = faqData.aggiornato;
export const faqPubblicate = faq.filter((f) => f.risposta && f.risposta.trim());
export const TEMI: Record<string, string> = {
  lavoro: 'Come lavoriamo',
  costi: 'Costi e parcella',
  pratiche: 'Pratiche e permessi',
  cantiere: 'Direzione lavori e cantiere',
  locali: 'Hotel, bar e locali',
  legno: 'Legno e bioedilizia',
  estero: 'Progetti all’estero',
};
export const faqPerPagina = (slug: string) => faqPubblicate.filter((f) => (f.pagine ?? []).includes(slug));

// schema FAQPage generato dallo stesso testo mostrato in pagina
export const faqLd = (items: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.domanda, acceptedAnswer: { '@type': 'Answer', text: f.risposta } })),
});

// ---- pagine per settore
export type Servizio = (typeof serviziData.pagine)[number];
export const servizi: Servizio[] = serviziData.pagine;
