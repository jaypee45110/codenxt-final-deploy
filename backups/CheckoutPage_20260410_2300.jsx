import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();

  const [showEventModal, setShowEventModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoTooLarge, setLogoTooLarge] = useState(false);
const [lang, setLang] = useState('en');
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    artistOrEvent: '',
    venue: '',
    eventDate: '',
    city: '',
    audienceSize: '',
    comment: '',
    logoFileName: '',
  });

  const eventTypes = [
    'Festival',
    'Concert',
    'Club Event',
    'Private Event',
    'Brand Activation',
    'Corporate Event',
    'Tour Date',
    'Other',
  ];

const languages = [
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'no', flag: '🇳🇴', label: 'NO' },
  { code: 'sv', flag: '🇸🇪', label: 'SV' },
  { code: 'de', flag: '🇩🇪', label: 'DE' },
  { code: 'th', flag: '🇹🇭', label: 'TH' },
];

const copy = {
  en: {
    eyebrow: 'Checkout',
    title: 'Set up your Control Center',
    subtitle:
      'Complete the order setup, choose arrangement type, review terms, and proceed to your dashboard.',
  },
  no: {
    eyebrow: 'Checkout',
    title: 'Sett opp ditt Control Center',
    subtitle:
      'Fullfør bestillingsoppsettet, velg arrangementstype, se gjennom vilkår og gå videre til dashboardet.',
  },
  sv: {
    eyebrow: 'Checkout',
    title: 'Sätt upp ditt Control Center',
    subtitle:
      'Slutför orderupplägget, välj arrangemangstyp, granska villkor och gå vidare till din dashboard.',
  },
  de: {
    eyebrow: 'Checkout',
    title: 'Richte dein Control Center ein',
    subtitle:
      'Schließe das Bestell-Setup ab, wähle den Eventtyp, prüfe die Bedingungen und gehe weiter zu deinem Dashboard.',
  },
  th: {
    eyebrow: 'Checkout',
    title: 'Checkout',
    subtitle:
      'กรอกข้อมูลการสั่งซื้อ เลือกประเภทงาน ตรวจสอบเงื่อนไข และไปต่อยังแดชบอร์ดของคุณ',
  },
};

