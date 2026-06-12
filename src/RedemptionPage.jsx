import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

export default function RedemptionPage() {
  const { token } = useParams();
  const [state, setState] = useState({ status: 'loading', data: null });
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const validateToken = async () => {
      if (!token) {
        setState({ status: 'invalid', data: null });
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/redemption/${encodeURIComponent(token)}`);
        const data = await response.json().catch(() => ({}));

        if (cancelled) return;

        if (
          response.ok &&
          data?.ok === true &&
          data?.vertical === 'codepod' &&
          data?.displayTier === 'GoldXtra'
        ) {
          setState({
            status: data?.redeemed === true || data?.status === 'redeemed' ? 'already_redeemed' : 'valid',
            data,
          });
        } else {
          setState({ status: 'invalid', data });
        }
      } catch (error) {
        if (!cancelled) setState({ status: 'error', data: null });
      }
    };

    validateToken();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const redeemToken = async () => {
    if (!token || redeeming) return;

    setRedeeming(true);

    try {
      const response = await fetch(`${API_BASE}/redemption/${encodeURIComponent(token)}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redeemedBy: 'partner' }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.ok === true && data?.status === 'redeemed') {
        setState({ status: 'redeemed', data });
      } else if (data?.status === 'already_redeemed') {
        setState({ status: 'already_redeemed', data });
      } else {
        setState({ status: 'invalid', data });
      }
    } catch (error) {
      setState((current) => ({ ...current, status: 'error' }));
    } finally {
      setRedeeming(false);
    }
  };

  const reward = state.data?.partnerReward || {};
  const isValid = state.status === 'valid';
  const isRedeemed = state.status === 'redeemed';
  const isAlreadyRedeemed = state.status === 'already_redeemed';
  const isGreen = isValid || isRedeemed;

  return (
    <main className={`redemption-page ${isGreen ? 'valid' : 'invalid'}`}>
      <style>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Arial, sans-serif;
          background: #05070d;
        }

        .redemption-page {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          justify-content: center;
          color: #fff;
        }

        .redemption-page.valid {
          background: linear-gradient(180deg, #033d25 0%, #02150e 100%);
        }

        .redemption-page.invalid {
          background: linear-gradient(180deg, #4a0810 0%, #160204 100%);
        }

        .redemption-card {
          width: min(520px, 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 28px 22px;
          box-sizing: border-box;
        }

        .status-label {
          margin: 0 0 14px;
          font-size: clamp(44px, 13vw, 74px);
          line-height: 0.95;
          font-weight: 950;
          letter-spacing: 0;
        }

        .status-subtitle {
          margin: 0 0 28px;
          color: rgba(255,255,255,0.78);
          font-size: 18px;
          line-height: 1.35;
          font-weight: 750;
        }

        .detail-list {
          display: grid;
          gap: 12px;
        }

        .detail-row {
          padding: 15px;
          border-radius: 14px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
        }

        .detail-row span {
          display: block;
          margin-bottom: 5px;
          color: rgba(255,255,255,0.62);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .detail-row strong {
          display: block;
          color: #fff;
          font-size: 18px;
          line-height: 1.3;
        }

        .redeem-button {
          width: 100%;
          margin-top: 24px;
          border: 0;
          border-radius: 16px;
          padding: 18px 20px;
          background: #ffffff;
          color: #033d25;
          font-size: 22px;
          line-height: 1;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 18px 40px rgba(0,0,0,0.28);
        }

        .redeem-button:disabled {
          cursor: wait;
          opacity: 0.72;
        }
      `}</style>

      <section className="redemption-card">
        {state.status === 'loading' ? (
          <>
            <h1 className="status-label">Loading</h1>
            <p className="status-subtitle">Checking GoldXtra QR.</p>
          </>
        ) : isValid ? (
          <>
            <h1 className="status-label">Gyldig GoldXtra</h1>
            <p className="status-subtitle">Kontroller premien og bekreft når den er utdelt.</p>
            <div className="detail-list">
              <div className="detail-row">
                <span>Premie</span>
                <strong>{reward.title || 'Partner Reward'}</strong>
              </div>
              <div className="detail-row">
                <span>Partner</span>
                <strong>{reward.partnerName || 'Partner'}</strong>
              </div>
              <div className="detail-row">
                <span>Utdelingssted</span>
                <strong>{reward.redemptionLocation || 'Ikke oppgitt'}</strong>
              </div>
              <div className="detail-row">
                <span>Frist</span>
                <strong>{reward.redemptionDeadline || 'Ikke oppgitt'}</strong>
              </div>
              <div className="detail-row">
                <span>Instruksjoner</span>
                <strong>{reward.redemptionInstructions || 'Ikke oppgitt'}</strong>
              </div>
            </div>
            <button type="button" className="redeem-button" onClick={redeemToken} disabled={redeeming}>
              {redeeming ? 'Bekrefter...' : 'Premie utdelt'}
            </button>
          </>
        ) : isRedeemed ? (
          <>
            <h1 className="status-label">Premie innløst</h1>
            <p className="status-subtitle">GoldXtra-premien er bekreftet utdelt.</p>
          </>
        ) : isAlreadyRedeemed ? (
          <>
            <h1 className="status-label">Allerede innløst</h1>
            <p className="status-subtitle">Denne GoldXtra-koden er allerede brukt.</p>
          </>
        ) : (
          <>
            <h1 className="status-label">Ugyldig QR</h1>
            <p className="status-subtitle">Ikke funnet eller ikke gyldig.</p>
          </>
        )}
      </section>
    </main>
  );
}
