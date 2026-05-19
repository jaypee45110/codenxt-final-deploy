import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCodeStyling from 'qr-code-styling';
import { getLang } from '../i18n';
import roundQrImage from '../assets/round-qr.png';
import setlistImg from '../assets/setlist.png';

const API_BASE = "https://codenxt-backend-production.up.railway.app";
export default function Dashboard() {
  const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem('codenxt_event') || '{}');
  } catch {
    return {};
  }
})();
  const location = useLocation();
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const qrInstanceRef = useRef(null);

  const [lang, setLangState] = useState(getLang());
  const [eventStatus, setEventStatus] = useState('ready');
  const [rewardUploaded, setRewardUploaded] = useState(false);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);
  const [selectedRewardType, setSelectedRewardType] = useState('');
  const [selectedAccessMode, setSelectedAccessMode] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [screenLive, setScreenLive] = useState(false);
  const [unlockAt, setUnlockAt] = useState(null);
  const [serverTime, setServerTime] = useState(Date.now());
  const [localTime, setLocalTime] = useState(Date.now());
  const [statsTick, setStatsTick] = useState(0);
  const [showMode, setShowMode] = useState(false);
  const [liveStats, setLiveStats] = useState({ rawScans: 0, uniqueScans: 0, joins: 0 });
  const [eventData, setEventData] = useState({

    artistName: 'Artist / Event Name',
    venue: 'Venue Name',
    city: 'City',
    eventDate: '2026-07-02',
eventCode: '',
code: '',
shortLink: '',
    artistLogo: '',
    customerName: '',
    email: '',
    phone: '',
    audienceSize: '',
    selectedTypes: [],
    comment: '',
  });
  const statusStorageKey = eventData?.eventCode
    ? `codenxt_status_${eventData.eventCode}`
    : 'codenxt_status_default';  
    const copy = {
    en: {
      kicker: 'Control Center',
      title: 'Event command dashboard',
      subtitle: 'Manage live access, QR visibility, reward timing, and core event actions from one clean control surface.',
      venue: 'Venue',
      city: 'City',
      date: 'Date',
      eventCode: 'Event Code',
      tickets: 'Tickets / Audience',
      totalScans: 'Total Scans',
      scanRate: 'Scan Rate',
      joins: 'InnerCircle Joins',
      estimated: 'Estimated',
      scanCount: 'Live scan count',
      scanRatio: 'Audience-to-scan ratio',
      joinCount: 'Joined audience count',
      qrTitle: 'Event QR',
      artistLogo: 'Artist logo',
      noLogo: 'No logo transferred.',
      qrTarget: 'QR target',
      arrangementType: 'Arrangement type',
      noArrangementType: 'No arrangement type selected',
      customer: 'Customer',
      notAvailable: 'Not available',
      noEmail: 'No email',
      noPhone: 'No phone',
      controlActions: 'Control actions',
      grouped: 'Grouped for clarity: core event control first, utility actions second.',
      eventControl: 'Event Control',
      utility: 'Utility',
      uploadReward: 'SAVE REWARD',
      rewardUploaded: 'SAVED',
      uploadRewardNote: 'Store the live reward that Open now will reveal.',
      rewardUploadedNote: 'A reward is now stored and ready for the join flow.',
      unlockReward: 'GO LIVE',
      rewardUnlocked: 'Reward unlocked',
      unlockRewardNote: 'Open access to the audience at the chosen moment.',
      sendToScreen: 'Send to screen',
      sendToScreenNote: 'Push QR prompt and event access to the big screen.',
      stopScreen: 'Stop screen',
      stopScreenNote: 'Remove the on-screen QR call to action.',
      printQr: 'Print QR code',
      printQrNote: 'Generate a printable version for venue use.',
      sendReport: 'MAKE REPORT',
      sendReportNote: 'Generate PDF report',
      operationalNote: 'Operational note',
      operationalNoteText: 'The QR stays real and scannable. Artist and venue now live in the ring, not inside the code.',
      customerNote: 'Customer note',
      draft: 'Draft',
      ready: 'Ready',
      live: 'Live',
      closed: 'Closed',
      openJoin: 'OPEN JOIN PAGE',
    },
    no: {
      kicker: 'Kontrollsenter',
      title: 'Event-dashboard',
      subtitle: 'Styr live-tilgang, QR-synlighet, reward-timing og kjernehandlinger fra ett rent kontrollpanel.',
      venue: 'Venue',
      city: 'By',
      date: 'Dato',
      eventCode: 'Eventkode',
      tickets: 'Billetter / publikum',
      totalScans: 'Totale scan',
      scanRate: 'Scan-rate',
      joins: 'InnerCircle-medlemmer',
      estimated: 'Estimert publikum fra checkout',
      scanCount: 'Plassholder for live scan-tall',
      scanRatio: 'Plassholder for forhold scan/publikum',
      joinCount: 'Plassholder for innmeldte',
      qrTitle: 'codeTone QR',
      artistLogo: 'Artistlogo',
      noLogo: 'Ingen logo overført.',
      qrTarget: 'QR-mål',
      arrangementType: 'Arrangementstype',
      noArrangementType: 'Ingen arrangementstype valgt',
      customer: 'Kunde',
      notAvailable: 'Ikke tilgjengelig',
      noEmail: 'Ingen e-post',
      noPhone: 'Ingen telefon',
      controlActions: 'Kontrollhandlinger',
      grouped: 'Gruppert for klarhet: eventkontroll først, verktøy deretter.',
      eventControl: 'Eventkontroll',
      utility: 'Verktøy',
      uploadReward: 'Last opp reward',
      rewardUploaded: 'Reward lastet opp',
      uploadRewardNote: 'Lagre live-rewarden som Open now skal vise.',
      rewardUploadedNote: 'Reward er nå lagret og klar for join-flyten.',
      unlockReward: 'Åpne reward',
      rewardUnlocked: 'Reward åpnet',
      unlockRewardNote: 'Åpne tilgang for publikum på valgt tidspunkt.',
      sendToScreen: 'Send til skjerm',
      sendToScreenNote: 'Send QR-prompt og tilgang til storskjerm.',
      stopScreen: 'Stopp skjerm',
      stopScreenNote: 'Fjern QR-kallet fra skjermen.',
      printQr: 'Skriv ut QR-kode',
      printQrNote: 'Lag en utskriftsvennlig versjon for venue.',
      sendReport: 'Send rapport',
      sendReportNote: 'Send en enkel oppsummering etter aktivering.',
      operationalNote: 'Operativ merknad',
      operationalNoteText: 'QR-en forblir ekte og skannbar. Artist og venue ligger nå i ringen, ikke inni koden.',
      customerNote: 'Kundenotat',
      draft: 'Utkast',
      ready: 'Klar',
      live: 'Live',
      closed: 'Lukket',
      openJoin: 'Åpne join-side',
    },
    sv: {
      kicker: 'Kontrollcenter',
      title: 'Eventdashboard',
      subtitle: 'Hantera liveåtkomst, QR-synlighet, reward-timing och kärnaktiviteter från en ren kontrollpanel.',
      venue: 'Venue',
      city: 'Stad',
      date: 'Datum',
      eventCode: 'Eventkod',
      tickets: 'Biljetter / publik',
      totalScans: 'Totala scans',
      scanRate: 'Scan-rate',
      joins: 'InnerCircle-anslutningar',
      estimated: 'Beräknad publik från checkout',
      scanCount: 'Platshållare för live scans',
      scanRatio: 'Platshållare för publik/scans',
      joinCount: 'Platshållare för anslutningar',
      qrTitle: 'codeTone QR',
      artistLogo: 'Artistlogga',
      noLogo: 'Ingen logga överförd.',
      qrTarget: 'QR-mål',
      arrangementType: 'Typ av arrangemang',
      noArrangementType: 'Ingen typ vald',
      customer: 'Kund',
      notAvailable: 'Inte tillgänglig',
      noEmail: 'Ingen e-post',
      noPhone: 'Ingen telefon',
      controlActions: 'Kontrollåtgärder',
      grouped: 'Grupperat för tydlighet: eventkontroll först, verktyg därefter.',
      eventControl: 'Eventkontroll',
      utility: 'Verktyg',
      uploadReward: 'Ladda upp reward',
      rewardUploaded: 'Reward uppladdad',
      uploadRewardNote: 'Spara live-rewarden som Open now ska visa.',
      rewardUploadedNote: 'Reward är nu sparad och klar för join-flödet.',
      unlockReward: 'Öppna reward',
      rewardUnlocked: 'Reward öppnad',
      unlockRewardNote: 'Öppna åtkomst för publiken i rätt ögonblick.',
      sendToScreen: 'Skicka till skärm',
      sendToScreenNote: 'Skicka QR-prompt och åtkomst till storbild.',
      stopScreen: 'Stoppa skärm',
      stopScreenNote: 'Ta bort QR-uppmaningen från skärmen.',
      printQr: 'Skriv ut QR-kod',
      printQrNote: 'Skapa en utskriftsvänlig version för venue.',
      sendReport: 'Skicka rapport',
      sendReportNote: 'Skicka en enkel sammanfattning efter aktivering.',
      operationalNote: 'Operativ notering',
      operationalNoteText: 'QR-koden förblir äkta och skannbar. Artist och venue ligger nu i ringen, inte i själva koden.',
      customerNote: 'Kundnotering',
      draft: 'Utkast',
      ready: 'Klar',
      live: 'Live',
      closed: 'Stängd',
      openJoin: 'Öppna join-sida',
    },
    de: {
      kicker: 'Control Center',
      title: 'Event-Dashboard',
      subtitle: 'Steuere Live-Zugang, QR-Sichtbarkeit, Reward-Timing und Kernaktionen über eine saubere Oberfläche.',
      venue: 'Venue',
      city: 'Stadt',
      date: 'Datum',
      eventCode: 'Eventcode',
      tickets: 'Tickets / Publikum',
      totalScans: 'Scans gesamt',
      scanRate: 'Scan-Rate',
      joins: 'InnerCircle-Beitritte',
      estimated: 'Geschätztes Publikum aus dem Checkout',
      scanCount: 'Platzhalter für Live-Scans',
      scanRatio: 'Platzhalter für Verhältnis Publikum/Scans',
      joinCount: 'Platzhalter für Beitritte',
      qrTitle: 'codeTone QR',
      artistLogo: 'Künstlerlogo',
      noLogo: 'Kein Logo übertragen.',
      qrTarget: 'QR-Ziel',
      arrangementType: 'Veranstaltungsart',
      noArrangementType: 'Keine Veranstaltungsart gewählt',
      customer: 'Kunde',
      notAvailable: 'Nicht verfügbar',
      noEmail: 'Keine E-Mail',
      noPhone: 'Kein Telefon',
      controlActions: 'Steueraktionen',
      grouped: 'Zur Klarheit gruppiert: zuerst Event-Steuerung, dann Werkzeuge.',
      eventControl: 'Event-Steuerung',
      utility: 'Werkzeuge',
      uploadReward: 'Reward hochladen',
      rewardUploaded: 'Reward hochgeladen',
      uploadRewardNote: 'Speichere den Live-Reward, den Open now zeigen soll.',
      rewardUploadedNote: 'Reward ist jetzt gespeichert und für den Join-Flow bereit.',
      unlockReward: 'Reward freigeben',
      rewardUnlocked: 'Reward freigegeben',
      unlockRewardNote: 'Öffne den Zugang für das Publikum im richtigen Moment.',
      sendToScreen: 'An Bildschirm senden',
      sendToScreenNote: 'QR-Prompt und Zugang auf die Großbildfläche schicken.',
      stopScreen: 'Bildschirm stoppen',
      stopScreenNote: 'QR-Aufruf vom Bildschirm entfernen.',
      printQr: 'QR-Code drucken',
      printQrNote: 'Eine druckbare Version für die Venue erstellen.',
      sendReport: 'Bericht senden',
      sendReportNote: 'Nach der Aktivierung eine einfache Zusammenfassung senden.',
      operationalNote: 'Operativer Hinweis',
      operationalNoteText: 'Der QR-Code bleibt echt und scanbar. Künstler und Venue leben jetzt im Ring, nicht im Code.',
      customerNote: 'Kundennotiz',
      draft: 'Entwurf',
      ready: 'Bereit',
      live: 'Live',
      closed: 'Geschlossen',
      openJoin: 'Join-Seite öffnen',
    },
    th: {
      kicker: 'ศูนย์ควบคุม',
      title: 'แดชบอร์ดอีเวนต์',
      subtitle: 'จัดการการเข้าถึงแบบสด การแสดง QR เวลาเปิด reward และการควบคุมหลักจากหน้าจอเดียว',
      venue: 'สถานที่',
      city: 'เมือง',
      date: 'วันที่',
      eventCode: 'รหัสอีเวนต์',
      tickets: 'ตั๋ว / ผู้ชม',
      totalScans: 'สแกนทั้งหมด',
      scanRate: 'อัตราการสแกน',
      joins: 'เข้าร่วม InnerCircle',
      estimated: 'จำนวนผู้ชมโดยประมาณจาก checkout',
      scanCount: 'ตัวอย่างจำนวนสแกนสด',
      scanRatio: 'ตัวอย่างอัตราผู้ชมต่อการสแกน',
      joinCount: 'ตัวอย่างจำนวนเข้าร่วม',
      qrTitle: 'codeTone QR',
      artistLogo: 'โลโก้ศิลปิน',
      noLogo: 'ยังไม่มีการส่งโลโก้',
      qrTarget: 'ปลายทาง QR',
      arrangementType: 'ประเภทงาน',
      noArrangementType: 'ยังไม่ได้เลือกประเภทงาน',
      customer: 'ลูกค้า',
      notAvailable: 'ไม่มีข้อมูล',
      noEmail: 'ไม่มีอีเมล',
      noPhone: 'ไม่มีโทรศัพท์',
      controlActions: 'การควบคุม',
      grouped: 'จัดกลุ่มเพื่อความชัดเจน: ควบคุมอีเวนต์ก่อน แล้วค่อยเครื่องมือ',
      eventControl: 'ควบคุมอีเวนต์',
      utility: 'เครื่องมือ',
      uploadReward: 'อัปโหลด reward',
      rewardUploaded: 'อัปโหลด reward แล้ว',
      uploadRewardNote: 'บันทึก reward ที่ Open now จะเปิดให้ดู',
      rewardUploadedNote: 'reward ถูกบันทึกและพร้อมสำหรับ join flow แล้ว',
      unlockReward: 'เปิด reward',
      rewardUnlocked: 'เปิด reward แล้ว',
      unlockRewardNote: 'เปิดการเข้าถึงให้ผู้ชมในจังหวะที่ต้องการ',
      sendToScreen: 'ส่งขึ้นจอ',
      sendToScreenNote: 'ส่ง QR และข้อความไปยังจอใหญ่',
      stopScreen: 'หยุดหน้าจอ',
      stopScreenNote: 'ลบ QR ออกจากหน้าจอ',
      printQr: 'พิมพ์ QR',
      printQrNote: 'สร้างเวอร์ชันสำหรับพิมพ์ใช้งานในสถานที่',
      sendReport: 'ส่งรายงาน',
      sendReportNote: 'ส่งสรุปหลังจบการใช้งาน',
      operationalNote: 'หมายเหตุการใช้งาน',
      operationalNoteText: 'QR ยังเป็นของจริงและสแกนได้ ศิลปินและสถานที่อยู่ในวงแหวน ไม่ได้อยู่ในตัวโค้ด',
      customerNote: 'บันทึกลูกค้า',
      draft: 'ร่าง',
      ready: 'พร้อม',
      live: 'สด',
      closed: 'ปิด',
      openJoin: 'เปิดหน้า join',
    },
  };

  const t = copy[lang] || copy.en;
