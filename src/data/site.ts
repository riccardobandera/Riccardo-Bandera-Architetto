// Dati di contatto dello studio. I testi delle pagine stanno in testi.json (modificabili dal CMS).
import testi from './testi.json';

export const site = {
  name: 'Riccardo Bandera',
  role: 'Architetto',
  legalName: 'Riccardo Bandera Architetto',
  domain: 'riccardobandera.com',
  url: 'https://riccardobandera.com',
  get tagline() { return testi.home.tagline; },
  claim: 'Architettura, interni e bioedilizia in legno.',
  email: 'studio@riccardobandera.com',
  pec: 'riccardobandera@pec.it',
  phone: '+39 349 3772802',
  phoneHref: '+393493772802',
  piva: '02209210224',
  ordine: "Ordine degli Architetti P.P.C. di Venezia, Sez. A, n. 4391",
  address: {
    street: 'Riviera XX Settembre 38',
    zip: '30171',
    city: 'Mestre',
    region: 'Venezia',
    country: 'IT',
  },
  geo: { lat: 45.4930668, lng: 12.2382017 },
  googleMaps: 'https://www.google.com/maps/place/Riccardo+Bandera+Architetto/@45.4930668,12.2382017,17z/data=!4m6!3m5!1s0x477eb448172c9ca7:0x433ec3bc8b6f20a3!8m2!3d45.4930668!4d12.2382017',
  social: {
    facebook: 'https://www.facebook.com/riccardobanderaarchitetto/',
    instagram: 'https://www.instagram.com/riccardobanderaarchitetto/',
    linkedin: 'https://www.linkedin.com/in/riccardo-bandera-a0370b65/',
  },
  // profili su portali di architettura (stessa identità: servono a Google e alle IA per riconoscere lo studio)
  profili: {
    houzz: 'https://www.houzz.it/professionisti/architetti/riccardo-bandera-architetto-pfvwit-pf~26771995',
    homify: 'https://www.homify.it/esperti/114375/riccardo-bandera-architetto',
    divisare: 'https://divisare.com/authors/2144619149-riccardo-bandera',
  },
  attivoDal: 2014,
  ordineNumero: '4391',
  ordineNome: 'Ordine degli Architetti, Pianificatori, Paesaggisti e Conservatori della Provincia di Venezia',
} as const;

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
export const altreAttivita = testi.altreAttivita;
export const ambiti = testi.ambiti;
