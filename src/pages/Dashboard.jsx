import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getLang, setLang as persistLang, t as getAppCopy } from '../i18n';
import badgeBase from '../assets/cpBadges/codeperks-badge.png';

const BADGE_SIZE = { width: 1669, height: 942 };
const QR_BOX = { x: 126, y: 116, size: 531 };
const QR_BOX_STYLE = {
  left: `${(QR_BOX.x / BADGE_SIZE.width) * 100}%`,
  top: `${(QR_BOX.y / BADGE_SIZE.height) * 100}%`,
  width: `${(QR_BOX.size / BADGE_SIZE.width) * 100}%`,
  height: `${(QR_BOX.size / BADGE_SIZE.height) * 100}%`,
};

const API_BASE = 'https://codenxt-backend-production.up.railway.app';
const STORAGE_KEYS = ['codenxt_event', 'codeperks_latest_event'];
const BONUS_TIERS = ['gold', 'silver', 'general'];
const BONUS_TYPES = ['pdf', 'image', 'audio', 'video', 'url'];
const DEFAULT_TIER_SPLIT = { gold: 100, silver: 200, general: 700 };

const dashboardCopy = {
  no: {
    title: 'KONTROLLSENTER',
    subtitle: 'Kontrollpanel for presentasjon, bonusinnhold og rapportering.',
    byline: 'codePerks by codeNXT',
    missingRelease: 'Ingen medlemsfordel funnet. Opprett medlemsfordelen i Checkout først.',
    refreshData: 'Oppdater fra Checkout',
    pageFallback: 'Verifisert fordel mangler',
    releaseFallback: 'Verifisert fordel mangler',
    logoFallback: 'Logo klargjøres fra Checkout',
    publishDate: 'Startdato',
    expectedMembers: 'Antall kunder',
    company: 'Bedrift',
    releaseCode: 'Kampanjekode',
    platform: 'Kampanjemedium',
    customerLink: 'Kundelenke',
    scans: 'Skanninger',
    uniqueScans: 'Unike skanninger',
    insideJoins: 'InSide registered',
    ownershipCertificates: 'Eiersertifikater',
    conversionRate: 'Konvertering',
    presentation: 'Presentasjon',
    insideMessage: 'Bli med i InSide',
    downloadImage: 'Last ned bilde',
    downloadQr: 'Last ned QR-kode',
    presentationHint: 'Del i relevante kanaler når kampanjen er klar.',
    imageReady: 'Bilde klart.',
    imageError: 'Kunne ikke lage bilde. Prøv igjen.',
    bonus: 'Verifisert fordel',
    bonusHelp: 'Fordeler for hvert InSide-nivå.',
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
    saveBeneficio: 'Lagre fordel',
    savingBeneficio: 'Lagrer...',
    saved: 'Lagret',
    empty: 'Tom',
    localFallback: 'Backend svarte ikke. Beneficioen er lagret lokalt.',
    ready: 'Klar',
    notSet: 'Ikke satt',
    report: 'Nøkkeltall',
    reportHelp: 'Hent nøkkeltall eller last ned CSV for kampanjen.',
    viewReport: 'Hent nøkkeltall',
    downloadCsv: 'Last ned CSV',
    reportUnavailable: 'Nøkkeltall-endepunktet er ikke tilgjengelig. Lokale tall vises hvis de finnes.',
    reportPdfTitle: 'Nøkkeltall',
    collaborationLabel: 'I samarbeid med',
    sentDate: 'Sendt dato',
    eventCodeLabel: 'Kampanjekode',
    bonusDistribution24h: 'Beneficiofordeling (24 timer etter release)',
    bonusActive24h: '${esc(text.bonusActive24h || text.bonusDistribution24h || "Beneficio aktiv: 24 timer etter release")}',
    csvColumns: 'eventCode, scanId, phone, timestamp, tier, source',
    unavailable: 'Ikke tilgjengelig',
    verifiedNetworkEyebrow: 'Verified Benefit Network',
    verifiedNetworkTitle: 'Hver medlemsfordel får sitt eget sertifikatspor.',
    verifiedNetworkText: 'Hver utstedte fordel kan kobles til Certificate ID, utstedelsesdato, claim-status og fulfillment-logg. Dette gjør codePerks til et verifiserbart system for medlemsfordeler.',
    verifiedIssued: 'Utstedt',
    verifiedMembers: 'Registrerte',
    verifiedStatus: 'Status',
    verifiedAuditReady: 'Audit-ready',
    remaining: 'Resten',
  },
  en: {
    title: 'CONTROL CENTER',
    subtitle: 'Control panel for presentation, bonus content, and reporting.',
    byline: 'codePerks by codeNXT',
    missingRelease: 'No member benefit found. Create the member benefit in Checkout first.',
    refreshData: 'Refresh from Checkout',
    pageFallback: 'Verified Benefit missing',
    releaseFallback: 'Verified Benefit missing',
    logoFallback: 'Logo prepared from Checkout',
    publishDate: 'Start date',
    expectedMembers: 'Expected customers',
    company: 'Empresa',
    releaseCode: 'Campaign code',
    platform: 'Platform',
    customerLink: 'Customer link',
    scans: 'Scans',
    uniqueScans: 'Unique scans',
    insideJoins: 'InSide registered',
    ownershipCertificates: 'Certificates',
    conversionRate: 'Conversion',
    presentation: 'Presentation',
    insideMessage: 'Join InSide',
    downloadImage: 'Download image',
    downloadQr: 'Download QR code',
    presentationHint: 'Share it in relevant channels when the campaign is ready.',
    imageReady: 'Image ready.',
    imageError: 'Could not create image. Try again.',
    bonus: 'Verified Benefit',
    bonusHelp: 'Only member benefits are managed here. Campaign data comes from Checkout.',
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
    saveBeneficio: 'Save benefit',
    savingBeneficio: 'Saving...',
    saved: 'Saved',
    empty: 'Empty',
    localFallback: 'The backend did not respond. Beneficio saved locally.',
    ready: 'Ready',
    notSet: 'Not set',
    report: 'Key figures',
    reportHelp: 'View key figures or download CSV for the campaign.',
    viewReport: 'View key figures',
    downloadCsv: 'Download CSV',
    reportUnavailable: 'The key figures endpoint is not available. Local numbers are shown if present.',
    reportPdfTitle: 'Key figures',
    collaborationLabel: 'In collaboration with',
    sentDate: 'Start date',
    eventCodeLabel: 'Campaign code',
    bonusDistribution24h: 'Beneficio distribution (24 hours after release)',
    bonusActive24h: 'Beneficio active: 24 hours after release',
    csvColumns: 'eventCode, scanId, phone, timestamp, tier, source',
    unavailable: 'Unavailable',
    verifiedNetworkEyebrow: 'Verified Benefit Network',
    verifiedNetworkTitle: 'Every member benefit gets its own certificate trail.',
    verifiedNetworkText: 'Each issued benefit can be connected to a Certificate ID, issue date, claim status and fulfillment record. This makes codePerks a verifiable guest benefit system.',
    verifiedIssued: 'Issued',
    verifiedMembers: 'Registered',
    verifiedStatus: 'Status',
    verifiedAuditReady: 'Audit-ready',
    remaining: 'Remaining',
  },
  de: {
    title: 'KONTROLLZENTRUM',
    subtitle: 'Kontrollpanel fuer Praesentation, Beneficioinhalte und Reporting.',
    byline: 'codePerks by codeNXT',
    missingRelease: 'Kein Kundenvorteil gefunden. Erstellen Sie den Kundenvorteil zuerst im Checkout.',
    refreshData: 'Aus Checkout aktualisieren',
    pageFallback: 'Verifizierter Vorteil fehlt',
    releaseFallback: 'Verifizierter Vorteil fehlt',
    logoFallback: 'Logo aus Checkout vorbereitet',
    publishDate: 'Startdatum',
    expectedMembers: 'Erwartete Kunden',
    company: 'Empresa',
    releaseCode: 'Kampagnencode',
    platform: 'Kampanjemedium',
    customerLink: 'Kundenlink',
    scans: 'Scans',
    uniqueScans: 'Einmalige Scans',
    insideJoins: 'InSide',
    ownershipCertificates: 'Zertifikate',
    conversionRate: 'Conversion',
    presentation: 'Praesentation',
    insideMessage: 'InSide beitreten',
    downloadImage: 'Bild herunterladen',
    downloadQr: 'QR-Code herunterladen',
    presentationHint: 'Teilen Sie es in relevanten Kanälen, sobald die Kampagne bereit ist.',
    imageReady: 'Bild bereit.',
    imageError: 'Bild konnte nicht erstellt werden. Bitte erneut versuchen.',
    bonus: 'Kundenvorteil',
    bonusHelp: 'Hier werden nur Beneficioinhalte verwaltet. Pagedaten kommen aus Checkout.',
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
    saveBeneficio: 'Beneficio speichern',
    savingBeneficio: 'Speichert...',
    saved: 'Gespeichert',
    empty: 'Leer',
    localFallback: 'Das Backend hat nicht geantwortet. Beneficio lokal gespeichert.',
    ready: 'Bereit',
    notSet: 'Nicht gesetzt',
    report: 'Kennzahlen',
    reportHelp: 'Kennzahlen ansehen oder CSV für die Kampagne herunterladen.',
    viewReport: 'Kennzahlen ansehen',
    downloadCsv: 'CSV herunterladen',
    reportUnavailable: 'Der Kennzahlen-Endpunkt ist nicht verfuegbar. Lokale Zahlen werden angezeigt, wenn vorhanden.',
    reportPdfTitle: 'Kennzahlen',
    collaborationLabel: 'In Zusammenarbeit mit',
    sentDate: 'Startdatum',
    eventCodeLabel: 'Kampagnencode',
    bonusDistribution24h: 'Beneficioverteilung (24 Stunden nach Kampagnenstart)',
    bonusActive24h: 'Beneficio aktiv: 24 Stunden nach Kampagnenstart',
    csvColumns: 'eventCode, scanId, phone, timestamp, tier, source',
    unavailable: 'Nicht verfuegbar',
    verifiedNetworkEyebrow: 'Verified Benefit Network',
    verifiedNetworkTitle: 'Jeder verifizierte Vorteil erhaelt seine eigene Zertifikatsspur.',
    verifiedNetworkText: 'Jeder ausgegebene Vorteil kann mit Certificate ID, Ausgabedatum, Claim-Status und Fulfillment-Protokoll verbunden werden. So wird codePerks zu einem verifizierbaren System fuer verifizierte Vorteile.',
    verifiedIssued: 'Ausgegeben',
    verifiedMembers: 'Registriert',
    verifiedStatus: 'Status',
    verifiedAuditReady: 'Audit-ready',
    remaining: 'Rest',
  },
  fr: {
    title: 'CENTRE DE CONTROLE',
    subtitle: 'Panneau de controle pour presentation, contenu bonus et reporting.',
    byline: 'codePerks by codeNXT',
    missingRelease: 'Aucun avantage client trouvé. Créez d’abord l’avantage client dans Checkout.',
    refreshData: 'Actualiser depuis Checkout',
    pageFallback: 'Avantage client manquant',
    releaseFallback: 'Avantage client manquant',
    logoFallback: 'Logo prepare depuis Checkout',
    publishDate: 'Date de début',
    expectedMembers: 'Clients prévus',
    company: 'Entreprise',
    releaseCode: 'Code campagne',
    platform: 'Support de campagne',
    customerLink: 'Lien client',
    scans: 'Scans',
    uniqueScans: 'Scans uniques',
    insideJoins: 'Membres InSide',
    ownershipCertificates: 'Certificats ownership',
    conversionRate: 'Taux de conversion',
    presentation: 'Presentation',
    insideMessage: 'Rejoindre InSide',
    downloadImage: 'Telecharger image',
    downloadQr: 'Telecharger le QR code',
    presentationHint: 'Partagez-la sur les réseaux sociaux et dans vos canaux de campagne.',
    imageReady: 'Image prete.',
    imageError: 'Impossible de creer l image. Reessayez.',
    bonus: 'Avantage client',
    bonusHelp: 'Seul le contenu bonus est gere ici. Les données de campagne proviennent de Checkout.',
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
    saveBeneficio: 'Enregistrer avantage',
    savingBeneficio: 'Enregistrement...',
    saved: 'Enregistre',
    empty: 'Vide',
    localFallback: 'Le backend n a pas repondu. Beneficio enregistre localement.',
    ready: 'Pret',
    notSet: 'Non defini',
    report: 'Chiffres clés',
    reportHelp: 'Voir les chiffres clés ou télécharger le CSV de la campagne.',
    viewReport: 'Voir les chiffres clés',
    downloadCsv: 'Telecharger CSV',
    reportUnavailable: 'Le endpoint rapport n est pas disponible. Les chiffres locaux sont affiches si disponibles.',
    reportPdfTitle: 'Chiffres clés',
    collaborationLabel: 'En collaboration avec',
    sentDate: 'Date de début',
    eventCodeLabel: 'Code campagne',
    bonusDistribution24h: 'Répartition bonus (24 heures après le début)',
    bonusActive24h: 'Beneficio actif : 24 heures après le début',
    csvColumns: 'eventCode, scanId, phone, timestamp, tier, source',
    unavailable: 'Indisponible',
    verifiedNetworkEyebrow: 'Verified Benefit Network',
    verifiedNetworkTitle: 'Chaque avantage verifie recoit sa propre trace de certificat.',
    verifiedNetworkText: 'Chaque avantage emis peut etre relie a un Certificate ID, une date d emission, un statut de claim et un journal de fulfillment. codePerks devient ainsi un systeme verifiable pour les avantages membres.',
    verifiedIssued: 'Emis',
    verifiedMembers: 'Enregistrés',
    verifiedStatus: 'Statut',
    verifiedAuditReady: 'Audit-ready',
    remaining: 'Reste',
  },
  es: {
    title: 'CENTRO DE CONTROL',
    subtitle: 'Panel de control para presentacion, contenido extra e informes.',
    byline: 'codePerks by codeNXT',
    missingRelease: 'No se encontró ninguna campaña. Créala primero en Checkout.',
    refreshData: 'Actualizar desde Checkout',
    pageFallback: 'Beneficio faltante',
    releaseFallback: 'Beneficio faltante',
    logoFallback: 'Logo preparado desde Checkout',
    publishDate: 'Fecha de inicio',
    expectedMembers: 'Clientes esperados',
    company: 'Empresa',
    releaseCode: 'Código de campaña',
    platform: 'Medio de campaña',
    customerLink: 'Enlace cliente',
    scans: 'Scans',
    uniqueScans: 'Scans unicos',
    insideJoins: 'Miembros InSide',
    ownershipCertificates: 'Certificados ownership',
    conversionRate: 'Tasa conversion',
    presentation: 'Presentacion',
    insideMessage: 'Unirse a InSide',
    downloadImage: 'Descargar imagen',
    downloadQr: 'Descargar código QR',
    presentationHint: 'Compártela en redes sociales y otros canales de campaña.',
    imageReady: 'Imagen lista.',
    imageError: 'No se pudo crear la imagen. Intentalo de nuevo.',
    bonus: 'Beneficio',
    bonusHelp: 'Aquí solo se gestiona contenido adicional. Los datos de la campaña provienen de Checkout.',
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
    saveBeneficio: 'Guardar beneficio',
    savingBeneficio: 'Guardando...',
    saved: 'Guardado',
    empty: 'Vacio',
    localFallback: 'El backend no respondio. Beneficio guardado localmente.',
    ready: 'Listo',
    notSet: 'No definido',
    report: 'Cifras clave',
    reportHelp: 'Ver cifras clave o descargar CSV de la campaña.',
    viewReport: 'Ver cifras clave',
    downloadCsv: 'Descargar CSV',
    reportUnavailable: 'El endpoint de informe no esta disponible. Se muestran datos locales si existen.',
    reportPdfTitle: 'Cifras clave',
    collaborationLabel: 'En colaboracion con',
    sentDate: 'Fecha de publicacion',
    eventCodeLabel: 'Código de campaña',
    bonusDistribution24h: 'Distribucion de bonus (24 horas despues del lanzamiento)',
    bonusActive24h: 'Beneficio activo: 24 horas despues del lanzamiento',
    csvColumns: 'eventCode, scanId, phone, timestamp, tier, source',
    unavailable: 'No disponible',
    verifiedNetworkEyebrow: 'Verified Benefit Network',
    verifiedNetworkTitle: 'Cada beneficio verificado obtiene su propio rastro de certificado.',
    verifiedNetworkText: 'Cada beneficio emitido puede conectarse a un Certificate ID, fecha de emision, estado de claim y registro de fulfillment. Asi codePerks se convierte en un sistema verificable de beneficios para miembros.',
    verifiedIssued: 'Emitidos',
    verifiedMembers: 'Registrados',
    verifiedStatus: 'Estado',
    verifiedAuditReady: 'Audit-ready',
    remaining: 'Resto',
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
  const pageName = firstValue(data.pageName, data.artistName, data.name, previous.pageName, previous.artistName);
  const releaseTitle = firstValue(data.releaseTitle, data.releaseName, data.title, previous.releaseTitle, previous.releaseName);
  const logo = firstValue(data.pageLogo, data.pageImage, data.logoUrl, data.artistLogo, data.image, previous.pageLogo, previous.pageImage, previous.logoUrl, previous.artistLogo);
  const publishDate = firstValue(data.publishDate, data.releaseDate, data.eventDate, data.startAt, previous.publishDate, previous.releaseDate, previous.eventDate);
  const platform = firstValue(data.platform, data.channel, data.venue, previous.platform, previous.channel, previous.venue);
  const memberCount = firstValue(data.expectedMembers, data.estimatedMembers, data.audienceSize, data.members, previous.expectedMembers, previous.estimatedMembers, previous.audienceSize);
  const joinUrl = firstValue(data.joinUrl, data.customerLink, data.shortLink, previous.joinUrl, previous.customerLink, previous.shortLink, eventCode ? `${window.location.origin}/join/${eventCode}` : '');

  return {
    ...previous,
    ...data,
    vertical: firstValue(data.vertical, previous.vertical, 'codeperks'),
    productName: firstValue(data.productName, previous.productName, 'codePerks'),
    eventCode,
    code: eventCode,
    pageName,
    artistName: pageName,
    releaseTitle,
    releaseName: releaseTitle,
    pageLogo: logo,
    pageImage: logo,
    artistLogo: logo,
    publishDate,
    releaseDate: publishDate,
    eventDate: publishDate,
    expectedMembers: memberCount,
    estimatedMembers: memberCount,
    audienceSize: memberCount,
    companyName: firstValue(data.companyName, data.company, data.presenter, previous.companyName, previous.company),
    platform,
    venue: platform,
    joinUrl,
    customerLink: joinUrl,
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
  const [bonusSaving, setBeneficioSaving] = useState(false);
  const [bonusMessage, setBeneficioMessage] = useState('');
  const [bonusDrafts, setBeneficioDrafts] = useState(() => {
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
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('codeperks_admin_key') || '');
  const [adminInput, setAdminInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [claims, setClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsMessage, setClaimsMessage] = useState('');

  const handleLanguageChange = useCallback((nextLang) => {
    const savedLang = persistLang(nextLang);
    setLangState(savedLang);
    if (setLang) setLang(savedLang);
  }, [setLang]);

  const adminHeaders = useMemo(() => (
    adminKey ? { 'x-admin-key': adminKey } : {}
  ), [adminKey]);

  const unlockDashboard = () => {
    const value = adminInput.trim();
    if (!value) {
      setAdminError('Enter dashboard passcode.');
      return;
    }

    sessionStorage.setItem('codeperks_admin_key', value);
    setAdminKey(value);
    setAdminInput('');
    setAdminError('');
  };

  const lockDashboard = () => {
    sessionStorage.removeItem('codeperks_admin_key');
    setAdminKey('');
    setAdminInput('');
    setAdminError('');
  };

  const joinUrl = useMemo(() => {
    const code = eventData.eventCode || eventData.code;
    if (!code) return '';
    const base = eventData.joinUrl || eventData.customerLink || eventData.shortLink || `${window.location.origin}/join/${code}`;
    const url = new URL(base, window.location.origin);
    url.searchParams.set('lang', lang);
    return url.toString();
  }, [eventData.code, eventData.eventCode, eventData.joinUrl, eventData.customerLink, eventData.shortLink, lang]);

  const loadCheckoutData = useCallback(async () => {
    const params = new URLSearchParams(location.search);
    const queryCode = params.get('event') || params.get('code');
    const stateData = location.state || {};
    const stored = STORAGE_KEYS.map(readJsonStorage).find((item) => item?.eventCode || item?.code) || {};
    const activeCode = queryCode || stateData.eventCode || stateData.code || stored.eventCode || stored.code || eventData.eventCode;

    let backendData = {};
    if (activeCode) {
      try {
        const res = await fetch(`${API_BASE}/event/${encodeURIComponent(activeCode)}?vertical=codeperks`);
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
        localStorage.setItem('codeperks_latest_event', JSON.stringify(merged));
        localStorage.setItem('codenxt_active_event_code', merged.eventCode);
      }
      return merged;
    });
  }, [eventData.eventCode, location.search, location.state]);

  const loadReport = useCallback(async () => {
    if (!eventData.eventCode) return;
    setReportMessage('');
    try {
      const res = await fetch(`${API_BASE}/report/${encodeURIComponent(eventData.eventCode)}?vertical=codeperks`, {
        headers: adminHeaders,
      });
      if (!res.ok) throw new Error(`Report failed: ${res.status}`);
      const data = await res.json();
      const legacyJoinKey = 'inner' + 'CircleJoinCount';
      const legacyRowsKey = 'inner' + 'Circle';
      const totalScans = Number(data?.metrics?.scans || data?.metrics?.totalScans || data?.totalScans || 0);
      const uniqueScans = Number(data?.metrics?.uniqueScans || data?.uniqueScans || 0);
      const joins = Number(data?.metrics?.joins || data?.metrics?.[legacyJoinKey] || data?.[legacyJoinKey] || data?.joins || 0);
      const ownershipCertificates = Number(data?.metrics?.ownershipCertificates || data?.ownershipCertificates?.length || 0);
      const rows = (data?.scans || data?.[legacyRowsKey] || data?.rows || []).map((entry, index) => ({
        eventCode: eventData.eventCode,
        scanId: entry.scanId || entry.id || `scan-${index + 1}`,
        phone: entry.phone || '',
        timestamp: entry.timestamp || entry.createdAt || '',
        tier: entry.tier || entry.rewardTier || '',
        source: entry.source || entry.type || 'qr',
      }));
      setReport({ totalScans, uniqueScans, joins, ownershipCertificates, rows, source: 'backend' });
      setReportMessage(`Nøkkeltall hentet: ${totalScans} skanninger, ${joins} InSide-medlemmer, ${ownershipCertificates} ownership-bevis.`);
    } catch (error) {
      console.warn('Report unavailable:', error);
      setReportMessage(text.reportUnavailable);
      const localRows = readJsonStorage(`codeperks_report_rows_${eventData.eventCode || `PK-${String(Math.floor(Math.random() * 90000) + 10000)}`}`);
      setReport((previous) => ({
        ...previous,
        rows: Array.isArray(localRows) ? localRows : previous.rows,
        source: 'local',
      }));
    }
  }, [eventData.eventCode, text.reportUnavailable, adminHeaders]);

  const loadClaims = useCallback(async () => {
    if (!eventData.eventCode) return;

    setClaimsLoading(true);
    setClaimsMessage('');

    try {
      const res = await fetch(`${API_BASE}/reward-claims/${encodeURIComponent(eventData.eventCode)}`, {
        headers: adminHeaders,
      });
      if (!res.ok) throw new Error(`Reward claims failed: ${res.status}`);

      const data = await res.json();
      const rows = Array.isArray(data?.claims) ? data.claims : [];

      setClaims(rows);
      setClaimsMessage(`${rows.length} reward claim${rows.length === 1 ? '' : 's'} loaded.`);
    } catch (error) {
      console.warn('Reward claims unavailable:', error);
      setClaimsMessage('Reward claims could not be loaded.');
    } finally {
      setClaimsLoading(false);
    }
  }, [eventData.eventCode, adminHeaders]);


  useEffect(() => {
    document.title = `${text.title} - codePerks`;
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
    loadClaims();

    const reportTimer = window.setInterval(() => {
      loadReport();
      loadClaims();
    }, 20000);

    return () => window.clearInterval(reportTimer);
  }, [eventData.eventCode, loadReport, loadClaims]);

  const updateBeneficioDraft = (tier, patch) => {
    setBeneficioDrafts((previous) => {
      const next = { ...previous, [tier]: { ...previous[tier], ...patch } };
      return next;
    });
  };

  const saveBeneficio = useCallback(async () => {
    const draft = bonusDrafts[activeTier];
    if (!eventData.eventCode || (!draft.url && !draft.file)) return;
    setBeneficioSaving(true);
    setBeneficioMessage('');

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
        vertical: 'codeperks',
        eventCode: eventData.eventCode,
        tier: activeTier,
        title: draft.title,
        description: draft.description,
        type: draft.type,
        url: bonusUrl,
        fileName: draft.fileName,
        pageName: eventData.pageName,
        releaseTitle: eventData.releaseTitle,
        pageLogo: eventData.pageLogo,
        createdAt: new Date().toISOString(),
      };

      let eventId = eventData.id;
      if (!eventId) {
        try {
          const eventRes = await fetch(`${API_BASE}/event/${encodeURIComponent(eventData.eventCode)}?vertical=codeperks`);
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
        headers: { 'Content-Type': 'application/json', ...adminHeaders },
        body: JSON.stringify({ eventId, reward }),
      });
      if (!bonusRes.ok) throw new Error(`Reward save failed: ${bonusRes.status}`);

      updateBeneficioDraft(activeTier, { ...draft, url: bonusUrl, file: null, status: 'saved', storage: 'backend' });
      setBeneficioMessage(`${text.saved}: ${text[activeTier]}`);
    } catch (error) {
      console.warn('Beneficio backend save failed, using localStorage fallback:', error);
      updateBeneficioDraft(activeTier, { ...draft, file: null, status: 'saved', storage: 'local' });
      setBeneficioMessage(text.localFallback);
    } finally {
      setBeneficioSaving(false);
    }
  }, [activeTier, bonusDrafts, eventData, text]);

  const downloadBadgeImage = useCallback(async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = BADGE_SIZE.width;
      canvas.height = BADGE_SIZE.height;
      const ctx = canvas.getContext('2d');
      const base = await loadImage(badgeBase);
      ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

      if (qrDataUrl) {
        const qr = await loadImage(qrDataUrl);
        const quiet = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(QR_BOX.x, QR_BOX.y, QR_BOX.size, QR_BOX.size);
        ctx.drawImage(qr, QR_BOX.x + quiet, QR_BOX.y + quiet, QR_BOX.size - quiet * 2, QR_BOX.size - quiet * 2);
      }

      if (eventData.eventCode) {
        ctx.save();
        ctx.font = '300 18px Arial, Helvetica, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
        ctx.shadowBlur = 8;
        ctx.fillText(eventData.eventCode || 'PK-00001', canvas.width - 6, canvas.height - 2);
        ctx.restore();
      }

      const link = document.createElement('a');
      link.download = `${eventData.eventCode || 'codeperks'}-badge.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setImageStatus(text.imageReady);
    } catch (error) {
      console.error('Badge download failed:', error);
      setImageStatus(text.imageError);
    }
  }, [eventData.eventCode, qrDataUrl, text.imageError, text.imageReady]);

  const downloadQrImage = useCallback(async () => {
    if (!qrDataUrl) {
      setImageStatus(text.imageError);
      return;
    }

    try {
      const qr = await loadImage(qrDataUrl);
      const canvas = document.createElement('canvas');
      const padding = 36;
      const qrSize = 720;
      const labelHeight = 90;
      canvas.width = qrSize + padding * 2;
      canvas.height = qrSize + padding * 2 + labelHeight;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(qr, padding, padding, qrSize, qrSize);

      ctx.fillStyle = '#111111';
      ctx.font = '700 34px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(eventData.eventCode || 'codeperks', canvas.width / 2, qrSize + padding + 48);

      const link = document.createElement('a');
      link.download = `${eventData.eventCode || 'codeperks'}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setImageStatus(text.imageReady);
    } catch (error) {
      console.error('QR download failed:', error);
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
      const res = await fetch(`${API_BASE}/report/${encodeURIComponent(eventData.eventCode)}?vertical=codeperks`, {
          headers: adminHeaders,
        });
      if (res.ok) {
        const data = await res.json();
        const legacyJoinKey = 'inner' + 'CircleJoinCount';
        const legacyRowsKey = 'inner' + 'Circle';

        const totalScans = Number(data?.metrics?.scans || data?.metrics?.totalScans || data?.totalScans || 0);
        const uniqueScans = Number(data?.metrics?.uniqueScans || data?.uniqueScans || 0);
        const joins = Number(data?.metrics?.joins || data?.metrics?.[legacyJoinKey] || data?.[legacyJoinKey] || data?.joins || 0);
        const ownershipCertificates = Number(data?.metrics?.ownershipCertificates || data?.ownershipCertificates?.length || 0);

        const rows = (data?.scans || data?.[legacyRowsKey] || data?.rows || []).map((entry, index) => ({
          eventCode: eventData.eventCode,
          scanId: entry.scanId || entry.id || `scan-${index + 1}`,
          phone: entry.phone || '',
          timestamp: entry.timestamp || entry.createdAt || '',
          tier: entry.tier || entry.rewardTier || '',
          source: entry.source || entry.type || 'qr',
        }));

        reportForPdf = { totalScans, uniqueScans, joins, ownershipCertificates, rows, source: 'backend' };
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

    const logoUrl = eventData.pageLogo || eventData.artistLogo || eventData.logoUrl || '';

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
    color: #2f1f13;
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
      radial-gradient(circle at 18% 12%, rgba(177,132,84,0.18), transparent 34%),
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
    color: #e2c47a;
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
    border: 1px solid rgba(184,141,67,.35);
    border-radius: 18px;
    padding: 18px;
    background: linear-gradient(135deg, #f3e4bf 0%, #d8bd78 55%, #b88d43 100%);
  }

  .label {
    font-size: 9px;
    color: #5a351d;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: .10em;
  }

  .value {
    margin-top: 8px;
    font-size: 32px;
    font-weight: 950;
    color: #2f1f13;
  }

  .section-title {
    margin: 8px 0 12px;
    font-size: 17px;
    font-weight: 950;
    color: #2f1f13;
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
    font-size: 9px;
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
    font-size: 9px;
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


.dashboard-page .metrics-grid {
  display: grid !important;
  grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
  gap: 10px !important;
  align-items: stretch !important;
}

.dashboard-page .metrics-grid .mini-card {
  min-width: 0 !important;
  width: auto !important;
  padding: 12px 14px !important;
}

.dashboard-page .metrics-grid .mini-card .label {
  font-size: clamp(8px, 0.72vw, 11px) !important;
  line-height: 1.15 !important;
  letter-spacing: 0.12em !important;
  white-space: normal !important;
  overflow-wrap: anywhere !important;
}

.dashboard-page .metrics-grid .mini-card .metric-value {
  font-size: clamp(20px, 2.1vw, 34px) !important;
  line-height: 1.05 !important;
  white-space: nowrap !important;
}

@media (max-width: 1100px) {
  .dashboard-page .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 640px) {
  .dashboard-page .metrics-grid {
    grid-template-columns: 1fr !important;
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
            src="https://codeperks.codenxt.global/codePerks-logo.png?v=2"
            alt="codePerks"
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
          ${esc(eventData.pageName || 'codePerks')}
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
          ${esc(text.eventCodeLabel || 'Campaign code')}: ${esc(eventData.eventCode)}
        </p>
      </div>
    </div>

    <div class="content">
      <div class="cards">
        <div class="card"><div class="label">${esc(text.scans || "Scans")}</div><div class="value">${reportForPdf.totalScans || 0}</div></div>
        <div class="card"><div class="label">${esc(text.uniqueScans || "Unique scans")}</div><div class="value">${reportForPdf.uniqueScans || 0}</div></div>
        <div class="card"><div class="label">${esc(text.insideJoins || "InSide")}</div><div class="value">${reportForPdf.joins || 0}</div></div>
        <div class="card"><div class="label">${esc(text.ownershipCertificates || "Ownership certificates")}</div><div class="value">${reportForPdf.ownershipCertificates || 0}</div></div>
        <div class="card"><div class="label">${esc(text.conversion || "Conversion")}</div><div class="value">${reportForPdf.totalScans ? Math.round((reportForPdf.joins / reportForPdf.totalScans) * 100) : 0}%</div></div>
        <div class="card"><div class="label">${esc(text.gold || "Gull")}</div><div class="value">${rows.filter(r => (r.tier || '').toLowerCase() === 'gold').length}</div></div>
        <div class="card"><div class="label">${esc(text.silver || "Sølv")}</div><div class="value">${rows.filter(r => (r.tier || '').toLowerCase() === 'silver').length}</div></div>
        <div class="card"><div class="label">${esc(text.general || "Generell")}</div><div class="value">${rows.filter(r => (r.tier || '').toLowerCase() === 'general').length}</div></div>
      </div>

      <div class="section-title">${esc(text.bonusDistribution24h || "Beneficiofordeling (24 timer etter release)")}</div>

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
        <div>${esc(text.bonusActive24h || text.bonusDistribution24h || "Beneficio aktiv: 24 timer etter release")}</div>
        <div>codePerks by codeNXT</div>
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
    link.download = `${eventData.eventCode || 'codeperks'}-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [eventData.eventCode, report.rows, report.source]);

  const downloadClaimsCsv = useCallback(() => {
    const csv = [
      ['eventCode', 'certificateId', 'claimId', 'type', 'status', 'fullName', 'email', 'phone', 'address', 'postalCode', 'country', 'createdAt'].map(csvEscape).join(','),
      ...claims.map((claim) => [
        claim.eventCode || eventData.eventCode || '',
        claim.certificateId || '',
        claim.id || '',
        claim.type || '',
        claim.status || '',
        claim.claimant?.fullName || '',
        claim.claimant?.email || '',
        claim.claimant?.phone || '',
        claim.claimant?.address || '',
        claim.claimant?.postalCode || '',
        claim.claimant?.country || '',
        claim.createdAt || '',
      ].map(csvEscape).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${eventData.eventCode || 'codeperks'}-reward-claims.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }, [claims, eventData.eventCode]);


  const activeDraft = bonusDrafts[activeTier];
  const canSaveBeneficio = Boolean(activeDraft?.url || activeDraft?.file);
  const conversionRate = makeConversion(report.joins, report.uniqueScans);
  const infoCards = [
    [text.publishDate, eventData.publishDate],
    [text.expectedMembers, eventData.expectedMembers],
    [text.company, eventData.companyName],
    [text.releaseCode, eventData.eventCode],
    [text.platform, eventData.platform],
    [text.customerLink, joinUrl],
  ];
  const metricCards = [
    [text.scans, report.totalScans.toLocaleString()],
    [text.uniqueScans, report.uniqueScans.toLocaleString()],
    [text.insideJoins, report.joins.toLocaleString()],
    [text.conversionRate, conversionRate],
    [text.ownershipCertificates || 'Ownership certificates', Number(report.ownershipCertificates || 0).toLocaleString()],
    
  ];

  if (!adminKey) {
    return (
      <main className="dashboard-page admin-lock-page">
        <section className="panel admin-lock-panel">
          <img src="/codePerks-logo.png?v=3" alt="codePerks logo" className="codeperks-dashboard-logo" />
          <h1>Dashboard Access</h1>
          <p>Enter the codePerks dashboard passcode to continue.</p>
          <input
            type="password"
            value={adminInput}
            onChange={(event) => setAdminInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') unlockDashboard();
            }}
            placeholder="Dashboard passcode"
          />
          {adminError ? <small>{adminError}</small> : null}
          <button type="button" className="primary-cta" onClick={unlockDashboard}>
            Unlock Dashboard
          </button>
        </section>

        <style>{`
          .admin-lock-page {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            background:
              radial-gradient(circle at top, rgba(216,189,120,.16), transparent 36%),
              linear-gradient(135deg, #140f0a 0%, #251609 48%, #080706 100%);
          }

          .admin-lock-panel {
            width: min(460px, 100%);
            text-align: center;
          }

          .admin-lock-panel h1 {
            margin: 16px 0 8px;
            color: #f0d58f;
          }

          .admin-lock-panel p {
            color: rgba(255,255,255,.7);
          }

          .admin-lock-panel input {
            width: 100%;
            box-sizing: border-box;
            margin: 18px 0 10px;
            border: 1px solid rgba(216,189,120,.35);
            background: rgba(0,0,0,.28);
            color: #fff8e8;
            border-radius: 16px;
            padding: 14px 15px;
            outline: none;
            text-align: center;
          }

          .admin-lock-panel small {
            display: block;
            margin-bottom: 10px;
            color: #f0d58f;
          }
        `}</style>
      </main>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: #f8efe1;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Helvetica, Arial, sans-serif;
        }
        .dashboard-page {
          min-height: 100vh;
          color: #fff;
          background:
            radial-gradient(circle at 50% -8%, rgba(222, 174, 105, 0.18), transparent 30%),
            linear-gradient(180deg, #efd2a8 0%, #dfb878 48%, #c9954f 100%);
        }
        .dashboard-shell {
          width: min(1188px, 100%);
          margin: 0 auto;
          padding: 18px 18px 48px;
        }
        .logo {
          height: 96px;
          object-fit: contain;
          filter: none;
        }

        .info-grid .mini-card,
        .metrics-grid .mini-card {
          background: #ffffff !important;
          border: 2px solid #a97942 !important;
        }
        .info-grid .mini-card .label,
        .info-grid .mini-card .value,
        .metrics-grid .mini-card .label,
        .metrics-grid .mini-card .metric-value {
          color: #7a5230 !important;
          opacity: 1 !important;
        }

        .panel {
          background: #f8efe1;
          border: 2px solid #b18454;
          border-radius: 12px;
          box-shadow: 0 18px 48px rgba(92,58,28,0.12);
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
            radial-gradient(circle at 50% 6%, rgba(222,174,105,0.10), transparent 31%),
            radial-gradient(circle at 15% 100%, rgba(222,174,105,0.06), transparent 30%);
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
          filter: none;
        }
        .pod-logo.placeholder {
          min-width: 118px;
          max-width: 220px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.5);
          font-size: 9px;
          line-height: 1.2;
          text-align: center;
          border: 1px dashed rgba(255,255,255,0.16);
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          padding: 0 14px;
        }
        .page-name {
          margin: 0;
          color: #e2c47a;
          font-size: clamp(54px, 6vw, 78px);
          line-height: 0.98;
          font-weight: 900;
          letter-spacing: 0.035em;
          text-align: center;
          text-transform: uppercase;
          text-shadow: none;
        }
        .release-name {
          margin: 10px 0 0;
          color: #e2c47a;
          font-size: clamp(24px, 2.55vw, 32px);
          font-weight: 800;
          line-height: 1.18;
          text-align: center;
        }
        .refresh-removed {
          position: absolute;
          right: 26px;
          top: 25.00%;
          min-height: 28px;
          padding: 6px 9px;
          border-radius: 8px;
          border: 1px solid rgba(143,247,255,0.24);
          background: rgba(177,132,84,0.18);
          color: #fff;
          font-size: 9px;
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
          color: #8a5a2f;
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
          width: 100%;
          aspect-ratio: 1219 / 687;
          overflow: hidden;
          border-radius: 9px;
          border: 2px solid #b18454;
          background: #fff4df;
        }
        .presentation-panel .slide {
          position: relative;
          width: 100%;
          aspect-ratio: 1219 / 687;
          overflow: hidden;
          border-radius: 9px;
          border: 2px solid #b18454;
          background: #fff4df;
        }
        .slide-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 1;
        }
        .qr-box {
          position: absolute;
          left: ${QR_BOX_STYLE.left};
          top: ${QR_BOX_STYLE.top};
          width: ${QR_BOX_STYLE.width};
          height: ${QR_BOX_STYLE.height};
          display: flex;
          align-items: center;
          justify-content: center;
        };
          top: ${QR_BOX_STYLE.top};
          width: ${QR_BOX_STYLE.width};
          height: ${QR_BOX_STYLE.height};
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qr-img {
          width: 100%;
          height: 100%;
          object-fit: fill;
          border-radius: 4px;
          background: #fff;
          padding: 0;
          display: block;
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
        .gcompany-button {
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
        .gcompany-button {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: #fff;
        }
        .primary-button:disabled,
        .gcompany-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .status {
          min-height: 16px;
          margin-top: 8px;
          color: #8a5a2f;
          font-size: 9px;
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
          border-color: rgba(177,132,84,0.18);
          background: rgba(177,132,84,0.18);
        }
        .bonus-icon {
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #8a5a2f;
          background: rgba(177,132,84,0.18);
          font-size: 14px;
          font-weight: 900;
        }
        .bonus-cell {
          min-width: 0;
          color: rgba(255,255,255,0.78);
          font-size: 9px;
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
          color: #8a5a2f;
          font-weight: 800;
        }
        .edit-button {
          min-height: 30px;
          padding: 7px 10px;
          border-radius: 7px;
          border: 1px solid rgba(143,247,255,0.2);
          background: rgba(255,255,255,0.055);
          color: #fff;
          font-size: 9px;
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
          font-size: 9px;
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
          .page-name {
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
            width: 320px !important;
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

          .page-name {
            margin: 0 !important;
            color: #8a5a2f !important;
            font-size: clamp(34px, 5.6vw, 58px) !important;
            line-height: 0.96 !important;
            font-weight: 950 !important;
            letter-spacing: 0.045em !important;
            text-transform: uppercase !important;
            text-align: center !important;
            text-shadow: none;
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
            gap: 4px !important;
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
            border-color: rgba(177,132,84,0.18) !important;
            background: rgba(177,132,84,0.18) !important;
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
            background: rgba(177,132,84,0.18) !important;
            color: #8a5a2f !important;
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
            color: #8a5a2f !important;
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

          .left-page {
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
            font-size: 9px;
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
            gap: 4px !important;
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
            color: #7a5230;
            font-size: 9px;
            line-height: 1.3;
          }

          .presentation-panel {
            padding-bottom: 4px !important;
          }

          .page-title-row {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 4px !important;
            width: 100% !important;
          }

          .page-mic {
            font-size: clamp(42px, 6vw, 66px) !important;
            line-height: 1 !important;
            filter: none !important;
          }

          .summary .language-switcher,
          .summary-flags .language-switcher,
          .summary-flags button {
            position: relative !important;
            z-index: 60 !important;
            pointer-events: auto !important;
          }

          .page-title-row,
          .page-mic,
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
          .page-title-row,
          .page-name,
          .release-name,
          .page-mic {
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
            box-shadow: 0 0 12px rgba(177,132,84,0.35);
            border-color: rgba(177,132,84,0.55);
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
            color: rgba(255, 255, 255, 0.96);
            font-size: 9px;
            font-weight: 200;
            letter-spacing: 0.08em !important;
            text-transform: uppercase !important;
            font-family: Arial, Helvetica, sans-serif !important;
            text-shadow: none;
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
            font-size: 9px;
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
            color: #8a5a2f;
          }

          .main-grid {
            display: grid !important;
            align-items: stretch !important;
          }

          .left-page {
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }

          .left-page .presentation-panel {
            flex: 0 0 auto !important;
          }

          .left-page .compact-report {
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

          .left-page > .compact-report,
          .bonus-panel {
            height: 100% !important;
          }
      
          
          /* codePerks final top summary panel */
          .dashboard-page .panel.summary {
            background:
              radial-gradient(circle at 50% 0%, rgba(226,196,122,.10), transparent 32%),
              radial-gradient(circle at 8% 92%, rgba(184,141,67,.08), transparent 28%),
              linear-gradient(145deg, #030303 0%, #090909 45%, #020202 100%) !important;
            border: 1px solid rgba(226,196,122,.42) !important;
            border-radius: 28px !important;
            box-shadow:
              0 32px 80px rgba(0,0,0,.55),
              inset 0 1px 0 rgba(255,255,255,.08),
              inset 0 -1px 0 rgba(226,196,122,.18) !important;
          }

          .dashboard-page .panel.summary::before {
            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(226,196,122,.52),
                rgba(243,228,191,.34),
                rgba(226,196,122,.52),
                transparent
              ) !important;
            display: block !important;
            opacity: .72 !important;
          }

          .dashboard-page .summary-brand {
            gap: 2px !important;
          }

          .dashboard-page img.codeperks-dashboard-logo {
            width: 320px !important;
            max-width: 320px !important;
            filter:
              drop-shadow(0 0 12px rgba(226,196,122,.22))
              drop-shadow(0 0 32px rgba(0,0,0,.72)) !important;
          }

          .dashboard-page .codeperks-dashboard-tagline {
            color: #f3e4bf !important;
            -webkit-text-fill-color: #f3e4bf !important;
            letter-spacing: .08em !important;
            opacity: .92 !important;
          }

          .dashboard-page .summary-text {
            margin-top: 18px !important;
          }

          .dashboard-page .codeperks-dashboard-title {
            font-size: clamp(2.7rem, 5.5vw, 4.3rem) !important;
            color: #e2c47a !important;
            -webkit-text-fill-color: #e2c47a !important;
            text-shadow:
              0 2px 12px rgba(0,0,0,.65),
              0 0 24px rgba(226,196,122,.18) !important;
          }

          .dashboard-page .codeperks-dashboard-subtitle {
            color: #f3e4bf !important;
            -webkit-text-fill-color: #f3e4bf !important;
            opacity: .82 !important;
          }

          .dashboard-page .codeperks-dashboard-book {
            color: #f3e4bf !important;
            -webkit-text-fill-color: #f3e4bf !important;
            opacity: .95 !important;
          }

          .dashboard-page .summary-flags button,
          .dashboard-page .summary-flags .flag-selector {
            background: rgba(226,196,122,.13) !important;
            border: 1px solid rgba(226,196,122,.32) !important;
            box-shadow: 0 8px 22px rgba(0,0,0,.30) !important;
          }

          /* codePerks gold cards — direct Dashboard override */
          .dashboard-page .info-grid .mini-card,
          .dashboard-page .metrics-grid .mini-card,
          .dashboard-page .metrics-panel .mini-card,
          .dashboard-page .metric-card {
            background: linear-gradient(135deg, #f3e4bf 0%, #d8bd78 55%, #b88d43 100%) !important;
            border: 1px solid rgba(246,237,220,.55) !important;
            box-shadow:
              0 14px 34px rgba(0,0,0,.38),
              inset 0 1px 0 rgba(255,255,255,.38) !important;
          }

          .dashboard-page .info-grid .mini-card *,
          .dashboard-page .metrics-grid .mini-card *,
          .dashboard-page .metrics-panel .mini-card *,
          .dashboard-page .metric-card * {
            color: #2f1f13 !important;
            -webkit-text-fill-color: #2f1f13 !important;
          }

          .dashboard-page .info-grid .mini-card .label,
          .dashboard-page .metrics-grid .mini-card .label,
          .dashboard-page .metrics-panel .mini-card .label,
          .dashboard-page .metric-card .label {
            color: #5a351d !important;
            -webkit-text-fill-color: #5a351d !important;
            opacity: .88 !important;
          }


          /* FINAL OVERRIDE: codePerks metrics, 5 cards on one desktop row */
          .dashboard-page .metrics-grid {
            display: grid !important;
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }

          .dashboard-page .metrics-grid .mini-card {
            min-width: 0 !important;
            width: auto !important;
            padding: 10px 12px !important;
          }

          .dashboard-page .metrics-grid .mini-card .label {
            font-size: 9px !important;
            line-height: 1.1 !important;
            letter-spacing: .11em !important;
            white-space: normal !important;
            overflow-wrap: anywhere !important;
          }

          .dashboard-page .metrics-grid .mini-card .metric-value {
            font-size: 22px !important;
            line-height: 1 !important;
            white-space: nowrap !important;
          }

          @media (max-width: 1100px) {
            .dashboard-page .metrics-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 640px) {
            .dashboard-page .metrics-grid {
              grid-template-columns: 1fr !important;
            }
          }


          .claims-panel {
            margin-top: 18px;
          }

          .claims-list {
            display: grid;
            gap: 10px;
            margin-top: 16px;
          }

          .claim-row {
            display: grid;
            grid-template-columns: 1.25fr 1fr 1.35fr .6fr .75fr .75fr;
            gap: 8px;
            padding: 12px;
            border-radius: 18px;
            border: 1px solid rgba(255,255,255,.08);
            background: rgba(0,0,0,.18);
          }

          .claim-row span {
            display: block;
            margin-bottom: 4px;
            color: rgba(255,255,255,.48);
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .14em;
            text-transform: uppercase;
          }

          .claim-row strong {
            display: block;
            color: #fff8e8;
            font-size: 11px;
            line-height: 1.25;
            word-break: break-word;
          }

          @media (max-width: 900px) {
            .claim-row {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 560px) {
            .claim-row {
              grid-template-columns: 1fr;
            }
          }


          .claims-summary-box {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
            margin-top: 16px;
          }

          .claims-summary-box div {
            padding: 12px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,.08);
            background: rgba(0,0,0,.18);
          }

          .claims-summary-box span {
            display: block;
            margin-bottom: 6px;
            color: rgba(255,255,255,.48);
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .14em;
            text-transform: uppercase;
          }

          .claims-summary-box strong {
            display: block;
            color: #fff8e8;
            font-size: 24px;
            line-height: 1;
          }

          @media (max-width: 720px) {
            .claims-summary-box {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

`}

</style>


<style>{`
          .verification-panel {
            margin-top: 30px;
            padding: 18px;
            border-radius: 18px;
            border: 1px solid rgba(214, 162, 72, .55);
            background: rgba(0,0,0,.22);
          }

          .verification-panel .verification-copy h3 {
            margin: 6px 0 8px;
            color: #f7d88a;
            font-size: 18px;
          }

          .verification-panel .verification-copy p {
            margin: 0;
            max-width: 720px;
            color: rgba(255, 238, 196, .82);
            font-size: 13px;
            line-height: 1.55;
          }

          .verification-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-top: 20px;
          }

          .verification-grid div {
            min-height: 82px;
            padding: 14px;
            border-radius: 14px;
            border: 1px solid rgba(214, 162, 72, .45);
            background: rgba(255,255,255,.035);
          }

          .verification-grid span {
            display: block;
            margin-bottom: 8px;
            color: #f7d88a;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .14em;
            text-transform: uppercase;
          }

          .verification-grid strong {
            display: block;
            color: #fff1bf;
            font-size: 28px;
            line-height: 1.05;
          }

          @media (max-width: 720px) {
            .verification-grid {
              grid-template-columns: 1fr;
            }
          }
`}</style>

      <main className="dashboard-page">
        <div className="dashboard-shell">
          {!eventData.eventCode ? <section className="panel warning">{text.missingRelease}</section> : null}

          <section className="panel summary">
            <div className="summary-brand">
              <img src="/codePerks-logo.png?v=2" alt="codePerks logo" className="codeperks-dashboard-logo" />
              <div className="codeperks-dashboard-tagline">codePerks by codeNXT</div>
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
              <div className="page-title-row">
                <span className="codeperks-dashboard-book" aria-hidden="true">✦</span>
                <h2 className="codeperks-dashboard-title">{eventData.pageName || text.pageFallback}</h2>
                <span className="codeperks-dashboard-book" aria-hidden="true">✦</span>
              </div>
              <p className="codeperks-dashboard-subtitle">{eventData.releaseTitle || text.releaseFallback}</p>
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
            <div className="left-page">
            <section className="panel presentation-panel">
              <h2 className="panel-title">{text.presentation}</h2>
              <div className="slide">
                <img className="slide-bg" src={badgeBase} alt="" aria-hidden="true" />
                <div className="qr-box">
                  {qrDataUrl ? <img className="qr-img" src={qrDataUrl} alt={text.customerLink} /> : null}
                </div>
                {eventData.eventCode ? (
                  <div className="presentation-event-code">{eventData.eventCode || `PK-${String(Math.floor(Math.random() * 90000) + 10000)}`}</div>
                ) : null}
              </div>
              <div className="button-row">
                <button type="button" className="primary-button" onClick={downloadBadgeImage} disabled={!qrDataUrl}>
                  {text.downloadImage}
                </button>
                <button type="button" className="gcompany-button" onClick={downloadQrImage} disabled={!qrDataUrl}>
                  {text.downloadQr}
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
                <button type="button" className="gcompany-button" onClick={exportPdfReport}>
                  {text.viewReport}
                </button>
                <button type="button" className="primary-button" onClick={downloadCsv}>
                  {text.downloadCsv}
                </button>
              </div>

              <p className="csv-note">{text.reportLifecycle}</p>

            </section>

            <section className="panel report-panel compact-report claims-panel">
              <h2 className="panel-title">Reward Claims</h2>
              <p className="report-copy">
                Registered email and postal reward claims for this campaign.
              </p>

              <div className="button-row report-buttons">
                <button type="button" className="gcompany-button" onClick={loadClaims} disabled={claimsLoading}>
                  {claimsLoading ? 'Loading...' : 'Refresh claims'}
                </button>
                <button type="button" className="primary-button" onClick={downloadClaimsCsv} disabled={!claims.length}>
                  Export claims CSV
                </button>
              </div>

              {claimsMessage ? <p className="csv-note">{claimsMessage}</p> : null}

              <div className="claims-summary-box">
                <div>
                  <span>Total claims</span>
                  <strong>{claims.length}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{claims.filter((claim) => claim.type === 'email').length}</strong>
                </div>
                <div>
                  <span>Post</span>
                  <strong>{claims.filter((claim) => claim.type === 'post').length}</strong>
                </div>
                <div>
                  <span>Pending</span>
                  <strong>{claims.filter((claim) => (claim.status || 'pending') === 'pending').length}</strong>
                </div>
              </div>

              <p className="csv-note">
                Full claim details are kept in the CSV export to keep the dashboard compact.
              </p>
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
                        setBeneficioMessage('');
                      }}
                    >
                      {BONUS_TIERS.slice(0, tierCount).map((tier) => <option value={tier} key={tier}>{text[tier]}</option>)}
                    </select>
                  </label>

                  <label>
                    <span className="label">{text.type}</span>
                    <select
                      value={activeDraft.type}
                      onChange={(event) => updateBeneficioDraft(activeTier, { type: event.target.value, file: null, fileName: '', url: '' })}
                    >
                      {BONUS_TYPES.map((type) => <option value={type} key={type}>{text[type] || type.toUpperCase()}</option>)}
                    </select>
                  </label>

                  <label>
                    <span className="label">{text.fileOrUrl}</span>
                    {activeDraft.type === 'url' ? (
                      <input value={activeDraft.url} placeholder="https://..." onChange={(event) => updateBeneficioDraft(activeTier, { url: event.target.value })} />
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
                          updateBeneficioDraft(activeTier, { file, fileName: file?.name || '' });
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
                        {tier === 'general' ? (text.remaining || 'Resten') : Number(eventData?.tierLimits?.[tier] || eventData?.bonusLimits?.[tier] || tierSplit[tier] || 0)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="button-row">
                  <button type="button" className="primary-button" onClick={saveBeneficio} disabled={!canSaveBeneficio || bonusSaving}>
                    {bonusSaving ? text.savingBeneficio : text.saveBeneficio}
                  </button>
                </div>

                {bonusMessage ? <div className="status">{bonusMessage}</div> : null}
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
                        setBeneficioMessage('');

                        updateBeneficioDraft(tier, {
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

              <div className="verification-panel">
                <div className="verification-copy">
                  <span className="eyebrow">{text.verifiedNetworkEyebrow}</span>
                  <h3>{text.verifiedNetworkTitle}</h3>
                  <p>{text.verifiedNetworkText}</p>
                </div>

                <div className="verification-grid">
                  <div>
                    <span>{text.verifiedIssued}</span>
                    <strong>{claims.length || 0}</strong>
                  </div>
                  <div>
                    <span>{text.verifiedMembers}</span>
                    <strong>{Number(eventData?.joins || 0)}</strong>
                  </div>
                  <div>
                    <span>{text.verifiedStatus}</span>
                    <strong>{text.verifiedAuditReady}</strong>
                  </div>
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>
    </>
  );
}