// --- GUIDE STATE ---
const [showGuide, setShowGuide] = useState(false);
const [guideStep, setGuideStep] = useState(0);

const guideSteps = useMemo(() => {
  return [
    {
      id: 'status',
      title: '1. Event Status',
      body: 'Set the event to LIVE when you are ready to activate.',
    },
    {
      id: 'overview',
      title: '2. Event Overview',
      body: 'Confirm venue, city, date, and event code.',
    },
    {
      id: 'metrics',
      title: '3. Live Metrics',
      body: 'These reflect real audience behavior in the moment.',
    },
    {
      id: 'qr',
      title: '4. Event QR',
      body: 'This is the access point. Show it at the right moment.',
    },
    {
      id: 'actions',
      title: '5. Control Actions',
      body: 'Control what appears on screen in real time.',
    },
    {
      id: 'reward',
      title: '6. Reward Control',
      body: 'Define what the audience receives.',
    },
  ];
}, []);

const closeGuide = useCallback(() => {
  if (eventData?.eventCode) {
    localStorage.setItem(`codenxt_seen_guide_${eventData.eventCode}`, 'true');
  }
  setShowGuide(false);
  setGuideStep(0);
}, [eventData?.eventCode]);

const nextGuideStep = useCallback(() => {
  setGuideStep((prev) => {
    if (prev >= guideSteps.length - 1) {
      if (eventData?.eventCode) {
        localStorage.setItem(`codenxt_seen_guide_${eventData.eventCode}`, 'true');
      }
      setShowGuide(false);
      return 0;
    }
    return prev + 1;
  });
}, [eventData?.eventCode, guideSteps.length]);

