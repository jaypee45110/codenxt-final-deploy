import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getLang, setLang as persistLang, t as getAppCopy } from '../i18n';
import badgeBase from '../assets/cpBadges/codestack-badge.png';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';
const STORAGE_KEYS = ['codenxt_event', 'codestack_latest_event'];
const BONUS_TIERS = ['gold', 'silver', 'general'];
const BONUS_TYPES = ['pdf', 'image', 'audio', 'video', 'url'];
const DEFAULT_TIER_SPLIT = { gold: 10, silver: 20, general: 70 };

const dashboardCopy = {
  no: {
    title: 'KONTROLLSENTER',
    subtitle: 'Kontrollpanel for presentasjon, bonusinnhold og rapportering.',
    byline: 'codeStack by codeNXT',
    missingRelease: 'Ingen release funnet. Opprett releasen i Checkout først.',
    refreshData: 'Oppdater fra Checkout',
    stackFallback: 'Stack mangler',
    releaseFallback: 'Release mangler',
    logoFallback: 'Logo klargjøres fra Checkout',
    publishDate: 'Publ. dato',
    expectedMembers: 'Antatt lyttere',
    publisher: 'Vert',
    releaseCode: 'Releasekode',
    platform: 'Plattform',
    memberLink: 'Lytterlenke',
    scans: 'Skanninger',
    uniqueScans: 'Unike skanninger',
    insideJoins: 'InSide joins',
    conversionRate: 'Konverteringsrate',
    presentation: 'Presentasjon',
    insideMessage: 'Bli med i InSide',
    downloadImage: 'Last ned bilde',
    presentationHint: 'Legg bildet inn som hale etter stacken. Anbefalt varighet: 12 sekunder.',
    imageReady: 'Bilde klart.',
    imageError: 'Kunne ikke lage bilde. Prøv igjen.',
    bonus: 'Bonus',
    bonusHelp: 'Bonusinnhold for hver InSide-niva.',
    tierCount: 'Antall bonusnivåer',
    tierCount1: '1 nivå: Gull',
    tierCount2: '2 nivåer: Gull + Sølv',
    tierCount3: '3 nivåer: Gull + Sølv + Generell',
    tier: 'Nivå',
    gold: 'Gull',
    silver: 'Sølv',
    general: 'Generell',
    titleLabel: 'Tittel',
    description: 'Beskrivelse',
    type: 'Type',
    pdf: 'PDF',
    image: 'Bilde',
    audio: 'Lyd',
    video: 'Video',
    url: 'Lenke',
    fileOrUrl: 'Fil eller URL',
    chooseFile: 'Velg fil',
    edit: 'Rediger',
    saveBonus: 'Lagre bonus',
    savingBonus: 'Lagrer...',
    saved: 'Lagret',
    empty: 'Tom',
    localFallback: 'Backend svarte ikke. Bonusen er lagret lokalt.',
    ready: 'Klar',
    notSet: 'Ikke satt',
    report: 'Rapport',
    reportHelp: 'Hent rapport eller last ned CSV for releasen.',
    viewReport: 'Hent rapport',
    downloadCsv: 'Last ned CSV',
    reportUnavailable: 'Rapport-endepunktet er ikke tilgjengelig. Lokale tall vises hvis de finnes.',
    reportPdfTitle: 'Stackrapport',
    collaborationLabel: 'I samarbeid med',
    sentDate: 'Sendt dato',
    eventCodeLabel: 'Eventkode',
    bonusDistribution24h: 'Bonusfordeling (24 timer etter release)',
    bonusActive24h: '${esc(text.bonusActive24h || text.bonusDistribution24h || "Bonus aktiv: 24 timer etter release")}',
    csvColumns: 'eventCode, scanId, phone, timestamp, tier, source',
    unavailable: 'Ikke tilgjengelig',
  },
  en: {
    title: 'CONTROL CENTER',
    subtitle: 'Control panel for presentation, bonus content, and reporting.',
    byline: 'codeStack by codeNXT',
    missingRelease: 'No release found. Create the release in Checkout first.',
    refreshData: 'Refresh from Checkout',
    stackFallback: 'Stack missing',
    releaseFallback: 'Release missing',
    logoFallback: 'Logo prepared from Checkout',
    publishDate: 'Publ. date',
    expectedMembers: 'Expected members',
    publisher: 'Publisher',
    releaseCode: 'Release code',
    platform: 'Platform',
    memberLink: 'Member link',
    scans: 'Scans',
    uniqueScans: 'Unique scans',
    insideJoins: 'InSide joins',
    conversionRate: 'Conversion rate',
    presentation: 'Presentation',
    insideMessage: 'Join InSide',
    downloadImage: 'Download image',
    presentationHint: 'Use this image as a tail after the stack. Recommended duration: 12 seconds.',
    imageReady: 'Image ready.',
    imageError: 'Could not create image. Try again.',
    bonus: 'Bonus',
    bonusHelp: 'Only bonus content is managed here. Stack data comes from Checkout.',
    tier: 'Tier',
    gold: 'Gold',
    silver: 'Silver',
    general: 'General',
    titleLabel: 'Title',
    description: 'Description',
    type: 'Type',
    pdf: 'PDF',
    image: 'Image',
    audio: 'Audio',
    video: 'Video',
    url: 'Link',
    fileOrUrl: 'File or URL',
    chooseFile: 'Choose file',
    edit: 'Edit',
    saveBonus: 'Save bonus',
    savingBonus: 'Saving...',
    saved: 'Saved',
    empty: 'Empty',
    localFallback: 'The backend did not respond. Bonus saved locally.',
    ready: 'Ready',
    notSet: 'Not set',
    report: 'Report',
    reportHelp: 'View the report or download CSV for the release.',
    viewReport: 'View report',
    downloadCsv: 'Download CSV',
    reportUnavailable: 'The report endpoint is not available. Local numbers are shown if present.',
    reportPdfTitle: 'Stack report',
    collaborationLabel: 'In collaboration with',
    sentDate: 'Release date',
    eventCodeLabel: 'Event code',
    bonusDistribution24h: 'Bonus distribution (24 hours after release)',
    bonusActive24h: 'Bonus active: 24 hours after release',
    csvColumns: 'eventCode, scanId, phone, timestamp, tier, source',
    unavailable: 'Unavailable',
  },
  de: {
    title: 'KONTROLLZENTRUM',
    subtitle: 'Kontrollpanel fuer Praesentation, Bonusinhalte und Reporting.',
    byline: 'codeStack by codeNXT',
    missingRelease: 'Keine Release gefunden. Erstelle die Release zuerst im Checkout.',
    refreshData: 'Aus Checkout aktualisieren',
    stackFallback: 'Stack fehlt',
    releaseFallback: 'Release fehlt',
    logoFallback: 'Logo aus Checkout vorbereitet',
    publishDate: 'Veroeff. datum',
    expectedMembers: 'Erwartete Hoerer',
    publisher: 'Publisher',
    releaseCode: 'Releasencode',
    platform: 'Plattform',
    memberLink: 'Hoererlink',
    scans: 'Scans',
    uniqueScans: 'Einmalige Scans',
    insideJoins: 'InSide-Beitritte',
    conversionRate: 'Conversion Rate',
    presentation: 'Praesentation',
    insideMessage: 'InSide beitreten',
    downloadImage: 'Bild herunterladen',
    presentationHint: 'Dieses Bild als Abspann nach dem Stack verwenden. Empfohlene Dauer: 12 Sekunden.',
    imageReady: 'Bild bereit.',
    imageError: 'Bild konnte nicht erstellt werden. Bitte erneut versuchen.',
    bonus: 'Bonus',
    bonusHelp: 'Hier werden nur Bonusinhalte verwaltet. Stackdaten kommen aus Checkout.',
    tier: 'Stufe',
    gold: 'Gold',
    silver: 'Silber',
    general: 'Allgemein',
    titleLabel: 'Titel',
    description: 'Beschreibung',
    type: 'Typ',
    pdf: 'PDF',
    image: 'Bild',
    audio: 'Audio',
    video: 'Video',
    url: 'Link',
    fileOrUrl: 'Datei oder URL',
    chooseFile: 'Datei waehlen',
    edit: 'Bearbeiten',
    saveBonus: 'Bonus speichern',
    savingBonus: 'Speichert...',
    saved: 'Gespeichert',
    empty: 'Leer',
    localFallback: 'Das Backend hat nicht geantwortet. Bonus lokal gespeichert.',
    ready: 'Bereit',
    notSet: 'Nicht gesetzt',
    report: 'Bericht',
    reportHelp: 'Bericht ansehen oder CSV fuer die Release herunterladen.',
    viewReport: 'Bericht ansehen',
    downloadCsv: 'CSV herunterladen',
    reportUnavailable: 'Der Report-Endpunkt ist nicht verfuegbar. Lokale Zahlen werden angezeigt, wenn vorhanden.',
    reportPdfTitle: 'Stack-Bericht',
    collaborationLabel: 'In Zusammenarbeit mit',
    sentDate: 'Veroeffentlichungsdatum',
    eventCodeLabel: 'Eventcode',
    bonusDistribution24h: 'Bonusverteilung (24 Stunden nach Veroeffentlichung)',
    bonusActive24h: 'Bonus aktiv: 24 Stunden nach Veroeffentlichung',
    csvColumns: 'eventCode, scanId, phone, timestamp, tier, source',
    unavailable: 'Nicht verfuegbar',
  },
  fr: {
    title: 'CENTRE DE CONTROLE',
    subtitle: 'Panneau de controle pour presentation, contenu bonus et reporting.',
    byline: 'codeStack by codeNXT',
    missingRelease: 'Aucun release trouve. Creez d abord l release dans Checkout.',
    refreshData: 'Actualiser depuis Checkout',
    stackFallback: 'Stack manquant',
    releaseFallback: 'Release manquant',
    logoFallback: 'Logo prepare depuis Checkout',
    publishDate: 'Date publ.',
    expectedMembers: 'Auditeurs prevus',
    publisher: 'Hote',
    releaseCode: 'Code release',
    platform: 'Plateforme',
    memberLink: 'Lien auditeur',
    scans: 'Scans',
    uniqueScans: 'Scans uniques',
    insideJoins: 'Rejoins InSide',
    conversionRate: 'Taux de conversion',
    presentation: 'Presentation',
    insideMessage: 'Rejoindre InSide',
    downloadImage: 'Telecharger image',
    presentationHint: 'Utilisez cette image comme fin après le stack. Durée recommandée : 12 secondes.',
    imageReady: 'Image prete.',
    imageError: 'Impossible de creer l image. Reessayez.',
    bonus: 'Bonus',
    bonusHelp: 'Seul le contenu bonus est gere ici. Les donnees stack viennent de Checkout.',
    tier: 'Niveau',
    gold: 'Or',
    silver: 'Argent',
    general: 'General',
    titleLabel: 'Titre',
    description: 'Description',
    type: 'Type',
    pdf: 'PDF',
    image: 'Image',
    audio: 'Audio',
    video: 'Video',
    url: 'Lien',
    fileOrUrl: 'Fichier ou URL',
    chooseFile: 'Choisir fichier',
    edit: 'Modifier',
    saveBonus: 'Enregistrer bonus',
    savingBonus: 'Enregistrement...',
    saved: 'Enregistre',
    empty: 'Vide',
    localFallback: 'Le backend n a pas repondu. Bonus enregistre localement.',
    ready: 'Pret',
    notSet: 'Non defini',
    report: 'Rapport',
    reportHelp: 'Voir le rapport ou telecharger le CSV de l release.',
    viewReport: 'Voir rapport',
    downloadCsv: 'Telecharger CSV',
    reportUnavailable: 'Le endpoint rapport n est pas disponible. Les chiffres locaux sont affiches si disponibles.',
    reportPdfTitle: 'Rapport stack',
    collaborationLabel: 'En collaboration avec',
    sentDate: 'Date de publication',
    eventCodeLabel: 'Code evenement',
    bonusDistribution24h: 'Repartition bonus (24 heures apres publication)',
    bonusActive24h: 'Bonus actif : 24 heures apres publication',
    csvColumns: 'eventCode, scanId, phone, timestamp, tier, source',
    unavailable: 'Indisponible',
  },
  es: {
    title: 'CENTRO DE CONTROL',
    subtitle: 'Panel de control para presentacion, contenido extra e informes.',
    byline: 'codeStack by codeNXT',
    missingRelease: 'No se encontro ningun episodio. Crea primero el episodio en Checkout.',
    refreshData: 'Actualizar desde Checkout',
    stackFallback: 'Stack faltante',
    releaseFallback: 'Episodio faltante',
    logoFallback: 'Logo preparado desde Checkout',
    publishDate: 'Fecha publ.',
    expectedMembers: 'Oyentes previstos',
    publisher: 'Publisher',
    releaseCode: 'Codigo episodio',
    platform: 'Plataforma',
    memberLink: 'Enlace oyente',
    scans: 'Scans',
    uniqueScans: 'Scans unicos',
    insideJoins: 'Uniones a InSide',
    conversionRate: 'Tasa conversion',
    presentation: 'Presentacion',
    insideMessage: 'Unirse a InSide',
    downloadImage: 'Descargar imagen',
    presentationHint: 'Usa esta imagen como cierre del stack. Duración recomendada: 12 segundos.',
    imageReady: 'Imagen lista.',
    imageError: 'No se pudo crear la imagen. Intentalo de nuevo.',
    bonus: 'Bonus',
    bonusHelp: 'Aqui solo se gestiona contenido extra. Los datos del stack vienen de Checkout.',
    tier: 'Nivel',
    gold: 'Oro',
    silver: 'Plata',
    general: 'General',
    titleLabel: 'Titulo',
    description: 'Descripcion',
    type: 'Tipo',
    pdf: 'PDF',
    image: 'Imagen',
    audio: 'Audio',
    video: 'Video',
    url: 'Enlace',
    fileOrUrl: 'Archivo o URL',
    chooseFile: 'Elegir archivo',
    edit: 'Editar',
    saveBonus: 'Guardar bonus',
    savingBonus: 'Guardando...',
    saved: 'Guardado',
    empty: 'Vacio',
    localFallback: 'El backend no respondio. Bonus guardado localmente.',
    ready: 'Listo',
    notSet: 'No definido',
    report: 'Informe',
    reportHelp: 'Ver informe o descargar CSV del episodio.',
    viewReport: 'Ver informe',
    downloadCsv: 'Descargar CSV',
    reportUnavailable: 'El endpoint de informe no esta disponible. Se muestran datos locales si existen.',
    reportPdfTitle: 'Informe stack',
    collaborationLabel: 'En colaboracion con',
    sentDate: 'Fecha de publicacion',
    eventCodeLabel: 'Codigo del evento',
    bonusDistribution24h: 'Distribucion de bonus (24 horas despues del lanzamiento)',
    bonusActive24h: 'Bonus activo: 24 horas despues del lanzamiento',
    csvColumns: 'eventCode, scanId, phone, timestamp, tier, source',
    unavailable: 'No disponible',
  },
};

function readJsonStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== '') || '';
}

function normalizeReleaseData(data = {}, previous = {}) {
  const eventCode = firstValue(data.eventCode, data.code, previous.eventCode, previous.code);
  const stackName = firstValue(data.stackName, data.artistName, data.name, previous.stackName, previous.artistName);
  const releaseTitle = firstValue(data.releaseTitle, data.releaseName, data.title, previous.releaseTitle, previous.releaseName);
  const logo = firstValue(data.stackLogo, data.stackImage, data.logoUrl, data.artistLogo, data.image, previous.stackLogo, previous.stackImage, previous.logoUrl, previous.artistLogo);
  const publishDate = firstValue(data.publishDate, data.releaseDate, data.eventDate, data.startAt, previous.publishDate, previous.releaseDate, previous.eventDate);
  const platform = firstValue(data.platform, data.channel, data.venue, previous.platform, previous.channel, previous.venue);
  const memberCount = firstValue(data.expectedMembers, data.estimatedMembers, data.audienceSize, data.members, previous.expectedMembers, previous.estimatedMembers, previous.audienceSize);
  const joinUrl = firstValue(data.joinUrl, data.memberLink, data.shortLink, previous.joinUrl, previous.memberLink, previous.shortLink, eventCode ? `${window.location.origin}/join/${eventCode}` : '');

  return {
    ...previous,
    ...data,
    vertical: firstValue(data.vertical, previous.vertical, 'codestack'),
    productName: firstValue(data.productName, previous.productName, 'codeStack'),
    eventCode,
    code: eventCode,
    stackName,
    artistName: stackName,
    releaseTitle,
    releaseName: releaseTitle,
    stackLogo: logo,
    stackImage: logo,
    artistLogo: logo,
    publishDate,
    releaseDate: publishDate,
    eventDate: publishDate,
    expectedMembers: memberCount,
    estimatedMembers: memberCount,
    audienceSize: memberCount,
    publisherName: firstValue(data.publisherName, data.publisher, data.presenter, previous.publisherName, previous.publisher),
    platform,
    venue: platform,
    joinUrl,
    memberLink: joinUrl,
    shortLink: joinUrl,
    language: firstValue(data.language, data.lang, previous.language),
    metadata: {
      ...(previous.metadata || {}),
      ...(data.metadata || {}),
      createdAt: firstValue(data.createdAt, previous.createdAt),
      logoFileName: firstValue(data.logoFileName, previous.logoFileName),
    },
  };
}

