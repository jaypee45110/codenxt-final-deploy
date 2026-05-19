import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';


const SMS_NUMBER = '+4794433450'; // BYTT TIL DITT NUMMER / SMS-NUMMER

function detectLanguage() {
const supported = ['en']; // force English for demo
  const langs = navigator.languages || [navigator.language || 'en'];
  for (const lang of langs) {
    const short = String(lang).toLowerCase().slice(0, 2);
    if (supported.includes(short)) return short;
  }

  return 'en';
}

const TEXT = {
  en: {
    in: "YOU’RE IN",
    join: 'JOIN THE INNERCIRCLE',
    pdf: 'OPEN PDF',
    open: 'OPEN REWARD',
    souvenirReady: 'Your digital souvenir is ready',
    momentOnly: 'LIVE NOW — DIGITAL MOMENT ONLY',
    missing: 'Reward not available',
  },
  es: {
    in: 'ESTÁS DENTRO',
    join: 'ÚNETE AL INNERCIRCLE',
    pdf: 'ABRIR PDF',
    open: 'ABRIR REWARD',
    souvenirReady: 'Tu souvenir digital está listo',
    momentOnly: 'EN VIVO AHORA — SOLO MOMENTO DIGITAL',
    missing: 'Reward no disponible',
  },
  fr: {
    in: 'VOUS ÊTES DEDANS',
    join: "REJOINDRE L'INNERCIRCLE",
    pdf: 'OUVRIR PDF',
    open: 'OUVRIR LE REWARD',
    souvenirReady: 'Votre souvenir numérique est prêt',
    momentOnly: 'EN DIRECT — MOMENT DIGITAL UNIQUEMENT',
    missing: 'Reward indisponible',
  },
  de: {
    in: 'DU BIST DRIN',
    join: 'INNER CIRCLE BEITRETEN',
    pdf: 'PDF ÖFFNEN',
    open: 'REWARD ÖFFNEN',
    souvenirReady: 'Dein digitales Souvenir ist bereit',
    momentOnly: 'JETZT LIVE — NUR DIGITALER MOMENT',
    missing: 'Reward nicht verfügbar',
  },
  sv: {
    in: 'DU ÄR INNE',
    join: 'GÅ MED I INNERCIRCLE',
    pdf: 'ÖPPNA PDF',
    open: 'ÖPPNA REWARD',
    souvenirReady: 'Din digitala souvenir är klar',
    momentOnly: 'LIVE NU — ENDAST DIGITALT MOMENT',
    missing: 'Reward inte tillgänglig',
  },
  da: {
    in: 'DU ER INDE',
    join: 'BLIV EN DEL AF INNERCIRCLE',
    pdf: 'ÅBN PDF',
    open: 'ÅBN REWARD',
    souvenirReady: 'Din digitale souvenir er klar',
    momentOnly: 'LIVE NU — KUN DIGITALT ØJEBLIK',
    missing: 'Reward ikke tilgængelig',
  },
  no: {
    in: 'DU ER INNE',
    join: 'BLI MED I INNERCIRCLE',
    pdf: 'ÅPNE PDF',
    open: 'ÅPNE REWARD',
    souvenirReady: 'Din digitale souvenir er klar',
    momentOnly: 'LIVE NÅ — KUN DIGITALT ØYEBLIKK',
    missing: 'Reward ikke tilgjengelig',
  },
};

export default function JoinPage() {
  const { eventCode: routeEventCode } = useParams();
  const [lang, setLang] = useState('en');
  const [eventData, setEventData] = useState(null);
  const [reward, setReward] = useState(null);
  const [scanTier, setScanTier] = useState('standard');
  const [scanRank, setScanRank] = useState(null);
  const [status, setStatus] = useState('loading');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phone, setPhone] = useState('');

  const eventCode = useMemo(() => {
    if (routeEventCode) return routeEventCode;
    const params = new URLSearchParams(window.location.search);
    return params.get('eventCode') || '';
  }, [routeEventCode]);
useEffect(() => {
  document.title = 'Join — codeTone';
}, []);

