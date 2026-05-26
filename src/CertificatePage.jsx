import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

const certificateText = {
  no: {
    kicker: 'VERIFISERT REWARD-SERTIFIKAT',
    title: 'Reward Claim Certificate',
    intro: 'Dette sertifikatet bekrefter fordelen din og viser hvordan den kan hentes eller kreves.'
    valid: 'GYLDIG',
    notVerified: 'IKKE VERIFISERT',
    verifying: 'VERIFISERER',
    certificateId: 'Sertifikat-ID',
    eventCode: 'Kampanjekode',
    issued: 'Utstedt',
    backendValidation: 'Verifisering',
    campaignPerk: 'Kampanje / fordel',
    bonus: 'Fordel',
    notRegistered: 'Ikke registrert',
    redeemAt: 'Hentested',
    instructions: 'Instruksjoner',
    none: 'Ingen',
    deliveryInfo: 'Informasjon om utlevering',
    deliveryHelp: 'Bruk denne kontakten for å kreve fordelen.',
    deliveryContact: 'Kontaktperson',
    deliveryEmail: 'E-post',
    claimTitle: 'Krev / hent fordelen',
    claimHelp: 'Send en e-post med sertifikat-ID og kampanjekode til:'
    claimDetails: 'Opplysninger om mottaker',
    claimDetailsHelp: 'Fyll inn navn og e-post slik at fordelen kan verifiseres og utleveres.',
    fullName: 'Fullt navn',
    email: 'E-post',
    sendClaim: 'SEND KRAV VIA E-POST',
    back: 'Tilbake til fordel',
    missingFields: 'Fyll inn navn og e-post først.',
    registered: 'E-postkrav registrert.',
    registerError: 'Kunne ikke registrere krav. Prøv igjen.',
  },
  en: {
    kicker: 'VERIFIED REWARD CERTIFICATE',
    title: 'Reward Claim Certificate',
    intro: 'This certificate verifies your codePerks reward and gives you the information needed to claim it.',
    valid: 'VALID',
    notVerified: 'NOT VERIFIED',
    verifying: 'VERIFYING',
    certificateId: 'Certificate ID',
    eventCode: 'Event code',
    issued: 'Issued',
    backendValidation: 'Backend validation',
    campaignPerk: 'Campaign / perk',
    bonus: 'Fordel',
    notRegistered: 'Not registered',
    redeemAt: 'Redeem at',
    instructions: 'Instructions',
    none: 'None',
    deliveryInfo: 'Reward Delivery Information',
    deliveryHelp: 'Use this contact to claim your reward.',
    deliveryContact: 'Delivery contact',
    deliveryEmail: 'Delivery email',
    claimTitle: 'Claim / redeem your benefit',
    claimHelp: 'Send an email with your Certificate ID and campaign code to:'
    claimDetails: 'Your reward claim details',
    claimDetailsHelp: 'Enter your personal details so the reward can be verified and delivered.',
    fullName: 'Full name',
    email: 'Email',
    sendClaim: '{c.sendClaim}',
    back: '{c.back}',
    missingFields: 'Please complete name and email first.',
    registered: 'Email claim registered.',
    registerError: 'Could not register claim. Please try again.',
  },
};


