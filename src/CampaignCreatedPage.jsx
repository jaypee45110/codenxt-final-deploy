import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CampaignCreatedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const campaign = location.state || {};
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const eventCode = campaign.eventCode || campaign.code || '';
  const dashboardAccessKey = campaign.dashboardAccessKey || '';
  const lang = campaign.lang || 'en';

  const dashboardUrl = useMemo(() => {
    if (!eventCode) return '/dashboard';
    return `/dashboard?event=${encodeURIComponent(eventCode)}&lang=${encodeURIComponent(lang)}`;
  }, [eventCode, lang]);

  const canOpenDashboard = Boolean(copied && confirmed && dashboardAccessKey);

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(dashboardAccessKey);
      setCopied(true);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = dashboardAccessKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
    }
  };

  const openDashboard = () => {
    if (!canOpenDashboard) return;
    sessionStorage.setItem('codeperks_admin_key', dashboardAccessKey);
    navigate(dashboardUrl, { replace: true, state: campaign });
  };

  return (
    <main className="page-shell checkout-page campaign-created-page">
      <section className="terms-box campaign-created-box">
        <img src="/codePerks-logo.png?v=3" alt="codePerks logo" className="landing-logo" />

        <h1>Campaign Created</h1>

        <div className="access-card">
          <span>Campaign Code</span>
          <strong>{eventCode || '—'}</strong>
        </div>

        <div className="access-card important">
          <span>Dashboard Access Key</span>
          <strong>{dashboardAccessKey || '—'}</strong>
        </div>

        <p className="access-warning">
          Save this key. It will be shown only once. It is required to access this campaign dashboard later.
        </p>

        <button type="button" className="primary-cta" onClick={copyKey} disabled={!dashboardAccessKey}>
          {copied ? 'KEY COPIED' : 'COPY KEY'}
        </button>

        <label className={`saved-key-check ${copied ? '' : 'disabled'}`}>
          <input
            type="checkbox"
            checked={confirmed}
            disabled={!copied}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          <span>I have saved this key safely</span>
        </label>

        <button type="button" className="secondary-cta open-dashboard-button" onClick={openDashboard} disabled={!canOpenDashboard}>
          OPEN DASHBOARD
        </button>
      </section>

      <style>{`
        .campaign-created-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px 18px;
        }

        .campaign-created-box {
          width: min(560px, 100%);
          text-align: center;
          padding: 32px;
          border-radius: 28px;
          border: 1px solid rgba(214, 162, 72, .42);
          background: rgba(0,0,0,.48);
          box-shadow: 0 24px 90px rgba(0,0,0,.42);
        }

        .campaign-created-box .landing-logo {
          max-width: 150px;
          margin: 0 auto 20px;
        }

        .campaign-created-box h1 {
          margin: 0 0 22px;
          color: #f7d88a;
          font-size: 28px;
          letter-spacing: -.02em;
        }

        .access-card {
          margin-top: 14px;
          padding: 16px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.04);
        }

        .access-card span {
          display: block;
          margin-bottom: 8px;
          color: rgba(255,255,255,.56);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .access-card strong {
          display: block;
          color: #fff4cf;
          font-size: 22px;
          word-break: break-word;
          letter-spacing: .04em;
        }

        .access-card.important {
          border-color: rgba(247, 216, 138, .42);
        }

        .access-warning {
          margin: 18px auto 18px;
          max-width: 420px;
          color: rgba(255,255,255,.76);
          font-size: 14px;
          line-height: 1.55;
        }

        .saved-key-check {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 16px 0;
          color: #fff4cf;
          font-size: 13px;
        }

        .saved-key-check.disabled {
          opacity: .45;
        }

        .saved-key-check input {
          width: 18px;
          height: 18px;
        }

        .open-dashboard-button:disabled,
        .primary-cta:disabled {
          opacity: .42;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}
