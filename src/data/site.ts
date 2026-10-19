// Dati di contatto dello studio. I testi delle pagine stanno in testi.json (modificabili dal CMS).
import testi from './testi.json';
// contatti modificabili dal pannello (Testi e dati > Contatti dello studio)
import contatti from './contatti.json';

export const site = {
  name: 'Riccardo Bandera',
  role: 'Architetto',
  legalName: 'Riccardo Bandera Architetto',
  domain: 'riccardobandera.com',
  url: 'https://riccardobandera.com',
  get tagline() { return testi.home.tagline; },
  claim: 'Architettura, interni e bioedilizia in legno.',
  email: contatti.email,
  pec: contatti.pec,
  phone: contatti.telefono,
  phoneHref: contatti.telefono.replace(/[^\d+]/g, ''),
  piva: '02209210224',
  // modulo contatti: script Google (Apps Script) che salva su Google Sheet e manda la mail a studio@
  // endpoint = URL /exec del deploy dello script; token = SHARED_TOKEN nello script (filtro anti abuso leggero)
  form: {
    endpoint: 'https://script.google.com/macros/s/AKfycbw_eFD4ze8agsih9f8VSqYPyzvgEb9GuKQ1quj-p2zk1gtdHkqcSypscPv_pwdnseTkiA/exec',
    token: 'OcfcY5OOiEYVOuLRl7sVKKSnLPtyUUaI',
  },
  ordine: "Ordine degli Architetti P.P.C. di Venezia, Sez. A, n. 4391",
  address: {
    street: contatti.indirizzo.via,
    zip: contatti.indirizzo.cap,
    city: contatti.indirizzo.citta,
    region: contatti.indirizzo.provincia,
    country: 'IT',
  },
  geo: { lat: 45.4930668, lng: 12.2382017 },
  googleMaps: 'https://www.google.com/maps/place/Riccardo+Bandera+Architetto/@45.4930668,12.2382017,17z/data=!4m6!3m5!1s0x477eb448172c9ca7:0x433ec3bc8b6f20a3!8m2!3d45.4930668!4d12.2382017',
  social: contatti.social,
  // profili su portali di architettura (stessa identità: servono a Google e alle IA per riconoscere lo studio)
  profili: {
    houzz: 'https://www.houzz.it/professionisti/architetti/riccardo-bandera-architetto-pfvwit-pf~26771995',
    homify: 'https://www.homify.it/esperti/114375/riccardo-bandera-architetto',
    divisare: 'https://divisare.com/authors/2144619149-riccardo-bandera',
  },
  attivoDal: 2014,
  ordineNumero: '4391',
  ordineNome: 'Ordine degli Architetti, Pianificatori, Paesaggisti e Conservatori della Provincia di Venezia',
};

// identificativi stabili per i dati strutturati (schema.org): studio e architetto
export const ORG_ID = `${site.url}/#studio`;
export const PERSON_ID = `${site.url}/#riccardo-bandera`;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Lo Studio', href: '/lo-studio/' },
  { label: 'Manifesto', href: '/manifesto/' },
  { label: 'Fasi del Progetto', href: '/fasi-del-progetto/' },
  { label: 'Progetti', href: '/progetti/' },
  { label: 'Contatti', href: '/contatti/' },
] as const;

// ---- testi delle pagine (da testi.json, modificabili dal CMS) ----
export const homeTesti = testi.home;
export const manifestoQuote = testi.home.citazione;
export const studioTitolo = testi.studio.titolo;
export const studioBio = testi.studio.bio;
export const studioFirma = (testi.studio as { firma?: string }).firma;
export const team = testi.studio.team;
export const manifesto = testi.manifesto;
export const fasiIntro = testi.fasi.intro;
export const fasi = testi.fasi.elenco;
// altre attivita: ogni voce ha la sua pagina /attivita/<slug>/ appena nel pannello c'e il testo
type VoceAttivita = { titolo: string; slug?: string; descrizione?: string; testo?: string };
const slugify = (t: string) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const schedeAttivita = (testi.altreAttivita.voci as (VoceAttivita | string)[]).map((v) => {
  const o = typeof v === 'string' ? { titolo: v } : v;
  const testo = (o.testo ?? '').trim();
  return { titolo: o.titolo, slug: o.slug?.trim() || slugify(o.titolo), descrizione: (o.descrizione ?? '').trim(), testo, href: testo ? `/attivita/${o.slug?.trim() || slugify(o.titolo)}/` : null };
});
export const altreAttivita = { intro: testi.altreAttivita.intro, voci: schedeAttivita.map((s) => s.titolo), schede: schedeAttivita };
export const ambiti = testi.ambiti;
