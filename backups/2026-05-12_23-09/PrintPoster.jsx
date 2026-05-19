import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import americanaBadge from '../assets/round-badges/americana.png';
import rockBadge from '../assets/round-badges/rock.png';
import rapBadge from '../assets/round-badges/rap.png';
import bluesBadge from '../assets/round-badges/blues.png';
import acousticBadge from '../assets/round-badges/acoustic.png';
import grungeBadge from '../assets/round-badges/grunge.png';
import popBadge from '../assets/round-badges/pop.png';
import heavyMetalBadge from '../assets/round-badges/heavymetal.png';

const EVENT_STORAGE_KEY = 'codenxt_event';
const REWARD_STORAGE_KEY = 'codenxt_reward';
const badgeAssets = {
  americana: americanaBadge,
  rock: rockBadge,
  blues: bluesBadge,
  acoustic: acousticBadge,
  grunge: grungeBadge,
  pop: popBadge,
  heavymetal: heavyMetalBadge,

  // Bakoverkompatibilitet med eksisterende template-navn
  folk: acousticBadge,
  punk: grungeBadge,
  hiphop: rapBadge,
};

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
  const badgeConfig = useMemo(() => {
    try {
      const saved = localStorage.getItem('codenxt_badge_config');
      return saved ? JSON.parse(saved) : { template: 'americana' };
    } catch {
      return { template: 'americana' };
    }
  }, []);
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

    const canvas = qrMountRef.current;
    const qr = QRCode.create(eventData.qrUrl, {
      errorCorrectionLevel: 'H',
      margin: 0,
    });

    const ctx = canvas.getContext('2d');
    const size = 211;
    const moduleCount = qr.modules.size;

    const center = size / 2;
    const outerRadius = size / 2;

    const coreScale = 0.60;
    const coreSize = size * coreScale;
    const moduleSize = coreSize / moduleCount;
    const coreOffset = (size - coreSize) / 2 + 4;

    const coreLeft = coreOffset;
    const coreTop = coreOffset;
    const coreRight = coreOffset + coreSize;
    const coreBottom = coreOffset + coreSize;

    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();
    ctx.arc(center, center + 4, outerRadius - moduleSize * 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';

    const lureCenterY = center + 9;
    const safeMargin = moduleSize * 1.8;
    const totalFragments = 950;

    for (let i = 0; i < totalFragments; i += 1) {
      const a = Math.sin(i * 12.9898) * 43758.5453;
      const b = Math.sin(i * 78.233) * 24634.6345;
      const c = Math.sin(i * 37.719) * 91827.1827;

      const r1 = a - Math.floor(a);
      const r2 = b - Math.floor(b);
      const r3 = c - Math.floor(c);

      const angle = r1 * Math.PI * 2;
      const radius = Math.sqrt(r2) * (outerRadius - moduleSize * 1.4);

      const cx = center + Math.cos(angle) * radius;
      const cy = lureCenterY + Math.sin(angle) * radius;

      const insideQrSquare =
        cx > coreLeft - safeMargin &&
        cx < coreRight + safeMargin &&
        cy > coreTop - safeMargin &&
        cy < coreBottom + safeMargin;

      if (insideQrSquare) continue;

      const dist = Math.hypot(cx - center, cy - center);
      if (dist > outerRadius - moduleSize * 1.2) continue;

      const fragmentSize = moduleSize * (1.10 + r3 * 0.45);

      ctx.fillRect(
        cx - fragmentSize / 2,
        cy - fragmentSize / 2,
        fragmentSize,
        fragmentSize
      );
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(coreLeft, coreTop, coreSize, coreSize);

    const isFinderArea = (row, col) => {
      const last = moduleCount - 7;
      return (
        (row < 7 && col < 7) ||
        (row < 7 && col >= last) ||
        (row >= last && col < 7)
      );
    };

    ctx.fillStyle = '#000000';

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        if (!qr.modules.get(row, col)) continue;
        if (isFinderArea(row, col)) continue;

        const x = coreOffset + col * moduleSize;
        const y = coreOffset + row * moduleSize;

        ctx.fillRect(
          x + moduleSize * 0.04,
          y + moduleSize * 0.04,
          moduleSize * 0.92,
          moduleSize * 0.92
        );
      }
    }

    const drawFinder = (col, row) => {
      const x = coreOffset + col * moduleSize;
      const y = coreOffset + row * moduleSize;

      ctx.fillStyle = '#000000';
      ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);

      ctx.fillStyle = '#000000';
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
    };

    drawFinder(0, 0);
    drawFinder(moduleCount - 7, 0);
    drawFinder(0, moduleCount - 7);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = moduleSize * 1.4;
    ctx.strokeRect(
      coreLeft - moduleSize * 0.7,
      coreTop - moduleSize * 0.7,
      coreSize + moduleSize * 1.4,
      coreSize + moduleSize * 1.4
    );

    ctx.restore();

    const timer = window.setTimeout(() => {
      setIsReadyToPrint(true);
    }, 300);

    return () => window.clearTimeout(timer);
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
        <div style={styles.topBrandLine}>
  <span style={styles.brandCodeTone}>codeTone</span>
  <span style={styles.brandPowered}> powered by </span>
  <span style={styles.brandCodeNxt}>codeNXT</span>
