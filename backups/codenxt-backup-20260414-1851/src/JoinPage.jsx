import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function JoinPage() {
  const { eventCode } = useParams();

  const [eventData, setEventData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [showGdprModal, setShowGdprModal] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [joined, setJoined] = useState(false);
  const [countdownText, setCountdownText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneConfirmed, setIsPhoneConfirmed] = useState(false);
  const rewardData = eventData?.reward || (() => {
  try {
    return JSON.parse(localStorage.getItem('codenxt_reward') || 'null');
  } catch {
    return null;
  }
})();
const handleSavePhone = () => {
  const cleanedPhone = phoneNumber.replace(/[^\d+]/g, '').trim();
  if (!cleanedPhone) return;

  const existing = JSON.parse(localStorage.getItem('innerCircle') || '[]');
  const alreadyExists = existing.some(
    (e) => e.phone === cleanedPhone && e.eventCode === eventCode
  );

  if (alreadyExists) {
    setPhoneNumber(cleanedPhone);
    setIsPhoneConfirmed(true);
    return;
  }

  const updated = [
    ...existing,
    {
      phone: cleanedPhone,
      eventCode: eventCode,
      timestamp: new Date().toISOString()
    }
  ];

  localStorage.setItem('innerCircle', JSON.stringify(updated));
  setPhoneNumber(cleanedPhone);
  setIsPhoneConfirmed(true);
};

  useEffect(() => {
    if (!joined) return;
  const rewardRaw = localStorage.getItem('codenxt_reward');
  if (!rewardRaw) return;

  try {
    const reward = JSON.parse(rewardRaw);
    const unlockAt = reward?.unlockAt
  ? new Date(reward.unlockAt)
  : new Date(Date.now() + 2 * 60 * 1000); // fallback 2 min

   
    console.log('COUNTDOWN DEBUG', { joined, unlockAt: reward.unlockAt, parsedUnlockAt: unlockAt, now: new Date().toISOString() });

    const now = new Date();
const initialDiff = unlockAt - now;

if (initialDiff <= 0) {
  setCountdownText('REWARD LIVE');
  return;
}

const initialMinutes = Math.floor(initialDiff / 60000);
const initialSeconds = Math.floor((initialDiff % 60000) / 1000);

setCountdownText(`${initialMinutes}:${initialSeconds.toString().padStart(2, '0')}`);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = unlockAt - now;

      if (diff <= 0) {
        setCountdownText('REWARD LIVE');
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setCountdownText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  } catch (e) {
    console.error('Countdown error:', e);
  }
}, [joined]);
useEffect(() => {
  const fetchEventFromBackend = async () => {
    console.log('Fetching event from backend...', eventCode);

    try {
      const res = await fetch(`http://localhost:3001/event/${eventCode}`);
      const data = await res.json();

      console.log('BACKEND DATA:', data);

      setEventData(data);
      setStatus('ready');
    } catch (error) {
      console.error('Failed to load event from backend:', error);
    }
  };

  if (eventCode) {
    fetchEventFromBackend();
  }
}, [eventCode]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const logoFromUrl = params.get('logo');
    console.log('JOIN LOGO FROM URL:', logoFromUrl);

    const raw = localStorage.getItem('codenxt_event');
    const rewardRaw = localStorage.getItem('codenxt_reward');

if (!raw && !logoFromUrl && !eventData) {
  setStatus('not_found');
  return;
}
    try {
      const saved = raw ? JSON.parse(raw) : {};
      const reward = rewardRaw ? JSON.parse(rewardRaw) : null;
      const unlockAt = reward?.unlockAt ? new Date(reward.unlockAt) : null;
      

    

if (!eventData && ((saved?.eventCode && saved.eventCode === eventCode) || logoFromUrl)) {
          setEventData({
          ...saved,
          reward,
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
}, [eventCode, eventData]);
  const handleConfirmJoin = () => {
    if (!consentChecked) return;

    const payload = {
  eventCode,
  consentGiven: true,
  phoneNumber,
  joinedAt: new Date().toISOString(),
  source: 'join_page',
};
        const rewardRaw = localStorage.getItem('codenxt_reward');
    if (rewardRaw) {
      try {
        const reward = JSON.parse(rewardRaw);
        reward.unlockAt = new Date(Date.now() + 5 * 1000).toISOString();
        localStorage.setItem('codenxt_reward', JSON.stringify(reward));
      } catch (error) {
        console.error('Could not refresh reward unlockAt:', error);
      }
    }
fetch('http://localhost:3001/join', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
  eventCode,
  phoneNumber,
})
  .then((res) => res.json())
  .then((data) => {
    console.log('JOIN RESPONSE:', data);
  })
  .catch((error) => {
    console.error('JOIN BACKEND ERROR:', error);
  });
    try {
      localStorage.setItem(`codenxt_join_${eventCode}`, JSON.stringify(payload));

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
        (item) => item?.eventCode === eventCode && item?.source === 'join_page'
      );

      if (!alreadyJoined) {
        reportData.joins.push(payload);
        reportData.innerCircleJoinCount = reportData.joins.length;
      }

      localStorage.setItem(reportKey, JSON.stringify(reportData));
    } catch (error) {
      console.error('Could not store join/report data:', error);
    }

   setJoined(true);
    setShowGdprModal(false);
    setConsentChecked(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.starField} />
      <div style={styles.vignetteTop} />
      <div style={styles.vignetteBottom} />

      <div style={styles.shell}>
        <div style={styles.topSpacer} />

        <div style={styles.connectedWrap}>
          <h1 style={styles.connectedTitle}>
  {countdownText || 'CONNECTED'}
</h1>
        </div>

        <div style={styles.logoFrame}>
          {eventData?.artistLogo ? (
            <img
              src={eventData.artistLogo}
              alt={eventData?.artistName || 'Artist logo'}
              style={styles.artistLogo}
            />
          ) : (
            <div style={styles.logoPlaceholder}>
              <div style={styles.placeholderTextTop}>ARTIST LOGO</div>
              <div style={styles.placeholderTextBottom}>
                from checkout upload
              </div>
            </div>
          )}
        </div>

{joined ? (
  <>
    <div style={styles.joinedButton}>YOU’RE IN</div>

    {rewardData && (
      <div style={{ marginTop: 24, width: '100%' }}>
{rewardData.type === 'image' && (
  <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <img
      src={rewardData.url}
      alt={rewardData.title}
      style={{
        width: '100%',
        maxWidth: 320,
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        display: 'block'
      }}
    />
  </div>
)}

{rewardData.type === 'pdf' && (
<div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
      <a
      href={rewardData.url}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-block',
        padding: '14px 22px',
        borderRadius: 999,
        textDecoration: 'none',
        color: '#fff',
        fontWeight: 800,
        letterSpacing: 1,
        background: 'linear-gradient(180deg, #00f0ff 0%, #00c8d8 100%)',
        boxShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.25)',
        border: 'none',
      }}
    >
      OPEN PDF
    </a>
  </div>
)}

{rewardData.type === 'audio' && (
  <div style={{ marginTop: 16, width: '100%' }}>
    <audio
controls={rewardData?.accessMode === 'download'}
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      style={{ width: '100%' }}
    >
      <source src={rewardData.url} />
    </audio>
  </div>
)}

{rewardData.type === 'video' && (
<div style={{ marginTop: 16, width: '100%', display: 'flex', justifyContent: 'center' }}>
<video
controls={rewardData?.accessMode === 'download'}
  controlsList="nodownload"
  onContextMenu={(e) => e.preventDefault()}
  disablePictureInPicture
autoPlay={rewardData?.accessMode === 'moment'}
  style={{
        width: '100%',
        maxWidth: 320,
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
      }}
    >
      <source src={rewardData.url} />
    </video>
  </div>
)}    {rewardData.accessMode === 'moment' && (
  <div style={{
    marginTop: 12,
    fontSize: 12,
    letterSpacing: 1,
    opacity: 0.7,
    textAlign: 'center'
  }}>
    LIVE NOW — DIGITAL MOMENT ONLY
  </div>
)}
{rewardData.downloadAllowed && (
    <a
  href={rewardData.url}
  download
  target="_blank"
  rel="noreferrer"
  style={{
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
  }}
>
  DOWNLOAD SOUVENIR
</a>
)}
  </div>
)}
<div
  style={{
    marginTop: 24,
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    zIndex: 60,
    pointerEvents: 'auto'
  }}
>
  <div
    style={{
      fontSize: 12,
      opacity: 1,
      marginBottom: 10,
      letterSpacing: 1,
      fontWeight: 700,
      color: '#00f0ff'
    }}
  >
    GET THE NEXT DROP DIRECT
  </div>
  <input
    type="tel"
    placeholder="+47 900 00 000"
    autoComplete="tel"
    inputMode="numeric"
    value={phoneNumber}
    onChange={(e) => {
      setPhoneNumber(e.target.value);
      if (isPhoneConfirmed) setIsPhoneConfirmed(false);
    }}
    style={{
      width: '100%',
      maxWidth: 320,
      padding: '14px 16px',
      borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.04)',
      color: '#fff',
      fontSize: 14,
      textAlign: 'center',
      outline: 'none',
      position: 'relative',
      zIndex: 10,
      pointerEvents: 'auto',
      display: 'block',
      margin: '0 auto'
    }}
  />

  <button
    type="button"
onClick={() => {
  setIsPhoneConfirmed(true);
}}
    style={{
      marginTop: 12,
      padding: '14px 22px',
      borderRadius: 999,
      border: 'none',
      fontWeight: 800,
      letterSpacing: 1,
      color: isPhoneConfirmed ? '#000' : '#fff',
      background: isPhoneConfirmed
        ? '#ffffff'
        : 'linear-gradient(180deg, #00f0ff 0%, #00c8d8 100%)',
      boxShadow: isPhoneConfirmed
        ? '0 0 10px rgba(255,255,255,0.4)'
        : '0 0 20px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.25)',
      cursor: 'pointer',
      position: 'relative',
      zIndex: 10,
      pointerEvents: 'auto',
      display: 'inline-block'
    }}
  >
    {isPhoneConfirmed ? 'CONFIRMED' : 'CONFIRM NUMBER'}
  </button>
</div>
        {rewardData?.setlist && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
              SETLIST
            </div>

            {Array.isArray(rewardData.setlist) ? (
  rewardData.setlist.map((track, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  {i + 1}. {track}
                </div>
              ))
            ) : (
              <div>{rewardData.setlist}</div>
            )}
          </div>
        )}
  </>
) : (
  <button
    type="button"
    onClick={() => {
      setShowGdprModal(true);
    }}
    style={{
      ...styles.joinButton,
      position: 'relative',
      zIndex: 2,
    }}
    disabled={false}
  >
    JOIN
  </button>
)}
        <div style={styles.footerBrand}>
          <span style={styles.brandStrong}>codeTone</span>
          <span style={styles.brandSoft}> powered by codeNXT</span>
        </div>
      </div>

      {showGdprModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            {countdownText || ''}

            <div style={styles.modalInfoLine}>
              YOU WILL RECEIVE A DIGITAL SOUVENIR SHORTLY
            </div>

            <div style={styles.modalJoinTitle}>JOIN THE INNERCIRCLE</div>

            <button
              type="button"
              onClick={handleConfirmJoin}
              style={{
                ...styles.modalAcceptButton,
                ...(consentChecked ? null : styles.modalAcceptButtonDisabled),
              }}
              disabled={!consentChecked}
            >
              ACCEPT
            </button>

            <label style={styles.gdprRow}>
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.gdprText}>
                This is in consent of GDPR
                <br />
                (General Data Protection Regulation)
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                setShowGdprModal(false);
                setConsentChecked(false);
              }}
              style={styles.modalCancel}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: '#020305',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Helvetica, Arial, sans-serif',
  },
  starField: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.9), transparent 55%),
      radial-gradient(1.5px 1.5px at 100px 80px, rgba(255,255,255,0.8), transparent 55%),
      radial-gradient(1.5px 1.5px at 180px 140px, rgba(255,255,255,0.85), transparent 55%),
      radial-gradient(2px 2px at 260px 60px, rgba(255,255,255,0.75), transparent 55%),
      radial-gradient(1.5px 1.5px at 320px 170px, rgba(255,255,255,0.82), transparent 55%),
      radial-gradient(2px 2px at 40px 220px, rgba(255,255,255,0.7), transparent 55%),
      radial-gradient(1.5px 1.5px at 140px 260px, rgba(255,255,255,0.88), transparent 55%),
      radial-gradient(2px 2px at 240px 310px, rgba(255,255,255,0.78), transparent 55%),
      radial-gradient(1.5px 1.5px at 330px 370px, rgba(255,255,255,0.84), transparent 55%),
      radial-gradient(2px 2px at 80px 420px, rgba(255,255,255,0.74), transparent 55%),
      radial-gradient(1.5px 1.5px at 210px 500px, rgba(255,255,255,0.88), transparent 55%),
      radial-gradient(2px 2px at 300px 560px, rgba(255,255,255,0.78), transparent 55%),
      radial-gradient(1.5px 1.5px at 30px 640px, rgba(255,255,255,0.82), transparent 55%),
      radial-gradient(2px 2px at 170px 720px, rgba(255,255,255,0.72), transparent 55%),
      radial-gradient(1.5px 1.5px at 280px 820px, rgba(255,255,255,0.88), transparent 55%)
    `,
    backgroundSize: '360px 900px',
    opacity: 0.92,
    pointerEvents: 'none',
  },
  vignetteTop: {
    position: 'absolute',
    top: '-120px',
    left: '-120px',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'rgba(0, 240, 255, 0.12)',
    filter: 'blur(110px)',
    pointerEvents: 'none',
  },
  vignetteBottom: {
    position: 'absolute',
    right: '-120px',
    bottom: '-120px',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'rgba(0, 240, 255, 0.10)',
    filter: 'blur(110px)',
    pointerEvents: 'none',
  },
  shell: {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    width: '100%',
    maxWidth: '430px',
    margin: '0 auto',
    padding: '10px 18px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  topSpacer: {
    height: '36px',
  },
  connectedWrap: {
  width: '100%',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
},
 connectedTitle: {
  margin: 0,
  fontSize: 'clamp(60px, 16vw, 100px)',
  lineHeight: 0.95,
  textAlign: 'center',
  fontWeight: 900,
  letterSpacing: '-0.04em',
},
logoFrame: {
  width: '100%',
  maxWidth: '100%',
  height: '260px',
  marginBottom: '80px',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(2, 5, 12, 0.78)',
    boxShadow: 'inset 0 0 18px rgba(25,45,90,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
artistLogo: {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block',
},
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.42)',
    textAlign: 'center',
    padding: '12px',
  },
  placeholderTextTop: {
    fontSize: '20px',
    fontWeight: 800,
    letterSpacing: '0.08em',
  },
  placeholderTextBottom: {
    fontSize: '12px',
    marginTop: '8px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  joinSection: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: '90px',
    display: 'flex',
    justifyContent: 'center',
  },
  joinButton: {
    width: '100%',
    maxWidth: '300px',
    minHeight: '92px',
    borderRadius: '30px',
    border: '3px solid rgba(214, 255, 255, 0.92)',
    background:
      'linear-gradient(180deg, rgba(34, 221, 237, 0.52) 0%, rgba(9, 77, 87, 0.78) 100%)',
    boxShadow:
      '0 0 22px rgba(0, 240, 255, 0.72), 0 0 54px rgba(0, 240, 255, 0.34), inset 0 0 18px rgba(255,255,255,0.18)',
    color: '#ffffff',
    fontSize: 'clamp(30px, 8vw, 48px)',
    fontWeight: 900,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  joinButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  joinedButton: {
    width: '100%',
    maxWidth: '300px',
    minHeight: '92px',
    borderRadius: '30px',
    border: '3px solid rgba(214, 255, 255, 0.92)',
    background:
      'linear-gradient(180deg, rgba(34, 221, 237, 0.52) 0%, rgba(9, 77, 87, 0.78) 100%)',
    boxShadow:
      '0 0 22px rgba(0, 240, 255, 0.72), 0 0 54px rgba(0, 240, 255, 0.34), inset 0 0 18px rgba(255,255,255,0.18)',
    color: '#ffffff',
    fontSize: 'clamp(26px, 7vw, 38px)',
    fontWeight: 900,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBrand: {
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: '15px',
    lineHeight: 1.2,
    color: 'rgba(255,255,255,0.82)',
    textShadow: '0 0 12px rgba(255,255,255,0.12)',
  },
  brandStrong: {
    fontWeight: 800,
    fontSize: '18px',
  },
  brandSoft: {
    opacity: 0.9,
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(0,0,0,0.82)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18px',
  },
  modalBox: {
    width: '100%',
    maxWidth: '430px',
    minHeight: '80vh',
    background: 'rgba(2, 4, 8, 0.96)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 0 40px rgba(0,240,255,0.08)',
    padding: '26px 20px 34px',
    position: 'relative',
    overflow: 'hidden',
  },
  modalTopButton: {
    width: '100%',
    minHeight: '78px',
    borderRadius: '28px',
    border: '3px solid rgba(214, 255, 255, 0.92)',
    background:
      'linear-gradient(180deg, rgba(34, 221, 237, 0.52) 0%, rgba(9, 77, 87, 0.78) 100%)',
    boxShadow:
      '0 0 20px rgba(0, 240, 255, 0.66), 0 0 44px rgba(0, 240, 255, 0.28), inset 0 0 18px rgba(255,255,255,0.18)',
    display: 'flex',
justifyContent: 'center',
alignItems: 'center',
textAlign: 'center',
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 900,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    marginBottom: '54px',
  },
  modalInfoLine: {
    textAlign: 'center',
    fontSize: '18px',
    lineHeight: 1.35,
    letterSpacing: '0.02em',
    color: 'rgba(255,255,255,0.94)',
    marginBottom: '30px',
    textTransform: 'uppercase',
  },
  modalJoinTitle: {
    textAlign: 'center',
    color: '#39f6ff',
    fontSize: '30px',
    lineHeight: 1.1,
    fontWeight: 800,
    textTransform: 'uppercase',
    textShadow: '0 0 16px rgba(0,240,255,0.32)',
    marginBottom: '58px',
  },
  modalAcceptButton: {
    width: '100%',
    minHeight: '92px',
    borderRadius: '30px',
    border: '3px solid rgba(214, 255, 255, 0.92)',
    background:
      'linear-gradient(180deg, rgba(34, 221, 237, 0.52) 0%, rgba(9, 77, 87, 0.78) 100%)',
    boxShadow:
      '0 0 22px rgba(0, 240, 255, 0.72), 0 0 54px rgba(0, 240, 255, 0.34), inset 0 0 18px rgba(255,255,255,0.18)',
    color: '#ffffff',
    fontSize: 'clamp(30px, 8vw, 48px)',
    fontWeight: 900,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginBottom: '28px',
  },
  modalAcceptButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  gdprRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '10px',
    textAlign: 'center',
    marginBottom: '18px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginTop: '6px',
    flexShrink: 0,
  },
  gdprText: {
    fontSize: '16px',
    lineHeight: 1.3,
    color: 'rgba(255,255,255,0.92)',
  },
  modalCancel: {
    display: 'block',
    margin: '0 auto',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.68)',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default JoinPage;