const previousGuideStep = useCallback(() => {
  setGuideStep((prev) => Math.max(prev - 1, 0));
}, []);
useEffect(() => {
  if (!eventData?.eventCode) return;

  const seen = localStorage.getItem(`codenxt_seen_guide_${eventData.eventCode}`);
  if (!seen) {
    setGuideStep(0);
    setShowGuide(true);
  }
}, [eventData?.eventCode]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentLang = params.get('lang') || 'en';
    setLangState(currentLang);
  }, [location.search]);

  useEffect(() => {
    const stateData = location.state;

    if (stateData) {
      setEventData((prev) => ({
        ...prev,
        artistName: stateData.artistName || prev.artistName,
        venue: stateData.venue || prev.venue,
        city: stateData.city || prev.city,
        eventDate: stateData.eventDate || prev.eventDate,
eventCode: stateData.eventCode || stateData.code || prev.eventCode,
code: stateData.code || stateData.eventCode || prev.code,
        shortLink: `https://codetone.codenxt.global/join/${stateData.eventCode || prev.eventCode}?lang=${lang}`,
        artistLogo: stateData.artistLogo || prev.artistLogo,
        customerName: stateData.customerName || prev.customerName,
        email: stateData.email || prev.email,
        phone: stateData.phone || prev.phone,
        audienceSize: stateData.audienceSize || prev.audienceSize,
        selectedTypes: stateData.selectedTypes || prev.selectedTypes,
        comment: stateData.comment || prev.comment,
comment: stateData.comment || prev.comment,
screenVideoUrl: stateData.screenVideoUrl || prev.screenVideoUrl,
      }));
      return;
    }

    const raw = localStorage.getItem('codenxt_event');
    if (!raw) return;

    try {
      const saved = JSON.parse(raw);

      setEventData((prev) => ({
        ...prev,
        artistName: saved?.artistName || prev.artistName,
        venue: saved?.venue || prev.venue,
        city: saved?.city || prev.city,
        eventDate: saved?.eventDate || prev.eventDate,
eventCode: saved?.eventCode || saved?.code || prev.eventCode,
code: saved?.code || saved?.eventCode || prev.code,
        shortLink: `https://codetone.codenxt.global/join/${saved?.eventCode || prev.eventCode}?lang=${lang}`,
        artistLogo: saved?.artistLogo || prev.artistLogo,
        customerName: saved?.customerName || prev.customerName,
        email: saved?.email || prev.email,
        phone: saved?.phone || prev.phone,
        audienceSize: saved?.audienceSize || prev.audienceSize,
        selectedTypes: saved?.selectedTypes || prev.selectedTypes,
        comment: saved?.comment || prev.comment,
      }));
    } catch (error) {
      console.error('Could not read saved event data:', error);
    }
  }, [location.state, lang]);

useEffect(() => {
  if (!eventData?.eventCode) return;

  let cancelled = false;

  const loadLiveStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/event/${eventData.eventCode}`);
      const data = await res.json();

      console.log('TIMING FETCH EVENT CODE:', eventData.eventCode);
      console.log('TIMING FETCH RESPONSE:', data);

      if (!res.ok || cancelled) return;

      setLiveStats({
        rawScans: Number(data?.rawScans || 0),
        uniqueScans: Number(data?.uniqueScans || 0),
        joins: Number(data?.innerCircleJoinCount || 0),
      });
setEventData((prev) => ({
  ...prev,
  screenVideoUrl: data?.screenVideoUrl || prev.screenVideoUrl,
  artistLogo: data?.artistLogo || prev.artistLogo,
  eventCode: data?.code || prev.eventCode,
  code: data?.code || prev.code,
}));
    } catch (error) {
      console.error('Live stats fetch failed:', error);
    }
  };

  loadLiveStats();
// const interval = setInterval(loadLiveStats, 3000);
  return () => {
  cancelled = true;
};
}, [eventData?.eventCode]);
  useEffect(() => {
  if (!qrRef.current || !eventData.eventCode) return;

  const joinUrl = `https://codetone.codenxt.global/join/${eventData.eventCode}?lang=${lang}`;

    const qrOptions = {
      width: 220,
      height: 220,
      type: 'svg',
      data: joinUrl,
      margin: 2,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H',
      },
      dotsOptions: {
        type: 'rounded',
        color: '#000000',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        color: '#000000',
      },
      cornersDotOptions: {
        type: 'dot',
        color: '#000000',
      },
    };

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = new QRCodeStyling(qrOptions);
      qrRef.current.innerHTML = '';
      qrInstanceRef.current.append(qrRef.current);
    } else {
      qrInstanceRef.current.update(qrOptions);
    }
  }, [lang, eventData.eventCode]);
const stats = useMemo(() => {
  const rawScans = Number(liveStats.rawScans || 0);
  const uniqueScans = Number(liveStats.uniqueScans || 0);
  const joinCount = Number(liveStats.joins || 0);

  const audienceNumber = Number(eventData.audienceSize || 0);
  const scanRateValue =
    audienceNumber > 0
      ? `${((uniqueScans / audienceNumber) * 100).toFixed(1)}%`
      : '—';

  return [
    {
      label: t.tickets,
      value: eventData.audienceSize || '—',
      note: t.estimated,
    },
    {
      label: t.totalScans,
      value: rawScans.toLocaleString(),
      note: t.scanCount,
    },
    {
      label: t.scanRate,
      value: scanRateValue,
      note: t.scanRatio,
    },
    {
      label: t.joins,
      value: joinCount.toLocaleString(),
      note: t.joinCount,
    },
  ];
}, [eventData.audienceSize, eventData.eventCode, t, statsTick]);
    useEffect(() => {
  const savedStatus = localStorage.getItem(statusStorageKey);

  if (savedStatus) {
    setEventStatus(savedStatus);
  }
}, [statusStorageKey]);

useEffect(() => {
  localStorage.setItem(statusStorageKey, eventStatus);
}, [statusStorageKey, eventStatus]);
useEffect(() => {
  const loadEventTiming = async () => {
    if (!eventData?.eventCode) return;

    try {
      const res = await fetch(`${API_BASE}/event/${eventData.eventCode}`);
      const data = await res.json();
      
console.log('TIMING FETCH EVENT CODE:', eventData.eventCode);
console.log('TIMING FETCH RESPONSE:', data);

      if (data?.unlockAt) {
        setUnlockAt(new Date(data.unlockAt).getTime());
      }

      if (data?.serverTime) {
        setServerTime(new Date(data.serverTime).getTime());
      } else {
        setServerTime(Date.now());
      }
    } catch (error) {
      console.error('Could not load event timing:', error);
    }
  };

  loadEventTiming();
}, [eventData?.eventCode]);
useEffect(() => {
  const interval = setInterval(() => {
    setLocalTime(Date.now());
  }, 1000);

  return () => clearInterval(interval);
}, []);
useEffect(() => {
if (eventStatus !== 'ready' && eventStatus !== 'live') return;
  const interval = setInterval(() => {
    setStatsTick((t) => t + 1);
  }, 2000);

  return () => clearInterval(interval);
}, [eventStatus]);

const statusLabel =
  eventStatus === 'draft'
    ? t.draft
    : eventStatus === 'ready'
    ? t.ready
    : eventStatus === 'live'
    ? t.live
    : t.closed;

