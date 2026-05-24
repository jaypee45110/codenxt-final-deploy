import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

export default function RedeemPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');

  const loadRedemption = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/redemption/${encodeURIComponent(token)}`);
      const json = await res.json();

      if (!res.ok || !json?.valid) {
        setStatus('invalid');
        setMessage(json?.error || 'Invalid redemption code.');
        return;
      }

      setData(json);
      setStatus(json.redeemed ? 'alreadyRedeemed' : 'valid');
    } catch (error) {
      console.warn('Redemption lookup failed:', error);
      setStatus('invalid');
      setMessage('Could not validate redemption code.');
    }
  };

  const redeemBenefit = async () => {
    setStatus('redeeming');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/redemption/${encodeURIComponent(token)}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redeemedBy: 'redeem-page' }),
      });

      const json = await res.json();

      if (res.status === 409 || json?.alreadyRedeemed) {
        setData((prev) => ({
          ...prev,
          redeemed: true,
          redeemedAt: json?.redeemedAt || prev?.redeemedAt || null,
        }));
        setStatus('alreadyRedeemed');
        setMessage('This reward has already been redeemed. Do not release this reward again.');
        return;
      }

      if (!res.ok || !json?.ok) {
        setStatus('valid');
        setMessage(json?.error || 'Could not redeem reward.');
        return;
      }

      setData({
        eventCode: json.claim?.eventCode,
        certificateId: json.claim?.certificateId,
        claimId: json.claim?.id,
        status: json.claim?.status,
        redeemed: true,
        redeemedAt: json.claim?.redeemedAt,
      });
      setStatus('redeemed');
      setMessage('Reward redeemed successfully.');
    } catch (error) {
      console.warn('Redemption failed:', error);
      setStatus('valid');
      setMessage('Could not redeem reward.');
    }
  };

  useEffect(() => {
    loadRedemption();
  }, [token]);

  const title =
    status === 'loading' ? 'Checking reward'
      : status === 'invalid' ? 'Invalid code'
        : status === 'alreadyRedeemed' ? 'Already redeemed'
          : status === 'redeemed' ? 'Reward redeemed'
            : status === 'redeeming' ? 'Redeeming reward'
              : 'Ready to redeem';

  return (
    <main className="redeem-page">
      <section className={`redeem-card state-${status}`}>
        <img src="/codePerks-logo.png?v=3" alt="codePerks logo" className="redeem-logo" />

        <p className="redeem-kicker">codePerks Redemption</p>
        <h1>{title}</h1>

        {data?.certificateId ? (
          <div className="redeem-field">
            <span>Certificate ID</span>
            <strong>{data.certificateId}</strong>
          </div>
        ) : null}

        {data?.eventCode ? (
          <div className="redeem-field">
            <span>Campaign</span>
            <strong>{data.eventCode}</strong>
          </div>
        ) : null}

        {data?.redeemedAt ? (
          <div className="redeem-field">
            <span>Redeemed at</span>
            <strong>{String(data.redeemedAt).slice(0, 19).replace('T', ' ')}</strong>
          </div>
        ) : null}

        {message ? <p className="redeem-message">{message}</p> : null}

        {status === 'valid' ? (
          <button type="button" className="redeem-button" onClick={redeemBenefit}>
            REDEEM BENEFIT
          </button>
        ) : null}

        {status === 'loading' || status === 'redeeming' ? (
          <p className="redeem-message">Please wait...</p>
        ) : null}

        {status === 'redeemed' ? (
          <div className="redeem-confirmed">✓ Reward released. This code cannot be used again.</div>
        ) : null}

        {status === 'alreadyRedeemed' ? (
          <div className="redeem-blocked">⚠ Already redeemed. Do not release this reward again.</div>
        ) : null}
      </section>

      <style>{`
        .redeem-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 28px 16px;
          background:
            radial-gradient(circle at 50% 0%, rgba(226,196,122,.16), transparent 34%),
            linear-gradient(180deg, #0b0b10 0%, #020306 100%);
          color: #fff;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .redeem-card {
          width: min(520px, 100%);
          padding: 30px;
          border-radius: 28px;
          border: 1px solid rgba(247,216,138,.34);
          background: rgba(0,0,0,.54);
          box-shadow: 0 28px 100px rgba(0,0,0,.48);
          text-align: center;
        }

        .redeem-logo {
          width: 140px;
          max-width: 60%;
          margin: 0 auto 22px;
          display: block;
        }

        .redeem-kicker {
          margin: 0 0 8px;
          color: rgba(247,216,138,.72);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .redeem-card h1 {
          margin: 0 0 22px;
          color: #f7d88a;
          font-size: 30px;
          letter-spacing: -.03em;
        }

        .redeem-field {
          margin-top: 12px;
          padding: 14px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.04);
        }

        .redeem-field span {
          display: block;
          margin-bottom: 6px;
          color: rgba(255,255,255,.52);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .redeem-field strong {
          display: block;
          color: #fff7dd;
          font-size: 15px;
          word-break: break-word;
        }

        .redeem-message {
          margin: 18px 0 0;
          color: rgba(255,255,255,.76);
          font-size: 14px;
          line-height: 1.5;
        }

        .redeem-button {
          margin-top: 22px;
          width: 100%;
          min-height: 48px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #f7d88a, #b8862c);
          color: #101010;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: .08em;
          cursor: pointer;
        }

        .redeem-confirmed {
          margin-top: 20px;
          padding: 13px;
          border-radius: 16px;
          background: rgba(104,255,176,.10);
          color: #9cffbd;
          font-size: 13px;
          font-weight: 800;
        }

        .state-invalid {
          border-color: rgba(255,140,140,.36);
        }

        .state-invalid h1 {
          color: #ff9b9b;
        }

        .state-redeemed {
          border-color: rgba(156,255,189,.36);
        }

        .state-redeemed h1 {
          color: #9cffbd;
        }

        .state-alreadyRedeemed {
          border-color: rgba(255,70,70,.52);
          box-shadow: 0 28px 100px rgba(255,0,0,.16);
        }

        .state-alreadyRedeemed h1 {
          color: #ff7b7b;
        }

        .redeem-blocked {
          margin-top: 20px;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid rgba(255,70,70,.45);
          background: rgba(255,70,70,.12);
          color: #ff9b9b;
          font-size: 13px;
          font-weight: 900;
          line-height: 1.4;
        }
      `}</style>
    </main>
  );
}
