import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import { t } from './i18n';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

const emptyForm = {
  stackName: '',
  publisherName: '',
  releaseTitle: '',
  releaseDate: '',
  releaseTime: '06:00',
  platform: '',
  members: '',
  contactName: '',
  email: '',
  phone: '',
  comments: '',
  logoFileName: '',
  stackLogo: '',
  bonusWindow: '24h',
};

function generateReleaseCode() {
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
  const [logoError, setLogoError] = useState('');

  useEffect(() => {
    document.title = 'Checkout - codeStack';
  }, []);

  const missingRequired = useMemo(() => {
    return (
      !formData.stackName.trim() ||
      !formData.publisherName.trim() ||
      !formData.releaseTitle.trim() ||
      !formData.releaseDate.trim() ||
      !formData.releaseTime.trim() ||
      !formData.platform.trim() ||
      !formData.members.trim() ||
      Number(formData.members) <= 0 ||
      !formData.contactName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.comments.trim() ||
      !formData.stackLogo
    );
  }, [formData]);

  const canContinue = !missingRequired && termsAccepted && !submitting;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    setLogoError('');

    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setLogoError('Bruk PNG eller JPG.');
      return;
    }

    if (file.size > 900 * 1024) {
      setLogoError('Logoen er for stor. Bruk helst under 900 KB.');
      return;
    }

    try {
      const tempCode = generateReleaseCode();
      const form = new FormData();
      form.append('eventCode', tempCode);
      form.append('file', file);

      const response = await fetch(`${API_BASE}/upload-reward-file`, {
        method: 'POST',
        body: form,
      });

      const data = await response.json();

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'Upload failed');
      }

      setFormData((prev) => ({
        ...prev,
        stackLogo: data.url,
        logoFileName: file.name,
      }));
    } catch (error) {
      console.error('LOGO UPLOAD FAILED:', error);
      setLogoError('Kunne ikke laste opp logoen.');
    }
  };

  const fieldError = (field) => triedSubmit && !String(formData[field] || '').trim();

  const handleContinue = async () => {
    setTriedSubmit(true);
    setError('');
    if (!canContinue) return;

    setSubmitting(true);
    let releaseCode = generateReleaseCode();

    try {
      const artistLogo = formData.stackLogo.trim();
      const releaseDate = formData.releaseDate || new Date().toISOString().slice(0, 10);
      const releaseTime = formData.releaseTime || '06:00';
      const unlockAt = new Date(`${releaseDate}T${releaseTime}:00`);
      const endAt = new Date(unlockAt.getTime() + 24 * 60 * 60 * 1000);

      const payload = {
        vertical: 'codestack',
        productName: 'codeStack',
        engine: 'codeNXT',
        eventCode: releaseCode,
        code: releaseCode,
        customerName: formData.contactName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        artistName: formData.stackName.trim(),
        stackName: formData.stackName.trim(),
        publisherName: formData.publisherName.trim(),
        releaseTitle: formData.releaseTitle.trim(),
        venue: formData.platform.trim() || 'Stack channel',
        platform: formData.platform.trim(),
        eventDate: releaseDate,
        releaseDate,
        releaseTime,
        city: '',
        audienceSize: formData.members.trim(),
        estimatedMembers: formData.members.trim(),
        comment: formData.comments.trim(),
        logoFileName: formData.logoFileName,
        stackLogo: artistLogo,
        artistLogo,
        logoTooLarge: false,
        selectedTypes: ['Stack release'],
        termsAccepted,
        shortLink: `${window.location.origin}/join/${releaseCode}`,
        bonusWindow: '24h',
        createdAt: new Date().toISOString(),
      };

      const eventRes = await fetch(`${API_BASE}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: 'codestack',
          code: releaseCode,
          name: payload.stackName,
          stackName: payload.stackName,
          publisherName: payload.publisherName,
          releaseTitle: payload.releaseTitle,
          artistLogo: payload.artistLogo || '',
          venue: payload.platform || 'Stack channel',
          platform: payload.platform,
          city: '',
          badgeConfig: { template: 'codestack' },
          startAt: unlockAt.toISOString(),
          releaseDate,
          releaseTime,
          unlockAt: unlockAt.toISOString(),
          endAt: endAt.toISOString(),
          maxClaims: Math.max(Number(payload.estimatedMembers || 0), 5000),
          status: 'active',
        }),
      });

      const rawEventResponse = await eventRes.text();
      if (!eventRes.ok) throw new Error(rawEventResponse || `Create release failed: ${eventRes.status}`);

      const eventData = rawEventResponse ? JSON.parse(rawEventResponse) : {};
      const finalEventCode = eventData?.event?.code || eventData?.code || releaseCode;
      payload.eventCode = finalEventCode;
      payload.code = finalEventCode;
      payload.shortLink = `${window.location.origin}/join/${finalEventCode}`;

      localStorage.setItem('codenxt_event', JSON.stringify(payload));
      localStorage.setItem('codenxt_active_event_code', finalEventCode);
      localStorage.setItem('codestack_latest_event', JSON.stringify(payload));

      navigate(`/dashboard?event=${finalEventCode}&lang=${lang}`, {
        state: payload,
        replace: true,
      });
    } catch (err) {
      console.error('CREATE CODESTACK RELEASE FAILED:', err);
      setError(c.submitError);
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell checkout-page">
      <header className="landing-header">
        <img src="/codestack-logo.png" alt="codeStack logo" className="landing-logo" />
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
            {c.fields.stackName} *
            <input name="stackName" value={formData.stackName} onChange={handleChange} placeholder={c.placeholders.stackName} />
            {fieldError('stackName') && <small>{text.common.required}</small>}
          </label>

          <label>
            Stack-logo (PNG/JPG) *
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoUpload}
            />
            {formData.logoFileName && <small>{formData.logoFileName}</small>}
            {logoError && <small>{logoError}</small>}
            {triedSubmit && !formData.stackLogo && <small>{text.common.required}</small>}
          </label>
          <label>
            {c.fields.publisherName} *
            <input name="publisherName" value={formData.publisherName} onChange={handleChange} placeholder={c.placeholders.publisherName} />
            {fieldError('publisherName') && <small>{text.common.required}</small>}
          </label>
          <label>
            {c.fields.releaseTitle} *
            <input name="releaseTitle" value={formData.releaseTitle} onChange={handleChange} placeholder={c.placeholders.releaseTitle} />
            {fieldError('releaseTitle') && <small>{text.common.required}</small>}
          </label>
          <label>
            {c.fields.platform} *
            <input name="platform" value={formData.platform} onChange={handleChange} placeholder={c.placeholders.platform} />
            {fieldError('platform') && <small>{text.common.required}</small>}
          </label>
          <label>
            {c.fields.releaseDate} *
            <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} />
            {fieldError('releaseDate') && <small>{text.common.required}</small>}
          </label>

          <label>
            {c.fields.releaseTime} *
            <input type="time" name="releaseTime" value={formData.releaseTime} onChange={handleChange} />
            {fieldError('releaseTime') && <small>{text.common.required}</small>}
          </label>

          <label>
            {c.fields.bonusActive} *
            <input type="text" value={c.fields.bonusActive24h} readOnly />
          </label>
          <label>
            {c.fields.members} *
            <input name="members" value={formData.members} onChange={handleChange} placeholder={c.placeholders.members} inputMode="numeric" />
            {triedSubmit && (!formData.members.trim() || Number(formData.members) <= 0) && <small>{text.common.required}</small>}
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
            {c.fields.comments} *
            <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder={c.placeholders.comments} />
            {fieldError('comments') && <small>{text.common.required}</small>}
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

        <p className="checkout-required-note">
          {{
            no: 'Alle felt må fylles ut før du kan fortsette.',
            en: 'All fields must be completed before you can continue.',
            de: 'Alle Felder müssen ausgefüllt werden, bevor du fortfahren kannst.',
            fr: 'Tous les champs doivent être remplis avant de continuer.',
            es: 'Todos los campos deben completarse antes de continuar.',
          }[lang] || 'All fields must be completed before you can continue.'}
        </p>

        <button type="button" className="primary-cta checkout-submit" disabled={!canContinue} onClick={handleContinue}>
          {submitting ? c.creating : c.continue}
        </button>
      </section>
          <style>{`
        .checkout-required-note {
          margin: 18px 0 10px;
          color: rgba(255,255,255,0.68);
          font-size: 13px;
          line-height: 1.45;
          text-align: center;
        }
      `}</style>
    </main>
  );
}