const canGoDraft = eventStatus === 'ready';
const canGoReady = eventStatus === 'draft' || eventStatus === 'closed';
const canGoLive = eventStatus === 'ready';
const canGoClosed = eventStatus === 'live';
const isTimeUnlocked = unlockAt && serverTime >= unlockAt;
const unlockStatusText = isTimeUnlocked
  ? 'Ready to unlock'
  : unlockAt
  ? `Locked until ${new Date(unlockAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  : 'Unlock time not set';

const localTimeText = new Date(localTime).toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});
const handleSetEventStatus = (nextStatus) => {
  if (nextStatus === 'draft' && canGoDraft) {
    setEventStatus('draft');
    return;
  }

  if (nextStatus === 'ready' && canGoReady) {
    setEventStatus('ready');
    return;
  }

  if (nextStatus === 'live' && canGoLive) {
    setEventStatus('live');
    setEventData((prev) => ({
      ...prev,
      unlockAt: new Date().toISOString(),
    }));
    return;
  }

  if (nextStatus === 'closed' && canGoClosed) {
    setEventStatus('closed');
    setEventData((prev) => ({
      ...prev,
      endAt: new Date().toISOString(),
    }));
  }
};
const handleUploadReward = async () => {
  if (!selectedRewardType || !selectedAccessMode) {
  return;
}
  console.log('API_BASE:', API_BASE);
  console.log('Uploading reward for eventCode:', eventData.eventCode);

  try {
  const eventRes = await fetch(`${API_BASE}/event/${eventData.eventCode}`);
  const eventText = await eventRes.text();

  console.log('EVENT STATUS:', eventRes.status);
  console.log('EVENT RAW RESPONSE:', eventText);

} catch (error) {
  console.error('Event fetch failed:', error);
}
let rewardUrl = '';

if (selectedRewardType === 'url') {
  rewardUrl = 'https://soundcloud.com/';
} else {
  if (!selectedFile) {
    console.warn('No file selected for reward upload');
    return;
  }

  if (selectedRewardType !== 'image') {
    console.warn('Demo upload currently supports image rewards only');
    return;
  }

  rewardUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const maxWidth = 1200;
        const scale = Math.min(1, maxWidth / img.width);

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL('image/jpeg', 0.72);
        resolve(compressed);
      };

      img.onerror = () => reject(new Error('Failed to load selected image'));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error('Failed to read selected file'));
    reader.readAsDataURL(selectedFile);
  });
}
  const demoReward = {
    type: selectedRewardType,
    title: 'Exclusive after-show drop',
    description: 'Demo reward tied to the event dashboard.',
    url: rewardUrl,
    eventCode: eventData.eventCode,
    artistName: eventData.artistName,
artistLogo: '',
    createdAt: new Date().toISOString(),
    unlockAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    downloadAllowed: false,
    accessMode: selectedAccessMode,
    expiresAt: null,
  };

  try {
const eventRes = await fetch(`${API_BASE}/event/${eventData.eventCode}`);
const eventInfo = await eventRes.json();

console.log('EVENT LOOKUP RESPONSE:', eventInfo);
    if (!eventRes.ok || !eventInfo?.id) {
      console.error('Could not resolve backend event from code:', eventInfo);
      return;
    }

const rewardRes = await fetch(`${API_BASE}/reward`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    eventId: eventInfo.id,
    reward: demoReward,
  }),
});

const rewardText = await rewardRes.text();
console.log('REWARD STATUS:', rewardRes.status);
console.log('REWARD RAW RESPONSE:', rewardText);

let rewardData = null;
try {
  rewardData = JSON.parse(rewardText);
} catch (error) {
  console.error('Reward response was not JSON');
  return;
}

    if (!rewardRes.ok || !rewardData?.success) {
      console.error('Reward upload failed:', rewardData);
      return;
    }

    setRewardUploaded(true);
    setRewardUnlocked(false);
  } catch (error) {
    console.error('Could not upload reward to backend:', error);
  }
};
const handleSendReport = async () => {
  try {
    const res = await fetch(`${API_BASE}/report/${eventData.eventCode}`);
    const data = await res.json();
    console.log('LIVE STATS DATA:', data);

    if (!res.ok) {
      console.error('Report fetch failed:', data);
      return;
    }

    generatePDF(data);
  } catch (err) {
    console.error('Report error:', err);
  }
};
const generateCSV = (data) => {
  const rows = [
    ['Event Code', data?.event?.eventCode || eventData.eventCode || ''],
    ['Artist', data?.event?.artistName || eventData.artistName || ''],
    ['Venue', data?.event?.venue || eventData.venue || ''],
    ['Date', data?.event?.date || eventData.eventDate || ''],
    ['Scans', data?.metrics?.scans || 0],
    ['Unique Scans', data?.metrics?.uniqueScans || 0],
    ['InnerCircle Joins', data?.metrics?.joins || 0],
    ['Conversion Rate', `${data?.metrics?.conversionRate || 0}%`],
  ];

  const csvContent = rows.map((row) => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${data?.event?.eventCode || eventData.eventCode || 'event'}-report.csv`;
  a.click();

  URL.revokeObjectURL(url);
};

const handleDownloadCSV = async () => {
  try {
    const res = await fetch(`${API_BASE}/report/${eventData.eventCode}`);
    const data = await res.json();

    if (!res.ok) {
      console.error('CSV fetch failed:', data);
      return;
    }

    generateCSV(data);
  } catch (err) {
    console.error('CSV error:', err);
  }
};

