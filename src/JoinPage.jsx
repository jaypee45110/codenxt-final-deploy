import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import { t } from './i18n';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

const bonusCopy = {
  no: {
    listened: 'DU LYTTET',
    andGet: 'OG FÅR',
    bonus: 'BONUS',
    gold: 'GULL',
    silver: 'SØLV',
    general: 'GENERELL',
    insideTitle: 'InSide Info',
    insideText: 'Legg igjen mobilnummeret ditt og få verdifull InSide Info direkte til telefonen din.',
    phone: 'Mobilnummer',
    confirm: 'KOM INSIDE',
    joined: 'DU ER INSIDE',
    date: 'Dato',
    consent: 'Jeg samtykker til å motta relevant informasjon og oppdateringer fra denne podcasten. Se personvernpolicy.',
    privacyLink: 'Personvernpolicy',
  },
  en: {
    listened: 'YOU LISTENED',
    andGet: 'AND GET',
    bonus: 'BONUS',
    gold: 'GOLD',
    silver: 'SILVER',
    general: 'GENERAL',
    insideTitle: 'InSide Info',
    insideText: 'Leave your mobile number and receive valuable InSide Info directly to your phone.',
    phone: 'Mobile number',
    confirm: 'COME INSIDE',
    joined: 'YOU ARE INSIDE',
    date: 'Date',
    consent: 'J accepte de recevoir des informations et mises a jour pertinentes de ce podcast. Voir la politique de confidentialite.',
    privacyLink: 'Politique de confidentialite',
  },
  de: {
    listened: 'DU HAST ZUGEHÖRT',
    andGet: 'UND BEKOMMST',
    bonus: 'BONUS',
    gold: 'GOLD',
    silver: 'SILBER',
    general: 'ALLGEMEIN',
    insideTitle: 'InSide Info',
    insideText: 'Hinterlasse deine Mobilnummer und erhalte wertvolle InSide Info direkt auf dein Telefon.',
    phone: 'Mobilnummer',
    confirm: 'KOMM INSIDE',
    joined: 'DU BIST INSIDE',
    date: 'Datum',
    consent: 'Ich stimme zu, relevante Informationen und Updates von diesem Podcast zu erhalten. Siehe Datenschutzerklaerung.',
    privacyLink: 'Datenschutzerklaerung',
  },
  fr: {
    listened: 'VOUS AVEZ ÉCOUTÉ',
    andGet: 'ET RECEVEZ',
    bonus: 'BONUS',
    gold: 'OR',
    silver: 'ARGENT',
    general: 'GÉNÉRAL',
    insideTitle: 'InSide Info',
    insideText: 'Laissez votre numéro mobile et recevez des informations InSide précieuses directement sur votre téléphone.',
    phone: 'Numéro mobile',
    confirm: 'ENTRER INSIDE',
    joined: 'VOUS ÊTES INSIDE',
    date: 'Date',
  },
  es: {
    listened: 'HAS ESCUCHADO',
    andGet: 'Y RECIBES',
    bonus: 'BONUS',
    gold: 'ORO',
    silver: 'PLATA',
    general: 'GENERAL',
    insideTitle: 'InSide Info',
    insideText: 'Deja tu número móvil y recibe valiosa información InSide directamente en tu teléfono.',
    phone: 'Número móvil',
    confirm: 'ENTRAR INSIDE',
    joined: 'YA ERES INSIDE',
    date: 'Fecha',
    consent: 'Acepto recibir informacion y actualizaciones relevantes de este podcast. Ver politica de privacidad.',
    privacyLink: 'Politica de privacidad',
  },
};


function readSavedEpisode() {
  try {
    return JSON.parse(localStorage.getItem('codenxt_event') || '{}');
  } catch {
    return {};
  }
}

