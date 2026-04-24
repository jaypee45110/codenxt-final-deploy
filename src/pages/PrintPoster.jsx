import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import QRCodeStyling from 'qr-code-styling';
import frameImg from '../assets/innercircle-frame.png';

const EVENT_STORAGE_KEY = 'codenxt_event';
const REWARD_STORAGE_KEY = 'codenxt_reward';

function formatEventDate(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function buildJoinUrl({ eventCode, lang = 'en', qrUrl }) {
  if (qrUrl && typeof qrUrl === 'string' && qrUrl.trim()) {
    return qrUrl.trim();
  }

  if (!eventCode) return '';
  return `${window.location.origin}/join/${encodeURIComponent(eventCode)}?lang=${encodeURIComponent(lang)}`;
}

function resolveEventData(locationState, eventCodeFromRoute) {
  const fromLocation = locationState?.eventData || locationState || null;

  let fromStorage = null;
  try {
    const rawEvent = localStorage.getItem(EVENT_STORAGE_KEY);
    if (rawEvent) fromStorage = JSON.parse(rawEvent);
  } catch (error) {
    console.warn('Could not parse codenxt_event from localStorage:', error);
  }

  let rewardData = null;
  try {
    const rawReward = localStorage.getItem(REWARD_STORAGE_KEY);
    if (rawReward) rewardData = JSON.parse(rawReward);
  } catch (error) {
    console.warn('Could not parse codenxt_reward from localStorage:', error);
  }

  const merged = {
    ...(fromStorage || {}),
    ...(rewardData || {}),
    ...(fromLocation || {}),
  };

  const finalEventCode = eventCodeFromRoute || merged.eventCode || merged.code || '';
  const artistName = merged.artistName || merged.artist || merged.eventName || 'ARTIST NAME';
  const venue = merged.venue || merged.location || merged.place || 'VENUE';
  const eventDate = merged.eventDate || merged.date || merged.startDate || merged.startAt || '';
  const lang = merged.lang || 'en';

  const qrUrl = buildJoinUrl({
    eventCode: finalEventCode,
    lang,
    qrUrl: merged.qrUrl || merged.joinUrl || merged.url,
  });

  return {
    ...merged,
    artistName,
    venue,
    eventDate,
    eventCode: finalEventCode,
    lang,
    qrUrl,
  };
}

export default function PrintPoster() {
  const { eventCode: eventCodeFromRoute = '' } = useParams();
  const location = useLocation();

  const qrMountRef = useRef(null);
  const hasTriggeredPrintRef = useRef(false);
  const [isReadyToPrint, setIsReadyToPrint] = useState(false);

  const eventData = useMemo(() => {
    return resolveEventData(location.state, eventCodeFromRoute);
  }, [location.state, eventCodeFromRoute]);

  const formattedDate = useMemo(() => formatEventDate(eventData.eventDate), [eventData.eventDate]);

  const footerLine = useMemo(() => {
    if (eventData.venue && formattedDate) return `${eventData.venue} • ${formattedDate}`;
    if (eventData.venue) return eventData.venue;
    if (formattedDate) return formattedDate;
    return 'VENUE • DATE';
  }, [eventData.venue, formattedDate]);

  useEffect(() => {
    if (!qrMountRef.current || !eventData.qrUrl) return;

    qrMountRef.current.innerHTML = '';
while (qrMountRef.current.firstChild) {
  qrMountRef.current.removeChild(qrMountRef.current.firstChild);
}

const qr = new QRCodeStyling({
  width: 166,
  height: 166,
  type: 'svg',
  data: eventData.qrUrl,
  margin: 1,

  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'H',
  },

  dotsOptions: {
    color: '#000000',
    type: 'square',
  },

  cornersSquareOptions: {
    color: '#000000',
    type: 'square',
  },

  cornersDotOptions: {
    color: '#000000',
    type: 'square',
  },

  backgroundOptions: {
    color: '#F2EBDC',
  },
});
    qr.append(qrMountRef.current);

    const timer = window.setTimeout(() => {
      setIsReadyToPrint(true);
    }, 300);

    return () => {
      window.clearTimeout(timer);
      if (qrMountRef.current) {
        qrMountRef.current.innerHTML = '';
      }
    };
  }, [eventData.qrUrl]);

  useEffect(() => {
    if (!isReadyToPrint || hasTriggeredPrintRef.current) return;

    hasTriggeredPrintRef.current = true;

    const timer = window.setTimeout(() => {
      window.print();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [isReadyToPrint]);

  return (
    <div style={styles.page}>
      <style>{printCss}</style>

      <div style={styles.poster} className="print-poster">
        <div style={styles.backgroundTexture} />

        <header style={styles.header}>
          <h1 style={styles.artistName}>
            {String(eventData.artistName || 'ARTIST NAME').toUpperCase()}
          </h1>
        </header>

        <main style={styles.main}>
          <div style={styles.frameWrap}>
            <img src={frameImg} alt="InnerCircle frame" style={styles.frameImage} />

            <div style={styles.qrPlacementSquare}>
              <div ref={qrMountRef} style={styles.qrMount} />
            </div>
          </div>

          <div style={styles.textBlock}>
            <div style={styles.mainLine}>SCAN TO ACCESS YOUR DIGITAL SOUVENIR</div>
            <div style={styles.activeLine}>ACTIVE AFTER THE SHOW</div>
          </div>
        </main>

        <footer style={styles.footer}>
          <div style={styles.footerRule} />
          <div style={styles.footerLine}>{footerLine.toUpperCase()}</div>
          <div style={styles.brandLine}>
            <span style={styles.brandCodeTone}>codeTone</span>
            <span style={styles.brandPowered}> powered by </span>
            <span style={styles.brandCodeNxt}>codeNXT</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '24px 0',
    boxSizing: 'border-box',
  },

  poster: {
    position: 'relative',
    width: '794px',
    minHeight: '1123px',
    overflow: 'hidden',
    color: '#ffffff',
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    background:
      'radial-gradient(circle at 50% 14%, rgba(67,110,191,0.24), transparent 28%), linear-gradient(180deg, #071121 0%, #03070d 100%)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
  },

  backgroundTexture: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.72,
    background:
      'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.09), transparent 16%), radial-gradient(circle at 78% 26%, rgba(255,255,255,0.08), transparent 18%), radial-gradient(circle at 26% 72%, rgba(255,255,255,0.06), transparent 18%), radial-gradient(circle at 72% 78%, rgba(255,255,255,0.06), transparent 18%)',
  },

  header: {
    position: 'relative',
    zIndex: 2,
    paddingTop: '70px',
    textAlign: 'center',
  },

  artistName: {
    margin: 0,
    fontSize: '78px',
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: '-0.03em',
    textTransform: 'uppercase',
  },

  main: {
    position: 'relative',
    zIndex: 2,
    marginTop: '52px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  frameWrap: {
    position: 'relative',
    width: '520px',
    height: '520px',
  },

  frameImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },

  qrPlacementSquare: {
    position: 'absolute',
    left: '50%',
    top: '51%',
    width: '156px',
    height: '156px',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

qrMount: {
  width: '100%',
  height: '100%',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},
  textBlock: {
    marginTop: '36px',
    textAlign: 'center',
    padding: '0 64px',
  },

  mainLine: {
    fontSize: '35px',
    lineHeight: 1.08,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
  },

  activeLine: {
    marginTop: '18px',
    fontSize: '31px',
    lineHeight: 1.1,
    fontWeight: 900,
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    color: '#16d7e6',
  },

  footer: {
    position: 'relative',
    zIndex: 2,
    marginTop: '62px',
    paddingBottom: '58px',
    textAlign: 'center',
  },

  footerRule: {
    width: '420px',
    height: '1px',
    background: 'rgba(255,255,255,0.28)',
    margin: '0 auto 28px auto',
  },

  footerLine: {
    fontSize: '29px',
    lineHeight: 1.12,
    fontWeight: 800,
    letterSpacing: '-0.015em',
    textTransform: 'uppercase',
  },

  brandLine: {
    marginTop: '24px',
    fontSize: '18px',
    lineHeight: 1,
  },

  brandCodeTone: {
    fontWeight: 700,
  },

  brandPowered: {
    fontWeight: 400,
  },

  brandCodeNxt: {
    fontWeight: 800,
  },
};

const printCss = `
  @page {
    size: A4 portrait;
    margin: 0;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #000;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .print-poster {
    width: 210mm !important;
    min-height: 297mm !important;
    box-shadow: none !important;
    margin: 0 auto !important;
  }

  @media print {
    html, body {
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      background: #000;
    }

    body * {
      visibility: hidden;
    }

    .print-poster,
    .print-poster * {
      visibility: visible;
    }

    .print-poster {
      position: absolute;
      left: 0;
      top: 0;
      margin: 0 !important;
    }
  }
`;