const generatePDF = (data) => {
  const audienceValue = Number(eventData.audienceSize || 0);
  const totalScansValue = Number(data?.metrics?.scans || 0);
  const uniqueScansValue = Number(data?.metrics?.uniqueScans || 0);
  const innerCircleValue = Number(data?.metrics?.joins || 0);

  const participationValue =
    audienceValue > 0
      ? `${((uniqueScansValue / audienceValue) * 100).toFixed(1)}%`
      : '—';

  const eventLine = [
    eventData.venue || data?.event?.venue || '',
    eventData.city || '',
    eventData.eventDate || data?.event?.date || '',
  ].filter(Boolean).join(' · ');
const safeConversion =
  uniqueScansValue > 0
    ? Math.min(100, ((innerCircleValue / uniqueScansValue) * 100)).toFixed(1)
    : '—';
      const html = `
    <html>
    <head>
      <title>codeTone Report</title>
      <style>
        @page {
          size: A4;
          margin: 14mm;
        }

        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          background: #f5f5f3;
          color: #111111;
          font-family: Arial, Helvetica, sans-serif;
        }

        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: #f5f5f3;
          padding: 16mm 14mm 14mm;
        }

        .logo-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10mm;
        }

        .logo-wrap img {
          width: 78mm;
          max-width: 100%;
          height: auto;
          display: block;
        }

        .artist {
          margin: 0;
          text-align: center;
          font-size: 24pt;
          line-height: 1.02;
          font-weight: 900;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #0f0f10;
        }

        .event-line {
          margin-top: 6mm;
          text-align: center;
          font-size: 10.5pt;
          line-height: 1.35;
          color: #3b3b3d;
          font-weight: 600;
        }

        .rule {
          width: 46mm;
          height: 1px;
          background: #c6a04a;
          margin: 7mm auto 8mm;
        }

        .section-title {
          margin: 0 0 4mm;
          font-size: 9pt;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #161617;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4mm;
          margin-bottom: 8mm;
        }

        .kpi-card {
          background: #0d0d0f;
          color: #ffffff;
          border-radius: 4mm;
          padding: 5mm 5mm 4.5mm;
          min-height: 34mm;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
        }

        .kpi-label {
          font-size: 7.5pt;
          line-height: 1.2;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c8a24b;
          font-weight: 800;
          margin-bottom: 4mm;
        }

        .kpi-value {
          font-size: 23pt;
          line-height: 1;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 3mm;
        }

        .kpi-note {
          font-size: 8.4pt;
          line-height: 1.3;
          color: rgba(255,255,255,0.82);
        }

        .summary-box {
          background: #ffffff;
          border: 1px solid #dfdfdb;
          border-radius: 4mm;
          padding: 6mm;
          margin-bottom: 8mm;
        }

        .summary-text {
          margin: 0;
          font-size: 11pt;
          line-height: 1.65;
          color: #19191a;
        }

        .summary-text strong {
          color: #0f0f10;
        }

        .notes-box {
          background: #ffffff;
          border: 1px solid #dfdfdb;
          border-radius: 4mm;
          padding: 6mm;
        }

        .notes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6mm;
        }

        .note-item {
          border-top: 2px solid #c6a04a;
          padding-top: 4mm;
        }

        .note-label {
          font-size: 8pt;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #67676b;
          margin-bottom: 2.5mm;
        }

        .note-value {
          font-size: 15pt;
          line-height: 1.1;
          font-weight: 800;
          color: #111111;
          margin-bottom: 2mm;
        }

        .note-copy {
          font-size: 9.2pt;
          line-height: 1.5;
          color: #333336;
        }

        .footer {
          margin-top: 10mm;
          padding-top: 5mm;
          border-top: 1px solid #d9c48c;
          text-align: center;
          color: #444447;
        }

        .footer-brand {
          font-size: 10.5pt;
          font-weight: 800;
          margin-bottom: 1.5mm;
        }

        .footer-copy {
          font-size: 8.5pt;
          line-height: 1.4;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="logo-wrap">
          <img src="/codetone-logo.webp" alt="codeTone logo" />
        </div>

        <h1 class="artist">${eventData.artistName || data?.event?.artistName || 'Artist / Event Name'}</h1>
        <div class="rule"></div>
        <div class="event-line">${eventLine}</div>

        <div style="height: 9mm;"></div>

        <div class="section-title">Event Performance Summary</div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Audience</div>
            <div class="kpi-value">${audienceValue || '—'}</div>
            <div class="kpi-note">Estimated ticketed audience</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Total Scans</div>
            <div class="kpi-value">${totalScansValue}</div>
            <div class="kpi-note">All scan attempts recorded</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Participation</div>
            <div class="kpi-value">${participationValue}</div>
            <div class="kpi-note">Unique participants vs audience</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">InnerCircle</div>
            <div class="kpi-value">${innerCircleValue}</div>
            <div class="kpi-note">Joined after access</div>
          </div>
        </div>

        <div class="summary-box">
          <div class="section-title">Summary</div>
          <p class="summary-text">
            <strong>${totalScansValue}</strong> scans were recorded during the activation window.
            <strong>${uniqueScansValue}</strong> unique participants engaged with the drop, corresponding to a
            participation rate of <strong>${participationValue}</strong> of the estimated audience.
            <strong>${innerCircleValue}</strong> users joined InnerCircle after access.
          </p>
        </div>

        <div class="notes-box">
          <div class="section-title">Readout</div>
          <div class="notes-grid">
            <div class="note-item">
              <div class="note-label">Audience Response</div>
              <div class="note-value">${uniqueScansValue}</div>
              <div class="note-copy">
                Unique participants represent the clearest picture of actual audience response during the activation.
              </div>
            </div>

            <div class="note-item">
              <div class="note-label">Conversion to InnerCircle</div>
              <div class="note-value">
              ${safeConversion}%
              </div>
              <div class="note-copy">
                This shows how many of those who engaged continued into the next step of the experience.
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="footer-brand">codeTone by codeNXT</div>
          <div class="footer-copy">Turning live moments into measurable participation</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();
};
  const topText = (eventData.artistName || 'Artist / Event Name').toUpperCase();
  const bottomText = (eventData.venue || 'VENUE').toUpperCase();
  const roundQrSrc = null;
  const longestArcText = Math.max(topText.length, bottomText.length);

  const arcRadius =
  longestArcText > 34 ? 138 :
  longestArcText > 28 ? 134 :
  longestArcText > 22 ? 130 :
  126;

  const badgeFontSize =
    longestArcText > 34 ? 20 :
    longestArcText > 28 ? 22 :
    longestArcText > 22 ? 24 :
    26;

  const topArcPath = `M ${170 - arcRadius} 170 A ${arcRadius} ${arcRadius} 0 0 1 ${170 + arcRadius} 170`;
  const bottomArcPath = `M ${170 + arcRadius} 170 A ${arcRadius} ${arcRadius} 0 0 1 ${170 - arcRadius} 170`;
  const goJoin = () => {
    navigate(`/join/${eventData.eventCode}?lang=${lang}`);
  };
const handlePrintQr = () => {
  const activeEventCode = eventData?.eventCode || eventData?.code;
  if (!activeEventCode) return;

  navigate(`/print/${encodeURIComponent(activeEventCode)}`, {
    state: {
      ...eventData,
      eventCode: activeEventCode,
    },
  });
};

    if (!eventData) {
      return null;
      }
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #070707;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Helvetica, Arial, sans-serif;
        }

        .dashboard-page {
          min-height: 100vh;
          color: #ffffff;
          background:
            radial-gradient(circle at top left, rgba(0,240,255,0.12), transparent 24%),
            radial-gradient(circle at bottom right, rgba(57,120,255,0.14), transparent 24%),
            #070707;
          position: relative;
          overflow: hidden;
        }

        .dashboard-glow {
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(90px);
          opacity: 0.9;
        }

        .dashboard-glow.one {
          width: 360px;
          height: 360px;
          left: -100px;
          top: -100px;
          background: rgba(0,240,255,0.12);
        }

        .dashboard-glow.two {
          width: 420px;
          height: 420px;
          right: -140px;
          bottom: -160px;
          background: rgba(57,120,255,0.16);
        }

        .dashboard-shell {
          max-width: 1380px;
          margin: 0 auto;
          padding: 28px 22px 72px;
          position: relative;
          z-index: 1;
        }

        .dashboard-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 28px;
          position: relative;
        }

        .dashboard-logo {
          height: 148px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 20px 40px rgba(0,240,255,0.15));
          margin-bottom: 14px;
        }

        .dashboard-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #9ddcff;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .dashboard-title {
          margin: 0 0 12px;
          font-size: 56px;
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        .dashboard-subtitle {
          margin: 0;
          max-width: 760px;
          color: rgba(255,255,255,0.70);
          font-size: 18px;
          line-height: 1.6;
        }

        .summary-card {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 22px;
          backdrop-filter: blur(14px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.30);
          margin-bottom: 24px;
        }

        .summary-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .summary-right {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 9px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.10);
        }

        .status-pill.draft { background: rgba(255,255,255,0.07); color: #d7d7d7; }
        .status-pill.ready { background: rgba(255,179,107,0.12); color: #ffcc8f; }
        .status-pill.live { background: rgba(121,255,176,0.12); color: #79ffb0; }
        .status-pill.closed { background: rgba(255,141,141,0.12); color: #ff8d8d; }

        .event-name {
          margin: 0;
          font-size: 34px;
          line-height: 1.05;
          letter-spacing: -0.03em;
        }

        .event-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .event-meta-box {
          padding: 14px;
          border-radius: 18px;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .event-meta-label {
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .event-meta-value {
          color: #ffffff;
          font-size: 15px;
          line-height: 1.4;
          word-break: break-word;
        }

        .status-switcher {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: flex-end;
        }

.status-button {
  height: 42px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.status-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  border-color: rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
}
        .status-button.active {
          background: #00f0ff;
          color: #000;
          border-color: transparent;
        }
.status-button.active {
          background: #00f0ff;
          color: #000;
          border-color: transparent;
        }

        .status-button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
                  .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          padding: 18px;
          border-radius: 22px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 16px 36px rgba(0,0,0,0.24);
        }

        .stat-label {
          color: rgba(255,255,255,0.58);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 34px;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 10px;
        }

        .stat-note {
          color: rgba(255,255,255,0.64);
          font-size: 14px;
          line-height: 1.5;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 0.88fr 1.12fr;
          gap: 24px;
          align-items: start;
        }

        .panel {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 22px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.30);
          backdrop-filter: blur(14px);
        }

        .panel-title {
          margin: 0 0 14px;
          font-size: 24px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-align: center;
        }

        .panel-text {
          margin: 0 0 18px;
          color: rgba(255,255,255,0.68);
          font-size: 15px;
          line-height: 1.6;
        }

        .qr-panel {
          text-align: center;
        }

        .qr-frame {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 0 4px;
        }

        .qr-badge-wrap {
          position: relative;
          width: 340px;
          height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qr-badge-svg {
          width: 340px;
          height: 340px;
          display: block;
          filter:
            drop-shadow(0 18px 40px rgba(0,0,0,0.34))
            drop-shadow(0 0 24px rgba(0,240,255,0.08));
        }

        .qr-badge-top-text,
        .qr-badge-bottom-text {
          fill: rgba(255,255,255,0.92);
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .qr-badge-inner-area {
          position: absolute;
          width: 236px;
          height: 236px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          box-shadow:
            inset 0 0 0 10px rgba(255,255,255,1),
            inset 0 0 0 11px rgba(230,230,230,1);
          overflow: hidden;
        }

        .qr-render {
          width: 176px;
          height: 176px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qr-render svg,
        .qr-render canvas {
          max-width: 100%;
          max-height: 100%;
          display: block;
        }

        .artist-logo-wrap {
          margin-top: 18px;
          padding: 16px;
          border-radius: 20px;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .artist-logo-label {
          color: rgba(255,255,255,0.54);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 10px;
        }

        .artist-logo-box {
          min-height: 118px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px dashed rgba(255,255,255,0.14);
          overflow: hidden;
        }

        .artist-logo-image {
          max-width: 240px;
          max-height: 90px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .artist-logo-placeholder {
          color: rgba(255,255,255,0.46);
          font-size: 14px;
          line-height: 1.5;
          padding: 18px;
        }

        .short-link-box,
        .customer-box,
        .event-type-box {
          margin-top: 18px;
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(255,255,255,0.06);
          text-align: left;
        }

        .short-link-label,
        .customer-label,
        .event-type-label {
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .short-link-value,
        .customer-value,
        .event-type-value {
          color: #8ff7ff;
          font-size: 14px;
          line-height: 1.5;
          word-break: break-word;
        }

        .customer-value,
        .event-type-value {
          color: #ffffff;
        }

        .action-section + .action-section {
          margin-top: 20px;
        }

        .action-section-label {
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

.action-button {
  min-height: 64px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  border-color: rgba(255,255,255,0.04);
  background: rgba(255,255,255,0.02);
  box-shadow: none;
}

.action-button:disabled .action-title,
.action-button:disabled .action-note {
  opacity: 0.6;
}

        .action-button.primary {
          background: linear-gradient(135deg, #00f0ff 0%, #3978ff 100%);
          color: #000;
          border-color: transparent;
          font-weight: 700;
        }

        .action-button.live {
          border-color: rgba(121,255,176,0.24);
          background: rgba(121,255,176,0.08);
        }

        .action-button.warn {
          border-color: rgba(255,179,107,0.24);
          background: rgba(255,179,107,0.08);
        }

        .action-title {
          display: block;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .action-note {
          display: block;
          font-size: 13px;
          line-height: 1.45;
          opacity: 0.82;
        }

        .join-button {
          width: 100%;
          min-height: 56px;
          border-radius: 18px;
          border: none;
          background: linear-gradient(135deg, #00f0ff 0%, #3978ff 100%);
          color: #000;
          font-size: 17px;
          font-weight: 800;
          cursor: pointer;
          margin-top: 18px;
        }
.join-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
          .system-note {
          margin-top: 20px;
          padding: 16px;
          border-radius: 18px;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .system-note-title {
          margin: 0 0 8px;
          font-size: 15px;
          font-weight: 700;
        }

        .system-note-text {
          margin: 0;
          color: rgba(255,255,255,0.66);
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 1100px) {
          .summary-card,
          .main-grid {
            grid-template-columns: 1fr;
          }

          .summary-right {
            justify-content: flex-start;
          }

          .status-switcher {
            justify-content: flex-start;
          }

          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .event-meta-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .dashboard-shell {
            padding: 20px 14px 52px;
          }

          .dashboard-logo {
            height: 104px;
            margin-bottom: 10px;
          }

          .dashboard-title {
            font-size: 38px;
          }

          .dashboard-subtitle {
            font-size: 16px;
          }

          .summary-card,
          .panel,
          .stat-card {
            border-radius: 22px;
            padding: 18px;
          }

          .stats-grid,
          .actions-grid,
          .event-meta-grid {
            grid-template-columns: 1fr;
          }

          .qr-badge-wrap,
          .qr-badge-svg {
            width: 280px;
            height: 280px;
          }

          .qr-badge-top-text,
          .qr-badge-bottom-text {
            font-size: 12px;
            letter-spacing: 0.1em;
          }

          .qr-badge-inner-area {
            width: 196px;
            height: 196px;
          }

          .qr-render {
            width: 146px;
            height: 146px;
          }

          .action-button {
            min-height: 58px;
          }

          .event-name {
            font-size: 28px;
          }

          .stat-value {
            font-size: 30px;
          }
        }
      `}</style>

      <div className="dashboard-page">
        <div className="dashboard-glow one" />
        <div className="dashboard-glow two" />

        <div className="dashboard-shell">
          <div className="dashboard-top">

            <img
              src="/codetone-logo.webp"
              alt="codeTone logo"
              className="dashboard-logo"
            />
            <div className="dashboard-kicker">{t.kicker}</div>
            <h1 className="dashboard-title">{t.title}</h1>
            <p className="dashboard-subtitle">{t.subtitle}</p>
          </div>
          <button
  onClick={() => setShowMode(prev => !prev)}
  style={{
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 20000,
    padding: '10px 14px',
    borderRadius: 12,
    background: showMode ? '#00f0ff' : 'rgba(255,255,255,0.1)',
    color: showMode ? '#000' : '#fff',
    fontWeight: 800,
    border: 'none',
    cursor: 'pointer'
  }}
