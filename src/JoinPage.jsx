import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import { t } from './i18n';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

const bonusCopy = {
  no: {
    
    headlineLine1: 'LÅS OPP OG FÅ',
    headlineLine2: 'EKSKLUSIVT INNHOLD',listened: 'LÅS OPP OG FÅ',
    andGet: 'OG FÅR',
    bonus: 'VERIFISERT FORDEL',
    gold: 'GULL',
    silver: 'SØLV',
    general: 'GENERELL',
    insideTitle: 'codePerks-info',
    insideText: 'Få relevant informasjon om denne fordelen direkte på telefonen.',
    phone: 'Mobilnummer',
    confirm: 'KOM INSIDE',
    joined: 'VELKOMMEN INSIDE',
    date: 'Dato',
    consent: 'Jeg samtykker til å motta relevant informasjon og oppdateringer fra denne siden. Se personvernpolicy.',
    privacyLink: 'Personvernpolicy',
    ownershipKicker: 'VERIFISERT FORDEL',
    ownershipLabel: 'Sertifikat-ID',
    ownershipDescription: 'Denne fordelen er registrert og kan verifiseres i codePerks-nettverket.'
    ownershipIssued: 'Utstedt',
    claimReward: 'SE / KREV FORDEL',
    availableBenefits: 'TILGJENGELIGE FORDELER',
    left: 'IGJEN',
    fullyClaimed: 'FULLT TILDELT',
    benefitNotOpenTitle: 'BONUSKAMPANJEN ER IKKE ÅPEN ENNÅ',
    benefitNotOpenBody: 'Du kan skanne og motta din fordel fra {start} til {end}.',
    benefitClosedTitle: 'BEKLAGER, DU VAR FOR SENT UTE',
    benefitClosedBody: 'Denne bonuskampanjen ble avsluttet {end}.',
    benefitClaimUntil: 'Krav/innløsning kan gjøres innen {claimUntil}.',
  },
  en: {
    
    headlineLine1: 'UNLOCK AND GET',
    headlineLine2: 'EXCLUSIVE CONTENT',listened: 'YOU LISTENED',
    andGet: 'AND GET',
    bonus: 'EXCLUSIVE CONTENT',
    gold: 'GOLD',
    silver: 'SILVER',
    general: 'GENERAL',
    insideTitle: 'codePerks-info',
    insideText: 'Receive exclusive updates, bonus content, and early access directly to your phone.',
    phone: 'Mobile number',
    confirm: 'COME INSIDE',
    joined: 'WELCOME INSIDE',
    date: 'Date',
    consent: 'I agree to receive relevant information and updates from this page. See privacy policy.',
    privacyLink: 'Politique de confidentialite',
    ownershipKicker: 'VERIFIED BENEFIT',
    ownershipLabel: 'Certificate ID',
    ownershipDescription: 'This verified benefit has been permanently registered in the codePerks network.',
    ownershipIssued: 'Issued',
    claimReward: 'VIEW / CLAIM REWARD',
    availableBenefits: 'AVAILABLE BENEFITS',
    left: 'LEFT',
    fullyClaimed: 'FULLY CLAIMED',
    benefitNotOpenTitle: 'BONUS CAMPAIGN NOT YET OPEN',
    benefitNotOpenBody: 'You can scan and receive your benefit from {start} until {end}.',
    benefitClosedTitle: 'SORRY, YOU WERE TOO LATE',
    benefitClosedBody: 'This bonus campaign closed on {end}.',
    benefitClaimUntil: 'Claims can be completed until {claimUntil}.',
  },
  de: {
    
    headlineLine1: 'FREISCHALTEN UND',
    headlineLine2: 'EXKLUSIVE INHALTE ERHALTEN',listened: 'DU HAST ZUGEHÖRT',
    andGet: 'UND BEKOMMST',
    bonus: 'EXKLUSIVE INHALTE',
    gold: 'GOLD',
    silver: 'SILBER',
    general: 'ALLGEMEIN',
    insideTitle: 'codePerks-info',
    insideText: 'Erhalte exklusive Updates, Bonusinhalte und frühen Zugang direkt auf dein Telefon.',
    phone: 'Mobilnummer',
    confirm: 'KOMM INSIDE',
    joined: 'WILLKOMMEN INSIDE',
    date: 'Datum',
    consent: 'Ich stimme zu, relevante Informationen und Updates von diesem Page zu erhalten. Siehe Datenschutzerklaerung.',
    privacyLink: 'Datenschutzerklaerung',
    ownershipKicker: 'VERIFIZIERTER VORTEIL',
    ownershipLabel: 'Zertifikat-ID',
    ownershipDescription: 'Dieser verifizierte Vorteil wurde dauerhaft im codePerks-Netzwerk registriert.',
    ownershipIssued: 'Ausgestellt',
    claimReward: 'REWARD ANSEHEN / EINLÖSEN',
    availableBenefits: 'VERFÜGBARE VORTEILE',
    left: 'ÜBRIG',
    fullyClaimed: 'VOLLSTÄNDIG VERGEBEN',
    benefitNotOpenTitle: 'BONUSKAMPAGNE NOCH NICHT GEÖFFNET',
    benefitNotOpenBody: 'Du kannst scannen und deinen Vorteil von {start} bis {end} erhalten.',
    benefitClosedTitle: 'LEIDER ZU SPÄT',
    benefitClosedBody: 'Diese Bonuskampagne wurde am {end} geschlossen.',
  },
  fr: {
    
    headlineLine1: 'DÉBLOQUEZ ET RECEVEZ',
    headlineLine2: 'DU CONTENU EXCLUSIF',listened: 'VOUS AVEZ ÉCOUTÉ',
    andGet: 'ET RECEVEZ',
    bonus: 'CONTENU EXCLUSIF',
    gold: 'OR',
    silver: 'ARGENT',
    general: 'GÉNÉRAL',
    insideTitle: 'codePerks-info',
    insideText: 'Recevez des mises à jour exclusives, du contenu bonus et un accès anticipé directement sur votre téléphone.',
    phone: 'Numéro mobile',
    confirm: 'ENTRER INSIDE',
    joined: 'BIENVENUE INSIDE',
    date: 'Date',
    consent: 'J’accepte de recevoir des informations et mises à jour pertinentes de cette page. Voir la politique de confidentialité.',
    ownershipKicker: 'AVANTAGE VÉRIFIÉ',
    ownershipLabel: 'ID du certificat',
    ownershipDescription: 'Cet avantage vérifié est enregistré de manière permanente dans le réseau codePerks.',
    ownershipIssued: 'Émis le',
    claimReward: 'VOIR / RÉCLAMER LE REWARD',
    availableBenefits: 'AVANTAGES DISPONIBLES',
    left: 'RESTANTS',
    fullyClaimed: 'ENTIÈREMENT ATTRIBUÉ',
  },
  es: {
    
    headlineLine1: 'DESBLOQUEA Y OBTÉN',
    headlineLine2: 'CONTENIDO EXCLUSIVO',listened: 'HAS ESCUCHADO',
    andGet: 'Y RECIBES',
    bonus: 'CONTENIDO EXCLUSIVO',
    gold: 'ORO',
    silver: 'PLATA',
    general: 'GENERAL',
    insideTitle: 'codePerks-info',
    insideText: 'Recibe actualizaciones exclusivas, contenido adicional y acceso anticipado directamente en tu teléfono.',
    phone: 'Número móvil',
    confirm: 'ENTRAR INSIDE',
    joined: 'BIENVENIDO INSIDE',
    date: 'Fecha',
    consent: 'Acepto recibir informacion y actualizaciones relevantes de este page. Ver politica de privacidad.',
    privacyLink: 'Politica de privacidad',
    ownershipKicker: 'BENEFICIO VERIFICADO',
    ownershipLabel: 'ID del certificado',
    ownershipDescription: 'Este beneficio verificado ha sido registrado permanentemente en la red codePerks.',
    ownershipIssued: 'Emitido',
    claimReward: 'VER / RECLAMAR REWARD',
    availableBenefits: 'BENEFICIOS DISPONIBLES',
    left: 'RESTANTES',
    fullyClaimed: 'TOTALMENTE ASIGNADO',
  },
};


