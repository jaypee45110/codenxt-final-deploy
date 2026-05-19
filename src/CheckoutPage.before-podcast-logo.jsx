import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import { t } from './i18n';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

const emptyForm = {
  podcastName: '',
  hostName: '',
  episodeTitle: '',
  releaseDate: '',
  platform: '',
  listeners: '',
  contactName: '',
  email: '',
  phone: '',
  comments: '',
  logoFileName: '',
};

function generateEpisodeCode() {
  return `CP-${Math.floor(10000 + Math.random() * 90000)}`;
}

export default function CheckoutPage({ lang, setLang }) {
  const navigate = useNavigate();
  const text = t(lang);
  const c = text.checkout;
  const [formData, setFormData] = useState(emptyForm);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Checkout - codePod';
  }, []);

  const missingRequired = useMemo(() => {
    return (
      !formData.podcastName.trim() ||
      !formData.episodeTitle.trim() ||
      !formData.contactName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.listeners.trim() ||
      Number(formData.listeners) <= 0
    );
  }, [formData]);

  const canContinue = !missingRequired && termsAccepted && !submitting;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fieldError = (field) => triedSubmit && !String(formData[field] || '').trim();

  const handleContinue = async () => {
    setTriedSubmit(true);
    setError('');
    if (!canContinue) return;

    setSubmitting(true);
    let episodeCode = generateEpisodeCode();

    try {
      const artistLogo = '';
      const releaseDate = formData.releaseDate || new Date().toISOString().slice(0, 10);
      const payload = {
        vertical: 'codepod',
        productName: 'codePod',
        engine: 'codeNXT',
        eventCode: episodeCode,
        code: episodeCode,
        customerName: formData.contactName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        artistName: formData.podcastName.trim(),
        podcastName: formData.podcastName.trim(),
        hostName: formData.hostName.trim(),
        episodeTitle: formData.episodeTitle.trim(),
        venue: formData.platform.trim() || 'Podcast channel',
        platform: formData.platform.trim(),
        eventDate: releaseDate,
        releaseDate,
        city: '',
        audienceSize: formData.listeners.trim(),
        estimatedListeners: formData.listeners.trim(),
        comment: formData.comments.trim(),
        logoFileName: formData.logoFileName,
        artistLogo,
        logoTooLarge: false,
        selectedTypes: ['Podcast episode'],
        termsAccepted,
        shortLink: `${window.location.origin}/join/${episodeCode}`,
        createdAt: new Date().toISOString(),
      };

      const eventRes = await fetch(`${API_BASE}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: 'codepod',
          code: episodeCode,
          name: payload.podcastName,
          podcastName: payload.podcastName,
          hostName: payload.hostName,
          episodeTitle: payload.episodeTitle,
          artistLogo: payload.artistLogo || '',
          venue: payload.platform || 'Podcast channel',
          platform: payload.platform,
          city: '',
          badgeConfig: { template: 'codepod' },
          startAt: `${releaseDate}T09:00:00.000Z`,
          releaseDate,
          unlockAt: new Date().toISOString(),
          endAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          maxClaims: Math.max(Number(payload.estimatedListeners || 0), 5000),
          status: 'active',
        }),
      });

      const rawEventResponse = await eventRes.text();
      if (!eventRes.ok) throw new Error(rawEventResponse || `Create episode failed: ${eventRes.status}`);

      const eventData = rawEventResponse ? JSON.parse(rawEventResponse) : {};
      const finalEventCode = eventData?.event?.code || eventData?.code || episodeCode;
      payload.eventCode = finalEventCode;
      payload.code = finalEventCode;
      payload.shortLink = `${window.location.origin}/join/${finalEventCode}`;

      localStorage.setItem('codenxt_event', JSON.stringify(payload));
      localStorage.setItem('codenxt_active_event_code', finalEventCode);
      localStorage.setItem('codepod_latest_event', JSON.stringify(payload));

      navigate(`/dashboard?event=${finalEventCode}&lang=${lang}`, {
        state: payload,
        replace: true,
      });
    } catch (err) {
      console.error('CREATE CODEPOD EPISODE FAILED:', err);
      setError(c.submitError);
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell checkout-page">
      <header className="landing-header">
        <img src="/codepod-logo.png" alt="codePod logo" className="landing-logo" />
        <div className="landing-powered">{text.common.powered}</div>
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </header>

      <section className="page-intro checkout-intro">
        <h1>{c.title}</h1>
        <p>{c.subtitle}</p>
      </section>

      <section className="panel checkout-card">
        <div className="input-grid checkout-grid">
          <label>
            {c.fields.podcastName} *
            <input name="podcastName" value={formData.podcastName} onChange={handleChange} placeholder={c.placeholders.podcastName} />
            {fieldError('podcastName') && <small>{text.common.required}</small>}
          </label>
          <label>
            {c.fields.hostName}
            <input name="hostName" value={formData.hostName} onChange={handleChange} placeholder={c.placeholders.hostName} />
          </label>
          <label>
            {c.fields.episodeTitle} *
            <input name="episodeTitle" value={formData.episodeTitle} onChange={handleChange} placeholder={c.placeholders.episodeTitle} />
            {fieldError('episodeTitle') && <small>{text.common.required}</small>}
          </label>
          <label>
            {c.fields.platform}
            <input name="platform" value={formData.platform} onChange={handleChange} placeholder={c.placeholders.platform} />
          </label>
          <label>
            {c.fields.releaseDate}
            <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} />
          </label>
          <label>
            {c.fields.listeners} *
            <input name="listeners" value={formData.listeners} onChange={handleChange} placeholder={c.placeholders.listeners} inputMode="numeric" />
            {triedSubmit && (!formData.listeners.trim() || Number(formData.listeners) <= 0) && <small>{text.common.required}</small>}
          </label>
          <label>
            {c.fields.contactName} *
            <input name="contactName" value={formData.contactName} onChange={handleChange} placeholder={c.placeholders.contactName} />
            {fieldError('contactName') && <small>{text.common.required}</small>}
          </label>
          <label>
            {c.fields.email} *
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={c.placeholders.email} />
            {fieldError('email') && <small>{text.common.required}</small>}
          </label>
          <label>
            {c.fields.phone} *
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={c.placeholders.phone} />
            {fieldError('phone') && <small>{text.common.required}</small>}
          </label>
          <label className="wide">
            {c.fields.comments}
            <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder={c.placeholders.comments} />
          </label>
        </div>

        <div className="terms-box checkout-terms">
          <p>{c.termsText}</p>
          <label className="check-row">
            <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />
            {c.accept}
          </label>
          {triedSubmit && !termsAccepted && <small>{text.common.required}</small>}
        </div>

        {error && <div className="error-box">{error}</div>}

        <button type="button" className="primary-cta checkout-submit" disabled={!canContinue} onClick={handleContinue}>
          {submitting ? c.creating : c.continue}
        </button>
      </section>
    </main>
  );
}