>
  {showMode ? 'EXIT SHOW MODE' : 'SHOW MODE'}
</button>

          <div className="summary-card">
            <div className="summary-left">
              <div className={`status-pill ${eventStatus}`}>{statusLabel}</div>
              <h2 className="event-name">{eventData.artistName}</h2>
              <div
  style={{
    marginTop: 10,
    marginBottom: 14,
    display: 'inline-flex',
    flexDirection: 'column',
    gap: 4,
  }}
>
  <div
    style={{
      color: 'rgba(255,255,255,0.5)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    }}
  >
    Local Time
  </div>
  <div
    style={{
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: '0.04em',
    }}
  >
    {localTimeText}
  </div>
</div>

<div
  className="event-meta-grid"
  style={
    showMode
      ? { display: 'none' }
      : (
          showGuide && guideSteps[guideStep]?.id === 'overview'
            ? {
                position: 'relative',
                zIndex: 10000,
                boxShadow: '0 0 0 2px rgba(86,224,255,0.95), 0 0 24px rgba(86,224,255,0.35)',
                borderRadius: '24px',
              }
            : undefined
        )
  }
>

                  <div className="event-meta-box">
                  <div className="event-meta-label">{t.venue}</div>
                  <div className="event-meta-value">{eventData.venue}</div>
                </div>
                <div className="event-meta-box">
                  <div className="event-meta-label">{t.city}</div>
                  <div className="event-meta-value">{eventData.city}</div>
                </div>
                <div className="event-meta-box">
                  <div className="event-meta-label">{t.date}</div>
                  <div className="event-meta-value">{eventData.eventDate}</div>
                </div>
                <div className="event-meta-box">
                  <div className="event-meta-label">{t.eventCode}</div>
                  <div className="event-meta-value">{eventData.eventCode}</div>
                </div>
              </div>
            </div>

            <div className="summary-right">
<div
  className="status-switcher"
  style={
    showGuide && guideSteps[guideStep]?.id === 'status'
      ? {
          position: 'relative',
          zIndex: 10000,
          boxShadow: '0 0 0 2px rgba(86,224,255,0.95), 0 0 24px rgba(86,224,255,0.35)',
          borderRadius: '24px',
        }
      : undefined
  }
>
    <button
    className={`status-button ${eventStatus === 'draft' ? 'active' : ''}`}
    onClick={() => handleSetEventStatus('draft')}
    type="button"
    disabled={!canGoDraft && eventStatus !== 'draft'}
  >
    {t.draft}
  </button>

  <button
    className={`status-button ${eventStatus === 'ready' ? 'active' : ''}`}
    onClick={() => handleSetEventStatus('ready')}
    type="button"
    disabled={!canGoReady && eventStatus !== 'ready'}
  >
    {t.ready}
  </button>

  <button
    className={`status-button ${eventStatus === 'live' ? 'active' : ''}`}
    onClick={() => handleSetEventStatus('live')}
    type="button"
    disabled={!canGoLive && eventStatus !== 'live'}
  >
    {t.live}
  </button>

  <button
    className={`status-button ${eventStatus === 'closed' ? 'active' : ''}`}
    onClick={() => handleSetEventStatus('closed')}
    type="button"
    disabled={!canGoClosed && eventStatus !== 'closed'}
  >
    {t.closed}
  </button>
</div>
            </div>
          </div>

<div
  className="stats-grid"
  style={
    showGuide && guideSteps[guideStep]?.id === 'metrics'
      ? {
          position: 'relative',
          zIndex: 10000,
          boxShadow: '0 0 0 2px rgba(86,224,255,0.95), 0 0 24px rgba(86,224,255,0.35)',
          borderRadius: '24px',
        }
      : undefined
  }
>
              {stats.map((item) => (
              <div key={item.label} className="stat-card">
                <div className="stat-label">{item.label}</div>
                <div className="stat-value">{item.value}</div>
                <div className="stat-note">{item.note}</div>
              </div>
            ))}
          </div>

          <div className="main-grid">
<div
  className="panel qr-panel"
  style={
    showGuide && guideSteps[guideStep]?.id === 'qr'
      ? {
          position: 'relative',
          zIndex: 10000,
          boxShadow: '0 0 0 2px rgba(86,224,255,0.95), 0 0 24px rgba(86,224,255,0.35)',
          borderRadius: '24px',
        }
      : undefined
  }
>
                <h2 className="panel-title">{t.qrTitle}</h2>

              <div className="qr-frame">
                <div className="qr-badge-wrap">
                  <svg
                    className="qr-badge-svg"
                    viewBox="0 0 340 340"
                    aria-hidden="true"
                  >
<defs>
  <path id="topArc" d={topArcPath} />
  <path id="bottomArc" d={bottomArcPath} />
</defs>
                    <circle cx="170" cy="170" r="160" fill="#15253a" />
                    <circle cx="170" cy="170" r="150" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
                    <circle cx="170" cy="170" r="136" fill="#1b3550" />
                    <circle cx="170" cy="170" r="118" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

                    <text className="qr-badge-top-text" style={{ fontSize: `${badgeFontSize}px` }}>
                      <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                        {topText}
                      </textPath>
                    </text>

                    <text className="qr-badge-bottom-text" style={{ fontSize: `${badgeFontSize}px` }}>
                      <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                        {bottomText}
                      </textPath>
                    </text>
                  </svg>

                  <div className="qr-badge-inner-area">
                    {roundQrSrc ? (
                      <img
                        src={roundQrSrc}
                        alt="Round QR"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          borderRadius: '50%',
                          background: '#ffffff'
                        }}
                      />
                    ) : (
<div
  style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  }}
