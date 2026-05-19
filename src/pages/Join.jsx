import React, { useEffect, useState } from 'react';
import { getLang, t } from '../i18n';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Join() {
  const [lang, setLangState] = useState(getLang());
  const txt = t(lang);

  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('ready');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('codenxt_reward');

    if (stored) {
      try {
        setReward(JSON.parse(stored));
      } catch {}
    }

    setTimeout(() => {
      setLoading(false);
    }, 900);
  }, []);

  const openNow = () => {
    setStep('open');
  };

  const joinNow = () => {
    setStep('done');
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          background: #000;
          font-family: -apple-system, sans-serif;
          color: white;
        }

        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          text-align: center;
          position: relative;
        }

        .box {
          width: 100%;
          max-width: 420px;
        }

        h1 {
          font-size: 32px;
          margin-bottom: 16px;
        }

        p {
          color: #aaa;
          margin-bottom: 20px;
        }

        button {
          width: 100%;
          height: 56px;
          border-radius: 14px;
          border: none;
          background: #00f0ff;
          color: black;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
        }

        input {
          width: 100%;
          height: 52px;
          border-radius: 12px;
          border: none;
          padding: 0 12px;
          font-size: 16px;
          margin-top: 10px;
        }

        video {
          width: 100%;
          border-radius: 12px;
          margin-bottom: 16px;
        }
      `}</style>

      <div className="wrap">
        <LanguageSwitcher lang={lang} onChange={setLangState} />

        <div className="box">

          {loading && (
            <>
              <h1>{txt.preparing}</h1>
            </>
          )}

          {!loading && step === 'ready' && (
            <>
              <h1>{txt.drop}</h1>
              <button onClick={openNow}>{txt.openNow}</button>
            </>
          )}

          {!loading && step === 'open' && (
            <>
              {reward && reward.url && (
                <video controls autoPlay>
                  <source src={reward.url} type="video/mp4" />
                </video>
              )}

              <p>{txt.nextDrop}</p>

              <input
                placeholder={txt.phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button onClick={joinNow}>
                {txt.joinNow}
              </button>
            </>
          )}

          {!loading && step === 'done' && (
            <>
              <h1>{txt.success}</h1>
            </>
          )}

        </div>
      </div>
    </>
  );
}