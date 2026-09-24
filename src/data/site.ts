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
  phoneOffice: '+39 041 5044332',
  phoneOfficeHref: '+390415044332',
  piva: '02209210224',
  ordine: "Ordine degli Architetti P.P.C. di Venezia, Sez. A, n. 4391",
  address: {
    street: 'Riviera XX Settembre 38',
    zip: '30174',
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
} as const;

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
export const team = testi.studio.team;
export const manifesto = testi.manifesto;
export const fasiIntro = testi.fasi.intro;
export const fasi = testi.fasi.elenco;
export const altreAttivita = testi.altreAttivita;
export const ambiti = testi.ambiti;