>
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <img
      src={roundQrImage}
      alt="Round QR"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        borderRadius: '50%',
        background: '#ffffff',
      }}
    />
    <div
      ref={qrRef}
      style={{
        position: 'absolute',
        width: '72%',
        height: '72%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '12px',
        background: '#ffffff',
      }}
    />
  </div>
</div>
)}
                  </div>
                </div>
              </div>

<button
  type="button"
  className="join-button"
  onClick={goJoin}
  disabled={eventStatus === 'draft' || eventStatus === 'closed'}
>
  {t.openJoin}
</button>

<div className="artist-logo-wrap">
  <div className="artist-logo-box">
    {eventData.artistLogo ? (
      <img
        src={eventData.artistLogo}
        alt="Artist logo"
        className="artist-logo-image"
      />
    ) : (
      <div className="artist-logo-placeholder">{t.noLogo}</div>
    )}
  </div>
</div>

<div className="short-link-box">
  <div className="short-link-label">{t.qrTarget}</div>
  <div className="short-link-value">{`https://codetone.codenxt.global/join/${eventData.eventCode}?lang=${lang}`}</div>
</div>

<div className="event-type-box">
  <div className="event-type-label">{t.arrangementType}</div>
  <div className="event-type-value">
    {eventData.selectedTypes && eventData.selectedTypes.length > 0
      ? eventData.selectedTypes.join(', ')
      : t.noArrangementType}
  </div>
</div>

<div className="customer-box">
  <div className="customer-label">{t.customer}</div>
  <div className="customer-value">
    {eventData.customerName || t.notAvailable}
    <br />
    {eventData.email || t.noEmail}
    <br />
    {eventData.phone || t.noPhone}
  </div>
</div>
</div>
<div
  className="panel"
  style={
    showGuide && guideSteps[guideStep]?.id === 'actions'
      ? {
          position: 'relative',
          zIndex: 10000,
          boxShadow: '0 0 0 2px rgba(86,224,255,0.95), 0 0 24px rgba(86,224,255,0.35)',
          borderRadius: '24px',
        }
      : undefined
  }
>
                <h2 className="panel-title">{t.controlActions}</h2>
              <p className="panel-text">{t.grouped}</p>

              <div className="action-section">
                <div className="action-section-label">{t.eventControl}</div>

                <div className="actions-grid">
<button
  type="button"
  className={`action-button ${screenLive ? 'live' : ''}`}
onClick={() => {
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem('codenxt_event') || '{}');
    } catch {
      return {};
    }
  })();

const rawVideoUrl = eventData?.screenVideoUrl || saved?.screenVideoUrl;

const videoUrl = rawVideoUrl
  ? rawVideoUrl.startsWith('http')
    ? rawVideoUrl
    : `${API_BASE}${rawVideoUrl}`
  : '';
  if (!videoUrl) {
    alert('No screen video ready');
    return;
  }

  const screenWin = window.open('', 'codeNxtScreenWindow', 'width=1280,height=900');

  if (!screenWin) {
    alert('Popup blocked');
    return;
  }

  screenWin.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>codeNXT Screen</title>
        <meta charset="utf-8" />
        <style>
          html, body {
            margin: 0;
            width: 100%;
            height: 100%;
            background: #000;
            overflow: hidden;
            font-family: Arial, sans-serif;
          }

          body {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }

          .screen-root {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
          }

          .countdown-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            text-align: center;
          }

          .countdown-number {
            font-size: 180px;
            font-weight: 700;
            line-height: 1;
          }

          .video-wrap {
            position: absolute;
            inset: 0;
            display: none;
            align-items: center;
            justify-content: center;
            background: #000;
          }

          .video-wrap video {
            position: absolute;
            inset: 0;
            width: 100vw;
            height: 100vh;
            object-fit: contain;
            object-position: center center;
            background: #000;
          }
.screen-instruction {
  position: absolute;
  top: 28px;
  left: 28px;
  right: 28px;
  z-index: 10;
  padding: 22px 26px;
  border-radius: 22px;
  border: 1px solid rgba(86,224,255,0.35);
  background: rgba(0,0,0,0.72);
  box-shadow: 0 0 30px rgba(86,224,255,0.22);
  text-align: center;
}

.screen-instruction-title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.screen-instruction-text {
  margin-top: 8px;
  font-size: 16px;
  opacity: 0.78;
}