function normalizeEpisode(data = {}) {
  return {
    ...data,
    podcastName: data.podcastName || data.artistName || data.name || '',
    episodeTitle: data.episodeTitle || data.title || '',
    platform: data.platform || data.venue || '',
    releaseDate: data.releaseDate || data.eventDate || data.startAt || '',
    releaseTime: data.releaseTime || '',
    startAt: data.startAt || '',
    unlockAt: data.unlockAt || data.startAt || '',
    endAt: data.endAt || '',
    podcastLogo: data.podcastLogo || data.logoUrl || data.artistLogo || data.image || '',
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
  const [episode, setEpisode] = useState(() => normalizeEpisode(readSavedEpisode()));
  const [reward, setReward] = useState(null);
  const [bonusTier, setBonusTier] = useState('general');
  const [status, setStatus] = useState('loading');
  const [choice, setChoice] = useState('ask');
  const [phone, setPhone] = useState('');
  const [joined, setJoined] = useState(false);
  const [consent, setConsent] = useState(false);

  const titleLine = useMemo(() => {
    if (episode.episodeTitle && episode.podcastName) return `${episode.podcastName}: ${episode.episodeTitle}`;
    return episode.episodeTitle || episode.podcastName || 'codePod';
  }, [episode]);

  const releaseTimeLabel = useMemo(() => {
    if (episode.releaseTime) return episode.releaseTime;
    const rawTime = episode.unlockAt || episode.startAt;
    if (!rawTime) return 'the scheduled time';
    const parsed = new Date(rawTime);
    if (Number.isNaN(parsed.getTime())) return 'the scheduled time';
    return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [episode.releaseTime, episode.unlockAt, episode.startAt]);

  const releaseDateLabel = useMemo(() => {
    const rawDate = episode.releaseDate || episode.startAt || episode.unlockAt;
    if (!rawDate) return '';
    const parsed = new Date(rawDate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString();
    }
    return String(rawDate).slice(0, 10);
  }, [episode.releaseDate, episode.startAt, episode.unlockAt]);

  useEffect(() => {
    document.title = 'Bonus - codePod';
  }, []);

  useEffect(() => {
    const fetchEpisode = async () => {
      if (!eventCode) {
        setStatus('missing');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/event/${eventCode}?vertical=codepod`);
        const data = await res.json();
        const saved = readSavedEpisode();
        const merged = normalizeEpisode({ ...saved, ...data, eventCode: data?.code || eventCode });
        setEpisode(merged);

        const unlockTime = merged.unlockAt || merged.startAt;
        if (unlockTime) {
          const unlockDate = new Date(unlockTime);
          if (!Number.isNaN(unlockDate.getTime()) && Date.now() < unlockDate.getTime()) {
            setReward(null);
            setStatus('locked');
            return;
          }
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
        vertical: 'codepod', eventCode, scanId, vertical: 'codepod' }),
        });
        const scanData = await scanRes.json().catch(() => ({}));
        const tier = new URLSearchParams(window.location.search).get('tier') || scanData?.tier || 'general';
        setBonusTier(tier);

        if (data?.id) {
          const rewardRes = await fetch(`${API_BASE}/reward/${data.id}?tier=${tier}&vertical=codepod`);
          if (rewardRes.ok) {
            const rewardData = await rewardRes.json();
            setReward(rewardData || null);
          } else {
            setReward(null);
          }
        } else {
          setReward(null);
        }

        setStatus('ready');
      } catch (error) {
        console.error('Could not load codePod join page:', error);
        setStatus('missing');
      }
    };

    fetchEpisode();
  }, [eventCode]);

  const submitPhone = async () => {
    if (!phone.trim() || !consent) return;

    await fetch(`${API_BASE}/inner-circle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone.trim(),
        eventCode,
        vertical: 'codepod',
        source: 'codepod_join',
        consent: true,
        consentAt: new Date().toISOString(),
      }),
    });

    setJoined(true);
    setChoice('joined');
  };

  const renderReward = () => {
    if (status === 'loading') return <p className="muted center">{j.loading}</p>;
    if (status === 'locked') {
      return (
        <p className="muted center">
          {(j.bonusLocked || 'This bonus becomes available when the episode is released on {date} at {time}.')
            .replace('{date}', releaseDateLabel)
            .replace('{time}', releaseTimeLabel)}
        </p>
      );
    }
    if (!reward) return <p className="muted center">{j.missing}</p>;

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

  const tierText = b[bonusTier] || b.general;
  const releaseDate = episode.releaseDate ? String(episode.releaseDate).slice(0, 10) : '';
  const podcastLogo = episode.podcastLogo || '/codepod-logo.png';

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
            radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.18), transparent 34%),
            linear-gradient(180deg, #020713 0%, #050815 100%);
          color: #fff;
        }

        .bonus-card {
          width: min(720px, 100%);
          text-align: center;
          border: 1px solid rgba(0, 240, 255, 0.18);
          border-radius: 28px;
          background: rgba(4, 9, 22, 0.86);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.48);
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
          font-size: clamp(26px, 7vw, 54px);
          line-height: 0.98;
          font-weight: 950;
          letter-spacing: 0.05em;
        }

        .bonus-claim .line-three {
          margin: 12px 0 0;
          color: #16e8ff;
          font-size: clamp(30px, 8vw, 64px);
          line-height: 0.98;
          font-weight: 950;
          letter-spacing: 0.045em;
          text-shadow: 0 0 28px rgba(22,232,255,0.32);
        }

        .episode-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin: 0 auto 24px;
          padding: 20px;
          border-radius: 22px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .episode-logo {
          max-width: 140px;
          max-height: 90px;
          object-fit: contain;
          margin-bottom: 4px;
        }

        .episode-title {
          margin: 0;
          font-size: clamp(22px, 5vw, 34px);
          font-weight: 950;
          color: #fff;
        }

        .episode-name-line,
        .episode-date {
          margin: 0;
          color: rgba(255,255,255,0.74);
          font-size: 14px;
          font-weight: 700;
        }

        .bonus-content {
          margin: 0 auto 24px;
          padding: 18px;
          border-radius: 22px;
          background: rgba(0, 0, 0, 0.26);
          border: 1px solid rgba(0, 240, 255, 0.16);
        }

        .bonus-content-title {
          margin: 0 0 14px;
          color: #8ff7ff;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .inside-box {
          margin-top: 24px;
          padding: 20px;
          border-radius: 22px;
          background: rgba(0, 240, 255, 0.07);
          border: 1px solid rgba(0, 240, 255, 0.18);
        }

        .inside-box h2 {
          margin: 0 0 8px;
          color: #16e8ff;
          font-size: 28px;
          font-weight: 950;
        }

        .inside-box p {
          margin: 0 0 14px;
          color: rgba(255,255,255,0.72);
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
          color: #fff;
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
          color: #16e8ff;
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
      `}</style>

      <section className="bonus-card">
        <header className="bonus-top">
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </header>

        <section className="bonus-claim">
          <p className="line-one">{b.listened}</p>
          <p className="line-two">{b.andGet}</p>
          <p className="line-three">{tierText} {b.bonus}</p>
        </section>

        <section className="episode-block">
          <img src={podcastLogo} alt="" className="episode-logo" />
          <h1 className="episode-title">{episode.podcastName || 'codePod'}</h1>
          <p className="episode-name-line">{episode.episodeTitle || titleLine}</p>
          {releaseDate ? <p className="episode-date">{b.date}: {releaseDate}</p> : null}
        </section>

        <section className="bonus-content">
          <p className="bonus-content-title">{tierText} {b.bonus}</p>
          <div className="reward-stage">{renderReward()}</div>
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
                      href="https://codepod.global/privacy"
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
              <p className="privacy-text">{j.privacy}</p>
            </>
          ) : (
            <div className="complete-box">
              <h2>{b.joined}</h2>
              <p>{j.joinedText}</p>
            </div>
          )}
        </section>
      </section>
    </main>

  );
}
