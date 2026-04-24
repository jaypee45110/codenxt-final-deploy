import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCodeStyling from 'qr-code-styling';
import { getLang } from '../i18n';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const qrInstanceRef = useRef(null);

  const [lang, setLangState] = useState(getLang());
  const [eventStatus, setEventStatus] = useState('ready');
  const [rewardUploaded, setRewardUploaded] = useState(false);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);
  const [screenLive, setScreenLive] = useState(false);

  const [eventData, setEventData] = useState({
    artistName: 'Artist / Event Name',
    venue: 'Venue Name',
    city: 'City',
    eventDate: '2026-07-02',
    eventCode: 'CT-48392',
    shortLink: 'https://codetone.codenxt.global/join/CT-48392?lang=en',
    artistLogo: '',
    customerName: '',
    email: '',
    phone: '',
    audienceSize: '',
    selectedTypes: [],
    comment: '',
  });

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
      estimated: 'Estimated audience from checkout',
      scanCount: 'Placeholder live scan count',
      scanRatio: 'Placeholder audience-to-scan ratio',
      joinCount: 'Placeholder joined audience count',
      qrTitle: 'codeTone QR',
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
      uploadReward: 'Upload reward',
      rewardUploaded: 'Reward uploaded',
      uploadRewardNote: 'Store the live reward that Open now will reveal.',
      rewardUploadedNote: 'A reward is now stored and ready for the join flow.',
      unlockReward: 'Unlock reward',
      rewardUnlocked: 'Reward unlocked',
      unlockRewardNote: 'Open access to the audience at the chosen moment.',
      sendToScreen: 'Send to screen',
      sendToScreenNote: 'Push QR prompt and event access to the big screen.',
      stopScreen: 'Stop screen',
      stopScreenNote: 'Remove the on-screen QR call to action.',
      printQr: 'Print QR code',
      printQrNote: 'Generate a printable version for venue use.',
      sendReport: 'Send report',
      sendReportNote: 'Email a simple summary after the activation.',
      operationalNote: 'Operational note',
      operationalNoteText: 'The QR stays real and scannable. Artist and venue now live in the ring, not inside the code.',
      customerNote: 'Customer note',
      draft: 'Draft',
      ready: 'Ready',
      live: 'Live',
      closed: 'Closed',
      openJoin: 'Open join page',
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
        eventCode: stateData.eventCode || prev.eventCode,
        shortLink: `https://codetone.codenxt.global/join/${stateData.eventCode || prev.eventCode}?lang=${lang}`,
        artistLogo: stateData.artistLogo || prev.artistLogo,
        customerName: stateData.customerName || prev.customerName,
        email: stateData.email || prev.email,
        phone: stateData.phone || prev.phone,
        audienceSize: stateData.audienceSize || prev.audienceSize,
        selectedTypes: stateData.selectedTypes || prev.selectedTypes,
        comment: stateData.comment || prev.comment,
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
        eventCode: saved?.eventCode || prev.eventCode,
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
    const rewardRaw = localStorage.getItem('codenxt_reward');
    if (rewardRaw) {
      setRewardUploaded(true);
    }
  }, []);

  useEffect(() => {
    if (!qrRef.current) return;

    const joinUrl = `https://codetone.codenxt.global/join/${eventData.eventCode}?lang=${lang}`;

    const qrOptions = {
      width: 176,
      height: 176,
      type: 'svg',
      data: joinUrl,
      margin: 10,
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
  }, [lang]);

  const stats = useMemo(() => {
    return [
      {
        label: t.tickets,
        value: eventData.audienceSize || '—',
        note: t.estimated,
      },
      {
        label: t.totalScans,
        value: '7,286',
        note: t.scanCount,
      },
      {
        label: t.scanRate,
        value: '39.6%',
        note: t.scanRatio,
      },
      {
        label: t.joins,
        value: '2,184',
        note: t.joinCount,
      },
    ];
  }, [eventData.audienceSize, t]);

  const statusLabel =
    eventStatus === 'draft'
      ? t.draft
      : eventStatus === 'ready'
      ? t.ready
      : eventStatus === 'live'
      ? t.live
      : t.closed;

  const handleUploadReward = () => {
    const demoReward = {
      type: 'video',
      title: 'Exclusive after-show drop',
      description: 'Demo reward tied to the event dashboard.',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      eventCode: eventData.eventCode,
      artistName: eventData.artistName,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('codenxt_reward', JSON.stringify(demoReward));
    setRewardUploaded(true);
  };

  const topText = (eventData.artistName || 'Artist / Event Name').toUpperCase();
  const bottomText = `${eventData.venue || 'Venue Name'} • ${eventData.city || 'City'}`.toUpperCase();

  const goJoin = () => {
    navigate(`/join/${eventData.eventCode}?lang=${lang}`);
  };

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

        .status-button.active {
          background: #00f0ff;
          color: #000;
          border-color: transparent;
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
          min-height: 62px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: #fff;
          padding: 14px;
          text-align: left;
          cursor: pointer;
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
            <LanguageSwitcher lang={lang} onChange={setLangState} />

            <img
              src="/codetone-logo.webp"
              alt="codeTone logo"
              className="dashboard-logo"
            />
            <div className="dashboard-kicker">{t.kicker}</div>
            <h1 className="dashboard-title">{t.title}</h1>
            <p className="dashboard-subtitle">{t.subtitle}</p>
          </div>

          <div className="summary-card">
            <div className="summary-left">
              <div className={`status-pill ${eventStatus}`}>{statusLabel}</div>
              <h2 className="event-name">{eventData.artistName}</h2>

              <div className="event-meta-grid">
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
              <div className="status-switcher">
                <button className={`status-button ${eventStatus === 'draft' ? 'active' : ''}`} onClick={() => setEventStatus('draft')} type="button">{t.draft}</button>
                <button className={`status-button ${eventStatus === 'ready' ? 'active' : ''}`} onClick={() => setEventStatus('ready')} type="button">{t.ready}</button>
                <button className={`status-button ${eventStatus === 'live' ? 'active' : ''}`} onClick={() => setEventStatus('live')} type="button">{t.live}</button>
                <button className={`status-button ${eventStatus === 'closed' ? 'active' : ''}`} onClick={() => setEventStatus('closed')} type="button">{t.closed}</button>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map((item) => (
              <div key={item.label} className="stat-card">
                <div className="stat-label">{item.label}</div>
                <div className="stat-value">{item.value}</div>
                <div className="stat-note">{item.note}</div>
              </div>
            ))}
          </div>

          <div className="main-grid">
            <div className="panel qr-panel">
              <h2 className="panel-title">{t.qrTitle}</h2>

              <div className="qr-frame">
                <div className="qr-badge-wrap">
                  <svg
                    className="qr-badge-svg"
                    viewBox="0 0 340 340"
                    aria-hidden="true"
                  >
                    <defs>
                      <path id="topArc" d="M 52 170 A 118 118 0 0 1 288 170" />
                      <path id="bottomArc" d="M 288 170 A 118 118 0 0 1 52 170" />
                    </defs>

                    <circle cx="170" cy="170" r="160" fill="#15253a" />
                    <circle cx="170" cy="170" r="150" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
                    <circle cx="170" cy="170" r="136" fill="#1d3350" />
                    <circle cx="170" cy="170" r="118" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

                    <circle cx="48" cy="112" r="6" fill="rgba(255,255,255,0.82)" />
                    <circle cx="292" cy="228" r="6" fill="rgba(255,255,255,0.82)" />

                    <text className="qr-badge-top-text">
                      <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                        {topText}
                      </textPath>
                    </text>

                    <text className="qr-badge-bottom-text">
                      <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                        {bottomText}
                      </textPath>
                    </text>
                  </svg>

                  <div className="qr-badge-inner-area">
                    <div className="qr-render" ref={qrRef} />
                  </div>
                </div>
              </div>

              <button type="button" className="join-button" onClick={goJoin}>
                {t.openJoin}
              </button>

              <div className="artist-logo-wrap">
                <div className="artist-logo-label">{t.artistLogo}</div>
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

            <div className="panel">
              <h2 className="panel-title">{t.controlActions}</h2>
              <p className="panel-text">{t.grouped}</p>

              <div className="action-section">
                <div className="action-section-label">{t.eventControl}</div>

                <div className="actions-grid">
                  <button
                    type="button"
                    className={`action-button ${rewardUploaded ? 'live' : 'primary'}`}
                    onClick={handleUploadReward}
                  >
                    <span className="action-title">
                      {rewardUploaded ? t.rewardUploaded : t.uploadReward}
                    </span>
                    <span className="action-note">
                      {rewardUploaded ? t.rewardUploadedNote : t.uploadRewardNote}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`action-button ${rewardUnlocked ? 'live' : ''}`}
                    onClick={() => {
                      setRewardUnlocked((prev) => !prev);
                      if (!rewardUnlocked) setEventStatus('live');
                    }}
                  >
                    <span className="action-title">
                      {rewardUnlocked ? t.rewardUnlocked : t.unlockReward}
                    </span>
                    <span className="action-note">{t.unlockRewardNote}</span>
                  </button>

                  <button
                    type="button"
                    className={`action-button ${screenLive ? 'live' : ''}`}
                    onClick={() => setScreenLive(true)}
                  >
                    <span className="action-title">{t.sendToScreen}</span>
                    <span className="action-note">{t.sendToScreenNote}</span>
                  </button>

                  <button
                    type="button"
                    className={`action-button ${screenLive ? 'warn' : ''}`}
                    onClick={() => setScreenLive(false)}
                  >
                    <span className="action-title">{t.stopScreen}</span>
                    <span className="action-note">{t.stopScreenNote}</span>
                  </button>
                </div>
              </div>

              <div className="action-section">
                <div className="action-section-label">{t.utility}</div>
                <div className="actions-grid">
                  <button type="button" className="action-button">
                    <span className="action-title">{t.printQr}</span>
                    <span className="action-note">{t.printQrNote}</span>
                  </button>

                  <button type="button" className="action-button">
                    <span className="action-title">{t.sendReport}</span>
                    <span className="action-note">{t.sendReportNote}</span>
                  </button>
                </div>
              </div>

              <div className="system-note">
                <h3 className="system-note-title">{t.operationalNote}</h3>
                <p className="system-note-text">{t.operationalNoteText}</p>
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
    </>
  );
}