function makeConversion(joins, uniqueScans) {
  const unique = Number(uniqueScans || 0);
  if (!unique) return '0%';
  return `${Math.min(100, (Number(joins || 0) / unique) * 100).toFixed(1)}%`;
}

function csvEscape(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export default function Dashboard({ lang: appLang, setLang }) {
  const location = useLocation();
  const [lang, setLangState] = useState(appLang || getLang());
  const text = useMemo(() => {
    const appText = getAppCopy(lang);
    return {
      ...dashboardCopy.en,
      ...(appText.dashboard || {}),
      ...(dashboardCopy[lang] || {}),
      app: appText,
    };
  }, [lang]);

  const [eventData, setEventData] = useState(() => {
    const stored = STORAGE_KEYS.map(readJsonStorage).find((item) => item?.eventCode || item?.code) || {};
    return normalizeReleaseData(stored);
  });
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [imageStatus, setImageStatus] = useState('');
  const [activeTier, setActiveTier] = useState('gold');
  const [tierCount, setTierCount] = useState(3);
  const [tierSplit, setTierSplit] = useState(DEFAULT_TIER_SPLIT);
  const [bonusSaving, setBonusSaving] = useState(false);
  const [bonusMessage, setBonusMessage] = useState('');
  const [bonusDrafts, setBonusDrafts] = useState(() => {
    return BONUS_TIERS.reduce((acc, tier) => {
      acc[tier] = {
        title: '',
        description: '',
        type: 'url',
        url: '',
        fileName: '',
        file: null,
        status: 'empty',
        storage: '',
      };
      return acc;
    }, {});
  });
  const [report, setReport] = useState({
    totalScans: 0,
    uniqueScans: 0,
    joins: 0,
    rows: [],
    source: 'local',
  });
  const [reportMessage, setReportMessage] = useState('');

  const handleLanguageChange = useCallback((nextLang) => {
    const savedLang = persistLang(nextLang);
    setLangState(savedLang);
    if (setLang) setLang(savedLang);
  }, [setLang]);

  const joinUrl = useMemo(() => {
    const code = eventData.eventCode || eventData.code;
    if (!code) return '';
    const base = eventData.joinUrl || eventData.memberLink || eventData.shortLink || `${window.location.origin}/join/${code}`;
    const url = new URL(base, window.location.origin);
    url.searchParams.set('lang', lang);
    return url.toString();
  }, [eventData.code, eventData.eventCode, eventData.joinUrl, eventData.memberLink, eventData.shortLink, lang]);

  const loadCheckoutData = useCallback(async () => {
    const params = new URLSearchParams(location.search);
    const queryCode = params.get('event') || params.get('code');
    const stateData = location.state || {};
    const stored = STORAGE_KEYS.map(readJsonStorage).find((item) => item?.eventCode || item?.code) || {};
    const activeCode = queryCode || stateData.eventCode || stateData.code || stored.eventCode || stored.code || eventData.eventCode;

    let backendData = {};
    if (activeCode) {
      try {
        const res = await fetch(`${API_BASE}/event/${encodeURIComponent(activeCode)}?vertical=codestack`);
        if (res.ok) backendData = await res.json();
      } catch (error) {
        console.warn('Checkout event refresh failed:', error);
      }
    }

    setEventData((previous) => {
      const merged = normalizeReleaseData(
        {
          ...stored,
          ...stateData,
          ...backendData,
          eventCode: backendData.code || backendData.eventCode || activeCode,
        },
        previous
      );
      if (merged.eventCode) {
        localStorage.setItem('codenxt_event', JSON.stringify(merged));
        localStorage.setItem('codestack_latest_event', JSON.stringify(merged));
        localStorage.setItem('codenxt_active_event_code', merged.eventCode);
      }
      return merged;
    });
  }, [eventData.eventCode, location.search, location.state]);

  const loadReport = useCallback(async () => {
    if (!eventData.eventCode) return;
    setReportMessage('');
    try {
      const res = await fetch(`${API_BASE}/report/${encodeURIComponent(eventData.eventCode)}?vertical=codestack`);
      if (!res.ok) throw new Error(`Report failed: ${res.status}`);
      const data = await res.json();
      const legacyJoinKey = 'inner' + 'CircleJoinCount';
      const legacyRowsKey = 'inner' + 'Circle';
      const totalScans = Number(data?.metrics?.scans || data?.metrics?.totalScans || data?.totalScans || 0);
      const uniqueScans = Number(data?.metrics?.uniqueScans || data?.uniqueScans || 0);
      const joins = Number(data?.metrics?.joins || data?.metrics?.[legacyJoinKey] || data?.[legacyJoinKey] || data?.joins || 0);
      const rows = (data?.scans || data?.[legacyRowsKey] || data?.rows || []).map((entry, index) => ({
        eventCode: eventData.eventCode,
        scanId: entry.scanId || entry.id || `scan-${index + 1}`,
        phone: entry.phone || '',
        timestamp: entry.timestamp || entry.createdAt || '',
        tier: entry.tier || entry.rewardTier || '',
        source: entry.source || entry.type || 'qr',
      }));
      setReport({ totalScans, uniqueScans, joins, rows, source: 'backend' });
      setReportMessage(`Rapport hentet: ${totalScans} skanninger, ${joins} InSide-joins.`);
    } catch (error) {
      console.warn('Report unavailable:', error);
      setReportMessage(text.reportUnavailable);
      const localRows = readJsonStorage(`codestack_report_rows_${eventData.eventCode}`);
      setReport((previous) => ({
        ...previous,
        rows: Array.isArray(localRows) ? localRows : previous.rows,
        source: 'local',
      }));
    }
  }, [eventData.eventCode, text.reportUnavailable]);

  useEffect(() => {
    document.title = `${text.title} - codeStack`;
  }, [text.title]);

  useEffect(() => {
    if (appLang && appLang !== lang) setLangState(appLang);
  }, [appLang, lang]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlLang = params.get('lang');
    if (urlLang) handleLanguageChange(urlLang);
  }, [handleLanguageChange, location.search]);

  useEffect(() => {
    loadCheckoutData();
  }, [loadCheckoutData]);

  useEffect(() => {
    if (!joinUrl) return;
    QRCode.toDataURL(joinUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 420,
      color: { dark: '#06111f', light: '#ffffff' },
    })
      .then(setQrDataUrl)
      .catch((error) => console.error('QR render failed:', error));
  }, [joinUrl]);

  useEffect(() => {
    if (!eventData.eventCode) return;

    loadReport();

    const reportTimer = window.setInterval(() => {
      loadReport();
    }, 20000);

    return () => window.clearInterval(reportTimer);
  }, [eventData.eventCode, loadReport]);

  const updateBonusDraft = (tier, patch) => {
    setBonusDrafts((previous) => {
      const next = { ...previous, [tier]: { ...previous[tier], ...patch } };
      return next;
    });
  };

  const saveBonus = useCallback(async () => {
    const draft = bonusDrafts[activeTier];
    if (!eventData.eventCode || (!draft.url && !draft.file)) return;
    setBonusSaving(true);
    setBonusMessage('');

    let bonusUrl = draft.url;
    try {
      if (draft.file && draft.type !== 'url') {
        const formData = new FormData();
        formData.append('file', draft.file);
        formData.append('eventCode', eventData.eventCode);
        const uploadRes = await fetch(`${API_BASE}/upload-reward-file`, {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error(`File upload failed: ${uploadRes.status}`);
        const uploadData = await uploadRes.json();
        bonusUrl = uploadData.url || uploadData.fileUrl || '';
        if (!bonusUrl) throw new Error('Missing upload URL');
      }

      const reward = {
        vertical: 'codestack',
        eventCode: eventData.eventCode,
        tier: activeTier,
        title: draft.title,
        description: draft.description,
        type: draft.type,
        url: bonusUrl,
        fileName: draft.fileName,
        stackName: eventData.stackName,
        releaseTitle: eventData.releaseTitle,
        stackLogo: eventData.stackLogo,
        createdAt: new Date().toISOString(),
      };

      let eventId = eventData.id;
      if (!eventId) {
        try {
          const eventRes = await fetch(`${API_BASE}/event/${encodeURIComponent(eventData.eventCode)}?vertical=codestack`);
          if (eventRes.ok) {
            const eventInfo = await eventRes.json();
            eventId = eventInfo.id;
          }
        } catch {
          eventId = null;
        }
      }

      const bonusRes = await fetch(`${API_BASE}/reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, reward }),
      });
      if (!bonusRes.ok) throw new Error(`Reward save failed: ${bonusRes.status}`);

      updateBonusDraft(activeTier, { ...draft, url: bonusUrl, file: null, status: 'saved', storage: 'backend' });
      setBonusMessage(`${text.saved}: ${text[activeTier]}`);
    } catch (error) {
      console.warn('Bonus backend save failed, using localStorage fallback:', error);
      updateBonusDraft(activeTier, { ...draft, file: null, status: 'saved', storage: 'local' });
      setBonusMessage(text.localFallback);
    } finally {
      setBonusSaving(false);
    }
  }, [activeTier, bonusDrafts, eventData, text]);

  const downloadBadgeImage = useCallback(async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');
      const base = await loadImage(badgeBase);
      ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

      if (qrDataUrl) {
        const qr = await loadImage(qrDataUrl);
        const qrLeft = canvas.width * 0.3875;
        const qrTop = canvas.height * 0.319;
        const qrSize = canvas.width * 0.225;
        const quiet = qrSize * 0.035;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrLeft, qrTop, qrSize, qrSize);
        ctx.drawImage(qr, qrLeft + quiet, qrTop + quiet, qrSize - quiet * 2, qrSize - quiet * 2);
      }

      if (eventData.eventCode) {
        ctx.save();
        ctx.font = '300 18px Arial, Helvetica, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
        ctx.shadowBlur = 8;
        ctx.fillText(String(eventData.eventCode).toUpperCase(), canvas.width - 34, 28);
        ctx.restore();
      }

      const link = document.createElement('a');
      link.download = `${eventData.eventCode || 'codestack'}-badge.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setImageStatus(text.imageReady);
    } catch (error) {
      console.error('Badge download failed:', error);
      setImageStatus(text.imageError);
    }
  }, [eventData.eventCode, qrDataUrl, text.imageError, text.imageReady]);

  const fetchReport = useCallback(() => {
    loadReport();
  }, [loadReport]);

  const exportPdfReport = useCallback(async () => {
    if (!eventData.eventCode) {
      setReportMessage(text.reportUnavailable);
      return;
    }

    let reportForPdf = report;

    try {
      const res = await fetch(`${API_BASE}/report/${encodeURIComponent(eventData.eventCode)}?vertical=codestack`);
      if (res.ok) {
        const data = await res.json();
        const legacyJoinKey = 'inner' + 'CircleJoinCount';
        const legacyRowsKey = 'inner' + 'Circle';

        const totalScans = Number(data?.metrics?.scans || data?.metrics?.totalScans || data?.totalScans || 0);
        const uniqueScans = Number(data?.metrics?.uniqueScans || data?.uniqueScans || 0);
        const joins = Number(data?.metrics?.joins || data?.metrics?.[legacyJoinKey] || data?.[legacyJoinKey] || data?.joins || 0);

        const rows = (data?.scans || data?.[legacyRowsKey] || data?.rows || []).map((entry, index) => ({
          eventCode: eventData.eventCode,
          scanId: entry.scanId || entry.id || `scan-${index + 1}`,
          phone: entry.phone || '',
          timestamp: entry.timestamp || entry.createdAt || '',
          tier: entry.tier || entry.rewardTier || '',
          source: entry.source || entry.type || 'qr',
        }));

        reportForPdf = { totalScans, uniqueScans, joins, rows, source: 'backend' };
        setReport(reportForPdf);
      }
    } catch (error) {
      console.warn('PDF report fetch failed:', error);
    }

    const esc = (value) => String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');

    const rows = Array.isArray(reportForPdf.rows) ? reportForPdf.rows : [];
    const generatedAt = new Date().toLocaleString();

    const logoUrl = eventData.stackLogo || eventData.artistLogo || eventData.logoUrl || '';

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${esc(text.reportPdfTitle || text.report)} - ${esc(eventData.eventCode)}</title>
<style>
  body {
    margin: 0;
    padding: 34px;
    font-family: Arial, Helvetica, sans-serif;
    background: #eef3f8;
    color: #07111f;
  }

  .report {
    max-width: 960px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 26px;
    overflow: hidden;
    box-shadow: 0 22px 70px rgba(0,0,0,0.14);
  }

  .hero {
    background:
      radial-gradient(circle at 18% 12%, rgba(0,240,255,.22), transparent 34%),
      linear-gradient(135deg, #050b18 0%, #071426 58%, #03141b 100%);
    color: white;
    padding: 34px 38px 32px;
  }

  .brand-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  .logo-box {
    width: 94px;
    height: 94px;
    border-radius: 22px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex: 0 0 auto;
  }

  .logo-box img {
    max-width: 82px;
    max-height: 82px;
    object-fit: contain;
  }

  .brand {
    color: #20e7ff;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  h1 {
    margin: 10px 0 6px;
    font-size: 38px;
    line-height: 1.05;
    letter-spacing: -.03em;
  }

  .release {
    margin: 0;
    color: rgba(255,255,255,.76);
    font-size: 16px;
    font-weight: 700;
  }

  .meta {
    text-align: right;
    color: rgba(255,255,255,.72);
    font-size: 13px;
    line-height: 1.7;
    min-width: 220px;
  }

  .meta strong {
    color: #fff;
  }

  .content {
    padding: 30px 38px 36px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 14px;
    margin: 0 0 28px;
  }

  .card {
    border: 1px solid #dbe5f0;
    border-radius: 18px;
    padding: 18px;
    background: linear-gradient(180deg, #fbfdff 0%, #f4f8fc 100%);
  }

  .label {
    font-size: 10px;
    color: #667386;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: .10em;
  }

  .value {
    margin-top: 8px;
    font-size: 32px;
    font-weight: 950;
    color: #07111f;
  }

  .section-title {
    margin: 8px 0 12px;
    font-size: 17px;
    font-weight: 950;
    color: #07111f;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    border: 1px solid #e2eaf3;
    border-radius: 14px;
    overflow: hidden;
  }

  th {
    text-align: left;
    background: #07111f;
    color: white;
    padding: 12px 10px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: .08em;
  }

  td {
    border-bottom: 1px solid #e8eef6;
    padding: 11px 10px;
    color: #172335;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background: #f8fbfe;
  }

  .footer {
    margin-top: 26px;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    color: #7b8797;
    font-size: 11px;
    border-top: 1px solid #e8eef6;
    padding-top: 16px;
  }

  @media print {
    body {
      background: white;
      padding: 0;
    }
    .report {
      box-shadow: none;
      border-radius: 0;
    }
  }
</style>
</head>
<body>
  <div class="report">
    <div class="hero">
      <div style="text-align:center;">
        ${
          logoUrl
            ? `
              <div style="
                display:flex;
                justify-content:center;
                margin-bottom: 18px;
              ">
                <div class="logo-box" style="
                  width: 120px;
                  height: 120px;
                  margin: 0 auto;
                ">
                  <img src="${esc(logoUrl)}" alt="" />
                </div>
              </div>
            `
            : ''
        }

        <div style="
          color: rgba(255,255,255,0.68);
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
        ">
          ${esc(text.collaborationLabel || 'I samarbeid med')}
        </div>

        <div style="
          display:flex;
          justify-content:center;
          margin-bottom:18px;
        ">
          <img
            src="https://codestack.codenxt.global/codestack-logo.png"
            alt="codeStack"
            style="
              width: 180px;
              max-width: 60%;
              height: auto;
              display: block;
            "
          />
        </div>

        <div class="brand" style="
          font-size: 18px;
          letter-spacing: .14em;
          margin-bottom: 22px;
        ">
          ${esc(text.reportPdfTitle || text.report)}
        </div>

        <h1 style="
          margin: 0 0 8px;
          font-size: 42px;
        ">
          ${esc(eventData.stackName || 'codeStack')}
        </h1>

        <p class="release" style="
          margin: 0 0 8px;
          font-size: 18px;
        ">
          ${esc(eventData.releaseTitle || '')}
        </p>

        <p style="
          margin: 0;
          color: rgba(255,255,255,.72);
          font-size: 14px;
          line-height: 1.8;
          font-weight: 600;
        ">
          ${eventData.releaseDate ? `${esc(text.sentDate || 'Sendt dato')}: ${esc(String(eventData.releaseDate).slice(0, 10))}<br/>` : ''}
          ${esc(text.eventCodeLabel || 'Event code')}: ${esc(eventData.eventCode)}
        </p>
      </div>
    </div>

    <div class="content">
      <div class="cards">
        <div class="card"><div class="label">${esc(text.scans || "Scans")}</div><div class="value">${reportForPdf.totalScans || 0}</div></div>
        <div class="card"><div class="label">${esc(text.uniqueScans || "Unique scans")}</div><div class="value">${reportForPdf.uniqueScans || 0}</div></div>
        <div class="card"><div class="label">${esc(text.insideJoins || "InSide")}</div><div class="value">${reportForPdf.joins || 0}</div></div>
        <div class="card"><div class="label">${esc(text.conversion || "Conversion")}</div><div class="value">${reportForPdf.totalScans ? Math.round((reportForPdf.joins / reportForPdf.totalScans) * 100) : 0}%</div></div>
        <div class="card"><div class="label">${esc(text.gold || "Gull")}</div><div class="value">${rows.filter(r => (r.tier || '').toLowerCase() === 'gold').length}</div></div>
        <div class="card"><div class="label">${esc(text.silver || "Sølv")}</div><div class="value">${rows.filter(r => (r.tier || '').toLowerCase() === 'silver').length}</div></div>
        <div class="card"><div class="label">${esc(text.general || "Generell")}</div><div class="value">${rows.filter(r => (r.tier || '').toLowerCase() === 'general').length}</div></div>
      </div>

      <div class="section-title">${esc(text.bonusDistribution24h || "Bonusfordeling (24 timer etter release)")}</div>

      <div class="cards">
        <div class="card">
          <div class="label">${esc(text.gold || "Gull")}</div>
          <div class="value">${rows.filter(r => (r.tier || '').toLowerCase() === 'gold').length}</div>
        </div>
        <div class="card">
          <div class="label">${esc(text.silver || "Sølv")}</div>
          <div class="value">${rows.filter(r => (r.tier || '').toLowerCase() === 'silver').length}</div>
        </div>
        <div class="card">
          <div class="label">${esc(text.general || "Generell")}</div>
          <div class="value">${rows.filter(r => (r.tier || '').toLowerCase() === 'general').length}</div>
        </div>
      </div>

      <div class="footer">
        <div>${esc(text.bonusActive24h || text.bonusDistribution24h || "Bonus aktiv: 24 timer etter release")}</div>
        <div>codeStack by codeNXT</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) {
      setReportMessage('Kunne ikke åpne rapportvindu.');
      return;
    }

    win.document.open();
    win.document.write(html);
    win.document.close();

    win.onload = () => {
      try {
        win.focus();
        win.print();
      } catch (error) {
        console.warn('Print failed:', error);
      }
    };

    setReportMessage('PDF-rapport åpnet. Velg Skriv ut eller Lagre som PDF.');
  }, [eventData, report, text.reportUnavailable]);


  const downloadCsv = useCallback(() => {
    const rows = report.rows.length
      ? report.rows
      : [{
          eventCode: eventData.eventCode,
          scanId: '',
          phone: '',
          timestamp: '',
          tier: '',
          source: report.source,
        }];
    const csv = [
      ['eventCode', 'scanId', 'phone', 'timestamp', 'tier', 'source'].map(csvEscape).join(','),
      ...rows.map((row) => [
        row.eventCode || eventData.eventCode,
        row.scanId,
        row.phone,
        row.timestamp,
        row.tier,
        row.source,
      ].map(csvEscape).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventData.eventCode || 'codestack'}-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [eventData.eventCode, report.rows, report.source]);

  const activeDraft = bonusDrafts[activeTier];
  const canSaveBonus = Boolean(activeDraft?.url || activeDraft?.file);
  const conversionRate = makeConversion(report.joins, report.uniqueScans);
  const infoCards = [
    [text.publishDate, eventData.publishDate],
    [text.expectedMembers, eventData.expectedMembers],
    [text.publisher, eventData.publisherName],
    [text.releaseCode, eventData.eventCode],
    [text.platform, eventData.platform],
    [text.memberLink, joinUrl],
  ];
  const metricCards = [
    [text.scans, report.totalScans.toLocaleString()],
    [text.uniqueScans, report.uniqueScans.toLocaleString()],
    [text.insideJoins, report.joins.toLocaleString()],
    [text.conversionRate, conversionRate],
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: #030711;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Helvetica, Arial, sans-serif;
        }
        .dashboard-page {
          min-height: 100vh;
          color: #fff;
          background:
            radial-gradient(circle at 50% -8%, rgba(0,240,255,0.18), transparent 30%),
            linear-gradient(180deg, #07101d 0%, #02050d 46%, #000 100%);
        }
        .dashboard-shell {
          width: min(1188px, 100%);
          margin: 0 auto;
          padding: 18px 18px 48px;
        }
        .logo {
          height: 96px;
          object-fit: contain;
          filter: drop-shadow(0 18px 36px rgba(0,240,255,0.2));
        }
        .panel {
          background: linear-gradient(180deg, rgba(13,25,45,0.94), rgba(6,12,24,0.96));
          border: 1px solid rgba(143,247,255,0.16);
          border-radius: 12px;
          box-shadow: 0 22px 70px rgba(0,0,0,0.28);
          padding: 16px;
        }
        .summary {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 302px;
          padding: 24px 172px 46px;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .summary::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 6%, rgba(0,240,255,0.2), transparent 31%),
            radial-gradient(circle at 15% 100%, rgba(57,120,255,0.12), transparent 30%);
        }
        .summary > * {
          position: relative;
          z-index: 1;
        }
        .pod-logo {
          width: auto;
          max-width: 230px;
          max-height: 96px;
          object-fit: contain;
          margin: 0 0 14px;
          filter: drop-shadow(0 12px 28px rgba(0,0,0,0.28));
        }
        .pod-logo.placeholder {
          min-width: 118px;
          max-width: 220px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.5);
          font-size: 10px;
          line-height: 1.2;
          text-align: center;
          border: 1px dashed rgba(255,255,255,0.16);
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          padding: 0 14px;
        }
        .stack-name {
          margin: 0;
          color: #20e7ff;
          font-size: clamp(54px, 6vw, 78px);
          line-height: 0.98;
          font-weight: 900;
          letter-spacing: 0.035em;
          text-align: center;
          text-transform: uppercase;
          text-shadow: 0 0 26px rgba(0,240,255,0.22);
        }
        .release-name {
          margin: 10px 0 0;
          color: #ffffff;
          font-size: clamp(24px, 2.55vw, 32px);
          font-weight: 800;
          line-height: 1.18;
          text-align: center;
        }
        .refresh-removed {
          position: absolute;
          right: 26px;
          top: 62%;
          min-height: 28px;
          padding: 6px 9px;
          border-radius: 8px;
          border: 1px solid rgba(143,247,255,0.24);
          background: rgba(0,240,255,0.08);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transform: translateY(-50%);
        }
        .grid {
          display: grid;
          gap: 10px;
        }
        .info-grid {
          grid-template-columns: repeat(6, minmax(0, 1fr));
          margin-bottom: 12px;
        }
        .metrics-panel {
          margin-bottom: 12px;
          padding: 15px;
        }
        .metrics-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .mini-card {
          min-height: 74px;
          padding: 10px;
          border-radius: 9px;
          background: rgba(0,0,0,0.28);
          border: 1px solid rgba(255,255,255,0.075);
        }
        .label {
          color: rgba(255,255,255,0.55);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 7px;
        }
        .value {
          color: #fff;
          font-size: 12px;
          line-height: 1.35;
          word-break: break-word;
        }
        .metric-value {
          color: #8ff7ff;
          font-size: 28px;
          line-height: 1;
          font-weight: 850;
        }
        .main-grid {
          display: grid;
          grid-template-columns: minmax(360px, 0.92fr) minmax(0, 1.08fr);
          gap: 12px;
          align-items: start;
        }
        .panel-title {
          margin: 0 0 8px;
          font-size: 18px;
          line-height: 1.15;
        }
        .presentation-panel {
          text-align: center;
        }
        .presentation-panel .panel-title {
          margin-bottom: 14px;
        }
        .panel-text {
          margin: 0;
          color: rgba(255,255,255,0.68);
          font-size: 12px;
          line-height: 1.45;
        }
        .slide {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 9px;
          border: 1px solid rgba(143,247,255,0.18);
          background: #020914;
        }
        .presentation-panel .slide {
          width: 100%;
          margin: 0 auto;
        }
        .slide-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.98;
        }
        .qr-box {
          position: absolute;
          left: 38.75%;
          top: 31.9%;
          width: 22.5%;
          height: 40.1%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qr-img {
          width: 93%;
          height: 93%;
          object-fit: contain;
          border-radius: 4px;
          background: #fff;
          padding: 2px;
        }
        .presentation-panel .button-row {
          justify-content: center;
        }
        .button-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        .primary-button,
        .gpublisher-button {
          min-height: 40px;
          padding: 10px 13px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }
        .primary-button {
          border: none;
          background: linear-gradient(135deg, #00f0ff 0%, #3978ff 100%);
          color: #020914;
        }
        .gpublisher-button {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: #fff;
        }
        .primary-button:disabled,
        .gpublisher-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .status {
          min-height: 16px;
          margin-top: 8px;
          color: #8ff7ff;
          font-size: 11px;
          line-height: 1.45;
        }
        .bonus-list {
          display: grid;
          gap: 8px;
          margin: 12px 0;
        }
        .bonus-row {
          display: grid;
          grid-template-columns: 28px 74px minmax(110px, 1fr) 72px minmax(120px, 1fr) 70px 74px;
          gap: 8px;
          align-items: center;
          min-height: 50px;
          padding: 8px;
          border-radius: 9px;
          background: rgba(0,0,0,0.24);
          border: 1px solid rgba(255,255,255,0.075);
        }
        .bonus-row.active {
          border-color: rgba(0,240,255,0.45);
          background: rgba(0,240,255,0.08);
        }
        .bonus-icon {
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #8ff7ff;
          background: rgba(0,240,255,0.1);
          font-size: 14px;
          font-weight: 900;
        }
        .bonus-cell {
          min-width: 0;
          color: rgba(255,255,255,0.78);
          font-size: 11px;
          line-height: 1.25;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .bonus-tier {
          color: #fff;
          font-weight: 900;
        }
        .bonus-status-text {
          color: #8ff7ff;
          font-weight: 800;
        }
        .edit-button {
          min-height: 30px;
          padding: 7px 10px;
          border-radius: 7px;
          border: 1px solid rgba(143,247,255,0.2);
          background: rgba(255,255,255,0.055);
          color: #fff;
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .wide {
          grid-column: 1 / -1;
        }
        label {
          display: grid;
          gap: 6px;
        }
        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          color: #fff;
          padding: 10px 11px;
          font: inherit;
          font-size: 12px;
          outline: none;
        }
        textarea {
          min-height: 70px;
          resize: vertical;
        }
        option {
          background: #07101d;
          color: #fff;
        }
        .report-panel {
          margin-top: 12px;
          display: grid;
          grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.15fr);
          align-items: center;
          gap: 12px;
        }
        .report-actions .button-row {
          margin-top: 10px;
        }
        .report-summary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }
        .csv-columns {
          grid-column: 1 / -1;
          margin-top: 2px;
          color: rgba(255,255,255,0.48);
          font-size: 10px;
          line-height: 1.4;
        }
        .warning {
          margin-bottom: 12px;
          border-color: rgba(255,190,100,0.22);
          background: rgba(255,190,100,0.075);
          color: #ffd89a;
        }
        @media (max-width: 980px) {
          .main-grid,
          .report-panel {
            grid-template-columns: 1fr;
          }
          .info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .bonus-row {
            grid-template-columns: 28px 70px minmax(96px, 1fr) 68px;
          }
          .bonus-row .bonus-cell:nth-child(5),
          .bonus-row .bonus-cell:nth-child(6) {
            display: none;
          }
        }
        @media (max-width: 640px) {
          .dashboard-shell {
            padding: 18px 12px 40px;
          }
          .logo {
            height: 82px;
          }
          .summary {
            min-height: 238px;
            padding: 56px 14px 46px;
          }
          .pod-logo {
            max-height: 64px;
          }
          .stack-name {
            font-size: clamp(34px, 10vw, 56px);
          }
          .release-name {
            font-size: clamp(19px, 5.6vw, 24px);
          }
          .refresh-removed {
            right: 14px;
            top: auto;
            bottom: 14px;
            transform: none;
          }
          .info-grid,
          .metrics-grid,
          .form-grid,
          .report-summary {
            grid-template-columns: 1fr;
          }
          .bonus-row {
            grid-template-columns: 28px minmax(58px, 0.5fr) minmax(0, 1fr) 64px;
          }
          .panel {
            padding: 12px;
          }
        }

          .summary {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            position: relative !important;
            padding: 18px 28px 32px !important;
            min-height: 260px !important;
          }

          .summary-brand {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            margin-bottom: 12px !important;
          }

          .summary .logo {
            width: 180px !important;
            height: 180px !important;
            object-fit: contain !important;
            display: block !important;
          }

          .summary-tagline {
            margin-top: 4px !important;
            color: rgba(255,255,255,0.62) !important;
            font-size: 18px !important;
            font-weight: 800 !important;
            letter-spacing: 0.08em !important;
            text-transform: none !important;
          }

          .summary-text {
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }

          .stack-name {
            margin: 0 !important;
            color: #1fe8ff !important;
            font-size: clamp(34px, 5.6vw, 58px) !important;
            line-height: 0.96 !important;
            font-weight: 950 !important;
            letter-spacing: 0.045em !important;
            text-transform: uppercase !important;
            text-align: center !important;
            text-shadow: 0 0 28px rgba(31,232,255,0.28) !important;
          }

          .release-name {
            margin: 10px 0 0 !important;
            color: #fff !important;
            font-size: clamp(18px, 2.2vw, 24px) !important;
            line-height: 1.15 !important;
            font-weight: 850 !important;
            text-align: center !important;
          }


          .summary-flags > * {
            margin: 0 auto !important;
          }

          .summary-flags .language-switcher,
          .summary-flags .lang-switcher,
          .summary-flags .flag-selector {
            position: static !important;
            left: auto !important;
            right: auto !important;
            top: auto !important;
            transform: none !important;
          }

          .bonus-panel {
            overflow: hidden !important;
          }

          .bonus-header {
            display: flex !important;
            align-items: flex-end !important;
            justify-content: space-between !important;
            gap: 16px !important;
            margin-bottom: 14px !important;
          }

          .tier-count {
            width: min(260px, 100%) !important;
          }

          .tier-count select {
            width: 100% !important;
          }

          .bonus-list {
            display: grid !important;
            gap: 10px !important;
            margin: 0 0 16px !important;
            width: 100% !important;
          }

          .bonus-row {
            display: grid !important;
            grid-template-columns: 92px minmax(0, 1.1fr) 72px minmax(0, 1fr) 70px 82px !important;
            gap: 12px !important;
            align-items: center !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 12px !important;
            border-radius: 14px !important;
            background: rgba(255,255,255,0.035) !important;
            border: 1px solid rgba(255,255,255,0.09) !important;
            overflow: hidden !important;
          }

          .bonus-row.active {
            border-color: rgba(0,240,255,0.5) !important;
            background: rgba(0,240,255,0.08) !important;
          }

          .tier-badge {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            min-width: 0 !important;
            color: #fff !important;
            font-weight: 900 !important;
          }

          .tier-badge span {
            width: 26px !important;
            height: 26px !important;
            border-radius: 999px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: rgba(0,240,255,0.14) !important;
            color: #8ff7ff !important;
            flex: 0 0 auto !important;
          }

          .tier-gold span {
            color: #ffd95c !important;
            background: rgba(255,217,92,0.16) !important;
          }

          .tier-silver span {
            color: #d7dde6 !important;
            background: rgba(215,221,230,0.13) !important;
          }

          .bonus-main,
          .bonus-meta,
          .bonus-file {
            min-width: 0 !important;
            overflow: hidden !important;
          }

          .bonus-main strong,
          .bonus-meta span,
          .bonus-file span {
            display: block !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }

          .bonus-label {
            display: block !important;
            margin-bottom: 4px !important;
            color: rgba(255,255,255,0.48) !important;
            font-size: 10px !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.08em !important;
          }

          .bonus-state {
            color: #8ff7ff !important;
            font-size: 12px !important;
            font-weight: 900 !important;
            text-align: center !important;
          }

          .bonus-editor {
            border-top: 1px solid rgba(255,255,255,0.09) !important;
            padding-top: 16px !important;
          }

          @media (max-width: 980px) {
            .bonus-header {
              align-items: stretch !important;
              flex-direction: column !important;
            }

            .tier-count {
              width: 100% !important;
            }

            .bonus-row {
              grid-template-columns: 90px minmax(0, 1fr) 78px !important;
            }

            .bonus-meta,
            .bonus-file,
            .bonus-state {
              display: none !important;
            }
          }

          .left-stack {
            display: grid;
            gap: 0;
            min-width: 0;
          }

          .report-panel {
            margin-top: 14px;
          }

          .compact-report {
            padding: 16px !important;
          }

          .report-copy {
            margin: 8px 0 14px;
            color: rgba(255,255,255,0.72);
            font-size: 13px;
            line-height: 1.5;
          }

          .report-buttons {
            justify-content: flex-start;
            margin-top: 8px;
          }

          .csv-note {
            margin: 12px 0 0;
            color: rgba(255,255,255,0.48);
            font-size: 11px;
            line-height: 1.4;
          }

          .compact-report {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 18px !important;
          }

          .compact-report .panel-title {
            margin: 0 0 10px !important;
            display: block !important;
          }

          .compact-report .report-copy {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 0 16px !important;
            color: rgba(255,255,255,0.72) !important;
            font-size: 13px !important;
            line-height: 1.45 !important;
            white-space: normal !important;
          }

          .compact-report .report-buttons {
            display: flex !important;
            flex-direction: row !important;
            justify-content: flex-start !important;
            align-items: center !important;
            gap: 10px !important;
            margin: 0 0 12px !important;
          }

          .compact-report .csv-note {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            color: rgba(255,255,255,0.48) !important;
            font-size: 11px !important;
            line-height: 1.35 !important;
            white-space: normal !important;
          }

          .compact-report .status {
            margin-top: 8px !important;
          }

          .bonus-panel .bonus-header {
            margin-bottom: 8px !important;
          }

          .bonus-panel .bonus-editor {
            border-top: none !important;
            padding-top: 0 !important;
          }

          .bonus-panel .tier-count {
            margin-top: 0 !important;
          }

          .dashboard-page {
            width: 100% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
          }

          .dashboard-shell {
            width: min(1120px, calc(100vw - 24px)) !important;
            margin: 0 auto !important;
          }

          .presentation-hint {
            margin: 10px auto 0;
            max-width: none;
            white-space: nowrap;
            text-align: center;
            color: rgba(255,255,255,0.62);
            font-size: 11px;
            line-height: 1.3;
          }

          .presentation-panel {
            padding-bottom: 4px !important;
          }

          .stack-title-row {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 26px !important;
            width: 100% !important;
          }

          .stack-mic {
            font-size: clamp(42px, 6vw, 66px) !important;
            line-height: 1 !important;
            filter: drop-shadow(0 0 12px rgba(0,230,255,0.45)) !important;
          }

          .summary .language-switcher,
          .summary-flags .language-switcher,
          .summary-flags button {
            position: relative !important;
            z-index: 60 !important;
            pointer-events: auto !important;
          }

          .stack-title-row,
          .stack-mic,
          .summary-text {
            pointer-events: auto !important;
          }

          .summary-flags,
          .summary-flags .language-switcher,


          .summary-flags,
          .summary-flags .language-switcher,

          .summary {
            position: relative !important;
          }

          /* FINAL FIX: language flags in hero */

          .summary-brand {
            position: relative !important;
            z-index: 1 !important;
          }

          .summary-text,
          .stack-title-row,
          .stack-name,
          .release-name,
          .stack-mic {
            position: relative !important;
            z-index: 1 !important;
          }

          /* CLEAN LANGUAGE SWITCHER FIX */
          .summary-flags {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 16px 0 24px;
            position: relative;
            z-index: 1000;
          }

          .summary-flags .language-switcher {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
          }

          .summary-flags .flag-button {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.18);
            background: rgba(0,0,0,0.25);
            cursor: pointer;
            position: relative;
            z-index: 1001;
          }

          .summary-flags .flag-button.is-active {
            box-shadow: 0 0 12px rgba(0,230,255,0.6);
            border-color: rgba(0,230,255,0.8);
          }


          .summary {
            isolation: isolate !important;
          }

          .summary-flags {
            position: relative !important;
            z-index: 999999 !important;
            pointer-events: auto !important;
          }

          .summary-flags * {
            pointer-events: auto !important;
          }

          .presentation-event-code {
            position: absolute !important;
            top: 12px !important;
            right: 14px !important;
            color: rgba(255,255,255,0.82) !important;
            font-size: 10px !important;
            font-weight: 300 !important;
            letter-spacing: 0.08em !important;
            text-transform: uppercase !important;
            font-family: Arial, Helvetica, sans-serif !important;
            text-shadow: 0 0 6px rgba(0,0,0,0.55) !important;
            pointer-events: none !important;
            z-index: 20 !important;
          }

          .bonus-scan-count {
            margin: 2px 0 14px;
            color: rgba(255,255,255,0.74);
            font-size: 13px;
            font-weight: 700;
          }

          .bonus-scan-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin: 4px 0 14px;
          }

          .bonus-scan-card {
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(255,255,255,0.04);
            border-radius: 12px;
            padding: 10px 12px;
            text-align: center;
          }

          .bonus-scan-card span {
            display: block;
            color: rgba(255,255,255,0.58);
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .bonus-scan-card strong {
            display: block;
            margin-top: 5px;
            font-size: 15px;
            line-height: 1.15;
            font-weight: 400;
            white-space: nowrap;
            letter-spacing: 0.01em;
          }

          .bonus-scan-card.tier-gold strong {
            color: #ffd95c;
          }

          .bonus-scan-card.tier-silver strong {
            color: #d7dde8;
          }

          .bonus-scan-card.tier-general strong {
            color: #1fe8ff;
          }

          .main-grid {
            display: grid !important;
            align-items: stretch !important;
          }

          .left-stack {
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }

          .left-stack .presentation-panel {
            flex: 0 0 auto !important;
          }

          .left-stack .compact-report {
            flex: 1 1 auto !important;
          }

          .bonus-panel {
            height: 100% !important;
            box-sizing: border-box !important;
          }

          .compact-report {
            height: 100% !important;
            box-sizing: border-box !important;
          }

          .compact-report {
            min-height: 180px !important;
          }

          .bonus-panel {
            min-height: 100% !important;
            box-sizing: border-box !important;
          }

          .left-stack > .compact-report,
          .bonus-panel {
            height: 100% !important;
          }
      `}</style>

      <main className="dashboard-page">
        <div className="dashboard-shell">
          {!eventData.eventCode ? <section className="panel warning">{text.missingRelease}</section> : null}

          <section className="panel summary">
            <div className="summary-brand">
              <img src="/codestack-logo.png" alt="codeStack logo" className="logo" />
              <div className="summary-tagline">codeStack by codeNXT</div>
            </div>

            <div
              className="summary-flags"
              onClickCapture={(event) => {
                const button = event.target.closest?.('[data-lang-code]');
                const code = button?.getAttribute('data-lang-code');
                if (code) handleLanguageChange(code);
              }}
            >
              <LanguageSwitcher lang={lang} onChange={handleLanguageChange} />
            </div>

            <div className="summary-text">
              <div className="stack-title-row">
                <span className="stack-mic" aria-hidden="true">🎙️</span>
                <h2 className="stack-name">{eventData.stackName || text.stackFallback}</h2>
                <span className="stack-mic" aria-hidden="true">🎙️</span>
              </div>
              <p className="release-name">{eventData.releaseTitle || text.releaseFallback}</p>
            </div>
          </section>

          <section className="grid info-grid">
            {infoCards.map(([label, value]) => (
              <div className="mini-card" key={label}>
                <div className="label">{label}</div>
                <div className="value">{value || text.unavailable}</div>
              </div>
            ))}
          </section>

          <section className="panel metrics-panel">
            <div className="grid metrics-grid">
              {metricCards.map(([label, value]) => (
                <div className="mini-card" key={label}>
                  <div className="label">{label}</div>
                  <div className="metric-value">{value}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="main-grid">
            <div className="left-stack">
            <section className="panel presentation-panel">
              <h2 className="panel-title">{text.presentation}</h2>
              <div className="slide">
                <img className="slide-bg" src={badgeBase} alt="" aria-hidden="true" />
                <div className="qr-box">
                  {qrDataUrl ? <img className="qr-img" src={qrDataUrl} alt={text.memberLink} /> : null}
                </div>
                {eventData.eventCode ? (
                  <div className="presentation-event-code">{eventData.eventCode}</div>
                ) : null}
              </div>
              <div className="button-row">
                <button type="button" className="primary-button" onClick={downloadBadgeImage} disabled={!qrDataUrl}>
                  {text.downloadImage}
                </button>
                <p className="presentation-hint">{text.presentationHint}</p>
              </div>
              <div className="status">{imageStatus}</div>
            </section>
            <section className="panel report-panel compact-report">
              <h2 className="panel-title">{text.report}</h2>
              <p className="report-copy">
                {text.reportHelp} CSV-filen kan brukes til enkel oppfølging av InSide-tilganger, skanninger og bonusrespons.
              </p>

              <div className="button-row report-buttons">
                <button type="button" className="gpublisher-button" onClick={exportPdfReport}>
                  {text.viewReport}
                </button>
                <button type="button" className="primary-button" onClick={downloadCsv}>
                  {text.downloadCsv}
                </button>
              </div>

              <p className="csv-note">{text.reportLifecycle}</p>

            </section>
            </div>

            <section className="panel bonus-panel">
              <div className="bonus-header">
                <h2 className="panel-title">{text.bonus}</h2>
              </div>

              <div className="bonus-editor">

                <div className="form-grid">
                  <label>
                    <span className="label">{text.tier}</span>
                    <select
                      value={activeTier}
                      onChange={(event) => {
                        setActiveTier(event.target.value);
                        setBonusMessage('');
                      }}
                    >
                      {BONUS_TIERS.slice(0, tierCount).map((tier) => <option value={tier} key={tier}>{text[tier]}</option>)}
                    </select>
                  </label>

                  <label>
                    <span className="label">{text.type}</span>
                    <select
                      value={activeDraft.type}
                      onChange={(event) => updateBonusDraft(activeTier, { type: event.target.value, file: null, fileName: '', url: '' })}
                    >
                      {BONUS_TYPES.map((type) => <option value={type} key={type}>{text[type] || type.toUpperCase()}</option>)}
                    </select>
                  </label>

                  <label>
                    <span className="label">{text.fileOrUrl}</span>
                    {activeDraft.type === 'url' ? (
                      <input value={activeDraft.url} placeholder="https://..." onChange={(event) => updateBonusDraft(activeTier, { url: event.target.value })} />
                    ) : (
                      <input
                        key={`${activeTier}-${activeDraft.type}`}
                        type="file"
                        aria-label={text.chooseFile}
                        accept={
                          activeDraft.type === 'pdf' ? 'application/pdf'
                            : activeDraft.type === 'image' ? 'image/*'
                              : activeDraft.type === 'audio' ? 'audio/*'
                                : activeDraft.type === 'video' ? 'video/*'
                                  : undefined
                        }
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          updateBonusDraft(activeTier, { file, fileName: file?.name || '' });
                        }}
                      />
                    )}
                  </label>

                </div>

                <div className="bonus-scan-grid">
                  {BONUS_TIERS.map((tier) => (
                    <div className={`bonus-scan-card tier-${tier}`} key={tier}>
                      <span>{text[tier]}</span>
                      <strong>
                        {tierSplit[tier]}% ca. {Number(eventData.estimatedMembers || eventData.audienceSize || eventData.members || 0) > 0
                          ? Math.round(Number(eventData.estimatedMembers || eventData.audienceSize || eventData.members || 0) * Number(tierSplit[tier] || 0) / 100)
                          : 0}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="button-row">
                  <button type="button" className="primary-button" onClick={saveBonus} disabled={!canSaveBonus || bonusSaving}>
                    {bonusSaving ? text.savingBonus : text.saveBonus}
                  </button>
                </div>

                <div className="status">{bonusMessage}</div>
              </div>

              <div className="bonus-list">
                {BONUS_TIERS.slice(0, tierCount).map((tier) => (
                  <div className={`bonus-row ${activeTier === tier ? 'active' : ''}`} key={tier}>
                    <div className={`tier-badge tier-${tier}`}>
                      <span aria-hidden="true">★</span>
                      <strong>{text[tier]}</strong>
                    </div>

                    <div className="bonus-main">
                      <span className="bonus-label">Status</span>
                      <strong>{bonusDrafts[tier].status === 'saved' ? text.saved : text.empty}</strong>
                    </div>

                    <div className="bonus-meta">
                      <span className="bonus-label">{text.type}</span>
                      <span>{bonusDrafts[tier].status === 'saved' ? (text[bonusDrafts[tier].type] || bonusDrafts[tier].type.toUpperCase()) : text.empty}</span>
                    </div>

                    <div className="bonus-file">
                      <span className="bonus-label">{text.fileOrUrl}</span>
                      <span>{bonusDrafts[tier].status === 'saved' ? (bonusDrafts[tier].fileName || bonusDrafts[tier].url || text.empty) : text.empty}</span>
                    </div>

                    <div className="bonus-state">
                      {activeTier === tier ? text.active || 'Active' : text.edit}
                    </div>

                    <button
                      type="button"
                      className="edit-button"
                      onClick={async () => {
                        setActiveTier(tier);
                        setBonusMessage('');

                        updateBonusDraft(tier, {
                          title: '',
                          description: '',
                          type: 'url',
                          url: '',
                          fileName: '',
                          file: null,
                          status: 'empty',
                          storage: '',
                        });

                        try {
                          if (eventData?.id) {
                            await fetch(`${API_BASE}/reward`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                eventId: eventData.id,
                                reward: {
                                  tier,
                                  clear: true,
                                  status: 'empty',
                                },
                              }),
                            });
                          }
                        } catch (error) {
                          console.warn('Could not clear bonus tier:', error);
                        }
                      }}
                    >
                      {text.edit}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </main>
    </>
  );
}
