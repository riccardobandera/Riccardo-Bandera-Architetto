// Dati di sito e copy reale (estratti da riccardobandera.com - report.md).
// Nessun testo inventato: bio, manifesto e fasi sono quelli originali dello studio.

export const site = {
  name: 'Riccardo Bandera',
  role: 'Architetto',
  legalName: 'Riccardo Bandera Architetto',
  domain: 'riccardobandera.com',
  url: 'https://riccardobandera.com',
  tagline: "Studio di architettura e d'interni per abitazioni, hotel, uffici e negozi.",
  claim: 'Architettura, interni e bioedilizia in legno.',
  email: 'studio@riccardobandera.com',
  phone: '+39 349 3772802',
  phoneHref: '+393493772802',
  address: {
    street: 'Riviera XX Settembre 38',
    zip: '30174',
    city: 'Mestre',
    region: 'Venezia',
    country: 'IT',
  },
  social: {
    facebook: 'https://www.facebook.com/riccardobandera.architetto',
    instagram: 'https://www.instagram.com/riccardobandera_architetto/',
    linkedin: 'https://www.linkedin.com/in/riccardo-bandera-architetto/',
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

// Manifesto sintetico usato in home
export const manifestoQuote =
  '"Sviluppiamo i progetti nei quali siamo coinvolti seguendo un processo ordinato che tenga sotto controllo gli aspetti tecnico-economici durante tutte le fasi del progetto senza precludere le potenzialità creative dell’incarico."';

// Bio dello studio (Lo Studio)
export const studioBio = [
  'Dal 2014 esercito l’attività di architetto in modo autonomo seguendo in prima persona i clienti e i loro progetti dalla fase creativa alla realizzazione. Per farlo mi avvalgo di collaborazioni con imprese artigiane e professionisti specializzati svolgendo in accordo con la committenza il ruolo di regista.',
  'La mia formazione e l’esperienza nel campo della progettazione si sono sviluppate in oltre 15 anni. In questo tempo ho avuto occasione di affrontare progetti a tutte le scale e in ogni fase del progetto. Da soluzioni per piccoli appartamenti fino a mega-torri nel sud della Cina, da committenze private dirette a vittorie in concorsi internazionali, da funzioni commerciali a edifici per il pubblico benessere.',
  'Tutto questo all’interno di una concezione che è divenuta sempre più chiara: la progettazione come connessione tra immaginato e costruito. Un lavoro al servizio delle idee e delle richieste di committenze, le più diverse, cercando di volta in volta di indicare la soluzione al problema e di aggiungere valore all’idea stessa.',
];

export const team = [
  { name: 'arch. Riccardo Bandera', role: 'Founder' },
  { name: 'arch. Aldo Condò', role: 'Architetto' },
  { name: 'arch. Thomas Ortolan', role: 'Architetto' },
  { name: 'Marco Reato', role: 'Collaboratore' },
];

// Manifesto - il legno (bioedilizia)
export const manifesto = {
  lead: 'Il legno è l’unico materiale da costruzione sostenibile.',
  blocks: [
    {
      h: 'Perché usare il legno?',
      p: 'L’albero vive e cresce utilizzando elementi naturali: crea le molecole del legno di cui è costituito grazie all’acqua, all’energia del sole ed all’anidride carbonica (CO2) presente in atmosfera. Attraverso il processo di fotosintesi l’albero sottrae quindi naturalmente CO2 dall’atmosfera.',
    },
    {
      h: 'Quanta anidride carbonica assorbe un albero?',
      p: 'Una pianta adulta, come spiega Rita Baraldi, ricercatore del CNR di Bologna all’Istituto di Biometeorologia, nell’arco di dodici mesi soddisfa il fabbisogno di ossigeno di 10 persone ed è in grado di assorbire dai 20 ai 50 chili di anidride carbonica, a seconda della specie. Una quercia, ad esempio, nell’arco di mezzo secolo riesce a immagazzinare oltre 5 tonnellate e mezzo di CO2 sotto forma di biomassa.',
    },
    {
      h: 'Costruire con il legno significa immobilizzare tonnellate di CO2 per decenni.',
      p: 'Progettare in legno non è solo una scelta estetica o strutturale: è un gesto che trattiene il carbonio all’interno degli edifici, trasformando ogni costruzione in un deposito duraturo di CO2 sottratta all’atmosfera.',
    },
  ],
};

// Le 6 fasi del progetto - testo integrale
export const fasi = [
  {
    n: '01',
    title: 'Progetto architettonico',
    body: 'È il momento in cui l’immaginazione trova una struttura concreta. Attraverso analisi, sopralluoghi e dialogo con il cliente, viene definito il concept architettonico: spazi, funzioni, linguaggi e possibilità. Questa fase è dedicata alla visione, ma è già profondamente ancorata alla realtà del contesto. Vengono studiate soluzioni proporzionate, funzionali e coerenti con le esigenze della committenza e con l’identità del luogo. Il risultato è una proposta chiara, comprensibile e condivisa: la base fondativa di tutto ciò che verrà dopo.',
  },
  {
    n: '02',
    title: 'Progetto amministrativo e burocratico',
    body: 'Una buona idea non basta: deve essere compatibile con le normative, i regolamenti urbanistici e i vincoli locali. In questa fase lo studio si occupa di predisporre tutte le pratiche autorizzative necessarie, permessi, comunicazioni, relazioni tecniche e documentazione integrativa, agendo come interlocutore diretto con gli enti competenti. L’obiettivo è semplice: superare in modo fluido la parte più complessa e spesso più delicata del percorso, garantendo al cliente tranquillità e certezze.',
  },
  {
    n: '03',
    title: 'Progetto esecutivo',
    body: 'Dopo l’approvazione del progetto, è il momento di definire ogni particolare tecnico e costruttivo. Il progetto esecutivo traduce l’idea in indicazioni precise e realizzabili: materiali, stratigrafie, impianti, finiture, nodi costruttivi, soluzioni tecniche e specifiche di cantiere. È la fase che rende possibile un lavoro pulito, coordinato e senza sorprese, permettendo di guidare imprese e artigiani verso un risultato all’altezza della visione iniziale.',
  },
  {
    n: '04',
    title: 'Preventivi',
    body: 'Grazie alla rete di imprese e professionisti con cui lo studio collabora da anni, vengono richiesti e valutati preventivi dettagliati e comparabili. Ogni voce viene analizzata, verificata e discussa insieme al cliente per individuare la soluzione migliore in termini di qualità, costi e tempi. Il cliente riceve così un quadro preciso dell’investimento necessario, prima dell’avvio del cantiere.',
  },
  {
    n: '05',
    title: 'Direzione lavori',
    body: 'Durante il cantiere, lo studio assume il ruolo di regista e garante del progetto. Controllo delle lavorazioni, verifiche in corso d’opera, coordinamento delle imprese, risoluzione delle criticità e rispetto del progetto approvato: ogni attività viene monitorata con attenzione costante. L’obiettivo è assicurare che ciò che è stato immaginato e disegnato venga realizzato con cura, precisione e coerenza.',
  },
  {
    n: '06',
    title: 'Fine lavori',
    body: 'Terminata la fase di cantiere, lo studio segue la verifica finale delle opere e la compilazione di tutta la documentazione necessaria alla chiusura dell’intervento. Il cliente riceve un progetto completo, realizzato secondo gli obiettivi condivisi e pronto per essere vissuto. Un percorso che non si esaurisce con la consegna, ma che lascia spazio a un rapporto di fiducia destinato a durare nel tempo.',
  },
];

export const ambiti = [
  { key: 'residenziale', label: 'Residenziale', desc: 'Ville, appartamenti, ristrutturazioni e arredo d’interni.' },
  { key: 'commerciale', label: 'Commerciale', desc: 'Retail, bar, ristorazione e spazi per il pubblico.' },
  { key: 'alberghiero', label: 'Alberghiero', desc: 'Hotel, boutique hotel e strutture ricettive.' },
  { key: 'direzionale', label: 'Direzionale', desc: 'Uffici, headquarter e spazi di lavoro.' },
] as const;