.fullscreen-button {
  margin-top: 14px;
  padding: 12px 22px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(90deg, #56e0ff 0%, #3b82f6 100%);
  color: #041018;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.08em;
  cursor: pointer;
}
          </style>
      </head>
      <body>
        <div class="screen-root">
<div id="screenInstruction" class="screen-instruction">
  <div class="screen-instruction-title">THIS IS THE SCREEN WINDOW</div>
  <div class="screen-instruction-text">Drag this window to the projector or external display.</div>
  <button id="fullscreenButton" class="fullscreen-button">GO FULLSCREEN</button>
</div>
          <div id="countdownWrap" class="countdown-wrap">
            <div id="countdownNumber" class="countdown-number">10</div>
          </div>

          <div id="videoWrap" class="video-wrap">
            <video id="screenVideo" playsinline preload="auto"></video>
          </div>
        </div>
      </body>
    </html>
  `);
  screenWin.document.close();

  const countdownWrap = screenWin.document.getElementById('countdownWrap');
  const countdownNumber = screenWin.document.getElementById('countdownNumber');
  const videoWrap = screenWin.document.getElementById('videoWrap');
  const video = screenWin.document.getElementById('screenVideo');
const screenInstruction = screenWin.document.getElementById('screenInstruction');
const fullscreenButton = screenWin.document.getElementById('fullscreenButton');

if (fullscreenButton) {
  fullscreenButton.addEventListener('click', async () => {
    try {
      await screenWin.document.documentElement.requestFullscreen();
      if (screenInstruction) screenInstruction.style.display = 'none';
    } catch (err) {
      console.error('FULLSCREEN ERROR:', err);
    }
  });
}
  let countdown = 10;

  const timer = setInterval(async () => {
    if (!screenWin || screenWin.closed) {
      clearInterval(timer);
      return;
    }

    if (countdown > 0) {
      countdownNumber.textContent = String(countdown);
      countdown -= 1;
      return;
    }

    if (countdown === 0) {
      countdownNumber.textContent = 'SCAN';
      countdown = -1;
      return;
    }

    clearInterval(timer);

    countdownWrap.style.display = 'none';
    videoWrap.style.display = 'flex';

    video.src = videoUrl;
    video.controls = false;
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;

try {
  await video.play();
  setScreenLive(true);
} catch (err) {
  console.error('VIDEO PLAY ERROR:', err);
  setScreenLive(true);
}
  }, 1000);
}}
  disabled={eventStatus !== 'live'}
  style={
    showMode && eventStatus === 'live' && !screenLive
      ? {
          transform: 'scale(1.06)',
          boxShadow: '0 0 0 2px rgba(86,224,255,0.95), 0 0 24px rgba(86,224,255,0.45)',
          border: '1px solid rgba(86,224,255,0.95)',
        }
      : undefined
  }
>
                        <span className="action-title">{t.sendToScreen}</span>
                    <span className="action-note">{t.sendToScreenNote}</span>
                  </button>

<button
  type="button"
  className={`action-button ${screenLive ? 'warn' : ''}`}
onClick={() => {
  console.log("STOP SCREEN CLICKED");

  const screenWin = window.open("", "codeNxtScreenWindow");
  if (screenWin && !screenWin.closed) {
    screenWin.close();
  }

  setScreenLive(false);

  setEventData((prev) => ({
    ...prev,
    screenVideoUrl: "",
  }));

const savedRaw = localStorage.getItem("codenxt_event");
if (savedRaw) {
  const saved = JSON.parse(savedRaw);
  saved.screenVideoUrl = "";
  localStorage.setItem("codenxt_event", JSON.stringify(saved));
}
}}
  style={
    showMode && screenLive
      ? {
          transform: 'scale(1.06)',
          boxShadow: '0 0 0 2px rgba(255,170,120,0.95), 0 0 24px rgba(255,170,120,0.35)',
          border: '1px solid rgba(255,170,120,0.95)',
        }
      : undefined
  }
>
                      <span className="action-title">{t.stopScreen}</span>
                    <span className="action-note">{t.stopScreenNote}</span>
                  </button>
                </div>
              </div>

<div
  className="action-section"
  style={showMode ? { display: 'none' } : undefined}
>
  <div className="action-section-label">{t.utility}</div>
  <div className="actions-grid">
    <button type="button" className="action-button" onClick={handlePrintQr}>
      <span className="action-title">{t.printQr}</span>
      <span className="action-note">{t.printQrNote}</span>
    </button>

    <button type="button" className="action-button" onClick={handleSendReport}>
      <span className="action-title">{t.sendReport}</span>
      <span className="action-note">{t.sendReportNote}</span>
    </button>
  </div>
</div>
<button type="button" className="action-button" onClick={handleDownloadCSV}>
  <span className="action-title">DOWNLOAD CSV</span>
  <span className="action-note">Download scans and InnerCircle data</span>
</button>
<div
  className="system-note"
  style={{
    ...(showMode ? { display: 'none' } : {}),
    ...(showGuide && guideSteps[guideStep]?.id === 'reward'
      ? {
          position: 'relative',
          zIndex: 10000,
          boxShadow: '0 0 0 2px rgba(86,224,255,0.95), 0 0 24px rgba(86,224,255,0.35)',
          borderRadius: '24px',
        }
      : {})
  }}
>
<h3 className="system-note-title">Reward Control</h3>
<p className="system-note-text">
  Define what the audience gets — and when they get it.
</p>

<div
  style={{
    marginTop: 14,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.25fr) minmax(220px, 0.75fr)',
    gap: 16,
    alignItems: 'start',
  }}
>
  <div>
    <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1, marginBottom: 8 }}>
      FILE TYPE
    </div>

    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {['image', 'pdf', 'audio', 'video'].map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => setSelectedRewardType(type)}
          style={{
            padding: '8px 12px',
            borderRadius: 999,
            border: selectedRewardType === type
              ? '1px solid #00f0ff'
              : '1px solid rgba(255,255,255,0.15)',
            background: selectedRewardType === type
              ? 'linear-gradient(180deg, #00f0ff 0%, #00c8d8 100%)'
              : 'rgba(255,255,255,0.04)',
            boxShadow: selectedRewardType === type
              ? '0 0 12px rgba(0,240,255,0.6), 0 0 30px rgba(0,240,255,0.25)'
              : 'none',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            cursor: 'pointer'
          }}
        >
          {type.toUpperCase()}
        </button>
      ))}
    </div>

    <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1, marginTop: 14, marginBottom: 8 }}>
      FILE
    </div>

    <input
      type="file"
      accept="image/*,application/pdf,audio/*,video/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          setSelectedFile(file);
        }
      }}
      style={{
        color: '#fff',
        fontSize: 11,
        opacity: 0.8
      }}
    />

    <div
      style={{
        marginTop: 6,
        fontSize: 11,
        color: 'rgba(255,255,255,0.58)',
        letterSpacing: 0.3,
      }}
    >
      Max file size: 20 MB
    </div>

    <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1, marginTop: 14, marginBottom: 8 }}>
      ACCESS
    </div>

    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {['moment', 'souvenir'].map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => setSelectedAccessMode(mode)}
          style={{
            padding: '8px 12px',
            borderRadius: 999,
            border: selectedAccessMode === mode
              ? '1px solid #00f0ff'
              : '1px solid rgba(255,255,255,0.15)',
            background: selectedAccessMode === mode
              ? 'linear-gradient(180deg, #00f0ff 0%, #00c8d8 100%)'
              : 'rgba(255,255,255,0.04)',
            boxShadow: selectedAccessMode === mode
              ? '0 0 12px rgba(0,240,255,0.6), 0 0 30px rgba(0,240,255,0.25)'
              : 'none',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            cursor: 'pointer'
          }}
        >
          {mode === 'moment' ? 'MOMENT' : 'SOUVENIR'}
        </button>
      ))}
    </div>

    <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        type="button"
        onClick={handleUploadReward}
        disabled={!selectedRewardType || !selectedAccessMode || eventStatus === 'closed'}
        style={{
          padding: '10px 14px',
          borderRadius: 14,
          border: rewardUploaded
            ? '1px solid #00f0ff'
            : '1px solid rgba(255,255,255,0.15)',
          background: rewardUploaded
            ? 'linear-gradient(180deg, #00f0ff 0%, #00c8d8 100%)'
            : 'rgba(255,255,255,0.04)',
          boxShadow: rewardUploaded
            ? '0 0 12px rgba(0,240,255,0.6), 0 0 30px rgba(0,240,255,0.25)'
            : 'none',
          color: '#fff',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.6,
          cursor: (!selectedRewardType || !selectedAccessMode || eventStatus === 'closed')
            ? 'not-allowed'
            : 'pointer',
          opacity: (!selectedRewardType || !selectedAccessMode || eventStatus === 'closed') ? 0.55 : 1,
        }}
      >
        {rewardUploaded ? t.rewardUploaded : t.uploadReward}
      </button>



      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: 0.4,
        }}
      >
        {unlockStatusText}
      </div>
    </div>
  </div>

  <div
    style={{
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 16,
      padding: '14px 14px 12px',
      minHeight: 210,
    }}
  >
<div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1, marginBottom: 10 }}>
  QUICK GUIDE (SETUP)
</div>

<div style={{ display: 'grid', gap: 8, fontSize: 12, lineHeight: 1.45, color: '#fff' }}>
  <div>1. Check that status shows READY at the top</div>
  <div>2. Select FILE TYPE</div>
  <div>3. Choose reward file </div>
  <div>4. Choose access mode (MOMENT / SOUVENIR)</div>
  <div>5. Save reward</div>
</div>


    {(selectedRewardType || selectedAccessMode) && (
      <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1 }}>
          TYPE
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1,
            color: '#ffffff',
            marginBottom: 8,
            marginTop: 4,
          }}
        >
          {selectedRewardType ? selectedRewardType.toUpperCase() : '—'}
        </div>

        <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1 }}>
          ACCESS
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1,
            color: selectedAccessMode === 'moment' ? '#00f0ff' : '#7ffcff',
            marginBottom: 8,
            marginTop: 4,
          }}
        >
          {selectedAccessMode === 'moment'
            ? 'MOMENT'
            : selectedAccessMode === 'souvenir'
              ? 'SOUVENIR'
              : '—'}
        </div>

        <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1 }}>
          EXPERIENCE
        </div>

        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            color: '#ffffff',
            marginTop: 4,
          }}
        >
          {selectedAccessMode === 'moment'
            ? 'DIGITAL MOMENT'
            : selectedAccessMode === 'souvenir'
              ? 'DIGITAL SOUVENIR'
              : '—'}
        </div>
      </div>
    )}
  </div>
</div>
</div>
                            {eventData.comment ? (
                <div className="system-note">
                  <h3 className="system-note-title">{t.customerNote}</h3>
                  <p className="system-note-text">{eventData.comment}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {showGuide && guideSteps[guideStep] && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.72)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}
  >
    <div
      style={{
        width: '100%',
        maxWidth: '560px',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(10, 12, 18, 0.96)',
        boxShadow: '0 20px 80px rgba(0,0,0,0.45)',
        padding: '28px',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          marginBottom: '12px',
        }}
      >
        Quick Operator Guide
      </div>

      <h2
        style={{
          margin: '0 0 14px 0',
          fontSize: '28px',
          lineHeight: 1.1,
          fontWeight: 700,
        }}
      >
        {guideSteps[guideStep].title}
      </h2>

      <p
        style={{
          margin: 0,
          fontSize: '16px',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.82)',
        }}
      >
        {guideSteps[guideStep].body}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginTop: '24px',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          Step {guideStep + 1} of {guideSteps.length}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {guideStep > 0 && (
            <button
              type="button"
              onClick={previousGuideStep}
              style={{
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'transparent',
                color: '#ffffff',
                padding: '10px 16px',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          )}

          <button
            type="button"
            onClick={closeGuide}
            style={{
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'transparent',
              color: '#ffffff',
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            Skip
          </button>

          <button
            type="button"
            onClick={nextGuideStep}
            style={{
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(90deg, #56e0ff 0%, #3b82f6 100%)',
              color: '#041018',
              fontWeight: 700,
              padding: '10px 18px',
              cursor: 'pointer',
            }}
          >
            {guideStep === guideSteps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}
  