function readSavedRelease() {
  try {
    return JSON.parse(localStorage.getItem('codenxt_event') || '{}');
  } catch {
    return {};
  }
}

function normalizeRelease(data = {}) {
  return {
    ...data,
    pageName: data.pageName || data.artistName || data.name || '',
    releaseTitle: data.releaseTitle || data.title || '',
    platform: data.platform || data.venue || '',
    releaseDate: data.releaseDate || data.eventDate || data.startAt || '',
    releaseTime: data.releaseTime || '',
    startAt: data.startAt || '',
    unlockAt: data.unlockAt || data.startAt || '',
    endAt: data.endAt || '',
    pageLogo: data.pageLogo || data.logoUrl || data.artistLogo || data.image || '',
    eventCode: data.eventCode || data.code || '',
  };
}

function openPdfDataUrl(dataUrl) {
  const byteString = atob(dataUrl.split(',')[1]);
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) ia[i] = byteString.charCodeAt(i);
  const blob = new Blob([ab], { type: mimeString || 'application/pdf' });
  window.open(URL.createObjectURL(blob), '_blank', 'noopener,noreferrer');
}

export default function JoinPage({ lang, setLang }) {
  const { eventCode } = useParams();
  const text = t(lang);
  const j = text.join;
  const b = bonusCopy[lang] || bonusCopy.no;
  const [release, setRelease] = useState(() => normalizeRelease(readSavedRelease()));
  const [reward, setReward] = useState(null);
  const [bonusTier, setBonusTier] = useState('general');
  const [status, setStatus] = useState('loading');
  const [choice, setChoice] = useState('ask');
  const [phone, setPhone] = useState('');
  const [joined, setJoined] = useState(false);
  const [consent, setConsent] = useState(false);
  const [ownershipCertificate, setOwnershipCertificate] = useState(null);
  const [benefitWindow, setBenefitWindow] = useState(null);
  const [benefitWindowStatus, setBenefitWindowStatus] = useState('open');
  const [benefitInventory, setBenefitInventory] = useState(null);

  const titleLine = useMemo(() => {
    if (release.releaseTitle && release.pageName) return `${release.pageName}: ${release.releaseTitle}`;
    return release.releaseTitle || release.pageName || 'codePerks';
  }, [release]);

  const releaseTimeLabel = useMemo(() => {
    if (release.releaseTime) return release.releaseTime;
    const rawTime = release.unlockAt || release.startAt;
    if (!rawTime) return 'the scheduled time';
    const parsed = new Date(rawTime);
    if (Number.isNaN(parsed.getTime())) return 'the scheduled time';
    return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [release.releaseTime, release.unlockAt, release.startAt]);

  const releaseDateLabel = useMemo(() => {
    const rawDate = release.releaseDate || release.startAt || release.unlockAt;
    if (!rawDate) return '';
    const parsed = new Date(rawDate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString();
    }
    return String(rawDate).slice(0, 10);
  }, [release.releaseDate, release.startAt, release.unlockAt]);

  useEffect(() => {
    document.title = 'Bonus - codePerks';
  }, []);

  useEffect(() => {
    const fetchRelease = async () => {
      if (!eventCode) {
        setStatus('missing');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/event/${eventCode}?vertical=codeperks`);
        const data = await res.json();
        const saved = readSavedRelease();
        const merged = normalizeRelease({ ...saved, ...data, eventCode: data?.code || eventCode });
        setRelease(merged);

        const unlockTime = merged.unlockAt || merged.startAt;
        if (unlockTime) {
          const unlockDate = new Date(unlockTime);
          if (!Number.isNaN(unlockDate.getTime()) && Date.now() < unlockDate.getTime()) {
            setReward(null);
            setStatus('locked');
            return;
          }
        }

        try {
          const inventoryRes = await fetch(`${API_BASE}/benefit-inventory/${encodeURIComponent(eventCode)}?vertical=codeperks`);
          if (inventoryRes.ok) {
            const inventoryData = await inventoryRes.json();
            setBenefitInventory(inventoryData?.benefitInventory || null);
          } else {
            setBenefitInventory(null);
          }
        } catch (inventoryError) {
          console.warn('Could not load benefit inventory:', inventoryError);
          setBenefitInventory(null);
        }

        const scanStorageKey = `codenxt_scan_id_${eventCode}`;
        let scanId = localStorage.getItem(scanStorageKey);
        if (!scanId) {
          scanId = `${eventCode}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          localStorage.setItem(scanStorageKey, scanId);
        }

        const scanRes = await fetch(`${API_BASE}/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vertical: 'codeperks',
            eventCode,
            scanId,
          }),
        });
        const scanData = await scanRes.json().catch(() => ({}));
        const tier = scanData?.tier || 'general';
        setBonusTier(tier);

        setReward(null);

        const campaignLang = data?.defaultLang || data?.lang || data?.language || release?.defaultLang || release?.lang || release?.language || '';
        if (campaignLang && setLang) {
          setLang(campaignLang);
        }

        setStatus('ready');
      } catch (error) {
        console.error('Could not load codePerks join page:', error);
        setStatus('missing');
      }
    };

    fetchRelease();
  }, [eventCode]);

  const submitPhone = async () => {
    if (!phone.trim() || !consent) return;

    const joinRes = await fetch(`${API_BASE}/inner-circle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone.trim(),
        eventCode,
        vertical: 'codeperks',
        source: 'codeperks_join',
        tier: bonusTier,
        consent: true,
        consentAt: new Date().toISOString(),
      }),
    });

    if (joinRes.ok) {
      const joinData = await joinRes.json();
      setBenefitWindow(joinData?.benefitWindow || null);
      setBenefitWindowStatus(joinData?.benefitWindowStatus || joinData?.benefitWindow?.status || 'open');

      if (joinData?.ownershipCertificate) {
        setOwnershipCertificate(joinData.ownershipCertificate);

        if (joinData.ownershipCertificate.benefitTier) {
          setBonusTier(joinData.ownershipCertificate.benefitTier);
        }
      } else {
        setOwnershipCertificate(null);
      }
    }

    setJoined(true);
    setChoice('joined');
  };

  const formatBenefitWindowDate = (value) => {
    if (!value) return '';
    try {
      return new Intl.DateTimeFormat(lang || undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value));
    } catch {
      return String(value);
    }
  };

  const renderBenefitWindowMessage = () => {
    if (!benefitWindow || benefitWindowStatus === 'open') return null;

    const opensAt = formatBenefitWindowDate(benefitWindow.campaignStart);
    const closesAt = formatBenefitWindowDate(benefitWindow.campaignEnd);

    const copy = {
      not_open: {
        title: j.benefitNotOpenTitle || 'Bonus campaign not yet open',
        body: j.benefitNotOpenBody || 'You can scan and receive your benefit from {start} until {end}.',
      },
      closed: {
        title: j.benefitClosedTitle || 'Sorry, you were too late',
        body: j.benefitClosedBody || 'This bonus campaign closed on {end}.',
      },
    }[benefitWindowStatus];

    if (!copy) return null;

    return (
      <div className="window-message">
        <h3>{copy.title}</h3>
        <p>
          {copy.body
            .replace('{start}', opensAt || '-')
            .replace('{end}', closesAt || '-')}
        </p>
      </div>
    );
  };

  const renderReward = () => {
    if (status === 'loading') return <p className="muted center">{j.loading}</p>;
    const benefitWindowMessage = renderBenefitWindowMessage();
    if (benefitWindowMessage) return benefitWindowMessage;

    if (status === 'locked') {
      return (
        <p className="muted center">
          {(j.bonusLocked || 'This bonus becomes available when the release is released on {date} at {time}.')
            .replace('{date}', releaseDateLabel)
            .replace('{time}', releaseTimeLabel)}
        </p>
      );
    }
    if (!ownershipCertificate || !assignedTier || !reward) {
      return (
        <p className="muted center">
          {j.rewardPending || 'Fordelen vises på sertifikatet etter registrering.'}
        </p>
      );
    }

    const expectedTier = assignedTier || bonusTier || '';
    const actualTier = reward?.tier || '';

    if (expectedTier && actualTier && actualTier !== expectedTier) {
      return (
        <p className="muted center">
          {j.rewardPending || 'Fordelen vises på sertifikatet etter registrering.'}
        </p>
      );
    }

    if (reward.type === 'image') return <img src={reward.url} alt={reward.title || ''} className="join-media" />;
    if (reward.type === 'video') return <video src={reward.url} controls playsInline className="join-media" />;
    if (reward.type === 'audio') return <audio src={reward.url} controls className="join-audio" />;
    if (reward.type === 'pdf') {
      return (
        <button
          type="button"
          className="secondary-button full-width"
          onClick={() => {
            try {
              reward.url?.startsWith('data:') ? openPdfDataUrl(reward.url) : window.open(reward.url, '_blank', 'noopener,noreferrer');
            } catch {
              window.open(reward.url, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          {j.openPdf}
        </button>
      );
    }
    if (reward.type === 'url') {
      return (
        <a href={reward.url} target="_blank" rel="noreferrer" className="secondary-button full-width">
          {j.openLink}
        </a>
      );
    }
    if (reward.type === 'text') return <div className="text-reward">{reward.content || reward.title}</div>;
    return null;
  };

  const assignedTier = ownershipCertificate?.benefitTier || ownershipCertificate?.tier || '';
  const tierText = assignedTier ? (b[assignedTier] || b.general) : (b.verifiedBenefit || 'VERIFIED BENEFIT');

  useEffect(() => {
    let alive = true;

    async function loadAssignedTierReward() {
      try {
        const rewardEventId =
          ownershipCertificate?.eventId ||
          release?.id ||
          release?.eventId ||
          '';

        const rewardTier = assignedTier || bonusTier || '';

        if (!rewardEventId || !rewardTier) return;

        setReward(null);

        const rewardRes = await fetch(`${API_BASE}/reward/${encodeURIComponent(rewardEventId)}?tier=${encodeURIComponent(rewardTier)}&vertical=codeperks`);
        if (!rewardRes.ok) return;

        const rewardData = await rewardRes.json().catch(() => null);

        if (alive) {
          setReward(rewardData && (rewardData.title || rewardData.content || rewardData.url) ? rewardData : null);
        }
      } catch (error) {
        console.warn('Could not load assigned tier reward:', error);
      }
    }

    loadAssignedTierReward();

    return () => {
      alive = false;
    };
  }, [ownershipCertificate?.eventId, release?.id, release?.eventId, assignedTier, bonusTier]);

  const normalizedDetailsTier = assignedTier === 'standard' ? 'standard' : assignedTier;
  const currentBonusDetails =
    release?.bonusDetails?.[normalizedDetailsTier] ||
    (assignedTier === 'standard' ? release?.bonusDetails?.general : null) ||
    null;
  const releaseDate = release.releaseDate ? String(release.releaseDate).slice(0, 10) : '';
  const pageLogo = release.pageLogo || '/codePerks-logo.png?v=3';

  return (
    <main className="join-page bonus-page">
      <style>{`
        .bonus-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 24px 14px 42px;
          background:
            radial-gradient(circle at 50% 0%, rgba(226,196,122,.16), transparent 34%),
            linear-gradient(180deg, #050505 0%, #0b0906 55%, #050505 100%);
          color: #f3e4bf;
        }

        .bonus-card {
          width: min(720px, 100%);
          text-align: center;
          border: 1px solid rgba(226,196,122,.24);
          border-radius: 28px;
          background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018));
          box-shadow: 0 28px 70px rgba(0,0,0,.50), inset 0 1px 0 rgba(255,255,255,.07);
          padding: 24px;
        }

        .bonus-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
        }

        .bonus-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.64);
          font-size: 12px;
          font-weight: 800;
        }

        .bonus-brand img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .bonus-claim {
          margin: 12px 0 26px;
        }

        .bonus-claim .line-one,
        .bonus-claim .line-two {
          margin: 0;
          font-size: clamp(22px, 5.8vw, 42px);
          line-height: 0.98;
          font-weight: 950;
          letter-spacing: 0.035em;
        }

        .bonus-claim .line-three {
          margin: 12px 0 0;
          color: #e2c47a;
          font-size: clamp(24px, 6.2vw, 46px);
          line-height: 0.98;
          font-weight: 950;
          letter-spacing: 0.035em;
          text-shadow: none;
        }

        .release-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin: 0 auto 24px;
          padding: 20px;
          border-radius: 22px;
          background: rgba(0,0,0,.22);
          border: 1px solid rgba(226,196,122,.24);
        }

        .release-logo {
          width: min(78vw, 340px);
          max-width: min(78vw, 340px);
          max-height: 460px;
          height: auto;
          object-fit: contain;
          margin: 10px auto 18px;
          display: block;
        }

        .release-title {
          margin: 0;
          font-size: clamp(22px, 5vw, 34px);
          font-weight: 950;
          color: #f3e4bf;
        }

        .release-name-line,
        .release-date {
          margin: 0;
          color: rgba(243,228,191,.82);
          font-size: 14px;
          font-weight: 700;
        }

        .bonus-content {
          margin: 0 auto 24px;
          padding: 18px;
          border-radius: 22px;
          background: rgba(0,0,0,.30);
          border: 1px solid rgba(226,196,122,.24);
        }

        .bonus-content-title {
          margin: 0 0 14px;
          color: #e2c47a;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }


        .claim-location-box {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 12px !important;
          margin-top: 16px !important;
          padding: 14px !important;
          border-radius: 16px !important;
          background: rgba(0,0,0,.24) !important;
          border: 1px solid rgba(226,196,122,.24) !important;
        }

        .claim-location-box span,
        .claim-location-box strong {
          display: block !important;
        }

        .claim-location-box span {
          margin-bottom: 6px !important;
          color: #e2c47a !important;
          -webkit-text-fill-color: #e2c47a !important;
          font-size: 11px !important;
          font-weight: 950 !important;
          letter-spacing: .09em !important;
          text-transform: uppercase !important;
        }

        .claim-location-box strong {
          color: #f3e4bf !important;
          -webkit-text-fill-color: #f3e4bf !important;
          font-size: 14px !important;
          line-height: 1.35 !important;
          word-break: break-word !important;
        }

        @media (max-width: 520px) {
          .claim-location-box {
            grid-template-columns: 1fr !important;
          }
        }


        .inside-box {
          margin-top: 24px;
          padding: 20px;
          border-radius: 22px;
          background: rgba(0,0,0,.24);
          border: 1px solid rgba(226,196,122,.24);
        }

        .inside-box h2 {
          margin: 0 0 8px;
          color: #e2c47a;
          font-size: 28px;
          font-weight: 950;
        }

        .inside-box p {
          margin: 0 0 14px;
          color: rgba(243,228,191,.80);
          font-size: 14px;
          line-height: 1.45;
        }

        .phone-flow {
          display: grid;
          gap: 10px;
        }

        .phone-flow input {
          width: 100%;
          box-sizing: border-box;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(0,0,0,0.34);
          color: #f3e4bf;
          padding: 14px 16px;
          font-size: 16px;
          text-align: center;
        }

        .primary-cta,
        .secondary-button {
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .complete-box {
          border-radius: 18px;
          padding: 18px;
          background: rgba(0, 240, 255, 0.10);
          border: 1px solid rgba(0, 240, 255, 0.22);
        }

        .complete-box h2 {
          margin: 0 0 8px;
          color: #e2c47a;
        }

        .privacy-text {
          margin-top: 12px;
          font-size: 11px;
          color: rgba(255,255,255,0.48);
          line-height: 1.45;
        }

        @media (max-width: 620px) {
          .bonus-card {
            padding: 18px;
            border-radius: 22px;
          }

          .bonus-top {
            flex-direction: column;
          }
        }

        .bonus-top {
          display: flex;
          justify-content: center !important;
          align-items: center;
          margin-bottom: 22px;
        }

        .bonus-top .language-switcher,
        .bonus-top > * {
          margin: 0 auto !important;
        }

        .bonus-top .language-switcher {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          gap: clamp(8px, 3vw, 16px) !important;
          flex-wrap: nowrap !important;
        }

        .bonus-top .flag-button {
          width: clamp(42px, 13vw, 58px) !important;
          height: clamp(42px, 13vw, 58px) !important;
          font-size: clamp(22px, 7vw, 30px) !important;
          flex: 0 0 auto !important;
        }

        /* codePerks final join override */
        .bonus-page,
        .join-page.bonus-page {
          background:
            radial-gradient(circle at 50% -12%, rgba(226,196,122,.14), transparent 28rem),
            radial-gradient(circle at 90% 72%, rgba(184,141,67,.08), transparent 24rem),
            linear-gradient(180deg, #050505 0%, #0b0906 55%, #050505 100%) !important;
          color: #e2c47a !important;
        }

        .bonus-card {
          background:
            linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018)) !important;
          border: 1px solid rgba(226,196,122,.30) !important;
          box-shadow:
            0 28px 70px rgba(0,0,0,.52),
            inset 0 1px 0 rgba(255,255,255,.07) !important;
        }

        .bonus-claim .line-one,
        .bonus-claim .line-two,
        .bonus-claim .line-three,
        .release-title,
        .bonus-content-title,
        .inside-box h2 {
          color: #e2c47a !important;
          -webkit-text-fill-color: #e2c47a !important;
          text-shadow: 0 2px 14px rgba(0,0,0,.55) !important;
        }

        .release-name-line,
        .release-date,
        .inside-box p,
        .privacy-text,
        .muted {
          color: rgba(243,228,191,.82) !important;
          -webkit-text-fill-color: rgba(243,228,191,.82) !important;
        }

        .release-block,
        .bonus-content,
        .inside-box,
        .complete-box {
          background: rgba(0,0,0,.24) !important;
          border: 1px solid rgba(226,196,122,.24) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.05) !important;
        }

        .bonus-brand,
        .bonus-brand span {
          color: #f3e4bf !important;
          -webkit-text-fill-color: #f3e4bf !important;
        }

        .bonus-brand img,
        .release-logo {
          filter:
            drop-shadow(0 0 12px rgba(226,196,122,.20))
            drop-shadow(0 0 28px rgba(0,0,0,.70)) !important;
        }

        .phone-flow input {
          background: rgba(255,255,255,.045) !important;
          border: 1px solid rgba(226,196,122,.26) !important;
          color: #f3e4bf !important;
          -webkit-text-fill-color: #f3e4bf !important;
        }

        .phone-flow input::placeholder {
          color: rgba(243,228,191,.46) !important;
          -webkit-text-fill-color: rgba(243,228,191,.46) !important;
        }

        .primary-cta,
        .secondary-button {
          background: linear-gradient(135deg, #f3e4bf 0%, #d8bd78 48%, #b88d43 100%) !important;
          color: #090806 !important;
          -webkit-text-fill-color: #090806 !important;
          border: 1px solid rgba(246,237,220,.30) !important;
          box-shadow:
            0 0 30px rgba(226,196,122,.22),
            0 12px 30px rgba(0,0,0,.42) !important;
        }

        .primary-cta *,
        .secondary-button * {
          color: #090806 !important;
          -webkit-text-fill-color: #090806 !important;
        }

        .join-media {
          border-radius: 14px !important;
          box-shadow: 0 18px 44px rgba(0,0,0,.45) !important;
        }


        /* codePerks final mobile join correction */
        body .join-page.bonus-page {
          background:
            radial-gradient(circle at 50% -14%, rgba(226,196,122,.12), transparent 24rem),
            linear-gradient(180deg, #050505 0%, #080706 54%, #050505 100%) !important;
        }

        body .join-page .bonus-card {
          background:
            linear-gradient(145deg, #070707 0%, #11100d 52%, #070707 100%) !important;
          border: 1px solid rgba(226,196,122,.34) !important;
          color: #e2c47a !important;
          -webkit-text-fill-color: #e2c47a !important;
        }

        body .join-page .release-block,
        body .join-page .bonus-content,
        body .join-page .inside-box,
        body .join-page .complete-box {
          background: rgba(0,0,0,.32) !important;
          border: 1px solid rgba(226,196,122,.26) !important;
          color: #e2c47a !important;
          -webkit-text-fill-color: #e2c47a !important;
        }

        body .join-page .bonus-claim .line-one,
        body .join-page .bonus-claim .line-two,
        body .join-page .bonus-claim .line-three,
        body .join-page .release-title,
        body .join-page .release-name-line,
        body .join-page .release-date,
        body .join-page .bonus-content-title,
        body .join-page .inside-box h2,
        body .join-page .inside-box p,
        body .join-page .privacy-text,
        body .join-page .complete-box h2,
        body .join-page .complete-box p {
          color: #e2c47a !important;
          -webkit-text-fill-color: #e2c47a !important;
        }

        body .join-page .bonus-claim .line-one,
        body .join-page .bonus-claim .line-three {
          font-size: clamp(22px, 6vw, 38px) !important;
          line-height: 1.05 !important;
          letter-spacing: .035em !important;
        }

        body .join-page .release-logo {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          max-width: min(70vw, 220px) !important;
          margin-bottom: 10px !important;
        }

        body .join-page .join-media {
          max-width: 100% !important;
          border-radius: 10px !important;
          background: transparent !important;
        }

        body .join-page input {
          background: rgba(255,255,255,.045) !important;
          border: 1px solid rgba(226,196,122,.28) !important;
          color: #f3e4bf !important;
          -webkit-text-fill-color: #f3e4bf !important;
        }

        body .join-page input::placeholder {
          color: rgba(243,228,191,.55) !important;
          -webkit-text-fill-color: rgba(243,228,191,.55) !important;
        }

        body .join-page .primary-cta,
        body .join-page .secondary-button {
          background: linear-gradient(135deg, #f3e4bf 0%, #d8bd78 52%, #b88d43 100%) !important;
          color: #090806 !important;
          -webkit-text-fill-color: #090806 !important;
          border: 1px solid rgba(246,237,220,.32) !important;
        }

        body .join-page .primary-cta *,
        body .join-page .secondary-button * {
          color: #090806 !important;
          -webkit-text-fill-color: #090806 !important;
        }


        /* codePerks phone field */
        body .join-page .phone-flow input,
        body .join-page input[type="tel"] {
          background: linear-gradient(
            135deg,
            #f3e4bf 0%,
            #d8bd78 52%,
            #b88d43 100%
          ) !important;
          border: 1px solid rgba(246,237,220,.38) !important;
          color: #2f1f13 !important;
          -webkit-text-fill-color: #2f1f13 !important;
          font-weight: 700 !important;
        }

        body .join-page .phone-flow input::placeholder,
        body .join-page input[type="tel"]::placeholder {
          color: rgba(47,31,19,.55) !important;
          -webkit-text-fill-color: rgba(47,31,19,.55) !important;
        }


        /* codePerks GDPR checkbox */
        body .join-page input[type="checkbox"] {
          accent-color: #d8bd78 !important;
          width: 18px !important;
          height: 18px !important;
          cursor: pointer !important;
        }


        /* codePerks GDPR checkbox centered + champagne */
        body .join-page input[type="checkbox"] {
          accent-color: #d8bd78 !important;
          width: 18px !important;
          height: 18px !important;
          display: block !important;
          margin: 0 auto !important;
          cursor: pointer !important;
          filter: brightness(1.08) !important;
        }

        body .join-page label:has(input[type="checkbox"]),
        body .join-page .checkbox-row,
        body .join-page .consent-row {
          text-align: center !important;
          justify-content: center !important;
          align-items: center !important;
        }


        body .join-page .availability-box {
          margin: 16px 0 18px;
          padding: 14px;
          border-radius: 18px;
          border: 1px solid rgba(214, 162, 72, .36);
          background: rgba(0,0,0,.24);
        }

        body .join-page .availability-title {
          margin-bottom: 10px;
          color: rgba(255, 225, 151, .82);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        body .join-page .availability-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        body .join-page .availability-card {
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.04);
        }

        body .join-page .availability-card span {
          display: block;
          margin-bottom: 6px;
          color: rgba(255,255,255,.55);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        body .join-page .availability-card strong {
          display: block;
          color: #fff1bf;
          font-size: 24px;
          line-height: 1;
        }

        body .join-page .ownership-label {
          margin-top: 10px !important;
          font-size: 11px !important;
          font-weight: 800 !important;
          opacity: .76 !important;
        }

        body .join-page .ownership-description {
          margin-top: 12px !important;
          max-width: 300px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          font-size: 12px !important;
          line-height: 1.45 !important;
          font-weight: 700 !important;
          opacity: .86 !important;
        }

        body .join-page .ownership-issued {
          margin-top: 12px !important;
          font-size: 11px !important;
          font-weight: 900 !important;
          opacity: .82 !important;
        }

        body .join-page .window-status-card {
          margin: 18px 0;
          padding: 18px;
          border-radius: 16px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          text-align: center;
        }

        body .join-page .window-status-card h2 {
          margin: 0 0 10px;
          font-size: 16px;
          letter-spacing: .08em;
        }

        body .join-page .window-status-card p {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          opacity: .9;
        }

        body .join-page .window-claim-note {
          margin-top: 10px !important;
          color: #fff1bf;
          font-weight: 800;
        }

      `}</style>

      <section className="bonus-card">
        <header className="bonus-top">
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </header>

        <section className="bonus-claim">
          <p className="line-one">{b.headlineLine1 || b.listened}</p>
          <p className="line-three">{assignedTier ? `${tierText} ${b.bonus}` : (b.verifiedBenefit || 'VERIFIED BENEFIT')}</p>
        </section>

        <section className="release-block">
          <img src={pageLogo} alt="" className="release-logo" />
          <h1 className="release-title">{release.pageName || 'codePerks'}</h1>
          <p className="release-name-line">{release.releaseTitle || titleLine}</p>
          {releaseDate ? <p className="release-date">{b.date}: {releaseDate}</p> : null}
        </section>

        {benefitWindowStatus !== 'open' && benefitWindow ? (
          <section className="window-status-card">
            <h2>
              {benefitWindowStatus === 'not_open'
                ? b.benefitNotOpenTitle
                : b.benefitClosedTitle}
            </h2>
            <p>
              {(benefitWindowStatus === 'not_open'
                ? b.benefitNotOpenBody
                : b.benefitClosedBody)
                .replace('{start}', benefitWindow.campaignStart || '')
                .replace('{end}', benefitWindow.campaignEnd || '')}
            </p>
          </section>
        ) : null}

        <section className="bonus-content">
          <p className="bonus-content-title">{assignedTier ? `${tierText} ${b.bonus}` : (b.verifiedBenefit || 'VERIFIED BENEFIT')}</p>
          <div className="reward-stage">{renderReward()}</div>
          {currentBonusDetails ? (
            <div className="claim-location-box">
              {currentBonusDetails.reward ? (
                <>
                  <span>BONUS</span>
                  <strong>{currentBonusDetails.reward}</strong>
                </>
              ) : null}
              {currentBonusDetails.redemptionLocation ? (
                <>
                  <span>HENTESTED FOR BONUS</span>
                  <strong>{currentBonusDetails.redemptionLocation}</strong>
                </>
              ) : null}
              {currentBonusDetails.instructions ? (
                <>
                  <span>INSTRUKSJON</span>
                  <strong>{currentBonusDetails.instructions}</strong>
                </>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="inside-box">
          {choice !== 'joined' ? (
            <>
              <h2>{b.insideTitle}</h2>
              <p>{b.insideText}</p>
              <div className="phone-flow">
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  name="phone"
                  id="inside-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={b.phone}
                />
                <label className="privacy-text" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    style={{ marginTop: '3px' }}
                  />
                  <span>
                    {b.consent}{' '}
                    <a
                      href="https://codeperks.global/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {b.privacyLink}
                    </a>
                  </span>
                </label>

                <button
                  type="button"
                  className="primary-cta full-width"
                  onClick={submitPhone}
                  disabled={!phone.trim() || !consent}
                >
                  {b.confirm}
                </button>
              </div>
              
            </>
          ) : (
            <div className="complete-box">
              <h2>{b.joined}</h2>
              <p>{j.joinedText}</p>

              {ownershipCertificate?.certificateId ? (
                <div className="ownership-certificate">
                  <div className="ownership-kicker">{b.ownershipKicker}</div>
                  <div className="ownership-label">{b.ownershipLabel}</div>
                  <div className="ownership-id">{ownershipCertificate.certificateId}</div>
                  <div className="ownership-description">
                    {b.ownershipDescription}
                  </div>
                  <div className="ownership-issued">
                    {b.ownershipIssued} {String(ownershipCertificate.issuedAt || "").slice(0, 10)}
                  </div>

                  {benefitInventory ? (
                    <div className="availability-box">
                      <div className="availability-title">{b.availableBenefits}</div>
                      <div className="availability-grid">
                        <div className="availability-card">
                          <span>{b.gold}</span>
                          <strong>
                            {Number(benefitInventory.goldRemaining || 0) > 0
                              ? `${Number(benefitInventory.goldRemaining || 0)} ${b.left}`
                              : b.fullyClaimed}
                          </strong>
                        </div>
                        <div className="availability-card">
                          <span>{b.silver}</span>
                          <strong>
                            {Number(benefitInventory.silverRemaining || 0) > 0
                              ? `${Number(benefitInventory.silverRemaining || 0)} ${b.left}`
                              : b.fullyClaimed}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <a
                    className="primary-cta full-width certificate-claim-button"
                    href={`/certificate/${eventCode}/${ownershipCertificate.certificateId}`}
                  >
                    {b.claimReward || 'VIEW / CLAIM REWARD'}
                  </a>

                </div>
              ) : null}
            </div>
          )}
        </section>
      </section>
    </main>

  );
}
