import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import { t } from './i18n';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

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
  const [episode, setEpisode] = useState(() => normalizeEpisode(readSavedEpisode()));
  const [reward, setReward] = useState(null);
  const [status, setStatus] = useState('loading');
  const [choice, setChoice] = useState('ask');
  const [phone, setPhone] = useState('');
  const [joined, setJoined] = useState(false);

  const titleLine = useMemo(() => {
    if (episode.episodeTitle && episode.podcastName) return `${episode.podcastName}: ${episode.episodeTitle}`;
    return episode.episodeTitle || episode.podcastName || 'codePod';
  }, [episode]);

  useEffect(() => {
    document.title = 'Join - codePod';
  }, []);

  useEffect(() => {
    const fetchEpisode = async () => {
      if (!eventCode) {
        setStatus('missing');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/event/${eventCode}`);
        const data = await res.json();
        const saved = readSavedEpisode();
        const merged = normalizeEpisode({ ...saved, ...data, eventCode: data?.code || eventCode });
        setEpisode(merged);

        const scanStorageKey = `codenxt_scan_id_${eventCode}`;
        let scanId = localStorage.getItem(scanStorageKey);
        if (!scanId) {
          scanId = `${eventCode}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          localStorage.setItem(scanStorageKey, scanId);
        }

        const scanRes = await fetch(`${API_BASE}/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventCode, scanId, vertical: 'codepod' }),
        });
        const scanData = await scanRes.json().catch(() => ({}));
        const tier = new URLSearchParams(window.location.search).get('tier') || scanData?.tier || 'general';

        if (data?.id) {
          const rewardRes = await fetch(`${API_BASE}/reward/${data.id}?tier=${tier}`);
          if (rewardRes.ok) {
            const rewardData = await rewardRes.json();
            setReward(rewardData || null);
          } else {
            setReward(null);
          }
        } else {
          const localReward = localStorage.getItem(`codepod_reward_${eventCode}_${tier}`);
          setReward(localReward ? JSON.parse(localReward) : null);
        }

        const reportKey = `codenxt_report_${eventCode}`;
        const uniqueScanKey = `codenxt_unique_scan_${eventCode}`;
        const reportData = JSON.parse(localStorage.getItem(reportKey) || '{"rawScans":0,"uniqueScans":0,"innerCircleJoinCount":0,"joins":[]}');
        reportData.rawScans = Number(reportData.rawScans || 0) + 1;
        if (localStorage.getItem(uniqueScanKey) !== '1') {
          reportData.uniqueScans = Number(reportData.uniqueScans || 0) + 1;
          localStorage.setItem(uniqueScanKey, '1');
        }
        localStorage.setItem(reportKey, JSON.stringify(reportData));
        setStatus('ready');
      } catch (error) {
        console.error('Could not load codePod join page:', error);
        setStatus('missing');
      }
    };

    fetchEpisode();
  }, [eventCode]);

  const submitPhone = async () => {
    if (!phone.trim()) return;

    await fetch(`${API_BASE}/inner-circle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone.trim(),
        eventCode,
        vertical: 'codepod',
        source: 'codepod_join',
      }),
    });

    const reportKey = `codenxt_report_${eventCode}`;
    const reportData = JSON.parse(localStorage.getItem(reportKey) || '{"rawScans":0,"uniqueScans":0,"innerCircleJoinCount":0,"joins":[]}');
    reportData.innerCircleJoinCount = Number(reportData.innerCircleJoinCount || 0) + 1;
    reportData.joins = Array.isArray(reportData.joins) ? reportData.joins : [];
    reportData.joins.push({ phone: phone.trim(), createdAt: new Date().toISOString(), source: 'codepod_join' });
    localStorage.setItem(reportKey, JSON.stringify(reportData));

    setJoined(true);
    setChoice('joined');
  };

  const renderReward = () => {
    if (status === 'loading') return <p className="muted center">{j.loading}</p>;
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

  return (
    <main className="join-page">
      <header className="brand-header join-header">
        <div className="brand-lockup">
          <img src="/codepod-logo.png" alt="codePod logo" className="brand-logo" />
          <span>{text.common.powered}</span>
        </div>
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </header>

      <section className="join-card">
        <p className="tagline">{text.common.tagline}</p>
        <h1>{j.title}</h1>
        <p className="episode-line">{titleLine}</p>

        <div className="reward-stage">{renderReward()}</div>

        {choice === 'ask' && (
          <>
            <h2>{j.question}</h2>
            <div className="button-column">
              <button type="button" className="primary-cta full-width" onClick={() => setChoice('phone')}>
                {j.yes}
              </button>
              <button type="button" className="secondary-button full-width" onClick={() => setChoice('exit')}>
                {j.no}
              </button>
            </div>
            <p className="privacy-text">{j.privacy}</p>
          </>
        )}

        {choice === 'phone' && (
          <div className="phone-flow">
            <input type="tel" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder={j.phone} />
            <button type="button" className="primary-cta full-width" onClick={submitPhone}>
              {j.confirm}
            </button>
            <p className="privacy-text">{j.privacy}</p>
          </div>
        )}

        {choice === 'joined' && (
          <div className="complete-box">
            <h2>{joined ? j.joined : j.title}</h2>
            <p>{j.joinedText}</p>
          </div>
        )}

        {choice === 'exit' && (
          <div className="complete-box">
            <h2>{j.exit}</h2>
          </div>
        )}
      </section>
    </main>
  );
}