export default function CertificatePage({ lang: initialLang = 'no' }) {
  const { eventCode, certificateId } = useParams();
  const [lang, setLang] = useState(initialLang || 'no');
  const c = certificateText[lang] || certificateText.en;
  const eventData = useMemo(() => readJson('codenxt_event'), []);
  const latestEvent = useMemo(() => readJson('codeperks_latest_event'), []);
  const [serverEvent, setServerEvent] = useState({});
  const [certificateReward, setCertificateReward] = useState(null);
  const data = { ...latestEvent, ...eventData, ...serverEvent };
  const rewardDelivery = data.rewardDelivery || {};

  useEffect(() => {
    let alive = true;

    async function loadCertificateEvent() {
      try {
        const response = await fetch(`${API_BASE}/event/${eventCode}`);
        if (!response.ok) return;
        const json = await response.json();
        const event = json?.event || json || {};
        if (alive) setServerEvent(event);
      } catch (error) {
        console.warn('Could not load certificate event from backend:', error);
      }
    }

    if (eventCode) loadCertificateEvent();

    return () => {
      alive = false;
    };
  }, [eventCode]);

  useEffect(() => {
    let alive = true;

    async function validateCertificate() {
      try {
        const response = await fetch(`${API_BASE}/certificate/validate/${encodeURIComponent(eventCode)}/${encodeURIComponent(certificateId)}`);
        const json = await response.json().catch(() => ({}));

        if (!alive) return;

        setCertificateValidation({
          checked: true,
          valid: Boolean(response.ok && json.valid),
          status: json.status || (json.valid ? 'active' : 'not_found'),
          reason: json.reason || json.error || '',
          tier: json.tier || '',
          benefitTier: json.benefitTier || '',
          eventId: json.eventId || '',
          ownershipCertificate: json.ownershipCertificate || null,
        });
      } catch (error) {
        console.warn('Certificate validation failed:', error);
        if (alive) {
          setCertificateValidation({
            checked: true,
            valid: false,
            status: 'unverified',
            reason: 'Validation unavailable',
          });
        }
      }
    }

    if (eventCode && certificateId) validateCertificate();

    return () => {
      alive = false;
    };
  }, [eventCode, certificateId]);

  const [certificateValidation, setCertificateValidation] = useState({
    checked: false,
    valid: false,
    status: 'checking',
  });

  useEffect(() => {
    let alive = true;

    async function loadCertificateReward() {
      try {
        const eventId = certificateValidation.eventId || data.id || '';
        const tier = certificateValidation.benefitTier || certificateValidation.tier || '';

        if (!eventId || !tier) return;

        const response = await fetch(`${API_BASE}/reward/${encodeURIComponent(eventId)}?tier=${encodeURIComponent(tier)}&vertical=codeperks`);
        if (!response.ok) return;

        const json = await response.json().catch(() => null);
        if (alive) setCertificateReward(json || null);
      } catch (error) {
        console.warn('Could not load certificate reward:', error);
      }
    }

    loadCertificateReward();

    return () => {
      alive = false;
    };
  }, [certificateValidation.eventId, certificateValidation.benefitTier, certificateValidation.tier, data.id]);
  const [claimStatus, setClaimStatus] = useState('');
  const [claimant, setClaimant] = useState({
    fullName: '',
    email: '',
  });

  const handleClaimantChange = (event) => {
    const { name, value } = event.target;
    setClaimant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const claimReady =
    claimant.fullName.trim() &&
    claimant.email.trim();

  const certificateTier = certificateValidation.benefitTier || certificateValidation.tier || data.benefitTier || data.tier || data.ownershipCertificate?.benefitTier || '';
  const certificateBonusDetails =
    data?.bonusDetails?.[certificateTier] ||
    (certificateTier === 'standard' ? data?.bonusDetails?.general : null) ||
    null;
  const certificateRewardTitle =
    certificateReward?.title ||
    certificateReward?.content ||
    certificateBonusDetails?.reward ||
    '';

  const mailSubject = encodeURIComponent(`codePerks reward claim ${certificateId}`);
  const mailBody = encodeURIComponent(
    `${c.claimTitle}\n\n` +
    `Certificate ID: ${certificateId}\n` +
    `${c.eventCode}: ${eventCode}\n` +
    `Kategori: ${certificateTier || c.notRegistered}\n` +
    `${c.bonus}: ${certificateRewardTitle || c.notRegistered}\n` +
    `${c.redeemAt}: ${certificateBonusDetails?.redemptionLocation || data.redemptionLocation || c.notRegistered}\n` +
    `${c.instructions}: ${certificateBonusDetails?.instructions || c.none}\n` +
    `${c.campaignPerk}: ${data.releaseTitle || data.stackName || 'codePerks'}\n\n` +
    `Mottaker\n` +
    `${c.fullName}: ${claimant.fullName}\n` +
    `${c.email}: ${claimant.email}\n`
  );

  const claimEmailHref =
    rewardDelivery.email && claimReady
      ? `mailto:${rewardDelivery.email}?subject=${mailSubject}&body=${mailBody}`
      : '#';

  async function registerRewardClaim(type) {
    if (!claimReady) {
      setClaimStatus(c.missingFields);
      return false;
    }

    try {
      setClaimStatus('Registering claim...');

      const response = await fetch(`${API_BASE}/reward-claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          eventCode,
          certificateId,
          claimant,
        }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.ok) {
        throw new Error(json.error || `Could not register claim (${response.status})`);
      }
      setClaimStatus(c.registered);
      return true;
    } catch (error) {
      console.error('Reward claim registration failed:', error);
      setClaimStatus(error?.message || c.registerError);
      return false;
    }
  }

  const issuedDate = new Date().toISOString().slice(0, 10);

  return (
    <main className="certificate-page">
      <section className="certificate-shell">
        <div className="certificate-top">
          <LanguageSwitcher lang={lang} onChange={setLang} />
          <img src="/codePerks-logo.png?v=3" alt="codePerks logo" className="certificate-logo" />
          <div className="certificate-kicker">{c.kicker}</div>
          <h1>{c.title}</h1>
          <p>{c.intro}</p>
        </div>

        <section className="certificate-card verified">
          <div className={`status-pill ${certificateValidation.valid ? 'valid' : 'invalid'}`}>
            {certificateValidation.checked ? (certificateValidation.valid ? c.valid : c.notVerified) : c.verifying}
          </div>

          <div className="certificate-grid">
            <div>
              <span>{c.certificateId}</span>
              <strong>{certificateId}</strong>
            </div>
            <div>
              <span>{c.eventCode}</span>
              <strong>{eventCode}</strong>
            </div>
            <div>
              <span>{c.issued}</span>
              <strong>{issuedDate}</strong>
            </div>
            <div>
              <span>{c.backendValidation}</span>
              <strong>{certificateValidation.checked ? certificateValidation.status : 'checking'}</strong>
            </div>
            <div>
              <span>{c.campaignPerk}</span>
              <strong>{data.releaseTitle || data.stackName || 'codePerks reward'}</strong>
            </div>
            <div>
              <span>{c.bonus}</span>
              <strong>{certificateRewardTitle || c.notRegistered}</strong>
            </div>
            <div>
              <span>{c.redeemAt}</span>
              <strong>{certificateBonusDetails?.redemptionLocation || data.redemptionLocation || c.notRegistered}</strong>
            </div>
            <div>
              <span>{c.instructions}</span>
              <strong>{certificateBonusDetails?.instructions || c.none}</strong>
            </div>
          </div>
        </section>

        <section className="certificate-card">
          <h2>{c.deliveryInfo}</h2>
          <p className="muted">{c.deliveryHelp}</p>

          <div className="delivery-list">
            <div><span>{c.deliveryContact}</span><strong>{rewardDelivery.responsiblePerson || c.notRegistered}</strong></div>
            <div><span>{c.deliveryEmail}</span><strong>{rewardDelivery.email || c.notRegistered}</strong></div>
          </div>
        </section>

        <section className="certificate-card">
          <h2>{c.claimTitle}</h2>
          <div className="claim-box">
            <p>{c.claimHelp}</p>
            <strong>{rewardDelivery.email || c.notRegistered}</strong>
          </div>
        </section>

        <section className="certificate-card claimant-card">
          <h2>{c.claimDetails}</h2>
          <p className="muted">{c.claimDetailsHelp}</p>

          <div className="claimant-grid">
            <label>
              {c.fullName} *
              <input name="fullName" value={claimant.fullName} onChange={handleClaimantChange} placeholder={c.fullName} />
            </label>

            <label>
              {c.email} *
              <input type="email" name="email" value={claimant.email} onChange={handleClaimantChange} placeholder={c.email} />
            </label>
          </div>

          <a
            className={`claim-submit ${claimReady && rewardDelivery.email ? '' : 'disabled'}`}
            href={claimEmailHref}
            onClick={async (event) => {
              if (!claimReady || !rewardDelivery.email) {
                event.preventDefault();
                setClaimStatus(c.missingFields);
                return;
              }

              event.preventDefault();
              const ok = await registerRewardClaim('email');
              if (ok) {
                window.location.assign(claimEmailHref);
              }
            }}
          >
            {c.sendClaim}
          </a>

          {claimStatus ? <p className="claim-status">{claimStatus}</p> : null}
        </section>

        <Link className="back-link" to={`/join/${eventCode}`}>
          {c.back}
        </Link>
      </section>

      <style>{`
        .certificate-page {
          min-height: 100vh;
          padding: 32px 18px;
          background:
            radial-gradient(circle at top, rgba(216,189,120,.18), transparent 34%),
            linear-gradient(135deg, #140f0a 0%, #251609 48%, #080706 100%);
          color: #fff8e8;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .certificate-shell {
          width: min(920px, 100%);
          margin: 0 auto;
        }

        .certificate-top {
          text-align: center;
          margin-bottom: 22px;
        }

        .certificate-top .language-switcher {
          margin: 0 auto 18px;
          justify-content: center;
        }

        .certificate-logo {
          display: block;
          width: 300px;
          max-width: 78vw;
          height: auto;
          margin: 0 auto 18px;
        }

        .certificate-kicker {
          color: #d8bd78;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .22em;
          text-transform: uppercase;
        }

        .certificate-top h1 {
          margin: 10px 0;
          font-size: clamp(32px, 6vw, 58px);
          line-height: .96;
        }

        .certificate-top p {
          max-width: 620px;
          margin: 0 auto;
          color: rgba(255,248,232,.76);
          line-height: 1.55;
        }

        .certificate-card {
          margin-top: 18px;
          padding: 22px;
          border: 1px solid rgba(216,189,120,.28);
          border-radius: 24px;
          background: rgba(255,255,255,.055);
          box-shadow: 0 24px 70px rgba(0,0,0,.38);
          backdrop-filter: blur(18px);
        }

        .certificate-card h2 {
          margin: 0 0 8px;
          color: #f0d58f;
        }

        .muted {
          color: rgba(255,248,232,.68);
          margin-top: 0;
        }

        .status-pill {
          display: inline-flex;
          padding: 8px 13px;
          border-radius: 999px;
          background: rgba(216,189,120,.16);
          color: #f0d58f;
          border: 1px solid rgba(216,189,120,.38);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .18em;
        }

        .status-pill.invalid {
          background: rgba(255, 75, 75, .12);
          color: #ffb4b4;
          border-color: rgba(255, 75, 75, .35);
        }

        .certificate-grid,
        .delivery-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .certificate-grid div,
        .delivery-list div {
          padding: 14px;
          border-radius: 16px;
          background: rgba(0,0,0,.2);
          border: 1px solid rgba(255,255,255,.08);
        }

        .certificate-grid span,
        .delivery-list span {
          display: block;
          color: rgba(255,248,232,.56);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .13em;
          margin-bottom: 6px;
        }

        .certificate-grid strong,
        .delivery-list strong,
        .claim-box strong {
          display: block;
          color: #fff8e8;
          font-size: 16px;
          word-break: break-word;
        }

        .claim-toggle {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .claim-toggle button {
          flex: 1;
          border: 1px solid rgba(216,189,120,.35);
          background: rgba(0,0,0,.18);
          color: #fff8e8;
          border-radius: 999px;
          padding: 12px 14px;
          font-weight: 900;
          cursor: pointer;
        }

        .claim-toggle button.active {
          background: linear-gradient(135deg, #f0d58f, #b8863b);
          color: #1c1006;
        }

        .claim-box {
          margin-top: 16px;
          padding: 16px;
          border-radius: 18px;
          background: rgba(0,0,0,.24);
          border: 1px solid rgba(255,255,255,.08);
        }

        .claim-box span {
          display: block;
          margin-top: 5px;
          color: rgba(255,248,232,.82);
        }

        .claimant-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .claimant-grid label {
          display: grid;
          gap: 7px;
          color: rgba(255,248,232,.8);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .claimant-grid input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid rgba(216,189,120,.25);
          background: rgba(0,0,0,.24);
          color: #fff8e8;
          border-radius: 14px;
          padding: 13px 14px;
          font: inherit;
          outline: none;
        }

        .claimant-grid input:focus {
          border-color: rgba(216,189,120,.72);
          box-shadow: 0 0 0 3px rgba(216,189,120,.12);
        }

        .claim-submit {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 18px;
          min-height: 52px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f0d58f, #b8863b);
          color: #1c1006;
          text-decoration: none;
          font-weight: 1000;
          letter-spacing: .08em;
          box-shadow: 0 18px 42px rgba(0,0,0,.28);
        }

        .claim-submit.disabled {
          pointer-events: none;
          opacity: .42;
          filter: grayscale(.35);
        }

        .postal-note {
          margin-top: 18px;
        }

        .postal-register-button {
          width: 100%;
          margin-top: 14px;
          min-height: 50px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #f0d58f, #b8863b);
          color: #1c1006;
          font-weight: 1000;
          letter-spacing: .08em;
          cursor: pointer;
        }

        .postal-register-button:disabled {
          opacity: .42;
          cursor: not-allowed;
          filter: grayscale(.35);
        }

        .claim-status {
          margin: 14px 0 0;
          text-align: center;
          color: #f0d58f;
          font-size: 13px;
          font-weight: 800;
        }

        .back-link {
          display: block;
          width: fit-content;
          margin: 22px auto 0;
          color: #f0d58f;
          text-decoration: none;
          font-weight: 900;
        }

        @media (max-width: 720px) {
          .certificate-grid,
          .delivery-list,
          .claimant-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
