import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

function JoinPage({ lang: routeLang }) {
  const { eventCode } = useParams();

  const [lang, setLang] = useState(routeLang || 'en');
  const [eventData, setEventData] = useState(null);
  const [rewardData, setRewardData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [joinState, setJoinState] = useState('idle');
  const [fanName, setFanName] = useState('');
  const [fanEmail, setFanEmail] = useState('');
  const [fanPhone, setFanPhone] = useState('');
  const [showGdprModal, setShowGdprModal] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const copy = {
    en: {
      kicker: 'Reward',
      titleFallback: 'Reward access',
      subtitleLoading: 'Looking up event access...',
      subtitleReady:
        'Exclusive access connected to this event.',
      subtitleNotFound:
        'This event code could not be found on this device right now.',
      eventCode: 'Event Code',
      venue: 'Venue',
      city: 'City',
      date: 'Date',
      customer: 'Customer',
      arrangementType: 'Arrangement type',
      noArrangementType: 'No arrangement type selected',
      accessStatus: 'Access status',
      accessReady: 'Ready',
      accessNotFound: 'Event not found',
      accessLoading: 'Loading',
      formTitle: 'JOIN THE INNERCIRCLE',
      formText:
        'This is the audience-facing entry point connected to the event QR. In the next phase, this can capture fans, gate content, and trigger timed drops.',
      name: 'Your name',
      email: 'Email',
      phone: 'Phone',
      enterName: 'Your name',
      enterEmail: 'name@email.com',
      enterPhone: '+47 900 00 000',
      joinNow: 'JOIN THE INNERCIRCLE',
      joinedTitle: 'Access registered',
      joinedText:
        'Your join has been registered on this device. This is where the real join-flow, reward release, and live access logic can continue.',
      systemTitle: 'System note',
      systemText:
        'At this stage, the join page is connected to the event code and local event data. Next step can be fan capture, reward unlock logic, and event-aware content.',
      noCustomer: 'Not available',
      notFoundTitle: 'Event not found',
      notFoundText:
        'This join link is valid in structure, but no matching event data was found locally on this device yet.',
      loadingTitle: 'Loading event',
      loadingText: 'Checking local event data and preparing access view...',
      rewardVideo: 'Video reward',
      rewardAudio: 'Audio reward',
      rewardFile: 'File reward',
      openReward: 'Open reward',
      gdprTitle: 'GDPR consent',
      gdprText:
        'I consent to being registered as part of this event’s InnerCircle join statistics and reporting. My participation may be counted in the event report.',
      gdprCheck:
        'I give permission to register this join in the event report.',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    no: {
      kicker: 'Reward',
      titleFallback: 'Reward-tilgang',
      subtitleLoading: 'Ser etter eventtilgang...',
      subtitleReady:
        'Eksklusiv tilgang koblet til dette eventet.',
      subtitleNotFound:
        'Denne eventkoden ble ikke funnet på denne enheten akkurat nå.',
      eventCode: 'Eventkode',
      venue: 'Venue',
      city: 'By',
      date: 'Dato',
      customer: 'Kunde',
      arrangementType: 'Arrangementstype',
      noArrangementType: 'Ingen arrangementstype valgt',
      accessStatus: 'Tilgangsstatus',
      accessReady: 'Klar',
      accessNotFound: 'Event ikke funnet',
      accessLoading: 'Laster',
      formTitle: 'JOIN THE INNERCIRCLE',
      formText:
        'Dette er publikums inngangspunkt koblet til eventens QR. I neste fase kan denne samle fans, styre tilgang og trigge tidsstyrte drops.',
      name: 'Ditt navn',
      email: 'E-post',
      phone: 'Telefon',
      enterName: 'Ditt navn',
      enterEmail: 'navn@epost.no',
      enterPhone: '+47 900 00 000',
      joinNow: 'JOIN THE INNERCIRCLE',
      joinedTitle: 'Tilgang registrert',
      joinedText:
        'Denne joinen er registrert på denne enheten. Her kan ekte join-flow, reward release og live access-logikk bygges videre.',
      systemTitle: 'Systemnotat',
      systemText:
        'På dette nivået er join-siden koblet til eventkode og lokal eventdata. Neste steg kan være fan capture, unlock-logikk og eventstyrt innhold.',
      noCustomer: 'Ikke tilgjengelig',
      notFoundTitle: 'Event ikke funnet',
      notFoundText:
        'Denne join-lenken er riktig bygget, men ingen matchende eventdata ble funnet lokalt på denne enheten ennå.',
      loadingTitle: 'Laster event',
      loadingText: 'Sjekker lokal eventdata og klargjør tilgangsvisning...',
      rewardVideo: 'Videoreward',
      rewardAudio: 'Lydreward',
      rewardFile: 'Filreward',
      openReward: 'Åpne reward',
      gdprTitle: 'GDPR-samtykke',
      gdprText:
        'Jeg samtykker til å bli registrert som del av dette eventets InnerCircle-statistikk og rapportering. Min deltakelse kan telles i sluttrapporten.',
      gdprCheck:
        'Jeg gir tillatelse til at denne joinen registreres i eventrapporten.',
      cancel: 'Avbryt',
      confirm: 'Bekreft',
    },
    sv: {
      kicker: 'Reward',
      titleFallback: 'Reward-åtkomst',
      subtitleLoading: 'Söker efter eventåtkomst...',
      subtitleReady:
        'Exklusiv åtkomst kopplad till detta event.',
      subtitleNotFound:
        'Den här eventkoden kunde inte hittas på den här enheten just nu.',
      eventCode: 'Eventkod',
      venue: 'Venue',
      city: 'Stad',
      date: 'Datum',
      customer: 'Kund',
      arrangementType: 'Typ av arrangemang',
      noArrangementType: 'Ingen typ vald',
      accessStatus: 'Åtkomststatus',
      accessReady: 'Klar',
      accessNotFound: 'Event hittades inte',
      accessLoading: 'Laddar',
      formTitle: 'JOIN THE INNERCIRCLE',
      formText:
        'Det här är publikens ingångspunkt kopplad till eventets QR. I nästa fas kan den samla fans, styra tillgång och trigga tidsstyrda drops.',
      name: 'Ditt namn',
      email: 'E-post',
      phone: 'Telefon',
      enterName: 'Ditt namn',
      enterEmail: 'namn@email.com',
      enterPhone: '+47 900 00 000',
      joinNow: 'JOIN THE INNERCIRCLE',
      joinedTitle: 'Åtkomst registrerad',
      joinedText:
        'Din join har registrerats på den här enheten. Här kan det riktiga join-flödet, reward release och live access-logiken byggas vidare.',
      systemTitle: 'Systemnotis',
      systemText:
        'På denna nivå är join-sidan kopplad till eventkod och lokal eventdata. Nästa steg kan vara fan capture, unlock-logik och eventstyrt innehåll.',
      noCustomer: 'Inte tillgänglig',
      notFoundTitle: 'Event hittades inte',
      notFoundText:
        'Den här join-länken är korrekt uppbyggd, men ingen matchande eventdata hittades lokalt på den här enheten ännu.',
      loadingTitle: 'Laddar event',
      loadingText: 'Kontrollerar lokal eventdata och förbereder åtkomstvy...',
      rewardVideo: 'Videoreward',
      rewardAudio: 'Ljudreward',
      rewardFile: 'Filreward',
      openReward: 'Öppna reward',
      gdprTitle: 'GDPR-samtycke',
      gdprText:
        'Jag samtycker till att registreras som en del av detta events InnerCircle-statistik och rapportering. Mitt deltagande kan räknas i slutrapporten.',
      gdprCheck:
        'Jag ger tillstånd att registrera denna join i eventrapporten.',
      cancel: 'Avbryt',
      confirm: 'Bekräfta',
    },
    de: {
      kicker: 'Reward',
      titleFallback: 'Reward-Zugang',
      subtitleLoading: 'Event-Zugang wird gesucht...',
      subtitleReady:
        'Exklusiver Zugang, verbunden mit diesem Event.',
      subtitleNotFound:
        'Dieser Event-Code konnte auf diesem Gerät im Moment nicht gefunden werden.',
      eventCode: 'Event-Code',
      venue: 'Venue',
      city: 'Stadt',
      date: 'Datum',
      customer: 'Kunde',
      arrangementType: 'Veranstaltungstyp',
      noArrangementType: 'Kein Veranstaltungstyp gewählt',
      accessStatus: 'Zugriffsstatus',
      accessReady: 'Bereit',
      accessNotFound: 'Event nicht gefunden',
      accessLoading: 'Lädt',
      formTitle: 'JOIN THE INNERCIRCLE',
      formText:
        'Dies ist der publikumsseitige Einstiegspunkt, der mit dem Event-QR verbunden ist. In der nächsten Phase kann hier Fan-Capture, Zugangskontrolle und zeitgesteuerte Drops stattfinden.',
      name: 'Dein Name',
      email: 'E-Mail',
      phone: 'Telefon',
      enterName: 'Dein Name',
      enterEmail: 'name@email.com',
      enterPhone: '+47 900 00 000',
      joinNow: 'JOIN THE INNERCIRCLE',
      joinedTitle: 'Zugang registriert',
      joinedText:
        'Dein Join wurde auf diesem Gerät registriert. Hier kann die echte Join-Logik, Reward-Freigabe und Live-Access-Logik weitergeführt werden.',
      systemTitle: 'Systemhinweis',
      systemText:
        'Auf diesem Stand ist die Join-Seite mit Event-Code und lokalen Eventdaten verbunden. Nächster Schritt kann Fan-Capture, Unlock-Logik und eventbezogener Content sein.',
      noCustomer: 'Nicht verfügbar',
      notFoundTitle: 'Event nicht gefunden',
      notFoundText:
        'Dieser Join-Link ist strukturell korrekt, aber auf diesem Gerät wurden noch keine passenden Eventdaten gefunden.',
      loadingTitle: 'Event wird geladen',
      loadingText: 'Lokale Eventdaten werden geprüft und die Zugriffsansicht vorbereitet...',
      rewardVideo: 'Video-Reward',
      rewardAudio: 'Audio-Reward',
      rewardFile: 'Datei-Reward',
      openReward: 'Reward öffnen',
      gdprTitle: 'GDPR-Einwilligung',
      gdprText:
        'Ich willige ein, als Teil der InnerCircle-Statistik und Berichterstattung dieses Events registriert zu werden. Meine Teilnahme kann im Abschlussbericht gezählt werden.',
      gdprCheck:
        'Ich erteile die Erlaubnis, diesen Join im Eventbericht zu registrieren.',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
    },
    th: {
      kicker: 'Reward',
      titleFallback: 'เข้าถึง Reward',
      subtitleLoading: 'กำลังค้นหาการเข้าถึงอีเวนต์...',
      subtitleReady:
        'สิทธิ์เข้าถึงพิเศษที่เชื่อมกับอีเวนต์นี้',
      subtitleNotFound:
        'ไม่พบรหัสอีเวนต์นี้บนอุปกรณ์เครื่องนี้ในขณะนี้',
      eventCode: 'รหัสอีเวนต์',
      venue: 'Venue',
      city: 'เมือง',
      date: 'วันที่',
      customer: 'ลูกค้า',
      arrangementType: 'ประเภทงาน',
      noArrangementType: 'ยังไม่ได้เลือกประเภทงาน',
      accessStatus: 'สถานะการเข้าถึง',
      accessReady: 'พร้อม',
      accessNotFound: 'ไม่พบอีเวนต์',
      accessLoading: 'กำลังโหลด',
      formTitle: 'JOIN THE INNERCIRCLE',
      formText:
        'นี่คือจุดเข้าของผู้ชมที่เชื่อมกับ QR ของอีเวนต์ ในเฟสถัดไป หน้านี้สามารถใช้เก็บข้อมูลแฟน ควบคุมการเข้าถึง และปล่อยดรอปตามเวลาได้',
      name: 'ชื่อของคุณ',
      email: 'อีเมล',
      phone: 'โทรศัพท์',
      enterName: 'ชื่อของคุณ',
      enterEmail: 'name@email.com',
      enterPhone: '+47 900 00 000',
      joinNow: 'JOIN THE INNERCIRCLE',
      joinedTitle: 'ลงทะเบียนแล้ว',
      joinedText:
        'การ join นี้ถูกบันทึกบนอุปกรณ์นี้แล้ว ตรงนี้สามารถต่อยอดไปสู่ join-flow จริง การปล่อย reward และ live access logic ได้',
      systemTitle: 'หมายเหตุระบบ',
      systemText:
        'ในขั้นนี้ หน้า join เชื่อมกับรหัสอีเวนต์และข้อมูลอีเวนต์ในเครื่องแล้ว ขั้นต่อไปอาจเป็น fan capture, unlock logic และเนื้อหาที่ผูกกับอีเวนต์',
      noCustomer: 'ไม่มีข้อมูล',
      notFoundTitle: 'ไม่พบอีเวนต์',
      notFoundText:
        'ลิงก์ join นี้ถูกสร้างถูกต้อง แต่ยังไม่พบข้อมูลอีเวนต์ที่ตรงกันในเครื่องนี้',
      loadingTitle: 'กำลังโหลดอีเวนต์',
      loadingText: 'กำลังตรวจสอบข้อมูลอีเวนต์ในเครื่องและเตรียมหน้าการเข้าถึง...',
      rewardVideo: 'วิดีโอรีวอร์ด',
      rewardAudio: 'ออดิโอรีวอร์ด',
      rewardFile: 'ไฟล์รีวอร์ด',
      openReward: 'เปิด reward',
      gdprTitle: 'ความยินยอม GDPR',
      gdprText:
        'ฉันยินยอมให้มีการลงทะเบียนการเข้าร่วมนี้เป็นส่วนหนึ่งของสถิติและรายงาน InnerCircle ของอีเวนต์นี้ การเข้าร่วมของฉันอาจถูกนับในรายงานสรุป',
      gdprCheck:
        'ฉันอนุญาตให้บันทึกการ join นี้ไว้ในรายงานของอีเวนต์',
      cancel: 'ยกเลิก',
      confirm: 'ยืนยัน',
    },
  };

  const t = copy[lang] || copy.en;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && copy[urlLang]) {
      setLang(urlLang);
    } else if (routeLang && copy[routeLang]) {
      setLang(routeLang);
    }
  }, [routeLang]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const logoFromUrl = params.get('logo');

    const raw = localStorage.getItem('codenxt_event');

    if (!raw && !logoFromUrl) {
      setStatus('not_found');
      return;
    }

    try {
      const saved = raw ? JSON.parse(raw) : {};

      if (saved?.eventCode === eventCode || logoFromUrl) {
        setEventData({
          ...saved,
          artistLogo: logoFromUrl || saved.artistLogo || '',
        });
        setStatus('ready');
      } else {
        setStatus('not_found');
      }
    } catch (error) {
      console.error('Could not read local event data:', error);
      setStatus('not_found');
    }
  }, [eventCode]);

  useEffect(() => {
    const rewardRaw = localStorage.getItem('codenxt_reward');
    if (!rewardRaw) return;

    try {
      const savedReward = JSON.parse(rewardRaw);
      if (!savedReward?.eventCode || savedReward.eventCode === eventCode) {
        setRewardData(savedReward);
      }
    } catch (error) {
      console.error('Could not read reward data:', error);
    }
  }, [eventCode]);

  useEffect(() => {
    if (status !== 'ready' || !eventData) return;

    const savedJoinRaw = localStorage.getItem(`codenxt_join_${eventCode}`);
    if (!savedJoinRaw) return;

    try {
      const savedJoin = JSON.parse(savedJoinRaw);
      setFanName(savedJoin?.fanName || '');
      setFanEmail(savedJoin?.fanEmail || '');
      setFanPhone(savedJoin?.fanPhone || '');
      setJoinState('joined');
    } catch (error) {
      console.error('Could not read saved join data:', error);
    }
  }, [status, eventData, eventCode]);

  const arrangementTypeText = useMemo(() => {
    if (!eventData?.selectedTypes || eventData.selectedTypes.length === 0) {
      return t.noArrangementType;
    }
    return eventData.selectedTypes.join(', ');
  }, [eventData, t.noArrangementType]);

  const rewardTypeLabel = useMemo(() => {
    if (!rewardData?.type) return '';
    if (rewardData.type === 'video') return t.rewardVideo;
    if (rewardData.type === 'audio') return t.rewardAudio;
    return t.rewardFile;
  }, [rewardData, t.rewardVideo, t.rewardAudio, t.rewardFile]);

  const registerJoin = () => {
    const payload = {
      fanName: fanName.trim(),
      fanEmail: fanEmail.trim(),
      fanPhone: fanPhone.trim(),
      eventCode,
      joinedAt: new Date().toISOString(),
      consentGiven: true,
      source: 'join_page',
    };

    try {
      localStorage.setItem(`codenxt_join_${eventCode}`, JSON.stringify(payload));
    } catch (error) {
      console.error('Could not save join data locally:', error);
    }

    try {
      const reportKey = `codenxt_report_${eventCode}`;
      const existingReportRaw = localStorage.getItem(reportKey);

      let reportData = {
        eventCode,
        innerCircleJoinCount: 0,
        joins: [],
      };

      if (existingReportRaw) {
        try {
          reportData = JSON.parse(existingReportRaw);
        } catch (error) {
          console.error('Could not parse existing report data:', error);
        }
      }

      if (!Array.isArray(reportData.joins)) {
        reportData.joins = [];
      }

      const alreadyJoined = reportData.joins.some(
        (item) =>
          item?.eventCode === eventCode &&
          item?.fanEmail === payload.fanEmail &&
          item?.fanPhone === payload.fanPhone
      );

      if (!alreadyJoined) {
        reportData.joins.push(payload);
        reportData.innerCircleJoinCount = reportData.joins.length;
      }

      localStorage.setItem(reportKey, JSON.stringify(reportData));
    } catch (error) {
      console.error('Could not store report data:', error);
    }

    setJoinState('joined');
    setShowGdprModal(false);
    setConsentChecked(false);
  };

  const handleOpenReward = () => {
    if (!rewardData?.url) return;
    window.open(rewardData.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <div style={styles.shell}>
        <div style={styles.header}>
          {eventData?.artistLogo ? (
            <div style={styles.logoWrap}>
              <img
                src={eventData.artistLogo}
                alt={eventData.artistName || 'Artist logo'}
                style={styles.logo}
              />
            </div>
          ) : (
            <div style={styles.logoFallback}>
              {eventData?.artistName || t.titleFallback}
            </div>
          )}

          <div style={styles.kicker}>{t.kicker}</div>

          <h1 style={styles.title}>
            {rewardData?.title || t.titleFallback}
          </h1>

          <p style={styles.subtitle}>
            {status === 'loading'
              ? t.subtitleLoading
              : status === 'ready'
              ? t.subtitleReady
              : t.subtitleNotFound}
          </p>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryGrid}>
            <div style={styles.metaBox}>
              <div style={styles.metaLabel}>{t.eventCode}</div>
              <div style={styles.metaValue}>{eventCode || '—'}</div>
            </div>

            <div style={styles.metaBox}>
              <div style={styles.metaLabel}>{t.venue}</div>
              <div style={styles.metaValue}>{eventData?.venue || '—'}</div>
            </div>

            <div style={styles.metaBox}>
              <div style={styles.metaLabel}>{t.city}</div>
              <div style={styles.metaValue}>{eventData?.city || '—'}</div>
            </div>

            <div style={styles.metaBox}>
              <div style={styles.metaLabel}>{t.date}</div>
              <div style={styles.metaValue}>{eventData?.eventDate || '—'}</div>
            </div>

            <div style={styles.metaBox}>
              <div style={styles.metaLabel}>{t.customer}</div>
              <div style={styles.metaValue}>
                {eventData?.customerName || t.noCustomer}
              </div>
            </div>

            <div style={styles.metaBox}>
              <div style={styles.metaLabel}>{t.arrangementType}</div>
              <div style={styles.metaValue}>{arrangementTypeText}</div>
            </div>

            <div style={styles.metaBoxWide}>
              <div style={styles.metaLabel}>{t.accessStatus}</div>
              <div
                style={{
                  ...styles.statusPill,
                  ...(status === 'ready'
                    ? styles.statusReady
                    : status === 'loading'
                    ? styles.statusLoading
                    : styles.statusNotFound),
                }}
              >
                {status === 'ready'
                  ? t.accessReady
                  : status === 'loading'
                  ? t.accessLoading
                  : t.accessNotFound}
              </div>
            </div>
          </div>
        </div>

        {status === 'loading' && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>{t.loadingTitle}</h2>
            <p style={styles.panelText}>{t.loadingText}</p>
          </div>
        )}

        {(status === 'not_found' || status === 'error') && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>{t.notFoundTitle}</h2>
            <p style={styles.panelText}>{t.notFoundText}</p>
          </div>
        )}

        {status === 'ready' && (
          <div style={styles.mainGrid}>
            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>{t.kicker}</h2>
              <p style={styles.panelText}>
                {rewardData?.description || t.formText}
              </p>

              <div style={styles.rewardCard}>
                <div style={styles.sectionLabel}>{t.kicker}</div>
                {rewardData ? (
                  <>
                    <div style={styles.rewardType}>{rewardTypeLabel}</div>
                    <div style={styles.rewardTitle}>
                      {rewardData.title || t.kicker}
                    </div>
                    <div style={styles.rewardDescription}>
                      {rewardData.description || ''}
                    </div>

                    {rewardData.url ? (
                      <button
                        type="button"
                        onClick={handleOpenReward}
                        style={styles.rewardButton}
                      >
                        {t.openReward}
                      </button>
                    ) : null}
                  </>
                ) : (
                  <div style={styles.rewardDescription}>{t.noReward}</div>
                )}
              </div>
            </div>

            <div style={styles.panel}>
              {joinState === 'joined' ? (
                <>
                  <h2 style={styles.panelTitle}>{t.joinedTitle}</h2>
                  <p style={styles.panelText}>{t.joinedText}</p>

                  <div style={styles.infoBox}>
                    <div style={styles.infoLabel}>{t.name}</div>
                    <div style={styles.infoValue}>{fanName || '—'}</div>
                  </div>

                  <div style={styles.infoBox}>
                    <div style={styles.infoLabel}>{t.email}</div>
                    <div style={styles.infoValue}>{fanEmail || '—'}</div>
                  </div>

                  <div style={styles.infoBox}>
                    <div style={styles.infoLabel}>{t.phone}</div>
                    <div style={styles.infoValue}>{fanPhone || '—'}</div>
                  </div>
                </>
              ) : (
                <>
                  <h2 style={styles.panelTitle}>{t.formTitle}</h2>
                  <p style={styles.panelText}>{t.formText}</p>

                  <div style={styles.fieldBlock}>
                    <label style={styles.label}>{t.name}</label>
                    <input
                      type="text"
                      value={fanName}
                      onChange={(e) => setFanName(e.target.value)}
                      placeholder={t.enterName}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.fieldBlock}>
                    <label style={styles.label}>{t.email}</label>
                    <input
                      type="email"
                      value={fanEmail}
                      onChange={(e) => setFanEmail(e.target.value)}
                      placeholder={t.enterEmail}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.fieldBlock}>
                    <label style={styles.label}>{t.phone}</label>
                    <input
                      type="tel"
                      value={fanPhone}
                      onChange={(e) => setFanPhone(e.target.value)}
                      placeholder={t.enterPhone}
                      style={styles.input}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGdprModal(true)}
                    style={styles.primaryButton}
                  >
                    {t.joinNow}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showGdprModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalTitle}>{t.gdprTitle}</div>
            <div style={styles.modalText}>{t.gdprText}</div>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                style={styles.checkbox}
              />
              <span>{t.gdprCheck}</span>
            </label>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => {
                  setShowGdprModal(false);
                  setConsentChecked(false);
                }}
                style={styles.cancelButton}
              >
                {t.cancel}
              </button>

              <button
                type="button"
                onClick={registerJoin}
                style={{
                  ...styles.confirmButton,
                  opacity: consentChecked ? 1 : 0.45,
                  cursor: consentChecked ? 'pointer' : 'not-allowed',
                }}
                disabled={!consentChecked}
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    color: '#ffffff',
    background:
      'radial-gradient(circle at top left, rgba(0,240,255,0.12), transparent 24%), radial-gradient(circle at bottom right, rgba(57,120,255,0.14), transparent 24%), #070707',
    position: 'relative',
    overflow: 'hidden',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Helvetica, Arial, sans-serif',
  },
  glowOne: {
    position: 'absolute',
    borderRadius: '999px',
    pointerEvents: 'none',
    filter: 'blur(90px)',
    opacity: 0.9,
    width: '360px',
    height: '360px',
    left: '-100px',
    top: '-100px',
    background: 'rgba(0,240,255,0.12)',
  },
  glowTwo: {
    position: 'absolute',
    borderRadius: '999px',
    pointerEvents: 'none',
    filter: 'blur(90px)',
    opacity: 0.9,
    width: '420px',
    height: '420px',
    right: '-140px',
    bottom: '-160px',
    background: 'rgba(57,120,255,0.16)',
  },
  shell: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '28px 22px 72px',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoWrap: {
    width: '240px',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '14px',
  },
  logo: {
    maxWidth: '240px',
    maxHeight: '120px',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
  },
  logoFallback: {
    marginBottom: '14px',
    padding: '20px 26px',
    borderRadius: '22px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '28px',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
  },
  kicker: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#9ddcff',
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },
  title: {
    margin: '0 0 12px',
    fontSize: '56px',
    lineHeight: 0.98,
    letterSpacing: '-0.045em',
  },
  subtitle: {
    margin: 0,
    maxWidth: '760px',
    color: 'rgba(255,255,255,0.70)',
    fontSize: '18px',
    lineHeight: 1.6,
  },
  summaryCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '28px',
    padding: '22px',
    backdropFilter: 'blur(14px)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.30)',
    marginBottom: '24px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '14px',
  },
  metaBox: {
    padding: '14px',
    borderRadius: '18px',
    background: 'rgba(0,0,0,0.22)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  metaBoxWide: {
    padding: '14px',
    borderRadius: '18px',
    background: 'rgba(0,0,0,0.22)',
    border: '1px solid rgba(255,255,255,0.06)',
    gridColumn: '1 / -1',
  },
  metaLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  },
  metaValue: {
    color: '#ffffff',
    fontSize: '15px',
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '9px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    border: '1px solid rgba(255,255,255,0.10)',
  },
  statusReady: {
    background: 'rgba(121,255,176,0.12)',
    color: '#79ffb0',
  },
  statusLoading: {
    background: 'rgba(255,179,107,0.12)',
    color: '#ffcc8f',
  },
  statusNotFound: {
    background: 'rgba(255,141,141,0.12)',
    color: '#ff8d8d',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  panel: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '28px',
    padding: '22px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.30)',
    backdropFilter: 'blur(14px)',
  },
  panelTitle: {
    margin: '0 0 14px',
    fontSize: '24px',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    textAlign: 'center',
  },
  panelText: {
    margin: '0 0 18px',
    color: 'rgba(255,255,255,0.68)',
    fontSize: '15px',
    lineHeight: 1.6,
  },
  rewardCard: {
    padding: '18px',
    borderRadius: '22px',
    background: 'rgba(0,0,0,0.22)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  },
  rewardType: {
    color: '#9ddcff',
    fontSize: '13px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '10px',
    fontWeight: 700,
  },
  rewardTitle: {
    fontSize: '30px',
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    marginBottom: '12px',
    textAlign: 'center',
  },
  rewardDescription: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: '16px',
    lineHeight: 1.7,
    textAlign: 'center',
  },
  rewardButton: {
    marginTop: '18px',
    minHeight: '52px',
    width: '100%',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.06)',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  fieldBlock: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.82)',
  },
  input: {
    width: '100%',
    height: '52px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    padding: '0 14px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  primaryButton: {
    width: '100%',
    minHeight: '56px',
    borderRadius: '18px',
    border: 'none',
    background: 'linear-gradient(135deg, #00f0ff 0%, #3978ff 100%)',
    color: '#000',
    fontSize: '17px',
    fontWeight: 800,
    cursor: 'pointer',
    marginTop: '8px',
  },
  infoBox: {
    marginTop: '18px',
    padding: '14px 16px',
    borderRadius: '18px',
    background: 'rgba(0,0,0,0.22)',
    border: '1px solid rgba(255,255,255,0.06)',
    textAlign: 'left',
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  },
  infoValue: {
    color: '#ffffff',
    fontSize: '14px',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.82)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 999,
  },
  modalBox: {
    width: '100%',
    maxWidth: '760px',
    background: '#101010',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '24px',
    padding: '26px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
  },
  modalTitle: {
    margin: '0 0 14px',
    fontSize: '30px',
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
  },
  modalText: {
    color: 'rgba(255,255,255,0.80)',
    lineHeight: 1.7,
    fontSize: '15px',
    marginBottom: '18px',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.10)',
    lineHeight: 1.6,
    fontSize: '15px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginTop: '2px',
    flexShrink: 0,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '14px',
    marginTop: '22px',
  },
  cancelButton: {
    flex: 1,
    minHeight: '52px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  confirmButton: {
    flex: 1,
    minHeight: '52px',
    borderRadius: '16px',
    border: 'none',
    background: 'linear-gradient(135deg, #00f0ff 0%, #3978ff 100%)',
    color: '#000',
    fontSize: '15px',
    fontWeight: 900,
  },
};

export default JoinPage;