useEffect(() => {
setLang(detectLanguage());
}, []);
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventCode) {
        setStatus('missing');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/event/${eventCode}`);
        const data = await res.json();
        console.log("BACKEND EVENT DATA:", data);

        const saved = JSON.parse(localStorage.getItem('codenxt_event') || '{}');

        const merged = {
          ...data,
          artistLogo: data?.artistLogo || saved?.artistLogo || reward?.artistLogo || '',
          artistName: data?.artistName || data?.name || saved?.artistName || '',
          venue: data?.venue || saved?.venue || '',
          city: data?.city || saved?.city || '',
          startAt: data?.startAt || data?.eventDate || saved?.startAt || saved?.eventDate || '',
        };

setEventData(merged);

const now = Date.now();
const endTime = merged?.endAt ? new Date(merged.endAt).getTime() : null;

if (merged?.momentOpen !== true) {
  console.log('JOIN STATUS: moment not open yet, but reward check will continue');
}
try {
  const scanStorageKey = `codenxt_scan_id_${eventCode}`;
  let scanId = localStorage.getItem(scanStorageKey);

  if (!scanId) {
    scanId = `${eventCode}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(scanStorageKey, scanId);
  }

  const scanRes = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ eventCode, scanId }),
  });

const scanData = await scanRes.json();

const urlParams = new URLSearchParams(window.location.search);
const forcedTier = urlParams.get('tier');

const resolvedTier =
  forcedTier ||
  scanData?.tier ||
  'general';
  console.log('SCAN DATA:', scanData);
  console.log('RESOLVED TIER:', resolvedTier);

  setScanTier(resolvedTier);

  if (scanData?.scanRank) {
    setScanRank(scanData.scanRank);
  }

  const rewardRes = await fetch(
    `${API_BASE}/reward/${data.id}?tier=${resolvedTier}`
  );

  if (rewardRes.ok) {
    const rewardData = await rewardRes.json();

    console.log('REWARD FETCH:', rewardData);
    console.log('FINAL REWARD:', rewardData);

    setReward(rewardData || {});
  } else {
    console.warn('No reward found for event');
    setReward(null);
  }
} catch (error) {
  console.error('Failed to register scan or fetch reward:', error);
  setReward(null);
}
        try {
          const reportKey = `codenxt_report_${eventCode}`;
          const uniqueScanKey = `codenxt_unique_scan_${eventCode}`;
          const existingReportRaw = localStorage.getItem(reportKey);

          let reportData = {
            eventCode,
            rawScans: 0,
            uniqueScans: 0,
            innerCircleJoinCount: 0,
            joins: [],
          };

          if (existingReportRaw) {
            reportData = JSON.parse(existingReportRaw);
          }

          reportData.rawScans = Number(reportData.rawScans || 0) + 1;

          const hasUniqueScan = localStorage.getItem(uniqueScanKey) === '1';
          if (!hasUniqueScan) {
            reportData.uniqueScans = Number(reportData.uniqueScans || 0) + 1;
            localStorage.setItem(uniqueScanKey, '1');
          }

          localStorage.setItem(reportKey, JSON.stringify(reportData));
        } catch (error) {
          console.error('Could not store scan data:', error);
        }

        setStatus('ready');
      } catch (error) {
        console.error('Failed to load event:', error);
        setStatus('error');
      }
    };

    fetchEvent();
  }, [eventCode]);

  const t = TEXT[lang] || TEXT.en;
