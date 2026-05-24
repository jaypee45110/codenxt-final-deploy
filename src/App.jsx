import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import { getLang, t } from './i18n';

const CheckoutPage = lazy(() => import('./CheckoutPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const CampaignCreatedPage = lazy(() => import('./CampaignCreatedPage'));
const JoinPage = lazy(() => import('./JoinPage'));
const CertificatePage = lazy(() => import('./CertificatePage'));

function BrandHeader({ lang, setLang }) {
  const text = t(lang);

  return (
    <header className="brand-header">
      <Link to="/" className="brand-lockup" aria-label="codePerks">
        <img src="/codePerks-logo.png?v=3" alt="codePerks logo" className="brand-logo" />
        <span>{text.common.powered}</span>
      </Link>
      <LanguageSwitcher lang={lang} onChange={setLang} />
    </header>
  );
}

function HomePage({ lang, setLang }) {
  const text = t(lang);

  useEffect(() => {
    document.title = 'codePerks — Digital rewards';
  }, []);

  return (
    <main className="page-shell landing-page">
      <header className="landing-header">
        <img src="/codePerks-logo.png?v=3" alt="codePerks logo" className="landing-logo" />
        <div className="landing-powered">{text.common.powered}</div>
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <h1>{text.landing.title}</h1>
          <p className="hero-subtitle">{text.landing.subtitle}</p>
          <p className="hero-intro">{text.landing.intro}</p>
          <Link to="/checkout" className="primary-cta">
            {text.landing.cta}
          </Link>
        </div>
      </section>

      <p className="cards-kicker">{text.landing.cardsKicker}</p>
      <section className="section-grid landing-sections">
        {text.landing.sections.map((section) => (
          <article className="info-panel" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  const [lang, setLang] = useState(getLang);

  return (
    <Suspense
      fallback={
        <div className="page-shell loading-page">
          <div>{t(lang).common.loading}</div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage lang={lang} setLang={setLang} />} />
        <Route path="/checkout" element={<CheckoutPage lang={lang} setLang={setLang} />} />
        <Route path="/campaign-created" element={<CampaignCreatedPage lang={lang} setLang={setLang} />} />
        <Route path="/dashboard" element={<DashboardPage lang={lang} setLang={setLang} />} />
        <Route path="/join/:eventCode" element={<JoinPage lang={lang} setLang={setLang} />} />
        <Route path="/certificate/:eventCode/:certificateId" element={<CertificatePage lang={lang} setLang={setLang} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
