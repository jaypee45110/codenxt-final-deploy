export const DEFAULT_LANG = 'no';

export const LANGUAGES = [
  { code: 'no', flag: '🇳🇴', label: 'Norsk' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
];

const normalizeLang = (lang) => {
  const code = String(lang || '').trim().toLowerCase();
  if (code === 'sv' || code === 'th') return 'en';
  return LANGUAGES.some((language) => language.code === code) ? code : DEFAULT_LANG;
};

export const copy = {
  en: {
    start: 'Start',
    createEvent: 'Create event',
    next: 'Next',
    upload: 'Upload reward',
    openNow: 'Open now',
    drop: 'Drop unlocked',
    preparing: 'Preparing drop…',
    join: 'Join InnerCircle',
    joinNow: 'Join now',
    nextDrop: 'Want the next drop direct?',
    success: 'You are in',
    phone: 'Mobile number',

    navHow: 'How it works',
    navWhy: 'Why it matters',
    navUse: 'Use cases',
    navContact: 'Contact',

    topTag: 'LIVE ACCESS. NO APP.',
    heroTitle: 'Turn the last note into a digital souvenir.',
    heroText: 'Timed QR access for concerts, festivals, clubs, and live events. Fans scan. Access opens. The moment keeps going.',
    ctaPrimary: 'See the flow',
    ctaSecondary: 'Order setup',

    stat1Title: 'No app',
    stat1Text: 'Fast mobile entry',
    stat2Title: 'Timed access',
    stat2Text: 'Short release windows',
    stat3Title: 'Fan insight',
    stat3Text: 'See scans and response',

    panelTitle: 'Live drop flow',
    panelHeadline: 'Final note release',
    panelBox1: 'Crowd spike',
    panelBox2: 'Active window',
    panelBox3: 'Action rate',

    howTitle: 'How it works',
    howText: 'Big screen. Fast scan. Tight window. A release that stays connected to the room.',
    step1: 'QR on screen',
    step1Text: 'A code appears at the exact moment you choose.',
    step2: 'Instant scan',
    step2Text: 'Fans enter through mobile web. No app store step.',
    step3: 'Timed release',
    step3Text: 'Access opens for minutes, hours, or a short post-show window.',
    step4: 'Digital souvenir',
    step4Text: 'Audio, clip, bonus track, message, or another exclusive drop.',

    whyTitle: 'Why it matters',
    whyText: 'This is not just another QR campaign. It ties physical presence to a controlled digital release.',
    why1: 'Right moment',
    why1Text: 'The point is timing, not traffic.',
    why2: 'Low friction',
    why2Text: 'Fast entry matters when thousands move at once.',
    why3: 'More control',
    why3Text: 'Short windows keep the drop close to the event.',
    why4: 'Better signal',
    why4Text: 'You see who acted, when, and how the drop performed.',

    useTitle: 'Three clean use cases',
    useText: 'Same engine. Different release logic.',
    use1: 'Free preview',
    use1Text: 'Tease first. Full version next.',
    use2: 'Venue first',
    use2Text: 'Free inside. Different path later.',
    use3: 'Fan capture',
    use3Text: 'Keep entry easy. Build the direct channel after.',

    contactTitle: 'Built for artists, managers, festivals, clubs, and venues.',
    contactText: 'codeTone is made for timed access, controlled drops, and stronger fan response after the live moment.',
    contactBtn: 'Contact',
    footer: 'No app. Timed access. Controlled digital souvenirs.'
  },

  no: {
    start: 'Start',
    createEvent: 'Opprett event',
    next: 'Neste',
    upload: 'Last opp reward',
    openNow: 'Åpne nå',
    drop: 'Drop klar',
    preparing: 'Klargjør drop…',
    join: 'Bli med i InnerCircle',
    joinNow: 'Bli med',
    nextDrop: 'Vil du ha neste drop direkte?',
    success: 'Du er med',
    phone: 'Mobilnummer',

    navHow: 'Slik virker det',
    navWhy: 'Hvorfor det betyr noe',
    navUse: 'Bruksområder',
    navContact: 'Kontakt',

    topTag: 'LIVE TILGANG. INGEN APP.',
    heroTitle: 'Gjør siste tone til et digitalt souvenir.',
    heroText: 'Tidsstyrt QR-tilgang for konserter, festivaler, klubber og live events. Publikum scanner. Tilgang åpner. Øyeblikket fortsetter.',
    ctaPrimary: 'Se flyten',
    ctaSecondary: 'Bestill oppsett',

    stat1Title: 'Ingen app',
    stat1Text: 'Rask mobil inngang',
    stat2Title: 'Tidsstyrt tilgang',
    stat2Text: 'Korte release-vinduer',
    stat3Title: 'Publikumsinnsikt',
    stat3Text: 'Se scanninger og respons',

    panelTitle: 'Live drop-flyt',
    panelHeadline: 'Release ved siste tone',
    panelBox1: 'Publikumstopp',
    panelBox2: 'Aktivt vindu',
    panelBox3: 'Handlingsrate',

    howTitle: 'Slik virker det',
    howText: 'Storskjerm. Rask scan. Stramt vindu. En release som holder seg koblet til rommet.',
    step1: 'QR på skjerm',
    step1Text: 'En kode vises i det eksakte øyeblikket du velger.',
    step2: 'Umiddelbar scan',
    step2Text: 'Publikum går inn via mobilweb. Ingen appbutikk.',
    step3: 'Tidsstyrt release',
    step3Text: 'Tilgang åpner i minutter, timer eller et kort vindu etter showet.',
    step4: 'Digitalt souvenir',
    step4Text: 'Lyd, klipp, bonusspor, melding eller et annet eksklusivt drop.',

    whyTitle: 'Hvorfor det betyr noe',
    whyText: 'Dette er ikke bare enda en QR-kampanje. Det kobler fysisk tilstedeværelse til en kontrollert digital release.',
    why1: 'Riktig øyeblikk',
    why1Text: 'Poenget er timing, ikke trafikk.',
    why2: 'Lav friksjon',
    why2Text: 'Rask inngang betyr mye når tusenvis beveger seg samtidig.',
    why3: 'Mer kontroll',
    why3Text: 'Korte vinduer holder droppet tett på eventet.',
    why4: 'Bedre signal',
    why4Text: 'Du ser hvem som handlet, når, og hvordan droppet presterte.',

    useTitle: 'Tre rene bruksområder',
    useText: 'Samme motor. Ulik release-logikk.',
    use1: 'Gratis preview',
    use1Text: 'Smakebit først. Fullversjon etterpå.',
    use2: 'Venue først',
    use2Text: 'Gratis inne. Annen vei senere.',
    use3: 'Fan-capture',
    use3Text: 'Hold inngangen enkel. Bygg direkte kanal etterpå.',

    contactTitle: 'Bygget for artister, managers, festivaler, klubber og venues.',
    contactText: 'codeTone er laget for tidsstyrt tilgang, kontrollerte drops og sterkere publikumsrespons etter live-øyeblikket.',
    contactBtn: 'Kontakt',
    footer: 'Ingen app. Tidsstyrt tilgang. Kontrollerte digitale souvenirs.'
  }
};

export const checkoutPartnerRewardCopy = {
  no: {
    title: 'Partner Reward',
    enable: 'Aktiver Partner Reward',
    partnerName: 'Partnernavn',
    rewardTitle: 'Reward-tittel',
    quantity: 'GoldXtra-plasser',
    redemptionLocation: 'Innløsningssted',
    redemptionDeadline: 'Innløsningsfrist',
    redemptionInstructions: 'Innløsningsinstruksjoner',
    placeholders: {
      partnerName: 'Partner eller sponsor',
      rewardTitle: 'Signert bok, kinobillett, kaffe...',
      quantity: '20',
      redemptionLocation: 'Hvor lytteren viser QR-koden',
      redemptionInstructions: 'Vis GoldXtra QR-koden hos partneren.',
    },
  },
  en: {
    title: 'Partner Reward',
    enable: 'Enable Partner Reward',
    partnerName: 'Partner name',
    rewardTitle: 'Reward title',
    quantity: 'GoldXtra places',
    redemptionLocation: 'Redemption location',
    redemptionDeadline: 'Redemption deadline',
    redemptionInstructions: 'Redemption instructions',
    placeholders: {
      partnerName: 'Partner or sponsor',
      rewardTitle: 'Signed book, cinema ticket, coffee...',
      quantity: '20',
      redemptionLocation: 'Where the listener shows the QR code',
      redemptionInstructions: 'Show the GoldXtra QR code to the partner.',
    },
  },
  de: {
    title: 'Partner Reward',
    enable: 'Partner Reward aktivieren',
    partnerName: 'Partnername',
    rewardTitle: 'Reward-Titel',
    quantity: 'GoldXtra-Plaetze',
    redemptionLocation: 'Einloesungsort',
    redemptionDeadline: 'Einloesungsfrist',
    redemptionInstructions: 'Einloesungsanweisungen',
    placeholders: {
      partnerName: 'Partner oder Sponsor',
      rewardTitle: 'Signiertes Buch, Kinoticket, Kaffee...',
      quantity: '20',
      redemptionLocation: 'Wo der Hoerer den QR-Code zeigt',
      redemptionInstructions: 'GoldXtra QR-Code beim Partner zeigen.',
    },
  },
  fr: {
    title: 'Partner Reward',
    enable: 'Activer Partner Reward',
    partnerName: 'Nom du partenaire',
    rewardTitle: 'Titre du reward',
    quantity: 'Places GoldXtra',
    redemptionLocation: 'Lieu de validation',
    redemptionDeadline: 'Date limite de validation',
    redemptionInstructions: 'Instructions de validation',
    placeholders: {
      partnerName: 'Partenaire ou sponsor',
      rewardTitle: 'Livre signe, billet de cinema, cafe...',
      quantity: '20',
      redemptionLocation: 'Ou l’auditeur montre le QR code',
      redemptionInstructions: 'Presenter le QR code GoldXtra au partenaire.',
    },
  },
  es: {
    title: 'Partner Reward',
    enable: 'Activar Partner Reward',
    partnerName: 'Nombre del partner',
    rewardTitle: 'Titulo del reward',
    quantity: 'Plazas GoldXtra',
    redemptionLocation: 'Lugar de validacion',
    redemptionDeadline: 'Fecha limite de validacion',
    redemptionInstructions: 'Instrucciones de validacion',
    placeholders: {
      partnerName: 'Partner o patrocinador',
      rewardTitle: 'Libro firmado, entrada de cine, cafe...',
      quantity: '20',
      redemptionLocation: 'Donde el oyente muestra el QR',
      redemptionInstructions: 'Mostrar el codigo QR GoldXtra al partner.',
    },
  },
};

export const getLang = () => {
  const params = new URLSearchParams(window.location.search);
  return normalizeLang(params.get('lang') || localStorage.getItem('codepod_lang'));
};

export const setLang = (lang) => {
  const next = normalizeLang(lang);
  const url = new URL(window.location);
  url.searchParams.set('lang', next);
  window.history.replaceState({}, '', url);
  localStorage.setItem('codepod_lang', next);
  return next;
};

export const t = (lang) => copy[lang] || copy.en;