const text = copy[lang];

  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const isValidType =
      file.type === 'image/png' || file.type === 'image/jpeg';

    if (!isValidType) {
      alert('Only JPG and PNG files are allowed.');
      return;
    }

    const maxSize = 900 * 1024;
    if (file.size > maxSize) {
      setLogoTooLarge(true);
    } else {
      setLogoTooLarge(false);
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(typeof reader.result === 'string' ? reader.result : '');
      setFormData((prev) => ({
        ...prev,
        logoFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const requiredFieldsMissing = useMemo(() => {
    return (
      !formData.customerName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    );
  }, [formData]);

  const canContinue = !requiredFieldsMissing && termsAccepted;

  const generateEventCode = () => {
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    return `CT-${randomPart}`;
  };

  const handleContinue = () => {
    setTriedSubmit(true);

    if (!canContinue) return;

    const eventCode = generateEventCode();

    const payload = {
      customerName: formData.customerName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      artistName: formData.artistOrEvent.trim() || 'Artist / Event Name',
      venue: formData.venue.trim() || 'Venue Name',
      city: formData.city.trim() || 'City',
      eventDate: formData.eventDate || '2026-07-02',
      audienceSize: formData.audienceSize.trim() || 'Estimated audience',
      comment: formData.comment.trim(),
      logoFileName: formData.logoFileName,
      artistLogo: logoTooLarge ? '' : logoPreview || '',
      logoTooLarge,
      selectedTypes,
      paymentMethod,
      termsAccepted,
      eventCode,
      shortLink: `codetone.codenxt.global/join/${eventCode}`,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('codenxt_event', JSON.stringify(payload));
    } catch (error) {
      console.error('Could not save event locally:', error);
      const fallbackPayload = { ...payload, artistLogo: '', logoTooLarge: true };
      try {
        localStorage.setItem('codenxt_event', JSON.stringify(fallbackPayload));
      } catch (innerError) {
        console.error('Fallback save also failed:', innerError);
      }
    }

    navigate('/dashboard', { state: payload });
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <div style={styles.container}>
 
<div style={styles.flagBar}>
  {languages.map((item) => (
    <button
      key={item.code}
      type="button"
      onClick={() => setLang(item.code)}
      style={{
        ...styles.flagButton,
        ...(lang === item.code ? styles.flagButtonActive : {}),
      }}
    >
      <span style={styles.flagIcon}>{item.flag}</span>
      <span>{item.label}</span>
    </button>
  ))}
</div>
        <header style={styles.header}>
          <img
            src="/codetone-logo.webp"
            alt="codeTone logo"
            style={styles.logo}
          />
        </header>

        <div style={styles.heroBlock}>
          <div style={{ color: '#ffcc8f', fontSize: '12px', marginBottom: '10px' }}>
  eventModal: {String(showEventModal)} | termsModal: {String(showTermsModal)}
</div>
          <div style={styles.eyebrow}>CHECKOUT-DEBUG-123</div>
<h1 style={styles.title}>{text.title}</h1>
<p style={styles.subtitle}>{text.subtitle}</p>
        </div>

        <div style={styles.contentGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Customer information</div>

              <div style={styles.fieldBlock}>
                <label style={styles.label}>Name of customer *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Full name"
                  style={styles.input}
                />
                {triedSubmit && !formData.customerName.trim() && (
                  <div style={styles.errorText}>This field is required.</div>
                )}
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  style={styles.input}
                />
                {triedSubmit && !formData.email.trim() && (
                  <div style={styles.errorText}>This field is required.</div>
                )}
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.label}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+47 900 00 000"
                  style={styles.input}
                />
                {triedSubmit && !formData.phone.trim() && (
                  <div style={styles.errorText}>This field is required.</div>
                )}
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>Event details</div>

              <div style={styles.twoCol}>
                <div style={styles.fieldBlock}>
                  <label style={styles.label}>Artist / Event</label>
                  <input
                    type="text"
                    name="artistOrEvent"
                    value={formData.artistOrEvent}
                    onChange={handleChange}
                    placeholder="Artist or event name"
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldBlock}>
                  <label style={styles.label}>Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Venue"
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldBlock}>
                  <label style={styles.label}>Event date</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldBlock}>
                  <label style={styles.label}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    style={styles.input}
                  />
                </div>

                <div style={{ ...styles.fieldBlock, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Expected audience</label>
                  <input
                    type="text"
                    name="audienceSize"
                    value={formData.audienceSize}
                    onChange={handleChange}
                    placeholder="Estimated attendance"
                    style={styles.input}
                  />
                </div>

                <div style={{ ...styles.fieldBlock, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Comments</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Optional notes"
                    style={styles.textarea}
                  />
                </div>

                <div style={{ ...styles.fieldBlock, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>
                    Upload logo / image (optional)
                  </label>

                  <div style={styles.uploadWrap}>
                    <label style={styles.uploadButton}>
                      Choose JPG or PNG
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleLogoUpload}
                        style={styles.hiddenFileInput}
                      />
                    </label>

                    <div style={styles.uploadInfo}>
                      {formData.logoFileName
                        ? `Selected file: ${formData.logoFileName}`
                        : 'No file selected'}
                    </div>

                    {logoTooLarge ? (
                      <div style={styles.warningText}>
                        The image is large. The logo may be skipped in storage,
                        but the rest of the event data will still follow through.
                      </div>
                    ) : null}
                  </div>

                  {logoPreview && (
                    <div style={styles.previewBox}>
                      <img
                        src={logoPreview}
                        alt="Uploaded preview"
                        style={styles.previewImage}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Arrangement type</div>
              <p style={styles.cardText}>
                Select one or more types of arrangement.
              </p>

              <button
                type="button"
                onClick={() => setShowEventModal(true)}
                style={styles.primaryAction}
              >
                Choose arrangement type
              </button>

              <div style={styles.selectedWrap}>
                {selectedTypes.length > 0 ? (
                  selectedTypes.map((type) => (
                    <span key={type} style={styles.badge}>
                      {type}
                    </span>
                  ))
                ) : (
                  <span style={styles.mutedNote}>No type selected yet.</span>
                )}
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>Simulated payment</div>
              <p style={styles.cardText}>
                This is a visual placeholder for the payment step.
              </p>

              <div style={styles.paymentWrap}>
                <label
                  style={{
                    ...styles.paymentOption,
                    borderColor:
                      paymentMethod === 'card'
                        ? '#00f0ff'
                        : 'rgba(255,255,255,0.10)',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    style={styles.radio}
                  />
                  <span>Card</span>
                </label>

                <label
                  style={{
                    ...styles.paymentOption,
                    borderColor:
                      paymentMethod === 'stripe'
                        ? '#00f0ff'
                        : 'rgba(255,255,255,0.10)',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                    style={styles.radio}
                  />
                  <span>Stripe</span>
                </label>
              </div>

              <div style={styles.fakePaymentBox}>
                <div style={styles.fakePaymentTitle}>
                  {paymentMethod === 'card'
                    ? 'Simulated card payment'
                    : 'Simulated Stripe payment'}
                </div>
                <div style={styles.fakePaymentText}>
                  Payment is not processed yet. This step only simulates the
                  payment flow in the frontend.
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>Terms and Conditions</div>
              <p style={styles.cardText}>
                The customer must review and accept before continuing.
              </p>

              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                style={styles.secondaryAction}
              >
                Open Terms and Conditions
              </button>

              <div
                style={{
                  ...styles.termsStatus,
                  color: termsAccepted ? '#79ffb0' : '#ffb36b',
                }}
              >
                {termsAccepted ? 'Accepted' : 'Not accepted yet'}
              </div>

              {triedSubmit && !termsAccepted && (
                <div style={styles.errorText}>
                  You must accept the Terms and Conditions before continuing.
                </div>
              )}
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>Next step</div>
              <p style={styles.cardText}>
                This now sends event data directly into the dashboard and also
                tries to keep a browser copy as backup.
              </p>

              <button
                type="button"
                onClick={handleContinue}
                style={{
                  ...styles.dashboardButton,
                  opacity: canContinue ? 1 : 0.55,
                  cursor: canContinue ? 'pointer' : 'not-allowed',
                }}
              >
                Open dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEventModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBoxLarge}>
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalEyebrow}>Arrangement type</div>
                <h2 style={styles.modalTitle}>Select type of arrangement</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div style={styles.checkboxGrid}>
              {eventTypes.map((type) => (
                <label key={type} style={styles.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    style={styles.checkbox}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setSelectedTypes([])}
                style={styles.modalSecondaryButton}
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                style={styles.modalPrimaryButton}
              >
                Save selection
              </button>
            </div>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBoxTerms}>
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalEyebrow}>Terms</div>
                <h2 style={styles.modalTitle}>Terms and Conditions</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div style={styles.termsContent}>
              <p style={styles.termsParagraph}>
                These Terms and Conditions govern the customer’s access to and
                use of the codeTone / codeNXT Control Center and related digital
                event services.
              </p>

              <p style={styles.termsParagraph}>
                By selecting “Accept”, the customer confirms that they are
                authorized to place the order on behalf of themselves or the
                relevant artist, venue, promoter, brand, or event organizer.
              </p>

              <p style={styles.termsParagraph}>
                The service is provided as a digital event operations tool for
                campaign setup, QR-driven access, audience interaction, reporting,
                and related activation workflows.
              </p>

              <p style={styles.termsParagraph}>
                By selecting “Accept”, the customer confirms that they have read,
                understood, and agreed to these Terms and Conditions and consent
                to electronic presentation of these terms as part of the checkout
                flow.
              </p>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(false);
                  setShowTermsModal(false);
                }}
                style={styles.modalSecondaryButton}
              >
                Not Accept
              </button>

              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                style={styles.modalPrimaryButton}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top left, rgba(0,240,255,0.12), transparent 25%), radial-gradient(circle at bottom right, rgba(0,120,255,0.10), transparent 24%), #070707',
    color: '#ffffff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Helvetica, Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  glowOne: {
    position: 'absolute',
    top: '-120px',
    left: '-80px',
    width: '360px',
    height: '360px',
    borderRadius: '50%',
    background: 'rgba(0,240,255,0.10)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  glowTwo: {
    position: 'absolute',
    bottom: '-160px',
    right: '-100px',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    background: 'rgba(37,99,235,0.14)',
    filter: 'blur(100px)',
    pointerEvents: 'none',
  },
  container: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1360px',
    margin: '0 auto',
    padding: '32px 24px 80px',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '10px',
    paddingBottom: '16px',
  },
  logo: {
    height: '180px',
    width: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 20px 40px rgba(0,240,255,0.15))',
  },
  heroBlock: {
    textAlign: 'center',
    maxWidth: '860px',
    margin: '0 auto 34px',
  },
  eyebrow: {
    display: 'inline-block',
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#9ddcff',
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '58px',
    lineHeight: 1,
    letterSpacing: '-0.04em',
    marginBottom: '14px',
  },
  subtitle: {
    margin: '0 auto',
    maxWidth: '760px',
    color: 'rgba(255,255,255,0.70)',
    fontSize: '18px',
    lineHeight: 1.6,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '24px',
    alignItems: 'start',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.30)',
    backdropFilter: 'blur(12px)',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
  cardText: {
    margin: 0,
    color: 'rgba(255,255,255,0.68)',
    fontSize: '15px',
    lineHeight: 1.6,
  },
  fieldBlock: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.82)',
  },
  input: {
    width: '100%',
    height: '52px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    padding: '0 14px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    padding: '14px',
    fontSize: '15px',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  uploadWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
  },
  uploadButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '220px',
    height: '48px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  },
  hiddenFileInput: {
    display: 'none',
  },
  uploadInfo: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  warningText: {
    color: '#ffcc8f',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  previewBox: {
    marginTop: '14px',
    padding: '14px',
    borderRadius: '16px',
    background: 'rgba(0,0,0,0.22)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    maxWidth: '220px',
    maxHeight: '120px',
    width: 'auto',
    height: 'auto',
    borderRadius: '10px',
    display: 'block',
  },
  primaryAction: {
    width: '100%',
    height: '52px',
    border: 'none',
    borderRadius: '16px',
    background: '#00f0ff',
    color: '#000',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '14px',
  },
  secondaryAction: {
    width: '100%',
    height: '50px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '14px',
  },
  selectedWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '16px',
  },
  badge: {
    display: 'inline-flex',
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(0,240,255,0.12)',
    border: '1px solid rgba(0,240,255,0.20)',
    color: '#8ff7ff',
    fontSize: '13px',
  },
  mutedNote: {
    color: 'rgba(255,255,255,0.56)',
    fontSize: '14px',
    marginTop: '4px',
  },
  paymentWrap: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '16px',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.04)',
    cursor: 'pointer',
  },
  radio: {
    width: '16px',
    height: '16px',
  },
  fakePaymentBox: {
    marginTop: '16px',
    padding: '16px',
    borderRadius: '18px',
    background: 'rgba(0,0,0,0.22)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  fakePaymentTitle: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '8px',
  },
  fakePaymentText: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  termsStatus: {
    marginTop: '14px',
    fontSize: '14px',
    fontWeight: 600,
  },
  dashboardButton: {
    width: '100%',
    height: '56px',
    border: 'none',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #00f0ff 0%, #3978ff 100%)',
    color: '#000',
    fontSize: '17px',
    fontWeight: 800,
    marginTop: '16px',
  },
  errorText: {
    marginTop: '8px',
    color: '#ff8d8d',
    fontSize: '13px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.78)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 999,
  },
  modalBoxLarge: {
    width: '100%',
    maxWidth: '760px',
    background: '#101010',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '24px',
    padding: '26px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
  },
  modalBoxTerms: {
    width: '100%',
    maxWidth: '900px',
    maxHeight: '86vh',
    overflowY: 'auto',
    background: '#101010',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '24px',
    padding: '26px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    marginBottom: '18px',
  },
  modalEyebrow: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#9ddcff',
    marginBottom: '8px',
  },
  modalTitle: {
    margin: 0,
    fontSize: '32px',
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
  },
  closeButton: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px',
    marginTop: '10px',
  },
  checkboxCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.04)',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
  },
  termsContent: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '18px 0',
    marginTop: '6px',
  },
  termsParagraph: {
    marginTop: 0,
    marginBottom: '16px',
    color: 'rgba(255,255,255,0.80)',
    lineHeight: 1.7,
    fontSize: '15px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '14px',
    marginTop: '22px',
  },
  modalPrimaryButton: {
    height: '50px',
    padding: '0 20px',
    borderRadius: '14px',
    border: 'none',
    background: '#00f0ff',
    color: '#000',
    fontWeight: 700,
    cursor: 'pointer',
  },
  modalSecondaryButton: {
    height: '50px',
    padding: '0 20px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
};