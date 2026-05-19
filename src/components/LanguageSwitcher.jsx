import React from 'react';
import { LANGUAGES, setLang } from '../i18n';

export default function LanguageSwitcher({ lang, onChange }) {
  const change = (code) => {
    const next = setLang(code);
    if (typeof onChange === 'function') onChange(next);
  };

  return (
    <div
      className="language-switcher"
      aria-label="Language switcher"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        position: 'relative',
        zIndex: 999999,
        pointerEvents: 'auto',
      }}
    >
      {LANGUAGES.map((language) => (
        <button
          type="button"
          key={language.code}
          data-lang-code={language.code}
          className={`flag-button ${lang === language.code ? 'is-active' : ''}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            change(language.code);
          }}
          title={language.label}
          aria-label={language.label}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '999px',
            border: lang === language.code ? '1px solid rgba(0,230,255,0.9)' : '1px solid rgba(255,255,255,0.18)',
            background: lang === language.code ? 'rgba(0,230,255,0.14)' : 'rgba(0,0,0,0.28)',
            cursor: 'pointer',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1000000,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            padding: 0,
            boxShadow: lang === language.code ? '0 0 12px rgba(0,230,255,0.55)' : 'none',
          }}
        >
          {language.flag}
        </button>
      ))}
    </div>
  );
}