</div>

        <header style={styles.header}>
          <h1 style={styles.artistName}>
            {String(eventData.artistName || 'ARTIST NAME').toUpperCase()}
          </h1>
        </header>

        <main style={styles.main}>
          <div style={styles.frameWrap}>
<img
  src={badgeAssets[badgeConfig.template] || americanaBadge}
  alt="InnerCircle badge"
  style={styles.frameImage}
/>
            <div style={styles.qrPlacementSquare}>
              <canvas ref={qrMountRef} style={styles.qrMount} />
            </div>
          </div>

          <div style={styles.textBlock}>
            <div style={styles.mainLine}>SCAN TO ACCESS YOUR DIGITAL SOUVENIR</div>
            <div style={styles.activeLine}>ACTIVE AFTER THE SHOW</div>
            <div style={styles.tierLine}>
  GOLD • SILVER • GENERAL
</div>

<div style={styles.tierSubLine}>
  ACCESS DEPENDS ON WHEN YOU SCAN
</div>
          {eventData?.artistLogo && (
          <div style={styles.artistLogoPosterWrap}>
          <img
          src={eventData.artistLogo}
          alt="Artist logo"
      style={styles.artistLogoPoster}
    />
  </div>
)}
          </div>
        </main>

        <footer style={styles.footer}>
          <div style={styles.footerRule} />
          <div style={styles.footerLine}>{footerLine.toUpperCase()}</div>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#ffffff',
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
    color: '#000000',
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
background: '#ffffff',
border: '1px solid rgba(0,0,0,0.08)',
boxShadow: 'none',
  },

backgroundTexture: {
  display: 'none',
},

  header: {
    position: 'relative',
    zIndex: 2,
    paddingTop: '36px',
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
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  frameWrap: {
    position: 'relative',
    width: '470px',
    height: '470px',
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
    width: '209px',
    height: '209px',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

qrMount: {
  width: '97%',
  height: '97%',
  background: 'transparent',
  display: 'block',
  overflow: 'hidden',
  borderRadius: '50%',
  transform: 'translate(-2px, -6px)',
},
  textBlock: {
    marginTop: '6px',
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
    marginTop: '8px',
    fontSize: '28px',
    lineHeight: 1.1,
    fontWeight: 900,
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    color: '#16d7e6',
  },
  tierLine: {
    marginTop: '10px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 900,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: '#c6a04a',
  },

  tierSubLine: {
    marginTop: '3px',
    textAlign: 'center',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#5c5c5c',
  },
  artistNamePoster: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 700,
    letterSpacing: '1.2px',
    color: '#000000',
  },

  artistLogoPosterWrap: {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '8px',
},

artistLogoPoster: {
  display: 'block',
  width: '200px',
  maxWidth: '70%',
  maxHeight: '58px',
  objectFit: 'contain',
  margin: '8px auto 0 auto',
},
  topBrandLine: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    marginBottom: '10px',
    fontSize: '12px',
    lineHeight: 1,
    textAlign: 'center',
  },
    footer: {
    position: 'relative',
    zIndex: 2,
    marginTop: '0px',
    paddingBottom: '0px',
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
    marginTop: '6px',
    fontSize: '10px',
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