const [joined, setJoined] = useState(false);
const handleJoinInnerCircle = () => {
  setShowPhoneInput(true);

  setTimeout(() => {
    const el = document.getElementById('phone-input');
    if (el) el.focus();
  }, 100);
};
  return (
    <div style={styles.page}>
      <div style={styles.vignetteTop} />
      <div style={styles.vignetteBottom} />

      <div style={styles.shell}>
      <div style={styles.badge}>YOU WERE THERE</div>
<div style={styles.title}>{t.in}</div>
{scanTier === 'gold' && (
  <div style={styles.tierBadgeGold}>GOLD ACCESS</div>
)}

{scanTier === 'silver' && (
  <div style={styles.tierBadgeSilver}>SILVER ACCESS</div>
)}

{(eventData?.artistLogo || reward?.artistLogo) ? (
  <div style={styles.logoFrame}>
    <img
      src={eventData?.artistLogo || reward?.artistLogo}
      alt={eventData?.artistName || reward?.artistName || 'Artist logo'}
      style={styles.artistLogo}
    />
  </div>
) : null}

        {eventData?.artistName ? (
          <div style={styles.meta}>
            <div style={styles.artistName}>{eventData.artistName}</div>
{(eventData?.venue || eventData?.city) && (
  <div style={styles.metaLine}>
{eventData?.venue && eventData?.city
  ? `${eventData.venue}, ${eventData.city}`
  : eventData?.venue || eventData?.city || ''}
    </div>
)}

{eventData?.startAt && (
  <div style={styles.eventDate}>
    {new Date(eventData.startAt).toLocaleDateString(
      lang === 'no' ? 'nb-NO' : lang,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    )}
  </div>
)}

          </div>
        ) : null}

        <div style={styles.rewardWrap}>
          {status === 'loading' && <div style={styles.infoText}>Loading…</div>}
          {status === 'early' && (
  <div style={styles.infoText}>
    You’re early. The moment opens when the screen goes live.
  </div>
)}
{status === 'closed' && (
  <div style={styles.infoText}>
    This moment has passed.
  </div>
)}
{status !== 'loading' && status !== 'early' && reward === null && (
    <div style={styles.infoText}>{t.missing}</div>
)}
          {reward?.type === 'image' && (
            <img src={reward.url} alt={reward.title || ''} style={styles.media} />
          )}

          {reward?.type === 'video' && (
            <div style={styles.centerWrap}>
              <video
                src={reward.url}
                controls={reward?.accessMode !== 'moment'}
                autoPlay={reward?.accessMode === 'moment'}
                playsInline
                style={styles.media}
              />
            </div>
          )}

          {reward?.type === 'audio' && (
            <div style={styles.audioWrap}>
              <div style={styles.audioTitle}>
                {reward.title || 'AUDIO REWARD'}
              </div>
              <audio src={reward.url} controls autoPlay style={{ width: '100%' }} />
            </div>
          )}

{reward?.type === 'pdf' && (
  <div style={styles.centerWrap}>
    <button
      type="button"
      style={styles.ctaLink}
      onClick={() => {
        try {
          const byteString = atob(reward.url.split(',')[1]);
          const mimeString = reward.url.split(',')[0].split(':')[1].split(';')[0];

          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);

          for (let i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
          }

          const blob = new Blob([ab], { type: mimeString || 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
          console.error('Could not open PDF:', error);
          window.open(reward.url, '_blank', 'noopener,noreferrer');
        }
      }}
    >
      {t.pdf}
    </button>
  </div>
)}

          {reward?.type === 'url' && (
            <div style={styles.urlWrap}>
              <a href={reward.url} target="_blank" rel="noreferrer" style={styles.bigButtonLink}>
OPEN SOUVENIR
              </a>
              <div style={styles.softText}>{t.souvenirReady}</div>
            </div>
          )}

          {reward?.type === 'text' && (
            <div style={styles.textReward}>
              {reward.content || reward.title || 'Reward granted'}
            </div>
          )}

          {reward?.accessMode === 'moment' && (
            <div style={styles.momentNote}>{t.momentOnly}</div>
          )}

          {reward?.downloadAllowed && reward?.url && (
            <a
              href={reward.url}
              download
              target="_blank"
              rel="noreferrer"
              style={styles.downloadLink}
            >
              DOWNLOAD SOUVENIR
            </a>
          )}
        </div>

<button
  type="button"
  style={{
    ...styles.joinBtn,
    opacity: joined ? 0.6 : 1,
    cursor: joined ? 'default' : 'pointer',
  }}
  onClick={joined ? undefined : handleJoinInnerCircle}
>
  {joined ? 'JOINED' : t.join}
</button>
{showPhoneInput && (
  <div style={{ marginTop: 12, width: '100%' }}>
<input
  id="phone"
  name="phone"
  type="tel"
  inputMode="tel"
  autoComplete="tel"
 placeholder="Phone number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  style={{
    width: '100%',
    boxSizing: 'border-box',
    padding: 14,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  }}
/>

    <button
      type="button"
      onClick={async () => {
        if (!phone) return;

        await fetch(`${API_BASE}/inner-circle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            eventCode,
          }),
        });
        setJoined(true);
        setShowPhoneInput(false);
      }}
      style={{
        width: '100%',
        padding: 12,
        borderRadius: 999,
        border: 'none',
        background: '#ffffff',
        color: '#000000',
        fontWeight: 800,
      }}
    >
      CONFIRM
    </button>
  </div>
)}

<div style={styles.disclaimer}>
  Get the next drop straight to your phone. By joining, you agree to receive messages related to this event.
</div>

<div style={{
  marginTop: 10,
  fontSize: 9,
  opacity: 0.35,
  textAlign: 'center'
}}>
  codeTone by codeNXT
</div>

      </div>
    </div>
  );
}

const styles = {
  tierBadgeGold: {
  marginTop: 14,
  marginBottom: 22,
  padding: '12px 28px',
  borderRadius: 999,
  background: 'linear-gradient(135deg, rgba(255,215,0,0.24) 0%, rgba(255,170,0,0.14) 100%)',
  border: '1px solid rgba(255,215,0,0.75)',
  color: '#ffd94d',
  fontSize: 20,
  fontWeight: 900,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  textAlign: 'center',
  boxShadow: '0 0 30px rgba(255,215,0,0.35)',
},

tierBadgeSilver: {
  marginTop: 14,
  marginBottom: 22,
  padding: '12px 28px',
  borderRadius: 999,
  background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(180,180,180,0.12) 100%)',
  border: '1px solid rgba(255,255,255,0.45)',
  color: '#f5f5f5',
  fontSize: 20,
  fontWeight: 900,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  textAlign: 'center',
  boxShadow: '0 0 24px rgba(255,255,255,0.16)',
},
  page: {
    position: 'relative',
    minHeight: '100vh',
    background: '#000000',
    color: '#ffffff',
    overflow: 'hidden',
  },

  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '26vh',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%)',
    pointerEvents: 'none',
  },
  vignetteBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '28vh',
    background: 'linear-gradient(0deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 100%)',
    pointerEvents: 'none',
  },
  shell: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: 460,
    margin: '0 auto',
    minHeight: '100vh',
    padding: '40px 20px 36px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: 42,
    lineHeight: 1.05,
    fontWeight: 900,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 18,
  },

  badge: {
    fontSize: 14,
    letterSpacing: 3,
    opacity: 0.7,
    marginBottom: 10,
    textAlign: 'center',
    color: '#00f0ff',
    textTransform: 'uppercase',
    textShadow: '0 0 8px rgba(0,240,255,0.6)',
  },
  logoFrame: {
  width: '100%',
  maxWidth: 360,
  marginBottom: 10,
  display: 'flex',
  justifyContent: 'center',
},
artistLogo: {
  width: '100%',
  maxWidth: 360,
  maxHeight:120,
  objectFit: 'contain',
  display: 'block',
},
  meta: {
    textAlign: 'center',
    marginBottom: 18,
  },
artistName: {
  fontSize: 26,
  lineHeight: 1.08,
  fontWeight: 900,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
},
  metaLine: {
    disclaimer: {
  marginTop: 8,
  fontSize: 9,
  color: 'rgba(255,255,255,0.5)',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

},
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
  },
  rewardWrap: {
    width: '100%',
    marginBottom: 22,
  },
  centerWrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  audioWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
  },
  urlWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
  },
  textReward: {
    marginTop: 8,
    padding: '20px 24px',
    borderRadius: 18,
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1.35,
    boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
  },
  media: {
    width: '100%',
    display: 'block',
    maxWidth: 360,
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
    margin: '0 auto',
  },
  ctaLink: {
    display: 'inline-block',
    padding: '14px 22px',
    borderRadius: 999,
    textDecoration: 'none',
    color: '#fff',
    fontWeight: 800,
    letterSpacing: 1,
    background: 'linear-gradient(180deg, #00f0ff 0%, #00c8d8 100%)',
    boxShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.25)',
  },
  bigButtonLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
    padding: '16px 24px',
    borderRadius: 14,
    background: '#19e6ff',
    color: '#000',
    fontWeight: 800,
    fontSize: 20,
    textDecoration: 'none',
    boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
  },
  softText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    textAlign: 'center',
  },
  momentNote: {
    marginTop: 12,
    fontSize: 12,
    letterSpacing: 1,
    opacity: 0.72,
    textAlign: 'center',
  },
  downloadLink: {
    marginTop: 16,
    display: 'inline-block',
    padding: '14px 26px',
    borderRadius: 999,
    textDecoration: 'none',
    color: '#fff',
    fontWeight: 800,
    letterSpacing: 1,
    background: 'linear-gradient(180deg, #00f0ff 0%, #00c8d8 100%)',
    boxShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.25)',
    border: 'none',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
  },
  joinBtn: {
    width: '100%',
    maxWidth: 360,
    padding: '16px 18px',
    borderRadius: 999,
    border: 'none',
    background: 'linear-gradient(180deg, #00f0ff 0%, #00c8d8 100%)',
    color: '#000000',
    fontWeight: 900,
    fontSize: 16,
    letterSpacing: 0.5,
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.2)',
  },
};